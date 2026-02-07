/**
 * RouteGuard - Ultra-Fast Authentication Guard
 * Zero-delay render when auth ready
 * Minimal loading UI for instant perceived performance
 */

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  redirectTo?: string;
  guestOnly?: boolean;
  authenticatedRedirect?: string;
}

// Ultra-minimal loader - fastest possible render
const FastLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export function RouteGuard({
  children,
  requireAuth = false,
  requireRoles = [],
  redirectTo = '/auth/login',
  guestOnly = false,
  authenticatedRedirect,
}: RouteGuardProps) {
  const { user, roles, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show minimal loader only during initial auth check
  if (isLoading) {
    return <FastLoader />;
  }

  // Guest-only: redirect authenticated users immediately
  if (guestOnly && user) {
    const redirect = authenticatedRedirect || (isAdmin ? '/adminash' : '/dashboard');
    return <Navigate to={redirect} replace />;
  }

  // Require auth: redirect unauthenticated immediately
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
 * CustomerGuard - For /dashboard/* routes
 * Requires authentication, redirects non-auth to login
 */
export function CustomerGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <FastLoader />;
  if (!user) return <Navigate to="/auth/login" replace />;
  
  return <>{children}</>;
}

/**
 * AdminGuard - For /adminash/* routes
 * Requires authentication + admin role
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  
  // Show loader only during initial check
  if (isLoading) return <FastLoader />;
  
  // Not logged in - redirect to login
  if (!user) return <Navigate to="/auth/login" replace />;
  
  // Not admin - redirect to customer dashboard
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
}

/**
 * GuestGuard - For login/register pages
 * Redirects authenticated users away
 */
export function GuestGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <FastLoader />;
  
  // Already logged in - redirect to appropriate dashboard
  if (user) {
    return <Navigate to={isAdmin ? '/adminash' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
}
