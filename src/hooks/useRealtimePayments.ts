import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseRealtimePaymentsProps {
  onUpdate?: () => void;
  userId?: string;
  showNotifications?: boolean;
}

export const useRealtimePayments = ({ 
  onUpdate, 
  userId, 
  showNotifications = true 
}: UseRealtimePaymentsProps) => {
  
  const getStatusText = useCallback((status: string) => {
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
      case 'refunded': 
        return 'مسترد';
      default: 
        return status || 'غير محدد';
    }
  }, []);

  const handlePaymentUpdate = useCallback((payload: any) => {
    console.log('🔄 Payment realtime update received:', payload);
    
    const eventType = payload.eventType;
    const newData = payload.new;
    const oldData = payload.old;
    
    // If userId is provided, only show notifications for this user's payments
    if (userId && newData?.user_id !== userId) {
      return;
    }
    
    if (showNotifications) {
      if (eventType === 'INSERT') {
        toast({
          title: "💳 معاملة جديدة",
          description: `تم إضافة معاملة جديدة بقيمة ${newData?.amount} ر.س`,
        });
      } else if (eventType === 'UPDATE') {
        const statusChanged = oldData?.status !== newData?.status;
        if (statusChanged) {
          const isSuccess = ['completed', 'success', 'paid'].includes(newData?.status?.toLowerCase());
          const isFailed = ['failed', 'rejected', 'cancelled'].includes(newData?.status?.toLowerCase());
          
          toast({
            title: isSuccess ? "✅ تم تأكيد الدفع" : isFailed ? "❌ فشل في الدفع" : "🔄 تحديث المعاملة",
            description: `تم تغيير حالة المعاملة إلى ${getStatusText(newData?.status)}`,
            variant: isFailed ? "destructive" : "default",
          });
        }
      }
    }
    
    // Call the update callback
    onUpdate?.();
  }, [userId, showNotifications, getStatusText, onUpdate]);

  const handleWalletUpdate = useCallback((payload: any) => {
    console.log('💰 Wallet realtime update received:', payload);
    
    const eventType = payload.eventType;
    const newData = payload.new;
    const oldData = payload.old;
    
    // If userId is provided, only show notifications for this user's transactions
    if (userId && newData?.user_id !== userId) {
      return;
    }
    
    if (showNotifications) {
      if (eventType === 'INSERT') {
        toast({
          title: "💰 معاملة محفظة جديدة",
          description: `تم إضافة معاملة محفظة بقيمة ${newData?.amount} ر.س`,
        });
      } else if (eventType === 'UPDATE') {
        const statusChanged = oldData?.status !== newData?.status;
        if (statusChanged) {
          const isSuccess = ['completed', 'success', 'paid'].includes(newData?.status?.toLowerCase());
          const isFailed = ['failed', 'rejected', 'cancelled'].includes(newData?.status?.toLowerCase());
          
          toast({
            title: isSuccess ? "✅ تم تأكيد معاملة المحفظة" : isFailed ? "❌ فشل في معاملة المحفظة" : "🔄 تحديث المحفظة",
            description: `تم تغيير حالة معاملة المحفظة إلى ${getStatusText(newData?.status)}`,
            variant: isFailed ? "destructive" : "default",
          });
        }
      }
    }
    
    // Call the update callback
    onUpdate?.();
  }, [userId, showNotifications, getStatusText, onUpdate]);

  useEffect(() => {
    console.log('🚀 Setting up realtime payments subscription...');
    
    const channelName = userId ? `user-${userId}-payments` : 'global-payments-updates';
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions'
        },
        handlePaymentUpdate
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions'
        },
        handleWalletUpdate
      )
      .subscribe((status) => {
        console.log(`📡 Realtime subscription status for ${channelName}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime payments updates');
          if (showNotifications) {
            toast({
              title: "🔄 التحديثات الفورية مفعلة",
              description: "سيتم تحديث المعاملات فوريًا",
            });
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to realtime payments');
          if (showNotifications) {
            toast({
              title: "خطأ في التحديثات الفورية",
              description: "فشل في تفعيل التحديثات الفورية",
              variant: "destructive",
            });
          }
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up realtime payments subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, showNotifications, handlePaymentUpdate, handleWalletUpdate]);

  return {
    // Return any utility functions if needed
    getStatusText,
  };
};