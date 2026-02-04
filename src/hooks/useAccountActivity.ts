/**
 * Account Activity Hook
 * Tracks and retrieves user account activity
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActivityLog {
  id: string;
  activity_type: string;
  device_fingerprint: string | null;
  ip_address: unknown;
  user_agent: string | null;
  location: string | null;
  metadata: unknown;
  risk_level: string;
  created_at: string;
}

export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'password_change' 
  | 'device_added' 
  | 'device_removed' 
  | '2fa_enabled' 
  | '2fa_disabled'
  | 'profile_updated'
  | 'failed_login';

const activityLabels: Record<string, { ar: string; en: string; icon: string }> = {
  login: { ar: 'تسجيل دخول', en: 'Login', icon: '🔓' },
  logout: { ar: 'تسجيل خروج', en: 'Logout', icon: '🔒' },
  password_change: { ar: 'تغيير كلمة المرور', en: 'Password Change', icon: '🔑' },
  device_added: { ar: 'إضافة جهاز جديد', en: 'New Device Added', icon: '📱' },
  device_removed: { ar: 'إزالة جهاز', en: 'Device Removed', icon: '❌' },
  '2fa_enabled': { ar: 'تفعيل التحقق بخطوتين', en: '2FA Enabled', icon: '🛡️' },
  '2fa_disabled': { ar: 'إيقاف التحقق بخطوتين', en: '2FA Disabled', icon: '⚠️' },
  profile_updated: { ar: 'تحديث الملف الشخصي', en: 'Profile Updated', icon: '✏️' },
  failed_login: { ar: 'محاولة دخول فاشلة', en: 'Failed Login', icon: '🚫' }
};

export const getActivityLabel = (type: string, lang: 'ar' | 'en' = 'ar') => {
  return activityLabels[type]?.[lang] || type;
};

export const getActivityIcon = (type: string) => {
  return activityLabels[type]?.icon || '📝';
};

export const useAccountActivity = (limit = 50) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('account_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, limit]);

  const logActivity = useCallback(async (
    activityType: ActivityType,
    metadata?: Record<string, any>,
    riskLevel: 'low' | 'medium' | 'high' = 'low'
  ) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          user_agent: navigator.userAgent,
          metadata,
          risk_level: riskLevel
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    fetchActivities,
    logActivity,
    getActivityLabel,
    getActivityIcon
  };
};
