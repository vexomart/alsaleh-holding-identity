/**
 * Login Page - Ultra Modern Premium Authentication
 * Sleek Design with Cinematic Animations
 */

import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, 
  Globe, Shield, Smartphone, MessageSquare, 
  CheckCircle2, Fingerprint, KeyRound, Zap,
  Phone, Send, RefreshCw, User, ChevronLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// Animated Background Component
function AnimatedBackground() {
  return (
    <>
      {/* Main gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(var(--accent) / 0.1), transparent),
            radial-gradient(ellipse 50% 30% at 50% 90%, hsl(var(--secondary) / 0.08), transparent)
          `
        }}
      />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)',
          bottom: '10%',
          right: '10%',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Sparkle particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

// Feature badges component
function FeatureBadges({ isRTL }: { isRTL: boolean }) {
  const features = [
    { icon: Shield, text: isRTL ? 'آمن ومشفر' : 'Secure & Encrypted' },
    { icon: Zap, text: isRTL ? 'دخول سريع' : 'Fast Login' },
    { icon: Fingerprint, text: isRTL ? 'تحقق ذكي' : 'Smart Auth' },
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <feature.icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-white/70">{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" dir="rtl">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 relative z-10"
        >
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center backdrop-blur-xl">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">جارِ التحقق عبر نفاذ</h2>
            <p className="text-white/60 mt-2">يرجى الانتظار...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatedBackground />
      
      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 start-6 z-20"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <Globe className="w-4 h-4 me-2" />
          {language === 'ar' ? 'English' : 'عربي'}
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-lg relative z-10 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Logo & Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="relative inline-block"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent/80 flex items-center justify-center shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)]" />
                <span className="text-5xl font-black text-white tracking-tight relative z-10">ASH</span>
              </div>
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/40 to-accent/40 blur-2xl opacity-60 -z-10" />
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1 
                className="text-4xl font-bold text-white tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ASH HOLDING
              </motion.h1>
              <motion.p 
                className="text-lg text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isRTL ? 'منصة إدارة الأعمال المتكاملة' : 'Integrated Business Platform'}
              </motion.p>
            </div>
          </motion.div>

          {/* Feature Badges */}
          <FeatureBadges isRTL={isRTL} />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Card glow effect */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
            
            <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden">
              {/* Inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative p-8">
                {/* Card Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isRTL ? 'تسجيل الدخول' : 'Welcome Back'}
                  </h2>
                  <p className="text-white/50">
                    {isRTL ? 'اختر طريقة الدخول المناسبة لك' : 'Choose your preferred login method'}
                  </p>
                </div>

                {/* Auth Tabs */}
                <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'phone' | 'email')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl mb-8">
                    <TabsTrigger 
                      value="phone" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/60 rounded-xl py-3.5 text-base font-semibold transition-all duration-300"
                    >
                      <Phone className="w-5 h-5 me-2" />
                      {isRTL ? 'الجوال' : 'Phone'}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="email"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/60 rounded-xl py-3.5 text-base font-semibold transition-all duration-300"
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
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleSendOtp}
                          className="space-y-6"
                        >
                          <div className="space-y-3">
                            <Label className="text-base font-semibold text-white/90 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              {isRTL ? 'رقم الجوال' : 'Phone Number'}
                            </Label>
                            <div className="relative group">
                              <Input
                                type="tel"
                                placeholder={isRTL ? '05XXXXXXXX' : '+966XXXXXXXX'}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                                className="h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl transition-all ps-14"
                                dir="ltr"
                                required
                                disabled={isSmsLoading}
                                maxLength={14}
                                autoComplete="tel"
                              />
                              <div className="absolute start-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <Smartphone className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                            <p className="text-sm text-white/40 flex items-center gap-2 ps-1">
                              <Send className="w-3.5 h-3.5" />
                              {isRTL ? 'سيتم إرسال رمز التحقق إلى هذا الرقم' : 'Verification code will be sent'}
                            </p>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-primary via-primary to-primary/90 hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-xl shadow-primary/30 transition-all duration-300 group"
                            disabled={isSmsLoading || !phone}
                          >
                            {isSmsLoading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-5 h-5 me-2 group-hover:translate-x-1 transition-transform" />
                                {isRTL ? 'إرسال رمز التحقق' : 'Send Code'}
                              </>
                            )}
                          </Button>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="otp-form"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleVerifyOtp}
                          className="space-y-6"
                        >
                          {/* Back button */}
                          <button
                            type="button"
                            onClick={() => { setPhoneStep('phone'); setOtpCode(''); }}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group"
                          >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {isRTL ? 'تغيير الرقم' : 'Change number'}
                          </button>

                          <div className="text-center space-y-4 py-4">
                            <motion.div 
                              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-white/10"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <KeyRound className="w-10 h-10 text-primary" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {isRTL ? 'أدخل رمز التحقق' : 'Enter Code'}
                              </h3>
                              <p className="text-white/50 mt-1 font-mono" dir="ltr">
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
                                    className="w-12 h-14 text-2xl bg-white/5 border-white/20 text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all font-bold"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          {/* Countdown & Resend */}
                          <div className="text-center">
                            {countdown > 0 ? (
                              <div className="flex items-center justify-center gap-2 text-white/50">
                                <RefreshCw className="w-4 h-4" />
                                <span>{isRTL ? 'إعادة الإرسال بعد' : 'Resend in'}</span>
                                <span className="text-primary font-mono font-bold text-lg">{formatCountdown(countdown)}</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isSmsLoading}
                                className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-2 mx-auto"
                              >
                                <RefreshCw className="w-4 h-4" />
                                {isRTL ? 'إعادة إرسال الرمز' : 'Resend code'}
                              </button>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-primary via-primary to-primary/90 hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-xl shadow-primary/30 transition-all duration-300"
                            disabled={isSmsLoading || otpCode.length !== 6}
                          >
                            {isSmsLoading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-5 h-5 me-2" />
                                {isRTL ? 'تأكيد الدخول' : 'Verify & Login'}
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
                        <Label className="text-base font-semibold text-white/90 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                        </Label>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl transition-all ps-14"
                            required
                            disabled={isLoading}
                            maxLength={255}
                            autoComplete="email"
                          />
                          <div className="absolute start-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-white/90 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          {isRTL ? 'كلمة المرور' : 'Password'}
                        </Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl transition-all ps-14 pe-14"
                            required
                            disabled={isLoading}
                            maxLength={100}
                            autoComplete="current-password"
                          />
                          <div className="absolute start-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <KeyRound className="w-4 h-4 text-primary" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
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
                            className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5 rounded-md"
                          />
                          <Label htmlFor="remember" className="text-white/60 cursor-pointer text-sm">
                            {isRTL ? 'تذكرني' : 'Remember me'}
                          </Label>
                        </div>
                        <Link
                          to="/auth/forgot-password"
                          className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                        >
                          {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-primary via-primary to-primary/90 hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-xl shadow-primary/30 transition-all duration-300 group"
                        disabled={isLoading || !email || !password}
                      >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                            <ArrowRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </Tabs>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-white/40 bg-transparent">
                      {isRTL ? 'أو' : 'or'}
                    </span>
                  </div>
                </div>

                {/* Nafath Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30 hover:border-emerald-500/50 text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-300 text-base font-semibold group"
                  onClick={handleNafathLogin}
                  disabled={nafathLoading || isLoading}
                >
                  {nafathLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-6 h-6 text-emerald-400 me-3 group-hover:scale-110 transition-transform" />
                      {isRTL ? 'الدخول عبر نفاذ' : 'Sign in with Nafath'}
                    </>
                  )}
                </Button>

                {/* Create Account Link */}
                <div className="text-center mt-8">
                  <p className="text-white/50">
                    {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                    <Link 
                      to="/auth/signup" 
                      className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline underline-offset-4"
                    >
                      {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-white/30 text-sm">
              © 2024 ASH HOLDING. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
            <Link 
              to="/" 
              className="text-white/40 hover:text-primary transition-colors inline-flex items-center gap-2 text-sm group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {isRTL ? 'العودة للموقع الرئيسي' : 'Back to Website'}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
