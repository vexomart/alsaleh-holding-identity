import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedAdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'admin' | 'editor' | 'viewer';
}

interface UserRole {
  role: string;
  user_id: string;
}

const EnhancedAdminProtectedRoute: React.FC<EnhancedAdminProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'admin' 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthAndRole();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        logUnauthorizedAccess('unauthenticated_user');
        navigate('/auth', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        checkAuthAndRole();
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, requiredRole]);

  const logUnauthorizedAccess = async (reason: string, additionalData = {}) => {
    try {
      await supabase.rpc('log_unauthorized_access', {
        _attempted_path: location.pathname,
        _blocked_reason: reason,
        _user_agent: navigator.userAgent,
        _additional_data: {
          required_role: requiredRole,
          timestamp: new Date().toISOString(),
          ...additionalData
        }
      });
    } catch (error) {
      console.error('Failed to log unauthorized access:', error);
    }
  };

  const checkAuthAndRole = async () => {
    try {
      setLoading(true);
      setError(null);

      // التحقق من الجلسة
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Session error: ' + sessionError.message);
      }

      if (!session?.user) {
        await logUnauthorizedAccess('no_session');
        navigate('/auth', { replace: true });
        return;
      }

      console.log('Checking admin role for user:', session.user.id);

      // التحقق من دور المستخدم
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Role check error:', roleError);
        setError('خطأ في التحقق من الصلاحيات');
        await logUnauthorizedAccess('role_check_error', { error: roleError.message });
        return;
      }

      if (!roleData) {
        console.log('No role found for user');
        setUserRole(null);
        await logUnauthorizedAccess('no_role_assigned');
        navigate('/unauthorized', { replace: true });
        return;
      }

      const currentRole = roleData.role;
      setUserRole(currentRole);

      // التحقق من صلاحية الدور
      const isRoleAuthorized = checkRolePermission(currentRole, requiredRole);
      
      if (!isRoleAuthorized) {
        console.log('User role insufficient:', currentRole, 'required:', requiredRole);
        await logUnauthorizedAccess('insufficient_role', { 
          user_role: currentRole, 
          required_role: requiredRole 
        });
        navigate('/unauthorized', { replace: true });
        return;
      }

      console.log('Admin access confirmed for role:', currentRole);
      setIsAuthorized(true);

    } catch (error: any) {
      console.error('Error in admin protection check:', error);
      setError(error.message || 'حدث خطأ في التحقق من الصلاحيات');
      await logUnauthorizedAccess('system_error', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkRolePermission = (userRole: string, requiredRole: string): boolean => {
    // تعريف مستويات الأدوار (من الأعلى للأقل)
    const roleHierarchy = {
      admin: 4,     // أعلى دور في النظام الحالي
      editor: 3,
      viewer: 2,
      user: 1
    };

    // في النظام الحالي، admin هو أعلى دور متاح
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  };

  const handleRetryAuth = () => {
    navigate('/auth', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  // شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                التحقق من الصلاحيات
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                جاري التحقق من صلاحيات الوصول الإداري...
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  المستوى المطلوب: <span className="font-semibold">{requiredRole}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // شاشة الخطأ
  if (error || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-lg shadow-2xl border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto relative">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                وصول محظور
              </h2>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 dark:text-red-400">
                  {error || 'ليس لديك صلاحيات كافية للوصول'}
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <div className="space-y-2 text-sm text-red-800 dark:text-red-300">
                <p><strong>المسار المطلوب:</strong> {location.pathname}</p>
                <p><strong>المستوى المطلوب:</strong> {requiredRole}</p>
                {userRole && <p><strong>مستواك الحالي:</strong> {userRole}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleRetryAuth} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Shield className="w-4 h-4 ml-2" />
                تسجيل دخول إداري
              </Button>
              
              <Button 
                onClick={handleGoHome} 
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                العودة للرئيسية
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              تم تسجيل محاولة الوصول هذه لأغراض الأمان
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // إذا كان كل شيء صحيح، عرض المحتوى
  return <>{children}</>;
};

export default EnhancedAdminProtectedRoute;