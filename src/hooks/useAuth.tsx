/**
 * useAuth Hook - INSTANT Authentication
 * 
 * CRITICAL: Uses localStorage for INSTANT initial state
 * - No async wait for getSession() on first render
 * - Session is read synchronously from localStorage
 * - isLoading is only true if we need to verify/refresh the session
 */

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode, type FC } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'support' | 'finance' | 'content_editor' | 'customer';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get session from localStorage SYNCHRONOUSLY for instant loading
function getStoredSession(): { user: User | null; session: Session | null } {
  try {
    const storageKey = `sb-iuzzapnmiopbbjfravww-auth-token`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.access_token && parsed?.user) {
        // Check if token is expired
        const expiresAt = parsed.expires_at;
        if (expiresAt && expiresAt * 1000 > Date.now()) {
          return {
            user: parsed.user as User,
            session: {
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
              expires_at: parsed.expires_at,
              expires_in: parsed.expires_in,
              token_type: parsed.token_type || 'bearer',
              user: parsed.user,
            } as Session
          };
        }
      }
    }
  } catch {
    // Silent fail
  }
  return { user: null, session: null };
}

// Get cached roles from localStorage
function getCachedRoles(userId: string): UserRole[] {
  try {
    const cached = localStorage.getItem(`roles_${userId}`);
    if (cached) return JSON.parse(cached);
  } catch {}
  return [];
}

// Cache roles to localStorage
function cacheRoles(userId: string, roles: UserRole[]) {
  try {
    localStorage.setItem(`roles_${userId}`, JSON.stringify(roles));
  } catch {}
}

// Send SMS alert on login
async function sendLoginSmsAlert(userId: string) {
  try {
    // Fetch user phone
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone, full_name, full_name_ar')
      .eq('id', userId)
      .single();

    if (!profile?.phone) return;

    // Get current date/time in Saudi Arabia timezone
    const now = new Date();
    const saudiDate = now.toLocaleDateString('ar-SA', { 
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const saudiTime = now.toLocaleTimeString('ar-SA', { 
      timeZone: 'Asia/Riyadh',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Send SMS via edge function (fire and forget)
    supabase.functions.invoke('sms-send-notification', {
      body: {
        phone: profile.phone,
        message_type: 'login_alert',
        template_data: {
          name: profile.full_name_ar || profile.full_name || 'عميلنا',
          date: saudiDate,
          time: saudiTime,
          location: 'المملكة العربية السعودية',
          device: navigator.userAgent?.includes('Mobile') ? 'جوال' : 'كمبيوتر'
        }
      }
    }).catch(err => console.warn('Login SMS alert failed:', err));
  } catch (err) {
    console.warn('Failed to send login alert:', err);
  }
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // INSTANT initial state from localStorage
  const initialState = getStoredSession();
  const initialRoles = initialState.user ? getCachedRoles(initialState.user.id) : [];
  
  const [user, setUser] = useState<User | null>(initialState.user);
  const [session, setSession] = useState<Session | null>(initialState.session);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(initialRoles);
  // Start NOT loading if we have a cached session
  const [isLoading, setIsLoading] = useState(!initialState.user);
  
  const isMountedRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(initialState.user?.id || null);

  // Compute flags
  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r.role));
  const isCustomer = !isAdmin && (roles.some((r) => r.role === 'customer') || roles.length === 0);

  // Fetch functions
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data as UserProfile | null;
  };

  const fetchRoles = async (userId: string): Promise<UserRole[]> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role, tenant_id')
      .eq('user_id', userId);
    const roles = (data || []) as UserRole[];
    cacheRoles(userId, roles); // Cache for next time
    return roles;
  };

  useEffect(() => {
    isMountedRef.current = true;

    // LISTENER - For ongoing changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMountedRef.current) return;
        if (!initialLoadDoneRef.current) return;

        if (event === 'SIGNED_OUT' || !currentSession?.user) {
          currentUserIdRef.current = null;
          setSession(null);
          setUser(null);
          setProfile(null);
          setRoles([]);
          return;
        }

        // Send login SMS alert on new sign-in
        if (event === 'SIGNED_IN' && currentUserIdRef.current !== currentSession.user.id) {
          sendLoginSmsAlert(currentSession.user.id);
        }

        if (currentUserIdRef.current === currentSession.user.id) {
          setSession(currentSession);
          return;
        }

        currentUserIdRef.current = currentSession.user.id;
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Load data in background
        fetchProfile(currentSession.user.id).then(p => {
          if (isMountedRef.current) setProfile(p);
        });
        fetchRoles(currentSession.user.id).then(r => {
          if (isMountedRef.current) setRoles(r);
        });
      }
    );

    // BACKGROUND REFRESH - Don't block UI
    const refreshData = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMountedRef.current) return;

        if (currentSession?.user) {
          currentUserIdRef.current = currentSession.user.id;
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch fresh data in parallel
          const [profileData, rolesData] = await Promise.all([
            fetchProfile(currentSession.user.id),
            fetchRoles(currentSession.user.id)
          ]);

          if (isMountedRef.current) {
            setProfile(profileData);
            setRoles(rolesData);
          }
        } else {
          currentUserIdRef.current = null;
          setSession(null);
          setUser(null);
          setProfile(null);
          setRoles([]);
        }
      } catch {
        // Keep cached state on error
      } finally {
        initialLoadDoneRef.current = true;
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    refreshData();

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName || email.split('@')[0] },
      },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signOut = useCallback(async () => {
    // Clear cached roles
    if (currentUserIdRef.current) {
      localStorage.removeItem(`roles_${currentUserIdRef.current}`);
    }
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const hasRole = useCallback((role: AppRole): boolean => {
    return roles.some((r) => r.role === role);
  }, [roles]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      roles,
      isLoading,
      isAdmin,
      isCustomer,
      signIn,
      signUp,
      signOut,
      resetPassword,
      hasRole,
    }}>
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
