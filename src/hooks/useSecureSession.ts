import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  full_name: string;
  role: 'owner' | 'admin' | 'editor';
  department?: string;
}

interface SecureSessionHook {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

export const useSecureSession = (): SecureSessionHook => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const validateSession = async (): Promise<boolean> => {
    try {
      const sessionId = sessionStorage.getItem('admin_session_id');
      if (!sessionId) {
        setUser(null);
        setLoading(false);
        return false;
      }

      // Validate session with database
      const { data: sessionValidation, error } = await supabase.rpc(
        'validate_admin_session',
        { session_id: sessionId }
      );

      const sessionData = sessionValidation as any;
      
      if (error || !sessionData?.valid) {
        // Session invalid, clear storage
        sessionStorage.removeItem('admin_session_id');
        sessionStorage.removeItem('admin_user');
        setUser(null);
        setLoading(false);
        return false;
      }

      // Session valid, set user
      setUser(sessionData.user);
      
      // Update stored user data if it changed
      const storedUser = sessionStorage.getItem('admin_user');
      if (storedUser !== JSON.stringify(sessionData.user)) {
        sessionStorage.setItem('admin_user', JSON.stringify(sessionData.user));
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      sessionStorage.removeItem('admin_session_id');
      sessionStorage.removeItem('admin_user');
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const sessionId = sessionStorage.getItem('admin_session_id');
      
      // Log security event for logout
      if (sessionId && user) {
        await supabase.from('security_audit_logs').insert({
          event_type: 'admin_logout',
          user_id: user.id,
          action: 'admin_authentication',
          risk_level: 'low',
          metadata: {
            session_id: sessionId,
            logout_time: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });
      }

      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      
      // Clear session storage
      sessionStorage.removeItem('admin_session_id');
      sessionStorage.removeItem('admin_user');
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear even if logging fails
      sessionStorage.removeItem('admin_session_id');
      sessionStorage.removeItem('admin_user');
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial session validation
    validateSession();

    // Set up periodic session validation (every 5 minutes)
    const interval = setInterval(() => {
      validateSession();
    }, 5 * 60 * 1000);

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_session_id' && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    loading,
    logout,
    validateSession
  };
};