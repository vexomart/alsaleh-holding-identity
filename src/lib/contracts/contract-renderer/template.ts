/**
 * Finance Contract HTML Template Renderer - Enhanced
 * مولد قالب HTML لعقد التمويل الداخلي
 * شركة علي صالح الشهري القابضة
 */

import { FinanceContractData, ContractRenderOptions } from './types';
import {
  toArabicDigits,
  formatCurrencyArabic,
  formatPercentArabic,
  formatDateArabic,
  formatDateShortArabic,
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
  <title>عقد تمويل داخلي - ${data.contractNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
${getContractStyles()}
  </style>
</head>
<body>
  <div class="contract-document">
    ${opts.includeHeader ? renderHeader(data) : ''}
    
    ${renderCoverBlock(data)}
    
    ${renderInternalFinanceNotice()}
    
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
    <div class="contract-header animate-fade-in">
      <div class="company-info">
        <div class="company-logo">🏛️</div>
        <div>
          <div class="company-name">شركة علي صالح الشهري القابضة</div>
          <div class="company-subtitle">Ali Saleh Al-Shahri Holding Co.</div>
        </div>
      </div>
      <div class="contract-meta">
        <div class="contract-badge">عقد تمويل داخلي</div>
        <div class="contract-number">${data.contractNumber}</div>
        <div class="contract-date">${formatDateArabic(data.issueDate)}</div>
      </div>
    </div>
  `;
}

function renderCoverBlock(data: FinanceContractData): string {
  return `
    <div class="cover-block animate-scale-in">
      <div class="cover-icon">📄</div>
      <div class="cover-title">عقد تمويل داخلي</div>
      <div class="cover-subtitle">Internal Financing Agreement</div>
      <div class="cover-divider"></div>
      <div class="cover-parties">
        <span>بين</span>
        <strong>شركة علي صالح الشهري القابضة</strong>
        <span>والمستفيد</span>
        <strong>${data.secondParty.name}</strong>
      </div>
      <div class="cover-contract-number">${data.contractNumber}</div>
    </div>
  `;
}

function renderInternalFinanceNotice(): string {
  return `
    <div class="internal-notice animate-fade-in">
      <div class="notice-icon">⚠️</div>
      <div class="notice-content">
        <div class="notice-title">تنويه هام - Important Notice</div>
        <div class="notice-text">
          هذا العقد هو <strong>عقد تمويل داخلي</strong> وليس قرضاً مالياً أو تمويلاً بنكياً.
          يُستخدم هذا التمويل <strong>حصرياً لشراء الخدمات</strong> داخل منصة الشركة، 
          ولا يجوز تحويله إلى نقد أو سحبه أو تسييله بأي شكل من الأشكال.
        </div>
        <div class="notice-features">
          <div class="feature-item">
            <span class="feature-icon">🔒</span>
            <span>غير قابل للتسييل</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏪</span>
            <span>للخدمات فقط</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <span>تسهيل ائتماني</span>
          </div>
        </div>
      </div>
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
    <div class="section keep-together animate-fade-in">
      <div class="section-title keep-with-next">
        <span class="section-icon">👥</span>
        أطراف العقد
      </div>
      <div class="parties-grid">
        <div class="party-card first-party">
          <div class="party-header">
            <span class="party-icon">🏢</span>
            <span class="party-label">الطرف الأول (الممول)</span>
          </div>
          <div class="party-details">
            <div class="detail-row">
              <span class="detail-label">الاسم</span>
              <span class="detail-value">${data.firstParty.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${identityLabel(data.firstParty.identityType)}</span>
              <span class="detail-value ltr">${data.firstParty.identityNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">العنوان</span>
              <span class="detail-value">${data.firstParty.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">الهاتف</span>
              <span class="detail-value ltr">${data.firstParty.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">البريد</span>
              <span class="detail-value ltr email">${data.firstParty.email}</span>
            </div>
          </div>
        </div>
        
        <div class="party-card second-party">
          <div class="party-header">
            <span class="party-icon">👤</span>
            <span class="party-label">الطرف الثاني (المستفيد)</span>
          </div>
          <div class="party-details">
            <div class="detail-row">
              <span class="detail-label">الاسم</span>
              <span class="detail-value">${data.secondParty.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${identityLabel(data.secondParty.identityType)}</span>
              <span class="detail-value ltr">${data.secondParty.identityNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">العنوان</span>
              <span class="detail-value">${data.secondParty.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">الهاتف</span>
              <span class="detail-value ltr">${data.secondParty.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">البريد</span>
              <span class="detail-value ltr email">${data.secondParty.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFinancialsSection(data: FinanceContractData): string {
  const f = data.financials;
  
  return `
    <div class="section keep-together animate-fade-in">
      <div class="section-title keep-with-next">
        <span class="section-icon">💰</span>
        الملخص المالي للتمويل الداخلي
      </div>
      <div class="financials-box">
        <div class="financials-header">
          <span class="fin-icon">📊</span>
          <span>تفاصيل التمويل الداخلي</span>
        </div>
        <div class="financials-grid">
          <div class="financial-item">
            <div class="fin-item-icon">💵</div>
            <div class="fin-item-content">
              <span class="financial-label">مبلغ التمويل الأساسي</span>
              <span class="financial-value">${formatCurrencyArabic(f.principalAmount)}</span>
            </div>
          </div>
          <div class="financial-item">
            <div class="fin-item-icon">📈</div>
            <div class="fin-item-content">
              <span class="financial-label">معدل الربح السنوي</span>
              <span class="financial-value">${formatPercentArabic(f.aprPercent)}</span>
            </div>
          </div>
          <div class="financial-item">
            <div class="fin-item-icon">📝</div>
            <div class="fin-item-content">
              <span class="financial-label">رسوم الإدارة</span>
              <span class="financial-value">${formatCurrencyArabic(f.totalFees)}</span>
            </div>
          </div>
          <div class="financial-item">
            <div class="fin-item-icon">📅</div>
            <div class="fin-item-content">
              <span class="financial-label">مدة التمويل</span>
              <span class="financial-value">${toArabicDigits(f.tenorMonths)} شهر</span>
            </div>
          </div>
          <div class="financial-item">
            <div class="fin-item-icon">🔄</div>
            <div class="fin-item-content">
              <span class="financial-label">القسط الشهري</span>
              <span class="financial-value">${formatCurrencyArabic(f.monthlyPayment)}</span>
            </div>
          </div>
          <div class="financial-item">
            <div class="fin-item-icon">🎯</div>
            <div class="fin-item-content">
              <span class="financial-label">الغرض من التمويل</span>
              <span class="financial-value purpose">${data.fundingPurpose}</span>
            </div>
          </div>
        </div>
        <div class="financial-total">
          <div class="total-icon">💎</div>
          <div class="total-content">
            <span class="total-label">إجمالي المبلغ المستحق</span>
            <span class="total-value">${formatCurrencyArabic(f.totalPayable)}</span>
          </div>
        </div>
        <div class="amount-words">
          فقط ${numberToArabicWords(f.totalPayable)}
        </div>
      </div>
    </div>
  `;
}

function renderArticlesSection(): string {
  let html = '<div class="section">';
  html += `
    <div class="section-title keep-with-next">
      <span class="section-icon">📜</span>
      الشروط والأحكام القانونية
    </div>
  `;
  
  for (const article of FINANCE_CONTRACT_ARTICLES) {
    html += `
      <div class="article keep-together animate-fade-in">
        <div class="article-header keep-with-next">
          <span class="article-icon">${article.icon}</span>
          <span class="article-number">${toArabicDigits(article.number)}</span>
          <span class="article-title-text">${formatArticleNumber(article.number)}: ${article.title}</span>
        </div>
        <div class="article-content">
          ${article.content.map(p => {
            if (p.startsWith('⚠️')) {
              return `<p class="warning-text">${p}</p>`;
            } else if (p.startsWith('•')) {
              return `<p class="bullet-point">${p}</p>`;
            }
            return `<p>${p}</p>`;
          }).join('')}
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
      case 'paid': return '<span class="status-badge status-paid">✅ مسدد</span>';
      case 'pending': return '<span class="status-badge status-pending">⏳ قيد المعالجة</span>';
      case 'overdue': return '<span class="status-badge status-overdue">⚠️ متأخر</span>';
      default: return '<span class="status-badge status-scheduled">📅 مجدول</span>';
    }
  };

  let html = `
    <div class="section page-break-before animate-fade-in">
      <div class="section-title keep-with-next">
        <span class="section-icon">📅</span>
        جدول السداد
      </div>
      <table class="schedule-table">
        <thead>
          <tr>
            <th style="width: 12%;">
              <span class="th-icon">#️⃣</span>
              رقم القسط
            </th>
            <th style="width: 25%;">
              <span class="th-icon">📆</span>
              تاريخ الاستحقاق
            </th>
            <th style="width: 30%;">
              <span class="th-icon">💰</span>
              مبلغ القسط
            </th>
            <th style="width: 33%;">
              <span class="th-icon">📋</span>
              الحالة
            </th>
          </tr>
        </thead>
        <tbody>
  `;
  
  for (const inst of schedule) {
    html += `
      <tr>
        <td class="installment-num">${formatInstallmentNumber(inst.installmentNumber, totalInstallments)}</td>
        <td>${formatDateShortArabic(inst.dueDate)}</td>
        <td class="amount-cell">${formatCurrencyArabic(inst.amount)}</td>
        <td>${statusLabel(inst.status)}</td>
      </tr>
    `;
  }
  
  html += `
        </tbody>
      </table>
      <div class="schedule-total">
        <span class="schedule-total-icon">💎</span>
        <span class="schedule-total-label">إجمالي المبلغ المستحق:</span>
        <span class="schedule-total-value">${formatCurrencyArabic(data.financials.totalPayable)}</span>
      </div>
    </div>
  `;
  
  return html;
}

function renderSignaturesSection(data: FinanceContractData): string {
  const renderStamp = () => {
    if (!data.firstPartySignature.isSigned) return '<div class="signature-placeholder">في انتظار الاعتماد</div>';
    const stampId = `STM-${data.contractNumber.replace('FIN-', '')}`;
    return `
      <div class="digital-stamp animate-scale-in">
        <div class="stamp-border">
          <div class="stamp-icon">🏛️</div>
          <div class="stamp-title">ختم الاعتماد الإلكتروني</div>
          <div class="stamp-company">شركة علي صالح الشهري القابضة</div>
          <div class="stamp-divider"></div>
          <div class="stamp-date">${data.firstPartySignature.signedAt ? formatDateArabic(data.firstPartySignature.signedAt) : ''}</div>
          <div class="stamp-id">${stampId}</div>
        </div>
      </div>
    `;
  };

  const renderCustomerSignature = () => {
    if (!data.secondPartySignature.isSigned) {
      return '<div class="signature-placeholder">✍️ في انتظار التوقيع</div>';
    }
    if (data.secondPartySignature.signatureData) {
      return `<img src="${data.secondPartySignature.signatureData}" class="signature-image" alt="توقيع العميل" />`;
    }
    return `
      <div class="electronic-signature">
        <div class="sig-icon">✅</div>
        <div class="sig-text">تم التوقيع إلكترونياً</div>
      </div>
    `;
  };

  return `
    <div class="signatures-section keep-together animate-fade-in">
      <div class="section-title keep-with-next">
        <span class="section-icon">✍️</span>
        التوقيعات والإقرار
      </div>
      <div class="signatures-intro">
        <p>
          تم الاتفاق على جميع الشروط والأحكام الواردة في هذا العقد، ووقع عليه الطرفان بمحض إرادتهما 
          دون إكراه أو ضغط، ويُقر الطرف الثاني بفهمه الكامل لطبيعة التمويل الداخلي وشروطه.
        </p>
      </div>
      <div class="signatures-grid">
        <div class="signature-box first-party">
          <div class="signature-title">
            <span class="sig-title-icon">🏢</span>
            الطرف الأول (الممول)
          </div>
          <div class="signature-name">${data.firstPartySignature.signerName}</div>
          <div class="signature-area">
            ${renderStamp()}
          </div>
          <div class="signature-meta">
            ${data.firstPartySignature.signedAt ? '📅 تاريخ الاعتماد: ' + formatDateArabic(data.firstPartySignature.signedAt) : ''}
          </div>
        </div>
        <div class="signature-box second-party">
          <div class="signature-title">
            <span class="sig-title-icon">👤</span>
            الطرف الثاني (المستفيد)
          </div>
          <div class="signature-name">${data.secondPartySignature.signerName}</div>
          <div class="signature-area">
            ${renderCustomerSignature()}
          </div>
          <div class="signature-meta">
            ${data.secondPartySignature.signedAt ? '📅 تاريخ التوقيع: ' + formatDateArabic(data.secondPartySignature.signedAt) : '⏳ في انتظار التوقيع'}
            ${data.secondPartySignature.ipAddress ? '<br/>🌐 IP: ' + data.secondPartySignature.ipAddress : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFooter(data: FinanceContractData): string {
  return `
    <div class="contract-footer">
      <div class="footer-content">
        <div class="footer-disclaimer">
          <span class="footer-icon">⚖️</span>
          هذا العقد سند تنفيذي ملزم للطرفين - شركة علي صالح الشهري القابضة © ${new Date().getFullYear()}
        </div>
        <div class="footer-meta">
          <span class="version-stamp">Contract Template v3.1 - 2026</span>
        </div>
      </div>
    </div>
  `;
}

function getContractStyles(): string {
  return `
/* ========================================
   FONTS & BASE
   ======================================== */
@page {
  size: A4;
  margin: 22mm 16mm 18mm 16mm;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 12px;
  line-height: 1.85;
}

body {
  font-family: 'Noto Kufi Arabic', 'IBM Plex Sans Arabic', 'Tajawal', sans-serif;
  direction: rtl;
  text-align: right;
  color: #1e293b;
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  font-weight: 400;
}

/* ========================================
   ANIMATIONS
   ======================================== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out forwards;
}

@media print {
  .animate-fade-in, .animate-scale-in {
    animation: none;
  }
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
  padding: 16px 0;
  margin-bottom: 20px;
  border-bottom: 3px solid #0f172a;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo {
  font-size: 32px;
}

.company-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.company-subtitle {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 1px;
}

.contract-meta {
  text-align: left;
  direction: ltr;
}

.contract-badge {
  display: inline-block;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 4px;
}

.contract-number {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  font-family: 'SF Mono', 'Monaco', monospace;
}

.contract-date {
  font-size: 10px;
  color: #6b7280;
}

/* ========================================
   COVER BLOCK
   ======================================== */
.cover-block {
  text-align: center;
  padding: 28px 20px;
  margin-bottom: 20px;
  border: 2px solid #0f172a;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.cover-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.cover-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.cover-subtitle {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.cover-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #059669, #10b981);
  margin: 12px auto;
  border-radius: 2px;
}

.cover-parties {
  font-size: 12px;
  color: #475569;
  margin-bottom: 12px;
}

.cover-parties strong {
  color: #0f172a;
  display: block;
  margin: 4px 0;
}

.cover-contract-number {
  font-size: 14px;
  font-weight: 700;
  color: #059669;
  font-family: 'SF Mono', 'Monaco', monospace;
  direction: ltr;
  display: inline-block;
  background: #ecfdf5;
  padding: 4px 16px;
  border-radius: 4px;
}

/* ========================================
   INTERNAL NOTICE
   ======================================== */
.internal-notice {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 8px;
}

.notice-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
}

.notice-text {
  font-size: 11px;
  color: #78350f;
  line-height: 1.7;
}

.notice-features {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #92400e;
  background: rgba(255,255,255,0.6);
  padding: 4px 10px;
  border-radius: 4px;
}

.feature-icon {
  font-size: 12px;
}

/* ========================================
   SECTION TITLES
   ======================================== */
.section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 20px 0 12px 0;
  padding: 8px 12px;
  background: linear-gradient(90deg, #f1f5f9 0%, transparent 100%);
  border-right: 4px solid #059669;
  border-radius: 0 4px 4px 0;
  page-break-after: avoid;
  break-after: avoid;
}

.section-icon {
  font-size: 16px;
}

/* ========================================
   PARTIES GRID
   ======================================== */
.parties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.party-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.party-card.first-party {
  border-color: #059669;
}

.party-card.second-party {
  border-color: #0f172a;
}

.party-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 12px;
}

.first-party .party-header {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #047857;
}

.second-party .party-header {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #0f172a;
}

.party-icon {
  font-size: 18px;
}

.party-details {
  padding: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 10px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
  max-width: 60%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.detail-value.ltr {
  direction: ltr;
  text-align: left;
}

.detail-value.email {
  font-size: 9px;
}

/* ========================================
   FINANCIALS BOX
   ======================================== */
.financials-box {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 2px solid #059669;
  border-radius: 10px;
  padding: 16px;
}

.financials-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #047857;
  margin-bottom: 14px;
}

.fin-icon {
  font-size: 18px;
}

.financials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.financial-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #d1fae5;
}

.fin-item-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecfdf5;
  border-radius: 6px;
}

.fin-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.financial-label {
  font-size: 10px;
  color: #64748b;
}

.financial-value {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.financial-value.purpose {
  font-size: 10px;
  font-weight: 500;
}

.financial-total {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 14px;
  padding: 14px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border-radius: 8px;
}

.total-icon {
  font-size: 24px;
}

.total-content {
  text-align: center;
}

.total-label {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.9);
}

.total-value {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
}

.amount-words {
  text-align: center;
  margin-top: 10px;
  font-size: 10px;
  color: #047857;
  font-weight: 500;
}

/* ========================================
   ARTICLES
   ======================================== */
.article {
  margin: 14px 0;
  page-break-inside: avoid;
  break-inside: avoid;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  page-break-after: avoid;
  break-after: avoid;
}

.article-icon {
  font-size: 16px;
}

.article-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #0f172a;
  color: #ffffff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
}

.article-title-text {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.article-content {
  font-size: 11px;
  line-height: 1.9;
  color: #475569;
  padding-right: 30px;
}

.article-content p {
  margin-bottom: 6px;
  page-break-inside: avoid;
  break-inside: avoid;
  orphans: 3;
  widows: 3;
}

.article-content .warning-text {
  background: #fef3c7;
  padding: 8px 12px;
  border-radius: 4px;
  border-right: 3px solid #f59e0b;
  font-weight: 600;
  color: #92400e;
}

.article-content .bullet-point {
  padding-right: 8px;
}

/* ========================================
   PAYMENT SCHEDULE
   ======================================== */
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  table-layout: fixed;
  font-size: 10px;
}

.schedule-table thead {
  display: table-header-group;
}

.schedule-table th {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 10px 8px;
  text-align: center;
  font-weight: 600;
  border: 1px solid #0f172a;
}

.th-icon {
  display: inline-block;
  margin-left: 4px;
}

.schedule-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #e2e8f0;
  page-break-inside: avoid;
  break-inside: avoid;
}

.schedule-table tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

.schedule-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.installment-num {
  font-weight: 700;
  color: #0f172a;
}

.amount-cell {
  font-weight: 700;
  color: #059669;
  direction: ltr;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 9px;
  font-weight: 600;
}

.status-paid { background: #dcfce7; color: #166534; }
.status-pending { background: #fef3c7; color: #92400e; }
.status-overdue { background: #fee2e2; color: #991b1b; }
.status-scheduled { background: #f1f5f9; color: #475569; }

.schedule-total {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 6px;
}

.schedule-total-icon {
  font-size: 18px;
}

.schedule-total-label {
  font-size: 11px;
  color: #475569;
}

.schedule-total-value {
  font-size: 14px;
  font-weight: 800;
  color: #059669;
}

/* ========================================
   SIGNATURES
   ======================================== */
.signatures-section {
  margin-top: 30px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signatures-intro {
  font-size: 11px;
  color: #475569;
  margin-bottom: 16px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.signatures-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.signature-box {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  min-height: 200px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.signature-box.first-party { border-color: #059669; }
.signature-box.second-party { border-color: #0f172a; }

.signature-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.first-party .signature-title { color: #047857; }
.second-party .signature-title { color: #0f172a; }

.sig-title-icon {
  font-size: 16px;
}

.signature-name {
  font-size: 11px;
  text-align: center;
  margin-bottom: 14px;
  color: #475569;
}

.signature-area {
  min-height: 100px;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  margin-bottom: 10px;
}

.signature-placeholder {
  color: #94a3b8;
  font-size: 11px;
}

.signature-image {
  max-height: 80px;
  max-width: 100%;
}

.signature-meta {
  font-size: 9px;
  text-align: center;
  color: #64748b;
}

/* ========================================
   DIGITAL STAMP
   ======================================== */
.digital-stamp {
  padding: 8px;
}

.stamp-border {
  border: 3px solid #059669;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  text-align: center;
  transform: rotate(-2deg);
}

.stamp-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.stamp-title {
  font-size: 8px;
  color: #047857;
  font-weight: 600;
}

.stamp-company {
  font-size: 10px;
  font-weight: 800;
  color: #047857;
}

.stamp-divider {
  width: 40px;
  height: 2px;
  background: #059669;
  margin: 6px auto;
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

.electronic-signature {
  text-align: center;
  padding: 12px;
}

.sig-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.sig-text {
  font-size: 10px;
  color: #059669;
  font-weight: 600;
}

/* ========================================
   FOOTER
   ======================================== */
.contract-footer {
  margin-top: 30px;
  padding-top: 14px;
  border-top: 2px solid #e2e8f0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-disclaimer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  color: #64748b;
}

.footer-icon {
  font-size: 12px;
}

.footer-meta {
  text-align: left;
  direction: ltr;
}

.version-stamp {
  font-size: 8px;
  color: #94a3b8;
  font-family: 'SF Mono', 'Monaco', monospace;
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

.no-overflow {
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* ========================================
   PRINT
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
    background: #94a3b8;
    padding: 20px;
  }
  
  .contract-document {
    padding: 18mm;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    margin: 20px auto;
    background: #ffffff;
    border-radius: 4px;
  }
}
  `;
}
