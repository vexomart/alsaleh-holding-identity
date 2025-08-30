import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthSession } from '@/auth/new-auth-system';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  realm: 'client' | 'admin' | null;
  login: (email: string, password: string, realm: 'client' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!session;
  const realm = session?.realm || null;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      // التحقق من الجلسة المحفوظة في localStorage
      const savedSession = localStorage.getItem('auth_session');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        
        // التحقق من انتهاء صلاحية الجلسة
        const now = new Date().getTime();
        const expiresAt = new Date(sessionData.expires_at).getTime();
        
        if (now < expiresAt) {
          setSession(sessionData);
          setUser(sessionData.user);
        } else {
          // حذف الجلسة المنتهية الصلاحية
          localStorage.removeItem('auth_session');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('auth_session');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, realm: 'client' | 'admin') => {
    try {
      setIsLoading(true);
      
      // استدعاء دالة المصادقة من قاعدة البيانات
      const { data, error } = await supabase.rpc('simple_authenticate_user', {
        email_lower_param: email.toLowerCase().trim(),
        plain_password: password
      });

      if (error) {
        throw new Error(error.message);
      }

      const authData = data as any;
      if (!authData.success) {
        throw new Error(authData.message || 'فشل في تسجيل الدخول');
      }

      // إنشاء جلسة جديدة
      const sessionData: AuthSession = {
        id: crypto.randomUUID(),
        user_id: authData.user.id,
        session_token: `session_${Date.now()}`,
        realm,
        expires_at: new Date(Date.now() + (realm === 'admin' ? 8 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString(),
        user: authData.user
      };

      // حفظ الجلسة
      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      
      setSession(sessionData);
      setUser(authData.user);
      
    } catch (error: any) {
      throw new Error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // حذف الجلسة من localStorage
      localStorage.removeItem('auth_session');
      
      // إعادة تعيين الحالة
      setUser(null);
      setSession(null);
      
      // إعادة توجيه للصفحة الرئيسية
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshSession = async () => {
    // سيتم تنفيذ منطق تحديث الجلسة هنا
    console.log('Refresh session called');
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    realm,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};