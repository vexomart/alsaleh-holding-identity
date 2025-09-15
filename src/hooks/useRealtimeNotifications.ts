import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProjectNotification {
  id: string;
  project_id: string;
  recipient_email: string;
  notification_type: string;
  title: string;
  message?: string;
  is_read: boolean;
  sent_via_email: boolean;
  created_at: string;
}

interface UseRealtimeNotificationsProps {
  userId?: string;
  showToasts?: boolean;
}

export const useRealtimeNotifications = ({ 
  userId, 
  showToasts = true 
}: UseRealtimeNotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<ProjectNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('project_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // If userId is provided, filter by that user's email
      if (userId) {
        // We need to get the user's email first
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('user_id', userId)
          .single();
        
        if (profile?.email) {
          query = query.eq('recipient_email', profile.email);
        }
      } else {
        // For current user, use their email
        query = query.eq('recipient_email', user.email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('project_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      ));

      if (showToasts) {
        toast({
          title: "تم تحديث الإشعار",
          description: "تم وضع علامة مقروء على الإشعار",
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      if (showToasts) {
        toast({
          title: "خطأ في تحديث الإشعار",
          description: "حدث خطأ أثناء تحديث حالة الإشعار",
          variant: "destructive",
        });
      }
    }
  }, [showToasts]);

  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('project_notifications')
        .update({ is_read: true })
        .eq('recipient_email', user.email)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notification => 
        ({ ...notification, is_read: true })
      ));

      if (showToasts) {
        toast({
          title: "تم تحديث جميع الإشعارات",
          description: "تم وضع علامة مقروء على جميع الإشعارات",
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      if (showToasts) {
        toast({
          title: "خطأ في تحديث الإشعارات",
          description: "حدث خطأ أثناء تحديث الإشعارات",
          variant: "destructive",
        });
      }
    }
  }, [showToasts]);

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'project_started': return '🚀';
      case 'project_completed': return '✅';
      case 'phase_completed': return '✅';
      case 'status_change': return '🔄';
      case 'deadline_approaching': return '⏰';
      case 'issue_reported': return '⚠️';
      case 'payment_completed': return '💳';
      case 'invoice_generated': return '📄';
      default: return '🔔';
    }
  }, []);

  const handleRealtimeUpdate = useCallback(async (payload: any) => {
    console.log('🔔 Notification realtime update received:', payload);
    
    const eventType = payload.eventType;
    const newData = payload.new;
    
    if (eventType === 'INSERT') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && newData.recipient_email === user.email) {
        setNotifications(prev => [newData, ...prev]);
        
        if (showToasts) {
          toast({
            title: `${getNotificationIcon(newData.notification_type)} إشعار جديد`,
            description: newData.title,
          });
        }
      }
    } else if (eventType === 'UPDATE') {
      setNotifications(prev => prev.map(notification => 
        notification.id === newData.id ? newData : notification
      ));
    }
  }, [showToasts, getNotificationIcon]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    // Only set up realtime in secure contexts to avoid WebSocket errors
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('⚠️ Skipping realtime notifications (insecure context)');
      return;
    }

    console.log('🚀 Setting up realtime notifications subscription...');
    
    let channel: any;
    
    try {
      channel = supabase
        .channel('project-notifications-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_notifications'
          },
          handleRealtimeUpdate
        )
        .subscribe((status) => {
          console.log('📡 Realtime notifications subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to realtime notifications');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Error subscribing to realtime notifications');
          }
        });
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }

    return () => {
      if (channel) {
        try {
          console.log('🧹 Cleaning up realtime notifications subscription');
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error cleaning up realtime subscription:', error);
        }
      }
    };
  }, [handleRealtimeUpdate]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    getNotificationIcon
  };
};