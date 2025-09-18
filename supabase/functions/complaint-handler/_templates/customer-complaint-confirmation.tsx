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
  backgroundColor: '#f0f4f8',
  fontFamily: 'Cairo, Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
  lineHeight: '1.7',
  margin: '0',
  padding: '20px 10px',
  minHeight: '100vh',
}

const container = {
  backgroundColor: '#ffffff',
  border: '3px solid #e2e8f0',
  borderRadius: '24px',
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%',
  padding: '0',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
}

const header = {
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
  borderRadius: '24px 24px 0 0',
  padding: '50px 20px',
  textAlign: 'center' as const,
  position: 'relative' as const,
  overflow: 'hidden',
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
  padding: '25px 20px',
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
  border: '3px solid #3b82f6',
  borderRadius: '20px',
  padding: '30px 20px',
  margin: '20px 20px',
  textAlign: 'center' as const,
  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)',
  position: 'relative',
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
  marginBottom: '16px',
  display: 'block',
}

const labelColumn = {
  width: '100%',
  verticalAlign: 'top',
  display: 'block',
  marginBottom: '5px',
}

const valueColumn = {
  width: '100%',
  display: 'block',
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
  border: '3px solid #bbf7d0',
  borderRadius: '20px',
  padding: '30px 20px',
  margin: '0 20px 20px 20px',
  boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)',
  position: 'relative',
}

const contactBox = {
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  border: '3px solid #fcd34d',
  borderRadius: '20px',
  padding: '30px 20px',
  margin: '0 20px 30px 20px',
  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.15)',
  position: 'relative',
}

const hr = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '20px 0',
}

const footer = {
  padding: '30px 20px',
  backgroundColor: '#f8fafc',
  borderRadius: '0 0 24px 24px',
  borderTop: '3px solid #e2e8f0',
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
  marginTop: '25px',
  textAlign: 'center' as const,
  display: 'block',
}

const primaryButton = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '12px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: 'Cairo, Arial, sans-serif',
  textAlign: 'center' as const,
  margin: '10px',
  minWidth: '200px',
  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
  transform: 'translateY(0)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#3b82f6',
  padding: '16px 32px',
  borderRadius: '12px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: 'Cairo, Arial, sans-serif',
  textAlign: 'center' as const,
  border: '3px solid #3b82f6',
  margin: '10px',
  minWidth: '200px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}

const contactRow = {
  display: 'block',
  textAlign: 'center' as const,
}

const contactItem = {
  textAlign: 'center' as const,
  margin: '15px 0',
  padding: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '12px',
  border: '2px solid rgba(251, 191, 36, 0.3)',
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