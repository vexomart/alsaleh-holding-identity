/**
 * Customer Orders Center - World-Class Enterprise Orders Page
 * RTL-first, responsive (table/cards), realtime updates
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Local components
import { useCustomerOrders } from './useCustomerOrders';
import { OrdersKPIStrip } from './OrdersKPIStrip';
import { OrdersFilters } from './OrdersFilters';
import { OrdersTable } from './OrdersTable';
import { OrdersCardList } from './OrdersCardList';
import { OrdersPagination } from './OrdersPagination';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';
import { OrdersEmptyState, OrdersErrorState } from './OrdersEmptyState';
import { CustomerOrder, SortField, OrderStatus } from './types';

export function CustomerOrdersCenter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Data fetching
  const {
    orders,
    allOrders, // For KPI calculations
    isLoading,
    error,
    filters,
    sort,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    updateSort,
    setPage,
    setPageSize,
    refetch,
    isConnected, // Realtime connection status
  } = useCustomerOrders();

  // Local state
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRowClick = useCallback((order: CustomerOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleSort = useCallback((field: SortField) => {
    updateSort(field);
  }, [updateSort]);

  const handleKPIFilter = useCallback((status: OrderStatus | 'all') => {
    updateFilters({ status });
  }, [updateFilters]);

  // Page animation config
  const pageAnimation = reducedMotion 
    ? {} 
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
      };

  // Stagger container for children
  const containerAnimation = reducedMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: {
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        },
      };

  const itemAnimation = reducedMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        },
      };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Sticky Header */}
      <motion.div {...pageAnimation}>
        <div className="sticky top-0 z-20 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-b mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {isRTL ? 'طلباتي' : 'My Orders'}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{isRTL ? 'تتبع طلباتك في مكان واحد' : 'Track your orders in one place'}</span>
                  {/* Realtime indicator */}
                  <span className={cn(
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                    isConnected 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                    )} />
                    {isConnected ? (isRTL ? 'مباشر' : 'Live') : (isRTL ? 'غير متصل' : 'Offline')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2">
              {/* View Toggle (Desktop only) */}
              {!isMobile && (
                <div className="flex items-center border rounded-lg p-1 bg-muted/30">
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

              {/* New Order CTA */}
              <Button 
                onClick={() => navigate('/app/services')}
                className="gap-2 shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isRTL ? 'طلب جديد' : 'New Order'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Strip */}
      <motion.div {...itemAnimation}>
        <OrdersKPIStrip
          orders={allOrders}
          isLoading={isLoading && allOrders.length === 0}
          onFilterByStatus={handleKPIFilter}
          activeFilter={filters.status}
        />
      </motion.div>

      {/* Filters */}
      <motion.div {...itemAnimation}>
        <OrdersFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          totalCount={totalCount}
        />
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div {...itemAnimation}>
          <OrdersErrorState error={error} onRetry={refetch} />
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <motion.div {...itemAnimation}>
          <OrdersEmptyState 
            hasFilters={hasActiveFilters} 
            onClearFilters={clearFilters} 
          />
        </motion.div>
      )}

      {/* Content */}
      {!error && (orders.length > 0 || isLoading) && (
        <motion.div {...containerAnimation} className="space-y-4">
          {/* Table View (Desktop) or Cards View (Mobile/Toggle) */}
          {(viewMode === 'table' && !isMobile) ? (
            <OrdersTable
              orders={orders}
              isLoading={isLoading}
              sort={sort}
              onSort={handleSort}
              onRowClick={handleRowClick}
              selectedOrderId={selectedOrder?.id}
            />
          ) : (
            <OrdersCardList
              orders={orders}
              isLoading={isLoading}
              onCardClick={handleRowClick}
              selectedOrderId={selectedOrder?.id}
            />
          )}

          {/* Pagination */}
          {orders.length > 0 && (
            <OrdersPagination
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </motion.div>
      )}

      {/* Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          // Keep selectedOrder for animation out, clear after
          setTimeout(() => setSelectedOrder(null), 300);
        }}
      />
    </div>
  );
}
