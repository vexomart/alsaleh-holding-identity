import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';

const revenueData = [
  { month: 'Jan', revenue: 4200, expenses: 2400, profit: 1800 },
  { month: 'Feb', revenue: 3800, expenses: 2100, profit: 1700 },
  { month: 'Mar', revenue: 5100, expenses: 2800, profit: 2300 },
  { month: 'Apr', revenue: 4700, expenses: 2500, profit: 2200 },
  { month: 'May', revenue: 5600, expenses: 3000, profit: 2600 },
  { month: 'Jun', revenue: 6200, expenses: 3200, profit: 3000 },
  { month: 'Jul', revenue: 5900, expenses: 3100, profit: 2800 },
  { month: 'Aug', revenue: 6800, expenses: 3400, profit: 3400 },
  { month: 'Sep', revenue: 7200, expenses: 3600, profit: 3600 },
  { month: 'Oct', revenue: 6900, expenses: 3500, profit: 3400 },
  { month: 'Nov', revenue: 7500, expenses: 3700, profit: 3800 },
  { month: 'Dec', revenue: 8100, expenses: 3900, profit: 4200 },
];

const quarterlyData = [
  { quarter: 'Q1', tech: 4500, media: 3200, finance: 2800, realEstate: 2100 },
  { quarter: 'Q2', tech: 5200, media: 3800, finance: 3100, realEstate: 2400 },
  { quarter: 'Q3', tech: 5800, media: 4100, finance: 3400, realEstate: 2700 },
  { quarter: 'Q4', tech: 6500, media: 4600, finance: 3800, realEstate: 3000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value?.toLocaleString()}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const FinancialCharts: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [activeChart, setActiveChart] = useState('area');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">
              {isRTL ? 'التحليل المالي' : 'Financial Analysis'}
            </CardTitle>
            <Tabs value={activeChart} onValueChange={setActiveChart} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="area" className="text-xs px-3">
                  {isRTL ? 'مساحة' : 'Area'}
                </TabsTrigger>
                <TabsTrigger value="line" className="text-xs px-3">
                  {isRTL ? 'خطي' : 'Line'}
                </TabsTrigger>
                <TabsTrigger value="bar" className="text-xs px-3">
                  {isRTL ? 'أعمدة' : 'Bar'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'area' ? (
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={isRTL ? 'الإيرادات' : 'Revenue'}
                    stroke="hsl(var(--primary))"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name={isRTL ? 'الأرباح' : 'Profit'}
                    stroke="hsl(142, 76%, 36%)"
                    fill="url(#profitGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : activeChart === 'line' ? (
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name={isRTL ? 'الإيرادات' : 'Revenue'}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name={isRTL ? 'المصروفات' : 'Expenses'}
                    stroke="hsl(0, 84%, 60%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name={isRTL ? 'الأرباح' : 'Profit'}
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="quarter" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="tech" name={isRTL ? 'التكنولوجيا' : 'Technology'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="media" name={isRTL ? 'الإعلام' : 'Media'} fill="hsl(35, 85%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="finance" name={isRTL ? 'المالية' : 'Finance'} fill="hsl(190, 90%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realEstate" name={isRTL ? 'العقارات' : 'Real Estate'} fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
