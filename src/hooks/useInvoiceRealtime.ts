/**
 * useInvoiceRealtime Hook
 * Real-time subscription for invoice events
 * Channels: user:{customer_user_id}:invoices, user:{customer_user_id}:notifications
 */

import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { InvoiceRealtimePayload } from '@/lib/api/invoices';

interface UseInvoiceRealtimeOptions {
  onInvoiceGenerated?: (payload: InvoiceRealtimePayload) => void;
  onInvoiceStatusChanged?: (payload: InvoiceRealtimePayload) => void;
  showToast?: boolean;
}

export function useInvoiceRealtime(options: UseInvoiceRealtimeOptions = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { onInvoiceGenerated, onInvoiceStatusChanged, showToast = true } = options;

  const handleInvoiceGenerated = useCallback(
    (payload: InvoiceRealtimePayload) => {
      if (showToast) {
        toast({
          title: isRTL ? 'فاتورة جديدة' : 'New Invoice',
          description: isRTL
            ? `تم إصدار فاتورة رقم ${payload.invoice_number} بقيمة ${payload.total.toFixed(2)} ${payload.currency}`
            : `Invoice ${payload.invoice_number} issued for ${payload.total.toFixed(2)} ${payload.currency}`,
        });
      }
      onInvoiceGenerated?.(payload);
    },
    [isRTL, showToast, onInvoiceGenerated]
  );

  const handleInvoiceStatusChanged = useCallback(
    (payload: InvoiceRealtimePayload) => {
      const statusLabels: Record<string, { ar: string; en: string }> = {
        draft: { ar: 'مسودة', en: 'Draft' },
        issued: { ar: 'صادرة', en: 'Issued' },
        paid: { ar: 'مدفوعة', en: 'Paid' },
        cancelled: { ar: 'ملغاة', en: 'Cancelled' },
        overdue: { ar: 'متأخرة', en: 'Overdue' },
      };

      const statusLabel = statusLabels[payload.status] || { ar: payload.status, en: payload.status };

      if (showToast) {
        toast({
          title: isRTL ? 'تحديث حالة الفاتورة' : 'Invoice Status Updated',
          description: isRTL
            ? `فاتورة رقم ${payload.invoice_number} - الحالة: ${statusLabel.ar}`
            : `Invoice ${payload.invoice_number} - Status: ${statusLabel.en}`,
        });
      }
      onInvoiceStatusChanged?.(payload);
    },
    [isRTL, showToast, onInvoiceStatusChanged]
  );

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    // Subscribe to user-specific invoice channel
    const invoiceChannel = supabase
      .channel(`user:${userId}:invoices`)
      .on('broadcast', { event: 'invoice.generated' }, ({ payload }) => {
        handleInvoiceGenerated(payload as InvoiceRealtimePayload);
      })
      .on('broadcast', { event: 'invoice.status_changed' }, ({ payload }) => {
        handleInvoiceStatusChanged(payload as InvoiceRealtimePayload);
      })
      .subscribe();

    // Subscribe to user-specific notification channel for invoice events
    const notificationChannel = supabase
      .channel(`user:${userId}:notifications`)
      .on('broadcast', { event: 'invoice.generated' }, ({ payload }) => {
        // Already handled by invoice channel, but can be used for notification-specific logic
        console.log('Invoice notification received:', payload);
      })
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(invoiceChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, [user?.id, handleInvoiceGenerated, handleInvoiceStatusChanged]);

  return null;
}

/**
 * useAdminInvoiceRealtime Hook
 * Admin-side subscription for tenant invoice monitoring
 */
export function useAdminInvoiceRealtime(
  tenantId: string | null,
  options: {
    onInvoiceGenerated?: (payload: InvoiceRealtimePayload) => void;
    onInvoiceStatusChanged?: (payload: InvoiceRealtimePayload) => void;
  } = {}
) {
  const { onInvoiceGenerated, onInvoiceStatusChanged } = options;

  useEffect(() => {
    if (!tenantId) return;

    // Subscribe to tenant invoice channel for admin monitoring
    const tenantChannel = supabase
      .channel(`tenant:${tenantId}:invoices`)
      .on('broadcast', { event: 'invoice.generated' }, ({ payload }) => {
        onInvoiceGenerated?.(payload as InvoiceRealtimePayload);
      })
      .on('broadcast', { event: 'invoice.status_changed' }, ({ payload }) => {
        onInvoiceStatusChanged?.(payload as InvoiceRealtimePayload);
      })
      .subscribe();

    // Also subscribe to postgres changes for real-time table updates
    const dbChannel = supabase
      .channel('invoices-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        (payload) => {
          console.log('Invoice DB change:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tenantChannel);
      supabase.removeChannel(dbChannel);
    };
  }, [tenantId, onInvoiceGenerated, onInvoiceStatusChanged]);

  return null;
}

/**
 * useInvoiceDbRealtime Hook
 * Subscribe to postgres changes for invoices table
 */
export function useInvoiceDbRealtime(
  onInsert?: (invoice: Record<string, unknown>) => void,
  onUpdate?: (invoice: Record<string, unknown>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel('invoices-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'invoices' },
        (payload) => {
          onInsert?.(payload.new as Record<string, unknown>);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'invoices' },
        (payload) => {
          onUpdate?.(payload.new as Record<string, unknown>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onInsert, onUpdate]);
}
