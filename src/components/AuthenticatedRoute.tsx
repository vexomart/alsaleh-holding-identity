import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { Loader2 } from 'lucide-react';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth'
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const { logSecurityEvent } = useSecurityAudit();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          await logSecurityEvent({
            eventType: 'unauthorized_access_attempt',
            description: 'Failed to verify authentication',
            metadata: { error: error.message }
          });
          setLoading(false);
          return;
        }

        setUser(user);

        if (user && requiredRole) {
          // Check user role
          const { data: userRole, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (roleError || !userRole || userRole.role !== requiredRole) {
            await logSecurityEvent({
              eventType: 'unauthorized_access_attempt',
              description: `User attempted to access ${requiredRole}-only content`,
              metadata: { 
                userRole: userRole?.role || 'none',
                requiredRole 
              },
              userId: user.id
            });
            setHasRequiredRole(false);
          } else {
            setHasRequiredRole(true);
          }
        } else {
          setHasRequiredRole(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        await logSecurityEvent({
          eventType: 'unauthorized_access_attempt',
          description: 'Authentication check failed',
          metadata: { error: String(error) }
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, logSecurityEvent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مسموح</h1>
          <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};