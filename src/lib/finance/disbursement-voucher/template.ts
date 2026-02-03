/**
 * Disbursement Voucher HTML Template
 * قالب سند الصرف
 */

import { DisbursementVoucherData, VoucherRenderOptions } from './types';
import { formatCurrencyArabic, formatDateArabic, formatDateShort, numberToArabicWords, toArabicDigits } from './arabic-utils';

export function renderVoucherHTML(
  data: DisbursementVoucherData,
  options: VoucherRenderOptions = {}
): string {
  const { showAnimations = true, printMode = false } = options;
  
  const amountInWords = data.financials.amountInWords || numberToArabicWords(data.financials.amount);
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>سند صرف - ${data.voucherNumber}</title>
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
    
    .voucher-container {
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
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes stampBounce {
      0% { transform: scale(0) rotate(-15deg); }
      50% { transform: scale(1.1) rotate(-12deg); }
      100% { transform: scale(1) rotate(-10deg); }
    }
    ` : ''}
    
    /* Header */
    .voucher-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, var(--navy) 100%);
      padding: 30px 40px;
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
      ${showAnimations ? 'animation: pulse 3s ease-in-out infinite;' : ''}
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
    
    .voucher-badge {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--navy-dark);
      padding: 12px 28px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      ${showAnimations ? 'animation: scaleIn 0.5s ease-out 0.3s backwards;' : ''}
    }
    
    .voucher-badge-icon {
      margin-left: 8px;
    }
    
    /* Voucher Info Bar */
    .voucher-info-bar {
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
      align-items: center;
      gap: 8px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.5s backwards;' : ''}
    }
    
    .info-label {
      opacity: 0.7;
    }
    
    .info-value {
      font-weight: 600;
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    /* Main Content */
    .voucher-body {
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
    
    .amount-words {
      font-size: 15px;
      color: var(--navy);
      font-weight: 500;
      position: relative;
      z-index: 1;
    }
    
    .amount-currency {
      font-size: 20px;
      margin-right: 8px;
      opacity: 0.8;
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
    
    .party-header.payer {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: white;
    }
    
    .party-header.payee {
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
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
    }
    
    /* Finance Details */
    .finance-section {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.7s backwards;' : ''}
    }
    
    .finance-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .finance-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .finance-item {
      background: white;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    
    .finance-item-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
    }
    
    .finance-item-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--navy-dark);
    }
    
    /* Purpose Section */
    .purpose-section {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 2px solid var(--gold);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 30px;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.8s backwards;' : ''}
    }
    
    .purpose-label {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .purpose-text {
      font-size: 15px;
      color: var(--navy-dark);
      font-weight: 500;
    }
    
    /* Signature Section */
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px dashed #e2e8f0;
      ${showAnimations ? 'animation: fadeIn 0.6s ease-out 0.9s backwards;' : ''}
    }
    
    .signature-box {
      text-align: center;
      position: relative;
    }
    
    .signature-title {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 16px;
    }
    
    .signature-line {
      border-bottom: 2px solid var(--navy);
      width: 80%;
      margin: 0 auto 12px;
      height: 60px;
      position: relative;
    }
    
    .signature-name {
      font-size: 13px;
      color: var(--navy-dark);
      font-weight: 500;
    }
    
    /* Digital Stamp */
    .digital-stamp {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%) rotate(-10deg);
      width: 140px;
      height: 140px;
      border: 4px double var(--success);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(16, 185, 129, 0.08);
      ${showAnimations ? 'animation: stampBounce 0.6s ease-out 1.2s backwards;' : ''}
    }
    
    .stamp-icon {
      font-size: 28px;
      margin-bottom: 4px;
    }
    
    .stamp-text {
      font-size: 11px;
      font-weight: 700;
      color: var(--success);
      text-align: center;
    }
    
    .stamp-date {
      font-size: 9px;
      color: #059669;
      margin-top: 2px;
    }
    
    .stamp-id {
      font-size: 8px;
      color: #059669;
      font-family: monospace;
      margin-top: 2px;
    }
    
    /* Footer */
    .voucher-footer {
      background: var(--navy-dark);
      padding: 20px 40px;
      color: white;
      text-align: center;
      font-size: 12px;
    }
    
    .footer-text {
      opacity: 0.7;
      margin-bottom: 8px;
    }
    
    .footer-ref {
      font-family: monospace;
      font-size: 11px;
      opacity: 0.5;
    }
    
    /* Print Styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .voucher-container {
        box-shadow: none;
        border-radius: 0;
      }
      
      .party-card:hover {
        transform: none;
        box-shadow: none;
      }
      
      * {
        animation: none !important;
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
        padding: 20px 24px;
      }
      
      .header-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
        align-items: center;
      }
      
      .company-name {
        font-size: 18px;
      }
      
      .voucher-badge {
        font-size: 16px;
        padding: 10px 22px;
      }
      
      .voucher-info-bar {
        flex-wrap: wrap;
        padding: 12px 24px;
        gap: 12px;
      }
      
      .info-item {
        flex: 1 1 30%;
        justify-content: center;
      }
      
      .voucher-body {
        padding: 24px;
      }
      
      .amount-section {
        padding: 24px;
      }
      
      .amount-value {
        font-size: 32px;
      }
      
      .parties-grid {
        grid-template-columns: 1fr;
      }
      
      .finance-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .signature-section {
        grid-template-columns: 1fr;
        gap: 24px;
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
        padding: 16px 20px;
      }
      
      .company-name {
        font-size: 14px;
      }
      
      .company-subtitle {
        font-size: 10px;
      }
      
      .voucher-badge {
        font-size: 14px;
        padding: 8px 18px;
      }
      
      .voucher-info-bar {
        flex-direction: column;
        padding: 10px 16px;
        font-size: 12px;
      }
      
      .info-item {
        flex: 1 1 100%;
        justify-content: space-between;
      }
      
      .voucher-body {
        padding: 16px;
      }
      
      .amount-section {
        padding: 18px;
        border-radius: 14px;
        border-width: 2px;
      }
      
      .amount-label {
        font-size: 13px;
      }
      
      .amount-value {
        font-size: 24px;
      }
      
      .amount-words {
        font-size: 12px;
      }
      
      .party-card {
        border-radius: 12px;
      }
      
      .party-header {
        padding: 10px 14px;
        font-size: 12px;
      }
      
      .party-body {
        padding: 14px;
      }
      
      .party-name {
        font-size: 14px;
        margin-bottom: 10px;
      }
      
      .party-detail {
        flex-direction: column;
        gap: 2px;
        font-size: 11px;
        padding: 6px 0;
      }
      
      .finance-section {
        padding: 16px;
        border-radius: 12px;
      }
      
      .finance-title {
        font-size: 13px;
      }
      
      .finance-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .finance-item {
        padding: 12px;
        border-radius: 10px;
      }
      
      .finance-item-label {
        font-size: 10px;
      }
      
      .finance-item-value {
        font-size: 13px;
      }
      
      .purpose-section {
        padding: 14px 16px;
        border-radius: 12px;
      }
      
      .purpose-label {
        font-size: 12px;
      }
      
      .purpose-text {
        font-size: 13px;
      }
      
      .signature-box {
        padding: 16px;
      }
      
      .signature-title {
        font-size: 12px;
      }
      
      .signature-line {
        height: 50px;
        width: 90%;
      }
      
      .signature-name {
        font-size: 11px;
      }
      
      .digital-stamp {
        width: 110px;
        height: 110px;
      }
      
      .stamp-icon {
        font-size: 22px;
      }
      
      .stamp-text {
        font-size: 9px;
      }
      
      .stamp-date {
        font-size: 8px;
      }
      
      .voucher-footer {
        padding: 14px 16px;
      }
      
      .footer-text {
        font-size: 10px;
      }
      
      .footer-ref {
        font-size: 9px;
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
          <div class="company-name">🏛️ شركة علي صالح الشهري القابضة</div>
          <div class="company-subtitle">Ali Saleh Al-Shahri Holding Co.</div>
        </div>
        <div class="voucher-badge">
          <span class="voucher-badge-icon">📄</span>
          سند صرف
        </div>
      </div>
    </div>
    
    <!-- Info Bar -->
    <div class="voucher-info-bar">
      <div class="info-item">
        <span class="info-label">رقم السند:</span>
        <span class="info-value">${data.voucherNumber}</span>
      </div>
      <div class="info-item">
        <span class="info-label">التاريخ:</span>
        <span class="info-value">${formatDateShort(data.issueDate)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">رقم العقد:</span>
        <span class="info-value">${data.financials.contractNumber}</span>
      </div>
    </div>
    
    <!-- Body -->
    <div class="voucher-body">
      <!-- Amount Section -->
      <div class="amount-section">
        <div class="amount-label">💰 المبلغ المصروف</div>
        <div class="amount-value">
          <span class="amount-currency">ر.س</span>
          ${new Intl.NumberFormat('ar-SA').format(data.financials.amount)}
        </div>
        <div class="amount-words">فقط ${amountInWords} لا غير</div>
      </div>
      
      <!-- Parties -->
      <div class="parties-grid">
        <!-- Payer (Company) -->
        <div class="party-card">
          <div class="party-header payer">
            <span>🏢</span>
            الطرف الدافع (الممول)
          </div>
          <div class="party-body">
            <div class="party-name">${data.payer.name}</div>
            <div class="party-detail">
              <span class="detail-label">السجل التجاري:</span>
              <span class="detail-value">${data.payer.identityNumber}</span>
            </div>
            ${data.payer.address ? `
            <div class="party-detail">
              <span class="detail-label">العنوان:</span>
              <span class="detail-value">${data.payer.address}</span>
            </div>
            ` : ''}
            ${data.payer.phone ? `
            <div class="party-detail">
              <span class="detail-label">الهاتف:</span>
              <span class="detail-value" dir="ltr">${data.payer.phone}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Payee (Customer) -->
        <div class="party-card">
          <div class="party-header payee">
            <span>👤</span>
            المستفيد (العميل)
          </div>
          <div class="party-body">
            <div class="party-name">${data.payee.name}</div>
            <div class="party-detail">
              <span class="detail-label">${data.payee.identityType === 'national_id' ? 'رقم الهوية:' : 'السجل التجاري:'}</span>
              <span class="detail-value">${data.payee.identityNumber}</span>
            </div>
            ${data.payee.phone ? `
            <div class="party-detail">
              <span class="detail-label">الجوال:</span>
              <span class="detail-value" dir="ltr">${data.payee.phone}</span>
            </div>
            ` : ''}
            ${data.payee.email ? `
            <div class="party-detail">
              <span class="detail-label">البريد:</span>
              <span class="detail-value" dir="ltr">${data.payee.email}</span>
            </div>
            ` : ''}
            ${data.walletNumber ? `
            <div class="party-detail">
              <span class="detail-label">رقم المحفظة:</span>
              <span class="detail-value" dir="ltr">${data.walletNumber}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Finance Details -->
      <div class="finance-section">
        <div class="finance-title">
          <span>📊</span>
          تفاصيل التمويل
        </div>
        <div class="finance-grid">
          <div class="finance-item">
            <div class="finance-item-label">رقم طلب التمويل</div>
            <div class="finance-item-value">${data.financials.applicationNumber}</div>
          </div>
          <div class="finance-item">
            <div class="finance-item-label">رقم العقد</div>
            <div class="finance-item-value">${data.financials.contractNumber}</div>
          </div>
          <div class="finance-item">
            <div class="finance-item-label">العملة</div>
            <div class="finance-item-value">ريال سعودي (SAR)</div>
          </div>
        </div>
      </div>
      
      <!-- Purpose -->
      <div class="purpose-section">
        <div class="purpose-label">
          <span>📌</span>
          الغرض من الصرف
        </div>
        <div class="purpose-text">${data.financials.purpose}</div>
      </div>
      
      <!-- Notes -->
      ${data.notes ? `
      <div class="purpose-section" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-color: #0ea5e9;">
        <div class="purpose-label" style="color: #0369a1;">
          <span>📝</span>
          ملاحظات
        </div>
        <div class="purpose-text">${data.notes}</div>
      </div>
      ` : ''}
      
      <!-- Signatures -->
      <div class="signature-section">
        <!-- Payer Signature -->
        <div class="signature-box">
          <div class="signature-title">توقيع الطرف الدافع</div>
          <div class="signature-line">
            ${data.payerSignature.isSigned ? `
            <div class="digital-stamp">
              <div class="stamp-icon">✅</div>
              <div class="stamp-text">تم الاعتماد</div>
              <div class="stamp-date">${data.payerSignature.signedAt ? formatDateShort(data.payerSignature.signedAt) : ''}</div>
              ${data.payerSignature.stampId ? `<div class="stamp-id">${data.payerSignature.stampId}</div>` : ''}
            </div>
            ` : ''}
          </div>
          <div class="signature-name">${data.payerSignature.signerName}</div>
        </div>
        
        <!-- Payee Signature -->
        <div class="signature-box">
          <div class="signature-title">توقيع المستفيد</div>
          <div class="signature-line">
            ${data.payeeSignature?.isSigned ? `
            <div class="digital-stamp" style="border-color: var(--primary);">
              <div class="stamp-icon">✅</div>
              <div class="stamp-text" style="color: var(--primary);">استلمت</div>
              <div class="stamp-date" style="color: var(--primary-dark);">${data.payeeSignature.signedAt ? formatDateShort(data.payeeSignature.signedAt) : ''}</div>
            </div>
            ` : ''}
          </div>
          <div class="signature-name">${data.payee.name}</div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="voucher-footer">
      <div class="footer-text">
        هذا السند دليل على صرف المبلغ المذكور أعلاه إلى المستفيد المحدد
      </div>
      ${data.transactionReference ? `
      <div class="footer-ref">
        مرجع العملية: ${data.transactionReference}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}
