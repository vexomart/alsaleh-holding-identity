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
    <Preview>🚨 شكوى جديدة عاجلة #{ticketNumber} - {customerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        
        {/* Dynamic Priority Header */}
        <Section style={[header, getPriorityHeaderStyle(priority)]}>
          <div style={headerContent}>
            <Text style={urgencyBadge}>{getUrgencyIcon(priority)} {getUrgencyText(priority)}</Text>
            <Heading style={h1}>شكوى جديدة واردة</Heading>
            <Text style={headerSubtitle}>نظام إدارة الشكاوي - ASH HOLDING</Text>
            <Text style={timeStamp}>تم الاستلام: {new Date().toLocaleString('ar-SA')}</Text>
          </div>
        </Section>

        {/* Critical Alert Banner */}
        <Section style={[criticalAlert, getPriorityAlertStyle(priority)]}>
          <div style={alertContent}>
            <Text style={alertIcon}>{getAlertIcon(priority)}</Text>
            <div style={alertTextContainer}>
              <Text style={alertTitle}>تنبيه: شكوى بأولوية {priorityText}</Text>
              <Text style={alertDesc}>مطلوب اتخاذ إجراء خلال {getResponseTime(priority)}</Text>
            </div>
          </div>
        </Section>

        {/* Modern Ticket Card */}
        <Section style={modernTicketSection}>
          <div style={ticketCard}>
            <div style={ticketHeader}>
              <Text style={ticketIcon}>🎫</Text>
              <div style={ticketDetails}>
                <Text style={ticketLabel}>رقم التذكرة</Text>
                <Text style={ticketNumber}>{ticketNumber}</Text>
              </div>
              <div style={[priorityBadge, getPriorityBadgeStyle(priority)]}>
                <Text style={priorityText}>{priorityText}</Text>
              </div>
            </div>
          </div>
        </Section>

        {/* Customer Profile Card */}
        <Section style={customerSection}>
          <div style={sectionHeader}>
            <Text style={sectionIcon}>👤</Text>
            <Heading style={sectionTitle}>ملف العميل</Heading>
          </div>
          
          <div style={customerCard}>
            <div style={customerInfo}>
              <div style={infoItem}>
                <Text style={infoIcon}>👤</Text>
                <div style={infoContent}>
                  <Text style={infoLabel}>اسم العميل</Text>
                  <Text style={infoValue}>{customerName}</Text>
                </div>
              </div>
              
              <div style={infoItem}>
                <Text style={infoIcon}>📧</Text>
                <div style={infoContent}>
                  <Text style={infoLabel}>البريد الإلكتروني</Text>
                  <Text style={infoValue}>{customerEmail}</Text>
                </div>
              </div>
              
              <div style={infoItem}>
                <Text style={infoIcon}>📱</Text>
                <div style={infoContent}>
                  <Text style={infoLabel}>رقم الهاتف</Text>
                  <Text style={infoValue}>{customerPhone}</Text>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Complaint Analysis */}
        <Section style={complaintSection}>
          <div style={sectionHeader}>
            <Text style={sectionIcon}>📋</Text>
            <Heading style={sectionTitle}>تحليل الشكوى</Heading>
          </div>
          
          <div style={analysisGrid}>
            <div style={analysisCard}>
              <Text style={analysisIcon}>📝</Text>
              <Text style={analysisLabel}>عنوان الشكوى</Text>
              <Text style={analysisValue}>{title}</Text>
            </div>
            
            <div style={analysisCard}>
              <Text style={analysisIcon}>📂</Text>
              <Text style={analysisLabel}>فئة الشكوى</Text>
              <Text style={analysisValue}>{categoryText}</Text>
            </div>
            
            <div style={analysisCard}>
              <Text style={analysisIcon}>⚡</Text>
              <Text style={analysisLabel}>مستوى الأولوية</Text>
              <Text style={[analysisValue, getPriorityStyle(priority)]}>{priorityText}</Text>
            </div>
          </div>

          <div style={descriptionCard}>
            <Text style={descriptionHeader}>📄 تفاصيل الشكوى</Text>
            <Text style={descriptionText}>{description}</Text>
          </div>
        </Section>

        {/* Action Dashboard */}
        <Section style={actionDashboard}>
          <div style={sectionHeader}>
            <Text style={sectionIcon}>⚡</Text>
            <Heading style={sectionTitle}>لوحة الإجراءات</Heading>
          </div>
          
          <div style={actionTimeline}>
            <div style={timelineStep}>
              <div style={stepNumber}>1</div>
              <div style={stepContent}>
                <Text style={stepTitle}>مراجعة فورية</Text>
                <Text style={stepDesc}>تحليل الشكوى وتصنيف الأولوية</Text>
                <Text style={stepTime}>الآن</Text>
              </div>
            </div>
            
            <div style={timelineStep}>
              <div style={stepNumber}>2</div>
              <div style={stepContent}>
                <Text style={stepTitle}>التواصل مع العميل</Text>
                <Text style={stepDesc}>الرد المباشر وتقديم الحلول</Text>
                <Text style={stepTime}>{getResponseTime(priority)}</Text>
              </div>
            </div>
            
            <div style={timelineStep}>
              <div style={stepNumber}>3</div>
              <div style={stepContent}>
                <Text style={stepTitle}>المتابعة والحل</Text>
                <Text style={stepDesc}>تطبيق الحل ومتابعة رضا العميل</Text>
                <Text style={stepTime}>خلال 48 ساعة</Text>
              </div>
            </div>
          </div>
          
          <div style={actionButtons}>
            <Link href={`mailto:${customerEmail}?subject=رد على شكواك ${ticketNumber}`} style={[primaryActionBtn, getPriorityButtonStyle(priority)]}>
              📞 اتصال فوري
            </Link>
            <Link href={`mailto:${customerEmail}?subject=رد على شكواك ${ticketNumber}`} style={emailActionBtn}>
              📧 إرسال رد
            </Link>
            <Link href="https://alialshehriholding.com/admin/complaints" style={dashboardActionBtn}>
              📊 لوحة التحكم
            </Link>
          </div>
        </Section>

        {/* SLA Timer */}
        <Section style={[slaSection, getPrioritySLAStyle(priority)]}>
          <div style={slaContainer}>
            <Text style={slaIcon}>⏰</Text>
            <div style={slaContent}>
              <Text style={slaTitle}>مؤشر الاستجابة المطلوبة</Text>
              <Text style={slaTime}>{getResponseTime(priority)}</Text>
              <Text style={slaDesc}>حسب معايير الجودة وأولوية الشكوى</Text>
            </div>
          </div>
        </Section>

        {/* Premium Footer */}
        <Section style={premiumFooter}>
          <div style={footerContent}>
            <Text style={footerLogo}>ASH HOLDING</Text>
            <Text style={footerTagline}>نظام إدارة الشكاوي المتطور</Text>
            <div style={footerStats}>
              <div style={footerStat}>
                <Text style={footerStatValue}>99.9%</Text>
                <Text style={footerStatLabel}>معدل الحل</Text>
              </div>
              <div style={footerStat}>
                <Text style={footerStatValue}>< 1 ساعة</Text>
                <Text style={footerStatLabel}>متوسط الاستجابة</Text>
              </div>
              <div style={footerStat}>
                <Text style={footerStatValue}>24/7</Text>
                <Text style={footerStatLabel}>دعم متواصل</Text>
              </div>
            </div>
            <Text style={footerNote}>
              تم إرسال هذا الإشعار تلقائياً - {new Date().toLocaleString('ar-SA')}
            </Text>
          </div>
        </Section>

      </Container>
    </Body>
  </Html>
)

// Enhanced Helper Functions
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

const getUrgencyIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return '🚨';
    case 'medium':
      return '⚠️';
    case 'low':
      return '📢';
    default:
      return '📄';
  }
};

const getUrgencyText = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'عاجل جداً';
    case 'medium':
      return 'متوسط الأولوية';
    case 'low':
      return 'أولوية منخفضة';
    default:
      return 'عادي';
  }
};

const getAlertIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return '🔥';
    case 'medium':
      return '⚡';
    case 'low':
      return '📋';
    default:
      return '📄';
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
      return { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' };
    case 'medium':
      return { background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' };
    case 'low':
      return { background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' };
    default:
      return { background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' };
  }
};

const getPriorityAlertStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#fef2f2', border: '3px solid #dc2626', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.2)' };
    case 'medium':
      return { backgroundColor: '#fff7ed', border: '3px solid #ea580c', boxShadow: '0 8px 24px rgba(234, 88, 12, 0.2)' };
    case 'low':
      return { backgroundColor: '#f0fdf4', border: '3px solid #16a34a', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.2)' };
    default:
      return { backgroundColor: '#f9fafb', border: '3px solid #6b7280', boxShadow: '0 8px 24px rgba(107, 114, 128, 0.2)' };
  }
};

const getPriorityBadgeStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#dc2626', color: '#ffffff' };
    case 'medium':
      return { backgroundColor: '#ea580c', color: '#ffffff' };
    case 'low':
      return { backgroundColor: '#16a34a', color: '#ffffff' };
    default:
      return { backgroundColor: '#6b7280', color: '#ffffff' };
  }
};

const getPriorityButtonStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#dc2626', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)' };
    case 'medium':
      return { backgroundColor: '#ea580c', boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)' };
    case 'low':
      return { backgroundColor: '#16a34a', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4)' };
    default:
      return { backgroundColor: '#6b7280', boxShadow: '0 8px 24px rgba(107, 114, 128, 0.4)' };
  }
};

const getPrioritySLAStyle = (priority: string) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#fef2f2', borderLeft: '6px solid #dc2626' };
    case 'medium':
      return { backgroundColor: '#fff7ed', borderLeft: '6px solid #ea580c' };
    case 'low':
      return { backgroundColor: '#f0fdf4', borderLeft: '6px solid #16a34a' };
    default:
      return { backgroundColor: '#f9fafb', borderLeft: '6px solid #6b7280' };
  }
};

// Enhanced Modern Design System
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
  maxWidth: '720px',
  width: '100%',
  padding: '0',
  boxShadow: '0 40px 120px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  position: 'relative',
}

// Dynamic Header Styles
const header = {
  borderRadius: '32px 32px 0 0',
  padding: '60px 40px',
  textAlign: 'center' as const,
  overflow: 'hidden',
  position: 'relative' as const,
}

const headerContent = {
  position: 'relative' as const,
  zIndex: 2,
}

const urgencyBadge = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  padding: '8px 20px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
  marginBottom: '20px',
  backdropFilter: 'blur(10px)',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 15px 0',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
}

const headerSubtitle = {
  color: '#e2e8f0',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 15px 0',
  opacity: 0.9,
}

const timeStamp = {
  color: '#cbd5e1',
  fontSize: '14px',
  margin: '0',
  opacity: 0.8,
}

// Alert Styles
const criticalAlert = {
  margin: '0 40px',
  borderRadius: '20px',
  padding: '25px',
  marginBottom: '30px',
}

const alertContent = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
}

const alertIcon = {
  fontSize: '32px',
  marginRight: '15px',
}

const alertTextContainer = {
  flex: 1,
}

const alertTitle = {
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  color: '#1e293b',
}

const alertDesc = {
  fontSize: '14px',
  margin: '0',
  color: '#64748b',
}

// Modern Ticket Styles
const modernTicketSection = {
  padding: '0 40px',
  marginBottom: '30px',
}

const ticketCard = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
}

const ticketHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const ticketIcon = {
  fontSize: '48px',
  color: '#ffffff',
  margin: '0',
}

const ticketDetails = {
  flex: 1,
  marginLeft: '20px',
}

const ticketLabel = {
  color: '#bfdbfe',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 8px 0',
}

const ticketNumber = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0',
  letterSpacing: '1px',
}

const priorityBadge = {
  padding: '8px 16px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
}

const priorityText = {
  color: 'inherit',
  margin: '0',
}

// Section Styles
const customerSection = {
  padding: '40px',
  borderBottom: '1px solid #f1f5f9',
}

const complaintSection = {
  padding: '40px',
  borderBottom: '1px solid #f1f5f9',
}

const actionDashboard = {
  padding: '40px',
  backgroundColor: '#f8fafc',
}

const sectionHeader = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '25px',
}

const sectionIcon = {
  fontSize: '24px',
  marginRight: '15px',
}

const sectionTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
}

// Customer Card
const customerCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '20px',
  padding: '30px',
}

const customerInfo = {
  display: 'grid',
  gap: '20px',
}

const infoItem = {
  display: 'flex',
  alignItems: 'center',
}

const infoIcon = {
  fontSize: '24px',
  marginRight: '15px',
  width: '40px',
}

const infoContent = {
  flex: 1,
}

const infoLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 5px 0',
}

const infoValue = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

// Analysis Grid
const analysisGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px',
}

const analysisCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '25px',
  textAlign: 'center' as const,
}

const analysisIcon = {
  fontSize: '32px',
  margin: '0 0 15px 0',
  display: 'block',
}

const analysisLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const analysisValue = {
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
}

const descriptionHeader = {
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

// Timeline
const actionTimeline = {
  marginBottom: '30px',
}

const timelineStep = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '25px',
}

const stepNumber = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '700',
  flexShrink: 0,
  marginRight: '15px',
}

const stepContent = {
  flex: 1,
}

const stepTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 5px 0',
}

const stepDesc = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0 0 5px 0',
}

const stepTime = {
  color: '#3b82f6',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
}

// Action Buttons
const actionButtons = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap',
  justifyContent: 'center',
}

const primaryActionBtn = {
  color: '#ffffff',
  padding: '16px 24px',
  borderRadius: '16px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '150px',
  textAlign: 'center' as const,
}

const emailActionBtn = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '16px 24px',
  borderRadius: '16px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '150px',
  textAlign: 'center' as const,
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
}

const dashboardActionBtn = {
  backgroundColor: '#ffffff',
  color: '#3b82f6',
  padding: '16px 24px',
  borderRadius: '16px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  minWidth: '150px',
  textAlign: 'center' as const,
  border: '2px solid #3b82f6',
}

// SLA Section
const slaSection = {
  margin: '0 40px 40px 40px',
  borderRadius: '20px',
  padding: '25px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
}

const slaContainer = {
  display: 'flex',
  alignItems: 'center',
}

const slaIcon = {
  fontSize: '32px',
  marginRight: '20px',
}

const slaContent = {
  flex: 1,
}

const slaTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const slaTime = {
  color: '#3b82f6',
  fontSize: '20px',
  fontWeight: '800',
  margin: '0 0 5px 0',
}

const slaDesc = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
}

// Premium Footer
const premiumFooter = {
  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  padding: '50px 40px',
  textAlign: 'center' as const,
}

const footerContent = {
  maxWidth: '500px',
  margin: '0 auto',
}

const footerLogo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 10px 0',
  letterSpacing: '1px',
}

const footerTagline = {
  color: '#cbd5e1',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 30px 0',
}

const footerStats = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginBottom: '30px',
}

const footerStat = {
  textAlign: 'center' as const,
}

const footerStatValue = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 5px 0',
}

const footerStatLabel = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
}

const footerNote = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
}

export default AdminComplaintNotification