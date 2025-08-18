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
      console.log('Attempting admin login for:', email);
      
      // Check if user exists in admin_users table and verify password
      const { data: adminUsers, error: queryError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (queryError || !adminUsers) {
        console.log('Admin user not found:', queryError);
        setError('المستخدم غير موجود أو غير مفعل');
        return;
      }

      // Simple password verification (in production, use proper hashing)
      if (adminUsers.password_hash !== password) {
        console.log('Invalid password');
        setError('كلمة المرور غير صحيحة');
        return;
      }

      console.log('Admin login successful:', adminUsers);
      
      // Update last login time
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUsers.id);
      
      // Create admin session token (simple implementation)
      const sessionToken = `admin_${adminUsers.id}_${Date.now()}`;
      localStorage.setItem('admin_session_token', sessionToken);
      
      // Log successful login to security audit
      await supabase.from('security_audit_logs').insert({
        event_type: 'admin_login_success',
        user_id: adminUsers.id,
        action: 'admin_login',
        risk_level: 'low',
        metadata: {
          email: adminUsers.email,
          role: adminUsers.role,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
      
      // Create user object for the app
      const adminUser = {
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        role: adminUsers.role
      };

      onAuthSuccess(adminUser);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
      
      // Log failed login attempt
      try {
        await supabase.from('security_audit_logs').insert({
          event_type: 'admin_login_failure',
          action: 'admin_login_failed',
          risk_level: 'medium',
          metadata: {
            email: email,
            error: err.message,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
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