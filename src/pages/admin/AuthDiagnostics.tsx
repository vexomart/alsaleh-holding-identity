import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Wrench, 
  TestTube, 
  Search,
  Clock,
  UserCheck,
  Shield,
  Key,
  Database
} from "lucide-react";

interface DiagnosisResult {
  success: boolean;
  email_input_raw?: string;
  email_lower?: string;
  user_found?: boolean;
  user_id?: string;
  status?: string;
  role?: string;
  email_verified_at?: string;
  algo?: string;
  salt_len?: number;
  salt_valid?: boolean;
  hash_len?: number;
  hash_valid?: boolean;
  password_match_plain?: boolean;
  password_match_doublehash?: boolean;
  rls_ok?: boolean;
  last_error_code?: string;
  message?: string;
  auto_fixable?: boolean;
  needs_password_reset?: boolean;
  timestamp?: string;
}

interface RepairResult {
  success: boolean;
  diagnosis?: DiagnosisResult;
  repairs_applied?: string[];
  message?: string;
  fixed?: boolean;
  needs_reset?: boolean;
}

interface TestResult {
  success: boolean;
  test_user_created?: boolean;
  test_email?: string;
  test_password?: string;
  user_id?: string;
  login_test?: any;
  login_success?: boolean;
}

const AuthDiagnostics = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const callDiagnosticFunction = async (action: string, data: any) => {
    const { data: result, error } = await supabase.functions.invoke('auth-hotfix-diagnostic', {
      body: { action, ...data }
    });

    if (error) {
      throw new Error(error.message);
    }

    return result;
  };

  const runDiagnosis = async () => {
    if (!email || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const result = await callDiagnosticFunction('diagnose', { email, password });
      setDiagnosisResult(result);
      
      if (result.success) {
        toast.success("تم إجراء التشخيص بنجاح");
      } else {
        toast.error(result.message || "فشل في التشخيص");
      }
    } catch (error: any) {
      console.error('Diagnosis error:', error);
      toast.error(error.message || "حدث خطأ أثناء التشخيص");
    } finally {
      setLoading(false);
    }
  };

  const runAutoRepair = async () => {
    if (!email || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const result = await callDiagnosticFunction('repair', { email, password });
      setRepairResult(result);
      
      if (result.success && result.fixed) {
        toast.success("تم الإصلاح التلقائي بنجاح");
      } else if (result.success && result.needs_reset) {
        toast.warning("تم إرسال رابط إعادة تعيين كلمة المرور");
      } else {
        toast.error(result.message || "لم يتم العثور على مشاكل قابلة للإصلاح");
      }
    } catch (error: any) {
      console.error('Repair error:', error);
      toast.error(error.message || "حدث خطأ أثناء الإصلاح");
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const result = await callDiagnosticFunction('test-user-create', {});
      setTestResult(result);
      
      if (result.success && result.login_success) {
        toast.success("تم إنشاء المستخدم التجريبي واختباره بنجاح");
      } else if (result.success) {
        toast.warning("تم إنشاء المستخدم التجريبي لكن فشل اختبار تسجيل الدخول");
      } else {
        toast.error("فشل في إنشاء المستخدم التجريبي");
      }
    } catch (error: any) {
      console.error('Test user creation error:', error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء المستخدم التجريبي");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (success === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getErrorCodeBadge = (code: string) => {
    const colorMap: Record<string, string> = {
      'E_USER_NOT_FOUND': 'destructive',
      'E_NOT_ACTIVE': 'destructive',
      'E_DOUBLE_HASH': 'secondary',
      'E_SALT_OR_TRUNC': 'destructive',
      'E_RLS': 'destructive',
      'E_WRONG_PASSWORD': 'destructive',
      'E_SUCCESS': 'default'
    };
    
    return (
      <Badge variant={colorMap[code] as any || 'outline'}>
        {code}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">تشخيص نظام المصادقة</h1>
      </div>

      <Tabs defaultValue="diagnosis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnosis" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>التشخيص</span>
          </TabsTrigger>
          <TabsTrigger value="repair" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>الإصلاح التلقائي</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <TestTube className="h-4 w-4" />
            <span>الاختبار الذاتي</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>تشخيص شامل للمصادقة</span>
              </CardTitle>
              <CardDescription>
                فحص تفصيلي لحساب المستخدم وتحديد المشاكل المحتملة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <Button 
                onClick={runDiagnosis} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "جاري التشخيص..." : "بدء التشخيص"}
              </Button>

              {diagnosisResult && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <h3 className="text-lg font-semibold">نتائج التشخيص</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>معلومات المستخدم</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">موجود:</span>
                          {getStatusIcon(diagnosisResult.user_found)}
                        </div>
                        {diagnosisResult.user_found && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">الحالة:</span>
                              <Badge variant={diagnosisResult.status === 'active' ? 'default' : 'destructive'}>
                                {diagnosisResult.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">الدور:</span>
                              <Badge variant="outline">{diagnosisResult.role}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">مفعل:</span>
                              {getStatusIcon(!!diagnosisResult.email_verified_at)}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>كلمة المرور</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">خوارزمية:</span>
                          <Badge variant="outline">{diagnosisResult.algo}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Salt صحيح:</span>
                          {getStatusIcon(diagnosisResult.salt_valid)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hash صحيح:</span>
                          {getStatusIcon(diagnosisResult.hash_valid)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">تطابق عادي:</span>
                          {getStatusIcon(diagnosisResult.password_match_plain)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">تطابق مزدوج:</span>
                          {getStatusIcon(diagnosisResult.password_match_doublehash)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Database className="h-4 w-4" />
                          <span>قاعدة البيانات</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">RLS:</span>
                          {getStatusIcon(diagnosisResult.rls_ok)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Salt الطول:</span>
                          <Badge variant="outline">{diagnosisResult.salt_len}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hash الطول:</span>
                          <Badge variant="outline">{diagnosisResult.hash_len}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {diagnosisResult.last_error_code && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span>رمز الخطأ:</span>
                            {getErrorCodeBadge(diagnosisResult.last_error_code)}
                          </div>
                          <p className="text-sm">{diagnosisResult.message}</p>
                        </div>
                        {diagnosisResult.auto_fixable && (
                          <Badge variant="secondary" className="ml-2">
                            قابل للإصلاح
                          </Badge>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repair" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>الإصلاح التلقائي</span>
              </CardTitle>
              <CardDescription>
                إصلاح تلقائي للمشاكل الشائعة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="repair-email">البريد الإلكتروني</Label>
                  <Input
                    id="repair-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="repair-password">كلمة المرور</Label>
                  <Input
                    id="repair-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <Button 
                onClick={runAutoRepair} 
                disabled={loading}
                className="w-full"
                variant="secondary"
              >
                {loading ? "جاري الإصلاح..." : "تشغيل الإصلاح التلقائي"}
              </Button>

              {repairResult && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <h3 className="text-lg font-semibold">نتائج الإصلاح</h3>
                  
                  {repairResult.repairs_applied && repairResult.repairs_applied.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">الإصلاحات المطبقة:</h4>
                      <div className="space-y-1">
                        {repairResult.repairs_applied.map((repair, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {repair}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {repairResult.message}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>الاختبار الذاتي</span>
              </CardTitle>
              <CardDescription>
                إنشاء مستخدم تجريبي واختبار تسجيل الدخول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={createTestUser} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "جاري إنشاء المستخدم التجريبي..." : "إنشاء مستخدم تجريبي"}
              </Button>

              {testResult && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <h3 className="text-lg font-semibold">نتائج الاختبار</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">المستخدم التجريبي</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">تم الإنشاء:</span>
                          {getStatusIcon(testResult.test_user_created)}
                        </div>
                        {testResult.test_email && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">البريد:</div>
                            <div className="text-sm font-mono">{testResult.test_email}</div>
                          </div>
                        )}
                        {testResult.test_password && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">كلمة المرور:</div>
                            <div className="text-sm font-mono">{testResult.test_password}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">اختبار تسجيل الدخول</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">نجح الدخول:</span>
                          {getStatusIcon(testResult.login_success)}
                        </div>
                        {testResult.login_test && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">تفاصيل النتيجة:</div>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                              {JSON.stringify(testResult.login_test, null, 2)}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      {testResult.login_success 
                        ? "✅ جميع الاختبارات نجحت - النظام يعمل بشكل صحيح"
                        : "❌ فشل اختبار تسجيل الدخول - يحتاج النظام للمراجعة"
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthDiagnostics;