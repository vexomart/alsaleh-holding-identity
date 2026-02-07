/**
 * Customer Orders Center - World-Class Enterprise Orders Page
 * RTL-first, responsive, animated, NO POPUPS
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp,
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
    allOrders,
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
    isConnected,
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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSort = useCallback((field: SortField) => {
    updateSort(field);
  }, [updateSort]);

  const handleKPIFilter = useCallback((status: OrderStatus | 'all') => {
    updateFilters({ status });
  }, [updateFilters]);

  // Animation configs
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 } as const,
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.25, ease: [0.25, 0.1, 0.25, 1] },
    },
  } as const;

  const headerVariants = {
    hidden: { opacity: 0, y: -20 } as const,
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className="space-y-6 pb-20"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Header */}
      <motion.div variants={headerVariants}>
        <div className="sticky top-0 z-20 -mx-4 px-4 py-5 bg-gradient-to-b from-background via-background to-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/30"
                whileHover={reducedMotion ? {} : { scale: 1.05, rotate: 5 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {isRTL ? 'طلباتي' : 'My Orders'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'تتبع طلباتك في مكان واحد' : 'Track your orders in one place'}
                  </span>
                  {/* Live indicator */}
                  <motion.span 
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium',
                      isConnected 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <motion.span 
                      className={cn(
                        'h-2 w-2 rounded-full',
                        isConnected ? 'bg-emerald-500' : 'bg-muted-foreground'
                      )}
                      animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    {isConnected ? (isRTL ? 'مباشر' : 'Live') : (isRTL ? 'غير متصل' : 'Offline')}
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              {!isMobile && (
                <motion.div 
                  className="flex items-center border-2 rounded-xl p-1 bg-muted/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      "h-9 px-4 rounded-lg transition-all duration-200",
                      viewMode === 'table' && 'shadow-sm'
                    )}
                    onClick={() => setViewMode('table')}
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      "h-9 px-4 rounded-lg transition-all duration-200",
                      viewMode === 'cards' && 'shadow-sm'
                    )}
                    onClick={() => setViewMode('cards')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* Refresh */}
              <motion.div
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="gap-2 h-10 px-4 border-2 hover:border-primary/50 transition-all"
                >
                  <motion.div
                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                    transition={{ duration: 0.6, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  <span className="hidden sm:inline">
                    {isRTL ? 'تحديث' : 'Refresh'}
                  </span>
                </Button>
              </motion.div>

              {/* New Order CTA */}
              <motion.div
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate('/portal/services')}
                  className="gap-2 h-10 px-5 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isRTL ? 'طلب جديد' : 'New Order'}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Strip */}
      <motion.div variants={itemVariants}>
        <OrdersKPIStrip
          orders={allOrders}
          isLoading={isLoading && allOrders.length === 0}
          onFilterByStatus={handleKPIFilter}
          activeFilter={filters.status}
        />
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <OrdersFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          totalCount={totalCount}
        />
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <OrdersErrorState error={error} onRetry={refetch} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {!isLoading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <OrdersEmptyState 
              hasFilters={hasActiveFilters} 
              onClearFilters={clearFilters} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!error && (orders.length > 0 || isLoading) && (
          <motion.div 
            key={viewMode}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {/* Table or Cards */}
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <OrdersPagination
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Drawer - Side panel, NOT popup */}
      <OrderDetailsDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setSelectedOrder(null), 300);
        }}
      />
    </motion.div>
  );
}
