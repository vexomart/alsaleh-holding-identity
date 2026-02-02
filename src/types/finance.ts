/**
 * Finance System Types - نظام التمويل الداخلي
 * Comprehensive type definitions for the internal financing system
 */

// =====================================================
// ENTITY TYPES
// =====================================================

export type EntityType = "individual" | "company" | "institution";
export type EntityStatus = "active" | "suspended";

export interface Entity {
  id: string;
  owner_user_id: string;
  entity_type: EntityType;
  legal_name_ar: string;
  commercial_name_ar?: string | null;
  cr_number?: string | null;
  national_id?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  address_ar?: string | null;
  status: EntityStatus;
  metadata?: Record<string, unknown> | null;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export type EntityMemberRole = "owner" | "admin" | "finance_manager" | "signer" | "viewer";

export interface EntityMember {
  id: string;
  entity_id: string;
  user_id: string;
  role: EntityMemberRole;
  can_sign: boolean;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
}

// =====================================================
// KYC / FINANCE PROFILES
// =====================================================

export type KYCStatus = "not_started" | "pending" | "verified" | "rejected";
export type RiskLevel = "low" | "medium" | "high";

export interface FinanceProfile {
  id: string;
  entity_id: string;
  kyc_status: KYCStatus;
  risk_level?: RiskLevel | null;
  credit_limit_sar: number;
  available_limit_sar: number;
  last_score?: number | null;
  last_score_at?: string | null;
  notes_admin?: string | null;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
}

// =====================================================
// FINANCE APPLICATIONS
// =====================================================

export type FinanceApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_info";

export interface FinanceApplication {
  id: string;
  entity_id: string;
  service_id?: string | null;
  order_id?: string | null;
  application_number: string;
  amount_sar: number;
  down_payment_sar?: number | null;
  tenor_months: number;
  purpose_ar?: string | null;
  status: FinanceApplicationStatus;
  decision_reason_ar?: string | null;
  score_snapshot?: Record<string, unknown> | null;
  submitted_at?: string | null;
  decided_at?: string | null;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
  // Relations
  entity?: Entity;
  service?: { name_ar: string };
}

// =====================================================
// FINANCE OFFERS
// =====================================================

export type FinanceOfferStatus = "active" | "selected" | "expired";

export interface FinanceOffer {
  id: string;
  application_id: string;
  apr_percent: number;
  fees_sar?: number | null;
  monthly_payment_sar: number;
  total_payable_sar: number;
  offer_name_ar?: string | null;
  offer_name_en?: string | null;
  offer_status: FinanceOfferStatus;
  expires_at?: string | null;
  tenant_id?: string | null;
  created_at: string;
}

// =====================================================
// FINANCE CONTRACTS
// =====================================================

export type FinanceContractStatus =
  | "generated"
  | "signed_by_customer"
  | "approved_by_admin"
  | "active"
  | "closed"
  | "canceled";

export interface FinanceContract {
  id: string;
  application_id: string;
  offer_id: string;
  contract_number: string;
  status: FinanceContractStatus;
  signed_by_user_id?: string | null;
  signed_at?: string | null;
  admin_approved_by?: string | null;
  admin_approved_at?: string | null;
  pdf_url?: string | null;
  pdf_meta?: Record<string, unknown> | null;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
  // Relations
  application?: FinanceApplication;
  offer?: FinanceOffer;
}

// =====================================================
// FINANCE PAYMENTS
// =====================================================

export type FinancePaymentStatus = "scheduled" | "paid" | "overdue" | "failed";
export type FinancePaymentMethod = "mada" | "visa" | "bank_transfer" | "wallet";

export interface FinancePayment {
  id: string;
  contract_id: string;
  installment_no: number;
  due_date: string;
  amount_sar: number;
  status: FinancePaymentStatus;
  paid_at?: string | null;
  method?: FinancePaymentMethod | null;
  reference?: string | null;
  tenant_id?: string | null;
  created_at: string;
  updated_at?: string;
  // Relations
  contract?: FinanceContract;
}

// =====================================================
// FINANCE DOCUMENTS
// =====================================================

export type FinanceDocType =
  | "individual_id"
  | "salary_proof"
  | "bank_statement"
  | "company_cr"
  | "institution_license"
  | "authorization_letter"
  | "board_resolution"
  | "iban_certificate";

export type FinanceDocStatus = "uploaded" | "approved" | "rejected";

export interface FinanceDocument {
  id: string;
  entity_id: string;
  doc_type: FinanceDocType;
  file_url: string;
  file_name?: string | null;
  status: FinanceDocStatus;
  notes?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  tenant_id?: string | null;
  created_at: string;
}

// =====================================================
// UI CONFIG OBJECTS
// =====================================================

export const ENTITY_TYPE_CONFIG: Record<EntityType, { label: string; icon: string }> = {
  individual: { label: "فرد", icon: "User" },
  company: { label: "شركة", icon: "Building2" },
  institution: { label: "مؤسسة", icon: "Landmark" },
};

export const KYC_STATUS_CONFIG: Record<KYCStatus, { label: string; variant: string }> = {
  not_started: { label: "لم يبدأ", variant: "secondary" },
  pending: { label: "قيد المراجعة", variant: "warning" },
  verified: { label: "موثق", variant: "success" },
  rejected: { label: "مرفوض", variant: "destructive" },
};

export const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; variant: string }> = {
  low: { label: "منخفض", variant: "success" },
  medium: { label: "متوسط", variant: "warning" },
  high: { label: "مرتفع", variant: "destructive" },
};

export const APPLICATION_STATUS_CONFIG: Record<
  FinanceApplicationStatus,
  { label: string; variant: string }
> = {
  draft: { label: "مسودة", variant: "secondary" },
  submitted: { label: "مقدم", variant: "warning" },
  under_review: { label: "قيد المراجعة", variant: "warning" },
  approved: { label: "موافق عليه", variant: "success" },
  rejected: { label: "مرفوض", variant: "destructive" },
  needs_info: { label: "يحتاج معلومات", variant: "warning" },
};

export const OFFER_STATUS_CONFIG: Record<FinanceOfferStatus, { label: string; variant: string }> = {
  active: { label: "متاح", variant: "success" },
  selected: { label: "مختار", variant: "success" },
  expired: { label: "منتهي", variant: "secondary" },
};

export const CONTRACT_STATUS_CONFIG: Record<
  FinanceContractStatus,
  { label: string; variant: string }
> = {
  generated: { label: "منشأ", variant: "secondary" },
  signed_by_customer: { label: "موقع من العميل", variant: "warning" },
  approved_by_admin: { label: "موافق عليه", variant: "success" },
  active: { label: "نشط", variant: "success" },
  closed: { label: "مغلق", variant: "secondary" },
  canceled: { label: "ملغي", variant: "destructive" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  FinancePaymentStatus,
  { label: string; variant: string }
> = {
  scheduled: { label: "مجدول", variant: "secondary" },
  paid: { label: "مدفوع", variant: "success" },
  overdue: { label: "متأخر", variant: "destructive" },
  failed: { label: "فاشل", variant: "destructive" },
};

export const DOC_TYPE_CONFIG: Record<FinanceDocType, { label: string; requiredFor: EntityType[] }> =
  {
    individual_id: { label: "الهوية الوطنية", requiredFor: ["individual"] },
    salary_proof: { label: "إثبات الدخل", requiredFor: ["individual"] },
    bank_statement: { label: "كشف حساب بنكي", requiredFor: ["individual", "company", "institution"] },
    company_cr: { label: "السجل التجاري", requiredFor: ["company"] },
    institution_license: { label: "رخصة المؤسسة", requiredFor: ["institution"] },
    authorization_letter: { label: "خطاب تفويض", requiredFor: ["company", "institution"] },
    board_resolution: { label: "قرار مجلس الإدارة", requiredFor: ["company"] },
    iban_certificate: { label: "شهادة الآيبان", requiredFor: ["individual", "company", "institution"] },
  };

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function getRequiredDocs(entityType: EntityType): FinanceDocType[] {
  return (Object.entries(DOC_TYPE_CONFIG) as [FinanceDocType, { requiredFor: EntityType[] }][])
    .filter(([_, config]) => config.requiredFor.includes(entityType))
    .map(([docType]) => docType);
}

export function formatCurrencySAR(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// =====================================================
// SCORING TYPES
// =====================================================

export interface ScoreResult {
  score: number;
  risk_level: RiskLevel;
  credit_limit_sar: number;
  decision: "approved" | "rejected" | "needs_info" | "under_review";
  reason_ar: string;
  flags: string[];
}

export interface ScoreInput {
  entity_id: string;
  application_id: string;
  amount_sar: number;
  down_payment_sar: number;
  tenor_months: number;
}
