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
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WalletDepositEmailProps {
  customerName: string
  amount: number
  currency: string
  newBalance: number
  transactionId: string
  date: string
  walletNumber: string
}

export const WalletDepositEmail = ({
  customerName,
  amount,
  currency,
  newBalance,
  transactionId,
  date,
  walletNumber,
}: WalletDepositEmailProps) => (
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
    <Preview>تم إيداع {amount} {currency} في محفظتك الرقمية</Preview>
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

        {/* Success Banner */}
        <Section style={successBanner}>
          <Text style={successText}>✅ تم الإيداع بنجاح</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={mainHeading}>
            عزيزي {customerName}،
          </Heading>
          
          <Text style={welcomeText}>
            تم إيداع مبلغ في محفظتك الرقمية بنجاح. إليك تفاصيل العملية:
          </Text>

          {/* Transaction Details */}
          <Section style={transactionBox}>
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>المبلغ المودع:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={amountValue}>
                  {amount.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
            </Row>
            
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الرصيد الجديد:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={balanceValue}>
                  {newBalance.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
            </Row>
            
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم المحفظة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{walletNumber}</Text>
              </Column>
            </Row>
            
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم العملية:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{transactionId}</Text>
              </Column>
            </Row>
            
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>تاريخ العملية:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{date}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={noteText}>
            يمكنك الآن استخدام رصيدك في المحفظة لإجراء المدفوعات والمعاملات المختلفة.
          </Text>
        </Section>

        {/* Security Note */}
        <Section style={securitySection}>
          <Text style={securityTitle}>🔒 ملاحظة أمنية</Text>
          <Text style={securityText}>
            إذا لم تقم بهذه العملية، يرجى التواصل معنا فوراً على البريد الإلكتروني أو الهاتف.
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
  backgroundColor: '#1e40af',
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
  color: '#bfdbfe',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
}

const successBanner = {
  backgroundColor: '#10b981',
  padding: '15px',
  textAlign: 'center' as const,
  borderRadius: '4px',
  margin: '20px 0',
}

const successText = {
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

const welcomeText = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '25px',
  textAlign: 'right' as const,
}

const transactionBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const detailRow = {
  marginBottom: '10px',
}

const labelColumn = {
  width: '40%',
  paddingRight: '10px',
}

const valueColumn = {
  width: '60%',
  textAlign: 'left' as const,
}

const label = {
  color: '#64748b',
  fontSize: '14px',
  margin: '5px 0',
  fontWeight: '500',
}

const value = {
  color: '#1e293b',
  fontSize: '14px',
  margin: '5px 0',
  fontWeight: '600',
}

const amountValue = {
  color: '#10b981',
  fontSize: '18px',
  margin: '5px 0',
  fontWeight: '700',
}

const balanceValue = {
  color: '#1e40af',
  fontSize: '16px',
  margin: '5px 0',
  fontWeight: '700',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '10px 0',
}

const noteText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'right' as const,
  backgroundColor: '#eff6ff',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #bfdbfe',
}

const securitySection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
}

const securityTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px 0',
  textAlign: 'right' as const,
}

const securityText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0',
  textAlign: 'right' as const,
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

export default WalletDepositEmail