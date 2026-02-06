/**
 * RouteGuard - Centralized Authentication & Authorization Guard
 * Prevents flash of unauthorized content and handles redirects
 */

import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouteGuardProps {
  children: ReactNode;
  /** Require authentication */
  requireAuth?: boolean;
  /** Require specific role(s) - user must have at least one */
  requireRoles?: string[];
  /** Redirect path if auth fails */
  redirectTo?: string;
  /** For guest-only pages (login, register) - redirect if already authenticated */
  guestOnly?: boolean;
  /** Where to redirect authenticated users from guest pages */
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Wait for auth to complete loading
    if (isLoading) {
      setCheckComplete(false);
      return;
    }

    // Guest-only pages (login, register)
    if (guestOnly && user) {
      const redirect = authenticatedRedirect || (isAdmin ? '/admin' : '/app');
      navigate(redirect, { replace: true });
      return;
    }

    // Require auth check
    if (requireAuth && !user) {
      // Save intended destination for post-login redirect
      const returnUrl = location.pathname + location.search;
      navigate(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
      return;
    }

    // Role-based access check
    if (requireRoles.length > 0 && user) {
      const userRoleNames = roles.map(r => r.role);
      const hasRequiredRole = requireRoles.some(role => userRoleNames.includes(role as any));
      
      if (!hasRequiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        navigate(isAdmin ? '/admin' : '/app', { replace: true });
        return;
      }
    }

    // All checks passed
    setIsAuthorized(true);
    setCheckComplete(true);
  }, [isLoading, user, roles, guestOnly, requireAuth, requireRoles, navigate, location, redirectTo, authenticatedRedirect, isAdmin]);

  // Loading state - optimized skeleton
  if (isLoading || !checkComplete) {
    return (
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Animated shield icon */}
          <div className="relative">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-primary/5",
              "border border-primary/20"
            )}>
              <Shield className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border">
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          
          {/* Loading text */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {isRTL ? "جاري التحقق من الصلاحيات..." : "Verifying access..."}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? "يرجى الانتظار" : "Please wait"}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/50 animate-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized - handled by redirect, show nothing
  if (!isAuthorized && (requireAuth || requireRoles.length > 0)) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Pre-configured guards for common use cases
 */

// Customer area guard - requires auth, allows any role
export function CustomerGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth>
      {children}
    </RouteGuard>
  );
}

// Admin area guard - requires auth + admin roles
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard 
      requireAuth 
      requireRoles={['super_admin', 'admin', 'manager', 'support', 'finance', 'content_editor', 'staff']}
      redirectTo="/auth/login"
    >
      {children}
    </RouteGuard>
  );
}

// Guest-only guard - for login/register pages
export function GuestGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard guestOnly>
      {children}
    </RouteGuard>
  );
}
