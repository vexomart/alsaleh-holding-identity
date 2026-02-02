/**
 * Invoice View Component
 * Modern enterprise invoice UI - Shared between Admin & Customer
 * Clean, minimal, RTL-first
 */

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
        'max-w-4xl mx-auto',
        isMobile && 'pb-36', // Space for fixed action bar
        className
      )}
    >
      {/* Header */}
      <InvoiceHeader 
        invoiceNumber={invoice.invoiceNumber}
        status={invoice.status}
        issuedAt={invoice.issuedAt}
      />

      {/* Content */}
      <div className="space-y-6 mt-6">
        {/* Key Metrics */}
        <InvoiceMetricsRow
          total={invoice.total}
          vatAmount={invoice.vatAmount}
          vatRate={invoice.vatRate}
          issuedAt={invoice.issuedAt}
          orderNumber={invoice.orderNumber}
          currency={invoice.currency}
        />

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

        {/* Actions */}
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
  );
}
