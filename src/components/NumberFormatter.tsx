interface NumberFormatterProps {
  number: number;
  suffix?: string;
  className?: string;
}

export const NumberFormatter = ({ number, suffix = "", className = "" }: NumberFormatterProps) => {
  const formatNumber = (num: number) => {
    // لا نضع فواصل في السنوات (أرقام أربعة أرقام بدون فاصلة)
    if (num >= 2000 && num <= 2030) {
      return num.toString();
    }
    
    // نضع فواصل في الأرقام الكبيرة فقط (أكثر من 9999)
    if (num >= 10000) {
      return num.toLocaleString('en-US');
    }
    
    // الأرقام الصغيرة بدون فواصل
    return num.toString();
  };

  return (
    <span className={className}>
      {formatNumber(number)}{suffix}
    </span>
  );
};