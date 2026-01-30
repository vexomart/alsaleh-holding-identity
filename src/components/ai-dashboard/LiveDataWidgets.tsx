import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Globe,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface LiveMetric {
  id: string;
  label: string;
  labelAr: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage';
  trend: 'up' | 'down' | 'stable';
  sparklineData: number[];
  icon: React.ElementType;
  color: string;
}

export const LiveDataWidgets: React.FC = () => {
  const { language } = useLanguage();
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const initialMetrics: LiveMetric[] = [
    {
      id: 'revenue',
      label: 'Live Revenue',
      labelAr: 'الإيرادات المباشرة',
      value: 2847392,
      previousValue: 2847000,
      format: 'currency',
      trend: 'up',
      sparklineData: [65, 70, 68, 75, 72, 78, 82, 80, 85],
      icon: DollarSign,
      color: 'text-success',
    },
    {
      id: 'users',
      label: 'Active Users',
      labelAr: 'المستخدمون النشطون',
      value: 12847,
      previousValue: 12800,
      format: 'number',
      trend: 'up',
      sparklineData: [45, 48, 52, 55, 53, 58, 62, 60, 65],
      icon: Users,
      color: 'text-primary',
    },
    {
      id: 'transactions',
      label: 'Transactions/min',
      labelAr: 'المعاملات/دقيقة',
      value: 847,
      previousValue: 820,
      format: 'number',
      trend: 'up',
      sparklineData: [30, 35, 40, 38, 45, 50, 48, 55, 60],
      icon: Activity,
      color: 'text-accent',
    },
    {
      id: 'growth',
      label: 'Growth Rate',
      labelAr: 'معدل النمو',
      value: 23.4,
      previousValue: 23.2,
      format: 'percentage',
      trend: 'up',
      sparklineData: [15, 18, 20, 19, 22, 24, 23, 25, 26],
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  useEffect(() => {
    setMetrics(initialMetrics);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.45) * (metric.value * 0.001);
        const newValue = metric.value + change;
        const newTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
        
        return {
          ...metric,
          previousValue: metric.value,
          value: newValue,
          trend: newTrend as 'up' | 'down' | 'stable',
          sparklineData: [...metric.sparklineData.slice(1), metric.sparklineData[metric.sparklineData.length - 1] + (Math.random() - 0.5) * 5],
        };
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, format: LiveMetric['format']) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
  };

  const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={cn(color.replace('text-', 'stop-'))} stopOpacity="0.3" />
            <stop offset="100%" className={cn(color.replace('text-', 'stop-'))} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          className={cn(color.replace('text-', 'stroke-'))}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <polygon
          className="fill-current opacity-20"
          style={{ color: `hsl(var(--${color.replace('text-', '')}))` }}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-success/20">
              <Wifi className="w-5 h-5 text-success" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {language === 'ar' ? 'البيانات المباشرة' : 'Live Data Stream'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {language === 'ar' ? 'آخر تحديث:' : 'Last update:'}{' '}
              {lastUpdate.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 animate-pulse">
          {language === 'ar' ? 'مباشر' : 'LIVE'}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const change = metric.value - metric.previousValue;
          const changePercent = (change / metric.previousValue) * 100;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-2 rounded-lg bg-muted/50", metric.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {language === 'ar' ? metric.labelAr : metric.label}
                      </span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={metric.trend}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          metric.trend === 'up' && 'text-success',
                          metric.trend === 'down' && 'text-destructive',
                          metric.trend === 'stable' && 'text-muted-foreground'
                        )}
                      >
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : metric.trend === 'down' ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : null}
                        {Math.abs(changePercent).toFixed(2)}%
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={Math.floor(metric.value)}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="mb-3"
                    >
                      <span className="text-2xl font-bold">
                        {formatValue(metric.value, metric.format)}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  <MiniSparkline data={metric.sparklineData} color={metric.color} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Global Stats Bar */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المناطق النشطة:' : 'Active Regions:'}
                </span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'وقت التشغيل:' : 'Uptime:'}
                </span>
                <span className="font-semibold text-success">99.97%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">
                {language === 'ar' ? 'جميع الأنظمة تعمل' : 'All systems operational'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
