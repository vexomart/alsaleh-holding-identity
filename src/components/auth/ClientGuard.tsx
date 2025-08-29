import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '@/hooks/useAuth';

interface ClientGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  strictMode?: boolean;
}

/**
 * حماية خاصة بمسارات العملاء
 * يسمح للأدمن بالوصول + المستخدمين العاديين
 */
export const ClientGuard: React.FC<ClientGuardProps> = ({
  children,
  requiredRole = 'user',
  strictMode = false,
}) => {
  return (
    <ProtectedRoute 
      requiredRole={requiredRole} 
      strictMode={strictMode}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ClientGuard;