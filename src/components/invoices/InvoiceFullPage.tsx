/**
 * Invoice Full Page View
 * Standalone full-page invoice experience
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceView } from './InvoiceView';
import { InvoiceSkeleton } from './InvoiceSkeleton';
import { InvoicePaymentSheet } from './InvoicePaymentSheet';
import { InvoiceViewModel, PaymentMethod } from './types';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';

interface InvoiceFullPageProps {
  invoice: InvoiceViewModel | null;
  isLoading?: boolean;
  error?: string | null;
  backUrl?: string;
  backLabel?: string;
  backLabelAr?: string;
  onPaymentInitiate?: (method: PaymentMethod) => Promise<string | null>;
}

export function InvoiceFullPage({
  invoice,
  isLoading,
  error,
  backUrl,
  backLabel = 'Back',
  backLabelAr = 'رجوع',
  onPaymentInitiate,
}: InvoiceFullPageProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleDownload = async () => {
    if (!invoice) return;

    const toastId = toast.loading(isRTL ? 'جاري تجهيز الملف...' : 'Preparing file...');

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.issuedAt,
        dueDate: invoice.dueDate || undefined,
        status: invoice.status,
        seller: {
          name: invoice.seller.nameAr || invoice.seller.name,
          vatNumber: invoice.seller.vatNumber,
        },
        buyer: {
          name: invoice.buyer.nameAr || invoice.buyer.name,
          vatNumber: invoice.buyer.vatNumber,
        },
        items: invoice.items.map(item => ({
          description: isRTL && item.descriptionAr ? item.descriptionAr : item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        subtotal: invoice.subtotal,
        vatRate: invoice.vatRate,
        vatAmount: invoice.vatAmount,
        total: invoice.total,
        currency: invoice.currency,
        notes: invoice.notesAr || invoice.notes,
      };

      const success = await downloadInvoicePdf(invoiceData);
      if (!success) throw new Error('Download failed');
      toast.success(isRTL ? 'تم تنزيل الملف' : 'Downloaded', { id: toastId });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error(isRTL ? 'فشل تنزيل الملف' : 'Download failed', { id: toastId });
    }
  };

  const handlePayNow = () => {
    if (invoice?.paymentUrl) {
      window.open(invoice.paymentUrl, '_blank');
    } else {
      setPaymentSheetOpen(true);
    }
  };

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    if (!onPaymentInitiate) {
      toast.error(isRTL ? 'الدفع غير متاح حالياً' : 'Payment not available');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const paymentUrl = await onPaymentInitiate(method);
      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
        setPaymentSheetOpen(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(isRTL ? 'فشل في بدء الدفع' : 'Failed to initiate payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          {backUrl && (
            <Button variant="outline" onClick={() => navigate(backUrl)}>
              <BackIcon className="h-4 w-4 me-2" />
              {isRTL ? backLabelAr : backLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-background"
    >
      {/* Back Navigation */}
      {backUrl && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40"
        >
          <div className="container max-w-6xl py-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(backUrl)}
              className="gap-2"
            >
              <BackIcon className="h-4 w-4" />
              {isRTL ? backLabelAr : backLabel}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className={cn(
        'container max-w-6xl py-6 sm:py-8',
        isMobile && 'px-4'
      )}>
        {isLoading ? (
          <InvoiceSkeleton />
        ) : invoice ? (
          <InvoiceView
            invoice={invoice}
            onDownload={handleDownload}
            onPayNow={invoice.status !== 'paid' && invoice.status !== 'cancelled' ? handlePayNow : undefined}
          />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            {isRTL ? 'لم يتم العثور على الفاتورة' : 'Invoice not found'}
          </div>
        )}
      </div>

      {/* Payment Sheet */}
      {invoice && (
        <InvoicePaymentSheet
          open={paymentSheetOpen}
          onClose={() => setPaymentSheetOpen(false)}
          total={invoice.total}
          currency={invoice.currency}
          invoiceNumber={invoice.invoiceNumber}
          onPaymentSelect={handlePaymentMethodSelect}
          isProcessing={isProcessingPayment}
        />
      )}
    </div>
  );
}
