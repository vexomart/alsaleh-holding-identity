/**
 * useUnifiedRealtime Hook - V3 Cross-Dashboard Sync
 * Unified real-time synchronization between Admin and Customer dashboards
 * Handles: Orders, Contracts, Wallets, Services, Notifications
 * With modern toast notifications
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// ============================================
// Types
// ============================================

export type SyncEventType =
  | 'order.created'
  | 'order.status_changed'
  | 'order.assigned'
  | 'contract.created'
  | 'contract.status_changed'
  | 'contract.signed'
  | 'wallet.balance_changed'
  | 'wallet.transaction'
  | 'service.updated'
  | 'service.created'
  | 'service.deleted'
  | 'notification.new'
  | 'user.profile_updated';

export interface SyncEvent {
  type: SyncEventType;
  table: string;
  record_id: string;
  user_id?: string;
  tenant_id?: string;
  timestamp: string;
  data: Record<string, unknown>;
  previous_data?: Record<string, unknown>;
}

interface UnifiedRealtimeOptions {
  userId?: string;
  tenantId?: string;
  role: 'admin' | 'customer';
  enabled?: boolean;
  onSyncEvent?: (event: SyncEvent) => void;
  showToasts?: boolean;
  tables?: Array<'orders' | 'contracts' | 'wallets' | 'services' | 'notifications' | 'profiles'>;
}

interface UnifiedRealtimeReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastEvent: SyncEvent | null;
  eventCount: number;
  reconnect: () => void;
}

// ============================================
// Toast Messages (Arabic & English)
// ============================================

const TOAST_MESSAGES: Record<SyncEventType, { ar: string; en: string; variant?: 'default' | 'destructive' }> = {
  'order.created': { ar: 'طلب جديد تم إنشاؤه', en: 'New order created' },
  'order.status_changed': { ar: 'تم تحديث حالة الطلب', en: 'Order status updated' },
  'order.assigned': { ar: 'تم تعيين الطلب', en: 'Order assigned' },
  'contract.created': { ar: 'عقد جديد تم إنشاؤه', en: 'New contract created' },
  'contract.status_changed': { ar: 'تم تحديث حالة العقد', en: 'Contract status updated' },
  'contract.signed': { ar: 'تم توقيع العقد', en: 'Contract signed' },
  'wallet.balance_changed': { ar: 'تم تحديث رصيد المحفظة', en: 'Wallet balance updated' },
  'wallet.transaction': { ar: 'معاملة مالية جديدة', en: 'New financial transaction' },
  'service.updated': { ar: 'تم تحديث الخدمة', en: 'Service updated' },
  'service.created': { ar: 'خدمة جديدة متاحة', en: 'New service available' },
  'service.deleted': { ar: 'تم حذف الخدمة', en: 'Service deleted' },
  'notification.new': { ar: 'إشعار جديد', en: 'New notification' },
  'user.profile_updated': { ar: 'تم تحديث الملف الشخصي', en: 'Profile updated' },
};

// ============================================
// Query Keys for Invalidation
// ============================================

const TABLE_QUERY_KEYS: Record<string, string[][]> = {
  orders: [['orders'], ['order'], ['admin-orders'], ['customer-orders'], ['dashboard-stats']],
  contracts: [['contracts'], ['contract'], ['admin-contracts'], ['customer-contracts']],
  customer_wallets: [['wallet'], ['customer-wallet'], ['wallets'], ['dashboard-stats']],
  financial_transactions: [['transactions'], ['customer-transactions'], ['wallet-transactions']],
  services: [['services'], ['services-by-category'], ['admin-services']],
  notifications: [['notifications'], ['unread-count']],
  profiles: [['profile'], ['user-profile'], ['admin-users']],
};

// ============================================
// Hook Implementation
// ============================================

export function useUnifiedRealtime(options: UnifiedRealtimeOptions): UnifiedRealtimeReturn {
  const {
    userId,
    tenantId,
    role,
    enabled = true,
    onSyncEvent,
    showToasts = true,
    tables = ['orders', 'contracts', 'wallets', 'services', 'notifications'],
  } = options;

  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastEvent, setLastEvent] = useState<SyncEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Determine which tables to subscribe to based on options
  const subscriptionTables = useMemo(() => {
    const tableMap: Record<string, string[]> = {
      orders: ['orders'],
      contracts: ['contracts'],
      wallets: ['customer_wallets', 'financial_transactions'],
      services: ['services'],
      notifications: ['notifications'],
      profiles: ['profiles'],
    };

    return tables.flatMap(t => tableMap[t] || []);
  }, [tables]);

  // Determine event type from table and event
  const getEventType = useCallback((
    table: string,
    eventType: string,
    newData: Record<string, unknown>,
    oldData?: Record<string, unknown>
  ): SyncEventType | null => {
    switch (table) {
      case 'orders':
        if (eventType === 'INSERT') return 'order.created';
        if (eventType === 'UPDATE') {
          if (oldData?.status !== newData.status) return 'order.status_changed';
          if (oldData?.assigned_to !== newData.assigned_to) return 'order.assigned';
        }
        return 'order.status_changed';

      case 'contracts':
        if (eventType === 'INSERT') return 'contract.created';
        if (eventType === 'UPDATE') {
          if (newData.status === 'signed' && oldData?.status !== 'signed') return 'contract.signed';
          return 'contract.status_changed';
        }
        return 'contract.status_changed';

      case 'customer_wallets':
        return 'wallet.balance_changed';

      case 'financial_transactions':
        return 'wallet.transaction';

      case 'services':
        if (eventType === 'INSERT') return 'service.created';
        if (eventType === 'DELETE') return 'service.deleted';
        return 'service.updated';

      case 'notifications':
        if (eventType === 'INSERT') return 'notification.new';
        return null;

      case 'profiles':
        return 'user.profile_updated';

      default:
        return null;
    }
  }, []);

  // Handle database changes
  const handleChange = useCallback((
    table: string,
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) => {
    const newData = (payload.new as Record<string, unknown>) || {};
    const oldData = (payload.old as Record<string, unknown>) || undefined;
    const eventType = getEventType(table, payload.eventType, newData, oldData);

    if (!eventType) return;

    const syncEvent: SyncEvent = {
      type: eventType,
      table,
      record_id: (newData.id || oldData?.id) as string,
      user_id: (newData.customer_user_id || newData.user_id || newData.customer_id) as string | undefined,
      tenant_id: newData.tenant_id as string | undefined,
      timestamp: new Date().toISOString(),
      data: newData,
      previous_data: oldData,
    };

    // Update state
    setLastEvent(syncEvent);
    setEventCount(prev => prev + 1);

    // Invalidate relevant queries
    const queryKeys = TABLE_QUERY_KEYS[table] || [];
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });

    // Show toast notification
    if (showToasts) {
      const message = TOAST_MESSAGES[eventType];
      if (message) {
        // Don't show toast for own actions (optional optimization)
        const recordUserId = syncEvent.user_id;
        const isOwnAction = recordUserId === userId;
        
        // For admin, show all events; for customer, only show relevant ones
        const shouldShow = role === 'admin' || !isOwnAction || eventType.includes('wallet');
        
        if (shouldShow) {
          toast({
            title: isRTL ? message.ar : message.en,
            variant: message.variant || 'default',
            duration: 3000,
          });
        }
      }
    }

    // Call custom handler
    onSyncEvent?.(syncEvent);
  }, [getEventType, queryClient, showToasts, isRTL, role, userId, onSyncEvent]);

  // Subscribe to realtime channels
  const subscribe = useCallback(() => {
    if (!enabled) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setConnectionStatus('connecting');

    // Create unique channel name
    const channelId = role === 'admin' 
      ? `admin-sync-${tenantId || 'global'}-${Date.now()}`
      : `customer-sync-${userId}-${Date.now()}`;

    const channel = supabase.channel(channelId, {
      config: {
        broadcast: { self: false },
        presence: { key: userId || 'anonymous' },
      },
    });

    // Add subscriptions for each table
    subscriptionTables.forEach(table => {
      // Build filter based on role
      let filter: string | undefined;
      
      if (role === 'customer' && userId) {
        // Customer: only their data
        if (table === 'orders') filter = `customer_id=eq.${userId}`;
        else if (table === 'contracts') filter = `customer_user_id=eq.${userId}`;
        else if (table === 'customer_wallets') filter = `customer_user_id=eq.${userId}`;
        else if (table === 'financial_transactions') filter = `customer_user_id=eq.${userId}`;
        else if (table === 'notifications') filter = `user_id=eq.${userId}`;
        else if (table === 'profiles') filter = `id=eq.${userId}`;
      } else if (role === 'admin' && tenantId) {
        // Admin: tenant-wide data
        filter = `tenant_id=eq.${tenantId}`;
      }

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => handleChange(table, payload)
      );
    });

    // Subscribe and handle status
    channel.subscribe((status, err) => {
      console.log(`[UnifiedRealtime] ${channelId} status:`, status, err);

      switch (status) {
        case 'SUBSCRIBED':
          setConnectionStatus('connected');
          reconnectAttemptsRef.current = 0;
          break;

        case 'CHANNEL_ERROR':
        case 'TIMED_OUT':
          setConnectionStatus('error');
          
          // Auto-reconnect with exponential backoff
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              subscribe();
            }, delay);
          }
          break;

        case 'CLOSED':
          setConnectionStatus('disconnected');
          break;
      }
    });

    channelRef.current = channel;
  }, [enabled, role, userId, tenantId, subscriptionTables, handleChange]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    subscribe();
  }, [subscribe]);

  // Effect: Subscribe on mount
  useEffect(() => {
    subscribe();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
  }, [subscribe]);

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    lastEvent,
    eventCount,
    reconnect,
  };
}

// ============================================
// Broadcast Utilities
// ============================================

/**
 * Broadcast a custom sync event to all connected clients
 */
export async function broadcastSyncEvent(
  tenantId: string | undefined,
  event: SyncEvent
): Promise<void> {
  const channelName = `sync-broadcast-${tenantId || 'global'}`;
  
  const channel = supabase.channel(channelName);
  await channel.subscribe();
  
  await channel.send({
    type: 'broadcast',
    event: 'sync',
    payload: event,
  });

  // Cleanup after sending
  setTimeout(() => {
    supabase.removeChannel(channel);
  }, 500);
}

/**
 * Force refresh all connected clients
 */
export async function broadcastForceRefresh(
  tenantId: string | undefined,
  tables: string[]
): Promise<void> {
  const event: SyncEvent = {
    type: 'service.updated', // Generic refresh trigger
    table: 'system',
    record_id: 'force-refresh',
    tenant_id: tenantId,
    timestamp: new Date().toISOString(),
    data: { tables, action: 'force_refresh' },
  };

  await broadcastSyncEvent(tenantId, event);
}
