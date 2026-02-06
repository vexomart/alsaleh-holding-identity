/**
 * RouteGuard - Simplified Authentication Guard
 * Immediate render when auth ready - no extra state management
 */

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  redirectTo?: string;
  guestOnly?: boolean;
  authenticatedRedirect?: string;
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireRoles = [],
  redirectTo = '/auth/login',
  guestOnly = false,
  authenticatedRedirect,
}: RouteGuardProps) {
  const { user, roles, isLoading, isAdmin } = useAuth();
  const { isRTL } = useLanguage();
  const location = useLocation();

  // Simple loading - NO extra state
  if (isLoading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </span>
        </div>
      </div>
    );
  }

  // Guest-only: redirect authenticated users
  if (guestOnly && user) {
    const redirect = authenticatedRedirect || (isAdmin ? '/admin' : '/app');
    return <Navigate to={redirect} replace />;
  }

  // Require auth: redirect unauthenticated
  if (requireAuth && !user) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Role check
  if (requireRoles.length > 0 && user) {
    const userRoleNames = roles.map(r => r.role);
    const hasRequiredRole = requireRoles.some(role => userRoleNames.includes(role as any));
    
    if (!hasRequiredRole) {
      return <Navigate to={isAdmin ? '/admin' : '/app'} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Pre-configured guards
 */

export function CustomerGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requireAuth>{children}</RouteGuard>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard 
      requireAuth 
      requireRoles={['super_admin', 'admin', 'manager', 'support', 'finance', 'content_editor', 'staff']}
    >
      {children}
    </RouteGuard>
  );
}

export function GuestGuard({ children }: { children: ReactNode }) {
  return <RouteGuard guestOnly>{children}</RouteGuard>;
}
