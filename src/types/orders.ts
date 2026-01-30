/**
 * Orders Types - Phase 0.5
 */

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  tenant_id: string | null;
  customer_id: string;
  service_id: string | null;
  title: string;
  title_ar: string | null;
  description: string | null;
  status: OrderStatus;
  priority: number;
  total_amount: number | null;
  currency: string;
  due_date: string | null;
  assigned_to: string | null;
  attachments: OrderAttachment[];
  notes: OrderNote[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrderWithRelations extends Order {
  customer?: {
    id: string;
    full_name: string | null;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    name_ar: string | null;
  };
  assignee?: {
    id: string;
    full_name: string | null;
  };
}

export interface OrderAttachment {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface OrderNote {
  id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface OrderEvent {
  id: string;
  tenant_id: string | null;
  order_id: string;
  event_type: OrderEventType;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  performed_by: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type OrderEventType = 
  | 'created' 
  | 'status_changed' 
  | 'assigned' 
  | 'note_added' 
  | 'attachment_added' 
  | 'cancelled';

export interface CreateOrderRequest {
  service_id?: string;
  title: string;
  description?: string;
  attachments?: string[];
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  assigned_to?: string;
  priority?: number;
  due_date?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  assigned_to?: string;
  customer_id?: string;
  service_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface OrderListResponse {
  orders: OrderWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
