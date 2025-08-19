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
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 8,
  },
  companyLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#059669',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyInfo: {
    textAlign: 'right',
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#064e3b',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
  },
  invoiceSection: {
    textAlign: 'left',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#6b7280',
    backgroundColor: '#fef3c7',
    padding: '5 10',
    borderRadius: 4,
  },
  statusBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '6 12',
    borderRadius: 15,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#064e3b',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCard: {
    width: '48%',
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#059669',
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#064e3b',
    marginBottom: 12,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'right',
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    color: 'white',
    padding: 12,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 12,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
    color: '#374151',
  },
  serviceName: {
    flex: 3,
    textAlign: 'right',
    paddingRight: 10,
  },
  quantity: {
    flex: 1,
  },
  price: {
    flex: 1.5,
  },
  total: {
    flex: 1.5,
  },
  summarySection: {
    marginTop: 30,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#064e3b',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: '8 0',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 'bold',
  },
  finalTotal: {
    backgroundColor: '#059669',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  finalTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  notesSection: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 10,
    color: '#78350f',
    lineHeight: 1.5,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
    borderTopWidth: 2,
    borderTopColor: '#059669',
    paddingTop: 15,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
  },
  footerTitle: {
    fontWeight: 'bold',
    color: '#064e3b',
    marginBottom: 5,
  },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 80,
    color: '#10b981',
    opacity: 0.05,
    zIndex: -1,
    fontWeight: 'bold',
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
  orderStatus?: string; // إضافة حالة الطلب
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
            <View style={styles.companyLogo}>
              <Text style={styles.logoText}>ع.ش</Text>
            </View>
            <Text style={styles.companyName}>شركة علي صالح الشهري القابضة</Text>
            <Text style={styles.companyDetails}>
              {`جدة، المملكة العربية السعودية\nهاتف: 0555812567\nإيميل: info@alialshehriholding.com\nموقع: alialshehriholding.com\nالرقم الضريبي: 123456789000003`}
            </Text>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>فاتورة ضريبية</Text>
            <Text style={styles.invoiceNumber}>رقم الفاتورة: {invoiceData.invoiceNumber}</Text>
            <View style={styles.statusBadge}>
              <Text>مدفوعة ✓</Text>
            </View>
          </View>
        </View>

        {/* Customer and Invoice Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 معلومات الفاتورة</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.infoCard}>
              <View style={styles.cardIcon}></View>
              <Text style={styles.cardTitle}>👤 بيانات العميل</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>الاسم:</Text>
                <Text style={styles.value}>{invoiceData.customerName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>الإيميل:</Text>
                <Text style={styles.value}>{invoiceData.customerEmail}</Text>
              </View>
              {invoiceData.customerPhone && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>الهاتف:</Text>
                  <Text style={styles.value}>{invoiceData.customerPhone}</Text>
                </View>
              )}
            </View>
            <View style={styles.infoCard}>
              <View style={styles.cardIcon}></View>
              <Text style={styles.cardTitle}>📄 تفاصيل الفاتورة</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>تاريخ الإصدار:</Text>
                <Text style={styles.value}>{invoiceData.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>رقم المعاملة:</Text>
                <Text style={styles.value}>{invoiceData.transactionId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>طريقة الدفع:</Text>
                <Text style={styles.value}>{invoiceData.paymentMethod}</Text>
              </View>
              {invoiceData.orderStatus && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>حالة الطلب:</Text>
                  <Text style={styles.value}>{invoiceData.orderStatus}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🛍️ تفاصيل الخدمات</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.serviceName]}>الخدمة</Text>
              <Text style={[styles.tableHeaderCell, styles.quantity]}>الكمية</Text>
              <Text style={[styles.tableHeaderCell, styles.price]}>السعر</Text>
              <Text style={[styles.tableHeaderCell, styles.total]}>المجموع</Text>
            </View>
            <View style={[styles.tableRow]}>
              <Text style={[styles.tableCell, styles.serviceName]}>{invoiceData.serviceName}</Text>
              <Text style={[styles.tableCell, styles.quantity]}>1</Text>
              <Text style={[styles.tableCell, styles.price]}>{subtotal.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.total]}>{subtotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>💰 ملخص الفاتورة</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المجموع الفرعي:</Text>
            <Text style={styles.summaryValue}>{subtotal.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ضريبة القيمة المضافة (15%):</Text>
            <Text style={styles.summaryValue}>{vatAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={styles.finalTotal}>
            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>المجموع الإجمالي:</Text>
              <Text style={styles.finalTotalAmount}>{totalAmount.toFixed(2)} {invoiceData.currency}</Text>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>📌 ملاحظات مهمة</Text>
          <Text style={styles.notesText}>
            • هذه فاتورة ضريبية معتمدة وفقاً للوائح هيئة الزكاة والضريبة والجمارك{'\n'}
            • جميع المبالغ المذكورة بالريال السعودي{'\n'}
            • في حالة وجود أي استفسار، يرجى التواصل معنا خلال 30 يوم من تاريخ الفاتورة{'\n'}
            • شكراً لاختياركم خدماتنا، نتطلع لخدمتكم مرة أخرى
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>شركة علي صالح الشهري القابضة</Text>
          <Text>🌐 www.alialshehriholding.com | 📧 info@alialshehriholding.com | 📱 0555812567</Text>
          <Text>جدة، المملكة العربية السعودية | س.ت: 123456789000003</Text>
        </View>
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