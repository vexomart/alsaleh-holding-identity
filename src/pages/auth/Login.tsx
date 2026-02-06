/**
 * Login Page - Premium Authentication Experience
 * Modern Design with Enhanced Animations
 */

import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Globe, Shield, Smartphone, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';
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

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0.2, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628] p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">جارِ التحقق عبر نفاذ...</p>
            <p className="text-white/60 mt-2">يرجى الانتظار</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Animated Gradient Orbs */}
      <motion.div 
        className="absolute top-1/4 start-1/4 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 end-1/4 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 start-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
        >
          <Globe className="w-4 h-4 me-2" />
          {language === 'ar' ? 'English' : 'عربي'}
        </Button>
      </motion.div>

      <div className="w-full max-w-md relative z-10 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Logo & Branding */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex justify-center">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                  <span className="text-4xl font-black text-white tracking-tight relative z-10">ASH</span>
                </div>
                {/* Outer glow ring */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/50 to-accent/50 blur-lg opacity-50 -z-10" />
              </motion.div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-wide">
                ASH HOLDING
              </h1>
              <p className="text-white/60 text-base">منصة إدارة الأعمال</p>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl overflow-hidden relative">
              {/* Card inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              
              <CardHeader className="text-center pb-4 pt-8 relative">
                <CardTitle className="text-2xl font-bold text-white">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </CardTitle>
                <CardDescription className="text-white/60 text-base mt-2">
                  {isRTL ? 'اختر طريقة الدخول المفضلة' : 'Choose your preferred login method'}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative pb-8">
                <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'phone' | 'email')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 mb-8 p-1 rounded-xl">
                    <TabsTrigger 
                      value="phone" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 rounded-lg transition-all duration-300 py-3 text-base font-medium"
                    >
                      <Smartphone className="w-5 h-5 me-2" />
                      {isRTL ? 'رقم الجوال' : 'Phone'}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="email"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 rounded-lg transition-all duration-300 py-3 text-base font-medium"
                    >
                      <Mail className="w-5 h-5 me-2" />
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
                          className="space-y-6"
                        >
                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-base font-medium text-white/80">
                              {isRTL ? 'رقم الجوال' : 'Phone Number'}
                            </Label>
                            <div className="relative group">
                              <Smartphone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+966XXXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                                className="ps-12 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                                dir="ltr"
                                required
                                disabled={isSmsLoading}
                                maxLength={14}
                                autoComplete="tel"
                              />
                            </div>
                            <p className="text-sm text-white/50 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              {isRTL ? 'سيتم إرسال رمز التحقق إلى هذا الرقم' : 'A verification code will be sent'}
                            </p>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold text-lg rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                            disabled={isSmsLoading || !phone}
                          >
                            {isSmsLoading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <MessageSquare className="w-5 h-5 me-2" />
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
                            className="flex items-center text-sm text-white/60 hover:text-white transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4 ms-1 rotate-180" />
                            {isRTL ? 'تغيير الرقم' : 'Change number'}
                          </button>

                          <div className="text-center space-y-4">
                            <motion.div 
                              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <MessageSquare className="w-10 h-10 text-primary" />
                              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                            </motion.div>
                            <div>
                              <p className="text-xl font-semibold text-white">
                                {isRTL ? 'أدخل رمز التحقق' : 'Enter verification code'}
                              </p>
                              <p className="text-white/50 mt-1" dir="ltr">
                                {phone}
                              </p>
                            </div>
                          </div>

                          {/* OTP Input */}
                          <div className="flex justify-center py-4" dir="ltr">
                            <InputOTP
                              maxLength={6}
                              value={otpCode}
                              onChange={setOtpCode}
                            >
                              <InputOTPGroup className="gap-3">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                  <InputOTPSlot 
                                    key={index} 
                                    index={index}
                                    className="w-14 h-16 text-2xl bg-white/5 border-white/20 text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          {/* Countdown & Resend */}
                          <div className="text-center">
                            {countdown > 0 ? (
                              <p className="text-white/50">
                                {isRTL ? `إعادة الإرسال بعد` : `Resend in`}{' '}
                                <span className="text-primary font-mono font-bold">{formatCountdown(countdown)}</span>
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isSmsLoading}
                                className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                              >
                                {isRTL ? 'إعادة إرسال الرمز' : 'Resend code'}
                              </button>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold text-lg rounded-xl shadow-lg shadow-primary/25 transition-all duration-300"
                            disabled={isSmsLoading || otpCode.length !== 6}
                          >
                            {isSmsLoading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-5 h-5 me-2" />
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
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium text-white/80">
                          {t('auth.email')}
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="ps-12 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                            required
                            disabled={isLoading}
                            maxLength={255}
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-base font-medium text-white/80">
                          {t('auth.password')}
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ps-12 pe-12 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                            required
                            disabled={isLoading}
                            maxLength={100}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
                          />
                          <Label htmlFor="remember" className="text-white/60 cursor-pointer">
                            {t('auth.remember_me')}
                          </Label>
                        </div>
                        <Link
                          to="/auth/forgot-password"
                          className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {t('auth.forgot_password')}
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold text-lg rounded-xl shadow-lg shadow-primary/25 transition-all duration-300"
                        disabled={isLoading || !email || !password}
                      >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            {t('auth.login')}
                            <ArrowLeft className="w-5 h-5 ms-2 rotate-180" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </Tabs>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-4 text-white/40 text-sm">
                      {isRTL ? 'أو' : 'or'}
                    </span>
                  </div>
                </div>

                {/* Nafath Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 text-base font-medium"
                  onClick={handleNafathLogin}
                  disabled={nafathLoading || isLoading}
                >
                  {nafathLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-6 h-6 text-green-400" />
                      <span className="ms-3">{isRTL ? 'الدخول عبر نفاذ' : 'Sign in with Nafath'}</span>
                    </>
                  )}
                </Button>

                {/* Create Account Link */}
                <div className="text-center mt-8">
                  <p className="text-white/50">
                    {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                    <Link to="/auth/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                      {isRTL ? 'أنشئ حساباً' : 'Sign up'}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/30 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              ASH HOLDING
              <Sparkles className="w-4 h-4" />
            </p>
            <Link 
              to="/" 
              className="text-white/50 hover:text-primary transition-colors inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              {isRTL ? 'العودة للموقع' : 'Back to Website'}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
