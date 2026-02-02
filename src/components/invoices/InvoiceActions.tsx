/**
 * Invoice Actions Component
 * Primary actions: Download, Pay, Copy
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Download, 
  Copy, 
  CreditCard, 
  ExternalLink,
  FileText,
  Loader2,
  Check,
  Hash
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
  contractUrl,
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(isRTL ? 'تم النسخ' : 'Copied');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(isRTL ? 'فشل النسخ' : 'Copy failed');
    }
  };

  const showPayButton = status !== 'paid' && status !== 'cancelled' && (paymentUrl || onPayNow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className={cn(
        'rounded-xl border bg-card p-4',
        isMobile && 'fixed bottom-0 inset-x-0 rounded-none border-x-0 border-b-0 safe-area-bottom z-50 shadow-lg',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-3',
        isMobile ? 'flex-col' : 'flex-wrap'
      )}>
        {/* Primary Actions */}
        <div className={cn('flex items-center gap-2', isMobile && 'w-full')}>
          {/* Pay Now */}
          {showPayButton && (
            <Button
              onClick={() => paymentUrl ? window.open(paymentUrl, '_blank') : onPayNow?.()}
              className={cn('gap-2', isMobile && 'flex-1')}
            >
              <CreditCard className="h-4 w-4" />
              {isRTL ? 'ادفع الآن' : 'Pay Now'}
              {paymentUrl && <ExternalLink className="h-3 w-3" />}
            </Button>
          )}
          
          {/* Download PDF */}
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
        </div>

        {/* Secondary Actions */}
        <div className={cn(
          'flex items-center gap-2',
          isMobile ? 'w-full justify-center' : 'ms-auto'
        )}>
          <TooltipProvider>
            {/* Copy Invoice Number */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={isMobile ? 'sm' : 'icon'}
                  onClick={() => copyToClipboard(invoiceNumber, 'invoice')}
                  className="gap-2"
                >
                  {copiedField === 'invoice' ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {isMobile && (
                    <span className="text-xs">
                      {isRTL ? 'رقم الفاتورة' : 'Invoice #'}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRTL ? 'نسخ رقم الفاتورة' : 'Copy Invoice Number'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Copy Order Number */}
            {orderNumber && (
              <Tooltip>
                <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size={isMobile ? 'sm' : 'icon'}
                    onClick={() => copyToClipboard(orderNumber, 'order')}
                    className="gap-2"
                  >
                    {copiedField === 'order' ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                    {isMobile && (
                      <span className="text-xs">
                        {isRTL ? 'رقم الطلب' : 'Order #'}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRTL ? 'نسخ رقم الطلب' : 'Copy Order Number'}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* View Contract */}
            {contractUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? 'sm' : 'icon'}
                    onClick={() => window.open(contractUrl, '_blank')}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {isMobile && (
                      <span className="text-xs">
                        {isRTL ? 'العقد' : 'Contract'}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRTL ? 'فتح العقد' : 'View Contract'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}
