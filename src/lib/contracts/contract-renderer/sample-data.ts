/**
 * Sample Contract Data for Testing
 * بيانات نموذجية لاختبار العقود
 */

import { FinanceContractData } from './types';

/**
 * Short contract sample (3 installments)
 */
export const SAMPLE_SHORT_CONTRACT: FinanceContractData = {
  contractNumber: 'FIN-2026-0001',
  issueDate: '2026-02-02',
  effectiveDate: '2026-02-02',
  expiryDate: '2026-05-02',
  
  firstParty: {
    name: 'شركة علي صالح الشهري القابضة',
    identityNumber: '1234567890',
    identityType: 'commercial_registration',
    address: 'المملكة العربية السعودية، الرياض، حي العليا',
    phone: '+966 11 234 5678',
    email: 'finance@ash-holding.sa',
    city: 'الرياض',
  },
  
  secondParty: {
    name: 'محمد أحمد العتيبي',
    identityNumber: '1234567890',
    identityType: 'national_id',
    address: 'المملكة العربية السعودية، جدة، حي الروضة',
    phone: '+966 50 123 4567',
    email: 'mohammed@example.com',
    city: 'جدة',
  },
  
  financials: {
    principalAmount: 10000,
    aprPercent: 12,
    totalFees: 300,
    totalPayable: 10300,
    tenorMonths: 3,
    monthlyPayment: 3433.33,
    currency: 'SAR',
  },
  
  paymentSchedule: [
    { installmentNumber: 1, dueDate: '2026-03-02', amount: 3433.33, status: 'scheduled' },
    { installmentNumber: 2, dueDate: '2026-04-02', amount: 3433.33, status: 'scheduled' },
    { installmentNumber: 3, dueDate: '2026-05-02', amount: 3433.34, status: 'scheduled' },
  ],
  
  fundingPurpose: 'شراء خدمات تقنية من المنصة',
  
  firstPartySignature: {
    signerName: 'إدارة التمويل',
    signedAt: '2026-02-02T10:00:00Z',
    isSigned: true,
  },
  
  secondPartySignature: {
    signerName: 'محمد أحمد العتيبي',
    signedAt: null,
    isSigned: false,
  },
  
  status: 'pending_signature',
};

/**
 * Long contract sample (12 installments)
 */
export const SAMPLE_LONG_CONTRACT: FinanceContractData = {
  contractNumber: 'FIN-2026-0002',
  issueDate: '2026-02-02',
  effectiveDate: '2026-02-02',
  expiryDate: '2027-02-02',
  
  firstParty: {
    name: 'شركة علي صالح الشهري القابضة',
    identityNumber: '1234567890',
    identityType: 'commercial_registration',
    address: 'المملكة العربية السعودية، الرياض، حي العليا، طريق الملك فهد، مبنى رقم ٥٦٧',
    phone: '+966 11 234 5678',
    email: 'finance@ash-holding.sa',
    city: 'الرياض',
  },
  
  secondParty: {
    name: 'مؤسسة التقنية المتقدمة للخدمات التجارية والاستشارية',
    identityNumber: '7654321098765',
    identityType: 'commercial_registration',
    address: 'المملكة العربية السعودية، الدمام، حي الفيصلية، شارع الأمير محمد بن فهد',
    phone: '+966 13 876 5432',
    email: 'info@advanced-tech-services-company.sa',
    city: 'الدمام',
  },
  
  financials: {
    principalAmount: 50000,
    aprPercent: 15,
    totalFees: 3750,
    totalPayable: 53750,
    tenorMonths: 12,
    monthlyPayment: 4479.17,
    currency: 'SAR',
  },
  
  paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
    installmentNumber: i + 1,
    dueDate: new Date(2026, 2 + i, 2).toISOString().split('T')[0],
    amount: i === 11 ? 4479.13 : 4479.17,
    status: 'scheduled' as const,
  })),
  
  fundingPurpose: 'تمويل مشروع التحول الرقمي وتطوير البنية التحتية التقنية',
  
  firstPartySignature: {
    signerName: 'إدارة التمويل',
    signedAt: '2026-02-02T10:00:00Z',
    isSigned: true,
  },
  
  secondPartySignature: {
    signerName: 'عبدالله محمد الغامدي',
    signedAt: '2026-02-02T11:30:00Z',
    ipAddress: '192.168.1.100',
    isSigned: true,
  },
  
  status: 'signed',
};

/**
 * Contract with long identifiers
 */
export const SAMPLE_LONG_IDS_CONTRACT: FinanceContractData = {
  contractNumber: 'FIN-2026-SPECIAL-CORPORATE-0003',
  issueDate: '2026-02-02',
  effectiveDate: '2026-02-02',
  expiryDate: '2026-08-02',
  
  firstParty: {
    name: 'شركة علي صالح الشهري القابضة للاستثمار والتقنية',
    identityNumber: '1234567890123456',
    identityType: 'commercial_registration',
    address: 'المملكة العربية السعودية، منطقة الرياض، مدينة الرياض، حي العليا، طريق الملك فهد، برج المملكة، الطابق ٤٥، مكتب ٤٥٠١-٤٥٠٥',
    phone: '+966 11 234 5678 ext. 1234',
    email: 'finance-department@ash-holding-investment-technology.sa',
    city: 'الرياض',
  },
  
  secondParty: {
    name: 'شركة الحلول التقنية المتكاملة للاستشارات والتطوير المحدودة',
    identityNumber: '9876543210987654',
    identityType: 'commercial_registration',
    address: 'المملكة العربية السعودية، منطقة مكة المكرمة، مدينة جدة، حي الأندلس، شارع الأمير سلطان، مجمع الأندلس التجاري، الدور الثالث',
    phone: '+966 12 345 6789 ext. 5678',
    email: 'contracts@integrated-tech-solutions-consulting-development.com.sa',
    city: 'جدة',
  },
  
  financials: {
    principalAmount: 150000,
    aprPercent: 10,
    totalFees: 7500,
    totalPayable: 157500,
    tenorMonths: 6,
    monthlyPayment: 26250,
    currency: 'SAR',
  },
  
  paymentSchedule: Array.from({ length: 6 }, (_, i) => ({
    installmentNumber: i + 1,
    dueDate: new Date(2026, 2 + i, 2).toISOString().split('T')[0],
    amount: 26250,
    status: 'scheduled' as const,
  })),
  
  fundingPurpose: 'تمويل مشروع إنشاء منصة التجارة الإلكترونية المتكاملة مع نظام إدارة المخزون والمحاسبة',
  
  firstPartySignature: {
    signerName: 'الإدارة المالية والتمويل',
    signedAt: '2026-02-02T10:00:00Z',
    isSigned: true,
  },
  
  secondPartySignature: {
    signerName: 'خالد عبدالرحمن المالكي - المدير التنفيذي',
    signedAt: null,
    isSigned: false,
  },
  
  status: 'pending_signature',
};

export const ALL_SAMPLE_CONTRACTS = [
  { name: 'Short Contract (3 months)', data: SAMPLE_SHORT_CONTRACT },
  { name: 'Long Contract (12 months)', data: SAMPLE_LONG_CONTRACT },
  { name: 'Long IDs Contract', data: SAMPLE_LONG_IDS_CONTRACT },
];
