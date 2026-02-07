/**
 * Realtime Hooks Index - V3 Unified
 * Export all realtime-related hooks for easy imports
 */

// ============================================
// V3 Unified Realtime (NEW - Preferred)
// ============================================
export { 
  useUnifiedRealtime,
  broadcastSyncEvent,
  broadcastForceRefresh,
  type SyncEvent,
  type SyncEventType,
} from './useUnifiedRealtime';

export {
  useCrossDashboardSync,
  useAdminDashboardSync,
  useCustomerDashboardSync,
} from './useCrossDashboardSync';

// ============================================
// Legacy Hooks (Maintained for compatibility)
// ============================================
export { useRealtime } from '../useRealtime';
export type { RealtimeEvent, RealtimePayload } from '../useRealtime';

export { useServicesRealtime } from '../useServicesRealtime';
export { useInvoicesRealtime } from '../useInvoicesRealtime';
export { useAdminDeliveryConfirmation, sendDeliveryConfirmation } from '../useAdminDeliveryConfirmation';
export { useCustomerRealtime } from '../useCustomerRealtime';
export { useAdminRealtime } from '../useAdminRealtime';
export { 
  useWalletRealtime, 
  broadcastWalletEvent, 
  broadcastTransactionEvent, 
  broadcastBankTransferEvent 
} from '../useWalletRealtime';
export { 
  useNotificationsRealtime, 
  broadcastNotificationEvent 
} from '../useNotificationsRealtime';
export type { 
  NotificationBroadcastEvent, 
  NotificationBroadcastPayload 
} from '../useNotificationsRealtime';

export type {
  ServiceEventType,
  ServiceEventPayload,
  InvoiceEventType,
  InvoiceEventPayload,
  CustomerNotificationEvent,
  CustomerNotificationPayload,
  DeliveryConfirmation,
  WalletEventType,
  WalletEventPayload,
  TransactionEventType,
  TransactionEventPayload,
  BankTransferEventType,
  BankTransferEventPayload,
  RealtimeEventType,
} from '@/types/realtime-events';
