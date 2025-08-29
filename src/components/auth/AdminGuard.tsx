import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * حماية خاصة بمسارات الإدارة
 * يسمح فقط للأدمن بالوصول
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute 
      requiredRole="admin" 
      strictMode={true}
    >
      {children}
    </ProtectedRoute>
  );
};

export default AdminGuard;