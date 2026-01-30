import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const signupSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
});

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const result = signupSchema.safeParse({ email, password, fullName });
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      setIsLoading(true);
      try {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          toast.error(isRTL ? 'حدث خطأ في التسجيل' : 'Registration failed');
          return;
        }

        toast.success(isRTL ? 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني' : 'Account created! Check your email');
        setIsSignUp(false);
      } catch (error) {
        toast.error(isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    } else {
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
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      {/* Language Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="absolute top-4 end-4 text-white/70 hover:text-white"
      >
        <Globe className="w-4 h-4 me-2" />
        {language === 'ar' ? 'English' : 'عربي'}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">ASH</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {isSignUp 
                  ? (isRTL ? 'إنشاء حساب' : 'Create Account')
                  : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
              </CardTitle>
              <CardDescription className="mt-2">
                {isSignUp
                  ? (isRTL ? 'أنشئ حسابك للبدء' : 'Create your account to get started')
                  : (isRTL ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name - Only for signup */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="ps-10"
                      required={isSignUp}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ps-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
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
                    className="ps-10 pe-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password - Only for login */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      {t('auth.remember_me')}
                    </Label>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgot_password')}
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp 
                      ? (isRTL ? 'إنشاء حساب' : 'Create Account')
                      : t('auth.login')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'me-2 rotate-180' : 'ms-2'}`} />
                  </>
                )}
              </Button>

              {/* Toggle Sign Up / Sign In */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp
                    ? (isRTL ? 'لديك حساب؟ سجل دخولك' : 'Already have an account? Sign in')
                    : (isRTL ? 'ليس لديك حساب؟ أنشئ حساباً' : "Don't have an account? Sign up")}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'شركة علي صالح الشهري القابضة' : 'ASH Holding Company'}
              </p>
              <Link 
                to="/" 
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                {isRTL ? 'العودة للموقع' : 'Back to Website'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
