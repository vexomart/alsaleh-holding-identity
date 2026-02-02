/**
 * Invoice View Component
 * Classic corporate invoice UI - Shared between Admin & Customer
 */

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { InvoiceHeader } from './InvoiceHeader';
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
        isMobile && 'pb-32',
        className
      )}
    >
      {/* Classic Header */}
      <InvoiceHeader 
        invoiceNumber={invoice.invoiceNumber}
        status={invoice.status}
        issuedAt={invoice.issuedAt}
        dueDate={invoice.dueDate}
      />

      {/* Content */}
      <div className="space-y-8 mt-8">
        {/* Parties: From / Bill To */}
        <InvoiceParties 
          seller={invoice.seller}
          buyer={invoice.buyer}
        />
        
        {/* Items Table */}
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

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-muted-foreground">
          {isRTL 
            ? 'شكراً لتعاملكم معنا • شركة علي صالح الشهري القابضة'
            : 'Thank you for your business • Ali Saleh Al-Shahri Holding Co.'
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <span dir="ltr" className="ltr-token">info@ash-holding.sa</span>
        </p>
      </div>
    </div>
  );
}
