import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Activity,
  Users,
  Database,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string;
  action: string;
  risk_level: string;
  metadata: any;
  created_at: string;
  resource_type?: string;
  resource_id?: string;
  user_agent?: string;
  ip_address?: any;
}

interface SensitiveDataAccess {
  id: string;
  resource_type: string;
  resource_id: string;
  access_type: string;
  data_classification: string;
  success: boolean;
  risk_score: number;
  metadata: any;
  created_at: string;
}

export default function EnhancedSecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [sensitiveAccess, setSensitiveAccess] = useState<SensitiveDataAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    highRiskEvents: 0,
    failedAccess: 0,
    averageRiskScore: 0
  });

  const { alerts, metrics, isMonitoring } = useSecurityMonitoring();

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // تحميل الأحداث الأمنية
      const { data: events } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // تحميل سجلات الوصول للبيانات الحساسة
      const { data: access } = await supabase
        .from('sensitive_data_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setSecurityEvents(events || []);
      setSensitiveAccess(access || []);

      // حساب الإحصائيات
      const totalEvents = (events?.length || 0) + (access?.length || 0);
      const highRiskEvents = [
        ...(events?.filter(e => e.risk_level === 'high' || e.risk_level === 'critical') || []),
        ...(access?.filter(a => a.risk_score >= 70) || [])
      ].length;
      const failedAccess = access?.filter(a => !a.success).length || 0;
      const avgRisk = access?.length 
        ? access.reduce((sum, a) => sum + a.risk_score, 0) / access.length 
        : 0;

      setStats({
        totalEvents,
        highRiskEvents,
        failedAccess,
        averageRiskScore: Math.round(avgRisk)
      });
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
    
    // تحديث البيانات كل دقيقة
    const interval = setInterval(loadSecurityData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string | number) => {
    if (typeof risk === 'string') {
      switch (risk) {
        case 'critical': return 'destructive';
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'default';
      }
    }
    
    if (risk >= 80) return 'destructive';
    if (risk >= 60) return 'secondary';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="mr-2">جاري تحميل البيانات الأمنية...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة الأمان المتقدمة</h1>
          <p className="text-muted-foreground">مراقبة وإدارة الأمان في الوقت الفعلي</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"} className="gap-1">
            <Activity className="w-3 h-3" />
            {isMonitoring ? 'مراقبة نشطة' : 'مراقبة متوقفة'}
          </Badge>
          <Button onClick={loadSecurityData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* التنبيهات الأمنية */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <Badge variant={getRiskColor(alert.type)}>
                    {alert.type}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأحداث</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">آخر 24 ساعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أحداث عالية المخاطر</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.highRiskEvents}</div>
            <p className="text-xs text-muted-foreground">تتطلب مراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محاولات وصول فاشلة</CardTitle>
            <Lock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedAccess}</div>
            <p className="text-xs text-muted-foreground">محاولات مشبوهة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط مستوى المخاطر</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRiskScore}%</div>
            <p className="text-xs text-muted-foreground">من 100</p>
          </CardContent>
        </Card>
      </div>

      {/* علامات التبويب */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">الأحداث الأمنية</TabsTrigger>
          <TabsTrigger value="access">الوصول للبيانات الحساسة</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس المباشرة</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                الأحداث الأمنية الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.action}</span>
                        <Badge variant={getRiskColor(event.risk_level)}>
                          {event.risk_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.event_type}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(event.created_at)}</p>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                سجل الوصول للبيانات الحساسة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sensitiveAccess.map((access) => (
                  <div key={access.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{access.resource_type}</span>
                        <Badge variant={getRiskColor(access.risk_score)}>
                          {access.risk_score}
                        </Badge>
                        <Badge variant={access.success ? "default" : "destructive"}>
                          {access.success ? 'نجح' : 'فشل'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {access.access_type} - {access.data_classification}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(access.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>المقاييس المباشرة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>محاولات تسجيل دخول فاشلة:</span>
                  <Badge variant="secondary">{metrics.failedLogins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>محاولات محجوبة:</span>
                  <Badge variant="destructive">{metrics.blockedAttempts}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>نشاط مشبوه:</span>
                  <Badge variant="destructive">{metrics.suspiciousActivity}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>نقاط المخاطر:</span>
                  <Badge variant={getRiskColor(metrics.riskScore)}>
                    {metrics.riskScore}/100
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>المراقبة النشطة:</span>
                  <Badge variant={isMonitoring ? "default" : "secondary"}>
                    {isMonitoring ? 'تعمل' : 'متوقفة'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>آخر تحديث:</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}