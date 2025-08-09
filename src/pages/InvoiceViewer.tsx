import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, FileText, Printer, ArrowLeft, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DigitalStamp from '@/components/DigitalStamp';

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
    <div className="min-h-screen bg-background p-4 font-arabic" dir="rtl" style={{ fontFamily: "'Cairo', 'Amiri', 'Segoe UI', 'Tahoma', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold">عرض الفاتورة</h1>
            <p className="text-muted-foreground">فاتورة رقم: {invoice.invoice_number}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
          </div>
        </div>

        {/* Invoice */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="relative border-b bg-gradient-to-l from-primary/5 to-primary/10">
            {/* Digital Stamp */}
            <DigitalStamp className="absolute top-4 left-4 print:opacity-100" />
            
            <div className="text-center space-y-4">
              {/* Company Logo Area */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-primary">شركة علي صالح الشهري القابضة</h1>
                <p className="text-lg text-muted-foreground font-semibold">Alsaleh Holding Company</p>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
              </div>

              {/* Company Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>920033442</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>info@alialshehriholding.com</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>www.alialshehriholding.com</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>المملكة العربية السعودية</span>
                </div>
              </div>

              {/* Invoice Status */}
              <div className="flex justify-center gap-4 print:hidden">
                {getStatusBadge(invoice.status)}
                {getPaymentStatusBadge(invoice.payment_status)}
              </div>

              {/* Invoice Title */}
              <div className="pt-4">
                <h2 className="text-2xl font-bold text-primary">فـــاتــــورة</h2>
                <p className="text-lg font-semibold text-muted-foreground">INVOICE</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Invoice & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Invoice Details */}
              <div className="bg-primary/5 p-6 rounded-lg border-r-4 border-primary">
                <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  معلومات الفاتورة
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-primary/20">
                    <span className="text-muted-foreground font-medium">رقم الفاتورة:</span>
                    <span className="font-bold text-primary">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary/20">
                    <span className="text-muted-foreground font-medium">تاريخ الإصدار:</span>
                    <span className="font-semibold">{new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  {invoice.due_date && (
                    <div className="flex justify-between items-center py-2 border-b border-primary/20">
                      <span className="text-muted-foreground font-medium">تاريخ الاستحقاق:</span>
                      <span className="font-semibold text-orange-600">{new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">العملة:</span>
                    <span className="font-semibold">{invoice.currency}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-muted/50 p-6 rounded-lg border-r-4 border-muted-foreground">
                <h3 className="font-bold text-lg mb-4 text-muted-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  معلومات العميل
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-muted-foreground/20">
                    <span className="text-muted-foreground font-medium">الاسم:</span>
                    <span className="font-bold">{invoice.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-muted-foreground/20">
                    <span className="text-muted-foreground font-medium">البريد الإلكتروني:</span>
                    <span className="font-semibold text-blue-600">{invoice.customer_email}</span>
                  </div>
                  {invoice.customer_phone && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">الهاتف:</span>
                      <span className="font-semibold">{invoice.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gradient-to-l from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="font-bold text-xl mb-6 text-primary text-center">تفاصيل الخدمة المقدمة</h3>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-primary mb-2">{invoice.offer_title}</h4>
                    {invoice.notes && (
                      <div className="bg-muted/50 p-3 rounded border-r-4 border-primary">
                        <p className="text-sm font-medium text-muted-foreground mb-1">تفاصيل إضافية:</p>
                        <p className="text-sm">{invoice.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">قيمة الخدمة الأساسية:</span>
                    <span className="font-semibold">{invoice.amount} {invoice.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>{(Number(invoice.amount) * 0.15).toFixed(2)} {invoice.currency}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-xl font-bold text-primary">
                      <span>المجموع الكلي شامل الضريبة:</span>
                      <span className="text-2xl">{(Number(invoice.amount) * 1.15).toFixed(2)} {invoice.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <h3 className="font-bold text-lg mb-3">حالة الدفع</h3>
              <div className="flex justify-center">
                {getPaymentStatusBadge(invoice.payment_status)}
              </div>
            </div>

            {/* Company Footer */}
            <div className="border-t pt-8 space-y-6">
              {/* Company Seal Section */}
              <div className="text-center">
                <div className="inline-flex items-center gap-4 bg-primary/5 p-4 rounded-lg">
                  <DigitalStamp className="opacity-60" />
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">ختم الشركة الرقمي</p>
                    <p className="text-sm text-muted-foreground">Digital Company Seal</p>
                    <p className="text-xs text-muted-foreground mt-1">معتمد إلكترونياً - Digitally Certified</p>
                  </div>
                </div>
              </div>

              {/* Legal & Contact Info */}
              <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-bold mb-1">المعلومات التجارية</p>
                    <p>السجل التجاري: [رقم السجل]</p>
                    <p>الرقم الضريبي: [الرقم الضريبي]</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">معلومات التواصل</p>
                    <p>هاتف: 920033442</p>
                    <p>بريد: info@alialshehriholding.com</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">العنوان</p>
                    <p>المملكة العربية السعودية</p>
                    <p>www.alialshehriholding.com</p>
                  </div>
                </div>
                
                <div className="border-t border-primary-foreground/20 pt-4">
                  <p className="text-xs opacity-90">
                    هذه الفاتورة صادرة إلكترونياً من شركة علي صالح الشهري القابضة وهي معتمدة ولا تحتاج لتوقيع
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    This invoice is digitally issued by Alsaleh Holding Company and is certified without requiring signature
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceViewer;