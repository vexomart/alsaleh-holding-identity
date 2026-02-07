/**
 * useAdminAnalytics Hook - Instant Loading with Cache
 * 
 * OPTIMIZATION: Uses localStorage cache for instant initial render
 * - Shows cached data immediately (no loading spinner)
 * - Fetches fresh data in background
 * - Updates cache on successful fetch
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminAnalytics {
  // KPI Stats
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalServices: number;
  activeUsers: number;
  // Order breakdown by status
  ordersByStatus: {
    pending: number;
    processing: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
  // Monthly revenue data (last 7 months)
  monthlyRevenue: Array<{
    month: string;
    monthEn: string;
    revenue: number;
    orders: number;
  }>;
  // Top services by order count
  topServices: Array<{
    id: string;
    name: string;
    name_ar: string | null;
    orders_count: number;
    revenue: number;
  }>;
  // Recent orders
  recentOrders: Array<{
    id: string;
    order_number: string;
    title: string;
    status: string;
    created_at: string;
    total_amount: number | null;
  }>;
}

const CACHE_KEY = 'admin_analytics_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const defaultAnalytics: AdminAnalytics = {
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  totalServices: 0,
  activeUsers: 0,
  ordersByStatus: {
    pending: 0,
    processing: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
  },
  monthlyRevenue: [],
  topServices: [],
  recentOrders: [],
};

// Get cached analytics synchronously
function getCachedAnalytics(): { data: AdminAnalytics; isStale: boolean } {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isStale = Date.now() - parsed.timestamp > CACHE_TTL;
      return { data: parsed.data, isStale };
    }
  } catch {
    // Silent fail
  }
  return { data: defaultAnalytics, isStale: true };
}

// Cache analytics
function cacheAnalytics(data: AdminAnalytics) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Silent fail
  }
}

export const useAdminAnalytics = () => {
  // INSTANT: Start with cached data
  const cached = getCachedAnalytics();
  const [analytics, setAnalytics] = useState<AdminAnalytics>(cached.data);
  // Only show loading if we have no cached data
  const [loading, setLoading] = useState(cached.isStale && cached.data.totalOrders === 0);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const fetchAnalytics = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      // Only show loading if no cached data
      if (analytics.totalOrders === 0) {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [
        ordersRes,
        usersRes,
        servicesRes,
        recentOrdersRes,
      ] = await Promise.all([
        // All orders with status and amounts
        supabase.from('orders').select('id, status, total_amount, created_at, service_id'),
        // All users with activity status
        supabase.from('profiles').select('id, is_active'),
        // Active services only
        supabase.from('services').select('id, name, name_ar', { count: 'exact' }).eq('is_active', true),
        // Recent orders for activity feed
        supabase.from('orders')
          .select('id, order_number, title, status, created_at, total_amount')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (!isMountedRef.current) return;

      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const services = servicesRes.data || [];

      // Calculate order status breakdown
      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        in_progress: orders.filter(o => o.status === 'in_progress').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        refunded: orders.filter(o => o.status === 'refunded').length,
      };

      // Calculate total revenue from all orders
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Calculate monthly revenue for last 7 months
      const now = new Date();
      const monthlyData: Record<string, { revenue: number; orders: number }> = {};
      
      // Initialize last 7 months
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyData[key] = { revenue: 0, orders: 0 };
      }

      // Aggregate order data by month
      orders.forEach(order => {
        if (order.created_at) {
          const date = new Date(order.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          if (monthlyData[key]) {
            monthlyData[key].revenue += order.total_amount || 0;
            monthlyData[key].orders += 1;
          }
        }
      });

      // Convert to array format for charts
      const monthlyRevenue = Object.entries(monthlyData).map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          month: monthNamesAr[month],
          monthEn: monthNamesEn[month],
          revenue: data.revenue,
          orders: data.orders,
        };
      });

      // Calculate top services by order count
      const serviceOrderCounts: Record<string, { count: number; revenue: number }> = {};
      orders.forEach(order => {
        if (order.service_id) {
          if (!serviceOrderCounts[order.service_id]) {
            serviceOrderCounts[order.service_id] = { count: 0, revenue: 0 };
          }
          serviceOrderCounts[order.service_id].count += 1;
          serviceOrderCounts[order.service_id].revenue += order.total_amount || 0;
        }
      });

      const topServices = services
        .map(service => ({
          id: service.id,
          name: service.name,
          name_ar: service.name_ar,
          orders_count: serviceOrderCounts[service.id]?.count || 0,
          revenue: serviceOrderCounts[service.id]?.revenue || 0,
        }))
        .sort((a, b) => b.orders_count - a.orders_count)
        .slice(0, 5);

      const newAnalytics: AdminAnalytics = {
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        totalServices: servicesRes.count || services.length,
        activeUsers: users.filter(u => u.is_active).length,
        ordersByStatus,
        monthlyRevenue,
        topServices,
        recentOrders: recentOrdersRes.data || [],
      };

      // Update state and cache
      if (isMountedRef.current) {
        setAnalytics(newAnalytics);
        cacheAnalytics(newAnalytics);
      }

    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [analytics.totalOrders]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Fetch fresh data immediately
    fetchAnalytics();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
};
