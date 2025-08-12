import { supabase } from "@/integrations/supabase/client";

export type SecurityEventType = 
  | 'login_attempt'
  | 'login_success' 
  | 'login_failure'
  | 'payment_initiated'
  | 'sensitive_data_access'
  | 'contract_creation'
  | 'admin_action'
  | 'unauthorized_access_attempt';

interface SecurityEvent {
  eventType: SecurityEventType;
  description: string;
  metadata?: Record<string, any>;
  userId?: string;
}

export const useSecurityAudit = () => {
  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get client information safely
      const userAgent = navigator.userAgent;
      
      await supabase.from('user_activity_logs').insert({
        user_id: event.userId || user?.id,
        activity_type: event.eventType,
        description: event.description,
        metadata: {
          ...event.metadata,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: userAgent.substring(0, 200) // Limit user agent length
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  return { logSecurityEvent };
};