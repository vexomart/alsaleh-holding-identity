import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    
    // استمع لتغييرات المصادقة - لكن تجنب الفحص المتكرر
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (checkingAuth) return; // تجنب الفحص المتزامن

      if (event === 'SIGNED_OUT' || !session) {
        console.log('User signed out or no session, redirecting to admin login');
        setLoading(false);
        navigate('/ashadmin', { replace: true });
      } else if (event === 'SIGNED_IN' && session && !isAdmin) {
        console.log('User signed in, checking admin access');
        setCheckingAuth(true);
        await checkAdminAccess();
        setCheckingAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAdmin, checkingAuth]);

  const checkAdminAccess = async () => {
    try {
      if (!loading) setLoading(true);
      setError(null);

      console.log('Checking admin access...');

      // التحقق من الجلسة النشطة
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('خطأ في التحقق من الجلسة');
        navigate('/ashadmin', { replace: true });
        return;
      }

      if (!session?.user) {
        console.log('No active session found, redirecting to admin login');
        navigate('/ashadmin', { replace: true });
        return;
      }

      console.log('Session found, checking admin role for user:', session.user.id);

      // التحقق من صلاحيات الإدارة مع تحسينات الأداء
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminError) {
        console.error('Admin role check error:', adminError);
        setError('خطأ في التحقق من الصلاحيات');
        return;
      }

      if (!adminData) {
        console.log('User does not have admin role, redirecting to main site');
        setError('ليس لديك صلاحيات إدارية');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500); // تقليل الوقت
        return;
      }

      console.log('Admin access confirmed');
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Error checking admin access:', error);
      if (error.message.includes('timeout')) {
        setError('انتهت مهلة التحقق - يرجى المحاولة مرة أخرى');
      } else {
        setError('حدث خطأ في التحقق من الصلاحيات');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetryAuth = () => {
    navigate('/ashadmin', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">التحقق من الصلاحيات</h2>
            <p className="text-slate-600">جاري التحقق من صلاحيات الوصول الإداري...</p>
            <p className="text-sm text-slate-500">هذا قد يستغرق بضع ثوانٍ</p>
          </div>
          
          {/* إضافة زر للمحاولة مرة أخرى في حالة التأخير */}
          <div className="mt-6">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="text-sm"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">وصول غير مصرح</h2>
              <p className="text-slate-600">ليس لديك صلاحيات للوصول إلى لوحة الإدارة</p>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleRetryAuth} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              تسجيل دخول إداري
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              variant="outline" 
              className="w-full"
            >
              العودة للصفحة الرئيسية
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المدير
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;