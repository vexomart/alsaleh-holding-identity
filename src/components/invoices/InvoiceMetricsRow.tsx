/**
 * Invoice Metrics Row
 * Key metrics displayed as enterprise cards
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Receipt, 
  Percent, 
  Calendar, 
  Hash,
  Wallet
} from 'lucide-react';

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
  issuedAt,
  orderNumber,
  currency,
  className,
}: InvoiceMetricsRowProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const metrics = [
    {
      id: 'total',
      label: isRTL ? 'الإجمالي شامل الضريبة' : 'Total (Inc. VAT)',
      value: formatCurrency(total),
      suffix: currency,
      icon: Wallet,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      highlight: true,
    },
    {
      id: 'vat',
      label: isRTL ? `ضريبة القيمة المضافة (${vatRate * 100}%)` : `VAT (${vatRate * 100}%)`,
      value: formatCurrency(vatAmount),
      suffix: currency,
      icon: Percent,
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'date',
      label: isRTL ? 'تاريخ الإصدار' : 'Issue Date',
      value: formatDate(issuedAt),
      icon: Calendar,
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    ...(orderNumber ? [{
      id: 'order',
      label: isRTL ? 'رقم الطلب' : 'Order No.',
      value: orderNumber,
      icon: Hash,
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-600 dark:text-amber-400',
      isLtr: true,
    }] : []),
  ];

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4', className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className={cn(
              'relative overflow-hidden rounded-xl border bg-card p-4',
              metric.highlight && 'col-span-2 lg:col-span-1'
            )}
          >
            {/* Gradient Background */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-50',
              metric.gradient
            )} />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('h-4 w-4', metric.iconColor)} />
                <span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                  {metric.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span 
                  dir={metric.isLtr ? 'ltr' : undefined}
                  className={cn(
                    'text-lg sm:text-xl font-bold text-foreground tabular-nums',
                    metric.isLtr && 'ltr-token font-mono'
                  )}
                >
                  {metric.value}
                </span>
                {metric.suffix && (
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {metric.suffix}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
