/**
 * INVOICE PDF TEMPLATE
 * React-PDF component for generating Arabic RTL invoices
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

// Register Cairo fonts from public folder
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' },
  ],
});

// RTL Arabic styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Cairo',
    fontSize: 10,
    padding: 40,
    direction: 'rtl',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0f766e',
    paddingBottom: 20,
  },
  headerLeft: {
    alignItems: 'flex-start',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 5,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  invoiceDate: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 10,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  partyRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  partyBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  partyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 8,
    textAlign: 'right',
  },
  partyText: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 4,
    textAlign: 'right',
  },
  partyLabel: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0f766e',
    padding: 10,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  colDescription: {
    width: '40%',
    textAlign: 'right',
  },
  colQty: {
    width: '12%',
    textAlign: 'center',
  },
  colPrice: {
    width: '16%',
    textAlign: 'center',
  },
  colVat: {
    width: '16%',
    textAlign: 'center',
  },
  colTotal: {
    width: '16%',
    textAlign: 'left',
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  cellText: {
    color: '#334155',
    fontSize: 10,
  },
  totalsSection: {
    marginTop: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  totalsBox: {
    width: '40%',
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalsLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
  },
  totalsValue: {
    fontSize: 10,
    color: '#334155',
    textAlign: 'left',
  },
  totalsFinal: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#0f766e',
    paddingTop: 10,
    marginTop: 5,
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  footerPage: {
    fontSize: 9,
    color: '#64748b',
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fffbeb',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 5,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 10,
    color: '#92400e',
    textAlign: 'right',
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
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <Text style={styles.title}>فاتورة ضريبية</Text>
            <Text style={styles.subtitle}>Tax Invoice</Text>
          </View>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceNumber}>رقم الفاتورة: {data.invoice_number}</Text>
            <Text style={styles.invoiceDate}>التاريخ: {formatShortDate(data.issued_at)}</Text>
            {data.due_date && (
              <Text style={styles.invoiceDate}>تاريخ الاستحقاق: {formatShortDate(data.due_date)}</Text>
            )}
          </View>
        </View>

        {/* Seller & Buyer Info */}
        <View style={styles.partyRow}>
          {/* Seller (Right) */}
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>البائع / Seller</Text>
            <Text style={styles.partyText}>{data.seller.name_ar || data.seller.name}</Text>
            {data.seller.vat && (
              <Text style={styles.partyLabel}>الرقم الضريبي: {data.seller.vat}</Text>
            )}
            {data.seller.address_ar && (
              <Text style={styles.partyLabel}>{data.seller.address_ar}</Text>
            )}
            {data.seller.phone && (
              <Text style={styles.partyLabel}>هاتف: {data.seller.phone}</Text>
            )}
            {data.seller.email && (
              <Text style={styles.partyLabel}>البريد: {data.seller.email}</Text>
            )}
          </View>

          {/* Buyer (Left) */}
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>المشتري / Buyer</Text>
            <Text style={styles.partyText}>{data.buyer.name_ar || data.buyer.name}</Text>
            {data.buyer.vat && (
              <Text style={styles.partyLabel}>الرقم الضريبي: {data.buyer.vat}</Text>
            )}
            {data.buyer.address_ar && (
              <Text style={styles.partyLabel}>{data.buyer.address_ar}</Text>
            )}
            {data.buyer.phone && (
              <Text style={styles.partyLabel}>هاتف: {data.buyer.phone}</Text>
            )}
            {data.buyer.email && (
              <Text style={styles.partyLabel}>البريد: {data.buyer.email}</Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل الفاتورة</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={styles.colDescription}>
                <Text style={styles.headerText}>الوصف</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.headerText}>الكمية</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.headerText}>السعر</Text>
              </View>
              <View style={styles.colVat}>
                <Text style={styles.headerText}>الضريبة</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.headerText}>الإجمالي</Text>
              </View>
            </View>

            {/* Table Rows */}
            {data.items.map((item, index) => {
              const lineTotal = calculateLineTotal(item);
              const lineVat = lineTotal * vatRate;
              const lineTotalWithVat = lineTotal + lineVat;
              
              return (
                <View 
                  key={index} 
                  style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                >
                  <View style={styles.colDescription}>
                    <Text style={styles.cellText}>{item.description_ar || item.description}</Text>
                  </View>
                  <View style={styles.colQty}>
                    <Text style={styles.cellText}>{item.qty}</Text>
                  </View>
                  <View style={styles.colPrice}>
                    <Text style={styles.cellText}>{formatAmount(item.unit_price)}</Text>
                  </View>
                  <View style={styles.colVat}>
                    <Text style={styles.cellText}>{formatAmount(lineVat)}</Text>
                  </View>
                  <View style={styles.colTotal}>
                    <Text style={styles.cellText}>{formatAmount(lineTotalWithVat)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>المجموع الفرعي</Text>
              <Text style={styles.totalsValue}>{formatAmount(totals.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>ضريبة القيمة المضافة ({(vatRate * 100).toFixed(0)}%)</Text>
              <Text style={styles.totalsValue}>{formatAmount(totals.vat_amount)}</Text>
            </View>
            <View style={styles.totalsFinal}>
              <Text style={styles.totalsFinalLabel}>الإجمالي شامل الضريبة</Text>
              <Text style={styles.totalsFinalValue}>{formatAmount(totals.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {(data.notes_ar || data.notes) && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>ملاحظات</Text>
            <Text style={styles.notesText}>{data.notes_ar || data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>الصالح القابضة - ASH Holding</Text>
          <Text style={styles.footerPage}>صفحة 1 من 1</Text>
        </View>
      </Page>
    </Document>
  );
}

export default InvoicePdf;
