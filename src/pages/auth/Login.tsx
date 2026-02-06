/**
 * Enterprise Login Page - Global Software Company Standard
 * Premium Authentication Experience with Full Client Status Logic
 */
import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, Globe, Smartphone, 
  KeyRound, Phone, Send, RefreshCw, CheckCircle2, ArrowRight,
  UserPlus, AlertCircle, ChevronLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  AuthBackground, AuthLogo, AuthCard, AuthInput, 
  AuthButton, AuthDivider, FeatureBadges 
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
      // Normalize Saudi phone numbers
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
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step ? 'bg-primary w-6' : i === step ? 'bg-primary/60 w-4' : 'bg-white/10 w-2'
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

  // Format countdown
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
      // Check if user doesn't exist
      if (response.error?.includes('غير مسجل') || response.error?.includes('not found')) {
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
      // Handle magic link if provided
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
          // Check if email exists
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8" dir="rtl">
      <AuthBackground />
      
      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthLogo size="md" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              ASH HOLDING
            </h1>
            <p className="text-white/50 mt-1 text-sm sm:text-base">
              منصة إدارة الأعمال المتكاملة
            </p>
          </motion.div>
        </motion.div>

        {/* Feature Badges */}
        <FeatureBadges variant="login" />

        {/* Main Card */}
        <AuthCard>
          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">تسجيل الدخول</h2>
            <p className="text-white/45 text-sm mt-1">أدخل بياناتك للوصول إلى حسابك</p>
          </div>

          {/* Auth Method Tabs */}
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
            <TabsList className="grid w-full grid-cols-2 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl mb-6 h-12">
              <TabsTrigger 
                value="phone" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md text-white/50 rounded-lg font-semibold transition-all duration-200 h-10"
              >
                <Phone className="w-4 h-4 me-2" />
                رقم الجوال
              </TabsTrigger>
              <TabsTrigger 
                value="email"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md text-white/50 rounded-lg font-semibold transition-all duration-200 h-10"
              >
                <Mail className="w-4 h-4 me-2" />
                البريد الإلكتروني
              </TabsTrigger>
            </TabsList>

            {/* Phone Login */}
            <TabsContent value="phone" className="mt-0 focus-visible:outline-none">
              <AnimatePresence mode="wait">
                {phoneStep === 'phone' ? (
                  <motion.form
                    key="phone-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSendOtp}
                    className="space-y-5"
                  >
                    <AuthInput
                      label="رقم الجوال"
                      icon={<Smartphone className="w-4 h-4" />}
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm text-amber-200 font-medium">
                              لا يوجد حساب مرتبط بهذا الرقم
                            </p>
                            <p className="text-xs text-white/50">
                              يمكنك إنشاء حساب جديد للبدء في استخدام المنصة
                            </p>
                            <Link 
                              to="/auth/register"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >
                    <StepIndicator step={1} total={2} />
                    
                    {/* Back button */}
                    <button
                      type="button"
                      onClick={handleBackToPhone}
                      className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm group mb-2"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      تغيير الرقم
                    </button>

                    {/* OTP Header */}
                    <div className="text-center space-y-3 py-2">
                      <motion.div 
                        className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20"
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <KeyRound className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-white">أدخل رمز التحقق</h3>
                        <p className="text-white/40 text-sm mt-1 font-mono" dir="ltr">{phone}</p>
                      </div>
                    </div>

                    {/* OTP Input */}
                    <div className="flex justify-center py-3" dir="ltr">
                      <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={setOtpCode}
                      >
                        <InputOTPGroup className="gap-2 sm:gap-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot 
                              key={index} 
                              index={index}
                              className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl bg-white/[0.04] border-white/10 text-white rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 font-bold"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Countdown & Resend */}
                    <div className="text-center py-2">
                      {countdown > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة الإرسال بعد</span>
                          <span className="text-primary font-mono font-bold">{formatCountdown(countdown)}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSmsLoading}
                          className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors flex items-center gap-1.5 mx-auto"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          إعادة إرسال الرمز
                        </button>
                      )}
                    </div>

                    <AuthButton
                      type="submit"
                      isLoading={isSmsLoading}
                      disabled={otpCode.length !== 6 || isSmsLoading}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      تأكيد وتسجيل الدخول
                    </AuthButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Email Login */}
            <TabsContent value="email" className="mt-0 focus-visible:outline-none">
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleEmailLogin}
                className="space-y-5"
              >
                <AuthInput
                  label="البريد الإلكتروني"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setUserNotFound(false);
                  }}
                  error={emailError}
                  dir="ltr"
                  maxLength={255}
                  autoComplete="email"
                  disabled={isLoading}
                />

                <AuthInput
                  label="كلمة المرور"
                  icon={<Lock className="w-4 h-4" />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  error={passwordError}
                  maxLength={100}
                  autoComplete="current-password"
                  disabled={isLoading}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/30 hover:text-white/60 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* User not found message */}
                {userNotFound && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="text-sm text-amber-200 font-medium">
                          لا يوجد حساب مرتبط بهذا البريد
                        </p>
                        <Link 
                          to="/auth/register"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          إنشاء حساب جديد
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-4 h-4 rounded"
                    />
                    <Label htmlFor="remember" className="text-white/50 cursor-pointer text-sm">
                      تذكرني
                    </Label>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

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

          {/* Divider */}
          <AuthDivider />

          {/* Register Link */}
          <div className="text-center space-y-3">
            <p className="text-white/40 text-sm">ليس لديك حساب؟</p>
            <Link to="/auth/register">
              <AuthButton variant="secondary" icon={<UserPlus className="w-4 h-4" />}>
                إنشاء حساب جديد
              </AuthButton>
            </Link>
          </div>
        </AuthCard>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/25 text-xs"
        >
          © {new Date().getFullYear()} ASH Holding. جميع الحقوق محفوظة
        </motion.p>
      </div>
    </div>
  );
}

export default Login;
