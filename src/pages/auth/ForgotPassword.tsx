import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred');
        return;
      }

      setIsSuccess(true);
      toast.success(isRTL ? 'تم إرسال رابط الإعادة' : 'Reset link sent');
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
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
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">ASH</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {t('auth.reset_password')}
              </CardTitle>
              <CardDescription className="mt-2">
                {isRTL 
                  ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين' 
                  : 'Enter your email and we\'ll send you a reset link'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? 'تم إرسال الرابط!' : 'Link Sent!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isRTL 
                    ? `تم إرسال رابط إعادة التعيين إلى ${email}` 
                    : `Reset link sent to ${email}`}
                </p>
                <Link to="/auth/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ms-2 rotate-180' : 'me-2'}`} />
                    {t('auth.back_to_login')}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t('auth.send_reset_link')
                  )}
                </Button>

                <Link to="/auth/login" className="block">
                  <Button variant="ghost" className="w-full" type="button">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ms-2 rotate-180' : 'me-2'}`} />
                    {t('auth.back_to_login')}
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
