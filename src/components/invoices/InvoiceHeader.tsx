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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('relative invoice-container', className)}
    >
      {/* Premium Voucher-Style Header - Teal Gradient */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white px-8 py-6 rounded-t-2xl shadow-xl relative overflow-hidden">
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Company Logo */}
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-2xl font-bold text-white">
                A
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide invoice-title">
                {isRTL ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Al-Shahri Holding Co.'}
              </h1>
              <p className="text-sm text-white/75 mt-1 invoice-subtitle">
                {isRTL ? 'Ali Saleh Al-Shahri Holding Co.' : 'شركة علي صالح الشهري القابضة'}
              </p>
            </div>
          </div>
          
          {/* Gold Badge - Like Voucher */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 rounded-full shadow-lg">
            <span className="text-slate-900 font-bold text-lg">
              {isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE'}
            </span>
          </div>
        </div>
      </div>

      {/* Navy Info Bar - Like Voucher */}
      <div className="bg-slate-900 px-8 py-4">
        <div className="flex items-center justify-between text-sm">
          {/* Invoice Number */}
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
              {isRTL ? 'رقم الفاتورة' : 'Invoice No.'}
            </p>
            <p dir="ltr" className="font-mono font-bold text-white ltr-token">
              {invoiceNumber}
            </p>
          </div>

          {/* Issue Date */}
          {issuedAt && (
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
              </p>
              <p className="font-semibold text-white">
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
              <p className="font-semibold text-white">
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

      {/* Rounded bottom border */}
      <div className="h-3 bg-gradient-to-b from-slate-900 to-transparent rounded-b-xl" />
    </motion.div>
  );
}