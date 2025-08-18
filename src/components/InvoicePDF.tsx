import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register Arabic font
Font.register({
  family: 'NotoSansArabic',
  src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHmeR4ricci.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'NotoSansArabic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'left',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'left',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  invoiceInfo: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    textAlign: 'right',
  },
  text: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 5,
    textAlign: 'right',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
    fontSize: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'right',
  },
  total: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1e40af',
    color: 'white',
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 12,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#f3f4f6',
    opacity: 0.3,
    zIndex: -1,
  },
});

interface InvoiceData {
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
}

interface InvoicePDFProps {
  invoiceData: InvoiceData;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => {
  const vatRate = 0.15; // 15% VAT
  const subtotal = invoiceData.amount;
  const vatAmount = invoiceData.vatAmount || subtotal * vatRate;
  const totalAmount = invoiceData.totalAmount || subtotal + vatAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>PAID</Text>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>شركة علي صالح الشهري القابضة</Text>
            <Text style={styles.companyDetails}>
              {`الرياض، المملكة العربية السعودية\nهاتف: 0555812567\nإيميل: info@alialshehriholding.com\nموقع: alialshehriholding.com`}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>فاتورة ضريبية</Text>
            <Text style={styles.invoiceNumber}>رقم الفاتورة: {invoiceData.invoiceNumber}</Text>
          </View>
        </View>

        {/* Customer and Invoice Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.customerInfo}>
              <Text style={styles.sectionTitle}>بيانات العميل</Text>
              <Text style={styles.text}>الاسم: {invoiceData.customerName}</Text>
              <Text style={styles.text}>الإيميل: {invoiceData.customerEmail}</Text>
              {invoiceData.customerPhone && (
                <Text style={styles.text}>الهاتف: {invoiceData.customerPhone}</Text>
              )}
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.sectionTitle}>تفاصيل الفاتورة</Text>
              <Text style={styles.text}>تاريخ الإصدار: {invoiceData.date}</Text>
              <Text style={styles.text}>رقم المعاملة: {invoiceData.transactionId}</Text>
              <Text style={styles.text}>طريقة الدفع: {invoiceData.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 3 }]}>الخدمة</Text>
            <Text style={styles.tableCell}>الكمية</Text>
            <Text style={styles.tableCell}>السعر</Text>
            <Text style={styles.tableCell}>المجموع</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{invoiceData.serviceName}</Text>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>{subtotal.toFixed(2)}</Text>
            <Text style={styles.tableCell}>{subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>المجموع الفرعي:</Text>
            <Text style={styles.totalText}>{subtotal.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>ضريبة القيمة المضافة (15%):</Text>
            <Text style={styles.totalText}>{vatAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalAmount}>المجموع الإجمالي:</Text>
            <Text style={styles.totalAmount}>{totalAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          شكراً لتعاملكم معنا • هذه فاتورة ضريبية معتمدة • جميع المبالغ بالريال السعودي
        </Text>
      </Page>
    </Document>
  );
};

// Function to generate and download PDF
export const downloadInvoicePDF = async (invoiceData: InvoiceData) => {
  const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `فاتورة-${invoiceData.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default InvoicePDF;