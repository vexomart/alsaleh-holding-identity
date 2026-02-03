/**
 * Referrals Real-time Hook
 * Live sync between Admin and Customer dashboards
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { REFERRAL_STATUS_LABELS } from '@/types/referrals';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface ReferralPayload {
  id: string;
  referrer_user_id: string;
  referred_user_id: string | null;
  status: string;
  reward_amount: number;
  [key: string]: unknown;
}

export function useReferralsRealtime(options?: {
  showToasts?: boolean;
  isAdmin?: boolean;
}) {
  const { showToasts = true, isAdmin = false } = options || {};
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleReferralChange = useCallback(
    (payload: RealtimePostgresChangesPayload<ReferralPayload>) => {
      const newRecord = payload.new as ReferralPayload;
      const oldRecord = payload.old as ReferralPayload;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] });
      
      if (newRecord?.id) {
        queryClient.invalidateQueries({ queryKey: ['referral', newRecord.id] });
      }

      if (!showToasts) return;

      // Show toast for status changes
      if (payload.eventType === 'UPDATE' && oldRecord?.status !== newRecord?.status) {
        const statusLabel = REFERRAL_STATUS_LABELS[newRecord.status as keyof typeof REFERRAL_STATUS_LABELS] || newRecord.status;
        
        if (isAdmin) {
          toast({
            title: 'تحديث حالة الإحالة',
            description: `تم تغيير الحالة إلى: ${statusLabel}`,
          });
        } else if (newRecord.referrer_user_id === user?.id) {
          toast({
            title: '🎉 تحديث على إحالتك',
            description: `الحالة الجديدة: ${statusLabel}`,
          });
        }
      }

      // New referral notification
      if (payload.eventType === 'INSERT') {
        if (isAdmin) {
          toast({
            title: 'إحالة جديدة',
            description: 'تم تسجيل إحالة جديدة في النظام',
          });
        } else if (newRecord?.referrer_user_id === user?.id) {
          toast({
            title: '🎊 إحالة جديدة!',
            description: 'تم تسجيل شخص عبر رابط الإحالة الخاص بك',
          });
        }
      }
    },
    [queryClient, showToasts, isAdmin, user?.id]
  );

  const handleRewardChange = useCallback(
    (payload: RealtimePostgresChangesPayload<{ user_id: string; payout_status: string; amount: number }>) => {
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] });

      if (!showToasts) return;

      const newRecord = payload.new as { user_id: string; payout_status: string; amount: number };
      
      if (payload.eventType === 'UPDATE' && newRecord?.user_id === user?.id) {
        if (newRecord.payout_status === 'approved') {
          toast({
            title: '✅ تمت الموافقة على مكافأتك',
            description: `مكافأة بقيمة ${newRecord.amount} ر.س بانتظار الصرف`,
          });
        } else if (newRecord.payout_status === 'paid') {
          toast({
            title: '💰 تم صرف مكافأتك!',
            description: `تم إيداع ${newRecord.amount} ر.س في حسابك`,
          });
        }
      }
    },
    [queryClient, showToasts, user?.id]
  );

  const handleEventChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['referral-events'] });
  }, [queryClient]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to referrals changes
    const referralsChannel = supabase
      .channel('referrals-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'referrals',
        },
        handleReferralChange as never
      )
      .subscribe();

    // Subscribe to rewards changes
    const rewardsChannel = supabase
      .channel('referral-rewards-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'referral_rewards',
        },
        handleRewardChange as never
      )
      .subscribe();

    // Subscribe to events changes
    const eventsChannel = supabase
      .channel('referral-events-realtime')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'referral_events',
        },
        handleEventChange as never
      )
      .subscribe();

    return () => {
      supabase.removeChannel(referralsChannel);
      supabase.removeChannel(rewardsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [user?.id, handleReferralChange, handleRewardChange, handleEventChange]);
}

// Broadcast event for cross-dashboard sync
export async function broadcastReferralEvent(
  eventType: 'status_changed' | 'reward_created' | 'reward_paid',
  payload: Record<string, unknown>
) {
  const channel = supabase.channel('referral-broadcast');
  
  await channel.send({
    type: 'broadcast',
    event: eventType,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  });
}
