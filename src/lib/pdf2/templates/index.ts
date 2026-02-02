/**
 * PDF TEMPLATES INDEX
 * 
 * Central exports for all PDF templates.
 */

// Invoice template
export {
  buildInvoiceDoc,
  calculateInvoiceTotals,
  orderToInvoiceData,
  sampleInvoiceData,
  type InvoiceData,
  type InvoiceItem,
} from './invoice-template';

// Contract template
export {
  buildContractDoc,
  defaultContractClauses,
  sampleContractData,
  type ContractData,
  type ContractParty,
  type ContractClause,
} from './contract-template';

// Transaction report template
export {
  buildTransactionReportDoc,
  type TransactionSummary,
  type TransactionItem,
  type TransactionReportOptions,
} from './transaction-report-template';
