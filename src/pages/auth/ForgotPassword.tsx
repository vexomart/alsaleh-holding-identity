/**
 * Forgot Password Page - Enterprise Design
 * Password Recovery Flow
 */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { 
  AuthBackground, AuthLogo, AuthCard, AuthInput, 
  AuthButton, FeatureBadges 
} from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255),
});

function ForgotPassword() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email.trim());
      
      if (error) {
        toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
        return;
      }

      setIsSuccess(true);
      toast.success('تم إرسال رابط استعادة كلمة المرور');
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">استعادة كلمة المرور</h1>
            <p className="text-white/50 mt-1 text-sm">سنرسل لك رابط لإعادة تعيين كلمة المرور</p>
          </motion.div>
        </motion.div>

        <FeatureBadges variant="login" />

        <AuthCard>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6 space-y-6"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto rounded-full bg-green-500/15 flex items-center justify-center border border-green-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">تم الإرسال بنجاح!</h3>
                  <p className="text-white/50 text-sm">
                    تم إرسال رابط استعادة كلمة المرور إلى
                  </p>
                  <p className="text-primary font-mono text-sm" dir="ltr">{email}</p>
                  <p className="text-white/40 text-xs mt-4">
                    يرجى التحقق من بريدك الإلكتروني واتباع التعليمات
                  </p>
                </div>
                
                <Link to="/auth/login">
                  <AuthButton variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                    العودة لتسجيل الدخول
                  </AuthButton>
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <KeyRound className="w-7 h-7 text-primary" />
                  </motion.div>
                </div>

                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold text-white">نسيت كلمة المرور؟</h2>
                  <p className="text-white/45 text-sm mt-1">أدخل بريدك الإلكتروني لاستعادتها</p>
                </div>

                <AuthInput
                  label="البريد الإلكتروني"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  error={emailError}
                  hint="سنرسل رابط استعادة كلمة المرور إلى هذا البريد"
                  dir="ltr"
                  maxLength={255}
                  autoComplete="email"
                  disabled={isLoading}
                />

                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  disabled={!email || isLoading}
                  icon={<Mail className="w-4 h-4" />}
                >
                  إرسال رابط الاستعادة
                </AuthButton>

                <Link to="/auth/login" className="block">
                  <AuthButton variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                    العودة لتسجيل الدخول
                  </AuthButton>
                </Link>
              </motion.form>
            )}
          </AnimatePresence>
        </AuthCard>

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

export default ForgotPassword;
