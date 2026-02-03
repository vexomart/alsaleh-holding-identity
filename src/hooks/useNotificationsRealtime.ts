/**
 * useNotificationsRealtime Hook
 * Full bidirectional realtime notifications between Admin & Customers
 * Supports broadcast channels for instant delivery
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Notification, NotificationRoleTarget, NotificationSeverity, NotificationType } from '@/types/notifications';
import { toast } from '@/hooks/use-toast';

// Broadcast event types
export type NotificationBroadcastEvent = 
  | 'notification.new'
  | 'notification.read'
  | 'notification.deleted'
  | 'notification.bulk_read';

export interface NotificationBroadcastPayload {
  event: NotificationBroadcastEvent;
  notification?: Notification;
  notification_id?: string;
  user_id?: string;
  timestamp: string;
}

interface UseNotificationsRealtimeOptions {
  userId?: string;
  tenantId?: string;
  roleTarget: NotificationRoleTarget;
  limit?: number;
  showToasts?: boolean;
}

interface UseNotificationsRealtimeReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (notification: CreateNotificationInput) => Promise<Notification | null>;
  broadcastNotification: (notification: Notification) => void;
}

interface CreateNotificationInput {
  user_id?: string;
  tenant_id?: string;
  type: NotificationType;
  severity?: NotificationSeverity;
  role_target?: NotificationRoleTarget;
  title: string;
  title_ar?: string;
  message?: string;
  message_ar?: string;
  body_ar?: string;
  body_en?: string;
  link?: string;
  source_type?: string;
  source_id?: string;
}

export const useNotificationsRealtime = (
  options: UseNotificationsRealtimeOptions
): UseNotificationsRealtimeReturn => {
  const {
    userId,
    tenantId,
    roleTarget,
    limit = 100,
    showToasts = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const dbChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const broadcastChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Filter based on role
      if (roleTarget === 'customer' && userId) {
        query = query.eq('user_id', userId);
      } else if (roleTarget === 'admin') {
        // Admin sees all notifications or those targeted to admin/all
        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      const fetchedNotifications = (data || []) as Notification[];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, tenantId, roleTarget, limit]);

  // Mark as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Broadcast read event
      broadcastChannelRef.current?.send({
        type: 'broadcast',
        event: 'notification_event',
        payload: {
          event: 'notification.read',
          notification_id: id,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false);

      if (roleTarget === 'customer' && userId) {
        query = query.eq('user_id', userId);
      }

      const { error: updateError } = await query;

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);

      // Broadcast bulk read
      broadcastChannelRef.current?.send({
        type: 'broadcast',
        event: 'notification_event',
        payload: {
          event: 'notification.bulk_read',
          user_id: userId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Error marking all as read:', err);
      throw err;
    }
  }, [userId, roleTarget]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id);
      
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Broadcast delete
      broadcastChannelRef.current?.send({
        type: 'broadcast',
        event: 'notification_event',
        payload: {
          event: 'notification.deleted',
          notification_id: id,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, [notifications]);

  // Send notification (Admin only)
  const sendNotification = useCallback(async (input: CreateNotificationInput): Promise<Notification | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from('notifications')
        .insert({
          ...input,
          tenant_id: tenantId,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newNotification = data as Notification;

      // Add to local state if we're admin
      if (roleTarget === 'admin') {
        setNotifications(prev => [newNotification, ...prev].slice(0, limit));
      }

      // Broadcast new notification
      broadcastChannelRef.current?.send({
        type: 'broadcast',
        event: 'notification_event',
        payload: {
          event: 'notification.new',
          notification: newNotification,
          timestamp: new Date().toISOString(),
        },
      });

      return newNotification;
    } catch (err) {
      console.error('Error sending notification:', err);
      throw err;
    }
  }, [tenantId, roleTarget, limit]);

  // Broadcast notification (for manual broadcast)
  const broadcastNotification = useCallback((notification: Notification) => {
    broadcastChannelRef.current?.send({
      type: 'broadcast',
      event: 'notification_event',
      payload: {
        event: 'notification.new',
        notification,
        timestamp: new Date().toISOString(),
      },
    });
  }, []);

  // Handle incoming broadcast
  const handleBroadcast = useCallback((payload: { payload: NotificationBroadcastPayload }) => {
    const { event, notification, notification_id } = payload.payload;

    switch (event) {
      case 'notification.new':
        if (notification) {
          // Check if this notification is for us
          const isForMe = 
            (roleTarget === 'customer' && notification.user_id === userId) ||
            (roleTarget === 'admin' && (notification.role_target === 'admin' || notification.role_target === 'all'));

          if (isForMe) {
            setNotifications(prev => {
              if (prev.some(n => n.id === notification.id)) return prev;
              return [notification, ...prev].slice(0, limit);
            });

            if (!notification.is_read) {
              setUnreadCount(prev => prev + 1);
            }

            // Show toast
            if (showToasts) {
              const isArabic = document.documentElement.lang === 'ar';
              toast({
                title: `🔔 ${isArabic ? notification.title_ar || notification.title : notification.title}`,
                description: isArabic ? notification.body_ar || notification.message_ar || notification.message : notification.body_en || notification.message,
                variant: notification.severity === 'critical' ? 'destructive' : 'default',
              });
            }
          }
        }
        break;

      case 'notification.read':
        if (notification_id) {
          setNotifications(prev => 
            prev.map(n => n.id === notification_id ? { ...n, is_read: true } : n)
          );
        }
        break;

      case 'notification.deleted':
        if (notification_id) {
          setNotifications(prev => prev.filter(n => n.id !== notification_id));
        }
        break;
    }
  }, [userId, roleTarget, limit, showToasts]);

  // Handle postgres changes
  const handlePostgresChange = useCallback((payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newNotif = payload.new as Notification;
      
      // Check if for us
      const isForMe = 
        (roleTarget === 'customer' && newNotif.user_id === userId) ||
        (roleTarget === 'admin' && (newNotif.role_target === 'admin' || newNotif.role_target === 'all' || !newNotif.role_target));

      if (isForMe) {
        setNotifications(prev => {
          if (prev.some(n => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev].slice(0, limit);
        });

        if (!newNotif.is_read) {
          setUnreadCount(prev => prev + 1);
        }

        if (showToasts) {
          const isArabic = document.documentElement.lang === 'ar';
          toast({
            title: `🔔 ${isArabic ? newNotif.title_ar || newNotif.title : newNotif.title}`,
            description: isArabic ? newNotif.body_ar || newNotif.message_ar : newNotif.body_en || newNotif.message,
            variant: newNotif.severity === 'critical' ? 'destructive' : 'default',
          });
        }
      }
    } else if (payload.eventType === 'UPDATE') {
      const updated = payload.new as Notification;
      setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
    } else if (payload.eventType === 'DELETE') {
      const deleted = payload.old as { id: string };
      setNotifications(prev => prev.filter(n => n.id !== deleted.id));
    }
  }, [userId, roleTarget, limit, showToasts]);

  // Setup realtime subscriptions
  useEffect(() => {
    setConnectionStatus('connecting');

    // Channel name based on context
    const channelId = userId ? `notif_${userId}` : tenantId ? `notif_tenant_${tenantId}` : 'notif_global';

    // Database changes channel
    const dbChannel = supabase
      .channel(`db_${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          ...(roleTarget === 'customer' && userId ? { filter: `user_id=eq.${userId}` } : {}),
        },
        handlePostgresChange
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ DB notifications channel connected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
        }
      });

    dbChannelRef.current = dbChannel;

    // Broadcast channel for instant delivery
    const broadcastChannel = supabase
      .channel(`broadcast_${channelId}`)
      .on('broadcast', { event: 'notification_event' }, handleBroadcast)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          console.log('✅ Broadcast notifications channel connected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
        }
      });

    broadcastChannelRef.current = broadcastChannel;

    return () => {
      if (dbChannelRef.current) {
        supabase.removeChannel(dbChannelRef.current);
        dbChannelRef.current = null;
      }
      if (broadcastChannelRef.current) {
        supabase.removeChannel(broadcastChannelRef.current);
        broadcastChannelRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
  }, [userId, tenantId, roleTarget, handlePostgresChange, handleBroadcast]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    broadcastNotification,
  };
};

// Utility function to broadcast notification from anywhere
export const broadcastNotificationEvent = async (
  notification: Notification | CreateNotificationInput,
  channelId: string = 'global'
) => {
  const channel = supabase.channel(`broadcast_notif_${channelId}`);
  
  await channel.subscribe();
  
  channel.send({
    type: 'broadcast',
    event: 'notification_event',
    payload: {
      event: 'notification.new',
      notification,
      timestamp: new Date().toISOString(),
    },
  });

  setTimeout(() => {
    supabase.removeChannel(channel);
  }, 1000);
};
