/**
 * Invoice Totals Card
 * Finance-style totals with emphasis on grand total
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Receipt, Calculator, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
      transition={{ duration: 0.25, delay: 0.15 }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b bg-muted/30">
        <Calculator className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">
          {isRTL ? 'ملخص الفاتورة' : 'Invoice Summary'}
        </h3>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            {isRTL ? 'الإجمالي قبل الضريبة' : 'Subtotal'}
          </span>
          <span dir="ltr" className="font-mono font-medium tabular-nums ltr-token">
            {formatCurrency(subtotal)} <span className="text-muted-foreground text-sm">{currency}</span>
          </span>
        </div>

        {/* VAT */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {isRTL 
              ? `ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)`
              : `VAT (${(vatRate * 100).toFixed(0)}%)`
            }
          </span>
          <span dir="ltr" className="font-mono font-medium tabular-nums ltr-token text-primary/80">
            +{formatCurrency(vatAmount)} <span className="text-muted-foreground text-sm">{currency}</span>
          </span>
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isRTL ? 'الإجمالي شامل الضريبة' : 'Total (Inc. VAT)'}
          </span>
          <div className="text-end">
            <span dir="ltr" className="font-mono font-bold text-2xl text-primary tabular-nums ltr-token">
              {formatCurrency(total)}
            </span>
            <span className="text-muted-foreground text-sm ms-2">{currency}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
