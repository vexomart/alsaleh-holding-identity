import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthDiagnostics } from '@/components/admin/AuthDiagnostics';
import { Users, DollarSign, Clock, TrendingUp, RefreshCw, Bell, Settings, LogOut } from 'lucide-react';

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

export const AshAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalBalance: 0,
    pendingTransactions: 0,
    todayTransactions: 0
  });
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call with placeholder data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 150,
        activeUsers: 120,
        totalBalance: 250000,
        pendingTransactions: 5,
        todayTransactions: 12
      });

      setTransactions([
        {
          id: '1',
          user_name: 'أحمد محمد',
          type: 'deposit',
          amount: 1500,
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_name: 'فاطمة علي',
          type: 'withdrawal',
          amount: 500,
          status: 'approved',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="h-4 w-4" />;
      case 'withdrawal': return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      default: return 'معاملة';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500'
    };
    
    const labels = {
      'pending': 'معلقة',
      'approved': 'موافق عليها',
      'rejected': 'مرفوضة'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-500'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>جارٍ تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم المدير</h1>
          <p className="text-muted-foreground">مرحباً بك في نظام إدارة ASH HOLDING</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
          <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
          <TabsTrigger value="diagnostics">تشخيص المصادقة</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الأرصدة</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBalance.toLocaleString()} ر.س</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المعاملات المعلقة</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معاملات اليوم</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayTransactions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>المعاملات الأخيرة</CardTitle>
                <Input
                  placeholder="البحث في المعاملات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.user_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {getTransactionText(transaction.type)} - {transaction.amount} ر.س
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(transaction.status)}
                      {transaction.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">موافقة</Button>
                          <Button size="sm" variant="outline">رفض</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">سيتم تطوير هذا القسم قريباً...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics">
          <AuthDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};