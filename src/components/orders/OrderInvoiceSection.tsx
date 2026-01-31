/**
 * OrderInvoiceSection - Invoice display/actions for Order Details
 * Uses html2canvas + jsPDF for proper Arabic RTL PDF generation
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Receipt, 
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  getInvoiceByOrderId, 
  createInvoice, 
  orderHasInvoice,
  type Invoice,
  type InvoiceStatus 
} from '@/lib/api/invoices';
import { generateInvoicePDFDirect, type InvoiceTemplateData } from '@/components/pdf/InvoicePDFGenerator';

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

const statusConfig: Record<InvoiceStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    icon: FileText,
  },
  issued: {
    labelAr: 'صادرة',
    labelEn: 'Issued',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    icon: Receipt,
  },
  paid: {
    labelAr: 'مدفوعة',
    labelEn: 'Paid',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: 'ملغاة',
    labelEn: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    icon: XCircle,
  },
  overdue: {
    labelAr: 'متأخرة',
    labelEn: 'Overdue',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50',
    icon: AlertCircle,
  },
};

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
  const [downloading, setDownloading] = useState(false);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

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

      // Generate PDF using new HTML-based generator
      const invoiceData: InvoiceTemplateData = {
        invoiceNumber: newInvoice.invoice_number,
        orderNumber: orderNumber,
        issueDate: new Date(newInvoice.created_at),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: newInvoice.status,
        customer: {
          name: 'عميل',
          nameAr: 'عميل',
          email: 'customer@example.com',
        },
        items: [{
          description: orderTitle,
          descriptionAr: orderTitleAr || orderTitle,
          quantity: 1,
          unitPrice: newInvoice.subtotal,
          total: newInvoice.subtotal,
        }],
        subtotal: newInvoice.subtotal,
        taxRate: newInvoice.vat_rate,
        taxAmount: newInvoice.vat_amount,
        total: newInvoice.total,
        currency: newInvoice.currency,
        notes: orderDescription || undefined,
      };

      await generateInvoicePDFDirect(invoiceData, { 
        download: true, 
        filename: `invoice-${newInvoice.invoice_number}.pdf` 
      });

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
      setDownloading(true);

      // Generate PDF using new HTML-based generator
      const invoiceData: InvoiceTemplateData = {
        invoiceNumber: invoice.invoice_number,
        orderNumber: orderNumber,
        issueDate: new Date(invoice.created_at),
        dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
        status: invoice.status,
        customer: {
          name: 'عميل',
          nameAr: 'عميل',
          email: 'customer@example.com',
        },
        items: [{
          description: orderTitle,
          descriptionAr: orderTitleAr || orderTitle,
          quantity: 1,
          unitPrice: invoice.subtotal,
          total: invoice.subtotal,
        }],
        subtotal: invoice.subtotal,
        taxRate: invoice.vat_rate,
        taxAmount: invoice.vat_amount,
        total: invoice.total,
        currency: invoice.currency,
        notes: orderDescription || undefined,
      };

      await generateInvoicePDFDirect(invoiceData, { 
        download: true, 
        filename: `invoice-${invoice.invoice_number}.pdf` 
      });

      toast({
        title: isRTL ? 'تم تحميل الفاتورة' : 'Invoice downloaded',
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast({
        title: isRTL ? 'خطأ في تحميل الفاتورة' : 'Error downloading invoice',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
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

  // Invoice exists - show details
  const statusInfo = statusConfig[invoice.status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Receipt className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            {isRTL ? 'الفاتورة' : 'Invoice'}
          </span>
        </div>
        <Badge className={cn("gap-1", statusInfo.bgColor, statusInfo.color)}>
          <StatusIcon className="h-3 w-3" />
          {isRTL ? statusInfo.labelAr : statusInfo.labelEn}
        </Badge>
      </div>

      {/* Invoice Number (LTR inside RTL) */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">
          {isRTL ? 'رقم الفاتورة' : 'Invoice Number'}
        </p>
        <p className="font-mono text-sm font-semibold" dir="ltr">
          {invoice.invoice_number}
        </p>
      </div>

      {/* Date */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">
          {isRTL ? 'تاريخ الإصدار' : 'Issue Date'}
        </p>
        <p className="text-sm font-medium">
          {formatDate(invoice.created_at)}
        </p>
      </div>

      <Separator className="my-4" />

      {/* VAT Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {isRTL ? 'المبلغ الأساسي' : 'Subtotal'}
          </span>
          <span className="font-medium" dir="ltr">
            {formatCurrency(invoice.subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {isRTL ? `ضريبة القيمة المضافة (${invoice.vat_rate}%)` : `VAT (${invoice.vat_rate}%)`}
          </span>
          <span className="font-medium" dir="ltr">
            {formatCurrency(invoice.vat_amount)}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base">
          <span className="font-semibold">
            {isRTL ? 'الإجمالي' : 'Total'}
          </span>
          <span className="font-bold text-primary" dir="ltr">
            {formatCurrency(invoice.total)}
          </span>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-4 pt-4 border-t">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          variant="outline"
          className="w-full gap-2"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isRTL ? 'جاري التحميل...' : 'Downloading...'}
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              {isRTL ? 'تحميل الفاتورة PDF' : 'Download Invoice PDF'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
