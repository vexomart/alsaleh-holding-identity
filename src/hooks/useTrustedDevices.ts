/**
 * Trusted Devices Hook
 * Manages user's trusted devices
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getDeviceFingerprint } from './useDeviceFingerprint';
import { toast } from 'sonner';

export interface TrustedDevice {
  id: string;
  device_fingerprint: string;
  device_name: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  ip_address: unknown;
  location: string | null;
  is_trusted: boolean;
  is_current: boolean;
  last_used_at: string;
  verified_at: string | null;
  created_at: string;
}

export const useTrustedDevices = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
      
      // Find current device
      const currentFingerprint = getDeviceFingerprint().fingerprint;
      const current = data?.find(d => d.device_fingerprint === currentFingerprint);
      setCurrentDeviceId(current?.id || null);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const registerDevice = useCallback(async () => {
    if (!user?.id) return null;

    const deviceInfo = getDeviceFingerprint();
    
    try {
      // Check if device already exists
      const { data: existing } = await supabase
        .from('trusted_devices')
        .select('id, is_trusted')
        .eq('user_id', user.id)
        .eq('device_fingerprint', deviceInfo.fingerprint)
        .maybeSingle();

      if (existing) {
        // Update last used
        await supabase
          .from('trusted_devices')
          .update({ 
            last_used_at: new Date().toISOString(),
            is_current: true 
          })
          .eq('id', existing.id);
        
        // Mark other devices as not current
        await supabase
          .from('trusted_devices')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .neq('id', existing.id);

        return { isNew: false, isTrusted: existing.is_trusted, deviceId: existing.id };
      }

      // Register new device
      const { data: newDevice, error } = await supabase
        .from('trusted_devices')
        .insert({
          user_id: user.id,
          device_fingerprint: deviceInfo.fingerprint,
          device_name: deviceInfo.deviceName,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          is_current: true
        })
        .select()
        .single();

      if (error) throw error;

      // Mark other devices as not current
      await supabase
        .from('trusted_devices')
        .update({ is_current: false })
        .eq('user_id', user.id)
        .neq('id', newDevice.id);

      // Log activity
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: 'device_added',
          device_fingerprint: deviceInfo.fingerprint,
          metadata: {
            device_name: deviceInfo.deviceName,
            device_type: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os
          }
        });

      return { isNew: true, isTrusted: false, deviceId: newDevice.id };
    } catch (error) {
      console.error('Error registering device:', error);
      return null;
    }
  }, [user?.id]);

  const removeDevice = useCallback(async (deviceId: string) => {
    if (!user?.id) return false;

    try {
      const device = devices.find(d => d.id === deviceId);
      
      const { error } = await supabase
        .from('trusted_devices')
        .delete()
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Log activity
      await supabase
        .from('account_activity_log')
        .insert({
          user_id: user.id,
          activity_type: 'device_removed',
          device_fingerprint: device?.device_fingerprint,
          metadata: { device_name: device?.device_name }
        });

      toast.success('تم إزالة الجهاز بنجاح');
      fetchDevices();
      return true;
    } catch (error) {
      console.error('Error removing device:', error);
      toast.error('فشل في إزالة الجهاز');
      return false;
    }
  }, [user?.id, devices, fetchDevices]);

  const trustDevice = useCallback(async (deviceId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('trusted_devices')
        .update({ 
          is_trusted: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', deviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('تم الوثوق بالجهاز');
      fetchDevices();
      return true;
    } catch (error) {
      console.error('Error trusting device:', error);
      toast.error('فشل في توثيق الجهاز');
      return false;
    }
  }, [user?.id, fetchDevices]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    currentDeviceId,
    fetchDevices,
    registerDevice,
    removeDevice,
    trustDevice
  };
};
