/**
 * PDF Templates Index
 * 
 * Re-exports all PDF templates.
 */

// Invoice template
export {
  createInvoicePDF,
  generateInvoiceContent,
  calculateVAT,
  calculateInvoiceTotals,
  orderToInvoiceData,
  type InvoiceData,
  type InvoiceItem,
  type InvoiceCustomer,
  type CompanyInfo,
  type CreateInvoicePDFOptions,
} from './invoice.template';

// Contract template
export {
  createContractPDF,
  generateContractContent,
  dbContractToContractData,
  defaultContractClauses,
  type ContractData,
  type ContractParty,
  type ContractClause,
  type ContractPricing,
  type CreateContractPDFOptions,
} from './contract.template';
