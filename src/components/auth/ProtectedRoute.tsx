import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'moderator' | 'viewer' | 'editor';
  strictMode?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  strictMode = false,
  fallback = null,
}) => {
  const { 
    isLoading, 
    isAuthenticated, 
    hasPermission, 
    checkRouteAccess,
    logUnauthorizedAccess 
  } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      if (isLoading) return;

      try {
        // التحقق من المصادقة
        if (!isAuthenticated) {
          setIsAuthorized(false);
          setError('authentication_required');
          return;
        }

        // التحقق من الصلاحيات
        if (!hasPermission(requiredRole, strictMode)) {
          await logUnauthorizedAccess({
            path: location.pathname,
            reason: `insufficient_${requiredRole}_privileges`,
            timestamp: new Date(),
          });
          setIsAuthorized(false);
          setError('insufficient_privileges');
          return;
        }

        // التحقق من الوصول للمسار
        const hasAccess = await checkRouteAccess(location.pathname);
        setIsAuthorized(hasAccess);
        
        if (!hasAccess) {
          setError('route_access_denied');
        }
      } catch (error) {
        console.error('Access verification failed:', error);
        setIsAuthorized(false);
        setError('verification_failed');
      }
    };

    verifyAccess();
  }, [
    isLoading, 
    isAuthenticated, 
    requiredRole, 
    strictMode, 
    hasPermission, 
    checkRouteAccess,
    logUnauthorizedAccess,
    location.pathname
  ]);

  // عرض شاشة التحميل
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            جاري التحقق من الصلاحيات...
          </h2>
          <p className="text-muted-foreground">
            يرجى الانتظار بينما نتأكد من صلاحيتك للوصول
          </p>
        </div>
      </div>
    );
  }

  // إعادة التوجيه أو عرض رسالة الخطأ
  if (!isAuthorized) {
    if (error === 'authentication_required') {
      return (
        <Navigate 
          to="/auth" 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }

    if (error === 'insufficient_privileges' || error === 'route_access_denied') {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                غير مخول للوصول
              </h1>
              <p className="text-muted-foreground">
                لا تملك الصلاحية اللازمة للوصول إلى هذه الصفحة
              </p>
            </div>

            <Alert className="border-destructive/50 text-right">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                الصلاحية المطلوبة: <strong>{requiredRole}</strong>
                <br />
                إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الإدارة.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="flex items-center gap-2"
              >
                الرجوع للخلف
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                className="flex items-center gap-2"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // خطأ في التحقق
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <Alert className="max-w-md border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-right">
            حدث خطأ أثناء التحقق من الصلاحيات. يرجى المحاولة مرة أخرى.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // عرض المحتوى المحمي
  return <>{children}</>;
};

export default ProtectedRoute;