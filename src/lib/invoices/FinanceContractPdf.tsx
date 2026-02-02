/**
 * FINANCE CONTRACT PDF - Enterprise World-Class Design
 * عقد التمويل الداخلي - شركة علي صالح الشهري القابضة
 * Professional legal document with proper Arabic typography
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { SELLER_INFO } from './constants';

// Register Cairo fonts for proper Arabic rendering
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Contract Data Type
export interface FinanceContractData {
  contract_number: string;
  signed_at?: string | null;
  admin_approved_at?: string | null;
  entity: {
    legal_name_ar: string;
    entity_type: string;
    national_id?: string | null;
    cr_number?: string | null;
    phone?: string | null;
    email?: string | null;
    address_ar?: string | null;
    city?: string | null;
  };
  application: {
    amount_sar: number;
    tenor_months: number;
    purpose_ar?: string | null;
  };
  offer: {
    apr_percent: number;
    fees_sar: number | null;
    monthly_payment_sar: number;
    total_payable_sar: number;
  };
  installments?: Array<{
    installment_no: number;
    due_date: string;
    amount_sar: number;
  }>;
}

// Format number with proper Arabic display
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Format currency
const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)} ر.س`;
};

// Format date in Arabic
const formatArabicDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
};

// Colors
const colors = {
  primary: '#0f172a',
  secondary: '#1e3a5f',
  gold: '#b8860b',
  accent: '#166534',
  lightGray: '#f8fafc',
  mediumGray: '#e2e8f0',
  darkGray: '#64748b',
  text: '#1e293b',
  white: '#ffffff',
};

// Premium Legal Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 10,
    backgroundColor: colors.white,
    paddingBottom: 60,
  },
  // Header
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 35,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'right',
    marginBottom: 2,
  },
  companyNameEn: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'right',
    letterSpacing: 1,
  },
  contractBadge: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  contractBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  contractBadgeSub: {
    fontSize: 7,
    color: '#bbf7d0',
    textAlign: 'center',
    marginTop: 2,
  },
  // Gold accent bar
  goldBar: {
    height: 3,
    backgroundColor: colors.gold,
  },
  // Meta info strip
  metaStrip: {
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 7,
    color: colors.darkGray,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Content area
  content: {
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  // Section
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  // Preamble box
  preambleBox: {
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderRightWidth: 3,
    borderRightColor: colors.gold,
  },
  preambleText: {
    fontSize: 9,
    color: '#92400e',
    textAlign: 'right',
    lineHeight: 1.6,
  },
  // Parties section
  partiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  partyCard: {
    width: '48%',
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: 12,
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  partyCardCustomer: {
    borderTopColor: colors.accent,
  },
  partyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  partyTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
  },
  partyBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  partyBadgeCustomer: {
    backgroundColor: colors.accent,
  },
  partyBadgeText: {
    fontSize: 6,
    color: colors.white,
    fontWeight: 'bold',
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  partyLabel: {
    fontSize: 8,
    color: colors.darkGray,
    width: 70,
    textAlign: 'right',
  },
  partyValue: {
    fontSize: 9,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  // Digital stamp
  stampContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
  },
  stampOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampCheck: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stampText: {
    fontSize: 6,
    color: colors.accent,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stampDate: {
    fontSize: 5,
    color: '#22c55e',
    marginTop: 2,
  },
  // Financial summary
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  summaryCard: {
    width: '23%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  summaryCardHighlight: {
    backgroundColor: '#fefce8',
    borderLeftColor: colors.accent,
  },
  summaryLabel: {
    fontSize: 7,
    color: colors.darkGray,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  summaryValueGreen: {
    color: colors.accent,
  },
  // Notice box
  noticeBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 14,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  noticeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  noticeIconText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: 'bold',
  },
  noticeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'right',
  },
  noticeText: {
    fontSize: 9,
    color: '#1e3a8a',
    textAlign: 'right',
    lineHeight: 1.6,
  },
  // Terms list
  termsList: {
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: 12,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  termItemLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  termNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.gold,
    width: 18,
    textAlign: 'right',
  },
  termText: {
    fontSize: 9,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    lineHeight: 1.5,
  },
  // Table
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
    backgroundColor: colors.white,
  },
  tableRowAlt: {
    backgroundColor: colors.lightGray,
  },
  tableCell: {
    fontSize: 8,
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  tableCellBold: {
    fontWeight: 'bold',
  },
  // Signature section
  signatureSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.gold,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
  },
  signatureBoxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  signatureBoxSubtitle: {
    fontSize: 8,
    color: colors.darkGray,
    marginBottom: 10,
  },
  signatureLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#9ca3af',
    marginTop: 20,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 7,
    color: colors.darkGray,
  },
  signedBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  signedText: {
    fontSize: 8,
    color: colors.accent,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signedDate: {
    fontSize: 7,
    color: '#22c55e',
    marginTop: 2,
    textAlign: 'center',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: colors.darkGray,
  },
  footerPage: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.text,
  },
  footerVersion: {
    fontSize: 6,
    color: '#94a3b8',
  },
});

// Digital Stamp Component
const DigitalStamp = ({ approvalDate }: { approvalDate?: string | null }) => {
  const dateStr = approvalDate ? formatArabicDate(approvalDate) : formatArabicDate(new Date().toISOString());
  
  return (
    <View style={styles.stampContainer}>
      <View style={styles.stampOuter}>
        <View style={styles.stampInner}>
          <Text style={styles.stampCheck}>✓</Text>
          <Text style={styles.stampText}>تمت الموافقة</Text>
          <Text style={styles.stampDate}>{dateStr}</Text>
        </View>
      </View>
    </View>
  );
};

// Header Component
const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <>
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{SELLER_INFO.name_ar}</Text>
          <Text style={styles.companyNameEn}>{SELLER_INFO.name_en}</Text>
        </View>
        <View style={styles.contractBadge}>
          <Text style={styles.contractBadgeText}>{title}</Text>
          {subtitle && <Text style={styles.contractBadgeSub}>{subtitle}</Text>}
        </View>
      </View>
    </View>
    <View style={styles.goldBar} />
  </>
);

// Footer Component
const Footer = ({ pageNum, totalPages }: { pageNum: number; totalPages: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      {SELLER_INFO.name_ar} | {SELLER_INFO.phone}
    </Text>
    <Text style={styles.footerPage}>صفحة {pageNum} من {totalPages}</Text>
    <Text style={styles.footerVersion}>v2.2 - 2026</Text>
  </View>
);

export function FinanceContractPdf({ data }: { data: FinanceContractData }) {
  // Contract terms
  const paymentTerms = [
    'يلتزم الطرف الثاني بسداد الأقساط الشهرية المحددة في مواعيد استحقاقها المبينة في جدول السداد المرفق بهذا العقد.',
    'في حالة التأخر عن السداد لمدة تتجاوز خمسة عشر يوماً من تاريخ الاستحقاق، يحق للطرف الأول احتساب غرامة تأخير وفقاً للأنظمة المعمول بها.',
    'يحق للعميل السداد المبكر للمبالغ المتبقية في أي وقت مع خصم الأرباح غير المستحقة عن الفترة المتبقية.',
    'التمويل مخصص حصرياً لشراء الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول ولا يجوز سحبه نقداً.',
  ];

  const obligationTerms = [
    'يقر الطرف الثاني بصحة جميع البيانات والمعلومات المقدمة في طلب التمويل ويتحمل المسؤولية القانونية الكاملة عن أي بيانات غير صحيحة.',
    'يحق للطرف الأول إلغاء هذا العقد واسترداد كامل المبالغ المستحقة فوراً في حال ثبوت تقديم معلومات مغلوطة.',
    'يلتزم الطرف الثاني بإخطار الطرف الأول فوراً بأي تغيير يطرأ على بياناته الشخصية أو وضعه المالي.',
    'لا يحق للطرف الثاني التنازل عن هذا العقد لأي طرف ثالث دون موافقة خطية مسبقة من الطرف الأول.',
  ];

  const finalTerms = [
    'في حال عدم قدرة الطرف الثاني على الوفاء بالتزاماته يحق للطرف الأول اتخاذ الإجراءات القانونية اللازمة.',
    'يخضع هذا العقد لأنظمة وقوانين المملكة العربية السعودية وتختص المحاكم السعودية حصرياً بالنظر في أي نزاع.',
    'حُرر هذا العقد من نسختين أصليتين باللغة العربية لكل طرف نسخة للعمل بموجبها.',
    'يعتبر هذا العقد نافذاً وملزماً للطرفين من تاريخ توقيعه واعتماده.',
  ];

  // Generate installments
  const installments = data.installments || Array.from(
    { length: Math.min(data.application.tenor_months, 12) },
    (_, i) => ({
      installment_no: i + 1,
      due_date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString(),
      amount_sar: data.offer.monthly_payment_sar,
    })
  );

  const totalPages = 3;

  return (
    <Document>
      {/* PAGE 1: Cover, Parties, Financial Summary */}
      <Page size="A4" style={styles.page}>
        <Header title="عقد تمويل داخلي" subtitle="INTERNAL FINANCE CONTRACT" />
        
        {/* Meta Strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>رقم العقد</Text>
            <Text style={styles.metaValue}>{data.contract_number}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>تاريخ الإصدار</Text>
            <Text style={styles.metaValue}>{formatArabicDate(new Date().toISOString())}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>مدة التمويل</Text>
            <Text style={styles.metaValue}>{data.application.tenor_months} شهر</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>حالة العقد</Text>
            <Text style={[styles.metaValue, { color: colors.accent }]}>
              {data.admin_approved_at ? 'معتمد' : data.signed_at ? 'موقع' : 'مسودة'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Preamble */}
          <View style={styles.preambleBox}>
            <Text style={styles.preambleText}>
              بعون الله تعالى، أُبرم هذا العقد بين الطرفين أدناه وفقاً للشروط والأحكام المبينة في هذه الوثيقة، والتي تمثل اتفاقاً ملزماً لكلا الطرفين. يُعد هذا التمويل تمويلاً داخلياً مشروعاً يهدف إلى تسهيل حصول الطرف الثاني على الخدمات المقدمة من الطرف الأول.
            </Text>
          </View>

          {/* Parties */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>أطراف العقد</Text>
            <View style={styles.partiesContainer}>
              {/* First Party */}
              <View style={styles.partyCard}>
                <View style={styles.partyHeader}>
                  <Text style={styles.partyTitle}>الطرف الأول (الممول)</Text>
                  <View style={styles.partyBadge}>
                    <Text style={styles.partyBadgeText}>أ</Text>
                  </View>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الاسم:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.name_ar}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>السجل التجاري:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.cr}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الرقم الضريبي:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.vat}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>العنوان:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.address_ar}</Text>
                </View>
                {data.admin_approved_at && <DigitalStamp approvalDate={data.admin_approved_at} />}
              </View>

              {/* Second Party */}
              <View style={[styles.partyCard, styles.partyCardCustomer]}>
                <View style={styles.partyHeader}>
                  <Text style={styles.partyTitle}>الطرف الثاني (العميل)</Text>
                  <View style={[styles.partyBadge, styles.partyBadgeCustomer]}>
                    <Text style={styles.partyBadgeText}>ب</Text>
                  </View>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الاسم:</Text>
                  <Text style={styles.partyValue}>{data.entity.legal_name_ar}</Text>
                </View>
                {data.entity.national_id && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>رقم الهوية:</Text>
                    <Text style={styles.partyValue}>{data.entity.national_id}</Text>
                  </View>
                )}
                {data.entity.cr_number && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>السجل التجاري:</Text>
                    <Text style={styles.partyValue}>{data.entity.cr_number}</Text>
                  </View>
                )}
                {data.entity.phone && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>رقم الجوال:</Text>
                    <Text style={styles.partyValue}>{data.entity.phone}</Text>
                  </View>
                )}
                {data.entity.email && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>البريد:</Text>
                    <Text style={styles.partyValue}>{data.entity.email}</Text>
                  </View>
                )}
                {data.entity.city && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>المدينة:</Text>
                    <Text style={styles.partyValue}>{data.entity.city}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Financial Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملخص التمويل</Text>
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, styles.summaryCardHighlight]}>
                <Text style={styles.summaryLabel}>قيمة التمويل</Text>
                <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                  {formatCurrency(data.application.amount_sar)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>القسط الشهري</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.offer.monthly_payment_sar)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>عدد الأقساط</Text>
                <Text style={styles.summaryValue}>
                  {data.application.tenor_months} شهر
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>إجمالي السداد</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.offer.total_payable_sar)}
                </Text>
              </View>
            </View>
            {(data.offer.apr_percent > 0 || (data.offer.fees_sar && data.offer.fees_sar > 0)) && (
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>معدل الربح السنوي</Text>
                  <Text style={styles.summaryValue}>{data.offer.apr_percent}%</Text>
                </View>
                {data.offer.fees_sar && data.offer.fees_sar > 0 && (
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>رسوم إدارية</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(data.offer.fees_sar)}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <Footer pageNum={1} totalPages={totalPages} />
      </Page>

      {/* PAGE 2: Terms and Conditions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { fontSize: 14 }]}>{SELLER_INFO.name_ar}</Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.white }}>
              الشروط والأحكام - عقد رقم {data.contract_number}
            </Text>
          </View>
        </View>
        <View style={styles.goldBar} />

        <View style={styles.content}>
          {/* Important Notice */}
          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <View style={styles.noticeIcon}>
                <Text style={styles.noticeIconText}>!</Text>
              </View>
              <Text style={styles.noticeTitle}>تنويه هام - طبيعة التمويل</Text>
            </View>
            <Text style={styles.noticeText}>
              هذا التمويل هو تمويل داخلي قانوني ومشروع وفقاً للأنظمة السعودية، مخصص حصرياً لشراء الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول. لا يشمل هذا التمويل سحب المبالغ نقداً أو تحويلها لأي غرض آخر. يتم صرف قيمة التمويل مباشرة لتغطية تكاليف الخدمات المطلوبة.
            </Text>
          </View>

          {/* Payment Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الأول: التزامات السداد</Text>
            <View style={styles.termsList}>
              {paymentTerms.map((term, i) => (
                <View key={i} style={[styles.termItem, i === paymentTerms.length - 1 && styles.termItemLast]}>
                  <Text style={styles.termNumber}>{i + 1}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Obligation Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الثاني: الإقرارات والالتزامات</Text>
            <View style={styles.termsList}>
              {obligationTerms.map((term, i) => (
                <View key={i} style={[styles.termItem, i === obligationTerms.length - 1 && styles.termItemLast]}>
                  <Text style={styles.termNumber}>{i + 1}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Final Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الثالث: أحكام ختامية</Text>
            <View style={styles.termsList}>
              {finalTerms.map((term, i) => (
                <View key={i} style={[styles.termItem, i === finalTerms.length - 1 && styles.termItemLast]}>
                  <Text style={styles.termNumber}>{i + 1}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Footer pageNum={2} totalPages={totalPages} />
      </Page>

      {/* PAGE 3: Payment Schedule and Signatures */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { fontSize: 14 }]}>{SELLER_INFO.name_ar}</Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.white }}>
              جدول السداد والتوقيعات - عقد رقم {data.contract_number}
            </Text>
          </View>
        </View>
        <View style={styles.goldBar} />

        <View style={styles.content}>
          {/* Installments Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>جدول الأقساط (أول {installments.length} قسط)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>رقم القسط</Text>
                <Text style={styles.tableHeaderCell}>تاريخ الاستحقاق</Text>
                <Text style={styles.tableHeaderCell}>المبلغ (ر.س)</Text>
                <Text style={styles.tableHeaderCell}>الحالة</Text>
              </View>
              {installments.map((inst, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.tableCellBold]}>{inst.installment_no}</Text>
                  <Text style={styles.tableCell}>{formatArabicDate(inst.due_date)}</Text>
                  <Text style={[styles.tableCell, styles.tableCellBold]}>{formatNumber(inst.amount_sar)}</Text>
                  <Text style={styles.tableCell}>مجدول</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>التوقيعات والاعتماد</Text>
            <View style={styles.signatureRow}>
              {/* First Party Signature */}
              <View style={styles.signatureBox}>
                <Text style={styles.signatureBoxTitle}>الطرف الأول (الممول)</Text>
                <Text style={styles.signatureBoxSubtitle}>{SELLER_INFO.name_ar}</Text>
                {data.admin_approved_at ? (
                  <View style={styles.signedBadge}>
                    <Text style={styles.signedText}>تم الاعتماد</Text>
                    <Text style={styles.signedDate}>{formatArabicDate(data.admin_approved_at)}</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>التوقيع والختم</Text>
                  </>
                )}
              </View>

              {/* Second Party Signature */}
              <View style={styles.signatureBox}>
                <Text style={styles.signatureBoxTitle}>الطرف الثاني (العميل)</Text>
                <Text style={styles.signatureBoxSubtitle}>{data.entity.legal_name_ar}</Text>
                {data.signed_at ? (
                  <View style={styles.signedBadge}>
                    <Text style={styles.signedText}>تم التوقيع</Text>
                    <Text style={styles.signedDate}>{formatArabicDate(data.signed_at)}</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>التوقيع</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Legal Notice */}
          <View style={[styles.preambleBox, { marginTop: 20 }]}>
            <Text style={styles.preambleText}>
              هذا العقد ملزم قانونياً لكلا الطرفين من تاريخ توقيعه. أي تعديل على هذا العقد يجب أن يكون خطياً وموقعاً من كلا الطرفين. المحاكم السعودية هي المختصة حصرياً بالفصل في أي نزاع ينشأ عن هذا العقد.
            </Text>
          </View>
        </View>

        <Footer pageNum={3} totalPages={totalPages} />
      </Page>
    </Document>
  );
}
