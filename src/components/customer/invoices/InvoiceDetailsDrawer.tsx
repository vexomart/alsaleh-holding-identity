/**
 * Invoice Details Drawer - Side panel for invoice details
 * RTL-first with PDF download using fixed system
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Download, 
  Calendar,
  Package,
  CreditCard,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { CustomerInvoice } from './types';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';

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
  const navigate = useNavigate();
  
  const [isDownloading, setIsDownloading] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;

    console.log('[PDF] CLICK', { kind: 'invoice', id: invoice.id });
    const toastId = toast.loading('جاري تجهيز الملف...');

    setIsDownloading(true);
    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.invoice_number,
        date: invoice.created_at,
        dueDate: invoice.due_date || undefined,
        status: invoice.status,
        seller: {
          name: 'شركة الصالح القابضة',
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePayNow = () => {
    if (!invoice?.payment_url) return;
    window.open(invoice.payment_url, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side={isRTL ? 'left' : 'right'} 
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {invoice && (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SheetHeader className="text-start">
                <div className="flex items-center gap-3 mb-2">
                  <InvoiceStatusBadge status={invoice.status} size="md" />
                </div>
                <SheetTitle className="text-xl">
                  {isRTL ? 'تفاصيل الفاتورة' : 'Invoice Details'}
                </SheetTitle>
                <p dir="ltr" className="text-sm text-muted-foreground font-mono">
                  {invoice.invoice_number}
                </p>
              </SheetHeader>

              {/* Total Amount */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'إجمالي الفاتورة' : 'Invoice Total'}
                </p>
                <p dir="ltr" className="text-3xl font-bold text-primary tabular-nums">
                  <span className="text-lg font-normal text-muted-foreground me-1">
                    {invoice.currency}
                  </span>
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'شامل ضريبة القيمة المضافة' : 'Including VAT'}
                </p>
              </div>

              {/* Invoice Details */}
              <div className="space-y-3">
                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-start">
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
                    </p>
                    <p className="text-sm font-medium">{formatDate(invoice.created_at)}</p>
                  </div>
                </div>

                {/* Due Date */}
                {invoice.due_date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-start">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                      </p>
                      <p className="text-sm font-medium">{formatDate(invoice.due_date)}</p>
                    </div>
                  </div>
                )}

                {/* Order Reference */}
                {invoice.order && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-start flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'مرتبط بالطلب' : 'Related Order'}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {isRTL 
                          ? (invoice.order.title_ar || invoice.order.title)
                          : invoice.order.title}
                      </p>
                      <p dir="ltr" className="text-xs text-muted-foreground font-mono">
                        {invoice.order.order_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">
                  {isRTL ? 'تفاصيل السعر' : 'Price Breakdown'}
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isRTL ? 'المبلغ الأساسي' : 'Subtotal'}
                    </span>
                    <span dir="ltr" className="font-mono tabular-nums">
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isRTL ? `ضريبة القيمة المضافة (${invoice.vat_rate}%)` : `VAT (${invoice.vat_rate}%)`}
                    </span>
                    <span dir="ltr" className="font-mono tabular-nums">
                      {formatCurrency(invoice.vat_amount, invoice.currency)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                    <span dir="ltr" className="text-primary font-mono tabular-nums">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paid Info */}
              {invoice.status === 'paid' && invoice.paid_at && (
                <>
                  <Separator />
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {isRTL ? 'تم الدفع بتاريخ' : 'Paid on'} {formatDate(invoice.paid_at)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions */}
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                {/* Pay Now - only if not paid and has payment URL */}
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && invoice.payment_url && (
                  <Button 
                    className="w-full gap-2" 
                    onClick={handlePayNow}
                  >
                    <CreditCard className="h-4 w-4" />
                    {isRTL ? 'ادفع الآن' : 'Pay Now'}
                    <ExternalLink className="h-3 w-3 ms-auto" />
                  </Button>
                )}
                
                {/* Download PDF */}
                <Button 
                  variant={invoice.status === 'paid' ? 'default' : 'outline'}
                  className="w-full gap-2" 
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isRTL ? 'تحميل PDF' : 'Download PDF'}
                </Button>

                {/* View Order */}
                {invoice.order && (
                  <Button 
                    variant="outline"
                    className="w-full gap-2" 
                    onClick={() => {
                      onClose();
                      navigate(`/app/orders`);
                    }}
                  >
                    <Package className="h-4 w-4" />
                    {isRTL ? 'عرض الطلب' : 'View Order'}
                  </Button>
                )}
              </SheetFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

