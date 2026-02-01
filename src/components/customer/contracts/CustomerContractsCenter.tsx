/**
 * Customer Contracts Center - Enterprise-grade contracts page
 * RTL-first, responsive (table/cards), realtime updates
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, ShoppingBag, LayoutGrid, Table as TableIcon } from 'lucide-react';

// Local components
import { useCustomerContracts } from './useCustomerContracts';
import { ContractsFilters } from './ContractsFilters';
import { ContractsTable } from './ContractsTable';
import { ContractsCardList } from './ContractsCardList';
import { ContractsPagination } from './ContractsPagination';
import { ContractDetailsDrawer } from './ContractDetailsDrawer';
import { ContractsEmptyState, ContractsErrorState } from './ContractsEmptyState';
import { CustomerContract, SortField } from './types';

export function CustomerContractsCenter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Data fetching
  const {
    contracts,
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
  } = useCustomerContracts();

  // Local state
  const [selectedContract, setSelectedContract] = useState<CustomerContract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRowClick = (contract: CustomerContract) => {
    setSelectedContract(contract);
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

  const handleSign = (contract: CustomerContract) => {
    navigate(`/app/contracts/${contract.id}`);
  };

  const handleDownload = (contract: CustomerContract) => {
    navigate(`/app/contracts/${contract.id}?download=true`);
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
              {isRTL ? 'مركز العقود' : 'Contracts Center'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL 
                ? 'عرض وإدارة جميع عقودك في مكان واحد'
                : 'View and manage all your contracts in one place'}
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
                {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
              </span>
            </Button>
          </div>
        </div>
      </AnimationWrapper>

      {/* Filters */}
      <ContractsFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={totalCount}
      />

      {/* Error State */}
      {error && (
        <ContractsErrorState error={error} onRetry={refetch} />
      )}

      {/* Empty State */}
      {!isLoading && !error && contracts.length === 0 && (
        <ContractsEmptyState 
          hasFilters={hasActiveFilters} 
          onClearFilters={clearFilters} 
        />
      )}

      {/* Content */}
      {!error && contracts.length > 0 && (
        <>
          {/* Table View (Desktop) or Cards View (Mobile/Toggle) */}
          {(viewMode === 'table' && !isMobile) ? (
            <ContractsTable
              contracts={contracts}
              isLoading={isLoading}
              sort={sort}
              onSort={handleSort}
              onRowClick={handleRowClick}
              onSign={handleSign}
              onDownload={handleDownload}
              selectedContractId={selectedContract?.id}
            />
          ) : (
            <ContractsCardList
              contracts={contracts}
              isLoading={isLoading}
              onCardClick={handleRowClick}
              onSign={handleSign}
              onDownload={handleDownload}
              selectedContractId={selectedContract?.id}
            />
          )}

          {/* Pagination */}
          <ContractsPagination
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
      {isLoading && contracts.length === 0 && (
        <>
          {(viewMode === 'table' && !isMobile) ? (
            <ContractsTable
              contracts={[]}
              isLoading={true}
              sort={sort}
              onSort={handleSort}
              onRowClick={() => {}}
            />
          ) : (
            <ContractsCardList
              contracts={[]}
              isLoading={true}
              onCardClick={() => {}}
            />
          )}
        </>
      )}

      {/* Details Drawer */}
      <ContractDetailsDrawer
        contract={selectedContract}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setSelectedContract(null), 300);
        }}
      />
    </div>
  );
}
