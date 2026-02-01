/**
 * Arabic Corporate Contract Template
 * 
 * Professional RTL contract with:
 * - Full Arabic support with Cairo font
 * - Structured clauses (numbered ١،٢،٣)
 * - Parties section
 * - Payment terms with VAT
 * - Signature blocks
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
  createSignatureBlock,
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
}

export interface ContractData {
  contractNumber: string;
  contractType: string;
  date: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  
  firstParty: ContractParty;
  secondParty: ContractParty;
  
  preamble?: string;
  scopeSummary?: string;
  scopeSummaryAr?: string;
  clauses: ContractClause[];
  
  pricing?: ContractPricing;
  
  signatures?: {
    firstPartySigned?: boolean;
    secondPartySigned?: boolean;
    signedAt?: string;
  };
  
  witnesses?: { name: string; idNumber?: string }[];
}

// ============================================
// DEFAULT CLAUSES
// ============================================

export const defaultContractClauses: ContractClause[] = [
  {
    title: 'موضوع العقد',
    content: 'يتعهد الطرف الأول بتقديم الخدمات المتفق عليها للطرف الثاني وفقاً للمواصفات والمعايير المهنية المعتمدة.',
  },
  {
    title: 'مدة العقد',
    content: 'يسري هذا العقد من تاريخ التوقيع ويستمر حتى إتمام الخدمات المتفق عليها، ما لم يتم إنهاؤه وفقاً لأحكام هذا العقد.',
  },
  {
    title: 'التزامات الطرف الأول',
    content: 'يلتزم الطرف الأول بما يلي:',
    subClauses: [
      'تقديم الخدمات بجودة عالية وفقاً لأفضل الممارسات المهنية',
      'الالتزام بالجداول الزمنية المتفق عليها',
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
    content: 'يجوز لأي من الطرفين فسخ هذا العقد بموجب إشعار كتابي قبل ثلاثين (30) يوماً من تاريخ الفسخ المقترح، على أن يتم تسوية جميع الالتزامات المالية المستحقة.',
  },
  {
    title: 'تسوية النزاعات',
    content: 'في حالة نشوء أي خلاف أو نزاع بين الطرفين حول تفسير أو تنفيذ هذا العقد، يتم حله ودياً. وفي حالة عدم التوصل إلى حل، يتم اللجوء إلى التحكيم وفقاً لأنظمة المملكة العربية السعودية.',
  },
];

// ============================================
// PARTY BLOCK BUILDER
// ============================================

function buildPartyBlock(party: ContractParty, label: string): PDFContent {
  const stack: PDFContent[] = [
    {
      text: label,
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#0369a1',
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: party.nameAr || party.name,
      font: ARABIC_FONT_NAME,
      fontSize: 13,
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
      margin: [0, 0, 0, 5],
    });
  }

  if (party.idNumber) {
    stack.push({
      text: `رقم الهوية/السجل: ${ltr(party.idNumber)}`,
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

  if (party.representedBy) {
    stack.push({
      text: `ممثلاً بـ: ${party.representedBy}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      italics: true,
      color: '#64748b',
      alignment: 'center',
      margin: [0, 5, 0, 0],
    });
  }

  return {
    table: {
      widths: ['*'],
      body: [[{
        stack,
        margin: [15, 15, 15, 15],
      }]],
    },
    layout: {
      fillColor: () => '#f8fafc',
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
    },
  };
}

// ============================================
// CONTRACT CONTENT GENERATOR
// ============================================

export function generateContractContent(
  contract: ContractData
): PDFContent[] {
  const content: PDFContent[] = [];

  // === CONTRACT TITLE ===
  content.push({
    text: contract.contractType || 'عقد تقديم خدمات',
    font: ARABIC_FONT_NAME,
    fontSize: 28,
    bold: true,
    alignment: 'center',
    color: '#0f172a',
    margin: [0, 0, 0, 10],
  });

  // === CONTRACT NUMBER & DATE ===
  content.push({
    text: `رقم العقد: ${ltr(contract.contractNumber)}`,
    font: ARABIC_FONT_NAME,
    fontSize: 12,
    alignment: 'center',
    color: '#334155',
    margin: [0, 0, 0, 5],
  });

  content.push({
    text: `التاريخ: ${formatArabicDate(contract.date, 'full')}`,
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    alignment: 'center',
    color: '#64748b',
    margin: [0, 0, 0, 25],
  });

  // === SEPARATOR ===
  content.push(createSeparator('#0369a1'));

  // === PARTIES SECTION ===
  content.push({
    columns: [
      // Second Party (visually left in RTL)
      {
        width: '48%',
        ...buildPartyBlock(contract.secondParty, 'الطرف الثاني (العميل)') as Record<string, unknown>,
      },
      { width: '4%', text: '' },
      // First Party (visually right in RTL)
      {
        width: '48%',
        ...buildPartyBlock(contract.firstParty, 'الطرف الأول (مقدم الخدمة)') as Record<string, unknown>,
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
            text: contract.endDate ? `تاريخ الانتهاء: ${formatArabicDate(contract.endDate, 'short')}` : '',
            font: ARABIC_FONT_NAME,
            fontSize: 11,
            alignment: 'center',
            margin: [10, 12, 10, 12],
          },
          {
            text: contract.startDate ? `تاريخ البداية: ${formatArabicDate(contract.startDate, 'short')}` : '',
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
  if (contract.preamble) {
    content.push({
      text: 'تمهيد',
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      color: '#1e293b',
      margin: [0, 0, 0, 10],
    });

    content.push({
      text: contract.preamble,
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#334155',
      lineHeight: 1.7,
      alignment: 'right',
      margin: [0, 0, 0, 20],
    });
  }

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
          lineHeight: 1.6,
          margin: [15, 15, 15, 15],
        }]],
      },
      layout: {
        fillColor: () => '#fefce8',
        hLineColor: () => '#fef08a',
        vLineColor: () => '#fef08a',
      },
      margin: [0, 0, 0, 25],
    });
  }

  // === CONTRACT CLAUSES ===
  content.push({
    text: 'بنود العقد',
    font: ARABIC_FONT_NAME,
    fontSize: 16,
    bold: true,
    color: '#0f172a',
    margin: [0, 10, 0, 15],
  });

  const clauses = contract.clauses.length > 0 ? contract.clauses : defaultContractClauses;

  clauses.forEach((clause, index) => {
    const clauseNum = toArabicNumerals(index + 1);

    // Clause header
    content.push({
      columns: [
        {
          width: '*',
          text: clause.title,
          font: ARABIC_FONT_NAME,
          fontSize: 13,
          bold: true,
          color: '#1e293b',
        },
        {
          width: 40,
          text: `البند ${clauseNum}`,
          font: ARABIC_FONT_NAME,
          fontSize: 12,
          bold: true,
          color: '#0369a1',
          alignment: 'left',
        },
      ],
      margin: [0, 15, 0, 8],
    });

    // Clause content
    content.push({
      text: clause.content,
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      color: '#334155',
      lineHeight: 1.7,
      margin: [20, 0, 0, 0],
    });

    // Sub-clauses
    if (clause.subClauses && clause.subClauses.length > 0) {
      clause.subClauses.forEach((sub, subIndex) => {
        const subNum = toArabicNumerals(subIndex + 1);
        content.push({
          text: `${clauseNum}.${subNum} ${sub}`,
          font: ARABIC_FONT_NAME,
          fontSize: 11,
          color: '#475569',
          lineHeight: 1.6,
          margin: [40, 5, 0, 0],
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
          text: 'قيمة العقد',
          font: ARABIC_FONT_NAME,
          fontSize: 16,
          bold: true,
          color: '#0f172a',
          margin: [0, 10, 0, 15],
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: formatCurrency(contract.pricing.total, contract.pricing.currency),
                  font: ARABIC_FONT_NAME,
                  fontSize: 24,
                  bold: true,
                  color: '#0369a1',
                  alignment: 'center',
                  margin: [0, 10, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '50%',
                      text: `ضريبة القيمة المضافة (${contract.pricing.vatRate}%): ${formatCurrency(contract.pricing.vatAmount, contract.pricing.currency)}`,
                      font: ARABIC_FONT_NAME,
                      fontSize: 10,
                      color: '#64748b',
                      alignment: 'center',
                    },
                    {
                      width: '50%',
                      text: `المبلغ قبل الضريبة: ${formatCurrency(contract.pricing.subtotal, contract.pricing.currency)}`,
                      font: ARABIC_FONT_NAME,
                      fontSize: 10,
                      color: '#64748b',
                      alignment: 'center',
                    },
                  ],
                  margin: [0, 0, 0, 10],
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
              margin: [20, 15, 20, 15],
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
          },
        },
      ],
      margin: [0, 25, 0, 25],
    });
  }

  // === SIGNATURES SECTION ===
  content.push({
    stack: [
      createSeparator('#e2e8f0'),
      {
        text: 'التوقيعات',
        font: ARABIC_FONT_NAME,
        fontSize: 16,
        bold: true,
        color: '#0f172a',
        alignment: 'center',
        margin: [0, 10, 0, 20],
      },
      createSignatureBlock([
        {
          label: 'الطرف الثاني (العميل)',
          name: contract.secondParty.nameAr || contract.secondParty.name,
          title: contract.secondParty.representedBy,
        },
        {
          label: 'الطرف الأول (مقدم الخدمة)',
          name: contract.firstParty.nameAr || contract.firstParty.name,
          title: contract.firstParty.representedBy,
        },
      ]),
    ],
    margin: [0, 30, 0, 0],
  });

  // === WITNESSES ===
  if (contract.witnesses && contract.witnesses.length > 0) {
    content.push({
      stack: [
        {
          text: 'الشهود',
          font: ARABIC_FONT_NAME,
          fontSize: 14,
          bold: true,
          color: '#1e293b',
          alignment: 'center',
          margin: [0, 40, 0, 15],
        },
        {
          columns: contract.witnesses.map((witness, index) => ({
            width: `${100 / contract.witnesses!.length}%`,
            stack: [
              {
                text: `الشاهد ${toArabicNumerals(index + 1)}`,
                font: ARABIC_FONT_NAME,
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
                text: `رقم الهوية: ${witness.idNumber}`,
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
    });
  }

  // === FOOTER DISCLAIMER ===
  content.push({
    text: 'تم تحرير هذا العقد من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها',
    font: ARABIC_FONT_NAME,
    fontSize: 9,
    color: '#94a3b8',
    alignment: 'center',
    margin: [0, 40, 0, 0],
  });

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
    subject: 'عقد',
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
// UTILITY: Database Contract to ContractData
// ============================================

export function dbContractToContractData(
  dbContract: {
    contract_number: string;
    created_at: string;
    scope_summary?: string | null;
    scope_summary_ar?: string | null;
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
    address: DEFAULT_COMPANY_INFO.addressAr,
    phone: DEFAULT_COMPANY_INFO.phone,
    email: DEFAULT_COMPANY_INFO.email,
  }
): ContractData {
  const pricing = dbContract.pricing_json;

  return {
    contractNumber: dbContract.contract_number,
    contractType: 'عقد تقديم خدمات',
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

    preamble: 'حيث أن الطرف الأول شركة متخصصة في تقديم الخدمات، وحيث أن الطرف الثاني يرغب في الاستفادة من خدمات الطرف الأول، فقد اتفق الطرفان على إبرام هذا العقد وفقاً للشروط والأحكام التالية.',

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
  };
}
