/**
 * Real-time Event Definitions
 * Minimal payloads for efficient synchronization
 */

// Service Events
export type ServiceEventType = 
  | 'service.created'
  | 'service.updated'
  | 'service.deleted'
  | 'service.reordered'
  | 'service.visibility_changed';

export interface ServiceEventPayload {
  event: ServiceEventType;
  service_id: string;
  tenant_id?: string;
  timestamp: string;
  // Minimal data - clients refetch full data
  changes?: {
    field: string;
    old_value?: unknown;
    new_value?: unknown;
  }[];
}

// Invoice Events
export type InvoiceEventType =
  | 'invoice.generated'
  | 'invoice.status_changed'
  | 'invoice.paid'
  | 'invoice.cancelled';

export interface InvoiceEventPayload {
  event: InvoiceEventType;
  invoice_id: string;
  order_id?: string;
  customer_id: string;
  tenant_id?: string;
  timestamp: string;
  status?: string;
  previous_status?: string;
  amount?: number;
}

// Notification Events for Customer Dashboard
export type CustomerNotificationEvent =
  | 'notification.service_updated'
  | 'notification.invoice_ready'
  | 'notification.order_status';

export interface CustomerNotificationPayload {
  event: CustomerNotificationEvent;
  user_id: string;
  title: string;
  title_ar?: string;
  message?: string;
  message_ar?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

// Admin Delivery Confirmation
export interface DeliveryConfirmation {
  event_type: string;
  target_user_id: string;
  delivered_at: string;
  acknowledged: boolean;
}

// Combined Event Types
export type RealtimeEventType = ServiceEventType | InvoiceEventType | CustomerNotificationEvent;

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
  tenant_id?: string;
}
