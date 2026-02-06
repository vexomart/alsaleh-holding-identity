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

// SMS notification helper
async function sendSmsNotification(
  phone: string | undefined,
  messageType: string,
  templateData: Record<string, string>
): Promise<void> {
  if (!phone) {
    console.log('SMS skipped: no phone number');
    return;
  }

  try {
    const { error } = await supabase.functions.invoke('sms-send-notification', {
      body: {
        phone,
        message_type: messageType,
        template_data: templateData,
      },
    });

    if (error) {
      console.error('SMS notification error:', error);
    } else {
      console.log(`SMS notification sent: ${messageType}`);
    }
  } catch (err) {
    console.error('SMS notification exception:', err);
  }
}

// Map order status to SMS message type
function getOrderSmsType(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'order_created',
    'confirmed': 'order_confirmed',
    'in_progress': 'order_processing',
    'processing': 'order_processing',
    'completed': 'order_completed',
    'cancelled': 'order_cancelled',
    'rejected': 'order_cancelled',
  };
  return statusMap[status.toLowerCase()] || 'order_status';
}

// Map contract event to SMS message type
function getContractSmsType(eventType: string): string {
  const eventMap: Record<string, string> = {
    'created': 'contract_created',
    'admin_approved': 'contract_approved',
    'pending_signature': 'contract_pending_signature',
    'signed': 'contract_signed',
    'rejected': 'contract_rejected',
    'cancelled': 'contract_expired',
  };
  return eventMap[eventType] || 'contract_created';
}

// Map finance event to SMS message type
function getFinanceSmsType(eventType: string): string {
  const eventMap: Record<string, string> = {
    'application_submitted': 'finance_submitted',
    'under_review': 'finance_submitted',
    'offer_ready': 'finance_offer_ready',
    'approved': 'finance_approved',
    'rejected': 'finance_rejected',
    'contract_ready': 'finance_contract_ready',
    'disbursed': 'finance_disbursed',
    'payment_reminder': 'finance_payment_due',
    'payment_received': 'finance_payment_received',
  };
  return eventMap[eventType] || 'finance_submitted';
}

/**
 * Send order status change email + SMS
 */
export async function sendOrderStatusEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email
    const { data: result, error } = await supabase.functions.invoke('order-status-email', {
      body: data,
    });

    if (error) {
      console.error('Order email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Order email sent:', result);

    // Send SMS (fire and forget)
    sendSmsNotification(data.customerPhone, getOrderSmsType(data.status), {
      order_number: data.orderNumber,
      amount: data.totalAmount.toLocaleString('ar-SA'),
      status: data.status,
    });

    return { success: true };
  } catch (err) {
    console.error('Order email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send contract notification email + SMS
 */
export async function sendContractEmail(data: ContractEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email
    const { data: result, error } = await supabase.functions.invoke('contract-notification', {
      body: data,
    });

    if (error) {
      console.error('Contract email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contract email sent:', result);

    // Send SMS (fire and forget)
    sendSmsNotification(data.customerPhone, getContractSmsType(data.eventType), {
      contract_number: data.contractNumber,
      reason: data.rejectionReason || '',
    });

    return { success: true };
  } catch (err) {
    console.error('Contract email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send invoice notification email + SMS
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email
    const { data: result, error } = await supabase.functions.invoke('invoice-notification', {
      body: data,
    });

    if (error) {
      console.error('Invoice email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Invoice email sent:', result);

    // Send SMS for payment events
    if (data.eventType === 'paid') {
      sendSmsNotification(data.customerPhone, 'payment_success', {
        amount: data.total.toLocaleString('ar-SA'),
        transaction_id: data.invoiceNumber,
      });
    }

    return { success: true };
  } catch (err) {
    console.error('Invoice email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send finance notification email + SMS
 */
export async function sendFinanceEmail(data: FinanceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email
    const { data: result, error } = await supabase.functions.invoke('finance-notification', {
      body: data,
    });

    if (error) {
      console.error('Finance email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Finance email sent:', result);

    // Send SMS (fire and forget)
    const smsData: Record<string, string> = {
      application_number: data.applicationNumber || '',
      contract_number: data.contractNumber || '',
      amount: data.amountSar.toLocaleString('ar-SA'),
    };

    if (data.offerDetails) {
      smsData.monthly = data.offerDetails.monthlyPayment.toLocaleString('ar-SA');
    }

    if (data.installmentNumber) {
      smsData.installment = data.installmentNumber.toString();
    }

    if (data.installmentAmount) {
      smsData.amount = data.installmentAmount.toLocaleString('ar-SA');
    }

    sendSmsNotification(data.customerPhone, getFinanceSmsType(data.eventType), smsData);

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
