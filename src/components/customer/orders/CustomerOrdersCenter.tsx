/**
 * Customer Orders Center - Enterprise-grade orders page
 * RTL-first, responsive (table/cards), realtime updates
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, Plus, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Local components
import { useCustomerOrders } from './useCustomerOrders';
import { OrdersFilters } from './OrdersFilters';
import { OrdersTable } from './OrdersTable';
import { OrdersCardList } from './OrdersCardList';
import { OrdersPagination } from './OrdersPagination';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';
import { OrdersEmptyState, OrdersErrorState } from './OrdersEmptyState';
import { CustomerOrder, SortField } from './types';

export function CustomerOrdersCenter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Data fetching
  const {
    orders,
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
  } = useCustomerOrders();

  // Local state
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRowClick = (order: CustomerOrder) => {
    setSelectedOrder(order);
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
            <h1 className="text-2xl font-bold tracking-tight">
              {isRTL ? 'مركز الطلبات' : 'Orders Center'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL 
                ? 'تتبع وإدارة جميع طلباتك في مكان واحد'
                : 'Track and manage all your orders in one place'}
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

            {/* New Order CTA */}
            <Button 
              onClick={() => navigate('/app/services')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isRTL ? 'طلب جديد' : 'New Order'}
              </span>
            </Button>
          </div>
        </div>
      </AnimationWrapper>

      {/* Filters */}
      <OrdersFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={totalCount}
      />

      {/* Error State */}
      {error && (
        <OrdersErrorState error={error} onRetry={refetch} />
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <OrdersEmptyState 
          hasFilters={hasActiveFilters} 
          onClearFilters={clearFilters} 
        />
      )}

      {/* Content */}
      {!error && orders.length > 0 && (
        <>
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
          <OrdersPagination
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
      {isLoading && orders.length === 0 && (
        <>
          {(viewMode === 'table' && !isMobile) ? (
            <OrdersTable
              orders={[]}
              isLoading={true}
              sort={sort}
              onSort={handleSort}
              onRowClick={() => {}}
            />
          ) : (
            <OrdersCardList
              orders={[]}
              isLoading={true}
              onCardClick={() => {}}
            />
          )}
        </>
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
