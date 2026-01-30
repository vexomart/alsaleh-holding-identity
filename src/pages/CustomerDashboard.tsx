import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { LanguageProvider } from '@/components/dashboard/LanguageProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { DashboardCharts, PortfolioPerformanceChart, RevenueChart, DistributionChart } from '@/components/dashboard/DashboardCharts';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock real-time data
const generateKPIData = () => ({
  portfolioValue: Math.floor(Math.random() * 10000000) + 50000000,
  revenue: Math.floor(Math.random() * 5000000) + 10000000,
  roi: (Math.random() * 10 + 15).toFixed(1),
  growth: (Math.random() * 5 + 8).toFixed(1),
  services: Math.floor(Math.random() * 10) + 45,
  clients: Math.floor(Math.random() * 50) + 150,
  projects: Math.floor(Math.random() * 20) + 80,
  transactions: Math.floor(Math.random() * 100) + 500,
});

interface RecentActivity {
  id: string;
  type: 'investment' | 'transaction' | 'client' | 'report';
  title: string;
  titleAr: string;
  amount?: string;
  time: string;
  status: 'completed' | 'pending' | 'processing';
}

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'investment',
    title: 'New Tech Investment',
    titleAr: 'استثمار تقني جديد',
    amount: '$2.5M',
    time: '5 mins ago',
    status: 'completed',
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Quarterly Dividend',
    titleAr: 'توزيعات الأرباح الربعية',
    amount: '$500K',
    time: '1 hour ago',
    status: 'completed',
  },
  {
    id: '3',
    type: 'client',
    title: 'New Enterprise Client',
    titleAr: 'عميل مؤسسي جديد',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: '4',
    type: 'report',
    title: 'Q4 Report Generated',
    titleAr: 'تم إنشاء تقرير الربع الرابع',
    time: '3 hours ago',
    status: 'processing',
  },
];

const DashboardContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [kpiData, setKpiData] = useState(generateKPIData());
  const [notificationCount, setNotificationCount] = useState(3);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(generateKPIData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (language === 'ar') {
      return value.toLocaleString('ar-SA') + ' ر.س';
    }
    return '$' + value.toLocaleString('en-US');
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationsPanel />;
      case 'profile':
      case 'settings':
      case 'security':
        return <UserProfile />;
      case 'reports':
        return <ReportsSection />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/10">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('dashboard.analytics')}</h2>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'تحليلات متقدمة للأداء' : 'Advanced performance analytics'}
                </p>
              </div>
            </div>
            <PortfolioPerformanceChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <DistributionChart />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {t('dashboard.welcome')}، {language === 'ar' ? 'محمد' : 'Mohammed'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? 'إليك نظرة شاملة على أداء محفظتك اليوم'
                    : "Here's an overview of your portfolio performance today"
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                  {language === 'ar' ? 'بيانات حية' : 'Live Data'}
                </Badge>
              </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title={t('kpi.portfolio')}
                value={formatCurrency(kpiData.portfolioValue)}
                change={12.5}
                changeLabel={language === 'ar' ? 'منذ الشهر الماضي' : 'vs last month'}
                icon={Wallet}
                trend="up"
                color="primary"
                index={0}
              />
              <KPICard
                title={t('kpi.revenue')}
                value={formatCurrency(kpiData.revenue)}
                change={8.3}
                changeLabel={language === 'ar' ? 'منذ الربع الماضي' : 'vs last quarter'}
                icon={DollarSign}
                trend="up"
                color="secondary"
                index={1}
              />
              <KPICard
                title={t('kpi.roi')}
                value={`${kpiData.roi}%`}
                change={2.1}
                changeLabel={language === 'ar' ? 'معدل سنوي' : 'annual rate'}
                icon={TrendingUp}
                trend="up"
                color="accent"
                index={2}
              />
              <KPICard
                title={t('kpi.growth')}
                value={`${kpiData.growth}%`}
                change={-1.2}
                changeLabel={language === 'ar' ? 'هذا الأسبوع' : 'this week'}
                icon={Activity}
                trend="down"
                color="success"
                index={3}
              />
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(kpiData.services)}</p>
                    <p className="text-xs text-muted-foreground">{t('kpi.services')}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(kpiData.clients)}</p>
                    <p className="text-xs text-muted-foreground">{t('kpi.clients')}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(kpiData.projects)}</p>
                    <p className="text-xs text-muted-foreground">{t('kpi.projects')}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(kpiData.transactions)}</p>
                    <p className="text-xs text-muted-foreground">{t('kpi.transactions')}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <PortfolioPerformanceChart />
              </div>
              <DistributionChart />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  {t('action.view_all')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          activity.type === 'investment' && 'bg-primary/10 text-primary',
                          activity.type === 'transaction' && 'bg-secondary/10 text-secondary',
                          activity.type === 'client' && 'bg-accent/10 text-accent',
                          activity.type === 'report' && 'bg-success/10 text-success',
                        )}>
                          {activity.type === 'investment' && <TrendingUp className="w-4 h-4" />}
                          {activity.type === 'transaction' && <DollarSign className="w-4 h-4" />}
                          {activity.type === 'client' && <Users className="w-4 h-4" />}
                          {activity.type === 'report' && <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {language === 'ar' ? activity.titleAr : activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {activity.amount && (
                          <span className="font-semibold text-sm">{activity.amount}</span>
                        )}
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className={cn(
                            activity.status === 'completed' && 'bg-success',
                            activity.status === 'pending' && 'bg-warning',
                            activity.status === 'processing' && 'bg-accent',
                          )}
                        >
                          {activity.status === 'completed' && (language === 'ar' ? 'مكتمل' : 'Completed')}
                          {activity.status === 'pending' && (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                          {activity.status === 'processing' && (language === 'ar' ? 'قيد المعالجة' : 'Processing')}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      notificationCount={notificationCount}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

const CustomerDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
};

export default CustomerDashboard;
