import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Mail,
  CheckCircle,
  Loader2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface AutomatedReport {
  id: string;
  title: string;
  titleAr: string;
  type: 'financial' | 'performance' | 'risk' | 'market';
  frequency: 'daily' | 'weekly' | 'monthly';
  lastGenerated: Date;
  nextGeneration: Date;
  status: 'ready' | 'generating' | 'scheduled';
  aiSummary: string;
  aiSummaryAr: string;
  metrics: { label: string; value: string }[];
}

export const AutomatedReports: React.FC = () => {
  const { language } = useLanguage();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reports: AutomatedReport[] = [
    {
      id: '1',
      title: 'Executive Financial Summary',
      titleAr: 'الملخص المالي التنفيذي',
      type: 'financial',
      frequency: 'daily',
      lastGenerated: new Date(Date.now() - 3600000),
      nextGeneration: new Date(Date.now() + 82800000),
      status: 'ready',
      aiSummary: 'Strong performance across all divisions. Revenue up 12% MoM with technology sector leading growth at 18%.',
      aiSummaryAr: 'أداء قوي في جميع الأقسام. الإيرادات ارتفعت 12% شهرياً مع قيادة قطاع التكنولوجيا بنمو 18%.',
      metrics: [
        { label: 'Revenue', value: '$24.5M' },
        { label: 'Profit Margin', value: '23.4%' },
        { label: 'Growth', value: '+12%' },
      ],
    },
    {
      id: '2',
      title: 'Portfolio Performance Analysis',
      titleAr: 'تحليل أداء المحفظة',
      type: 'performance',
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 172800000),
      nextGeneration: new Date(Date.now() + 432000000),
      status: 'ready',
      aiSummary: 'Portfolio outperforming benchmark by 3.2%. Recommend rebalancing tech allocation to optimize returns.',
      aiSummaryAr: 'المحفظة تتفوق على المؤشر بنسبة 3.2%. يُنصح بإعادة موازنة تخصيص التكنولوجيا لتحسين العوائد.',
      metrics: [
        { label: 'Total Value', value: '$842M' },
        { label: 'YTD Return', value: '+18.7%' },
        { label: 'Alpha', value: '+3.2%' },
      ],
    },
    {
      id: '3',
      title: 'Risk Assessment Report',
      titleAr: 'تقرير تقييم المخاطر',
      type: 'risk',
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 259200000),
      nextGeneration: new Date(Date.now() + 345600000),
      status: 'scheduled',
      aiSummary: 'Overall risk score improved to 24/100. Currency hedging strategy reduced FX exposure by 35%.',
      aiSummaryAr: 'تحسن مؤشر المخاطر الإجمالي إلى 24/100. استراتيجية التحوط قللت التعرض للعملات بنسبة 35%.',
      metrics: [
        { label: 'Risk Score', value: '24/100' },
        { label: 'VaR', value: '$2.1M' },
        { label: 'Sharpe Ratio', value: '1.85' },
      ],
    },
    {
      id: '4',
      title: 'Market Intelligence Brief',
      titleAr: 'موجز استخبارات السوق',
      type: 'market',
      frequency: 'daily',
      lastGenerated: new Date(Date.now() - 7200000),
      nextGeneration: new Date(Date.now() + 79200000),
      status: 'ready',
      aiSummary: 'MENA markets showing bullish signals. Tech sector continues rally with 15% weekly gains.',
      aiSummaryAr: 'أسواق الشرق الأوسط تظهر إشارات صعودية. قطاع التكنولوجيا يواصل الارتفاع بمكاسب 15% أسبوعياً.',
      metrics: [
        { label: 'Markets Up', value: '18/24' },
        { label: 'Opportunities', value: '12' },
        { label: 'Alerts', value: '3' },
      ],
    },
  ];

  const typeConfig = {
    financial: {
      icon: BarChart3,
      color: 'text-success',
      bg: 'bg-success/10 border-success/30',
    },
    performance: {
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/30',
    },
    risk: {
      icon: PieChart,
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/30',
    },
    market: {
      icon: FileSpreadsheet,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/30',
    },
  };

  const frequencyLabel = {
    daily: { en: 'Daily', ar: 'يومي' },
    weekly: { en: 'Weekly', ar: 'أسبوعي' },
    monthly: { en: 'Monthly', ar: 'شهري' },
  };

  const handleGenerate = async (reportId: string) => {
    setGeneratingId(reportId);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratingId(null);
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return language === 'ar' ? 'الآن' : 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {language === 'ar' ? 'التقارير الآلية' : 'Automated Reports'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'تقارير مولدة بالذكاء الاصطناعي' : 'AI-generated intelligence reports'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="w-4 h-4" />
            {language === 'ar' ? 'إعدادات التوزيع' : 'Distribution Settings'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {reports.map((report, index) => {
          const config = typeConfig[report.type];
          const Icon = config.icon;
          const isGenerating = generatingId === report.id;
          const isExpanded = expandedId === report.id;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-card/50", config.color)}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-sm">
                          {language === 'ar' ? report.titleAr : report.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {language === 'ar' 
                            ? frequencyLabel[report.frequency].ar 
                            : frequencyLabel[report.frequency].en}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(report.lastGenerated)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {language === 'ar' ? 'التالي:' : 'Next:'}{' '}
                          {report.nextGeneration.toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { weekday: 'short', hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'ready' && (
                        <Badge className="bg-success/20 text-success text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {language === 'ar' ? 'جاهز' : 'Ready'}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate(report.id)}
                        disabled={isGenerating}
                        className="gap-1.5"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'تحميل' : 'Download'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-3 rounded-lg bg-card/50 mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        {language === 'ar' ? 'ملخص الذكاء الاصطناعي' : 'AI Summary'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? report.aiSummaryAr : report.aiSummary}
                    </p>
                  </div>

                  {/* Quick Metrics */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {report.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">{metric.label}:</span>
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expand Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : report.id)}
                    className="mt-3 w-full justify-center gap-1 text-xs"
                  >
                    {isExpanded 
                      ? (language === 'ar' ? 'إخفاء التفاصيل' : 'Hide Details') 
                      : (language === 'ar' ? 'عرض التفاصيل' : 'View Details')
                    }
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-90"
                    )} />
                  </Button>
                </div>
              </div>

              {/* Generating Progress */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-border/50"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'جاري توليد التقرير...' : 'Generating report...'}
                    </span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-1.5" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};
