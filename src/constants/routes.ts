/**
 * Routes Constants - Restructured
 * /adminash - لوحة الإدارة
 * /portal - بوابة العملاء
 */

export const ROUTES = {
  // Public
  HOME: '/',
  
  // Auth
  AUTH: {
    ENTRY: '/entry',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Admin Dashboard - /adminash
  ADMIN: {
    ROOT: '/adminash',
    OVERVIEW: '/adminash',
    USERS: '/adminash/users',
    ROLES: '/adminash/roles',
    CLIENT_HUB: (id: string) => `/adminash/clients/${id}`,
    SERVICES: '/adminash/services',
    ORDERS: '/adminash/orders',
    CONTRACTS: '/adminash/contracts',
    WALLETS: '/adminash/wallets',
    FINANCE: '/adminash/finance',
    REFERRALS: '/adminash/referrals',
    INTEGRATIONS: '/adminash/integrations',
    CMS: {
      ROOT: '/adminash/cms',
      PAGES: '/adminash/cms/pages',
      MENUS: '/adminash/cms/menus',
      MEDIA: '/adminash/cms/media',
    },
    REPORTS: '/adminash/reports',
    AUDIT: '/adminash/audit',
    NOTIFICATIONS: '/adminash/notifications',
    SETTINGS: '/adminash/settings',
  },
  
  // Customer Dashboard - /portal
  DASHBOARD: {
    ROOT: '/portal',
    OVERVIEW: '/portal',
    CLIENT_HUB: '/portal/client-hub',
    ORDERS: '/portal/orders',
    ORDER_DETAIL: (id: string) => `/portal/orders/${id}`,
    SERVICES: '/portal/services',
    WALLET: '/portal/wallet',
    REFERRALS: '/portal/referrals',
    PROFILE: '/portal/profile',
    SECURITY: '/portal/security',
    NOTIFICATIONS: '/portal/notifications',
    SUPPORT: '/portal/support',
    CONTRACTS: '/portal/contracts',
    INVOICES: '/portal/invoices',
    FINANCE: '/portal/finance',
  },
} as const;

// Route guards configuration
export const ROUTE_GUARDS = {
  // Public routes - no auth required
  PUBLIC: [ROUTES.HOME],
  
  // Guest only routes - redirect to dashboard if logged in
  GUEST_ONLY: [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
  ],
  
  // Auth required - redirect to login if not logged in
  AUTH_REQUIRED: [
    ROUTES.AUTH.LOGOUT,
    ROUTES.AUTH.RESET_PASSWORD,
  ],
  
  // Admin routes - require admin/super_admin role
  ADMIN: [ROUTES.ADMIN.ROOT],
  
  // Dashboard routes - require any authenticated user
  DASHBOARD: [ROUTES.DASHBOARD.ROOT],
} as const;
