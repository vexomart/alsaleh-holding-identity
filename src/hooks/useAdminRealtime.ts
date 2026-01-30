/**
 * useAdminRealtime Hook
 * Combined real-time hook for Admin Dashboard
 * Handles delivery confirmations and sync status
 */

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServicesRealtime } from './useServicesRealtime';
import { useAdminDeliveryConfirmation } from './useAdminDeliveryConfirmation';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { ServiceEventPayload, DeliveryConfirmation } from '@/types/realtime-events';

interface UseAdminRealtimeOptions {
  tenantId?: string;
  enabled?: boolean;
  showDeliveryToasts?: boolean;
}

interface SyncStatus {
  lastSyncedAt: string | null;
  pendingEvents: number;
  confirmedDeliveries: number;
}

interface UseAdminRealtimeReturn {
  isServicesConnected: boolean;
  isDeliveryConnected: boolean;
  syncStatus: SyncStatus;
  deliveryLog: DeliveryConfirmation[];
  clearDeliveryLog: () => void;
}

export const useAdminRealtime = (options: UseAdminRealtimeOptions): UseAdminRealtimeReturn => {
  const { tenantId, enabled = true, showDeliveryToasts = false } = options;
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncedAt: null,
    pendingEvents: 0,
    confirmedDeliveries: 0,
  });

  // Handle service changes (for cache invalidation)
  const handleServiceChange = useCallback(
    (payload: ServiceEventPayload) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      setSyncStatus(prev => ({
        ...prev,
        lastSyncedAt: new Date().toISOString(),
        pendingEvents: prev.pendingEvents + 1,
      }));
    },
    [queryClient]
  );

  // Handle delivery confirmations from customers
  const handleDeliveryConfirmed = useCallback(
    (confirmation: DeliveryConfirmation) => {
      setSyncStatus(prev => ({
        ...prev,
        pendingEvents: Math.max(0, prev.pendingEvents - 1),
        confirmedDeliveries: prev.confirmedDeliveries + 1,
      }));

      if (showDeliveryToasts) {
        toast({
          title: isRTL ? 'تم التسليم' : 'Delivered',
          description: isRTL 
            ? `تم تسليم ${confirmation.event_type} للمستخدم`
            : `${confirmation.event_type} delivered to user`,
          duration: 2000,
        });
      }
    },
    [showDeliveryToasts, isRTL]
  );

  // Subscribe to services realtime
  const {
    isConnected: isServicesConnected,
  } = useServicesRealtime({
    tenantId,
    onAnyChange: handleServiceChange,
    enabled,
  });

  // Subscribe to delivery confirmations
  const {
    isConnected: isDeliveryConnected,
    deliveryLog,
    clearLog: clearDeliveryLog,
  } = useAdminDeliveryConfirmation({
    tenantId,
    onDeliveryConfirmed: handleDeliveryConfirmed,
    enabled,
  });

  return {
    isServicesConnected,
    isDeliveryConnected,
    syncStatus,
    deliveryLog,
    clearDeliveryLog,
  };
};
