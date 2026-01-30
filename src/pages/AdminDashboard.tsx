import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Server,
  Shield,
  AlertTriangle,
  BarChart3,
  Building2,
  FileText,
  Bell,
  Settings,
} from 'lucide-react';
import { LanguageProvider } from '@/components/dashboard/LanguageProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { AdminDashboardLayout } from '@/components/admin-dashboard/AdminDashboardLayout';
import { ExecutiveKPIs } from '@/components/admin-dashboard/ExecutiveKPIs';
import { UserManagement } from '@/components/admin-dashboard/UserManagement';
import { SystemHealth } from '@/components/admin-dashboard/SystemHealth';
import { SecurityAudit } from '@/components/admin-dashboard/SecurityAudit';
import { AdminAdvancedCharts } from '@/components/admin-dashboard/AdminAdvancedCharts';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Real-time mock data generator
const generateKPIData = () => ({
  totalRevenue: Math.floor(Math.random() * 50000000) + 150000000,
  revenueChange: parseFloat((Math.random() * 10 + 5).toFixed(1)),
  totalAssets: Math.floor(Math.random() * 100000000) + 500000000,
  assetsChange: parseFloat((Math.random() * 8 + 3).toFixed(1)),
  activeInvestments: Math.floor(Math.random() * 20) + 85,
  investmentsChange: parseFloat((Math.random() * 15 - 5).toFixed(1)),
  roi: parseFloat((Math.random() * 5 + 20).toFixed(1)),
  roiChange: parseFloat((Math.random() * 3 + 1).toFixed(1)),
  activeUsers: Math.floor(Math.random() * 500) + 2500,
  usersChange: parseFloat((Math.random() * 10 + 2).toFixed(1)),
  systemUptime: parseFloat((Math.random() * 0.5 + 99.5).toFixed(2)),
  subsidiaries: 12,
  globalMarkets: 8,
});

interface QuickAction {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  { id: 'users', labelEn: 'Manage Users', labelAr: 'إدارة المستخدمين', icon: Users, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'reports', labelEn: 'View Reports', labelAr: 'عرض التقارير', icon: FileText, color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'system', labelEn: 'System Health', labelAr: 'صحة النظام', icon: Server, color: 'bg-violet-500/10 text-violet-500' },
  { id: 'security', labelEn: 'Security Audit', labelAr: 'تدقيق الأمان', icon: Shield, color: 'bg-amber-500/10 text-amber-500' },
];

const AdminDashboardContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [kpiData, setKpiData] = useState(generateKPIData());
  const [notificationCount, setNotificationCount] = useState(5);
  const [alertCount, setAlertCount] = useState(2);

  // Enable dark mode by default for admin dashboard
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(generateKPIData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
      case 'roles':
        return <UserManagement />;
      case 'system':
      case 'logs':
        return <SystemHealth />;
      case 'security':
        return <SecurityAudit />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'تحليلات شاملة للأداء' : 'Comprehensive performance analytics'}
                </p>
              </div>
            </div>
            <AdminAdvancedCharts />
          </div>
        );
      case 'finance':
      case 'reports':
        return <ReportsSection />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'settings':
        return <UserProfile />;
      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'مركز التنبيهات' : 'Alerts Center'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'جميع التنبيهات والتحذيرات' : 'All alerts and warnings'}
                </p>
              </div>
            </div>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="font-semibold">
                      {language === 'ar' ? 'تنبيه أمني نشط' : 'Active Security Alert'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' 
                        ? 'تم اكتشاف محاولات تسجيل دخول مشبوهة'
                        : 'Suspicious login attempts detected'
                      }
                    </p>
                  </div>
                  <Button variant="destructive" className="ml-auto">
                    {language === 'ar' ? 'مراجعة' : 'Review'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <SecurityAudit />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {language === 'ar' ? 'مرحباً، مدير النظام' : 'Welcome, System Admin'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? 'إليك نظرة شاملة على أداء المنظومة اليوم'
                    : "Here's a comprehensive overview of your enterprise today"
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1.5">
                  <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                  {language === 'ar' ? 'بيانات حية' : 'Live Data'}
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5">
                  <Activity className="w-3 h-3 mr-2" />
                  {language === 'ar' ? 'تحديث تلقائي' : 'Auto Refresh'}
                </Badge>
              </div>
            </motion.div>

            {/* Executive KPIs */}
            <ExecutiveKPIs data={kpiData} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(action.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                        'hover:shadow-md hover:border-primary/30'
                      )}
                    >
                      <div className={cn('p-3 rounded-xl', action.color)}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-center">
                        {language === 'ar' ? action.labelAr : action.labelEn}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Charts */}
            <AdminAdvancedCharts />

            {/* Recent Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'المستخدمون الجدد' : 'Recent Users'}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Ahmed Salem', role: 'Manager', time: '2 mins ago' },
                      { name: 'Sara Al-Rashid', role: 'Analyst', time: '15 mins ago' },
                      { name: 'Mohammed Hassan', role: 'Viewer', time: '1 hour ago' },
                    ].map((user, index) => (
                      <motion.div
                        key={user.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{user.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'حالة النظام' : 'System Status'}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('system')}>
                    {language === 'ar' ? 'التفاصيل' : 'Details'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'API Server', status: 'online', latency: '45ms' },
                      { name: 'Database', status: 'online', latency: '12ms' },
                      { name: 'CDN', status: 'online', latency: '8ms' },
                      { name: 'Analytics', status: 'degraded', latency: '156ms' },
                    ].map((service, index) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            'w-2 h-2 rounded-full',
                            service.status === 'online' ? 'bg-success' : 'bg-warning'
                          )} />
                          <span className="font-medium text-sm">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{service.latency}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs',
                              service.status === 'online' ? 'text-success border-success/30' : 'text-warning border-warning/30'
                            )}
                          >
                            {service.status === 'online' ? (language === 'ar' ? 'متصل' : 'Online') : (language === 'ar' ? 'متدهور' : 'Degraded')}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminDashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      notificationCount={notificationCount}
      alertCount={alertCount}
    >
      {renderContent()}
    </AdminDashboardLayout>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminDashboardContent />
    </LanguageProvider>
  );
};

export default AdminDashboard;
