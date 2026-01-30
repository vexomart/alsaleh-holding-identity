/**
 * Notifications Types - Phase 0.5
 */

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system';

export interface Notification {
  id: string;
  tenant_id: string | null;
  user_id: string;
  type: NotificationType;
  title: string;
  title_ar: string | null;
  message: string | null;
  message_ar: string | null;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface CreateNotificationRequest {
  user_id: string;
  type: NotificationType;
  title: string;
  title_ar?: string;
  message?: string;
  message_ar?: string;
  link?: string;
}

export interface UpdateNotificationRequest {
  is_read: boolean;
}

export interface NotificationFilters {
  is_read?: boolean;
  type?: NotificationType;
}
