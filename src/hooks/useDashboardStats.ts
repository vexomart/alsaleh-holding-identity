import { useState, useEffect, useCallback } from 'react';
import { db } from '@/integrations/supabase/db';

export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  totalServices: number;
  pendingOrders: number;
  completedOrders: number;
  activeUsers: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalServices: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        ordersResult,
        usersResult,
        servicesResult,
        pendingOrdersResult,
        completedOrdersResult,
      ] = await Promise.all([
        db.from('orders').select('id, total_amount', { count: 'exact', head: false }),
        db.from('profiles').select('id, is_active', { count: 'exact', head: false }),
        db.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
        db.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        db.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      ]);

      // Calculate total revenue
      const totalRevenue = ordersResult.data?.reduce((sum, order) => {
        return sum + (order.total_amount || 0);
      }, 0) || 0;

      // Calculate active users
      const activeUsers = usersResult.data?.filter(u => u.is_active).length || 0;

      setStats({
        totalOrders: ordersResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalRevenue,
        totalServices: servicesResult.count || 0,
        pendingOrders: pendingOrdersResult.count || 0,
        completedOrders: completedOrdersResult.count || 0,
        activeUsers,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};
