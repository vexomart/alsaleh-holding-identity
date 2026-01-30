import React from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Cloud,
  Shield,
  Zap,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SystemMetric {
  name: string;
  nameAr: string;
  value: number;
  max: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ElementType;
}

interface ServiceStatus {
  name: string;
  nameAr: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  latency: string;
  icon: React.ElementType;
}

const systemMetrics: SystemMetric[] = [
  { name: 'CPU Usage', nameAr: 'استخدام المعالج', value: 45, max: 100, unit: '%', status: 'healthy', icon: Cpu },
  { name: 'Memory Usage', nameAr: 'استخدام الذاكرة', value: 68, max: 100, unit: '%', status: 'healthy', icon: HardDrive },
  { name: 'Storage', nameAr: 'التخزين', value: 234, max: 500, unit: 'GB', status: 'warning', icon: Database },
  { name: 'Network', nameAr: 'الشبكة', value: 85, max: 1000, unit: 'Mbps', status: 'healthy', icon: Wifi },
];

const services: ServiceStatus[] = [
  { name: 'Main API', nameAr: 'API الرئيسي', status: 'online', uptime: '99.99%', latency: '45ms', icon: Server },
  { name: 'Database', nameAr: 'قاعدة البيانات', status: 'online', uptime: '99.95%', latency: '12ms', icon: Database },
  { name: 'CDN', nameAr: 'شبكة توزيع المحتوى', status: 'online', uptime: '100%', latency: '8ms', icon: Cloud },
  { name: 'Authentication', nameAr: 'المصادقة', status: 'online', uptime: '99.99%', latency: '23ms', icon: Shield },
  { name: 'Analytics', nameAr: 'التحليلات', status: 'degraded', uptime: '98.5%', latency: '156ms', icon: Activity },
  { name: 'Email Service', nameAr: 'خدمة البريد', status: 'online', uptime: '99.9%', latency: '89ms', icon: Zap },
];

const statusConfig = {
  online: { labelEn: 'Online', labelAr: 'متصل', color: 'bg-success text-success-foreground', icon: CheckCircle },
  degraded: { labelEn: 'Degraded', labelAr: 'متدهور', color: 'bg-warning text-warning-foreground', icon: AlertTriangle },
  offline: { labelEn: 'Offline', labelAr: 'غير متصل', color: 'bg-destructive text-destructive-foreground', icon: XCircle },
};

const healthStatusConfig = {
  healthy: { color: 'text-success', bgColor: 'bg-success' },
  warning: { color: 'text-warning', bgColor: 'bg-warning' },
  critical: { color: 'text-destructive', bgColor: 'bg-destructive' },
};

export const SystemHealth: React.FC = () => {
  const { language } = useLanguage();

  const overallHealth = services.every(s => s.status === 'online') ? 'healthy' : 
                        services.some(s => s.status === 'offline') ? 'critical' : 'warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-success/10">
            <Server className="w-6 h-6 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'ar' ? 'صحة النظام' : 'System Health'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('w-2 h-2 rounded-full animate-pulse', healthStatusConfig[overallHealth].bgColor)} />
              <p className={cn('text-sm font-medium', healthStatusConfig[overallHealth].color)}>
                {overallHealth === 'healthy' && (language === 'ar' ? 'جميع الأنظمة تعمل' : 'All Systems Operational')}
                {overallHealth === 'warning' && (language === 'ar' ? 'بعض الأنظمة متأثرة' : 'Some Systems Affected')}
                {overallHealth === 'critical' && (language === 'ar' ? 'أنظمة حرجة متوقفة' : 'Critical Systems Down')}
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'p-2 rounded-lg',
                      metric.status === 'healthy' ? 'bg-success/10' : 
                      metric.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
                    )}>
                      <metric.icon className={cn(
                        'w-5 h-5',
                        healthStatusConfig[metric.status].color
                      )} />
                    </div>
                    <span className="text-sm font-medium">
                      {language === 'ar' ? metric.nameAr : metric.name}
                    </span>
                  </div>
                  <span className={cn(
                    'text-sm font-bold',
                    healthStatusConfig[metric.status].color
                  )}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.max) * 100} 
                  className={cn(
                    'h-2',
                    metric.status === 'warning' && '[&>div]:bg-warning',
                    metric.status === 'critical' && '[&>div]:bg-destructive'
                  )}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'ar' ? `من ${metric.max}${metric.unit}` : `of ${metric.max}${metric.unit}`}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {language === 'ar' ? 'حالة الخدمات' : 'Services Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const config = statusConfig[service.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    service.status === 'online' ? 'border-success/20 bg-success/5' :
                    service.status === 'degraded' ? 'border-warning/20 bg-warning/5' :
                    'border-destructive/20 bg-destructive/5'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        service.status === 'online' ? 'bg-success/10' :
                        service.status === 'degraded' ? 'bg-warning/10' : 'bg-destructive/10'
                      )}>
                        <service.icon className={cn(
                          'w-5 h-5',
                          service.status === 'online' ? 'text-success' :
                          service.status === 'degraded' ? 'text-warning' : 'text-destructive'
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {language === 'ar' ? service.nameAr : service.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <StatusIcon className={cn(
                            'w-3 h-3',
                            service.status === 'online' ? 'text-success' :
                            service.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          )} />
                          <span className={cn(
                            'text-xs font-medium',
                            service.status === 'online' ? 'text-success' :
                            service.status === 'degraded' ? 'text-warning' : 'text-destructive'
                          )}>
                            {language === 'ar' ? config.labelAr : config.labelEn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? 'وقت التشغيل:' : 'Uptime:'}</span>
                      <span className="font-semibold text-foreground">{service.uptime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>{language === 'ar' ? 'التأخير:' : 'Latency:'}</span>
                      <span className="font-semibold text-foreground">{service.latency}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'ar' ? 'الطلبات/ثانية' : 'Requests/sec', value: '2,847', icon: Activity },
          { label: language === 'ar' ? 'متوسط الاستجابة' : 'Avg Response', value: '45ms', icon: Clock },
          { label: language === 'ar' ? 'معدل الأخطاء' : 'Error Rate', value: '0.02%', icon: AlertTriangle },
          { label: language === 'ar' ? 'الاتصالات النشطة' : 'Active Connections', value: '1,234', icon: Wifi },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
