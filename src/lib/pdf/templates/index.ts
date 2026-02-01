/**
 * PDF Templates Index
 * 
 * Re-exports all PDF templates.
 */

// Invoice template
export {
  createInvoicePDF,
  createInvoicePDFLocal,
  generateInvoiceContent,
  calculateVAT,
  calculateInvoiceTotals,
  orderToInvoiceData,
  // Sample data
  sampleInvoiceArabicOnly,
  sampleInvoiceMixed,
  type InvoiceData,
  type InvoiceItem,
  type InvoiceCustomer,
  type CompanyInfo,
  type CreateInvoicePDFOptions,
} from './invoice.template';

// Contract template
export {
  createContractPDF,
  createContractPDFLocal,
  generateContractContent,
  dbContractToContractData,
  defaultContractClauses,
  // Sample data
  sampleContractShort,
  sampleContractLong,
  type ContractData,
  type ContractParty,
  type ContractClause,
  type ContractPricing,
  type ContractSignatureStatus,
  type CreateContractPDFOptions,
} from './contract.template';
