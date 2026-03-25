import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

interface LogEntry {
  timestamp: string;
  type: "info" | "success" | "error" | "debug";
  message: string;
  details?: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testMessage, setTestMessage] = useState("اختبار الرسالة 🎉");
  const [recipientPhone, setRecipientPhone] = useState("whatsapp:+");
  const [loading, setLoading] = useState(false);

  const addLog = (
    type: LogEntry["type"],
    message: string,
    details?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString("ar-MA");
    setLogs((prev) => [
      { timestamp, type, message, details },
      ...prev,
    ]);
  };

  const analyzeMessageCharByChar = (message: string) => {
    addLog("debug", "📊 تحليل الرسالة حرف بحرف:");
    let charAnalysis = "";
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const code = char.charCodeAt(0);
      charAnalysis += `[${i + 1}] "${char}" (Unicode: ${code})\n`;
    }
    addLog("debug", "تفاصيل الأحرف:", charAnalysis);
  };

  const handleTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testMessage.trim()) {
      toast.error("الرسالة فارغة");
      return;
    }

    if (!recipientPhone.includes("+")) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }

    setLoading(true);
    addLog("info", "🚀 بدء إرسال الرسالة...");
    addLog("info", `📱 المستقبل: ${recipientPhone}`);
    addLog("info", `💬 الرسالة: ${testMessage}`);
    addLog("info", `📏 طول الرسالة: ${testMessage.length} حرف`);

    // Analyze message char by char
    analyzeMessageCharByChar(testMessage);

    try {
      addLog("debug", "🔄 إرسال الطلب إلى الخادم...");

      const response = await fetch("/api/whatsapp/test-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testMessage,
          to: recipientPhone,
          analyzeChars: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        addLog(
          "error",
          "❌ فشل الإرسال",
          JSON.stringify(data, null, 2)
        );
        toast.error(`خطأ: ${data.error}`);
      } else {
        addLog("success", "✅ تم إرسال الرسالة بنجاح!");
        addLog("success", `📨 معرّف الرسالة: ${data.messageSid}`);
        if (data.charAnalysis) {
          addLog("debug", "تفاصيل التحليل:", data.charAnalysis);
        }
        toast.success("تم إرسال الرسالة!");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "خطأ غير معروف";
      addLog("error", "❌ خطأ في الاتصال:", errorMsg);
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    toast.success("تم حذف السجلات");
  };

  const downloadLogs = () => {
    const logsText = logs
      .map((log) => `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}\n${log.details ? log.details + "\n" : ""}`)
      .join("\n");

    const blob = new Blob([logsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `twilio-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout currentPage="dashboard">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-scout-purple mb-2">
          لوحة التحكم
        </h1>
        <p className="text-gray-600">
          اختبر نظام الرسائل عبر Twilio/WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
            <h2 className="text-xl font-bold mb-4">📨 إرسال رسالة اختبار</h2>

            <form onSubmit={handleTestMessage} className="space-y-4">
              {/* Recipient Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  رقم الهاتف WhatsApp
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="whatsapp:+212612345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  الصيغة: whatsapp:+country_code + number
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  الرسالة ({testMessage.length} حرف)
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="اكتب رسالة اختبار..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    إرسال
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Logs Panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg shadow-md p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">📋 السجلات</h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadLogs}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  title="تحميل السجلات"
                >
                  💾 تحميل
                </button>
                <button
                  onClick={clearLogs}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  title="حذف السجلات"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  لا توجد سجلات حالياً
                </div>
              ) : (
                logs.map((log, idx) => {
                  const colors = {
                    info: "text-blue-400",
                    success: "text-green-400",
                    error: "text-red-400",
                    debug: "text-yellow-400",
                  };

                  return (
                    <div key={idx} className={colors[log.type]}>
                      <div>
                        <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                        {log.message}
                      </div>
                      {log.details && (
                        <div className="text-gray-400 text-xs ml-4 whitespace-pre-wrap break-words">
                          {log.details}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          <strong>💡 نصيحة:</strong> استخدم هذا الاختبار للتحقق من صحة إعدادات Twilio.
          السجلات ستظهر تحليلاً حرف بحرف لكل رسالة مرسلة.
        </p>
      </div>
    </Layout>
  );
}
