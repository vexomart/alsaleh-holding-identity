/**
 * Invoices API - Real-time Invoice Management
 * POST /api/admin/orders/:id/invoice (generate)
 * GET /api/app/orders/:id/invoice (fetch)
 */

import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';

export interface Invoice {
  id: string;
  tenant_id: string | null;
  order_id: string;
  customer_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
  pdf_url: string | null;
  notes: string | null;
  due_date: string | null;
  paid_at: string | null;
  // Paylink payment fields
  payment_url: string | null;
  provider: string | null;
  provider_invoice_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceRequest {
  order_id: string;
  customer_id: string;
  tenant_id?: string;
  subtotal: number;
  vat_rate?: number;
  currency?: string;
  notes?: string;
  due_date?: string;
  pdf_url?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInvoiceRequest {
  id: string;
  status?: InvoiceStatus;
  pdf_url?: string;
  notes?: string;
  due_date?: string;
  paid_at?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoiceRealtimePayload {
  event: 'invoice.generated' | 'invoice.status_changed';
  invoice_id: string;
  invoice_number: string;
  order_id: string;
  customer_id: string;
  status: InvoiceStatus;
  total: number;
  currency: string;
  pdf_url: string | null;
  timestamp: string;
}

// Helper to map DB row to Invoice type
function mapDbRowToInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    tenant_id: row.tenant_id as string | null,
    order_id: row.order_id as string,
    customer_id: row.customer_id as string,
    invoice_number: row.invoice_number as string,
    status: row.status as InvoiceStatus,
    subtotal: Number(row.subtotal) || 0,
    vat_rate: Number(row.vat_rate) || 15,
    vat_amount: Number(row.vat_amount) || 0,
    total: Number(row.total) || 0,
    currency: (row.currency as string) || 'SAR',
    pdf_url: row.pdf_url as string | null,
    notes: row.notes as string | null,
    due_date: row.due_date as string | null,
    paid_at: row.paid_at as string | null,
    // Paylink payment fields
    payment_url: row.payment_url as string | null,
    provider: row.provider as string | null,
    provider_invoice_id: row.provider_invoice_id as string | null,
    metadata: (row.metadata as Record<string, unknown>) || {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * Generate invoice number via RPC
 */
export async function generateInvoiceNumber(tenantId?: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_invoice_number', {
    p_tenant_id: tenantId || null,
  });

  if (error) {
    console.error('Error generating invoice number:', error);
    throw error;
  }

  return data as string;
}

/**
 * Create a new invoice with Paylink integration (Admin API)
 * POST /api/admin/orders/:id/invoice
 * - Creates invoice in database
 * - Creates financial_transaction with status=pending
 * - Calls Paylink to create payment invoice and get paymentUrl
 * - Emits realtime events
 */
export async function createInvoice(request: CreateInvoiceRequest): Promise<Invoice> {
  const invoiceNumber = await generateInvoiceNumber(request.tenant_id);
  
  const vatRate = request.vat_rate ?? 15;
  const vatAmount = (request.subtotal * vatRate) / 100;
  const total = request.subtotal + vatAmount;

  const insertData = {
    order_id: request.order_id,
    customer_id: request.customer_id,
    tenant_id: request.tenant_id || null,
    invoice_number: invoiceNumber,
    status: 'issued' as InvoiceStatus,
    subtotal: request.subtotal,
    vat_rate: vatRate,
    vat_amount: vatAmount,
    total: total,
    currency: request.currency || 'SAR',
    pdf_url: request.pdf_url || null,
    notes: request.notes || null,
    due_date: request.due_date || null,
    metadata: (request.metadata || {}) as Json,
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }

  let invoice = mapDbRowToInvoice(data as unknown as Record<string, unknown>);
  
  // Create Paylink invoice and get payment URL
  try {
    const paylinkResult = await createPaylinkInvoice(invoice.id);
    if (paylinkResult.success && paylinkResult.payment_url) {
      // Refetch invoice with updated payment_url
      const updatedInvoice = await getInvoiceById(invoice.id);
      if (updatedInvoice) {
        invoice = updatedInvoice;
      }
    }
  } catch (paylinkError) {
    console.error('Error creating Paylink invoice:', paylinkError);
    // Continue without payment URL - admin can retry later
  }
  
  // Emit realtime event to customer channel
  await emitInvoiceEvent('invoice.generated', invoice);
  
  // Create notification for customer
  await createInvoiceNotification(invoice);

  return invoice;
}

/**
 * Call Paylink edge function to create payment invoice
 */
async function createPaylinkInvoice(invoiceId: string): Promise<{
  success: boolean;
  payment_url?: string;
  provider_invoice_id?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('paylink-create-invoice', {
      body: { invoice_id: invoiceId },
    });

    if (error) {
      console.error('Paylink function error:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Error calling Paylink function:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Get invoice by order ID (Customer API)
 * GET /api/app/orders/:id/invoice
 */
export async function getInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }

  if (!data) return null;

  return mapDbRowToInvoice(data as unknown as Record<string, unknown>);
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }

  if (!data) return null;

  return mapDbRowToInvoice(data as unknown as Record<string, unknown>);
}

/**
 * Get all invoices for a customer
 */
export async function getCustomerInvoices(customerId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer invoices:', error);
    throw error;
  }

  return (data || []).map(row => mapDbRowToInvoice(row as unknown as Record<string, unknown>));
}

/**
 * Get all invoices (Admin)
 */
export async function getAllInvoices(filters?: {
  status?: InvoiceStatus;
  tenant_id?: string;
}): Promise<Invoice[]> {
  let query = supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.tenant_id) {
    query = query.eq('tenant_id', filters.tenant_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }

  return (data || []).map(row => mapDbRowToInvoice(row as unknown as Record<string, unknown>));
}

/**
 * Update invoice (Admin API)
 */
export async function updateInvoice(request: UpdateInvoiceRequest): Promise<Invoice> {
  const { id, metadata, ...rest } = request;
  const previousInvoice = await getInvoiceById(id);

  const updateData: Record<string, unknown> = {
    ...rest,
    updated_at: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    updateData.metadata = metadata as Json;
  }

  const { data, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }

  const invoice = mapDbRowToInvoice(data as unknown as Record<string, unknown>);

  // Emit status change event if status changed
  if (previousInvoice && previousInvoice.status !== invoice.status) {
    await emitInvoiceEvent('invoice.status_changed', invoice);
  }

  return invoice;
}

/**
 * Update invoice PDF URL after generation
 */
export async function updateInvoicePdfUrl(id: string, pdfUrl: string): Promise<Invoice> {
  return updateInvoice({ id, pdf_url: pdfUrl });
}

/**
 * Mark invoice as paid
 */
export async function markInvoiceAsPaid(id: string): Promise<Invoice> {
  return updateInvoice({
    id,
    status: 'paid',
    paid_at: new Date().toISOString(),
  });
}

/**
 * Cancel invoice
 */
export async function cancelInvoice(id: string): Promise<Invoice> {
  return updateInvoice({ id, status: 'cancelled' });
}

/**
 * Emit invoice realtime event to customer channels
 */
async function emitInvoiceEvent(
  event: 'invoice.generated' | 'invoice.status_changed',
  invoice: Invoice
): Promise<void> {
  const payload: InvoiceRealtimePayload = {
    event,
    invoice_id: invoice.id,
    invoice_number: invoice.invoice_number,
    order_id: invoice.order_id,
    customer_id: invoice.customer_id,
    status: invoice.status,
    total: invoice.total,
    currency: invoice.currency,
    pdf_url: invoice.pdf_url,
    timestamp: new Date().toISOString(),
  };

  // Emit to customer-specific invoice channel
  const customerInvoiceChannel = supabase.channel(`user:${invoice.customer_id}:invoices`);
  await customerInvoiceChannel.send({
    type: 'broadcast',
    event: event,
    payload,
  });

  // Emit to customer notification channel
  const customerNotificationChannel = supabase.channel(`user:${invoice.customer_id}:notifications`);
  await customerNotificationChannel.send({
    type: 'broadcast',
    event: event,
    payload,
  });

  // Emit to tenant admin channel (optional monitoring)
  if (invoice.tenant_id) {
    const tenantChannel = supabase.channel(`tenant:${invoice.tenant_id}:invoices`);
    await tenantChannel.send({
      type: 'broadcast',
      event: event,
      payload,
    });
  }
}

/**
 * Create notification record for customer when invoice is generated
 */
async function createInvoiceNotification(invoice: Invoice): Promise<void> {
  const notificationData = {
    user_id: invoice.customer_id,
    tenant_id: invoice.tenant_id,
    title: 'فاتورة جديدة',
    title_ar: 'فاتورة جديدة',
    message: `تم إصدار فاتورة رقم ${invoice.invoice_number} بقيمة ${invoice.total.toFixed(2)} ${invoice.currency}`,
    message_ar: `تم إصدار فاتورة رقم ${invoice.invoice_number} بقيمة ${invoice.total.toFixed(2)} ${invoice.currency}`,
    type: 'info' as const,
    link: `/app/orders/${invoice.order_id}`,
    metadata: {
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      order_id: invoice.order_id,
    } as Json,
    is_read: false,
  };

  const { error } = await supabase
    .from('notifications')
    .insert(notificationData);

  if (error) {
    console.error('Error creating invoice notification:', error);
    // Don't throw - notification failure shouldn't block invoice creation
  }
}

/**
 * Check if order already has an invoice
 */
export async function orderHasInvoice(orderId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error checking invoice existence:', error);
    return false;
  }

  return (count || 0) > 0;
}
