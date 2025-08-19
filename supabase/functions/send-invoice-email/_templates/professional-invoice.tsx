import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Img,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ProfessionalInvoiceProps {
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  payment_url?: string;
  transaction_id: string;
  invoice_number: string;
  status: string;
  payment_method: string;
  offer_title: string;
  offer_description: string;
  original_price: string;
  current_price: string;
  discount: string;
}

export const ProfessionalInvoiceEmail = ({
  customer_name,
  customer_email,
  amount,
  currency,
  payment_url,
  transaction_id,
  invoice_number,
  status,
  payment_method,
  offer_title,
  offer_description,
  original_price,
  current_price,
  discount,
}: ProfessionalInvoiceProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>فاتورة ضريبية رقم {invoice_number} - شركة علي صالح الشهري القابضة</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column style={{ width: '100%', textAlign: 'center' }}>
              <Img
                src="https://alialshehriholding.com/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png"
                width="180"
                height="60"
                alt="شعار شركة علي صالح الشهري القابضة"
                style={logo}
              />
              <Heading style={companyName}>شركة علي صالح الشهري القابضة</Heading>
              <Text style={companyDetails}>
                الرياض، المملكة العربية السعودية
                <br />
                📞 0555812567 | 📧 info@alialshehriholding.com
                <br />
                🌐 alialshehriholding.com
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Status Badge */}
        <Section style={statusSection}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <div style={statusBadge}>
                <Text style={statusText}>
                  {status === 'paid' ? '✅ تم الدفع بنجاح' : '⏳ في انتظار الدفع'}
                </Text>
              </div>
            </Column>
          </Row>
        </Section>

        {/* Invoice Title */}
        <Section style={titleSection}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <Heading style={invoiceTitle}>فاتورة ضريبية</Heading>
              <Text style={invoiceNumber}>رقم الفاتورة: {invoice_number}</Text>
            </Column>
          </Row>
        </Section>

        {/* Customer & Invoice Info */}
        <Section style={infoSection}>
          <Row>
            <Column style={infoColumn}>
              <div style={infoCard}>
                <Heading style={infoCardTitle}>بيانات العميل</Heading>
                <Text style={infoText}><strong>الاسم:</strong> {customer_name}</Text>
                <Text style={infoText}><strong>البريد الإلكتروني:</strong> {customer_email}</Text>
              </div>
            </Column>
            <Column style={infoColumn}>
              <div style={infoCard}>
                <Heading style={infoCardTitle}>تفاصيل الفاتورة</Heading>
                <Text style={infoText}><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-SA')}</Text>
                <Text style={infoText}><strong>رقم المعاملة:</strong> {transaction_id}</Text>
                <Text style={infoText}><strong>طريقة الدفع:</strong> {payment_method}</Text>
              </div>
            </Column>
          </Row>
        </Section>

        {/* Offer Details */}
        <Section style={offerSection}>
          <Row>
            <Column>
              <div style={offerCard}>
                <Heading style={offerTitle}>{offer_title}</Heading>
                <Text style={offerDescription}>{offer_description}</Text>
                
                <Row style={priceRow}>
                  <Column style={{ width: '50%' }}>
                    <div style={originalPriceSection}>
                      <Text style={originalPriceLabel}>السعر الأصلي</Text>
                      <Text style={originalPrice}>{original_price} {currency}</Text>
                    </div>
                  </Column>
                  <Column style={{ width: '50%' }}>
                    <div style={currentPriceSection}>
                      <Text style={currentPriceLabel}>السعر بعد الخصم</Text>
                      <Text style={currentPrice}>{current_price} {currency}</Text>
                      <Text style={discountBadge}>خصم {discount}</Text>
                    </div>
                  </Column>
                </Row>
              </div>
            </Column>
          </Row>
        </Section>

        {/* Invoice Table */}
        <Section style={tableSection}>
          <table style={table}>
            <thead>
              <tr>
                <th style={tableHeader}>الخدمة</th>
                <th style={tableHeader}>الكمية</th>
                <th style={tableHeader}>السعر</th>
                <th style={tableHeader}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}>{offer_title}</td>
                <td style={tableCell}>1</td>
                <td style={tableCell}>{amount.toFixed(2)} {currency}</td>
                <td style={tableCell}>{amount.toFixed(2)} {currency}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Total Section */}
        <Section style={totalSection}>
          <Row>
            <Column>
              <div style={totalCard}>
                <Row style={totalRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={totalLabel}>المجموع الفرعي:</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'left' }}>
                    <Text style={totalValue}>{amount.toFixed(2)} {currency}</Text>
                  </Column>
                </Row>
                
                <Row style={totalRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={totalLabel}>ضريبة القيمة المضافة (15%):</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'left' }}>
                    <Text style={totalValue}>{(amount * 0.15).toFixed(2)} {currency}</Text>
                  </Column>
                </Row>
                
                <Hr style={totalDivider} />
                
                <Row style={finalTotalRow}>
                  <Column style={{ width: '70%' }}>
                    <Text style={finalTotalLabel}>المجموع الإجمالي:</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'left' }}>
                    <Text style={finalTotalValue}>{(amount * 1.15).toFixed(2)} {currency}</Text>
                  </Column>
                </Row>
              </div>
            </Column>
          </Row>
        </Section>

        {/* Payment Button (if pending) */}
        {status === 'pending' && payment_url && (
          <Section style={buttonSection}>
            <Row>
              <Column style={{ textAlign: 'center' }}>
                <Button
                  href={payment_url}
                  style={paymentButton}
                >
                  إتمام الدفع الآن 💳
                </Button>
                <Text style={buttonNote}>
                  اضغط على الزر أعلاه لإتمام عملية الدفع بشكل آمن
                </Text>
              </Column>
            </Row>
          </Section>
        )}

        {/* Security Features */}
        <Section style={securitySection}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <Text style={securityTitle}>ضمانات الأمان والجودة</Text>
              <Row style={securityFeatures}>
                <Column style={securityFeature}>
                  <Text style={securityText}>🔒 تشفير SSL</Text>
                </Column>
                <Column style={securityFeature}>
                  <Text style={securityText}>✅ دفع آمن 100%</Text>
                </Column>
                <Column style={securityFeature}>
                  <Text style={securityText}>🛡️ ضمان الجودة</Text>
                </Column>
                <Column style={securityFeature}>
                  <Text style={securityText}>📞 دعم 24/7</Text>
                </Column>
              </Row>
            </Column>
          </Row>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <Text style={footerText}>
                شكراً لتعاملكم معنا • هذه فاتورة ضريبية معتمدة • جميع المبالغ بالريال السعودي
              </Text>
              <Text style={footerNote}>
                في حالة وجود أي استفسار، يرجى التواصل معنا على: 0555812567
              </Text>
              <Hr style={footerDivider} />
              <Text style={copyrightText}>
                © 2024 شركة علي صالح الشهري القابضة • جميع الحقوق محفوظة
              </Text>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  direction: 'rtl' as const,
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '800px',
};

const header = {
  backgroundColor: '#1e40af',
  borderRadius: '12px 12px 0 0',
  padding: '40px 30px',
  marginBottom: '0',
};

const logo = {
  margin: '0 auto 20px auto',
  display: 'block',
};

const companyName = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0 0 10px 0',
};

const companyDetails = {
  fontSize: '14px',
  color: 'rgba(255,255,255,0.9)',
  textAlign: 'center' as const,
  lineHeight: '1.6',
  margin: '0',
};

const statusSection = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderLeft: '4px solid #10b981',
};

const statusBadge = {
  backgroundColor: '#dcfce7',
  padding: '12px 24px',
  borderRadius: '25px',
  display: 'inline-block',
  border: '1px solid #16a34a',
};

const statusText = {
  color: '#15803d',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const titleSection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  textAlign: 'center' as const,
};

const invoiceTitle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 10px 0',
};

const invoiceNumber = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0',
};

const infoSection = {
  backgroundColor: '#ffffff',
  padding: '0 30px 30px 30px',
};

const infoColumn = {
  width: '50%',
  padding: '0 15px',
};

const infoCard = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  borderRight: '4px solid #3b82f6',
};

const infoCardTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0 0 15px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#475569',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const offerSection = {
  backgroundColor: '#ffffff',
  padding: '0 30px 30px 30px',
};

const offerCard = {
  backgroundColor: '#f0f9ff',
  padding: '24px',
  borderRadius: '12px',
  border: '2px solid #0ea5e9',
};

const offerTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#0c4a6e',
  margin: '0 0 10px 0',
};

const offerDescription = {
  fontSize: '14px',
  color: '#0369a1',
  margin: '0 0 20px 0',
  lineHeight: '1.6',
};

const priceRow = {
  backgroundColor: '#ffffff',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0 0 0',
};

const originalPriceSection = {
  textAlign: 'center' as const,
  opacity: '0.7',
};

const originalPriceLabel = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 4px 0',
};

const originalPrice = {
  fontSize: '18px',
  color: '#ef4444',
  textDecoration: 'line-through',
  margin: '0',
};

const currentPriceSection = {
  textAlign: 'center' as const,
};

const currentPriceLabel = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 4px 0',
};

const currentPrice = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#059669',
  margin: '0 0 8px 0',
};

const discountBadge = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '12px',
  border: '1px solid #fca5a5',
  display: 'inline-block',
  margin: '0',
};

const tableSection = {
  backgroundColor: '#ffffff',
  padding: '0 30px 30px 30px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const tableHeader = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '15px',
  textAlign: 'right' as const,
  fontWeight: 'bold',
  fontSize: '14px',
};

const tableCell = {
  padding: '15px',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'right' as const,
  fontSize: '14px',
  color: '#374151',
};

const totalSection = {
  backgroundColor: '#ffffff',
  padding: '0 30px 30px 30px',
};

const totalCard = {
  backgroundColor: '#1e40af',
  color: '#ffffff',
  padding: '25px',
  borderRadius: '8px',
};

const totalRow = {
  marginBottom: '10px',
};

const totalLabel = {
  fontSize: '16px',
  margin: '0',
};

const totalValue = {
  fontSize: '16px',
  margin: '0',
  textAlign: 'left' as const,
};

const totalDivider = {
  border: 'none',
  borderTop: '2px solid rgba(255,255,255,0.3)',
  margin: '15px 0',
};

const finalTotalRow = {
  marginTop: '15px',
  paddingTop: '15px',
};

const finalTotalLabel = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const finalTotalValue = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'left' as const,
};

const buttonSection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  textAlign: 'center' as const,
};

const paymentButton = {
  backgroundColor: '#059669',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0 0 16px 0',
};

const buttonNote = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

const securitySection = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #bbf7d0',
  margin: '20px 0',
};

const securityTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#15803d',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const securityFeatures = {
  display: 'flex',
  justifyContent: 'space-around',
};

const securityFeature = {
  textAlign: 'center' as const,
  width: '25%',
};

const securityText = {
  fontSize: '12px',
  color: '#16a34a',
  margin: '0',
};

const footer = {
  backgroundColor: '#f1f5f9',
  padding: '30px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
};

const footerText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0 0 16px 0',
  lineHeight: '1.6',
};

const footerNote = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '0 0 20px 0',
};

const footerDivider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '20px 0',
};

const copyrightText = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '0',
};

export default ProfessionalInvoiceEmail;