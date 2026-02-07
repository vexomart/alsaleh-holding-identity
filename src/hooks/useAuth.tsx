/**
 * useAuth Hook - Ultra-Fast Authentication
 * Optimized for instant loading with minimal re-renders
 * 
 * KEY OPTIMIZATIONS:
 * 1. Single atomic state update after all data is fetched
 * 2. Session cached for immediate access
 * 3. Parallel data fetching for profile & roles
 * 4. Skip re-fetching on token refresh (same user)
 */

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode, type FC } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'support' | 'finance' | 'content_editor' | 'customer';

// Admin roles that have access to /adminash dashboard
const ADMIN_ROLES: AppRole[] = ['super_admin', 'admin', 'manager', 'staff', 'support', 'finance', 'content_editor'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_language: string;
  tenant_id: string | null;
  is_active: boolean;
  customer_uid: string | null;
  is_kyc_verified: boolean | null;
  national_id: string | null;
}

interface UserRole {
  role: AppRole;
  tenant_id: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Compute admin/customer flags from roles
function computeAccessFlags(roles: UserRole[]): { isAdmin: boolean; isCustomer: boolean } {
  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r.role));
  const isCustomer = !isAdmin && (roles.some((r) => r.role === 'customer') || roles.length === 0);
  return { isAdmin, isCustomer };
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Single state object to minimize re-renders
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    roles: [],
    isLoading: true,
    isAdmin: false,
    isCustomer: true,
  });
  
  const isMountedRef = useRef(true);
  const initialLoadCompleteRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  // Fast profile fetch - no throw on error
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      return data as UserProfile | null;
    } catch {
      return null;
    }
  }, []);

  // Fast roles fetch - no throw on error
  const fetchRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role, tenant_id')
        .eq('user_id', userId);
      return (data || []) as UserRole[];
    } catch {
      return [];
    }
  }, []);

  // Load all user data in parallel - single state update
  const loadUserData = useCallback(async (user: User, session: Session) => {
    const [profile, roles] = await Promise.all([
      fetchProfile(user.id),
      fetchRoles(user.id)
    ]);

    if (!isMountedRef.current) return;

    const { isAdmin, isCustomer } = computeAccessFlags(roles);

    // SINGLE atomic state update - minimizes re-renders
    setAuthState({
      user,
      session,
      profile,
      roles,
      isLoading: false,
      isAdmin,
      isCustomer,
    });
  }, [fetchProfile, fetchRoles]);

  // Clear all data - single state update
  const clearUserData = useCallback(() => {
    if (!isMountedRef.current) return;
    setAuthState({
      user: null,
      session: null,
      profile: null,
      roles: [],
      isLoading: false,
      isAdmin: false,
      isCustomer: true,
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // INITIAL LOAD - Fast path
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMountedRef.current) return;

        if (session?.user) {
          currentUserIdRef.current = session.user.id;
          await loadUserData(session.user, session);
        } else {
          currentUserIdRef.current = null;
          clearUserData();
        }
      } catch {
        clearUserData();
      } finally {
        if (isMountedRef.current) {
          initialLoadCompleteRef.current = true;
        }
      }
    };

    // ONGOING AUTH CHANGES - Does NOT flash loading after initial
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMountedRef.current) return;

        // Handle sign out immediately
        if (event === 'SIGNED_OUT' || !currentSession?.user) {
          currentUserIdRef.current = null;
          clearUserData();
          return;
        }

        // Skip if same user (token refresh) - NO re-fetch!
        if (currentUserIdRef.current === currentSession.user.id && initialLoadCompleteRef.current) {
          // Just update session silently if it changed
          setAuthState(prev => ({
            ...prev,
            session: currentSession,
            user: currentSession.user,
          }));
          return;
        }

        // New user signed in
        currentUserIdRef.current = currentSession.user.id;
        await loadUserData(currentSession.user, currentSession);
      }
    );

    // Start initial load immediately
    initializeAuth();

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadUserData, clearUserData]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName || email.split('@')[0] },
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearUserData();
  }, [clearUserData]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const hasRole = useCallback((role: AppRole): boolean => {
    return authState.roles.some((r) => r.role === role);
  }, [authState.roles]);

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
