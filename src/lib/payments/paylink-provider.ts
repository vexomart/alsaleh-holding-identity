/**
 * Paylink Payment Provider - PHASE WALLET-1
 * Server-side Paylink implementation via Edge Functions
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  PaymentProvider,
  PaymentMethodType,
  CreatePaymentSessionParams,
  PaymentSessionResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
} from './types';

/**
 * Paylink Provider Implementation
 * Uses Edge Functions for secure API communication
 */
export const paylinkProvider: PaymentProvider = {
  name: 'paylink',
  display_name: 'Paylink',
  display_name_ar: 'بيلينك',
  
  // Paylink supports these payment methods
  supported_methods: ['card', 'mada', 'stcpay', 'apple_pay'] as PaymentMethodType[],
  
  async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await supabase.functions.invoke('paylink-create-invoice', {
        body: {
          invoice_id: params.invoice_id,
          callback_url: params.callback_url,
          // Additional params for direct payment (non-invoice)
          amount: params.amount,
          currency: params.currency,
          user_email: params.user_email,
          user_name: params.user_name,
          user_phone: params.user_phone,
          metadata: params.metadata,
        },
      });

      if (response.error) {
        console.error('Paylink create session error:', response.error);
        return { 
          success: false, 
          error: response.error.message || 'Failed to create payment session' 
        };
      }

      return {
        success: true,
        payment_url: response.data.payment_url,
        provider_ref: response.data.provider_invoice_id,
        transaction_no: response.data.transaction_no,
      };
    } catch (error) {
      console.error('Paylink provider error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  
  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return { success: false, status: 'failed', error: 'Not authenticated' };
      }

      const response = await supabase.functions.invoke('paylink-verify-payment', {
        body: {
          transaction_no: params.provider_ref,
          invoice_id: params.invoice_id,
        },
      });

      if (response.error) {
        console.error('Paylink verify error:', response.error);
        return {
          success: false,
          status: 'failed',
          error: response.error.message || 'Failed to verify payment',
        };
      }

      return {
        success: true,
        status: response.data.status,
        paid_at: response.data.paid_at,
        amount: response.data.amount,
        currency: response.data.currency,
        provider_status: response.data.paylink_status,
        raw: response.data,
      };
    } catch (error) {
      console.error('Paylink verify error:', error);
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  
  async isConfigured(): Promise<boolean> {
    // Check if Paylink credentials are set by attempting auth
    try {
      const response = await supabase.functions.invoke('paylink-auth', {
        body: {},
      });
      return response.data?.success === true;
    } catch {
      return false;
    }
  },
};

/**
 * Get available payment methods from Paylink
 */
export function getPaylinkPaymentMethods() {
  return [
    {
      type: 'card' as PaymentMethodType,
      label: 'Credit/Debit Card',
      label_ar: 'بطاقة ائتمان/خصم',
      icon: 'CreditCard',
      is_enabled: true,
      is_instant: true,
      requires_review: false,
      supported_currencies: ['SAR'],
      brands: ['visa', 'mastercard'],
    },
    {
      type: 'mada' as PaymentMethodType,
      label: 'Mada Card',
      label_ar: 'بطاقة مدى',
      icon: 'Wallet',
      is_enabled: true,
      is_instant: true,
      requires_review: false,
      supported_currencies: ['SAR'],
    },
    {
      type: 'stcpay' as PaymentMethodType,
      label: 'STC Pay',
      label_ar: 'STC Pay',
      icon: 'Smartphone',
      is_enabled: true,
      is_instant: true,
      requires_review: false,
      supported_currencies: ['SAR'],
    },
    {
      type: 'apple_pay' as PaymentMethodType,
      label: 'Apple Pay',
      label_ar: 'Apple Pay',
      icon: 'Apple',
      is_enabled: true,
      is_instant: true,
      requires_review: false,
      supported_currencies: ['SAR'],
    },
  ];
}
