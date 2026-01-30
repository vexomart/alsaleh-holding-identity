/**
 * useInvoicesRealtime Hook
 * Real-time synchronization for invoices
 * Note: Requires 'invoices' table - currently uses orders with invoice metadata
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { InvoiceEventPayload, InvoiceEventType } from '@/types/realtime-events';

interface UseInvoicesRealtimeOptions {
  tenantId?: string;
  customerId?: string;
  onInvoiceGenerated?: (payload: InvoiceEventPayload) => void;
  onInvoiceStatusChanged?: (payload: InvoiceEventPayload) => void;
  onInvoicePaid?: (payload: InvoiceEventPayload) => void;
  onInvoiceCancelled?: (payload: InvoiceEventPayload) => void;
  onAnyChange?: (payload: InvoiceEventPayload) => void;
  enabled?: boolean;
}

interface UseInvoicesRealtimeReturn {
  isConnected: boolean;
  lastEvent: InvoiceEventPayload | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

// Invoice status constants
const INVOICE_STATUSES = {
  GENERATED: 'invoice_generated',
  SENT: 'invoice_sent',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

export const useInvoicesRealtime = (options: UseInvoicesRealtimeOptions): UseInvoicesRealtimeReturn => {
  const {
    tenantId,
    customerId,
    onInvoiceGenerated,
    onInvoiceStatusChanged,
    onInvoicePaid,
    onInvoiceCancelled,
    onAnyChange,
    enabled = true,
  } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<InvoiceEventPayload | null>(null);

  const createPayload = useCallback((
    eventType: InvoiceEventType,
    record: Record<string, unknown>,
    oldRecord?: Record<string, unknown>
  ): InvoiceEventPayload => {
    return {
      event: eventType,
      invoice_id: record.id as string,
      order_id: record.id as string, // Using order as invoice proxy
      customer_id: record.customer_id as string,
      tenant_id: record.tenant_id as string | undefined,
      timestamp: new Date().toISOString(),
      status: record.status as string,
      previous_status: oldRecord?.status as string | undefined,
      amount: record.total_amount as number | undefined,
    };
  }, []);

  const determineEventType = useCallback((
    newRecord: Record<string, unknown>,
    oldRecord?: Record<string, unknown>
  ): InvoiceEventType | null => {
    const newStatus = newRecord.status as string;
    const oldStatus = oldRecord?.status as string;
    const metadata = newRecord.metadata as Record<string, unknown> | undefined;

    // Check if invoice was just generated (metadata flag)
    if (metadata?.invoice_generated && !((oldRecord?.metadata as Record<string, unknown>)?.invoice_generated)) {
      return 'invoice.generated';
    }

    // Check status transitions
    if (newStatus === 'completed' && oldStatus !== 'completed') {
      return 'invoice.paid';
    }

    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      return 'invoice.cancelled';
    }

    // Generic status change
    if (oldStatus && newStatus !== oldStatus) {
      return 'invoice.status_changed';
    }

    return null;
  }, []);

  const handleOrderChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      // Only handle updates that relate to invoices
      if (payload.eventType !== 'UPDATE') return;

      const oldRecord = payload.old as Record<string, unknown>;
      const newRecord = payload.new as Record<string, unknown>;

      const eventType = determineEventType(newRecord, oldRecord);
      if (!eventType) return;

      const eventPayload = createPayload(eventType, newRecord, oldRecord);

      switch (eventType) {
        case 'invoice.generated':
          onInvoiceGenerated?.(eventPayload);
          break;
        case 'invoice.status_changed':
          onInvoiceStatusChanged?.(eventPayload);
          break;
        case 'invoice.paid':
          onInvoicePaid?.(eventPayload);
          break;
        case 'invoice.cancelled':
          onInvoiceCancelled?.(eventPayload);
          break;
      }

      setLastEvent(eventPayload);
      onAnyChange?.(eventPayload);
    },
    [createPayload, determineEventType, onInvoiceGenerated, onInvoiceStatusChanged, onInvoicePaid, onInvoiceCancelled, onAnyChange]
  );

  const subscribe = useCallback(() => {
    if (!enabled) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create tenant/customer isolated channel
    let channelName = 'invoices';
    let filter: string | undefined;

    if (customerId) {
      channelName = `invoices:customer:${customerId}`;
      filter = `customer_id=eq.${customerId}`;
    } else if (tenantId) {
      channelName = `invoices:tenant:${tenantId}`;
      filter = `tenant_id=eq.${tenantId}`;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders', // Using orders table for invoice events
          ...(filter && { filter }),
        },
        handleOrderChange
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [enabled, tenantId, customerId, handleOrderChange]);

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
