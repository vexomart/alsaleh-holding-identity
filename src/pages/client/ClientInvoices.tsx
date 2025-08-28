import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { MobileOptimizer } from '@/components/MobileOptimizer';
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
  Trash2
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
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <MobileOptimizer>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center sm:text-right">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">نظام الفواتير المتقدم</h1>
          <p className="text-sm sm:text-base text-muted-foreground">إدارة شاملة للفواتير مع ربط العملاء والمدفوعات</p>
        </div>

        {/* Stats Cards */}
        <ResponsiveGrid cols={isMobile ? "1-2" : "1-2-4"} gap="sm">
          <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between p-2 sm:p-4">
              <div className="text-right">
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-600 dark:text-blue-400`}>{stats.total}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700 dark:text-blue-300`}>إجمالي الفواتير</div>
              </div>
              <FileText className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-500`} />
            </div>
          </ResponsiveCard>

          <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between p-2 sm:p-4">
              <div className="text-right">
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600 dark:text-green-400`}>{stats.paid}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-700 dark:text-green-300`}>فواتير مدفوعة</div>
              </div>
              <CheckCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-green-500`} />
            </div>
          </ResponsiveCard>

          <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between p-2 sm:p-4">
              <div className="text-right">
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-yellow-600 dark:text-yellow-400`}>{stats.pending}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-700 dark:text-yellow-300`}>في الانتظار</div>
              </div>
              <Clock className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-500`} />
            </div>
          </ResponsiveCard>

          <ResponsiveCard size="sm" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between p-2 sm:p-4">
              <div className="text-right">
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-purple-600 dark:text-purple-400`}>
                  {stats.totalAmount.toLocaleString()} ر.س
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-purple-700 dark:text-purple-300`}>إجمالي المبلغ</div>
              </div>
              <DollarSign className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-purple-500`} />
            </div>
          </ResponsiveCard>
      </ResponsiveGrid>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="حالة الفاتورة" />
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
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="حالة الدفع" />
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
            </div>
          </CardContent>
        </Card>

        {/* Invoices Grid */}
        {filteredInvoices.length > 0 ? (
          <ResponsiveGrid cols={isMobile ? "1-2" : "1-2-3"} gap={isMobile ? "sm" : "md"}>
            {filteredInvoices.map((invoice) => (
              <ResponsiveCard key={invoice.id} size={isMobile ? "sm" : "md"} className="hover-scale">
                <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-3 sm:space-y-4`}>
                  <div className="text-center sm:text-right">
                    <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} text-foreground mb-2`}>
                      فاتورة رقم {invoice.invoice_number}
                    </h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground line-clamp-2`}>
                      {invoice.offer_title}
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <Badge className={`${getStatusColor(invoice.status)} ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
                      {getStatusText(invoice.status)}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusColor(invoice.payment_status)} ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
                      {getPaymentStatusText(invoice.payment_status)}
                    </Badge>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground mb-1`}>المبلغ</div>
                    <div className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'} text-primary`}>
                      {parseFloat(invoice.amount.toString()).toLocaleString()} {invoice.currency}
                    </div>
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'} text-xs sm:text-sm text-muted-foreground`}>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ الإصدار: {new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Clock className="w-4 h-4" />
                      <span>الاستحقاق: {new Date(invoice.due_date || invoice.issue_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                  <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2'} pt-4 border-t`}>
                    <Button size={isMobile ? "sm" : "default"} variant="outline" className={isMobile ? "w-full text-xs" : "flex-1"}>
                      <Eye className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                    <div className={`${isMobile ? 'grid grid-cols-3 gap-1' : 'flex gap-2'}`}>
                      <Button size={isMobile ? "sm" : "default"} variant="outline" className={isMobile ? "text-xs px-2" : ""}>
                        <Download className="w-4 h-4" />
                        {!isMobile && <span className="mr-2">تحميل</span>}
                      </Button>
                      {invoice.payment_status === 'pending' && (
                        <Button size={isMobile ? "sm" : "default"} variant="default" className={isMobile ? "text-xs px-2" : ""}>
                          <CreditCard className="w-4 h-4" />
                          {!isMobile && <span className="mr-2">دفع</span>}
                        </Button>
                      )}
                      <Button 
                        size={isMobile ? "sm" : "default"} 
                        variant="destructive" 
                        className={isMobile ? "text-xs px-2" : ""}
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        disabled={deletingId === invoice.id}
                      >
                        {deletingId === invoice.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {!isMobile && <span className="mr-2">حذف</span>}
                      </Button>
                    </div>
                  </div>
                </div>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
        ) : (
          <Card>
            <CardContent className={`${isMobile ? 'p-6' : 'p-12'} text-center`}>
              <FileText className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-muted-foreground mx-auto mb-4`} />
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-foreground mb-2`}>لا توجد فواتير</h3>
              <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' 
                  ? 'لا توجد فواتير مطابقة لمعايير البحث'
                  : 'لم يتم إنشاء أي فواتير لحسابك حتى الآن'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileOptimizer>
  );
}