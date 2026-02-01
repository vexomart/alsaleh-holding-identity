/**
 * Arabic Corporate Contract Template
 * 
 * Professional RTL legal contract with:
 * - Full Arabic support with Cairo font
 * - Structured clauses (numbered ١،٢،٣)
 * - Parties section
 * - Payment terms with VAT
 * - Signature blocks with seal placeholders
 * - Signature status for signed contracts
 * 
 * Uses Arabic correctness layer for proper bidi handling:
 * - ltr() for contract numbers, ID numbers, amounts
 * - rtl() for Arabic labels and content
 */

import {
  initPdf,
  generatePDFBlob,
  downloadBlob,
  blobToDataUrl,
  createCompanyHeader,
  createSeparator,
  formatCurrency,
  formatArabicDate,
  toArabicNumerals,
  ltr,
  DEFAULT_COMPANY_INFO,
  ARABIC_FONT_NAME,
  type PDFContent,
} from '../core';

// ============================================
// CONTRACT TYPES
// ============================================

export interface ContractParty {
  name: string;
  nameAr?: string;
  title?: string;
  idNumber?: string;
  crNumber?: string;
  vatNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  representedBy?: string;
}

export interface ContractClause {
  title: string;
  content: string;
  subClauses?: string[];
}

export interface ContractPricing {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  paymentTerms?: string;
  paymentSchedule?: { description: string; amount: number; dueDate?: string }[];
}

export interface ContractSignatureStatus {
  firstPartySigned: boolean;
  secondPartySigned: boolean;
  firstPartySignedAt?: string;
  secondPartySignedAt?: string;
  firstPartySignerName?: string;
  secondPartySignerName?: string;
  firstPartySignerIp?: string;
  secondPartySignerIp?: string;
}

export interface ContractData {
  contractNumber: string;
  contractType: string;
  version?: string;
  date: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  
  firstParty: ContractParty;
  secondParty: ContractParty;
  
  preamble?: string;
  scopeSummary?: string;
  scopeSummaryAr?: string;
  deliverables?: string[];
  timeline?: { phase: string; duration: string; description?: string }[];
  clauses: ContractClause[];
  
  pricing?: ContractPricing;
  
  signatureStatus?: ContractSignatureStatus;
  
  witnesses?: { name: string; idNumber?: string }[];
}

// ============================================
// DEFAULT CLAUSES - COMPREHENSIVE
// ============================================

export const defaultContractClauses: ContractClause[] = [
  {
    title: 'موضوع العقد',
    content: 'يتعهد الطرف الأول بتقديم الخدمات المتفق عليها للطرف الثاني وفقاً للمواصفات والمعايير المهنية المعتمدة، والموضحة تفصيلاً في نطاق العمل المرفق بهذا العقد.',
  },
  {
    title: 'مدة العقد',
    content: 'يسري هذا العقد من تاريخ التوقيع ويستمر حتى إتمام الخدمات المتفق عليها، ما لم يتم إنهاؤه وفقاً لأحكام هذا العقد. ويجوز تمديد العقد باتفاق كتابي بين الطرفين.',
  },
  {
    title: 'التزامات الطرف الأول (مقدم الخدمة)',
    content: 'يلتزم الطرف الأول بما يلي:',
    subClauses: [
      'تقديم الخدمات بجودة عالية وفقاً لأفضل الممارسات المهنية والمعايير المعتمدة',
      'الالتزام بالجداول الزمنية المتفق عليها وإبلاغ الطرف الثاني بأي تأخير متوقع',
      'تخصيص الكوادر المؤهلة والمتخصصة لتنفيذ الخدمات',
      'تقديم تقارير دورية عن سير العمل والتقدم المحرز',
      'الحفاظ على سرية جميع المعلومات والبيانات التي يطلع عليها',
    ],
  },
  {
    title: 'التزامات الطرف الثاني (العميل)',
    content: 'يلتزم الطرف الثاني بما يلي:',
    subClauses: [
      'سداد المستحقات المالية في مواعيدها المحددة دون تأخير',
      'توفير جميع المعلومات والبيانات والمستندات اللازمة لتنفيذ العمل',
      'تسهيل مهمة فريق العمل وتوفير الدعم والتنسيق اللازم',
      'الرد على الاستفسارات واعتماد المراحل في الوقت المناسب',
      'تعيين ممثل مخول للتواصل واتخاذ القرارات المتعلقة بالمشروع',
    ],
  },
  {
    title: 'المقابل المالي وشروط الدفع',
    content: 'يلتزم الطرف الثاني بسداد المقابل المالي المحدد في هذا العقد وفقاً لجدول الدفعات المتفق عليه. تضاف ضريبة القيمة المضافة بنسبة (15%) إلى جميع المبالغ المستحقة وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك في المملكة العربية السعودية.',
  },
  {
    title: 'السرية وحماية المعلومات',
    content: 'يتعهد الطرفان بالحفاظ على سرية جميع المعلومات والبيانات والوثائق التي يتم تبادلها أو الاطلاع عليها خلال فترة العقد وبعد انتهائه لمدة لا تقل عن خمس (5) سنوات. ولا يجوز الإفصاح عنها لأي طرف ثالث دون موافقة كتابية مسبقة من الطرف الآخر.',
  },
  {
    title: 'حقوق الملكية الفكرية',
    content: 'تنتقل حقوق الملكية الفكرية للمخرجات النهائية إلى الطرف الثاني بعد سداد كامل المستحقات المالية. ويحتفظ الطرف الأول بحقوق الملكية الفكرية للأدوات والمنهجيات المستخدمة في تقديم الخدمات.',
  },
  {
    title: 'إنهاء العقد وفسخه',
    content: 'يجوز لأي من الطرفين إنهاء هذا العقد بموجب إشعار كتابي قبل ثلاثين (30) يوماً من تاريخ الإنهاء المقترح، على أن يتم تسوية جميع الالتزامات المالية المستحقة حتى تاريخ الإنهاء. كما يحق لأي طرف فسخ العقد فوراً في حالة إخلال الطرف الآخر بالتزاماته الجوهرية.',
  },
  {
    title: 'تسوية النزاعات',
    content: 'في حالة نشوء أي خلاف أو نزاع بين الطرفين حول تفسير أو تنفيذ أي من أحكام هذا العقد، يسعى الطرفان لحله ودياً خلال ثلاثين (30) يوماً. وفي حالة عدم التوصل إلى حل ودي، يحال النزاع إلى التحكيم وفقاً لنظام التحكيم السعودي، ويكون مقر التحكيم في مدينة الرياض.',
  },
  {
    title: 'القانون الواجب التطبيق',
    content: 'يخضع هذا العقد وتفسيره لأنظمة ولوائح المملكة العربية السعودية، وتختص المحاكم السعودية بالفصل في أي نزاع ينشأ عنه.',
  },
  {
    title: 'أحكام عامة',
    content: 'يمثل هذا العقد الاتفاق الكامل بين الطرفين فيما يخص موضوعه، ويلغي أي اتفاقات أو تفاهمات سابقة شفهية أو كتابية. ولا يجوز تعديل هذا العقد إلا بموجب ملحق كتابي موقع من الطرفين.',
  },
];

// ============================================
// PARTY BLOCK BUILDER (ENHANCED)
// ============================================

function buildPartyBlock(party: ContractParty, label: string, isCompany: boolean = false): PDFContent {
  const stack: PDFContent[] = [
    {
      text: label,
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#0369a1',
      alignment: 'center',
      margin: [0, 0, 0, 12],
    },
    {
      text: party.nameAr || party.name,
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#0f172a',
      alignment: 'center',
      margin: [0, 0, 0, 8],
    },
  ];

  if (party.title) {
    stack.push({
      text: party.title,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#64748b',
      alignment: 'center',
      margin: [0, 0, 0, 8],
    });
  }

  // Company-specific fields
  if (isCompany && party.crNumber) {
    stack.push({
      text: `السجل التجاري: ${ltr(party.crNumber)}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.vatNumber) {
    stack.push({
      text: `الرقم الضريبي: ${ltr(party.vatNumber)}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.idNumber && !isCompany) {
    stack.push({
      text: `رقم الهوية: ${ltr(party.idNumber)}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.address) {
    stack.push({
      text: `العنوان: ${party.address}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.phone) {
    stack.push({
      text: `الهاتف: ${ltr(party.phone)}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.email) {
    stack.push({
      text: `البريد الإلكتروني: ${ltr(party.email)}`,
      font: ARABIC_FONT_NAME,
      fontSize: 9,
      color: '#64748b',
      alignment: 'center',
      margin: [0, 0, 0, 3],
    });
  }

  if (party.representedBy) {
    stack.push({
      text: `ممثلاً بـ: ${party.representedBy}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      italics: true,
      color: '#0369a1',
      alignment: 'center',
      margin: [0, 8, 0, 0],
    });
  }

  return {
    table: {
      widths: ['*'],
      body: [[{
        stack,
        margin: [15, 18, 15, 18],
      }]],
    },
    layout: {
      fillColor: () => '#f8fafc',
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
  };
}

// ============================================
// SIGNATURE PAGE BUILDER
// ============================================

function buildSignaturePage(
  firstParty: ContractParty,
  secondParty: ContractParty,
  signatureStatus?: ContractSignatureStatus
): PDFContent {
  const buildSignatureColumn = (
    party: ContractParty,
    label: string,
    isSigned: boolean,
    signedAt?: string,
    signerName?: string
  ): PDFContent => {
    const stack: PDFContent[] = [
      {
        text: label,
        font: ARABIC_FONT_NAME,
        fontSize: 14,
        bold: true,
        color: '#0f172a',
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      {
        text: party.nameAr || party.name,
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        color: '#334155',
        alignment: 'center',
        margin: [0, 0, 0, 5],
      },
    ];

    if (party.representedBy) {
      stack.push({
        text: party.representedBy,
        font: ARABIC_FONT_NAME,
        fontSize: 10,
        color: '#64748b',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      });
    } else {
      stack.push({ text: '', margin: [0, 0, 0, 15] } as PDFContent);
    }

    // Signature status indicator
    if (isSigned) {
      stack.push({
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              {
                text: '✓ تم التوقيع إلكترونياً',
                font: ARABIC_FONT_NAME,
                fontSize: 11,
                bold: true,
                color: '#15803d',
                alignment: 'center',
                margin: [0, 0, 0, 5],
              },
              ...(signerName ? [{
                text: `الموقع: ${signerName}`,
                font: ARABIC_FONT_NAME,
                fontSize: 9,
                color: '#166534',
                alignment: 'center' as const,
                margin: [0, 0, 0, 3],
              }] : []),
              ...(signedAt ? [{
                text: `تاريخ التوقيع: ${formatArabicDate(signedAt, 'full')}`,
                font: ARABIC_FONT_NAME,
                fontSize: 9,
                color: '#166534',
                alignment: 'center' as const,
              }] : []),
            ],
            margin: [10, 10, 10, 10],
          }]],
        },
        layout: {
          fillColor: () => '#f0fdf4',
          hLineColor: () => '#86efac',
          vLineColor: () => '#86efac',
        },
        margin: [0, 0, 0, 15],
      });
    } else {
      stack.push({
        text: 'التوقيع:',
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        color: '#475569',
        alignment: 'center',
        margin: [0, 0, 0, 5],
      });
      stack.push({
        text: '___________________________',
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        color: '#94a3b8',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      });
    }

    // Date field
    stack.push({
      text: 'التاريخ:',
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 5],
    });
    stack.push({
      text: '___________________________',
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#94a3b8',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    });

    // Seal placeholder
    stack.push({
      text: 'الختم:',
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#475569',
      alignment: 'center',
      margin: [0, 0, 0, 5],
    });
    stack.push({
      table: {
        widths: [80],
        heights: [80],
        body: [[{
          text: '',
          margin: [0, 0, 0, 0],
        }]],
      },
      layout: {
        hLineColor: () => '#cbd5e1',
        vLineColor: () => '#cbd5e1',
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineStyle: () => ({ dash: { length: 5, space: 3 } }),
        vLineStyle: () => ({ dash: { length: 5, space: 3 } }),
      },
      alignment: 'center',
      margin: [25, 0, 25, 0],
    });

    return { stack, width: '48%' };
  };

  return {
    stack: [
      // Page break before signature page
      { text: '', pageBreak: 'before' },
      
      // Title
      {
        text: 'صفحة التوقيعات',
        font: ARABIC_FONT_NAME,
        fontSize: 20,
        bold: true,
        color: '#0f172a',
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      
      createSeparator('#0369a1'),
      
      // Signature confirmation text
      {
        text: 'بتوقيع هذا العقد، يقر الطرفان بموافقتهما على جميع الشروط والأحكام الواردة فيه، ويلتزمان بتنفيذها بحسن نية.',
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        color: '#475569',
        alignment: 'center',
        lineHeight: 1.6,
        margin: [40, 0, 40, 30],
      },
      
      // Two-column signature blocks
      {
        columns: [
          // Second Party (visually left in RTL)
          buildSignatureColumn(
            secondParty,
            'الطرف الثاني (العميل)',
            signatureStatus?.secondPartySigned || false,
            signatureStatus?.secondPartySignedAt,
            signatureStatus?.secondPartySignerName
          ),
          { width: '4%', text: '' },
          // First Party (visually right in RTL)
          buildSignatureColumn(
            firstParty,
            'الطرف الأول (مقدم الخدمة)',
            signatureStatus?.firstPartySigned || false,
            signatureStatus?.firstPartySignedAt,
            signatureStatus?.firstPartySignerName
          ),
        ],
        margin: [0, 0, 0, 30],
      },
      
      // Legal footer
      {
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              {
                text: 'إقرار',
                font: ARABIC_FONT_NAME,
                fontSize: 12,
                bold: true,
                color: '#1e293b',
                alignment: 'center',
                margin: [0, 0, 0, 8],
              },
              {
                text: 'تم تحرير هذا العقد من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها، وفي حالة التوقيع الإلكتروني تعتبر النسخة الإلكترونية الأصلية هي المرجع.',
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                color: '#64748b',
                alignment: 'center',
                lineHeight: 1.5,
              },
            ],
            margin: [20, 15, 20, 15],
          }]],
        },
        layout: {
          fillColor: () => '#f1f5f9',
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
        },
        margin: [0, 20, 0, 0],
      },
    ],
  };
}

// ============================================
// CONTRACT CONTENT GENERATOR
// ============================================

export function generateContractContent(
  contract: ContractData
): PDFContent[] {
  const content: PDFContent[] = [];

  // === CONTRACT HEADER ===
  content.push({
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          {
            text: 'بسم الله الرحمن الرحيم',
            font: ARABIC_FONT_NAME,
            fontSize: 14,
            color: '#0369a1',
            alignment: 'center',
            margin: [0, 0, 0, 15],
          },
          {
            text: contract.contractType || 'عقد تقديم خدمات',
            font: ARABIC_FONT_NAME,
            fontSize: 26,
            bold: true,
            alignment: 'center',
            color: '#0f172a',
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                width: '*',
                text: `الإصدار: ${ltr(contract.version || '1.0')}`,
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                color: '#64748b',
                alignment: 'center',
              },
              {
                width: '*',
                text: `رقم العقد: ${ltr(contract.contractNumber)}`,
                font: ARABIC_FONT_NAME,
                fontSize: 11,
                bold: true,
                color: '#334155',
                alignment: 'center',
              },
              {
                width: '*',
                text: `التاريخ: ${formatArabicDate(contract.date, 'short')}`,
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                color: '#64748b',
                alignment: 'center',
              },
            ],
          },
        ],
        margin: [20, 20, 20, 20],
      }]],
    },
    layout: {
      fillColor: () => '#f8fafc',
      hLineColor: () => '#0369a1',
      vLineColor: () => '#0369a1',
      hLineWidth: () => 2,
      vLineWidth: () => 2,
    },
    margin: [0, 0, 0, 25],
  });

  // === PARTIES SECTION ===
  content.push({
    text: 'أطراف العقد',
    font: ARABIC_FONT_NAME,
    fontSize: 16,
    bold: true,
    color: '#0f172a',
    margin: [0, 0, 0, 15],
  });

  content.push({
    columns: [
      // Second Party (visually left in RTL)
      {
        width: '48%',
        ...buildPartyBlock(contract.secondParty, 'الطرف الثاني (العميل)', false) as Record<string, unknown>,
      },
      { width: '4%', text: '' },
      // First Party (visually right in RTL)
      {
        width: '48%',
        ...buildPartyBlock(contract.firstParty, 'الطرف الأول (مقدم الخدمة)', true) as Record<string, unknown>,
      },
    ],
    margin: [0, 0, 0, 25],
  });

  // === CONTRACT DURATION ===
  if (contract.startDate || contract.endDate) {
    content.push({
      table: {
        widths: ['*', '*'],
        body: [[
          {
            text: contract.endDate 
              ? `تاريخ الانتهاء: ${formatArabicDate(contract.endDate, 'short')}` 
              : 'مفتوح المدة',
            font: ARABIC_FONT_NAME,
            fontSize: 11,
            alignment: 'center',
            margin: [10, 12, 10, 12],
          },
          {
            text: contract.startDate 
              ? `تاريخ البداية: ${formatArabicDate(contract.startDate, 'short')}` 
              : `من تاريخ التوقيع`,
            font: ARABIC_FONT_NAME,
            fontSize: 11,
            alignment: 'center',
            margin: [10, 12, 10, 12],
          },
        ]],
      },
      layout: {
        fillColor: () => '#eff6ff',
        hLineColor: () => '#bfdbfe',
        vLineColor: () => '#bfdbfe',
      },
      margin: [0, 0, 0, 25],
    });
  }

  // === PREAMBLE ===
  content.push({
    text: 'تمهيد',
    font: ARABIC_FONT_NAME,
    fontSize: 14,
    bold: true,
    color: '#1e293b',
    margin: [0, 0, 0, 10],
  });

  content.push({
    text: contract.preamble || 'حيث أن الطرف الأول شركة متخصصة في تقديم الخدمات المهنية، وحيث أن الطرف الثاني يرغب في الاستفادة من خدمات الطرف الأول، فقد اتفق الطرفان على إبرام هذا العقد وفقاً للشروط والأحكام التالية.',
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.8,
    alignment: 'right',
    margin: [0, 0, 0, 25],
  });

  // === SCOPE SUMMARY ===
  if (contract.scopeSummaryAr || contract.scopeSummary) {
    content.push({
      text: 'نطاق العمل',
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 0, 0, 10],
    });

    content.push({
      table: {
        widths: ['*'],
        body: [[{
          text: contract.scopeSummaryAr || contract.scopeSummary,
          font: ARABIC_FONT_NAME,
          fontSize: 11,
          color: '#334155',
          lineHeight: 1.7,
          margin: [15, 15, 15, 15],
        }]],
      },
      layout: {
        fillColor: () => '#fefce8',
        hLineColor: () => '#fef08a',
        vLineColor: () => '#fef08a',
      },
      margin: [0, 0, 0, 20],
    });
  }

  // === DELIVERABLES ===
  if (contract.deliverables && contract.deliverables.length > 0) {
    content.push({
      text: 'المخرجات والتسليمات',
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 10, 0, 10],
    });

    contract.deliverables.forEach((deliverable, index) => {
      content.push({
        text: `${toArabicNumerals(index + 1)}. ${deliverable}`,
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        color: '#334155',
        lineHeight: 1.6,
        margin: [20, 3, 0, 3],
      });
    });

    content.push({ text: '', margin: [0, 0, 0, 15] } as PDFContent);
  }

  // === TIMELINE ===
  if (contract.timeline && contract.timeline.length > 0) {
    content.push({
      text: 'الجدول الزمني',
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 10, 0, 10],
    });

    const timelineHeaders = ['الوصف', 'المدة', 'المرحلة'];
    const timelineRows = contract.timeline.map((phase, index) => [
      phase.description || '-',
      phase.duration,
      `المرحلة ${toArabicNumerals(index + 1)}: ${phase.phase}`,
    ]);

    content.push({
      table: {
        headerRows: 1,
        widths: ['*', 80, 120],
        body: [
          timelineHeaders.map(h => ({
            text: h,
            font: ARABIC_FONT_NAME,
            fontSize: 11,
            bold: true,
            fillColor: '#f1f5f9',
            alignment: 'right' as const,
            margin: [8, 10, 8, 10],
          })),
          ...timelineRows.map(row => row.map(cell => ({
            text: cell,
            font: ARABIC_FONT_NAME,
            fontSize: 10,
            alignment: 'right' as const,
            margin: [8, 8, 8, 8],
          }))),
        ],
      },
      layout: {
        hLineColor: () => '#e2e8f0',
        vLineColor: () => '#e2e8f0',
      },
      margin: [0, 0, 0, 25],
    });
  }

  // === CONTRACT CLAUSES ===
  content.push({
    text: 'بنود العقد',
    font: ARABIC_FONT_NAME,
    fontSize: 18,
    bold: true,
    color: '#0f172a',
    margin: [0, 15, 0, 20],
  });

  const clauses = contract.clauses.length > 0 ? contract.clauses : defaultContractClauses;

  clauses.forEach((clause, index) => {
    const clauseNum = toArabicNumerals(index + 1);

    // Clause header with number
    content.push({
      table: {
        widths: ['*', 'auto'],
        body: [[
          {
            text: clause.title,
            font: ARABIC_FONT_NAME,
            fontSize: 13,
            bold: true,
            color: '#1e293b',
            margin: [0, 8, 10, 8],
          },
          {
            text: `البند ${clauseNum}`,
            font: ARABIC_FONT_NAME,
            fontSize: 12,
            bold: true,
            color: '#ffffff',
            fillColor: '#0369a1',
            alignment: 'center' as const,
            margin: [15, 8, 15, 8],
          },
        ]],
      },
      layout: 'noBorders',
      margin: [0, 15, 0, 8],
    });

    // Clause content
    content.push({
      text: clause.content,
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#334155',
      lineHeight: 1.8,
      margin: [25, 0, 0, 5],
    });

    // Sub-clauses
    if (clause.subClauses && clause.subClauses.length > 0) {
      clause.subClauses.forEach((sub, subIndex) => {
        const subNum = toArabicNumerals(subIndex + 1);
        content.push({
          text: `${clauseNum}-${subNum}  ${sub}`,
          font: ARABIC_FONT_NAME,
          fontSize: 11,
          color: '#475569',
          lineHeight: 1.7,
          margin: [45, 4, 0, 4],
        });
      });
    }
  });

  // === PRICING SECTION ===
  if (contract.pricing) {
    content.push({
      stack: [
        createSeparator('#e2e8f0'),
        {
          text: 'قيمة العقد وشروط الدفع',
          font: ARABIC_FONT_NAME,
          fontSize: 16,
          bold: true,
          color: '#0f172a',
          margin: [0, 15, 0, 15],
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: 'إجمالي قيمة العقد',
                  font: ARABIC_FONT_NAME,
                  fontSize: 12,
                  color: '#64748b',
                  alignment: 'center',
                  margin: [0, 0, 0, 5],
                },
                {
                  text: formatCurrency(contract.pricing.total, contract.pricing.currency),
                  font: ARABIC_FONT_NAME,
                  fontSize: 28,
                  bold: true,
                  color: '#0369a1',
                  alignment: 'center',
                  margin: [0, 0, 0, 15],
                },
                {
                  columns: [
                    {
                      width: '50%',
                      stack: [
                        {
                          text: 'ضريبة القيمة المضافة',
                          font: ARABIC_FONT_NAME,
                          fontSize: 10,
                          color: '#64748b',
                          alignment: 'center',
                        },
                        {
                          text: `${formatCurrency(contract.pricing.vatAmount, contract.pricing.currency)} (${ltr(contract.pricing.vatRate)}%)`,
                          font: ARABIC_FONT_NAME,
                          fontSize: 12,
                          bold: true,
                          color: '#334155',
                          alignment: 'center',
                        },
                      ],
                    },
                    {
                      width: '50%',
                      stack: [
                        {
                          text: 'المبلغ قبل الضريبة',
                          font: ARABIC_FONT_NAME,
                          fontSize: 10,
                          color: '#64748b',
                          alignment: 'center',
                        },
                        {
                          text: formatCurrency(contract.pricing.subtotal, contract.pricing.currency),
                          font: ARABIC_FONT_NAME,
                          fontSize: 12,
                          bold: true,
                          color: '#334155',
                          alignment: 'center',
                        },
                      ],
                    },
                  ],
                  margin: [0, 0, 0, 15],
                },
                ...(contract.pricing.paymentTerms ? [{
                  text: `شروط الدفع: ${contract.pricing.paymentTerms}`,
                  font: ARABIC_FONT_NAME,
                  fontSize: 10,
                  color: '#475569',
                  alignment: 'center' as const,
                  margin: [0, 5, 0, 0],
                }] : []),
              ],
              margin: [25, 20, 25, 20],
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
            hLineWidth: () => 2,
            vLineWidth: () => 2,
          },
        },
      ],
      margin: [0, 25, 0, 25],
    });

    // Payment schedule
    if (contract.pricing.paymentSchedule && contract.pricing.paymentSchedule.length > 0) {
      content.push({
        text: 'جدول الدفعات',
        font: ARABIC_FONT_NAME,
        fontSize: 14,
        bold: true,
        color: '#1e293b',
        margin: [0, 10, 0, 10],
      });

      const scheduleHeaders = ['الاستحقاق', 'المبلغ', 'الوصف'];
      const scheduleRows = contract.pricing.paymentSchedule.map(p => [
        p.dueDate ? formatArabicDate(p.dueDate, 'short') : 'حسب الاتفاق',
        formatCurrency(p.amount, contract.pricing!.currency),
        p.description,
      ]);

      content.push({
        table: {
          headerRows: 1,
          widths: [80, 100, '*'],
          body: [
            scheduleHeaders.map(h => ({
              text: h,
              font: ARABIC_FONT_NAME,
              fontSize: 11,
              bold: true,
              fillColor: '#f1f5f9',
              alignment: 'right' as const,
              margin: [8, 10, 8, 10],
            })),
            ...scheduleRows.map(row => row.map((cell, i) => ({
              text: cell,
              font: ARABIC_FONT_NAME,
              fontSize: 10,
              alignment: i === 1 ? 'left' as const : 'right' as const,
              margin: [8, 8, 8, 8],
            }))),
          ],
        },
        layout: {
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
        },
        margin: [0, 0, 0, 25],
      });
    }
  }

  // === WITNESSES ===
  if (contract.witnesses && contract.witnesses.length > 0) {
    content.push({
      stack: [
        createSeparator('#e2e8f0'),
        {
          text: 'الشهود',
          font: ARABIC_FONT_NAME,
          fontSize: 14,
          bold: true,
          color: '#1e293b',
          alignment: 'center',
          margin: [0, 15, 0, 20],
        },
        {
          columns: contract.witnesses.map((witness, index) => ({
            width: `${100 / contract.witnesses!.length}%`,
            stack: [
              {
                text: `الشاهد ${toArabicNumerals(index + 1)}`,
                font: ARABIC_FONT_NAME,
                fontSize: 12,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10],
              },
              {
                text: `الاسم: ${witness.name}`,
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                alignment: 'center',
                margin: [0, 0, 0, 5],
              },
              ...(witness.idNumber ? [{
                text: `رقم الهوية: ${ltr(witness.idNumber)}`,
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                alignment: 'center' as const,
                margin: [0, 0, 0, 5],
              }] : []),
              {
                text: 'التوقيع: _______________',
                font: ARABIC_FONT_NAME,
                fontSize: 10,
                alignment: 'center',
                margin: [0, 15, 0, 0],
              },
            ],
          })),
        },
      ],
      margin: [0, 20, 0, 0],
    });
  }

  // === SIGNATURE PAGE ===
  content.push(
    buildSignaturePage(
      contract.firstParty,
      contract.secondParty,
      contract.signatureStatus
    )
  );

  return content;
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export interface CreateContractPDFOptions {
  filename?: string;
  download?: boolean;
}

export async function createContractPDF(
  contract: ContractData,
  options: CreateContractPDFOptions = {}
): Promise<{ blob?: Blob; dataUrl?: string }> {
  // Initialize PDF system (throws if Cairo not loaded)
  await initPdf();

  const content = generateContractContent(contract);

  const blob = await generatePDFBlob(content, {
    title: `${contract.contractType || 'عقد'} - ${contract.contractNumber}`,
    subject: 'عقد تقديم خدمات',
  });

  if (options.download) {
    const filename = options.filename || `contract-${contract.contractNumber}.pdf`;
    downloadBlob(blob, filename);
    return { blob };
  }

  const dataUrl = await blobToDataUrl(blob);
  return { blob, dataUrl };
}

// ============================================
// SAMPLE CONTRACTS FOR TESTING
// ============================================

export const sampleContractShort: ContractData = {
  contractNumber: 'CTR-202602-000001',
  contractType: 'عقد تقديم خدمات',
  version: '1.0',
  date: new Date(),
  
  firstParty: {
    name: 'Al-Saleh Holding Company',
    nameAr: 'شركة الصالح القابضة',
    title: 'مقدم الخدمة',
    crNumber: '1010000000',
    vatNumber: '300000000000003',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966 11 000 0000',
    email: 'info@alsaleh.com',
    representedBy: 'محمد عبدالله الصالح',
  },
  
  secondParty: {
    name: 'أحمد محمد العلي',
    nameAr: 'أحمد محمد العلي',
    title: 'العميل',
    idNumber: '1000000000',
    phone: '+966 50 000 0000',
    email: 'ahmed@example.com',
  },
  
  scopeSummaryAr: 'تقديم خدمات استشارية متخصصة في مجال تطوير الأعمال والتخطيط الاستراتيجي.',
  
  clauses: defaultContractClauses.slice(0, 5),
  
  pricing: {
    subtotal: 10000,
    vatRate: 15,
    vatAmount: 1500,
    total: 11500,
    currency: 'SAR',
    paymentTerms: 'السداد عند التوقيع',
  },
};

export const sampleContractLong: ContractData = {
  contractNumber: 'CTR-202602-000002',
  contractType: 'عقد تقديم خدمات استشارية شاملة',
  version: '2.1',
  date: new Date(),
  startDate: new Date(),
  endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
  
  firstParty: {
    name: 'Al-Saleh Holding Company',
    nameAr: 'شركة الصالح القابضة',
    title: 'مقدم الخدمة',
    crNumber: '1010000000',
    vatNumber: '300000000000003',
    address: 'طريق الملك فهد، برج الفيصلية، الرياض 11432',
    phone: '+966 11 000 0000',
    email: 'contracts@alsaleh.com',
    representedBy: 'عبدالرحمن سعود الصالح - المدير التنفيذي',
  },
  
  secondParty: {
    name: 'مؤسسة النور للتجارة',
    nameAr: 'مؤسسة النور للتجارة',
    title: 'العميل',
    crNumber: '1010999999',
    vatNumber: '310000000000007',
    address: 'جدة، حي الروضة',
    phone: '+966 12 000 0000',
    email: 'info@alnoor-trading.com',
    representedBy: 'خالد عبدالعزيز النور - المالك',
  },
  
  preamble: 'حيث أن الطرف الأول (شركة الصالح القابضة) شركة رائدة في مجال الخدمات الاستشارية والتطوير المؤسسي، وحيث أن الطرف الثاني (مؤسسة النور للتجارة) يرغب في الاستفادة من الخبرات المتراكمة لدى الطرف الأول في مجال تطوير الأعمال والتخطيط الاستراتيجي، فقد اتفق الطرفان وهما بكامل أهليتهما المعتبرة شرعاً ونظاماً على إبرام هذا العقد وفقاً للشروط والأحكام التالية.',
  
  scopeSummaryAr: 'تقديم خدمات استشارية شاملة تشمل: دراسة وتحليل الوضع الراهن للمؤسسة، إعداد خطة استراتيجية خمسية، تطوير الهيكل التنظيمي، تحسين العمليات التشغيلية، بناء القدرات وتدريب الكوادر البشرية، وإعداد دراسات الجدوى للمشاريع المستقبلية.',
  
  deliverables: [
    'تقرير تحليل الوضع الراهن (Gap Analysis)',
    'الخطة الاستراتيجية الخمسية مع مؤشرات الأداء',
    'الهيكل التنظيمي المقترح مع الوصف الوظيفي',
    'دليل السياسات والإجراءات المحدث',
    'برنامج تدريبي متكامل للكوادر القيادية',
    'دراسة جدوى لثلاثة مشاريع توسعية',
    'تقرير المتابعة والتقييم الربع سنوي',
  ],
  
  timeline: [
    { phase: 'التحليل والتقييم', duration: '4 أسابيع', description: 'جمع البيانات وتحليل الوضع الراهن' },
    { phase: 'التخطيط الاستراتيجي', duration: '6 أسابيع', description: 'إعداد الخطة الاستراتيجية' },
    { phase: 'تطوير الهيكل', duration: '3 أسابيع', description: 'إعادة هيكلة التنظيم' },
    { phase: 'التنفيذ والتدريب', duration: '8 أسابيع', description: 'تطبيق التغييرات وتدريب الفريق' },
    { phase: 'المتابعة والتقييم', duration: '3 أسابيع', description: 'مراجعة النتائج والتوصيات' },
  ],
  
  clauses: defaultContractClauses,
  
  pricing: {
    subtotal: 150000,
    vatRate: 15,
    vatAmount: 22500,
    total: 172500,
    currency: 'SAR',
    paymentTerms: 'وفقاً لجدول الدفعات أدناه',
    paymentSchedule: [
      { description: 'دفعة مقدمة عند التوقيع', amount: 34500, dueDate: new Date().toISOString() },
      { description: 'بعد إنجاز مرحلة التحليل', amount: 34500 },
      { description: 'بعد إنجاز مرحلة التخطيط', amount: 51750 },
      { description: 'بعد التسليم النهائي', amount: 51750 },
    ],
  },
  
  signatureStatus: {
    firstPartySigned: true,
    secondPartySigned: false,
    firstPartySignedAt: new Date().toISOString(),
    firstPartySignerName: 'عبدالرحمن سعود الصالح',
  },
  
  witnesses: [
    { name: 'فهد سعيد القحطاني', idNumber: '1050000000' },
    { name: 'سلطان ناصر العتيبي', idNumber: '1060000000' },
  ],
};

// ============================================
// UTILITY: Database Contract to ContractData
// ============================================

export function dbContractToContractData(
  dbContract: {
    contract_number: string;
    created_at: string;
    scope_summary?: string | null;
    scope_summary_ar?: string | null;
    signed_at?: string | null;
    pricing_json?: {
      subtotal?: number;
      vat_rate?: number;
      vat_amount?: number;
      total?: number;
      currency?: string;
    } | null;
    service?: {
      name?: string;
      name_ar?: string | null;
      description?: string | null;
      description_ar?: string | null;
    } | null;
  },
  customer: {
    full_name?: string | null;
    full_name_ar?: string | null;
    email: string;
    phone?: string | null;
    national_id?: string | null;
  },
  company: ContractParty = {
    name: DEFAULT_COMPANY_INFO.nameEn || DEFAULT_COMPANY_INFO.nameAr,
    nameAr: DEFAULT_COMPANY_INFO.nameAr,
    title: 'مقدم الخدمة',
    crNumber: DEFAULT_COMPANY_INFO.crNumber,
    vatNumber: DEFAULT_COMPANY_INFO.vatNumber,
    address: DEFAULT_COMPANY_INFO.addressAr,
    phone: DEFAULT_COMPANY_INFO.phone,
    email: DEFAULT_COMPANY_INFO.email,
  },
  signatureStatus?: ContractSignatureStatus
): ContractData {
  const pricing = dbContract.pricing_json;

  return {
    contractNumber: dbContract.contract_number,
    contractType: 'عقد تقديم خدمات',
    version: '1.0',
    date: new Date(dbContract.created_at),

    firstParty: company,

    secondParty: {
      name: customer.full_name || customer.email,
      nameAr: customer.full_name_ar || customer.full_name || customer.email,
      title: 'العميل',
      idNumber: customer.national_id || undefined,
      phone: customer.phone || undefined,
      email: customer.email,
    },

    preamble: 'حيث أن الطرف الأول شركة متخصصة في تقديم الخدمات المهنية، وحيث أن الطرف الثاني يرغب في الاستفادة من خدمات الطرف الأول، فقد اتفق الطرفان على إبرام هذا العقد وفقاً للشروط والأحكام التالية.',

    scopeSummary: dbContract.scope_summary || dbContract.service?.description || undefined,
    scopeSummaryAr: dbContract.scope_summary_ar || dbContract.service?.description_ar || dbContract.service?.name_ar || undefined,

    clauses: defaultContractClauses,

    pricing: pricing ? {
      subtotal: pricing.subtotal || 0,
      vatRate: pricing.vat_rate || 15,
      vatAmount: pricing.vat_amount || 0,
      total: pricing.total || 0,
      currency: pricing.currency || 'SAR',
      paymentTerms: 'يتم السداد وفقاً للاتفاق المبرم بين الطرفين',
    } : undefined,
    
    signatureStatus,
  };
}
