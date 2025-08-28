import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Search, 
  Calendar, 
  DollarSign,
  Download,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Bell,
  RefreshCw,
  Filter,
  TrendingUp,
  Receipt,
  Building,
  Smartphone,
  Monitor
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  payment_status: string;
  issue_date: string;
  due_date: string;
  created_at: string;
  offer_title: string;
  currency: string;
}

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchInvoices();
    setupRealtimeUpdates();
  }, []);

  const fetchInvoices = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "خطأ في جلب الفواتير",
        description: "حدث خطأ أثناء جلب الفواتير. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealtimeUpdates = () => {
    const channel = supabase
      .channel('invoice_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'invoices' },
        (payload) => {
          console.log('Invoice update received:', payload);
          if (payload.eventType === 'INSERT') {
            setInvoices(prev => [payload.new as Invoice, ...prev]);
            toast({
              title: "فاتورة جديدة",
              description: `تم إنشاء فاتورة جديدة رقم ${(payload.new as Invoice).invoice_number}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setInvoices(prev => prev.map(inv => 
              inv.id === payload.new.id ? payload.new as Invoice : inv
            ));
            toast({
              title: "تحديث الفاتورة",
              description: `تم تحديث الفاتورة رقم ${(payload.new as Invoice).invoice_number}`,
            });
          } else if (payload.eventType === 'DELETE') {
            setInvoices(prev => prev.filter(inv => inv.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'sent': 'مرسلة',
      'paid': 'مدفوعة',
      'overdue': 'متأخرة',
      'cancelled': 'ملغية'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'sent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'processing': 'قيد المعالجة',
      'completed': 'مكتملة',
      'failed': 'فشلت',
      'refunded': 'مستردة'
    };
    return statusMap[status] || status;
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      return;
    }

    setDeletingId(invoiceId);
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "خطأ في حذف الفاتورة",
          description: "حدث خطأ أثناء حذف الفاتورة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        return;
      }

      // إزالة الفاتورة من القائمة المحلية
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      
      toast({
        title: "تم حذف الفاتورة",
        description: "تم حذف الفاتورة بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.offer_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || invoice.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.payment_status === 'completed').length,
    pending: invoices.filter(i => i.payment_status === 'pending').length,
    totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-muted-foreground">جاري تحميل الفواتير...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            نظام الفواتير المتطور
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            إدارة شاملة ومتقدمة للفواتير مع إشعارات لحظية وتصميم متجاوب
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button 
              onClick={fetchInvoices} 
              disabled={refreshing}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="bg-white/50 backdrop-blur-sm hover:bg-white/80"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg border">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">كمبيوتر</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg border">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">موبايل</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-200/50 dark:border-blue-800/50 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">إجمالي الفواتير</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    النشاط الكلي
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-200/50 dark:border-green-800/50 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">فواتير مدفوعة</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.paid}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    مكتملة
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/50 dark:border-amber-800/50 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">في الانتظار</p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    قيد المعالجة
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/50 dark:border-purple-800/50 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">إجمالي المبلغ</p>
                  <p className="text-2xl lg:text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {stats.totalAmount.toLocaleString()} ر.س
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    القيمة الإجمالية
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">البحث والتصفية</CardTitle>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <Bell className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">{unreadCount} إشعار جديد</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="البحث في الفواتير باستخدام رقم الفاتورة أو اسم الخدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 text-right h-12 bg-white/70 backdrop-blur-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">حالة الفاتورة</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/70 backdrop-blur-sm">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="sent">مرسلة</SelectItem>
                    <SelectItem value="paid">مدفوعة</SelectItem>
                    <SelectItem value="overdue">متأخرة</SelectItem>
                    <SelectItem value="cancelled">ملغية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">حالة الدفع</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="bg-white/70 backdrop-blur-sm">
                    <SelectValue placeholder="اختر حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                    <SelectItem value="failed">فشلت</SelectItem>
                    <SelectItem value="refunded">مستردة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">عرض سريع</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setPaymentFilter('pending');
                    }}
                    className="flex-1 bg-white/70 backdrop-blur-sm"
                  >
                    غير مدفوعة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setPaymentFilter('completed');
                    }}
                    className="flex-1 bg-white/70 backdrop-blur-sm"
                  >
                    مدفوعة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Invoices Display */}
        {filteredInvoices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            #{invoice.invoice_number}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {invoice.offer_title}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(invoice.status)} variant="secondary">
                        {getStatusText(invoice.status)}
                      </Badge>
                      <Badge className={getStatusColor(invoice.payment_status)} variant="outline">
                        {getPaymentStatusText(invoice.payment_status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Amount Display */}
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg border border-primary/10">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">المبلغ الإجمالي</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {parseFloat(invoice.amount.toString()).toLocaleString()} {invoice.currency}
                      </p>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                        <p className="font-medium">{new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">تاريخ الاستحقاق</p>
                        <p className="font-medium">{new Date(invoice.due_date || invoice.issue_date).toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200/50">
                    <Button variant="outline" size="sm" className="w-full bg-white/50 backdrop-blur-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-white/50 backdrop-blur-sm">
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                    
                    {invoice.payment_status === 'pending' && (
                      <Button variant="default" size="sm" className="w-full col-span-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                        <CreditCard className="w-4 h-4 mr-2" />
                        دفع الفاتورة
                      </Button>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full col-span-2 mt-2"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      disabled={deletingId === invoice.id}
                    >
                      {deletingId === invoice.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      حذف الفاتورة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-6">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد فواتير</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' 
                  ? 'لا توجد فواتير مطابقة لمعايير البحث الحالية'
                  : 'لم يتم إنشاء أي فواتير لحسابك حتى الآن. ستظهر الفواتير الجديدة هنا عند إنشائها.'
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                }}
                variant="outline"
                className="bg-white/50 backdrop-blur-sm"
              >
                إعادة تعيين المرشحات
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Company Branding Footer */}
        <div className="text-center py-8 mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-sm rounded-full border border-white/20">
            <Building className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">مدعوم من شركة آل الشيري القابضة</span>
          </div>
        </div>
      </div>
    </div>
  );
}