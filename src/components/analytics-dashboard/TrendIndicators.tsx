import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface TrendItem {
  name: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
}

const trendData: TrendItem[] = [
  { name: 'Revenue Growth', current: 2.4, previous: 2.1, target: 3.0, unit: 'M' },
  { name: 'User Acquisition', current: 12500, previous: 11200, target: 15000, unit: '' },
  { name: 'Conversion Rate', current: 4.8, previous: 4.2, target: 5.5, unit: '%' },
  { name: 'Customer Retention', current: 92, previous: 89, target: 95, unit: '%' },
  { name: 'Average Order Value', current: 156, previous: 142, target: 175, unit: '$' },
];

const TrendCard: React.FC<{ item: TrendItem; index: number; isRTL: boolean }> = ({ item, index, isRTL }) => {
  const change = ((item.current - item.previous) / item.previous) * 100;
  const progress = (item.current / item.target) * 100;
  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 1;

  const nameTranslations: Record<string, string> = {
    'Revenue Growth': 'نمو الإيرادات',
    'User Acquisition': 'اكتساب المستخدمين',
    'Conversion Rate': 'معدل التحويل',
    'Customer Retention': 'الاحتفاظ بالعملاء',
    'Average Order Value': 'متوسط قيمة الطلب',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-sm">
          {isRTL ? nameTranslations[item.name] || item.name : item.name}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          isNeutral ? "bg-muted text-muted-foreground" :
          isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
        )}>
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div className="text-2xl font-bold">
          {item.unit === '$' && item.unit}
          {item.current.toLocaleString()}
          {item.unit !== '$' && item.unit}
        </div>
        <div className="text-xs text-muted-foreground">
          {isRTL ? 'الهدف:' : 'Target:'} {item.unit === '$' && item.unit}{item.target.toLocaleString()}{item.unit !== '$' && item.unit}
        </div>
      </div>

      <Progress 
        value={Math.min(progress, 100)} 
        className="h-2" 
      />
      <p className="text-xs text-muted-foreground mt-1">
        {progress.toFixed(0)}% {isRTL ? 'من الهدف' : 'of target'}
      </p>
    </motion.div>
  );
};

export const TrendIndicators: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {isRTL ? 'مؤشرات الاتجاه' : 'Trend Indicators'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{isRTL ? 'مقابل الشهر الماضي' : 'vs Last Month'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendData.map((item, index) => (
            <TrendCard key={item.name} item={item} index={index} isRTL={isRTL} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
