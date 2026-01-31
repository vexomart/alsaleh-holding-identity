/**
 * Financial Module Index - PHASE FIN-4
 * Re-exports all financial utilities
 */

// Status machine
export {
  STATUS_TRANSITIONS,
  TERMINAL_STATES,
  REFUNDABLE_TYPES,
  STATUS_LABELS,
  TYPE_LABELS,
  EVENT_LABELS,
  AUDIT_REQUIRED_ACTIONS,
  isValidTransition,
  getAllowedTransitions,
  isTerminalStatus,
  requiresAuditLog,
} from './status-machine';

export type {
  TransactionStatus,
  TransactionType,
  TransactionEventType,
  AuditRequiredAction,
} from './status-machine';

// Export utilities
export {
  exportTransactionsToCSV,
  downloadCSV,
  calculateTransactionSummary,
  generateTransactionReportDefinition,
} from './export-utils';

export type {
  ExportTransaction,
  ExportOptions,
  TransactionSummary,
} from './export-utils';

// Audit logger
export {
  logTransactionEvent,
  logManualAdjustment,
  logRefundAction,
  logPaymentFlowEvent,
} from './audit-logger';

export type {
  AuditLogParams,
} from './audit-logger';
