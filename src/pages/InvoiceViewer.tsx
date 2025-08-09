import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, FileText, Printer, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  offer_title: string;
  created_at: string;
  due_date?: string;
  notes?: string;
  issue_date: string;
}

const InvoiceViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('خطأ في جلب بيانات الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'في الانتظار', variant: 'secondary' as const },
      sent: { label: 'تم الإرسال', variant: 'default' as const },
      paid: { label: 'مدفوع', variant: 'default' as const },
      overdue: { label: 'متأخر', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return (
      <Badge variant={statusInfo.variant} className="font-arabic">
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusMap = {
      pending: { label: 'في انتظار الدفع', variant: 'secondary' as const },
      paid: { label: 'مدفوع', variant: 'default' as const },
      failed: { label: 'فشل الدفع', variant: 'destructive' as const },
      cancelled: { label: 'ملغي', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[paymentStatus as keyof typeof statusMap] || { label: paymentStatus, variant: 'secondary' as const };
    return (
      <Badge variant={statusInfo.variant} className="font-arabic">
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لم يتم العثور على الفاتورة</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold">عرض الفاتورة</h1>
            <p className="text-muted-foreground">فاتورة رقم: {invoice.invoice_number}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              طباعة
            </Button>
          </div>
        </div>

        {/* Invoice */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="text-center border-b">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">شركة إمكان للحلول الرقمية</h1>
              <p className="text-muted-foreground">EMKAN Digital Solutions Company</p>
              <div className="flex justify-center gap-4 print:hidden">
                {getStatusBadge(invoice.status)}
                {getPaymentStatusBadge(invoice.payment_status)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">معلومات الفاتورة</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم الفاتورة:</span>
                    <span className="font-medium">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الإصدار:</span>
                    <span>{new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  {invoice.due_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الاستحقاق:</span>
                      <span>{new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">معلومات العميل</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span className="font-medium">{invoice.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span>{invoice.customer_email}</span>
                  </div>
                  {invoice.customer_phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الهاتف:</span>
                      <span>{invoice.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">تفاصيل الخدمة</h3>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{invoice.offer_title}</h4>
                    {invoice.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{invoice.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{invoice.amount} {invoice.currency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>المجموع الكلي:</span>
                <span className="text-2xl text-primary">{invoice.amount} {invoice.currency}</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
              <p className="font-medium">شركة إمكان للحلول الرقمية</p>
              <p>المملكة العربية السعودية</p>
              <p>الهاتف: 920033442 | البريد الإلكتروني: info@emkan.solutions</p>
              <p>الموقع الإلكتروني: www.emkan.solutions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceViewer;