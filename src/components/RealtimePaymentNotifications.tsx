import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard,
  X,
  Eye
} from 'lucide-react';

interface PaymentNotification {
  id: string;
  transaction_id: string;
  amount: number;
  status: string;
  payment_method: string;
  customer_name: string;
  created_at: string;
  is_read: boolean;
}

interface RealtimePaymentNotificationsProps {
  userId?: string;
  className?: string;
}

export default function RealtimePaymentNotifications({ 
  userId, 
  className = "" 
}: RealtimePaymentNotificationsProps) {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscription();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('id, transaction_id, amount, status, payment_method, customer_name, created_at')
        .eq('user_id', userId || user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const notificationsData: PaymentNotification[] = (data || []).map(payment => ({
        ...payment,
        is_read: false // You can track this in a separate table if needed
      }));

      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('payment-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        (payload) => {
          console.log('Payment notification received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification: PaymentNotification = {
              id: payload.new.id,
              transaction_id: payload.new.transaction_id,
              amount: payload.new.amount,
              status: payload.new.status,
              payment_method: payload.new.payment_method,
              customer_name: payload.new.customer_name,
              created_at: payload.new.created_at,
              is_read: false
            };

            setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
            setUnreadCount(prev => prev + 1);

            // Show toast notification
            toast({
              title: "💳 معاملة دفع جديدة",
              description: `تم إنشاء معاملة بقيمة ${payload.new.amount} ر.س`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === payload.new.id 
                  ? { ...notif, status: payload.new.status }
                  : notif
              )
            );

            // Show status update notification
            const statusText = getStatusText(payload.new.status);
            const isSuccess = ['completed', 'success', 'paid'].includes(payload.new.status?.toLowerCase());
            const isFailed = ['failed', 'rejected', 'cancelled'].includes(payload.new.status?.toLowerCase());

            toast({
              title: isSuccess ? "✅ تم تأكيد الدفع" : isFailed ? "❌ فشل في الدفع" : "🔄 تحديث المعاملة",
              description: `تم تغيير حالة المعاملة إلى ${statusText}`,
              variant: isFailed ? "destructive" : "default",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'مكتملة';
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'failed':
        return 'فاشلة';
      case 'rejected':
        return 'مرفوضة';
      case 'cancelled':
        return 'ملغية';
      default:
        return status || 'غير محدد';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-96 max-h-96 overflow-hidden shadow-2xl border-2 z-50">
          <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary-variant/5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                إشعارات المدفوعات
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    تعيين الكل كمقروء
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/30 transition-colors ${
                      !notification.is_read ? 'bg-primary/5 border-r-4 border-primary' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(notification.status)}
                          <span className="font-semibold text-sm">
                            {notification.transaction_id}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(notification.status)}`}>
                            {getStatusText(notification.status)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div>المبلغ: {notification.amount.toLocaleString()} ر.س</div>
                          <div>العميل: {notification.customer_name}</div>
                          <div className="text-xs">
                            {new Date(notification.created_at).toLocaleString('ar-SA')}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد إشعارات</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}