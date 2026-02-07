/**
 * Cyber Security Login Page - Enterprise Grade
 * Complete redesign with cyber security theme
 */
import * as React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Smartphone, KeyRound, 
  Phone, Send, RefreshCw, CheckCircle2, ArrowRight,
  UserPlus, AlertCircle, ChevronLeft, ArrowLeft, Shield, User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { CyberAuthCard } from '@/components/auth/CyberAuthCard';
import { CyberInput } from '@/components/auth/CyberInput';
import { CyberButton } from '@/components/auth/CyberButton';
import { CyberLogo } from '@/components/auth/CyberLogo';
import { CyberHeroSection } from '@/components/auth/CyberHeroSection';
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

// Cyber Step Indicator
function CyberStepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < step ? 'bg-cyan-500 w-8' : i === step ? 'bg-cyan-400/60 w-5' : 'bg-white/10 w-3'
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
  const { signIn, user, isAdmin } = useAuth();
  const { sendOtp, verifyOtp, isLoading: isSmsLoading, clearError } = useSmsOtp();
  
  // Auth method
  const [authMethod, setAuthMethod] = React.useState<'phone' | 'email'>('phone');
  
  // Phone auth states
  const [phone, setPhone] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [phoneStep, setPhoneStep] = React.useState<'phone' | 'register' | 'otp'>('phone');
  const [countdown, setCountdown] = React.useState(0);
  const [phoneError, setPhoneError] = React.useState('');
  
  // Registration info states (for phone-only registration)
  const [registerName, setRegisterName] = React.useState('');
  const [registerNameError, setRegisterNameError] = React.useState('');
  
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

  // Helper: Check user roles and navigate accordingly - Instant
  const navigateBasedOnRole = React.useCallback(async (userId: string) => {
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      const hasAdminRole = userRoles?.some(r => 
        ['super_admin', 'admin', 'manager', 'support', 'finance', 'content_editor', 'staff'].includes(r.role)
      );
      
      navigate(hasAdminRole ? '/adminash' : '/dashboard');
    } catch {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Redirect if already logged in - Instant
  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/adminash');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, navigate]);

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
        setPhone(normalizedPhone);
        // Show registration form instead of just error
        setPhoneStep('register');
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

    // Use 'register' purpose if user is new, pass name
    const purpose = userNotFound ? 'register' : 'login';
    const customerName = userNotFound ? registerName.trim() : undefined;
    const response = await verifyOtp(phone, otpCode, purpose, customerName);

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
              toast.success(userNotFound ? 'تم إنشاء حسابك بنجاح! مرحباً بك' : 'تم تسجيل الدخول بنجاح! مرحباً بك');
              await navigateBasedOnRole(data.session.user.id);
              return;
            }
          }
        } catch (err) {
          console.error('Error processing magic link:', err);
        }
      }
      
      const { data: refreshData } = await supabase.auth.refreshSession();
      toast.success(userNotFound ? 'تم إنشاء حسابك بنجاح! مرحباً بك' : 'تم تسجيل الدخول بنجاح! مرحباً بك');
      if (refreshData?.session?.user) {
        await navigateBasedOnRole(refreshData.session.user.id);
      } else {
        navigate('/dashboard');
      }
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
    
    const purpose = userNotFound ? 'register' : 'login';
    const response = await sendOtp(phone, purpose);
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

      // Get user session and navigate based on role
      const { data: sessionData } = await supabase.auth.getSession();
      toast.success('تم تسجيل الدخول بنجاح! مرحباً بك');
      if (sessionData?.session?.user) {
        await navigateBasedOnRole(sessionData.session.user.id);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration step - validate name and send OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setRegisterNameError('');

    // Validate name
    if (!registerName.trim()) {
      setRegisterNameError('الاسم مطلوب');
      return;
    }
    if (registerName.trim().length < 2) {
      setRegisterNameError('الاسم يجب أن يكون حرفين على الأقل');
      return;
    }
    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(registerName.trim())) {
      setRegisterNameError('الاسم يجب أن يحتوي على حروف فقط');
      return;
    }

    // Send OTP for registration
    const response = await sendOtp(phone, 'register');

    if (response.success) {
      setPhoneStep('otp');
      setCountdown(response.expires_in || 180);
      toast.success('تم إرسال رمز التحقق إلى جوالك');
    } else {
      toast.error(response.error || 'فشل في إرسال رمز التحقق');
    }
  };

  // Go back to phone entry
  const handleBackToPhone = () => {
    setPhoneStep('phone');
    setOtpCode('');
    setCountdown(0);
    setUserNotFound(false);
    setRegisterName('');
    setRegisterNameError('');
  };

  // Go back to register from OTP
  const handleBackToRegister = () => {
    setPhoneStep('register');
    setOtpCode('');
    setCountdown(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <CyberBackground />
      
      {/* Split Layout - RTL: Hero on Right, Form on Left */}
      <div className="relative z-10 min-h-screen flex">
        {/* Hero Section - Desktop only (appears on right in RTL) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] items-center justify-center">
          <CyberHeroSection variant="login" />
        </div>
        
        {/* Form Section (appears on left in RTL) */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6">
            
            {/* Mobile Header */}
            <motion.div 
              className="lg:hidden space-y-4"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-center">
                <CyberLogo size="sm" showText={false} />
              </div>
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  تسجيل الدخول الآمن
                </h1>
                <p className="text-white/50 mt-1 text-xs sm:text-sm flex items-center justify-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  بوابة محمية بتشفير 256-bit
                </p>
              </div>
            </motion.div>

            {/* Main Card */}
            <CyberAuthCard>
              {/* Card Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 flex items-center justify-center border border-cyan-500/30"
                  animate={{ 
                    boxShadow: ['0 0 20px hsla(190, 100%, 50%, 0.2)', '0 0 30px hsla(190, 100%, 50%, 0.4)', '0 0 20px hsla(190, 100%, 50%, 0.2)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-6 h-6 text-cyan-400" />
                </motion.div>
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  تسجيل الدخول
                </motion.h2>
                <motion.p 
                  className="text-white/45 text-xs sm:text-sm mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  أدخل بياناتك للوصول إلى حسابك
                </motion.p>
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
                <TabsList className="grid w-full grid-cols-2 bg-slate-900/60 border border-cyan-500/20 p-1.5 rounded-xl mb-6 h-12">
                  <TabsTrigger 
                    value="phone" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-white/50 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 me-2" />
                    رقم الجوال
                  </TabsTrigger>
                  <TabsTrigger 
                    value="email"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-white/50 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 me-2" />
                    البريد الإلكتروني
                  </TabsTrigger>
                </TabsList>

                {/* Phone Login */}
                <TabsContent value="phone" className="mt-0 focus-visible:outline-none">
                  <AnimatePresence mode="wait">
                    {phoneStep === 'phone' && (
                      <motion.form
                        key="phone-form"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSendOtp}
                        className="space-y-4"
                      >
                        <CyberInput
                          label="رقم الجوال"
                          icon={<Phone className="w-5 h-5" />}
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

                        <CyberButton
                          type="submit"
                          isLoading={isSmsLoading}
                          disabled={!phone || isSmsLoading}
                          icon={<Send className="w-4 h-4" />}
                        >
                          إرسال رمز التحقق
                        </CyberButton>
                      </motion.form>
                    )}

                    {phoneStep === 'register' && (
                      <motion.form
                        key="register-form"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleRegisterSubmit}
                        className="space-y-5"
                      >
                        <CyberStepIndicator step={1} total={3} />
                        
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={handleBackToPhone}
                          className="flex items-center gap-1.5 text-white/50 hover:text-cyan-400 transition-colors text-sm group"
                        >
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          تغيير الرقم
                        </button>

                        {/* Registration Header */}
                        <div className="text-center space-y-3">
                          <motion.div 
                            className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/10 flex items-center justify-center border border-emerald-500/30"
                            animate={{ 
                              boxShadow: ['0 0 15px hsla(160, 100%, 50%, 0.2)', '0 0 25px hsla(160, 100%, 50%, 0.3)', '0 0 15px hsla(160, 100%, 50%, 0.2)'],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <UserPlus className="w-6 h-6 text-emerald-400" />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-bold text-white">إنشاء حساب جديد</h3>
                            <p className="text-white/40 text-sm mt-1">أدخل بياناتك لإنشاء حسابك</p>
                          </div>
                        </div>

                        {/* Info message */}
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
                        >
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-cyan-200 font-medium">
                                رقم الجوال: <span dir="ltr" className="font-mono">{phone}</span>
                              </p>
                              <p className="text-xs text-white/40 mt-1">
                                هذا الرقم غير مسجّل. أكمل بياناتك لإنشاء حساب جديد.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Name Input */}
                        <CyberInput
                          label="الاسم الكامل"
                          icon={<User className="w-5 h-5" />}
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          value={registerName}
                          onChange={(e) => { setRegisterName(e.target.value); setRegisterNameError(''); }}
                          error={registerNameError}
                          disabled={isSmsLoading}
                          autoFocus
                        />

                        <CyberButton
                          type="submit"
                          isLoading={isSmsLoading}
                          disabled={!registerName.trim() || isSmsLoading}
                          variant="success"
                          icon={<ArrowRight className="w-4 h-4" />}
                        >
                          متابعة وإرسال رمز التحقق
                        </CyberButton>

                        {/* Alternative: Full registration link */}
                        <div className="text-center pt-2">
                          <p className="text-xs text-white/40">
                            تريد التسجيل بالبريد الإلكتروني؟{' '}
                            <Link 
                              to="/auth/register"
                              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                              تسجيل كامل
                            </Link>
                          </p>
                        </div>
                      </motion.form>
                    )}

                    {phoneStep === 'otp' && (
                      <motion.form
                        key="otp-form"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleVerifyOtp}
                        className="space-y-5"
                      >
                        <CyberStepIndicator step={userNotFound ? 2 : 1} total={userNotFound ? 3 : 2} />
                        
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={userNotFound ? handleBackToRegister : handleBackToPhone}
                          className="flex items-center gap-1.5 text-white/50 hover:text-cyan-400 transition-colors text-sm group"
                        >
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          {userNotFound ? 'تعديل البيانات' : 'تغيير الرقم'}
                        </button>

                        {/* OTP Header */}
                        <div className="text-center space-y-3">
                          <motion.div 
                            className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/10 flex items-center justify-center border border-cyan-500/30"
                            animate={{ 
                              boxShadow: ['0 0 15px hsla(190, 100%, 50%, 0.2)', '0 0 25px hsla(190, 100%, 50%, 0.3)', '0 0 15px hsla(190, 100%, 50%, 0.2)'],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <KeyRound className="w-6 h-6 text-cyan-400" />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-bold text-white">أدخل رمز التحقق</h3>
                            <p className="text-white/40 text-sm mt-1 font-mono" dir="ltr">{phone}</p>
                          </div>
                        </div>

                        {/* Show name if registering */}
                        {userNotFound && registerName && (
                          <div className="text-center">
                            <p className="text-sm text-emerald-400">
                              مرحباً {registerName} 👋
                            </p>
                          </div>
                        )}

                        {/* OTP Input */}
                        <div className="flex justify-center py-3" dir="ltr">
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
                                  className="w-10 h-12 sm:w-11 sm:h-13 rounded-xl bg-slate-900/60 border-cyan-500/30 text-white text-lg font-bold
                                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:bg-slate-900/80
                                    transition-all duration-200"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {/* Countdown */}
                        <div className="text-center">
                          {countdown > 0 ? (
                            <p className="text-sm text-white/40">
                              إعادة الإرسال بعد{' '}
                              <span className="text-cyan-400 font-mono font-bold">
                                {formatCountdown(countdown)}
                              </span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isSmsLoading}
                              className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 mx-auto transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                              إعادة إرسال الرمز
                            </button>
                          )}
                        </div>

                        <CyberButton
                          type="submit"
                          isLoading={isSmsLoading}
                          disabled={otpCode.length !== 6 || isSmsLoading}
                          variant={otpCode.length === 6 ? 'success' : 'primary'}
                          icon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          {userNotFound ? 'إنشاء الحساب' : 'تأكيد الدخول'}
                        </CyberButton>
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
                    <CyberInput
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

                    <CyberInput
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
                          className="p-2 text-white/40 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                          className="border-cyan-500/30 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        />
                        <Label htmlFor="remember" className="text-sm text-white/50 cursor-pointer">
                          تذكرني
                        </Label>
                      </div>
                      <Link 
                        to="/auth/forgot-password"
                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </div>

                    {/* User not found message */}
                    {userNotFound && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm text-amber-200 font-medium">
                              لا يوجد حساب مرتبط بهذا البريد
                            </p>
                            <Link 
                              to="/auth/register"
                              className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                              إنشاء حساب جديد
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <CyberButton
                      type="submit"
                      isLoading={isLoading}
                      disabled={!email || !password || isLoading}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      تسجيل الدخول
                    </CyberButton>
                  </motion.form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-500/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-950/80 px-4 text-white/30">أو</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-white/45 text-sm">
                  ليس لديك حساب؟{' '}
                  <Link 
                    to="/auth/register"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </CyberAuthCard>

            {/* Footer */}
            <motion.p 
              className="text-center text-[10px] sm:text-xs text-white/25 pb-4 sm:pb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              © {new Date().getFullYear()} ASH Holding. جميع الحقوق محفوظة • محمي بتقنية التشفير المتقدمة
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
