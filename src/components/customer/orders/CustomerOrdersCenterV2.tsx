/**
 * Customer Orders Center V2 - World-Class Enterprise Orders Page
 * Ultra-modern RTL-first, fully responsive, premium animations
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
  Package,
  Zap,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Local components
import { useCustomerOrders } from './useCustomerOrders';
import { OrdersKPIStripV2 } from './OrdersKPIStripV2';
import { OrdersFilters } from './OrdersFilters';
import { OrdersTable } from './OrdersTable';
import { OrdersCardList } from './OrdersCardList';
import { OrdersPagination } from './OrdersPagination';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';
import { OrdersEmptyState, OrdersErrorState } from './OrdersEmptyState';
import { CustomerOrder, SortField, OrderStatus } from './types';

export function CustomerOrdersCenterV2() {
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
        duration: reducedMotion ? 0 : 0.4,
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
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
      {/* Premium Hero Header */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 end-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 via-emerald-500/20 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 start-0 w-[300px] h-[300px] bg-gradient-to-tr from-amber-500/20 via-primary/10 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Top Accent */}
          <motion.div
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative shrink-0"
                  whileHover={reducedMotion ? {} : { scale: 1.05, rotate: 5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-emerald-500/40 rounded-2xl blur-xl" />
                  <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-500 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Package className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <motion.h1 
                    className="text-3xl md:text-4xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isRTL ? 'طلباتي' : 'My Orders'}
                  </motion.h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white/60 text-sm">
                      {isRTL ? 'تتبع طلباتك في مكان واحد' : 'Track your orders in one place'}
                    </span>
                    {/* Live indicator */}
                    <motion.span 
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                        isConnected 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                    >
                      <motion.span 
                        className={cn(
                          'h-2 w-2 rounded-full',
                          isConnected ? 'bg-emerald-400' : 'bg-white/40'
                        )}
                        animate={isConnected ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      {isConnected ? (isRTL ? 'مباشر' : 'Live') : (isRTL ? 'غير متصل' : 'Offline')}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Toggle - Desktop Only */}
                {!isMobile && (
                  <motion.div 
                    className="flex items-center bg-white/5 rounded-xl p-1 backdrop-blur-sm border border-white/10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 px-4 rounded-lg transition-all duration-300",
                        viewMode === 'table' 
                          ? 'bg-white/10 text-white shadow-lg' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                      onClick={() => setViewMode('table')}
                    >
                      <TableIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 px-4 rounded-lg transition-all duration-300",
                        viewMode === 'cards' 
                          ? 'bg-white/10 text-white shadow-lg' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
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
                    className="gap-2 h-11 px-5 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white transition-all"
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
                    onClick={() => navigate('/app/services')}
                    className="gap-2 h-11 px-6 bg-gradient-to-r from-primary to-emerald-500 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all border-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isRTL ? 'طلب جديد' : 'New Order'}</span>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{isRTL ? 'تحديثات فورية' : 'Real-time updates'}</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>{isRTL ? 'تتبع ذكي' : 'Smart tracking'}</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>{isRTL ? 'آمن 100%' : '100% Secure'}</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Gradient Line */}
          <motion.div
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* KPI Strip */}
      <motion.div variants={itemVariants}>
        <OrdersKPIStripV2
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

      {/* Details Drawer */}
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
