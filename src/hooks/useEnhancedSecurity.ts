import { useSecurityAudit } from './useSecurityAudit';
import { supabase } from '@/integrations/supabase/client';

export type EnhancedSecurityEventType = 
  | 'sensitive_data_access'
  | 'admin_action'
  | 'data_export'
  | 'bulk_operation'
  | 'privilege_escalation_attempt'
  | 'suspicious_query_pattern'
  | 'rate_limit_exceeded';

interface EnhancedSecurityEvent {
  eventType: EnhancedSecurityEventType;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

export const useEnhancedSecurity = () => {
  const { logSecurityEvent } = useSecurityAudit();

  const logEnhancedSecurityEvent = async (event: EnhancedSecurityEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Log to both existing user_activity_logs and new security_audit_logs
      await Promise.all([
        // Existing security audit system - map to compatible event type
        logSecurityEvent({
          eventType: event.eventType === 'sensitive_data_access' ? 'sensitive_data_access' :
                     event.eventType === 'admin_action' ? 'admin_action' :
                     'unauthorized_access_attempt',
          description: event.description,
          metadata: event.metadata
        }),
        
        // Enhanced security audit logs
        supabase.from('security_audit_logs').insert({
          event_type: event.eventType,
          user_id: user?.id,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          action: event.description,
          risk_level: event.riskLevel,
          metadata: {
            ...event.metadata,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 200)
          }
        })
      ]);
    } catch (error) {
      console.error('Failed to log enhanced security event:', error);
    }
  };

  const checkEnhancedRateLimit = async (
    actionType: string, 
    identifier?: string,
    limit: number = 5,
    windowMinutes: number = 60
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const rateLimitIdentifier = identifier || user?.id || 'anonymous';
      
      const { data, error } = await supabase.rpc('enhanced_rate_limit_check', {
        p_identifier: rateLimitIdentifier,
        p_action_type: actionType,
        p_limit: limit,
        p_window_minutes: windowMinutes
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // Fail safe - allow action but log the error
        await logEnhancedSecurityEvent({
          eventType: 'rate_limit_exceeded',
          description: `Rate limit check failed for action: ${actionType}`,
          riskLevel: 'medium',
          metadata: { error: error.message, actionType }
        });
        return true;
      }

      if (!data) {
        await logEnhancedSecurityEvent({
          eventType: 'rate_limit_exceeded',
          description: `Rate limit exceeded for action: ${actionType}`,
          riskLevel: 'high',
          metadata: { actionType, limit, windowMinutes }
        });
      }

      return data || false;
    } catch (error) {
      console.error('Enhanced rate limit check error:', error);
      return true; // Fail safe
    }
  };

  const maskSensitiveData = (data: any, fieldsToMask: string[] = []): any => {
    const defaultSensitiveFields = [
      'id_number', 'client_id_number', 'tax_number', 'commercial_register',
      'phone', 'email', 'client_phone', 'client_email', 'customer_phone', 'customer_email'
    ];
    
    const allSensitiveFields = [...defaultSensitiveFields, ...fieldsToMask];
    
    if (Array.isArray(data)) {
      return data.map(item => maskSensitiveData(item, fieldsToMask));
    }
    
    if (typeof data === 'object' && data !== null) {
      const masked = { ...data };
      
      allSensitiveFields.forEach(field => {
        if (masked[field]) {
          if (field.includes('email')) {
            // Mask email: user@domain.com -> u***@d*****.com
            const email = masked[field];
            const [localPart, domain] = email.split('@');
            masked[field] = `${localPart[0]}***@${domain[0]}*****.${domain.split('.').pop()}`;
          } else if (field.includes('phone')) {
            // Mask phone: +966501234567 -> +966***4567
            const phone = masked[field];
            masked[field] = phone.length > 6 ? 
              `${phone.substring(0, 4)}***${phone.substring(phone.length - 4)}` : 
              '***';
          } else {
            // Mask other sensitive data
            const value = masked[field].toString();
            masked[field] = value.length > 4 ? 
              `${value.substring(0, 2)}***${value.substring(value.length - 2)}` : 
              '***';
          }
        }
      });
      
      return masked;
    }
    
    return data;
  };

  const validateAdminAction = async (action: string, resourceType?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        await logEnhancedSecurityEvent({
          eventType: 'admin_action',
          description: `Unauthorized admin action attempt: ${action}`,
          riskLevel: 'critical',
          resourceType,
          metadata: { action, authenticated: false }
        });
        return false;
      }

      // Check if user has admin role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const isAdmin = userRole?.role === 'admin';
      
      await logEnhancedSecurityEvent({
        eventType: 'admin_action',
        description: `Admin action: ${action}`,
        riskLevel: isAdmin ? 'medium' : 'critical',
        resourceType,
        metadata: { 
          action, 
          isAdmin, 
          userId: user.id,
          authorized: isAdmin 
        }
      });

      return isAdmin;
    } catch (error) {
      console.error('Admin validation error:', error);
      return false;
    }
  };

  return {
    logEnhancedSecurityEvent,
    checkEnhancedRateLimit,
    maskSensitiveData,
    validateAdminAction
  };
};
