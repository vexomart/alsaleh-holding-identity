/**
 * Invoice Metrics Row
 * Clean summary strip with key financial data
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvoiceMetricsRowProps {
  total: number;
  vatAmount: number;
  vatRate: number;
  issuedAt: string;
  orderNumber?: string;
  currency: string;
  className?: string;
}

export function InvoiceMetricsRow({
  total,
  vatAmount,
  vatRate,
  orderNumber,
  currency,
  className,
}: InvoiceMetricsRowProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const metrics = [
    {
      id: 'total',
      label: isRTL ? 'الإجمالي شامل الضريبة' : 'Total Amount',
      value: formatCurrency(total),
      suffix: currency,
      highlight: true,
    },
    {
      id: 'vat',
      label: isRTL ? `ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)` : `VAT (${Math.round(vatRate * 100)}%)`,
      value: formatCurrency(vatAmount),
      suffix: currency,
    },
    ...(orderNumber ? [{
      id: 'order',
      label: isRTL ? 'رقم الطلب' : 'Order No.',
      value: orderNumber,
      isLtr: true,
    }] : []),
  ];

  return (
    <div className={cn(
      'grid gap-4',
      isMobile ? 'grid-cols-1' : 'grid-cols-3',
      className
    )}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.04 }}
          className={cn(
            'rounded-xl border bg-card p-4',
            metric.highlight && 'bg-primary/5 border-primary/20'
          )}
        >
          <p className="text-xs text-muted-foreground mb-1.5">
            {metric.label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span 
              dir={metric.isLtr ? 'ltr' : undefined}
              className={cn(
                'text-xl font-semibold tabular-nums',
                metric.highlight ? 'text-primary' : 'text-foreground',
                metric.isLtr && 'ltr-token font-mono text-lg'
              )}
            >
              {metric.value}
            </span>
            {metric.suffix && (
              <span className="text-sm text-muted-foreground">
                {metric.suffix}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
