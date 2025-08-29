import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Shield, Mail, Lock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [emailForVerification, setEmailForVerification] = useState('');
  const navigate = useNavigate();

  // تحقق من وجود كود إحالة في الرابط
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      // حفظ كود الإحالة في localStorage لاستخدامه لاحقاً
      localStorage.setItem('affiliate_referral_code', refCode);
      toast('تم اكتشاف كود الإحالة! ستحصل على مزايا خاصة عند التسجيل');
    }
  }, []);

  // تحقق من تسجيل الدخول
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // التحقق من دور المستخدم وإعادة التوجيه وفقاً لذلك
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

    // استمع لتغييرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        // إذا كان هناك كود إحالة، معالجة الإحالة
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
        
        // التحقق من دور المستخدم وإعادة التوجيه وفقاً لذلك
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
    const useVerification = formData.get('useVerification') === 'on';

    if (useVerification) {
      // إرسال رمز التحقق
      try {
        console.log('🔄 إرسال رمز التحقق للإيميل:', email);
        const { data, error } = await supabase.functions.invoke('send-verification-code', {
          body: { email, type: 'user' }
        });

        console.log('📧 استجابة دالة إرسال رمز التحقق:', { data, error });

        if (error) {
          console.error('❌ خطأ في إرسال رمز التحقق:', error);
          setError('فشل في إرسال رمز التحقق. تحقق من صحة الإيميل.');
          setIsLoading(false);
          return;
        }

        setEmailForVerification(email);
        setStep('verification');
        toast('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      } catch (err) {
        console.error('💥 خطأ غير متوقع في إرسال رمز التحقق:', err);
        setError('حدث خطأ أثناء إرسال رمز التحقق: ' + (err as Error).message);
      }
    } else {
      // تسجيل دخول تقليدي
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
          toast('تم تسجيل الدخول بنجاح');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تسجيل الدخول');
      }
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
        toast('تم التحقق بنجاح! يتم الآن تسجيل دخولك...');
        
        // إذا كان هناك auth_url، استخدمه
        if (data.auth_url) {
          window.location.href = data.auth_url;
        } else {
          // وإلا، اطلب من المستخدم إدخال كلمة المرور لتسجيل الدخول
          setStep('credentials');
          setError('تم التحقق من الرمز بنجاح. الآن أدخل كلمة المرور لإكمال تسجيل الدخول.');
        }
      }
    } catch (error: any) {
      console.error('خطأ في التحقق:', error);
      setError('حدث خطأ أثناء التحقق من الرمز.');
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

    // التحقق من قوة كلمة المرور قبل الإرسال
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
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
        toast('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-indigo-100/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية شبكة ديناميكية */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(148 163 184 / 0.08)%27%3e%3cpath d=%27m0 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2%27/%3e%3c/svg%3e')] opacity-40"></div>
      
      {/* عناصر زخرفية متحركة */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* رابط العودة */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 pb-8 pt-10 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            {/* لوجو الشركة */}
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 relative">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              منصة إدارة المشاريع
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-lg">
              منصة متطورة لإدارة ومتابعة المشاريع
            </CardDescription>
            {referralCode && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200/50 dark:border-green-700/50 rounded-2xl backdrop-blur-sm">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  🎉 تم اكتشاف كود إحالة! ستحصل على مزايا خاصة عند التسجيل
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                  كود الإحالة: {referralCode}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-1 mb-8">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-300"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-300"
                >
                  حساب جديد
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mt-4 mb-6 border-red-200 bg-red-50/80 dark:bg-red-950/20 dark:border-red-800 backdrop-blur-sm rounded-2xl">
                  <AlertDescription className="text-red-800 dark:text-red-300 text-right font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-6">
                {step === 'credentials' ? (
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="signin-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="example@company.com"
                        required
                        disabled={isLoading}
                        className="h-12 text-right bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
                        dir="rtl"
                      />
                    </div>

                    {/* خيار استخدام التحقق بالإيميل */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                        <input
                          type="checkbox"
                          id="useVerification"
                          name="useVerification"
                          className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500/20"
                        />
                        <Label htmlFor="useVerification" className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          استخدام التحقق بالإيميل (أكثر أماناً) 🔐
                        </Label>
                      </div>
                      
                      <div id="password-field" className="space-y-3">
                        <Label htmlFor="signin-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          كلمة المرور
                        </Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور (اختياري مع التحقق بالإيميل)"
                            disabled={isLoading}
                            className="h-12 text-right bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 pr-12"
                            dir="rtl"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 rounded-xl transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جارِ المعالجة...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <LogIn className="w-5 h-5" />
                          تسجيل الدخول
                        </div>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">أدخل رمز التحقق</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-xl">
                        تم إرسال رمز مكون من 6 أرقام إلى<br/>
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{emailForVerification}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="verification-code" className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center block">
                        رمز التحقق (6 أرقام)
                      </Label>
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="h-16 text-center text-2xl font-mono tracking-widest bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-green-400 focus:ring-green-400/20 rounded-xl transition-all duration-300"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 rounded-xl transition-all duration-300 disabled:opacity-50" 
                      disabled={isLoading || verificationCode.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جارِ التحقق...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5" />
                          تأكيد الرمز ودخول النظام
                        </div>
                      )}
                    </Button>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep('credentials')}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl"
                      >
                        العودة للخلف
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const form = new FormData();
                          form.set('email', emailForVerification);
                          form.set('useVerification', 'on');
                          handleSignIn({preventDefault: () => {}, currentTarget: {elements: Object.fromEntries(form)}} as any);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 rounded-xl"
                        disabled={isLoading}
                      >
                        إعادة الإرسال
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signup-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      الاسم الكامل
                    </Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="الاسم الكامل"
                      required
                      disabled={isLoading}
                      className="h-12 text-right bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl transition-all duration-300"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="example@company.com"
                      required
                      disabled={isLoading}
                      className="h-12 text-right bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl transition-all duration-300"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة مرور قوية"
                        required
                        minLength={8}
                        disabled={isLoading}
                        className="h-12 text-right bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl transition-all duration-300 pr-12"
                        dir="rtl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                      <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">متطلبات كلمة المرور:</p>
                      <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          8 أحرف على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          حرف كبير وحرف صغير
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          رقم واحد على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          تجنب الكلمات الشائعة
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/30 rounded-xl transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;