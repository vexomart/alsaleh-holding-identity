import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AdminTicketNotificationProps {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  categoryText: string;
  priorityText: string;
}

export const AdminTicketNotification = ({
  ticketNumber,
  customerName,
  customerEmail,
  title,
  description,
  priority,
  category,
  categoryText,
  priorityText,
}: AdminTicketNotificationProps) => (
  <Html dir="rtl">
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
        body { font-family: 'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>
    </Head>
    <Preview>🚨 تذكرة دعم جديدة #{ticketNumber} - {title}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Alert Header */}
        <Section style={{...header, ...getHeaderStyle(priority)}}>
          <Row>
            <Column>
              <Heading style={headerTitle}>
                {getUrgencyIcon(priority)} تذكرة دعم جديدة
              </Heading>
              <Text style={headerSubtitle}>#{ticketNumber}</Text>
              <Text style={urgencyBadge}>
                {getUrgencyText(priority)}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={alertText}>
            📥 <strong>تم إنشاء تذكرة دعم جديدة تحتاج إلى مراجعة فورية</strong>
          </Text>
          
          {/* Customer Info Card */}
          <Section style={customerCard}>
            <Heading style={cardTitle}>👤 معلومات العميل</Heading>
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الاسم:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{customerName}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>البريد الإلكتروني:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={{...value, ...emailStyle}}>{customerEmail}</Text>
              </Column>
            </Row>
          </Section>

          {/* Ticket Details Card */}
          <Section style={{...ticketCard, ...getTicketCardStyle(priority)}}>
            <Heading style={cardTitle}>🎫 تفاصيل التذكرة</Heading>
            
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم التذكرة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={ticketNumber}>{ticketNumber}</Text>
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
                <Text style={label}>تاريخ الإنشاء:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{new Date().toLocaleDateString('ar-SA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</Text>
              </Column>
            </Row>

            <Hr style={divider} />
            
            <Text style={label}>وصف المشكلة:</Text>
            <Section style={descriptionBox}>
              <Text style={description}>{description}</Text>
            </Section>
          </Section>

          {/* Action Buttons */}
          <Section style={buttonContainer}>
            <Button style={{...primaryButton, ...getActionButtonStyle(priority)}} href="#">
              🚀 فتح لوحة الإدارة
            </Button>
            <Button style={secondaryButton} href={`mailto:${customerEmail}`}>
              📧 الرد المباشر
            </Button>
          </Section>

          {/* SLA Warning */}
          <Section style={{...slaBox, ...getSLAStyle(priority)}}>
            <Text style={slaText}>
              ⏰ <strong>تذكير SLA:</strong>
            </Text>
            <Text style={slaText}>
              {getSLAMessage(priority)}
            </Text>
          </Section>

          {/* Quick Actions */}
          <Section style={quickActions}>
            <Heading style={quickActionsTitle}>⚡ إجراءات سريعة</Heading>
            <Text style={quickActionItem}>• تعيين التذكرة لعضو الفريق المناسب</Text>
            <Text style={quickActionItem}>• إضافة ملاحظات داخلية</Text>
            <Text style={quickActionItem}>• تحديث الأولوية حسب الحاجة</Text>
            <Text style={quickActionItem}>• إرسال رد أولي للعميل</Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={footerDivider} />
          <Text style={footerText}>
            نظام إدارة التذاكر<br />
            <strong>شركة علي صالح الشهري القابضة</strong>
          </Text>
          <Text style={footerSubtext}>
            هذا إشعار تلقائي من نظام إدارة تذاكر الدعم
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Helper functions
const getUrgencyIcon = (priority: string) => {
  switch (priority) {
    case 'high': return '🚨';
    case 'medium': return '⚠️';
    case 'low': return '📝';
    default: return '📋';
  }
};

const getUrgencyText = (priority: string) => {
  switch (priority) {
    case 'high': return 'عاجل - يتطلب استجابة فورية';
    case 'medium': return 'متوسط - استجابة خلال ساعات';
    case 'low': return 'عادي - استجابة خلال يوم';
    default: return 'عادي';
  }
};

const getHeaderStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#dc2626' };
    case 'medium':
      return { backgroundColor: '#d97706' };
    case 'low':
      return { backgroundColor: '#059669' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const getTicketCardStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { borderRight: '6px solid #dc2626' };
    case 'medium':
      return { borderRight: '6px solid #d97706' };
    case 'low':
      return { borderRight: '6px solid #059669' };
    default:
      return { borderRight: '6px solid #6b7280' };
  }
};

const getActionButtonStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#dc2626' };
    case 'medium':
      return { backgroundColor: '#d97706' };
    case 'low':
      return { backgroundColor: '#059669' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const getSLAStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#fef2f2', borderColor: '#fca5a5' };
    case 'medium':
      return { backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
    case 'low':
      return { backgroundColor: '#f0fdf4', borderColor: '#86efac' };
    default:
      return { backgroundColor: '#f9fafb', borderColor: '#d1d5db' };
  }
};

const getSLAMessage = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'يجب الرد خلال 1 ساعة كحد أقصى';
    case 'medium':
      return 'يجب الرد خلال 4 ساعات كحد أقصى';
    case 'low':
      return 'يجب الرد خلال 24 ساعة كحد أقصى';
    default:
      return 'يجب الرد وفقاً لسياسة SLA';
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { color: '#dc2626', backgroundColor: '#fef2f2', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' };
    case 'medium':
      return { color: '#d97706', backgroundColor: '#fffbeb', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' };
    case 'low':
      return { color: '#059669', backgroundColor: '#f0fdf4', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' };
    default:
      return { color: '#6b7280', fontWeight: '600' };
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
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0 0 12px 0',
}

const urgencyBadge = {
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
}

const alertText = {
  fontSize: '16px',
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  margin: '0 0 24px 0',
  border: '1px solid #fca5a5',
}

const customerCard = {
  backgroundColor: '#eff6ff',
  border: '2px solid #bfdbfe',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const ticketCard = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const cardTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 20px 0',
}

const detailRow = {
  margin: '0 0 12px 0',
}

const labelColumn = {
  width: '35%',
  verticalAlign: 'top' as const,
}

const valueColumn = {
  width: '65%',
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

const ticketNumber = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0',
  fontWeight: '700',
  backgroundColor: '#f3f4f6',
  padding: '4px 8px',
  borderRadius: '4px',
}

const emailStyle = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const categoryBadge = {
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
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
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  border: 'none',
  margin: '0 8px 8px 0',
}

const secondaryButton = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  border: '2px solid #d1d5db',
  margin: '0 8px 8px 0',
}

const slaBox = {
  border: '2px solid',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const slaText = {
  fontSize: '14px',
  margin: '0 0 8px 0',
  lineHeight: '20px',
}

const quickActions = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const quickActionsTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0',
}

const quickActionItem = {
  fontSize: '14px',
  color: '#374151',
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

export default AdminTicketNotification