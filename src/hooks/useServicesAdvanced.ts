/**
 * useServices Hook - Advanced Services Management
 * Provides state management and operations for services with sorting and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchServices,
  fetchServiceById,
  fetchServicesByCategory,
  fetchCategories,
  createService,
  updateService,
  deleteService,
  updateServicesSortOrder,
  toggleServiceStatus,
  toggleServiceVisibility,
  duplicateService,
  type Service,
  type CreateServiceRequest,
  type UpdateServiceRequest,
  type ServiceFilters,
  type ServicesByCategory,
} from '@/lib/api/services';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export function useServicesAdvanced(filters?: ServiceFilters) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const queryClient = useQueryClient();

  // Fetch services
  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['services', filters],
    queryFn: () => fetchServices(filters),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['service-categories'],
    queryFn: fetchCategories,
  });

  // Fetch services by category
  const { data: servicesByCategory = [] } = useQuery({
    queryKey: ['services-by-category', filters?.is_active],
    queryFn: () => fetchServicesByCategory(filters?.is_active === undefined),
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('services-changes-advanced')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['services'] });
          queryClient.invalidateQueries({ queryKey: ['service-categories'] });
          queryClient.invalidateQueries({ queryKey: ['services-by-category'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: isRTL ? 'تم إنشاء الخدمة بنجاح' : 'Service created successfully',
      });
    },
    onError: (error) => {
      console.error('Create service error:', error);
      toast({
        title: isRTL ? 'خطأ في إنشاء الخدمة' : 'Error creating service',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: isRTL ? 'تم تحديث الخدمة بنجاح' : 'Service updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update service error:', error);
      toast({
        title: isRTL ? 'خطأ في تحديث الخدمة' : 'Error updating service',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: isRTL ? 'تم حذف الخدمة بنجاح' : 'Service deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete service error:', error);
      toast({
        title: isRTL ? 'خطأ في حذف الخدمة' : 'Error deleting service',
        variant: 'destructive',
      });
    },
  });

  // Sort order mutation
  const sortOrderMutation = useMutation({
    mutationFn: updateServicesSortOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Sort order error:', error);
      toast({
        title: isRTL ? 'خطأ في تحديث الترتيب' : 'Error updating sort order',
        variant: 'destructive',
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleServiceStatus(id, is_active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: variables.is_active 
          ? (isRTL ? 'تم تفعيل الخدمة' : 'Service activated')
          : (isRTL ? 'تم إلغاء تفعيل الخدمة' : 'Service deactivated'),
      });
    },
    onError: (error) => {
      console.error('Toggle status error:', error);
      toast({
        title: isRTL ? 'خطأ في تغيير الحالة' : 'Error toggling status',
        variant: 'destructive',
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, is_visible_to_customers }: { id: string; is_visible_to_customers: boolean }) =>
      toggleServiceVisibility(id, is_visible_to_customers),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: variables.is_visible_to_customers 
          ? (isRTL ? 'الخدمة مرئية للعملاء' : 'Service visible to customers')
          : (isRTL ? 'الخدمة مخفية عن العملاء' : 'Service hidden from customers'),
      });
    },
    onError: (error) => {
      console.error('Toggle visibility error:', error);
      toast({
        title: isRTL ? 'خطأ في تغيير الظهور' : 'Error toggling visibility',
        variant: 'destructive',
      });
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: duplicateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: isRTL ? 'تم نسخ الخدمة بنجاح' : 'Service duplicated successfully',
      });
    },
    onError: (error) => {
      console.error('Duplicate service error:', error);
      toast({
        title: isRTL ? 'خطأ في نسخ الخدمة' : 'Error duplicating service',
        variant: 'destructive',
      });
    },
  });

  // Reorder services (for drag & drop)
  const reorderServices = useCallback(
    async (reorderedServices: Service[]) => {
      const orders = reorderedServices.map((service, index) => ({
        id: service.id,
        sort_order: index,
      }));
      await sortOrderMutation.mutateAsync(orders);
    },
    [sortOrderMutation]
  );

  // Move service up
  const moveServiceUp = useCallback(
    async (service: Service) => {
      const currentIndex = services.findIndex(s => s.id === service.id);
      if (currentIndex <= 0) return;

      const newServices = [...services];
      [newServices[currentIndex - 1], newServices[currentIndex]] = 
        [newServices[currentIndex], newServices[currentIndex - 1]];
      
      await reorderServices(newServices);
    },
    [services, reorderServices]
  );

  // Move service down
  const moveServiceDown = useCallback(
    async (service: Service) => {
      const currentIndex = services.findIndex(s => s.id === service.id);
      if (currentIndex < 0 || currentIndex >= services.length - 1) return;

      const newServices = [...services];
      [newServices[currentIndex], newServices[currentIndex + 1]] = 
        [newServices[currentIndex + 1], newServices[currentIndex]];
      
      await reorderServices(newServices);
    },
    [services, reorderServices]
  );

  return {
    // Data
    services,
    categories,
    servicesByCategory,
    isLoading,
    error,

    // CRUD operations
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,
    duplicateService: duplicateMutation.mutateAsync,

    // Status operations
    toggleStatus: toggleStatusMutation.mutateAsync,
    toggleVisibility: toggleVisibilityMutation.mutateAsync,

    // Sort operations
    reorderServices,
    moveServiceUp,
    moveServiceDown,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: sortOrderMutation.isPending,

    // Refetch
    refetch,
  };
}

export function useServiceById(id: string | null) {
  const queryClient = useQueryClient();

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['service', id],
    queryFn: () => (id ? fetchServiceById(id) : null),
    enabled: !!id,
  });

  return {
    service,
    isLoading,
    error,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['service', id] }),
  };
}

// Re-export types
export type { Service, CreateServiceRequest, UpdateServiceRequest, ServiceFilters, ServicesByCategory };
