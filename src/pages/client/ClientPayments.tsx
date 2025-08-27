import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useRealtimePayments } from '@/hooks/useRealtimePayments';
import { 
  CreditCard, 
  Search, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  RefreshCw,
  Banknote
} from 'lucide-react';

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

export default function ClientPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const fetchUserPayments = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "يجب تسجيل الدخول",
          description: "يرجى تسجيل الدخول لعرض مدفوعاتك",
          variant: "destructive",
        });
        return;
      }

      // Fetch user's payment transactions
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (paymentError) {
        console.error('Error fetching payments:', paymentError);
      }

      // Fetch user's wallet transactions
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (walletError) {
        console.error('Error fetching wallet transactions:', walletError);
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
          customer_name: wallet.customer_name || 'معاملة محفظة',
          customer_email: wallet.customer_email || user.email || '',
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
      console.error('Error fetching user payments:', error);
      toast({
        title: "خطأ في جلب المدفوعات",
        description: "حدث خطأ أثناء جلب بيانات المدفوعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current user and setup realtime updates
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);
  
  useRealtimePayments({
    onUpdate: fetchUserPayments,
    userId: currentUser?.id,
    showNotifications: true
  });

  useEffect(() => {
    fetchUserPayments();
  }, []);

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'success': 
      case 'paid': 
        return 'مكتمل';
      case 'pending': 
        return 'في الانتظار';
      case 'processing': 
        return 'قيد المعالجة';
      case 'failed': 
        return 'فشل';
      case 'rejected': 
        return 'مرفوض';
      case 'cancelled': 
        return 'ملغي';
      case 'refunded': 
        return 'مسترد';
      default: 
        return status || 'غير محدد';
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodText = (method: string) => {
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.offer_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status?.toLowerCase() === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.payment_method?.toLowerCase() === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    completed: payments.filter(p => ['completed', 'success', 'paid'].includes(p.status?.toLowerCase())).reduce((sum, p) => sum + Number(p.amount), 0),
    pending: payments.filter(p => ['pending', 'processing'].includes(p.status?.toLowerCase())).reduce((sum, p) => sum + Number(p.amount), 0),
    failed: payments.filter(p => ['failed', 'rejected', 'cancelled'].includes(p.status?.toLowerCase())).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل مدفوعاتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المدفوعات</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع المدفوعات والمعاملات المالية</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي المدفوعات</div>
            </div>
            <Banknote className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed.toLocaleString()}</div>
              <div className="text-sm text-green-700 dark:text-green-300">مدفوعات مكتملة</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending.toLocaleString()}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">في الانتظار</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</div>
              <div className="text-sm text-red-700 dark:text-red-300">مدفوعات فاشلة</div>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المدفوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                <SelectItem value="wallet">محفظة رقمية</SelectItem>
                <SelectItem value="stc_pay">STC Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Grid */}
      {filteredPayments.length > 0 ? (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredPayments.map((payment) => (
            <ResponsiveCard key={payment.id} size="md" className="hover-scale">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {payment.transaction_id || payment.reference_id}
                      {payment.transaction_type === 'deposit' && (
                        <span className="mr-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                          شحن محفظة
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {payment.offer_title || payment.description}
                    </p>
                    <div className="text-2xl font-bold text-primary">
                      {Number(payment.amount).toLocaleString()} {payment.currency || 'SAR'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusIcon(payment.status)}
                    <span className="mr-1">{getStatusText(payment.status)}</span>
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>طريقة الدفع:</span>
                    <span className="font-medium">{getPaymentMethodText(payment.payment_method)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تاريخ الدفع:</span>
                    <span>
                      {payment.payment_date 
                        ? new Date(payment.payment_date).toLocaleDateString('ar-SA')
                        : new Date(payment.created_at).toLocaleDateString('ar-SA')
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>رقم المعاملة:</span>
                    <span className="font-mono text-xs">{payment.transaction_id || payment.reference_id}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد مدفوعات</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' 
                ? 'لا توجد مدفوعات مطابقة لمعايير البحث'
                : 'لم يتم إجراء أي مدفوعات حتى الآن'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}