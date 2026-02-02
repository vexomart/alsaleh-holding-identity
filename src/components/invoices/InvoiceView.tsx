/**
 * Invoice View Component
 * Enterprise-grade invoice UI - Shared between Admin & Customer
 * RTL-first, responsive, premium animations
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceMetricsRow } from './InvoiceMetricsRow';
import { InvoiceParties } from './InvoiceParties';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTotalsCard } from './InvoiceTotalsCard';
import { InvoiceActions } from './InvoiceActions';
import { InvoiceSkeleton } from './InvoiceSkeleton';
import { InvoiceViewModel } from './types';

interface InvoiceViewProps {
  invoice: InvoiceViewModel | null;
  isLoading?: boolean;
  onDownload: () => Promise<void>;
  onPayNow?: () => void;
  className?: string;
}

export function InvoiceView({
  invoice,
  isLoading,
  onDownload,
  onPayNow,
  className,
}: InvoiceViewProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();

  if (isLoading || !invoice) {
    return <InvoiceSkeleton className={className} />;
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={isRTL ? 'ar' : 'en'}
      className={cn(
        'space-y-6',
        isMobile && 'pb-28', // Space for fixed action bar
        className
      )}
    >
      {/* Header with Status & Number */}
      <InvoiceHeader 
        invoiceNumber={invoice.invoiceNumber}
        status={invoice.status}
      />

      {/* Key Metrics Row */}
      <InvoiceMetricsRow
        total={invoice.total}
        vatAmount={invoice.vatAmount}
        vatRate={invoice.vatRate}
        issuedAt={invoice.issuedAt}
        orderNumber={invoice.orderNumber}
        currency={invoice.currency}
      />

      {/* Desktop: Two Column Layout */}
      {!isMobile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Items + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parties */}
            <InvoiceParties 
              seller={invoice.seller}
              buyer={invoice.buyer}
            />
            
            {/* Items Table */}
            <InvoiceItemsTable 
              items={invoice.items}
              currency={invoice.currency}
            />
          </div>

          {/* Right Column: Totals + Actions */}
          <div className="space-y-4">
            {/* Totals Card */}
            <InvoiceTotalsCard
              subtotal={invoice.subtotal}
              vatRate={invoice.vatRate}
              vatAmount={invoice.vatAmount}
              total={invoice.total}
              currency={invoice.currency}
            />
            
            {/* Actions (Desktop) */}
            <InvoiceActions
              invoiceNumber={invoice.invoiceNumber}
              orderNumber={invoice.orderNumber}
              contractUrl={invoice.contractId ? `/app/contracts/${invoice.contractId}` : undefined}
              paymentUrl={invoice.paymentUrl}
              status={invoice.status}
              onDownload={onDownload}
              onPayNow={onPayNow}
            />
          </div>
        </div>
      ) : (
        /* Mobile: Stacked Layout */
        <div className="space-y-6">
          {/* Parties */}
          <InvoiceParties 
            seller={invoice.seller}
            buyer={invoice.buyer}
          />
          
          {/* Items */}
          <InvoiceItemsTable 
            items={invoice.items}
            currency={invoice.currency}
          />
          
          {/* Totals */}
          <InvoiceTotalsCard
            subtotal={invoice.subtotal}
            vatRate={invoice.vatRate}
            vatAmount={invoice.vatAmount}
            total={invoice.total}
            currency={invoice.currency}
          />

          {/* Mobile Fixed Actions */}
          <InvoiceActions
            invoiceNumber={invoice.invoiceNumber}
            orderNumber={invoice.orderNumber}
            contractUrl={invoice.contractId ? `/app/contracts/${invoice.contractId}` : undefined}
            paymentUrl={invoice.paymentUrl}
            status={invoice.status}
            onDownload={onDownload}
            onPayNow={onPayNow}
          />
        </div>
      )}
    </div>
  );
}
