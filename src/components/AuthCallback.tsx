import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const redirectTo = searchParams.get('redirect_to');

        if (!tokenHash || !type) {
          throw new Error('Missing required parameters');
        }

        console.log('🔄 Processing auth callback:', { type, tokenHash: tokenHash.substring(0, 10) + '...' });

        // Verify the user's email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          console.error('❌ Auth callback error:', error);
          throw error;
        }

        console.log('✅ Email verified successfully:', data);

        toast({
          title: "تم تأكيد البريد الإلكتروني",
          description: "تم تأكيد حسابك بنجاح! يمكنك الآن تسجيل الدخول.",
          duration: 5000,
        });

        // Redirect to the specified URL or default to home
        const finalRedirect = redirectTo || '/';
        navigate(finalRedirect, { replace: true });

      } catch (error: any) {
        console.error('❌ Auth callback failed:', error);
        
        toast({
          title: "خطأ في تأكيد البريد الإلكتروني",
          description: error.message || "حدث خطأ أثناء تأكيد البريد الإلكتروني",
          variant: "destructive",
          duration: 6000,
        });

        // Redirect to auth page with error
        navigate('/auth?error=confirmation_failed', { replace: true });
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          جاري تأكيد البريد الإلكتروني...
        </h2>
        <p className="text-muted-foreground">
          يرجى الانتظار بينما نقوم بتأكيد حسابك
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;