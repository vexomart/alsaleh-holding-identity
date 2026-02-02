/**
 * OrderInvoiceSection - Invoice display/actions for Order Details
 * Uses html2canvas + jsPDF for proper Arabic RTL PDF generation
 * Includes Paylink payment integration with realtime status updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Receipt, 
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { 
  getInvoiceByOrderId, 
  createInvoice, 
  type Invoice,
  type InvoiceStatus 
} from '@/lib/api/invoices';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';
import { usePaylinkPayment } from '@/hooks/usePaylinkPayment';
import { useInvoiceRealtime } from '@/hooks/useInvoiceRealtime';
import { InvoiceView, mapCustomerInvoiceToViewModel } from '@/components/invoices';

interface OrderInvoiceSectionProps {
  orderId: string;
  orderNumber: string;
  orderTitle: string;
  orderTitleAr?: string | null;
  orderDescription?: string | null;
  totalAmount: number;
  currency?: string;
  customerId?: string | null;
  tenantId?: string | null;
  createdAt?: string | null;
  dueDate?: string | null;
  isAdmin?: boolean;
  onInvoiceGenerated?: (invoice: Invoice) => void;
}

// NOTE: This file previously rendered a legacy inline invoice UI.
// We now delegate rendering to the unified enterprise InvoiceView to guarantee
// consistent look across Orders & Invoices screens.

export function OrderInvoiceSection({
  orderId,
  orderNumber,
  orderTitle,
  orderTitleAr,
  orderDescription,
  totalAmount,
  currency = 'SAR',
  customerId,
  tenantId,
  createdAt,
  dueDate,
  isAdmin = false,
  onInvoiceGenerated,
}: OrderInvoiceSectionProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Paylink payment hook
  const { createPayment, redirectToPayment } = usePaylinkPayment();

  // Refetch invoice when needed
  const refetchInvoice = useCallback(async () => {
    try {
      const data = await getInvoiceByOrderId(orderId);
      setInvoice(data);
    } catch (err) {
      console.error('Error refetching invoice:', err);
    }
  }, [orderId]);

  // Subscribe to realtime invoice events (for customer view)
  useInvoiceRealtime({
    onInvoiceGenerated: (payload) => {
      if (payload.order_id === orderId) {
        refetchInvoice();
      }
    },
    onInvoicePaid: (payload) => {
      if (payload.order_id === orderId) {
        refetchInvoice();
      }
    },
    onPaymentFailed: (payload) => {
      if (payload.order_id === orderId) {
        refetchInvoice();
      }
    },
    showToast: !isAdmin, // Only show toasts for customers
  });

  // Fetch invoice on mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceByOrderId(orderId);
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const viewModel = useMemo(() => {
    if (!invoice) return null;
    return mapCustomerInvoiceToViewModel(
      {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        status: invoice.status,
        subtotal: invoice.subtotal,
        vat_rate: invoice.vat_rate,
        vat_amount: invoice.vat_amount,
        total: invoice.total,
        currency: invoice.currency,
        created_at: invoice.created_at,
        due_date: invoice.due_date,
        paid_at: invoice.paid_at ?? null,
        payment_url: invoice.payment_url,
        notes: invoice.notes ?? orderDescription ?? null,
        order: {
          id: orderId,
          order_number: orderNumber,
          title: orderTitle,
          title_ar: orderTitleAr ?? null,
          service: null,
        },
      },
      {
        buyerName: 'Customer',
        buyerNameAr: 'العميل',
      }
    );
  }, [invoice, orderDescription, orderId, orderNumber, orderTitle, orderTitleAr]);

  // Generate invoice (Admin only)
  const handleGenerateInvoice = async () => {
    if (!isAdmin || !customerId) return;

    try {
      setGenerating(true);
      
      // Create invoice in database
      const newInvoice = await createInvoice({
        order_id: orderId,
        customer_id: customerId,
        tenant_id: tenantId || undefined,
        subtotal: totalAmount,
        vat_rate: 15,
        currency,
      });

      // Map invoice status to PDF status type
      const pdfStatusMap: Record<InvoiceStatus, 'pending' | 'paid' | 'overdue' | 'cancelled'> = {
        draft: 'pending',
        issued: 'pending',
        paid: 'paid',
        cancelled: 'cancelled',
        overdue: 'overdue',
      };

      // Generate PDF with new PDF2 system
      const invoiceData: InvoiceData = {
        invoiceNumber: newInvoice.invoice_number,
        date: newInvoice.created_at,
        dueDate: dueDate || undefined,
        status: newInvoice.status,
        seller: { name: 'شركة الصالح القابضة', vatNumber: '310123456789012' },
        buyer: { name: isRTL ? 'عميل' : 'Customer' },
        items: [{ description: isRTL ? (orderTitleAr || orderTitle) : orderTitle, quantity: 1, unitPrice: newInvoice.subtotal }],
        subtotal: newInvoice.subtotal,
        vatRate: newInvoice.vat_rate / 100,
        vatAmount: newInvoice.vat_amount,
        total: newInvoice.total,
        currency: newInvoice.currency,
        notes: orderDescription || undefined,
      };

      console.log('[PDF] CLICK', { kind: 'invoice', id: newInvoice.id });
      const success = await downloadInvoicePdf(invoiceData);
      if (!success) {
        toast({ title: isRTL ? 'خطأ في إنشاء الفاتورة' : 'Error generating invoice', variant: 'destructive' });
        return;
      }

      setInvoice(newInvoice);
      onInvoiceGenerated?.(newInvoice);

      toast({
        title: isRTL ? 'تم إنشاء الفاتورة بنجاح' : 'Invoice generated successfully',
      });
    } catch (err) {
      console.error('Error generating invoice:', err);
      toast({
        title: isRTL ? 'خطأ في إنشاء الفاتورة' : 'Error generating invoice',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Download invoice PDF
  const handleDownloadPDF = async () => {
    if (!invoice) return;

    try {
      console.log('[PDF] CLICK', { kind: 'invoice', id: invoice.id });

      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.invoice_number,
        date: invoice.created_at,
        dueDate: invoice.due_date || undefined,
        status: invoice.status,
        seller: { name: 'شركة الصالح القابضة', vatNumber: '310123456789012' },
        buyer: { name: isRTL ? 'عميل' : 'Customer' },
        items: [{ description: isRTL ? (orderTitleAr || orderTitle) : orderTitle, quantity: 1, unitPrice: invoice.subtotal }],
        subtotal: invoice.subtotal,
        vatRate: invoice.vat_rate / 100,
        vatAmount: invoice.vat_amount,
        total: invoice.total,
        currency: invoice.currency,
        notes: orderDescription || undefined,
      };

      const success = await downloadInvoicePdf(invoiceData);
      if (!success) {
        toast({ title: isRTL ? 'خطأ في تحميل الفاتورة' : 'Error downloading invoice', variant: 'destructive' });
        return;
      }

      toast({
        title: isRTL ? 'تم تحميل الفاتورة' : 'Invoice downloaded',
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast({
        title: isRTL ? 'خطأ في تحميل الفاتورة' : 'Error downloading invoice',
        description: err instanceof Error ? err.message : String(err),
        variant: 'destructive',
      });
    }
  };

  // Handle Pay Now - Create Paylink invoice and redirect
  const handlePayNow = async () => {
    if (!invoice) return;

    try {
      const result = await createPayment.mutateAsync(invoice.id);
      
      if (result.success && result.payment_url) {
        toast({
          title: isRTL ? 'جاري التوجيه إلى صفحة الدفع...' : 'Redirecting to payment page...',
        });
        // Redirect to Paylink payment page
        redirectToPayment(result.payment_url);
      } else {
        throw new Error(result.error || 'Failed to create payment');
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
      toast({
        title: isRTL ? 'خطأ في بدء عملية الدفع' : 'Error initiating payment',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  // No invoice exists
  if (!invoice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border bg-card"
      >
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Receipt className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            {isRTL ? 'الفاتورة' : 'Invoice'}
          </span>
        </div>
        
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {isRTL ? 'لا توجد فاتورة بعد' : 'No invoice yet'}
          </p>
          
          {isAdmin && customerId && (
            <Button
              onClick={handleGenerateInvoice}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRTL ? 'جاري الإنشاء...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" />
                  {isRTL ? 'توليد الفاتورة' : 'Generate Invoice'}
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  const canPayNow = !isAdmin && invoice.status !== 'paid' && invoice.status !== 'cancelled';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border bg-card"
    >
      <InvoiceView
        invoice={viewModel}
        isLoading={false}
        onDownload={handleDownloadPDF}
        onPayNow={canPayNow ? handlePayNow : undefined}
      />
    </motion.div>
  );
}

