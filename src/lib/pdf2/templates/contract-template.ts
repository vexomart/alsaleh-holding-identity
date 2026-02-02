/**
 * CONTRACT PDF TEMPLATE
 * 
 * Arabic RTL legal contract document
 */

import { 
  type DocDefinition,
  arabicDocumentStyles,
  rtl, 
  ltr, 
  formatCurrency,
  toArabicOrdinal,
  PDF_COLORS,
  PDF_SPACING,
} from '../core';

// Contract types
export interface ContractParty {
  name: string;
  nationalId?: string;
  address?: string;
  phone?: string;
  email?: string;
  role: 'provider' | 'customer';
}

export interface ContractClause {
  title: string;
  content: string;
}

export interface ContractData {
  contractNumber: string;
  date: string | Date;
  
  provider: ContractParty;
  customer: ContractParty;
  
  serviceName: string;
  serviceDescription?: string;
  
  amount: number;
  vatRate?: number;
  vatAmount?: number;
  totalAmount?: number;
  currency?: string;
  
  clauses: ContractClause[];
  
  status?: string;
  signedAt?: string | Date;
}

/**
 * Convert date to string
 */
function toDateStr(date: string | Date | undefined): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

/**
 * Build contract document definition
 */
export function buildContractDoc(data: ContractData): DocDefinition {
  const currency = data.currency || 'SAR';
  const vatRate = data.vatRate ?? 0.15;
  const vatAmount = data.vatAmount ?? (data.amount * vatRate);
  const totalAmount = data.totalAmount ?? (data.amount + vatAmount);
  
  const content: unknown[] = [
    // Title
    {
      text: rtl('عقد تقديم خدمات'),
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, PDF_SPACING[8]],
    },
    
    // Contract meta
    {
      table: {
        widths: ['*', 'auto'],
        body: [
          [
            { text: ltr(data.contractNumber), alignment: 'right' },
            { text: rtl('رقم العقد'), alignment: 'right', bold: true },
          ],
          [
            { text: rtl(toDateStr(data.date)), alignment: 'right' },
            { text: rtl('التاريخ'), alignment: 'right', bold: true },
          ],
          [
            { text: rtl(data.serviceName), alignment: 'right' },
            { text: rtl('الخدمة'), alignment: 'right', bold: true },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, PDF_SPACING[8]],
    },
    
    // Parties header
    { text: rtl('أطراف العقد'), style: 'subheader', margin: [0, PDF_SPACING[4], 0, PDF_SPACING[4]] },
    
    // Provider (First party)
    {
      stack: [
        { text: rtl('الطرف الأول (مقدم الخدمة)'), bold: true, margin: [0, 0, 0, PDF_SPACING[2]] },
        { text: `${rtl('الاسم:')} ${rtl(data.provider.name)}` },
        ...(data.provider.nationalId ? [{ text: `${rtl('رقم الهوية:')} ${ltr(data.provider.nationalId)}` }] : []),
        ...(data.provider.address ? [{ text: `${rtl('العنوان:')} ${rtl(data.provider.address)}` }] : []),
        ...(data.provider.phone ? [{ text: `${rtl('الهاتف:')} ${ltr(data.provider.phone)}` }] : []),
      ],
      margin: [0, 0, 0, PDF_SPACING[6]],
    },
    
    // Customer (Second party)
    {
      stack: [
        { text: rtl('الطرف الثاني (العميل)'), bold: true, margin: [0, 0, 0, PDF_SPACING[2]] },
        { text: `${rtl('الاسم:')} ${rtl(data.customer.name)}` },
        ...(data.customer.nationalId ? [{ text: `${rtl('رقم الهوية:')} ${ltr(data.customer.nationalId)}` }] : []),
        ...(data.customer.address ? [{ text: `${rtl('العنوان:')} ${rtl(data.customer.address)}` }] : []),
        ...(data.customer.phone ? [{ text: `${rtl('الهاتف:')} ${ltr(data.customer.phone)}` }] : []),
      ],
      margin: [0, 0, 0, PDF_SPACING[8]],
    },
    
    // Service description
    ...(data.serviceDescription ? [
      { text: rtl('وصف الخدمة'), style: 'subheader', margin: [0, PDF_SPACING[4], 0, PDF_SPACING[4]] },
      { text: rtl(data.serviceDescription), margin: [0, 0, 0, PDF_SPACING[8]] },
    ] : []),
    
    // Clauses
    { text: rtl('بنود العقد'), style: 'subheader', margin: [0, PDF_SPACING[4], 0, PDF_SPACING[4]] },
    ...data.clauses.map((clause, index) => ({
      stack: [
        { 
          text: rtl(`البند ${toArabicOrdinal(index + 1)}: ${clause.title}`), 
          bold: true, 
          margin: [0, PDF_SPACING[4], 0, PDF_SPACING[2]] 
        },
        { text: rtl(clause.content) },
      ],
    })),
    
    // Pricing
    { text: rtl('القيمة المالية'), style: 'subheader', margin: [0, PDF_SPACING[8], 0, PDF_SPACING[4]] },
    {
      table: {
        widths: [100, '*'],
        body: [
          [
            { text: formatCurrency(data.amount, currency), alignment: 'right' },
            { text: rtl('قيمة الخدمة'), alignment: 'right', bold: true },
          ],
          [
            { text: formatCurrency(vatAmount, currency), alignment: 'right' },
            { text: rtl(`ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)`), alignment: 'right', bold: true },
          ],
          [
            { text: formatCurrency(totalAmount, currency), alignment: 'right', bold: true, fillColor: PDF_COLORS.backgroundMuted },
            { text: rtl('الإجمالي'), alignment: 'right', bold: true, fillColor: PDF_COLORS.backgroundMuted },
          ],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, PDF_SPACING[12]],
    },
    
    // Signatures
    { text: rtl('التوقيعات'), style: 'subheader', margin: [0, PDF_SPACING[8], 0, PDF_SPACING[8]] },
    {
      columns: [
        {
          width: '*',
          stack: [
            { text: rtl('الطرف الثاني (العميل)'), bold: true, alignment: 'center' },
            { text: rtl(data.customer.name), alignment: 'center', margin: [0, PDF_SPACING[4], 0, 0] },
            { text: '_____________________', alignment: 'center', margin: [0, PDF_SPACING[12], 0, 0] },
            { text: rtl('التوقيع'), alignment: 'center', margin: [0, PDF_SPACING[2], 0, 0] },
          ],
        },
        {
          width: '*',
          stack: [
            { text: rtl('الطرف الأول (مقدم الخدمة)'), bold: true, alignment: 'center' },
            { text: rtl(data.provider.name), alignment: 'center', margin: [0, PDF_SPACING[4], 0, 0] },
            { text: '_____________________', alignment: 'center', margin: [0, PDF_SPACING[12], 0, 0] },
            { text: rtl('التوقيع'), alignment: 'center', margin: [0, PDF_SPACING[2], 0, 0] },
          ],
        },
      ],
    },
  ];
  
  return {
    ...arabicDocumentStyles,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content,
    info: {
      title: `عقد ${data.contractNumber}`,
      author: data.provider.name,
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${ltr(currentPage)} / ${ltr(pageCount)}`,
      alignment: 'center',
      style: 'footer',
      margin: [0, 20, 0, 0],
    }),
  };
}

/**
 * Default contract clauses
 */
export const defaultContractClauses: ContractClause[] = [
  {
    title: 'موضوع العقد',
    content: 'يتعهد الطرف الأول بتقديم الخدمات المتفق عليها للطرف الثاني وفقاً للمواصفات والشروط المحددة في هذا العقد.',
  },
  {
    title: 'مدة العقد',
    content: 'يبدأ العمل بهذا العقد من تاريخ توقيعه ويستمر حتى إتمام الخدمات المتفق عليها.',
  },
  {
    title: 'التزامات الطرف الأول',
    content: 'يلتزم الطرف الأول بتنفيذ الخدمات بجودة عالية وفي المواعيد المحددة، مع الالتزام بجميع المعايير المهنية.',
  },
  {
    title: 'التزامات الطرف الثاني',
    content: 'يلتزم الطرف الثاني بسداد المستحقات المالية في مواعيدها وتوفير جميع المعلومات والمستندات اللازمة.',
  },
  {
    title: 'السرية',
    content: 'يتعهد الطرفان بالحفاظ على سرية جميع المعلومات المتبادلة وعدم إفشائها لأي طرف ثالث.',
  },
  {
    title: 'حل النزاعات',
    content: 'في حال نشوء أي خلاف يتم حله ودياً، وفي حال تعذر ذلك يحال النزاع للجهات القضائية المختصة في المملكة العربية السعودية.',
  },
];

/**
 * Sample contract for testing
 */
export const sampleContractData: ContractData = {
  contractNumber: 'CNT-2025-0001',
  date: '2025-02-02',
  provider: {
    name: 'شركة الصالح القابضة',
    nationalId: '1234567890',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966 11 234 5678',
    role: 'provider',
  },
  customer: {
    name: 'محمد عبدالله الأحمد',
    nationalId: '0987654321',
    address: 'جدة، المملكة العربية السعودية',
    phone: '+966 50 123 4567',
    role: 'customer',
  },
  serviceName: 'خدمات استشارية متكاملة',
  serviceDescription: 'تقديم خدمات استشارية شاملة تشمل التخطيط الاستراتيجي والتحليل المالي وتطوير الأعمال.',
  amount: 25000,
  vatRate: 0.15,
  clauses: defaultContractClauses,
  status: 'pending',
};
