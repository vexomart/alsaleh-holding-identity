/**
 * Routes Constants - Phase 0.5
 */

export const ROUTES = {
  // Public
  HOME: '/',
  
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Admin Dashboard
  ADMIN: {
    ROOT: '/admin',
    OVERVIEW: '/admin',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    SERVICES: '/admin/services',
    ORDERS: '/admin/orders',
    WALLETS: '/admin/wallets',
    CMS: {
      ROOT: '/admin/cms',
      PAGES: '/admin/cms/pages',
      MENUS: '/admin/cms/menus',
      MEDIA: '/admin/cms/media',
    },
    REPORTS: '/admin/reports',
    AUDIT: '/admin/audit',
    NOTIFICATIONS: '/admin/notifications',
    SETTINGS: '/admin/settings',
  },
  
  // Customer App
  APP: {
    ROOT: '/app',
    OVERVIEW: '/app',
    ORDERS: '/app/orders',
    ORDER_DETAIL: (id: string) => `/app/orders/${id}`,
    SERVICES: '/app/services',
    WALLET: '/app/wallet',
    PROFILE: '/app/profile',
    NOTIFICATIONS: '/app/notifications',
    SUPPORT: '/app/support',
  },
} as const;

// Route guards configuration
export const ROUTE_GUARDS = {
  // Public routes - no auth required
  PUBLIC: [ROUTES.HOME],
  
  // Guest only routes - redirect to dashboard if logged in
  GUEST_ONLY: [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.FORGOT_PASSWORD,
  ],
  
  // Auth required - redirect to login if not logged in
  AUTH_REQUIRED: [
    ROUTES.AUTH.LOGOUT,
    ROUTES.AUTH.RESET_PASSWORD,
  ],
  
  // Admin routes - require admin/super_admin role
  ADMIN: [ROUTES.ADMIN.ROOT],
  
  // App routes - require any authenticated user
  APP: [ROUTES.APP.ROOT],
} as const;
