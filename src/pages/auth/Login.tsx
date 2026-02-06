/**
 * Login Page - Premium Authentication Experience
 * Uses import * as React pattern for hook stability
 */

import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Globe, Shield, Smartphone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useSmsOtp } from '@/hooks/useSmsOtp';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation Schemas
const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صالح')
    .max(255, 'البريد الإلكتروني طويل جداً'),
  password: z.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً'),
});

const phoneSchema = z.object({
  phone: z.string()
    .trim()
    .regex(/^(05|5|9665|\+9665)[0-9]{8}$/, 'رقم الجوال غير صالح')
    .transform((val) => {
      if (val.startsWith('+966')) return '0' + val.slice(4);
      if (val.startsWith('966')) return '0' + val.slice(3);
      if (val.startsWith('5') && val.length === 9) return '0' + val;
      return val;
    }),
});

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, user } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { sendOtp, verifyOtp, isLoading: isSmsLoading, clearError } = useSmsOtp();
  
  // Auth method tabs
  const [authMethod, setAuthMethod] = React.useState<'phone' | 'email'>('phone');
  
  // Phone login states
  const [phone, setPhone] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [phoneStep, setPhoneStep] = React.useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = React.useState(0);
  
  // Email login states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  
  // Nafath states
  const [nafathLoading, setNafathLoading] = React.useState(false);
  const [nafathProcessing, setNafathProcessing] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle Nafath callback
  React.useEffect(() => {
    const provider = searchParams.get('provider');
    if (provider === 'nafath') {
      handleNafathCallback();
    }
  }, [searchParams]);

  const handleNafathCallback = async () => {
    setNafathProcessing(true);
    try {
      const state = searchParams.get('state');
      const code = searchParams.get('code');
      const session_id = searchParams.get('session_id');

      if (!state) {
        toast.error('فشل التحقق عبر نفاذ: معلومات ناقصة');
        setNafathProcessing(false);
        return;
      }

      const response = await supabase.functions.invoke('nafath-callback', {
        body: { state, code, session_id }
      });

      if (response.error || !response.data?.success) {
        toast.error(response.data?.message || 'فشل التحقق عبر نفاذ، حاول مرة أخرى');
        setNafathProcessing(false);
        window.history.replaceState({}, '', '/auth/login');
        return;
      }

      toast.success('تم تسجيل الدخول بنجاح');
      const role = response.data.role;
      if (role === 'admin' || role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (error) {
      console.error('Nafath callback error:', error);
      toast.error('فشل التحقق عبر نفاذ، حاول مرة أخرى');
      setNafathProcessing(false);
      window.history.replaceState({}, '', '/auth/login');
    }
  };

  const handleNafathLogin = async () => {
    setNafathLoading(true);
    try {
      const response = await supabase.functions.invoke('nafath-start', {
        body: { callback_url: `${window.location.origin}/auth/login?provider=nafath` }
      });

      if (response.error || !response.data?.success) {
        toast.error(response.data?.message || 'فشل الاتصال بخدمة نفاذ');
        setNafathLoading(false);
        return;
      }

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Nafath start error:', error);
      toast.error('فشل الاتصال بخدمة نفاذ، حاول مرة أخرى');
      setNafathLoading(false);
    }
  };

  // Handle phone OTP send
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    const normalizedPhone = result.data.phone;
    const response = await sendOtp(normalizedPhone, 'login');

    if (response.success) {
      setPhone(normalizedPhone);
      setPhoneStep('otp');
      setCountdown(response.expires_in || 300);
      toast.success('تم إرسال رمز التحقق إلى جوالك');
    } else {
      toast.error(response.error || 'فشل في إرسال الرمز');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (otpCode.length !== 6) {
      toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    const response = await verifyOtp(phone, otpCode, 'login');

    if (response.success) {
      // If we have an action_link (magic link), use it to authenticate
      if (response.action_link) {
        try {
          const url = new URL(response.action_link);
          const tokenHash = url.searchParams.get('token');
          const type = url.searchParams.get('type') || 'magiclink';
          
          if (tokenHash) {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: type as 'magiclink',
            });
            
            if (error) {
              console.error('Error verifying magic link:', error);
              await supabase.auth.refreshSession();
            }
            
            if (data?.session) {
              toast.success('تم تسجيل الدخول بنجاح');
              navigate('/app');
              return;
            }
          }
        } catch (err) {
          console.error('Error processing magic link:', err);
        }
      }
      
      await supabase.auth.refreshSession();
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/app');
    } else {
      toast.error(response.error || 'رمز التحقق غير صحيح');
      if (response.remaining_attempts !== undefined && response.remaining_attempts > 0) {
        toast.info(`المحاولات المتبقية: ${response.remaining_attempts}`);
      }
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    const response = await sendOtp(phone, 'login');
    if (response.success) {
      setCountdown(response.expires_in || 300);
      setOtpCode('');
      toast.success('تم إرسال رمز جديد');
    } else {
      toast.error(response.error || 'فشل في إعادة إرسال الرمز');
    }
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(isRTL ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
        return;
      }

      toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
      navigate('/admin');
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown timer
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show processing screen while handling Nafath callback
  if (nafathProcessing) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4"
        dir="rtl"
      >
        <Card className="border-border/20 bg-card/5 backdrop-blur-2xl shadow-2xl w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-lg font-medium text-foreground">جارِ التحقق عبر نفاذ...</p>
            <p className="text-muted-foreground text-sm mt-2">يرجى الانتظار</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Language Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="absolute top-4 end-4 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
      >
        <Globe className="w-4 h-4 me-2" />
        {language === 'ar' ? 'English' : 'عربي'}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Logo & Branding */}
        <motion.div 
          className="text-center space-y-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
              <span className="text-3xl font-black text-primary-foreground tracking-tight">ASH</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-wide">ASH HOLDING</h1>
            <p className="text-muted-foreground text-sm mt-1">منصة إدارة الأعمال</p>
          </div>
        </motion.div>

        {/* Main Card */}
        <Card className="border-border/20 bg-card/5 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-foreground">
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRTL ? 'اختر طريقة الدخول المفضلة' : 'Choose your preferred login method'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'phone' | 'email')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-foreground/5 border border-border/20 mb-6">
                <TabsTrigger 
                  value="phone" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                >
                  <Smartphone className="w-4 h-4 me-2" />
                  {isRTL ? 'رقم الجوال' : 'Phone'}
                </TabsTrigger>
                <TabsTrigger 
                  value="email"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                >
                  <Mail className="w-4 h-4 me-2" />
                  {isRTL ? 'البريد' : 'Email'}
                </TabsTrigger>
              </TabsList>

              {/* Phone Login */}
              <TabsContent value="phone" className="mt-0">
                <AnimatePresence mode="wait">
                  {phoneStep === 'phone' ? (
                    <motion.form
                      key="phone-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSendOtp}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                          {isRTL ? 'رقم الجوال' : 'Phone Number'}
                        </Label>
                        <div className="relative">
                          <Smartphone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="05XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                            className="ps-10 bg-foreground/5 border-border/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                            dir="ltr"
                            required
                            disabled={isSmsLoading}
                            maxLength={14}
                            autoComplete="tel"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'سيتم إرسال رمز التحقق إلى هذا الرقم' : 'A verification code will be sent to this number'}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        disabled={isSmsLoading || !phone}
                      >
                        {isSmsLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 me-2" />
                            {isRTL ? 'إرسال رمز التحقق' : 'Send Verification Code'}
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleVerifyOtp}
                      className="space-y-6"
                    >
                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => { setPhoneStep('phone'); setOtpCode(''); }}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 ms-1 rotate-180" />
                        {isRTL ? 'تغيير الرقم' : 'Change number'}
                      </button>

                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-foreground font-medium">
                          {isRTL ? 'أدخل رمز التحقق' : 'Enter verification code'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? `تم إرسال الرمز إلى ${phone}` : `Code sent to ${phone}`}
                        </p>
                      </div>

                      {/* OTP Input */}
                      <div className="flex justify-center" dir="ltr">
                        <InputOTP
                          maxLength={6}
                          value={otpCode}
                          onChange={setOtpCode}
                        >
                          <InputOTPGroup className="gap-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot 
                                key={index} 
                                index={index}
                                className="w-12 h-14 text-xl bg-foreground/5 border-border/30 text-foreground rounded-lg"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      {/* Countdown & Resend */}
                      <div className="text-center">
                        {countdown > 0 ? (
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? `إعادة الإرسال بعد ${formatCountdown(countdown)}` : `Resend in ${formatCountdown(countdown)}`}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isSmsLoading}
                            className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                          >
                            {isRTL ? 'إعادة إرسال الرمز' : 'Resend code'}
                          </button>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        disabled={isSmsLoading || otpCode.length !== 6}
                      >
                        {isSmsLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 me-2" />
                            {isRTL ? 'تأكيد الدخول' : 'Confirm Login'}
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Email Login */}
              <TabsContent value="email" className="mt-0">
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        className="ps-10 bg-foreground/5 border-border/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        maxLength={255}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="ps-10 pe-10 bg-foreground/5 border-border/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        maxLength={100}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-border/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        {t('auth.remember_me')}
                      </Label>
                    </div>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      {t('auth.forgot_password')}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t('auth.login')}
                        <ArrowLeft className="w-4 h-4 ms-2 rotate-180" />
                      </>
                    )}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">
                  {isRTL ? 'أو' : 'or'}
                </span>
              </div>
            </div>

            {/* Nafath Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-foreground/5 border-border/20 text-foreground hover:bg-foreground/10 hover:border-border/30"
              onClick={handleNafathLogin}
              disabled={nafathLoading || isLoading}
            >
              {nafathLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="ms-2">{isRTL ? 'الدخول عبر نفاذ' : 'Sign in with Nafath'}</span>
                </>
              )}
            </Button>

            {/* Create Account Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <Link to="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                  {isRTL ? 'أنشئ حساباً' : 'Sign up'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground/60">ASH HOLDING</p>
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3 rotate-180" />
            {isRTL ? 'العودة للموقع' : 'Back to Website'}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
