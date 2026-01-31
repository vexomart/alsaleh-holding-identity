/**
 * Financial Audit Logger - PHASE FIN-4
 * Centralized audit logging for financial operations
 */

import { supabase } from '@/integrations/supabase/client';
import type { TransactionEventType } from './status-machine';
import { requiresAuditLog } from './status-machine';
import type { Json } from '@/integrations/supabase/types';

export interface AuditLogParams {
  transactionId: string;
  eventType: TransactionEventType;
  previousStatus?: string;
  newStatus?: string;
  metadata?: Record<string, unknown>;
  providerPayload?: Record<string, unknown>;
  performedBy?: string;
}

/**
 * Log a financial transaction event (via RPC)
 */
export async function logTransactionEvent(params: AuditLogParams): Promise<{ 
  success: boolean; 
  eventId?: string; 
  error?: string 
}> {
  try {
    const { data, error } = await supabase.rpc('log_transaction_event', {
      p_transaction_id: params.transactionId,
      p_event_type: params.eventType,
      p_previous_status: params.previousStatus || null,
      p_new_status: params.newStatus || null,
      p_metadata: (params.metadata || {}) as Json,
      p_provider_payload: sanitizeProviderPayload(params.providerPayload) as Json,
      p_performed_by: params.performedBy || null,
    });

    if (error) throw error;

    // If this action requires main audit log, also log there
    if (requiresAuditLog(params.eventType)) {
      await logToMainAuditTable({
        action: mapEventToAuditAction(params.eventType),
        tableName: 'financial_transactions',
        recordId: params.transactionId,
        oldData: params.previousStatus ? { status: params.previousStatus } : null,
        newData: params.newStatus ? { status: params.newStatus } : null,
        metadata: {
          event_type: params.eventType,
          ...params.metadata,
        },
      });
    }

    return { success: true, eventId: data as string };
  } catch (error) {
    console.error('[Financial Audit] Failed to log event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Sanitize provider payload to remove sensitive data
 */
function sanitizeProviderPayload(
  payload?: Record<string, unknown>
): Record<string, unknown> | null {
  if (!payload) return null;

  // Fields to redact
  const sensitiveFields = [
    'secret',
    'password',
    'api_key',
    'apiKey',
    'token',
    'access_token',
    'card_number',
    'cvv',
    'cvc',
    'expiry',
    'pan',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeProviderPayload(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Map transaction event type to audit action
 */
function mapEventToAuditAction(eventType: TransactionEventType): 'create' | 'update' | 'delete' {
  switch (eventType) {
    case 'created':
      return 'create';
    case 'cancelled_by_user':
    case 'cancelled_by_admin':
      return 'delete';
    default:
      return 'update';
  }
}

/**
 * Log to main audit_logs table
 */
async function logToMainAuditTable(params: {
  action: string;
  tableName: string;
  recordId: string;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      action: params.action as 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export',
      table_name: params.tableName,
      record_id: params.recordId,
      old_data: (params.oldData || null) as Json,
      new_data: (params.newData || null) as Json,
      metadata: (params.metadata || {}) as Json,
    });

    if (error) {
      console.warn('[Financial Audit] Failed to log to audit_logs:', error);
    }
  } catch (error) {
    console.warn('[Financial Audit] Error logging to audit_logs:', error);
  }
}

/**
 * Log manual adjustment action (requires audit)
 */
export async function logManualAdjustment(params: {
  transactionId: string;
  adjustmentType: 'status_override' | 'amount_correction' | 'refund_manual';
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  performedBy: string;
}): Promise<{ success: boolean; error?: string }> {
  return logTransactionEvent({
    transactionId: params.transactionId,
    eventType: 'manual_adjustment',
    metadata: {
      adjustment_type: params.adjustmentType,
      previous_value: params.previousValue,
      new_value: params.newValue,
      reason: params.reason,
      performed_by: params.performedBy,
      timestamp: new Date().toISOString(),
    },
    performedBy: params.performedBy,
  });
}

/**
 * Log refund action (requires audit)
 */
export async function logRefundAction(params: {
  transactionId: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  performedBy: string;
  isInitiation?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  return logTransactionEvent({
    transactionId: params.transactionId,
    eventType: params.isInitiation ? 'refund_initiated' : 'refund_completed',
    previousStatus: 'succeeded',
    newStatus: params.isInitiation ? 'succeeded' : 'refunded',
    metadata: {
      original_amount: params.originalAmount,
      refund_amount: params.refundAmount,
      reason: params.reason,
      performed_by: params.performedBy,
      timestamp: new Date().toISOString(),
    },
    performedBy: params.performedBy,
  });
}

/**
 * Log payment flow events (from edge functions)
 */
export async function logPaymentFlowEvent(params: {
  transactionId: string;
  eventType: 'paylink_invoice_created' | 'customer_redirected' | 'webhook_received' | 'verified';
  providerPayload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  return logTransactionEvent({
    transactionId: params.transactionId,
    eventType: params.eventType,
    providerPayload: params.providerPayload,
    metadata: params.metadata,
  });
}
