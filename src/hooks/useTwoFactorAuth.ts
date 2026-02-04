/**
 * Two-Factor Authentication Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TwoFactorSettings {
  id: string;
  is_enabled: boolean;
  method: string;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useTwoFactorAuth = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('two_factor_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching 2FA settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const enable2FA = useCallback(async (method: 'email' | 'sms' = 'email') => {
    if (!user?.id) return false;

    try {
      if (settings) {
        const { error } = await supabase
          .from('two_factor_settings')
          .update({
            is_enabled: true,
            method,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('two_factor_settings')
          .insert({
            user_id: user.id,
            is_enabled: true,
            method
          });

        if (error) throw error;
      }

      // Log activity
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: '2fa_enabled',
          metadata: { method },
          risk_level: 'medium'
        });

      toast.success('تم تفعيل التحقق بخطوتين');
      fetchSettings();
      return true;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('فشل في تفعيل التحقق بخطوتين');
      return false;
    }
  }, [user?.id, settings, fetchSettings]);

  const disable2FA = useCallback(async () => {
    if (!user?.id || !settings) return false;

    try {
      const { error } = await supabase
        .from('two_factor_settings')
        .update({
          is_enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log activity
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: '2fa_disabled',
          risk_level: 'high'
        });

      toast.success('تم إيقاف التحقق بخطوتين');
      fetchSettings();
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('فشل في إيقاف التحقق بخطوتين');
      return false;
    }
  }, [user?.id, settings, fetchSettings]);

  const updateMethod = useCallback(async (method: 'email' | 'sms' | 'authenticator') => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('two_factor_settings')
        .update({
          method,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('تم تحديث طريقة التحقق');
      fetchSettings();
      return true;
    } catch (error) {
      console.error('Error updating 2FA method:', error);
      toast.error('فشل في تحديث طريقة التحقق');
      return false;
    }
  }, [user?.id, fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    is2FAEnabled: settings?.is_enabled || false,
    method: settings?.method || 'email',
    enable2FA,
    disable2FA,
    updateMethod,
    fetchSettings
  };
};
