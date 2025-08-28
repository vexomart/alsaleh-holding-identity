import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Search, 
  Eye, 
  Download, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Mail,
  Edit,
  Trash2,
  Users,
  Filter,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';

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
  issue_date: string;
  due_date?: string;
  offer_title: string;
  notes?: string;
  payment_method?: string;
  client_id?: string;
  user_id?: string;
  transaction_id?: string;
}

interface Client {
  id: string;
  legal_name: string;
  billing_email: string;
  phone?: string;
  status: string;
}

interface NewInvoice {
  client_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  offer_title: string;
  notes?: string;
  due_date?: string;
  payment_method?: string;
}

const AdminInvoicesEnhanced = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [processingPDF, setProcessingPDF] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    client_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    amount: 0,
    currency: 'SAR',
    offer_title: '',
    notes: '',
    due_date: '',
    payment_method: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
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
      toast({
        title: "خطأ في جلب الفواتير",
        description: "حدث خطأ أثناء جلب بيانات الفواتير",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, legal_name, billing_email, phone, status')
        .eq('status', 'active')
        .order('legal_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.customer_name || !newInvoice.customer_email || !newInvoice.amount || !newInvoice.offer_title) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const dueDate = newInvoice.due_date ? new Date(newInvoice.due_date).toISOString() : null;
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          customer_name: newInvoice.customer_name,
          customer_email: newInvoice.customer_email.toLowerCase().trim(),
          customer_phone: newInvoice.customer_phone || null,
          amount: newInvoice.amount,
          currency: newInvoice.currency,
          offer_title: newInvoice.offer_title,
          notes: newInvoice.notes || null,
          due_date: dueDate,
          payment_method: newInvoice.payment_method || null,
          client_id: newInvoice.client_id || null,
          status: 'pending',
          payment_status: 'pending',
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setInvoices([data, ...invoices]);
      setShowCreateDialog(false);
      resetNewInvoice();

      toast({
        title: "تم إنشاء الفاتورة بنجاح",
        description: `تم إنشاء الفاتورة رقم ${data.invoice_number}`,
      });

      // إرسال إيميل الفاتورة
      try {
        await sendInvoiceEmail(data.id);
      } catch (emailError) {
        console.warn('فشل في إرسال إيميل الفاتورة:', emailError);
      }

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "خطأ في إنشاء الفاتورة",
        description: error.message || "حدث خطأ أثناء إنشاء الفاتورة",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const resetNewInvoice = () => {
    setNewInvoice({
      client_id: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      amount: 0,
      currency: 'SAR',
      offer_title: '',
      notes: '',
      due_date: '',
      payment_method: ''
    });
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setNewInvoice({
        ...newInvoice,
        client_id: clientId,
        customer_name: client.legal_name,
        customer_email: client.billing_email,
        customer_phone: client.phone || ''
      });
    }
  };

  const generateInvoicePDF = async (invoiceId: string) => {
    setProcessingPDF(invoiceId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoice_id: invoiceId }
      });

      if (error) throw error;

      // تحميل PDF
      const link = document.createElement('a');
      link.href = data.pdf_url;
      link.download = `invoice-${invoices.find(i => i.id === invoiceId)?.invoice_number}.pdf`;
      link.click();

      toast({
        title: "تم تحميل الفاتورة",
        description: "تم تحميل ملف PDF للفاتورة بنجاح",
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ في تحميل الفاتورة",
        description: error.message || "حدث خطأ أثناء تحميل الفاتورة",
        variant: "destructive",
      });
    } finally {
      setProcessingPDF(null);
    }
  };

  const sendInvoiceEmail = async (invoiceId: string) => {
    setSendingEmail(invoiceId);
    try {
      const { data, error } = await supabase.functions.invoke('invoice-email-sender', {
        body: { invoice_id: invoiceId }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الفاتورة",
        description: "تم إرسال الفاتورة عبر الإيميل بنجاح",
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "خطأ في إرسال الإيميل",
        description: error.message || "حدث خطأ أثناء إرسال الفاتورة",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'pending': return 'في الانتظار';
      case 'overdue': return 'متأخرة';
      case 'cancelled': return 'ملغية';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || invoice.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.payment_status === 'paid').length,
    pending: invoices.filter(i => i.payment_status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0),
    paidAmount: invoices.filter(i => i.payment_status === 'paid').reduce((sum, invoice) => sum + Number(invoice.amount), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل الفواتير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            نظام الفواتير المتقدم
          </h1>
          <p className="text-muted-foreground">إدارة شاملة للفواتير مع ربط العملاء والمدفوعات</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInvoices} size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إنشاء فاتورة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء فاتورة جديدة</DialogTitle>
                <DialogDescription>
                  أنشئ فاتورة جديدة لعميل موجود أو عميل جديد
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>اختيار عميل موجود (اختياري)</Label>
                  <Select onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر عميل من القائمة أو أدخل بيانات جديدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.legal_name} - {client.billing_email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_name">اسم العميل *</Label>
                  <Input
                    id="customer_name"
                    value={newInvoice.customer_name}
                    onChange={(e) => setNewInvoice({...newInvoice, customer_name: e.target.value})}
                    placeholder="أدخل اسم العميل"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_email">البريد الإلكتروني *</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={newInvoice.customer_email}
                    onChange={(e) => setNewInvoice({...newInvoice, customer_email: e.target.value})}
                    placeholder="customer@example.com"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">رقم الهاتف</Label>
                  <Input
                    id="customer_phone"
                    value={newInvoice.customer_phone}
                    onChange={(e) => setNewInvoice({...newInvoice, customer_phone: e.target.value})}
                    placeholder="+966501234567"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: Number(e.target.value)})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة</Label>
                  <Select value={newInvoice.currency} onValueChange={(value) => setNewInvoice({...newInvoice, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="offer_title">عنوان الخدمة *</Label>
                  <Input
                    id="offer_title"
                    value={newInvoice.offer_title}
                    onChange={(e) => setNewInvoice({...newInvoice, offer_title: e.target.value})}
                    placeholder="وصف الخدمة أو المنتج"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment_method">طريقة الدفع المفضلة</Label>
                  <Select value={newInvoice.payment_method} onValueChange={(value) => setNewInvoice({...newInvoice, payment_method: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">حوالة بنكية</SelectItem>
                      <SelectItem value="credit_card">بطاقة ائتمانية</SelectItem>
                      <SelectItem value="stc_pay">STC Pay</SelectItem>
                      <SelectItem value="tamara">تمارا</SelectItem>
                      <SelectItem value="tabby">تابي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                    placeholder="ملاحظات إضافية للفاتورة"
                    dir="rtl"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateInvoice} disabled={creating}>
                  {creating ? 'جارٍ الإنشاء...' : 'إنشاء الفاتورة'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي الفواتير</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/10 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">فواتير مدفوعة</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.paid}</p>
              <p className="text-xs text-emerald-600">{stats.paidAmount.toLocaleString()} ر.س</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg dark:bg-emerald-900/20">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/10 dark:to-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">في الانتظار</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg dark:bg-amber-900/20">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/10 dark:to-red-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">متأخرة</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters and Search */}
      <ResponsiveCard>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الفواتير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الفاتورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="overdue">متأخرة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدفوعات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="failed">فاشلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ResponsiveCard>

      {/* Invoices Grid */}
      {filteredInvoices.length === 0 ? (
        <ResponsiveCard className="text-center py-12">
          <div className="text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">لا توجد فواتير</p>
            <p className="text-sm">لا توجد فواتير تطابق معايير البحث</p>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredInvoices.map((invoice) => (
            <ResponsiveCard key={invoice.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{invoice.invoice_number}</h3>
                  <p className="text-sm text-muted-foreground truncate">{invoice.customer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{invoice.offer_title}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                  <Badge className={getStatusColor(invoice.payment_status)}>{getStatusText(invoice.payment_status)}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{invoice.amount} {invoice.currency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">{new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {setSelectedInvoice(invoice); setShowDetailsDialog(true);}}
                >
                  <Eye className="w-4 h-4 ml-2" />
                  عرض
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => generateInvoicePDF(invoice.id)}
                  disabled={processingPDF === invoice.id}
                >
                  {processingPDF === invoice.id ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-2" />
                  ) : (
                    <Download className="w-4 h-4 ml-2" />
                  )}
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => sendInvoiceEmail(invoice.id)}
                  disabled={sendingEmail === invoice.id}
                >
                  {sendingEmail === invoice.id ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-2" />
                  ) : (
                    <Mail className="w-4 h-4 ml-2" />
                  )}
                  إرسال
                </Button>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}

      {/* Invoice Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الفاتورة {selectedInvoice?.invoice_number}</DialogTitle>
            <DialogDescription>
              عرض تفاصيل الفاتورة الكاملة
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الفاتورة</Label>
                  <p className="text-lg font-semibold">{selectedInvoice.invoice_number}</p>
                </div>
                <div className="space-y-2">
                  <Label>حالة الفاتورة</Label>
                  <Badge className={getStatusColor(selectedInvoice.status)}>{getStatusText(selectedInvoice.status)}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>اسم العميل</Label>
                  <p>{selectedInvoice.customer_name}</p>
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <p>{selectedInvoice.customer_email}</p>
                </div>
                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <p className="text-lg font-semibold">{selectedInvoice.amount} {selectedInvoice.currency}</p>
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الإنشاء</Label>
                  <p>{new Date(selectedInvoice.issue_date).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>عنوان الخدمة</Label>
                  <p>{selectedInvoice.offer_title}</p>
                </div>
                {selectedInvoice.notes && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>ملاحظات</Label>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => generateInvoicePDF(selectedInvoice.id)}>
                  <Download className="w-4 h-4 ml-2" />
                  تحميل PDF
                </Button>
                <Button variant="outline" onClick={() => sendInvoiceEmail(selectedInvoice.id)}>
                  <Mail className="w-4 h-4 ml-2" />
                  إرسال بالإيميل
                </Button>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvoicesEnhanced;