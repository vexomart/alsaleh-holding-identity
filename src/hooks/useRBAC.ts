/**
 * useRBAC Hook - Phase 0.5
 * Role-Based Access Control hook for permission checks
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
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

interface UserPermissions {
  roles: AppRole[];
  permissions: string[];
}

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

  const fetchUserPermissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoles([]);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        setIsLoading(false);
        return;
      }

      const fetchedRoles = (userRoles || []).map(r => r.role as AppRole);
      setRoles(fetchedRoles);

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
          setIsLoading(false);
          return;
        }

        const fetchedPermissions = (rolePerms || [])
          .map(rp => (rp.permissions as unknown as { name: string })?.name)
          .filter((name): name is string => !!name);

        // Remove duplicates
        setPermissions([...new Set(fetchedPermissions)]);
      } else {
        setPermissions([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPermissions();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          fetchUserPermissions();
        } else if (event === 'SIGNED_OUT') {
          setRoles([]);
          setPermissions([]);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserPermissions]);

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
    refresh: fetchUserPermissions,
  };
};
