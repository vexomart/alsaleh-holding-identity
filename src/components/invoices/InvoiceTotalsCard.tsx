/**
 * Invoice Totals Card
 * Premium Voucher Design Style - تصميم سند الصرف
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface InvoiceTotalsCardProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  className?: string;
}

// Arabic number words helper
function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const o = n % 10;
      const t = Math.floor(n / 10);
      if (o === 0) return tens[t];
      return ones[o] + ' و' + tens[t];
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      if (r === 0) return hundreds[h];
      return hundreds[h] + ' و' + convert(r);
    }
    if (n < 1000000) {
      const t = Math.floor(n / 1000);
      const r = n % 1000;
      let tw = '';
      if (t === 1) tw = 'ألف';
      else if (t === 2) tw = 'ألفان';
      else if (t <= 10) tw = convert(t) + ' آلاف';
      else tw = convert(t) + ' ألف';
      if (r === 0) return tw;
      return tw + ' و' + convert(r);
    }
    return n.toString();
  }

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  
  let result = convert(intPart) || 'صفر';
  result += ' ريال سعودي';
  
  if (decPart > 0) {
    result += ' و' + convert(decPart) + ' هللة';
  }
  
  return result;
}

export function InvoiceTotalsCard({
  subtotal,
  vatRate,
  vatAmount,
  total,
  currency,
  className,
}: InvoiceTotalsCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn('space-y-4 invoice-container', className)}
    >
      {/* Featured Amount Box - Like Voucher */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-3 border-teal-600 rounded-2xl p-6 text-center relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
        
        <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-2">
          {isRTL ? 'إجمالي المبلغ المستحق' : 'Total Amount Due'}
        </p>
        <p dir="ltr" className="font-mono font-bold text-4xl text-teal-700 dark:text-teal-400 ltr-token mb-2">
          {formatCurrency(total)}
        </p>
        <p className="text-sm text-teal-600 dark:text-teal-500">
          {isRTL ? 'ريال سعودي' : currency}
        </p>
        {isRTL && (
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 font-medium">
            {numberToArabicWords(total)}
          </p>
        )}
      </div>

      {/* Totals Breakdown */}
      <div className="flex justify-end">
        <div className="w-full max-w-md">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
            {/* Subtotal */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700">
              <span className="text-sm text-muted-foreground">
                {isRTL ? 'الإجمالي قبل الضريبة' : 'Subtotal'}
              </span>
              <span dir="ltr" className="font-mono text-sm tabular-nums text-foreground ltr-token">
                {formatCurrency(subtotal)} {currency}
              </span>
            </div>

            {/* VAT */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <span className="text-sm text-muted-foreground">
                {isRTL 
                  ? `ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)`
                  : `VAT (${Math.round(vatRate * 100)}%)`
                }
              </span>
              <span dir="ltr" className="font-mono text-sm tabular-nums text-foreground ltr-token">
                {formatCurrency(vatAmount)} {currency}
              </span>
            </div>

            {/* Grand Total - Teal Theme */}
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white">
              <span className="font-bold text-sm uppercase tracking-widest">
                {isRTL ? 'الإجمالي شامل الضريبة' : 'Total Due'}
              </span>
              <div className="text-end">
                <span dir="ltr" className="font-mono font-bold text-2xl tabular-nums ltr-token text-amber-400">
                  {formatCurrency(total)}
                </span>
                <span className="text-sm text-white/70 ms-2">{currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Note */}
      <p className="text-xs text-muted-foreground text-center">
        {isRTL 
          ? 'جميع المبالغ بالريال السعودي وتشمل ضريبة القيمة المضافة'
          : 'All amounts in SAR and include VAT'
        }
      </p>
    </motion.div>
  );
}