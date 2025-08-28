import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer';

// Register multiple fonts for better Arabic support
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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'NotoSansArabic',
    fontSize: 11,
    lineHeight: 1.6,
  },
  // Modern gradient header
  header: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: '#ffffff',
    padding: '40 30',
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyInfo: {
    textAlign: 'right',
    flex: 1,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  companyDetails: {
    fontSize: 12,
    color: '#e2e8f0',
    lineHeight: 1.6,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'left',
  },
  // Modern badge for paid status
  paidBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '8 16',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },
  customerInfo: {
    width: '48%',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceInfo: {
    width: '48%',
    padding: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'right',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 5,
  },
  text: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 1.5,
  },
  table: {
    marginTop: 25,
    marginHorizontal: 30,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: '#ffffff',
    padding: 15,
    fontSize: 13,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 15,
    fontSize: 11,
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 15,
    fontSize: 11,
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'right',
    color: '#374151',
  },
  total: {
    marginTop: 30,
    marginHorizontal: 30,
    padding: 25,
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  totalText: {
    fontSize: 13,
    textAlign: 'right',
    color: '#e2e8f0',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#ffffff',
  },
  finalTotal: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 12,
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    padding: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 80,
    color: 'rgba(59, 130, 246, 0.08)',
    opacity: 1,
    zIndex: 0,
    fontWeight: 'bold',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  qrCode: {
    width: 80,
    height: 80,
    marginTop: 10,
    alignSelf: 'center',
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
    <Document 
      title={`فاتورة ${invoiceData.invoiceNumber}`}
      author="شركة علي صالح الشهري القابضة"
      subject="فاتورة ضريبية"
      creator="نظام إدارة الفواتير"
      producer="Ali Saleh Al-Shahri Holding Company"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Modern Watermark */}
        <Text style={styles.watermark}>مدفوع</Text>
        
        {/* Modern Header with Gradient */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>شركة علي صالح الشهري القابضة</Text>
              <Text style={styles.companyDetails}>
                المملكة العربية السعودية - الرياض{'\n'}
                هاتف: +966 11 123 4567{'\n'}
                إيميل: info@alialshehriholding.com{'\n'}
                الموقع: www.alialshehriholding.com
              </Text>
            </View>
            <View>
              <Text style={styles.invoiceTitle}>فاتورة ضريبية</Text>
              <Text style={styles.invoiceNumber}>رقم الفاتورة: {invoiceData.invoiceNumber}</Text>
              <View style={styles.paidBadge}>
                <Text>✅ تم الدفع</Text>
              </View>
            </View>
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
              {invoiceData.orderStatus && (
                <Text style={styles.text}>حالة الطلب: {invoiceData.orderStatus}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Modern Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 3 }]}>وصف الخدمة</Text>
            <Text style={styles.tableCell}>الكمية</Text>
            <Text style={styles.tableCell}>السعر (ريال)</Text>
            <Text style={styles.tableCell}>الإجمالي (ريال)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3, fontWeight: 'bold' }]}>{invoiceData.serviceName}</Text>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>{subtotal.toFixed(2)}</Text>
            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Enhanced Total Section */}
        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>المجموع الفرعي:</Text>
            <Text style={styles.totalText}>{subtotal.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>ضريبة القيمة المضافة (15%):</Text>
            <Text style={styles.totalText}>+{vatAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={[styles.totalAmount, { fontSize: 20 }]}>المبلغ الإجمالي:</Text>
            <Text style={[styles.totalAmount, { fontSize: 20 }]}>{totalAmount.toFixed(2)} {invoiceData.currency}</Text>
          </View>
        </View>

        {/* Enhanced Footer */}
        <View style={styles.footer}>
          <Text>شكراً لاختياركم شركة علي صالح الشهري القابضة</Text>
          <Text>هذه فاتورة ضريبية معتمدة صادرة إلكترونياً ولا تحتاج إلى توقيع</Text>
          <Text>جميع المبالغ بالريال السعودي • في حالة الاستفسار: info@alialshehriholding.com</Text>
          <Text style={{ marginTop: 8, fontSize: 9, color: '#94a3b8' }}>
            تاريخ الإنشاء: {new Date().toLocaleDateString('ar-SA')} • معرف المعاملة: {invoiceData.transactionId}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Enhanced function to generate and download PDF with better error handling
export const downloadInvoicePDF = async (invoiceData: InvoiceData) => {
  try {
    // Validate data before generating PDF
    if (!invoiceData.invoiceNumber || !invoiceData.customerName || !invoiceData.amount) {
      throw new Error('بيانات الفاتورة غير مكتملة');
    }

    console.log('Generating PDF for invoice:', invoiceData.invoiceNumber);
    
    // Generate PDF with proper encoding
    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    
    if (!blob) {
      throw new Error('فشل في إنشاء ملف PDF');
    }

    // Create download link with proper filename
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `فاتورة-${invoiceData.invoiceNumber}-${Date.now()}.pdf`;
    link.style.display = 'none';
    
    // Add to DOM, click, and cleanup
    document.body.appendChild(link);
    link.click();
    
    // Cleanup after a short delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('PDF download initiated successfully');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`خطأ في إنشاء PDF: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
};

export default InvoicePDF;