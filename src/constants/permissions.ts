/**
 * Permission Constants - Phase 0.5
 * All permission keys defined in the system
 */

export const PERMISSIONS = {
  // Users module
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Roles module
  ROLES_VIEW: 'roles.view',
  ROLES_EDIT: 'roles.edit',
  
  // Services module
  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_EDIT: 'services.edit',
  SERVICES_DELETE: 'services.delete',
  
  // Orders module
  ORDERS_VIEW_ALL: 'orders.view_all',
  ORDERS_VIEW_OWN: 'orders.view_own',
  ORDERS_CREATE: 'orders.create',
  ORDERS_EDIT_STATUS: 'orders.edit_status',
  ORDERS_ASSIGN: 'orders.assign',
  ORDERS_EXPORT: 'orders.export',
  
  // CMS module
  CMS_PAGES_VIEW: 'cms.pages.view',
  CMS_PAGES_CREATE: 'cms.pages.create',
  CMS_PAGES_EDIT: 'cms.pages.edit',
  CMS_PAGES_PUBLISH: 'cms.pages.publish',
  CMS_MENUS_EDIT: 'cms.menus.edit',
  CMS_MEDIA_UPLOAD: 'cms.media.upload',
  
  // Reports module
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // Notifications module
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_SEND: 'notifications.send',
  
  // Audit module
  AUDIT_VIEW: 'audit.view',
  
  // Settings module
  SETTINGS_EDIT: 'settings.edit',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  users: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE],
  roles: [PERMISSIONS.ROLES_VIEW, PERMISSIONS.ROLES_EDIT],
  services: [PERMISSIONS.SERVICES_VIEW, PERMISSIONS.SERVICES_CREATE, PERMISSIONS.SERVICES_EDIT, PERMISSIONS.SERVICES_DELETE],
  orders: [PERMISSIONS.ORDERS_VIEW_ALL, PERMISSIONS.ORDERS_VIEW_OWN, PERMISSIONS.ORDERS_CREATE, PERMISSIONS.ORDERS_EDIT_STATUS, PERMISSIONS.ORDERS_ASSIGN, PERMISSIONS.ORDERS_EXPORT],
  cms: [PERMISSIONS.CMS_PAGES_VIEW, PERMISSIONS.CMS_PAGES_CREATE, PERMISSIONS.CMS_PAGES_EDIT, PERMISSIONS.CMS_PAGES_PUBLISH, PERMISSIONS.CMS_MENUS_EDIT, PERMISSIONS.CMS_MEDIA_UPLOAD],
  reports: [PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_EXPORT],
  notifications: [PERMISSIONS.NOTIFICATIONS_VIEW, PERMISSIONS.NOTIFICATIONS_SEND],
  audit: [PERMISSIONS.AUDIT_VIEW],
  settings: [PERMISSIONS.SETTINGS_EDIT],
} as const;
