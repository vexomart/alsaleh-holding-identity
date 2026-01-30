/**
 * Services Types - Phase 0.5
 */

export interface Service {
  id: string;
  tenant_id: string | null;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  price: number | null;
  currency: string;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
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
  price?: number;
  category?: string;
  icon?: string;
  image_url?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  category?: string;
  icon?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ServiceFilters {
  category?: string;
  is_active?: boolean;
  search?: string;
}

export interface ServiceListResponse {
  services: Service[];
}
