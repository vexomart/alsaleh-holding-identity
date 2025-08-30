import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Shield, 
  Mail, 
  Lock, 
  Building2, 
  Key, 
  Sparkles, 
  Zap, 
  Users, 
  Code, 
  Palette,
  BarChart3, 
  Settings, 
  CheckCircle, 
  Star
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'verification' | 'forgot-password'>('credentials');
  const [emailForVerification, setEmailForVerification] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [showVerificationAfterSignup, setShowVerificationAfterSignup] = useState(false);
  const navigate = useNavigate();

  // تحقق من وجود كود إحالة في الرابط
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      localStorage.setItem('affiliate_referral_code', refCode);
      toast('تم اكتشاف كود الإحالة! ستحصل على مزايا خاصة عند التسجيل');
    }
  }, []);

  // تحقق من تسجيل الدخول
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (roleData?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/my-projects');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/my-projects');
        }
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        const storedReferralCode = localStorage.getItem('affiliate_referral_code');
        if (storedReferralCode) {
          try {
            const { error: affiliateError } = await supabase.functions.invoke('affiliate-referral', {
              body: {
                affiliateCode: storedReferralCode,
                newUserId: session.user.id
              }
            });

            if (affiliateError) {
              console.error('Error processing affiliate referral:', affiliateError);
            } else {
              console.log('Affiliate referral processed successfully for new user');
              toast('تم تسجيلك بنجاح عبر رابط الإحالة!');
            }
          } catch (err) {
            console.error('Affiliate processing failed:', err);
          }
        }
        
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (roleData?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/my-projects');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/my-projects');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'بيانات تسجيل الدخول غير صحيحة' 
          : error.message);
      } else {
        try {
          console.log('🔄 إرسال رمز التحقق للإيميل:', email);
          const { data, error: verificationError } = await supabase.functions.invoke('send-verification-code', {
            body: { email, type: 'user' }
          });

          if (verificationError) {
            console.error('❌ خطأ في إرسال رمز التحقق:', verificationError);
            toast.success('تم تسجيل الدخول بنجاح!');
          } else {
            setEmailForVerification(email);
            setStep('verification');
            toast.success('تم تسجيل الدخول! تم إرسال رمز التحقق لمزيد من الأمان.');
          }
        } catch (err) {
          console.error('💥 خطأ غير متوقع في إرسال رمز التحقق:', err);
          toast.success('تم تسجيل الدخول بنجاح!');
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    }
    
    setIsLoading(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-login-code', {
        body: { 
          email: emailForVerification, 
          code: verificationCode, 
          type: 'user' 
        }
      });

      if (error) {
        setError('رمز التحقق غير صحيح أو منتهي الصلاحية.');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // إرسال رسالة ترحيب للمستخدمين الجدد فقط
        if (showVerificationAfterSignup) {
          try {
            await supabase.functions.invoke('client-welcome-email', {
              body: {
                clientEmail: emailForVerification,
                clientName: signupEmail || emailForVerification.split('@')[0]
              }
            });
          } catch (welcomeError) {
            console.log('Failed to send welcome email:', welcomeError);
          }
          toast.success('تم تفعيل حسابك بنجاح! مرحباً بك في منصتنا 🎉');
        } else {
          toast.success('تم التحقق من هويتك بنجاح!');
        }
        
        // التحقق من الجلسة الحالية والتوجيه المناسب
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (roleData?.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/my-projects');
            }
          } catch (error) {
            console.error('Error checking user role:', error);
            navigate('/my-projects');
          }
        } else {
          // في حالة عدم وجود جلسة نشطة، نطلب من المستخدم تسجيل الدخول
          setStep('credentials');
          setError('');
          setVerificationCode('');
          setEmailForVerification('');
          setShowVerificationAfterSignup(false);
          toast('تم التحقق بنجاح! يمكنك الآن تسجيل الدخول.');
        }
      }
    } catch (error: any) {
      console.error('خطأ في التحقق:', error);
      setError('حدث خطأ أثناء التحقق من الرمز.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError('حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور.');
      } else {
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        setStep('credentials');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/my-projects`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('هذا البريد الإلكتروني مسجل مسبقاً');
        } else if (error.message.includes('Password is known to be weak') || 
                   error.message.includes('weak and easy to guess')) {
          setError('كلمة المرور ضعيفة جداً أو شائعة. استخدم كلمة مرور أقوى تحتوي على أحرف وأرقام ورموز');
        } else {
          setError('خطأ في التسجيل: ' + error.message);
        }
      } else {
        if (data.user && !data.session) {
          try {
            const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-code', {
              body: {
                email: email,
                type: 'user'
              }
            });

            if (emailError) {
              console.error('Email sending error:', emailError);
              toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب.');
            } else {
              setSignupEmail(email);
              setEmailForVerification(email);
              setShowVerificationAfterSignup(true);
              setStep('verification');
              toast.success('تم إنشاء الحساب بنجاح! تم إرسال رمز التحقق إلى بريدك الإلكتروني.', {
                duration: 6000,
                style: {
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '14px',
                }
              });
            }
          } catch (emailErr) {
            console.error('Failed to send verification email:', emailErr);
            toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب.');
          }
          setError('');
        } else if (data.session) {
          toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden" dir="rtl">
      {/* Header with Back Button */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link 
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-300 font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للرئيسية</span>
          </Link>
          
          <div className="w-10 h-10 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl"></div>
        </div>
      </header>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Service Icons */}
        <div className="absolute top-32 right-16 text-blue-500/10 dark:text-blue-400/10 animate-pulse">
          <Code className="w-16 h-16" />
        </div>
        <div className="absolute bottom-32 right-1/4 text-purple-500/10 dark:text-purple-400/10 animate-pulse">
          <Palette className="w-12 h-12" />
        </div>
        <div className="absolute top-1/2 left-16 text-green-500/10 dark:text-green-400/10 animate-pulse">
          <BarChart3 className="w-14 h-14" />
        </div>
        <div className="absolute bottom-16 left-1/3 text-orange-500/10 dark:text-orange-400/10 animate-pulse">
          <Settings className="w-10 h-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="w-full max-w-lg mx-auto relative z-10">
          <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-2xl shadow-black/5 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="text-center relative pb-8 pt-10 bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              {/* Company Logo */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 mb-6 relative animate-pulse">
                <Building2 className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  منصة الشركات المتقدمة
                </span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-base sm:text-lg px-4">
                نظام إدارة متكامل للشركات والمؤسسات الحديثة
              </CardDescription>
              
              {/* Features Preview */}
              <div className="flex justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>متطور</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 text-sm">
                  <Shield className="w-3 h-3" />
                  <span>آمن</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-sm">
                  <Zap className="w-3 h-3" />
                  <span>سريع</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {step === 'verification' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 mb-4">
                      <Key className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      تحقق من هويتك
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      تم إرسال رمز التحقق إلى: {emailForVerification}
                    </p>
                  </div>

                  <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode" className="text-slate-700 dark:text-slate-300">رمز التحقق</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="أدخل الرمز المكون من 6 أرقام"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="text-lg text-center tracking-widest bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-14"
                        maxLength={6}
                        required
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                        <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 rounded-xl h-14 text-lg font-medium transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          جارِ التحقق...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5" />
                          تأكيد الرمز
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('credentials')}
                      className="w-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      العودة لتسجيل الدخول
                    </Button>
                  </form>
                </div>
              ) : step === 'forgot-password' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      نسيت كلمة المرور؟
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Input
                          id="forgot-email"
                          name="email"
                          type="email"
                          placeholder="example@company.com"
                          className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12"
                          required
                        />
                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      </div>
                    </div>

                    {error && (
                      <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                        <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 rounded-xl h-12 font-medium transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          جارِ الإرسال...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4" />
                          إرسال رابط إعادة التعيين
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep('credentials')}
                      className="w-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      العودة لتسجيل الدخول
                    </Button>
                  </form>
                </div>
              ) : (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-xl h-12">
                    <TabsTrigger 
                      value="signin" 
                      className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      تسجيل الدخول
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      إنشاء حساب
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6 mt-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Input
                            id="signin-email"
                            name="email"
                            type="email"
                            placeholder="example@company.com"
                            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12"
                            required
                          />
                          <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-slate-700 dark:text-slate-300">كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور"
                            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12 pl-12"
                            required
                          />
                          <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                          <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setStep('forgot-password')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto"
                        >
                          نسيت كلمة المرور؟
                        </Button>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl h-12 font-medium transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            جارِ تسجيل الدخول...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <LogIn className="w-4 h-4" />
                            تسجيل الدخول
                          </div>
                        )}
                      </Button>

                      {referralCode && (
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
                            <Star className="w-4 h-4" />
                            <span>كود الإحالة: {referralCode}</span>
                          </div>
                        </div>
                      )}
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-slate-700 dark:text-slate-300">الاسم الكامل</Label>
                        <div className="relative">
                          <Input
                            id="signup-name"
                            name="fullName"
                            type="text"
                            placeholder="الاسم الكامل"
                            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12"
                            required
                          />
                          <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="example@company.com"
                            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12"
                            required
                          />
                          <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-slate-700 dark:text-slate-300">كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="أدخل كلمة مرور قوية"
                            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl h-12 pr-12 pl-12"
                            required
                          />
                          <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير وحرف صغير ورقم
                        </p>
                      </div>

                      {error && (
                        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                          <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 rounded-xl h-12 font-medium transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            جارِ إنشاء الحساب...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <UserPlus className="w-5 h-5" />
                            إنشاء حساب جديد
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;