import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Zap,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface Recommendation {
  id: string;
  category: 'growth' | 'risk' | 'efficiency' | 'investment';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  priority: number;
  potentialValue: string;
  deadline?: string;
  actionItems: string[];
  actionItemsAr: string[];
}

export const SmartRecommendations: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | null>>({});

  const recommendations: Recommendation[] = [
    {
      id: '1',
      category: 'growth',
      title: 'Expand into Southeast Asian Markets',
      titleAr: 'التوسع في أسواق جنوب شرق آسيا',
      description: 'AI analysis suggests 45% growth potential in Vietnam and Indonesia markets based on current market trends.',
      descriptionAr: 'يشير تحليل الذكاء الاصطناعي إلى إمكانية نمو 45% في أسواق فيتنام وإندونيسيا.',
      impact: 92,
      effort: 'high',
      priority: 1,
      potentialValue: '$12.5M',
      deadline: 'Q2 2024',
      actionItems: [
        'Conduct market research study',
        'Identify local partners',
        'Prepare regulatory compliance',
      ],
      actionItemsAr: [
        'إجراء دراسة سوق',
        'تحديد الشركاء المحليين',
        'إعداد الامتثال التنظيمي',
      ],
    },
    {
      id: '2',
      category: 'risk',
      title: 'Diversify Currency Exposure',
      titleAr: 'تنويع التعرض للعملات',
      description: 'Portfolio shows 68% USD concentration. Recommend hedging strategy to reduce volatility risk.',
      descriptionAr: 'تظهر المحفظة تركيز 68% بالدولار. يُنصح باستراتيجية تحوط لتقليل مخاطر التقلب.',
      impact: 78,
      effort: 'medium',
      priority: 2,
      potentialValue: 'Risk -35%',
      actionItems: [
        'Review current FX positions',
        'Implement hedging instruments',
        'Set up monitoring alerts',
      ],
      actionItemsAr: [
        'مراجعة مراكز العملات الحالية',
        'تنفيذ أدوات التحوط',
        'إعداد تنبيهات المراقبة',
      ],
    },
    {
      id: '3',
      category: 'efficiency',
      title: 'Automate Financial Reporting',
      titleAr: 'أتمتة التقارير المالية',
      description: 'Manual reporting processes consuming 120 hours/month. AI automation can reduce this by 85%.',
      descriptionAr: 'عمليات إعداد التقارير اليدوية تستهلك 120 ساعة/شهر. الأتمتة يمكن أن تقلل هذا بنسبة 85%.',
      impact: 85,
      effort: 'low',
      priority: 3,
      potentialValue: '$45K/year',
      actionItems: [
        'Audit current processes',
        'Select automation tools',
        'Train finance team',
      ],
      actionItemsAr: [
        'تدقيق العمليات الحالية',
        'اختيار أدوات الأتمتة',
        'تدريب فريق المالية',
      ],
    },
    {
      id: '4',
      category: 'investment',
      title: 'Increase Renewable Energy Allocation',
      titleAr: 'زيادة تخصيص الطاقة المتجددة',
      description: 'Sector showing 23% YoY growth. Current portfolio underweight by 15% vs optimal allocation.',
      descriptionAr: 'القطاع يُظهر نمو 23% سنوياً. المحفظة الحالية أقل بـ 15% من التخصيص الأمثل.',
      impact: 88,
      effort: 'medium',
      priority: 4,
      potentialValue: '+18% ROI',
      actionItems: [
        'Research top performers',
        'Rebalance portfolio',
        'Set performance targets',
      ],
      actionItemsAr: [
        'البحث عن الأفضل أداءً',
        'إعادة موازنة المحفظة',
        'تحديد أهداف الأداء',
      ],
    },
  ];

  const categoryConfig = {
    growth: {
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10 border-success/30',
      label: language === 'ar' ? 'النمو' : 'Growth',
    },
    risk: {
      icon: Shield,
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/30',
      label: language === 'ar' ? 'المخاطر' : 'Risk',
    },
    efficiency: {
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/30',
      label: language === 'ar' ? 'الكفاءة' : 'Efficiency',
    },
    investment: {
      icon: DollarSign,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/30',
      label: language === 'ar' ? 'الاستثمار' : 'Investment',
    },
  };

  const getEffortBadge = (effort: Recommendation['effort']) => {
    const config = {
      low: { label: language === 'ar' ? 'منخفض' : 'Low', color: 'bg-success/20 text-success' },
      medium: { label: language === 'ar' ? 'متوسط' : 'Medium', color: 'bg-warning/20 text-warning' },
      high: { label: language === 'ar' ? 'عالي' : 'High', color: 'bg-destructive/20 text-destructive' },
    };
    return config[effort];
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const filteredRecommendations = selectedCategory
    ? recommendations.filter(r => r.category === selectedCategory)
    : recommendations;

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-warning/20 to-accent/20">
              <Lightbulb className="w-6 h-6 text-warning" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {language === 'ar' ? 'التوصيات الذكية' : 'Smart Recommendations'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'اقتراحات مخصصة بالذكاء الاصطناعي' : 'AI-personalized suggestions'}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "text-xs gap-1.5",
                selectedCategory === key && config.bg.replace('bg-', 'bg-').replace('/10', '/80')
              )}
            >
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredRecommendations.map((rec, index) => {
          const config = categoryConfig[rec.category];
          const Icon = config.icon;
          const effortConfig = getEffortBadge(rec.effort);
          const isExpanded = expandedId === rec.id;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                config.bg,
                isExpanded && "ring-2 ring-primary/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-card/50", config.color)}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={cn("text-xs", config.bg)}>
                          #{rec.priority}
                        </Badge>
                        <h4 className="font-semibold text-sm">
                          {language === 'ar' ? rec.titleAr : rec.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? rec.descriptionAr : rec.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-primary/20 text-primary text-xs font-bold">
                        {rec.potentialValue}
                      </Badge>
                      {rec.deadline && (
                        <span className="text-xs text-muted-foreground">{rec.deadline}</span>
                      )}
                    </div>
                  </div>

                  {/* Impact & Effort */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'التأثير' : 'Impact'}
                        </span>
                        <span className="font-medium">{rec.impact}%</span>
                      </div>
                      <Progress value={rec.impact} className="h-1.5" />
                    </div>
                    <Badge className={cn("text-xs", effortConfig.color)}>
                      {language === 'ar' ? 'الجهد:' : 'Effort:'} {effortConfig.label}
                    </Badge>
                  </div>

                  {/* Expandable Content */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs font-medium mb-2">
                        {language === 'ar' ? 'خطوات العمل:' : 'Action Items:'}
                      </p>
                      <ul className="space-y-1.5">
                        {(language === 'ar' ? rec.actionItemsAr : rec.actionItems).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="w-3 h-3 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(rec.id, 'up')}
                        className={cn(
                          "h-8 w-8 p-0",
                          feedback[rec.id] === 'up' && "bg-success/20 text-success"
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(rec.id, 'down')}
                        className={cn(
                          "h-8 w-8 p-0",
                          feedback[rec.id] === 'down' && "bg-destructive/20 text-destructive"
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="gap-1 text-xs"
                    >
                      {isExpanded 
                        ? (language === 'ar' ? 'إخفاء' : 'Hide') 
                        : (language === 'ar' ? 'التفاصيل' : 'Details')
                      }
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};
