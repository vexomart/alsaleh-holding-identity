/**
 * RouteGuard - Instant Authentication Guard
 * Zero-delay render when auth ready
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

  // Quick loading state
  if (isLoading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Guest-only: redirect authenticated users
  if (guestOnly && user) {
    const redirect = authenticatedRedirect || (isAdmin ? '/adminash' : '/dashboard');
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
      return <Navigate to={isAdmin ? '/adminash' : '/dashboard'} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Pre-configured guards - Instant render
 */

export function CustomerGuard({ children }: { children: ReactNode }) {
  return <RouteGuard requireAuth>{children}</RouteGuard>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading, user } = useAuth();
  const { isRTL } = useLanguage();
  
  // Wait for auth to load
  if (isLoading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Redirect non-admin users to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  return <RouteGuard guestOnly>{children}</RouteGuard>;
}
