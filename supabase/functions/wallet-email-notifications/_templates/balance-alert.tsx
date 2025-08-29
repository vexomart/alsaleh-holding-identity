import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BalanceAlertEmailProps {
  customerName: string
  currentBalance: number
  currency: string
  walletNumber: string
  alertThreshold: number
  topUpUrl: string
}

export const BalanceAlertEmail = ({
  customerName,
  currentBalance,
  currency,
  walletNumber,
  alertThreshold,
  topUpUrl,
}: BalanceAlertEmailProps) => (
  <Html dir="rtl" lang="ar">
    <Head>
      <meta charSet="utf-8" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        * {
          font-family: 'Cairo', 'Tahoma', sans-serif;
        }
      `}</style>
    </Head>
    <Preview>تنبيه: رصيد محفظتك منخفض - {currentBalance} {currency}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={bankTitle}>علي الشهري القابضة</Heading>
              <Text style={subtitle}>المحفظة الرقمية</Text>
            </Column>
          </Row>
        </Section>

        {/* Alert Banner */}
        <Section style={alertBanner}>
          <Text style={alertText}>⚠️ تنبيه: رصيد منخفض</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={mainHeading}>
            عزيزي {customerName}،
          </Heading>
          
          <Text style={alertMessage}>
            نود إعلامك بأن رصيد محفظتك الرقمية أصبح منخفضاً وقد وصل إلى أقل من الحد المسموح.
          </Text>

          {/* Balance Details */}
          <Section style={balanceBox}>
            <Row>
              <Column style={balanceColumn}>
                <Text style={balanceLabel}>الرصيد الحالي</Text>
                <Text style={balanceAmount}>
                  {currentBalance.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
              <Column style={thresholdColumn}>
                <Text style={thresholdLabel}>الحد الأدنى</Text>
                <Text style={thresholdAmount}>
                  {alertThreshold.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
            </Row>
            
            <Hr style={divider} />
            
            <Row>
              <Column>
                <Text style={walletLabel}>رقم المحفظة:</Text>
                <Text style={walletNumber}>{walletNumber}</Text>
              </Column>
            </Row>
          </Section>

          {/* Action Required */}
          <Section style={actionSection}>
            <Text style={actionTitle}>🚨 مطلوب إجراء فوري</Text>
            <Text style={actionText}>
              لتجنب انقطاع الخدمات، يرجى شحن محفظتك في أقرب وقت ممكن.
            </Text>
            
            <Section style={buttonSection}>
              <Button
                href={topUpUrl}
                style={topUpButton}
              >
                شحن المحفظة الآن
              </Button>
            </Section>
          </Section>

          {/* Consequences */}
          <Section style={consequencesSection}>
            <Text style={consequencesTitle}>⚠️ ما قد يحدث عند نفاد الرصيد:</Text>
            <Text style={consequencesList}>
              • عدم القدرة على إجراء المدفوعات الجديدة<br/>
              • تعليق الخدمات المستمرة<br/>
              • رسوم إضافية في حالة التأخير<br/>
              • صعوبة في تنفيذ المعاملات العاجلة
            </Text>
          </Section>

          {/* Payment Methods */}
          <Section style={paymentSection}>
            <Text style={paymentTitle}>طرق الشحن المتاحة:</Text>
            <Text style={paymentMethods}>
              💳 التحويل البنكي المباشر<br/>
              🏧 أجهزة الصراف الآلي<br/>
              📱 المحافظ الرقمية<br/>
              🏪 نقاط البيع المعتمدة
            </Text>
          </Section>
        </Section>

        {/* Support Section */}
        <Section style={supportSection}>
          <Text style={supportTitle}>تحتاج مساعدة؟</Text>
          <Text style={supportText}>
            فريق خدمة العملاء متاح على مدار الساعة لمساعدتك في شحن محفظتك
          </Text>
          <Text style={supportContact}>
            📞 +966 XX XXX XXXX<br/>
            📧 wallet@alialshehriholding.com<br/>
            💬 الدردشة المباشرة على الموقع
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            مع تحيات فريق علي الشهري القابضة
          </Text>
          <Text style={footerContact}>
            للاستفسارات: info@alialshehriholding.com | +966 XX XXX XXXX
          </Text>
          <Hr style={footerDivider} />
          <Text style={disclaimer}>
            هذا إيميل تلقائي، يرجى عدم الرد عليه. جميع الحقوق محفوظة © 2024
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main = {
  backgroundColor: '#f8fafc',
  direction: 'rtl' as const,
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
}

const header = {
  backgroundColor: '#f59e0b',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
  marginBottom: '0',
}

const bankTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 5px 0',
  textAlign: 'center' as const,
}

const subtitle = {
  color: '#fde68a',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
}

const alertBanner = {
  backgroundColor: '#ef4444',
  padding: '15px',
  textAlign: 'center' as const,
  borderRadius: '4px',
  margin: '20px 0',
}

const alertText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

const content = {
  padding: '20px',
}

const mainHeading = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '15px',
  textAlign: 'right' as const,
}

const alertMessage = {
  color: '#dc2626',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '25px',
  textAlign: 'right' as const,
  fontWeight: '600',
}

const balanceBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const balanceColumn = {
  width: '50%',
  textAlign: 'center' as const,
}

const thresholdColumn = {
  width: '50%',
  textAlign: 'center' as const,
}

const balanceLabel = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0 0 5px 0',
  fontWeight: '500',
}

const balanceAmount = {
  color: '#dc2626',
  fontSize: '24px',
  margin: '0',
  fontWeight: '700',
}

const thresholdLabel = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0 0 5px 0',
  fontWeight: '500',
}

const thresholdAmount = {
  color: '#059669',
  fontSize: '18px',
  margin: '0',
  fontWeight: '600',
}

const walletLabel = {
  color: '#92400e',
  fontSize: '14px',
  margin: '10px 0 5px 0',
  fontWeight: '500',
}

const walletNumber = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0',
  fontWeight: '600',
  textAlign: 'center' as const,
}

const divider = {
  borderColor: '#f59e0b',
  margin: '15px 0',
}

const actionSection = {
  backgroundColor: '#fee2e2',
  border: '2px solid #ef4444',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
  textAlign: 'center' as const,
}

const actionTitle = {
  color: '#dc2626',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 15px 0',
}

const actionText = {
  color: '#7f1d1d',
  fontSize: '16px',
  margin: '0 0 20px 0',
  lineHeight: '1.5',
}

const buttonSection = {
  margin: '20px 0',
}

const topUpButton = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
  border: 'none',
  cursor: 'pointer',
}

const consequencesSection = {
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
}

const consequencesTitle = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px 0',
  textAlign: 'right' as const,
}

const consequencesList = {
  color: '#475569',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.8',
  textAlign: 'right' as const,
}

const paymentSection = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #10b981',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
}

const paymentTitle = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px 0',
  textAlign: 'right' as const,
}

const paymentMethods = {
  color: '#065f46',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.8',
  textAlign: 'right' as const,
}

const supportSection = {
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const supportTitle = {
  color: '#1d4ed8',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px 0',
}

const supportText = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0 0 15px 0',
}

const supportContact = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
}

const footer = {
  borderTop: '1px solid #e2e8f0',
  paddingTop: '20px',
  marginTop: '30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#475569',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px 0',
}

const footerContact = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 15px 0',
}

const footerDivider = {
  borderColor: '#e2e8f0',
  margin: '15px 0',
}

const disclaimer = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
}

export default BalanceAlertEmail