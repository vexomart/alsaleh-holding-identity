/**
 * Realtime Hooks Index
 * Export all realtime-related hooks for easy imports
 */

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
