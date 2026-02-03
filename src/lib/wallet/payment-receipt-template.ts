/**
 * Payment Receipt Template - Professional Design
 * إيصال دفع المحفظة - تصميم احترافي
 */

import { SELLER_INFO } from "@/lib/invoices/constants";

interface PaymentReceiptData {
  receiptNumber: string;
  issueDate: string;
  transactionType: 'topup' | 'invoice_payment' | 'withdrawal' | 'refund' | 'transfer' | 'adjustment';
  amount: number;
  currency: string;
  walletNumber: string;
  previousBalance: number;
  newBalance: number;
  customerName: string;
  customerUid: string;
  description?: string;
  referenceNumber?: string;
  paymentMethod?: string;
}

// Arabic number to words converter
function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const thousands = ['', 'ألف', 'ألفان', 'ثلاثة آلاف', 'أربعة آلاف', 'خمسة آلاف', 'ستة آلاف', 'سبعة آلاف', 'ثمانية آلاف', 'تسعة آلاف'];

  if (num === 0) return 'صفر';
  if (num >= 1000000) return `${Math.floor(num / 1000000)} مليون و${numberToArabicWords(num % 1000000)}`;
  if (num >= 1000) {
    const th = Math.floor(num / 1000);
    const rest = num % 1000;
    if (th <= 10) return `${thousands[th]}${rest > 0 ? ' و' + numberToArabicWords(rest) : ''}`;
    return `${numberToArabicWords(th)} ألف${rest > 0 ? ' و' + numberToArabicWords(rest) : ''}`;
  }
  if (num >= 100) {
    const h = Math.floor(num / 100);
    const rest = num % 100;
    return `${hundreds[h]}${rest > 0 ? ' و' + numberToArabicWords(rest) : ''}`;
  }
  if (num >= 20) {
    const t = Math.floor(num / 10);
    const o = num % 10;
    return `${o > 0 ? ones[o] + ' و' : ''}${tens[t]}`;
  }
  if (num >= 11 && num <= 19) {
    return `${ones[num - 10]} عشر`;
  }
  if (num === 10) return 'عشرة';
  return ones[num];
}

function formatAmountInWords(amount: number): string {
  const whole = Math.floor(amount);
  const halalas = Math.round((amount - whole) * 100);
  
  let result = `${numberToArabicWords(whole)} ريال سعودي`;
  if (halalas > 0) {
    result += ` و${numberToArabicWords(halalas)} هللة`;
  }
  result += ' فقط لا غير';
  return result;
}

const transactionTypeLabels: Record<string, { ar: string; en: string; color: string }> = {
  topup: { ar: 'شحن رصيد', en: 'Top Up', color: '#10b981' },
  invoice_payment: { ar: 'دفع فاتورة', en: 'Invoice Payment', color: '#3b82f6' },
  withdrawal: { ar: 'سحب', en: 'Withdrawal', color: '#ef4444' },
  refund: { ar: 'استرداد', en: 'Refund', color: '#f59e0b' },
  transfer: { ar: 'تحويل', en: 'Transfer', color: '#8b5cf6' },
  adjustment: { ar: 'تعديل', en: 'Adjustment', color: '#6b7280' },
};

export function generatePaymentReceiptHTML(data: PaymentReceiptData): string {
  const typeConfig = transactionTypeLabels[data.transactionType] || transactionTypeLabels.adjustment;
  const isCredit = ['topup', 'refund'].includes(data.transactionType);
  const amountPrefix = isCredit ? '+' : '-';
  const amountColor = isCredit ? '#10b981' : '#ef4444';
  
  const formattedDate = new Date(data.issueDate).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory'
  });
  
  const formattedTime = new Date(data.issueDate).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إيصال دفع - ${data.receiptNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
          background: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
        }
        
        .receipt-container {
          max-width: 420px;
          margin: 20px auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        
        .receipt-header {
          background: linear-gradient(135deg, #0d9488 0%, #059669 50%, #047857 100%);
          color: white;
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .receipt-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        }
        
        .company-logo {
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.2);
          border-radius: 16px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 800;
          backdrop-filter: blur(10px);
        }
        
        .company-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .receipt-title {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 8px;
        }
        
        .receipt-number {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
          letter-spacing: 1px;
        }
        
        .amount-section {
          background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%);
          padding: 32px 24px;
          text-align: center;
          border-bottom: 1px dashed #d1d5db;
        }
        
        .transaction-type {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${typeConfig.color}15;
          color: ${typeConfig.color};
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .amount-value {
          font-size: 42px;
          font-weight: 800;
          color: ${amountColor};
          margin-bottom: 8px;
          direction: ltr;
        }
        
        .amount-words {
          font-size: 12px;
          color: #64748b;
          padding: 8px 16px;
          background: white;
          border-radius: 8px;
          margin-top: 12px;
        }
        
        .details-section {
          padding: 24px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        
        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .detail-value.mono {
          font-family: 'IBM Plex Mono', monospace;
          direction: ltr;
          background: #f8fafc;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
        }
        
        .balance-section {
          background: #f8fafc;
          margin: 0 24px 24px;
          border-radius: 16px;
          padding: 20px;
        }
        
        .balance-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        
        .balance-label {
          font-size: 13px;
          color: #64748b;
        }
        
        .balance-value {
          font-size: 14px;
          font-weight: 700;
          direction: ltr;
        }
        
        .balance-value.new {
          font-size: 18px;
          color: #059669;
        }
        
        .footer-section {
          background: #1e293b;
          color: white;
          padding: 24px;
          text-align: center;
        }
        
        .footer-company {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        
        .footer-contact {
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 11px;
          opacity: 0.6;
        }
        
        .success-stamp {
          position: absolute;
          top: 20px;
          left: 20px;
          transform: rotate(-15deg);
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        @media print {
          body { background: white; }
          .receipt-container { box-shadow: none; margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="success-stamp">✓ تم بنجاح</div>
          <div class="company-logo">ASH</div>
          <div class="company-name">${SELLER_INFO.name_ar}</div>
          <div class="receipt-title">إيصال معاملة المحفظة</div>
          <div class="receipt-number">${data.receiptNumber}</div>
        </div>
        
        <div class="amount-section">
          <div class="transaction-type">
            <span>●</span>
            ${typeConfig.ar}
          </div>
          <div class="amount-value">${amountPrefix}${data.amount.toLocaleString('ar-SA')} ${data.currency}</div>
          <div class="amount-words">${formatAmountInWords(data.amount)}</div>
        </div>
        
        <div class="details-section">
          <div class="detail-row">
            <span class="detail-label">اسم العميل</span>
            <span class="detail-value">${data.customerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">رقم العميل</span>
            <span class="detail-value mono">${data.customerUid}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">رقم المحفظة</span>
            <span class="detail-value mono">${data.walletNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">التاريخ</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">الوقت</span>
            <span class="detail-value">${formattedTime}</span>
          </div>
          ${data.referenceNumber ? `
          <div class="detail-row">
            <span class="detail-label">رقم المرجع</span>
            <span class="detail-value mono">${data.referenceNumber}</span>
          </div>
          ` : ''}
          ${data.paymentMethod ? `
          <div class="detail-row">
            <span class="detail-label">طريقة الدفع</span>
            <span class="detail-value">${data.paymentMethod}</span>
          </div>
          ` : ''}
          ${data.description ? `
          <div class="detail-row">
            <span class="detail-label">الوصف</span>
            <span class="detail-value">${data.description}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="balance-section">
          <div class="balance-row">
            <span class="balance-label">الرصيد السابق</span>
            <span class="balance-value">${data.previousBalance.toLocaleString('ar-SA')} ${data.currency}</span>
          </div>
          <div class="balance-row">
            <span class="balance-label">المبلغ</span>
            <span class="balance-value" style="color: ${amountColor}">${amountPrefix}${data.amount.toLocaleString('ar-SA')} ${data.currency}</span>
          </div>
          <div style="height: 1px; background: #e2e8f0; margin: 8px 0;"></div>
          <div class="balance-row">
            <span class="balance-label">الرصيد الجديد</span>
            <span class="balance-value new">${data.newBalance.toLocaleString('ar-SA')} ${data.currency}</span>
          </div>
        </div>
        
        <div class="footer-section">
          <div class="footer-company">${SELLER_INFO.name_en}</div>
          <div class="footer-contact">
            <span>${SELLER_INFO.phone}</span>
            <span>${SELLER_INFO.email}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function downloadPaymentReceiptPdf(data: PaymentReceiptData): Promise<void> {
  const html = generatePaymentReceiptHTML(data);
  
  // Create hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 500px; height: 800px;';
  document.body.appendChild(iframe);
  
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('Could not create document');
  }
  
  doc.open();
  doc.write(html);
  doc.close();
  
  // Wait for content to render
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Import html2canvas and jsPDF dynamically
  const [html2canvas, { jsPDF }] = await Promise.all([
    import('html2canvas').then(m => m.default),
    import('jspdf')
  ]);
  
  const container = doc.querySelector('.receipt-container') as HTMLElement;
  if (!container) {
    document.body.removeChild(iframe);
    throw new Error('Receipt container not found');
  }
  
  const canvas = await html2canvas(container, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [110, 200] // Receipt size
  });
  
  const imgWidth = 100;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
  pdf.save(`receipt-${data.receiptNumber}.pdf`);
  
  document.body.removeChild(iframe);
}

export type { PaymentReceiptData };
