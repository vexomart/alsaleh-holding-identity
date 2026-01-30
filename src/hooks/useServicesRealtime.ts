/**
 * useServicesRealtime Hook
 * Real-time synchronization for services between Admin and Customer dashboards
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { ServiceEventPayload, ServiceEventType } from '@/types/realtime-events';

interface UseServicesRealtimeOptions {
  tenantId?: string;
  onServiceCreated?: (payload: ServiceEventPayload) => void;
  onServiceUpdated?: (payload: ServiceEventPayload) => void;
  onServiceDeleted?: (payload: ServiceEventPayload) => void;
  onServiceReordered?: (payload: ServiceEventPayload) => void;
  onServiceVisibilityChanged?: (payload: ServiceEventPayload) => void;
  onAnyChange?: (payload: ServiceEventPayload) => void;
  enabled?: boolean;
}

interface UseServicesRealtimeReturn {
  isConnected: boolean;
  lastEvent: ServiceEventPayload | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useServicesRealtime = (options: UseServicesRealtimeOptions): UseServicesRealtimeReturn => {
  const {
    tenantId,
    onServiceCreated,
    onServiceUpdated,
    onServiceDeleted,
    onServiceReordered,
    onServiceVisibilityChanged,
    onAnyChange,
    enabled = true,
  } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<ServiceEventPayload | null>(null);

  const createPayload = useCallback((
    eventType: ServiceEventType,
    record: Record<string, unknown>,
    oldRecord?: Record<string, unknown>
  ): ServiceEventPayload => {
    const changes: ServiceEventPayload['changes'] = [];
    
    if (oldRecord) {
      // Detect changed fields - minimal payload
      const trackedFields = ['name', 'price', 'is_active', 'is_visible_to_customers', 'sort_order', 'category'];
      trackedFields.forEach(field => {
        if (record[field] !== oldRecord[field]) {
          changes.push({
            field,
            old_value: oldRecord[field],
            new_value: record[field],
          });
        }
      });
    }

    return {
      event: eventType,
      service_id: record.id as string,
      tenant_id: record.tenant_id as string | undefined,
      timestamp: new Date().toISOString(),
      changes: changes.length > 0 ? changes : undefined,
    };
  }, []);

  const handleServiceChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      let eventPayload: ServiceEventPayload;

      switch (payload.eventType) {
        case 'INSERT':
          eventPayload = createPayload('service.created', payload.new);
          onServiceCreated?.(eventPayload);
          break;

        case 'UPDATE': {
          const oldRecord = payload.old as Record<string, unknown>;
          const newRecord = payload.new as Record<string, unknown>;
          
          // Detect specific update types
          if (oldRecord.sort_order !== newRecord.sort_order) {
            eventPayload = createPayload('service.reordered', newRecord, oldRecord);
            onServiceReordered?.(eventPayload);
          } else if (oldRecord.is_visible_to_customers !== newRecord.is_visible_to_customers) {
            eventPayload = createPayload('service.visibility_changed', newRecord, oldRecord);
            onServiceVisibilityChanged?.(eventPayload);
          } else {
            eventPayload = createPayload('service.updated', newRecord, oldRecord);
            onServiceUpdated?.(eventPayload);
          }
          break;
        }

        case 'DELETE':
          eventPayload = createPayload('service.deleted', payload.old as Record<string, unknown>);
          onServiceDeleted?.(eventPayload);
          break;

        default:
          return;
      }

      setLastEvent(eventPayload);
      onAnyChange?.(eventPayload);
    },
    [createPayload, onServiceCreated, onServiceUpdated, onServiceDeleted, onServiceReordered, onServiceVisibilityChanged, onAnyChange]
  );

  const subscribe = useCallback(() => {
    if (!enabled) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create tenant-isolated channel name
    const channelName = tenantId 
      ? `services:tenant:${tenantId}` 
      : 'services:global';

    // Build filter for tenant isolation
    const filter = tenantId 
      ? `tenant_id=eq.${tenantId}` 
      : undefined;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
          ...(filter && { filter }),
        },
        handleServiceChange
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [enabled, tenantId, handleServiceChange]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return {
    isConnected,
    lastEvent,
    subscribe,
    unsubscribe,
  };
};
