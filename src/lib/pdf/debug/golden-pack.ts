/**
 * ASH Holding - Golden PDF Pack Generator
 * 
 * Generates a complete set of branded PDFs for visual verification.
 * All PDFs use the unified brand system and should look consistent.
 */

import { initPdf } from '../core/pdf-core';
import { createInvoicePDF, sampleInvoiceArabicOnly, sampleInvoiceMixed } from '../templates/invoice.template';
import { createContractPDF, sampleContractShort, sampleContractLong } from '../templates/contract.template';
import { verifyBrandCompliance, type BrandComplianceReport } from './brand-verify';

export interface GoldenPackResult {
  success: boolean;
  generated: {
    invoiceAr: boolean;
    invoiceMixed: boolean;
    contractAr: boolean;
    contractMixed: boolean;
  };
  compliance: BrandComplianceReport | null;
  errors: string[];
  timestamp: string;
}

/**
 * Generate complete golden PDF pack
 */
export async function generateGoldenPack(): Promise<GoldenPackResult> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[GOLDEN PACK] Starting ASH Holding PDF Generation...');
  console.log('═══════════════════════════════════════════════════════════');
  
  const result: GoldenPackResult = {
    success: false,
    generated: {
      invoiceAr: false,
      invoiceMixed: false,
      contractAr: false,
      contractMixed: false,
    },
    compliance: null,
    errors: [],
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Step 1: Initialize PDF system
    console.log('[GOLDEN PACK] Step 1: Initializing PDF system...');
    await initPdf();
    console.log('[GOLDEN PACK] ✅ PDF system initialized');
    
    // Step 2: Run brand compliance check
    console.log('[GOLDEN PACK] Step 2: Running brand compliance check...');
    result.compliance = verifyBrandCompliance();
    
    if (!result.compliance.allPassed) {
      console.warn('[GOLDEN PACK] ⚠️ Brand compliance issues found:');
      result.compliance.issues.forEach(issue => {
        console.warn(`   - ${issue}`);
        result.errors.push(issue);
      });
    } else {
      console.log('[GOLDEN PACK] ✅ Brand compliance verified');
    }
    
    // Step 3: Generate Invoice PDFs
    console.log('[GOLDEN PACK] Step 3: Generating invoice PDFs...');
    
    try {
      console.log('[GOLDEN PACK]   → invoice-ar.pdf (Arabic only)...');
      await createInvoicePDF(sampleInvoiceArabicOnly, {
        download: true,
        filename: 'invoice-ar.pdf',
      });
      result.generated.invoiceAr = true;
      console.log('[GOLDEN PACK]   ✅ invoice-ar.pdf generated');
    } catch (error) {
      const msg = `Invoice AR failed: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(msg);
      console.error('[GOLDEN PACK]   ❌', msg);
    }
    
    try {
      console.log('[GOLDEN PACK]   → invoice-mixed.pdf (Arabic + numbers)...');
      await createInvoicePDF(sampleInvoiceMixed, {
        download: true,
        filename: 'invoice-mixed.pdf',
      });
      result.generated.invoiceMixed = true;
      console.log('[GOLDEN PACK]   ✅ invoice-mixed.pdf generated');
    } catch (error) {
      const msg = `Invoice Mixed failed: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(msg);
      console.error('[GOLDEN PACK]   ❌', msg);
    }
    
    // Step 4: Generate Contract PDFs
    console.log('[GOLDEN PACK] Step 4: Generating contract PDFs...');
    
    try {
      console.log('[GOLDEN PACK]   → contract-ar.pdf (Short contract)...');
      await createContractPDF(sampleContractShort, {
        download: true,
        filename: 'contract-ar.pdf',
      });
      result.generated.contractAr = true;
      console.log('[GOLDEN PACK]   ✅ contract-ar.pdf generated');
    } catch (error) {
      const msg = `Contract AR failed: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(msg);
      console.error('[GOLDEN PACK]   ❌', msg);
    }
    
    try {
      console.log('[GOLDEN PACK]   → contract-mixed.pdf (Long contract with signatures)...');
      await createContractPDF(sampleContractLong, {
        download: true,
        filename: 'contract-mixed.pdf',
      });
      result.generated.contractMixed = true;
      console.log('[GOLDEN PACK]   ✅ contract-mixed.pdf generated');
    } catch (error) {
      const msg = `Contract Mixed failed: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(msg);
      console.error('[GOLDEN PACK]   ❌', msg);
    }
    
    // Step 5: Final status
    const allGenerated = Object.values(result.generated).every(v => v);
    result.success = allGenerated && (result.compliance?.allPassed ?? false);
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('[GOLDEN PACK] GENERATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('Generated PDFs:');
    console.log(`  invoice-ar.pdf:     ${result.generated.invoiceAr ? '✅' : '❌'}`);
    console.log(`  invoice-mixed.pdf:  ${result.generated.invoiceMixed ? '✅' : '❌'}`);
    console.log(`  contract-ar.pdf:    ${result.generated.contractAr ? '✅' : '❌'}`);
    console.log(`  contract-mixed.pdf: ${result.generated.contractMixed ? '✅' : '❌'}`);
    console.log('');
    console.log('Brand Compliance:');
    console.log(`  Fonts:    ${result.compliance?.fontsValid ? '✅' : '❌'}`);
    console.log(`  Colors:   ${result.compliance?.colorsValid ? '✅' : '❌'}`);
    console.log(`  Spacing:  ${result.compliance?.spacingValid ? '✅' : '❌'}`);
    console.log('');
    console.log(`OVERALL: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('');
    
    if (result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach(err => console.log(`  - ${err}`));
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    const msg = `Fatal error: ${error instanceof Error ? error.message : String(error)}`;
    result.errors.push(msg);
    console.error('[GOLDEN PACK] ❌ Fatal error:', error);
  }
  
  return result;
}

// Visual acceptance checklist helper
export function printVisualChecklist(): void {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('VISUAL ACCEPTANCE CHECKLIST');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Open each PDF and verify:');
  console.log('');
  console.log('[ ] 1. No □ squares (Arabic renders correctly)');
  console.log('[ ] 2. RTL paragraphs correct (right-to-left flow)');
  console.log('[ ] 3. Tables correct RTL and aligned');
  console.log('[ ] 4. Numbers/IDs remain LTR (readable left-to-right)');
  console.log('[ ] 5. Professional corporate look');
  console.log('[ ] 6. Consistent branding across all PDFs');
  console.log('[ ] 7. Header/footer match between invoice and contract');
  console.log('[ ] 8. Colors match brand (navy primary, gold accent)');
  console.log('[ ] 9. Typography consistent (Cairo font everywhere)');
  console.log('[ ] 10. Spacing and margins uniform');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as unknown as { generateGoldenPack: typeof generateGoldenPack }).generateGoldenPack = generateGoldenPack;
  (window as unknown as { printVisualChecklist: typeof printVisualChecklist }).printVisualChecklist = printVisualChecklist;
}
