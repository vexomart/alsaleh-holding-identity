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
  Users, 
  BarChart3, 
  Settings, 
  Building2,
  Lock,
  TrendingUp,
  Database,
  Globe,
  Briefcase,
  Monitor,
  Zap,
  ArrowRight,
  AlertTriangle
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
  const [step, setStep] = useState<'email' | 'verification' | 'password'>('email');
  const [showVerificationMethod, setShowVerificationMethod] = useState(false);
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending verification code for:', email);
      
      // طلب رمز التحقق
      const { data, error } = await supabase.functions.invoke('simple-verification', {
        body: { email, type: 'admin' }
      });

      console.log('Response from send-verification-code:', { data, error });

      if (error) {
        console.error('Error from function:', error);
        const errorMessage = error.message || 'فشل في إرسال رمز التحقق';
        setError(`خطأ: ${errorMessage}`);
        setLoading(false);
        return;
      }

      if (data && !data.success) {
        console.error('Function returned error:', data);
        setError(data.error || 'فشل في إرسال رمز التحقق');
        setLoading(false);
        return;
      }

      toast({
        title: "تم إنشاء رمز التحقق",
        description: data.development_code ? 
          `رمز التحقق المؤقت: ${data.development_code}` : 
          "تحقق من بريدك الإلكتروني وأدخل الرمز المكون من 6 أرقام",
      });

      // إذا كان هناك رمز تطوير، نعرضه في alert أيضاً
      if (data.development_code) {
        alert(`رمز التحقق للتطوير: ${data.development_code}`);
      }

      setStep('verification');
    } catch (error: any) {
      console.error('خطأ في إرسال رمز التحقق:', error);
      setError(`حدث خطأ: ${error.message || 'غير معروف'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (data.success) {
        toast({
          title: "تم التحقق بنجاح",
          description: "يتم الآن تسجيل دخولك...",
        });

        // استخدام الرابط الآمن للدخول
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      console.error('خطأ في التحقق:', error);
      setError('حدث خطأ أثناء التحقق من الرمز.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('بيانات الدخول غير صحيحة. يرجى التحقق من الإيميل وكلمة المرور.');
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: adminData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !adminData) {
          setError('ليس لديك صلاحيات إدارية. يرجى التواصل مع المدير.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        toast({
          title: "مرحباً بك في لوحة الإدارة",
          description: `تم تسجيل الدخول بنجاح - ${data.user.email}`,
        });

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(148 163 184 / 0.05)%27%3e%3cpath d=%27m0 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2%27/%3e%3c/svg%3e')] opacity-20"></div>
      
      {/* شبكة نقطية متحركة */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* كونتينر رئيسي */}
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* الجانب الأيسر - المعلومات والميزات */}
        <div className="hidden lg:block space-y-8 text-white">
          {/* شعار الشركة والعنوان */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  نظام الإدارة التنفيذية
                </h1>
                <p className="text-blue-200 text-lg">شركة علي صالح الشهري القابضة</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed">
              منصة إدارية متطورة مصممة للشركات العالمية بتقنيات أمان عالية ومعايير دولية
            </p>
          </div>

          {/* ميزات النظام */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "أمان متقدم", desc: "حماية بمعايير البنوك" },
              { icon: TrendingUp, title: "تحليلات ذكية", desc: "رؤى تجارية فورية" },
              { icon: Globe, title: "وصول عالمي", desc: "إدارة من أي مكان" },
              { icon: Zap, title: "أداء فائق", desc: "سرعة استجابة عالية" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
                <feature.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                <p className="text-slate-400 text-xs mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* إحصائيات */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">إحصائيات النظام</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">99.9%</div>
                <div className="text-xs text-slate-400">وقت التشغيل</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-xs text-slate-400">مراقبة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">ISO</div>
                <div className="text-xs text-slate-400">معتمد</div>
              </div>
            </div>
          </div>
        </div>

        {/* الجانب الأيمن - نموذج تسجيل الدخول */}
        <div className="space-y-6">
          {/* كارد تسجيل الدخول */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-black/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-8 pt-8 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              {/* أيقونة مركزية */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-500/30 mb-4 relative">
                <Lock className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-800 mb-2">تسجيل دخول الإدارة</h2>
              <p className="text-slate-600">الوصول المحدود للمديرين المعتمدين فقط</p>
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

              {/* خيار اختيار طريقة الدخول */}
              {!showVerificationMethod && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">اختر طريقة الدخول</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      onClick={() => {setShowVerificationMethod(true); setStep('email');}}
                      className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6" />
                        <div className="text-right">
                          <div>دخول بالتحقق الإيميل (موصى)</div>
                          <div className="text-xs text-green-100">أكثر أماناً مع رمز التحقق</div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => {setShowVerificationMethod(true); setStep('password');}}
                      variant="outline"
                      className="h-16 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6" />
                        <div className="text-right">
                          <div>دخول تقليدي بكلمة المرور</div>
                          <div className="text-xs text-slate-500">إيميل + كلمة مرور</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* نموذج الإيميل للتحقق */}
              {showVerificationMethod && step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-2xl shadow-green-500/30 rounded-xl transition-all duration-300 group relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        إرسال رمز التحقق
                        <Shield className="w-5 h-5" />
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowVerificationMethod(false)}
                    className="w-full text-slate-600 hover:text-slate-800"
                  >
                    العودة لاختيار طريقة الدخول
                  </Button>
                </form>
              )}

              {/* نموذج التحقق */}
              {step === 'verification' && (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">أدخل رمز التحقق</h3>
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
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-2xl shadow-green-500/30 rounded-xl transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري التحقق...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        تأكيد الرمز
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>

                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEmailSubmit(new Event('submit') as any)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      إعادة إرسال الرمز
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('email')}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      تغيير الإيميل
                    </Button>
                  </div>
                </form>
              )}

              {/* نموذج كلمة المرور التقليدي */}
              {showVerificationMethod && step === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-6">
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
                      <Shield className="w-4 h-4" />
                      كلمة المرور الآمنة
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 text-right pr-12 bg-slate-50/50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300"
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-slate-800 via-slate-900 to-black hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white font-bold text-lg shadow-2xl shadow-slate-500/30 rounded-xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري المصادقة...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-10">
                        دخول النظام الإداري
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowVerificationMethod(false)}
                    className="w-full text-slate-600 hover:text-slate-800"
                  >
                    العودة لاختيار طريقة الدخول
                  </Button>
                </form>
              )}

              {/* مؤشرات الأمان */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">حالة الأمان</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">تشفير SSL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">مصادقة ثنائية</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">سجلات مراجعة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">حماية DDOS</span>
                  </div>
                </div>
              </div>

              {/* أقسام الإدارة السريعة */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Users, label: "العملاء", color: "blue" },
                  { icon: BarChart3, label: "التقارير", color: "green" },
                  { icon: Database, label: "البيانات", color: "purple" },
                  { icon: Briefcase, label: "المشاريع", color: "orange" }
                ].map((item, index) => (
                  <div key={index} className={`p-3 bg-${item.color}-50 rounded-xl text-center group hover:scale-105 transition-transform cursor-pointer`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600 mx-auto mb-1 group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs text-${item.color}-700 font-medium`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <div className="text-center space-y-3">
            <button
              onClick={() => navigate('/')}
              className="text-blue-200 hover:text-white text-sm transition-colors flex items-center gap-2 mx-auto group"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              العودة للموقع الرئيسي
            </button>
            
            <div className="text-xs text-slate-400 space-y-1">
              <p>نظام محمي بتقنيات الأمان المتقدمة • ISO 27001 معتمد</p>
              <p className="flex items-center justify-center gap-2">
                © 2025 شركة علي صالح الشهري القابضة
                <Shield className="w-3 h-3" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;