import React, { useState } from 'react';
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
  ComposedChart,
  Scatter,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown, Calendar, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 4200000, expenses: 2100000, profit: 2100000 },
  { month: 'Feb', revenue: 3800000, expenses: 1900000, profit: 1900000 },
  { month: 'Mar', revenue: 5100000, expenses: 2300000, profit: 2800000 },
  { month: 'Apr', revenue: 4700000, expenses: 2200000, profit: 2500000 },
  { month: 'May', revenue: 5800000, expenses: 2600000, profit: 3200000 },
  { month: 'Jun', revenue: 6200000, expenses: 2800000, profit: 3400000 },
  { month: 'Jul', revenue: 5900000, expenses: 2700000, profit: 3200000 },
  { month: 'Aug', revenue: 6500000, expenses: 2900000, profit: 3600000 },
  { month: 'Sep', revenue: 7100000, expenses: 3100000, profit: 4000000 },
  { month: 'Oct', revenue: 6800000, expenses: 3000000, profit: 3800000 },
  { month: 'Nov', revenue: 7500000, expenses: 3200000, profit: 4300000 },
  { month: 'Dec', revenue: 8200000, expenses: 3500000, profit: 4700000 },
];

const sectorData = [
  { name: 'Technology', value: 45, color: 'hsl(220, 100%, 35%)' },
  { name: 'Media', value: 25, color: 'hsl(35, 85%, 45%)' },
  { name: 'Investments', value: 20, color: 'hsl(190, 100%, 35%)' },
  { name: 'Real Estate', value: 10, color: 'hsl(145, 75%, 35%)' },
];

const performanceData = [
  { name: 'ROI', value: 24.5, fill: 'hsl(145, 75%, 35%)' },
  { name: 'Growth', value: 18.2, fill: 'hsl(220, 100%, 35%)' },
  { name: 'Efficiency', value: 82.5, fill: 'hsl(35, 85%, 45%)' },
  { name: 'Satisfaction', value: 91.2, fill: 'hsl(190, 100%, 35%)' },
];

const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export const AdminAdvancedCharts: React.FC = () => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('year');

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? 'رؤى مفصلة عن الأداء المالي' : 'Detailed insights into financial performance'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{language === 'ar' ? 'أسبوع' : 'Week'}</SelectItem>
              <SelectItem value="month">{language === 'ar' ? 'شهر' : 'Month'}</SelectItem>
              <SelectItem value="quarter">{language === 'ar' ? 'ربع' : 'Quarter'}</SelectItem>
              <SelectItem value="year">{language === 'ar' ? 'سنة' : 'Year'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'الإيرادات مقابل المصروفات' : 'Revenue vs Expenses'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'تحليل شهري' : 'Monthly breakdown'}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-success border-success/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="area" className="w-full">
                <TabsList className="grid w-full max-w-[200px] grid-cols-2 mb-4">
                  <TabsTrigger value="area">{language === 'ar' ? 'مساحة' : 'Area'}</TabsTrigger>
                  <TabsTrigger value="bar">{language === 'ar' ? 'أعمدة' : 'Bar'}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="area" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145, 75%, 35%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(145, 75%, 35%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 75%, 45%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(0, 75%, 45%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value, index) => language === 'ar' ? monthsAr[index] : value}
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={formatValue}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatValue(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(145, 75%, 35%)"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                        name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="hsl(0, 75%, 45%)"
                        fill="url(#expenseGradient)"
                        strokeWidth={2}
                        name={language === 'ar' ? 'المصروفات' : 'Expenses'}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="hsl(220, 100%, 35%)"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(220, 100%, 35%)', strokeWidth: 2 }}
                        name={language === 'ar' ? 'الربح' : 'Profit'}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="bar" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value, index) => language === 'ar' ? monthsAr[index] : value}
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={formatValue}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatValue(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        fill="hsl(145, 75%, 35%)" 
                        radius={[4, 4, 0, 0]}
                        name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                      />
                      <Bar 
                        dataKey="expenses" 
                        fill="hsl(0, 75%, 45%)" 
                        radius={[4, 4, 0, 0]}
                        name={language === 'ar' ? 'المصروفات' : 'Expenses'}
                      />
                      <Bar 
                        dataKey="profit" 
                        fill="hsl(220, 100%, 35%)" 
                        radius={[4, 4, 0, 0]}
                        name={language === 'ar' ? 'الربح' : 'Profit'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sector Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ar' ? 'توزيع القطاعات' : 'Sector Distribution'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 'نسبة الاستثمارات حسب القطاع' : 'Investment allocation by sector'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {sectorData.map((sector, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-sm text-muted-foreground">{sector.name}</span>
                    <span className="text-sm font-semibold ml-auto">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="100%" 
                  data={performanceData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend 
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
