/**
 * Invoice Actions Component
 * Classic corporate action bar
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Copy, 
  CreditCard, 
  Loader2,
  Check,
  Printer,
} from 'lucide-react';
import { InvoiceViewStatus } from './types';

interface InvoiceActionsProps {
  invoiceNumber: string;
  orderNumber?: string;
  contractUrl?: string;
  paymentUrl?: string | null;
  status: InvoiceViewStatus;
  onDownload: () => Promise<void>;
  onPayNow?: () => void;
  className?: string;
}

export function InvoiceActions({
  invoiceNumber,
  paymentUrl,
  status,
  onDownload,
  onPayNow,
  className,
}: InvoiceActionsProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const copyInvoiceNumber = async () => {
    try {
      await navigator.clipboard.writeText(invoiceNumber);
      setCopied(true);
      toast.success(isRTL ? 'تم نسخ رقم الفاتورة' : 'Invoice number copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(isRTL ? 'فشل النسخ' : 'Copy failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showPayButton = status !== 'paid' && status !== 'cancelled' && (paymentUrl || onPayNow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className={cn(
        isMobile && 'fixed bottom-0 inset-x-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 safe-area-bottom z-50',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-3',
        isMobile ? 'p-4 flex-col' : 'pt-6 justify-between'
      )}>
        {/* Left: Secondary Actions */}
        <div className={cn(
          'flex items-center gap-2',
          isMobile && 'w-full'
        )}>
          {/* Copy */}
          <Button
            variant="outline"
            size={isMobile ? 'default' : 'sm'}
            onClick={copyInvoiceNumber}
            className={cn('gap-2', isMobile && 'flex-1')}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {isRTL ? 'نسخ الرقم' : 'Copy No.'}
          </Button>

          {/* Print */}
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              {isRTL ? 'طباعة' : 'Print'}
            </Button>
          )}
        </div>

        {/* Right: Primary Actions */}
        <div className={cn(
          'flex items-center gap-2',
          isMobile && 'w-full'
        )}>
          {/* Download PDF */}
          <Button
            variant={showPayButton ? 'outline' : 'default'}
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(
              'gap-2',
              isMobile && 'flex-1',
              !showPayButton && 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
            )}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isRTL ? 'تحميل PDF' : 'Download PDF'}
          </Button>

          {/* Pay Now */}
          {showPayButton && (
            <Button
              onClick={() => paymentUrl ? window.open(paymentUrl, '_blank') : onPayNow?.()}
              className={cn(
                'gap-2 bg-emerald-600 hover:bg-emerald-700 text-white',
                isMobile && 'flex-1'
              )}
            >
              <CreditCard className="h-4 w-4" />
              {isRTL ? 'ادفع الآن' : 'Pay Now'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
