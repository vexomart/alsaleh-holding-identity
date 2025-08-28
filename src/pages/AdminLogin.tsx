import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Building2,
  Lock,
  Monitor,
  AlertTriangle,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'login' | 'verification'>('login');
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
      console.log('لا توجد جلسة مصادقة سابقة');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');

    try {
      // التحقق من تسجيل الدخول بالإيميل والباسوورد
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('بيانات الدخول غير صحيحة. يرجى التحقق من الإيميل وكلمة المرور.');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('فشل في تسجيل الدخول');
        setLoading(false);
        return;
      }

      // التحقق من الصلاحيات الإدارية
      const { data: adminData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !adminData) {
        setError('ليس لديك صلاحيات إدارية. يرجى التواصل مع المدير.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // إرسال رمز التحقق للإيميل
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('send-verification-code', {
        body: { email, type: 'admin' }
      });

      if (verifyError) {
        setError('فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }

      toast({
        title: "تم إرسال رمز التحقق",
        description: "تحقق من بريدك الإلكتروني وأدخل الرمز المكون من 6 أرقام",
      });

      setStep('verification');
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;
    
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-login-code', {
        body: { 
          email, 
          code: verificationCode, 
          type: 'admin' 
        }
      });

      if (error) {
        setError('رمز التحقق غير صحيح أو منتهي الصلاحية.');
        setLoading(false);
        return;
      }

      if (data?.success) {
        toast({
          title: "تم التحقق بنجاح",
          description: "مرحباً بك في لوحة الإدارة",
        });

        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      console.error('خطأ في التحقق:', error);
      setError('حدث خطأ أثناء التحقق من الرمز.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(148 163 184 / 0.05)%27%3e%3cpath d=%27m0 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2%27/%3e%3c/svg%3e')] opacity-20"></div>
      
      {/* كونتينر رئيسي */}
      <div className="w-full max-w-md mx-auto relative z-10">
        
        {/* كارد تسجيل الدخول */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-8 pt-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            {/* أيقونة مركزية */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-500/30 mb-4 relative">
              {step === 'login' ? <Lock className="w-10 h-10 text-white" /> : <Mail className="w-10 h-10 text-white" />}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {step === 'login' ? 'تسجيل دخول الإدارة' : 'رمز التحقق'}
            </h2>
            <p className="text-slate-600">
              {step === 'login' ? 'الوصول المحدود للمديرين المعتمدين فقط' : 'أدخل الرمز المرسل لبريدك الإلكتروني'}
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50/50 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-right">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* نموذج تسجيل الدخول */}
            {step === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    البريد الإلكتروني الإداري
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-right bg-slate-50/50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 text-right bg-slate-50/50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 pr-12"
                      dir="rtl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-200/50"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-2xl shadow-blue-500/30 rounded-xl transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التسجيل...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      تسجيل الدخول
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {/* نموذج رمز التحقق */}
            {step === 'verification' && (
              <form onSubmit={handleVerificationComplete} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">تحقق من بريدك الإلكتروني</h3>
                  <p className="text-sm text-slate-500">تم إرسال رمز مكون من 6 أرقام إلى {email}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 text-center block">
                    رمز التحقق (6 أرقام)
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="h-16 text-center text-2xl font-mono bg-slate-50/50 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-2xl shadow-green-500/30 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحقق...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      تأكيد الرمز ودخول النظام
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {setStep('login'); setVerificationCode(''); setError('');}}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* رابط العودة */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            العودة للموقع الرئيسي
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;