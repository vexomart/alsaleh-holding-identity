/**
 * useAdminDeliveryConfirmation Hook
 * Provides live confirmation when events are delivered to customers
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { DeliveryConfirmation } from '@/types/realtime-events';

interface UseAdminDeliveryConfirmationOptions {
  tenantId?: string;
  onDeliveryConfirmed?: (confirmation: DeliveryConfirmation) => void;
  enabled?: boolean;
}

interface UseAdminDeliveryConfirmationReturn {
  isConnected: boolean;
  deliveryLog: DeliveryConfirmation[];
  clearLog: () => void;
}

export const useAdminDeliveryConfirmation = (
  options: UseAdminDeliveryConfirmationOptions
): UseAdminDeliveryConfirmationReturn => {
  const { tenantId, onDeliveryConfirmed, enabled = true } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deliveryLog, setDeliveryLog] = useState<DeliveryConfirmation[]>([]);

  const handleBroadcast = useCallback(
    (payload: { type: string; payload: DeliveryConfirmation }) => {
      if (payload.type === 'delivery_confirmation') {
        const confirmation = payload.payload;
        
        setDeliveryLog(prev => {
          // Keep last 50 confirmations
          const updated = [confirmation, ...prev].slice(0, 50);
          return updated;
        });

        onDeliveryConfirmed?.(confirmation);
      }
    },
    [onDeliveryConfirmed]
  );

  const subscribe = useCallback(() => {
    if (!enabled) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channelName = tenantId 
      ? `admin:delivery:${tenantId}` 
      : 'admin:delivery:global';

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'delivery_confirmation' }, handleBroadcast)
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [enabled, tenantId, handleBroadcast]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const clearLog = useCallback(() => {
    setDeliveryLog([]);
  }, []);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return {
    isConnected,
    deliveryLog,
    clearLog,
  };
};

/**
 * Helper to send delivery confirmation from customer side
 */
export const sendDeliveryConfirmation = async (
  tenantId: string | undefined,
  confirmation: Omit<DeliveryConfirmation, 'delivered_at'>
) => {
  const channelName = tenantId 
    ? `admin:delivery:${tenantId}` 
    : 'admin:delivery:global';

  const channel = supabase.channel(channelName);
  
  await channel.send({
    type: 'broadcast',
    event: 'delivery_confirmation',
    payload: {
      ...confirmation,
      delivered_at: new Date().toISOString(),
    },
  });

  supabase.removeChannel(channel);
};
