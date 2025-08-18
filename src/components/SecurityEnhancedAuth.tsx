import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

export function SecurityEnhancedAuth() {
  const { logSecurityEvent } = useSecurityAudit();

  useEffect(() => {
    // Monitor authentication events for security purposes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const userAgent = navigator.userAgent;
        const timestamp = new Date().toISOString();

        switch (event) {
          case 'SIGNED_IN':
            await logSecurityEvent({
              eventType: 'login_success',
              description: 'User successfully signed in',
              metadata: {
                timestamp,
                userAgent: userAgent.substring(0, 200),
                sessionId: session?.access_token?.substring(0, 10) + '...',
                provider: session?.user?.app_metadata?.provider || 'email'
              },
              userId: session?.user?.id
            });
            break;

          case 'SIGNED_OUT':
            await logSecurityEvent({
              eventType: 'logout',
              description: 'User signed out',
              metadata: {
                timestamp,
                userAgent: userAgent.substring(0, 200)
              },
              userId: session?.user?.id
            });
            break;

          case 'TOKEN_REFRESHED':
            // Log token refresh for security monitoring
            await logSecurityEvent({
              eventType: 'token_refresh',
              description: 'User token refreshed',
              metadata: {
                timestamp,
                userAgent: userAgent.substring(0, 200)
              },
              userId: session?.user?.id
            });
            break;

          case 'USER_UPDATED':
            await logSecurityEvent({
              eventType: 'profile_update',
              description: 'User profile updated',
              metadata: {
                timestamp,
                userAgent: userAgent.substring(0, 200)
              },
              userId: session?.user?.id
            });
            break;

          default:
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [logSecurityEvent]);

  return null; // This is a monitoring component, no UI
}