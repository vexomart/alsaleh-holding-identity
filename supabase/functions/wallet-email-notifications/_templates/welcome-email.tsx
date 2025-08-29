import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  customerName: string;
  data: {
    user_id: string;
    welcome_message: string;
    initial_balance: number;
    wallet_features: string[];
  };
}

export const WelcomeEmailTemplate = ({ customerName, data }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>مرحباً بك في محفظتك الرقمية - شركة الصالح القابضة</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Img
            src="https://alsaleh-holding.com/assets/logo.png"
            width="120"
            height="60"
            alt="الصالح القابضة"
            style={logo}
          />
        </Section>

        {/* Welcome Message */}
        <Section style={content}>
          <Heading style={h1}>مرحباً بك {customerName}</Heading>
          
          <Text style={welcomeText}>
            {data.welcome_message}
          </Text>

          <Section style={walletInfoBox}>
            <Heading style={h2}>🏦 محفظتك الرقمية جاهزة!</Heading>
            <Text style={balanceText}>
              الرصيد الحالي: <span style={amountStyle}>{data.initial_balance.toLocaleString()} ريال سعودي</span>
            </Text>
          </Section>

          {/* Features List */}
          <Section style={featuresSection}>
            <Heading style={h3}>✨ مميزات محفظتك الرقمية:</Heading>
            {data.wallet_features.map((feature, index) => (
              <Text key={index} style={featureItem}>
                • {feature}
              </Text>
            ))}
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Link href="https://alsaleh-holding.com/admin/wallet" style={ctaButton}>
              عرض محفظتي الرقمية
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Support Section */}
          <Section style={supportSection}>
            <Text style={supportText}>
              💬 هل تحتاج مساعدة؟
            </Text>
            <Text style={supportText}>
              فريق الدعم الفني متاح لمساعدتك على مدار الساعة
            </Text>
            <Link href="mailto:support@alsaleh-holding.com" style={supportLink}>
              support@alsaleh-holding.com
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              شركة الصالح القابضة - الرياض، المملكة العربية السعودية
            </Text>
            <Text style={footerText}>
              هذا الإيميل تم إرساله تلقائياً، يرجى عدم الرد عليه
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Arial, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '30px',
  padding: '20px 0',
  borderBottom: '3px solid #1a365d',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 20px',
};

const h1 = {
  color: '#1a365d',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#2d3748',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#2d3748',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '25px 0 15px 0',
};

const welcomeText = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 25px 0',
  textAlign: 'center' as const,
};

const walletInfoBox = {
  backgroundColor: '#e6fffa',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #38b2ac',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const balanceText = {
  color: '#2d3748',
  fontSize: '16px',
  margin: '10px 0',
};

const amountStyle = {
  color: '#38a169',
  fontWeight: 'bold',
  fontSize: '18px',
};

const featuresSection = {
  margin: '25px 0',
  padding: '20px',
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
};

const featureItem = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const ctaButton = {
  backgroundColor: '#1a365d',
  color: '#ffffff',
  padding: '12px 30px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '30px 0',
};

const supportSection = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const supportText = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '8px 0',
};

const supportLink = {
  color: '#3182ce',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
};

const footer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #e2e8f0',
};

const footerText = {
  color: '#718096',
  fontSize: '12px',
  margin: '5px 0',
};

export default WelcomeEmailTemplate;