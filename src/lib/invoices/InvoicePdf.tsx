/**
 * INVOICE PDF TEMPLATE - Premium Corporate Design
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

// Premium Corporate Styles - Enhanced Design
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 9,
    padding: 0,
    backgroundColor: '#ffffff',
  },
  // Header Band - Premium Gradient Effect
  headerBand: {
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  companyNameEn: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'right',
    letterSpacing: 1,
  },
  invoiceBlock: {
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: 1,
  },
  invoiceTitleEn: {
    fontSize: 9,
    color: '#1e293b',
    letterSpacing: 2,
  },
  // Invoice Meta Strip - Enhanced
  metaStrip: {
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  // Main Content
  content: {
    padding: 40,
    paddingTop: 30,
  },
  // Parties Section - Enhanced Cards
  partiesRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 24,
  },
  partyCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  partyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
  },
  partyIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  partyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  partyName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'right',
  },
  partyDetail: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 4,
    textAlign: 'right',
  },
  partyDetailLabel: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  // Items Table - Premium Design
  tableSection: {
    marginBottom: 24,
  },
  tableSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 14,
    textAlign: 'right',
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#f59e0b',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  // Column widths - Optimized
  colNum: { width: '6%', textAlign: 'center' },
  colDesc: { width: '38%', textAlign: 'right' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'center' },
  colVat: { width: '15%', textAlign: 'center' },
  colTotal: { width: '16%', textAlign: 'left' },
  headerCell: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  cell: {
    color: '#1e293b',
    fontSize: 9,
  },
  cellBold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  // Totals Section - Banking Style
  totalsSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  totalsCard: {
    width: '50%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 18,
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
    color: '#1e293b',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  totalsFinal: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#0f172a',
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'left',
  },
  // Notes - Enhanced
  notesSection: {
    marginTop: 24,
    padding: 18,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 6,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 9,
    color: '#92400e',
    textAlign: 'right',
    lineHeight: 1.6,
  },
  // Footer - Premium Corporate
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 20,
  },
  footerItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 8,
    color: '#94a3b8',
    marginLeft: 5,
  },
  footerValue: {
    fontSize: 8,
    color: '#ffffff',
  },
  footerRight: {
    alignItems: 'flex-start',
  },
  footerPage: {
    fontSize: 8,
    color: '#94a3b8',
  },
  footerCompany: {
    fontSize: 9,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  versionStamp: {
    fontSize: 6,
    color: '#64748b',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  // QR Placeholder
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 6,
    color: '#64748b',
    textAlign: 'center',
  },
});

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
        {/* Header Band */}
        <View style={styles.headerBand}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{COMPANY.name_ar}</Text>
            <Text style={styles.companyNameEn}>{COMPANY.name_en}</Text>
          </View>
          <View style={styles.invoiceBlock}>
            <Text style={styles.invoiceTitle}>فاتورة ضريبية</Text>
            <Text style={styles.invoiceTitleEn}>TAX INVOICE</Text>
          </View>
        </View>

        {/* Meta Strip */}
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>رقم الفاتورة</Text>
            <Text style={styles.metaValue}>{data.invoice_number}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>تاريخ الإصدار</Text>
            <Text style={styles.metaValue}>{formatShortDate(data.issued_at)}</Text>
          </View>
          {data.due_date && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>تاريخ الاستحقاق</Text>
              <Text style={styles.metaValue}>{formatShortDate(data.due_date)}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>الرقم الضريبي</Text>
            <Text style={styles.metaValue}>{COMPANY.vat}</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Parties */}
          <View style={styles.partiesRow}>
            {/* Seller */}
            <View style={styles.partyCard}>
              <View style={styles.partyHeader}>
                <View style={styles.partyIcon}>
                  <Text style={styles.partyIconText}>ب</Text>
                </View>
                <Text style={styles.partyTitle}>البائع / Seller</Text>
              </View>
              <Text style={styles.partyName}>{data.seller?.name_ar || COMPANY.name_ar}</Text>
              <Text style={styles.partyDetail}>
                <Text style={styles.partyDetailLabel}>الرقم الضريبي: </Text>
                {data.seller?.vat || COMPANY.vat}
              </Text>
              {(data.seller?.address_ar || COMPANY.address_ar) && (
                <Text style={styles.partyDetail}>
                  <Text style={styles.partyDetailLabel}>العنوان: </Text>
                  {data.seller?.address_ar || COMPANY.address_ar}
                </Text>
              )}
              <Text style={styles.partyDetail}>
                <Text style={styles.partyDetailLabel}>البريد: </Text>
                {data.seller?.email || COMPANY.email}
              </Text>
            </View>

            {/* Buyer */}
            <View style={styles.partyCard}>
              <View style={styles.partyHeader}>
                <View style={styles.partyIcon}>
                  <Text style={styles.partyIconText}>م</Text>
                </View>
                <Text style={styles.partyTitle}>المشتري / Buyer</Text>
              </View>
              <Text style={styles.partyName}>{data.buyer?.name_ar || data.buyer?.name || 'عميل'}</Text>
              {data.buyer?.vat && (
                <Text style={styles.partyDetail}>
                  <Text style={styles.partyDetailLabel}>الرقم الضريبي: </Text>
                  {data.buyer.vat}
                </Text>
              )}
              {data.buyer?.address_ar && (
                <Text style={styles.partyDetail}>
                  <Text style={styles.partyDetailLabel}>العنوان: </Text>
                  {data.buyer.address_ar}
                </Text>
              )}
              {data.buyer?.email && (
                <Text style={styles.partyDetail}>
                  <Text style={styles.partyDetailLabel}>البريد: </Text>
                  {data.buyer.email}
                </Text>
              )}
              {data.buyer?.phone && (
                <Text style={styles.partyDetail}>
                  <Text style={styles.partyDetailLabel}>الهاتف: </Text>
                  {data.buyer.phone}
                </Text>
              )}
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableSection}>
            <Text style={styles.tableSectionTitle}>تفاصيل الفاتورة</Text>
            
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
          <View style={styles.totalsSection}>
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
              <Text style={styles.notesTitle}>ملاحظات</Text>
              <Text style={styles.notesText}>{data.notes_ar || data.notes}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>هاتف:</Text>
              <Text style={styles.footerValue}>{COMPANY.phone}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>بريد:</Text>
              <Text style={styles.footerValue}>{COMPANY.email}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>موقع:</Text>
              <Text style={styles.footerValue}>{COMPANY.website}</Text>
            </View>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerCompany}>{COMPANY.name_ar}</Text>
            <Text style={styles.footerPage}>صفحة 1 من 1</Text>
            <Text style={styles.versionStamp}>Template v2.0 - 2026</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePdf;
