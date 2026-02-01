/**
 * useCustomerOrders - Data fetching hook for customer orders
 * With realtime subscription and filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  CustomerOrder, 
  OrderFilters, 
  OrdersSort, 
  ORDER_STATUS_CONFIG,
  OrderStatus,
} from './types';

const DEFAULT_FILTERS: OrderFilters = {
  search: '',
  status: 'all',
  dateRange: 'all',
};

const DEFAULT_SORT: OrdersSort = {
  field: 'created_at',
  direction: 'desc',
};

export function useCustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<OrdersSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select(`
          *,
          service:services(name, name_ar)
        `, { count: 'exact' })
        .eq('customer_id', user.id);

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,order_number.ilike.%${debouncedSearch}%,title_ar.ilike.%${debouncedSearch}%`);
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

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Enrich orders with computed fields
      const enrichedOrders: CustomerOrder[] = (data || []).map((order) => {
        const status = (order.status as OrderStatus) || 'pending';
        const statusConfig = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
        
        return {
          ...order,
          status: status,
          status_label_ar: statusConfig.labelAr,
          status_label_en: statusConfig.labelEn,
          status_color: statusConfig.color,
        };
      });

      setOrders(enrichedOrders);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.status, debouncedSearch, filters.dateRange, filters.startDate, filters.endDate, sort, page, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`customer-orders-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle realtime updates
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'طلب جديد',
              description: 'تم إضافة طلب جديد',
            });
            fetchOrders();
          } else if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as CustomerOrder;
            const oldRecord = payload.old as CustomerOrder;
            
            // Status change notification
            if (newRecord.status !== oldRecord.status) {
              const statusConfig = ORDER_STATUS_CONFIG[newRecord.status || 'pending'];
              toast({
                title: 'تم تحديث حالة طلبك',
                description: statusConfig?.labelAr || 'تم التحديث',
              });
            }
            
            // Update local state
            setOrders(prev => prev.map(order => 
              order.id === newRecord.id 
                ? { 
                    ...order, 
                    ...newRecord,
                    status_label_ar: ORDER_STATUS_CONFIG[newRecord.status || 'pending']?.labelAr,
                    status_label_en: ORDER_STATUS_CONFIG[newRecord.status || 'pending']?.labelEn,
                    status_color: ORDER_STATUS_CONFIG[newRecord.status || 'pending']?.color,
                  } 
                : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== (payload.old as CustomerOrder).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchOrders]);

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Sort handler
  const updateSort = useCallback((field: OrdersSort['field']) => {
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
    refetch: fetchOrders,
  };
}
