import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface AIInsight {
  id: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
}

export const AIInsightsPanel: React.FC = () => {
  const { language } = useLanguage();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'positive',
      title: language === 'ar' ? 'نمو الإيرادات يتجاوز التوقعات' : 'Revenue Growth Exceeds Projections',
      description: language === 'ar' 
        ? 'تحليل الذكاء الاصطناعي يُظهر نمو الإيرادات بنسبة 23% هذا الربع، متجاوزاً التوقعات بـ 8 نقاط مئوية'
        : 'AI analysis shows 23% revenue growth this quarter, exceeding projections by 8 percentage points',
      confidence: 94,
      impact: 'high',
      category: language === 'ar' ? 'المالية' : 'Finance',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'warning',
      title: language === 'ar' ? 'تباطؤ في قطاع التكنولوجيا' : 'Technology Sector Slowdown Detected',
      description: language === 'ar'
        ? 'نماذج التنبؤ تشير إلى تباطؤ محتمل في قطاع التكنولوجيا خلال الأشهر الـ 3 القادمة'
        : 'Predictive models indicate potential slowdown in tech sector over next 3 months',
      confidence: 78,
      impact: 'medium',
      category: language === 'ar' ? 'السوق' : 'Market',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'positive',
      title: language === 'ar' ? 'فرصة استثمارية جديدة' : 'New Investment Opportunity Identified',
      description: language === 'ar'
        ? 'الذكاء الاصطناعي اكتشف فرصة واعدة في قطاع الطاقة المتجددة بعائد متوقع 18%'
        : 'AI discovered promising opportunity in renewable energy sector with expected 18% ROI',
      confidence: 86,
      impact: 'high',
      category: language === 'ar' ? 'الاستثمار' : 'Investment',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '4',
      type: 'negative',
      title: language === 'ar' ? 'مخاطر العملات الأجنبية' : 'Currency Risk Alert',
      description: language === 'ar'
        ? 'تحليل المخاطر يُظهر تعرض عالي لتقلبات اليورو - يُنصح بالتحوط'
        : 'Risk analysis shows high exposure to EUR volatility - hedging recommended',
      confidence: 91,
      impact: 'medium',
      category: language === 'ar' ? 'المخاطر' : 'Risk',
      timestamp: new Date(Date.now() - 10800000),
    },
  ];

  useEffect(() => {
    setInsights(mockInsights);
  }, [language]);

  const generateNewInsights = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInsights(prev => [...mockInsights.slice(0, 2), ...prev.slice(0, 2)]);
    setIsGenerating(false);
  };

  const getTypeStyles = (type: AIInsight['type']) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-success/10 border-success/30',
          icon: CheckCircle,
          iconColor: 'text-success',
          badge: 'bg-success/20 text-success',
        };
      case 'negative':
        return {
          bg: 'bg-destructive/10 border-destructive/30',
          icon: TrendingDown,
          iconColor: 'text-destructive',
          badge: 'bg-destructive/20 text-destructive',
        };
      case 'warning':
        return {
          bg: 'bg-warning/10 border-warning/30',
          icon: AlertTriangle,
          iconColor: 'text-warning',
          badge: 'bg-warning/20 text-warning',
        };
      default:
        return {
          bg: 'bg-muted/50 border-border',
          icon: Zap,
          iconColor: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground',
        };
    }
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    const colors = {
      high: 'bg-destructive/20 text-destructive',
      medium: 'bg-warning/20 text-warning',
      low: 'bg-success/20 text-success',
    };
    return colors[impact];
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {language === 'ar' ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'تحليلات ذكية في الوقت الفعلي' : 'Real-time intelligent analysis'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateNewInsights}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const styles = getTypeStyles(insight.type);
            const Icon = styles.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                  styles.bg,
                  activeInsight === insight.id && "ring-2 ring-primary/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg bg-card/50", styles.iconColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm truncate">{insight.title}</h4>
                      <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                        {insight.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {insight.description}
                    </p>
                    
                    <AnimatePresence>
                      {activeInsight === insight.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t border-border/50"
                        >
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              <span className="text-muted-foreground">
                                {language === 'ar' ? 'الثقة:' : 'Confidence:'}
                              </span>
                              <span className="font-semibold">{insight.confidence}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-primary" />
                              <span className="text-muted-foreground">
                                {language === 'ar' ? 'التأثير:' : 'Impact:'}
                              </span>
                              <Badge className={cn("text-xs", getImpactBadge(insight.impact))}>
                                {insight.impact}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2 w-full gap-2">
                            {language === 'ar' ? 'عرض التحليل الكامل' : 'View Full Analysis'}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
