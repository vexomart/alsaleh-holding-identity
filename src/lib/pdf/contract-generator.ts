/**
 * Arabic Contract PDF Generator
 * 
 * Generates professional contracts with full RTL support
 */

import { 
  ArabicPDFGenerator, 
  formatArabicDate,
  formatArabicCurrency,
  toArabicNumerals,
  type PDFContent,
} from './arabic-pdf';

export interface ContractParty {
  name: string;
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

export interface ContractData {
  contractNumber: string;
  contractType: string;
  date: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  
  firstParty: ContractParty;
  secondParty: ContractParty;
  
  preamble?: string;
  clauses: ContractClause[];
  
  value?: {
    amount: number;
    currency: string;
    paymentTerms?: string;
  };
  
  signatures?: {
    firstParty?: string;
    secondParty?: string;
  };
  
  witnesses?: { name: string; idNumber?: string }[];
}

function buildPartyStack(party: ContractParty): PDFContent[] {
  const stack: PDFContent[] = [
    { text: party.name, bold: true, fontSize: 12, margin: [0, 0, 0, 5] },
  ];
  
  if (party.title) {
    stack.push({ text: party.title, fontSize: 10, color: '#6b7280' });
  }
  if (party.idNumber) {
    stack.push({ text: `رقم الهوية: ${party.idNumber}`, fontSize: 10 });
  }
  if (party.address) {
    stack.push({ text: `العنوان: ${party.address}`, fontSize: 10 });
  }
  if (party.phone) {
    stack.push({ text: `الهاتف: ${party.phone}`, fontSize: 10 });
  }
  if (party.representedBy) {
    stack.push({ text: `ممثلاً بـ: ${party.representedBy}`, fontSize: 10, italics: true });
  }
  
  return stack;
}

export function generateContractContent(contract: ContractData, useArabicNumerals: boolean = false): PDFContent[] {
  const formatNum = (n: number | string) => useArabicNumerals ? toArabicNumerals(n) : String(n);
  const content: PDFContent[] = [];

  // Contract Header
  content.push({
    stack: [
      { text: contract.contractType, style: 'title' },
      { 
        text: `رقم العقد: ${contract.contractNumber}`, 
        style: 'subheader', 
        alignment: 'center',
        margin: [0, 0, 0, 5],
      },
      { 
        text: `التاريخ: ${formatArabicDate(contract.date, 'full')}`, 
        style: 'normal', 
        alignment: 'center',
        color: '#6b7280',
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // Parties Information
  content.push({
    columns: [
      // Second Party (Left in visual RTL)
      {
        width: '48%',
        stack: [
          { text: 'الطرف الثاني', style: 'subheader', margin: [0, 0, 0, 10] },
          { 
            table: {
              widths: ['*'],
              body: [[{
                stack: buildPartyStack(contract.secondParty),
                margin: [10, 10, 10, 10],
              }]],
            },
            layout: {
              fillColor: () => '#f8fafc',
              hLineColor: () => '#e5e7eb',
              vLineColor: () => '#e5e7eb',
            },
          },
        ],
      },
      { width: '4%', text: '' },
      // First Party (Right in visual RTL)
      {
        width: '48%',
        stack: [
          { text: 'الطرف الأول', style: 'subheader', margin: [0, 0, 0, 10] },
          { 
            table: {
              widths: ['*'],
              body: [[{
                stack: buildPartyStack(contract.firstParty),
                margin: [10, 10, 10, 10],
              }]],
            },
            layout: {
              fillColor: () => '#f8fafc',
              hLineColor: () => '#e5e7eb',
              vLineColor: () => '#e5e7eb',
            },
          },
        ],
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // Contract Duration (if provided)
  if (contract.startDate || contract.endDate) {
    content.push({
      table: {
        widths: ['*', '*'],
        body: [[
          { 
            text: contract.endDate ? `تاريخ الانتهاء: ${formatArabicDate(contract.endDate, 'short')}` : '', 
            style: 'normal',
            alignment: 'center',
            margin: [10, 10, 10, 10],
          },
          { 
            text: contract.startDate ? `تاريخ البداية: ${formatArabicDate(contract.startDate, 'short')}` : '', 
            style: 'normal',
            alignment: 'center',
            margin: [10, 10, 10, 10],
          },
        ]],
      },
      layout: {
        fillColor: () => '#eff6ff',
        hLineColor: () => '#bfdbfe',
        vLineColor: () => '#bfdbfe',
      },
      margin: [0, 0, 0, 20],
    });
  }

  // Preamble
  if (contract.preamble) {
    content.push({
      stack: [
        { text: 'تمهيد', style: 'subheader', margin: [0, 0, 0, 10] },
        { text: contract.preamble, style: 'normal', lineHeight: 1.6 },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // Contract Clauses
  content.push({
    text: 'بنود العقد',
    style: 'subheader',
    margin: [0, 10, 0, 15],
  });

  contract.clauses.forEach((clause, index) => {
    const clauseStack: PDFContent[] = [
      { 
        text: `البند ${formatNum(index + 1)}: ${clause.title}`, 
        bold: true, 
        fontSize: 12,
        color: '#1e293b',
        margin: [0, 10, 0, 8],
      },
      { 
        text: clause.content, 
        style: 'normal',
        lineHeight: 1.6,
        margin: [15, 0, 0, 0],
      },
    ];
    
    if (clause.subClauses) {
      clause.subClauses.forEach((sub, subIndex) => {
        clauseStack.push({
          text: `${formatNum(index + 1)}.${formatNum(subIndex + 1)} ${sub}`,
          style: 'normal',
          margin: [30, 5, 0, 0],
          lineHeight: 1.5,
        });
      });
    }

    content.push({
      stack: clauseStack,
    });
  });

  // Contract Value (if provided)
  if (contract.value) {
    const valueStack: PDFContent[] = [
      { 
        text: formatArabicCurrency(contract.value.amount, contract.value.currency, useArabicNumerals), 
        fontSize: 20, 
        bold: true, 
        alignment: 'center',
        color: '#3b82f6',
        margin: [0, 10, 0, 5],
      },
    ];
    
    if (contract.value.paymentTerms) {
      valueStack.push({ 
        text: `شروط الدفع: ${contract.value.paymentTerms}`, 
        fontSize: 10, 
        alignment: 'center',
        color: '#6b7280',
        margin: [0, 0, 0, 10],
      });
    }

    content.push({
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }] },
        { text: 'قيمة العقد', style: 'subheader', margin: [0, 20, 0, 10] },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: valueStack,
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb',
          },
        },
      ],
      margin: [0, 20, 0, 20],
    });
  }

  // Signatures Section
  content.push({
    stack: [
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }] },
      { text: 'التوقيعات', style: 'subheader', margin: [0, 20, 0, 15] },
      {
        columns: [
          {
            width: '48%',
            stack: [
              { text: 'الطرف الثاني', bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
              { text: contract.secondParty.name, alignment: 'center', fontSize: 10, margin: [0, 0, 0, 10] },
              { text: 'التوقيع: _______________', alignment: 'center', fontSize: 10, margin: [0, 20, 0, 10] },
              { text: 'التاريخ: _______________', alignment: 'center', fontSize: 10 },
            ],
          },
          { width: '4%', text: '' },
          {
            width: '48%',
            stack: [
              { text: 'الطرف الأول', bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
              { text: contract.firstParty.name, alignment: 'center', fontSize: 10, margin: [0, 0, 0, 10] },
              { text: 'التوقيع: _______________', alignment: 'center', fontSize: 10, margin: [0, 20, 0, 10] },
              { text: 'التاريخ: _______________', alignment: 'center', fontSize: 10 },
            ],
          },
        ],
      },
    ],
    margin: [0, 20, 0, 0],
  });

  // Witnesses (if provided)
  if (contract.witnesses && contract.witnesses.length > 0) {
    content.push({
      stack: [
        { text: 'الشهود', style: 'subheader', margin: [0, 30, 0, 15] },
        {
          columns: contract.witnesses.map((witness, index) => {
            const witnessStack: PDFContent[] = [
              { text: `الشاهد ${formatNum(index + 1)}`, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
              { text: `الاسم: ${witness.name}`, alignment: 'center', fontSize: 10, margin: [0, 0, 0, 5] },
            ];
            
            if (witness.idNumber) {
              witnessStack.push({ text: `رقم الهوية: ${witness.idNumber}`, alignment: 'center', fontSize: 10, margin: [0, 0, 0, 5] });
            }
            
            witnessStack.push({ text: 'التوقيع: _______________', alignment: 'center', fontSize: 10, margin: [0, 15, 0, 0] });
            
            return {
              width: '*',
              stack: witnessStack,
            };
          }),
        },
      ],
    });
  }

  return content;
}

// Create Contract PDF Generator
export async function createContractPDF(
  contract: ContractData,
  options?: {
    filename?: string;
    download?: boolean;
    useArabicNumerals?: boolean;
  }
): Promise<{ blob?: Blob; dataUrl?: string }> {
  const generator = new ArabicPDFGenerator({
    title: `${contract.contractType} - ${contract.contractNumber}`,
    subject: 'عقد',
    useArabicNumerals: options?.useArabicNumerals,
    companyInfo: {
      name: 'Ali Saleh Al-Shehri Holding Company',
      nameAr: 'شركة علي صالح الشهري القابضة',
      address: 'المملكة العربية السعودية - الرياض',
      phone: '+966 11 123 4567',
      email: 'info@ash-holding.sa',
      website: 'www.alialshehriholding.com',
    },
  });

  const content = generateContractContent(contract, options?.useArabicNumerals);

  if (options?.download) {
    await generator.download(content, options.filename || `contract-${contract.contractNumber}.pdf`);
    return {};
  }

  const [blob, dataUrl] = await Promise.all([
    generator.getBlob(content),
    generator.getDataUrl(content),
  ]);

  return { blob, dataUrl };
}
