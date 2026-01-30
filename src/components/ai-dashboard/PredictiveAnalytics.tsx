import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

const historicalData = [
  { month: 'Jan', actual: 4200, predicted: 4000, variance: 200 },
  { month: 'Feb', actual: 4500, predicted: 4300, variance: 200 },
  { month: 'Mar', actual: 4800, predicted: 4700, variance: 100 },
  { month: 'Apr', actual: 5100, predicted: 5000, variance: 100 },
  { month: 'May', actual: 5400, predicted: 5200, variance: 200 },
  { month: 'Jun', actual: 5800, predicted: 5600, variance: 200 },
];

const forecastData = [
  { month: 'Jul', predicted: 6100, lower: 5800, upper: 6400, confidence: 92 },
  { month: 'Aug', predicted: 6500, lower: 6100, upper: 6900, confidence: 88 },
  { month: 'Sep', predicted: 6900, lower: 6400, upper: 7400, confidence: 85 },
  { month: 'Oct', predicted: 7400, lower: 6800, upper: 8000, confidence: 82 },
  { month: 'Nov', predicted: 7800, lower: 7100, upper: 8500, confidence: 78 },
  { month: 'Dec', predicted: 8300, lower: 7500, upper: 9100, confidence: 75 },
];

const combinedData = [...historicalData, ...forecastData];

interface PredictionMetric {
  label: string;
  labelAr: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  confidence: number;
  icon: React.ElementType;
}

export const PredictiveAnalytics: React.FC = () => {
  const { language } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  const predictions: PredictionMetric[] = [
    {
      label: 'Q4 Revenue',
      labelAr: 'إيرادات الربع الرابع',
      value: '$24.5M',
      change: 18.5,
      trend: 'up',
      confidence: 89,
      icon: TrendingUp,
    },
    {
      label: 'YoY Growth',
      labelAr: 'النمو السنوي',
      value: '23.4%',
      change: 5.2,
      trend: 'up',
      confidence: 92,
      icon: Activity,
    },
    {
      label: 'Market Share',
      labelAr: 'حصة السوق',
      value: '12.8%',
      change: 2.1,
      trend: 'up',
      confidence: 85,
      icon: Target,
    },
    {
      label: 'Risk Score',
      labelAr: 'مؤشر المخاطر',
      value: '24/100',
      change: -8,
      trend: 'down',
      confidence: 94,
      icon: Layers,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-lg border border-border rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {data.actual !== undefined && (
            <p className="text-sm text-success">
              {language === 'ar' ? 'الفعلي: ' : 'Actual: '}
              <span className="font-medium">${data.actual.toLocaleString()}</span>
            </p>
          )}
          <p className="text-sm text-primary">
            {language === 'ar' ? 'المتوقع: ' : 'Predicted: '}
            <span className="font-medium">${data.predicted.toLocaleString()}</span>
          </p>
          {data.confidence && (
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ar' ? 'الثقة: ' : 'Confidence: '}
              <span className="font-medium">{data.confidence}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {language === 'ar' ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'توقعات مدعومة بالذكاء الاصطناعي' : 'AI-powered forecasting'}
              </p>
            </div>
          </div>
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Prediction Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {predictions.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 text-primary" />
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    metric.trend === 'up' ? 'text-success border-success/30' : 'text-destructive border-destructive/30'
                  )}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? metric.labelAr : metric.label}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.confidence}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{metric.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forecast Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Confidence Band */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
              />
              
              {/* Actual Line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              
              {/* Predicted Line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">
              {language === 'ar' ? 'الفعلي' : 'Actual'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">
              {language === 'ar' ? 'المتوقع' : 'Predicted'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span className="text-muted-foreground">
              {language === 'ar' ? 'نطاق الثقة' : 'Confidence Band'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
