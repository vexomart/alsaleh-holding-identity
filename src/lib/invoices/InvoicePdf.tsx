/**
 * INVOICE PDF TEMPLATE - Premium Voucher Design
 * تصميم سند الصرف الاحترافي
 * شركة علي صالح الشهري القابضة
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
import type { InvoiceDataNew, InvoiceTotals } from './types';
import { calculateInvoiceTotals, formatShortDate, calculateLineTotal } from './invoice-utils';
import { SELLER_INFO } from './constants';

// Register Cairo fonts
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Company Info (single source of truth)
const COMPANY = {
  name_ar: SELLER_INFO.name_ar,
  name_en: SELLER_INFO.name_en,
  vat: SELLER_INFO.vat,
  cr: SELLER_INFO.cr,
  address_ar: SELLER_INFO.address_ar,
  address_en: SELLER_INFO.address_en,
  phone: SELLER_INFO.phone,
  email: SELLER_INFO.email,
  website: SELLER_INFO.website,
};

// Premium Voucher-Style Design
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 9,
    padding: 0,
    backgroundColor: '#f0fdfa',
  },
  
  // ========== HEADER - Premium Gradient Style ==========
  header: {
    backgroundColor: '#0f766e',
    paddingVertical: 28,
    paddingHorizontal: 35,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0d9488',
    opacity: 0.3,
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'right',
  },
  companySubtitle: {
    fontSize: 10,
    color: '#ccfbf1',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  // Gold Badge - Like Voucher
  invoiceBadge: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 30,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeSubtitle: {
    fontSize: 8,
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // ========== INFO BAR - Navy Strip ==========
  infoBar: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 35,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 7,
    color: '#94a3b8',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // ========== MAIN CONTENT ==========
  content: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 30,
    paddingTop: 25,
  },

  // ========== AMOUNT SECTION - Featured Box ==========
  amountSection: {
    backgroundColor: '#f0fdfa',
    borderWidth: 3,
    borderColor: '#0f766e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 6,
  },
  amountCurrency: {
    fontSize: 14,
    color: '#0f766e',
    opacity: 0.8,
  },
  amountWords: {
    fontSize: 11,
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
  },

  // ========== PARTIES GRID ==========
  partiesGrid: {
    flexDirection: 'row-reverse',
    gap: 16,
    marginBottom: 24,
  },
  partyCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  partyHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  partyHeaderSeller: {
    backgroundColor: '#1e293b',
  },
  partyHeaderBuyer: {
    backgroundColor: '#0f766e',
  },
  partyIcon: {
    width: 22,
    height: 22,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  partyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  partyBody: {
    padding: 14,
    backgroundColor: '#fafafa',
  },
  partyName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'right',
  },
  partyDetail: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  partyDetailLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  // ========== ITEMS TABLE ==========
  tableSection: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'right',
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#f59e0b',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  // Column widths
  colNum: { width: '6%', textAlign: 'center' },
  colDesc: { width: '40%', textAlign: 'right' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '14%', textAlign: 'center' },
  colVat: { width: '14%', textAlign: 'center' },
  colTotal: { width: '16%', textAlign: 'left' },
  headerCell: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cell: {
    color: '#1e293b',
    fontSize: 9,
  },
  cellBold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },

  // ========== TOTALS CARD - Banking Style ==========
  totalsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  totalsCard: {
    width: '55%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalsLabel: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'right',
  },
  totalsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'left',
  },
  totalsFinal: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0f766e',
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'left',
  },

  // ========== NOTES SECTION ==========
  notesSection: {
    marginTop: 20,
    backgroundColor: '#fffbeb',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 12,
    padding: 16,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6,
    textAlign: 'right',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  notesIcon: {
    fontSize: 12,
  },
  notesText: {
    fontSize: 10,
    color: '#78350f',
    textAlign: 'right',
    lineHeight: 1.6,
  },

  // ========== FOOTER - Premium Corporate ==========
  footer: {
    backgroundColor: '#0f172a',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 25,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    alignItems: 'flex-end',
  },
  footerCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 3,
  },
  footerSlogan: {
    fontSize: 8,
    color: '#94a3b8',
  },
  footerCenter: {
    alignItems: 'center',
  },
  footerContact: {
    fontSize: 8,
    color: '#ffffff',
    marginBottom: 2,
  },
  footerRight: {
    alignItems: 'flex-start',
  },
  footerPage: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 2,
  },
  versionStamp: {
    fontSize: 6,
    color: '#64748b',
    letterSpacing: 0.5,
  },
});

// Arabic number words helper
function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const o = n % 10;
      const t = Math.floor(n / 10);
      if (o === 0) return tens[t];
      return ones[o] + ' و' + tens[t];
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      if (r === 0) return hundreds[h];
      return hundreds[h] + ' و' + convert(r);
    }
    if (n < 1000000) {
      const t = Math.floor(n / 1000);
      const r = n % 1000;
      let tw = '';
      if (t === 1) tw = 'ألف';
      else if (t === 2) tw = 'ألفان';
      else if (t <= 10) tw = convert(t) + ' آلاف';
      else tw = convert(t) + ' ألف';
      if (r === 0) return tw;
      return tw + ' و' + convert(r);
    }
    return n.toString();
  }

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  
  let result = convert(intPart) || 'صفر';
  result += ' ريال سعودي';
  
  if (decPart > 0) {
    result += ' و' + convert(decPart) + ' هللة';
  }
  
  return result;
}

interface InvoicePdfProps {
  data: InvoiceDataNew;
}

export function InvoicePdf({ data }: InvoicePdfProps) {
  const vatRate = data.vat_rate ?? 0.15;
  const currency = data.currency ?? 'SAR';
  const totals: InvoiceTotals = calculateInvoiceTotals(data.items, vatRate);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatCurrency = (amount: number) => {
    return `${formatAmount(amount)} ${currency}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ========== HEADER - Teal Gradient Style ========== */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{COMPANY.name_ar}</Text>
            <Text style={styles.companySubtitle}>{COMPANY.name_en}</Text>
          </View>
          <View style={styles.invoiceBadge}>
            <Text style={styles.badgeTitle}>فاتورة ضريبية</Text>
            <Text style={styles.badgeSubtitle}>TAX INVOICE</Text>
          </View>
        </View>

        {/* ========== INFO BAR ========== */}
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>رقم الفاتورة</Text>
            <Text style={styles.infoValue}>{data.invoice_number}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>تاريخ الإصدار</Text>
            <Text style={styles.infoValue}>{formatShortDate(data.issued_at)}</Text>
          </View>
          {data.due_date && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>تاريخ الاستحقاق</Text>
              <Text style={styles.infoValue}>{formatShortDate(data.due_date)}</Text>
            </View>
          )}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>الرقم الضريبي</Text>
            <Text style={styles.infoValue}>{COMPANY.vat}</Text>
          </View>
        </View>

        {/* ========== MAIN CONTENT CARD ========== */}
        <View style={styles.content}>
          {/* Amount Section - Featured */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>إجمالي المبلغ المستحق</Text>
            <Text style={styles.amountValue}>{formatAmount(totals.total)}</Text>
            <Text style={styles.amountCurrency}>ريال سعودي</Text>
            <Text style={styles.amountWords}>{numberToArabicWords(totals.total)}</Text>
          </View>

          {/* Parties Grid */}
          <View style={styles.partiesGrid}>
            {/* Seller */}
            <View style={styles.partyCard}>
              <View style={[styles.partyHeader, styles.partyHeaderSeller]}>
                <View style={styles.partyIcon}>
                  <Text style={styles.partyIconText}>ب</Text>
                </View>
                <Text style={styles.partyTitle}>البائع</Text>
              </View>
              <View style={styles.partyBody}>
                <Text style={styles.partyName}>{data.seller?.name_ar || COMPANY.name_ar}</Text>
                <View style={styles.partyDetail}>
                  <Text style={styles.detailLabel}>الرقم الضريبي</Text>
                  <Text style={styles.detailValue}>{data.seller?.vat || COMPANY.vat}</Text>
                </View>
                <View style={styles.partyDetail}>
                  <Text style={styles.detailLabel}>العنوان</Text>
                  <Text style={styles.detailValue}>{data.seller?.address_ar || COMPANY.address_ar}</Text>
                </View>
                <View style={[styles.partyDetail, styles.partyDetailLast]}>
                  <Text style={styles.detailLabel}>البريد</Text>
                  <Text style={styles.detailValue}>{data.seller?.email || COMPANY.email}</Text>
                </View>
              </View>
            </View>

            {/* Buyer */}
            <View style={styles.partyCard}>
              <View style={[styles.partyHeader, styles.partyHeaderBuyer]}>
                <View style={styles.partyIcon}>
                  <Text style={styles.partyIconText}>م</Text>
                </View>
                <Text style={styles.partyTitle}>المشتري</Text>
              </View>
              <View style={styles.partyBody}>
                <Text style={styles.partyName}>{data.buyer?.name_ar || data.buyer?.name || 'عميل'}</Text>
                {data.buyer?.vat && (
                  <View style={styles.partyDetail}>
                    <Text style={styles.detailLabel}>الرقم الضريبي</Text>
                    <Text style={styles.detailValue}>{data.buyer.vat}</Text>
                  </View>
                )}
                {data.buyer?.address_ar && (
                  <View style={styles.partyDetail}>
                    <Text style={styles.detailLabel}>العنوان</Text>
                    <Text style={styles.detailValue}>{data.buyer.address_ar}</Text>
                  </View>
                )}
                {data.buyer?.email && (
                  <View style={[styles.partyDetail, !data.buyer?.phone && styles.partyDetailLast]}>
                    <Text style={styles.detailLabel}>البريد</Text>
                    <Text style={styles.detailValue}>{data.buyer.email}</Text>
                  </View>
                )}
                {data.buyer?.phone && (
                  <View style={[styles.partyDetail, styles.partyDetailLast]}>
                    <Text style={styles.detailLabel}>الهاتف</Text>
                    <Text style={styles.detailValue}>{data.buyer.phone}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableSection}>
            <Text style={styles.tableTitle}>تفاصيل الفاتورة</Text>
            
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableHeader}>
                <View style={styles.colNum}>
                  <Text style={styles.headerCell}>#</Text>
                </View>
                <View style={styles.colDesc}>
                  <Text style={styles.headerCell}>الوصف</Text>
                </View>
                <View style={styles.colQty}>
                  <Text style={styles.headerCell}>الكمية</Text>
                </View>
                <View style={styles.colPrice}>
                  <Text style={styles.headerCell}>السعر</Text>
                </View>
                <View style={styles.colVat}>
                  <Text style={styles.headerCell}>الضريبة</Text>
                </View>
                <View style={styles.colTotal}>
                  <Text style={styles.headerCell}>الإجمالي</Text>
                </View>
              </View>

              {/* Rows */}
              {data.items.map((item, index) => {
                const lineTotal = calculateLineTotal(item);
                const lineVat = lineTotal * vatRate;
                const lineTotalWithVat = lineTotal + lineVat;
                const isLast = index === data.items.length - 1;
                
                return (
                  <View 
                    key={index} 
                    style={[
                      styles.tableRow, 
                      index % 2 === 1 && styles.tableRowAlt,
                      isLast && styles.tableRowLast
                    ]}
                  >
                    <View style={styles.colNum}>
                      <Text style={styles.cell}>{index + 1}</Text>
                    </View>
                    <View style={styles.colDesc}>
                      <Text style={[styles.cell, styles.cellBold]}>
                        {item.description_ar || item.description}
                      </Text>
                    </View>
                    <View style={styles.colQty}>
                      <Text style={styles.cell}>{item.qty}</Text>
                    </View>
                    <View style={styles.colPrice}>
                      <Text style={styles.cell}>{formatAmount(item.unit_price)}</Text>
                    </View>
                    <View style={styles.colVat}>
                      <Text style={styles.cell}>{formatAmount(lineVat)}</Text>
                    </View>
                    <View style={styles.colTotal}>
                      <Text style={[styles.cell, styles.cellBold]}>{formatAmount(lineTotalWithVat)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>المجموع الفرعي (قبل الضريبة)</Text>
                <Text style={styles.totalsValue}>{formatCurrency(totals.subtotal)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>ضريبة القيمة المضافة ({(vatRate * 100).toFixed(0)}%)</Text>
                <Text style={styles.totalsValue}>{formatCurrency(totals.vat_amount)}</Text>
              </View>
              <View style={styles.totalsFinal}>
                <Text style={styles.totalsFinalLabel}>الإجمالي شامل الضريبة</Text>
                <Text style={styles.totalsFinalValue}>{formatCurrency(totals.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {(data.notes_ar || data.notes) && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>📝 ملاحظات</Text>
              <Text style={styles.notesText}>{data.notes_ar || data.notes}</Text>
            </View>
          )}
        </View>

        {/* ========== FOOTER ========== */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerCompany}>{COMPANY.name_ar}</Text>
            <Text style={styles.footerSlogan}>شكراً لتعاملكم معنا</Text>
          </View>
          <View style={styles.footerCenter}>
            <Text style={styles.footerContact}>{COMPANY.phone} | {COMPANY.email}</Text>
            <Text style={styles.footerContact}>{COMPANY.website}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerPage}>صفحة 1 من 1</Text>
            <Text style={styles.versionStamp}>Template v3.0 - Voucher Design 2026</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePdf;
