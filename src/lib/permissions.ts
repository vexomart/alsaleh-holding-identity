/**
 * Permission Helpers - Phase 0.5
 * Utility functions for permission checks
 */

import type { AppRole } from '@/types/auth';
import type { PermissionKey } from '@/constants/permissions';
import { ADMIN_ROLES, ROLE_HIERARCHY, isAdminRole, isStaffRole } from '@/constants/roles';

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  userPermissions: string[],
  permission: PermissionKey
): boolean => {
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  userPermissions: string[],
  permissions: PermissionKey[]
): boolean => {
  return permissions.some(perm => userPermissions.includes(perm));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  userPermissions: string[],
  permissions: PermissionKey[]
): boolean => {
  return permissions.every(perm => userPermissions.includes(perm));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (
  userRoles: AppRole[],
  role: AppRole
): boolean => {
  return userRoles.includes(role);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (
  userRoles: AppRole[],
  roles: AppRole[]
): boolean => {
  return roles.some(role => userRoles.includes(role));
};

/**
 * Check if user can access admin area
 */
export const canAccessAdmin = (userRoles: AppRole[]): boolean => {
  return userRoles.some(role => isAdminRole(role) || isStaffRole(role));
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (userRoles: AppRole[]): boolean => {
  return userRoles.includes('super_admin');
};

/**
 * Check if user is admin or super admin
 */
export const isAdmin = (userRoles: AppRole[]): boolean => {
  return userRoles.some(role => ADMIN_ROLES.includes(role));
};

/**
 * Check if user role is higher or equal to target role
 */
export const isRoleHigherOrEqual = (
  userRole: AppRole,
  targetRole: AppRole
): boolean => {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const targetIndex = ROLE_HIERARCHY.indexOf(targetRole);
  return userIndex >= targetIndex;
};

/**
 * Get user's highest role from array
 */
export const getHighestRole = (roles: AppRole[]): AppRole | null => {
  if (roles.length === 0) return null;
  
  let highest = roles[0];
  for (const role of roles) {
    if (isRoleHigherOrEqual(role, highest)) {
      highest = role;
    }
  }
  return highest;
};

/**
 * Filter permissions by module
 */
export const filterPermissionsByModule = (
  permissions: string[],
  module: string
): string[] => {
  return permissions.filter(perm => perm.startsWith(`${module}.`));
};
