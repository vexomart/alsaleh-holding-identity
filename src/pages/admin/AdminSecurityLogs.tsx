import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Filter,
  Eye,
  Calendar,
  MapPin,
  User,
  Activity,
  Lock
} from 'lucide-react';

interface UnauthorizedLog {
  id: string;
  user_id: string | null;
  user_role: string;
  attempted_path: string;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  blocked_reason: string;
  created_at: string;
  session_id: string | null;
  additional_metadata: any;
}

interface SecurityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  action: string;
  risk_level: string;
  created_at: string;
  metadata: any;
}

const AdminSecurityLogs: React.FC = () => {
  const [unauthorizedLogs, setUnauthorizedLogs] = useState<UnauthorizedLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [timeFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // حساب نطاق التاريخ
      const timeRange = getTimeRange(timeFilter);
      
      // جلب سجلات الوصول المرفوض
      const { data: unauthorizedData, error: unauthorizedError } = await supabase
        .from('unauthorized_access_logs')
        .select('*')
        .gte('created_at', timeRange)
        .order('created_at', { ascending: false })
        .limit(100);

      if (unauthorizedError) throw unauthorizedError;

      // جلب سجلات الأمان العامة
      const { data: securityData, error: securityError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .gte('created_at', timeRange)
        .order('created_at', { ascending: false })
        .limit(100);

      if (securityError) throw securityError;

      setUnauthorizedLogs((unauthorizedData || []).map(log => ({
        ...log,
        ip_address: log.ip_address as string || 'غير محدد',
        user_agent: log.user_agent as string || 'غير محدد',
        referer: log.referer as string || '',
        session_id: log.session_id as string || 'غير محدد',
        user_role: log.user_role as string || 'غير محدد',
        blocked_reason: log.blocked_reason as string || 'غير محدد',
        created_at: log.created_at as string
      })));
      setSecurityLogs(securityData || []);
      
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب سجلات الأمان",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeRange = (filter: string): string => {
    const now = new Date();
    switch (filter) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">حرج</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">عالي</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">متوسط</Badge>;
      case 'low':
        return <Badge variant="secondary">منخفض</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getBlockedReasonBadge = (reason: string) => {
    switch (reason) {
      case 'insufficient_privileges':
        return <Badge variant="secondary">صلاحيات غير كافية</Badge>;
      case 'unauthenticated_user':
        return <Badge variant="destructive">مستخدم غير مسجل</Badge>;
      case 'no_role_assigned':
        return <Badge className="bg-orange-500">لا يوجد دور</Badge>;
      case 'insufficient_role':
        return <Badge className="bg-yellow-500">دور غير كافي</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredUnauthorizedLogs = unauthorizedLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.attempted_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ip_address || '').includes(searchTerm) ||
      log.user_role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredSecurityLogs = securityLogs.filter(log => {
    const matchesSearch = !searchTerm ||
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || log.risk_level === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* العنوان والتحكم */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="text-red-600" />
            سجلات الأمان
          </h1>
          <p className="text-muted-foreground">مراقبة محاولات الوصول المرفوضة والأنشطة المشبوهة</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* أدوات التصفية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            عوامل التصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">البحث</Label>
              <Input
                id="search"
                placeholder="ابحث في السجلات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="time-filter">الفترة الزمنية</Label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger id="time-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">آخر ساعة</SelectItem>
                  <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                  <SelectItem value="7d">آخر 7 أيام</SelectItem>
                  <SelectItem value="30d">آخر 30 يوم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="risk-filter">مستوى المخاطر</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger id="risk-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التبويبات */}
      <Tabs defaultValue="unauthorized" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unauthorized">
            <Lock className="w-4 h-4 ml-2" />
            الوصول المرفوض ({filteredUnauthorizedLogs.length})
          </TabsTrigger>
          <TabsTrigger value="security">
            <Activity className="w-4 h-4 ml-2" />
            سجلات الأمان ({filteredSecurityLogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unauthorized" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>محاولات الوصول المرفوضة</CardTitle>
              <CardDescription>
                عرض محاولات الوصول إلى لوحة الإدارة من قبل مستخدمين غير مخولين
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  جاري التحميل...
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الوقت</TableHead>
                        <TableHead className="text-right">المسار المطلوب</TableHead>
                        <TableHead className="text-right">دور المستخدم</TableHead>
                        <TableHead className="text-right">سبب الحظر</TableHead>
                        <TableHead className="text-right">عنوان IP</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUnauthorizedLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            لا توجد محاولات وصول مرفوضة في الفترة المحددة
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUnauthorizedLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                {formatDate(log.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{log.attempted_path}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.user_role || 'غير محدد'}</Badge>
                            </TableCell>
                            <TableCell>{getBlockedReasonBadge(log.blocked_reason)}</TableCell>
                            <TableCell className="font-mono">{log.ip_address || 'غير محدد'}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>تفاصيل محاولة الوصول المرفوضة</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <strong>المعرف:</strong> {log.id}
                                      </div>
                                      <div>
                                        <strong>معرف المستخدم:</strong> {log.user_id || 'غير مسجل'}
                                      </div>
                                      <div>
                                        <strong>المسار:</strong> {log.attempted_path}
                                      </div>
                                      <div>
                                        <strong>عنوان IP:</strong> {log.ip_address}
                                      </div>
                                      <div>
                                        <strong>معرف الجلسة:</strong> {log.session_id}
                                      </div>
                                      <div>
                                        <strong>الوقت:</strong> {formatDate(log.created_at)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <strong>معلومات المتصفح:</strong>
                                      <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                                        {log.user_agent}
                                      </p>
                                    </div>

                                    {log.additional_metadata && Object.keys(log.additional_metadata).length > 0 && (
                                      <div>
                                        <strong>بيانات إضافية:</strong>
                                        <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-auto">
                                          {JSON.stringify(log.additional_metadata, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجلات الأمان العامة</CardTitle>
              <CardDescription>
                عرض جميع أحداث الأمان والأنشطة المشبوهة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  جاري التحميل...
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الوقت</TableHead>
                        <TableHead className="text-right">نوع الحدث</TableHead>
                        <TableHead className="text-right">الإجراء</TableHead>
                        <TableHead className="text-right">مستوى المخاطر</TableHead>
                        <TableHead className="text-right">المستخدم</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSecurityLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            لا توجد سجلات أمان في الفترة المحددة
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSecurityLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                {formatDate(log.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>{log.event_type}</TableCell>
                            <TableCell className="font-mono text-sm">{log.action}</TableCell>
                            <TableCell>{getRiskBadge(log.risk_level)}</TableCell>
                            <TableCell>
                              {log.user_id ? (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span className="font-mono text-sm">{log.user_id.slice(0, 8)}...</span>
                                </div>
                              ) : (
                                'نظام'
                              )}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>تفاصيل حدث الأمان</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <strong>المعرف:</strong> {log.id}
                                      </div>
                                      <div>
                                        <strong>معرف المستخدم:</strong> {log.user_id || 'النظام'}
                                      </div>
                                      <div>
                                        <strong>نوع الحدث:</strong> {log.event_type}
                                      </div>
                                      <div>
                                        <strong>الإجراء:</strong> {log.action}
                                      </div>
                                      <div>
                                        <strong>مستوى المخاطر:</strong> {getRiskBadge(log.risk_level)}
                                      </div>
                                      <div>
                                        <strong>الوقت:</strong> {formatDate(log.created_at)}
                                      </div>
                                    </div>

                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                      <div>
                                        <strong>البيانات الوصفية:</strong>
                                        <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-auto">
                                          {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurityLogs;