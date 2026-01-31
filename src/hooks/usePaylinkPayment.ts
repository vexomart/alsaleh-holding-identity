/**
 * Paylink Payment API Hook
 * Client-side API for Paylink payment operations
 */

import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreatePaymentResponse {
  success: boolean;
  payment_url?: string;
  provider_invoice_id?: string;
  transaction_no?: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  transaction_no?: string;
  status?: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  paylink_status?: string;
  amount?: number;
  currency?: string;
  paid_at?: string;
  error?: string;
}

export function usePaylinkPayment() {
  /**
   * Create a Paylink invoice for payment
   */
  const createPayment = useMutation({
    mutationFn: async (invoiceId: string): Promise<CreatePaymentResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('paylink-create-invoice', {
        body: { invoice_id: invoiceId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create payment');
      }

      return response.data;
    },
    onError: (error) => {
      console.error('Payment creation error:', error);
      toast.error('فشل في إنشاء رابط الدفع');
    },
  });

  /**
   * Verify payment status server-side
   */
  const verifyPayment = useMutation({
    mutationFn: async (params: { transactionNo?: string; invoiceId?: string }): Promise<VerifyPaymentResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('paylink-verify-payment', {
        body: {
          transaction_no: params.transactionNo,
          invoice_id: params.invoiceId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to verify payment');
      }

      return response.data;
    },
  });

  /**
   * Open payment URL in new window
   */
  const openPaymentUrl = (paymentUrl: string) => {
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * Redirect to payment URL (same window)
   */
  const redirectToPayment = (paymentUrl: string) => {
    window.location.href = paymentUrl;
  };

  return {
    createPayment,
    verifyPayment,
    openPaymentUrl,
    redirectToPayment,
    isCreatingPayment: createPayment.isPending,
    isVerifyingPayment: verifyPayment.isPending,
  };
}

/**
 * Hook to check payment status on page load (after redirect)
 */
export function usePaymentRedirectCheck(invoiceId: string | undefined) {
  const { verifyPayment } = usePaylinkPayment();

  return useQuery({
    queryKey: ['payment-status', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;

      // Check URL params for payment result
      const urlParams = new URLSearchParams(window.location.search);
      const paymentParam = urlParams.get('payment');

      if (paymentParam === 'success' || paymentParam === 'failed' || paymentParam === 'cancelled') {
        // Verify payment status server-side
        const result = await verifyPayment.mutateAsync({ invoiceId });
        
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        window.history.replaceState({}, '', url.toString());

        return {
          redirectResult: paymentParam,
          verifiedStatus: result.status,
          ...result,
        };
      }

      return null;
    },
    enabled: !!invoiceId,
    staleTime: 0,
    refetchOnMount: true,
  });
}
