/**
 * Arabic Utilities for Disbursement Voucher
 * أدوات اللغة العربية لسند الصرف
 */

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => ARABIC_DIGITS[parseInt(d)]);
}

export function formatCurrencyArabic(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ر.س`;
}

export function formatDateArabic(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const day = toArabicDigits(date.getDate());
  const month = toArabicDigits(date.getMonth() + 1);
  const year = toArabicDigits(date.getFullYear());
  return `${day}/${month}/${year}`;
}

// تحويل الأرقام إلى كلمات عربية
const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

export function numberToArabicWords(num: number): string {
  if (num === 0) return 'صفر';
  
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  
  let result = convertIntegerToWords(intPart);
  result += ' ريال سعودي';
  
  if (decPart > 0) {
    result += ' و' + convertIntegerToWords(decPart) + ' هللة';
  }
  
  return result;
}

function convertIntegerToWords(num: number): string {
  if (num === 0) return '';
  if (num < 10) return ONES[num];
  if (num < 20) return TEENS[num - 10];
  if (num < 100) {
    const ones = num % 10;
    const tens = Math.floor(num / 10);
    if (ones === 0) return TENS[tens];
    return ONES[ones] + ' و' + TENS[tens];
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return HUNDREDS[hundreds];
    return HUNDREDS[hundreds] + ' و' + convertIntegerToWords(remainder);
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    let thousandWord = '';
    if (thousands === 1) thousandWord = 'ألف';
    else if (thousands === 2) thousandWord = 'ألفان';
    else if (thousands <= 10) thousandWord = convertIntegerToWords(thousands) + ' آلاف';
    else thousandWord = convertIntegerToWords(thousands) + ' ألف';
    
    if (remainder === 0) return thousandWord;
    return thousandWord + ' و' + convertIntegerToWords(remainder);
  }
  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    let millionWord = '';
    if (millions === 1) millionWord = 'مليون';
    else if (millions === 2) millionWord = 'مليونان';
    else if (millions <= 10) millionWord = convertIntegerToWords(millions) + ' ملايين';
    else millionWord = convertIntegerToWords(millions) + ' مليون';
    
    if (remainder === 0) return millionWord;
    return millionWord + ' و' + convertIntegerToWords(remainder);
  }
  return num.toString();
}

export function generateVoucherNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DV-${year}${month}-${random}`;
}
