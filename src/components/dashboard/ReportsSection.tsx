import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  Eye,
  BarChart2,
  PieChart,
  TrendingUp,
  DollarSign,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  titleAr: string;
  type: 'financial' | 'performance' | 'investment' | 'quarterly';
  date: string;
  status: 'ready' | 'processing' | 'scheduled';
  size: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2024 Financial Report',
    titleAr: 'التقرير المالي للربع الرابع 2024',
    type: 'quarterly',
    date: '2024-12-31',
    status: 'ready',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Annual Investment Summary',
    titleAr: 'ملخص الاستثمارات السنوي',
    type: 'investment',
    date: '2024-12-28',
    status: 'ready',
    size: '5.1 MB',
  },
  {
    id: '3',
    title: 'Portfolio Performance Analysis',
    titleAr: 'تحليل أداء المحفظة',
    type: 'performance',
    date: '2024-12-25',
    status: 'ready',
    size: '3.2 MB',
  },
  {
    id: '4',
    title: 'Monthly Revenue Report',
    titleAr: 'تقرير الإيرادات الشهري',
    type: 'financial',
    date: '2024-12-20',
    status: 'processing',
    size: '--',
  },
  {
    id: '5',
    title: 'Q1 2025 Forecast',
    titleAr: 'توقعات الربع الأول 2025',
    type: 'quarterly',
    date: '2025-01-15',
    status: 'scheduled',
    size: '--',
  },
];

const typeConfig = {
  financial: {
    icon: DollarSign,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    labelAr: 'مالي',
    labelEn: 'Financial',
  },
  performance: {
    icon: TrendingUp,
    color: 'text-success',
    bg: 'bg-success/10',
    labelAr: 'أداء',
    labelEn: 'Performance',
  },
  investment: {
    icon: PieChart,
    color: 'text-accent',
    bg: 'bg-accent/10',
    labelAr: 'استثمار',
    labelEn: 'Investment',
  },
  quarterly: {
    icon: BarChart2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    labelAr: 'ربعي',
    labelEn: 'Quarterly',
  },
};

const statusConfig = {
  ready: {
    labelAr: 'جاهز',
    labelEn: 'Ready',
    variant: 'default' as const,
    className: 'bg-success text-success-foreground',
  },
  processing: {
    labelAr: 'قيد المعالجة',
    labelEn: 'Processing',
    variant: 'secondary' as const,
    className: 'bg-warning text-warning-foreground',
  },
  scheduled: {
    labelAr: 'مجدول',
    labelEn: 'Scheduled',
    variant: 'outline' as const,
    className: '',
  },
};

export const ReportsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = (language === 'ar' ? report.titleAr : report.title)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.reports')}</h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${filteredReports.length} تقرير متاح` 
                : `${filteredReports.length} reports available`
              }
            </p>
          </div>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'إنشاء تقرير جديد' : 'Generate New Report'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
              <Input
                placeholder={language === 'ar' ? 'بحث في التقارير...' : 'Search reports...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === 'ar' ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All Types'}</SelectItem>
                <SelectItem value="financial">{language === 'ar' ? 'مالي' : 'Financial'}</SelectItem>
                <SelectItem value="performance">{language === 'ar' ? 'أداء' : 'Performance'}</SelectItem>
                <SelectItem value="investment">{language === 'ar' ? 'استثمار' : 'Investment'}</SelectItem>
                <SelectItem value="quarterly">{language === 'ar' ? 'ربعي' : 'Quarterly'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All Status'}</SelectItem>
                <SelectItem value="ready">{language === 'ar' ? 'جاهز' : 'Ready'}</SelectItem>
                <SelectItem value="processing">{language === 'ar' ? 'قيد المعالجة' : 'Processing'}</SelectItem>
                <SelectItem value="scheduled">{language === 'ar' ? 'مجدول' : 'Scheduled'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report, index) => {
          const typeInfo = typeConfig[report.type];
          const statusInfo = statusConfig[report.status];
          const Icon = typeInfo.icon;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('p-3 rounded-xl', typeInfo.bg)}>
                      <Icon className={cn('w-6 h-6', typeInfo.color)} />
                    </div>
                    <Badge className={statusInfo.className}>
                      {language === 'ar' ? statusInfo.labelAr : statusInfo.labelEn}
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {language === 'ar' ? report.titleAr : report.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(report.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                    {report.size !== '--' && (
                      <>
                        <span>•</span>
                        <span>{report.size}</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={report.status !== 'ready'}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'عرض' : 'View'}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          disabled={report.status !== 'ready'}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {t('action.download')}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>PDF</DropdownMenuItem>
                        <DropdownMenuItem>Excel</DropdownMenuItem>
                        <DropdownMenuItem>CSV</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>{language === 'ar' ? 'لا توجد تقارير مطابقة' : 'No matching reports'}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
