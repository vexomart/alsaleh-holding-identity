import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Search, RefreshCw, Shield, Users, Activity, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthStatistic {
  email_lower: string;
  total_attempts: number;
  success_count: number;
  failure_count: number;
  last_attempt: string;
  last_success: string | null;
}

interface AuthLog {
  id: string;
  email_lower: string;
  result: string;
  error_code?: string;
  error_constraint?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const AuthDiagnostics: React.FC = () => {
  const [statistics, setStatistics] = useState<AuthStatistic[]>([]);
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredStats, setFilteredStats] = useState<AuthStatistic[]>([]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // For now, show a placeholder message until the database migration is complete
      toast.info('تشخيصات المصادقة ستكون متاحة قريباً');
      setStatistics([]);
      setFilteredStats([]);
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      toast.error('خطأ في جلب الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthLogs = async () => {
    try {
      // For now, show placeholder until table is available in types
      console.log('Auth logs will be available after database migration is complete');
      setLogs([]);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchAuthLogs();
  }, []);

  useEffect(() => {
    if (searchEmail) {
      const filtered = statistics.filter(stat => 
        stat.email_lower.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setFilteredStats(filtered);
    } else {
      setFilteredStats(statistics);
    }
  }, [searchEmail, statistics]);

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case 'success':
        return 'default';
      case 'invalid':
      case 'duplicate':
        return 'secondary';
      case 'db_error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return '✅';
      case 'invalid':
        return '❌';
      case 'duplicate':
        return '🔄';
      case 'db_error':
        return '💥';
      default:
        return '❓';
    }
  };

  const successRate = statistics.length > 0 
    ? Math.round((statistics.reduce((acc, stat) => acc + stat.success_count, 0) / 
        statistics.reduce((acc, stat) => acc + stat.total_attempts, 0)) * 100)
    : 0;

  const totalAttempts = statistics.reduce((acc, stat) => acc + stat.total_attempts, 0);
  const totalSuccesses = statistics.reduce((acc, stat) => acc + stat.success_count, 0);
  const totalFailures = statistics.reduce((acc, stat) => acc + stat.failure_count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">تشخيصات المصادقة</h2>
        </div>
        <Button 
          onClick={() => {
            fetchStatistics();
            fetchAuthLogs();
          }}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المحاولات</p>
                <p className="text-2xl font-bold">{totalAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">تسجيلات ناجحة</p>
                <p className="text-2xl font-bold text-green-600">{totalSuccesses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">محاولات فاشلة</p>
                <p className="text-2xl font-bold text-red-600">{totalFailures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">معدل النجاح</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إحصائيات المستخدمين (آخر 7 أيام)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="البحث بالبريد الإلكتروني..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredStats.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {loading ? 'جاري التحميل...' : 'لا توجد بيانات'}
                </p>
              ) : (
                filteredStats.map((stat) => (
                  <div key={stat.email_lower} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{stat.email_lower}</p>
                      <p className="text-sm text-muted-foreground">
                        آخر محاولة: {new Date(stat.last_attempt).toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{stat.total_attempts} محاولة</Badge>
                      <Badge variant="default">{stat.success_count} نجح</Badge>
                      <Badge variant="destructive">{stat.failure_count} فشل</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            سجل المحاولات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">لا توجد سجلات</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getResultIcon(log.result)}</span>
                        <p className="font-medium">{log.email_lower}</p>
                        <Badge variant={getResultBadgeVariant(log.result)}>
                          {log.result}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{new Date(log.created_at).toLocaleString('ar-SA')}</span>
                        {log.ip_address && <span>IP: {log.ip_address}</span>}
                        {log.error_code && <span>كود الخطأ: {log.error_code}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};