import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface CustomerTicketConfirmationProps {
  ticketNumber: string;
  customerName: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  categoryText: string;
  priorityText: string;
}

export const CustomerTicketConfirmation = ({
  ticketNumber,
  customerName,
  title,
  description,
  priority,
  category,
  categoryText,
  priorityText,
}: CustomerTicketConfirmationProps) => (
  <Html dir="rtl">
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
        body { font-family: 'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>
    </Head>
    <Preview>تأكيد استلام تذكرة الدعم #{ticketNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={headerTitle}>✅ تم استلام تذكرتك بنجاح</Heading>
              <Text style={headerSubtitle}>#{ticketNumber}</Text>
            </Column>
          </Row>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>السلام عليكم {customerName}،</Text>
          
          <Text style={paragraph}>
            نشكرك على التواصل معنا! تم استلام تذكرة الدعم الخاصة بك بنجاح وسيقوم فريقنا المختص بمراجعتها والرد عليك في أقرب وقت ممكن.
          </Text>

          {/* Ticket Details Card */}
          <Section style={ticketCard}>
            <Heading style={cardTitle}>📋 تفاصيل التذكرة</Heading>
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم التذكرة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>#{ticketNumber}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الموضوع:</Text>
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
                <Text style={{...value, ...categoryBadge}}>{categoryText}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الأولوية:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={{...value, ...getPriorityStyle(priority)}}>{priorityText}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الحالة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={{...value, ...statusOpen}}>🟢 مفتوح - قيد المراجعة</Text>
              </Column>
            </Row>

            <Hr style={divider} />
            
            <Text style={label}>وصف المشكلة:</Text>
            <Section style={descriptionBox}>
              <Text style={description}>{description}</Text>
            </Section>
          </Section>

          {/* Action Button */}
          <Section style={buttonContainer}>
            <Button style={primaryButton} href="#">
              📱 متابعة التذكرة
            </Button>
          </Section>

          {/* Additional Info */}
          <Section style={infoBox}>
            <Text style={infoText}>
              💡 <strong>نصائح مهمة:</strong>
            </Text>
            <Text style={infoText}>
              • احتفظ برقم التذكرة #{ticketNumber} للمراجع المستقبلية
            </Text>
            <Text style={infoText}>
              • ستتلقى إشعاراً فور الرد على تذكرتك
            </Text>
            <Text style={infoText}>
              • يمكنك متابعة حالة التذكرة من خلال لوحة التحكم
            </Text>
          </Section>

          <Text style={paragraph}>
            نحن هنا لخدمتك على مدار الساعة. إذا كان لديك أي استفسارات إضافية، لا تتردد في التواصل معنا.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={footerDivider} />
          <Text style={footerText}>
            مع أطيب التحيات،<br />
            <strong>فريق الدعم الفني</strong><br />
            شركة علي صالح الشهري القابضة
          </Text>
          <Text style={footerSubtext}>
            📧 support@alialsheehrholding.com | 📞 +966 XX XXX XXXX
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { color: '#dc2626', backgroundColor: '#fef2f2', padding: '4px 8px', borderRadius: '4px' };
    case 'medium':
      return { color: '#d97706', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '4px' };
    case 'low':
      return { color: '#059669', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '4px' };
    default:
      return { color: '#6b7280' };
  }
};

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: "'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif",
  direction: 'rtl' as const,
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#3b82f6',
  borderRadius: '12px 12px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
}

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 24px 0',
}

const ticketCard = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  borderRight: '6px solid #3b82f6',
}

const cardTitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 20px 0',
}

const detailRow = {
  margin: '0 0 12px 0',
}

const labelColumn = {
  width: '30%',
  verticalAlign: 'top' as const,
}

const valueColumn = {
  width: '70%',
  verticalAlign: 'top' as const,
}

const label = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  margin: '0',
}

const value = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '0',
  fontWeight: '500',
}

const categoryBadge = {
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
  padding: '4px 8px',
  borderRadius: '4px',
}

const statusOpen = {
  backgroundColor: '#f0fdf4',
  color: '#059669',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: '600',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const descriptionBox = {
  backgroundColor: '#f1f5f9',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  margin: '8px 0 0 0',
}

const description = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#374151',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const primaryButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  border: 'none',
}

const infoBox = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const infoText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0 0 8px 0',
  lineHeight: '20px',
}

const footer = {
  textAlign: 'center' as const,
  margin: '32px 0 0 0',
}

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '32px 0 24px 0',
}

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '20px',
  margin: '0 0 12px 0',
}

const footerSubtext = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
}

export default CustomerTicketConfirmation