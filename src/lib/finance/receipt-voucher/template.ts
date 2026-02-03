/**
 * Receipt Voucher HTML Template
 * قالب سند القبض
 */

import { ReceiptVoucherData, ReceiptRenderOptions } from './types';
import { formatCurrencyArabic, formatDateArabic, formatDateShort, numberToArabicWords, toArabicDigits, getPaymentMethodArabic } from './arabic-utils';

export function renderReceiptHTML(
  data: ReceiptVoucherData,
  options: ReceiptRenderOptions = {}
): string {
  const { showAnimations = true, printMode = false } = options;
  
  const amountInWords = data.financials.amountInWords || numberToArabicWords(data.financials.amount);
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>سند قبض - ${data.voucherNumber}</title>
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
      --primary: #1e40af;
      --primary-light: #3b82f6;
      --primary-dark: #1e3a8a;
      --gold: #f59e0b;
      --gold-light: #fbbf24;
      --navy: #1e293b;
      --navy-dark: #0f172a;
      --success: #10b981;
      --bg-gradient: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0f9ff 100%);
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
    
    .voucher-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(30, 64, 175, 0.1);
      overflow: hidden;
      ${showAnimations ? 'animation: slideUp 0.6s ease-out;' : ''}
    }
    
    ${showAnimations ? `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    
    @keyframes stampBounce {
      0% { transform: scale(0) rotate(-20deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    ` : ''}
    
    /* Header */
    .voucher-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 30px;
      position: relative;
      overflow: hidden;
    }
    
    .voucher-header::before {
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
      align-items: center;
    }
    
    .company-info {
      color: white;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 4px;
      ${showAnimations ? 'animation: fadeIn 0.8s ease-out 0.2s backwards;' : ''}
    }
    
    .company-subtitle {
      font-size: 13px;
      opacity: 0.85;
      ${showAnimations ? 'animation: fadeIn 0.8s ease-out 0.4s backwards;' : ''}
    }
    
    .voucher-badge {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--navy-dark);
      padding: 16px 36px;
      border-radius: 50px;
      font-weight: 800;
      font-size: 22px;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      ${showAnimations ? 'animation: scaleIn 0.5s ease-out 0.3s backwards;' : ''}
    }
    
    /* Info Bar */
    .info-bar {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      padding: 16px 30px;
      display: flex;
      justify-content: space-around;
      color: white;
      font-size: 14px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    
    .info-label {
      opacity: 0.7;
      font-size: 11px;
    }
    
    .info-value {
      font-weight: 700;
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Content */
    .voucher-content {
      padding: 30px;
    }
    
    /* Amount Section */
    .amount-section {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid var(--primary-light);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
      ${showAnimations ? 'animation: scaleIn 0.5s ease-out 0.5s backwards;' : ''}
    }
    
    .amount-label {
      font-size: 14px;
      color: var(--primary);
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .amount-value {
      font-size: 42px;
      font-weight: 800;
      color: var(--primary-dark);
      font-family: 'IBM Plex Sans Arabic', monospace;
      ${showAnimations ? `
        background: linear-gradient(90deg, var(--primary-dark), var(--primary-light), var(--primary-dark));
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      ` : ''}
    }
    
    .amount-words {
      font-size: 16px;
      color: var(--navy);
      margin-top: 8px;
      font-weight: 600;
    }
    
    /* Parties Grid */
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .party-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .party-header {
      background: var(--primary);
      color: white;
      padding: 12px 16px;
      font-weight: 700;
      font-size: 14px;
    }
    
    .party-header.payer {
      background: var(--gold);
      color: var(--navy-dark);
    }
    
    .party-body {
      padding: 16px;
    }
    
    .party-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 8px;
    }
    
    .party-detail {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    /* Details Section */
    .details-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .details-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-light);
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--navy-dark);
    }
    
    /* Signature Section */
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px dashed #e2e8f0;
    }
    
    .signature-box {
      text-align: center;
      width: 200px;
    }
    
    .signature-title {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .signature-line {
      border-bottom: 2px solid var(--navy);
      height: 50px;
      margin-bottom: 8px;
    }
    
    .signature-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--navy-dark);
    }
    
    /* Stamp */
    .approval-stamp {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 120px;
      border: 4px solid var(--primary);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(30, 64, 175, 0.05);
      ${showAnimations ? 'animation: stampBounce 0.6s ease-out 1s backwards;' : ''}
    }
    
    .stamp-text {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      text-align: center;
    }
    
    .stamp-date {
      font-size: 10px;
      color: var(--primary-light);
      margin-top: 4px;
    }
    
    .stamp-check {
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 4px;
    }
    
    /* Footer */
    .voucher-footer {
      background: #f8fafc;
      padding: 16px 30px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .voucher-container {
        box-shadow: none;
        border-radius: 0;
      }
    }
    
    /* ========================================
       MOBILE RESPONSIVE - TABLET
       ======================================== */
    @media screen and (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .voucher-container {
        border-radius: 16px;
      }
      
      .voucher-header {
        padding: 20px;
      }
      
      .header-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
      
      .company-name {
        font-size: 20px;
      }
      
      .voucher-badge {
        padding: 12px 24px;
        font-size: 18px;
      }
      
      .info-bar {
        flex-wrap: wrap;
        padding: 12px 20px;
        gap: 12px;
      }
      
      .info-item {
        flex: 1 1 45%;
        text-align: center;
      }
      
      .voucher-content {
        padding: 20px;
      }
      
      .amount-section {
        padding: 20px;
      }
      
      .amount-value {
        font-size: 32px;
      }
      
      .parties-grid {
        grid-template-columns: 1fr;
      }
      
      .details-grid {
        grid-template-columns: 1fr;
      }
      
      .signature-section {
        flex-direction: column;
        gap: 20px;
      }
      
      .signature-box {
        width: 100%;
      }
      
      .approval-stamp {
        position: relative;
        bottom: auto;
        left: auto;
        transform: none;
        margin: 20px auto;
      }
    }
    
    /* ========================================
       MOBILE RESPONSIVE - PHONE
       ======================================== */
    @media screen and (max-width: 480px) {
      body {
        padding: 5px;
      }
      
      .voucher-container {
        border-radius: 12px;
      }
      
      .voucher-header {
        padding: 16px;
      }
      
      .company-name {
        font-size: 16px;
      }
      
      .company-subtitle {
        font-size: 11px;
      }
      
      .voucher-badge {
        padding: 10px 20px;
        font-size: 16px;
      }
      
      .info-bar {
        padding: 10px 16px;
        font-size: 12px;
      }
      
      .info-item {
        flex: 1 1 100%;
      }
      
      .voucher-content {
        padding: 16px;
      }
      
      .amount-section {
        padding: 16px;
        border-radius: 12px;
      }
      
      .amount-label {
        font-size: 12px;
      }
      
      .amount-value {
        font-size: 26px;
      }
      
      .amount-words {
        font-size: 13px;
      }
      
      .party-card {
        border-radius: 10px;
      }
      
      .party-header {
        padding: 10px 14px;
        font-size: 12px;
      }
      
      .party-body {
        padding: 12px;
      }
      
      .party-name {
        font-size: 14px;
      }
      
      .party-detail {
        font-size: 11px;
        flex-direction: column;
        gap: 2px;
      }
      
      .details-section {
        padding: 16px;
        border-radius: 10px;
      }
      
      .details-title {
        font-size: 12px;
      }
      
      .detail-label {
        font-size: 11px;
      }
      
      .detail-value {
        font-size: 12px;
      }
      
      .signature-title {
        font-size: 11px;
      }
      
      .signature-line {
        height: 40px;
      }
      
      .signature-name {
        font-size: 12px;
      }
      
      .approval-stamp {
        width: 100px;
        height: 100px;
        border-width: 3px;
      }
      
      .stamp-text {
        font-size: 10px;
      }
      
      .stamp-check {
        font-size: 22px;
      }
      
      .voucher-footer {
        padding: 12px 16px;
        font-size: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="voucher-container">
    <!-- Header -->
    <div class="voucher-header">
      <div class="header-content">
        <div class="company-info">
          <div class="company-name">شركة علي صالح الشهري القابضة</div>
          <div class="company-subtitle">Ali Saleh Al-Shahri Holding Co.</div>
        </div>
        <div class="voucher-badge">سند قبض</div>
      </div>
    </div>
    
    <!-- Info Bar -->
    <div class="info-bar">
      <div class="info-item">
        <span class="info-label">رقم السند</span>
        <span class="info-value">${data.voucherNumber}</span>
      </div>
      <div class="info-item">
        <span class="info-label">التاريخ</span>
        <span class="info-value">${formatDateShort(data.issueDate)}</span>
      </div>
      ${data.financials.contractNumber ? `
      <div class="info-item">
        <span class="info-label">رقم العقد</span>
        <span class="info-value">${data.financials.contractNumber}</span>
      </div>
      ` : ''}
      ${data.financials.installmentNumber ? `
      <div class="info-item">
        <span class="info-label">رقم القسط</span>
        <span class="info-value">القسط ${toArabicDigits(data.financials.installmentNumber)}</span>
      </div>
      ` : ''}
    </div>
    
    <!-- Content -->
    <div class="voucher-content">
      <!-- Amount -->
      <div class="amount-section">
        <div class="amount-label">المبلغ المستلم</div>
        <div class="amount-value">${formatCurrencyArabic(data.financials.amount)}</div>
        <div class="amount-words">( ${amountInWords} فقط لا غير )</div>
      </div>
      
      <!-- Parties -->
      <div class="parties-grid">
        <div class="party-card">
          <div class="party-header">المستلم (الطرف الأول)</div>
          <div class="party-body">
            <div class="party-name">${data.receiver.name}</div>
            ${data.receiver.identityNumber ? `
            <div class="party-detail">
              <span>السجل التجاري</span>
              <span>${data.receiver.identityNumber}</span>
            </div>
            ` : ''}
            ${data.receiver.phone ? `
            <div class="party-detail">
              <span>الهاتف</span>
              <span>${data.receiver.phone}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="party-card">
          <div class="party-header payer">الدافع (الطرف الثاني)</div>
          <div class="party-body">
            <div class="party-name">${data.payer.name}</div>
            ${data.payer.identityNumber ? `
            <div class="party-detail">
              <span>رقم الهوية</span>
              <span>${data.payer.identityNumber}</span>
            </div>
            ` : ''}
            ${data.payer.phone ? `
            <div class="party-detail">
              <span>الهاتف</span>
              <span>${data.payer.phone}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Details -->
      <div class="details-section">
        <div class="details-title">📋 تفاصيل السند</div>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">الغرض من الدفع</span>
            <span class="detail-value">${data.financials.purpose}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">طريقة الدفع</span>
            <span class="detail-value">${getPaymentMethodArabic(data.paymentMethod)}</span>
          </div>
          ${data.transactionReference ? `
          <div class="detail-item">
            <span class="detail-label">رقم المرجع</span>
            <span class="detail-value">${data.transactionReference}</span>
          </div>
          ` : ''}
          ${data.notes ? `
          <div class="detail-item">
            <span class="detail-label">ملاحظات</span>
            <span class="detail-value">${data.notes}</span>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Signature -->
      <div class="signature-section" style="position: relative;">
        <div class="signature-box">
          <div class="signature-title">توقيع المستلم</div>
          <div class="signature-line"></div>
          <div class="signature-name">${data.receiverSignature.signerName}</div>
        </div>
        
        ${data.receiverSignature.isSigned ? `
        <div class="approval-stamp">
          <span class="stamp-check">✓</span>
          <span class="stamp-text">تم الاستلام</span>
          <span class="stamp-date">${formatDateShort(data.receiverSignature.signedAt || data.issueDate)}</span>
        </div>
        ` : ''}
        
        <div class="signature-box">
          <div class="signature-title">توقيع الدافع</div>
          <div class="signature-line"></div>
          <div class="signature-name">${data.payer.name}</div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="voucher-footer">
      شركة علي صالح الشهري القابضة • الرياض، المملكة العربية السعودية • 0555812567 • info@ash-holding.sa
    </div>
  </div>
</body>
</html>`;
}
