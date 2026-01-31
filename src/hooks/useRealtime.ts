/**
 * useRealtime Hook - Phase 0.5
 * Realtime subscriptions for notifications, orders, and security events
 * Fixed: Uses useState for isConnected to trigger UI updates
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type RealtimeEvent = 
  | 'notification.created'
  | 'order.created'
  | 'order.status_changed'
  | 'order.assigned'
  | 'security.suspicious_login';

export interface RealtimePayload<T = unknown> {
  event: RealtimeEvent;
  data: T;
}

interface UseRealtimeOptions {
  userId?: string;
  tenantId?: string;
  onNotification?: (payload: RealtimePayload) => void;
  onOrderCreated?: (payload: RealtimePayload) => void;
  onOrderStatusChanged?: (payload: RealtimePayload) => void;
  onOrderAssigned?: (payload: RealtimePayload) => void;
  onSecurityAlert?: (payload: RealtimePayload) => void;
  enabled?: boolean;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useRealtime = (options: UseRealtimeOptions): UseRealtimeReturn => {
  const {
    userId,
    tenantId,
    onNotification,
    onOrderCreated,
    onOrderStatusChanged,
    onOrderAssigned,
    onSecurityAlert,
    enabled = true,
  } = options;

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleNotificationChange = useCallback(
    (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => {
      if (payload.eventType === 'INSERT' && onNotification) {
        onNotification({
          event: 'notification.created',
          data: payload.new,
        });
      }
    },
    [onNotification]
  );

  const handleOrderEventChange = useCallback(
    (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => {
      if (payload.eventType === 'INSERT') {
        const eventType = (payload.new as { event_type?: string })?.event_type;
        
        switch (eventType) {
          case 'created':
            onOrderCreated?.({
              event: 'order.created',
              data: payload.new,
            });
            break;
          case 'status_changed':
            onOrderStatusChanged?.({
              event: 'order.status_changed',
              data: payload.new,
            });
            break;
          case 'assigned':
            onOrderAssigned?.({
              event: 'order.assigned',
              data: payload.new,
            });
            break;
        }
      }
    },
    [onOrderCreated, onOrderStatusChanged, onOrderAssigned]
  );

  const subscribe = useCallback(() => {
    if (!enabled) return;

    // Unsubscribe first to prevent duplicate subscriptions
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    let connectedCount = 0;
    let expectedCount = 0;

    const checkAllConnected = () => {
      if (connectedCount === expectedCount && expectedCount > 0) {
        setIsConnected(true);
      }
    };

    // Subscribe to user notifications
    if (userId && onNotification) {
      expectedCount++;
      const notificationChannel = supabase
        .channel(`user:${userId}:notifications`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          handleNotificationChange
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            connectedCount++;
            checkAllConnected();
          }
        });

      channelsRef.current.push(notificationChannel);
    }

    // Subscribe to order events for tenant
    if (tenantId && (onOrderCreated || onOrderStatusChanged || onOrderAssigned)) {
      expectedCount++;
      const orderEventsChannel = supabase
        .channel(`tenant:${tenantId}:order_events`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order_events',
            filter: `tenant_id=eq.${tenantId}`,
          },
          handleOrderEventChange
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            connectedCount++;
            checkAllConnected();
          }
        });

      channelsRef.current.push(orderEventsChannel);
    }

    // Subscribe to user's own order events
    if (userId && (onOrderStatusChanged || onOrderAssigned)) {
      expectedCount++;
      const userOrdersChannel = supabase
        .channel(`user:${userId}:orders`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `customer_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' && onOrderStatusChanged) {
              const oldStatus = (payload.old as { status?: string })?.status;
              const newStatus = (payload.new as { status?: string })?.status;
              
              if (oldStatus !== newStatus) {
                onOrderStatusChanged({
                  event: 'order.status_changed',
                  data: {
                    ...payload.new,
                    previous_status: oldStatus,
                    new_status: newStatus,
                  },
                });
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            connectedCount++;
            checkAllConnected();
          }
        });

      channelsRef.current.push(userOrdersChannel);
    }

    // If no subscriptions, set connected to true
    if (expectedCount === 0) {
      setIsConnected(true);
    }
  }, [
    enabled,
    userId,
    tenantId,
    onNotification,
    onOrderCreated,
    onOrderStatusChanged,
    onOrderAssigned,
    handleNotificationChange,
    handleOrderEventChange,
  ]);

  const unsubscribe = useCallback(() => {
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
    setIsConnected(false);
  }, []);

  useEffect(() => {
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  return {
    isConnected,
    subscribe,
    unsubscribe,
  };
};
