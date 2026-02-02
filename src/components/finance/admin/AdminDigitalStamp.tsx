/**
 * Admin Digital Stamp - ختم الإدارة الرقمي
 * Official stamp for admin-approved documents
 */

import { cn } from "@/lib/utils";

interface AdminDigitalStampProps {
  adminName?: string;
  approvalDate?: string;
  stampId?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AdminDigitalStamp({
  adminName = "مدير التمويل الداخلي",
  approvalDate,
  stampId,
  size = "md",
  className,
}: AdminDigitalStampProps) {
  const sizeClasses = {
    sm: "w-24 h-24 text-[8px]",
    md: "w-32 h-32 text-[10px]",
    lg: "w-40 h-40 text-xs",
  };

  const formattedDate = approvalDate
    ? new Date(approvalDate).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : new Date().toLocaleDateString("ar-SA");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      dir="rtl"
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-[3px] border-emerald-600/80" />
      
      {/* Inner ring */}
      <div className="absolute inset-2 rounded-full border-2 border-emerald-600/60" />
      
      {/* Content */}
      <div className="absolute inset-4 rounded-full bg-emerald-50/50 flex flex-col items-center justify-center text-center p-2">
        {/* Company name - top curve text effect */}
        <div className="text-emerald-800 font-bold leading-tight text-[8px]">
          شركة علي صالح الشهري القابضة
        </div>
        
        {/* Approval text */}
        <div className="text-emerald-700 font-semibold mt-1">
          ✓ تمت الموافقة
        </div>
        
        {/* Admin name */}
        <div className="text-emerald-600 mt-1 truncate max-w-full px-1">
          {adminName}
        </div>
        
        {/* Date */}
        <div className="text-emerald-500 mt-0.5">
          {formattedDate}
        </div>
        
        {/* Stamp ID */}
        {stampId && (
          <div className="text-emerald-400 font-mono text-[7px] mt-0.5">
            #{stampId.slice(0, 8)}
          </div>
        )}
      </div>
      
      {/* Decorative stars */}
      <div className="absolute top-1/2 left-1 -translate-y-1/2 text-emerald-600/70">★</div>
      <div className="absolute top-1/2 right-1 -translate-y-1/2 text-emerald-600/70">★</div>
    </div>
  );
}
