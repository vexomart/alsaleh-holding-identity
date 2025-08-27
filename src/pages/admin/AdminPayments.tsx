import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Search, 
  Eye, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { useRealtimePayments } from '@/hooks/useRealtimePayments';

interface Payment {
  id: string;
  transaction_id?: string;
  reference_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  amount: number;
  currency?: string;
  status: string;
  payment_method: string;
  payment_date?: string;
  created_at: string;
  offer_title?: string;
  description?: string;
  transaction_type?: string;
  user_id?: string;
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPayments = async () => {
    try {
      // Fetch from payment_transactions
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentError) throw paymentError;

      // Fetch from wallet_transactions
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false});

      if (walletError) {
        console.warn('Error fetching wallet transactions:', walletError);
      }

      // Combine and normalize data
      const combinedPayments: Payment[] = [
        ...(paymentData || []).map(payment => ({
          ...payment,
          transaction_id: payment.transaction_id,
          customer_name: payment.customer_name,
          customer_email: payment.customer_email,
          currency: payment.currency || 'SAR'
        })),
        ...(walletData || []).map(wallet => ({
          ...wallet,
          transaction_id: wallet.reference_id,
          customer_name: wallet.customer_name || `عميل محفظة - ${wallet.reference_id}`,
          customer_email: wallet.customer_email || wallet.user_id || '',
          customer_phone: wallet.customer_phone || '',
          currency: 'SAR',
          offer_title: wallet.description || 'شحن محفظة',
          transaction_type: 'deposit'
        }))
      ];

      // Sort by created_at descending
      combinedPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPayments(combinedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "خطأ في جلب المدفوعات",
        description: "حدث خطأ أثناء جلب بيانات المدفوعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Use the realtime payments hook
  useRealtimePayments({
    onUpdate: fetchPayments,
    showNotifications: true
  });

  useEffect(() => {
    fetchPayments();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'success': 
      case 'paid': 
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'pending': 
      case 'processing': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'failed': 
      case 'rejected': 
      case 'cancelled': 
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'success': 
      case 'paid': 
        return 'مكتملة';
      case 'pending': 
        return 'في الانتظار';
      case 'processing': 
        return 'قيد المعالجة';
      case 'failed': 
        return 'فاشلة';
      case 'rejected': 
        return 'مرفوضة';
      case 'cancelled': 
        return 'ملغية';
      case 'refunded': 
        return 'مسترد';
      default: 
        return status || 'غير محدد';
    }
  };

  const getMethodText = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'tab': return 'تابي';
      case 'tamara': return 'تمارا';
      case 'stc': return 'STC Pay';
      case 'stc_pay': return 'STC Pay';
      case 'visa': return 'فيزا';
      case 'mastercard': return 'ماستركارد';
      case 'mada': return 'مدى';
      case 'paypal': return 'PayPal';
      case 'apple_pay': return 'Apple Pay';
      case 'google_pay': return 'Google Pay';
      case 'bank_transfer': return 'حوالة بنكية';
      case 'stripe': return 'بطاقة ائتمانية';
      default: return method || 'غير محدد';
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    if (!selectedPayment) return;

    setIsUpdating(true);
    try {
      const tableName = selectedPayment.transaction_type === 'deposit' ? 'wallet_transactions' : 'payment_transactions';
      
      // Validate status based on table type
      const validWalletStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
      
      if (tableName === 'wallet_transactions' && !validWalletStatuses.includes(newStatus)) {
        toast({
          title: "حالة غير صالحة",
          description: "الحالات المسموحة لمعاملات المحفظة: في الانتظار، مكتملة، فاشلة، ملغية",
          variant: "destructive",
        });
        return;
      }
      
      if (tableName === 'payment_transactions' && !validPaymentStatuses.includes(newStatus)) {
        toast({
          title: "حالة غير صالحة", 
          description: "الحالات المسموحة للمدفوعات: في الانتظار، قيد المعالجة، مكتملة، فاشلة، مسترد",
          variant: "destructive",
        });
        return;
      }
      
      // Update payment status
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', paymentId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Send notification email if customer email exists
      if (selectedPayment.customer_email) {
        try {
          const { error: emailError } = await supabase.functions.invoke('customer-notifications', {
            body: {
              type: 'payment_status_update',
              email: selectedPayment.customer_email,
              customer_name: selectedPayment.customer_name,
              payment_id: selectedPayment.transaction_id,
              amount: selectedPayment.amount,
              currency: selectedPayment.currency,
              old_status: selectedPayment.status,
              new_status: newStatus,
              payment_method: selectedPayment.payment_method
            }
          });

          if (emailError) {
            console.warn('Email notification failed:', emailError);
          }
        } catch (emailError) {
          console.warn('Failed to send notification email:', emailError);
        }
      }

      // Refresh payments data
      await fetchPayments();
      
      // Update selected payment
      setSelectedPayment(prev => prev ? { ...prev, status: newStatus } : null);

      toast({
        title: "تم تحديث حالة الدفع",
        description: `تم تغيير حالة الدفع إلى ${getStatusText(newStatus)}`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة الدفع",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status?.toLowerCase() === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.payment_method?.toLowerCase() === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate statistics
  const stats = {
    total: payments.length,
    completed: payments.filter(p => ['completed', 'success', 'paid'].includes(p.status?.toLowerCase())).length,
    pending: payments.filter(p => ['pending', 'processing'].includes(p.status?.toLowerCase())).length,
    failed: payments.filter(p => ['failed', 'rejected', 'cancelled'].includes(p.status?.toLowerCase())).length,
    totalAmount: payments
      .filter(p => ['completed', 'success', 'paid'].includes(p.status?.toLowerCase()))
      .reduce((sum, payment) => sum + Number(payment.amount), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل المدفوعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة المدفوعات</h1>
        <p className="text-muted-foreground">عرض وإدارة جميع المعاملات المالية</p>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المعاملات</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/10 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">مكتملة</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
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
              <p className="text-sm text-muted-foreground mb-1">إجمالي الأرباح</p>
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
                placeholder="البحث في المدفوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="failed">فاشلة</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="tab">تابي</SelectItem>
                <SelectItem value="tamara">تمارا</SelectItem>
                <SelectItem value="stc">STC Pay</SelectItem>
                <SelectItem value="mada">مدى</SelectItem>
                <SelectItem value="visa">فيزا</SelectItem>
                <SelectItem value="bank_transfer">حوالة بنكية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ResponsiveCard>

      {/* Payments Grid */}
      {filteredPayments.length === 0 ? (
        <ResponsiveCard className="text-center py-12">
          <div className="text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">لا توجد مدفوعات</p>
            <p className="text-sm">لا توجد معاملات تطابق معايير البحث</p>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredPayments.map((payment) => (
            <ResponsiveCard key={payment.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {payment.transaction_id || payment.reference_id}
                    {payment.transaction_type === 'deposit' && (
                      <span className="mr-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                        شحن محفظة
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{payment.customer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{payment.offer_title || payment.description}</p>
                </div>
                <Badge className={getStatusColor(payment.status)}>{getStatusText(payment.status)}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{payment.amount} {payment.currency || 'SAR'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">{getMethodText(payment.payment_method)}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {payment.payment_date 
                      ? new Date(payment.payment_date).toLocaleDateString('ar-SA')
                      : new Date(payment.created_at).toLocaleDateString('ar-SA')
                    }
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedPayment(payment);
                    setIsDetailsOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 ml-2" />
                  عرض التفاصيل
                </Button>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}

      {/* Payment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">تفاصيل المعاملة</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  رقم المعاملة: {selectedPayment?.transaction_id || selectedPayment?.reference_id}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-8 pt-6">
              {/* Status Banner */}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-lg border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">حالة المعاملة</p>
                      <Badge className={`${getStatusColor(selectedPayment.status)} text-sm px-4 py-2`}>
                        {getStatusText(selectedPayment.status)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">المبلغ</p>
                      <p className="text-2xl font-bold text-primary">
                        {selectedPayment.amount?.toLocaleString()} {selectedPayment.currency || 'SAR'}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">طريقة الدفع</p>
                    <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{getMethodText(selectedPayment.payment_method)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b">
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                      <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">معلومات العميل</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-card border rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground block mb-2">اسم العميل</label>
                      <p className="text-lg font-medium text-foreground">{selectedPayment.customer_name}</p>
                    </div>
                    
                    {selectedPayment.customer_email && (
                      <div className="bg-card border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground block mb-2">البريد الإلكتروني</label>
                        <p className="text-sm font-mono bg-muted px-3 py-2 rounded border break-all">
                          {selectedPayment.customer_email}
                        </p>
                      </div>
                    )}
                    
                    {selectedPayment.customer_phone && (
                      <div className="bg-card border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground block mb-2">رقم الهاتف</label>
                        <p className="text-sm font-mono bg-muted px-3 py-2 rounded border">
                          {selectedPayment.customer_phone}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-card border rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground block mb-2">وصف الخدمة</label>
                      <p className="text-sm text-foreground leading-relaxed">
                        {selectedPayment.offer_title || selectedPayment.description || 'غير محدد'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b">
                    <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900/20">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold">تفاصيل المعاملة</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-card border rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground block mb-2">رقم المعاملة</label>
                      <p className="text-sm font-mono bg-muted px-3 py-2 rounded border break-all">
                        {selectedPayment.transaction_id || selectedPayment.reference_id}
                      </p>
                    </div>
                    
                    <div className="bg-card border rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground block mb-2">تاريخ الإنشاء</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{new Date(selectedPayment.created_at).toLocaleString('ar-SA')}</p>
                      </div>
                    </div>
                    
                    {selectedPayment.payment_date && (
                      <div className="bg-card border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground block mb-2">تاريخ الدفع</label>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <p className="text-sm">{new Date(selectedPayment.payment_date).toLocaleString('ar-SA')}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedPayment.transaction_type && (
                      <div className="bg-card border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground block mb-2">نوع المعاملة</label>
                        <Badge variant="secondary" className="text-sm">
                          {selectedPayment.transaction_type === 'deposit' ? 'شحن محفظة' : selectedPayment.transaction_type}
                        </Badge>
                      </div>
                    )}

                    {selectedPayment.user_id && (
                      <div className="bg-card border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground block mb-2">معرف المستخدم</label>
                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded border break-all">
                          {selectedPayment.user_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">إدارة حالة المعاملة</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  يمكنك تغيير حالة المعاملة من هنا. سيتم إرسال إشعار للعميل عند تغيير الحالة.
                </p>
                <div className="flex items-center gap-3">
                  <Select onValueChange={(value) => updatePaymentStatus(selectedPayment.id, value)} disabled={isUpdating}>
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="تغيير الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">في الانتظار</SelectItem>
                      {selectedPayment.transaction_type !== 'deposit' && (
                        <SelectItem value="processing">قيد المعالجة</SelectItem>
                      )}
                      <SelectItem value="completed">مكتملة</SelectItem>
                      <SelectItem value="failed">فاشلة</SelectItem>
                      {selectedPayment.transaction_type === 'deposit' ? (
                        <SelectItem value="cancelled">ملغية</SelectItem>
                      ) : (
                        <SelectItem value="refunded">مسترد</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {isUpdating && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      جارٍ التحديث...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t bg-muted/30 -mx-6 px-6 pb-6 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                  className="min-w-24"
                >
                  <X className="w-4 h-4 ml-2" />
                  إغلاق
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    // Copy transaction ID to clipboard
                    navigator.clipboard.writeText(selectedPayment.transaction_id || selectedPayment.reference_id || '');
                    toast({
                      title: "تم النسخ",
                      description: "تم نسخ رقم المعاملة إلى الحافظة",
                    });
                  }}
                  className="min-w-24"
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  نسخ رقم المعاملة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;