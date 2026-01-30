import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  Clock,
  ChevronRight,
  Bell,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface Anomaly {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  metric: string;
  deviation: number;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  affectedArea: string;
}

export const AnomalyDetection: React.FC = () => {
  const { language } = useLanguage();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mockAnomalies: Anomaly[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'Unusual Transaction Volume',
      titleAr: 'حجم معاملات غير عادي',
      description: 'Transaction volume spike detected - 340% above normal baseline. Investigating potential causes.',
      descriptionAr: 'تم اكتشاف ارتفاع حاد في حجم المعاملات - 340% فوق المستوى الطبيعي. جاري التحقيق.',
      metric: 'transactions/hour',
      deviation: 340,
      timestamp: new Date(Date.now() - 300000),
      status: 'investigating',
      affectedArea: 'Payment Processing',
    },
    {
      id: '2',
      severity: 'warning',
      title: 'API Latency Increase',
      titleAr: 'زيادة في زمن استجابة API',
      description: 'API response time increased by 85%. Performance monitoring triggered.',
      descriptionAr: 'زاد وقت استجابة API بنسبة 85%. تم تشغيل مراقبة الأداء.',
      metric: 'ms response',
      deviation: 85,
      timestamp: new Date(Date.now() - 1800000),
      status: 'active',
      affectedArea: 'Infrastructure',
    },
    {
      id: '3',
      severity: 'info',
      title: 'New User Registrations Surge',
      titleAr: 'ارتفاع في تسجيلات المستخدمين الجدد',
      description: 'User registrations increased by 150% compared to weekly average.',
      descriptionAr: 'زادت تسجيلات المستخدمين بنسبة 150% مقارنة بالمعدل الأسبوعي.',
      metric: 'registrations/day',
      deviation: 150,
      timestamp: new Date(Date.now() - 3600000),
      status: 'active',
      affectedArea: 'User Management',
    },
    {
      id: '4',
      severity: 'warning',
      title: 'Revenue Drop in Region MENA',
      titleAr: 'انخفاض الإيرادات في منطقة الشرق الأوسط',
      description: 'Revenue in MENA region dropped by 25% compared to projected forecast.',
      descriptionAr: 'انخفضت الإيرادات في منطقة الشرق الأوسط بنسبة 25% مقارنة بالتوقعات.',
      metric: 'revenue variance',
      deviation: -25,
      timestamp: new Date(Date.now() - 7200000),
      status: 'resolved',
      affectedArea: 'Finance',
    },
  ];

  useEffect(() => {
    setAnomalies(mockAnomalies);
  }, []);

  const getSeverityConfig = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bg: 'bg-destructive/10 border-destructive/30',
          badge: 'bg-destructive/20 text-destructive',
          pulse: true,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-warning',
          bg: 'bg-warning/10 border-warning/30',
          badge: 'bg-warning/20 text-warning',
          pulse: false,
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-primary',
          bg: 'bg-primary/10 border-primary/30',
          badge: 'bg-primary/20 text-primary',
          pulse: false,
        };
    }
  };

  const getStatusConfig = (status: Anomaly['status']) => {
    switch (status) {
      case 'active':
        return { label: language === 'ar' ? 'نشط' : 'Active', color: 'text-destructive' };
      case 'investigating':
        return { label: language === 'ar' ? 'قيد التحقيق' : 'Investigating', color: 'text-warning' };
      case 'resolved':
        return { label: language === 'ar' ? 'تم الحل' : 'Resolved', color: 'text-success' };
    }
  };

  const filteredAnomalies = anomalies.filter(
    a => filter === 'all' || a.severity === filter
  );

  const criticalCount = anomalies.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = anomalies.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-destructive/20 to-warning/20">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              {criticalCount > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-destructive-foreground">
                    {criticalCount}
                  </span>
                </motion.div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {language === 'ar' ? 'اكتشاف الحالات الشاذة' : 'Anomaly Detection'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'مراقبة ذكية للأنظمة' : 'Intelligent system monitoring'}
              </p>
            </div>
          </div>

          {/* Filter Badges */}
          <div className="flex items-center gap-2">
            {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs",
                  filter === f && f === 'critical' && 'bg-destructive hover:bg-destructive/90',
                  filter === f && f === 'warning' && 'bg-warning hover:bg-warning/90 text-warning-foreground',
                  filter === f && f === 'info' && 'bg-primary hover:bg-primary/90'
                )}
              >
                {f === 'all' 
                  ? (language === 'ar' ? 'الكل' : 'All')
                  : f === 'critical'
                  ? (language === 'ar' ? 'حرج' : 'Critical')
                  : f === 'warning'
                  ? (language === 'ar' ? 'تحذير' : 'Warning')
                  : (language === 'ar' ? 'معلومات' : 'Info')
                }
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span>{criticalCount} {language === 'ar' ? 'حرج' : 'Critical'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span>{warningCount} {language === 'ar' ? 'تحذيرات' : 'Warnings'}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <Bell className="w-3.5 h-3.5" />
            {language === 'ar' ? 'إعدادات التنبيهات' : 'Alert Settings'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredAnomalies.map((anomaly, index) => {
            const config = getSeverityConfig(anomaly.severity);
            const statusConfig = getStatusConfig(anomaly.status);
            const Icon = config.icon;

            return (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  config.bg,
                  anomaly.status === 'resolved' && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg bg-card/50 relative", config.color)}>
                    <Icon className="w-5 h-5" />
                    {config.pulse && anomaly.status !== 'resolved' && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-lg bg-destructive"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {language === 'ar' ? anomaly.titleAr : anomaly.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", config.badge)}>
                          {Math.abs(anomaly.deviation)}% {anomaly.deviation > 0 ? '↑' : '↓'}
                        </Badge>
                        {anomaly.status === 'resolved' && (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'ar' ? anomaly.descriptionAr : anomaly.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={cn("font-medium", statusConfig.color)}>
                          {statusConfig.label}
                        </span>
                        <span className="text-muted-foreground">
                          {anomaly.affectedArea}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(anomaly.timestamp).toLocaleTimeString(
                          language === 'ar' ? 'ar-SA' : 'en-US',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAnomalies.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {language === 'ar' ? 'لا توجد حالات شاذة' : 'No anomalies detected'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
