import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, FileText, User, Calendar } from 'lucide-react';

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

const InvoiceAdmin = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    amount: '',
    offer_title: '',
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('خطأ في جلب الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    if (!newInvoice.customer_name || !newInvoice.customer_email || !newInvoice.amount || !newInvoice.offer_title) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('invoice-system', {
        body: {
          action: 'generate',
          customer: {
            name: newInvoice.customer_name,
            email: newInvoice.customer_email,
            phone: newInvoice.customer_phone
          },
          invoice: {
            amount: parseFloat(newInvoice.amount),
            currency: 'SAR',
            offer_title: newInvoice.offer_title,
            notes: newInvoice.notes
          }
        }
      });

      if (error) throw error;

      toast.success('تم إنشاء الفاتورة بنجاح');
      setNewInvoice({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        amount: '',
        offer_title: '',
        notes: ''
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('خطأ في إنشاء الفاتورة');
    }
  };

  const sendInvoice = async (invoiceId: string) => {
    setSending(invoiceId);
    try {
      const { data, error } = await supabase.functions.invoke('invoice-system', {
        body: {
          action: 'send',
          invoiceId: invoiceId
        }
      });

      if (error) throw error;

      toast.success('تم إرسال الفاتورة بنجاح');
      fetchInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('خطأ في إرسال الفاتورة');
    } finally {
      setSending(null);
    }
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">إدارة الفواتير</h1>
          <p className="text-muted-foreground">إنشاء وإرسال الفواتير للعملاء</p>
        </div>

        {/* Create New Invoice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إنشاء فاتورة جديدة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">اسم العميل *</Label>
                <Input
                  id="customer_name"
                  value={newInvoice.customer_name}
                  onChange={(e) => setNewInvoice({...newInvoice, customer_name: e.target.value})}
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <Label htmlFor="customer_email">بريد العميل الإلكتروني *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={newInvoice.customer_email}
                  onChange={(e) => setNewInvoice({...newInvoice, customer_email: e.target.value})}
                  placeholder="أدخل بريد العميل"
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">رقم الهاتف</Label>
                <Input
                  id="customer_phone"
                  value={newInvoice.customer_phone}
                  onChange={(e) => setNewInvoice({...newInvoice, customer_phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="amount">المبلغ (ريال سعودي) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="offer_title">عنوان الخدمة *</Label>
                <Input
                  id="offer_title"
                  value={newInvoice.offer_title}
                  onChange={(e) => setNewInvoice({...newInvoice, offer_title: e.target.value})}
                  placeholder="أدخل عنوان الخدمة"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                  placeholder="أدخل أي ملاحظات إضافية"
                />
              </div>
            </div>
            <Button onClick={createInvoice} className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              إنشاء الفاتورة
            </Button>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>الفواتير الحالية</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد فواتير</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{invoice.invoice_number}</h3>
                          {getStatusBadge(invoice.status)}
                          {getPaymentStatusBadge(invoice.payment_status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.offer_title}</p>
                        {invoice.notes && (
                          <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            ملاحظات: {invoice.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{invoice.amount} {invoice.currency}</p>
                        <p className="text-sm text-muted-foreground">
                          تاريخ الإصدار: {new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('ar-SA')}
                        </p>
                        {invoice.due_date && (
                          <p className="text-xs text-muted-foreground">
                            تاريخ الاستحقاق: {new Date(invoice.due_date).toLocaleDateString('ar-SA')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {invoice.customer_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.customer_email}
                      </div>
                      {invoice.customer_phone && (
                        <div>{invoice.customer_phone}</div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => sendInvoice(invoice.id)}
                        disabled={sending === invoice.id}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {sending === invoice.id ? 'جاري الإرسال...' : 'إرسال الفاتورة'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/invoice-viewer/${invoice.id}`, '_blank')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        عرض PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceAdmin;