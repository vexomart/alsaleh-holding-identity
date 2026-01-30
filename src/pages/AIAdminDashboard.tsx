import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  LayoutDashboard,
  Settings,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Search,
  Sparkles,
  Activity,
  Shield,
  TrendingUp,
  FileText,
  Lightbulb,
  Zap,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageProvider } from '@/components/dashboard/LanguageProvider';
import { useTheme } from 'next-themes';
import { AIInsightsPanel } from '@/components/ai-dashboard/AIInsightsPanel';
import { PredictiveAnalytics } from '@/components/ai-dashboard/PredictiveAnalytics';
import { AnomalyDetection } from '@/components/ai-dashboard/AnomalyDetection';
import { SmartRecommendations } from '@/components/ai-dashboard/SmartRecommendations';
import { LiveDataWidgets } from '@/components/ai-dashboard/LiveDataWidgets';
import { AutomatedReports } from '@/components/ai-dashboard/AutomatedReports';

const AIAdminDashboardContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Force dark mode for this dashboard
  useEffect(() => {
    if (theme !== 'dark') {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', labelAr: 'نظرة عامة' },
    { id: 'insights', icon: Brain, label: 'AI Insights', labelAr: 'رؤى الذكاء الاصطناعي' },
    { id: 'predictions', icon: TrendingUp, label: 'Predictions', labelAr: 'التنبؤات' },
    { id: 'anomalies', icon: Shield, label: 'Anomalies', labelAr: 'الحالات الشاذة' },
    { id: 'recommendations', icon: Lightbulb, label: 'Recommendations', labelAr: 'التوصيات' },
    { id: 'reports', icon: FileText, label: 'Reports', labelAr: 'التقارير' },
  ];

  return (
    <div className={cn(
      "min-h-screen bg-background transition-all duration-300",
      language === 'ar' && "rtl"
    )}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary)/0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className={cn(
          "fixed top-0 h-full bg-card/50 backdrop-blur-xl border-r border-border/50 z-50",
          language === 'ar' ? 'right-0 border-l border-r-0' : 'left-0'
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={false}
              animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg whitespace-nowrap">
                  {language === 'ar' ? 'لوحة التحكم الذكية' : 'AI Command'}
                </h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {language === 'ar' ? 'المستوى التنفيذي' : 'Executive Level'}
                </p>
              </div>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? (
                language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 transition-all",
                  activeTab === item.id && "bg-primary/10 text-primary",
                  !sidebarOpen && "justify-center px-2"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <span className="whitespace-nowrap">
                    {language === 'ar' ? item.labelAr : item.label}
                  </span>
                )}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-border/50 space-y-2">
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-3", !sidebarOpen && "justify-center px-2")}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{language === 'ar' ? 'خروج' : 'Logout'}</span>}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarOpen 
            ? (language === 'ar' ? 'mr-[280px]' : 'ml-[280px]') 
            : (language === 'ar' ? 'mr-[80px]' : 'ml-[80px]')
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'البحث الذكي...' : 'AI-powered search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Status */}
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-success rounded-full"
                />
                {language === 'ar' ? 'الذكاء الاصطناعي نشط' : 'AI Active'}
              </Badge>

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'ar' ? 'EN' : 'عربي'}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 relative">
          {/* Page Title */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                {navItems.find(n => n.id === activeTab)?.icon && 
                  React.createElement(navItems.find(n => n.id === activeTab)!.icon, { className: "w-6 h-6 text-primary" })
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' 
                    ? navItems.find(n => n.id === activeTab)?.labelAr 
                    : navItems.find(n => n.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'تحليلات ورؤى مدعومة بالذكاء الاصطناعي' 
                    : 'AI-powered analytics and insights'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Live Data Widgets */}
              <LiveDataWidgets />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AIInsightsPanel />
                <AnomalyDetection />
              </div>

              {/* Predictive Analytics */}
              <PredictiveAnalytics />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SmartRecommendations />
                <AutomatedReports />
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <AIInsightsPanel />
              <PredictiveAnalytics />
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <PredictiveAnalytics />
              <LiveDataWidgets />
            </div>
          )}

          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <AnomalyDetection />
              <LiveDataWidgets />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <SmartRecommendations />
              <AIInsightsPanel />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <AutomatedReports />
              <PredictiveAnalytics />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const AIAdminDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <AIAdminDashboardContent />
    </LanguageProvider>
  );
};

export default AIAdminDashboard;
