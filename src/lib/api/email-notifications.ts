/**
 * Unified Notifications API
 * Email + SMS notifications for all events
 */

import { supabase } from '@/integrations/supabase/client';

// Types for email notifications
export interface OrderEmailData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  serviceNameAr?: string;
  totalAmount: number;
  currency?: string;
  status: string;
  previousStatus?: string;
  notes?: string;
  notesAr?: string;
}

export interface ContractEmailData {
  contractId: string;
  contractNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  serviceNameAr?: string;
  totalAmount: number;
  currency?: string;
  eventType: 'created' | 'admin_approved' | 'pending_signature' | 'signed' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  signingUrl?: string;
}

export interface InvoiceEmailData {
  invoiceId: string;
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  currency?: string;
  dueDate?: string;
  eventType: 'issued' | 'reminder' | 'paid' | 'overdue' | 'cancelled';
  paymentUrl?: string;
  orderNumber?: string;
}

export interface FinanceEmailData {
  applicationId?: string;
  applicationNumber?: string;
  contractId?: string;
  contractNumber?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  entityName: string;
  amountSar: number;
  tenorMonths?: number;
  eventType: 'application_submitted' | 'under_review' | 'offer_ready' | 'approved' | 'rejected' | 'contract_ready' | 'disbursed' | 'payment_reminder' | 'payment_received';
  offerDetails?: {
    monthlyPayment: number;
    totalPayable: number;
    aprPercent: number;
  };
  rejectionReason?: string;
  installmentNumber?: number;
  installmentAmount?: number;
  dueDate?: string;
}

// NOTE: SMS notifications are now handled automatically by database triggers:
// - order_status_sms_trigger (orders table)
// - contract_status_sms_trigger (contracts table)
// - finance_app_status_sms_trigger (finance_applications table)
// - finance_contract_status_sms_trigger (finance_contracts table)
// - wallet_transaction_sms_trigger (financial_transactions table)

/**
 * Send order status change email
 * NOTE: SMS is now handled automatically by database triggers
 */
export async function sendOrderStatusEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email only - SMS is handled by database trigger on orders table
    const { data: result, error } = await supabase.functions.invoke('order-status-email', {
      body: data,
    });

    if (error) {
      console.error('Order email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Order email sent:', result);
    // SMS is automatically triggered by database trigger (order_status_sms_trigger)
    return { success: true };
  } catch (err) {
    console.error('Order email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send contract notification email
 * NOTE: SMS is now handled automatically by database triggers
 */
export async function sendContractEmail(data: ContractEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email only - SMS is handled by database trigger on contracts table
    const { data: result, error } = await supabase.functions.invoke('contract-notification', {
      body: data,
    });

    if (error) {
      console.error('Contract email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contract email sent:', result);
    // SMS is automatically triggered by database trigger (contract_status_sms_trigger)
    return { success: true };
  } catch (err) {
    console.error('Contract email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send invoice notification email
 * NOTE: Payment SMS is handled by wallet transaction trigger
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email only
    const { data: result, error } = await supabase.functions.invoke('invoice-notification', {
      body: data,
    });

    if (error) {
      console.error('Invoice email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Invoice email sent:', result);
    // Payment SMS is handled by wallet_transaction_sms_trigger
    return { success: true };
  } catch (err) {
    console.error('Invoice email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send finance notification email
 * NOTE: SMS is now handled automatically by database triggers
 */
export async function sendFinanceEmail(data: FinanceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email only - SMS is handled by database triggers
    const { data: result, error } = await supabase.functions.invoke('finance-notification', {
      body: data,
    });

    if (error) {
      console.error('Finance email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Finance email sent:', result);
    // SMS is automatically triggered by database triggers (finance_app_status_sms_trigger, finance_contract_status_sms_trigger)
    return { success: true };
  } catch (err) {
    console.error('Finance email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Helper: Get customer email from profile
 */
export async function getCustomerEmail(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data.email;
  } catch {
    return null;
  }
}

/**
 * Helper: Get customer profile with phone
 */
export async function getCustomerProfile(userId: string): Promise<{ email: string; name: string; phone: string | null } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, phone')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return { email: data.email || '', name: data.full_name || '', phone: data.phone || null };
  } catch {
    return null;
  }
}

/**
 * Send direct SMS notification
 */
export async function sendDirectSms(
  phone: string,
  messageType: string,
  templateData: Record<string, string>,
  customMessage?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('sms-send-notification', {
      body: {
        phone,
        message_type: messageType,
        template_data: templateData,
        custom_message: customMessage,
      },
    });

    if (error) {
      console.error('Direct SMS error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Direct SMS exception:', err);
    return { success: false, error: err.message };
  }
}
