/**
 * ASH Holding - Shared PDF Sections
 * 
 * Reusable header, footer, and section builders for all PDF templates.
 * Ensures consistent branding across invoices, contracts, and reports.
 */

import { ARABIC_FONT_NAME } from './fonts';
import { ltr } from './arabic';
import { brand, colors, spacing, typography, components, companyInfo, page } from './brand';
import type { PDFContent } from './layout';

// ============================================
// HEADER BUILDER
// ============================================

export interface PdfHeaderOptions {
  titleAr: string;
  titleEn?: string;
  metaLeft?: { label: string; value: string; valueLTR?: boolean }[];
  metaRight?: { label: string; value: string; valueLTR?: boolean }[];
  logoUrl?: string;
  showCompanyInfo?: boolean;
}

/**
 * Build unified PDF header with company branding
 */
export function buildPdfHeader(options: PdfHeaderOptions): PDFContent[] {
  const content: PDFContent[] = [];
  
  // === TOP BRAND BAR ===
  content.push({
    canvas: [{
      type: 'rect',
      x: 0,
      y: 0,
      w: page.width,
      h: components.headerBar.height,
      color: components.headerBar.color,
    }],
    margin: [0, 0, 0, spacing.lg],
  });
  
  // === DOCUMENT TITLE ===
  content.push({
    text: options.titleAr,
    font: typography.fontFamily,
    fontSize: typography.sizes.h1,
    bold: true,
    alignment: 'center',
    color: colors.primary,
    margin: [0, 0, 0, spacing.xs],
  });
  
  if (options.titleEn) {
    content.push({
      text: options.titleEn,
      font: typography.fontFamily,
      fontSize: typography.sizes.h4,
      color: colors.text.muted,
      alignment: 'center',
      margin: [0, 0, 0, spacing.lg],
    });
  }
  
  // === COMPANY INFO BLOCK ===
  if (options.showCompanyInfo !== false) {
    const companyStack: PDFContent[] = [
      {
        text: companyInfo.nameAr,
        font: typography.fontFamily,
        fontSize: typography.sizes.h2,
        bold: true,
        color: colors.primary,
        alignment: 'center',
        margin: [0, 0, 0, spacing.xs],
      },
      {
        text: companyInfo.nameEn,
        font: typography.fontFamily,
        fontSize: typography.sizes.body,
        color: colors.text.muted,
        alignment: 'center',
        margin: [0, 0, 0, spacing.sm],
      },
    ];
    
    // VAT & CR Numbers
    companyStack.push({
      columns: [
        {
          text: `السجل التجاري: ${ltr(companyInfo.crNumber)}`,
          font: typography.fontFamily,
          fontSize: typography.sizes.small,
          color: colors.text.secondary,
          alignment: 'left',
        },
        {
          text: `الرقم الضريبي: ${ltr(companyInfo.vatNumber)}`,
          font: typography.fontFamily,
          fontSize: typography.sizes.small,
          color: colors.text.secondary,
          alignment: 'right',
        },
      ],
      margin: [0, 0, 0, spacing.xs],
    });
    
    // Contact Info
    companyStack.push({
      text: `${companyInfo.addressAr} | ${ltr(companyInfo.phone)} | ${ltr(companyInfo.email)}`,
      font: typography.fontFamily,
      fontSize: typography.sizes.tiny,
      color: colors.text.muted,
      alignment: 'center',
      margin: [0, 0, 0, spacing.xs],
    });
    
    companyStack.push({
      text: companyInfo.website,
      font: typography.fontFamily,
      fontSize: typography.sizes.tiny,
      color: colors.primary,
      alignment: 'center',
    });
    
    content.push({
      table: {
        widths: ['*'],
        body: [[{
          stack: companyStack,
          margin: [spacing.lg, spacing.md, spacing.lg, spacing.md],
        }]],
      },
      layout: {
        fillColor: () => colors.background.section,
        hLineColor: () => colors.border.light,
        vLineColor: () => colors.border.light,
        hLineWidth: () => 1,
        vLineWidth: () => 1,
      },
      margin: [0, 0, 0, spacing.lg],
    });
  }
  
  // === ACCENT DIVIDER ===
  content.push({
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 0,
      x2: page.width,
      y2: 0,
      lineWidth: components.dividerAccent.width,
      lineColor: components.dividerAccent.color,
    }],
    margin: [0, spacing.sm, 0, spacing.lg],
  });
  
  // === META INFO (Two Columns) ===
  if (options.metaLeft?.length || options.metaRight?.length) {
    content.push({
      columns: [
        // Left column (Customer/Buyer info - visually on right in RTL)
        {
          width: '48%',
          stack: options.metaLeft?.map(item => ({
            columns: [
              {
                text: item.valueLTR ? ltr(item.value) : item.value,
                font: typography.fontFamily,
                fontSize: typography.sizes.body,
                bold: true,
                color: colors.text.primary,
                alignment: item.valueLTR ? 'left' as const : 'right' as const,
                width: 'auto',
              },
              {
                text: ':',
                font: typography.fontFamily,
                fontSize: typography.sizes.body,
                color: colors.text.muted,
                alignment: 'center' as const,
                width: 12,
              },
              {
                text: item.label,
                font: typography.fontFamily,
                fontSize: typography.sizes.small,
                color: colors.text.muted,
                alignment: 'right' as const,
                width: '*',
              },
            ],
            margin: [0, 2, 0, 2],
          })) || [],
        },
        // Spacer
        { width: '4%', text: '' },
        // Right column (Document info - visually on left in RTL)
        {
          width: '48%',
          stack: options.metaRight?.map(item => ({
            columns: [
              {
                text: item.valueLTR ? ltr(item.value) : item.value,
                font: typography.fontFamily,
                fontSize: typography.sizes.body,
                bold: true,
                color: colors.text.primary,
                alignment: item.valueLTR ? 'left' as const : 'right' as const,
                width: 'auto',
              },
              {
                text: ':',
                font: typography.fontFamily,
                fontSize: typography.sizes.body,
                color: colors.text.muted,
                alignment: 'center' as const,
                width: 12,
              },
              {
                text: item.label,
                font: typography.fontFamily,
                fontSize: typography.sizes.small,
                color: colors.text.muted,
                alignment: 'right' as const,
                width: '*',
              },
            ],
            margin: [0, 2, 0, 2],
          })) || [],
        },
      ],
      margin: [0, 0, 0, spacing.lg],
    });
  }
  
  return content;
}

// ============================================
// FOOTER BUILDER
// ============================================

export interface PdfFooterOptions {
  website?: string;
  showTimestamp?: boolean;
  customText?: string;
}

/**
 * Build unified PDF footer (for pdfmake footer function)
 */
export function buildPdfFooter(options: PdfFooterOptions = {}): (currentPage: number, pageCount: number) => PDFContent {
  const website = options.website || companyInfo.website;
  
  return (currentPage: number, pageCount: number): PDFContent => {
    const stack: PDFContent[] = [];
    
    // Top border line
    stack.push({
      canvas: [{
        type: 'line',
        x1: 0,
        y1: 0,
        x2: page.width,
        y2: 0,
        lineWidth: 1,
        lineColor: colors.border.light,
      }],
      margin: [0, 0, 0, spacing.sm],
    });
    
    // Footer content
    const footerColumns: PDFContent[] = [
      // Website (left in visual, right in RTL)
      {
        text: website,
        font: typography.fontFamily,
        fontSize: components.footer.fontSize,
        color: components.footer.websiteColor,
        alignment: 'left' as const,
        width: '*',
      },
      // Page number (center)
      {
        text: `صفحة ${currentPage} من ${pageCount}`,
        font: typography.fontFamily,
        fontSize: components.footer.fontSize,
        color: components.footer.color,
        alignment: 'center' as const,
        width: 'auto',
      },
    ];
    
    // Timestamp (right in visual, left in RTL)
    if (options.showTimestamp !== false) {
      footerColumns.push({
        text: new Date().toLocaleDateString('ar-SA'),
        font: typography.fontFamily,
        fontSize: components.footer.fontSize,
        color: components.footer.color,
        alignment: 'right' as const,
        width: '*',
      });
    } else {
      footerColumns.push({ text: '', width: '*' });
    }
    
    stack.push({
      columns: footerColumns,
    });
    
    // Custom text if provided
    if (options.customText) {
      stack.push({
        text: options.customText,
        font: typography.fontFamily,
        fontSize: typography.sizes.micro,
        color: colors.text.disabled,
        alignment: 'center' as const,
        margin: [0, spacing.xs, 0, 0],
      });
    }
    
    return {
      stack,
      margin: [page.margins.document[0], 0, page.margins.document[2], spacing.sm],
    };
  };
}

// ============================================
// INFO CARD BUILDER
// ============================================

export interface InfoCardOptions {
  titleAr: string;
  titleEn?: string;
  items: { label: string; value: string; valueLTR?: boolean }[];
  accentColor?: string;
}

/**
 * Build info card (buyer/seller blocks)
 */
export function buildInfoCard(options: InfoCardOptions): PDFContent {
  const cardContent: PDFContent[] = [
    {
      text: options.titleAr,
      font: typography.fontFamily,
      fontSize: components.infoCard.titleSize,
      bold: true,
      color: options.accentColor || components.infoCard.titleColor,
      alignment: 'right',
      margin: [0, 0, 0, spacing.xs],
    },
  ];
  
  if (options.titleEn) {
    cardContent.push({
      text: options.titleEn,
      font: typography.fontFamily,
      fontSize: typography.sizes.tiny,
      color: colors.text.muted,
      alignment: 'right',
      margin: [0, 0, 0, spacing.sm],
    });
  }
  
  // Items as key-value pairs
  options.items.forEach(item => {
    cardContent.push({
      columns: [
        {
          text: item.valueLTR ? ltr(item.value) : item.value,
          font: typography.fontFamily,
          fontSize: typography.sizes.body,
          bold: true,
          color: components.infoCard.valueColor,
          alignment: item.valueLTR ? 'left' as const : 'right' as const,
          width: 'auto',
        },
        {
          text: ':',
          font: typography.fontFamily,
          color: colors.text.muted,
          alignment: 'center' as const,
          width: 12,
        },
        {
          text: item.label,
          font: typography.fontFamily,
          fontSize: typography.sizes.small,
          color: components.infoCard.labelColor,
          alignment: 'right' as const,
          width: '*',
        },
      ],
      margin: [0, 2, 0, 2],
    });
  });
  
  return {
    table: {
      widths: ['*'],
      body: [[{
        stack: cardContent,
        margin: components.infoCard.padding,
      }]],
    },
    layout: {
      fillColor: () => components.infoCard.background,
      hLineColor: () => components.infoCard.border,
      vLineColor: () => components.infoCard.border,
      hLineWidth: () => components.infoCard.borderWidth,
      vLineWidth: () => components.infoCard.borderWidth,
    },
    margin: components.infoCard.margin,
  };
}

// ============================================
// TOTALS BOX BUILDER
// ============================================

export interface TotalsBoxOptions {
  items: { label: string; value: string; isTotal?: boolean; isTax?: boolean }[];
  showVatBadge?: boolean;
  vatRate?: number;
}

/**
 * Build totals box (subtotal, VAT, total)
 */
export function buildTotalsBox(options: TotalsBoxOptions): PDFContent {
  const rows = options.items.map(item => {
    const isTotal = item.isTotal;
    const isTax = item.isTax;
    
    return [
      {
        text: ltr(item.value),
        font: typography.fontFamily,
        fontSize: isTotal ? components.totalsBox.totalSize : typography.sizes.body,
        bold: isTotal,
        color: isTotal ? components.totalsBox.totalValueColor : components.totalsBox.valueColor,
        alignment: 'left' as const,
        margin: [spacing.sm, spacing.sm, spacing.sm, spacing.sm],
        fillColor: isTax && options.showVatBadge ? components.totalsBox.vatBadgeBackground : undefined,
      },
      {
        text: item.label,
        font: typography.fontFamily,
        fontSize: isTotal ? components.totalsBox.totalSize : typography.sizes.body,
        bold: isTotal,
        color: isTotal ? components.totalsBox.totalLabelColor : components.totalsBox.labelColor,
        alignment: 'right' as const,
        margin: [spacing.sm, spacing.sm, spacing.sm, spacing.sm],
        fillColor: isTax && options.showVatBadge ? components.totalsBox.vatBadgeBackground : undefined,
      },
    ];
  });
  
  return {
    table: {
      widths: [140, '*'],
      body: rows,
    },
    layout: {
      fillColor: (rowIndex: number) => {
        const item = options.items[rowIndex];
        if (item?.isTotal) return colors.background.highlight;
        if (item?.isTax && options.showVatBadge) return components.totalsBox.vatBadgeBackground;
        return colors.background.section;
      },
      hLineColor: () => components.totalsBox.border,
      vLineColor: () => components.totalsBox.border,
      hLineWidth: () => components.totalsBox.borderWidth,
      vLineWidth: () => components.totalsBox.borderWidth,
    },
    margin: [0, spacing.md, 0, spacing.md],
  };
}

// ============================================
// BADGE BUILDER
// ============================================

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Build status badge/chip
 */
export function buildBadge(text: string, variant: BadgeVariant = 'neutral'): PDFContent {
  const statusColors = brand.getStatusColors(variant);
  
  return {
    table: {
      body: [[{
        text,
        font: typography.fontFamily,
        fontSize: components.badge.fontSize,
        color: statusColors.text,
        alignment: 'center' as const,
        margin: components.badge.padding,
      }]],
    },
    layout: {
      fillColor: () => statusColors.bg,
      hLineColor: () => statusColors.border,
      vLineColor: () => statusColors.border,
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
  };
}

// ============================================
// SECTION TITLE BUILDER
// ============================================

/**
 * Build section title with optional subtitle
 */
export function buildSectionTitle(titleAr: string, titleEn?: string): PDFContent {
  const content: PDFContent[] = [
    {
      text: titleAr,
      font: typography.fontFamily,
      fontSize: typography.sizes.h3,
      bold: true,
      color: colors.primary,
      alignment: 'right',
      margin: [0, 0, 0, titleEn ? spacing.xs : spacing.sm],
    },
  ];
  
  if (titleEn) {
    content.push({
      text: titleEn,
      font: typography.fontFamily,
      fontSize: typography.sizes.tiny,
      color: colors.text.muted,
      alignment: 'right',
      margin: [0, 0, 0, spacing.sm],
    });
  }
  
  return { stack: content };
}

// ============================================
// DIVIDER BUILDER
// ============================================

/**
 * Build divider line
 */
export function buildDivider(accent: boolean = false): PDFContent {
  const config = accent ? components.dividerAccent : components.divider;
  
  return {
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 0,
      x2: page.width,
      y2: 0,
      lineWidth: config.width,
      lineColor: config.color,
    }],
    margin: config.margin,
  };
}

// ============================================
// SIGNATURE BLOCK BUILDER
// ============================================

export interface SignatureParty {
  labelAr: string;
  name: string;
  title?: string;
  signedAt?: string;
  signerIp?: string;
}

/**
 * Build signature block for contracts
 */
export function buildSignatureBlock(parties: SignatureParty[]): PDFContent {
  return {
    columns: parties.map(party => ({
      width: `${100 / parties.length}%`,
      table: {
        widths: ['*'],
        body: [[{
          stack: [
            {
              text: party.labelAr,
              font: typography.fontFamily,
              fontSize: typography.sizes.h4,
              bold: true,
              color: components.signatureBlock.labelColor,
              alignment: 'center',
              margin: [0, 0, 0, spacing.sm],
            },
            {
              text: party.name,
              font: typography.fontFamily,
              fontSize: typography.sizes.body,
              color: components.signatureBlock.nameColor,
              alignment: 'center',
              margin: [0, 0, 0, spacing.xs],
            },
            ...(party.title ? [{
              text: party.title,
              font: typography.fontFamily,
              fontSize: typography.sizes.small,
              color: colors.text.muted,
              alignment: 'center' as const,
              margin: [0, 0, 0, spacing.md] as [number, number, number, number],
            }] : []),
            {
              text: 'التوقيع: _______________',
              font: typography.fontFamily,
              fontSize: typography.sizes.body,
              alignment: 'center',
              margin: [0, spacing.lg, 0, spacing.sm],
            },
            {
              text: 'التاريخ: _______________',
              font: typography.fontFamily,
              fontSize: typography.sizes.body,
              alignment: 'center',
              margin: [0, 0, 0, spacing.sm],
            },
            // Seal placeholder
            {
              table: {
                widths: [80],
                heights: [60],
                body: [[{
                  text: 'الختم',
                  font: typography.fontFamily,
                  fontSize: typography.sizes.tiny,
                  color: colors.text.muted,
                  alignment: 'center',
                  margin: [0, 20, 0, 0],
                }]],
              },
              layout: {
                hLineColor: () => colors.border.medium,
                vLineColor: () => colors.border.medium,
                hLineWidth: () => 1,
                vLineWidth: () => 1,
                hLineStyle: () => ({ dash: { length: 3, space: 2 } }),
                vLineStyle: () => ({ dash: { length: 3, space: 2 } }),
              },
              alignment: 'center' as const,
              margin: [0, spacing.sm, 0, 0],
            },
          ],
          margin: [spacing.md, spacing.lg, spacing.md, spacing.lg],
        }]],
      },
      layout: {
        fillColor: () => components.signatureBlock.background,
        hLineColor: () => components.signatureBlock.border,
        vLineColor: () => components.signatureBlock.border,
        hLineWidth: () => components.signatureBlock.borderWidth,
        vLineWidth: () => components.signatureBlock.borderWidth,
      },
    })),
    columnGap: spacing.md,
    margin: [0, spacing.xl, 0, 0],
  };
}

// ============================================
// CLAUSE BUILDER (for contracts)
// ============================================

export interface ClauseContent {
  number: string; // Arabic numeral ١، ٢، ٣
  title: string;
  content: string;
  subClauses?: string[];
}

/**
 * Build formatted clause for contracts
 */
export function buildClause(clause: ClauseContent): PDFContent {
  const content: PDFContent[] = [
    // Clause header (number + title)
    {
      columns: [
        {
          text: clause.title,
          font: typography.fontFamily,
          fontSize: components.clause.titleSize,
          bold: true,
          color: components.clause.titleColor,
          alignment: 'right' as const,
          width: '*',
        },
        {
          text: `المادة ${clause.number}:`,
          font: typography.fontFamily,
          fontSize: components.clause.numberSize,
          bold: true,
          color: components.clause.numberColor,
          alignment: 'right' as const,
          width: 'auto',
        },
      ],
      margin: [0, 0, 0, spacing.sm],
    },
    // Clause body
    {
      text: clause.content,
      font: typography.fontFamily,
      fontSize: components.clause.contentSize,
      color: components.clause.contentColor,
      alignment: 'right',
      lineHeight: typography.lineHeight.relaxed,
      margin: [0, 0, 0, clause.subClauses?.length ? spacing.sm : 0],
    },
  ];
  
  // Sub-clauses
  if (clause.subClauses?.length) {
    clause.subClauses.forEach((subClause, index) => {
      content.push({
        columns: [
          {
            text: subClause,
            font: typography.fontFamily,
            fontSize: components.clause.contentSize,
            color: components.clause.subClauseColor,
            alignment: 'right' as const,
            width: '*',
            margin: [0, 2, 0, 2],
          },
          {
            text: '•',
            font: typography.fontFamily,
            fontSize: components.clause.contentSize,
            color: components.clause.bulletColor,
            alignment: 'right' as const,
            width: 15,
          },
        ],
        margin: [spacing.lg, 0, 0, 0],
      });
    });
  }
  
  return {
    stack: content,
    margin: [0, spacing.md, 0, spacing.md],
  };
}
