/**
 * useRBAC Hook - Phase 0.5
 * Role-Based Access Control hook for permission checks
 * Fixed race condition: waits for auth session before fetching roles
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/auth';
import type { PermissionKey } from '@/constants/permissions';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasRole, 
  hasAnyRole,
  canAccessAdmin,
  isSuperAdmin,
  isAdmin,
} from '@/lib/permissions';

interface UseRBACReturn {
  // State
  roles: AppRole[];
  permissions: string[];
  isLoading: boolean;
  
  // Permission checks
  can: (permission: PermissionKey) => boolean;
  canAny: (permissions: PermissionKey[]) => boolean;
  canAll: (permissions: PermissionKey[]) => boolean;
  
  // Role checks
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  
  // Access checks
  canAccessAdmin: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  
  // Refresh
  refresh: () => Promise<void>;
}

export const useRBAC = (): UseRBACReturn => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const initializedRef = useRef(false);

  const fetchUserPermissions = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        if (isMountedRef.current) {
          setRoles([]);
          setPermissions([]);
          setIsLoading(false);
        }
        return;
      }

      const fetchedRoles = (userRoles || []).map(r => r.role as AppRole);
      
      if (isMountedRef.current) {
        setRoles(fetchedRoles);
      }

      // Fetch permissions based on roles
      if (fetchedRoles.length > 0) {
        const { data: rolePerms, error: permsError } = await supabase
          .from('role_permissions')
          .select(`
            permission_id,
            permissions!inner(name)
          `)
          .in('role', fetchedRoles);

        if (permsError) {
          console.error('Error fetching permissions:', permsError);
          if (isMountedRef.current) {
            setPermissions([]);
            setIsLoading(false);
          }
          return;
        }

        const fetchedPermissions = (rolePerms || [])
          .map(rp => (rp.permissions as unknown as { name: string })?.name)
          .filter((name): name is string => !!name);

        // Remove duplicates
        if (isMountedRef.current) {
          setPermissions([...new Set(fetchedPermissions)]);
        }
      } else {
        if (isMountedRef.current) {
          setPermissions([]);
        }
      }

      if (isMountedRef.current) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const clearPermissions = useCallback(() => {
    if (isMountedRef.current) {
      setRoles([]);
      setPermissions([]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMountedRef.current) return;

        if (event === 'SIGNED_OUT' || !session?.user) {
          clearPermissions();
          initializedRef.current = true;
          return;
        }

        // Handle session with user
        if (session?.user) {
          await fetchUserPermissions(session.user.id);
        }
        
        initializedRef.current = true;
      }
    );

    // Check for existing session immediately
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMountedRef.current) return;
      
      // Only process if not already initialized
      if (!initializedRef.current) {
        if (session?.user) {
          await fetchUserPermissions(session.user.id);
        } else {
          clearPermissions();
        }
        initializedRef.current = true;
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserPermissions, clearPermissions]);

  // Refresh function for manual re-fetch
  const refresh = useCallback(async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserPermissions(session.user.id);
    } else {
      clearPermissions();
    }
  }, [fetchUserPermissions, clearPermissions]);

  // Memoized permission check functions
  const can = useCallback(
    (permission: PermissionKey) => hasPermission(permissions, permission),
    [permissions]
  );

  const canAny = useCallback(
    (perms: PermissionKey[]) => hasAnyPermission(permissions, perms),
    [permissions]
  );

  const canAll = useCallback(
    (perms: PermissionKey[]) => hasAllPermissions(permissions, perms),
    [permissions]
  );

  const checkHasRole = useCallback(
    (role: AppRole) => hasRole(roles, role),
    [roles]
  );

  const checkHasAnyRole = useCallback(
    (targetRoles: AppRole[]) => hasAnyRole(roles, targetRoles),
    [roles]
  );

  // Computed access flags
  const accessAdmin = useMemo(() => canAccessAdmin(roles), [roles]);
  const superAdmin = useMemo(() => isSuperAdmin(roles), [roles]);
  const admin = useMemo(() => isAdmin(roles), [roles]);

  return {
    roles,
    permissions,
    isLoading,
    can,
    canAny,
    canAll,
    hasRole: checkHasRole,
    hasAnyRole: checkHasAnyRole,
    canAccessAdmin: accessAdmin,
    isSuperAdmin: superAdmin,
    isAdmin: admin,
    refresh,
  };
};
