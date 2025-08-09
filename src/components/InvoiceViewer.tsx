import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Mail, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  offer_title: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  issue_date: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  transaction_id?: string;
}

interface InvoiceViewerProps {
  transactionId?: string;
  className?: string;
}

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ 
  transactionId, 
  className = "" 
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (transactionId) {
      fetchInvoice();
    }
  }, [transactionId]);

  const fetchInvoice = async () => {
    if (!transactionId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (error) throw error;
      setInvoice(data);
    } catch (error) {
      console.error('خطأ في جلب الفاتورة:', error);
      toast.error('فشل في تحميل الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    if (!transactionId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('invoice-system', {
        body: { 
          transactionId,
          action: 'generate'
        }
      });

      if (error) throw error;
      
      setInvoice(data.invoice);
      toast.success('تم إنشاء الفاتورة بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء الفاتورة:', error);
      toast.error('فشل في إنشاء الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async () => {
    if (!transactionId) return;
    
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('invoice-system', {
        body: { 
          transactionId,
          action: 'send'
        }
      });

      if (error) throw error;
      
      toast.success('تم إرسال الفاتورة بالإيميل');
      fetchInvoice(); // تحديث البيانات
    } catch (error) {
      console.error('خطأ في إرسال الفاتورة:', error);
      toast.error('فشل في إرسال الفاتورة');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PAID': { variant: 'default' as const, text: 'مدفوع', className: 'bg-green-500' },
      'PENDING': { variant: 'secondary' as const, text: 'في الانتظار', className: 'bg-yellow-500' },
      'FAILED': { variant: 'destructive' as const, text: 'فشل', className: 'bg-red-500' },
      'generated': { variant: 'outline' as const, text: 'تم الإنشاء', className: 'bg-blue-500' },
      'sent': { variant: 'default' as const, text: 'تم الإرسال', className: 'bg-purple-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { variant: 'outline' as const, text: status, className: 'bg-gray-500' };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2">جاري التحميل...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          نظام الفواتير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!invoice ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">لم يتم إنشاء فاتورة لهذه المعاملة بعد</p>
            <Button onClick={generateInvoice} disabled={loading}>
              <FileText className="w-4 h-4 mr-2" />
              إنشاء فاتورة
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* معلومات الفاتورة الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">رقم الفاتورة</label>
                <p className="font-mono text-lg font-bold">{invoice.invoice_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">طريقة الدفع</label>
                <div className="mt-1">
                  <span className="text-sm">{invoice.payment_method || 'غير محدد'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">اسم العميل</label>
                <p className="font-medium">{invoice.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">حالة الفاتورة</label>
                <div className="mt-1">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            </div>

            {/* تفاصيل الخدمة */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">الخدمة</label>
              <p className="text-lg">{invoice.offer_title}</p>
            </div>

            {/* تفاصيل المبالغ */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold">تفاصيل المبالغ</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المبلغ:</span>
                  <span>{invoice.amount} {invoice.currency}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>المجموع:</span>
                  <span>{invoice.amount} {invoice.currency}</span>
                </div>
              </div>
            </div>

            {/* التواريخ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">تاريخ الإصدار</label>
                <p>{new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</p>
              </div>
              {invoice.due_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تاريخ الاستحقاق</label>
                  <p>{new Date(invoice.due_date).toLocaleDateString('ar-SA')}</p>
                </div>
              )}
            </div>

            {/* الملاحظات */}
            {invoice.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">ملاحظات</label>
                <p className="mt-1 p-3 bg-muted/50 rounded-lg">{invoice.notes}</p>
              </div>
            )}

            {/* أزرار العمليات */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={sendInvoice} 
                disabled={sending}
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                {sending ? 'جاري الإرسال...' : 'إرسال بالإيميل'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                طباعة
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchInvoice}
              >
                <Eye className="w-4 h-4 mr-2" />
                تحديث
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};