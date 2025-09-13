import React from 'react';
import { useTenantHook } from '@/hooks/useTenant';

interface TenantContextType {
  currentTenant: any;
  tenants: any[];
  switchTenant: (tenantCode: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const TenantContext = React.createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = React.useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const tenantData = useTenantHook();
  
  return (
    <TenantContext.Provider value={tenantData}>
      {children}
    </TenantContext.Provider>
  );
};