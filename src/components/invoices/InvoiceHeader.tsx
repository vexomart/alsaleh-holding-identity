/**
 * Invoice Header Component
 * Premium Voucher Design Style - تصميم سند الصرف
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('relative invoice-container overflow-hidden rounded-2xl shadow-xl', className)}
    >
      {/* Premium Header - Teal Gradient like Voucher */}
      <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white px-6 sm:px-8 py-6">
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Company Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-xl sm:text-2xl font-bold text-amber-400">
                A
              </span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide">
                {isRTL ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Al-Shahri Holding Co.'}
              </h1>
              <p className="text-xs sm:text-sm text-white/75 mt-1">
                {isRTL ? 'Ali Saleh Al-Shahri Holding Co.' : 'شركة علي صالح الشهري القابضة'}
              </p>
            </div>
          </div>
          
          {/* Gold Badge - Like Voucher */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="bg-gradient-to-r from-amber-400 to-amber-500 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg"
          >
            <span className="text-slate-900 font-bold text-base sm:text-lg flex items-center gap-2">
              <span>📄</span>
              {isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Navy Info Bar - Like Voucher */}
      <div className="bg-slate-900 px-6 sm:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          {/* Invoice Number */}
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              {isRTL ? 'رقم الفاتورة' : 'Invoice No.'}
            </p>
            <p dir="ltr" className="font-mono font-bold text-white text-sm">
              {invoiceNumber}
            </p>
          </div>

          {/* Issue Date */}
          {issuedAt && (
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
              </p>
              <p className="font-semibold text-white text-sm">
                {formatDate(issuedAt)}
              </p>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
              </p>
              <p className="font-semibold text-white text-sm">
                {formatDate(dueDate)}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              {isRTL ? 'الحالة' : 'Status'}
            </p>
            <InvoiceStatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
