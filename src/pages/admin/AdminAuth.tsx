import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthProps {
  onAuthSuccess: (user: any) => void;
}

export default function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting secure admin login for:', email);
      
      // استخدام دالة التسجيل الآمنة الجديدة
      const { data, error } = await supabase.rpc('admin_login', {
        user_email: email,
        user_password: password,
        user_ip: null,
        user_agent: navigator.userAgent
      });

      console.log('Secure login response:', { data, error });

      if (error) {
        console.log('Login error:', error);
        setError('خطأ في تسجيل الدخول');
        
        // تسجيل محاولة الدخول الفاشلة
        await supabase.from('sensitive_data_audit').insert({
          resource_type: 'admin_login',
          resource_id: email,
          access_type: 'authentication',
          data_classification: 'restricted',
          success: false,
          metadata: {
            error: error.message,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const loginResult = data as any;

      if (!loginResult || !loginResult.success) {
        setError(loginResult?.message || 'بيانات الدخول غير صحيحة');
        
        // تسجيل محاولة الدخول الفاشلة
        await supabase.from('sensitive_data_audit').insert({
          resource_type: 'admin_login',
          resource_id: email,
          access_type: 'authentication',
          data_classification: 'restricted',
          success: false,
          metadata: {
            reason: loginResult?.message,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      console.log('Secure admin login successful:', loginResult);
      
      // حفظ session token الآمن
      localStorage.setItem('admin_session_token', loginResult.session_token);
      
      // تسجيل نجاح الدخول
      await supabase.from('sensitive_data_audit').insert({
        resource_type: 'admin_login',
        resource_id: loginResult.user_email,
        access_type: 'authentication',
        data_classification: 'restricted',
        success: true,
        metadata: {
          role: loginResult.user_role,
          session_created: true,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
      
      // إنشاء كائن المستخدم للتطبيق
      const adminUser = {
        id: loginResult.user_id,
        name: loginResult.user_name,
        email: loginResult.user_email,
        role: loginResult.user_role
      };

      onAuthSuccess(adminUser);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
      
      // تسجيل الخطأ في النظام
      try {
        await supabase.from('sensitive_data_audit').insert({
          resource_type: 'admin_login',
          resource_id: email,
          access_type: 'authentication',
          data_classification: 'restricted',
          success: false,
          metadata: {
            error: err.message,
            error_type: 'system_error',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
      } catch (logError) {
        console.error('Failed to log security event:', logError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">لوحة تحكم الإدارة</CardTitle>
          <p className="text-muted-foreground">مجموعة علي الشهري القابضة</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@alialshehriholding.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>للاختبار: admin@alialshehriholding.com</p>
              <p>كلمة المرور: admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}