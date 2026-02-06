/**
 * Enterprise Registration Page - Step-by-Step Flow
 * Premium Account Creation Experience
 */
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, Phone, Building2, 
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle,
  KeyRound, RefreshCw, Smartphone, ShieldCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Progress } from '@/components/ui/progress';
import { 
  AuthBackground, AuthLogo, AuthCard, AuthInput, 
  AuthButton, AuthDivider, FeatureBadges 
} from '@/components/auth';
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

// Step indicator component
function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : i === currentStep 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-white/[0.04] text-white/30 border border-white/10'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className={`w-full h-0.5 mx-2 ${i < currentStep ? 'bg-primary' : 'bg-white/10'}`} 
                   style={{ width: '40px' }} />
            )}
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-1 bg-white/[0.04]" />
    </div>
  );
}

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 أحرف على الأقل', valid: password.length >= 8 },
    { label: 'حرف كبير', valid: /[A-Z]/.test(password) },
    { label: 'رقم', valid: /[0-9]/.test(password) },
  ];
  
  const strength = checks.filter(c => c.valid).length;
  const strengthColors = ['bg-destructive', 'bg-warning', 'bg-success'];
  const strengthLabels = ['ضعيفة', 'متوسطة', 'قوية'];
  
  if (!password) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-2 pt-1"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? strengthColors[strength - 1] : 'bg-white/10'
            }`} 
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((check, i) => (
          <span 
            key={i} 
            className={`text-xs flex items-center gap-1 ${check.valid ? 'text-success' : 'text-white/30'}`}
          >
            <CheckCircle2 className={`w-3 h-3 ${check.valid ? 'text-success' : 'text-white/20'}`} />
            {check.label}
          </span>
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
      // Check if phone already exists
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
      // Check if email already exists
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

      // Send OTP for verification
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
      // Verify OTP
      const verifyResponse = await verifyOtp(phone, otpCode, 'register');
      
      if (!verifyResponse.success) {
        toast.error(verifyResponse.error || 'رمز التحقق غير صحيح');
        if (verifyResponse.remaining_attempts !== undefined && verifyResponse.remaining_attempts > 0) {
          toast.info(`المحاولات المتبقية: ${verifyResponse.remaining_attempts}`);
        }
        setIsLoading(false);
        return;
      }

      // Create account using Supabase Auth
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
      
      // If email confirmation is required
      if (signUpData.user && !signUpData.session) {
        toast.info('يرجى تأكيد بريدك الإلكتروني للبدء');
        navigate('/auth/login');
      } else {
        navigate('/app');
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
    { title: 'البيانات الأساسية', subtitle: 'أدخل اسمك ورقم جوالك' },
    { title: 'بيانات الحساب', subtitle: 'أنشئ بريدك وكلمة المرور' },
    { title: 'تأكيد الحساب', subtitle: 'أدخل رمز التحقق المرسل' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8" dir="rtl">
      <AuthBackground />
      
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AuthLogo size="sm" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">إنشاء حساب جديد</h1>
            <p className="text-white/50 mt-1 text-sm">انضم إلى منصة ASH Holding</p>
          </motion.div>
        </motion.div>

        <FeatureBadges variant="register" />

        <AuthCard>
          {/* Progress */}
          <div className="mb-6">
            <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Step Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">{stepTitles[currentStep].title}</h2>
            <p className="text-white/45 text-sm mt-1">{stepTitles[currentStep].subtitle}</p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <AuthInput
                  label="الاسم الكامل"
                  icon={<User className="w-4 h-4" />}
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  error={nameError}
                  maxLength={100}
                  autoComplete="name"
                  disabled={isLoading}
                />

                <AuthInput
                  label="رقم الجوال"
                  icon={<Smartphone className="w-4 h-4" />}
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="text-sm text-amber-200 font-medium">هذا الرقم مسجّل مسبقاً</p>
                        <Link 
                          to="/auth/login"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          تسجيل الدخول بدلاً من ذلك
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                <AuthButton
                  onClick={handleStep1}
                  isLoading={isLoading}
                  disabled={!name || !phone || isLoading}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  التالي
                </AuthButton>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  رجوع
                </button>

                <AuthInput
                  label="البريد الإلكتروني"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); setDuplicateError(null); }}
                  error={emailError}
                  dir="ltr"
                  maxLength={255}
                  autoComplete="email"
                  disabled={isLoading}
                />

                {/* Duplicate email warning */}
                {duplicateError === 'email' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="text-sm text-amber-200 font-medium">هذا البريد مسجّل مسبقاً</p>
                        <Link 
                          to="/auth/login"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          تسجيل الدخول بدلاً من ذلك
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <AuthInput
                    label="كلمة المرور"
                    icon={<Lock className="w-4 h-4" />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أنشئ كلمة مرور قوية"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    error={passwordError}
                    maxLength={100}
                    autoComplete="new-password"
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
                  <PasswordStrength password={password} />
                </div>

                <AuthInput
                  label="تأكيد كلمة المرور"
                  icon={<ShieldCheck className="w-4 h-4" />}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                  error={confirmPasswordError}
                  maxLength={100}
                  autoComplete="new-password"
                  disabled={isLoading}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-white/30 hover:text-white/60 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <AuthButton
                  onClick={handleStep2}
                  isLoading={isLoading || isSmsLoading}
                  disabled={!email || !password || !confirmPassword || isLoading || isSmsLoading}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  التالي
                </AuthButton>
              </motion.div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  رجوع
                </button>

                <div className="text-center space-y-3 py-2">
                  <motion.div 
                    className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <KeyRound className="w-7 h-7 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-base font-bold text-white">أدخل رمز التحقق</h3>
                    <p className="text-white/40 text-sm mt-1">تم إرساله إلى <span className="font-mono" dir="ltr">{phone}</span></p>
                  </div>
                </div>

                <div className="flex justify-center py-3" dir="ltr">
                  <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
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
                  onClick={handleStep3}
                  isLoading={isLoading || isSmsLoading}
                  disabled={otpCode.length !== 6 || isLoading || isSmsLoading}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  إنشاء الحساب
                </AuthButton>
              </motion.div>
            )}
          </AnimatePresence>

          <AuthDivider />

          <div className="text-center">
            <p className="text-white/40 text-sm mb-3">لديك حساب بالفعل؟</p>
            <Link to="/auth/login">
              <AuthButton variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
                تسجيل الدخول
              </AuthButton>
            </Link>
          </div>
        </AuthCard>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/25 text-xs"
        >
          بإنشاء حساب، أنت توافق على{' '}
          <Link to="/terms" className="text-primary/60 hover:text-primary transition-colors">شروط الاستخدام</Link>
          {' '}و{' '}
          <Link to="/privacy" className="text-primary/60 hover:text-primary transition-colors">سياسة الخصوصية</Link>
        </motion.p>
      </div>
    </div>
  );
}

export default Register;
