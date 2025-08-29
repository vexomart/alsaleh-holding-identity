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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  date: string
  description: string
}

interface TransactionSummaryEmailProps {
  customerName: string
  walletNumber: string
  currentBalance: number
  currency: string
  period: string
  transactions: Transaction[]
  totalDeposits: number
  totalWithdrawals: number
}

export const TransactionSummaryEmail = ({
  customerName,
  walletNumber,
  currentBalance,
  currency,
  period,
  transactions,
  totalDeposits,
  totalWithdrawals,
}: TransactionSummaryEmailProps) => (
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
    <Preview>ملخص معاملات محفظتك الرقمية - {period}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={bankTitle}>علي الشهري القابضة</Heading>
              <Text style={subtitle}>ملخص المعاملات الشهري</Text>
            </Column>
          </Row>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={mainHeading}>
            عزيزي {customerName}،
          </Heading>
          
          <Text style={welcomeText}>
            إليك ملخص معاملات محفظتك الرقمية خلال فترة {period}:
          </Text>

          {/* Summary Cards */}
          <Section style={summarySection}>
            <Row>
              <Column style={summaryCard}>
                <Text style={cardTitle}>الرصيد الحالي</Text>
                <Text style={balanceAmount}>
                  {currentBalance.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
              <Column style={summaryCard}>
                <Text style={cardTitle}>رقم المحفظة</Text>
                <Text style={walletNumberText}>{walletNumber}</Text>
              </Column>
            </Row>
            
            <Row style={{ marginTop: '15px' }}>
              <Column style={summaryCardGreen}>
                <Text style={cardTitle}>إجمالي الإيداعات</Text>
                <Text style={depositAmount}>
                  +{totalDeposits.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
              <Column style={summaryCardRed}>
                <Text style={cardTitle}>إجمالي السحوبات</Text>
                <Text style={withdrawalAmount}>
                  -{totalWithdrawals.toLocaleString('ar-SA')} {currency}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Transactions List */}
          <Section style={transactionsSection}>
            <Heading style={sectionTitle}>تفاصيل المعاملات</Heading>
            
            {transactions.length > 0 ? (
              <>
                {/* Table Header */}
                <Row style={tableHeader}>
                  <Column style={headerCell}>النوع</Column>
                  <Column style={headerCell}>المبلغ</Column>
                  <Column style={headerCell}>التاريخ</Column>
                  <Column style={headerCell}>الوصف</Column>
                </Row>
                
                {/* Transaction Rows */}
                {transactions.map((transaction, index) => (
                  <Row key={transaction.id} style={index % 2 === 0 ? tableRowEven : tableRowOdd}>
                    <Column style={tableCell}>
                      <Text style={transaction.type === 'deposit' ? depositType : withdrawalType}>
                        {transaction.type === 'deposit' ? '↗️ إيداع' : '↙️ سحب'}
                      </Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={transaction.type === 'deposit' ? depositAmountSmall : withdrawalAmountSmall}>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {transaction.amount.toLocaleString('ar-SA')} {currency}
                      </Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={dateCellText}>{transaction.date}</Text>
                    </Column>
                    <Column style={tableCell}>
                      <Text style={descriptionText}>{transaction.description}</Text>
                    </Column>
                  </Row>
                ))}
              </>
            ) : (
              <Section style={noTransactionsSection}>
                <Text style={noTransactionsText}>
                  لم يتم إجراء أي معاملات خلال هذه الفترة
                </Text>
              </Section>
            )}
          </Section>

          <Text style={noteText}>
            احتفظ بهذا الملخص لسجلاتك الشخصية. يمكنك مراجعة معاملاتك في أي وقت من خلال تطبيق المحفظة الرقمية.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            مع تحيات فريق علي الشهري القابضة
          </Text>
          <Text style={footerContact}>
            للاستفسارات: wallet@alialshehriholding.com | +966 XX XXX XXXX
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
  maxWidth: '700px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
}

const header = {
  backgroundColor: '#6366f1',
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
  color: '#c7d2fe',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
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

const summarySection = {
  margin: '25px 0',
}

const summaryCard = {
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '15px',
  margin: '0 5px',
  textAlign: 'center' as const,
  width: '45%',
}

const summaryCardGreen = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #10b981',
  borderRadius: '8px',
  padding: '15px',
  margin: '0 5px',
  textAlign: 'center' as const,
  width: '45%',
}

const summaryCardRed = {
  backgroundColor: '#fef2f2',
  border: '1px solid #ef4444',
  borderRadius: '8px',
  padding: '15px',
  margin: '0 5px',
  textAlign: 'center' as const,
  width: '45%',
}

const cardTitle = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontWeight: '500',
}

const balanceAmount = {
  color: '#1e40af',
  fontSize: '18px',
  margin: '0',
  fontWeight: '700',
}

const walletNumberText = {
  color: '#1e293b',
  fontSize: '14px',
  margin: '0',
  fontWeight: '600',
}

const depositAmount = {
  color: '#059669',
  fontSize: '16px',
  margin: '0',
  fontWeight: '700',
}

const withdrawalAmount = {
  color: '#dc2626',
  fontSize: '16px',
  margin: '0',
  fontWeight: '700',
}

const transactionsSection = {
  margin: '30px 0',
}

const sectionTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '20px',
  textAlign: 'right' as const,
}

const tableHeader = {
  backgroundColor: '#f1f5f9',
  borderRadius: '6px 6px 0 0',
  padding: '12px 0',
}

const headerCell = {
  color: '#475569',
  fontSize: '14px',
  fontWeight: '600',
  padding: '10px 15px',
  textAlign: 'center' as const,
  width: '25%',
}

const tableRowEven = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
}

const tableRowOdd = {
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
}

const tableCell = {
  padding: '12px 15px',
  textAlign: 'center' as const,
  width: '25%',
}

const depositType = {
  color: '#059669',
  fontSize: '13px',
  margin: '0',
  fontWeight: '600',
}

const withdrawalType = {
  color: '#dc2626',
  fontSize: '13px',
  margin: '0',
  fontWeight: '600',
}

const depositAmountSmall = {
  color: '#059669',
  fontSize: '13px',
  margin: '0',
  fontWeight: '600',
}

const withdrawalAmountSmall = {
  color: '#dc2626',
  fontSize: '13px',
  margin: '0',
  fontWeight: '600',
}

const dateCellText = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
}

const descriptionText = {
  color: '#475569',
  fontSize: '12px',
  margin: '0',
}

const noTransactionsSection = {
  textAlign: 'center' as const,
  padding: '30px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
}

const noTransactionsText = {
  color: '#64748b',
  fontSize: '16px',
  margin: '0',
  fontStyle: 'italic',
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
  marginTop: '25px',
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

export default TransactionSummaryEmail