/**
 * Referral System Types - Enterprise Grade
 * Arabic-first, fully typed
 */

export type ReferralStatus = 
  | 'new'
  | 'registered'
  | 'service_requested'
  | 'contract_signed'
  | 'qualified'
  | 'reward_paid'
  | 'rejected';

export type PayoutStatus = 'pending' | 'approved' | 'paid' | 'failed' | 'cancelled';

export type ReferralActor = 'system' | 'admin' | 'user';

export interface Referral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string | null;
  referral_code: string;
  referral_link: string;
  referred_email: string | null;
  referred_phone: string | null;
  referred_name: string | null;
  status: ReferralStatus;
  reward_amount: number;
  reward_currency: string;
  fraud_flags: string[];
  device_fingerprint: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown>;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralEvent {
  id: string;
  referral_id: string;
  actor: ReferralActor;
  actor_user_id: string | null;
  old_status: string | null;
  new_status: string;
  event_type: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  tenant_id: string | null;
  created_at: string;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payout_status: PayoutStatus;
  paid_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  approved_by: string | null;
  approved_at: string | null;
  notes: string | null;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralSettings {
  id: string;
  tenant_id: string | null;
  reward_amount_per_referral: number;
  reward_currency: string;
  min_conversion_status: string;
  max_referrals_per_ip: number;
  max_referrals_per_user: number;
  cooldown_hours: number;
  is_active: boolean;
  terms_ar: string | null;
  terms_en: string | null;
  created_at: string;
  updated_at: string;
}

// Status labels in Arabic
export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  new: 'جديد',
  registered: 'تم التسجيل',
  service_requested: 'طلب خدمة',
  contract_signed: 'عقد موقّع',
  qualified: 'مؤهل للمكافأة',
  reward_paid: 'تم صرف المكافأة',
  rejected: 'مرفوض',
};

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  pending: 'قيد الانتظار',
  approved: 'تمت الموافقة',
  paid: 'تم الدفع',
  failed: 'فشل',
  cancelled: 'ملغي',
};

// Status colors for badges
export const REFERRAL_STATUS_COLORS: Record<ReferralStatus, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  registered: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  service_requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  contract_signed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  reward_paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// Status order for timeline
export const REFERRAL_STATUS_ORDER: ReferralStatus[] = [
  'new',
  'registered',
  'service_requested',
  'contract_signed',
  'qualified',
  'reward_paid',
];

// Statistics interface
export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingRewards: number;
  paidRewards: number;
  totalEarnings: number;
  conversionRate: number;
}

// Format currency
export const formatReferralCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
