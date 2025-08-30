import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Bug, Shield, Database, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DiagnosticData {
  email_input_raw: string;
  email_normalized: string;
  user_row_found: boolean;
  user_status: string;
  user_role: string;
  password_hash_present: boolean;
  password_salt_present: boolean;
  hash_algorithm_detected: string;
  hash_version: string;
  password_match: boolean;
  email_verified_at: string | null;
  account_created_at: string;
  clock_server_time: string;
  diagnostic_timestamp: string;
}

interface DiagnosticIssue {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  category: string;
}

interface DiagnosticResult {
  success: boolean;
  diagnostic_data: DiagnosticData;
  issues: DiagnosticIssue[];
  recommendations: string[];
}

interface SelfTestResult {
  success: boolean;
  summary: {
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    success_rate: string;
  };
  test_results: Array<{
    test: string;
    passed: boolean;
    details: any;
    message: string;
  }>;
}

export function AuthDiagnostic() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticEmail, setDiagnosticEmail] = useState('');
  const [diagnosticPassword, setDiagnosticPassword] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [selfTestResult, setSelfTestResult] = useState<SelfTestResult | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAuthStatistics();
  }, []);

  const loadAuthStatistics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_auth_statistics');
      if (error) throw error;
      setStatistics(data);
    } catch (error: any) {
      console.error('خطأ في تحميل إحصائيات المصادقة:', error);
    }
  };

  const runDiagnostic = async () => {
    if (!diagnosticEmail || !diagnosticPassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth-diagnostic', {
        body: {
          action: 'diagnose',
          email: diagnosticEmail,
          password: diagnosticPassword
        }
      });

      if (error) throw error;

      setDiagnosticResult(data);
      
      toast({
        title: "تم تشغيل التشخيص",
        description: `تم العثور على ${data.issues?.length || 0} مشكلة`,
        variant: data.issues?.length > 0 ? "destructive" : "default"
      });

    } catch (error: any) {
      console.error('خطأ في التشخيص:', error);
      toast({
        title: "خطأ في التشخيص",
        description: error.message || 'حدث خطأ غير متوقع',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runSelfTest = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth-diagnostic', {
        body: {
          action: 'self-test'
        }
      });

      if (error) throw error;

      setSelfTestResult(data);
      
      toast({
        title: "تم تشغيل الاختبار الذاتي",
        description: `${data.summary.passed_tests}/${data.summary.total_tests} اختبارات نجحت`,
        variant: data.summary.failed_tests > 0 ? "destructive" : "default"
      });

    } catch (error: any) {
      console.error('خطأ في الاختبار الذاتي:', error);
      toast({
        title: "خطأ في الاختبار الذاتي",
        description: error.message || 'حدث خطأ غير متوقع',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      info: 'outline'
    } as const;
    
    return variants[severity as keyof typeof variants] || 'outline';
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">تشخيص نظام المصادقة</h2>
      </div>

      <Tabs defaultValue="diagnostic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnostic" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            التشخيص
          </TabsTrigger>
          <TabsTrigger value="self-test" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            الاختبار الذاتي
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                تشخيص المصادقة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostic-email">البريد الإلكتروني</Label>
                  <Input
                    id="diagnostic-email"
                    type="email"
                    value={diagnosticEmail}
                    onChange={(e) => setDiagnosticEmail(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني للتشخيص"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnostic-password">كلمة المرور</Label>
                  <Input
                    id="diagnostic-password"
                    type="password"
                    value={diagnosticPassword}
                    onChange={(e) => setDiagnosticPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
              </div>
              
              <Button 
                onClick={runDiagnostic} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جارٍ التشخيص...
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4 mr-2" />
                    تشغيل التشخيص
                  </>
                )}
              </Button>

              {diagnosticResult && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">نتائج التشخيص</h3>
                  
                  {diagnosticResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-destructive">المشاكل المكتشفة:</h4>
                      {diagnosticResult.issues.map((issue, index) => (
                        <Alert key={index} variant={issue.severity === 'error' ? 'destructive' : 'default'}>
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(issue.severity)}
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getSeverityBadge(issue.severity)}>
                                  {issue.code}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {issue.category}
                                </span>
                              </div>
                              <AlertDescription className="mt-1">
                                {issue.message}
                              </AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {diagnosticResult.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-primary">التوصيات:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {diagnosticResult.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">التفاصيل التقنية:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>المستخدم موجود: {diagnosticResult.diagnostic_data.user_row_found ? '✅' : '❌'}</div>
                      <div>حالة الحساب: {diagnosticResult.diagnostic_data.user_status}</div>
                      <div>دور المستخدم: {diagnosticResult.diagnostic_data.user_role}</div>
                      <div>كلمة المرور متطابقة: {diagnosticResult.diagnostic_data.password_match ? '✅' : '❌'}</div>
                      <div>خوارزمية التشفير: {diagnosticResult.diagnostic_data.hash_algorithm_detected}</div>
                      <div>إصدار التشفير: {diagnosticResult.diagnostic_data.hash_version}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="self-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                الاختبار الذاتي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                يقوم الاختبار الذاتي بفحص جميع مكونات نظام المصادقة تلقائياً
              </div>
              
              <Button 
                onClick={runSelfTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جارٍ الاختبار...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    تشغيل الاختبار الذاتي
                  </>
                )}
              </Button>

              {selfTestResult && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {selfTestResult.summary.total_tests}
                        </div>
                        <div className="text-sm text-muted-foreground">إجمالي الاختبارات</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {selfTestResult.summary.passed_tests}
                        </div>
                        <div className="text-sm text-muted-foreground">نجح</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive">
                          {selfTestResult.summary.failed_tests}
                        </div>
                        <div className="text-sm text-muted-foreground">فشل</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {selfTestResult.summary.success_rate}
                        </div>
                        <div className="text-sm text-muted-foreground">معدل النجاح</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">تفاصيل الاختبارات:</h4>
                    {selfTestResult.test_results.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {test.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="font-medium">{test.test}</span>
                        </div>
                        <Badge variant={test.passed ? 'default' : 'destructive'}>
                          {test.passed ? 'نجح' : 'فشل'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                إحصائيات المصادقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  سيتم إضافة إحصائيات تفصيلية قريباً
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}