/**
 * Contract Renderer Test Utilities
 * أدوات اختبار مُولّد العقود
 * 
 * Usage in browser console:
 * - window.runContractAudit() - Run full validation on all sample contracts
 * - window.previewSampleContract('short' | 'long' | 'long-ids') - Preview a sample contract
 * - window.printSampleContract('short' | 'long' | 'long-ids') - Print a sample contract
 */

import {
  SAMPLE_SHORT_CONTRACT,
  SAMPLE_LONG_CONTRACT,
  SAMPLE_LONG_IDS_CONTRACT,
  previewContract,
  printContract,
  downloadContractHTML,
  runFullContractAudit,
  validateContract,
  FinanceContractData,
} from '@/lib/contracts/contract-renderer';

type SampleType = 'short' | 'long' | 'long-ids';

function getSampleData(type: SampleType): FinanceContractData {
  switch (type) {
    case 'short':
      return SAMPLE_SHORT_CONTRACT;
    case 'long':
      return SAMPLE_LONG_CONTRACT;
    case 'long-ids':
      return SAMPLE_LONG_IDS_CONTRACT;
    default:
      return SAMPLE_SHORT_CONTRACT;
  }
}

/**
 * Preview a sample contract in a new window
 */
export function previewSampleContract(type: SampleType = 'short'): void {
  const data = getSampleData(type);
  console.log(`📄 Opening preview for ${type} contract: ${data.contractNumber}`);
  previewContract(data);
}

/**
 * Print a sample contract
 */
export function printSampleContract(type: SampleType = 'short'): void {
  const data = getSampleData(type);
  console.log(`🖨️ Printing ${type} contract: ${data.contractNumber}`);
  printContract(data);
}

/**
 * Download a sample contract as HTML
 */
export function downloadSampleContract(type: SampleType = 'short'): void {
  const data = getSampleData(type);
  console.log(`⬇️ Downloading ${type} contract: ${data.contractNumber}`);
  downloadContractHTML(data);
}

/**
 * Validate a specific sample contract
 */
export async function validateSampleContract(type: SampleType = 'short'): Promise<void> {
  const data = getSampleData(type);
  console.log(`🔍 Validating ${type} contract: ${data.contractNumber}`);
  await validateContract(data);
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).runContractAudit = runFullContractAudit;
  (window as any).previewSampleContract = previewSampleContract;
  (window as any).printSampleContract = printSampleContract;
  (window as any).downloadSampleContract = downloadSampleContract;
  (window as any).validateSampleContract = validateSampleContract;
  
  console.log('📋 Contract Test Utilities Loaded');
  console.log('   → runContractAudit() - Full validation suite');
  console.log('   → previewSampleContract("short" | "long" | "long-ids")');
  console.log('   → printSampleContract("short" | "long" | "long-ids")');
  console.log('   → downloadSampleContract("short" | "long" | "long-ids")');
  console.log('   → validateSampleContract("short" | "long" | "long-ids")');
}

export { runFullContractAudit };
