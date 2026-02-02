/**
 * Invoice Header Component
 * Classic corporate header with branding
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { InvoiceViewStatus } from './types';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  status: InvoiceViewStatus;
  issuedAt?: string;
  dueDate?: string | null;
  className?: string;
}

export function InvoiceHeader({ 
  invoiceNumber, 
  status,
  issuedAt,
  dueDate,
  className 
}: InvoiceHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('relative', className)}
    >
      {/* Classic Invoice Title Bar */}
      <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Company Logo Placeholder */}
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                {isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE'}
              </h1>
              <p className="text-xs text-white/70 mt-0.5">
                {isRTL ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Al-Shahri Holding Co.'}
              </p>
            </div>
          </div>
          <InvoiceStatusBadge status={status} size="lg" />
        </div>
      </div>

      {/* Invoice Details Bar */}
      <div className="bg-slate-100 dark:bg-slate-900/50 border-x border-b border-slate-200 dark:border-slate-700 px-6 py-4 rounded-b-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {/* Invoice Number */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {isRTL ? 'رقم الفاتورة' : 'Invoice No.'}
            </p>
            <p dir="ltr" className="font-mono font-semibold text-foreground ltr-token">
              {invoiceNumber}
            </p>
          </div>

          {/* Issue Date */}
          {issuedAt && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
              </p>
              <p className="font-medium text-foreground">
                {formatDate(issuedAt)}
              </p>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
              </p>
              <p className="font-medium text-foreground">
                {formatDate(dueDate)}
              </p>
            </div>
          )}

          {/* Status Text */}
          <div className="sm:text-end">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {isRTL ? 'الحالة' : 'Status'}
            </p>
            <p className={cn(
              'font-semibold',
              status === 'paid' && 'text-emerald-600 dark:text-emerald-400',
              status === 'pending' && 'text-amber-600 dark:text-amber-400',
              status === 'overdue' && 'text-red-600 dark:text-red-400',
              !['paid', 'pending', 'overdue'].includes(status) && 'text-foreground'
            )}>
              {status === 'paid' && (isRTL ? 'مدفوعة' : 'PAID')}
              {status === 'pending' && (isRTL ? 'بانتظار الدفع' : 'PENDING')}
              {status === 'overdue' && (isRTL ? 'متأخرة' : 'OVERDUE')}
              {status === 'issued' && (isRTL ? 'صادرة' : 'ISSUED')}
              {status === 'draft' && (isRTL ? 'مسودة' : 'DRAFT')}
              {status === 'cancelled' && (isRTL ? 'ملغاة' : 'CANCELLED')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
