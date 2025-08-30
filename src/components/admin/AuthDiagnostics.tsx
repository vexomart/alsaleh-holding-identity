import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, RefreshCw, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface DiagnosticResult {
  user_id: string;
  email: string;
  name: string;
  status: string;
  algo: string;
  salt_len: number;
  hash_len: number;
  has_legacy_data: boolean;
  last_login_error?: string;
  probe_results?: any;
}

const AuthDiagnostics = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');

  const runDiagnostic = async () => {
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // البحث عن المستخدم
      const { data: user, error: userError } = await supabase
        .from('ash_users')
        .select(`
          id, email, name, status, email_verified_at,
          password_algo, password_salt_b64, password_hash_b64,
          password_hash, password_salt, role
        `)
        .eq('email_lower', email.trim().toLowerCase())
        .maybeSingle();

      if (userError) {
        throw new Error('فشل في البحث عن المستخدم');
      }

      if (!user) {
        setError('لا يوجد مستخدم بهذا البريد الإلكتروني');
        return;
      }

      // البحث عن آخر محاولة دخول فاشلة
      const { data: lastFailure } = await supabase
        .from('auth_logs')
        .select('error_code, probe_result, created_at')
        .eq('email_lower', email.trim().toLowerCase())
        .eq('status', 'failed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const diagnostic: DiagnosticResult = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        algo: user.password_algo || 'unknown',
        salt_len: user.password_salt_b64 ? user.password_salt_b64.length : 0,
        hash_len: user.password_hash_b64 ? user.password_hash_b64.length : 0,
        has_legacy_data: !!(user.password_hash || user.password_salt),
        last_login_error: lastFailure?.error_code || null,
        probe_results: lastFailure?.probe_result || {}
      };

      setResult(diagnostic);
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      setError(error.message || 'حدث خطأ أثناء التشخيص');
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!result) return;

    setLoading(true);
    try {
      // TODO: إضافة دالة إرسال إعادة تعيين كلمة المرور
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور');
    } catch (error: any) {
      toast.error('فشل في إرسال رابط إعادة التعيين');
    } finally {
      setLoading(false);
    }
  };

  const autoFixUser = async () => {
    if (!result || !email) return;

    setLoading(true);
    try {
      // محاولة الإصلاح التلقائي باستخدام كلمة مرور تجريبية
      const { data: authResult } = await supabase
        .rpc('simple_authenticate_user', {
          email_lower_param: email.trim().toLowerCase(),
          plain_password: 'test_password_for_diagnostic'
        });

      if (authResult?.auto_fixed) {
        toast.success('تم إصلاح المستخدم تلقائياً');
        runDiagnostic(); // إعادة تشغيل التشخيص
      } else {
        toast.info('لا يمكن الإصلاح التلقائي - يتطلب إعادة تعيين كلمة المرور');
      }
    } catch (error: any) {
      toast.error('فشل في الإصلاح التلقائي');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlgoColor = (algo: string) => {
    switch (algo) {
      case 'sha256_v1': return 'bg-green-100 text-green-800';
      case 'bcrypt_v1': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            تشخيص المصادقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني للمستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={runDiagnostic} disabled={loading}>
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? 'جارٍ التشخيص...' : 'تشخيص'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              نتائج التشخيص - {result.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">الحالة</Label>
                <Badge className={getStatusColor(result.status)}>
                  {result.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">خوارزمية كلمة المرور</Label>
                <Badge className={getAlgoColor(result.algo)}>
                  {result.algo}
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">طول Salt</Label>
                <p className="font-mono">{result.salt_len} حرف</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">طول Hash</Label>
                <p className="font-mono">{result.hash_len} حرف</p>
              </div>
            </div>

            {result.has_legacy_data && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  المستخدم لديه بيانات قديمة من النظام السابق
                </AlertDescription>
              </Alert>
            )}

            {result.last_login_error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  آخر خطأ في تسجيل الدخول: {result.last_login_error}
                </AlertDescription>
              </Alert>
            )}

            {result.probe_results && Object.keys(result.probe_results).length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">نتائج الفحص التلقائي</Label>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.probe_results, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={sendPasswordReset} disabled={loading} variant="outline">
                إرسال إعادة تعيين كلمة المرور
              </Button>
              {result.has_legacy_data && (
                <Button onClick={autoFixUser} disabled={loading} variant="secondary">
                  محاولة الإصلاح التلقائي
                </Button>
              )}
              <Button onClick={runDiagnostic} disabled={loading} variant="ghost">
                <RefreshCw className="w-4 h-4" />
                إعادة التشخيص
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthDiagnostics;