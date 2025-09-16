import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري تأكيد بريدك الإلكتروني...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // التحقق من وجود رمز التفعيل في URL
        const code = searchParams.get('code');
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (code) {
          // الطريقة الجديدة: exchangeCodeForSession
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code:', error);
            setStatus('error');
            setMessage('تعذر تأكيد البريد الإلكتروني. الرابط منتهي الصلاحية أو غير صحيح.');
            return;
          }

          if (data.user && data.session) {
            setStatus('success');
            setMessage('تم تأكيد بريدك الإلكتروني بنجاح! جاري توجيهك إلى لوحة التحكم...');
            
            // انتظار قصير ثم التوجه إلى dashboard
            setTimeout(() => {
              navigate('/client/dashboard', { replace: true });
            }, 2000);
          }
        } else if (token_hash && type === 'email') {
          // الطريقة القديمة: للتوافق مع الروابط القديمة
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          });

          if (error) {
            console.error('Error verifying OTP:', error);
            setStatus('error');
            setMessage('تعذر تأكيد البريد الإلكتروني. الرابط منتهي الصلاحية أو غير صحيح.');
            return;
          }

          if (data.user && data.session) {
            setStatus('success');
            setMessage('تم تأكيد بريدك الإلكتروني بنجاح! جاري توجيهك إلى لوحة التحكم...');
            
            setTimeout(() => {
              navigate('/client/dashboard', { replace: true });
            }, 2000);
          }
        } else {
          // التحقق من hash في URL للطرق القديمة
          if (typeof window !== 'undefined' && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            
            if (access_token && refresh_token) {
              const { data, error } = await supabase.auth.setSession({
                access_token,
                refresh_token
              });

              if (error) {
                console.error('Error setting session:', error);
                setStatus('error');
                setMessage('تعذر تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
                return;
              }

              if (data.user && data.session) {
                setStatus('success');
                setMessage('تم تأكيد بريدك الإلكتروني بنجاح! جاري توجيهك إلى لوحة التحكم...');
                
                setTimeout(() => {
                  navigate('/client/dashboard', { replace: true });
                }, 2000);
              }
            } else {
              setStatus('error');
              setMessage('رابط التأكيد غير صحيح أو منتهي الصلاحية.');
            }
          } else {
            setStatus('error');
            setMessage('رابط التأكيد غير صحيح أو منتهي الصلاحية.');
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل معنا.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleRetryLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">تأكيد البريد الإلكتروني</h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">تم التأكيد بنجاح!</h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">خطأ في التأكيد</h1>
              <p className="text-muted-foreground">{message}</p>
              
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleRetryLogin}
                  className="w-full"
                >
                  العودة إلى تسجيل الدخول
                </Button>
                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  العودة إلى الصفحة الرئيسية
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}