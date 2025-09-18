import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface CustomerComplaintConfirmationProps {
  ticketNumber: string;
  customerName: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  categoryText: string;
  priorityText: string;
}

export const CustomerComplaintConfirmation = ({
  ticketNumber,
  customerName,
  title,
  description,
  priority,
  category,
  categoryText,
  priorityText,
}: CustomerComplaintConfirmationProps) => (
  <Html>
    <Head />
    <Preview>تأكيد استلام شكواك #{ticketNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        
        {/* Header */}
        <Section style={header}>
          <Heading style={h1}>ASH HOLDING</Heading>
          <Text style={subtitle}>نظام إدارة الشكاوي</Text>
        </Section>

        {/* Greeting */}
        <Section style={section}>
          <Heading style={h2}>عزيزي/عزيزتي {customerName}</Heading>
          <Text style={text}>
            تم استلام شكواك بنجاح. نقدر لك التواصل معنا ونؤكد لك أننا سنتعامل مع شكواك بكل جدية واهتمام.
          </Text>
        </Section>

        {/* Ticket Info */}
        <Section style={ticketBox}>
          <Row>
            <Column>
              <Text style={ticketLabel}>رقم التذكرة:</Text>
              <Text style={ticketNumber}>{ticketNumber}</Text>
            </Column>
          </Row>
        </Section>

        {/* Complaint Details */}
        <Section style={section}>
          <Heading style={h3}>تفاصيل الشكوى</Heading>
          
          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>العنوان:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{title}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>الفئة:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{categoryText}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>الأولوية:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={[value, getPriorityStyle(priority)]}>{priorityText}</Text>
            </Column>
          </Row>

          <Hr style={hr} />

          <Text style={label}>الوصف:</Text>
          <Text style={descriptionBox}>{description}</Text>
        </Section>

        {/* Next Steps */}
        <Section style={nextStepsBox}>
          <Heading style={h3}>الخطوات القادمة</Heading>
          <Text style={text}>
            • سيقوم فريقنا المتخصص بمراجعة شكواك خلال 24 ساعة<br/>
            • ستتلقى تحديثات دورية حول حالة شكواك<br/>
            • سنتواصل معك عبر البريد الإلكتروني أو الهاتف<br/>
            • يمكنك الرد على هذا البريد للمتابعة
          </Text>
          
          <Row style={buttonRow}>
            <Column>
              <Link
                href={`mailto:info@alialshehriholding.com?subject=متابعة الشكوى ${ticketNumber}`}
                style={primaryButton}
              >
                متابعة الشكوى
              </Link>
            </Column>
            <Column style={{ width: '20px' }} />
            <Column>
              <Link
                href="https://alialshehriholding.com/support"
                style={secondaryButton}
              >
                مركز المساعدة
              </Link>
            </Column>
          </Row>
        </Section>

        {/* Contact Info */}
        <Section style={contactBox}>
          <Heading style={h4}>للاستفسارات العاجلة</Heading>
          <Row style={contactRow}>
            <Column style={contactItem}>
              <Text style={contactIcon}>📞</Text>
              <Text style={contactText}>0555812567</Text>
            </Column>
            <Column style={contactItem}>
              <Text style={contactIcon}>📧</Text>
              <Text style={contactText}>info@alialshehriholding.com</Text>
            </Column>
            <Column style={contactItem}>
              <Text style={contactIcon}>🌐</Text>
              <Text style={contactText}>alialshehriholding.com</Text>
            </Column>
          </Row>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            شكراً لك على ثقتك في ASH HOLDING<br/>
            هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
)

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { color: '#dc2626', fontWeight: 'bold' };
    case 'medium':
      return { color: '#ea580c', fontWeight: 'bold' };
    case 'low':
      return { color: '#16a34a', fontWeight: 'bold' };
    default:
      return { color: '#6b7280' };
  }
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
  lineHeight: '1.6',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  margin: '20px auto',
  maxWidth: '600px',
  padding: '0',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
}

const header = {
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  borderRadius: '16px 16px 0 0',
  padding: '40px 30px',
  textAlign: 'center' as const,
  position: 'relative' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  fontFamily: 'Arial, sans-serif',
}

const subtitle = {
  color: '#cbd5e1',
  fontSize: '16px',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

const section = {
  padding: '30px',
}

const h2 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  fontFamily: 'Arial, sans-serif',
}

const h3 = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  fontFamily: 'Arial, sans-serif',
}

const h4 = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  fontFamily: 'Arial, sans-serif',
}

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  fontFamily: 'Arial, sans-serif',
}

const ticketBox = {
  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  border: '2px solid #3b82f6',
  borderRadius: '12px',
  padding: '24px',
  margin: '20px 30px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
}

const ticketLabel = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontFamily: 'Arial, sans-serif',
}

const ticketNumber = {
  color: '#3b82f6',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

const detailRow = {
  marginBottom: '12px',
}

const labelColumn = {
  width: '30%',
  verticalAlign: 'top',
}

const valueColumn = {
  width: '70%',
}

const label = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

const value = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

const descriptionBox = {
  color: '#475569',
  fontSize: '16',
  lineHeight: '1.6',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  margin: '8px 0 0 0',
  fontFamily: 'Arial, sans-serif',
}

const nextStepsBox = {
  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  border: '1px solid #bbf7d0',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 30px 20px 30px',
  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
}

const contactBox = {
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  border: '1px solid #fcd34d',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 30px 30px 30px',
  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.1)',
}

const hr = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '20px 0',
}

const footer = {
  padding: '30px',
  backgroundColor: '#f8fafc',
  borderRadius: '0 0 12px 12px',
}

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
  fontFamily: 'Arial, sans-serif',
}

// New styles for buttons and responsive design
const buttonRow = {
  marginTop: '20px',
  textAlign: 'center' as const,
}

const primaryButton = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center' as const,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
}

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#3b82f6',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center' as const,
  border: '2px solid #3b82f6',
  transition: 'all 0.3s ease',
}

const contactRow = {
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap' as const,
  gap: '16px',
}

const contactItem = {
  textAlign: 'center' as const,
  flex: '1',
  minWidth: '120px',
}

const contactIcon = {
  fontSize: '24px',
  margin: '0 0 8px 0',
  display: 'block',
}

const contactText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

export default CustomerComplaintConfirmation