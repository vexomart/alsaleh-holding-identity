/**
 * Customer Invoices Center - Enterprise-grade invoices page
 * RTL-first, responsive (table/cards), realtime updates
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, ShoppingBag, LayoutGrid, Table as TableIcon, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

// Local components
import { useCustomerInvoices } from './useCustomerInvoices';
import { InvoicesFilters } from './InvoicesFilters';
import { InvoicesTable } from './InvoicesTable';
import { InvoicesCardList } from './InvoicesCardList';
import { InvoicesPagination } from './InvoicesPagination';
import { InvoiceDetailsDrawer } from './InvoiceDetailsDrawer';
import { InvoicesEmptyState, InvoicesErrorState } from './InvoicesEmptyState';
import { CustomerInvoice, SortField } from './types';

// PDF imports
import { type InvoiceData } from '@/lib/pdf';
import { runPdfDebug } from '@/lib/pdf/debug/run-pdf-debug';

export function CustomerInvoicesCenter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Data fetching
  const {
    invoices,
    isLoading,
    error,
    filters,
    sort,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasActiveFilters,
    isConnected,
    updateFilters,
    clearFilters,
    updateSort,
    setPage,
    setPageSize,
    refetch,
  } = useCustomerInvoices();

  // Local state
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRowClick = (invoice: CustomerInvoice) => {
    setSelectedInvoice(invoice);
    setDrawerOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleSort = (field: SortField) => {
    updateSort(field);
  };

  const handleDownload = async (invoice: CustomerInvoice) => {
    console.log('[PDF] clicked', { kind: 'invoice', id: invoice.id });

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.invoice_number,
        issueDate: new Date(invoice.created_at),
        dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
        status: invoice.status === 'paid' ? 'paid' 
          : invoice.status === 'overdue' ? 'overdue'
          : invoice.status === 'cancelled' ? 'cancelled'
          : 'pending',
        customer: {
          name: isRTL ? 'عميل' : 'Customer',
          email: '',
        },
        items: [{
          description: invoice.order 
            ? (isRTL ? (invoice.order.title_ar || invoice.order.title) : invoice.order.title)
            : (isRTL ? 'خدمة' : 'Service'),
          quantity: 1,
          unitPrice: invoice.subtotal,
          total: invoice.subtotal,
        }],
        subtotal: invoice.subtotal,
        taxRate: invoice.vat_rate,
        taxAmount: invoice.vat_amount,
        total: invoice.total,
        currency: invoice.currency,
        notes: invoice.notes || undefined,
      };

      const report = await runPdfDebug('invoice', invoiceData);
      if (report.ok) {
        toast.success(isRTL ? 'تم تحميل الفاتورة' : 'Invoice downloaded');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error(isRTL ? 'فشل تحميل الفاتورة' : 'Failed to download invoice');
    }
  };

  // Animation wrapper
  const AnimationWrapper = reducedMotion ? 'div' : motion.div;
  const pageAnimation = reducedMotion ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Page Header */}
      <AnimationWrapper {...pageAnimation}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {isRTL ? 'مركز الفواتير' : 'Invoices Center'}
              </h1>
              {/* Realtime Indicator */}
              <Badge 
                variant={isConnected ? "default" : "secondary"} 
                className={cn(
                  "gap-1.5 text-xs",
                  isConnected 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>{isRTL ? 'مباشر' : 'Live'}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>{isRTL ? 'غير متصل' : 'Offline'}</span>
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL 
                ? 'عرض وتحميل جميع فواتيرك في مكان واحد'
                : 'View and download all your invoices in one place'}
            </p>
          </div>

          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            {/* View Toggle (Desktop only) */}
            {!isMobile && (
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Refresh */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">
                {isRTL ? 'تحديث' : 'Refresh'}
              </span>
            </Button>

            {/* Browse Services CTA */}
            <Button 
              onClick={() => navigate('/app/services')}
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isRTL ? 'طلب خدمة' : 'Order Service'}
              </span>
            </Button>
          </div>
        </div>
      </AnimationWrapper>

      {/* Filters */}
      <InvoicesFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={totalCount}
      />

      {/* Error State */}
      {error && (
        <InvoicesErrorState error={error} onRetry={refetch} />
      )}

      {/* Empty State */}
      {!isLoading && !error && invoices.length === 0 && (
        <InvoicesEmptyState 
          hasFilters={hasActiveFilters} 
          onClearFilters={clearFilters} 
        />
      )}

      {/* Content */}
      {!error && invoices.length > 0 && (
        <>
          {/* Table View (Desktop) or Cards View (Mobile/Toggle) */}
          {(viewMode === 'table' && !isMobile) ? (
            <InvoicesTable
              invoices={invoices}
              isLoading={isLoading}
              sort={sort}
              onSort={handleSort}
              onRowClick={handleRowClick}
              onDownload={handleDownload}
              selectedInvoiceId={selectedInvoice?.id}
            />
          ) : (
            <InvoicesCardList
              invoices={invoices}
              isLoading={isLoading}
              onCardClick={handleRowClick}
              onDownload={handleDownload}
              selectedInvoiceId={selectedInvoice?.id}
            />
          )}

          {/* Pagination */}
          <InvoicesPagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Loading skeleton fallback */}
      {isLoading && invoices.length === 0 && (
        <>
          {(viewMode === 'table' && !isMobile) ? (
            <InvoicesTable
              invoices={[]}
              isLoading={true}
              sort={sort}
              onSort={handleSort}
              onRowClick={() => {}}
            />
          ) : (
            <InvoicesCardList
              invoices={[]}
              isLoading={true}
              onCardClick={() => {}}
            />
          )}
        </>
      )}

      {/* Details Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setSelectedInvoice(null), 300);
        }}
      />
    </div>
  );
}
