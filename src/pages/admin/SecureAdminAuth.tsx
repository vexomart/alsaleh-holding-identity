import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SecureAdminAuthProps {
  onAuthSuccess: (user: any) => void;
}

export default function SecureAdminAuth({ onAuthSuccess }: SecureAdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError('بيانات الدخول غير صحيحة');
        return;
      }

      if (!data.user) {
        setError('حدث خطأ أثناء تسجيل الدخول');
        return;
      }

      // Check if user has admin profile
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !adminProfile) {
        await supabase.auth.signOut();
        setError('هذا المستخدم ليس لديه صلاحية الوصول للوحة الإدارة');
        return;
      }

      // Create secure session
      const { data: sessionData, error: sessionError } = await supabase.rpc(
        'create_secure_admin_session',
        {
          admin_user_id: data.user.id,
          session_data: {
            user_agent: navigator.userAgent,
            login_time: new Date().toISOString()
          }
        }
      );

      const sessionResult = sessionData as any;

      if (sessionError || !sessionResult) {
        setError('حدث خطأ أثناء إنشاء الجلسة الآمنة');
        return;
      }

      // Store session in secure cookie (will be implemented in a hook)
      sessionStorage.setItem('admin_session_id', sessionResult.session_id);
      sessionStorage.setItem('admin_user', JSON.stringify(sessionResult.user));

      onAuthSuccess(sessionResult.user);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign up with admin metadata
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_admin: 'true',
            role: 'editor' // Default role
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user && !data.session) {
        setError('تم إرسال رابط التفعيل إلى بريدك الإلكتروني. يرجى تفعيل الحساب أولاً.');
        return;
      }

      // If signup successful and user is immediately logged in
      if (data.user && data.session) {
        // Wait a moment for the trigger to create admin profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create secure session
        const { data: sessionData, error: sessionError } = await supabase.rpc(
          'create_secure_admin_session',
          {
            admin_user_id: data.user.id,
            session_data: {
              user_agent: navigator.userAgent,
              signup_time: new Date().toISOString()
            }
          }
        );

        const sessionResult = sessionData as any;

        if (sessionError || !sessionResult) {
          setError('تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.');
          setActiveTab('login');
          return;
        }

        sessionStorage.setItem('admin_session_id', sessionResult.session_id);
        sessionStorage.setItem('admin_user', JSON.stringify(sessionResult.user));

        onAuthSuccess(sessionResult.user);
      }
    } catch (err: any) {
      console.error('Admin signup error:', err);
      setError('حدث خطأ أثناء إنشاء الحساب');
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
          <CardTitle className="text-2xl">لوحة تحكم الإدارة الآمنة</CardTitle>
          <p className="text-muted-foreground">مجموعة علي الشهري القابضة</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@alialshehriholding.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
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
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-name">الاسم الكامل</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="أدخل الاسم الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@alialshehriholding.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
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
                  <p className="text-xs text-muted-foreground">
                    يجب أن تكون كلمة المرور 8 أحرف على الأقل
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب إداري'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}