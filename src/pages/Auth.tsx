import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Shield } from 'lucide-react';
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
      toast.success('تم اكتشاف كود الإحالة! ستحصل على مزايا خاصة عند التسجيل');
    }
  }, []);

  // تحقق من تسجيل الدخول
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/my-projects');
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
              toast.success('تم تسجيلك بنجاح عبر رابط الإحالة!');
            }
          } catch (err) {
            console.error('Affiliate processing failed:', err);
          }
        }
        
        navigate('/my-projects');
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
        const { error } = await supabase.functions.invoke('send-verification-code', {
          body: { email, type: 'user' }
        });

        if (error) {
          setError('فشل في إرسال رمز التحقق. تحقق من صحة الإيميل.');
          setIsLoading(false);
          return;
        }

        setEmailForVerification(email);
        setStep('verification');
        toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      } catch (err) {
        setError('حدث خطأ أثناء إرسال رمز التحقق');
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
          toast.success('تم تسجيل الدخول بنجاح');
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
        toast.success('تم التحقق بنجاح! يتم الآن تسجيل دخولك...');
        // استخدام الرابط الآمن للدخول
        window.location.href = data.auth_url;
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
        } else {
          setError(error.message);
        }
      } else {
        toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* رابط العودة */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">نظام تتبع المشاريع</CardTitle>
            <CardDescription>
              سجل دخولك لمتابعة مشاريعك أو أنشئ حساب جديد
            </CardDescription>
            {referralCode && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 تم اكتشاف كود إحالة! ستحصل على مزايا خاصة عند التسجيل
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  كود الإحالة: {referralCode}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mt-4 border-destructive/50 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                {step === 'credentials' ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* خيار استخدام التحقق بالإيميل */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="useVerification"
                          name="useVerification"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="useVerification" className="text-sm">
                          استخدام التحقق بالإيميل (أكثر أماناً) 🔐
                        </Label>
                      </div>
                      
                      <div id="password-field" className="space-y-2">
                        <Label htmlFor="signin-password">كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور (اختياري مع التحقق بالإيميل)"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          جارِ المعالجة...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          تسجيل الدخول
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">أدخل رمز التحقق</h3>
                      <p className="text-sm text-muted-foreground">
                        تم إرسال رمز مكون من 6 أرقام إلى {emailForVerification}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code">رمز التحقق</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-2xl font-mono tracking-widest"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          جارِ التحقق...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          تأكيد الرمز
                        </>
                      )}
                    </Button>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep('credentials')}
                        className="text-sm"
                      >
                        العودة
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
                        className="text-sm"
                        disabled={isLoading}
                      >
                        إعادة الإرسال
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="الاسم الكامل"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة المرور (8 أحرف على الأقل)"
                        required
                        minLength={8}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        جارِ إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        إنشاء حساب جديد
                      </>
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