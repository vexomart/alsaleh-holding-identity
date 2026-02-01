/**
 * Customer Orders Types
 * Enterprise Orders Center - Phase 1
 */

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export interface CustomerOrder {
  id: string;
  order_number: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  status: OrderStatus | null;
  total_amount: number | null;
  currency: string | null;
  created_at: string | null;
  updated_at: string | null;
  due_date: string | null;
  service_id: string | null;
  contract_id: string | null;
  // Joined data
  service?: {
    name: string;
    name_ar: string | null;
  } | null;
  // Computed fields
  status_label_ar?: string;
  status_label_en?: string;
  status_color?: string;
  last_event_at?: string | null;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  event_type: string;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  performed_by: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  startDate?: Date;
  endDate?: Date;
  serviceId?: string;
}

export type SortField = 'created_at' | 'updated_at' | 'status' | 'total_amount';
export type SortDirection = 'asc' | 'desc';

export interface OrdersSort {
  field: SortField;
  direction: SortDirection;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  pending: {
    labelAr: 'قيد الانتظار',
    labelEn: 'Pending',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  processing: {
    labelAr: 'قيد المعالجة',
    labelEn: 'Processing',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  in_progress: {
    labelAr: 'قيد التنفيذ',
    labelEn: 'In Progress',
    color: 'text-indigo-700 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  completed: {
    labelAr: 'مكتمل',
    labelEn: 'Completed',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  refunded: {
    labelAr: 'مسترد',
    labelEn: 'Refunded',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
};
