import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500',
  processing: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  processing: { ar: 'قيد المعالجة', en: 'Processing' },
  in_progress: { ar: 'قيد التنفيذ', en: 'In Progress' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const AdminOverview = () => {
  const { isRTL } = useLanguage();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { orders: recentOrders, loading: ordersLoading } = useOrders({ limit: 5 });
  const { users: recentUsers, loading: usersLoading } = useUsers({ limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsConfig = [
    { 
      id: 'revenue', 
      value: formatCurrency(stats.totalRevenue), 
      labelAr: 'إجمالي الإيرادات', 
      labelEn: 'Total Revenue', 
      icon: DollarSign, 
      color: 'bg-emerald-500/10 text-emerald-500' 
    },
    { 
      id: 'users', 
      value: stats.totalUsers.toString(), 
      labelAr: 'المستخدمين', 
      labelEn: 'Total Users', 
      icon: Users, 
      color: 'bg-blue-500/10 text-blue-500' 
    },
    { 
      id: 'orders', 
      value: stats.totalOrders.toString(), 
      labelAr: 'الطلبات', 
      labelEn: 'Total Orders', 
      icon: ShoppingCart, 
      color: 'bg-amber-500/10 text-amber-500' 
    },
    { 
      id: 'services', 
      value: stats.totalServices.toString(), 
      labelAr: 'الخدمات النشطة', 
      labelEn: 'Active Services', 
      icon: TrendingUp, 
      color: 'bg-purple-500/10 text-purple-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold">{isRTL ? 'نظرة عامة' : 'Overview'}</h2>
        <p className="text-muted-foreground">
          {isRTL ? 'مرحباً بك في لوحة الإدارة' : 'Welcome to the admin dashboard'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? stat.labelAr : stat.labelEn}
                    </p>
                    {statsLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isRTL ? 'أحدث الطلبات' : 'Recent Orders'}</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? order.title_ar || order.title : order.title}
                      </p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {isRTL ? statusLabels[order.status]?.ar : statusLabels[order.status]?.en || order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isRTL ? 'أحدث المستخدمين' : 'Recent Users'}</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا يوجد مستخدمين بعد' : 'No users yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || user.email.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
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

export default AdminOverview;
