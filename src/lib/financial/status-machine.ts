/**
 * Financial Transaction Status Machine - PHASE FIN-4
 * Defines valid status transitions for financial transactions
 */

export type TransactionStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type TransactionType = 
  | 'invoice_payment'
  | 'refund'
  | 'topup'
  | 'withdrawal'
  | 'adjustment'
  | 'transfer'
  | 'fee';

export type TransactionEventType =
  | 'created'
  | 'paylink_invoice_created'
  | 'customer_redirected'
  | 'webhook_received'
  | 'verified'
  | 'status_changed'
  | 'manual_adjustment'
  | 'refund_initiated'
  | 'refund_completed'
  | 'cancelled_by_user'
  | 'cancelled_by_admin'
  | 'payment_timeout'
  | 'retry_initiated';

/**
 * Status Machine Configuration
 * Defines valid transitions from each status
 */
export const STATUS_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  pending: ['processing', 'cancelled', 'failed'],
  processing: ['succeeded', 'failed', 'cancelled'],
  succeeded: ['refunded'], // Only for invoice_payment and topup
  failed: ['pending'], // Allow retry
  refunded: [], // Terminal state
  cancelled: [], // Terminal state
};

/**
 * Terminal states that cannot transition further
 */
export const TERMINAL_STATES: TransactionStatus[] = ['refunded', 'cancelled'];

/**
 * States that allow refund
 */
export const REFUNDABLE_TYPES: TransactionType[] = ['invoice_payment', 'topup'];

/**
 * Check if a status transition is valid
 */
export function isValidTransition(
  currentStatus: TransactionStatus,
  newStatus: TransactionStatus,
  transactionType?: TransactionType
): boolean {
  // If transitioning to refunded, check if type allows it
  if (newStatus === 'refunded') {
    if (currentStatus !== 'succeeded') return false;
    if (transactionType && !REFUNDABLE_TYPES.includes(transactionType)) return false;
    return true;
  }

  const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions?.includes(newStatus) ?? false;
}

/**
 * Get allowed transitions for a given status
 */
export function getAllowedTransitions(
  currentStatus: TransactionStatus,
  transactionType?: TransactionType
): TransactionStatus[] {
  const transitions = [...(STATUS_TRANSITIONS[currentStatus] || [])];
  
  // Filter out refunded if type doesn't allow it
  if (currentStatus === 'succeeded' && transactionType && !REFUNDABLE_TYPES.includes(transactionType)) {
    return transitions.filter(t => t !== 'refunded');
  }
  
  return transitions;
}

/**
 * Check if a status is terminal (no further transitions)
 */
export function isTerminalStatus(status: TransactionStatus): boolean {
  return TERMINAL_STATES.includes(status);
}

/**
 * Status labels for UI
 */
export const STATUS_LABELS: Record<TransactionStatus, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  processing: { ar: 'قيد المعالجة', en: 'Processing' },
  succeeded: { ar: 'مكتمل', en: 'Succeeded' },
  failed: { ar: 'فشل', en: 'Failed' },
  refunded: { ar: 'مسترد', en: 'Refunded' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

/**
 * Event type labels for timeline UI
 */
export const EVENT_LABELS: Record<TransactionEventType, { ar: string; en: string }> = {
  created: { ar: 'تم إنشاء المعاملة', en: 'Transaction Created' },
  paylink_invoice_created: { ar: 'تم إنشاء فاتورة Paylink', en: 'Paylink Invoice Created' },
  customer_redirected: { ar: 'تم توجيه العميل للدفع', en: 'Customer Redirected to Payment' },
  webhook_received: { ar: 'تم استلام تأكيد الدفع', en: 'Payment Webhook Received' },
  verified: { ar: 'تم التحقق من الدفع', en: 'Payment Verified' },
  status_changed: { ar: 'تغيير حالة المعاملة', en: 'Status Changed' },
  manual_adjustment: { ar: 'تعديل يدوي', en: 'Manual Adjustment' },
  refund_initiated: { ar: 'بدء الاسترداد', en: 'Refund Initiated' },
  refund_completed: { ar: 'اكتمال الاسترداد', en: 'Refund Completed' },
  cancelled_by_user: { ar: 'إلغاء بواسطة المستخدم', en: 'Cancelled by User' },
  cancelled_by_admin: { ar: 'إلغاء بواسطة المسؤول', en: 'Cancelled by Admin' },
  payment_timeout: { ar: 'انتهاء مهلة الدفع', en: 'Payment Timeout' },
  retry_initiated: { ar: 'إعادة المحاولة', en: 'Retry Initiated' },
};

/**
 * Transaction type labels
 */
export const TYPE_LABELS: Record<TransactionType, { ar: string; en: string }> = {
  invoice_payment: { ar: 'دفع فاتورة', en: 'Invoice Payment' },
  refund: { ar: 'استرداد', en: 'Refund' },
  topup: { ar: 'شحن رصيد', en: 'Top Up' },
  withdrawal: { ar: 'سحب', en: 'Withdrawal' },
  adjustment: { ar: 'تعديل', en: 'Adjustment' },
  transfer: { ar: 'تحويل', en: 'Transfer' },
  fee: { ar: 'رسوم', en: 'Fee' },
};

/**
 * Audit-requiring actions
 */
export const AUDIT_REQUIRED_ACTIONS = [
  'manual_adjustment',
  'refund_initiated',
  'refund_completed',
  'cancelled_by_admin',
  'status_changed',
] as const;

export type AuditRequiredAction = typeof AUDIT_REQUIRED_ACTIONS[number];

/**
 * Check if an action requires audit logging
 */
export function requiresAuditLog(eventType: TransactionEventType): boolean {
  return AUDIT_REQUIRED_ACTIONS.includes(eventType as AuditRequiredAction);
}
