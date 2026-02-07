/**
 * Invoice View Component
 * Premium corporate invoice UI - Global Enterprise Style
 * Shared between Admin & Customer
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
        'max-w-4xl mx-auto invoice-container',
        isMobile && 'pb-32',
        className
      )}
    >
      {/* Premium Header */}
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
          contractUrl={invoice.contractId ? `/portal/contracts/${invoice.contractId}` : undefined}
          paymentUrl={invoice.paymentUrl}
          status={invoice.status}
          onDownload={onDownload}
          onPayNow={onPayNow}
        />
      </div>

      {/* Premium Footer */}
      <div className="mt-12 pt-8 border-t-2 border-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-600" />
          <div className="w-8 h-8 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-600" />
        </div>
        <p className="text-sm text-muted-foreground font-medium invoice-note">
          {isRTL 
            ? 'شكراً لتعاملكم معنا'
            : 'Thank you for your business'
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-semibold">
          {isRTL ? 'شركة علي صالح الشهري القابضة' : 'Ali Saleh Al-Shahri Holding Co.'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <span dir="ltr" className="ltr-token font-mono text-[11px]">info@ash-holding.sa</span>
          <span className="mx-2">•</span>
          <span dir="ltr" className="ltr-token font-mono text-[11px]">ash-holding.sa</span>
        </p>

        {/* Strict verification marker: helps detect stale UI deployments */}
        <p className="text-[10px] text-muted-foreground/80 mt-3">
          <span dir="ltr" className="ltr-token font-mono">UI Template v2.0 - 2026</span>
        </p>
      </div>
    </div>
  );
}
