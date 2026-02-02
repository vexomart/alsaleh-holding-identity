/**
 * Finance Contract Renderer Module
 * وحدة عرض عقود التمويل
 * شركة علي صالح الشهري القابضة
 * 
 * Features:
 * - 100% Arabic RTL support
 * - A4 print-ready layout
 * - Professional typography (Cairo font)
 * - Strict pagination controls
 * - Digital signature stamps
 * - Validation & verification system
 */

// Types
export type {
  ContractParty,
  PaymentInstallment,
  ContractFinancials,
  ContractSignature,
  FinanceContractData,
  ContractRenderOptions,
  ContractValidationResult,
} from './types';

// Arabic utilities
export {
  toArabicDigits,
  toWesternDigits,
  formatCurrencyArabic,
  formatPercentArabic,
  formatDateArabic,
  formatDateShortArabic,
  numberToArabicWords,
  formatPhoneArabic,
  getArabicMonthName,
  formatPageNumber,
  formatInstallmentNumber,
} from './arabic-utils';

// Template rendering
export { renderContractHTML } from './template';

// PDF generation
export {
  generateContractPdf,
  printContract,
  previewContract,
  downloadContractHTML,
  getContractHTML,
} from './pdf-engine';

// Legal articles
export {
  FINANCE_CONTRACT_ARTICLES,
  getCompactArticles,
  formatArticleNumber,
} from './legal-articles';

// Validation
export {
  validateContract,
  runFullContractAudit,
} from './validation';

// Sample data (for testing)
export {
  SAMPLE_SHORT_CONTRACT,
  SAMPLE_LONG_CONTRACT,
  SAMPLE_LONG_IDS_CONTRACT,
  ALL_SAMPLE_CONTRACTS,
} from './sample-data';
