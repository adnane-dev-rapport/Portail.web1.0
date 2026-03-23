import { RequestHandler } from "express";

/**
 * Send registration data to admin via WhatsApp
 * Uses Twilio WhatsApp API
 */
export const handleSendRegistrationWhatsApp: RequestHandler = async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: "No form data provided" });
    }

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const adminWhatsApp = process.env.ADMIN_WHATSAPP;

    if (!twilioAccountSid || !twilioAuthToken || !fromNumber || !adminWhatsApp) {
      return res.status(500).json({ error: "Twilio configuration missing" });
    }

    // Build WhatsApp message with registration data
    const message = formatRegistrationMessage(formData);

    // Send via Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString(
            "base64"
          )}`,
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: adminWhatsApp,
          Body: message,
        }).toString(),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio error:", error);
      return res.status(500).json({ error: "Failed to send WhatsApp message" });
    }

    const data = await response.json();
    res.json({ success: true, messageId: (data as any).sid });
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handle incoming WhatsApp ideas
 */
export const handleIncomingIdea: RequestHandler = async (req, res) => {
  try {
    console.log("=== INCOMING WHATSAPP MESSAGE ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);

    // Extract From and Body - handle different Twilio formats
    const from = req.body.From || req.body.from || req.body.WaId;
    const body = req.body.Body || req.body.body || req.body.Message;

    console.log(`Processing message - From: ${from}, Body: ${body}`);

    // Acknowledge receipt immediately (Twilio expects this)
    res.status(200).send("");

    if (!from || !body) {
      console.error("Invalid WhatsApp message - missing From or Body");
      return;
    }

    console.log(`✓ New idea received from ${from}: ${body}`);

    // Save idea to Supabase (as anonymous WhatsApp submission)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Create a system user ID for WhatsApp ideas
    const whatsappUserId = "00000000-0000-0000-0000-000000000000";

    const { data, error: saveError } = await supabase.from("ideas").insert({
      created_by: whatsappUserId,
      title: `💭 فكرة من WhatsApp`,
      description: body,
      contact_info: from,
      status: "submitted",
    }).select();

    if (saveError) {
      console.error("❌ Error saving idea to Supabase:", saveError);
    } else {
      console.log("✓ Idea saved successfully:", data);
    }

    // Send confirmation message
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (twilioAccountSid && twilioAuthToken && fromNumber) {
      console.log(`Sending confirmation message from ${fromNumber} to ${from}`);

      const confirmRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${twilioAccountSid}:${twilioAuthToken}`
            ).toString("base64")}`,
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: from,
            Body: "شكراً على فكرتك! تم استقبال اقتراحك بنجاح.\nThank you for your idea! Your suggestion has been received.",
          }).toString(),
        }
      );

      if (confirmRes.ok) {
        console.log("✓ Confirmation message sent successfully");
      } else {
        console.error("❌ Failed to send confirmation:", await confirmRes.text());
      }
    }
  } catch (error) {
    console.error("❌ Error handling incoming idea:", error);
    res.status(500).send("Error");
  }
};

/**
 * Format registration data into WhatsApp message
 */
function formatRegistrationMessage(formData: any): string {
  const lines = [
    "🎉 تسجيل عضو جديد | New Registration",
    "━━━━━━━━━━━━━━━━━━━━━",
    "",
    "👤 الاسم | Name:",
    `${formData.firstName} ${formData.lastName}`,
    "",
    "📱 الهاتف | Phone:",
    formData.userPhone || "N/A",
    "",
    "📅 تاريخ الميلاد | Birth Date:",
    formData.birthDate || "N/A",
    "",
    "⚧ الجنس | Gender:",
    formData.gender === "male" ? "ذكر | Male" : "أنثى | Female",
    "",
    "🎖️ الفريق | Patrol:",
    formData.patrol || "N/A",
    "",
    "👔 الدور | Role:",
    formData.role || "N/A",
    "",
    "👨‍👩‍👧 الولي | Guardian:",
    `${formData.guardianFirstName} ${formData.guardianLastName}`,
    "",
    "🔗 الصفة | Relationship:",
    formData.guardianRelationship || "N/A",
    "",
    "📞 هاتف الأب | Father Phone:",
    formData.fatherPhone || "N/A",
    "",
    "📞 هاتف الأم | Mother Phone:",
    formData.motherPhone || "N/A",
    "",
    "📞 هاتف المنزل | Home Phone:",
    formData.homePhone || "N/A",
    "",
    "📝 ملاحظات | Notes:",
    formData.additionalInfo || "N/A",
    "",
    "━━━━━━━━━━━━━━━━━━━━━",
    "✅ تم التسجيل بنجاح",
  ];

  return lines.join("\n");
}
