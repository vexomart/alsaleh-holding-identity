/**
 * Invoice Header Component
 * Modern minimal header with status and invoice number
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
  className?: string;
}

export function InvoiceHeader({ 
  invoiceNumber, 
  status,
  issuedAt,
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
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50',
        className
      )}
    >
      {/* Title & Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {isRTL ? 'فاتورة ضريبية' : 'Tax Invoice'}
          </h1>
          <InvoiceStatusBadge status={status} size="md" />
        </div>
        {issuedAt && (
          <p className="text-sm text-muted-foreground">
            {formatDate(issuedAt)}
          </p>
        )}
      </div>

      {/* Invoice Number */}
      <div className="sm:text-end">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {isRTL ? 'رقم الفاتورة' : 'Invoice No.'}
        </p>
        <p 
          dir="ltr" 
          className="text-lg font-mono font-medium text-foreground ltr-token"
        >
          {invoiceNumber}
        </p>
      </div>
    </motion.div>
  );
}
