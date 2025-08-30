import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  Shield,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAsh } from './AshLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthDiagnostic } from '@/components/admin/AuthDiagnostic';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBalance: number;
  pendingTransactions: number;
  todayTransactions: number;
}

interface RecentTransaction {
  id: string;
  user_name: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

export const AshAdminDashboard: React.FC = () => {
  const { user, logout } = useAsh();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalBalance: 0,
    pendingTransactions: 0,
    todayTransactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // جلب إحصائيات لوحة التحكم
  const fetchDashboardData = async () => {
    try {
      // جلب إحصائيات المستخدمين
      const { data: usersData, error: usersError } = await supabase
        .from('ash_users')
        .select('id, status');

      if (usersError) throw usersError;

      const totalUsers = usersData?.length || 0;
      const activeUsers = usersData?.filter(u => u.status === 'active').length || 0;

      // جلب إحصائيات المحافظ
      const { data: walletsData, error: walletsError } = await supabase
        .from('ash_wallets')
        .select('balance');

      if (walletsError) throw walletsError;

      const totalBalance = walletsData?.reduce((sum, wallet) => sum + parseFloat(wallet.balance.toString()), 0) || 0;

      // جلب المعاملات المعلقة
      const { data: pendingData, error: pendingError } = await supabase
        .from('ash_wallet_transactions')
        .select('id')
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // جلب معاملات اليوم
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData, error: todayError } = await supabase
        .from('ash_wallet_transactions')
        .select('id')
        .gte('created_at', today);

      if (todayError) throw todayError;

      // جلب المعاملات الأخيرة
      const { data: transactionsData, error: transError } = await supabase
        .from('ash_wallet_transactions')
        .select(`
          id,
          type,
          amount,
          status,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // جلب أسماء المستخدمين بشكل منفصل
      let transactionsWithUsers: any[] = [];
      if (transactionsData) {
        const userIds = [...new Set(transactionsData.map(t => t.user_id))];
        const { data: usersData } = await supabase
          .from('ash_users')
          .select('id, name')
          .in('id', userIds);
        
        transactionsWithUsers = transactionsData.map(t => ({
          ...t,
          user_name: usersData?.find(u => u.id === t.user_id)?.name || 'غير معروف'
        }));
      }

      if (transError) throw transError;

      setStats({
        totalUsers,
        activeUsers,
        totalBalance,
        pendingTransactions: pendingData?.length || 0,
        todayTransactions: todayData?.length || 0
      });

      setRecentTransactions(transactionsWithUsers || []);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('خطأ في جلب بيانات لوحة التحكم');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // إعادة تحديث البيانات
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // التحكم في المعاملة
  const handleTransactionAction = async (transactionId: string, action: 'approve' | 'reject') => {
    try {
      const { data, error } = await supabase.functions.invoke('ash-wallet', {
        body: {
          action: 'approve-transaction',
          transaction_id: transactionId,
          admin_user_id: user?.id,
          status: action === 'approve' ? 'approved' : 'rejected'
        }
      });

      if (error) throw error;

      toast.success(action === 'approve' ? 'تم اعتماد المعاملة' : 'تم رفض المعاملة');
      await fetchDashboardData();
    } catch (error: any) {
      toast.error('خطأ في معالجة المعاملة');
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // إعداد المزامنة اللحظية
    const channel = supabase
      .channel('admin_dashboard')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ash_wallet_transactions' },
        () => {
          console.log('Transaction updated, refreshing...');
          fetchDashboardData();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ash_users' },
        () => {
          console.log('User updated, refreshing...');
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'withdraw': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdraw': return 'سحب';
      case 'charge': return 'خصم';
      case 'refund': return 'استرداد';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">معتمد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">معلق</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          جارٍ تحميل لوحة التحكم...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة تحكم ASH HOLDING</h1>
          <p className="text-white/70 mt-1">مرحباً {user?.name} - {user?.role === 'superadmin' ? 'مدير عام' : 'مدير'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Bell className="w-4 h-4 ml-2" />
            الإشعارات
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4 ml-2" />
            الإعدادات
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 ml-2" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 ml-2" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="text-white data-[state=active]:bg-white/20">
              <Shield className="w-4 h-4 ml-2" />
              تشخيص المصادقة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">إجمالي العملاء</CardTitle>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-green-400 text-sm mt-1">+{stats.activeUsers} نشط</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">إجمالي الأرصدة</CardTitle>
              <Wallet className="w-8 h-8 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalBalance.toLocaleString()} ر.س</div>
            <p className="text-white/60 text-sm mt-1">في جميع المحافظ</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">معاملات معلقة</CardTitle>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pendingTransactions}</div>
            <p className="text-yellow-400 text-sm mt-1">تحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">معاملات اليوم</CardTitle>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.todayTransactions}</div>
            <p className="text-white/60 text-sm mt-1">إجمالي اليوم</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-xl">المعاملات الأخيرة</CardTitle>
                <CardDescription className="text-white/70">
                  آخر {recentTransactions.length} معاملات في النظام
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    placeholder="بحث في المعاملات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 w-64"
                  />
                </div>
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4 ml-2" />
                  فلترة
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {recentTransactions
                .filter(t => 
                  t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  getTransactionText(t.type).includes(searchTerm)
                )
                .map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/10">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{transaction.user_name}</span>
                          <span className="text-white/60">•</span>
                          <span className="text-white/80">{getTransactionText(transaction.type)}</span>
                        </div>
                        <div className="text-sm text-white/60">
                          {new Date(transaction.created_at).toLocaleDateString('ar-SA')} في{' '}
                          {new Date(transaction.created_at).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div className="font-bold text-white">
                          {transaction.amount.toLocaleString()} ر.س
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>

                      {transaction.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleTransactionAction(transaction.id, 'approve')}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTransactionAction(transaction.id, 'reject')}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

              {recentTransactions.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  لا توجد معاملات حتى الآن
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">إدارة المستخدمين</CardTitle>
                <CardDescription className="text-white/70">
                  سيتم إضافة إدارة المستخدمين قريباً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-white/60">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>قريباً: إدارة شاملة للمستخدمين</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-6">
            <div className="bg-white/10 backdrop-blur-xl border-white/20 rounded-lg p-6">
              <AuthDiagnostic />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};