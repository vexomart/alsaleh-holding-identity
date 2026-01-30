import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileSpreadsheet, FileText, Calendar, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReportOption {
  id: string;
  name: string;
  nameAr: string;
  checked: boolean;
}

export const ExportReports: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('last-month');
  const [isExporting, setIsExporting] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportOption[]>([
    { id: 'financial', name: 'Financial Summary', nameAr: 'ملخص مالي', checked: true },
    { id: 'performance', name: 'Performance Metrics', nameAr: 'مقاييس الأداء', checked: true },
    { id: 'users', name: 'User Analytics', nameAr: 'تحليلات المستخدمين', checked: false },
    { id: 'transactions', name: 'Transaction History', nameAr: 'سجل المعاملات', checked: false },
    { id: 'trends', name: 'Trend Analysis', nameAr: 'تحليل الاتجاهات', checked: true },
  ]);

  const handleExport = async () => {
    const selectedReports = reportOptions.filter(r => r.checked);
    if (selectedReports.length === 0) {
      toast.error(isRTL ? 'يرجى اختيار تقرير واحد على الأقل' : 'Please select at least one report');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    toast.success(
      isRTL 
        ? `تم تصدير ${selectedReports.length} تقارير بنجاح` 
        : `Successfully exported ${selectedReports.length} reports`
    );
  };

  const toggleReport = (id: string) => {
    setReportOptions(prev => 
      prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            {isRTL ? 'تصدير التقارير' : 'Export Reports'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">
                {isRTL ? 'الصيغة' : 'Format'}
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      Excel
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="text-sm text-muted-foreground mb-1.5 block">
                {isRTL ? 'الفترة' : 'Period'}
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-9">
                  <Calendar className="w-4 h-4 me-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">{isRTL ? 'آخر أسبوع' : 'Last Week'}</SelectItem>
                  <SelectItem value="last-month">{isRTL ? 'آخر شهر' : 'Last Month'}</SelectItem>
                  <SelectItem value="last-quarter">{isRTL ? 'آخر ربع سنة' : 'Last Quarter'}</SelectItem>
                  <SelectItem value="last-year">{isRTL ? 'آخر سنة' : 'Last Year'}</SelectItem>
                  <SelectItem value="custom">{isRTL ? 'مخصص' : 'Custom'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Report Options */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {isRTL ? 'التقارير المضمنة' : 'Include Reports'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reportOptions.map((report) => (
                <div
                  key={report.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    report.checked 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border/50 hover:border-border"
                  )}
                  onClick={() => toggleReport(report.id)}
                >
                  <Checkbox checked={report.checked} />
                  <span className="text-sm">
                    {isRTL ? report.nameAr : report.name}
                  </span>
                  {report.checked && (
                    <Check className="w-4 h-4 text-primary ms-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <Button 
            className="w-full" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                {isRTL ? 'جاري التصدير...' : 'Exporting...'}
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 me-2" />
                {isRTL ? 'تصدير التقارير' : 'Export Reports'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
