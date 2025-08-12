import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { Shield, AlertTriangle, Eye, Activity, Download } from 'lucide-react';

interface SecurityAuditLog {
  id: string;
  event_type: string;
  user_id: string | null;
  resource_type: string | null;
  resource_id: string | null;
  action: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  metadata: any;
  created_at: string;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  highRiskEvents: number;
  recentRateLimits: number;
}

export const SecurityDashboard = () => {
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    highRiskEvents: 0,
    recentRateLimits: 0
  });
  const [loading, setLoading] = useState(true);
  const { logEnhancedSecurityEvent, maskSensitiveData } = useEnhancedSecurity();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent security audit logs
      const { data: logs, error: logsError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      setAuditLogs((logs || []) as SecurityAuditLog[]);

      // Calculate security statistics
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentLogs = logs?.filter(log => 
        new Date(log.created_at) > last24Hours
      ) || [];

      setStats({
        totalEvents: recentLogs.length,
        criticalEvents: recentLogs.filter(log => log.risk_level === 'critical').length,
        highRiskEvents: recentLogs.filter(log => log.risk_level === 'high').length,
        recentRateLimits: recentLogs.filter(log => log.event_type === 'rate_limit_exceeded').length
      });

      // Log dashboard access
      await logEnhancedSecurityEvent({
        eventType: 'admin_action',
        description: 'Security dashboard accessed',
        riskLevel: 'low',
        resourceType: 'security_dashboard',
        metadata: { 
          logsCount: logs?.length || 0,
          statsGenerated: true 
        }
      });

    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportSecurityReport = async () => {
    try {
      await logEnhancedSecurityEvent({
        eventType: 'data_export',
        description: 'Security report export initiated',
        riskLevel: 'medium',
        resourceType: 'security_audit_logs',
        metadata: { exportType: 'csv', recordCount: auditLogs.length }
      });

      // Create CSV content
      const headers = ['Date', 'Event Type', 'Risk Level', 'Action', 'Resource Type', 'User ID'];
      const csvContent = [
        headers.join(','),
        ...auditLogs.map(log => [
          new Date(log.created_at).toLocaleString(),
          log.event_type,
          log.risk_level,
          `"${log.action.replace(/"/g, '""')}"`,
          log.resource_type || '',
          log.user_id || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting security report:', error);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze security events</p>
        </div>
        <Button onClick={exportSecurityReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Security Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.highRiskEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits Hit</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentRateLimits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.criticalEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {stats.criticalEvents} critical security event(s) detected in the last 24 hours. 
            Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Audit Logs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Events</TabsTrigger>
          <TabsTrigger value="critical">Critical & High Risk</TabsTrigger>
          <TabsTrigger value="admin">Admin Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest 50 security events across all risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(log.risk_level)}
                        <Badge variant={getRiskBadgeVariant(log.risk_level)}>
                          {log.risk_level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {log.event_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm">{log.action}</p>
                      {log.resource_type && (
                        <p className="text-xs text-muted-foreground">
                          Resource: {log.resource_type}
                          {log.resource_id && ` (${log.resource_id.substring(0, 8)}...)`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      {log.user_id && (
                        <div className="text-xs text-muted-foreground">
                          User: {log.user_id.substring(0, 8)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical & High Risk Events</CardTitle>
              <CardDescription>Security events requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs
                  .filter(log => ['critical', 'high'].includes(log.risk_level))
                  .map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <Badge variant="destructive">
                            {log.risk_level.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {log.event_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <div className="text-xs text-muted-foreground">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(maskSensitiveData(log.metadata), null, 2)}
                          </pre>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Administrative actions and privilege usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs
                  .filter(log => log.event_type === 'admin_action')
                  .map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <Badge variant="outline">ADMIN</Badge>
                          <span className="text-sm font-medium">{log.action}</span>
                        </div>
                        {log.resource_type && (
                          <p className="text-xs text-muted-foreground">
                            Resource: {log.resource_type}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                        {log.user_id && (
                          <div className="text-xs text-muted-foreground">
                            User: {log.user_id.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};