/**
 * Client Hub Types
 * Enterprise CRM-style relationship management
 */

export interface ClientIdentity {
  id: string;
  clientId: string; // ASH-CL-XXXXXX
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: ClientStatus;
  createdAt: string;
  lastLoginAt?: string;
  isKycVerified: boolean;
  nationalId?: string;
  accountManager?: {
    id: string;
    name: string;
    nameAr?: string;
  };
}

export type ClientStatus = 'active' | 'under_contract' | 'suspended' | 'pending_verification';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  timestamp: string;
  actor: 'system' | 'admin' | 'client';
  actorName?: string;
  metadata?: Record<string, any>;
  relatedId?: string;
  relatedType?: 'order' | 'contract' | 'invoice' | 'payment' | 'wallet';
}

export type TimelineEventType = 
  | 'account_created'
  | 'service_requested'
  | 'order_created'
  | 'order_status_changed'
  | 'contract_created'
  | 'contract_signed'
  | 'contract_approved'
  | 'invoice_issued'
  | 'payment_received'
  | 'wallet_credited'
  | 'wallet_debited'
  | 'status_changed'
  | 'note_added';

export interface ActiveService {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceNameAr?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: string;
  contractId?: string;
  contractNumber?: string;
  orderId?: string;
  orderNumber?: string;
}

export interface FinancialSnapshot {
  walletBalance: number;
  reservedBalance: number;
  outstandingInvoices: number;
  outstandingAmount: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  totalPaid: number;
  currency: string;
}

export interface ContractSummary {
  id: string;
  contractNumber: string;
  status: string;
  serviceName?: string;
  serviceNameAr?: string;
  signedAt?: string;
  expiresAt?: string;
  isExpiringSoon: boolean;
}

export interface ClientHubData {
  identity: ClientIdentity;
  timeline: TimelineEvent[];
  activeServices: ActiveService[];
  financialSnapshot: FinancialSnapshot;
  contracts: ContractSummary[];
  // Admin only
  internalNotes?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

// Timeline event configuration
export const TIMELINE_EVENT_CONFIG: Record<TimelineEventType, {
  icon: string;
  color: string;
  labelEn: string;
  labelAr: string;
}> = {
  account_created: {
    icon: 'UserPlus',
    color: 'text-emerald-500',
    labelEn: 'Account Created',
    labelAr: 'تم إنشاء الحساب',
  },
  service_requested: {
    icon: 'ShoppingBag',
    color: 'text-blue-500',
    labelEn: 'Service Requested',
    labelAr: 'تم طلب خدمة',
  },
  order_created: {
    icon: 'FileText',
    color: 'text-blue-500',
    labelEn: 'Order Created',
    labelAr: 'تم إنشاء طلب',
  },
  order_status_changed: {
    icon: 'RefreshCw',
    color: 'text-amber-500',
    labelEn: 'Order Status Changed',
    labelAr: 'تغيرت حالة الطلب',
  },
  contract_created: {
    icon: 'FileSignature',
    color: 'text-purple-500',
    labelEn: 'Contract Created',
    labelAr: 'تم إنشاء عقد',
  },
  contract_signed: {
    icon: 'CheckCircle',
    color: 'text-emerald-500',
    labelEn: 'Contract Signed',
    labelAr: 'تم توقيع العقد',
  },
  contract_approved: {
    icon: 'Shield',
    color: 'text-emerald-500',
    labelEn: 'Contract Approved',
    labelAr: 'تمت الموافقة على العقد',
  },
  invoice_issued: {
    icon: 'Receipt',
    color: 'text-indigo-500',
    labelEn: 'Invoice Issued',
    labelAr: 'تم إصدار فاتورة',
  },
  payment_received: {
    icon: 'CreditCard',
    color: 'text-emerald-500',
    labelEn: 'Payment Received',
    labelAr: 'تم استلام الدفع',
  },
  wallet_credited: {
    icon: 'ArrowDownCircle',
    color: 'text-emerald-500',
    labelEn: 'Wallet Credited',
    labelAr: 'تم إيداع رصيد',
  },
  wallet_debited: {
    icon: 'ArrowUpCircle',
    color: 'text-red-500',
    labelEn: 'Wallet Debited',
    labelAr: 'تم خصم رصيد',
  },
  status_changed: {
    icon: 'RefreshCw',
    color: 'text-amber-500',
    labelEn: 'Status Changed',
    labelAr: 'تغيرت الحالة',
  },
  note_added: {
    icon: 'MessageSquare',
    color: 'text-slate-500',
    labelEn: 'Note Added',
    labelAr: 'تمت إضافة ملاحظة',
  },
};

export const CLIENT_STATUS_CONFIG: Record<ClientStatus, {
  labelEn: string;
  labelAr: string;
  color: string;
  bgColor: string;
}> = {
  active: {
    labelEn: 'Active',
    labelAr: 'نشط',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  under_contract: {
    labelEn: 'Under Contract',
    labelAr: 'تحت عقد',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
  },
  suspended: {
    labelEn: 'Suspended',
    labelAr: 'موقوف',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
  pending_verification: {
    labelEn: 'Pending Verification',
    labelAr: 'بانتظار التحقق',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
};
