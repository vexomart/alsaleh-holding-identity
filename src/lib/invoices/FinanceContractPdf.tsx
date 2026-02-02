/**
 * FINANCE CONTRACT PDF TEMPLATE - Premium World-Class Design
 * عقد التمويل الداخلي - شركة علي صالح الشهري القابضة
 * Multi-page professional legal document with digital stamp
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
  Circle,
  Path,
} from '@react-pdf/renderer';
import { SELLER_INFO } from './constants';
import { keepLtrToken, formatMoneySAR, formatDateAr } from './rtl';

// Register Cairo fonts
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

// Premium Legal Styles - World-Class Design
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 10,
    padding: 0,
    backgroundColor: '#ffffff',
    direction: 'rtl',
    position: 'relative',
  },
  // Premium Header
  header: {
    backgroundColor: '#0c1929',
    paddingVertical: 25,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#d4af37',
  },
  companyBlock: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'right',
  },
  companyNameEn: {
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'right',
    letterSpacing: 1,
  },
  contractBadge: {
    backgroundColor: '#166534',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  contractTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  contractTitleSub: {
    fontSize: 8,
    color: '#bbf7d0',
    textAlign: 'center',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  // Gold Accent Strip
  goldStrip: {
    height: 3,
    backgroundColor: '#d4af37',
  },
  // Meta Strip
  metaStrip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  metaItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  metaLabel: {
    fontSize: 7,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  // Content
  content: {
    padding: 40,
    paddingTop: 30,
    paddingBottom: 80,
  },
  // Section styling
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  // Parties Section
  partiesRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 15,
  },
  partyCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderTopWidth: 3,
    borderTopColor: '#0c1929',
  },
  partyCardSecond: {
    borderTopColor: '#166534',
  },
  partyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  partyTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  partyBadge: {
    backgroundColor: '#0c1929',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  partyBadgeSecond: {
    backgroundColor: '#166534',
  },
  partyBadgeText: {
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  partyRow: {
    flexDirection: 'row-reverse',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  partyLabel: {
    fontSize: 8,
    color: '#6b7280',
    width: 75,
    textAlign: 'right',
  },
  partyValue: {
    fontSize: 9,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  // Digital Stamp
  stampContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  digitalStamp: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#166534',
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  stampInnerRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampContent: {
    alignItems: 'center',
  },
  stampCheck: {
    fontSize: 16,
    color: '#166534',
    fontWeight: 'bold',
  },
  stampText: {
    fontSize: 6,
    color: '#166534',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  stampCompany: {
    fontSize: 5,
    color: '#15803d',
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 60,
  },
  stampDate: {
    fontSize: 5,
    color: '#22c55e',
    marginTop: 2,
  },
  // Financial Summary Grid
  summaryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  summaryBox: {
    width: '23%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  summaryBoxHighlight: {
    backgroundColor: '#fefce8',
    borderLeftColor: '#166534',
  },
  summaryBoxLabel: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryBoxValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  summaryBoxValueGreen: {
    color: '#166534',
  },
  // Preamble
  preamble: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    borderRightWidth: 4,
    borderRightColor: '#d4af37',
  },
  preambleText: {
    fontSize: 9,
    color: '#92400e',
    textAlign: 'right',
    lineHeight: 1.7,
  },
  // Important Notice
  importantNotice: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  noticeHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  noticeIconText: {
    fontSize: 10,
    color: '#ffffff',
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
    lineHeight: 1.7,
  },
  // Terms List
  termsList: {
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  termItem: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
    paddingBottom: 10,
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
    color: '#d4af37',
    width: 22,
    textAlign: 'right',
  },
  termText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
    lineHeight: 1.6,
  },
  // Installments Table
  installmentsTable: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0c1929',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
    flex: 1,
  },
  tableCellBold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  // Signature Section
  signatureSection: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#d4af37',
  },
  signatureSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
  },
  signatureRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  signatureSubtitle: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 12,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#9ca3af',
    marginBottom: 6,
    marginTop: 25,
  },
  signatureLabel: {
    fontSize: 7,
    color: '#6b7280',
  },
  signedBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  signedText: {
    fontSize: 8,
    color: '#166534',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signedDate: {
    fontSize: 7,
    color: '#22c55e',
    marginTop: 3,
    textAlign: 'center',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },
  footerPage: {
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  footerVersion: {
    fontSize: 6,
    color: '#94a3b8',
  },
  // Page break helper
  pageBreak: {
    marginTop: 'auto',
  },
  // Watermark
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    fontSize: 60,
    color: '#f0f0f0',
    transform: 'rotate(-30deg)',
    opacity: 0.1,
  },
});

// Digital Stamp Component for PDF
const DigitalStampPdf = ({ approvalDate }: { approvalDate?: string | null }) => {
  const formattedDate = approvalDate
    ? new Date(approvalDate).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : new Date().toLocaleDateString('ar-SA');

  return (
    <View style={styles.stampContainer}>
      <View style={styles.digitalStamp}>
        <View style={styles.stampInnerRing}>
          <View style={styles.stampContent}>
            <Text style={styles.stampCheck}>✓</Text>
            <Text style={styles.stampText}>تمت الموافقة</Text>
            <Text style={styles.stampCompany}>{SELLER_INFO.name_ar}</Text>
            <Text style={styles.stampDate}>{keepLtrToken(formattedDate)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export function FinanceContractPdf({ data }: { data: FinanceContractData }) {
  // Contract Terms - Split into manageable groups
  const termsGroup1 = [
    'يلتزم الطرف الثاني (العميل) بسداد الأقساط الشهرية المحددة في مواعيد استحقاقها المبينة في جدول السداد المرفق بهذا العقد.',
    'في حالة التأخر عن السداد لمدة تتجاوز خمسة عشر (15) يوماً من تاريخ الاستحقاق، يحق للطرف الأول احتساب غرامة تأخير وفقاً للأنظمة والتعليمات المعمول بها في المملكة العربية السعودية.',
    'يحق للعميل السداد المبكر للمبالغ المتبقية في أي وقت، مع خصم الأرباح غير المستحقة عن الفترة المتبقية من مدة التمويل.',
    'التمويل مخصص حصرياً لشراء الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول، ولا يجوز استخدامه لأي غرض آخر أو سحبه نقداً أو تحويله.',
  ];

  const termsGroup2 = [
    'يقر الطرف الثاني بصحة جميع البيانات والمعلومات المقدمة في طلب التمويل، ويتحمل المسؤولية القانونية الكاملة عن أي بيانات غير صحيحة أو مضللة.',
    'يحق للطرف الأول إلغاء هذا العقد واسترداد كامل المبالغ المستحقة فوراً في حال ثبوت تقديم الطرف الثاني لمعلومات مغلوطة أو مخالفة للأنظمة.',
    'يلتزم الطرف الثاني بإخطار الطرف الأول فوراً بأي تغيير يطرأ على بياناته الشخصية أو وضعه المالي أو القانوني.',
    'لا يحق للطرف الثاني التنازل عن هذا العقد أو أي من حقوقه أو التزاماته الناشئة عنه لأي طرف ثالث دون موافقة خطية مسبقة من الطرف الأول.',
  ];

  const termsGroup3 = [
    'في حال عدم قدرة الطرف الثاني على الوفاء بالتزاماته، يحق للطرف الأول اتخاذ الإجراءات القانونية اللازمة لاسترداد حقوقه، بما في ذلك اللجوء للجهات القضائية المختصة.',
    'يخضع هذا العقد لأنظمة وقوانين المملكة العربية السعودية، وتختص المحاكم السعودية حصرياً بالنظر في أي نزاع ينشأ عن تفسيره أو تنفيذه.',
    'حُرر هذا العقد من نسختين أصليتين باللغة العربية، لكل طرف نسخة للعمل بموجبها.',
    'يعتبر هذا العقد نافذاً وملزماً للطرفين من تاريخ توقيعه واعتماده.',
  ];

  // Generate installments if not provided
  const installments = data.installments || Array.from(
    { length: Math.min(data.application.tenor_months, 12) },
    (_, i) => ({
      installment_no: i + 1,
      due_date: new Date(
        new Date().setMonth(new Date().getMonth() + i + 1)
      ).toISOString(),
      amount_sar: data.offer.monthly_payment_sar,
    })
  );

  return (
    <Document>
      {/* PAGE 1: Header, Parties, Financial Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header Decoration */}
        <View style={styles.headerDecor} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{SELLER_INFO.name_ar}</Text>
            <Text style={styles.companyNameEn}>{SELLER_INFO.name_en}</Text>
          </View>
          <View style={styles.contractBadge}>
            <Text style={styles.contractTitle}>عقد تمويل داخلي</Text>
            <Text style={styles.contractTitleSub}>INTERNAL FINANCE CONTRACT</Text>
          </View>
        </View>

        {/* Gold Strip */}
        <View style={styles.goldStrip} />

        {/* Meta Strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>رقم العقد</Text>
            <Text style={styles.metaValue}>{keepLtrToken(data.contract_number)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>تاريخ الإصدار</Text>
            <Text style={styles.metaValue}>
              {formatDateAr(new Date().toISOString())}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>مدة التمويل</Text>
            <Text style={styles.metaValue}>{keepLtrToken(data.application.tenor_months)} شهر</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>حالة العقد</Text>
            <Text style={[styles.metaValue, { color: '#166534' }]}>
              {data.admin_approved_at ? 'معتمد' : data.signed_at ? 'موقع' : 'مسودة'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Preamble */}
          <View style={styles.preamble} wrap={false}>
            <Text style={styles.preambleText}>
              بعون الله تعالى، أُبرم هذا العقد بين الطرفين أدناه وفقاً للشروط والأحكام المبينة في هذه الوثيقة، 
              والتي تمثل اتفاقاً ملزماً لكلا الطرفين. يُعد هذا التمويل تمويلاً داخلياً مشروعاً يهدف إلى 
              تسهيل حصول الطرف الثاني على الخدمات المقدمة من الطرف الأول.
            </Text>
          </View>

          {/* Section: Parties */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>أطراف العقد</Text>
            <View style={styles.partiesRow}>
              {/* First Party */}
              <View style={styles.partyCard}>
                <View style={styles.partyHeader}>
                  <Text style={styles.partyTitle}>الطرف الأول (الممول)</Text>
                  <View style={styles.partyBadge}>
                    <Text style={styles.partyBadgeText}>PARTY A</Text>
                  </View>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الاسم التجاري:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.name_ar}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>السجل التجاري:</Text>
                  <Text style={styles.partyValue}>{keepLtrToken(SELLER_INFO.cr)}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الرقم الضريبي:</Text>
                  <Text style={styles.partyValue}>{keepLtrToken(SELLER_INFO.vat)}</Text>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>العنوان:</Text>
                  <Text style={styles.partyValue}>{SELLER_INFO.address_ar}</Text>
                </View>
                {/* Digital Stamp for First Party */}
                {data.admin_approved_at && (
                  <DigitalStampPdf approvalDate={data.admin_approved_at} />
                )}
              </View>

              {/* Second Party */}
              <View style={[styles.partyCard, styles.partyCardSecond]}>
                <View style={styles.partyHeader}>
                  <Text style={styles.partyTitle}>الطرف الثاني (العميل)</Text>
                  <View style={[styles.partyBadge, styles.partyBadgeSecond]}>
                    <Text style={styles.partyBadgeText}>PARTY B</Text>
                  </View>
                </View>
                <View style={styles.partyRow}>
                  <Text style={styles.partyLabel}>الاسم الكامل:</Text>
                  <Text style={styles.partyValue}>{data.entity.legal_name_ar}</Text>
                </View>
                {data.entity.national_id && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>رقم الهوية:</Text>
                    <Text style={styles.partyValue}>{keepLtrToken(data.entity.national_id)}</Text>
                  </View>
                )}
                {data.entity.cr_number && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>السجل التجاري:</Text>
                    <Text style={styles.partyValue}>{keepLtrToken(data.entity.cr_number)}</Text>
                  </View>
                )}
                {data.entity.phone && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>رقم الجوال:</Text>
                    <Text style={styles.partyValue}>{keepLtrToken(data.entity.phone)}</Text>
                  </View>
                )}
                {data.entity.email && (
                  <View style={styles.partyRow}>
                    <Text style={styles.partyLabel}>البريد الإلكتروني:</Text>
                    <Text style={styles.partyValue}>{keepLtrToken(data.entity.email || '')}</Text>
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

          {/* Section: Financial Summary */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>ملخص التمويل</Text>
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryBox, styles.summaryBoxHighlight]}>
                <Text style={styles.summaryBoxLabel}>قيمة التمويل</Text>
                <Text style={[styles.summaryBoxValue, styles.summaryBoxValueGreen]}>
                  {formatMoneySAR(data.application.amount_sar)}
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>القسط الشهري</Text>
                <Text style={styles.summaryBoxValue}>
                  {formatMoneySAR(data.offer.monthly_payment_sar)}
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>عدد الأقساط</Text>
                <Text style={styles.summaryBoxValue}>
                  {keepLtrToken(data.application.tenor_months)} شهر
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>إجمالي السداد</Text>
                <Text style={styles.summaryBoxValue}>
                  {formatMoneySAR(data.offer.total_payable_sar)}
                </Text>
              </View>
            </View>
            {data.offer.apr_percent > 0 && (
              <View style={[styles.summaryGrid, { marginTop: 10 }]}>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryBoxLabel}>معدل الربح السنوي</Text>
                  <Text style={styles.summaryBoxValue}>
                    {keepLtrToken(data.offer.apr_percent)}%
                  </Text>
                </View>
                {data.offer.fees_sar && data.offer.fees_sar > 0 && (
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryBoxLabel}>رسوم إدارية</Text>
                    <Text style={styles.summaryBoxValue}>
                      {formatMoneySAR(data.offer.fees_sar)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {SELLER_INFO.name_ar} | {keepLtrToken(SELLER_INFO.phone)}
          </Text>
          <Text style={styles.footerPage}>صفحة 1 من 3</Text>
          <Text style={styles.footerVersion}>v2.1 - 2026</Text>
        </View>
      </Page>

      {/* PAGE 2: Terms and Conditions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerDecor} />
        <View style={[styles.header, { paddingVertical: 15 }]}>
          <View style={styles.companyBlock}>
            <Text style={[styles.companyName, { fontSize: 14 }]}>{SELLER_INFO.name_ar}</Text>
          </View>
          <View>
            <Text style={[styles.contractTitle, { fontSize: 11 }]}>
              الشروط والأحكام - عقد رقم {keepLtrToken(data.contract_number)}
            </Text>
          </View>
        </View>
        <View style={styles.goldStrip} />

        <View style={styles.content}>
          {/* Important Notice */}
          <View style={styles.importantNotice} wrap={false}>
            <View style={styles.noticeHeader}>
              <View style={styles.noticeIcon}>
                <Text style={styles.noticeIconText}>!</Text>
              </View>
              <Text style={styles.noticeTitle}>تنويه هام - طبيعة التمويل</Text>
            </View>
            <Text style={styles.noticeText}>
              هذا التمويل هو تمويل داخلي قانوني ومشروع وفقاً للأنظمة السعودية، مخصص حصرياً لشراء 
              الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول. لا يشمل هذا التمويل سحب المبالغ 
              نقداً أو تحويلها لأي غرض آخر. يتم صرف قيمة التمويل مباشرة لتغطية تكاليف الخدمات 
              المطلوبة من الطرف الثاني، وفقاً للضوابط الشرعية والنظامية المعمول بها.
            </Text>
          </View>

          {/* Terms Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الأول: التزامات السداد</Text>
            <View style={styles.termsList}>
              {termsGroup1.map((term, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.termItem, 
                    index === termsGroup1.length - 1 && styles.termItemLast
                  ]}
                  wrap={false}
                >
                  <Text style={styles.termNumber}>{keepLtrToken(index + 1)}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Terms Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الثاني: الإقرارات والتعهدات</Text>
            <View style={styles.termsList}>
              {termsGroup2.map((term, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.termItem, 
                    index === termsGroup2.length - 1 && styles.termItemLast
                  ]}
                  wrap={false}
                >
                  <Text style={styles.termNumber}>{keepLtrToken(index + 5)}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Terms Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>البند الثالث: أحكام ختامية</Text>
            <View style={styles.termsList}>
              {termsGroup3.map((term, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.termItem, 
                    index === termsGroup3.length - 1 && styles.termItemLast
                  ]}
                  wrap={false}
                >
                  <Text style={styles.termNumber}>{keepLtrToken(index + 9)}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {SELLER_INFO.name_ar} | {keepLtrToken(SELLER_INFO.phone)}
          </Text>
          <Text style={styles.footerPage}>صفحة 2 من 3</Text>
          <Text style={styles.footerVersion}>v2.1 - 2026</Text>
        </View>
      </Page>

      {/* PAGE 3: Installments Schedule & Signatures */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerDecor} />
        <View style={[styles.header, { paddingVertical: 15 }]}>
          <View style={styles.companyBlock}>
            <Text style={[styles.companyName, { fontSize: 14 }]}>{SELLER_INFO.name_ar}</Text>
          </View>
          <View>
            <Text style={[styles.contractTitle, { fontSize: 11 }]}>
              جدول السداد والتوقيعات - عقد رقم {keepLtrToken(data.contract_number)}
            </Text>
          </View>
        </View>
        <View style={styles.goldStrip} />

        <View style={styles.content}>
          {/* Installments Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>جدول الأقساط (أول 12 قسط)</Text>
            <View style={styles.installmentsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>رقم القسط</Text>
                <Text style={styles.tableHeaderCell}>تاريخ الاستحقاق</Text>
                <Text style={styles.tableHeaderCell}>المبلغ (ر.س)</Text>
                <Text style={styles.tableHeaderCell}>الحالة</Text>
              </View>
              {installments.slice(0, 12).map((inst, index) => (
                <View
                  key={index}
                  style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                  wrap={false}
                >
                  <Text style={[styles.tableCell, styles.tableCellBold]}>
                    {keepLtrToken(inst.installment_no)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatDateAr(inst.due_date)}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellBold]}>
                    {formatMoneySAR(inst.amount_sar)}
                  </Text>
                  <Text style={styles.tableCell}>مجدول</Text>
                </View>
              ))}
            </View>
            {data.application.tenor_months > 12 && (
              <Text style={{ fontSize: 8, color: '#6b7280', textAlign: 'right', marginTop: 8 }}>
                * يتبقى {keepLtrToken(data.application.tenor_months - 12)} قسط إضافي بنفس القيمة الشهرية
              </Text>
            )}
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection} wrap={false}>
            <Text style={styles.signatureSectionTitle}>التوقيعات والاعتماد</Text>
            <View style={styles.signatureRow}>
              {/* First Party Signature */}
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>الطرف الأول (الممول)</Text>
                <Text style={styles.signatureSubtitle}>{SELLER_INFO.name_ar}</Text>
                {data.admin_approved_at ? (
                  <>
                    <DigitalStampPdf approvalDate={data.admin_approved_at} />
                    <View style={styles.signedBadge}>
                      <Text style={styles.signedText}>تم الاعتماد رسمياً</Text>
                      <Text style={styles.signedDate}>
                        {formatDateAr(data.admin_approved_at)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>التوقيع والختم الرسمي</Text>
                  </>
                )}
              </View>

              {/* Second Party Signature */}
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>الطرف الثاني (العميل)</Text>
                <Text style={styles.signatureSubtitle}>{data.entity.legal_name_ar}</Text>
                {data.signed_at ? (
                  <View style={styles.signedBadge}>
                    <Text style={styles.signedText}>تم التوقيع إلكترونياً</Text>
                    <Text style={styles.signedDate}>
                      {formatDateAr(data.signed_at)}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>توقيع العميل</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Legal Notice */}
          <View style={[styles.importantNotice, { marginTop: 20, backgroundColor: '#fef2f2', borderColor: '#fca5a5' }]} wrap={false}>
            <Text style={[styles.noticeTitle, { color: '#dc2626' }]}>إقرار نهائي</Text>
            <Text style={[styles.noticeText, { color: '#991b1b' }]}>
              بتوقيع هذا العقد، يقر الطرفان بأنهما قد قرءا جميع الشروط والأحكام الواردة فيه وفهماها 
              تماماً، وأنهما يوافقان عليها بكامل إرادتهما دون إكراه أو ضغط. يُعتبر هذا العقد ملزماً 
              قانونياً من تاريخ توقيعه.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {SELLER_INFO.name_ar} | {keepLtrToken(SELLER_INFO.phone)} | {keepLtrToken(SELLER_INFO.email)}
          </Text>
          <Text style={styles.footerPage}>صفحة 3 من 3</Text>
          <Text style={styles.footerVersion}>v2.1 - 2026</Text>
        </View>
      </Page>
    </Document>
  );
}

export default FinanceContractPdf;
