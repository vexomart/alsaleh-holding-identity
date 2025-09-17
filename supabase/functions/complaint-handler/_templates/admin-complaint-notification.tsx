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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AdminComplaintNotificationProps {
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  categoryText: string;
  priorityText: string;
}

export const AdminComplaintNotification = ({
  ticketNumber,
  customerName,
  customerEmail,
  customerPhone,
  title,
  description,
  priority,
  category,
  categoryText,
  priorityText,
}: AdminComplaintNotificationProps) => (
  <Html>
    <Head />
    <Preview>شكوى جديدة #{ticketNumber} من {customerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        
        {/* Header */}
        <Section style={[header, getPriorityHeaderStyle(priority)]}>
          <Heading style={h1}>🚨 شكوى جديدة</Heading>
          <Text style={subtitle}>نظام إدارة الشكاوي - ASH HOLDING</Text>
        </Section>

        {/* Alert */}
        <Section style={[alertBox, getPriorityAlertStyle(priority)]}>
          <Text style={alertText}>
            تم استلام شكوى جديدة بأولوية <strong>{priorityText}</strong>
          </Text>
        </Section>

        {/* Ticket Info */}
        <Section style={ticketBox}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <Text style={ticketLabel}>رقم التذكرة</Text>
              <Text style={ticketNumber}>{ticketNumber}</Text>
            </Column>
          </Row>
        </Section>

        {/* Customer Info */}
        <Section style={section}>
          <Heading style={h3}>معلومات العميل</Heading>
          
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
              <Text style={value}>{customerEmail}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>الهاتف:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{customerPhone}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

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

          <Text style={label}>وصف الشكوى:</Text>
          <Text style={description}>{description}</Text>
        </Section>

        {/* Action Required */}
        <Section style={actionBox}>
          <Heading style={h4}>الإجراء المطلوب</Heading>
          <Text style={text}>
            • مراجعة الشكوى والتصنيف<br/>
            • التواصل مع العميل خلال {getResponseTime(priority)}<br/>
            • تسجيل الحل المقترح<br/>
            • متابعة رضا العميل
          </Text>
        </Section>

        {/* Response Time */}
        <Section style={[timeBox, getPriorityTimeStyle(priority)]}>
          <Text style={timeText}>
            ⏰ وقت الاستجابة المطلوب: <strong>{getResponseTime(priority)}</strong>
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            تم إرسال هذا الإشعار تلقائياً من نظام إدارة الشكاوي<br/>
            ASH HOLDING - نظام الدعم الفني<br/>
            تاريخ الإرسال: {new Date().toLocaleString('ar-SA')}
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
)

const getResponseTime = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'خلال ساعة واحدة';
    case 'medium':
      return 'خلال 4 ساعات';
    case 'low':
      return 'خلال 24 ساعة';
    default:
      return 'خلال 24 ساعة';
  }
};

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

const getPriorityHeaderStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#dc2626' };
    case 'medium':
      return { backgroundColor: '#ea580c' };
    case 'low':
      return { backgroundColor: '#16a34a' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const getPriorityAlertStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#fef2f2', border: '2px solid #dc2626' };
    case 'medium':
      return { backgroundColor: '#fff7ed', border: '2px solid #ea580c' };
    case 'low':
      return { backgroundColor: '#f0fdf4', border: '2px solid #16a34a' };
    default:
      return { backgroundColor: '#f9fafb', border: '2px solid #6b7280' };
  }
};

const getPriorityTimeStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#fef2f2', borderLeft: '4px solid #dc2626' };
    case 'medium':
      return { backgroundColor: '#fff7ed', borderLeft: '4px solid #ea580c' };
    case 'low':
      return { backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' };
    default:
      return { backgroundColor: '#f9fafb', borderLeft: '4px solid #6b7280' };
  }
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  margin: '40px auto',
  maxWidth: '650px',
  padding: '0',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
}

const header = {
  borderRadius: '12px 12px 0 0',
  padding: '30px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  fontFamily: 'Arial, sans-serif',
}

const subtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
  opacity: 0.9,
  fontFamily: 'Arial, sans-serif',
}

const alertBox = {
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 30px',
  textAlign: 'center' as const,
}

const alertText = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
}

const section = {
  padding: '30px',
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
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 30px',
  textAlign: 'center' as const,
}

const ticketLabel = {
  color: '#bfdbfe',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontFamily: 'Arial, sans-serif',
}

const ticketNumber = {
  color: '#ffffff',
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

const description = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '1.6',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  margin: '8px 0 0 0',
  fontFamily: 'Arial, sans-serif',
}

const actionBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 30px 20px 30px',
}

const timeBox = {
  borderRadius: '8px',
  padding: '16px',
  margin: '0 30px 30px 30px',
}

const timeText = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Arial, sans-serif',
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

export default AdminComplaintNotification