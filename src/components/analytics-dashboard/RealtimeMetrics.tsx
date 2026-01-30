import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  isLive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color, isLive }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-bold tracking-tight"
                >
                  {value}
                </motion.p>
              </AnimatePresence>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-emerald-500" : "text-red-500"
              )}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{isPositive ? '+' : ''}{change}%</span>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-xl",
              color
            )}>
              {icon}
            </div>
          </div>
          
          {isLive && (
            <div className="absolute top-3 end-3 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-500 font-medium">LIVE</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const RealtimeMetrics: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [metrics, setMetrics] = useState({
    revenue: 2450000,
    activeUsers: 12847,
    transactions: 3421,
    growth: 23.5,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 10000 - 3000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 100 - 30),
        transactions: prev.transactions + Math.floor(Math.random() * 20 - 5),
        growth: Math.round((prev.growth + (Math.random() * 2 - 1)) * 10) / 10,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      title: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `$${(metrics.revenue / 1000000).toFixed(2)}M`,
      change: 12.5,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-500/10',
      isLive: true,
    },
    {
      title: isRTL ? 'المستخدمون النشطون' : 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      change: 8.2,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-500/10',
      isLive: true,
    },
    {
      title: isRTL ? 'المعاملات' : 'Transactions',
      value: metrics.transactions.toLocaleString(),
      change: -2.4,
      icon: <Activity className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-500/10',
      isLive: true,
    },
    {
      title: isRTL ? 'معدل النمو' : 'Growth Rate',
      value: `${metrics.growth}%`,
      change: metrics.growth > 20 ? 5.1 : -1.2,
      icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-500/10',
      isLive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};
