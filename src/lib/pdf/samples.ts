/**
 * Sample PDF Data Generators
 * 
 * Used for testing and demonstration purposes
 */

import type { InvoiceData } from './invoice-generator';
import type { ReportData } from './report-generator';
import type { ContractData } from './contract-generator';

/**
 * Generate sample invoice data for testing RTL PDF generation
 */
export function generateSampleInvoice(): InvoiceData {
  return {
    invoiceNumber: 'INV-2026-0001',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'pending',
    
    customer: {
      name: 'محمد أحمد الشمري',
      email: 'mohammed@example.com',
      phone: '+966 55 123 4567',
      address: 'الرياض، حي النرجس، شارع الأمير سلطان',
      taxNumber: '300123456789012',
    },
    
    items: [
      {
        description: 'خدمات استشارية - تطوير الأعمال',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
      {
        description: 'تصميم وتطوير موقع إلكتروني',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
      {
        description: 'صيانة شهرية للأنظمة',
        quantity: 3,
        unitPrice: 2000,
        total: 6000,
      },
      {
        description: 'تدريب الموظفين على النظام الجديد',
        quantity: 2,
        unitPrice: 5000,
        total: 10000,
      },
    ],
    
    subtotal: 56000,
    taxRate: 15,
    taxAmount: 8400,
    discount: 1000,
    total: 63400,
    
    currency: 'SAR',
    
    notes: 'شكراً لكم على ثقتكم بخدماتنا. يرجى السداد خلال 30 يوماً من تاريخ إصدار الفاتورة.',
    
    terms: 'الأسعار شاملة ضريبة القيمة المضافة. يحق للشركة تأخير تقديم الخدمات في حال تأخر السداد.',
    
    paymentInfo: {
      bankName: 'البنك الأهلي السعودي',
      accountNumber: '1234567890',
      iban: 'SA0380000000608010167519',
    },
  };
}

/**
 * Generate sample report data for testing RTL PDF generation
 */
export function generateSampleReport(): ReportData {
  return {
    title: 'تقرير الأداء الشهري',
    subtitle: 'قسم المبيعات والتسويق',
    date: new Date(),
    period: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    
    summary: [
      { label: 'إجمالي المبيعات', value: '1,250,000 ر.س', highlight: true },
      { label: 'عدد العملاء الجدد', value: 45 },
      { label: 'نسبة النمو', value: '23%' },
      { label: 'معدل رضا العملاء', value: '94%' },
    ],
    
    sections: [
      {
        title: 'ملخص تنفيذي',
        content: 'حقق قسم المبيعات نتائج استثنائية خلال الشهر الماضي، حيث تجاوزت المبيعات المستهدفة بنسبة 15%. شهدنا زيادة ملحوظة في عدد العملاء الجدد مقارنة بالشهر السابق، كما ارتفع معدل رضا العملاء إلى مستويات قياسية.',
      },
      {
        title: 'توزيع المبيعات حسب المنتج',
        content: {
          type: 'table',
          headers: ['المنتج', 'الكمية', 'الإيرادات', 'النسبة'],
          rows: [
            ['خدمات استشارية', '45', '450,000 ر.س', '36%'],
            ['حلول تقنية', '32', '380,000 ر.س', '30%'],
            ['تطوير برمجيات', '28', '280,000 ر.س', '22%'],
            ['خدمات دعم فني', '56', '140,000 ر.س', '12%'],
          ],
        },
      },
      {
        title: 'أداء الفريق',
        content: {
          type: 'chart',
          chartType: 'bar',
          data: [
            { label: 'أحمد الشمري', value: 320000 },
            { label: 'فاطمة العتيبي', value: 285000 },
            { label: 'خالد القحطاني', value: 250000 },
            { label: 'نورة الدوسري', value: 220000 },
            { label: 'سلطان المطيري', value: 175000 },
          ],
        },
      },
      {
        title: 'التوصيات',
        content: 'بناءً على نتائج الشهر الماضي، نوصي بالتركيز على توسيع قاعدة العملاء في قطاع الشركات الصغيرة والمتوسطة، وزيادة الاستثمار في التسويق الرقمي لتحقيق نمو مستدام.',
      },
    ],
    
    notes: 'هذا التقرير سري ومخصص للإدارة العليا فقط. يرجى عدم مشاركته خارج نطاق العمل.',
  };
}

/**
 * Generate sample contract data for testing RTL PDF generation
 */
export function generateSampleContract(): ContractData {
  return {
    contractNumber: 'CON-2026-0001',
    contractType: 'عقد تقديم خدمات استشارية',
    date: new Date(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    
    firstParty: {
      name: 'شركة علي صالح الشهري القابضة',
      title: 'مقدم الخدمة',
      idNumber: '1234567890',
      address: 'الرياض، طريق الملك فهد، برج المملكة',
      phone: '+966 11 123 4567',
      representedBy: 'علي صالح الشهري - المدير التنفيذي',
    },
    
    secondParty: {
      name: 'شركة المستقبل للتقنية',
      title: 'العميل',
      idNumber: '9876543210',
      address: 'جدة، حي الروضة، شارع التحلية',
      phone: '+966 12 987 6543',
      representedBy: 'محمد عبدالله الغامدي - مدير العمليات',
    },
    
    preamble: 'حيث أن الطرف الأول شركة متخصصة في تقديم الخدمات الاستشارية وحلول الأعمال، وحيث أن الطرف الثاني يرغب في الاستفادة من خبرات الطرف الأول، فقد اتفق الطرفان على إبرام هذا العقد وفقاً للشروط والأحكام التالية.',
    
    clauses: [
      {
        title: 'موضوع العقد',
        content: 'يتعهد الطرف الأول بتقديم الخدمات الاستشارية للطرف الثاني في مجال تطوير الأعمال والتحول الرقمي، وفقاً للمواصفات والمعايير المتفق عليها.',
        subClauses: [
          'تحليل الوضع الحالي للأعمال وتحديد فرص التحسين',
          'وضع خطة استراتيجية للتحول الرقمي',
          'متابعة تنفيذ الخطة وتقديم التقارير الدورية',
        ],
      },
      {
        title: 'مدة العقد',
        content: 'مدة هذا العقد سنة ميلادية واحدة تبدأ من تاريخ التوقيع، قابلة للتجديد بموافقة الطرفين.',
      },
      {
        title: 'التزامات الطرف الأول',
        content: 'يلتزم الطرف الأول بما يلي:',
        subClauses: [
          'تقديم الخدمات بجودة عالية وفقاً لأفضل الممارسات المهنية',
          'توفير فريق عمل مؤهل ومتخصص',
          'الحفاظ على سرية المعلومات والبيانات',
          'تقديم تقارير دورية عن سير العمل',
        ],
      },
      {
        title: 'التزامات الطرف الثاني',
        content: 'يلتزم الطرف الثاني بما يلي:',
        subClauses: [
          'سداد المستحقات المالية في مواعيدها المحددة',
          'توفير المعلومات والبيانات اللازمة لتنفيذ العمل',
          'تسهيل مهمة فريق العمل وتوفير الدعم اللازم',
        ],
      },
      {
        title: 'السرية',
        content: 'يتعهد الطرفان بالحفاظ على سرية جميع المعلومات والبيانات التي يتم تبادلها خلال فترة العقد وبعد انتهائه، ولا يجوز الإفصاح عنها لأي طرف ثالث دون موافقة كتابية مسبقة.',
      },
      {
        title: 'فسخ العقد',
        content: 'يجوز لأي من الطرفين فسخ هذا العقد بموجب إشعار كتابي قبل ثلاثين يوماً من تاريخ الفسخ المقترح، على أن يتم تسوية جميع الالتزامات المالية المستحقة.',
      },
      {
        title: 'تسوية النزاعات',
        content: 'في حالة نشوء أي خلاف أو نزاع بين الطرفين حول تفسير أو تنفيذ هذا العقد، يتم حله ودياً، وفي حالة عدم التوصل إلى حل، يتم اللجوء إلى التحكيم وفقاً لأنظمة المملكة العربية السعودية.',
      },
    ],
    
    value: {
      amount: 500000,
      currency: 'SAR',
      paymentTerms: 'يتم السداد على أربع دفعات ربع سنوية متساوية',
    },
    
    witnesses: [
      { name: 'عبدالرحمن السلمان', idNumber: '1122334455' },
      { name: 'سارة العمري', idNumber: '5544332211' },
    ],
  };
}
