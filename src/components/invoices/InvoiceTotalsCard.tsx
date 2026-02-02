/**
 * Invoice Totals Card
 * Classic corporate finance-style totals
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn('flex justify-end', className)}
    >
      <div className="w-full max-w-sm">
        {/* Totals Box */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          {/* Subtotal */}
          <div className="flex justify-between items-center px-5 py-3 bg-white dark:bg-slate-950">
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'الإجمالي قبل الضريبة' : 'Subtotal'}
            </span>
            <span dir="ltr" className="font-mono text-sm tabular-nums text-foreground ltr-token">
              {formatCurrency(subtotal)} {currency}
            </span>
          </div>

          {/* VAT */}
          <div className="flex justify-between items-center px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
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

          {/* Grand Total */}
          <div className="flex justify-between items-center px-5 py-4 bg-slate-900 dark:bg-slate-800 text-white">
            <span className="font-bold text-sm uppercase tracking-wide">
              {isRTL ? 'الإجمالي شامل الضريبة' : 'Total Due'}
            </span>
            <div className="text-end">
              <span dir="ltr" className="font-mono font-bold text-2xl tabular-nums ltr-token">
                {formatCurrency(total)}
              </span>
              <span className="text-sm text-white/70 ms-2">{currency}</span>
            </div>
          </div>
        </div>

        {/* Payment Note */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          {isRTL 
            ? 'جميع المبالغ بالريال السعودي وتشمل ضريبة القيمة المضافة'
            : 'All amounts in SAR and include VAT'
          }
        </p>
      </div>
    </motion.div>
  );
}
