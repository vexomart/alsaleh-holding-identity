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

interface ProjectRequestConfirmationProps {
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

export const ProjectRequestConfirmation = ({
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
}: ProjectRequestConfirmationProps) => (
  <Html dir="rtl">
    <Head />
    <Preview>تأكيد استلام طلب مشروعك - {projectRef}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={headerTitle}>آل الشهري القابضة</Heading>
          <Text style={headerSubtitle}>الشريك التقني الموثوق</Text>
        </Section>

        {/* Greeting */}
        <Section style={section}>
          <Heading style={title}>أهلاً وسهلاً {name}</Heading>
          <Text style={paragraph}>
            شكراً لك على ثقتك في آل الشهري القابضة. لقد تم استلام طلب مشروعك بنجاح وسنتواصل معك قريباً.
          </Text>
        </Section>

        {/* Project Reference */}
        <Section style={referenceSection}>
          <Text style={referenceLabel}>رقم المرجع:</Text>
          <Text style={referenceNumber}>{projectRef}</Text>
        </Section>

        {/* Project Details */}
        <Section style={detailsSection}>
          <Heading style={sectionTitle}>تفاصيل طلبك</Heading>
          
          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>نوع المشروع:</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{projectTypeArabic}</Text>
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
                <Text style={value}>{budget}</Text>
              </Column>
            </Row>
          )}

          {timeline && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>الجدول الزمني:</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{timeline}</Text>
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

        {/* Project Description */}
        {description && (
          <Section style={section}>
            <Heading style={sectionTitle}>وصف المشروع</Heading>
            <Text style={descriptionText}>{description}</Text>
          </Section>
        )}

        {/* Additional Services */}
        {additionalServices && additionalServices.length > 0 && (
          <Section style={section}>
            <Heading style={sectionTitle}>الخدمات الإضافية المطلوبة</Heading>
            {additionalServices.map((service, index) => (
              <Text key={index} style={serviceItem}>• {service}</Text>
            ))}
          </Section>
        )}

        <Hr style={divider} />

        {/* Next Steps */}
        <Section style={section}>
          <Heading style={sectionTitle}>الخطوات التالية</Heading>
          <Text style={stepText}>
            <strong>1. مراجعة الطلب:</strong> سيقوم فريقنا بمراجعة طلبك بعناية خلال 24 ساعة
          </Text>
          <Text style={stepText}>
            <strong>2. التواصل المبدئي:</strong> سنتواصل معك لمناقشة التفاصيل والمتطلبات
          </Text>
          <Text style={stepText}>
            <strong>3. عرض السعر:</strong> ستحصل على عرض مفصل للمشروع والتكلفة
          </Text>
          <Text style={stepText}>
            <strong>4. بداية العمل:</strong> بعد الموافقة، سنبدأ العمل على مشروعك فوراً
          </Text>
        </Section>

        {/* Contact Information */}
        <Section style={contactSection}>
          <Heading style={sectionTitle}>معلومات التواصل</Heading>
          <Text style={contactText}>
            📧 البريد الإلكتروني: Projects@alialshehriholding.com
          </Text>
          <Text style={contactText}>
            📱 الهاتف: +966 50 123 4567
          </Text>
          <Text style={contactText}>
            🌐 الموقع الإلكتروني: www.alialshehriholding.com
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            شكراً لاختيارك آل الشهري القابضة - نحن متحمسون للعمل معك!
          </Text>
          <Text style={footerCopyright}>
            © 2024 آل الشهري القابضة. جميع الحقوق محفوظة.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const header = {
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  color: '#bfdbfe',
  fontSize: '16px',
  margin: '0',
};

const section = {
  padding: '20px',
};

const title = {
  color: '#1e40af',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '8px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const referenceSection = {
  backgroundColor: '#f0f9ff',
  padding: '20px',
  textAlign: 'center' as const,
  borderLeft: '4px solid #3b82f6',
};

const referenceLabel = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const referenceNumber = {
  color: '#1e40af',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '1px',
};

const detailsSection = {
  padding: '20px',
  backgroundColor: '#f9fafb',
};

const detailRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '40%',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  width: '60%',
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
};

const descriptionText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const serviceItem = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const stepText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
};

const contactSection = {
  backgroundColor: '#f0f9ff',
  padding: '20px',
  borderTop: '1px solid #e5e7eb',
};

const contactText = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const divider = {
  border: 'none',
  borderTop: '2px solid #e5e7eb',
  margin: '20px 0',
};

const footer = {
  backgroundColor: '#1f2937',
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const footerCopyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};

export default ProjectRequestConfirmation;