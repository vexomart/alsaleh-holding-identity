import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AUTH_ROUTES } from '@/auth/new-auth-system';

interface RouteGuardProps {
  children: React.ReactNode;
}

const PROTECTED_ROUTES = {
  ADMIN: ['/admin'],
  CLIENT: ['/client', '/my-projects', '/wallet'],
  PUBLIC: ['/', '/about', '/services', '/contact', '/auth']
};

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, realm, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;
    console.log('Route Guard - Current path:', currentPath, 'Auth status:', isAuthenticated, 'Realm:', realm);

    // التحقق من المسارات المحمية للإدارة
    if (PROTECTED_ROUTES.ADMIN.some(route => currentPath.startsWith(route))) {
      if (!isAuthenticated) {
        console.log('Redirecting to admin login - not authenticated');
        navigate(AUTH_ROUTES.ADMIN.LOGIN, { replace: true });
        return;
      }
      
      if (realm !== 'admin' || !user || !['admin', 'superadmin'].includes(user.role)) {
        console.log('Redirecting to admin login - insufficient privileges');
        navigate('/unauthorized', { replace: true });
        return;
      }
    }

    // التحقق من المسارات المحمية للعملاء
    if (PROTECTED_ROUTES.CLIENT.some(route => currentPath.startsWith(route))) {
      if (!isAuthenticated) {
        console.log('Redirecting to client login - not authenticated');
        navigate(AUTH_ROUTES.CLIENT.LOGIN, { replace: true });
        return;
      }
      
      if (realm !== 'client' || !user || user.role !== 'client') {
        console.log('Redirecting to client login - wrong realm');
        navigate('/unauthorized', { replace: true });
        return;
      }
    }

    // إعادة توجيه المستخدمين المسجلين دخولهم بعيداً عن صفحات تسجيل الدخول
    if (isAuthenticated && currentPath.includes('/auth/')) {
      if (realm === 'admin') {
        navigate(AUTH_ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else if (realm === 'client') {
        navigate(AUTH_ROUTES.CLIENT.DASHBOARD, { replace: true });
      }
      return;
    }

    // إعادة توجيه الصفحات القديمة
    if (currentPath === '/login') {
      navigate(AUTH_ROUTES.CLIENT.LOGIN, { replace: true });
      return;
    }
    
    if (currentPath === '/ashadmin') {
      navigate(AUTH_ROUTES.ADMIN.LOGIN, { replace: true });
      return;
    }

  }, [isAuthenticated, isLoading, realm, user, location.pathname, navigate]);

  return <>{children}</>;
};