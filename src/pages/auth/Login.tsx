/**
 * Enterprise Login Page - World-Class Premium Design
 * Split Layout with Hero Section and Premium Form
 */
import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Smartphone, KeyRound, 
  Phone, Send, RefreshCw, CheckCircle2, ArrowRight,
  UserPlus, AlertCircle, ChevronLeft, ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  AuthBackground, AuthLogo, AuthCard, AuthInput, 
  AuthButton, FeatureBadges, AuthHeroSection 
} from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { useSmsOtp } from '@/hooks/useSmsOtp';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation Schemas
const emailSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255),
  password: z.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100),
});

const phoneSchema = z.object({
  phone: z.string()
    .trim()
    .min(9, 'رقم الجوال غير مكتمل')
    .max(14)
    .transform((val) => {
      let normalized = val.replace(/\s|-/g, '');
      if (normalized.startsWith('+966')) normalized = '0' + normalized.slice(4);
      else if (normalized.startsWith('966')) normalized = '0' + normalized.slice(3);
      else if (normalized.startsWith('5') && normalized.length === 9) normalized = '0' + normalized;
      return normalized;
    })
    .refine((val) => /^05[0-9]{8}$/.test(val), 'رقم الجوال يجب أن يبدأ بـ 05'),
});

// Step indicator component
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step ? 'bg-blue-500 w-8' : i === step ? 'bg-blue-400/60 w-5' : 'bg-white/10 w-3'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, user } = useAuth();
  const { sendOtp, verifyOtp, isLoading: isSmsLoading, clearError } = useSmsOtp();
  
  // Auth method
  const [authMethod, setAuthMethod] = React.useState<'phone' | 'email'>('phone');
  
  // Phone auth states
  const [phone, setPhone] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [phoneStep, setPhoneStep] = React.useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = React.useState(0);
  const [phoneError, setPhoneError] = React.useState('');
  
  // Email auth states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  
  // User status states
  const [userNotFound, setUserNotFound] = React.useState(false);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/[^0-9+]/g, ''));
    setPhoneError('');
    setUserNotFound(false);
  };

  // Handle send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPhoneError('');
    setUserNotFound(false);

    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      setPhoneError(result.error.errors[0].message);
      return;
    }

    const normalizedPhone = result.data.phone;
    const response = await sendOtp(normalizedPhone, 'login');

    if (response.success) {
      setPhone(normalizedPhone);
      setPhoneStep('otp');
      setCountdown(response.expires_in || 180);
      toast.success('تم إرسال رمز التحقق بنجاح');
    } else {
      if (response.error?.includes('غير مسجل') || response.error?.includes('not found') || response.error?.includes('لا يوجد')) {
        setUserNotFound(true);
        setPhoneError('لا يوجد حساب مرتبط بهذا الرقم');
      } else {
        setPhoneError(response.error || 'فشل في إرسال الرمز');
      }
    }
  };

  // Handle verify OTP
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
              console.error('Magic link verification error:', error);
              await supabase.auth.refreshSession();
            }
            
            if (data?.session) {
              toast.success('تم تسجيل الدخول بنجاح! مرحباً بك');
              navigate('/app');
              return;
            }
          }
        } catch (err) {
          console.error('Error processing magic link:', err);
        }
      }
      
      await supabase.auth.refreshSession();
      toast.success('تم تسجيل الدخول بنجاح! مرحباً بك');
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
      setCountdown(response.expires_in || 180);
      setOtpCode('');
      toast.success('تم إرسال رمز جديد');
    } else {
      toast.error(response.error || 'فشل في إعادة إرسال الرمز');
    }
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setUserNotFound(false);
    
    const result = emailSchema.safeParse({ email, password });
    if (!result.success) {
      result.error.errors.forEach(err => {
        if (err.path[0] === 'email') setEmailError(err.message);
        if (err.path[0] === 'password') setPasswordError(err.message);
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email.trim(), password);
      
      if (error) {
        if (error.message.includes('Invalid login') || error.message.includes('credentials')) {
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .maybeSingle();
          
          if (!existingUser) {
            setUserNotFound(true);
            setEmailError('لا يوجد حساب مرتبط بهذا البريد');
          } else {
            setPasswordError('كلمة المرور غير صحيحة');
          }
        } else {
          toast.error('حدث خطأ أثناء تسجيل الدخول');
        }
        return;
      }

      toast.success('تم تسجيل الدخول بنجاح! مرحباً بك');
      navigate('/app');
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to phone entry
  const handleBackToPhone = () => {
    setPhoneStep('phone');
    setOtpCode('');
    setCountdown(0);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="rtl">
      <AuthBackground />
      
      {/* Split Layout Container */}
      <div className="flex flex-col lg:flex-row w-full relative z-10">
        
        {/* Hero Section - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%]">
          <AuthHeroSection variant="login" />
        </div>
        
        {/* Form Section - Mobile optimized */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-[400px] sm:max-w-md space-y-4 sm:space-y-6">
            
            {/* Mobile Header - Compact */}
            <motion.div 
              className="text-center lg:hidden space-y-2 sm:space-y-3"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AuthLogo size="sm" />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  ASH <span className="text-blue-400">HOLDING</span>
                </h1>
                <p className="text-white/50 mt-0.5 text-xs sm:text-sm">منصة إدارة الأعمال المتكاملة</p>
              </motion.div>
            </motion.div>

            {/* Feature Badges - Mobile only - Hidden on very small screens */}
            <div className="lg:hidden hidden sm:block">
              <FeatureBadges variant="login" />
            </div>

            {/* Main Card */}
            <AuthCard>
              {/* Card Header - Compact on mobile */}
              <div className="text-center mb-5 sm:mb-6">
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  تسجيل الدخول
                </motion.h2>
                <motion.p 
                  className="text-white/45 text-xs sm:text-sm mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  أدخل بياناتك للوصول إلى حسابك
                </motion.p>
              </div>

              {/* Auth Method Tabs - Responsive */}
              <Tabs 
                value={authMethod} 
                onValueChange={(v) => {
                  setAuthMethod(v as 'phone' | 'email');
                  setUserNotFound(false);
                  setPhoneError('');
                  setEmailError('');
                  setPasswordError('');
                }} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/[0.05] border border-white/[0.1] p-1 sm:p-1.5 rounded-lg sm:rounded-xl mb-5 sm:mb-6 h-11 sm:h-12">
                  <TabsTrigger 
                    value="phone" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-white/50 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 h-9 sm:h-10"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-1.5 sm:me-2" />
                    رقم الجوال
                  </TabsTrigger>
                  <TabsTrigger 
                    value="email"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-white/50 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 h-9 sm:h-10"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-1.5 sm:me-2" />
                    البريد الإلكتروني
                  </TabsTrigger>
                </TabsList>

                {/* Phone Login */}
                <TabsContent value="phone" className="mt-0 focus-visible:outline-none">
                  <AnimatePresence mode="wait">
                    {phoneStep === 'phone' ? (
                      <motion.form
                        key="phone-form"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSendOtp}
                        className="space-y-4"
                      >
                        <AuthInput
                          label="رقم الجوال"
                          icon={<Smartphone className="w-5 h-5" />}
                          type="tel"
                          placeholder="05XXXXXXXX"
                          value={phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          error={phoneError}
                          hint="سيتم إرسال رمز التحقق إلى هذا الرقم"
                          dir="ltr"
                          maxLength={14}
                          autoComplete="tel"
                          disabled={isSmsLoading}
                        />

                        {/* User not found message */}
                        {userNotFound && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20"
                          >
                            <div className="flex items-start gap-2.5 sm:gap-3">
                              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1.5 sm:space-y-2">
                                <p className="text-xs sm:text-sm text-amber-200 font-medium">
                                  لا يوجد حساب مرتبط بهذا الرقم
                                </p>
                                <p className="text-[11px] sm:text-xs text-white/50">
                                  يمكنك إنشاء حساب جديد للبدء في استخدام المنصة
                                </p>
                                <Link 
                                  to="/auth/register"
                                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  إنشاء حساب جديد
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <AuthButton
                          type="submit"
                          isLoading={isSmsLoading}
                          disabled={!phone || isSmsLoading}
                          icon={<Send className="w-4 h-4" />}
                        >
                          إرسال رمز التحقق
                        </AuthButton>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp-form"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleVerifyOtp}
                        className="space-y-4 sm:space-y-5"
                      >
                        <StepIndicator step={1} total={2} />
                        
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={handleBackToPhone}
                          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs sm:text-sm group"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                          تغيير الرقم
                        </button>

                        {/* OTP Header - Compact on mobile */}
                        <div className="text-center space-y-2 sm:space-y-3 py-1 sm:py-2">
                          <motion.div 
                            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 flex items-center justify-center border border-white/[0.1]"
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                          </motion.div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white">أدخل رمز التحقق</h3>
                            <p className="text-white/40 text-xs sm:text-sm mt-1 font-mono" dir="ltr">{phone}</p>
                          </div>
                        </div>

                        {/* OTP Input - Responsive */}
                        <div className="flex justify-center py-2 sm:py-3" dir="ltr">
                          <InputOTP
                            maxLength={6}
                            value={otpCode}
                            onChange={setOtpCode}
                          >
                            <InputOTPGroup className="gap-1.5 sm:gap-2.5">
                              {[0, 1, 2, 3, 4, 5].map((index) => (
                                <InputOTPSlot 
                                  key={index}
                                  index={index} 
                                  className="w-9 h-11 sm:w-11 sm:h-13 rounded-lg sm:rounded-xl bg-white/[0.04] border-white/[0.1] text-white text-base sm:text-lg font-bold
                                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/[0.06]
                                    transition-all duration-200"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {/* Countdown */}
                        <div className="text-center">
                          {countdown > 0 ? (
                            <p className="text-xs sm:text-sm text-white/40">
                              إعادة الإرسال بعد{' '}
                              <span className="text-blue-400 font-mono font-bold">
                                {formatCountdown(countdown)}
                              </span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isSmsLoading}
                              className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 mx-auto transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              إعادة إرسال الرمز
                            </button>
                          )}
                        </div>

                        <AuthButton
                          type="submit"
                          isLoading={isSmsLoading}
                          disabled={otpCode.length !== 6 || isSmsLoading}
                          variant={otpCode.length === 6 ? 'success' : 'primary'}
                          icon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          تأكيد الدخول
                        </AuthButton>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Email Login */}
                <TabsContent value="email" className="mt-0 focus-visible:outline-none">
                  <motion.form
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleEmailLogin}
                    className="space-y-4"
                  >
                    <AuthInput
                      label="البريد الإلكتروني"
                      icon={<Mail className="w-5 h-5" />}
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); setUserNotFound(false); }}
                      error={emailError}
                      dir="ltr"
                      autoComplete="email"
                      disabled={isLoading}
                    />

                    <AuthInput
                      label="كلمة المرور"
                      icon={<Lock className="w-5 h-5" />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                      error={passwordError}
                      dir="ltr"
                      autoComplete="current-password"
                      disabled={isLoading}
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1.5 sm:p-2 text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/[0.05]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      }
                    />

                    {/* Remember me & Forgot password - Responsive */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                          className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-4 h-4"
                        />
                        <Label htmlFor="remember" className="text-xs sm:text-sm text-white/50 cursor-pointer">
                          تذكرني
                        </Label>
                      </div>
                      <Link 
                        to="/auth/forgot-password"
                        className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </div>

                    {/* User not found message */}
                    {userNotFound && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20"
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1.5 sm:space-y-2">
                            <p className="text-xs sm:text-sm text-amber-200 font-medium">
                              لا يوجد حساب مرتبط بهذا البريد
                            </p>
                            <Link 
                              to="/auth/register"
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              إنشاء حساب جديد
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <AuthButton
                      type="submit"
                      isLoading={isLoading}
                      disabled={!email || !password || isLoading}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      تسجيل الدخول
                    </AuthButton>
                  </motion.form>
                </TabsContent>
              </Tabs>

              {/* Divider - Compact */}
              <div className="relative my-5 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative flex justify-center text-[11px] sm:text-xs">
                  <span className="bg-slate-900/80 px-3 sm:px-4 text-white/30">أو</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-white/45 text-xs sm:text-sm">
                  ليس لديك حساب؟{' '}
                  <Link 
                    to="/auth/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </AuthCard>

            {/* Footer */}
            <motion.p 
              className="text-center text-[10px] sm:text-xs text-white/25 pb-4 sm:pb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              © {new Date().getFullYear()} ASH Holding. جميع الحقوق محفوظة
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
