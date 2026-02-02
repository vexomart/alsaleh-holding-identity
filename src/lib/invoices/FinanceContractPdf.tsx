/**
 * FINANCE CONTRACT PDF TEMPLATE - Premium Legal Design
 * عقد التمويل الداخلي - شركة علي صالح الشهري القابضة
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
  entity: {
    legal_name_ar: string;
    entity_type: string;
    national_id?: string | null;
    cr_number?: string | null;
    phone?: string | null;
    email?: string | null;
    address_ar?: string | null;
  };
  application: {
    amount_sar: number;
    tenor_months: number;
  };
  offer: {
    apr_percent: number;
    fees_sar: number | null;
    monthly_payment_sar: number;
    total_payable_sar: number;
  };
}

// Premium Legal Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 10,
    padding: 0,
    backgroundColor: '#ffffff',
    direction: 'rtl',
  },
  // Header
  header: {
    backgroundColor: '#0f172a',
    paddingVertical: 30,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyBlock: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'right',
  },
  companyNameEn: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'right',
  },
  contractBadge: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  contractTitleSub: {
    fontSize: 9,
    color: '#dcfce7',
    textAlign: 'center',
    marginTop: 2,
  },
  // Meta Strip
  metaStrip: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  // Content
  content: {
    padding: 40,
    paddingTop: 25,
  },
  // Parties Section
  partiesRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 20,
  },
  partyCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  partyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
  },
  partyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
  partyRow: {
    flexDirection: 'row-reverse',
    marginBottom: 6,
  },
  partyLabel: {
    fontSize: 8,
    color: '#64748b',
    width: 70,
    textAlign: 'right',
  },
  partyValue: {
    fontSize: 9,
    color: '#0f172a',
    flex: 1,
    textAlign: 'right',
  },
  // Financial Summary
  summarySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryBox: {
    width: '23%',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
  },
  summaryBoxLabel: {
    fontSize: 8,
    color: '#15803d',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryBoxValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
  },
  // Terms Section
  termsSection: {
    marginBottom: 25,
  },
  importantNotice: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'right',
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 9,
    color: '#1e3a8a',
    textAlign: 'right',
    lineHeight: 1.6,
  },
  termsList: {
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  termItem: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },
  termNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#16a34a',
    width: 20,
    textAlign: 'right',
  },
  termText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
    lineHeight: 1.5,
  },
  // Signature Section
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  signatureRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#94a3b8',
    marginBottom: 6,
    marginTop: 30,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  signedBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  signedText: {
    fontSize: 9,
    color: '#166534',
    fontWeight: 'bold',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export function FinanceContractPdf({ data }: { data: FinanceContractData }) {
  const terms = [
    'يلتزم الطرف الثاني (العميل) بسداد الأقساط الشهرية المحددة في مواعيد استحقاقها.',
    'في حالة التأخر عن السداد، يحق للطرف الأول احتساب غرامة تأخير وفقاً للأنظمة المعمول بها.',
    'يحق للعميل السداد المبكر للمبالغ المتبقية مع خصم الأرباح غير المستحقة.',
    'التمويل مخصص فقط لشراء الخدمات عبر الموقع ولا يجوز استخدامه لأي غرض آخر.',
    'يقر الطرف الثاني بصحة جميع البيانات المقدمة ويتحمل المسؤولية الكاملة عن أي معلومات غير صحيحة.',
    'يخضع هذا العقد لأنظمة وقوانين المملكة العربية السعودية، وتختص المحاكم السعودية بالنظر في أي نزاع ينشأ عنه.',
    'يعتبر هذا العقد سارياً من تاريخ التوقيع عليه من الطرفين.',
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{SELLER_INFO.name_ar}</Text>
            <Text style={styles.companyNameEn}>{SELLER_INFO.name_en}</Text>
          </View>
          <View style={styles.contractBadge}>
            <Text style={styles.contractTitle}>عقد التمويل الداخلي</Text>
            <Text style={styles.contractTitleSub}>Internal Finance Contract</Text>
          </View>
        </View>

        {/* Meta Strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>رقم العقد</Text>
            <Text style={styles.metaValue}>{keepLtrToken(data.contract_number)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>تاريخ التوقيع</Text>
            <Text style={styles.metaValue}>
              {data.signed_at ? formatDateAr(data.signed_at) : 'غير موقع'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>مدة السداد</Text>
            <Text style={styles.metaValue}>{keepLtrToken(data.application.tenor_months)} شهر</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Parties */}
          <View style={styles.partiesRow}>
            {/* First Party */}
            <View style={styles.partyCard}>
              <View style={styles.partyHeader}>
                <Text style={styles.partyTitle}>الطرف الأول (الممول)</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>الاسم:</Text>
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
            </View>

            {/* Second Party */}
            <View style={styles.partyCard}>
              <View style={styles.partyHeader}>
                <Text style={styles.partyTitle}>الطرف الثاني (العميل)</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>الاسم:</Text>
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
                  <Text style={styles.partyLabel}>الجوال:</Text>
                  <Text style={styles.partyValue}>{keepLtrToken(data.entity.phone)}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Financial Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>ملخص التمويل</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>قيمة التمويل</Text>
                <Text style={styles.summaryBoxValue}>{formatMoneySAR(data.application.amount_sar)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>القسط الشهري</Text>
                <Text style={styles.summaryBoxValue}>{formatMoneySAR(data.offer.monthly_payment_sar)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>عدد الأقساط</Text>
                <Text style={styles.summaryBoxValue}>{keepLtrToken(data.application.tenor_months)} شهر</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>إجمالي السداد</Text>
                <Text style={styles.summaryBoxValue}>{formatMoneySAR(data.offer.total_payable_sar)}</Text>
              </View>
            </View>
          </View>

          {/* Important Notice */}
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>الشروط والأحكام</Text>
            
            <View style={styles.importantNotice}>
              <Text style={styles.noticeTitle}>تنويه هام - طبيعة التمويل</Text>
              <Text style={styles.noticeText}>
                هذا التمويل هو تمويل داخلي قانوني مخصص حصرياً لشراء الخدمات المتاحة عبر الموقع الإلكتروني، 
                ولا يشمل سحب المبالغ نقداً أو تحويلها لأي غرض آخر. يتم صرف قيمة التمويل مباشرة 
                لتغطية تكاليف الخدمات المطلوبة من الطرف الثاني.
              </Text>
            </View>

            <View style={styles.termsList}>
              {terms.map((term, index) => (
                <View key={index} style={styles.termItem}>
                  <Text style={styles.termNumber}>{keepLtrToken(index + 1)}.</Text>
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>الطرف الأول</Text>
                <Text style={styles.signatureLabel}>{SELLER_INFO.name_ar}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>التوقيع والختم</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>الطرف الثاني</Text>
                <Text style={styles.signatureLabel}>{data.entity.legal_name_ar}</Text>
                {data.signed_at ? (
                  <View style={styles.signedBadge}>
                    <Text style={styles.signedText}>
                      تم التوقيع إلكترونياً بتاريخ {formatDateAr(data.signed_at)}
                    </Text>
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {SELLER_INFO.name_ar} | {keepLtrToken(SELLER_INFO.phone)} | {keepLtrToken(SELLER_INFO.email)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default FinanceContractPdf;
