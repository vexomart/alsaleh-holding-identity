/**
 * useCrossDashboardSync Hook
 * High-level hook for complete Admin ↔ Customer synchronization
 * Uses useUnifiedRealtime with pre-configured settings
 */

import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedRealtime, SyncEvent, broadcastSyncEvent } from './useUnifiedRealtime';
import { useQueryClient } from '@tanstack/react-query';

interface CrossDashboardSyncOptions {
  role: 'admin' | 'customer';
  enabled?: boolean;
  onOrderUpdate?: (event: SyncEvent) => void;
  onContractUpdate?: (event: SyncEvent) => void;
  onWalletUpdate?: (event: SyncEvent) => void;
  onServiceUpdate?: (event: SyncEvent) => void;
  onNotification?: (event: SyncEvent) => void;
}

interface CrossDashboardSyncReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastEvent: SyncEvent | null;
  eventCount: number;
  reconnect: () => void;
  notifyOtherDashboard: (event: SyncEvent) => Promise<void>;
  forceRefreshAll: () => void;
}

export function useCrossDashboardSync(options: CrossDashboardSyncOptions): CrossDashboardSyncReturn {
  const {
    role,
    enabled = true,
    onOrderUpdate,
    onContractUpdate,
    onWalletUpdate,
    onServiceUpdate,
    onNotification,
  } = options;

  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Route events to specific handlers
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    switch (true) {
      case event.type.startsWith('order.'):
        onOrderUpdate?.(event);
        break;
      case event.type.startsWith('contract.'):
        onContractUpdate?.(event);
        break;
      case event.type.startsWith('wallet.'):
        onWalletUpdate?.(event);
        break;
      case event.type.startsWith('service.'):
        onServiceUpdate?.(event);
        break;
      case event.type.startsWith('notification.'):
        onNotification?.(event);
        break;
    }
  }, [onOrderUpdate, onContractUpdate, onWalletUpdate, onServiceUpdate, onNotification]);

  // Use unified realtime hook
  const {
    isConnected,
    connectionStatus,
    lastEvent,
    eventCount,
    reconnect,
  } = useUnifiedRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    role,
    enabled: enabled && !!user,
    onSyncEvent: handleSyncEvent,
    showToasts: true,
    tables: ['orders', 'contracts', 'wallets', 'services', 'notifications'],
  });

  // Notify other dashboard about changes
  const notifyOtherDashboard = useCallback(async (event: SyncEvent) => {
    await broadcastSyncEvent(profile?.tenant_id || undefined, event);
  }, [profile?.tenant_id]);

  // Force refresh all queries
  const forceRefreshAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    isConnected,
    connectionStatus,
    lastEvent,
    eventCount,
    reconnect,
    notifyOtherDashboard,
    forceRefreshAll,
  };
}

/**
 * Admin-specific sync hook
 */
export function useAdminDashboardSync(options?: Omit<CrossDashboardSyncOptions, 'role'>) {
  return useCrossDashboardSync({ ...options, role: 'admin' });
}

/**
 * Customer-specific sync hook  
 */
export function useCustomerDashboardSync(options?: Omit<CrossDashboardSyncOptions, 'role'>) {
  return useCrossDashboardSync({ ...options, role: 'customer' });
}
