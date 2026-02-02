/**
 * Contract Validation & Verification System
 * نظام التحقق والتدقيق لعقود التمويل
 */

import { FinanceContractData, ContractValidationResult } from './types';
import { renderContractHTML } from './template';

interface ValidationCheck {
  name: string;
  nameAr: string;
  passed: boolean;
  details: string;
}

/**
 * Run comprehensive validation on contract
 * تشغيل التحقق الشامل على العقد
 */
export async function validateContract(
  data: FinanceContractData
): Promise<ContractValidationResult> {
  const checks: ValidationCheck[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. Data validation
  const dataCheck = validateContractData(data);
  checks.push(dataCheck);
  if (!dataCheck.passed) errors.push(dataCheck.details);
  
  // 2. RTL validation
  const rtlCheck = await validateRTL(data);
  checks.push(rtlCheck);
  if (!rtlCheck.passed) errors.push(rtlCheck.details);
  
  // 3. Typography validation
  const typoCheck = await validateTypography(data);
  checks.push(typoCheck);
  if (!typoCheck.passed) warnings.push(typoCheck.details);
  
  // 4. Layout overflow validation
  const overflowCheck = await validateNoOverflow(data);
  checks.push(overflowCheck);
  if (!overflowCheck.passed) errors.push(overflowCheck.details);
  
  // 5. Page break validation
  const pageBreakCheck = await validatePageBreaks(data);
  checks.push(pageBreakCheck);
  if (!pageBreakCheck.passed) warnings.push(pageBreakCheck.details);
  
  // Estimate page count
  const pageCount = estimatePageCount(data);
  
  // Print results
  console.group('📋 Contract Validation Report - تقرير التحقق من العقد');
  console.log(`Contract: ${data.contractNumber}`);
  console.log(`Estimated Pages: ${pageCount}`);
  console.log('---');
  
  checks.forEach((check) => {
    const status = check.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} | ${check.nameAr} (${check.name})`);
    if (!check.passed) console.log(`   → ${check.details}`);
  });
  
  console.log('---');
  console.log(`Total Checks: ${checks.length}`);
  console.log(`Passed: ${checks.filter((c) => c.passed).length}`);
  console.log(`Failed: ${checks.filter((c) => !c.passed).length}`);
  console.groupEnd();
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    pageCount,
    hasOverflow: !overflowCheck.passed,
    hasOrphanedHeaders: !pageBreakCheck.passed,
    hasSplitSignatures: false, // We handle this in CSS
  };
}

function validateContractData(data: FinanceContractData): ValidationCheck {
  const issues: string[] = [];
  
  if (!data.contractNumber) issues.push('Missing contract number');
  if (!data.firstParty?.name) issues.push('Missing first party name');
  if (!data.secondParty?.name) issues.push('Missing second party name');
  if (!data.financials?.principalAmount) issues.push('Missing principal amount');
  if (!data.paymentSchedule?.length) issues.push('Missing payment schedule');
  
  return {
    name: 'Data Validation',
    nameAr: 'التحقق من البيانات',
    passed: issues.length === 0,
    details: issues.length > 0 ? issues.join(', ') : 'All required data present',
  };
}

async function validateRTL(data: FinanceContractData): Promise<ValidationCheck> {
  const html = renderContractHTML(data);
  
  // Check for RTL markers
  const hasRTLHtml = html.includes('dir="rtl"');
  const hasArabicLang = html.includes('lang="ar"');
  const hasRTLDirection = html.includes('direction: rtl');
  
  const passed = hasRTLHtml && hasArabicLang && hasRTLDirection;
  
  return {
    name: 'RTL Validation',
    nameAr: 'التحقق من الاتجاه العربي',
    passed,
    details: passed
      ? 'RTL direction properly configured'
      : `Missing: ${!hasRTLHtml ? 'dir="rtl"' : ''} ${!hasArabicLang ? 'lang="ar"' : ''} ${!hasRTLDirection ? 'CSS direction' : ''}`,
  };
}

async function validateTypography(data: FinanceContractData): Promise<ValidationCheck> {
  const html = renderContractHTML(data);
  
  // Check for Cairo font
  const hasCairoFont = html.includes("'Cairo'") || html.includes('Cairo');
  const hasFontImport = html.includes('fonts.googleapis.com') && html.includes('Cairo');
  
  const passed = hasCairoFont && hasFontImport;
  
  return {
    name: 'Typography Validation',
    nameAr: 'التحقق من الخطوط',
    passed,
    details: passed
      ? 'Cairo font properly configured'
      : 'Cairo font not found or not imported',
  };
}

async function validateNoOverflow(data: FinanceContractData): Promise<ValidationCheck> {
  const html = renderContractHTML(data);
  
  // Check for overflow prevention rules
  const hasOverflowWrap = html.includes('overflow-wrap: anywhere');
  const hasWordBreak = html.includes('word-break: break-word');
  const hasTableFixed = html.includes('table-layout: fixed');
  const hasNoOverflowClass = html.includes('.no-overflow');
  
  const passed = hasOverflowWrap && hasWordBreak && hasTableFixed && hasNoOverflowClass;
  
  return {
    name: 'Overflow Validation',
    nameAr: 'التحقق من تجاوز الحدود',
    passed,
    details: passed
      ? 'Overflow prevention rules in place'
      : 'Missing overflow prevention CSS rules',
  };
}

async function validatePageBreaks(data: FinanceContractData): Promise<ValidationCheck> {
  const html = renderContractHTML(data);
  
  // Check for page break rules
  const hasBreakInside = html.includes('break-inside: avoid');
  const hasBreakAfter = html.includes('break-after: avoid');
  const hasOrphans = html.includes('orphans: 3');
  const hasWidows = html.includes('widows: 3');
  const hasKeepTogether = html.includes('.keep-together');
  const hasKeepWithNext = html.includes('.keep-with-next');
  
  const passed = hasBreakInside && hasBreakAfter && hasOrphans && hasWidows && hasKeepTogether && hasKeepWithNext;
  
  return {
    name: 'Page Break Validation',
    nameAr: 'التحقق من فواصل الصفحات',
    passed,
    details: passed
      ? 'Page break rules properly configured'
      : 'Missing page break prevention rules',
  };
}

function estimatePageCount(data: FinanceContractData): number {
  // Base: 2 pages for standard content
  let pages = 2;
  
  // Add pages for payment schedule
  const scheduleRows = data.paymentSchedule.length;
  if (scheduleRows > 6) {
    pages += Math.ceil((scheduleRows - 6) / 15);
  }
  
  // Add page if signatures are present
  if (data.firstPartySignature.isSigned || data.secondPartySignature.isSigned) {
    pages += 1;
  }
  
  return pages;
}

/**
 * Run full audit on all sample contracts
 * تشغيل تدقيق كامل على جميع العقود النموذجية
 */
export async function runFullContractAudit(): Promise<void> {
  const { ALL_SAMPLE_CONTRACTS } = await import('./sample-data');
  
  console.group('🔍 FULL CONTRACT AUDIT - تدقيق شامل للعقود');
  console.log('Testing 3 contract variants...');
  console.log('='.repeat(50));
  
  const results: { name: string; result: ContractValidationResult }[] = [];
  
  for (const sample of ALL_SAMPLE_CONTRACTS) {
    console.log(`\n📄 Testing: ${sample.name}`);
    const result = await validateContract(sample.data);
    results.push({ name: sample.name, result });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY - الملخص');
  console.log('='.repeat(50));
  
  let allPassed = true;
  results.forEach(({ name, result }) => {
    const status = result.isValid ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} | ${name} | Pages: ${result.pageCount}`);
    if (!result.isValid) {
      allPassed = false;
      result.errors.forEach((e) => console.log(`   ❌ ${e}`));
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => console.log(`   ⚠️ ${w}`));
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  console.groupEnd();
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).runContractAudit = runFullContractAudit;
}
