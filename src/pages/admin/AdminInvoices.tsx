import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Eye, 
  Download, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
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
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

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
      toast({
        title: "خطأ في جلب الفواتير",
        description: "حدث خطأ أثناء جلب بيانات الفواتير",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    totalAmount: invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0)
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
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة الفواتير</h1>
        <p className="text-muted-foreground">عرض وإدارة جميع فواتير العملاء</p>
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

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/10 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المبلغ</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalAmount.toLocaleString()} ر.س</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <DollarSign className="h-6 w-6 text-blue-600" />
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
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
};

export default AdminInvoices;