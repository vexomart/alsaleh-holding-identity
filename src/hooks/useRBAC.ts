/**
 * useRBAC Hook - INSTANT Loading with Cache
 * Role-Based Access Control hook for permission checks
 * 
 * OPTIMIZATION: Uses localStorage cache for instant initial render
 * - Shows cached roles/permissions immediately
 * - Fetches fresh data in background
 * - No loading delay for cached users
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

const RBAC_CACHE_KEY = 'rbac_cache';

interface CachedRBAC {
  userId: string;
  roles: AppRole[];
  permissions: string[];
  timestamp: number;
}

// Get cached RBAC data synchronously
function getCachedRBAC(userId: string | null): { roles: AppRole[]; permissions: string[] } | null {
  if (!userId) return null;
  try {
    const cached = localStorage.getItem(RBAC_CACHE_KEY);
    if (cached) {
      const parsed: CachedRBAC = JSON.parse(cached);
      if (parsed.userId === userId) {
        return { roles: parsed.roles, permissions: parsed.permissions };
      }
    }
  } catch {}
  return null;
}

// Cache RBAC data
function cacheRBAC(userId: string, roles: AppRole[], permissions: string[]) {
  try {
    const data: CachedRBAC = { userId, roles, permissions, timestamp: Date.now() };
    localStorage.setItem(RBAC_CACHE_KEY, JSON.stringify(data));
  } catch {}
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
  const isMountedRef = useRef(true);
  const currentUserIdRef = useRef<string | null>(null);
  
  // INSTANT: Get initial user ID from localStorage session
  const getInitialUserId = (): string | null => {
    try {
      const storageKey = `sb-iuzzapnmiopbbjfravww-auth-token`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.id && parsed?.expires_at * 1000 > Date.now()) {
          return parsed.user.id;
        }
      }
    } catch {}
    return null;
  };
  
  const initialUserId = getInitialUserId();
  const cachedData = getCachedRBAC(initialUserId);
  
  // Start with cached data if available
  const [roles, setRoles] = useState<AppRole[]>(cachedData?.roles || []);
  const [permissions, setPermissions] = useState<string[]>(cachedData?.permissions || []);
  // Only loading if no cache
  const [isLoading, setIsLoading] = useState(!cachedData);

  const fetchUserPermissions = useCallback(async (userId: string): Promise<boolean> => {
    if (!isMountedRef.current) return false;
    
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
        }
        return false;
      }

      const fetchedRoles = (userRoles || []).map(r => r.role as AppRole);
      
      if (isMountedRef.current) {
        setRoles(fetchedRoles);
      }

      // Fetch permissions based on roles
      let fetchedPermissions: string[] = [];
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
          }
          return false;
        }

        fetchedPermissions = (rolePerms || [])
          .map(rp => (rp.permissions as unknown as { name: string })?.name)
          .filter((name): name is string => !!name);

        // Remove duplicates
        fetchedPermissions = [...new Set(fetchedPermissions)];
        
        if (isMountedRef.current) {
          setPermissions(fetchedPermissions);
        }
      } else {
        if (isMountedRef.current) {
          setPermissions([]);
        }
      }

      // Cache the results
      cacheRBAC(userId, fetchedRoles, fetchedPermissions);

      return true;
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      return false;
    }
  }, []);

  const clearPermissions = useCallback(() => {
    if (isMountedRef.current) {
      setRoles([]);
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let initialLoadComplete = false;

    // INITIAL LOAD - Fetch fresh data (cache already loaded in state)
    const initializeRBAC = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMountedRef.current) return;

        if (session?.user) {
          currentUserIdRef.current = session.user.id;
          await fetchUserPermissions(session.user.id);
        } else {
          currentUserIdRef.current = null;
          clearPermissions();
        }
      } catch (error) {
        console.error('Error initializing RBAC:', error);
        // Keep cached data on error
      } finally {
        initialLoadComplete = true;
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // ONGOING AUTH CHANGES
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMountedRef.current) return;

        // Handle sign out immediately
        if (event === 'SIGNED_OUT' || !session?.user) {
          currentUserIdRef.current = null;
          clearPermissions();
          // Clear cache on sign out
          localStorage.removeItem(RBAC_CACHE_KEY);
          setIsLoading(false);
          return;
        }

        // Skip if same user (avoid re-fetching on token refresh)
        if (session?.user && currentUserIdRef.current === session.user.id && initialLoadComplete) {
          return;
        }

        // New user signed in
        if (session?.user) {
          currentUserIdRef.current = session.user.id;
          await fetchUserPermissions(session.user.id);
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        }
      }
    );

    // Start initial load
    initializeRBAC();

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
    if (isMountedRef.current) {
      setIsLoading(false);
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
