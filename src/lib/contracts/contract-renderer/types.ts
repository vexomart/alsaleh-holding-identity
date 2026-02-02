/**
 * Finance Contract Data Types
 * شركة علي صالح الشهري القابضة
 * Professional Arabic Contract System
 */

export interface ContractParty {
  /** الاسم الكامل */
  name: string;
  /** رقم الهوية / السجل التجاري */
  identityNumber: string;
  /** نوع الهوية */
  identityType: 'national_id' | 'commercial_registration' | 'iqama';
  /** العنوان */
  address: string;
  /** رقم الهاتف */
  phone: string;
  /** البريد الإلكتروني */
  email: string;
  /** المدينة */
  city?: string;
}

export interface PaymentInstallment {
  /** رقم القسط */
  installmentNumber: number;
  /** تاريخ الاستحقاق */
  dueDate: string;
  /** مبلغ القسط */
  amount: number;
  /** الحالة */
  status: 'scheduled' | 'paid' | 'overdue' | 'pending';
}

export interface ContractFinancials {
  /** مبلغ التمويل الأساسي */
  principalAmount: number;
  /** معدل الربح السنوي (APR) */
  aprPercent: number;
  /** إجمالي الرسوم */
  totalFees: number;
  /** إجمالي المبلغ المستحق */
  totalPayable: number;
  /** مدة التمويل بالأشهر */
  tenorMonths: number;
  /** القسط الشهري */
  monthlyPayment: number;
  /** العملة */
  currency: 'SAR';
}

export interface ContractSignature {
  /** اسم الموقع */
  signerName: string;
  /** تاريخ التوقيع */
  signedAt: string | null;
  /** عنوان IP */
  ipAddress?: string;
  /** بيانات التوقيع (Base64 أو SVG) */
  signatureData?: string;
  /** هل تم التوقيع */
  isSigned: boolean;
}

export interface FinanceContractData {
  /** رقم العقد */
  contractNumber: string;
  /** تاريخ الإصدار */
  issueDate: string;
  /** تاريخ السريان */
  effectiveDate: string;
  /** تاريخ الانتهاء */
  expiryDate: string;
  
  /** الطرف الأول (الممول) */
  firstParty: ContractParty;
  /** الطرف الثاني (المستفيد) */
  secondParty: ContractParty;
  
  /** البيانات المالية */
  financials: ContractFinancials;
  
  /** جدول السداد */
  paymentSchedule: PaymentInstallment[];
  
  /** الغرض من التمويل */
  fundingPurpose: string;
  
  /** توقيع الطرف الأول */
  firstPartySignature: ContractSignature;
  /** توقيع الطرف الثاني */
  secondPartySignature: ContractSignature;
  
  /** حالة العقد */
  status: 'draft' | 'pending_signature' | 'signed' | 'active' | 'completed' | 'cancelled';
  
  /** ملاحظات إضافية */
  notes?: string;
}

export interface ContractRenderOptions {
  /** تضمين الترويسة */
  includeHeader: boolean;
  /** تضمين التذييل */
  includeFooter: boolean;
  /** تضمين جدول السداد الكامل */
  includeFullSchedule: boolean;
  /** تضمين التوقيعات */
  includeSignatures: boolean;
  /** وضع المعاينة */
  previewMode: boolean;
}

export interface ContractValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  pageCount: number;
  hasOverflow: boolean;
  hasOrphanedHeaders: boolean;
  hasSplitSignatures: boolean;
}
