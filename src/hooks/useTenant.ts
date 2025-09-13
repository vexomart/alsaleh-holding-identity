import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

import { Json } from '@/integrations/supabase/types';

interface Tenant {
  id: string;
  code: string;
  name: string;
  domain: string;
  is_active: boolean;
  settings: Json;
  created_at?: string;
  updated_at?: string;
  database_url?: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantCode: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const useTenantHook = () => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحديد التينانت بناء على النطاق الحالي
  const detectTenantFromDomain = (): string => {
    // هذا النظام مخصص لموقع علي الشهري فقط
    return 'alishehri';
  };

  // تحميل جميع التينانتس
  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      setTenants(data || []);
    } catch (err) {
      console.error('Error loading tenants:', err);
      setError('فشل في تحميل المواقع');
    }
  };

  // تعيين التينانت الحالي
  const setCurrentTenantFromCode = async (tenantCode: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('code', tenantCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn(`Tenant ${tenantCode} not found, falling back to alishehri`);
        // البحث عن التينانت الافتراضي
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('tenants')
          .select('*')
          .eq('code', 'alishehri')
          .eq('is_active', true)
          .single();
        
        if (fallbackError) throw fallbackError;
        setCurrentTenant(fallbackData);
        return;
      }

      setCurrentTenant(data);
      
      // تعيين التينانت في الجلسة للاستخدام في RLS
      try {
        await supabase.rpc('switch_tenant', { tenant_code: tenantCode });
      } catch (rpcError) {
        console.warn('Could not switch tenant in database, continuing with client-side context');
      }
      
    } catch (err) {
      console.error('Error setting current tenant:', err);
      setError('فشل في تحديد الموقع الحالي');
    }
  };

  // التبديل بين التينانتس (للأدمن فقط)
  const switchTenant = async (tenantCode: string): Promise<boolean> => {
    try {
      setLoading(true);
      await setCurrentTenantFromCode(tenantCode);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error switching tenant:', err);
      setError('فشل في التبديل بين المواقع');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    const initializeTenant = async () => {
      setLoading(true);
      try {
        // تحميل جميع التينانتس
        await loadTenants();
        
        // تحديد التينانت الحالي بناء على النطاق
        const detectedTenant = detectTenantFromDomain();
        await setCurrentTenantFromCode(detectedTenant);
        
      } catch (err) {
        console.error('Error initializing tenant:', err);
        setError('فشل في تهيئة نظام المواقع');
      } finally {
        setLoading(false);
      }
    };

    initializeTenant();
  }, []);

  return {
    currentTenant,
    tenants,
    switchTenant,
    loading,
    error
  };
};