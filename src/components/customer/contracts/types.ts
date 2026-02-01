/**
 * Customer Contracts Types
 * Enterprise Contracts Center - RTL-first
 */

export type ContractStatus = 
  | 'draft' 
  | 'pre_approved_by_customer' 
  | 'pending_admin_approval' 
  | 'pending_signature' 
  | 'signed' 
  | 'cancelled';

export interface ContractPricing {
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
}

export interface ContractService {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
}

export interface ContractOrder {
  id: string;
  order_number: string;
  title: string;
  title_ar: string | null;
}

export interface CustomerContract {
  id: string;
  contract_number: string;
  customer_user_id: string;
  service_id: string | null;
  order_id: string | null;
  status: ContractStatus;
  locale: string | null;
  pricing_json: ContractPricing | null;
  terms_snapshot_json: Record<string, unknown> | null;
  scope_summary: string | null;
  scope_summary_ar: string | null;
  signed_at: string | null;
  signed_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  service?: ContractService | null;
  order?: ContractOrder | null;
  // Pre-approval fields
  customer_pre_approval?: boolean;
  pre_approval_timestamp?: string | null;
  admin_approval_notes?: string | null;
  admin_rejection_reason?: string | null;
  admin_approved_at?: string | null;
  // Computed fields
  status_label_ar?: string;
  status_label_en?: string;
  status_color?: string;
}

export interface ContractFilters {
  search: string;
  status: ContractStatus | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  startDate?: Date;
  endDate?: Date;
  serviceId?: string;
}

export type SortField = 'created_at' | 'updated_at' | 'status' | 'pricing';
export type SortDirection = 'asc' | 'desc';

export interface ContractsSort {
  field: SortField;
  direction: SortDirection;
}

export interface ContractsKPIData {
  total: number;
  draft: number;
  pre_approved: number;
  pending_admin: number;
  pending_signature: number;
  signed: number;
  cancelled: number;
}

export const CONTRACT_STATUS_CONFIG: Record<ContractStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  priority: number;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-700 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
    priority: 5,
  },
  pre_approved_by_customer: {
    labelAr: 'موافقة مبدئية',
    labelEn: 'Pre-Approved',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    priority: 4,
  },
  pending_admin_approval: {
    labelAr: 'بانتظار الإدارة',
    labelEn: 'Pending Admin',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    priority: 3,
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Awaiting Signature',
    color: 'text-indigo-700 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    priority: 1,
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    priority: 2,
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    priority: 6,
  },
};
