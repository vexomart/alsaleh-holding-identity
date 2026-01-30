import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Unlock,
  UserX,
  Globe,
  Clock,
  MapPin,
  Laptop,
  Smartphone,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'failed_login' | 'security_alert';
  user: string;
  action: string;
  actionAr: string;
  ip: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'warning' | 'danger';
}

const mockAuditLogs: AuditLog[] = [
  { id: '1', type: 'login', user: 'ahmed@holding.com', action: 'Successful login', actionAr: 'تسجيل دخول ناجح', ip: '192.168.1.100', location: 'Riyadh, SA', device: 'Chrome/Windows', timestamp: '2 mins ago', status: 'success' },
  { id: '2', type: 'failed_login', user: 'unknown@test.com', action: 'Failed login attempt', actionAr: 'محاولة تسجيل دخول فاشلة', ip: '45.33.32.156', location: 'Unknown', device: 'Firefox/Linux', timestamp: '15 mins ago', status: 'danger' },
  { id: '3', type: 'permission_change', user: 'sara@holding.com', action: 'Role upgraded to Manager', actionAr: 'ترقية الدور إلى مسؤول', ip: '192.168.1.105', location: 'Jeddah, SA', device: 'Safari/MacOS', timestamp: '1 hour ago', status: 'warning' },
  { id: '4', type: 'data_access', user: 'mohammed@holding.com', action: 'Exported financial report', actionAr: 'تصدير تقرير مالي', ip: '192.168.1.110', location: 'Riyadh, SA', device: 'Chrome/Windows', timestamp: '2 hours ago', status: 'success' },
  { id: '5', type: 'security_alert', user: 'system', action: 'Multiple failed logins detected', actionAr: 'تم اكتشاف محاولات تسجيل دخول متعددة فاشلة', ip: '103.45.67.89', location: 'Unknown', device: 'Bot', timestamp: '3 hours ago', status: 'danger' },
  { id: '6', type: 'logout', user: 'fatima@holding.com', action: 'User logged out', actionAr: 'تسجيل خروج المستخدم', ip: '192.168.1.120', location: 'Dubai, UAE', device: 'Mobile/iOS', timestamp: '4 hours ago', status: 'success' },
  { id: '7', type: 'data_access', user: 'khalid@holding.com', action: 'Viewed user database', actionAr: 'عرض قاعدة بيانات المستخدمين', ip: '192.168.1.125', location: 'Riyadh, SA', device: 'Edge/Windows', timestamp: '5 hours ago', status: 'success' },
  { id: '8', type: 'login', user: 'nora@holding.com', action: 'Login from new device', actionAr: 'تسجيل دخول من جهاز جديد', ip: '192.168.1.130', location: 'Riyadh, SA', device: 'Mobile/Android', timestamp: '6 hours ago', status: 'warning' },
];

const typeConfig = {
  login: { icon: Lock, color: 'text-success', bg: 'bg-success/10' },
  logout: { icon: Unlock, color: 'text-muted-foreground', bg: 'bg-muted' },
  permission_change: { icon: Shield, color: 'text-warning', bg: 'bg-warning/10' },
  data_access: { icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
  failed_login: { icon: UserX, color: 'text-destructive', bg: 'bg-destructive/10' },
  security_alert: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export const SecurityAudit: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ip.includes(searchQuery);
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const securityStats = {
    totalEvents: mockAuditLogs.length,
    successfulLogins: mockAuditLogs.filter(l => l.type === 'login' && l.status === 'success').length,
    failedAttempts: mockAuditLogs.filter(l => l.type === 'failed_login').length,
    securityAlerts: mockAuditLogs.filter(l => l.type === 'security_alert').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'ar' ? 'الأمان والتدقيق' : 'Security & Audit'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'مراقبة جميع الأنشطة الأمنية'
                : 'Monitor all security activities'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'ar' ? 'إجمالي الأحداث' : 'Total Events', value: securityStats.totalEvents, icon: Eye, color: 'text-primary' },
          { label: language === 'ar' ? 'تسجيلات ناجحة' : 'Successful Logins', value: securityStats.successfulLogins, icon: CheckCircle, color: 'text-success' },
          { label: language === 'ar' ? 'محاولات فاشلة' : 'Failed Attempts', value: securityStats.failedAttempts, icon: XCircle, color: 'text-destructive' },
          { label: language === 'ar' ? 'تنبيهات أمنية' : 'Security Alerts', value: securityStats.securityAlerts, icon: AlertTriangle, color: 'text-warning' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', language === 'ar' ? 'right-3' : 'left-3')} />
              <Input
                placeholder={language === 'ar' ? 'بحث في السجلات...' : 'Search logs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(language === 'ar' ? 'pr-10' : 'pl-10')}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === 'ar' ? 'نوع الحدث' : 'Event Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                <SelectItem value="login">{language === 'ar' ? 'تسجيل دخول' : 'Login'}</SelectItem>
                <SelectItem value="logout">{language === 'ar' ? 'تسجيل خروج' : 'Logout'}</SelectItem>
                <SelectItem value="failed_login">{language === 'ar' ? 'محاولة فاشلة' : 'Failed Login'}</SelectItem>
                <SelectItem value="permission_change">{language === 'ar' ? 'تغيير صلاحية' : 'Permission Change'}</SelectItem>
                <SelectItem value="data_access">{language === 'ar' ? 'وصول للبيانات' : 'Data Access'}</SelectItem>
                <SelectItem value="security_alert">{language === 'ar' ? 'تنبيه أمني' : 'Security Alert'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-3">
            <AnimatePresence>
              {filteredLogs.map((log, index) => {
                const config = typeConfig[log.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'p-4 rounded-xl border transition-all hover:shadow-md',
                      log.status === 'danger' && 'border-destructive/30 bg-destructive/5',
                      log.status === 'warning' && 'border-warning/30 bg-warning/5',
                      log.status === 'success' && 'border-border'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('p-2 rounded-lg shrink-0', config.bg)}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {language === 'ar' ? log.actionAr : log.action}
                            </p>
                            <p className="text-sm text-muted-foreground">{log.user}</p>
                          </div>
                          <Badge variant={log.status === 'danger' ? 'destructive' : log.status === 'warning' ? 'secondary' : 'outline'} className="shrink-0">
                            {log.status === 'danger' && (language === 'ar' ? 'خطر' : 'Danger')}
                            {log.status === 'warning' && (language === 'ar' ? 'تحذير' : 'Warning')}
                            {log.status === 'success' && (language === 'ar' ? 'نجاح' : 'Success')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{log.ip}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{log.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {log.device.includes('Mobile') ? (
                              <Smartphone className="w-3 h-3" />
                            ) : (
                              <Laptop className="w-3 h-3" />
                            )}
                            <span className="truncate">{log.device}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};
