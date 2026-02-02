/**
 * Finance Contract HTML Template Renderer
 * مولد قالب HTML لعقد التمويل
 * شركة علي صالح الشهري القابضة
 */

import { FinanceContractData, ContractRenderOptions } from './types';
import {
  toArabicDigits,
  formatCurrencyArabic,
  formatPercentArabic,
  formatDateArabic,
  formatDateShortArabic,
  formatPageNumber,
  formatInstallmentNumber,
  numberToArabicWords,
} from './arabic-utils';
import { FINANCE_CONTRACT_ARTICLES, formatArticleNumber } from './legal-articles';

const DEFAULT_OPTIONS: ContractRenderOptions = {
  includeHeader: true,
  includeFooter: true,
  includeFullSchedule: true,
  includeSignatures: true,
  previewMode: false,
};

/**
 * Generate the complete HTML document for the contract
 */
export function renderContractHTML(
  data: FinanceContractData,
  options: Partial<ContractRenderOptions> = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عقد تمويل - ${data.contractNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
${getContractStyles()}
  </style>
</head>
<body>
  <div class="contract-document">
    ${opts.includeHeader ? renderHeader(data) : ''}
    
    ${renderCoverBlock(data)}
    
    ${renderPartiesSection(data)}
    
    ${renderFinancialsSection(data)}
    
    ${renderArticlesSection()}
    
    ${opts.includeFullSchedule ? renderPaymentSchedule(data) : ''}
    
    ${opts.includeSignatures ? renderSignaturesSection(data) : ''}
    
    ${opts.includeFooter ? renderFooter(data) : ''}
  </div>
</body>
</html>`;
}

function renderHeader(data: FinanceContractData): string {
  return `
    <div class="contract-header">
      <div class="company-info">
        <div class="company-name">شركة علي صالح الشهري القابضة</div>
        <div class="document-type">عقد تمويل داخلي</div>
      </div>
      <div class="contract-meta">
        <div class="contract-number">${data.contractNumber}</div>
        <div class="contract-date">${formatDateArabic(data.issueDate)}</div>
      </div>
    </div>
  `;
}

function renderCoverBlock(data: FinanceContractData): string {
  return `
    <div class="cover-block">
      <div class="cover-title">عقد تمويل داخلي</div>
      <div class="cover-subtitle">بين شركة علي صالح الشهري القابضة والمستفيد</div>
      <div class="cover-contract-number">${data.contractNumber}</div>
    </div>
  `;
}

function renderPartiesSection(data: FinanceContractData): string {
  const identityLabel = (type: string) => {
    switch (type) {
      case 'national_id': return 'رقم الهوية الوطنية';
      case 'commercial_registration': return 'رقم السجل التجاري';
      case 'iqama': return 'رقم الإقامة';
      default: return 'رقم الهوية';
    }
  };

  return `
    <div class="section keep-together">
      <div class="section-title keep-with-next">أطراف العقد</div>
      <table class="parties-table">
        <thead>
          <tr>
            <th colspan="2">الطرف الأول (الممول)</th>
            <th colspan="2">الطرف الثاني (المستفيد)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="label-cell">الاسم</td>
            <td class="value-cell no-overflow">${data.firstParty.name}</td>
            <td class="label-cell">الاسم</td>
            <td class="value-cell no-overflow">${data.secondParty.name}</td>
          </tr>
          <tr>
            <td class="label-cell">${identityLabel(data.firstParty.identityType)}</td>
            <td class="value-cell no-overflow">${data.firstParty.identityNumber}</td>
            <td class="label-cell">${identityLabel(data.secondParty.identityType)}</td>
            <td class="value-cell no-overflow">${data.secondParty.identityNumber}</td>
          </tr>
          <tr>
            <td class="label-cell">العنوان</td>
            <td class="value-cell no-overflow">${data.firstParty.address}</td>
            <td class="label-cell">العنوان</td>
            <td class="value-cell no-overflow">${data.secondParty.address}</td>
          </tr>
          <tr>
            <td class="label-cell">الهاتف</td>
            <td class="value-cell" dir="ltr" style="text-align: left;">${data.firstParty.phone}</td>
            <td class="label-cell">الهاتف</td>
            <td class="value-cell" dir="ltr" style="text-align: left;">${data.secondParty.phone}</td>
          </tr>
          <tr>
            <td class="label-cell">البريد الإلكتروني</td>
            <td class="value-cell no-overflow" dir="ltr" style="text-align: left; font-size: 10px;">${data.firstParty.email}</td>
            <td class="label-cell">البريد الإلكتروني</td>
            <td class="value-cell no-overflow" dir="ltr" style="text-align: left; font-size: 10px;">${data.secondParty.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderFinancialsSection(data: FinanceContractData): string {
  const f = data.financials;
  
  return `
    <div class="section keep-together">
      <div class="section-title keep-with-next">الملخص المالي</div>
      <div class="financials-box">
        <div class="financials-title">تفاصيل التمويل</div>
        <div class="financials-grid">
          <div class="financial-item">
            <span class="financial-label">مبلغ التمويل الأساسي</span>
            <span class="financial-value">${formatCurrencyArabic(f.principalAmount)}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">معدل الربح السنوي</span>
            <span class="financial-value">${formatPercentArabic(f.aprPercent)}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">إجمالي الرسوم</span>
            <span class="financial-value">${formatCurrencyArabic(f.totalFees)}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">مدة التمويل</span>
            <span class="financial-value">${toArabicDigits(f.tenorMonths)} شهر</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">القسط الشهري</span>
            <span class="financial-value">${formatCurrencyArabic(f.monthlyPayment)}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">الغرض من التمويل</span>
            <span class="financial-value" style="font-size: 11px; direction: rtl; text-align: right;">${data.fundingPurpose}</span>
          </div>
          <div class="financial-item financial-total">
            <span class="financial-label">إجمالي المبلغ المستحق</span>
            <span class="financial-value">${formatCurrencyArabic(f.totalPayable)}</span>
          </div>
        </div>
        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #374151;">
          فقط ${numberToArabicWords(f.totalPayable)}
        </div>
      </div>
    </div>
  `;
}

function renderArticlesSection(): string {
  let html = '<div class="section">';
  html += '<div class="section-title keep-with-next">الشروط والأحكام</div>';
  
  for (const article of FINANCE_CONTRACT_ARTICLES) {
    html += `
      <div class="article keep-together">
        <div class="article-title keep-with-next">
          <span class="article-number">${toArabicDigits(article.number)}</span>
          ${formatArticleNumber(article.number)}: ${article.title}
        </div>
        <div class="article-content">
          ${article.content.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  return html;
}

function renderPaymentSchedule(data: FinanceContractData): string {
  const schedule = data.paymentSchedule;
  const totalInstallments = schedule.length;
  
  const statusLabel = (status: string) => {
    switch (status) {
      case 'paid': return '<span class="status-paid">مسدد</span>';
      case 'pending': return '<span class="status-pending">قيد المعالجة</span>';
      case 'overdue': return '<span class="status-pending">متأخر</span>';
      default: return '<span class="status-scheduled">مجدول</span>';
    }
  };

  let html = `
    <div class="section page-break-before">
      <div class="section-title keep-with-next">جدول السداد</div>
      <table class="schedule-table">
        <thead>
          <tr>
            <th style="width: 15%;">رقم القسط</th>
            <th style="width: 25%;">تاريخ الاستحقاق</th>
            <th style="width: 30%;">مبلغ القسط</th>
            <th style="width: 30%;">الحالة</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  for (const inst of schedule) {
    html += `
      <tr>
        <td>${formatInstallmentNumber(inst.installmentNumber, totalInstallments)}</td>
        <td>${formatDateShortArabic(inst.dueDate)}</td>
        <td class="amount-cell">${formatCurrencyArabic(inst.amount)}</td>
        <td>${statusLabel(inst.status)}</td>
      </tr>
    `;
  }
  
  html += `
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 4px;">
        <strong>إجمالي المبلغ المستحق: ${formatCurrencyArabic(data.financials.totalPayable)}</strong>
      </div>
    </div>
  `;
  
  return html;
}

function renderSignaturesSection(data: FinanceContractData): string {
  const renderStamp = () => {
    if (!data.firstPartySignature.isSigned) return '';
    const stampId = `STM-${data.contractNumber.replace('FIN-', '')}`;
    return `
      <div class="digital-stamp">
        <div class="stamp-title">ختم الاعتماد الإلكتروني</div>
        <div class="stamp-company">شركة علي صالح الشهري القابضة</div>
        <div class="stamp-date">${data.firstPartySignature.signedAt ? formatDateArabic(data.firstPartySignature.signedAt) : ''}</div>
        <div class="stamp-id">${stampId}</div>
      </div>
    `;
  };

  const renderCustomerSignature = () => {
    if (!data.secondPartySignature.isSigned) {
      return '<div class="signature-placeholder">في انتظار التوقيع</div>';
    }
    if (data.secondPartySignature.signatureData) {
      return `<img src="${data.secondPartySignature.signatureData}" class="signature-image" alt="توقيع العميل" />`;
    }
    return '<div class="signature-placeholder">تم التوقيع إلكترونياً</div>';
  };

  return `
    <div class="signatures-section keep-together">
      <div class="section-title keep-with-next">التوقيعات</div>
      <p style="margin-bottom: 20px; font-size: 12px; color: #374151;">
        تم الاتفاق على جميع الشروط والأحكام الواردة في هذا العقد، ووقع عليه الطرفان بمحض إرادتهما دون إكراه أو ضغط.
      </p>
      <div class="signatures-grid">
        <div class="signature-box first-party">
          <div class="signature-title first-party">الطرف الأول (الممول)</div>
          <div class="signature-name">${data.firstPartySignature.signerName}</div>
          <div class="signature-area">
            ${renderStamp()}
          </div>
          <div class="signature-date">
            ${data.firstPartySignature.signedAt ? 'تاريخ الاعتماد: ' + formatDateArabic(data.firstPartySignature.signedAt) : ''}
          </div>
        </div>
        <div class="signature-box second-party">
          <div class="signature-title second-party">الطرف الثاني (المستفيد)</div>
          <div class="signature-name">${data.secondPartySignature.signerName}</div>
          <div class="signature-area">
            ${renderCustomerSignature()}
          </div>
          <div class="signature-date">
            ${data.secondPartySignature.signedAt ? 'تاريخ التوقيع: ' + formatDateArabic(data.secondPartySignature.signedAt) : 'في انتظار التوقيع'}
            ${data.secondPartySignature.ipAddress ? '<br/>IP: ' + data.secondPartySignature.ipAddress : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFooter(data: FinanceContractData): string {
  return `
    <div class="contract-footer">
      <div class="footer-disclaimer">
        هذا العقد سند تنفيذي ملزم للطرفين - شركة علي صالح الشهري القابضة © ${new Date().getFullYear()}
      </div>
      <div class="page-number">
        Contract Template v3.0 - 2026
      </div>
    </div>
  `;
}

function getContractStyles(): string {
  return `
/* ========================================
   PAGE SETUP - A4
   ======================================== */
@page {
  size: A4;
  margin: 24mm 18mm 20mm 18mm;
}

@page :first {
  margin-top: 20mm;
}

/* ========================================
   ROOT & TYPOGRAPHY
   ======================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 13px;
  line-height: 1.8;
}

body {
  font-family: 'Cairo', 'Noto Kufi Arabic', 'Tajawal', 'Arial', sans-serif;
  direction: rtl;
  text-align: right;
  color: #1a1a2e;
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ========================================
   CONTRACT CONTAINER
   ======================================== */
.contract-document {
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  padding: 0;
  background: #ffffff;
  direction: rtl;
  unicode-bidi: plaintext;
}

/* ========================================
   HEADER
   ======================================== */
.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 2px solid #1a1a2e;
}

.company-info {
  text-align: right;
}

.company-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.document-type {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.contract-meta {
  text-align: left;
  direction: ltr;
}

.contract-number {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.contract-date {
  font-size: 11px;
  color: #6b7280;
}

/* ========================================
   FOOTER
   ======================================== */
.contract-footer {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 10px;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-disclaimer {
  max-width: 70%;
  text-align: right;
}

.page-number {
  text-align: left;
  direction: ltr;
}

/* ========================================
   SECTION TITLES
   ======================================== */
.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  page-break-after: avoid;
  break-after: avoid;
}

.section-title::before {
  content: '■';
  margin-left: 8px;
  color: #059669;
}

/* ========================================
   COVER BLOCK
   ======================================== */
.cover-block {
  text-align: center;
  padding: 32px 0;
  margin-bottom: 24px;
  border: 2px solid #1a1a2e;
  border-radius: 4px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.cover-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.cover-subtitle {
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
}

.cover-contract-number {
  font-size: 16px;
  font-weight: 600;
  color: #059669;
  font-family: 'SF Mono', 'Monaco', monospace;
  direction: ltr;
  display: inline-block;
}

/* ========================================
   PARTIES TABLE
   ======================================== */
.parties-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  table-layout: fixed;
}

.parties-table th,
.parties-table td {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  text-align: right;
  vertical-align: top;
}

.parties-table th {
  background: #1a1a2e;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
}

.parties-table td {
  font-size: 12px;
}

.parties-table .label-cell {
  background: #f3f4f6;
  font-weight: 500;
  width: 25%;
  color: #374151;
}

.parties-table .value-cell {
  background: #ffffff;
  width: 25%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* ========================================
   FINANCIALS BOX
   ======================================== */
.financials-box {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #059669;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.financials-title {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 16px;
  text-align: center;
}

.financials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.financial-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #d1fae5;
}

.financial-label {
  font-size: 12px;
  color: #374151;
}

.financial-value {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  direction: ltr;
  text-align: left;
}

.financial-total {
  grid-column: span 2;
  background: #059669;
  border-color: #059669;
}

.financial-total .financial-label,
.financial-total .financial-value {
  color: #ffffff;
}

/* ========================================
   ARTICLES
   ======================================== */
.article {
  margin: 16px 0;
  page-break-inside: avoid;
  break-inside: avoid;
}

.article-title {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
  page-break-after: avoid;
  break-after: avoid;
}

.article-title .article-number {
  display: inline-block;
  background: #1a1a2e;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  font-size: 11px;
}

.article-content {
  font-size: 12.5px;
  line-height: 1.9;
  text-align: justify;
  text-justify: inter-word;
  color: #374151;
  padding-right: 16px;
}

.article-content p {
  margin-bottom: 8px;
  page-break-inside: avoid;
  break-inside: avoid;
  orphans: 3;
  widows: 3;
}

/* ========================================
   PAYMENT SCHEDULE
   ======================================== */
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  table-layout: fixed;
  font-size: 11px;
}

.schedule-table thead {
  display: table-header-group;
}

.schedule-table th {
  background: #1a1a2e;
  color: #ffffff;
  padding: 10px 8px;
  text-align: center;
  font-weight: 600;
  border: 1px solid #0f172a;
}

.schedule-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #d1d5db;
  page-break-inside: avoid;
  break-inside: avoid;
}

.schedule-table tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

.schedule-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.schedule-table tbody tr:nth-child(odd) {
  background: #ffffff;
}

.schedule-table .amount-cell {
  font-weight: 600;
  color: #059669;
  direction: ltr;
}

.status-paid { color: #059669; }
.status-pending { color: #f59e0b; }
.status-scheduled { color: #6b7280; }

/* ========================================
   SIGNATURES
   ======================================== */
.signatures-section {
  margin-top: 40px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signatures-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.signature-box {
  border: 2px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
  min-height: 180px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signature-box.first-party { border-color: #059669; }
.signature-box.second-party { border-color: #1a1a2e; }

.signature-title {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.signature-title.first-party { color: #059669; }
.signature-title.second-party { color: #1a1a2e; }

.signature-name {
  font-size: 12px;
  text-align: center;
  margin-bottom: 16px;
  color: #374151;
}

.signature-area {
  height: 80px;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  margin-bottom: 12px;
}

.signature-placeholder {
  color: #9ca3af;
  font-size: 11px;
}

.signature-image {
  max-height: 70px;
  max-width: 100%;
}

.signature-date {
  font-size: 10px;
  text-align: center;
  color: #6b7280;
}

/* ========================================
   DIGITAL STAMP
   ======================================== */
.digital-stamp {
  display: inline-block;
  padding: 12px 20px;
  border: 3px solid #059669;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  text-align: center;
  transform: rotate(-3deg);
}

.stamp-title {
  font-size: 9px;
  color: #059669;
  font-weight: 600;
  margin-bottom: 2px;
}

.stamp-company {
  font-size: 10px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 2px;
}

.stamp-date {
  font-size: 8px;
  color: #059669;
}

.stamp-id {
  font-size: 7px;
  color: #059669;
  font-family: 'SF Mono', 'Monaco', monospace;
  direction: ltr;
}

/* ========================================
   UTILITIES
   ======================================== */
.keep-together {
  page-break-inside: avoid;
  break-inside: avoid;
}

.keep-with-next {
  page-break-after: avoid;
  break-after: avoid;
}

.page-break-before {
  page-break-before: always;
  break-before: page;
}

.page-break-after {
  page-break-after: always;
  break-after: page;
}

.no-overflow {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* ========================================
   PRINT SPECIFIC
   ======================================== */
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  
  .contract-document {
    width: 100%;
    max-width: none;
  }
  
  .no-print {
    display: none !important;
  }
  
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* ========================================
   SCREEN PREVIEW
   ======================================== */
@media screen {
  body {
    background: #e5e7eb;
    padding: 20px;
  }
  
  .contract-document {
    padding: 20mm;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin: 20px auto;
    background: #ffffff;
  }
}
  `;
}
