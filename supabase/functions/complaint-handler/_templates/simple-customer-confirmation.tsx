import * as React from 'npm:react@18.3.1'
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
    <Preview>✅ تم استلام شكواك - رقم التذكرة {ticketNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        
        {/* Premium Header */}
        <Section style={header}>
          <Heading style={h1}>ASH HOLDING</Heading>
          <Text style={subtitle}>نظام إدارة الشكاوي المتطور</Text>
          <Text style={headerTitle}>✅ تم استلام شكواك بنجاح</Text>
          <Text style={headerSubtitle}>نحن نقدر ثقتك بنا ونعتذر عن أي إزعاج</Text>
        </Section>

        {/* Success Status */}
        <Section style={statusSection}>
          <Text style={statusIcon}>✅</Text>
          <Text style={statusText}>تم استلام الشكوى</Text>
          <Text style={statusTime}>{new Date().toLocaleString('ar-SA')}</Text>
        </Section>

        {/* Greeting Card */}
        <Section style={greetingCard}>
          <Text style={greetingIcon}>👋</Text>
          <Heading style={h2}>مرحباً {customerName}</Heading>
          <Text style={greetingText}>
            نشكرك على تواصلك معنا. تم استلام شكواك وسيتم التعامل معها بأقصى درجات الاهتمام والسرعة. 
            فريقنا المختص يعمل الآن على حل المشكلة.
          </Text>
        </Section>

        {/* Modern Ticket Card */}
        <Section style={modernTicketCard}>
          <Row>
            <Column style={ticketIconColumn}>
              <Text style={ticketCardIcon}>🎫</Text>
            </Column>
            <Column style={ticketDetailsColumn}>
              <Text style={ticketCardLabel}>رقم التذكرة</Text>
              <Text style={ticketCardNumber}>{ticketNumber}</Text>
              <Text style={ticketCardStatus}>قيد المعالجة</Text>
            </Column>
          </Row>
        </Section>

        {/* Details Section */}
        <Section style={detailsSection}>
          <Heading style={sectionTitle}>📋 تفاصيل الشكوى</Heading>
          
          <Section style={detailCard}>
            <Text style={detailIcon}>📝</Text>
            <Text style={detailLabel}>العنوان</Text>
            <Text style={detailValue}>{title}</Text>
          </Section>
          
          <Section style={detailCard}>
            <Text style={detailIcon}>📂</Text>
            <Text style={detailLabel}>الفئة</Text>
            <Text style={detailValue}>{categoryText}</Text>
          </Section>
          
          <Section style={detailCard}>
            <Text style={detailIcon}>⚡</Text>
            <Text style={detailLabel}>الأولوية</Text>
            <Text style={[detailValue, getPriorityStyle(priority)]}>{priorityText}</Text>
          </Section>

          <Section style={descriptionCard}>
            <Text style={descriptionLabel}>📄 تفاصيل الشكوى</Text>
            <Text style={descriptionText}>{description}</Text>
          </Section>
        </Section>

        {/* Timeline Section */}
        <Section style={timelineSection}>
          <Heading style={sectionTitle}>⏰ خطة المعالجة</Heading>
          
          <Section style={timelineItem}>
            <Text style={timelineStep}>1</Text>
            <Section style={timelineContent}>
              <Text style={timelineTitle}>مراجعة فورية</Text>
              <Text style={timelineDesc}>تم استلام شكواك وبدء المعالجة</Text>
              <Text style={timelineTime}>مكتمل ✅</Text>
            </Section>
          </Section>
          
          <Section style={timelineItem}>
            <Text style={timelineStep}>2</Text>
            <Section style={timelineContent}>
              <Text style={timelineTitle}>التحليل والتقييم</Text>
              <Text style={timelineDesc}>دراسة الشكوى وتحديد الحلول</Text>
              <Text style={timelineTime}>خلال 4 ساعات 🔄</Text>
            </Section>
          </Section>
          
          <Section style={timelineItem}>
            <Text style={timelineStep}>3</Text>
            <Section style={timelineContent}>
              <Text style={timelineTitle}>التواصل والحل</Text>
              <Text style={timelineDesc}>التواصل معك وتطبيق الحل</Text>
              <Text style={timelineTime}>خلال 24 ساعة ⏳</Text>
            </Section>
          </Section>
        </Section>

        {/* Action Buttons */}
        <Section style={actionSection}>
          <Text style={actionTitle}>🚀 كيف يمكننا مساعدتك؟</Text>
          <Row style={actionRow}>
            <Column>
              <Link href={`mailto:info@ash-holding.sa?subject=متابعة الشكوى ${ticketNumber}`} style={primaryAction}>
                💬 متابعة الشكوى
              </Link>
            </Column>
            <Column>
              <Link href="https://ash-holding.sa/support" style={secondaryAction}>
                📚 مركز المساعدة
              </Link>
            </Column>
          </Row>
          <Row style={actionRow}>
            <Column>
              <Link href="tel:0555812567" style={emergencyAction}>
                📞 اتصال عاجل
              </Link>
            </Column>
          </Row>
        </Section>

        {/* Contact Cards */}
        <Section style={contactSection}>
          <Heading style={sectionTitle}>📞 طرق التواصل</Heading>
          
          <Section style={contactCard}>
            <Text style={contactCardIcon}>📞</Text>
            <Text style={contactCardTitle}>الهاتف</Text>
            <Text style={contactCardValue}>0555812567</Text>
            <Text style={contactCardDesc}>متاح 24/7</Text>
          </Section>
          
          <Section style={contactCard}>
            <Text style={contactCardIcon}>📧</Text>
            <Text style={contactCardTitle}>البريد الإلكتروني</Text>
            <Text style={contactCardValue}>info@ash-holding.sa</Text>
            <Text style={contactCardDesc}>رد خلال ساعة</Text>
          </Section>
          
          <Section style={contactCard}>
            <Text style={contactCardIcon}>🌐</Text>
            <Text style={contactCardTitle}>الموقع</Text>
            <Text style={contactCardValue}>ash-holding.sa</Text>
            <Text style={contactCardDesc}>مساعدة فورية</Text>
          </Section>
        </Section>

        {/* Premium Footer */}
        <Section style={premiumFooter}>
          <Text style={footerLogo}>ASH HOLDING</Text>
          <Text style={footerTagline}>الثقة والجودة في الخدمة</Text>
          <Text style={footerText}>
            شكراً لك على ثقتك في ASH HOLDING. نحن ملتزمون بتقديم أفضل خدمة عملاء.
          </Text>
          <Text style={footerNote}>
            تم إرسال هذا البريد تلقائياً في {new Date().toLocaleString('ar-SA')}
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

// Modern Premium Design System
const main = {
  backgroundColor: '#0f0f23',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
  lineHeight: '1.6',
  margin: '0',
  padding: '20px',
  minHeight: '100vh',
}

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '32px',
  margin: '0 auto',
  maxWidth: '680px',
  width: '100%',
  padding: '0',
  boxShadow: '0 40px 120px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  position: 'relative',
}

// Premium Header Styles
const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  padding: '60px 40px',
  textAlign: 'center' as const,
  position: 'relative' as const,
  overflow: 'hidden',
}

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '900',
  margin: '0 0 10px 0',
  letterSpacing: '2px',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
}

const subtitle = {
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 20px 0',
  letterSpacing: '2px',
  opacity: 0.9,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 15px 0',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
}

const headerSubtitle = {
  color: '#e2e8f0',
  fontSize: '16px',
  fontWeight: '400',
  margin: '0',
  opacity: 0.9,
}

// Status Section
const statusSection = {
  padding: '30px 40px',
  borderBottom: '1px solid #f1f5f9',
  textAlign: 'center' as const,
  backgroundColor: '#f0fdf4',
  border: '2px solid #22c55e',
  borderRadius: '20px',
  margin: '20px',
}

const statusIcon = {
  fontSize: '48px',
  margin: '0 0 15px 0',
  display: 'block',
}

const statusText = {
  color: '#15803d',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 10px 0',
}

const statusTime = {
  color: '#65a30d',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

// Greeting Card
const greetingCard = {
  backgroundColor: '#f8fafc',
  margin: '20px 40px',
  padding: '40px',
  borderRadius: '24px',
  border: '1px solid #e2e8f0',
  textAlign: 'center' as const,
}

const greetingIcon = {
  fontSize: '48px',
  margin: '0 0 20px 0',
  display: 'block',
}

const h2 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 20px 0',
}

const greetingText = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0',
}

// Modern Ticket Card
const modernTicketCard = {
  margin: '20px 40px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
}

const ticketIconColumn = {
  width: '80px',
  textAlign: 'center' as const,
}

const ticketCardIcon = {
  fontSize: '48px',
  color: '#ffffff',
  margin: '0',
  display: 'block',
}

const ticketDetailsColumn = {
  paddingLeft: '20px',
}

const ticketCardLabel = {
  color: '#bfdbfe',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px 0',
}

const ticketCardNumber = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
}

const ticketCardStatus = {
  color: '#93c5fd',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

// Details Section
const detailsSection = {
  padding: '40px',
}

const sectionTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 30px 0',
  textAlign: 'center' as const,
}

const detailCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '25px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
}

const detailIcon = {
  fontSize: '32px',
  margin: '0 0 15px 0',
  display: 'block',
}

const detailLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const detailValue = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

const descriptionCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '25px',
  margin: '20px 0',
}

const descriptionLabel = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 15px 0',
}

const descriptionText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0',
}

// Timeline Section
const timelineSection = {
  padding: '40px',
  backgroundColor: '#f8fafc',
}

const timelineItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '30px',
  position: 'relative' as const,
}

const timelineStep = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: '700',
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  marginRight: '20px',
}

const timelineContent = {
  flex: 1,
}

const timelineTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const timelineDesc = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 8px 0',
}

const timelineTime = {
  color: '#3b82f6',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
}

// Action Section
const actionSection = {
  padding: '40px',
  textAlign: 'center' as const,
}

const actionTitle = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 30px 0',
}

const actionRow = {
  marginBottom: '20px',
}

const primaryAction = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 10px 10px 10px',
  minWidth: '200px',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
  border: 'none',
}

const secondaryAction = {
  backgroundColor: '#ffffff',
  color: '#3b82f6',
  padding: '16px 32px',
  borderRadius: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 10px 10px 10px',
  minWidth: '200px',
  border: '2px solid #3b82f6',
}

const emergencyAction = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 10px 10px 10px',
  minWidth: '200px',
  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
  border: 'none',
}

// Contact Section
const contactSection = {
  padding: '40px',
  backgroundColor: '#f8fafc',
}

const contactCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '25px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  margin: '0 0 20px 0',
}

const contactCardIcon = {
  fontSize: '32px',
  margin: '0 0 15px 0',
  display: 'block',
}

const contactCardTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const contactCardValue = {
  color: '#3b82f6',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const contactCardDesc = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
}

// Premium Footer
const premiumFooter = {
  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  padding: '50px 40px',
  textAlign: 'center' as const,
}

const footerLogo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '800',
  margin: '0 0 10px 0',
  letterSpacing: '1px',
}

const footerTagline = {
  color: '#cbd5e1',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 20px 0',
}

const footerText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
}

const footerNote = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
}

export default CustomerComplaintConfirmation