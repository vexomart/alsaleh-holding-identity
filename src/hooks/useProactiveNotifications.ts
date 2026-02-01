/**
 * useProactiveNotifications Hook
 * Enterprise-grade notification management with realtime support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Notification, 
  NotificationFilters, 
  NotificationSeverity,
  NotificationRoleTarget 
} from '@/types/notifications';
import { toast } from '@/hooks/use-toast';

interface UseProactiveNotificationsOptions {
  userId?: string;
  tenantId?: string;
  roleTarget?: NotificationRoleTarget;
  filters?: NotificationFilters;
  limit?: number;
  enableRealtime?: boolean;
  showToasts?: boolean;
}

interface UseProactiveNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useProactiveNotifications = (
  options: UseProactiveNotificationsOptions = {}
): UseProactiveNotificationsReturn => {
  const {
    userId,
    tenantId,
    roleTarget = 'customer',
    filters,
    limit = 50,
    enableRealtime = true,
    showToasts = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId && roleTarget === 'customer') {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Apply filters based on role
      if (roleTarget === 'customer' && userId) {
        query = query.eq('user_id', userId);
      } else if (roleTarget === 'admin' && tenantId) {
        query = query.or(`role_target.eq.admin,role_target.eq.all`);
        query = query.eq('tenant_id', tenantId);
      }

      if (filters?.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
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
  }, [userId, tenantId, roleTarget, filters, limit]);

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
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!userId && roleTarget === 'customer') return;

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
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, [userId, roleTarget]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotifications(prev => {
        const deleted = prev.find(n => n.id === id);
        if (deleted && !deleted.is_read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n.id !== id);
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, []);

  // Handle new notification from realtime
  const handleNewNotification = useCallback(
    (payload: { new: Notification }) => {
      const newNotif = payload.new;
      
      // Check if this notification is for us
      if (roleTarget === 'customer' && newNotif.user_id !== userId) {
        return;
      }
      
      if (roleTarget === 'admin' && newNotif.role_target === 'customer') {
        return;
      }

      setNotifications(prev => {
        // Prevent duplicates
        if (prev.some(n => n.id === newNotif.id)) {
          return prev;
        }
        return [newNotif, ...prev].slice(0, limit);
      });

      if (!newNotif.is_read) {
        setUnreadCount(prev => prev + 1);
      }

      // Show toast for new notifications
      if (showToasts && !newNotif.is_read) {
        const isArabic = document.documentElement.lang === 'ar';
        const title = isArabic ? newNotif.title_ar || newNotif.title : newNotif.title;
        const description = isArabic 
          ? newNotif.body_ar || newNotif.message_ar || newNotif.message 
          : newNotif.body_en || newNotif.message;

        toast({
          title: `🔔 ${title}`,
          description: description || undefined,
          variant: newNotif.severity === 'critical' ? 'destructive' : 'default',
        });
      }
    },
    [userId, roleTarget, limit, showToasts]
  );

  // Setup realtime subscription
  useEffect(() => {
    if (!enableRealtime) return;

    const channelName = userId 
      ? `notifications:user:${userId}`
      : tenantId 
        ? `notifications:tenant:${tenantId}`
        : 'notifications:global';

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          ...(userId && { filter: `user_id=eq.${userId}` }),
        },
        handleNewNotification
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to notifications realtime');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [userId, tenantId, enableRealtime, handleNewNotification]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
