/**
 * Customer Contracts Center - World-class enterprise contracts page
 * RTL-first, responsive (table/cards), realtime updates, KPI stats
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Local components
import { useCustomerContracts } from './useCustomerContracts';
import { ContractsHeader } from './ContractsHeader';
import { ContractsKPIStrip } from './ContractsKPIStrip';
import { ContractsFilters } from './ContractsFilters';
import { ContractsTable } from './ContractsTable';
import { ContractsCardList } from './ContractsCardList';
import { ContractsPagination } from './ContractsPagination';
import { ContractDetailsDrawer } from './ContractDetailsDrawer';
import { ContractsEmptyState, ContractsErrorState } from './ContractsEmptyState';
import { CustomerContract, SortField, ContractStatus } from './types';

import { type ContractData, downloadContractPdf } from '@/lib/invoices';

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
    kpiData,
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    navigate(`/dashboard/contracts/${contract.id}/sign`);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  const handleFilterByStatus = (status: string) => {
    if (status === 'all') {
      updateFilters({ status: 'all' });
    } else if (status === 'pending_admin') {
      updateFilters({ status: 'pending_admin_approval' as ContractStatus });
    } else {
      updateFilters({ status: status as ContractStatus });
    }
  };

  const handleDownload = async (contract: CustomerContract) => {
    console.log('[PDF] CLICK', { kind: 'contract', id: contract.id });
    const toastId = toast.loading(isRTL ? 'جاري تجهيز الملف...' : 'Preparing file...');
    
    try {
      const { data: sig } = await supabase
        .from('contract_signatures')
        .select('signer_name, signer_national_id, signer_phone')
        .eq('contract_id', contract.id)
        .maybeSingle();

      const pricing = contract.pricing_json || { subtotal: 0, vat_rate: 15, vat_amount: 0, total: 0, currency: 'SAR' };

      const contractData: ContractData = {
        contractNumber: contract.contract_number,
        date: contract.created_at,
        serviceName: contract.service?.name_ar || contract.service?.name || 'خدمة',
        serviceNameAr: contract.service?.name_ar || undefined,
        scopeSummaryAr: contract.scope_summary_ar || undefined,
        provider: { name: 'شركة علي صالح الشهري القابضة', address: 'المملكة العربية السعودية - الرياض', role: 'provider' as const },
        customer: { name: sig?.signer_name || '', nationalId: sig?.signer_national_id || undefined, phone: sig?.signer_phone || undefined, role: 'customer' as const },
        pricing: {
          subtotal: pricing.subtotal || 0,
          vatRate: (pricing.vat_rate || 15) / 100,
          vatAmount: pricing.vat_amount || 0,
          total: pricing.total || 0,
        },
        currency: pricing.currency || 'SAR',
        // Admin approval stamp
        adminApprovedAt: contract.admin_approved_at || null,
        // Customer signature stamp
        customerSignedAt: contract.signed_at || null,
        customerSignatureName: sig?.signer_name || null,
      };

      const success = await downloadContractPdf(contractData);
      if (!success) throw new Error('Download failed');
      toast.success(isRTL ? 'تم تنزيل الملف' : 'Downloaded', { id: toastId });
    } catch (err) {
      console.error('[Contract Download] ❌ Error:', err);
      toast.error(isRTL ? 'فشل تنزيل الملف' : 'Download failed', { id: toastId });
    }
  };

  // Animation wrapper
  const AnimationWrapper = reducedMotion ? 'div' : motion.div;
  const pageAnimation = reducedMotion ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  };

  // KPI data for strip
  const kpiStripData = {
    total: kpiData.total,
    pending_signature: kpiData.pending_signature,
    pending_admin: kpiData.pending_admin,
    signed: kpiData.signed,
    cancelled: kpiData.cancelled,
  };

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={cn("space-y-4 pb-6", isRTL ? "text-right" : "text-left")}
    >
      {/* Premium Header */}
      <ContractsHeader
        searchValue={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenFilters={() => setFiltersOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* KPI Strip - directly after header */}
      <AnimationWrapper {...pageAnimation}>
        <ContractsKPIStrip 
          data={kpiStripData}
          isLoading={isLoading && contracts.length === 0}
          onFilterByStatus={handleFilterByStatus}
        />
      </AnimationWrapper>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Filters (Desktop inline, Mobile sheet) */}
        <ContractsFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          totalCount={totalCount}
          isOpen={filtersOpen}
          onOpenChange={setFiltersOpen}
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
                onViewOrder={handleViewOrder}
                selectedContractId={selectedContract?.id}
              />
            ) : (
              <ContractsCardList
                contracts={contracts}
                isLoading={isLoading}
                onCardClick={handleRowClick}
                onSign={handleSign}
                onDownload={handleDownload}
                onViewOrder={handleViewOrder}
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
      </div>

      {/* Details Drawer */}
      <ContractDetailsDrawer
        contract={selectedContract}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setSelectedContract(null), 300);
        }}
      />
    </section>
  );
}
