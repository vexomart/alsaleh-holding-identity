import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register Arabic fonts with proper fallbacks
Font.register({
  family: 'NotoSansArabic',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHmeR4ricci.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHmeR4ricci.ttf',
      fontWeight: 'bold'
    }
  ]
});

// Modern Professional Template
const modernStyles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansArabic',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    padding: 40,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companySlogan: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '12 24',
    borderRadius: 25,
  },
  content: {
    padding: 40,
  },
  grid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 5,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    color: '#ffffff',
    padding: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: 25,
    borderRadius: 12,
    marginTop: 30,
  },
  footer: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
  },
});

// Luxury Template
const luxuryStyles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansArabic',
    backgroundColor: '#fafafa',
    padding: 0,
  },
  header: {
    backgroundColor: '#2d3748',
    color: '#ffffff',
    padding: 50,
    position: 'relative',
  },
  goldAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#d4af37',
  },
  companyName: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  luxuryBorder: {
    borderWidth: 2,
    borderColor: '#d4af37',
    borderStyle: 'solid',
    padding: 20,
    margin: 40,
    borderRadius: 8,
  },
  premiumBadge: {
    backgroundColor: '#d4af37',
    color: '#1a202c',
    padding: '8 20',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
});

// Minimalist Template
const minimalistStyles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansArabic',
    backgroundColor: '#ffffff',
    padding: 60,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 30,
    marginBottom: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#111827',
    textAlign: 'center',
  },
  invoiceTitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 'medium',
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 40,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
});

interface TemplateProps {
  invoiceData: {
    invoiceNumber: string;
    date: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    amount: number;
    currency: string;
    serviceName: string;
    transactionId: string;
    paymentMethod: string;
    vatAmount?: number;
    totalAmount?: number;
    orderStatus?: string;
  };
}

// Modern Professional Template Component
export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const vatAmount = invoiceData.vatAmount || invoiceData.amount * 0.15;
  const totalAmount = invoiceData.totalAmount || invoiceData.amount + vatAmount;

  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        <View style={modernStyles.header}>
          <Text style={modernStyles.companyName}>شركة علي صالح الشهري القابضة</Text>
          <Text style={modernStyles.companySlogan}>الريادة في الحلول التقنية والاستثمارية</Text>
          <View style={modernStyles.invoiceTitle}>
            <Text>فاتورة ضريبية</Text>
          </View>
        </View>

        <View style={modernStyles.content}>
          <View style={modernStyles.grid}>
            <View style={modernStyles.card}>
              <Text style={modernStyles.cardTitle}>بيانات العميل</Text>
              <Text>الاسم: {invoiceData.customerName}</Text>
              <Text>الإيميل: {invoiceData.customerEmail}</Text>
              {invoiceData.customerPhone && <Text>الهاتف: {invoiceData.customerPhone}</Text>}
            </View>
            
            <View style={modernStyles.card}>
              <Text style={modernStyles.cardTitle}>تفاصيل الفاتورة</Text>
              <Text>رقم الفاتورة: {invoiceData.invoiceNumber}</Text>
              <Text>التاريخ: {invoiceData.date}</Text>
              <Text>رقم المعاملة: {invoiceData.transactionId}</Text>
            </View>
          </View>

          <View style={modernStyles.table}>
            <View style={modernStyles.tableHeader}>
              <Text style={[modernStyles.tableCell, { flex: 3 }]}>الخدمة</Text>
              <Text style={modernStyles.tableCell}>الكمية</Text>
              <Text style={modernStyles.tableCell}>السعر</Text>
              <Text style={modernStyles.tableCell}>الإجمالي</Text>
            </View>
            <View style={modernStyles.tableRow}>
              <Text style={[modernStyles.tableCell, { flex: 3 }]}>{invoiceData.serviceName}</Text>
              <Text style={modernStyles.tableCell}>1</Text>
              <Text style={modernStyles.tableCell}>{invoiceData.amount.toFixed(2)}</Text>
              <Text style={modernStyles.tableCell}>{invoiceData.amount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={modernStyles.totalSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text>المجموع الفرعي:</Text>
              <Text>{invoiceData.amount.toFixed(2)} {invoiceData.currency}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text>ضريبة القيمة المضافة (15%):</Text>
              <Text>{vatAmount.toFixed(2)} {invoiceData.currency}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 18, fontWeight: 'bold' }}>
              <Text>المجموع الإجمالي:</Text>
              <Text>{totalAmount.toFixed(2)} {invoiceData.currency}</Text>
            </View>
          </View>
        </View>

        <View style={modernStyles.footer}>
          <Text>شكراً لتعاملكم معنا • هذه فاتورة ضريبية معتمدة</Text>
        </View>
      </Page>
    </Document>
  );
};

// Luxury Template Component
export const LuxuryTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const vatAmount = invoiceData.vatAmount || invoiceData.amount * 0.15;
  const totalAmount = invoiceData.totalAmount || invoiceData.amount + vatAmount;

  return (
    <Document>
      <Page size="A4" style={luxuryStyles.page}>
        <View style={luxuryStyles.goldAccent} />
        <View style={luxuryStyles.header}>
          <Text style={luxuryStyles.companyName}>شركة علي صالح الشهري القابضة</Text>
          <View style={luxuryStyles.premiumBadge}>
            <Text>فاتورة مميزة</Text>
          </View>
        </View>

        <View style={luxuryStyles.luxuryBorder}>
          <Text style={{ textAlign: 'center', fontSize: 24, marginBottom: 20 }}>
            فاتورة ضريبية رقم {invoiceData.invoiceNumber}
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 30 }}>
            العميل: {invoiceData.customerName}
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            الخدمة: {invoiceData.serviceName}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
            المبلغ الإجمالي: {totalAmount.toFixed(2)} {invoiceData.currency}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Minimalist Template Component  
export const MinimalistTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const vatAmount = invoiceData.vatAmount || invoiceData.amount * 0.15;
  const totalAmount = invoiceData.totalAmount || invoiceData.amount + vatAmount;

  return (
    <Document>
      <Page size="A4" style={minimalistStyles.page}>
        <View style={minimalistStyles.header}>
          <Text style={minimalistStyles.companyName}>شركة علي صالح الشهري القابضة</Text>
          <Text style={minimalistStyles.invoiceTitle}>فاتورة ضريبية</Text>
        </View>
        
        <View style={minimalistStyles.section}>
          <Text style={minimalistStyles.label}>رقم الفاتورة</Text>
          <Text style={minimalistStyles.value}>{invoiceData.invoiceNumber}</Text>
        </View>
        
        <View style={minimalistStyles.section}>
          <Text style={minimalistStyles.label}>العميل</Text>
          <Text style={minimalistStyles.value}>{invoiceData.customerName}</Text>
        </View>
        
        <View style={minimalistStyles.section}>
          <Text style={minimalistStyles.label}>الخدمة</Text>
          <Text style={minimalistStyles.value}>{invoiceData.serviceName}</Text>
        </View>
        
        <View style={minimalistStyles.table}>
          <View style={minimalistStyles.tableRow}>
            <Text style={{ flex: 1 }}>المجموع الفرعي</Text>
            <Text>{invoiceData.amount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={minimalistStyles.tableRow}>
            <Text style={{ flex: 1 }}>ضريبة القيمة المضافة</Text>
            <Text>{vatAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={minimalistStyles.tableRow}>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>الإجمالي</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Template selector function
export const generateTemplatedPDF = async (invoiceData: TemplateProps['invoiceData'], template: 'modern' | 'luxury' | 'minimalist' = 'modern') => {
  let TemplateComponent;
  
  switch (template) {
    case 'luxury':
      TemplateComponent = LuxuryTemplate;
      break;
    case 'minimalist':
      TemplateComponent = MinimalistTemplate;
      break;
    default:
      TemplateComponent = ModernProfessionalTemplate;
  }

  try {
    const blob = await pdf(<TemplateComponent invoiceData={invoiceData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `فاتورة-${template}-${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating templated PDF:', error);
    return false;
  }
};

export default { ModernProfessionalTemplate, LuxuryTemplate, MinimalistTemplate, generateTemplatedPDF };