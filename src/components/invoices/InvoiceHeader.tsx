/**
 * Invoice Header Component
 * Premium corporate invoice header - Global enterprise style
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
      className={cn('relative invoice-container', className)}
    >
      {/* Premium Invoice Title Bar */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-8 py-6 rounded-t-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Company Logo */}
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
                A
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide invoice-title">
                {isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE'}
              </h1>
              <p className="text-sm text-white/80 mt-1 invoice-subtitle">
                {isRTL ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Al-Shahri Holding Co.'}
              </p>
            </div>
          </div>
          <InvoiceStatusBadge status={status} size="lg" />
        </div>
      </div>

      {/* Invoice Details Bar */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-900/80 border-x border-b border-slate-200 dark:border-slate-700 px-8 py-5 rounded-b-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          {/* Invoice Number */}
          <div className="invoice-field">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 invoice-label">
              {isRTL ? 'رقم الفاتورة' : 'Invoice No.'}
            </p>
            <p dir="ltr" className="font-mono font-bold text-base text-foreground ltr-token invoice-value">
              {invoiceNumber}
            </p>
          </div>

          {/* Issue Date */}
          {issuedAt && (
            <div className="invoice-field">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 invoice-label">
                {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
              </p>
              <p className="font-semibold text-foreground invoice-value">
                {formatDate(issuedAt)}
              </p>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div className="invoice-field">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 invoice-label">
                {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
              </p>
              <p className="font-semibold text-foreground invoice-value">
                {formatDate(dueDate)}
              </p>
            </div>
          )}

          {/* Status Text */}
          <div className="sm:text-end invoice-field">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 invoice-label">
              {isRTL ? 'الحالة' : 'Status'}
            </p>
            <p className={cn(
              'font-bold text-base invoice-status',
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