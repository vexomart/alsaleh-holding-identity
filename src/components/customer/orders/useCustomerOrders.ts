/**
 * useCustomerOrders - Enterprise data fetching hook for customer orders
 * With realtime subscription, filtering, and connection status
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/hooks/useLanguage';
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
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // State
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [allOrders, setAllOrders] = useState<CustomerOrder[]>([]); // For KPI calculations
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<OrdersSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Enrich order with computed fields
  const enrichOrder = useCallback((order: any): CustomerOrder => {
    const status = (order.status as OrderStatus) || 'pending';
    const statusConfig = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
    
    return {
      ...order,
      status: status,
      status_label_ar: statusConfig.labelAr,
      status_label_en: statusConfig.labelEn,
      status_color: statusConfig.color,
    };
  }, []);

  // Fetch all orders (for KPI)
  const fetchAllOrders = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('customer_id', user.id);

      if (queryError) throw queryError;

      setAllOrders((data || []).map(enrichOrder));
    } catch (err) {
      console.error('Error fetching all orders:', err);
    }
  }, [user, enrichOrder]);

  // Fetch paginated/filtered orders
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
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'custom':
            if (filters.startDate) {
              query = query.gte('created_at', filters.startDate.toISOString());
            }
            if (filters.endDate) {
              query = query.lte('created_at', filters.endDate.toISOString());
            }
            startDate = new Date(0);
            break;
          default:
            startDate = new Date(0);
        }
        
        if (filters.dateRange !== 'custom' && startDate) {
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

      const enrichedOrders = (data || []).map(enrichOrder);
      setOrders(enrichedOrders);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.status, debouncedSearch, filters.dateRange, filters.startDate, filters.endDate, sort, page, pageSize, enrichOrder]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
    fetchAllOrders();
  }, [fetchOrders, fetchAllOrders]);

  // Realtime subscription with connection status
  useEffect(() => {
    if (!user) return;

    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`customer-orders-${user.id}-${Date.now()}`)
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
            const newOrder = enrichOrder(payload.new);
            
            toast({
              title: isRTL ? 'طلب جديد' : 'New Order',
              description: isRTL 
                ? `تم إضافة طلب جديد: ${newOrder.order_number}`
                : `New order added: ${newOrder.order_number}`,
            });
            
            // Add to all orders for KPI
            setAllOrders(prev => [newOrder, ...prev]);
            
            // Refetch to get proper pagination
            fetchOrders();
          } else if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as CustomerOrder;
            const oldRecord = payload.old as CustomerOrder;
            
            // Status change notification
            if (newRecord.status !== oldRecord.status) {
              const statusConfig = ORDER_STATUS_CONFIG[newRecord.status || 'pending'];
              toast({
                title: isRTL ? 'تم تحديث حالة طلبك' : 'Order Status Updated',
                description: isRTL ? statusConfig?.labelAr : statusConfig?.labelEn,
              });
            }
            
            // Update local state with enriched data
            const enrichedUpdate = enrichOrder(newRecord);
            
            setOrders(prev => prev.map(order => 
              order.id === newRecord.id ? enrichedUpdate : order
            ));
            
            setAllOrders(prev => prev.map(order =>
              order.id === newRecord.id ? enrichedUpdate : order
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as CustomerOrder).id;
            setOrders(prev => prev.filter(order => order.id !== deletedId));
            setAllOrders(prev => prev.filter(order => order.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [user, isRTL, enrichOrder, fetchOrders]);

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
    refetch: fetchOrders,
    isConnected,
  };
}
