/**
 * Invoice Details Drawer - Side panel for invoice details
 * Uses the new enterprise InvoiceView system
 * RTL-first with PDF download using fixed system
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomerInvoice } from './types';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';
import { 
  InvoiceView, 
  mapCustomerInvoiceToViewModel 
} from '@/components/invoices';

interface InvoiceDetailsDrawerProps {
  invoice: CustomerInvoice | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceDetailsDrawer({ 
  invoice, 
  open, 
  onClose 
}: InvoiceDetailsDrawerProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const handleDownloadPdf = async () => {
    if (!invoice) return;

    console.log('[PDF] CLICK', { kind: 'invoice', id: invoice.id });
    const toastId = toast.loading(isRTL ? 'جاري تجهيز الملف...' : 'Preparing file...');

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.invoice_number,
        date: invoice.created_at,
        dueDate: invoice.due_date || undefined,
        status: invoice.status,
        seller: {
          name: 'شركة علي صالح الشهري القابضة',
          vatNumber: '310123456789012',
        },
        buyer: {
          name: isRTL ? 'عميل' : 'Customer',
        },
        items: [{
          description: invoice.order 
            ? (isRTL ? (invoice.order.title_ar || invoice.order.title) : invoice.order.title)
            : (isRTL ? 'خدمة' : 'Service'),
          quantity: 1,
          unitPrice: invoice.subtotal,
        }],
        subtotal: invoice.subtotal,
        vatRate: invoice.vat_rate / 100,
        vatAmount: invoice.vat_amount,
        total: invoice.total,
        currency: invoice.currency,
        notes: invoice.notes || undefined,
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
    if (!invoice?.payment_url) return;
    window.open(invoice.payment_url, '_blank');
  };

  // Convert to view model
  const viewModel = invoice ? mapCustomerInvoiceToViewModel(invoice) : null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side={isRTL ? 'left' : 'right'} 
        className="w-full sm:max-w-2xl p-0 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {invoice && viewModel && (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Custom Header */}
              <SheetHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
                <SheetTitle className="text-lg">
                  {isRTL ? 'تفاصيل الفاتورة' : 'Invoice Details'}
                </SheetTitle>
              </SheetHeader>

              {/* Scrollable Content */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <InvoiceView
                    invoice={viewModel}
                    onDownload={handleDownloadPdf}
                    onPayNow={invoice.status !== 'paid' && invoice.payment_url ? handlePayNow : undefined}
                  />
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
