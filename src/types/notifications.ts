/**
 * Notifications Types - Enterprise Proactive System
 */

export type NotificationType = 
  | 'info' 
  | 'warning' 
  | 'success' 
  | 'error' 
  | 'system'
  | 'invoice_due'
  | 'payment_failed'
  | 'low_wallet_balance'
  | 'order_status_changed'
  | 'order_delayed'
  | 'contract_pending_signature'
  | 'contract_signed'
  | 'contract_expired'
  | 'admin_message';

export type NotificationSeverity = 'info' | 'warning' | 'critical';

export type NotificationRoleTarget = 'admin' | 'customer' | 'all';

export interface Notification {
  id: string;
  tenant_id: string | null;
  user_id: string | null;
  type: NotificationType;
  severity: NotificationSeverity;
  role_target: NotificationRoleTarget;
  title: string;
  title_ar: string | null;
  title_en: string | null;
  message: string | null;
  message_ar: string | null;
  body_ar: string | null;
  body_en: string | null;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  source_type: string | null;
  source_id: string | null;
  scheduled_for: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface CreateNotificationRequest {
  user_id?: string;
  tenant_id?: string;
  type: NotificationType;
  severity?: NotificationSeverity;
  role_target?: NotificationRoleTarget;
  title: string;
  title_ar?: string;
  title_en?: string;
  message?: string;
  message_ar?: string;
  body_ar?: string;
  body_en?: string;
  link?: string;
  source_type?: string;
  source_id?: string;
}

export interface UpdateNotificationRequest {
  is_read: boolean;
}

export interface NotificationFilters {
  is_read?: boolean;
  type?: NotificationType;
  severity?: NotificationSeverity;
  role_target?: NotificationRoleTarget;
}

// Severity color mapping
export const severityColors: Record<NotificationSeverity, {
  bg: string;
  text: string;
  border: string;
}> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
};

// Type icon mapping
export const notificationTypeIcons: Record<NotificationType, string> = {
  info: 'Info',
  warning: 'AlertTriangle',
  success: 'CheckCircle',
  error: 'XCircle',
  system: 'Settings',
  invoice_due: 'Receipt',
  payment_failed: 'CreditCard',
  low_wallet_balance: 'Wallet',
  order_status_changed: 'Package',
  order_delayed: 'Clock',
  contract_pending_signature: 'FileSignature',
  contract_signed: 'FileCheck',
  contract_expired: 'FileX',
  admin_message: 'MessageSquare',
};
