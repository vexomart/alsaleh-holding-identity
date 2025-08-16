import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, Image } from "@react-pdf/renderer";

// Register Arabic font - Using TTF format for better compatibility
Font.register({
  family: 'NotoSansArabic',
  src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

Font.register({
  family: 'NotoSansArabic',
  src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf',
  fontStyle: 'normal',
  fontWeight: 'bold',
});

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansArabic',
    fontSize: 12,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
  },
  coverPage: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
  slogan: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffd700',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  statLabel: {
    fontSize: 12,
    color: '#1e3a8a',
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1e3a8a',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'right',
    marginBottom: 10,
  },
  serviceBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '2px solid #e2e8f0',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'right',
  },
  serviceItem: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'right',
    color: '#374151',
  },
  partnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  partnerBox: {
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    minWidth: 60,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
  digitalSignature: {
    position: 'absolute',
    bottom: 80,
    right: 50,
    textAlign: 'center',
  },
  signatureCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: '3px solid #1e3a8a',
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  visionMissionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  visionBox: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    width: '48%',
  },
  missionBox: {
    backgroundColor: '#059669',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    width: '48%',
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  boxText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 1.4,
  },
});

// Company Profile Document Component
const CompanyProfileDocument = () => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.backgroundPattern}>
        {/* Background decorative elements */}
        <View style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15 }} />
        <View style={{ position: 'absolute', top: 50, right: 30, width: 20, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10 }} />
        <View style={{ position: 'absolute', bottom: 40, left: 40, width: 25, height: 25, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} />
      </View>
      
      <View style={styles.logoContainer}>
        <Text style={{ fontSize: 24, color: '#1e3a8a', fontWeight: 'bold' }}>شعار</Text>
      </View>
      
      <Text style={styles.mainTitle}>شركة علي صالح الشهري القابضة</Text>
      <Text style={styles.subtitle}>ALI SALEH AL-SHAHRI HOLDING COMPANY</Text>
      <Text style={[styles.subtitle, { fontSize: 14, marginTop: 10 }]}>رائدة في التكنولوجيا والحلول المتكاملة منذ ٢٠١٨</Text>
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
      
      <Text style={[styles.footer, { color: 'white' }]}>الملف التعريفي الرسمي للشركة | {new Date().getFullYear()}</Text>
    </Page>

    {/* Page 2 - Company Overview */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>نظرة عامة على الشركة</Text>
        
        <Text style={styles.text}>
          تأسست شركة علي صالح الشهري القابضة في عام ٢٠١٨ كشركة رائدة في مجال التكنولوجيا والحلول المتكاملة. نفتخر بكوننا الشريك الموثوق للشركات والمؤسسات في رحلة التحول الرقمي من خلال تقديم مجموعة شاملة من الخدمات التقنية والتجارية المبتكرة.
        </Text>
        
        <Text style={styles.text}>
          من خلال فريقنا المتخصص وخبرتنا المتراكمة، نسعى لتقديم حلول مبتكرة تلبي احتياجات عملائنا وتساعدهم في تحقيق أهدافهم بأعلى معايير الجودة والاحترافية.
        </Text>

        <Text style={[styles.title, { fontSize: 16, marginTop: 30 }]}>شركاء النجاح العالميين</Text>
        
        <View style={styles.partnerContainer}>
          <View style={[styles.partnerBox, { backgroundColor: 'rgba(255, 153, 0, 0.1)' }]}>
            <Text style={{ color: '#ff9900', fontWeight: 'bold' }}>AWS</Text>
          </View>
          <View style={[styles.partnerBox, { backgroundColor: 'rgba(0, 120, 215, 0.1)' }]}>
            <Text style={{ color: '#0078d7', fontWeight: 'bold' }}>Microsoft</Text>
          </View>
          <View style={[styles.partnerBox, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
            <Text style={{ color: '#4285f4', fontWeight: 'bold' }}>Google</Text>
          </View>
          <View style={[styles.partnerBox, { backgroundColor: 'rgba(0, 188, 242, 0.1)' }]}>
            <Text style={{ color: '#00bcf2', fontWeight: 'bold' }}>Docker</Text>
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
    </Page>

    {/* Page 3 - Services */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>خدماتنا المتميزة</Text>
        
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

      {/* Digital Signature */}
      <View style={styles.digitalSignature}>
        <View style={styles.signatureCircle}>
          <Text style={[styles.signatureText, { fontSize: 10, fontWeight: 'bold' }]}>شركة علي صالح الشهري القابضة</Text>
          <Text style={[styles.signatureText, { fontSize: 8, marginTop: 5 }]}>المملكة العربية السعودية</Text>
          <Text style={[styles.signatureText, { fontSize: 8, marginTop: 5 }]}>{new Date().getFullYear()}</Text>
        </View>
        <Text style={[styles.signatureText, { marginTop: 5, fontSize: 7 }]}>
          رمز التحقق: DC-{Date.now().toString(36).toUpperCase()}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>info@alialshehriholding.com | المملكة العربية السعودية | {new Date().getFullYear()}</Text>
      </View>
    </Page>
  </Document>
);

interface CompanyProfilePDFProps {
  className?: string;
}

export const CompanyProfilePDF: React.FC<CompanyProfilePDFProps> = ({ className }) => {
  return (
    <PDFDownloadLink 
      document={<CompanyProfileDocument />} 
      fileName={`Ali-Saleh-Al-Shahri-Holding-Company-Profile-${new Date().getFullYear()}.pdf`}
      className={`inline-flex items-center relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group ${className}`}
    >
      {({ loading }) => (
        <>
          {loading ? (
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