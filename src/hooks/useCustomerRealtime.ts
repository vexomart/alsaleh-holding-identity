/**
 * useCustomerRealtime Hook
 * Combined real-time hook for Customer Dashboard
 * Handles services updates and invoice notifications
 */

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServicesRealtime } from './useServicesRealtime';
import { useInvoicesRealtime } from './useInvoicesRealtime';
import { sendDeliveryConfirmation } from './useAdminDeliveryConfirmation';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { ServiceEventPayload, InvoiceEventPayload } from '@/types/realtime-events';

interface UseCustomerRealtimeOptions {
  userId?: string;
  tenantId?: string;
  enabled?: boolean;
}

interface UseCustomerRealtimeReturn {
  isServicesConnected: boolean;
  isInvoicesConnected: boolean;
  lastServiceEvent: ServiceEventPayload | null;
  lastInvoiceEvent: InvoiceEventPayload | null;
}

export const useCustomerRealtime = (options: UseCustomerRealtimeOptions): UseCustomerRealtimeReturn => {
  const { userId, tenantId, enabled = true } = options;
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Service event handlers
  const handleServiceChange = useCallback(
    (payload: ServiceEventPayload) => {
      // Invalidate services cache to refetch
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-by-category'] });

      // Send delivery confirmation to admin
      if (userId) {
        sendDeliveryConfirmation(tenantId, {
          event_type: payload.event,
          target_user_id: userId,
          acknowledged: true,
        });
      }

      // Show toast for significant changes
      if (payload.event === 'service.created') {
        toast({
          title: isRTL ? 'خدمة جديدة متاحة' : 'New Service Available',
          description: isRTL ? 'تم إضافة خدمة جديدة' : 'A new service has been added',
        });
      }
    },
    [queryClient, userId, tenantId, isRTL]
  );

  // Invoice event handlers
  const handleInvoiceGenerated = useCallback(
    (payload: InvoiceEventPayload) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });

      // Send delivery confirmation
      if (userId) {
        sendDeliveryConfirmation(tenantId, {
          event_type: payload.event,
          target_user_id: userId,
          acknowledged: true,
        });
      }

      toast({
        title: isRTL ? 'فاتورة جديدة' : 'New Invoice',
        description: isRTL 
          ? 'تم إنشاء فاتورة جديدة لطلبك' 
          : 'A new invoice has been generated for your order',
      });
    },
    [queryClient, userId, tenantId, isRTL]
  );

  const handleInvoiceStatusChanged = useCallback(
    (payload: InvoiceEventPayload) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });

      if (userId) {
        sendDeliveryConfirmation(tenantId, {
          event_type: payload.event,
          target_user_id: userId,
          acknowledged: true,
        });
      }

      const statusMessages: Record<string, { en: string; ar: string }> = {
        paid: { en: 'Payment Confirmed', ar: 'تم تأكيد الدفع' },
        cancelled: { en: 'Invoice Cancelled', ar: 'تم إلغاء الفاتورة' },
      };

      const message = statusMessages[payload.status || ''];
      if (message) {
        toast({
          title: isRTL ? message.ar : message.en,
        });
      }
    },
    [queryClient, userId, tenantId, isRTL]
  );

  // Subscribe to services realtime
  const {
    isConnected: isServicesConnected,
    lastEvent: lastServiceEvent,
  } = useServicesRealtime({
    tenantId,
    onAnyChange: handleServiceChange,
    enabled: enabled && !!tenantId,
  });

  // Subscribe to invoices realtime
  const {
    isConnected: isInvoicesConnected,
    lastEvent: lastInvoiceEvent,
  } = useInvoicesRealtime({
    tenantId,
    customerId: userId,
    onInvoiceGenerated: handleInvoiceGenerated,
    onInvoiceStatusChanged: handleInvoiceStatusChanged,
    onInvoicePaid: handleInvoiceStatusChanged,
    onInvoiceCancelled: handleInvoiceStatusChanged,
    enabled: enabled && !!userId,
  });

  return {
    isServicesConnected,
    isInvoicesConnected,
    lastServiceEvent,
    lastInvoiceEvent,
  };
};
