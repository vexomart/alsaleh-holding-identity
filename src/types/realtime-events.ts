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
  | 'payment.failed'
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

// Wallet Events (PHASE WALLET-1)
export type WalletEventType =
  | 'wallet.created'
  | 'wallet.updated'
  | 'wallet.balance_changed';

export interface WalletEventPayload {
  event: WalletEventType;
  wallet_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  balance?: number;
  previous_balance?: number;
}

// Transaction Events (PHASE WALLET-1)
export type TransactionEventType =
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.succeeded'
  | 'transaction.failed';

export interface TransactionEventPayload {
  event: TransactionEventType;
  transaction_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  amount?: number;
  status?: string;
  previous_status?: string;
}

// Bank Transfer Events (PHASE WALLET-1)
export type BankTransferEventType =
  | 'bank_transfer.submitted'
  | 'bank_transfer.under_review'
  | 'bank_transfer.approved'
  | 'bank_transfer.rejected';

export interface BankTransferEventPayload {
  event: BankTransferEventType;
  transfer_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

// Combined Event Types
export type RealtimeEventType = 
  | ServiceEventType 
  | InvoiceEventType 
  | CustomerNotificationEvent
  | WalletEventType
  | TransactionEventType
  | BankTransferEventType;

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
  tenant_id?: string;
}
