/**
 * Invoice Actions Component
 * Clean action bar: Download, Pay, Copy
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
  orderNumber,
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

  const showPayButton = status !== 'paid' && status !== 'cancelled' && (paymentUrl || onPayNow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.16 }}
      className={cn(
        isMobile && 'fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm border-t safe-area-bottom z-50',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-3',
        isMobile ? 'p-4' : 'pt-4'
      )}>
        {/* Primary: Download PDF */}
        <Button
          variant={showPayButton ? 'outline' : 'default'}
          onClick={handleDownload}
          disabled={isDownloading}
          className={cn('gap-2', isMobile && 'flex-1')}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isRTL ? 'تحميل PDF' : 'Download PDF'}
        </Button>

        {/* Pay Now (if applicable) */}
        {showPayButton && (
          <Button
            onClick={() => paymentUrl ? window.open(paymentUrl, '_blank') : onPayNow?.()}
            className={cn('gap-2', isMobile && 'flex-1')}
          >
            <CreditCard className="h-4 w-4" />
            {isRTL ? 'ادفع الآن' : 'Pay Now'}
          </Button>
        )}

        {/* Copy Invoice Number */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={copyInvoiceNumber}
            className="ms-auto"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile: Copy Button Row */}
      {isMobile && (
        <div className="px-4 pb-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyInvoiceNumber}
            className="w-full gap-2 text-muted-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="text-xs">
              {isRTL ? 'نسخ رقم الفاتورة' : 'Copy Invoice Number'}
            </span>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
