import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthSession } from '@/auth/new-auth-system';

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
    // سيتم تنفيذ منطق تسجيل الدخول هنا
    throw new Error('Login not implemented yet');
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