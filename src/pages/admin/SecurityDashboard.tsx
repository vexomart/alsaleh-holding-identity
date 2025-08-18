import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Clock,
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  Lock,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface SecurityAuditLog {
  id: string;
  event_type: string;
  action: string;
  risk_level: string;
  user_id?: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata: any;
  created_at: string;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  highRiskEvents: number;
  blockedAttempts: number;
  uniqueUsers: number;
}

export default function SecurityDashboard() {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    highRiskEvents: 0,
    blockedAttempts: 0,
    uniqueUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchSecurityLogs = async () => {
    try {
      const { data: logsData, error: logsError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      setLogs((logsData || []) as SecurityAuditLog[]);

      // Calculate security stats
      const totalEvents = logsData?.length || 0;
      const criticalEvents = logsData?.filter(log => log.risk_level === 'critical').length || 0;
      const highRiskEvents = logsData?.filter(log => log.risk_level === 'high').length || 0;
      const blockedAttempts = logsData?.filter(log => 
        log.event_type === 'rate_limit_exceeded' || 
        log.event_type === 'unauthorized_access_attempt'
      ).length || 0;
      const uniqueUsers = new Set(logsData?.map(log => log.user_id).filter(Boolean)).size;

      setStats({
        totalEvents,
        criticalEvents,
        highRiskEvents,
        blockedAttempts,
        uniqueUsers
      });

    } catch (error) {
      console.error('Error fetching security logs:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل سجلات الأمان",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSecurityLogs();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRiskLevel = selectedRiskLevel === "all" || log.risk_level === selectedRiskLevel;
    
    return matchesSearch && matchesRiskLevel;
  });

  const getRiskLevelBadge = (riskLevel: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary"
    } as const;

    const colors = {
      critical: "text-red-600",
      high: "text-orange-600", 
      medium: "text-yellow-600",
      low: "text-green-600"
    };

    return (
      <Badge variant={variants[riskLevel as keyof typeof variants] || "default"}>
        <span className={colors[riskLevel as keyof typeof colors]}>
          {riskLevel === 'critical' ? 'حرج' : 
           riskLevel === 'high' ? 'عالي' :
           riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
        </span>
      </Badge>
    );
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'rate_limit_exceeded':
        return <Zap className="w-4 h-4 text-orange-500" />;
      case 'unauthorized_access_attempt':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'sensitive_data_access':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'payment_rate_limit_exceeded':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة مراقبة الأمان</h1>
          <p className="text-muted-foreground">مراقبة الأنشطة الأمنية والتهديدات</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأحداث</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أحداث حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مخاطر عالية</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.highRiskEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محاولات محجوبة</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.blockedAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستخدمون مميزون</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.uniqueUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.criticalEvents > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">تنبيه أمني</AlertTitle>
          <AlertDescription className="text-red-700">
            تم اكتشاف {stats.criticalEvents} حدث أمني حرج. يرجى مراجعة السجلات فوراً.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في السجلات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <select 
          value={selectedRiskLevel}
          onChange={(e) => setSelectedRiskLevel(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="all">جميع المستويات</option>
          <option value="critical">حرج</option>
          <option value="high">عالي</option>
          <option value="medium">متوسط</option>
          <option value="low">منخفض</option>
        </select>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle>سجلات الأمان</CardTitle>
          <CardDescription>
            آخر {filteredLogs.length} حدث أمني
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getEventTypeIcon(log.event_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action}
                    </p>
                    {getRiskLevelBadge(log.risk_level)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    نوع الحدث: {log.event_type}
                  </p>
                  {log.user_id && (
                    <p className="text-sm text-gray-500">
                      المستخدم: {log.user_id}
                    </p>
                  )}
                  {log.ip_address && (
                    <p className="text-sm text-gray-500">
                      عنوان IP: {log.ip_address}
                    </p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3 ml-1" />
                    {format(new Date(log.created_at), "yyyy/MM/dd HH:mm:ss", { locale: ar })}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                لا توجد سجلات أمنية متاحة
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}