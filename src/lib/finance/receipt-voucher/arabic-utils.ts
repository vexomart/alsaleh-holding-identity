/**
 * Arabic Utilities for Receipt Voucher
 * أدوات اللغة العربية لسند القبض
 */

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
}

export function formatCurrencyArabic(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ر.س`;
}

export function formatDateArabic(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
  }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return toArabicDigits(`${year}/${month}/${day}`);
}

const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

function convertHundreds(num: number): string {
  if (num === 0) return '';
  if (num < 20) return ones[num];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return one ? `${ones[one]} و${tens[ten]}` : tens[ten];
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  if (remainder === 0) return hundreds[hundred];
  return `${hundreds[hundred]} و${convertHundreds(remainder)}`;
}

export function numberToArabicWords(amount: number): string {
  if (amount === 0) return 'صفر ريال سعودي';
  
  const intPart = Math.floor(amount);
  const decPart = Math.round((amount - intPart) * 100);
  
  let result = '';
  
  if (intPart >= 1000000) {
    const millions = Math.floor(intPart / 1000000);
    const millionWord = millions === 1 ? 'مليون' : millions === 2 ? 'مليونان' : millions <= 10 ? `${convertHundreds(millions)} ملايين` : `${convertHundreds(millions)} مليون`;
    result += millionWord;
    const remainder = intPart % 1000000;
    if (remainder > 0) result += ' و';
  }
  
  const remaining = intPart % 1000000;
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    const thousandWord = thousands === 1 ? 'ألف' : thousands === 2 ? 'ألفان' : thousands <= 10 ? `${convertHundreds(thousands)} آلاف` : `${convertHundreds(thousands)} ألف`;
    result += thousandWord;
    const rem = remaining % 1000;
    if (rem > 0) result += ' و';
  }
  
  const lastThree = remaining % 1000;
  if (lastThree > 0) {
    result += convertHundreds(lastThree);
  }
  
  result += ' ريال سعودي';
  
  if (decPart > 0) {
    result += ` و${convertHundreds(decPart)} هللة`;
  }
  
  return result.trim();
}

export function generateReceiptNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RV-${year}${month}-${random}`;
}

export function getPaymentMethodArabic(method?: string): string {
  const methods: Record<string, string> = {
    wallet: 'المحفظة',
    bank_transfer: 'تحويل بنكي',
    mada: 'مدى',
    visa: 'فيزا',
    cash: 'نقداً',
  };
  return methods[method || ''] || 'غير محدد';
}
