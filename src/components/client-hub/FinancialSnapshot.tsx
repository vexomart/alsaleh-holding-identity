/**
 * Financial Snapshot
 * Clean summary of client's financial status
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Wallet, 
  Receipt, 
  CreditCard,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { FinancialSnapshot as FinancialSnapshotType } from './types';

interface FinancialSnapshotProps {
  data: FinancialSnapshotType;
  className?: string;
}

export function FinancialSnapshot({ data, className }: FinancialSnapshotProps) {
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
      id: 'wallet',
      icon: Wallet,
      label: isRTL ? 'رصيد المحفظة' : 'Wallet Balance',
      value: formatCurrency(data.walletBalance),
      suffix: data.currency,
      highlight: true,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      id: 'outstanding',
      icon: Receipt,
      label: isRTL ? 'فواتير غير مدفوعة' : 'Outstanding',
      value: data.outstandingInvoices > 0 
        ? formatCurrency(data.outstandingAmount)
        : '0.00',
      suffix: data.currency,
      subtext: data.outstandingInvoices > 0 
        ? (isRTL ? `${data.outstandingInvoices} فاتورة` : `${data.outstandingInvoices} invoices`)
        : undefined,
      warning: data.outstandingInvoices > 0,
      color: data.outstandingInvoices > 0 
        ? 'text-amber-600 dark:text-amber-400' 
        : 'text-foreground',
      bgColor: data.outstandingInvoices > 0 
        ? 'bg-amber-50 dark:bg-amber-900/20' 
        : 'bg-muted/50',
    },
    {
      id: 'lastPayment',
      icon: CreditCard,
      label: isRTL ? 'آخر دفعة' : 'Last Payment',
      value: data.lastPaymentAmount 
        ? formatCurrency(data.lastPaymentAmount)
        : (isRTL ? 'لا توجد' : 'None'),
      suffix: data.lastPaymentAmount ? data.currency : undefined,
      subtext: data.lastPaymentDate ? formatDate(data.lastPaymentDate) : undefined,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
    },
    {
      id: 'totalPaid',
      icon: TrendingUp,
      label: isRTL ? 'إجمالي المدفوعات' : 'Total Paid',
      value: formatCurrency(data.totalPaid),
      suffix: data.currency,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn('space-y-4', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {isRTL ? 'الملخص المالي' : 'Financial Snapshot'}
        </h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
              className={cn(
                'rounded-xl border p-4',
                metric.bgColor,
                metric.highlight && 'border-emerald-200 dark:border-emerald-800'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('h-4 w-4', metric.color)} />
                <span className="text-xs text-muted-foreground font-medium">
                  {metric.label}
                </span>
                {metric.warning && (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 ms-auto" />
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span 
                  dir="ltr" 
                  className={cn(
                    'text-xl font-bold tabular-nums ltr-token',
                    metric.color
                  )}
                >
                  {metric.value}
                </span>
                {metric.suffix && (
                  <span className="text-xs text-muted-foreground">
                    {metric.suffix}
                  </span>
                )}
              </div>
              {metric.subtext && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.subtext}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
