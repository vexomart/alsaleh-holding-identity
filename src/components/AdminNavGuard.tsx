import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';

interface AdminNavGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

/**
 * مكون لإخفاء روابط الإدارة من المستخدمين غير المخولين
 */
const AdminNavGuard: React.FC<AdminNavGuardProps> = ({ 
  children, 
  fallback = null, 
  requiredRole = 'admin' 
}) => {
  const { userRole, loading } = useUserRole();

  // عدم عرض أي شيء أثناء التحميل
  if (loading) {
    return <>{fallback}</>;
  }

  // التحقق من الصلاحية
  const hasPermission = () => {
    if (!userRole) return false;

    const roleHierarchy = {
      admin: 3,
      editor: 2,
      viewer: 1,
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  // عرض المحتوى إذا كان لديه صلاحية، وإلا عرض البديل
  return hasPermission() ? <>{children}</> : <>{fallback}</>;
};

export default AdminNavGuard;