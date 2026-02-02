/**
 * Invoice Header Component
 * Premium top bar with status, number, and tax invoice label
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText, Hash } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { InvoiceViewStatus } from './types';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  status: InvoiceViewStatus;
  className?: string;
}

export function InvoiceHeader({ 
  invoiceNumber, 
  status,
  className 
}: InvoiceHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tax Invoice Label */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isRTL ? 'فاتورة ضريبية' : 'Tax Invoice'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRTL ? 'مستند رسمي' : 'Official Document'}
              </p>
            </div>
          </div>

          {/* Invoice Number & Status */}
          <div className="flex flex-col sm:items-end gap-2">
            <InvoiceStatusBadge status={status} size="lg" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span 
                dir="ltr" 
                className="font-mono text-base sm:text-lg font-semibold text-foreground ltr-token"
              >
                {invoiceNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
