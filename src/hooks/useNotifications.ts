/**
 * useNotifications Hook - Phase 0.5
 * Fetch, manage, and subscribe to notifications
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtime, type RealtimePayload } from './useRealtime';
import type { Notification, NotificationFilters } from '@/types/notifications';

interface UseNotificationsOptions {
  userId?: string;
  filters?: NotificationFilters;
  autoRefresh?: boolean;
  limit?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { userId, filters, autoRefresh = true, limit = 50 } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters?.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
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
  }, [userId, filters, limit]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (updateError) throw updateError;

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, [userId]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state
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

  // Handle realtime notification
  const handleNewNotification = useCallback((payload: RealtimePayload) => {
    const newNotification = payload.data as Notification;
    
    setNotifications(prev => [newNotification, ...prev].slice(0, limit));
    
    if (!newNotification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  }, [limit]);

  // Subscribe to realtime updates
  useRealtime({
    userId,
    onNotification: autoRefresh ? handleNewNotification : undefined,
    enabled: autoRefresh && !!userId,
  });

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
