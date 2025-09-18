import React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from 'npm:@react-email/components@0.0.22';

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
}: AdminComplaintNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>🚨 شكوى جديدة #{ticketNumber} - {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={header}>
            <Heading style={h1}>شكوى جديدة واردة</Heading>
            <Text style={subtitle}>نظام إدارة الشكاوي - ASH HOLDING</Text>
            <Text style={urgent}>أولوية: {priorityText}</Text>
          </Section>

          <Section style={ticketSection}>
            <Text style={ticketLabel}>رقم التذكرة</Text>
            <Text style={ticketNumber}>{ticketNumber}</Text>
          </Section>

          <Section style={customerSection}>
            <Heading style={sectionTitle}>معلومات العميل</Heading>
            <Text style={customerInfo}>الاسم: {customerName}</Text>
            <Text style={customerInfo}>البريد: {customerEmail}</Text>
            <Text style={customerInfo}>الهاتف: {customerPhone}</Text>
          </Section>

          <Section style={complaintSection}>
            <Heading style={sectionTitle}>تفاصيل الشكوى</Heading>
            <Text style={complaintTitle}>العنوان: {title}</Text>
            <Text style={complaintCategory}>الفئة: {categoryText}</Text>
            <Text style={complaintPriority}>الأولوية: {priorityText}</Text>
            <Text style={complaintDescription}>{description}</Text>
          </Section>

          <Section style={actionSection}>
            <Link href={`mailto:${customerEmail}?subject=رد على شكواك ${ticketNumber}`} style={actionButton}>
              الرد على العميل
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>ASH HOLDING - نظام إدارة الشكاوي</Text>
            <Text style={footerTime}>{new Date().toLocaleString('ar-SA')}</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: 'Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '40px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#dc2626',
  padding: '30px',
  borderRadius: '8px',
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const subtitle = {
  color: '#fee2e2',
  fontSize: '14px',
  margin: '0 0 10px 0',
};

const urgent = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '8px 16px',
  borderRadius: '4px',
  display: 'inline-block',
};

const ticketSection = {
  backgroundColor: '#3b82f6',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const ticketLabel = {
  color: '#bfdbfe',
  fontSize: '14px',
  margin: '0 0 5px 0',
};

const ticketNumber = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '2px',
};

const customerSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const customerInfo = {
  color: '#374151',
  fontSize: '14px',
  margin: '0 0 8px 0',
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
};

const complaintSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const complaintTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const complaintCategory = {
  color: '#374151',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const complaintPriority = {
  color: '#dc2626',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const complaintDescription = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  padding: '15px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
};

const actionSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const actionButton = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block',
};

const footer = {
  textAlign: 'center' as const,
  paddingTop: '20px',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 5px 0',
};

const footerTime = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};