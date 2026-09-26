/**
 * Services API - Advanced Management
 * Full CRUD operations with sorting and categorization
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';

type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export interface Service {
  id: string;
  tenant_id: string | null;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  short_description: string | null;
  short_description_ar: string | null;
  price: number | null;
  currency: string | null;
  include_vat: boolean;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  is_visible_to_customers: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequest {
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  short_description?: string;
  short_description_ar?: string;
  price?: number;
  currency?: string;
  include_vat?: boolean;
  category?: string;
  icon?: string;
  image_url?: string;
  is_active?: boolean;
  is_visible_to_customers?: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export interface ServicesByCategory {
  category: string;
  services: Service[];
}

export interface ServiceFilters {
  category?: string;
  is_active?: boolean;
  is_visible_to_customers?: boolean;
  search?: string;
}

// Helper to convert DB row to Service type
function mapDbRowToService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    tenant_id: row.tenant_id as string | null,
    name: row.name as string,
    name_ar: row.name_ar as string | null,
    description: row.description as string | null,
    description_ar: row.description_ar as string | null,
    short_description: (row.short_description as string | null) ?? null,
    short_description_ar: (row.short_description_ar as string | null) ?? null,
    price: row.price as number | null,
    currency: row.currency as string | null,
    include_vat: (row.include_vat as boolean) ?? false,
    category: row.category as string | null,
    icon: row.icon as string | null,
    image_url: row.image_url as string | null,
    is_active: (row.is_active as boolean) ?? true,
    is_visible_to_customers: (row.is_visible_to_customers as boolean) ?? true,
    sort_order: (row.sort_order as number) ?? 0,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * Fetch all services with optional filters (Admin API)
 * GET /api/admin/services
 * Ordered by sort_order ASC, then created_at DESC
 */
export async function fetchServices(filters?: ServiceFilters): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  if (filters?.is_visible_to_customers !== undefined) {
    query = query.eq('is_visible_to_customers', filters.is_visible_to_customers);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,name_ar.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return (data || []).map(row => mapDbRowToService(row as unknown as Record<string, unknown>));
}

/**
 * Fetch services for customers (public-facing)
 * GET /api/app/services
 * Returns only active + visible services, sorted by sort_order ASC
 */
export async function fetchCustomerServices(category?: string): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('is_visible_to_customers', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching customer services:', error);
    throw error;
  }

  return (data || []).map(row => mapDbRowToService(row as unknown as Record<string, unknown>));
}

/**
 * Fetch customer services grouped by category
 * GET /api/app/services/by-category
 */
export async function fetchCustomerServicesByCategory(): Promise<ServicesByCategory[]> {
  const { data, error } = await supabase.rpc('get_services_by_category', {
    p_tenant_id: null,
    p_include_inactive: false,
  });

  if (error) {
    console.error('Error fetching customer services by category:', error);
    throw error;
  }

  return (data || []).map((item: { category: string; services: Json }) => ({
    category: item.category || 'غير مصنف',
    services: ((item.services as unknown as Service[]) || []).filter(
      s => s.is_visible_to_customers !== false
    ),
  }));
}

/**
 * Fetch a single service by ID
 */
export async function fetchServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }

  if (!data) return null;

  return mapDbRowToService(data as unknown as Record<string, unknown>);
}

/**
 * Fetch services grouped by category (Admin API)
 * GET /api/admin/services/by-category
 */
export async function fetchServicesByCategory(includeInactive = false): Promise<ServicesByCategory[]> {
  const { data, error } = await supabase.rpc('get_services_by_category', {
    p_tenant_id: null,
    p_include_inactive: includeInactive,
  });

  if (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }

  return (data || []).map((item: { category: string; services: Json }) => ({
    category: item.category || 'غير مصنف',
    services: (item.services as unknown as Service[]) || [],
  }));
}

/**
 * Get next available sort order (Internal)
 */
export async function getNextSortOrder(): Promise<number> {
  const { data, error } = await supabase.rpc('get_next_service_sort_order', {
    p_tenant_id: null,
  });

  if (error) {
    console.error('Error getting next sort order:', error);
    return 0;
  }

  return data || 0;
}

/**
 * Create a new service (Admin API)
 * POST /api/admin/services
 */
export async function createService(request: CreateServiceRequest): Promise<Service> {
  const sortOrder = request.sort_order ?? await getNextSortOrder();

  const insertData = {
    name: request.name,
    name_ar: request.name_ar,
    description: request.description,
    description_ar: request.description_ar,
    short_description: request.short_description,
    short_description_ar: request.short_description_ar,
    price: request.price,
    currency: request.currency || 'SAR',
    include_vat: request.include_vat ?? false,
    category: request.category,
    icon: request.icon,
    image_url: request.image_url,
    is_active: request.is_active ?? true,
    is_visible_to_customers: request.is_visible_to_customers ?? true,
    sort_order: sortOrder,
    metadata: (request.metadata || {}) as Json,
  };

  const { data, error } = await supabase
    .from('services')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return mapDbRowToService(data as unknown as Record<string, unknown>);
}

/**
 * Update an existing service (Admin API)
 * PATCH /api/admin/services/:id
 */
export async function updateService(request: UpdateServiceRequest): Promise<Service> {
  const { id, metadata, ...rest } = request;

  const updateData: ServiceUpdate = {
    ...rest,
    updated_at: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    updateData.metadata = metadata as Json;
  }

  const { data, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return mapDbRowToService(data as unknown as Record<string, unknown>);
}

/**
 * Delete a service (Admin API)
 * DELETE /api/admin/services/:id
 */
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

/**
 * Bulk update sort order for services (Admin API)
 * PATCH /api/admin/services/reorder
 * Transaction-like bulk update using RPC
 */
export async function updateServicesSortOrder(
  orders: { id: string; sort_order: number }[]
): Promise<boolean> {
  const { data, error } = await supabase.rpc('update_services_sort_order', {
    p_service_orders: orders as unknown as Json,
  });

  if (error) {
    console.error('Error updating sort order:', error);
    throw error;
  }

  return data ?? true;
}

/**
 * Toggle service active status
 */
export async function toggleServiceStatus(id: string, is_active: boolean): Promise<Service> {
  return updateService({ id, is_active });
}

/**
 * Toggle service visibility to customers
 */
export async function toggleServiceVisibility(id: string, is_visible_to_customers: boolean): Promise<Service> {
  return updateService({ id, is_visible_to_customers });
}

/**
 * Get all unique categories
 */
export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('services')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  const categories = [...new Set(data?.map(s => s.category).filter(Boolean) as string[])];
  return categories.sort();
}

/**
 * Bulk update services
 */
export async function bulkUpdateServices(
  ids: string[],
  updates: Partial<CreateServiceRequest>
): Promise<void> {
  const { metadata, ...rest } = updates;
  
  const updateData: ServiceUpdate = {
    ...rest,
    updated_at: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    updateData.metadata = metadata as Json;
  }

  const { error } = await supabase
    .from('services')
    .update(updateData)
    .in('id', ids);

  if (error) {
    console.error('Error bulk updating services:', error);
    throw error;
  }
}

/**
 * Duplicate a service
 */
export async function duplicateService(id: string): Promise<Service> {
  const original = await fetchServiceById(id);
  
  if (!original) {
    throw new Error('Service not found');
  }

  const nextSortOrder = await getNextSortOrder();

  return createService({
    name: `${original.name} (نسخة)`,
    name_ar: original.name_ar ? `${original.name_ar} (نسخة)` : undefined,
    description: original.description || undefined,
    description_ar: original.description_ar || undefined,
    short_description: original.short_description || undefined,
    short_description_ar: original.short_description_ar || undefined,
    price: original.price || undefined,
    currency: original.currency || undefined,
    include_vat: original.include_vat,
    category: original.category || undefined,
    icon: original.icon || undefined,
    image_url: original.image_url || undefined,
    is_active: false, // Start as inactive
    is_visible_to_customers: original.is_visible_to_customers,
    sort_order: nextSortOrder,
    metadata: original.metadata,
  });
}
