import React from "react";

interface PdfDocumentProps {
  firstName: string;
  lastName: string;
  memberId: string;
  userId: string;
  phone: string;
  birthDate?: string;
  gender?: string;
  patrol?: string;
  role?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  homePhone?: string;
  guardianRelationship?: string;
  additionalPhones?: string[];
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  (
    {
      firstName,
      lastName,
      memberId,
      userId,
      phone,
      birthDate,
      gender,
      patrol,
      role,
      guardianFirstName,
      guardianLastName,
      guardianPhone,
      homePhone,
      guardianRelationship,
      additionalPhones = [],
    },
    ref
  ) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // QR code data - compact but complete
    const qrData = [
      `${firstName} ${lastName}`,
      `ID: ${memberId}`,
      `UID: ${userId}`,
      guardianFirstName && guardianLastName ? `${guardianFirstName} ${guardianLastName}` : "",
      guardianPhone ? `T: ${guardianPhone}` : "",
      homePhone ? `H: ${homePhone}` : "",
      phone ? `P: ${phone}` : "",
      ...additionalPhones,
    ]
      .filter(Boolean)
      .join(" | ");

    return (
      <div
        ref={ref}
        dir="rtl"
        className="w-full bg-white p-8 text-gray-900"
        style={{
          fontFamily: "'Arial', 'Segoe UI', sans-serif",
          lineHeight: "1.6",
          color: "#000000",
          backgroundColor: "#ffffff",
          // Use only HEX colors - NO oklch, oklab, or css functions
        }}
      >
        {/* Header */}
        <div
          className="text-center mb-6 pb-4 border-b-2"
          style={{ borderColor: "#dc2626" }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#dc2626",
              margin: "0 0 8px 0",
              fontFamily: "'Times New Roman', serif",
            }}
          >
            الكشافة الحسنية صفي
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666666",
              margin: "0",
            }}
          >
            شهادة تأكيد الحساب
          </p>
        </div>

        {/* Member Info Section */}
        <div
          className="mb-6 p-4 rounded"
          style={{
            backgroundColor: "#f3f4f6",
            borderRight: "4px solid #dc2626",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            معلومات العضو
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            {/* Full Name */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                الاسم الكامل
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {firstName} {lastName}
              </p>
            </div>

            {/* Member ID */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                رقم العضو
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#dc2626",
                  margin: "0",
                  fontSize: "14px",
                }}
              >
                {memberId}
              </p>
            </div>

            {/* User ID */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                معرف المستخدم
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {userId}
              </p>
            </div>

            {/* Phone */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                الهاتف الشخصي
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {phone}
              </p>
            </div>

            {/* Birth Date */}
            {birthDate && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "11px",
                    margin: "0 0 4px 0",
                  }}
                >
                  تاريخ الميلاد
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {birthDate}
                </p>
              </div>
            )}

            {/* Gender */}
            {gender && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "11px",
                    margin: "0 0 4px 0",
                  }}
                >
                  الجنس
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {gender === "male" ? "ذكر" : "أنثى"}
                </p>
              </div>
            )}

            {/* Patrol */}
            {patrol && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "11px",
                    margin: "0 0 4px 0",
                  }}
                >
                  الفريق
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {patrol}
                </p>
              </div>
            )}

            {/* Role */}
            {role && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "11px",
                    margin: "0 0 4px 0",
                  }}
                >
                  الدور
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guardian Info Section */}
        {(guardianFirstName || guardianLastName) && (
          <div
            className="mb-6 p-4 rounded"
            style={{
              backgroundColor: "#f3f4f6",
              borderRight: "4px solid #7c3aed",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              معلومات الولي
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "13px",
              }}
            >
              {/* Guardian Name */}
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "11px",
                    margin: "0 0 4px 0",
                  }}
                >
                  اسم الولي
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {guardianFirstName} {guardianLastName}
                </p>
              </div>

              {/* Guardian Relationship */}
              {guardianRelationship && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "11px",
                      margin: "0 0 4px 0",
                    }}
                  >
                    الصفة
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {guardianRelationship}
                  </p>
                </div>
              )}

              {/* Guardian Phone */}
              {guardianPhone && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "11px",
                      margin: "0 0 4px 0",
                    }}
                  >
                    هاتف الولي
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {guardianPhone}
                  </p>
                </div>
              )}

              {/* Home Phone */}
              {homePhone && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "11px",
                      margin: "0 0 4px 0",
                    }}
                  >
                    الهاتف الثابت
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {homePhone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Contacts */}
        {additionalPhones.length > 0 && (
          <div
            className="mb-6 p-4 rounded"
            style={{
              backgroundColor: "#f3f4f6",
              borderRight: "4px solid #2563eb",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              جهات الاتصال الإضافية
            </h2>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#1f2937",
                wordBreak: "break-word",
              }}
            >
              {additionalPhones.join(" | ")}
            </p>
          </div>
        )}

        {/* QR Code Data Info */}
        <div
          className="mb-6 p-4 rounded"
          style={{
            backgroundColor: "#f3f4f6",
            borderRight: "4px solid #059669",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            بيانات رمز الاستجابة السريعة
          </h2>
          <p
            style={{
              margin: "0",
              fontSize: "11px",
              color: "#666666",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {qrData}
          </p>
        </div>

        {/* Footer */}
        <div
          className="border-t-2 pt-4 text-center"
          style={{
            borderColor: "#dc2626",
            fontSize: "11px",
            color: "#666666",
          }}
        >
          <p style={{ margin: "4px 0" }}>
            تاريخ الإنشاء: {formattedDate}
          </p>
          <p style={{ margin: "4px 0" }}>
            © 2026 الكشافة الحسنية صفي - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
