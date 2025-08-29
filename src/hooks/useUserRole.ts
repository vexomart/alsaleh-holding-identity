import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'moderator' | null;

interface UseUserRoleReturn {
  userRole: UserRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  loading: boolean;
  error: string | null;
  refreshRole: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = async (user: User | null) => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setError('خطأ في جلب دور المستخدم');
        setUserRole(null);
        return;
      }

      setUserRole(data?.role || null);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('حدث خطأ غير متوقع');
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await fetchUserRole(user);
  };

  useEffect(() => {
    // الحصول على المستخدم الحالي
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      await fetchUserRole(user);
    };

    getCurrentUser();

    // الاستماع لتغييرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await fetchUserRole(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // حساب أنواع الأدوار المختلفة
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'admin'; // في النظام الحالي admin هو أعلى دور
  const isEditor = userRole === 'admin'; // الإداريون يمكنهم التحرير
  const isViewer = userRole === 'admin'; // الإداريون يمكنهم القراءة

  return {
    userRole,
    isAdmin,
    isSuperAdmin,
    isEditor,
    isViewer,
    loading,
    error,
    refreshRole,
  };
};

// Hook للتحقق من صلاحية دور معين
export const useRolePermission = (requiredRole: 'admin' | 'editor' | 'viewer' = 'admin') => {
  const { userRole, loading, error } = useUserRole();

  const hasPermission = () => {
    if (!userRole) return false;

    // تعريف هرمية الأدوار
    const roleHierarchy = {
      admin: 3,
      editor: 2,
      viewer: 1,
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  return {
    hasPermission: hasPermission(),
    userRole,
    loading,
    error,
  };
};

export default useUserRole;