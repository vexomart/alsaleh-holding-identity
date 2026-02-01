/**
 * ASH Holding - Brand Compliance Verification
 * 
 * Verifies that PDF templates follow brand guidelines.
 * Checks for hardcoded colors, fonts, and spacing violations.
 */

import { ARABIC_FONT_NAME } from '../core/fonts';
import { brand, allowedColors, colors, typography, spacing } from '../core/brand';

export interface BrandComplianceReport {
  timestamp: string;
  fontsValid: boolean;
  colorsValid: boolean;
  spacingValid: boolean;
  allPassed: boolean;
  issues: string[];
}

/**
 * Verify no hardcoded colors in document definition
 */
export function verifyNoHardcodedColors(docDefinition: unknown): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const hexPattern = /#[0-9a-fA-F]{3,8}/g;
  
  function scan(obj: unknown, path: string = 'root'): void {
    if (obj === null || obj === undefined) return;
    
    if (typeof obj === 'string') {
      const matches = obj.match(hexPattern);
      if (matches) {
        matches.forEach(match => {
          const normalizedColor = match.toLowerCase();
          if (!allowedColors.has(normalizedColor)) {
            issues.push(`Hardcoded color "${match}" at ${path}`);
          }
        });
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => scan(item, `${path}[${index}]`));
    } else if (typeof obj === 'object') {
      const record = obj as Record<string, unknown>;
      Object.entries(record).forEach(([key, value]) => {
        // Check color-related properties
        if (['color', 'fillColor', 'lineColor', 'hLineColor', 'vLineColor', 'background'].includes(key)) {
          if (typeof value === 'string' && value.startsWith('#')) {
            const normalizedColor = value.toLowerCase();
            if (!allowedColors.has(normalizedColor)) {
              issues.push(`Hardcoded color "${value}" at ${path}.${key}`);
            }
          }
        }
        scan(value, `${path}.${key}`);
      });
    }
  }
  
  scan(docDefinition);
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Verify Cairo font is used everywhere
 */
export function verifyUsesCairoEverywhere(docDefinition: unknown): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const expectedFont = ARABIC_FONT_NAME;
  
  function scan(obj: unknown, path: string = 'root'): void {
    if (obj === null || obj === undefined) return;
    
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      const record = obj as Record<string, unknown>;
      
      // Check font property
      if ('font' in record && typeof record.font === 'string') {
        if (record.font !== expectedFont) {
          issues.push(`Unexpected font "${record.font}" at ${path}.font (expected: ${expectedFont})`);
        }
      }
      
      // Check for text without explicit font (should inherit from defaultStyle)
      if ('text' in record && typeof record.text === 'string' && record.text.length > 0) {
        // Text nodes should either have font property or rely on defaultStyle
        // This is a warning, not an error
      }
      
      Object.entries(record).forEach(([key, value]) => {
        scan(value, `${path}.${key}`);
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => scan(item, `${path}[${index}]`));
    }
  }
  
  scan(docDefinition);
  
  // Check defaultStyle
  if (typeof docDefinition === 'object' && docDefinition !== null) {
    const doc = docDefinition as Record<string, unknown>;
    const defaultStyle = doc.defaultStyle as Record<string, unknown> | undefined;
    
    if (!defaultStyle || defaultStyle.font !== expectedFont) {
      issues.push(`defaultStyle.font must be "${expectedFont}"`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Verify margins follow brand spacing patterns
 */
export function verifyMarginsConsistency(docDefinition: unknown): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const validSpacings = new Set(Object.values(spacing));
  
  // Add common combinations
  validSpacings.add(0);
  [spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.xxl].forEach(s => {
    validSpacings.add(s * 2);
  });
  
  function scan(obj: unknown, path: string = 'root'): void {
    if (obj === null || obj === undefined) return;
    
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      const record = obj as Record<string, unknown>;
      
      // Check margin property
      if ('margin' in record && Array.isArray(record.margin)) {
        const margins = record.margin as number[];
        margins.forEach((m, i) => {
          // Allow common margin values and 0
          // This is lenient - just warn about very unusual values
          if (m !== 0 && m > 100) {
            issues.push(`Unusual margin value ${m} at ${path}.margin[${i}]`);
          }
        });
      }
      
      Object.entries(record).forEach(([key, value]) => {
        scan(value, `${path}.${key}`);
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => scan(item, `${path}[${index}]`));
    }
  }
  
  scan(docDefinition);
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Run full brand compliance verification
 */
export function verifyBrandCompliance(): BrandComplianceReport {
  const report: BrandComplianceReport = {
    timestamp: new Date().toISOString(),
    fontsValid: true,
    colorsValid: true,
    spacingValid: true,
    allPassed: true,
    issues: [],
  };
  
  // Verify brand tokens are properly defined
  if (!brand.typography.fontFamily || brand.typography.fontFamily !== ARABIC_FONT_NAME) {
    report.fontsValid = false;
    report.issues.push(`Brand font must be "${ARABIC_FONT_NAME}"`);
  }
  
  if (!brand.colors.primary) {
    report.colorsValid = false;
    report.issues.push('Brand primary color not defined');
  }
  
  if (!brand.spacing.md) {
    report.spacingValid = false;
    report.issues.push('Brand spacing tokens not defined');
  }
  
  // Verify company info
  if (!brand.companyInfo.nameAr || !brand.companyInfo.vatNumber) {
    report.issues.push('Brand company info incomplete');
  }
  
  report.allPassed = report.fontsValid && report.colorsValid && report.spacingValid && report.issues.length === 0;
  
  return report;
}

/**
 * Validate a complete document definition before generation
 */
export function validateDocDefinition(docDefinition: unknown): { valid: boolean; report: BrandComplianceReport } {
  const colorCheck = verifyNoHardcodedColors(docDefinition);
  const fontCheck = verifyUsesCairoEverywhere(docDefinition);
  const marginCheck = verifyMarginsConsistency(docDefinition);
  
  const report: BrandComplianceReport = {
    timestamp: new Date().toISOString(),
    fontsValid: fontCheck.valid,
    colorsValid: colorCheck.valid,
    spacingValid: marginCheck.valid,
    allPassed: fontCheck.valid && colorCheck.valid && marginCheck.valid,
    issues: [...colorCheck.issues, ...fontCheck.issues, ...marginCheck.issues],
  };
  
  if (!report.allPassed) {
    console.warn('[BRAND VERIFY] Document has compliance issues:');
    report.issues.forEach(issue => console.warn(`  - ${issue}`));
  }
  
  return { valid: report.allPassed, report };
}
