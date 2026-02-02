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

// Register Cairo fonts
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Company Info
const COMPANY = {
  name_ar: 'شركة علي صالح الشهري القابضة',
  name_en: 'Ali Saleh Al-Shahri Holding Co.',
  vat: '310123456789012',
  cr: '1010123456',
  address_ar: 'الرياض، المملكة العربية السعودية',
  address_en: 'Riyadh, Kingdom of Saudi Arabia',
  phone: '+966 11 123 4567',
  email: 'info@ash-holding.sa',
  website: 'www.ash-holding.sa',
};

// Premium Corporate Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 9,
    padding: 0,
    backgroundColor: '#ffffff',
  },
  // Header Band
  headerBand: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 25,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 10,
    color: '#b8b8d1',
    textAlign: 'right',
  },
  invoiceBlock: {
    alignItems: 'flex-start',
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 4,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  invoiceTitleEn: {
    fontSize: 8,
    color: '#1a1a2e',
    opacity: 0.8,
  },
  // Invoice Meta Strip
  metaStrip: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 7,
    color: '#6c757d',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  // Main Content
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
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  partyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  partyIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    color: '#d4af37',
    fontSize: 10,
    fontWeight: 'bold',
  },
  partyTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'right',
  },
  partyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 6,
    textAlign: 'right',
  },
  partyDetail: {
    fontSize: 8,
    color: '#495057',
    marginBottom: 3,
    textAlign: 'right',
  },
  partyDetailLabel: {
    color: '#6c757d',
  },
  // Items Table
  tableSection: {
    marginBottom: 20,
  },
  tableSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
    textAlign: 'right',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  table: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1a1a2e',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  // Column widths
  colNum: { width: '6%', textAlign: 'center' },
  colDesc: { width: '38%', textAlign: 'right' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'center' },
  colVat: { width: '15%', textAlign: 'center' },
  colTotal: { width: '16%', textAlign: 'left' },
  headerCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  cell: {
    color: '#212529',
    fontSize: 8,
  },
  cellBold: {
    fontWeight: 'bold',
  },
  // Totals Section
  totalsSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  totalsCard: {
    width: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  totalsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  totalsLabel: {
    fontSize: 9,
    color: '#495057',
    textAlign: 'right',
  },
  totalsValue: {
    fontSize: 9,
    color: '#212529',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  totalsFinal: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#1a1a2e',
  },
  totalsFinalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#d4af37',
    textAlign: 'left',
  },
  // Notes
  notesSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff8e1',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffecb3',
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 5,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 8,
    color: '#e65100',
    textAlign: 'right',
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a2e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 15,
  },
  footerItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 7,
    color: '#b8b8d1',
    marginLeft: 4,
  },
  footerValue: {
    fontSize: 7,
    color: '#ffffff',
  },
  footerRight: {
    alignItems: 'flex-start',
  },
  footerPage: {
    fontSize: 7,
    color: '#b8b8d1',
  },
  footerCompany: {
    fontSize: 8,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  // QR Placeholder
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 6,
    color: '#6c757d',
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
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePdf;
