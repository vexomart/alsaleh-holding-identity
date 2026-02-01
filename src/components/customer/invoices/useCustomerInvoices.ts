/**
 * useCustomerInvoices - Data fetching hook for customer invoices
 * With realtime subscription and filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  CustomerInvoice, 
  InvoiceFilters, 
  InvoicesSort, 
  INVOICE_STATUS_CONFIG,
  InvoiceStatus,
} from './types';

const DEFAULT_FILTERS: InvoiceFilters = {
  search: '',
  status: 'all',
  dateRange: 'all',
};

const DEFAULT_SORT: InvoicesSort = {
  field: 'created_at',
  direction: 'desc',
};

export function useCustomerInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<InvoicesSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchInvoices = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('invoices')
        .select(`
          *,
          order:orders(
            id, 
            order_number, 
            title, 
            title_ar, 
            total_amount,
            status,
            service:services(name, name_ar)
          )
        `, { count: 'exact' })
        .eq('customer_id', user.id);

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(`invoice_number.ilike.%${debouncedSearch}%`);
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
          query = query.gte('created_at', startDate!.toISOString());
        }
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Enrich invoices with computed fields
      const enrichedInvoices: CustomerInvoice[] = (data || []).map((invoice) => {
        const status = (invoice.status as InvoiceStatus) || 'draft';
        
        return {
          ...invoice,
          status: status,
          metadata: (invoice.metadata || {}) as Record<string, unknown>,
          order: invoice.order as unknown as CustomerInvoice['order'],
        };
      });

      setInvoices(enrichedInvoices);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.status, debouncedSearch, filters.dateRange, filters.startDate, filters.endDate, sort, page, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`customer-invoices-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `customer_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle realtime updates
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'فاتورة جديدة',
              description: 'تم إصدار فاتورة جديدة',
            });
            fetchInvoices();
          } else if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as CustomerInvoice;
            const oldRecord = payload.old as CustomerInvoice;
            
            // Status change notification
            if (newRecord.status !== oldRecord.status) {
              const statusConfig = INVOICE_STATUS_CONFIG[newRecord.status || 'draft'];
              toast({
                title: 'تم تحديث حالة الفاتورة',
                description: statusConfig?.labelAr || 'تم التحديث',
              });
            }
            
            // Update local state
            setInvoices(prev => prev.map(invoice => 
              invoice.id === newRecord.id 
                ? { ...invoice, ...newRecord } 
                : invoice
            ));
          } else if (payload.eventType === 'DELETE') {
            setInvoices(prev => prev.filter(invoice => invoice.id !== (payload.old as CustomerInvoice).id));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to invoices realtime');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchInvoices]);

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<InvoiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Sort handler
  const updateSort = useCallback((field: InvoicesSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || filters.status !== 'all' || filters.dateRange !== 'all';
  }, [filters]);

  return {
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
    refetch: fetchInvoices,
  };
}
