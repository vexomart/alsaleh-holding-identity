/**
 * Enhanced Two-Factor Authentication Hook
 * With email verification and real-time updates
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

export interface VerificationState {
  isSending: boolean;
  isVerifying: boolean;
  codeSent: boolean;
  expiresAt: Date | null;
  attemptsLeft: number;
}

export const useTwoFactorAuth = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    isSending: false,
    isVerifying: false,
    codeSent: false,
    expiresAt: null,
    attemptsLeft: 3
  });

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

  // Real-time subscription for 2FA settings
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`2fa_settings_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'two_factor_settings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('2FA settings changed:', payload);
          if (payload.eventType === 'DELETE') {
            setSettings(null);
          } else {
            setSettings(payload.new as TwoFactorSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Send verification code via email
  const sendVerificationCode = useCallback(async (
    deviceFingerprint: string,
    purpose: 'device_verification' | '2fa_login' | 'security_action' = '2fa_login'
  ) => {
    if (!user?.id || !user?.email) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    setVerificationState(prev => ({ ...prev, isSending: true }));

    try {
      const { data, error } = await supabase.functions.invoke('send-device-otp', {
        body: {
          email: user.email,
          userId: user.id,
          deviceFingerprint,
          purpose,
          userName: user.user_metadata?.full_name
        }
      });

      if (error) throw error;

      setVerificationState(prev => ({
        ...prev,
        isSending: false,
        codeSent: true,
        expiresAt: new Date(data.expiresAt),
        attemptsLeft: 3
      }));

      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      setVerificationState(prev => ({ ...prev, isSending: false }));
      toast.error('فشل في إرسال رمز التحقق');
      return false;
    }
  }, [user?.id, user?.email, user?.user_metadata?.full_name]);

  // Verify the code
  const verifyCode = useCallback(async (code: string, deviceFingerprint: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setVerificationState(prev => ({ ...prev, isVerifying: true }));

    try {
      // Get the verification code from database
      const { data: codeData, error: fetchError } = await supabase
        .from('device_verification_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_fingerprint', deviceFingerprint)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!codeData) {
        setVerificationState(prev => ({
          ...prev,
          isVerifying: false,
          attemptsLeft: prev.attemptsLeft - 1
        }));
        return { success: false, error: 'الرمز منتهي الصلاحية أو غير موجود' };
      }

      if (codeData.code !== code) {
        setVerificationState(prev => ({
          ...prev,
          isVerifying: false,
          attemptsLeft: prev.attemptsLeft - 1
        }));
        
        if (verificationState.attemptsLeft <= 1) {
          // Mark code as used after too many attempts
          await supabase
            .from('device_verification_codes')
            .update({ used: true, used_at: new Date().toISOString() })
            .eq('id', codeData.id);
          
          return { success: false, error: 'تم تجاوز عدد المحاولات المسموحة' };
        }
        
        return { success: false, error: 'رمز التحقق غير صحيح' };
      }

      // Mark code as used
      await supabase
        .from('device_verification_codes')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', codeData.id);

      // Update 2FA last verified timestamp
      if (settings) {
        await supabase
          .from('two_factor_settings')
          .update({ last_verified_at: new Date().toISOString() })
          .eq('user_id', user.id);
      }

      // Log successful verification
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: 'verification_success',
          device_fingerprint: deviceFingerprint,
          risk_level: 'low'
        });

      setVerificationState({
        isSending: false,
        isVerifying: false,
        codeSent: false,
        expiresAt: null,
        attemptsLeft: 3
      });

      toast.success('تم التحقق بنجاح');
      return { success: true };
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationState(prev => ({ ...prev, isVerifying: false }));
      return { success: false, error: 'حدث خطأ أثناء التحقق' };
    }
  }, [user?.id, settings, verificationState.attemptsLeft]);

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

  const resetVerificationState = useCallback(() => {
    setVerificationState({
      isSending: false,
      isVerifying: false,
      codeSent: false,
      expiresAt: null,
      attemptsLeft: 3
    });
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    is2FAEnabled: settings?.is_enabled || false,
    method: settings?.method || 'email',
    verificationState,
    enable2FA,
    disable2FA,
    updateMethod,
    sendVerificationCode,
    verifyCode,
    resetVerificationState,
    fetchSettings
  };
};
