import React from "react";

interface DigitalStampProps {
  className?: string;
  size?: number; // px size of the square stamp
  companyNameAr?: string;
  companyNameEn?: string;
  crNumber?: string; // السجل التجاري
  vatNumber?: string; // الرقم الضريبي
  city?: string;
  contractNumber?: string;
  date?: string | Date; // defaults to today (ar-SA)
  status?: "approved" | "preview"; // preview = غير معتمد
}

// Digital, compliant-style company stamp (Saudi Arabia) with bilingual labels
// - Shows Company (AR/EN), CR, VAT, City, Date, (optional) Contract No.
// - Vector SVG so it prints crisply in PDFs
const DigitalStamp: React.FC<DigitalStampProps> = ({
  className = "",
  size = 140,
  companyNameAr = "شركة علي صالح الشهري القابضة",
  companyNameEn = "Alsaleh Holding Company",
  crNumber,
  vatNumber,
  city,
  contractNumber,
  date,
  status = "approved",
}) => {
  const formattedDate = React.useMemo(() => {
    if (!date) return new Date().toLocaleDateString("ar-SA");
    return typeof date === "string"
      ? new Date(date).toLocaleDateString("ar-SA")
      : new Date(date).toLocaleDateString("ar-SA");
  }, [date]);

  // SVG coordinated for a 240x240 viewBox
  // Using currentColor so parent can set color (e.g., text-primary)
  return (
    <div className={`relative ${className}`} aria-label="الختم الرقمي">
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary/80"
        role="img"
      >
        {/* Outer ring */}
        <circle cx="120" cy="120" r="112" fill="none" stroke="currentColor" strokeWidth="4" />
        {/* Middle ring */}
        <circle cx="120" cy="120" r="95" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Inner ring */}
        <circle cx="120" cy="120" r="78" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* Top arc (Company AR) */}
        <path id="topArc" d="M 35 120 A 85 85 0 0 1 205 120" fill="none" />
        <text fontSize="12" fontWeight="700" fill="currentColor" textAnchor="middle" direction="rtl">
          <textPath href="#topArc" startOffset="50%">{companyNameAr}</textPath>
        </text>

        {/* Bottom arc (Company EN) */}
        <path id="bottomArc" d="M 205 120 A 85 85 0 0 1 35 120" fill="none" />
        <text fontSize="11" fill="currentColor" textAnchor="middle">
          <textPath href="#bottomArc" startOffset="50%">{companyNameEn}</textPath>
        </text>

        {/* Center headline */}
        <text x="120" y="105" textAnchor="middle" fontSize="16" fontWeight="800" fill="currentColor" direction="rtl">
          {status === "approved" ? "ختم إلكتروني" : "غير معتمد"}
        </text>
        <text x="120" y="122" textAnchor="middle" fontSize="10" fill="currentColor">
          {status === "approved" ? "Digital E-Stamp" : "Not Approved"}
        </text>

        {/* CR and VAT lines (inside circle) */}
        <>
          <text x="120" y="142" textAnchor="middle" fontSize="10" fill="currentColor" direction="rtl">
            {crNumber ? `السجل التجاري: ${crNumber}` : "السجل التجاري: —"}
          </text>
          <text x="120" y="158" textAnchor="middle" fontSize="10" fill="currentColor" direction="rtl">
            {vatNumber ? `الرقم الضريبي: ${vatNumber}` : "الرقم الضريبي: —"}
          </text>
        </>
        {/* City / Date / Contract No. */}
        <text x="120" y="176" textAnchor="middle" fontSize="9" fill="currentColor" direction="rtl">
          {city ? `${city} • المملكة العربية السعودية` : "المملكة العربية السعودية"}
        </text>
        <text x="120" y="192" textAnchor="middle" fontSize="9" fill="currentColor" direction="rtl">
          {contractNumber ? `رقم العقد: ${contractNumber} • التاريخ: ${formattedDate}` : `التاريخ: ${formattedDate}`}
        </text>

        {/* Preview diagonal ribbon if not approved */}
        {status === "preview" && (
          <g opacity="0.18">
            <rect x="-20" y="108" width="280" height="24" fill="currentColor" transform="rotate(-20 120 120)" rx="4" />
            <text x="120" y="124" textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff" transform="rotate(-20 120 120)">
              غير معتمد إلا بعد الدفع
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default DigitalStamp;
