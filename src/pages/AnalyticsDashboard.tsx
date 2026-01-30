import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { AnalyticsFilters } from '@/components/analytics-dashboard/AnalyticsFilters';
import { RealtimeMetrics } from '@/components/analytics-dashboard/RealtimeMetrics';
import { FinancialCharts } from '@/components/analytics-dashboard/FinancialCharts';
import { PerformanceHeatmap } from '@/components/analytics-dashboard/PerformanceHeatmap';
import { TrendIndicators } from '@/components/analytics-dashboard/TrendIndicators';
import { ExportReports } from '@/components/analytics-dashboard/ExportReports';
import { toast } from 'sonner';

const AnalyticsDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [category, setCategory] = useState('all');
  const [project, setProject] = useState('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success(isRTL ? 'تم تحديث البيانات' : 'Data refreshed');
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {isRTL ? 'لوحة التحليلات' : 'Analytics Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'تحليلات في الوقت الفعلي ورؤى الأعمال' : 'Real-time analytics and business insights'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 me-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 me-2" />
                {isRTL ? 'الإعدادات' : 'Settings'}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnalyticsFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            category={category}
            setCategory={setCategory}
            project={project}
            setProject={setProject}
          />
        </motion.div>

        {/* Real-time Metrics */}
        <section>
          <RealtimeMetrics />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Charts - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FinancialCharts />
          </div>

          {/* Trend Indicators */}
          <div>
            <TrendIndicators />
          </div>
        </div>

        {/* Heatmap and Export */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PerformanceHeatmap />
          </div>

          {/* Export Reports */}
          <div>
            <ExportReports />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
