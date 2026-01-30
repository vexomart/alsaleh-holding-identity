/**
 * Roles Constants - Phase 0.5
 * All role definitions in the system
 */

import type { AppRole } from '@/types/auth';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  SUPPORT: 'support',
  FINANCE: 'finance',
  CONTENT_EDITOR: 'content_editor',
  CUSTOMER: 'customer',
} as const;

export type RoleKey = typeof ROLES[keyof typeof ROLES];

// Role hierarchy (higher index = higher privilege)
export const ROLE_HIERARCHY: AppRole[] = [
  'customer',
  'staff',
  'content_editor',
  'support',
  'finance',
  'manager',
  'admin',
  'super_admin',
];

// Admin roles (have access to /admin)
export const ADMIN_ROLES: AppRole[] = ['super_admin', 'admin'];

// Staff roles (have access to /admin with limited permissions)
export const STAFF_ROLES: AppRole[] = ['manager', 'support', 'finance', 'content_editor', 'staff'];

// Customer roles (have access to /app only)
export const CUSTOMER_ROLES: AppRole[] = ['customer'];

// Role labels for UI
export const ROLE_LABELS: Record<AppRole, { en: string; ar: string }> = {
  super_admin: { en: 'Super Admin', ar: 'مدير عام' },
  admin: { en: 'Admin', ar: 'مدير' },
  manager: { en: 'Manager', ar: 'مدير تنفيذي' },
  staff: { en: 'Staff', ar: 'موظف' },
  support: { en: 'Support', ar: 'دعم فني' },
  finance: { en: 'Finance', ar: 'مالية' },
  content_editor: { en: 'Content Editor', ar: 'محرر محتوى' },
  customer: { en: 'Customer', ar: 'عميل' },
};

// Check if role is admin level
export const isAdminRole = (role: AppRole): boolean => {
  return ADMIN_ROLES.includes(role);
};

// Check if role is staff level (can access admin area)
export const isStaffRole = (role: AppRole): boolean => {
  return STAFF_ROLES.includes(role) || ADMIN_ROLES.includes(role);
};

// Compare role hierarchy
export const compareRoles = (roleA: AppRole, roleB: AppRole): number => {
  const indexA = ROLE_HIERARCHY.indexOf(roleA);
  const indexB = ROLE_HIERARCHY.indexOf(roleB);
  return indexA - indexB;
};

// Get highest role from array
export const getHighestRole = (roles: AppRole[]): AppRole | null => {
  if (roles.length === 0) return null;
  return roles.reduce((highest, current) => 
    compareRoles(current, highest) > 0 ? current : highest
  );
};
