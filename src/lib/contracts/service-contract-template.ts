/**
 * Service Contract HTML Template - Premium Legal Design
 * قالب عقد الخدمات القانوني الشامل
 * محسّن للطباعة وتصدير PDF متعدد الصفحات
 */

import { ContractData } from '@/lib/invoices/types';
import { SELLER_INFO } from '@/lib/invoices/constants';

// Arabic number converter
function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
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

// Legal articles for service contracts
const SERVICE_CONTRACT_ARTICLES = [
  {
    number: '١',
    title: 'تمهيد',
    content: 'يعتبر التمهيد أعلاه جزءاً لا يتجزأ من هذا العقد ومكملاً لأحكامه ويُقرأ معه كوحدة واحدة.'
  },
  {
    number: '٢',
    title: 'موضوع العقد',
    content: 'يلتزم الطرف الأول بتقديم الخدمة المتفق عليها للطرف الثاني وفقاً للمواصفات والمعايير المحددة في هذا العقد، ويلتزم الطرف الثاني بدفع المقابل المالي المتفق عليه وفقاً للشروط المبينة أدناه.'
  },
  {
    number: '٣',
    title: 'نطاق العمل',
    content: 'يشمل نطاق العمل جميع المهام والأنشطة اللازمة لتقديم الخدمة بالجودة المطلوبة، بما في ذلك: التخطيط والتصميم، التنفيذ والتطوير، الاختبار وضمان الجودة، التسليم والدعم الفني خلال فترة الضمان.'
  },
  {
    number: '٤',
    title: 'المقابل المالي وطريقة السداد',
    content: 'يلتزم الطرف الثاني بسداد المقابل المالي المتفق عليه شاملاً ضريبة القيمة المضافة (15%)، ويتم السداد وفقاً لإحدى الطرق المتاحة: تحويل بنكي، بطاقة مدى/فيزا، أو من خلال المحفظة الإلكترونية.'
  },
  {
    number: '٥',
    title: 'التزامات الطرف الأول',
    content: 'يلتزم الطرف الأول بما يلي: (أ) تقديم الخدمة وفق أعلى معايير الجودة والكفاءة، (ب) الالتزام بالجدول الزمني المتفق عليه، (ج) تعيين فريق عمل مؤهل ومختص، (د) تقديم تقارير دورية عن سير العمل، (هـ) ضمان سرية المعلومات والبيانات.'
  },
  {
    number: '٦',
    title: 'التزامات الطرف الثاني',
    content: 'يلتزم الطرف الثاني بما يلي: (أ) سداد المقابل المالي في المواعيد المحددة، (ب) توفير جميع المعلومات والمستندات والصلاحيات اللازمة، (ج) التعاون الكامل مع فريق العمل، (د) مراجعة المخرجات وتقديم الملاحظات في الوقت المناسب، (هـ) الالتزام بحقوق الملكية الفكرية.'
  },
  {
    number: '٧',
    title: 'الملكية الفكرية',
    content: 'تظل جميع حقوق الملكية الفكرية المتعلقة بالأدوات والمنهجيات والبرمجيات الأساسية مملوكة للطرف الأول. وتنتقل حقوق الملكية الفكرية للمنتج النهائي المخصص إلى الطرف الثاني بعد اكتمال السداد الكامل للمقابل المالي.'
  },
  {
    number: '٨',
    title: 'السرية وحماية البيانات',
    content: 'يتعهد الطرفان بالحفاظ على سرية جميع المعلومات والبيانات المتبادلة بينهما، وعدم الإفصاح عنها لأي طرف ثالث دون موافقة كتابية مسبقة. يسري هذا الالتزام خلال مدة العقد ولمدة ثلاث (3) سنوات بعد انتهائه.'
  },
  {
    number: '٩',
    title: 'الضمان والدعم الفني',
    content: 'يقدم الطرف الأول ضماناً على الخدمة المقدمة لمدة تحدد وفقاً لطبيعة الخدمة، ويشمل الضمان: إصلاح الأخطاء التقنية، الدعم الفني عبر قنوات التواصل المعتمدة، التحديثات الضرورية خلال فترة الضمان.'
  },
  {
    number: '١٠',
    title: 'إنهاء العقد',
    content: 'يحق لأي من الطرفين إنهاء هذا العقد في الحالات التالية: (أ) بالاتفاق الكتابي بين الطرفين، (ب) إخلال أحد الطرفين بالتزاماته الجوهرية مع عدم معالجة الإخلال خلال (15) يوم من الإخطار، (ج) الإفلاس أو التصفية أو الحراسة القضائية لأي من الطرفين.'
  },
  {
    number: '١١',
    title: 'القوة القاهرة',
    content: 'لا يكون أي من الطرفين مسؤولاً عن عدم تنفيذ التزاماته إذا كان ذلك ناتجاً عن قوة قاهرة خارجة عن إرادته، بشرط إخطار الطرف الآخر فوراً واتخاذ الإجراءات اللازمة للحد من آثارها.'
  },
  {
    number: '١٢',
    title: 'القانون الواجب التطبيق وفض النزاعات',
    content: 'يخضع هذا العقد لأنظمة المملكة العربية السعودية ولوائحها. في حال نشوء أي خلاف يتم حله ودياً، وإلا تختص المحاكم المختصة في المملكة العربية السعودية بالفصل فيه.'
  },
  {
    number: '١٣',
    title: 'أحكام عامة',
    content: 'يمثل هذا العقد كامل الاتفاق بين الطرفين ويحل محل أي اتفاقات سابقة. لا يجوز تعديل هذا العقد إلا بموجب ملحق كتابي موقع من الطرفين. إذا تبين بطلان أي بند، تظل البنود الأخرى سارية المفعول.'
  },
];

export interface ServiceContractRenderOptions {
  showAnimations?: boolean;
  printMode?: boolean;
}

export function renderServiceContractHTML(
  data: ContractData,
  options: ServiceContractRenderOptions = {}
): string {
  const { showAnimations = true, printMode = false } = options;
  
  const totalAmount = data.pricing?.total || 0;
  const subtotal = data.pricing?.subtotal || 0;
  const vatAmount = data.pricing?.vatAmount || 0;
  const vatRate = data.pricing?.vatRate || 0.15;
  const amountInWords = numberToArabicWords(totalAmount);
  
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatDate = (dateStr: string | Date | undefined | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const contractDate = formatDate(data.date || data.createdAt);
  const signedDate = data.signedAt ? formatDate(data.signedAt) : null;
  const adminApprovedDate = data.adminApprovedAt ? formatDate(data.adminApprovedAt) : null;
  const customerSignedDate = data.customerSignedAt ? formatDate(data.customerSignedAt) : signedDate;
  const customerName = data.customerSignatureName || data.customer?.name || data.customerNameAr || '-';

  // Generate legal articles HTML with proper page-break controls
  const articlesHTML = SERVICE_CONTRACT_ARTICLES.map((article, index) => `
    <div class="article" ${index === 0 ? 'style="page-break-before: avoid;"' : ''}>
      <div class="article-header">
        <span class="article-number">المادة ${article.number}</span>
        <span class="article-title">${article.title}</span>
      </div>
      <div class="article-content">${article.content}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عقد تقديم خدمات - ${data.contractNumber}</title>
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
    
    /* ========================================
       PAGE SETUP - A4 with proper margins
       ======================================== */
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    
    body {
      font-family: 'Noto Kufi Arabic', 'IBM Plex Sans Arabic', sans-serif;
      background: ${printMode ? 'white' : 'var(--bg-gradient)'};
      min-height: 100vh;
      padding: ${printMode ? '0' : '20px'};
      color: var(--navy-dark);
      line-height: 1.7;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .contract-container {
      max-width: 794px;
      margin: 0 auto;
      background: white;
      ${printMode ? '' : 'border-radius: 12px; box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.12);'}
      overflow: hidden;
    }
    
    ${showAnimations ? `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes stampBounce {
      0% { transform: scale(0) rotate(-180deg); opacity: 0; }
      60% { transform: scale(1.1) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .contract-container { animation: slideUp 0.5s ease-out; }
    ` : ''}
    
    /* ========================================
       HEADER - Compact but professional
       ======================================== */
    .contract-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, var(--navy) 100%);
      padding: 18px 28px;
      position: relative;
      overflow: hidden;
    }
    
    .contract-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .company-info { color: white; }
    
    .company-name {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .company-subtitle {
      font-size: 11px;
      opacity: 0.85;
    }
    
    .contract-badge {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--navy-dark);
      padding: 10px 22px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 3px 10px rgba(245, 158, 11, 0.35);
    }
    
    /* Info Bar */
    .contract-info-bar {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-size: 11px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    
    .info-label {
      opacity: 0.7;
      font-size: 10px;
    }
    
    .info-value {
      font-weight: 600;
      font-family: 'IBM Plex Sans Arabic', monospace;
      font-size: 11px;
    }
    
    /* ========================================
       MAIN BODY
       ======================================== */
    .contract-body {
      padding: 24px 28px;
    }
    
    /* Preamble - Keep together */
    .preamble {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid var(--gold);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 20px;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .preamble-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 8px;
    }
    
    .preamble-text {
      font-size: 12px;
      color: var(--navy);
      line-height: 1.8;
    }
    
    /* ========================================
       PARTIES SECTION - Keep together
       ======================================== */
    .parties-section {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 18px;
    }
    
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .party-card {
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .party-header {
      padding: 10px 14px;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .party-header.provider {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      color: white;
    }
    
    .party-header.customer {
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
    }
    
    .party-icon {
      width: 22px;
      height: 22px;
      background: var(--gold);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--navy-dark);
      font-size: 11px;
    }
    
    .party-body {
      padding: 12px 14px;
      background: #fafafa;
    }
    
    .party-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 8px;
    }
    
    .party-detail {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 11px;
    }
    
    .party-detail:last-child { border-bottom: none; }
    
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: var(--navy); }
    
    /* ========================================
       SERVICE SECTION - Keep together
       ======================================== */
    .service-section {
      background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
      border: 2px solid var(--primary);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 18px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .service-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .service-icon { font-size: 18px; }
    
    .service-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
    }
    
    .service-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 8px;
    }
    
    .service-description {
      font-size: 12px;
      color: #475569;
      line-height: 1.8;
    }
    
    /* ========================================
       AMOUNT & PRICING - Keep together
       ======================================== */
    .pricing-section {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 18px;
    }
    
    .amount-box {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      border-radius: 10px;
      padding: 18px;
      text-align: center;
      color: white;
      margin-bottom: 14px;
    }
    
    .amount-label {
      font-size: 11px;
      opacity: 0.9;
      margin-bottom: 6px;
    }
    
    .amount-value {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 6px;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
    }
    
    .amount-words {
      font-size: 11px;
      opacity: 0.9;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    
    /* Pricing Table */
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .pricing-table tr {
      border-bottom: 1px solid #e2e8f0;
    }
    
    .pricing-table tr:last-child { border-bottom: none; }
    
    .pricing-table td {
      padding: 10px 14px;
    }
    
    .pricing-table td:first-child {
      background: #f8fafc;
      font-weight: 600;
      color: var(--navy);
    }
    
    .pricing-table td:last-child {
      text-align: left;
      font-family: 'IBM Plex Sans Arabic', monospace;
    }
    
    .pricing-table tr.total {
      background: var(--navy);
      color: white;
    }
    
    .pricing-table tr.total td {
      font-weight: 700;
      font-size: 13px;
    }
    
    .pricing-table tr.total td:first-child {
      background: transparent;
    }
    
    /* ========================================
       LEGAL ARTICLES - CRITICAL: Page breaks
       ======================================== */
    .legal-section {
      margin-top: 20px;
    }
    
    .legal-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--navy-dark);
      text-align: center;
      padding: 12px 16px;
      background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
      border-radius: 8px;
      margin-bottom: 16px;
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .article {
      margin-bottom: 14px;
      padding: 12px 14px;
      background: #fafafa;
      border-radius: 8px;
      border-right: 3px solid var(--primary);
      /* CRITICAL: Prevent article from being split across pages */
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .article-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .article-number {
      background: var(--primary);
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    
    .article-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--navy-dark);
    }
    
    .article-content {
      font-size: 12px;
      color: #475569;
      line-height: 1.85;
      text-align: justify;
    }
    
    /* ========================================
       SIGNATURES - Keep together ALWAYS
       ======================================== */
    .signature-section {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 3px solid var(--gold);
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-before: auto;
    }
    
    .signature-title {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: var(--navy-dark);
      margin-bottom: 16px;
    }
    
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .signature-box {
      text-align: center;
      padding: 16px;
      border: 2px dashed #e2e8f0;
      border-radius: 10px;
      min-height: 120px;
    }
    
    .signature-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--navy);
      margin-bottom: 12px;
    }
    
    /* Digital Stamps */
    .stamp-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    .digital-stamp {
      display: inline-block;
    }
    
    .stamp-circle {
      width: 90px;
      height: 90px;
      border: 3px solid var(--success);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(16, 185, 129, 0.06);
      margin: 0 auto;
      position: relative;
      ${showAnimations ? 'animation: stampBounce 0.4s ease-out 0.5s backwards;' : ''}
    }
    
    .stamp-circle::before {
      content: '';
      position: absolute;
      inset: 4px;
      border: 2px solid var(--success);
      border-radius: 50%;
      opacity: 0.5;
    }
    
    .stamp-text {
      font-size: 9px;
      font-weight: 700;
      color: var(--success);
      text-align: center;
      line-height: 1.3;
    }
    
    .stamp-check {
      font-size: 14px;
      margin-bottom: 2px;
    }
    
    /* Admin Stamp */
    .admin-stamp {
      width: 85px;
      height: 85px;
      border: 3px solid #059669;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(5, 150, 105, 0.06);
      position: relative;
      ${showAnimations ? 'animation: stampBounce 0.4s ease-out 0.6s backwards;' : ''}
    }
    
    .admin-stamp::before {
      content: '';
      position: absolute;
      inset: 4px;
      border: 2px solid #059669;
      border-radius: 50%;
      opacity: 0.4;
    }
    
    .admin-stamp-text {
      font-size: 9px;
      font-weight: 700;
      color: #059669;
      text-align: center;
      line-height: 1.3;
    }
    
    .admin-stamp-check {
      font-size: 12px;
      color: #059669;
      margin-bottom: 2px;
    }
    
    .admin-stamp-date {
      font-size: 8px;
      color: #059669;
      opacity: 0.8;
      margin-top: 2px;
    }
    
    /* Customer Stamp */
    .customer-stamp {
      width: 85px;
      height: 85px;
      border: 3px solid var(--primary);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(15, 118, 110, 0.06);
      margin: 0 auto;
      position: relative;
      ${showAnimations ? 'animation: stampBounce 0.4s ease-out 0.7s backwards;' : ''}
    }
    
    .customer-stamp::before {
      content: '';
      position: absolute;
      inset: 4px;
      border: 2px solid var(--primary);
      border-radius: 50%;
      opacity: 0.4;
    }
    
    .customer-stamp-text {
      font-size: 9px;
      font-weight: 700;
      color: var(--primary);
      text-align: center;
      line-height: 1.3;
    }
    
    .customer-stamp-check {
      font-size: 12px;
      color: var(--primary);
      margin-bottom: 2px;
    }
    
    .customer-stamp-date {
      font-size: 8px;
      color: var(--primary);
      opacity: 0.8;
      margin-top: 2px;
    }
    
    .signature-line {
      border-top: 2px solid var(--navy);
      width: 65%;
      margin: 30px auto 0;
      padding-top: 8px;
      font-size: 11px;
      color: #64748b;
    }
    
    /* ========================================
       FOOTER
       ======================================== */
    .contract-footer {
      background: linear-gradient(90deg, var(--navy) 0%, var(--navy-dark) 100%);
      padding: 12px 28px;
      text-align: center;
      color: white;
      font-size: 10px;
      opacity: 0.95;
    }
    
    /* ========================================
       PRINT STYLES - Critical for PDF
       ======================================== */
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
        font-size: 11px !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .contract-container {
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
      
      /* Ensure articles never break */
      .article {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Keep header and preamble together */
      .contract-header,
      .contract-info-bar,
      .preamble {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Parties should stay together */
      .parties-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Service section together */
      .service-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Pricing together */
      .pricing-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* SIGNATURES MUST STAY TOGETHER */
      .signature-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Allow page break before legal section */
      .legal-section {
        page-break-before: auto;
      }
      
      /* Adjust for print visibility */
      .contract-header { print-color-adjust: exact; }
      .amount-box { print-color-adjust: exact; }
      .pricing-table tr.total { print-color-adjust: exact; }
      .party-header { print-color-adjust: exact; }
      .article-number { print-color-adjust: exact; }
    }
    
    /* ========================================
       MOBILE RESPONSIVE
       ======================================== */
    @media screen and (max-width: 768px) {
      body { padding: 10px; }
      
      .contract-header { padding: 14px 18px; }
      
      .header-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
      
      .company-name { font-size: 16px; }
      .contract-badge { font-size: 13px; padding: 8px 18px; }
      
      .contract-info-bar {
        flex-wrap: wrap;
        padding: 10px 18px;
        gap: 10px;
      }
      
      .info-item { flex: 1 1 30%; }
      
      .contract-body { padding: 16px; }
      .preamble { padding: 14px; }
      .parties-grid { grid-template-columns: 1fr; }
      .service-section { padding: 14px; }
      .amount-box { padding: 14px; }
      .amount-value { font-size: 22px; }
      .signature-grid { grid-template-columns: 1fr; gap: 14px; }
    }
    
    @media screen and (max-width: 480px) {
      body { padding: 5px; font-size: 12px; }
      .contract-header { padding: 12px; }
      .company-name { font-size: 14px; }
      .contract-badge { font-size: 12px; padding: 6px 14px; }
      .contract-body { padding: 12px; }
      .amount-value { font-size: 20px; }
      .admin-stamp, .customer-stamp, .stamp-circle { transform: scale(0.85); }
    }
  </style>
</head>
<body>
  <div class="contract-container">
    <!-- Header -->
    <div class="contract-header">
      <div class="header-content">
        <div class="company-info">
          <div class="company-name">${data.provider?.name || SELLER_INFO.name_ar}</div>
          <div class="company-subtitle">${data.provider?.address || SELLER_INFO.address_ar}</div>
        </div>
        <div class="contract-badge">عقد تقديم خدمات</div>
      </div>
    </div>
    
    <!-- Info Bar -->
    <div class="contract-info-bar">
      <div class="info-item">
        <span class="info-label">رقم العقد</span>
        <span class="info-value" dir="ltr">${data.contractNumber}</span>
      </div>
      <div class="info-item">
        <span class="info-label">تاريخ الإصدار</span>
        <span class="info-value">${contractDate}</span>
      </div>
      <div class="info-item">
        <span class="info-label">الحالة</span>
        <span class="info-value">${signedDate ? '✓ موقّع' : '⏳ قيد التوقيع'}</span>
      </div>
    </div>
    
    <!-- Body -->
    <div class="contract-body">
      <!-- Preamble -->
      <div class="preamble">
        <div class="preamble-title">بسم الله الرحمن الرحيم</div>
        <div class="preamble-text">
          تم بعون الله وتوفيقه إبرام هذا العقد بين كل من الطرفين المذكورين أدناه، وذلك وفقاً للشروط والأحكام التالية
        </div>
      </div>
      
      <!-- Parties -->
      <div class="parties-section">
        <div class="parties-grid">
          <div class="party-card">
            <div class="party-header provider">
              <div class="party-icon">١</div>
              <span>الطرف الأول (مقدم الخدمة)</span>
            </div>
            <div class="party-body">
              <div class="party-name">${data.provider?.name || SELLER_INFO.name_ar}</div>
              <div class="party-detail">
                <span class="detail-label">العنوان:</span>
                <span class="detail-value">${data.provider?.address || SELLER_INFO.address_ar}</span>
              </div>
              <div class="party-detail">
                <span class="detail-label">الهاتف:</span>
                <span class="detail-value" dir="ltr">${data.provider?.phone || SELLER_INFO.phone}</span>
              </div>
            </div>
          </div>
          
          <div class="party-card">
            <div class="party-header customer">
              <div class="party-icon">٢</div>
              <span>الطرف الثاني (العميل)</span>
            </div>
            <div class="party-body">
              <div class="party-name">${data.customer?.name || data.customerNameAr || data.customerName || '-'}</div>
              ${data.customer?.nationalId ? `
              <div class="party-detail">
                <span class="detail-label">رقم الهوية:</span>
                <span class="detail-value" dir="ltr">${data.customer.nationalId}</span>
              </div>
              ` : ''}
              ${data.customer?.phone ? `
              <div class="party-detail">
                <span class="detail-label">الهاتف:</span>
                <span class="detail-value" dir="ltr">${data.customer.phone}</span>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Service Section -->
      <div class="service-section">
        <div class="service-header">
          <span class="service-icon">📋</span>
          <span class="service-title">تفاصيل الخدمة المتعاقد عليها</span>
        </div>
        <div class="service-name">${data.serviceNameAr || data.serviceName || 'خدمة'}</div>
        <div class="service-description">
          ${data.scopeSummaryAr || data.scopeSummary || data.serviceDescription || 'تقديم الخدمات المتفق عليها وفقاً للمواصفات والمعايير المحددة في هذا العقد، بما يشمل التخطيط والتصميم والتنفيذ والتسليم والدعم الفني.'}
        </div>
      </div>
      
      <!-- Pricing Section -->
      ${totalAmount > 0 ? `
      <div class="pricing-section">
        <div class="amount-box">
          <div class="amount-label">قيمة العقد الإجمالية شاملة ضريبة القيمة المضافة</div>
          <div class="amount-value" dir="ltr">${formatAmount(totalAmount)} ر.س</div>
          <div class="amount-words">فقط ${amountInWords} لا غير</div>
        </div>
        
        <table class="pricing-table">
          <tr>
            <td>المبلغ قبل الضريبة</td>
            <td dir="ltr">${formatAmount(subtotal)} ر.س</td>
          </tr>
          <tr>
            <td>ضريبة القيمة المضافة (${toArabicDigits(Math.round(vatRate * 100))}٪)</td>
            <td dir="ltr">${formatAmount(vatAmount)} ر.س</td>
          </tr>
          <tr class="total">
            <td>الإجمالي شامل الضريبة</td>
            <td dir="ltr">${formatAmount(totalAmount)} ر.س</td>
          </tr>
        </table>
      </div>
      ` : ''}
      
      <!-- Legal Articles -->
      <div class="legal-section">
        <div class="legal-title">📜 الشروط والأحكام القانونية</div>
        ${articlesHTML}
      </div>
      
      <!-- Signatures -->
      <div class="signature-section">
        <div class="signature-title">التوقيعات والأختام</div>
        <div class="signature-grid">
          <!-- Provider Signature + Admin Approval -->
          <div class="signature-box">
            <div class="signature-label">الطرف الأول (مقدم الخدمة)</div>
            <div class="stamp-wrapper">
              <div class="digital-stamp">
                <div class="stamp-circle">
                  <div class="stamp-text">شركة علي صالح<br/>الشهري القابضة</div>
                </div>
              </div>
              ${adminApprovedDate ? `
              <div class="admin-stamp">
                <div class="admin-stamp-check">✓</div>
                <div class="admin-stamp-text">تمت الموافقة<br/>من الإدارة</div>
                <div class="admin-stamp-date">${adminApprovedDate}</div>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Customer Signature -->
          <div class="signature-box">
            <div class="signature-label">الطرف الثاني (العميل)</div>
            ${customerSignedDate ? `
            <div class="customer-stamp">
              <div class="customer-stamp-check">✓</div>
              <div class="customer-stamp-text">تم التوقيع<br/>${customerName.split(' ').slice(0, 2).join(' ')}</div>
              <div class="customer-stamp-date">${customerSignedDate}</div>
            </div>
            ` : `
            <div class="signature-line">التوقيع</div>
            `}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="contract-footer">
      <p>${SELLER_INFO.name_ar} - جميع الحقوق محفوظة © ${new Date().getFullYear()} | هذا العقد ملزم قانونياً للطرفين</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Preview contract in new window
 */
export function previewServiceContract(data: ContractData): Window | null {
  const html = renderServiceContractHTML(data, { showAnimations: true, printMode: false });
  
  const previewWindow = window.open('', '_blank', 'width=900,height=700');
  if (!previewWindow) {
    console.error('Could not open preview window');
    return null;
  }
  
  previewWindow.document.write(html);
  previewWindow.document.close();
  
  return previewWindow;
}

/**
 * Print contract
 */
export function printServiceContract(data: ContractData): void {
  const html = renderServiceContractHTML(data, { showAnimations: false, printMode: true });
  
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}
