import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RouteGuard } from './RouteGuard';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  userRole: any;
  hasPermission: (role: string, strict?: boolean) => boolean;
  secureLogout: () => Promise<void>;
  checkRouteAccess: (path: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <RouteGuard>
        {children}
      </RouteGuard>
    </AuthContext.Provider>
  );
};

export default AuthProvider;