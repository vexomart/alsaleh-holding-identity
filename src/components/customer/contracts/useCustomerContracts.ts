/**
 * useCustomerContracts - Data fetching hook for customer contracts
 * With realtime subscription, filtering, and KPI stats
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  CustomerContract, 
  ContractFilters, 
  ContractsSort, 
  CONTRACT_STATUS_CONFIG,
  ContractStatus,
  ContractsKPIData,
} from './types';

const DEFAULT_FILTERS: ContractFilters = {
  search: '',
  status: 'all',
  dateRange: 'all',
};

const DEFAULT_SORT: ContractsSort = {
  field: 'created_at',
  direction: 'desc',
};

const DEFAULT_KPI: ContractsKPIData = {
  total: 0,
  draft: 0,
  pre_approved: 0,
  pending_admin: 0,
  pending_signature: 0,
  signed: 0,
  cancelled: 0,
};

export function useCustomerContracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<CustomerContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ContractFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<ContractsSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [kpiData, setKpiData] = useState<ContractsKPIData>(DEFAULT_KPI);

  const debouncedSearch = useDebounce(filters.search, 300);

  // Fetch KPI stats (unfiltered totals)
  const fetchKPIStats = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: queryError } = await supabase
        .from('contracts')
        .select('status')
        .eq('customer_user_id', user.id);

      if (queryError) throw queryError;

      const stats: ContractsKPIData = {
        total: data?.length || 0,
        draft: data?.filter(c => c.status === 'draft').length || 0,
        pre_approved: data?.filter(c => c.status === 'pre_approved_by_customer').length || 0,
        pending_admin: data?.filter(c => c.status === 'pending_admin_approval').length || 0,
        pending_signature: data?.filter(c => c.status === 'pending_signature').length || 0,
        signed: data?.filter(c => c.status === 'signed').length || 0,
        cancelled: data?.filter(c => c.status === 'cancelled').length || 0,
      };

      setKpiData(stats);
    } catch (err) {
      console.error('Error fetching KPI stats:', err);
    }
  }, [user]);

  const fetchContracts = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('contracts')
        .select(`
          *,
          service:services!contracts_service_id_fkey(id, name, name_ar, description, description_ar),
          order:orders!contracts_order_id_fkey(id, order_number, title, title_ar)
        `, { count: 'exact' })
        .eq('customer_user_id', user.id);

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(`contract_number.ilike.%${debouncedSearch}%,scope_summary.ilike.%${debouncedSearch}%,scope_summary_ar.ilike.%${debouncedSearch}%`);
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case '7d':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case '90d':
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
          case 'custom':
            if (filters.startDate) {
              query = query.gte('created_at', filters.startDate.toISOString());
            }
            if (filters.endDate) {
              query = query.lte('created_at', filters.endDate.toISOString());
            }
            break;
          default:
            startDate = new Date(0);
        }
        
        if (filters.dateRange !== 'custom') {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Apply service filter
      if (filters.serviceId) {
        query = query.eq('service_id', filters.serviceId);
      }

      // Apply sorting
      if (sort.field === 'pricing') {
        // JSON field sorting not directly supported, sort client-side
        query = query.order('created_at', { ascending: sort.direction === 'asc' });
      } else {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Enrich contracts with computed fields
      const enrichedContracts: CustomerContract[] = (data || []).map((contract) => {
        const status = (contract.status as ContractStatus) || 'draft';
        const statusConfig = CONTRACT_STATUS_CONFIG[status] || CONTRACT_STATUS_CONFIG.draft;
        
        return {
          ...contract,
          status: status,
          pricing_json: contract.pricing_json as unknown as CustomerContract['pricing_json'],
          terms_snapshot_json: contract.terms_snapshot_json as unknown as Record<string, unknown> | null,
          service: contract.service as unknown as CustomerContract['service'],
          order: contract.order as unknown as CustomerContract['order'],
          status_label_ar: statusConfig.labelAr,
          status_label_en: statusConfig.labelEn,
          status_color: statusConfig.color,
        };
      });

      // Client-side sort for pricing if needed
      if (sort.field === 'pricing') {
        enrichedContracts.sort((a, b) => {
          const aVal = a.pricing_json?.total || 0;
          const bVal = b.pricing_json?.total || 0;
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
      }

      setContracts(enrichedContracts);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.status, debouncedSearch, filters.dateRange, filters.startDate, filters.endDate, filters.serviceId, sort, page, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchContracts();
    fetchKPIStats();
  }, [fetchContracts, fetchKPIStats]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`customer-contracts-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts',
          filter: `customer_user_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle realtime updates
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'عقد جديد',
              description: 'تم إضافة عقد جديد',
            });
            fetchContracts();
            fetchKPIStats();
          } else if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as CustomerContract;
            const oldRecord = payload.old as CustomerContract;
            
            // Status change notification
            if (newRecord.status !== oldRecord.status) {
              const statusConfig = CONTRACT_STATUS_CONFIG[newRecord.status || 'draft'];
              toast({
                title: 'تم تحديث حالة العقد',
                description: statusConfig?.labelAr || 'تم التحديث',
              });
            }
            
            // Update local state
            setContracts(prev => prev.map(contract => 
              contract.id === newRecord.id 
                ? { 
                    ...contract, 
                    ...newRecord,
                    status_label_ar: CONTRACT_STATUS_CONFIG[newRecord.status || 'draft']?.labelAr,
                    status_label_en: CONTRACT_STATUS_CONFIG[newRecord.status || 'draft']?.labelEn,
                    status_color: CONTRACT_STATUS_CONFIG[newRecord.status || 'draft']?.color,
                  } 
                : contract
            ));
            fetchKPIStats();
          } else if (payload.eventType === 'DELETE') {
            setContracts(prev => prev.filter(contract => contract.id !== (payload.old as CustomerContract).id));
            fetchKPIStats();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchContracts, fetchKPIStats]);

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<ContractFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Sort handler
  const updateSort = useCallback((field: ContractsSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || filters.status !== 'all' || filters.dateRange !== 'all' || !!filters.serviceId;
  }, [filters]);

  return {
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
    refetch: fetchContracts,
  };
}
