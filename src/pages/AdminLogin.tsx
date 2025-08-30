import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Lock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (adminData) {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try admin authentication first
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      if (!session?.user) {
        throw new Error('فشل في إنشاء الجلسة');
      }

      // Check if user has admin role
      const { data: adminData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('ليس لديك صلاحية الوصول للوحة الإدارة');
      }

      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin/dashboard');
      
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.message || 'فشل في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(56,189,248,0.03)_49%,rgba(56,189,248,0.03)_51%,transparent_52%)] bg-[length:20px_20px]"></div>
      
      <div className="relative w-full max-w-md z-10">
        {/* Back to Home Button */}
        <div className="mb-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-500/20 border border-blue-400/30">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white mb-2">
              لوحة إدارة النظام
            </CardTitle>
            <p className="text-slate-400">
              تسجيل دخول المدراء فقط
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 pl-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جارٍ تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                مخصص للمدراء المعتمدين فقط
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;