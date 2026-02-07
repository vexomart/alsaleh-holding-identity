/**
 * Cyber Security Registration Page - Enterprise Grade
 * Complete redesign with cyber security theme
 */
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, Phone, 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle,
  KeyRound, RefreshCw, Smartphone, ShieldCheck, Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Progress } from '@/components/ui/progress';
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
const step1Schema = z.object({
  name: z.string()
    .trim()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على حروف فقط'),
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

const step2Schema = z.object({
  email: z.string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .max(100)
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

// Cyber Step Progress Component
function CyberStepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                i < currentStep 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                  : i === currentStep 
                    ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500' 
                    : 'bg-slate-900/60 text-white/30 border border-white/10'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </motion.div>
            {i < totalSteps - 1 && (
              <div 
                className={`h-[2px] mx-2 sm:mx-3 w-10 sm:w-14 transition-colors duration-300 ${
                  i < currentStep ? 'bg-cyan-500' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="relative h-1.5 rounded-full bg-slate-900/60 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 start-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-y-0 start-0 bg-gradient-to-r from-cyan-400/50 to-blue-500/50 rounded-full blur-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Password Strength Indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 أحرف على الأقل', valid: password.length >= 8 },
    { label: 'حرف كبير', valid: /[A-Z]/.test(password) },
    { label: 'رقم', valid: /[0-9]/.test(password) },
  ];
  
  const strength = checks.filter(c => c.valid).length;
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const strengthGlows = ['shadow-red-500/30', 'shadow-amber-500/30', 'shadow-emerald-500/30'];
  
  if (!password) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 pt-1"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? `${strengthColors[strength - 1]} shadow-lg ${strengthGlows[strength - 1]}` : 'bg-slate-800'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((check, i) => (
          <motion.span 
            key={i} 
            className={`text-xs flex items-center gap-1.5 transition-colors duration-200 ${
              check.valid ? 'text-emerald-400' : 'text-white/30'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${check.valid ? 'text-emerald-400' : 'text-white/20'}`} />
            {check.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendOtp, verifyOtp, isLoading: isSmsLoading } = useSmsOtp();
  
  // Step management
  const [currentStep, setCurrentStep] = React.useState(0);
  const totalSteps = 3;
  
  // Step 1: Basic Info
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  
  // Step 2: Account Details
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  
  // Step 3: Verification
  const [otpCode, setOtpCode] = React.useState('');
  const [countdown, setCountdown] = React.useState(0);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = React.useState(false);
  const [duplicateError, setDuplicateError] = React.useState<'phone' | 'email' | null>(null);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/portal');
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

  // Clear errors
  const clearErrors = () => {
    setNameError('');
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setDuplicateError(null);
  };

  // Step 1: Validate basic info
  const handleStep1 = async () => {
    clearErrors();
    
    const result = step1Schema.safeParse({ name, phone });
    if (!result.success) {
      result.error.errors.forEach(err => {
        if (err.path[0] === 'name') setNameError(err.message);
        if (err.path[0] === 'phone') setPhoneError(err.message);
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', result.data.phone)
        .maybeSingle();

      if (existingPhone) {
        setDuplicateError('phone');
        setPhoneError('هذا الرقم مسجّل مسبقاً');
        setIsLoading(false);
        return;
      }

      setPhone(result.data.phone);
      setCurrentStep(1);
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate account details and send OTP
  const handleStep2 = async () => {
    clearErrors();
    
    const result = step2Schema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      result.error.errors.forEach(err => {
        if (err.path[0] === 'email') setEmailError(err.message);
        if (err.path[0] === 'password') setPasswordError(err.message);
        if (err.path[0] === 'confirmPassword') setConfirmPasswordError(err.message);
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (existingEmail) {
        setDuplicateError('email');
        setEmailError('هذا البريد مسجّل مسبقاً');
        setIsLoading(false);
        return;
      }

      const response = await sendOtp(phone, 'register');
      if (response.success) {
        setCountdown(response.expires_in || 180);
        setCurrentStep(2);
        toast.success('تم إرسال رمز التحقق إلى جوالك');
      } else {
        toast.error(response.error || 'فشل في إرسال رمز التحقق');
      }
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP and create account
  const handleStep3 = async () => {
    if (otpCode.length !== 6) {
      toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await verifyOtp(phone, otpCode, 'register');
      
      if (!verifyResponse.success) {
        toast.error(verifyResponse.error || 'رمز التحقق غير صحيح');
        if (verifyResponse.remaining_attempts !== undefined && verifyResponse.remaining_attempts > 0) {
          toast.info(`المحاولات المتبقية: ${verifyResponse.remaining_attempts}`);
        }
        setIsLoading(false);
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name.trim(),
            phone: phone,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setDuplicateError('email');
          setCurrentStep(1);
          setEmailError('هذا البريد مسجّل مسبقاً');
        } else {
          toast.error('فشل في إنشاء الحساب: ' + signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      toast.success('تم إنشاء حسابك بنجاح! مرحباً بك في ASH Holding');
      
      if (signUpData.user && !signUpData.session) {
        toast.info('يرجى تأكيد بريدك الإلكتروني للبدء');
        navigate('/auth/login');
      } else {
        navigate('/portal');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    const response = await sendOtp(phone, 'register');
    if (response.success) {
      setCountdown(response.expires_in || 180);
      setOtpCode('');
      toast.success('تم إرسال رمز جديد');
    } else {
      toast.error(response.error || 'فشل في إعادة إرسال الرمز');
    }
  };

  // Go back
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setOtpCode('');
    }
  };

  // Step titles
  const stepTitles = [
    { title: 'البيانات الأساسية', subtitle: 'أدخل اسمك ورقم جوالك', icon: User },
    { title: 'بيانات الحساب', subtitle: 'أنشئ بريدك وكلمة المرور', icon: Lock },
    { title: 'تأكيد الحساب', subtitle: 'أدخل رمز التحقق المرسل', icon: ShieldCheck },
  ];

  const CurrentIcon = stepTitles[currentStep].icon;

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="rtl">
      <CyberBackground />
      
      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row w-full relative z-10">
        
        {/* Hero Section - Desktop only */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%]">
          <CyberHeroSection variant="register" />
        </div>
        
        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-[420px] space-y-5 sm:space-y-6">
            
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
                  إنشاء حساب جديد
                </h1>
                <p className="text-white/50 mt-1 text-xs sm:text-sm flex items-center justify-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  انضم إلى منظومتنا الآمنة
                </p>
              </div>
            </motion.div>

            <CyberAuthCard>
              {/* Progress */}
              <div className="mb-6">
                <CyberStepProgress currentStep={currentStep} totalSteps={totalSteps} />
              </div>

              {/* Step Header */}
              <div className="text-center mb-6">
                <motion.div
                  key={currentStep}
                  className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/10 flex items-center justify-center border border-cyan-500/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentIcon className="w-6 h-6 text-cyan-400" />
                </motion.div>
                <motion.h2 
                  key={`title-${currentStep}`}
                  className="text-lg sm:text-xl font-bold text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {stepTitles[currentStep].title}
                </motion.h2>
                <motion.p 
                  className="text-white/45 text-xs sm:text-sm mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {stepTitles[currentStep].subtitle}
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <CyberInput
                      label="الاسم الكامل"
                      icon={<User className="w-5 h-5" />}
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError(''); }}
                      error={nameError}
                      maxLength={100}
                      autoComplete="name"
                      disabled={isLoading}
                    />

                    <CyberInput
                      label="رقم الجوال"
                      icon={<Smartphone className="w-5 h-5" />}
                      type="tel"
                      placeholder="05XXXXXXXX"
                      value={phone}
                      onChange={(e) => { 
                        setPhone(e.target.value.replace(/[^0-9+]/g, '')); 
                        setPhoneError(''); 
                        setDuplicateError(null);
                      }}
                      error={phoneError}
                      dir="ltr"
                      maxLength={14}
                      autoComplete="tel"
                      disabled={isLoading}
                    />

                    {/* Duplicate phone warning */}
                    {duplicateError === 'phone' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm text-amber-200 font-medium">
                              هذا الرقم مسجّل مسبقاً
                            </p>
                            <Link 
                              to="/auth/login"
                              className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              تسجيل الدخول بدلاً من ذلك
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <CyberButton
                      onClick={handleStep1}
                      isLoading={isLoading}
                      disabled={!name || !phone || isLoading}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      متابعة
                    </CyberButton>
                  </motion.div>
                )}

                {/* Step 2: Account Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    {/* Back button */}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-white/50 hover:text-cyan-400 transition-colors text-sm group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      رجوع
                    </button>

                    <CyberInput
                      label="البريد الإلكتروني"
                      icon={<Mail className="w-5 h-5" />}
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); setDuplicateError(null); }}
                      error={emailError}
                      dir="ltr"
                      autoComplete="email"
                      disabled={isLoading}
                    />

                    <div className="space-y-2">
                      <CyberInput
                        label="كلمة المرور"
                        icon={<Lock className="w-5 h-5" />}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="أنشئ كلمة مرور قوية"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                        error={passwordError}
                        dir="ltr"
                        autoComplete="new-password"
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
                      <PasswordStrength password={password} />
                    </div>

                    <CyberInput
                      label="تأكيد كلمة المرور"
                      icon={<Lock className="w-5 h-5" />}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                      error={confirmPasswordError}
                      success={confirmPassword.length > 0 && password === confirmPassword}
                      dir="ltr"
                      autoComplete="new-password"
                      disabled={isLoading}
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="p-2 text-white/40 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    {/* Duplicate email warning */}
                    {duplicateError === 'email' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm text-amber-200 font-medium">
                              هذا البريد مسجّل مسبقاً
                            </p>
                            <Link 
                              to="/auth/login"
                              className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              تسجيل الدخول بدلاً من ذلك
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <CyberButton
                      onClick={handleStep2}
                      isLoading={isLoading || isSmsLoading}
                      disabled={!email || !password || !confirmPassword || isLoading || isSmsLoading}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      إرسال رمز التحقق
                    </CyberButton>
                  </motion.div>
                )}

                {/* Step 3: OTP Verification */}
                {currentStep === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-5"
                  >
                    {/* Back button */}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-white/50 hover:text-cyan-400 transition-colors text-sm group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      رجوع
                    </button>

                    {/* OTP Info */}
                    <div className="text-center space-y-2">
                      <p className="text-white/60 text-sm">
                        تم إرسال رمز التحقق إلى
                      </p>
                      <p className="text-cyan-400 font-mono font-bold text-lg" dir="ltr">
                        {phone}
                      </p>
                    </div>

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
                      onClick={handleStep3}
                      isLoading={isLoading}
                      disabled={otpCode.length !== 6 || isLoading}
                      variant={otpCode.length === 6 ? 'success' : 'primary'}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      إنشاء الحساب
                    </CyberButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Link */}
              <div className="mt-6 pt-6 border-t border-cyan-500/10 text-center">
                <p className="text-white/45 text-sm">
                  لديك حساب بالفعل؟{' '}
                  <Link 
                    to="/auth/login"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    تسجيل الدخول
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

export default Register;
