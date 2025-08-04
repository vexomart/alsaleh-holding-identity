import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface DomainRequestEmailProps {
  customerName: string
  domainName: string
  price: number
  registrationPeriod: number
  requestId: string
  status: string
}

export const DomainRequestEmail = ({
  customerName,
  domainName,
  price,
  registrationPeriod,
  requestId,
  status
}: DomainRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>طلب تسجيل النطاق {domainName} - شركة علي صالح الشهري القابضة</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>شركة علي صالح الشهري القابضة</Heading>
              <Text style={headerText}>ASH Holdings - خدمات النطاقات والاستضافة</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        <Section style={content}>
          <Heading style={h2}>
            {status === 'pending' ? 'تم استلام طلبكم' : 
             status === 'approved' ? 'تمت الموافقة على طلبكم' :
             status === 'registered' ? 'تم تسجيل النطاق بنجاح' :
             'تحديث حالة طلبكم'}
          </Heading>
          
          <Text style={text}>عزيزي/عزيزتي {customerName}،</Text>
          
          <Text style={text}>
            {status === 'pending' ? 
              'شكراً لك على ثقتكم بخدماتنا. تم استلام طلب تسجيل النطاق وسيتم مراجعته من قبل فريقنا المختص.' :
             status === 'approved' ?
              'نسعد بإبلاغكم أنه تمت الموافقة على طلب تسجيل النطاق وسيتم البدء في إجراءات التسجيل فوراً.' :
             status === 'registered' ?
              'تهانينا! تم تسجيل النطاق بنجاح ويمكنكم الآن استخدامه. سيتم إرسال تفاصيل إدارة النطاق قريباً.' :
              'تم تحديث حالة طلبكم. يرجى مراجعة التفاصيل أدناه.'}
          </Text>

          <Section style={orderDetails}>
            <Heading style={h3}>تفاصيل الطلب</Heading>
            
            <Row style={orderRow}>
              <Column style={orderLabel}>النطاق:</Column>
              <Column style={orderValue}>{domainName}</Column>
            </Row>
            
            <Row style={orderRow}>
              <Column style={orderLabel}>المبلغ:</Column>
              <Column style={orderValue}>{price} ريال سعودي</Column>
            </Row>
            
            <Row style={orderRow}>
              <Column style={orderLabel}>مدة التسجيل:</Column>
              <Column style={orderValue}>{registrationPeriod} سنة</Column>
            </Row>
            
            <Row style={orderRow}>
              <Column style={orderLabel}>رقم الطلب:</Column>
              <Column style={orderValue}>{requestId}</Column>
            </Row>
            
            <Row style={orderRow}>
              <Column style={orderLabel}>حالة الطلب:</Column>
              <Column style={orderValue}>
                {status === 'pending' ? 'قيد المراجعة' :
                 status === 'approved' ? 'تمت الموافقة' :
                 status === 'registered' ? 'مسجل' :
                 status}
              </Column>
            </Row>
          </Section>

          {status === 'approved' && (
            <Section style={paymentSection}>
              <Text style={text}>
                <strong>الخطوات التالية:</strong>
              </Text>
              <Text style={text}>
                1. سيتم التواصل معكم قريباً لإكمال إجراءات الدفع<br/>
                2. بعد تأكيد الدفع سيتم تسجيل النطاق فوراً<br/>
                3. ستحصلون على تفاصيل إدارة النطاق خلال 24 ساعة
              </Text>
            </Section>
          )}

          {status === 'registered' && (
            <Section style={successSection}>
              <Text style={text}>
                <strong>مبروك! النطاق أصبح ملككم الآن</strong>
              </Text>
              <Text style={text}>
                • يمكنكم ربط النطاق بموقعكم الإلكتروني<br/>
                • ستحصلون على لوحة تحكم لإدارة النطاق<br/>
                • خدمة الدعم الفني متاحة 24/7 لمساعدتكم
              </Text>
            </Section>
          )}

          <Text style={text}>
            للاستفسارات أو المساعدة، يرجى التواصل معنا:
          </Text>

          <Section style={contactSection}>
            <Text style={contactText}>
              📧 البريد الإلكتروني: info@alialshehriholding.com<br/>
              📱 الهاتف: +966 555 812 567<br/>
              🌐 الموقع الإلكتروني: alialshehriholding.com<br/>
              ⏰ أوقات العمل: الأحد - الخميس (8:00 ص - 6:00 م)
            </Text>
          </Section>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            شركة علي صالح الشهري القابضة<br/>
            جدة، المملكة العربية السعودية<br/>
            جميع الحقوق محفوظة © 2024
          </Text>
          
          <Text style={disclaimerText}>
            هذه رسالة تلقائية، يرجى عدم الرد على هذا البريد الإلكتروني.
            للتواصل معنا استخدم البيانات المذكورة أعلاه.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default DomainRequestEmail

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: 'Tahoma, Arial, sans-serif',
  direction: 'rtl' as const,
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#1e40af',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
}

const headerText = {
  color: '#e0e7ff',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '30px 20px',
}

const h2 = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center' as const,
}

const h3 = {
  color: '#374151',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const text = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '15px',
}

const orderDetails = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
}

const orderRow = {
  marginBottom: '10px',
}

const orderLabel = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#6b7280',
  width: '120px',
}

const orderValue = {
  fontSize: '14px',
  color: '#374151',
}

const paymentSection = {
  backgroundColor: '#fef3c7',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
}

const successSection = {
  backgroundColor: '#d1fae5',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
}

const contactSection = {
  backgroundColor: '#e0e7ff',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
}

const contactText = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
}

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0 0 10px 0',
}

const disclaimerText = {
  fontSize: '11px',
  color: '#9ca3af',
  lineHeight: '1.4',
  margin: '0',
}