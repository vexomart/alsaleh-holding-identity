import { createContext, useContext, ReactNode } from 'react';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

interface SecurityContextType {
  validateFormData: (data: Record<string, any>) => { isValid: boolean; errors: Record<string, string> };
  sanitizeInput: (input: string) => string;
  validateEmail: (email: string) => boolean;
  validatePhone: (phone: string) => boolean;
  logSecurityEvent: (event: any) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useEnhancedSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useEnhancedSecurity must be used within EnhancedSecurityProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const EnhancedSecurityProvider = ({ children }: Props) => {
  const { validateFormData, sanitizeInput, validateEmail, validatePhone } = useSecurityValidation();
  const { logSecurityEvent } = useSecurityAudit();

  const value = {
    validateFormData,
    sanitizeInput,
    validateEmail,
    validatePhone,
    logSecurityEvent
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};