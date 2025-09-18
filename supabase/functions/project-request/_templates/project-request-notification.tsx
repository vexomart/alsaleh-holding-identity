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
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ProjectRequestNotificationProps {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectRef: string;
  projectTypeArabic: string;
  budget?: string;
  timeline?: string;
  description?: string;
  additionalServices?: string[];
  submissionDate: string;
}

export const ProjectRequestNotification = ({
  name,
  email,
  phone,
  company,
  projectRef,
  projectTypeArabic,
  budget,
  timeline,
  description,
  additionalServices,
  submissionDate,
}: ProjectRequestNotificationProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>طلب مشروع جديد من {name} - {projectRef}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={headerTitle}>🚀 طلب مشروع جديد</Heading>
          <Text style={headerSubtitle}>إشعار إداري - آل الشهري القابضة</Text>
        </Section>

        {/* Alert */}
        <Section style={alertSection}>
          <Text style={alertText}>
            تم استلام طلب مشروع جديد ويحتاج للمراجعة والمتابعة
          </Text>
        </Section>

        {/* Client Information */}
        <Section style={section}>
          <Heading style={sectionTitle}>معلومات العميل</Heading>
          
          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>الاسم:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{name}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>البريد الإلكتروني:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={emailValue}>{email}</Text>
            </Column>
          </Row>

          {phone && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>رقم الهاتف:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{phone}</Text>
              </Column>
            </Row>
          )}

          {company && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الشركة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{company}</Text>
              </Column>
            </Row>
          )}
        </Section>

        <Hr style={divider} />

        {/* Project Information */}
        <Section style={section}>
          <Heading style={sectionTitle}>تفاصيل المشروع</Heading>
          
          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>رقم المرجع:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={refValue}>{projectRef}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>نوع المشروع:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={projectTypeValue}>{projectTypeArabic}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>تاريخ الطلب:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{submissionDate}</Text>
            </Column>
          </Row>

          {budget && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الميزانية المتوقعة:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={budgetValue}>{budget}</Text>
              </Column>
            </Row>
          )}

          {timeline && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الجدول الزمني المطلوب:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{timeline}</Text>
              </Column>
            </Row>
          )}
        </Section>

        {/* Project Description */}
        {description && (
          <>
            <Hr style={divider} />
            <Section style={section}>
              <Heading style={sectionTitle}>وصف المشروع والمتطلبات</Heading>
              <Text style={descriptionText}>{description}</Text>
            </Section>
          </>
        )}

        {/* Additional Services */}
        {additionalServices && additionalServices.length > 0 && (
          <>
            <Hr style={divider} />
            <Section style={section}>
              <Heading style={sectionTitle}>الخدمات الإضافية المطلوبة</Heading>
              <Section style={servicesGrid}>
                {additionalServices.map((service, index) => (
                  <Text key={index} style={serviceItem}>✓ {service}</Text>
                ))}
              </Section>
            </Section>
          </>
        )}

        {/* Action Required */}
        <Section style={actionSection}>
          <Heading style={actionTitle}>الإجراءات المطلوبة</Heading>
          <Text style={actionText}>
            <strong>1.</strong> مراجعة تفاصيل الطلب والتأكد من اكتمال المعلومات
          </Text>
          <Text style={actionText}>
            <strong>2.</strong> التواصل مع العميل خلال 24 ساعة لمناقشة المتطلبات
          </Text>
          <Text style={actionText}>
            <strong>3.</strong> إعداد عرض السعر والجدول الزمني المفصل
          </Text>
          <Text style={actionText}>
            <strong>4.</strong> إرسال العرض للعميل ومتابعة الرد
          </Text>
        </Section>

        {/* Priority Level */}
        <Section style={prioritySection}>
          <Text style={priorityLabel}>مستوى الأولوية:</Text>
          <Text style={priorityHigh}>عالي ⚡</Text>
          <Text style={priorityNote}>
            يرجى المتابعة في أقرب وقت ممكن لضمان رضا العميل
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            إشعار تلقائي من نظام إدارة المشاريع - آل الشهري القابضة
          </Text>
          <Text style={footerTimestamp}>
            تم الإرسال في: {submissionDate}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f1f5f9',
  fontFamily: 'Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '650px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
};

const header = {
  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  color: '#fecaca',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
};

const alertSection = {
  backgroundColor: '#fef3c7',
  padding: '16px 20px',
  borderLeft: '4px solid #f59e0b',
};

const alertText = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const section = {
  padding: '24px 20px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '8px',
};

const detailRow = {
  marginBottom: '16px',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '12px',
};

const labelColumn = {
  width: '35%',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  width: '65%',
  verticalAlign: 'top' as const,
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const value = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
};

const emailValue = {
  color: '#2563eb',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
  textDecoration: 'underline',
};

const refValue = {
  color: '#dc2626',
  fontSize: '16px',
  margin: '0',
  fontWeight: 'bold',
  backgroundColor: '#fee2e2',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
};

const projectTypeValue = {
  color: '#059669',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold',
  backgroundColor: '#d1fae5',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
};

const budgetValue = {
  color: '#7c3aed',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold',
};

const descriptionText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  fontStyle: 'italic',
};

const servicesGrid = {
  backgroundColor: '#f0f9ff',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #bae6fd',
};

const serviceItem = {
  color: '#0369a1',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontWeight: '500',
};

const actionSection = {
  backgroundColor: '#fef7f0',
  padding: '24px 20px',
  borderTop: '1px solid #fed7aa',
  borderBottom: '1px solid #fed7aa',
};

const actionTitle = {
  color: '#ea580c',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const actionText = {
  color: '#9a3412',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
};

const prioritySection = {
  backgroundColor: '#fef2f2',
  padding: '20px',
  textAlign: 'center' as const,
  borderTop: '3px solid #dc2626',
};

const priorityLabel = {
  color: '#7f1d1d',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const priorityHigh = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const priorityNote = {
  color: '#991b1b',
  fontSize: '12px',
  margin: '0',
  fontStyle: 'italic',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '0',
};

const footer = {
  backgroundColor: '#374151',
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#d1d5db',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const footerTimestamp = {
  color: '#9ca3af',
  fontSize: '11px',
  margin: '0',
};

export default ProjectRequestNotification;