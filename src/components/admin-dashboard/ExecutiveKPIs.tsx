import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Activity,
  BarChart3,
  Target,
  Wallet,
  Building2,
  Globe,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ExecutiveKPIProps {
  data: {
    totalRevenue: number;
    revenueChange: number;
    totalAssets: number;
    assetsChange: number;
    activeInvestments: number;
    investmentsChange: number;
    roi: number;
    roiChange: number;
    activeUsers: number;
    usersChange: number;
    systemUptime: number;
    subsidiaries: number;
    globalMarkets: number;
  };
}

export const ExecutiveKPIs: React.FC<ExecutiveKPIProps> = ({ data }) => {
  const { language } = useLanguage();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const primaryKPIs = [
    {
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `$${formatCurrency(data.totalRevenue)}`,
      change: data.revenueChange,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500',
    },
    {
      title: language === 'ar' ? 'إجمالي الأصول' : 'Total Assets',
      value: `$${formatCurrency(data.totalAssets)}`,
      change: data.assetsChange,
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
    },
    {
      title: language === 'ar' ? 'الاستثمارات النشطة' : 'Active Investments',
      value: data.activeInvestments.toString(),
      change: data.investmentsChange,
      icon: TrendingUp,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-500',
    },
    {
      title: language === 'ar' ? 'العائد على الاستثمار' : 'ROI',
      value: `${data.roi}%`,
      change: data.roiChange,
      icon: Target,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-500',
    },
  ];

  const secondaryKPIs = [
    {
      title: language === 'ar' ? 'المستخدمون النشطون' : 'Active Users',
      value: formatCurrency(data.activeUsers),
      change: data.usersChange,
      icon: Users,
    },
    {
      title: language === 'ar' ? 'وقت التشغيل' : 'System Uptime',
      value: `${data.systemUptime}%`,
      icon: Activity,
      progress: data.systemUptime,
    },
    {
      title: language === 'ar' ? 'الشركات التابعة' : 'Subsidiaries',
      value: data.subsidiaries.toString(),
      icon: Building2,
    },
    {
      title: language === 'ar' ? 'الأسواق العالمية' : 'Global Markets',
      value: data.globalMarkets.toString(),
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryKPIs.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              {/* Gradient Background */}
              <div className={cn('absolute inset-0 opacity-5 bg-gradient-to-br', kpi.color)} />
              
              <CardContent className="pt-6 relative">
                <div className="flex items-start justify-between">
                  <div className={cn('p-3 rounded-xl', kpi.bgColor)}>
                    <kpi.icon className={cn('w-6 h-6', kpi.textColor)} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                    kpi.change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  )}>
                    {kpi.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                
                <div className="mt-4 space-y-1">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-3xl font-bold tracking-tight"
                  >
                    {kpi.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>

                {/* Bottom Accent */}
                <div className={cn('absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r', kpi.color)} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <kpi.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{kpi.value}</p>
                      {kpi.change !== undefined && (
                        <span className={cn(
                          'text-xs font-medium',
                          kpi.change >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                          {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{kpi.title}</p>
                  </div>
                </div>
                {kpi.progress !== undefined && (
                  <Progress value={kpi.progress} className="mt-3 h-1.5" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
