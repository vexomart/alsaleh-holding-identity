import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Sample data
const performanceData = [
  { month: 'Jan', value: 4000, growth: 2400 },
  { month: 'Feb', value: 3000, growth: 1398 },
  { month: 'Mar', value: 5000, growth: 9800 },
  { month: 'Apr', value: 2780, growth: 3908 },
  { month: 'May', value: 1890, growth: 4800 },
  { month: 'Jun', value: 2390, growth: 3800 },
  { month: 'Jul', value: 3490, growth: 4300 },
  { month: 'Aug', value: 4200, growth: 5100 },
  { month: 'Sep', value: 5100, growth: 6200 },
  { month: 'Oct', value: 4800, growth: 5800 },
  { month: 'Nov', value: 5500, growth: 6500 },
  { month: 'Dec', value: 6200, growth: 7200 },
];

const revenueData = [
  { name: 'Q1', technology: 4000, media: 2400, digital: 2400, realEstate: 1800 },
  { name: 'Q2', technology: 3000, media: 1398, digital: 2210, realEstate: 2200 },
  { name: 'Q3', technology: 2000, media: 9800, digital: 2290, realEstate: 2500 },
  { name: 'Q4', technology: 2780, media: 3908, digital: 2000, realEstate: 2100 },
];

const distributionData = [
  { name: 'Technology', value: 35, color: 'hsl(220, 100%, 20%)' },
  { name: 'Media', value: 25, color: 'hsl(35, 85%, 45%)' },
  { name: 'Digital', value: 20, color: 'hsl(190, 100%, 25%)' },
  { name: 'Real Estate', value: 12, color: 'hsl(145, 75%, 35%)' },
  { name: 'Finance', value: 8, color: 'hsl(0, 75%, 45%)' },
];

const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  </motion.div>
);

export const PortfolioPerformanceChart: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <ChartCard title={t('chart.performance')} className="col-span-full lg:col-span-2">
      <Tabs defaultValue="area" className="w-full">
        <TabsList className="grid w-full max-w-[300px] grid-cols-3 mb-4">
          <TabsTrigger value="area">{language === 'ar' ? 'مساحة' : 'Area'}</TabsTrigger>
          <TabsTrigger value="line">{language === 'ar' ? 'خط' : 'Line'}</TabsTrigger>
          <TabsTrigger value="bar">{language === 'ar' ? 'أعمدة' : 'Bar'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="area" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 100%, 20%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220, 100%, 20%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(35, 85%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(35, 85%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value, index) => language === 'ar' ? monthsAr[index] : value}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(220, 100%, 20%)"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="growth"
                stroke="hsl(35, 85%, 45%)"
                fillOpacity={1}
                fill="url(#colorGrowth)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="line" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value, index) => language === 'ar' ? monthsAr[index] : value}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(220, 100%, 20%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(220, 100%, 20%)', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="hsl(35, 85%, 45%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(35, 85%, 45%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="bar" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value, index) => language === 'ar' ? monthsAr[index] : value}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="hsl(220, 100%, 20%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="growth" fill="hsl(35, 85%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </ChartCard>
  );
};

export const RevenueChart: React.FC = () => {
  const { t, language } = useLanguage();

  const sectorLabels = {
    technology: language === 'ar' ? 'التكنولوجيا' : 'Technology',
    media: language === 'ar' ? 'الإعلام' : 'Media',
    digital: language === 'ar' ? 'الرقمية' : 'Digital',
    realEstate: language === 'ar' ? 'العقارات' : 'Real Estate',
  };

  return (
    <ChartCard title={t('chart.revenue')}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs fill-muted-foreground" />
            <YAxis dataKey="name" type="category" className="text-xs fill-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="technology" name={sectorLabels.technology} fill="hsl(220, 100%, 20%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="media" name={sectorLabels.media} fill="hsl(35, 85%, 45%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="digital" name={sectorLabels.digital} fill="hsl(190, 100%, 25%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="realEstate" name={sectorLabels.realEstate} fill="hsl(145, 75%, 35%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export const DistributionChart: React.FC = () => {
  const { t, language } = useLanguage();

  const localizedData = distributionData.map(item => ({
    ...item,
    name: language === 'ar' 
      ? { Technology: 'التكنولوجيا', Media: 'الإعلام', Digital: 'الرقمية', 'Real Estate': 'العقارات', Finance: 'المالية' }[item.name] || item.name
      : item.name,
  }));

  return (
    <ChartCard title={t('chart.distribution')}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={localizedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {localizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {localizedData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PortfolioPerformanceChart />
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart />
        <DistributionChart />
      </div>
    </div>
  );
};
