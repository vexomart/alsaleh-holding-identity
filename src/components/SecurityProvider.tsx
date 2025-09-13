import React, { createContext, useContext, useEffect, useState } from 'react';
import { securityConfig, sanitizeInput, validateEmail, validateSaudiPhone } from '@/config/security';

interface SecurityContextType {
  sanitizeInput: (input: string) => string;
  validateEmail: (email: string) => boolean;
  validatePhone: (phone: string) => boolean;
  isSecureEnvironment: boolean;
  reportSecurityIncident: (incident: SecurityIncident) => void;
}

interface SecurityIncident {
  type: 'xss_attempt' | 'csrf_attempt' | 'rate_limit' | 'unauthorized_access' | 'malicious_input';
  description: string;
  userAgent?: string;
  ip?: string;
  timestamp: number;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecureEnvironment, setIsSecureEnvironment] = useState(false);

  useEffect(() => {
    // فحص البيئة الآمنة
    const checkSecureEnvironment = () => {
      const isHTTPS = window.location.protocol === 'https:';
      const isLocalhost = window.location.hostname === 'localhost';
      const hasSecureHeaders = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      setIsSecureEnvironment(isHTTPS || isLocalhost);
      
      if (!isHTTPS && !isLocalhost) {
        reportSecurityIncident({
          type: 'unauthorized_access',
          description: 'غير آمن: الموقع لا يستخدم HTTPS',
          timestamp: Date.now()
        });
      }
    };

    checkSecureEnvironment();

    // مراقبة محاولات XSS
    const monitorXSS = () => {
      const originalAlert = window.alert;
      window.alert = function(message) {
        reportSecurityIncident({
          type: 'xss_attempt',
          description: `محاولة XSS محتملة: ${message}`,
          timestamp: Date.now()
        });
        return originalAlert.call(this, message);
      };

      // مراقبة DOM manipulation مشبوهة
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                  reportSecurityIncident({
                    type: 'xss_attempt',
                    description: `محاولة إدراج script غير مصرح: ${element.innerHTML}`,
                    timestamp: Date.now()
                  });
                  element.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => {
        window.alert = originalAlert;
        observer.disconnect();
      };
    };

    const cleanup = monitorXSS();

    // مراقبة console للكشف عن محاولات اختراق
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      const message = args.join(' ');
      if (message.includes('eval(') || message.includes('Function(') || message.includes('setTimeout(')) {
        reportSecurityIncident({
          type: 'malicious_input',
          description: `نشاط مشبوه في console: ${message}`,
          timestamp: Date.now()
        });
      }
      return originalConsoleLog.apply(this, args);
    };

    return () => {
      cleanup();
      console.log = originalConsoleLog;
    };
  }, []);

  const reportSecurityIncident = (incident: SecurityIncident) => {
    // تسجيل الحادث محلياً
    console.warn('Security Incident:', incident);
    
    // إرسال إلى النظام الخلفي في بيئة الإنتاج
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...incident,
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        })
      }).catch(error => {
        console.error('Failed to report security incident:', error);
      });
    }

    // عرض تحذير للمستخدم في حالات خطيرة
    if (incident.type === 'xss_attempt' || incident.type === 'csrf_attempt') {
      // يمكن عرض toast تحذيري هنا
    }
  };

  const contextValue: SecurityContextType = {
    sanitizeInput,
    validateEmail,
    validatePhone: validateSaudiPhone,
    isSecureEnvironment,
    reportSecurityIncident
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// HOC لحماية المكونات الحساسة
export const withSecurity = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireSecure?: boolean;
    allowedRoles?: string[];
    rateLimit?: number;
  } = {}
) => {
  return (props: P) => {
    const { isSecureEnvironment, reportSecurityIncident } = useSecurityContext();

    useEffect(() => {
      if (options.requireSecure && !isSecureEnvironment) {
        reportSecurityIncident({
          type: 'unauthorized_access',
          description: 'محاولة الوصول لمكون حساس في بيئة غير آمنة',
          timestamp: Date.now()
        });
        return;
      }

      // تطبيق rate limiting
      if (options.rateLimit) {
        const componentName = Component.displayName || Component.name;
        const accessKey = `component_access_${componentName}`;
        const now = Date.now();
        const windowStart = now - 60000; // دقيقة واحدة
        
        const accessLog = JSON.parse(localStorage.getItem(accessKey) || '[]');
        const recentAccess = accessLog.filter((time: number) => time > windowStart);
        
        if (recentAccess.length >= options.rateLimit) {
          reportSecurityIncident({
            type: 'rate_limit',
            description: `تجاوز حد الوصول للمكون ${componentName}`,
            timestamp: now
          });
          return;
        }
        
        recentAccess.push(now);
        localStorage.setItem(accessKey, JSON.stringify(recentAccess));
      }
    }, [isSecureEnvironment]);

    if (options.requireSecure && !isSecureEnvironment) {
      return <div className="p-4 text-center text-red-600">غير مسموح: بيئة غير آمنة</div>;
    }

    return <Component {...props} />;
  };
};

// Hook للتحقق من الأمان في النماذج
export const useSecureForm = () => {
  const { sanitizeInput, validateEmail, validatePhone, reportSecurityIncident } = useSecurityContext();

  const validateFormData = (data: Record<string, any>) => {
    const errors: Record<string, string> = {};
    const sanitizedData: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // تنظيف المدخلات
        const sanitized = sanitizeInput(value);
        sanitizedData[key] = sanitized;

        // فحص محاولات حقن
        if (value !== sanitized) {
          reportSecurityIncident({
            type: 'malicious_input',
            description: `محاولة حقن في الحقل ${key}: ${value}`,
            timestamp: Date.now()
          });
        }

        // التحقق من البريد الإلكتروني
        if (key.includes('email') && value && !validateEmail(value)) {
          errors[key] = 'صيغة البريد الإلكتروني غير صحيحة';
        }

        // التحقق من رقم الهاتف
        if (key.includes('phone') && value && !validatePhone(value)) {
          errors[key] = 'صيغة رقم الهاتف غير صحيحة';
        }
      } else {
        sanitizedData[key] = value;
      }
    });

    return { sanitizedData, errors, isValid: Object.keys(errors).length === 0 };
  };

  return { validateFormData, sanitizeInput, validateEmail, validatePhone };
};