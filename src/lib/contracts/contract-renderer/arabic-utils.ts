/**
 * Arabic Utilities for Contract Rendering
 * تحويل الأرقام والتنسيق العربي
 */

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const WESTERN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * تحويل الأرقام الغربية إلى عربية
 */
export function toArabicDigits(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => ARABIC_DIGITS[parseInt(digit)]);
}

/**
 * تحويل الأرقام العربية إلى غربية
 */
export function toWesternDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (digit) => {
    const index = ARABIC_DIGITS.indexOf(digit);
    return index >= 0 ? WESTERN_DIGITS[index] : digit;
  });
}

/**
 * تنسيق المبلغ بالريال السعودي
 */
export function formatCurrencyArabic(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ر.س`;
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentArabic(value: number): string {
  return `${toArabicDigits(value.toFixed(2))}٪`;
}

/**
 * تنسيق التاريخ بالعربي
 */
export function formatDateArabic(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('ar-SA', options);
}

/**
 * تنسيق التاريخ المختصر
 */
export function formatDateShortArabic(dateStr: string): string {
  const date = new Date(dateStr);
  const day = toArabicDigits(date.getDate());
  const month = toArabicDigits(date.getMonth() + 1);
  const year = toArabicDigits(date.getFullYear());
  return `${day}/${month}/${year}`;
}

/**
 * تحويل الرقم إلى كلمات عربية
 */
export function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'];
  const thousands = ['', 'ألف', 'ألفان', 'ثلاثة آلاف', 'أربعة آلاف', 'خمسة آلاف', 'ستة آلاف', 'سبعة آلاف', 'ثمانية آلاف', 'تسعة آلاف'];
  
  if (num === 0) return 'صفر';
  if (num < 0) return 'سالب ' + numberToArabicWords(Math.abs(num));
  
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  
  let result = '';
  
  // Handle thousands
  const thousandsDigit = Math.floor(intPart / 1000);
  if (thousandsDigit > 0 && thousandsDigit < 10) {
    result += thousands[thousandsDigit] + ' ';
  } else if (thousandsDigit >= 10) {
    result += numberToArabicWords(thousandsDigit) + ' ألف ';
  }
  
  // Handle hundreds
  const remainder = intPart % 1000;
  const hundredsDigit = Math.floor(remainder / 100);
  if (hundredsDigit > 0) {
    result += hundreds[hundredsDigit] + ' ';
  }
  
  // Handle tens and ones
  const tensRemainder = remainder % 100;
  if (tensRemainder >= 10 && tensRemainder < 20) {
    result += teens[tensRemainder - 10] + ' ';
  } else {
    const tensDigit = Math.floor(tensRemainder / 10);
    const onesDigit = tensRemainder % 10;
    if (onesDigit > 0 && tensDigit > 0) {
      result += ones[onesDigit] + ' و' + tens[tensDigit] + ' ';
    } else if (tensDigit > 0) {
      result += tens[tensDigit] + ' ';
    } else if (onesDigit > 0) {
      result += ones[onesDigit] + ' ';
    }
  }
  
  result = result.trim();
  
  // Add decimal part
  if (decPart > 0) {
    result += ' و' + numberToArabicWords(decPart) + ' هللة';
  }
  
  return result + ' ريال سعودي';
}

/**
 * تنسيق رقم الهاتف
 */
export function formatPhoneArabic(phone: string): string {
  // Keep phone numbers in LTR for readability
  return phone;
}

/**
 * اسم الشهر بالعربي
 */
export function getArabicMonthName(monthIndex: number): string {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return months[monthIndex] || '';
}

/**
 * ترقيم الصفحات بالعربي
 */
export function formatPageNumber(current: number, total: number): string {
  return `صفحة ${toArabicDigits(current)} من ${toArabicDigits(total)}`;
}

/**
 * تنسيق رقم القسط
 */
export function formatInstallmentNumber(num: number, total: number): string {
  return `${toArabicDigits(num)}/${toArabicDigits(total)}`;
}
