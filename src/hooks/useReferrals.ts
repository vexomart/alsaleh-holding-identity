/**
 * Referral System Hooks - Enterprise Grade
 * Real-time sync with database
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { 
  Referral, 
  ReferralEvent, 
  ReferralReward, 
  ReferralSettings,
  ReferralStats,
  ReferralStatus 
} from '@/types/referrals';

// Fetch user's referrals
export function useUserReferrals() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['referrals', 'user', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('referrals' as never)
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Referral[];
    },
    enabled: !!user?.id,
  });
}

// Fetch all referrals (admin)
export function useAllReferrals(filters?: {
  status?: ReferralStatus;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['referrals', 'admin', filters],
    queryFn: async () => {
      let query = supabase
        .from('referrals' as never)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Referral[];
    },
  });
}

// Fetch referral by ID
export function useReferral(id: string) {
  return useQuery({
    queryKey: ['referral', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals' as never)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as unknown as Referral;
    },
    enabled: !!id,
  });
}

// Fetch referral events (timeline)
export function useReferralEvents(referralId: string) {
  return useQuery({
    queryKey: ['referral-events', referralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_events' as never)
        .select('*')
        .eq('referral_id', referralId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as unknown as ReferralEvent[];
    },
    enabled: !!referralId,
  });
}

// Fetch user rewards
export function useUserRewards() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['referral-rewards', 'user', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('referral_rewards' as never)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as ReferralReward[];
    },
    enabled: !!user?.id,
  });
}

// Fetch all rewards (admin)
export function useAllRewards() {
  return useQuery({
    queryKey: ['referral-rewards', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_rewards' as never)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as ReferralReward[];
    },
  });
}

// Fetch referral settings
export function useReferralSettings() {
  return useQuery({
    queryKey: ['referral-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_settings' as never)
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as unknown as ReferralSettings | null;
    },
  });
}

// Calculate user stats
export function useReferralStats() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['referral-stats', user?.id],
    queryFn: async (): Promise<ReferralStats> => {
      if (!user?.id) {
        return {
          totalReferrals: 0,
          activeReferrals: 0,
          pendingRewards: 0,
          paidRewards: 0,
          totalEarnings: 0,
          conversionRate: 0,
        };
      }
      
      const { data: referrals, error: refError } = await supabase
        .from('referrals' as never)
        .select('status, reward_amount')
        .eq('referrer_user_id', user.id);
      
      if (refError) throw refError;
      
      const refs = referrals as unknown as Referral[];
      const totalReferrals = refs.length;
      const activeReferrals = refs.filter(r => 
        !['rejected', 'reward_paid'].includes(r.status)
      ).length;
      const qualifiedReferrals = refs.filter(r => 
        ['qualified', 'reward_paid'].includes(r.status)
      ).length;
      
      const { data: rewards, error: rewError } = await supabase
        .from('referral_rewards' as never)
        .select('amount, payout_status')
        .eq('user_id', user.id);
      
      if (rewError) throw rewError;
      
      const rews = rewards as unknown as ReferralReward[];
      const pendingRewards = rews
        .filter(r => r.payout_status === 'pending' || r.payout_status === 'approved')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      const paidRewards = rews
        .filter(r => r.payout_status === 'paid')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      
      return {
        totalReferrals,
        activeReferrals,
        pendingRewards,
        paidRewards,
        totalEarnings: pendingRewards + paidRewards,
        conversionRate: totalReferrals > 0 
          ? (qualifiedReferrals / totalReferrals) * 100 
          : 0,
      };
    },
    enabled: !!user?.id,
  });
}

// Generate referral link
export function useGenerateReferralLink() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Generate unique code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_referral_code', { user_id: user.id });
      
      if (codeError) throw codeError;
      
      const code = codeData as string;
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/ref/${code}`;
      
      // Create referral record
      const { data, error } = await supabase
        .from('referrals' as never)
        .insert({
          referrer_user_id: user.id,
          referral_code: code,
          referral_link: referralLink,
          status: 'new',
        } as never)
        .select()
        .single();
      
      if (error) throw error;
      return data as unknown as Referral;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      toast({
        title: 'تم إنشاء رابط الإحالة',
        description: 'يمكنك الآن مشاركة الرابط مع الآخرين',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Update referral status (admin)
export function useUpdateReferralStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      referralId, 
      newStatus,
      metadata = {} 
    }: { 
      referralId: string; 
      newStatus: ReferralStatus;
      metadata?: Record<string, unknown>;
    }) => {
      const { data, error } = await supabase
        .rpc('update_referral_status', {
          p_referral_id: referralId,
          p_new_status: newStatus,
          p_actor: 'admin',
          p_actor_user_id: user?.id,
          p_metadata: metadata as unknown,
        } as never);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['referral-events'] });
      toast({
        title: 'تم تحديث الحالة',
        description: 'تم تحديث حالة الإحالة بنجاح',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Approve/Pay reward (admin)
export function useProcessReward() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      rewardId, 
      action,
      notes,
    }: { 
      rewardId: string; 
      action: 'approve' | 'pay' | 'reject';
      notes?: string;
    }) => {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      
      if (action === 'approve') {
        updates.payout_status = 'approved';
        updates.approved_by = user?.id;
        updates.approved_at = new Date().toISOString();
      } else if (action === 'pay') {
        updates.payout_status = 'paid';
        updates.paid_at = new Date().toISOString();
      } else if (action === 'reject') {
        updates.payout_status = 'cancelled';
      }
      
      if (notes) updates.notes = notes;
      
      const { data, error } = await supabase
        .from('referral_rewards' as never)
        .update(updates as never)
        .eq('id', rewardId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      toast({
        title: 'تم تحديث المكافأة',
        description: 'تم معالجة المكافأة بنجاح',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Create reward for qualified referral (admin)
export function useCreateReward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      referralId, 
      userId,
      amount,
      currency = 'SAR',
    }: { 
      referralId: string; 
      userId: string;
      amount: number;
      currency?: string;
    }) => {
      const insertData = {
        referral_id: referralId,
        user_id: userId,
        amount,
        currency,
        payout_status: 'pending',
      };
      
      const { data, error } = await supabase
        .from('referral_rewards' as never)
        .insert(insertData as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] });
      toast({
        title: 'تم إنشاء المكافأة',
        description: 'تم إضافة المكافأة للعميل بنجاح',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
