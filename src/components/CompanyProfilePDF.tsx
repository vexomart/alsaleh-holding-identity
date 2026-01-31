import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";

// Register reliable fonts for PDF Arabic support
try {
  Font.register({
    family: 'NotoSansArabic',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/notosansarabic/v18/Hgo13k-tfSpn0qi1SFdUfVtXRcuvVGOr2RY.woff2',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/notosansarabic/v18/Hgo33k-tfSpn0qi1SFdUfVtXRcuvVGOrOj8.woff2',
        fontWeight: 700,
      },
    ],
  });
} catch (error) {
  console.warn('Font registration failed, using fallback');
}

// Professional PDF Styles
const styles = StyleSheet.create({
  // Base page styles
  page: {
    fontFamily: 'NotoSansArabic',
    fontSize: 13,
    paddingTop: 50,
    paddingBottom: 80,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  
  // Header for each page
  pageHeader: {
    position: 'absolute',
    top: 15,
    left: 40,
    right: 40,
    height: 30,
    backgroundColor: '#1e3a8a',
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  headerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'NotoSansArabic',
  },
  
  // Footer for each page  
  pageFooter: {
    position: 'absolute',
    bottom: 15,
    left: 40,
    right: 40,
    height: 45,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderTop: '3px solid #1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },

  footerText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    fontFamily: 'NotoSansArabic',
  },
  
  // Cover page styles
  coverPage: {
    fontFamily: 'NotoSansArabic',
    backgroundColor: '#1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 60,
    position: 'relative',
  },
  
  // Decorative background elements
  backgroundDecoration: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  
  // Content styles
  contentContainer: {
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 0,
  },
  
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: 'white',
    fontFamily: 'NotoSansArabic',
  },
  
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#e2e8f0',
    fontFamily: 'NotoSansArabic',
  },
  
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#cbd5e1',
    fontFamily: 'NotoSansArabic',
  },
  
  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#fbbf24',
    fontFamily: 'NotoSansArabic',
  },
  
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },

  logoText: {
    fontSize: 24, 
    color: '#1e3a8a', 
    fontWeight: 'bold',
    fontFamily: 'NotoSansArabic',
  },
  
  // Statistics section
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 12,
    width: '22%',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
    fontFamily: 'NotoSansArabic',
  },
  
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'NotoSansArabic',
  },
  
  // Section styles
  section: {
    marginBottom: 30,
    paddingHorizontal: 0,
  },
  
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e3a8a',
    borderBottom: '3px solid #1e3a8a',
    paddingBottom: 10,
    fontFamily: 'NotoSansArabic',
  },
  
  text: {
    fontSize: 13,
    lineHeight: 1.8,
    textAlign: 'right',
    marginBottom: 15,
    color: '#374151',
    fontFamily: 'NotoSansArabic',
  },
  
  // Service boxes
  serviceBox: {
    backgroundColor: '#f8fafc',
    padding: 20,
    marginBottom: 18,
    borderRadius: 12,
    borderLeft: '5px solid #1e3a8a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'NotoSansArabic',
  },
  
  serviceItem: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'right',
    color: '#4b5563',
    paddingRight: 10,
    fontFamily: 'NotoSansArabic',
  },
  
  // Partners section
  partnersSection: {
    marginTop: 25,
    marginBottom: 25,
  },
  
  partnersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
    fontFamily: 'NotoSansArabic',
  },
  
  partnerGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 15,
  },
  
  partnerBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '22%',
    textAlign: 'center',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  
  partnerText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'NotoSansArabic',
  },
  
  // Vision & Mission boxes
  visionMissionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 20,
  },
  
  visionBox: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
  },
  
  missionBox: {
    backgroundColor: '#059669',
    color: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
  },
  
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'NotoSansArabic',
  },
  
  boxText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.6,
    fontFamily: 'NotoSansArabic',
  },
  
  // Professional digital signature
  professionalSignature: {
    position: 'absolute',
    bottom: 100,
    right: 60,
    width: 140,
    height: 140,
  },
  
  signatureContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.95)',
    border: '4px solid #1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
  
  signatureCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'NotoSansArabic',
  },
  
  signatureDetails: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'NotoSansArabic',
  },
  
  signatureCode: {
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'NotoSansArabic',
  },
});

// Header Component for non-cover pages
const PageHeader = () => (
  <View style={styles.pageHeader}>
    <Text style={styles.headerText}>شركة علي صالح الشهري القابضة - الملف التعريفي الرسمي</Text>
  </View>
);

// Footer Component for all pages
const PageFooter = () => (
  <View style={styles.pageFooter}>
    <Text style={styles.footerText}>شركة علي صالح الشهري القابضة</Text>
    <Text style={[styles.footerText, { fontSize: 9, marginTop: 2 }]}>
      info@ash-holding.sa | المملكة العربية السعودية | {new Date().getFullYear()}
    </Text>
  </View>
);

// Company Profile Document Component
const CompanyProfileDocument = () => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      {/* Background decorative elements */}
      <View style={[styles.backgroundDecoration, { top: 20, left: 20 }]} />
      <View style={[styles.backgroundDecoration, { top: 50, right: 30, width: 20, height: 20, borderRadius: 10 }]} />
      <View style={[styles.backgroundDecoration, { bottom: 40, left: 40, width: 25, height: 25, borderRadius: 12 }]} />
      <View style={[styles.backgroundDecoration, { top: 100, right: 80, width: 15, height: 15, borderRadius: 7 }]} />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>شعار</Text>
      </View>
      
      <Text style={styles.mainTitle}>شركة علي صالح الشهري القابضة</Text>
      <Text style={styles.subtitle}>ALI SALEH AL-SHAHRI HOLDING COMPANY</Text>
      <Text style={[styles.description, { marginTop: 10 }]}>رائدة في التكنولوجيا والحلول المتكاملة منذ ٢٠١٨</Text>
      <Text style={styles.slogan}>الإبداع - التميز - الجودة</Text>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { borderTop: '4px solid #1e3a8a' }]}>
          <Text style={styles.statValue}>٢٠١٨</Text>
          <Text style={styles.statLabel}>التأسيس</Text>
        </View>
        <View style={[styles.statBox, { borderTop: '4px solid #059669' }]}>
          <Text style={styles.statValue}>٥٠٠+</Text>
          <Text style={styles.statLabel}>مشروع</Text>
        </View>
        <View style={[styles.statBox, { borderTop: '4px solid #7c3aed' }]}>
          <Text style={styles.statValue}>٥٠+</Text>
          <Text style={styles.statLabel}>موظف</Text>
        </View>
        <View style={[styles.statBox, { borderTop: '4px solid #dc2626' }]}>
          <Text style={styles.statValue}>١٠٠+</Text>
          <Text style={styles.statLabel}>عميل</Text>
        </View>
      </View>
    </Page>

    {/* Page 2 - Company Overview */}
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نظرة عامة على الشركة</Text>
          
          <Text style={styles.text}>
            تأسست شركة علي صالح الشهري القابضة في عام ٢٠١٨ كشركة رائدة في مجال التكنولوجيا والحلول المتكاملة. نفتخر بكوننا الشريك الموثوق للشركات والمؤسسات في رحلة التحول الرقمي من خلال تقديم مجموعة شاملة من الخدمات التقنية والتجارية المبتكرة.
          </Text>
          
          <Text style={styles.text}>
            من خلال فريقنا المتخصص وخبرتنا المتراكمة، نسعى لتقديم حلول مبتكرة تلبي احتياجات عملائنا وتساعدهم في تحقيق أهدافهم بأعلى معايير الجودة والاحترافية.
          </Text>

          <View style={styles.partnersSection}>
            <Text style={styles.partnersTitle}>شركاء النجاح العالميين</Text>
            
            <View style={styles.partnerGrid}>
              <View style={[styles.partnerBox, { backgroundColor: 'rgba(255, 153, 0, 0.1)' }]}>
                <Text style={[styles.partnerText, { color: '#ff9900' }]}>AWS</Text>
              </View>
              <View style={[styles.partnerBox, { backgroundColor: 'rgba(0, 120, 215, 0.1)' }]}>
                <Text style={[styles.partnerText, { color: '#0078d7' }]}>Microsoft</Text>
              </View>
              <View style={[styles.partnerBox, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
                <Text style={[styles.partnerText, { color: '#4285f4' }]}>Google</Text>
              </View>
              <View style={[styles.partnerBox, { backgroundColor: 'rgba(0, 188, 242, 0.1)' }]}>
                <Text style={[styles.partnerText, { color: '#00bcf2' }]}>Docker</Text>
              </View>
            </View>
          </View>

          <View style={styles.visionMissionContainer}>
            <View style={styles.visionBox}>
              <Text style={styles.boxTitle}>الرؤية</Text>
              <Text style={styles.boxText}>
                أن نكون الشركة الرائدة في المنطقة في مجال التكنولوجيا والحلول المبتكرة، ونساهم في بناء مستقبل رقمي متطور
              </Text>
            </View>
            
            <View style={styles.missionBox}>
              <Text style={styles.boxTitle}>الرسالة</Text>
              <Text style={styles.boxText}>
                تقديم حلول تقنية متطورة وخدمات عالية الجودة لمساعدة عملائنا في تحقيق أهدافهم والنمو في عالم متغير
              </Text>
            </View>
          </View>
        </View>
      </View>
      <PageFooter />
    </Page>

    {/* Page 3 - Services */}
    <Page size="A4" style={styles.page}>
      <PageHeader />
      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خدماتنا المتميزة</Text>
          
          <View style={[styles.serviceBox, { borderColor: '#1e3a8a' }]}>
            <Text style={styles.serviceTitle}>الحلول التقنية المتطورة</Text>
            <Text style={styles.serviceItem}>• تطوير البرمجيات والتطبيقات المخصصة</Text>
            <Text style={styles.serviceItem}>• حلول الذكاء الاصطناعي والتعلم الآلي</Text>
            <Text style={styles.serviceItem}>• الحلول السحابية وأمن المعلومات</Text>
            <Text style={styles.serviceItem}>• أنظمة إدارة قواعد البيانات</Text>
          </View>

          <View style={[styles.serviceBox, { borderColor: '#059669' }]}>
            <Text style={styles.serviceTitle}>خدمات التصميم الاحترافية</Text>
            <Text style={styles.serviceItem}>• تصميم الهوية البصرية الاحترافية</Text>
            <Text style={styles.serviceItem}>• التصميم الجرافيكي والإعلاني</Text>
            <Text style={styles.serviceItem}>• تصميم المواقع والتطبيقات</Text>
            <Text style={styles.serviceItem}>• المواد المطبوعة والتسويقية</Text>
          </View>

          <View style={[styles.serviceBox, { borderColor: '#d97706' }]}>
            <Text style={styles.serviceTitle}>الخدمات التجارية والاستشارية</Text>
            <Text style={styles.serviceItem}>• الاستشارات التجارية والإدارية</Text>
            <Text style={styles.serviceItem}>• إدارة المشاريع والتخطيط الاستراتيجي</Text>
            <Text style={styles.serviceItem}>• التسويق الرقمي والإلكتروني</Text>
            <Text style={styles.serviceItem}>• تطوير الأعمال والاستراتيجيات</Text>
          </View>

          <View style={[styles.serviceBox, { borderColor: '#7c3aed' }]}>
            <Text style={styles.serviceTitle}>الذكاء الاصطناعي والابتكار</Text>
            <Text style={styles.serviceItem}>• حلول الذكاء الاصطناعي المخصصة</Text>
            <Text style={styles.serviceItem}>• تطوير نماذج التعلم الآلي</Text>
            <Text style={styles.serviceItem}>• معالجة اللغة الطبيعية العربية</Text>
            <Text style={styles.serviceItem}>• الرؤية الحاسوبية والتحليل الذكي</Text>
          </View>
        </View>

        {/* Professional Digital Signature */}
        <View style={styles.professionalSignature}>
          <View style={styles.signatureContainer}>
            <Text style={styles.signatureCompany}>شركة علي صالح الشهري القابضة</Text>
            <Text style={styles.signatureDetails}>المملكة العربية السعودية</Text>
            <Text style={styles.signatureDetails}>{new Date().getFullYear()}</Text>
            <Text style={styles.signatureCode}>
              رمز التحقق: AS-{Date.now().toString(36).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <PageFooter />
    </Page>
  </Document>
);

interface CompanyProfilePDFProps {
  className?: string;
}

export const CompanyProfilePDF: React.FC<CompanyProfilePDFProps> = ({ className }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PDFDownloadLink 
      document={<CompanyProfileDocument />} 
      fileName={`Ali-Saleh-Al-Shahri-Holding-Company-Profile-${new Date().getFullYear()}.pdf`}
      className={`inline-flex items-center relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group cursor-pointer ${className}`}
      onClick={handleDownload}
    >
      {({ loading }) => (
        <>
          {loading || isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              جاري التحميل...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 ml-2" />
              الملف التعريفي
            </>
          )}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
        </>
      )}
    </PDFDownloadLink>
  );
};