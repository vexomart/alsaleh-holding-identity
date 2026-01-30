import { useState, useEffect, useCallback } from 'react';
import { db } from '@/integrations/supabase/db';
import { toast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  currency?: string;
  category?: string;
  icon?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseServicesOptions {
  tenantId?: string;
  isActive?: boolean;
  category?: string;
  limit?: number;
}

export const useServices = (options: UseServicesOptions = {}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = db
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (options.tenantId) {
        query = query.eq('tenant_id', options.tenantId);
      }

      if (options.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.tenantId, options.isActive, options.category, options.limit]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (serviceData: Partial<Service>) => {
    try {
      const { data, error } = await db
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'تم إنشاء الخدمة',
      });
      
      fetchServices();
      return data;
    } catch (err) {
      console.error('Error creating service:', err);
      toast({
        title: 'خطأ في إنشاء الخدمة',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await db
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'تم تحديث الخدمة',
      });
      
      fetchServices();
      return data;
    } catch (err) {
      console.error('Error updating service:', err);
      toast({
        title: 'خطأ في تحديث الخدمة',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const { error } = await db
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      
      toast({
        title: 'تم حذف الخدمة',
      });
      
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      toast({
        title: 'خطأ في حذف الخدمة',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
};
