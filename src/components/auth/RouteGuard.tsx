import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * مكون حماية المسارات العام - يعمل على جميع المسارات
 * يتحقق من الصلاحيات ويعيد التوجيه حسب الحاجة
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isLoading, 
    isAuthenticated, 
    userRole, 
    checkRouteAccess,
    logUnauthorizedAccess 
  } = useAuth();

  useEffect(() => {
    const validateRoute = async () => {
      if (isLoading) return;

      const currentPath = location.pathname;

      // المسارات العامة التي لا تحتاج تحقق
      const publicPaths = [
        '/', '/auth', '/about', '/contact', '/services', '/careers',
        '/privacy', '/terms', '/support', '/faq', '/unauthorized',
        '/story', '/team', '/vision', '/our-works'
      ];

      const isPublicPath = publicPaths.some(path => 
        currentPath === path || currentPath.startsWith(path + '/')
      );

      if (isPublicPath) return;

      // تحقق خاص بمسارات الإدارة
      if (currentPath.startsWith('/admin')) {
        if (!isAuthenticated) {
          await logUnauthorizedAccess({
            path: currentPath,
            reason: 'admin_access_without_auth',
            timestamp: new Date(),
          });

          toast({
            title: "يتطلب تسجيل الدخول",
            description: "يجب تسجيل الدخول للوصول لوحة الإدارة",
            variant: "destructive",
          });

          navigate('/auth', { 
            replace: true, 
            state: { from: currentPath, requiredRole: 'admin' } 
          });
          return;
        }

        if (userRole !== 'admin') {
          await logUnauthorizedAccess({
            path: currentPath,
            reason: 'non_admin_access_attempt',
            timestamp: new Date(),
          });

          toast({
            title: "غير مخول للوصول",
            description: "لا تملك صلاحية الوصول لوحة الإدارة",
            variant: "destructive",
          });

          navigate('/unauthorized', { replace: true });
          return;
        }
      }

      // تحقق خاص بمسارات العملاء
      if (currentPath.startsWith('/client')) {
        if (!isAuthenticated) {
          await logUnauthorizedAccess({
            path: currentPath,
            reason: 'client_access_without_auth',
            timestamp: new Date(),
          });

          toast({
            title: "يتطلب تسجيل الدخول",
            description: "يجب تسجيل الدخول للوصول لوحة العملاء",
            variant: "destructive",
          });

          navigate('/auth', { 
            replace: true, 
            state: { from: currentPath } 
          });
          return;
        }

        // الأدمن يمكنه الوصول لكل شيء
        if (userRole === 'admin') return;

        // المستخدمين العاديين يحتاجون على الأقل دور 'user'
        if (!userRole || (userRole !== 'user' && userRole !== 'moderator' && userRole !== 'editor')) {
          await logUnauthorizedAccess({
            path: currentPath,
            reason: 'insufficient_client_role',
            timestamp: new Date(),
          });

          toast({
            title: "غير مخول للوصول",
            description: "لا تملك صلاحية الوصول لوحة العملاء",
            variant: "destructive",
          });

          navigate('/unauthorized', { replace: true });
          return;
        }
      }

      // مسارات أخرى محمية
      const protectedPaths = ['/wallet', '/my-projects', '/dashboard'];
      const isProtectedPath = protectedPaths.some(path => 
        currentPath.startsWith(path)
      );

      if (isProtectedPath && !isAuthenticated) {
        await logUnauthorizedAccess({
          path: currentPath,
          reason: 'protected_access_without_auth',
          timestamp: new Date(),
        });

        toast({
          title: "يتطلب تسجيل الدخول",
          description: "الرجاء تسجيل الدخول للمتابعة",
          variant: "destructive",
        });

        navigate('/auth', { 
          replace: true, 
          state: { from: currentPath } 
        });
        return;
      }

      // استخدام checkRouteAccess للتحقق النهائي
      await checkRouteAccess(currentPath);
    };

    validateRoute();
  }, [
    location.pathname, 
    isLoading, 
    isAuthenticated, 
    userRole, 
    navigate, 
    toast,
    checkRouteAccess,
    logUnauthorizedAccess
  ]);

  return <>{children}</>;
};

export default RouteGuard;