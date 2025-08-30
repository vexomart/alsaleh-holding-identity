import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'user' | 'moderator' | 'viewer' | 'editor' | null;

interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface SecurityAttempt {
  path: string;
  reason: string;
  timestamp: Date;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userRole: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // تسجيل محاولات الوصول الفاشلة
  const logUnauthorizedAccess = useCallback(async (attempt: SecurityAttempt) => {
    try {
      await supabase.from('unauthorized_access_logs').insert({
        user_id: authState.user?.id || null,
        attempted_path: attempt.path,
        blocked_reason: attempt.reason,
        ip_address: 'unknown', // سيتم تحديدها بواسطة trigger
        user_agent: navigator.userAgent,
        session_id: authState.session?.access_token?.substring(0, 10) || null,
        referer: document.referrer || null,
        additional_metadata: {
          timestamp: attempt.timestamp.toISOString(),
          current_role: authState.userRole,
          authenticated: authState.isAuthenticated,
        }
      });
    } catch (error) {
      console.error('Failed to log unauthorized access:', error);
    }
  }, [authState.user?.id, authState.session?.access_token, authState.userRole, authState.isAuthenticated]);

  // جلب دور المستخدم
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Unexpected error fetching role:', error);
      return null;
    }
  }, []);

  // التحقق من صحة الجلسة
  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session) return false;

    // التحقق من انتهاء صلاحية التوكن
    const now = new Date().getTime() / 1000;
    if (session.expires_at && session.expires_at < now) {
      toast({
        title: "انتهت صلاحية الجلسة",
        description: "الرجاء تسجيل الدخول مرة أخرى",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [toast]);

  // تسجيل الخروج الآمن
  const secureLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        userRole: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // مسح التخزين المحلي
      localStorage.clear();
      sessionStorage.clear();
      
      navigate('/login', { replace: true });
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "تم إنهاء جلستك بأمان",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // التحقق من الصلاحيات
  const hasPermission = useCallback((requiredRole: UserRole, strictMode: boolean = false): boolean => {
    if (!authState.isAuthenticated || !authState.userRole) return false;

    const roleHierarchy = {
      admin: 4,
      moderator: 3,
      editor: 2,
      viewer: 1,
      user: 1,
    };

    const userLevel = roleHierarchy[authState.userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    if (strictMode) {
      return authState.userRole === requiredRole;
    }

    return userLevel >= requiredLevel;
  }, [authState.isAuthenticated, authState.userRole]);

  // حماية المسارات
  const checkRouteAccess = useCallback(async (path: string): Promise<boolean> => {
    // المسارات العامة
    const publicPaths = ['/', '/login', '/about', '/contact', '/services', '/careers', '/ash'];
    const isPublicPath = publicPaths.some(publicPath => 
      path === publicPath || path.startsWith(publicPath + '/')
    );

    if (isPublicPath) return true;

    // التحقق من المصادقة
    if (!authState.isAuthenticated) {
      await logUnauthorizedAccess({
        path,
        reason: 'not_authenticated',
        timestamp: new Date(),
      });
      
      toast({
        title: "يتطلب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول للمتابعة",
        variant: "destructive",
      });
      
      navigate('/login', { 
        replace: true, 
        state: { from: path } 
      });
      return false;
    }

    // التحقق من صلاحيات المسارات المحمية
    if (path.startsWith('/admin')) {
      const hasAdminAccess = hasPermission('admin', true);
      if (!hasAdminAccess) {
        await logUnauthorizedAccess({
          path,
          reason: 'insufficient_admin_privileges',
          timestamp: new Date(),
        });
        
        toast({
          title: "غير مخول للوصول",
          description: "لا تملك صلاحية الوصول لهذه الصفحة",
          variant: "destructive",
        });
        
        navigate('/unauthorized', { replace: true });
        return false;
      }
    }

    if (path.startsWith('/client')) {
      if (!authState.userRole || authState.userRole === 'admin') {
        return true; // الأدمن يمكنه الوصول لكل شيء
      }
      
      const hasClientAccess = hasPermission('user');
      if (!hasClientAccess) {
        await logUnauthorizedAccess({
          path,
          reason: 'insufficient_client_privileges',
          timestamp: new Date(),
        });
        
        toast({
          title: "غير مخول للوصول",
          description: "لا تملك صلاحية الوصول لهذه الصفحة",
          variant: "destructive",
        });
        
        navigate('/unauthorized', { replace: true });
        return false;
      }
    }

    return true;
  }, [authState.isAuthenticated, authState.userRole, hasPermission, logUnauthorizedAccess, navigate, toast]);

  // إعداد مراقب الجلسة
  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout;

    const setupAuthListener = async () => {
      try {
        // الحصول على الجلسة الحالية مع معالجة الأخطاء
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        // إذا كان هناك خطأ في refresh token، امسح الجلسة المحلية
        if (error && error.message.includes('refresh_token_not_found')) {
          localStorage.clear();
          sessionStorage.clear();
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        if (initialSession) {
          const isValid = await validateSession(initialSession);
          if (isValid) {
            const role = await fetchUserRole(initialSession.user.id);
            setAuthState({
              user: initialSession.user,
              session: initialSession,
              userRole: role,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            });
          } else {
            await secureLogout();
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth setup error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }

      // مراقب تغيير حالة المصادقة
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            const isValid = await validateSession(session);
            if (isValid) {
              const role = await fetchUserRole(session.user.id);
              setAuthState({
                user: session.user,
                session,
                userRole: role,
                isLoading: false,
                isAuthenticated: true,
                error: null,
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setAuthState({
              user: null,
              session: null,
              userRole: null,
              isLoading: false,
              isAuthenticated: false,
              error: null,
            });
          } else if (event === 'TOKEN_REFRESHED' && session) {
            const isValid = await validateSession(session);
            if (!isValid) {
              await secureLogout();
            }
          }
        }
      );

      // فحص دوري للجلسة كل 5 دقائق
      sessionCheckInterval = setInterval(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        const isValid = await validateSession(currentSession);
        if (!isValid && authState.isAuthenticated) {
          await secureLogout();
        }
      }, 5 * 60 * 1000);

      return () => {
        subscription.unsubscribe();
        if (sessionCheckInterval) clearInterval(sessionCheckInterval);
      };
    };

    setupAuthListener();

    return () => {
      if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    };
  }, [validateSession, fetchUserRole, secureLogout, authState.isAuthenticated]);

  // التحقق من الوصول عند تغيير المسار
  useEffect(() => {
    const checkCurrentPath = async () => {
      if (!authState.isLoading && location.pathname !== '/login') {
        await checkRouteAccess(location.pathname);
      }
    };

    checkCurrentPath();
  }, [location.pathname, authState.isLoading, checkRouteAccess]);

  return {
    ...authState,
    secureLogout,
    hasPermission,
    checkRouteAccess,
    logUnauthorizedAccess,
  };
};