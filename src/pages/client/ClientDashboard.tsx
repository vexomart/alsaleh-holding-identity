import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  User, 
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalPayments: number;
  recentOrders: any[];
}

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalPayments: 0,
    recentOrders: []
  });
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('يرجى تسجيل الدخول لعرض لوحة التحكم');
        return;
      }

      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfile(profile || { 
        full_name: user.user_metadata?.full_name || user.email,
        email: user.email 
      });

      // Load user's contracts/orders
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contractsError && contractsError.code !== 'PGRST101') {
        console.error('Error fetching contracts:', contractsError);
      }

      // Load user's payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_transactions')
        .select('amount, status')
        .eq('user_id', user.id);

      if (paymentsError && paymentsError.code !== 'PGRST101') {
        console.error('Error fetching payments:', paymentsError);
      }

      // Calculate stats
      const contractsList = contracts || [];
      const paymentsList = payments || [];

      const activeOrders = contractsList.filter(c => c.status === 'active').length;
      const completedOrders = contractsList.filter(c => c.status === 'completed').length;
      const totalPayments = paymentsList
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      setStats({
        totalOrders: contractsList.length,
        activeOrders,
        completedOrders,
        totalPayments,
        recentOrders: contractsList.slice(0, 5)
      });

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            مرحباً، {userProfile?.full_name || 'عزيز العميل'}
          </h1>
          <p className="text-muted-foreground">نظرة سريعة على حسابك وآخر التحديثات</p>
        </div>
        <Link to="/client/new-service">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 ml-2" />
            طلب خدمة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalOrders}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي الطلبات</div>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.activeOrders}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">قيد التنفيذ</div>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completedOrders}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">مكتملة</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalPayments.toLocaleString()}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">إجمالي المدفوعات</div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/client/orders" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                مشاهدة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">تتبع حالة جميع طلباتك ومشاريعك</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/payments" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                المدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">إدارة ومراجعة جميع المعاملات المالية</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/client/profile" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                الملف الشخصي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">تحديث معلوماتك الشخصية والتجارية</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                آخر الطلبات
              </span>
              <Link to="/client/orders">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض الكل
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{order.service_type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.contract_number} • {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل' :
                       order.status === 'active' ? 'نشط' : 'في الانتظار'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalOrders === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">مرحباً بك في لوحة التحكم</h3>
            <p className="text-muted-foreground mb-6">
              ابدأ رحلتك معنا بطلب خدمة جديدة
            </p>
            <Link to="/client/new-service">
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                طلب خدمة جديدة
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}