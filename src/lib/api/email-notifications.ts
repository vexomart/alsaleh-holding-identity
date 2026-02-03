/**
 * Email Notifications API
 * Unified service for sending real-time email notifications
 */

import { supabase } from '@/integrations/supabase/client';

// Types for email notifications
export interface OrderEmailData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
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

/**
 * Send order status change email
 */
export async function sendOrderStatusEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('order-status-email', {
      body: data,
    });

    if (error) {
      console.error('Order email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Order email sent:', result);
    return { success: true };
  } catch (err) {
    console.error('Order email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send contract notification email
 */
export async function sendContractEmail(data: ContractEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('contract-notification', {
      body: data,
    });

    if (error) {
      console.error('Contract email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Contract email sent:', result);
    return { success: true };
  } catch (err) {
    console.error('Contract email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send invoice notification email
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('invoice-notification', {
      body: data,
    });

    if (error) {
      console.error('Invoice email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Invoice email sent:', result);
    return { success: true };
  } catch (err) {
    console.error('Invoice email exception:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send finance notification email
 */
export async function sendFinanceEmail(data: FinanceEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('finance-notification', {
      body: data,
    });

    if (error) {
      console.error('Finance email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Finance email sent:', result);
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
 * Helper: Get customer profile
 */
export async function getCustomerProfile(userId: string): Promise<{ email: string; name: string } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return { email: data.email || '', name: data.full_name || '' };
  } catch {
    return null;
  }
}
