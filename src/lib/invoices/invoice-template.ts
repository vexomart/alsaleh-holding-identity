/**
 * Invoice HTML Template - Voucher Design
 * قالب الفاتورة بتصميم سند الصرف
 */

import { InvoiceDataNew } from './types';
import { SELLER_INFO } from './constants';
import { calculateInvoiceTotals, formatShortDate, calculateLineTotal } from './invoice-utils';

// Arabic number converter
function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
}

function formatCurrencyArabic(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ر.س`;
}

function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const o = n % 10;
      const t = Math.floor(n / 10);
      if (o === 0) return tens[t];
      return ones[o] + ' و' + tens[t];
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      if (r === 0) return hundreds[h];
      return hundreds[h] + ' و' + convert(r);
    }
    if (n < 1000000) {
      const t = Math.floor(n / 1000);
      const r = n % 1000;
      let tw = '';
      if (t === 1) tw = 'ألف';
      else if (t === 2) tw = 'ألفان';
      else if (t <= 10) tw = convert(t) + ' آلاف';
      else tw = convert(t) + ' ألف';
      if (r === 0) return tw;
      return tw + ' و' + convert(r);
    }
    return n.toString();
  }

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  
  let result = convert(intPart) || 'صفر';
  result += ' ريال سعودي';
  
  if (decPart > 0) {
    result += ' و' + convert(decPart) + ' هللة';
  }
  
  return result;
}

export interface InvoiceRenderOptions {
  showAnimations?: boolean;
  printMode?: boolean;
}

export function renderInvoiceHTML(
  data: InvoiceDataNew,
  options: InvoiceRenderOptions = {}
): string {
  const { showAnimations = true, printMode = false } = options;
  
  const vatRate = data.vat_rate ?? 0.15;
  const currency = data.currency ?? 'SAR';
  const totals = calculateInvoiceTotals(data.items, vatRate);
  const amountInWords = numberToArabicWords(totals.total);
  
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const itemsRows = data.items.map((item, index) => {
    const lineTotal = calculateLineTotal(item);
    const lineVat = lineTotal * vatRate;
    const lineTotalWithVat = lineTotal + lineVat;
    const isAlt = index % 2 === 1;
    
    return `
      <tr class="table-row ${isAlt ? 'alt' : ''}">
        <td class="cell cell-num">${toArabicDigits(index + 1)}</td>
        <td class="cell cell-desc">${item.description_ar || item.description}</td>
        <td class="cell cell-center">${toArabicDigits(item.qty)}</td>
        <td class="cell cell-center">${formatAmount(item.unit_price)}</td>
        <td class="cell cell-center">${formatAmount(lineVat)}</td>
        <td class="cell cell-total">${formatAmount(lineTotalWithVat)}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة ضريبية - ${data.invoice_number}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: #0f766e;
      --primary-light: #14b8a6;
      --primary-dark: #0d9488;
      --gold: #f59e0b;
      --gold-light: #fbbf24;
      --navy: #1e293b;
      --navy-dark: #0f172a;
      --success: #10b981;
      --bg-gradient: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%);
    }
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    body {
      font-family: 'Noto Kufi Arabic', 'IBM Plex Sans Arabic', sans-serif;
      background: var(--bg-gradient);
      min-height: 100vh;
      padding: 20px;
      color: var(--navy-dark);
      line-height: 1.8;
    }
    
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(15, 118, 110, 0.1);
      overflow: hidden;
      ${showAnimations ? 'animation: slideUp 0.6s ease-out;' : ''}
    }
    
    ${showAnimations ? `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    ` : ''}
    
    /* Header */
    .invoice-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, var(--navy) 100%);
      padding: 30px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .invoice-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .company-info {
      color: white;
    }
    
    .company-name {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      ${showAnimations ? 'animation: fadeIn 0.8s ease-out 0.2s backwards;' : ''}
    }
    
    .company-subtitle {
      font-size: 13px;
      opacity: 0.85;
      ${showAnimations ? 'animation: fadeIn 0.8s ease-out 0.4s backwards;' : ''}
    }
    
    .invoice-badge {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--navy-dark);
      padding: 14px 32px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 20px;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      ${showAnimations ? 'animation: scaleIn 0.5s ease-out 0.3s backwards;' : ''}
    }
    
    /* Info Bar */
    .invoice-info-bar {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-size: 14px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.5s backwards;' : ''}
    }
    
    .info-label {
      opacity: 0.7;
      font-size: 11px;
    }
    
    .info-value {
      font-weight: 600;
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Main Content */
    .invoice-body {
      padding: 40px;
    }
    
    /* Amount Section */
    .amount-section {
      background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
      border: 3px solid var(--primary);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      ${showAnimations ? 'animation: scaleIn 0.6s ease-out 0.4s backwards;' : ''}
    }
    
    .amount-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
      background-size: 200% 100%;
      ${showAnimations ? 'animation: shimmer 2s ease-in-out infinite;' : ''}
    }
    
    .amount-label {
      font-size: 16px;
      color: var(--primary-dark);
      margin-bottom: 10px;
      font-weight: 600;
      position: relative;
      z-index: 1;
    }
    
    .amount-value {
      font-size: 42px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      position: relative;
      z-index: 1;
    }
    
    .amount-currency {
      font-size: 18px;
      color: var(--primary);
      opacity: 0.8;
      position: relative;
      z-index: 1;
    }
    
    .amount-words {
      font-size: 15px;
      color: var(--navy);
      font-weight: 500;
      position: relative;
      z-index: 1;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--primary);
    }
    
    /* Parties Grid */
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 30px;
    }
    
    .party-card {
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.6s backwards;' : ''}
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .party-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .party-header {
      padding: 14px 20px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .party-header.seller {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: white;
    }
    
    .party-header.buyer {
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
    }
    
    .party-icon {
      width: 28px;
      height: 28px;
      background: var(--gold);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--navy-dark);
    }
    
    .party-body {
      padding: 20px;
      background: #fafafa;
    }
    
    .party-name {
      font-size: 17px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 12px;
    }
    
    .party-detail {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 13px;
    }
    
    .party-detail:last-child {
      border-bottom: none;
    }
    
    .detail-label {
      color: #64748b;
    }
    
    .detail-value {
      font-weight: 600;
      color: var(--navy);
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Items Table */
    .items-section {
      margin-bottom: 30px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.7s backwards;' : ''}
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 3px solid var(--gold);
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    
    .items-table thead {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: white;
    }
    
    .items-table th {
      padding: 14px 16px;
      font-weight: 600;
      font-size: 13px;
      text-align: center;
    }
    
    .items-table th:first-child {
      text-align: center;
      width: 50px;
    }
    
    .items-table th:nth-child(2) {
      text-align: right;
    }
    
    .items-table th:last-child {
      text-align: left;
    }
    
    .table-row {
      border-bottom: 1px solid #e2e8f0;
    }
    
    .table-row.alt {
      background: #f8fafc;
    }
    
    .table-row:last-child {
      border-bottom: none;
    }
    
    .cell {
      padding: 14px 16px;
      font-size: 13px;
    }
    
    .cell-num {
      text-align: center;
      color: #64748b;
    }
    
    .cell-desc {
      text-align: right;
      font-weight: 600;
      color: var(--navy-dark);
    }
    
    .cell-center {
      text-align: center;
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    .cell-total {
      text-align: left;
      font-weight: 700;
      color: var(--primary);
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Totals Section */
    .totals-section {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 30px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.8s backwards;' : ''}
    }
    
    .totals-card {
      width: 350px;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    
    .totals-row:nth-child(2) {
      background: #f8fafc;
    }
    
    .totals-label {
      color: #64748b;
    }
    
    .totals-value {
      font-weight: 600;
      color: var(--navy-dark);
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    .totals-final {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
    }
    
    .totals-final-label {
      font-weight: 700;
      font-size: 14px;
    }
    
    .totals-final-value {
      font-weight: 800;
      font-size: 22px;
      color: var(--gold);
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Notes Section */
    .notes-section {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 2px solid var(--gold);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 30px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.9s backwards;' : ''}
    }
    
    .notes-label {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .notes-text {
      font-size: 14px;
      color: var(--navy-dark);
    }
    
    /* Footer */
    .invoice-footer {
      background: var(--navy-dark);
      padding: 24px 40px;
      color: white;
      text-align: center;
    }
    
    .footer-company {
      font-size: 16px;
      font-weight: 700;
      color: var(--gold);
      margin-bottom: 8px;
    }
    
    .footer-thanks {
      font-size: 13px;
      opacity: 0.8;
      margin-bottom: 12px;
    }
    
    .footer-contact {
      font-size: 12px;
      opacity: 0.6;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    .footer-version {
      font-size: 10px;
      opacity: 0.4;
      margin-top: 12px;
      font-family: monospace;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="invoice-header">
      <div class="header-content">
        <div class="company-info">
          <div class="company-name">${SELLER_INFO.name_ar}</div>
          <div class="company-subtitle">${SELLER_INFO.name_en}</div>
        </div>
        <div class="invoice-badge">
          📄 فاتورة ضريبية
        </div>
      </div>
    </div>
    
    <!-- Info Bar -->
    <div class="invoice-info-bar">
      <div class="info-item">
        <span class="info-label">رقم الفاتورة</span>
        <span class="info-value">${data.invoice_number}</span>
      </div>
      <div class="info-item">
        <span class="info-label">تاريخ الإصدار</span>
        <span class="info-value">${formatDate(data.issued_at)}</span>
      </div>
      ${data.due_date ? `
      <div class="info-item">
        <span class="info-label">تاريخ الاستحقاق</span>
        <span class="info-value">${formatDate(data.due_date)}</span>
      </div>
      ` : ''}
      <div class="info-item">
        <span class="info-label">الرقم الضريبي</span>
        <span class="info-value">${SELLER_INFO.vat}</span>
      </div>
    </div>
    
    <!-- Body -->
    <div class="invoice-body">
      <!-- Amount Section -->
      <div class="amount-section">
        <div class="amount-label">💰 إجمالي المبلغ المستحق</div>
        <div class="amount-value">${formatAmount(totals.total)}</div>
        <div class="amount-currency">ريال سعودي</div>
        <div class="amount-words">${amountInWords}</div>
      </div>
      
      <!-- Parties Grid -->
      <div class="parties-grid">
        <!-- Seller -->
        <div class="party-card">
          <div class="party-header seller">
            <div class="party-icon">ب</div>
            <span>البائع</span>
          </div>
          <div class="party-body">
            <div class="party-name">${data.seller?.name_ar || SELLER_INFO.name_ar}</div>
            <div class="party-detail">
              <span class="detail-label">الرقم الضريبي</span>
              <span class="detail-value">${data.seller?.vat || SELLER_INFO.vat}</span>
            </div>
            <div class="party-detail">
              <span class="detail-label">العنوان</span>
              <span class="detail-value">${data.seller?.address_ar || SELLER_INFO.address_ar}</span>
            </div>
            <div class="party-detail">
              <span class="detail-label">البريد</span>
              <span class="detail-value">${data.seller?.email || SELLER_INFO.email}</span>
            </div>
          </div>
        </div>
        
        <!-- Buyer -->
        <div class="party-card">
          <div class="party-header buyer">
            <div class="party-icon">م</div>
            <span>المشتري</span>
          </div>
          <div class="party-body">
            <div class="party-name">${data.buyer?.name_ar || data.buyer?.name || 'عميل'}</div>
            ${data.buyer?.vat ? `
            <div class="party-detail">
              <span class="detail-label">الرقم الضريبي</span>
              <span class="detail-value">${data.buyer.vat}</span>
            </div>
            ` : ''}
            ${data.buyer?.address_ar ? `
            <div class="party-detail">
              <span class="detail-label">العنوان</span>
              <span class="detail-value">${data.buyer.address_ar}</span>
            </div>
            ` : ''}
            ${data.buyer?.email ? `
            <div class="party-detail">
              <span class="detail-label">البريد</span>
              <span class="detail-value">${data.buyer.email}</span>
            </div>
            ` : ''}
            ${data.buyer?.phone ? `
            <div class="party-detail">
              <span class="detail-label">الهاتف</span>
              <span class="detail-value">${data.buyer.phone}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Items Table -->
      <div class="items-section">
        <div class="section-title">
          📋 تفاصيل الفاتورة
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الوصف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الضريبة</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>
      
      <!-- Totals -->
      <div class="totals-section">
        <div class="totals-card">
          <div class="totals-row">
            <span class="totals-label">المجموع الفرعي (قبل الضريبة)</span>
            <span class="totals-value">${formatAmount(totals.subtotal)} ${currency}</span>
          </div>
          <div class="totals-row">
            <span class="totals-label">ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)</span>
            <span class="totals-value">${formatAmount(totals.vat_amount)} ${currency}</span>
          </div>
          <div class="totals-final">
            <span class="totals-final-label">الإجمالي شامل الضريبة</span>
            <span class="totals-final-value">${formatAmount(totals.total)} ${currency}</span>
          </div>
        </div>
      </div>
      
      ${(data.notes_ar || data.notes) ? `
      <!-- Notes -->
      <div class="notes-section">
        <div class="notes-label">📝 ملاحظات</div>
        <div class="notes-text">${data.notes_ar || data.notes}</div>
      </div>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="invoice-footer">
      <div class="footer-company">${SELLER_INFO.name_ar}</div>
      <div class="footer-thanks">شكراً لتعاملكم معنا</div>
      <div class="footer-contact">
        <span>${SELLER_INFO.phone}</span>
        <span>${SELLER_INFO.email}</span>
        <span>${SELLER_INFO.website}</span>
      </div>
      <div class="footer-version">Invoice Template v3.0 - Voucher Design 2026</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Preview invoice in new window
 */
export function previewInvoice(data: InvoiceDataNew): Window | null {
  const html = renderInvoiceHTML(data, { showAnimations: true });
  
  const previewWindow = window.open('', '_blank', 'width=900,height=800');
  if (!previewWindow) {
    console.error('[Invoice] Could not open preview window');
    return null;
  }
  
  previewWindow.document.write(html);
  previewWindow.document.close();
  
  return previewWindow;
}

/**
 * Download invoice as HTML file
 */
export function downloadInvoiceAsHtml(data: InvoiceDataNew): void {
  const html = renderInvoiceHTML(data, { showAnimations: false, printMode: true });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `فاتورة-${data.invoice_number}.html`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Print invoice
 */
export function printInvoice(data: InvoiceDataNew): void {
  const html = renderInvoiceHTML(data, { showAnimations: false, printMode: true });
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}
