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
    <Preview>مرحباً بك في ASH HOLDING - حسابك جاهز!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Text style={logoText}>ASH HOLDING</Text>
          <Text style={logoSubtext}>شركة علي الشهري القابضة</Text>
        </Section>

        {/* Welcome Message */}
        <Section style={content}>
          <Heading style={h1}>🎉 مرحباً بك {customerName}!</Heading>
          
          <Text style={welcomeText}>
            {data.welcome_message}
          </Text>

          <Section style={walletInfoBox}>
            <Heading style={h2}>✨ حسابك جاهز للاستخدام!</Heading>
            <Text style={balanceText}>
              يمكنك الآن الاستفادة من جميع خدماتنا المميزة
            </Text>
          </Section>

          {/* Features List */}
          <Section style={featuresSection}>
            <Heading style={h3}>🚀 ما يمكنك فعله الآن:</Heading>
            {data.wallet_features.map((feature, index) => (
              <Text key={index} style={featureItem}>
                ✓ {feature}
              </Text>
            ))}
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Link href="https://ash-holding.sa/portal" style={ctaButton}>
              دخول حسابي
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Support Section */}
          <Section style={supportSection}>
            <Text style={supportText}>
              💬 نحن هنا لمساعدتك!
            </Text>
            <Text style={supportText}>
              فريق الدعم الفني متاح لمساعدتك على مدار الساعة
            </Text>
            <Link href="mailto:info@ash-holding.sa" style={supportLink}>
              info@ash-holding.sa
            </Link>
            <Text style={supportPhone}>
              📞 920000000
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>ASH HOLDING</Text>
            <Text style={footerText}>
              شركة علي الشهري القابضة - الرياض، المملكة العربية السعودية
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
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '30px',
  padding: '30px 20px',
  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  borderRadius: '12px 12px 0 0',
  margin: '-20px -20px 30px -20px',
};

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '2px',
};

const logoSubtext = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '5px 0 0 0',
  opacity: '0.9',
};

const content = {
  padding: '0 20px',
};

const h1 = {
  color: '#0d9488',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#2d3748',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
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
  lineHeight: '1.8',
  margin: '0 0 25px 0',
  textAlign: 'center' as const,
};

const walletInfoBox = {
  backgroundColor: '#f0fdfa',
  padding: '25px',
  borderRadius: '12px',
  border: '2px solid #14b8a6',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const balanceText = {
  color: '#4a5568',
  fontSize: '16px',
  margin: '10px 0 0 0',
};

const featuresSection = {
  margin: '25px 0',
  padding: '25px',
  backgroundColor: '#f7fafc',
  borderRadius: '12px',
};

const featureItem = {
  color: '#2d3748',
  fontSize: '15px',
  margin: '12px 0',
  lineHeight: '1.6',
  paddingRight: '10px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '35px 0',
};

const ctaButton = {
  backgroundColor: '#0d9488',
  color: '#ffffff',
  padding: '15px 40px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '35px 0',
};

const supportSection = {
  textAlign: 'center' as const,
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
};

const supportText = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '8px 0',
};

const supportLink = {
  color: '#0d9488',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'block',
  margin: '10px 0',
};

const supportPhone = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '10px 0',
};

const footer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  paddingTop: '25px',
  borderTop: '2px solid #0d9488',
};

const footerBrand = {
  color: '#0d9488',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  letterSpacing: '1px',
};

const footerText = {
  color: '#718096',
  fontSize: '12px',
  margin: '5px 0',
};

export default WelcomeEmailTemplate;
