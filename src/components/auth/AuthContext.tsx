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

      let userData: AuthUser | null = null;

      if (realm === 'admin') {
        // حاول أولاً عبر دالة قاعدة البيانات إن وُجدت
        try {
          const { data, error } = await supabase.rpc('check_admin_credentials', {
            email_input: email,
            password_input: password,
          });

          if (error) throw error;

          const adminRes: any = data as any;
          if (adminRes && adminRes.success) {
            const dbUser = adminRes.user as any;
            userData = {
              id: dbUser.id,
              name: dbUser.full_name || 'مدير النظام',
              email: dbUser.email,
              email_lower: (dbUser.email || email).toLowerCase(),
              role: (dbUser.role === 'owner' || dbUser.role === 'admin') ? 'admin' : 'admin',
              status: 'active',
              created_at: new Date().toISOString(),
            };
          }
        } catch (_) {
          // تجاهل ونستخدم التحقق المحلي بالأسفل
        }

        // تحقق محلي كخطة بديلة
        if (!userData) {
          const expectedEmail = 'admin@alialshehriholding.com';
          const expectedPassword = 'Ali@@#@@1409';
          const match = email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
          if (!match) {
            throw new Error('بيانات تسجيل الدخول غير صحيحة');
          }
          userData = {
            id: crypto.randomUUID(),
            name: 'مدير النظام - شركة علي صالح الشهري القابضة',
            email: expectedEmail,
            email_lower: expectedEmail,
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString(),
          };
        }
      } else {
        // عميل: استخدام الدالة الحالية (إن كانت متوفرة)
        const { data, error } = await supabase.rpc('simple_authenticate_user', {
          email_lower_param: email.toLowerCase().trim(),
          plain_password: password,
        });
        if (error) throw new Error(error.message);
        const authData = data as any;
        if (!authData?.success || !authData?.user) {
          throw new Error(authData?.message || 'فشل في تسجيل الدخول');
        }
        userData = {
          id: authData.user.id,
          name: authData.user.name || authData.user.full_name || authData.user.email,
          email: authData.user.email,
          email_lower: (authData.user.email || '').toLowerCase(),
          role: 'client',
          status: 'active',
          created_at: authData.user.created_at || new Date().toISOString(),
        };
      }

      // إنشاء جلسة
      const sessionData: AuthSession = {
        id: crypto.randomUUID(),
        user_id: userData.id,
        session_token: `session_${Date.now()}`,
        realm,
        expires_at: new Date(Date.now() + (realm === 'admin' ? 8 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString(),
        user: userData,
      };

      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      setSession(sessionData);
      setUser(userData);
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