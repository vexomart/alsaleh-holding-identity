import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

const stats = [
  { id: 'revenue', valueEn: '$245,000', valueAr: '٢٤٥,٠٠٠ ريال', labelAr: 'إجمالي الإيرادات', labelEn: 'Total Revenue', change: 12.5, icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'users', valueEn: '1,234', valueAr: '١,٢٣٤', labelAr: 'المستخدمين', labelEn: 'Total Users', change: 8.2, icon: Users, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'orders', valueEn: '456', valueAr: '٤٥٦', labelAr: 'الطلبات', labelEn: 'Total Orders', change: -2.4, icon: ShoppingCart, color: 'bg-amber-500/10 text-amber-500' },
  { id: 'growth', valueEn: '23.5%', valueAr: '٢٣.٥٪', labelAr: 'معدل النمو', labelEn: 'Growth Rate', change: 5.1, icon: TrendingUp, color: 'bg-purple-500/10 text-purple-500' },
];

const AdminOverview = () => {
  const { isRTL } = useLanguage();

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
        {stats.map((stat, index) => (
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
                    <p className="text-2xl font-bold">
                      {isRTL ? stat.valueAr : stat.valueEn}
                    </p>
                    <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
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
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium">ORD-2024-{String(i).padStart(4, '0')}</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'خدمة تصميم موقع' : 'Website Design Service'}
                    </p>
                  </div>
                  <span className="text-sm px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
                    {isRTL ? 'قيد المعالجة' : 'Processing'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isRTL ? 'أحدث المستخدمين' : 'Recent Users'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['أحمد محمد', 'سارة علي', 'محمد خالد', 'فاطمة أحمد', 'عمر سعيد'].map((name, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'عميل جديد' : 'New Customer'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
