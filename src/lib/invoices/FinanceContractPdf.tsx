/**
 * FINANCE CONTRACT PDF - Enterprise Legal Document
 * عقد التمويل - شركة علي صالح الشهري القابضة
 * Professional Arabic RTL Legal Contract Template
 * World-Class FinTech / Corporate Standard
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

// Convert Western numerals to Arabic numerals
const toArabicNumerals = (num: number | string): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
};

// Format number with Arabic numerals
const formatNumber = (num: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return toArabicNumerals(formatted);
};

// Format currency with Arabic numerals
const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)} ريال سعودي`;
};

// Format currency short
const formatCurrencyShort = (amount: number): string => {
  return `${formatNumber(amount)} ر.س`;
};

// Format date in Arabic (Gregorian + Hijri style)
const formatArabicDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const arabicDate = date.toLocaleDateString('ar-SA', options);
  return arabicDate;
};

// Format date short
const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = toArabicNumerals(date.getDate());
  const month = toArabicNumerals(date.getMonth() + 1);
  const year = toArabicNumerals(date.getFullYear());
  return `${year}/${month}/${day}`;
};

// Arabic ordinals for articles
const arabicOrdinals = [
  'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة',
  'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة',
  'الحادية عشرة', 'الثانية عشرة'
];

// Colors
const colors = {
  black: '#111111',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#e5e5e5',
  borderGray: '#cccccc',
  white: '#ffffff',
  headerBg: '#1a1a2e',
};

// Premium Legal Styles - Strict RTL
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 12.5,
    backgroundColor: colors.white,
    paddingTop: 70,
    paddingBottom: 70,
    paddingHorizontal: 70,
    lineHeight: 1.8,
  },
  // Fixed Header
  header: {
    position: 'absolute',
    top: 25,
    left: 70,
    right: 70,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerCompany: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'right',
  },
  headerDocType: {
    fontSize: 11,
    color: colors.darkGray,
    textAlign: 'left',
  },
  // Fixed Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 70,
    right: 70,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.black,
    alignItems: 'center',
  },
  footerPage: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 8,
    color: colors.mediumGray,
    textAlign: 'center',
  },
  // Contract Title
  contractTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 6,
  },
  contractNumber: {
    fontSize: 11,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 12,
  },
  // Preamble
  preamble: {
    fontSize: 12.5,
    color: colors.black,
    textAlign: 'right',
    marginBottom: 6,
    lineHeight: 1.8,
  },
  // Section (Article)
  article: {
    marginBottom: 6,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'right',
    marginBottom: 4,
  },
  articleText: {
    fontSize: 12.5,
    color: colors.black,
    textAlign: 'right',
    lineHeight: 1.8,
    marginBottom: 6,
  },
  // Parties Table
  partiesTable: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  partyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  partyRowLast: {
    borderBottomWidth: 0,
  },
  partyHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: '50%',
  },
  partyHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  partyCell: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '50%',
    borderLeftWidth: 1,
    borderLeftColor: colors.borderGray,
  },
  partyCellFirst: {
    borderLeftWidth: 0,
  },
  partyLabel: {
    fontSize: 10,
    color: colors.mediumGray,
    textAlign: 'right',
    marginBottom: 1,
  },
  partyValue: {
    fontSize: 11,
    color: colors.black,
    textAlign: 'right',
  },
  // Payment Schedule Table
  scheduleTable: {
    marginTop: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  scheduleHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
  },
  scheduleHeaderCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightGray,
  },
  scheduleHeaderCellFirst: {
    borderLeftWidth: 0,
  },
  scheduleHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  scheduleRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  scheduleCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderGray,
  },
  scheduleCellFirst: {
    borderLeftWidth: 0,
  },
  scheduleCellText: {
    fontSize: 9,
    color: colors.black,
    textAlign: 'center',
  },
  // Signature Section
  signatureSection: {
    marginTop: 12,
  },
  signatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  signatureParty: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 10,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  signatureLine: {
    width: '80%',
    height: 1,
    backgroundColor: colors.black,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 9,
    color: colors.mediumGray,
    textAlign: 'center',
  },
  signedStamp: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 3,
  },
  signedStampText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
  },
  // Summary Info
  summaryBox: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryRowLast: {
    marginBottom: 0,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.darkGray,
    textAlign: 'right',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'left',
  },
  // Bullet point
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletNumber: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: colors.black,
    width: 25,
    textAlign: 'right',
  },
  bulletText: {
    fontSize: 12.5,
    color: colors.black,
    flex: 1,
    textAlign: 'right',
    lineHeight: 1.8,
  },
});

// Header Component (Fixed)
const Header = () => (
  <View style={styles.header} fixed>
    <Text style={styles.headerDocType}>عقد تمويل</Text>
    <Text style={styles.headerCompany}>شركة علي صالح الشهري القابضة</Text>
  </View>
);

// Footer Component (Fixed)
const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerPage} render={({ pageNumber }) => `صفحة ${toArabicNumerals(pageNumber)}`} />
    <Text style={styles.footerText}>هذا العقد وثيقة رسمية صادرة عن شركة علي صالح الشهري القابضة</Text>
  </View>
);

// Article Component
const Article = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <View style={styles.article} wrap={false}>
    <Text style={styles.articleTitle}>المادة {arabicOrdinals[number - 1]} – {title}</Text>
    {children}
  </View>
);

// Bullet Item Component
const BulletItem = ({ number, text }: { number: number; text: string }) => (
  <View style={styles.bulletItem}>
    <Text style={styles.bulletText}>{text}</Text>
    <Text style={styles.bulletNumber}>{toArabicNumerals(number)}-</Text>
  </View>
);

export function FinanceContractPdf({ data }: { data: FinanceContractData }) {
  // Generate installments
  const installments = data.installments || Array.from(
    { length: data.application.tenor_months },
    (_, i) => ({
      installment_no: i + 1,
      due_date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString(),
      amount_sar: data.offer.monthly_payment_sar,
    })
  );

  const currentDate = new Date().toISOString();
  const contractDate = data.signed_at || currentDate;

  // Entity type label
  const entityTypeLabel = data.entity.entity_type === 'company' ? 'الشركة' : 
                          data.entity.entity_type === 'institution' ? 'المؤسسة' : 'الفرد';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        {/* Contract Title */}
        <Text style={styles.contractTitle}>عقد تمويل</Text>
        <Text style={styles.contractNumber}>رقم العقد: {data.contract_number}</Text>

        {/* Preamble */}
        <Text style={styles.preamble}>
          بعون الله تعالى، تم إبرام هذا العقد في يوم {formatArabicDate(contractDate)} بين كل من الطرفين أدناه، وذلك وفقاً للشروط والأحكام التالية التي تعتبر جزءاً لا يتجزأ من هذا العقد.
        </Text>

        {/* Parties Table */}
        <View style={styles.partiesTable}>
          {/* Headers */}
          <View style={styles.partyRow}>
            <View style={styles.partyHeader}>
              <Text style={styles.partyHeaderText}>الطرف الثاني (المستفيد)</Text>
            </View>
            <View style={[styles.partyHeader, { borderLeftWidth: 1, borderLeftColor: colors.lightGray }]}>
              <Text style={styles.partyHeaderText}>الطرف الأول (الممول)</Text>
            </View>
          </View>
          {/* Names */}
          <View style={styles.partyRow}>
            <View style={styles.partyCell}>
              <Text style={styles.partyLabel}>الاسم</Text>
              <Text style={styles.partyValue}>{data.entity.legal_name_ar}</Text>
            </View>
            <View style={[styles.partyCell, styles.partyCellFirst]}>
              <Text style={styles.partyLabel}>الاسم</Text>
              <Text style={styles.partyValue}>{SELLER_INFO.name_ar}</Text>
            </View>
          </View>
          {/* ID / CR */}
          <View style={styles.partyRow}>
            <View style={styles.partyCell}>
              <Text style={styles.partyLabel}>{data.entity.cr_number ? 'السجل التجاري' : 'رقم الهوية'}</Text>
              <Text style={styles.partyValue}>{data.entity.cr_number || data.entity.national_id || '-'}</Text>
            </View>
            <View style={[styles.partyCell, styles.partyCellFirst]}>
              <Text style={styles.partyLabel}>السجل التجاري</Text>
              <Text style={styles.partyValue}>{SELLER_INFO.cr}</Text>
            </View>
          </View>
          {/* Address */}
          <View style={styles.partyRow}>
            <View style={styles.partyCell}>
              <Text style={styles.partyLabel}>العنوان</Text>
              <Text style={styles.partyValue}>{data.entity.city || data.entity.address_ar || '-'}</Text>
            </View>
            <View style={[styles.partyCell, styles.partyCellFirst]}>
              <Text style={styles.partyLabel}>العنوان</Text>
              <Text style={styles.partyValue}>{SELLER_INFO.address_ar}</Text>
            </View>
          </View>
          {/* Contact */}
          <View style={[styles.partyRow, styles.partyRowLast]}>
            <View style={styles.partyCell}>
              <Text style={styles.partyLabel}>وسائل التواصل</Text>
              <Text style={styles.partyValue}>{data.entity.phone || '-'}</Text>
            </View>
            <View style={[styles.partyCell, styles.partyCellFirst]}>
              <Text style={styles.partyLabel}>وسائل التواصل</Text>
              <Text style={styles.partyValue}>{SELLER_INFO.phone}</Text>
            </View>
          </View>
        </View>

        {/* Article 1: Definitions */}
        <Article number={1} title="التعريفات">
          <Text style={styles.articleText}>
            يقصد بالمصطلحات التالية المعاني الموضحة أمام كل منها: "التمويل" هو المبلغ الذي يقدمه الطرف الأول للطرف الثاني. "القسط" هو المبلغ الشهري المستحق على الطرف الثاني. "مدة التمويل" هي الفترة الزمنية المحددة للسداد. "الخدمات" هي الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول.
          </Text>
        </Article>

        {/* Article 2: Subject Matter */}
        <Article number={2} title="موضوع العقد">
          <Text style={styles.articleText}>
            يوافق الطرف الأول على منح الطرف الثاني تمويلاً داخلياً بغرض الحصول على الخدمات المتاحة عبر الموقع الإلكتروني للطرف الأول، ويقبل الطرف الثاني هذا التمويل ويلتزم بسداده وفقاً للشروط المتفق عليها في هذا العقد. يعتبر هذا التمويل تمويلاً داخلياً قانونياً ومشروعاً وفقاً للأنظمة السعودية المعمول بها.
          </Text>
        </Article>

        {/* Article 3: Finance Amount */}
        <Article number={3} title="مبلغ التمويل">
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{formatCurrency(data.application.amount_sar)}</Text>
              <Text style={styles.summaryLabel}>قيمة التمويل الأصلية</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{toArabicNumerals(data.offer.apr_percent)}٪</Text>
              <Text style={styles.summaryLabel}>معدل الربح السنوي</Text>
            </View>
            {data.offer.fees_sar && data.offer.fees_sar > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryValue}>{formatCurrency(data.offer.fees_sar)}</Text>
                <Text style={styles.summaryLabel}>الرسوم الإدارية</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryValue}>{formatCurrency(data.offer.total_payable_sar)}</Text>
              <Text style={styles.summaryLabel}>إجمالي المبلغ المستحق</Text>
            </View>
          </View>
        </Article>

        {/* Article 4: Finance Duration */}
        <Article number={4} title="مدة التمويل">
          <Text style={styles.articleText}>
            مدة التمويل ({toArabicNumerals(data.application.tenor_months)}) شهراً تبدأ من تاريخ توقيع هذا العقد واعتماده من الطرف الأول. يلتزم الطرف الثاني بسداد جميع الأقساط المستحقة خلال هذه المدة وفقاً لجدول السداد المرفق بهذا العقد.
          </Text>
        </Article>

        {/* Article 5: Payment Schedule */}
        <Article number={5} title="جدول السداد">
          <Text style={styles.articleText}>
            يلتزم الطرف الثاني بسداد القسط الشهري البالغ ({formatCurrency(data.offer.monthly_payment_sar)}) في مواعيد الاستحقاق المحددة أدناه:
          </Text>
          <View style={styles.scheduleTable}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleHeaderCell}>
                <Text style={styles.scheduleHeaderText}>حالة السداد</Text>
              </View>
              <View style={[styles.scheduleHeaderCell, styles.scheduleHeaderCellFirst]}>
                <Text style={styles.scheduleHeaderText}>مبلغ القسط</Text>
              </View>
              <View style={[styles.scheduleHeaderCell, styles.scheduleHeaderCellFirst]}>
                <Text style={styles.scheduleHeaderText}>تاريخ الاستحقاق</Text>
              </View>
              <View style={[styles.scheduleHeaderCell, styles.scheduleHeaderCellFirst]}>
                <Text style={styles.scheduleHeaderText}>رقم القسط</Text>
              </View>
            </View>
            {installments.slice(0, 12).map((inst, i) => (
              <View key={i} style={styles.scheduleRow}>
                <View style={styles.scheduleCell}>
                  <Text style={styles.scheduleCellText}>غير مسدد</Text>
                </View>
                <View style={[styles.scheduleCell, styles.scheduleCellFirst]}>
                  <Text style={styles.scheduleCellText}>{formatCurrencyShort(inst.amount_sar)}</Text>
                </View>
                <View style={[styles.scheduleCell, styles.scheduleCellFirst]}>
                  <Text style={styles.scheduleCellText}>{formatDateShort(inst.due_date)}</Text>
                </View>
                <View style={[styles.scheduleCell, styles.scheduleCellFirst]}>
                  <Text style={styles.scheduleCellText}>{toArabicNumerals(inst.installment_no)}</Text>
                </View>
              </View>
            ))}
          </View>
        </Article>

        {/* Article 6: Fees and Commissions */}
        <Article number={6} title="الرسوم والعمولات">
          <Text style={styles.articleText}>
            يتحمل الطرف الثاني الرسوم الإدارية المحددة في هذا العقد والتي تم احتسابها ضمن إجمالي مبلغ التمويل. لا تُفرض أي رسوم إضافية على الطرف الثاني ما لم ينص عليها هذا العقد صراحة أو تنتج عن إخلال الطرف الثاني بالتزاماته.
          </Text>
        </Article>

        {/* Article 7: Obligations of Second Party */}
        <Article number={7} title="التزامات الطرف الثاني">
          <BulletItem number={1} text="الالتزام بسداد الأقساط في مواعيدها المحددة دون تأخير." />
          <BulletItem number={2} text="استخدام مبلغ التمويل حصرياً لشراء الخدمات من الموقع الإلكتروني للطرف الأول." />
          <BulletItem number={3} text="إخطار الطرف الأول فوراً بأي تغيير في بياناته الشخصية أو وضعه المالي." />
          <BulletItem number={4} text="تقديم أي مستندات أو معلومات يطلبها الطرف الأول." />
        </Article>

        {/* Article 8: Breach of Contract */}
        <Article number={8} title="الإخلال بالعقد">
          <Text style={styles.articleText}>
            في حال إخلال الطرف الثاني بأي من التزاماته الواردة في هذا العقد، يحق للطرف الأول اتخاذ الإجراءات التالية: المطالبة بسداد كامل المبلغ المتبقي فوراً، احتساب غرامة تأخير وفقاً للأنظمة المعمول بها، اتخاذ الإجراءات القانونية اللازمة لاسترداد حقوقه.
          </Text>
        </Article>

        {/* Article 9: Termination */}
        <Article number={9} title="الإنهاء">
          <Text style={styles.articleText}>
            ينتهي هذا العقد بسداد الطرف الثاني لكامل المبالغ المستحقة عليه. يحق للطرف الثاني السداد المبكر مع خصم الأرباح غير المستحقة عن الفترة المتبقية. يحق للطرف الأول إنهاء العقد فوراً في حالة إخلال الطرف الثاني بالتزاماته الجوهرية.
          </Text>
        </Article>

        {/* Article 10: Force Majeure */}
        <Article number={10} title="القوة القاهرة">
          <Text style={styles.articleText}>
            لا يُسأل أي من الطرفين عن عدم تنفيذ التزاماته إذا كان ذلك ناتجاً عن ظروف قاهرة خارجة عن إرادته كالكوارث الطبيعية أو الحروب أو القرارات الحكومية، على أن يُخطر الطرف الآخر فور علمه بذلك.
          </Text>
        </Article>

        {/* Article 11: Notices */}
        <Article number={11} title="الإشعارات">
          <Text style={styles.articleText}>
            تكون جميع الإشعارات والمراسلات بين الطرفين عبر وسائل التواصل المدونة في هذا العقد، وتعتبر نافذة من تاريخ إرسالها إلكترونياً أو من تاريخ استلامها إذا أرسلت بالبريد المسجل.
          </Text>
        </Article>

        {/* Article 12: Governing Law */}
        <Article number={12} title="القانون والاختصاص">
          <Text style={styles.articleText}>
            يخضع هذا العقد لأنظمة وقوانين المملكة العربية السعودية، وتختص المحاكم السعودية المختصة حصرياً بالنظر في أي نزاع ينشأ عن هذا العقد أو يتعلق بتفسيره أو تنفيذه.
          </Text>
        </Article>

        {/* Signature Section */}
        <View style={styles.signatureSection} wrap={false}>
          <Text style={styles.signatureTitle}>التوقيع والختم</Text>
          <View style={styles.signatureRow}>
            {/* Second Party */}
            <View style={styles.signatureBox}>
              <Text style={styles.signatureParty}>الطرف الثاني</Text>
              <Text style={styles.signatureName}>{data.entity.legal_name_ar}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>التوقيع</Text>
              {data.signed_at && (
                <View style={styles.signedStamp}>
                  <Text style={styles.signedStampText}>تم التوقيع بتاريخ {formatDateShort(data.signed_at)}</Text>
                </View>
              )}
            </View>
            {/* First Party */}
            <View style={styles.signatureBox}>
              <Text style={styles.signatureParty}>الطرف الأول</Text>
              <Text style={styles.signatureName}>{SELLER_INFO.name_ar}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>التوقيع والختم</Text>
              {data.admin_approved_at && (
                <View style={styles.signedStamp}>
                  <Text style={styles.signedStampText}>تم الاعتماد بتاريخ {formatDateShort(data.admin_approved_at)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}

export default FinanceContractPdf;
