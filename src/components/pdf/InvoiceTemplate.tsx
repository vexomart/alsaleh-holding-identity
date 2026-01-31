/**
 * Arabic Corporate Invoice Template (RTL)
 * 
 * This component renders a professional Arabic invoice that will be
 * converted to PDF using html2canvas. The entire layout is RTL with
 * proper Arabic typography.
 */

import React, { forwardRef, useEffect } from 'react';

export interface InvoiceTemplateData {
  // Invoice identification
  invoiceNumber: string;
  orderNumber?: string;
  issueDate: Date | string;
  dueDate?: Date | string;
  status: string;
  
  // Customer information
  customer: {
    name: string;
    nameAr?: string;
    email: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
  };
  
  // Line items
  items: Array<{
    description: string;
    descriptionAr?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  
  // Financial totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  total: number;
  currency: string;
  
  // Additional
  notes?: string;
}

// Company info (ASH Holding)
const companyInfo = {
  nameAr: 'شركة ASH القابضة',
  nameEn: 'ASH Holding Company',
  vatNumber: '300000000000003',
  crNumber: '1010000000',
  addressAr: 'الرياض، المملكة العربية السعودية',
  phone: '+966 11 123 4567',
  email: 'info@ash-holding.sa',
  website: 'ash-holding.sa',
};

// Status translations
const statusLabels: Record<string, string> = {
  pending: 'في الانتظار',
  paid: 'مدفوعة',
  overdue: 'متأخرة',
  cancelled: 'ملغاة',
  processing: 'قيد المعالجة',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتملة',
  refunded: 'مستردة',
  draft: 'مسودة',
  issued: 'صادرة',
};

// Format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + (currency === 'SAR' ? 'ر.س' : currency);
}

// Format date
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Font loading style - inlined for html2canvas compatibility
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
`;

export const InvoiceTemplate = forwardRef<HTMLDivElement, { data: InvoiceTemplateData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        dir="rtl"
        style={{
          width: '794px', // A4 width at 96 DPI
          minHeight: '1123px', // A4 height
          backgroundColor: '#ffffff',
          fontFamily: '"IBM Plex Sans Arabic", "Tajawal", "Cairo", "Noto Naskh Arabic", Arial, sans-serif',
          padding: '40px',
          boxSizing: 'border-box',
          color: '#1e293b',
          lineHeight: 1.6,
        }}
      >
        {/* Embedded font styles */}
        <style dangerouslySetInnerHTML={{ __html: fontStyle }} />
        {/* Header */}
        <div style={{ 
          borderBottom: '3px solid #0f172a',
          paddingBottom: '24px',
          marginBottom: '24px',
        }}>
          {/* Company Name */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              marginBottom: '4px',
            }}>
              {companyInfo.nameAr}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
            }}>
              {companyInfo.nameEn}
            </p>
          </div>

          {/* Invoice Title */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              marginBottom: '4px',
            }}>
              فاتورة ضريبية
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
            }}>
              Tax Invoice
            </p>
          </div>
        </div>

        {/* Company Info Block */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>السجل التجاري</span>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '4px 0 0 0' }}>{companyInfo.crNumber}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>الرقم الضريبي</span>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '4px 0 0 0' }}>{companyInfo.vatNumber}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>الهاتف</span>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '4px 0 0 0', direction: 'ltr' }}>{companyInfo.phone}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>البريد الإلكتروني</span>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '4px 0 0 0', direction: 'ltr' }}>{companyInfo.email}</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', margin: '12px 0 0 0' }}>
            {companyInfo.addressAr} | {companyInfo.website}
          </p>
        </div>

        {/* Invoice Meta + Customer Info */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          {/* Invoice Details */}
          <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
              تفاصيل الفاتورة
            </h3>
            <table style={{ width: '100%', fontSize: '13px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', width: '40%' }}>رقم الفاتورة:</td>
                  <td style={{ padding: '6px 0', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{data.invoiceNumber}</td>
                </tr>
                {data.orderNumber && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>رقم الطلب:</td>
                    <td style={{ padding: '6px 0', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{data.orderNumber}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b' }}>تاريخ الإصدار:</td>
                  <td style={{ padding: '6px 0', fontWeight: 600 }}>{formatDate(data.issueDate)}</td>
                </tr>
                {data.dueDate && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>تاريخ الاستحقاق:</td>
                    <td style={{ padding: '6px 0', fontWeight: 600 }}>{formatDate(data.dueDate)}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b' }}>حالة الفاتورة:</td>
                  <td style={{ padding: '6px 0' }}>
                    <span style={{
                      backgroundColor: data.status === 'paid' ? '#dcfce7' : data.status === 'overdue' ? '#fef2f2' : '#fef3c7',
                      color: data.status === 'paid' ? '#166534' : data.status === 'overdue' ? '#991b1b' : '#92400e',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {statusLabels[data.status] || data.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer Details */}
          <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
              بيانات العميل
            </h3>
            <table style={{ width: '100%', fontSize: '13px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b', width: '40%' }}>اسم العميل:</td>
                  <td style={{ padding: '6px 0', fontWeight: 600 }}>{data.customer.nameAr || data.customer.name}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b' }}>البريد الإلكتروني:</td>
                  <td style={{ padding: '6px 0', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{data.customer.email}</td>
                </tr>
                {data.customer.phone && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>الهاتف:</td>
                    <td style={{ padding: '6px 0', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{data.customer.phone}</td>
                  </tr>
                )}
                {data.customer.taxNumber && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>الرقم الضريبي:</td>
                    <td style={{ padding: '6px 0', fontWeight: 600, direction: 'ltr', textAlign: 'right' }}>{data.customer.taxNumber}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Services Table */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>
            تفاصيل الخدمات
          </h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }}>
                <th style={{ padding: '12px', textAlign: 'right', color: '#ffffff', fontWeight: 600 }}>الخدمة</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#ffffff', fontWeight: 600 }}>الوصف</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#ffffff', fontWeight: 600, width: '80px' }}>الكمية</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600, width: '120px' }}>السعر</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600, width: '120px' }}>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
                    {item.descriptionAr || item.description}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', direction: 'ltr' }}>
                    {formatCurrency(item.unitPrice, data.currency)}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: 600, direction: 'ltr' }}>
                    {formatCurrency(item.total, data.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' }}>
          <div style={{ width: '300px' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>المجموع الفرعي:</td>
                  <td style={{ padding: '10px 0', textAlign: 'left', direction: 'ltr' }}>
                    {formatCurrency(data.subtotal, data.currency)}
                  </td>
                </tr>
                {data.discount && data.discount > 0 && (
                  <tr>
                    <td style={{ padding: '10px 0', fontWeight: 600 }}>الخصم:</td>
                    <td style={{ padding: '10px 0', textAlign: 'left', direction: 'ltr', color: '#dc2626' }}>
                      - {formatCurrency(data.discount, data.currency)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>ضريبة القيمة المضافة ({data.taxRate}%):</td>
                  <td style={{ padding: '10px 0', textAlign: 'left', direction: 'ltr' }}>
                    {formatCurrency(data.taxAmount, data.currency)}
                  </td>
                </tr>
                <tr style={{ borderTop: '2px solid #0f172a' }}>
                  <td style={{ padding: '12px 0', fontWeight: 700, fontSize: '16px' }}>الإجمالي النهائي:</td>
                  <td style={{ padding: '12px 0', textAlign: 'left', direction: 'ltr', fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                    {formatCurrency(data.total, data.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div style={{
            backgroundColor: '#fefce8',
            border: '1px solid #fde047',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e', margin: '0 0 8px 0' }}>ملاحظات:</h4>
            <p style={{ fontSize: '13px', color: '#854d0e', margin: 0 }}>{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '20px',
          marginTop: '40px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>
            هذه فاتورة ضريبية صادرة إلكترونياً وفقاً لمتطلبات هيئة الزكاة والضريبة والجمارك
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 12px 0' }}>
            This is an electronic tax invoice issued in accordance with ZATCA requirements
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            شكراً لتعاملكم معنا
          </p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
