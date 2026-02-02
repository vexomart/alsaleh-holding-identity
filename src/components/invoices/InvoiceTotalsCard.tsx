/**
 * Invoice Totals Card
 * Finance-style totals with emphasis on grand total
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.12 }}
      className={cn('rounded-xl border bg-card', className)}
    >
      <div className="p-5 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {isRTL ? 'الإجمالي قبل الضريبة' : 'Subtotal'}
          </span>
          <span dir="ltr" className="font-mono tabular-nums text-foreground ltr-token">
            {formatCurrency(subtotal)} {currency}
          </span>
        </div>

        {/* VAT */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {isRTL 
              ? `ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)`
              : `VAT (${Math.round(vatRate * 100)}%)`
            }
          </span>
          <span dir="ltr" className="font-mono tabular-nums text-foreground ltr-token">
            {formatCurrency(vatAmount)} {currency}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Grand Total */}
        <div className="flex justify-between items-center pt-1">
          <span className="font-semibold text-foreground">
            {isRTL ? 'الإجمالي شامل الضريبة' : 'Total'}
          </span>
          <span dir="ltr" className="text-2xl font-bold text-primary tabular-nums ltr-token">
            {formatCurrency(total)}
            <span className="text-sm font-normal text-muted-foreground ms-1.5">{currency}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
