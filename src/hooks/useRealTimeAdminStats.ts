/**
 * useRealTimeAdminStats Hook
 * 
 * Fetches real-time statistics and system alerts from database
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  messageAr: string;
  time: string;
}

interface RealTimeStats {
  pendingOrders: number;
  expiringContracts: number;
  pendingPayments: number;
  totalWalletBalance: number;
}

export const useRealTimeAdminStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    pendingOrders: 0,
    expiringContracts: 0,
    pendingPayments: 0,
    totalWalletBalance: 0,
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch pending orders
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch contracts expiring soon (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: expiringContracts } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'signed')
        .lte('created_at', thirtyDaysFromNow.toISOString());

      // Fetch pending/overdue finance payments
      const { count: pendingPayments } = await supabase
        .from('finance_payments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['scheduled', 'overdue']);

      // Fetch total wallet balance
      const { data: wallets } = await supabase
        .from('customer_wallets')
        .select('balance');
      
      const totalWalletBalance = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

      const newStats = {
        pendingOrders: pendingOrders || 0,
        expiringContracts: expiringContracts || 0,
        pendingPayments: pendingPayments || 0,
        totalWalletBalance,
      };

      setStats(newStats);

      // Generate alerts based on stats
      const newAlerts: SystemAlert[] = [];
      
      if (newStats.pendingOrders > 0) {
        newAlerts.push({
          id: 'pending-orders',
          type: 'warning',
          message: `${newStats.pendingOrders} orders pending approval`,
          messageAr: `${newStats.pendingOrders} طلبات بانتظار الموافقة`,
          time: 'Now',
        });
      }

      if (newStats.expiringContracts > 0) {
        newAlerts.push({
          id: 'expiring-contracts',
          type: 'danger',
          message: `${newStats.expiringContracts} contracts expiring soon`,
          messageAr: `${newStats.expiringContracts} عقود قاربت على الانتهاء`,
          time: 'Now',
        });
      }

      if (newStats.pendingPayments > 0) {
        newAlerts.push({
          id: 'pending-payments',
          type: 'info',
          message: `${newStats.pendingPayments} payments pending`,
          messageAr: `${newStats.pendingPayments} دفعات معلقة`,
          time: 'Now',
        });
      }

      setAlerts(newAlerts);

    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    alerts,
    loading,
    refresh: fetchStats,
  };
};
