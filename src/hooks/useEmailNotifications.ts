/**
 * Email + SMS Notifications Hook
 * Provides easy access to notification functions with loading states
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import {
  sendOrderStatusEmail,
  sendContractEmail,
  sendInvoiceEmail,
  sendFinanceEmail,
  getCustomerProfile,
  type OrderEmailData,
  type ContractEmailData,
  type InvoiceEmailData,
  type FinanceEmailData,
} from '@/lib/api/email-notifications';

export function useEmailNotifications() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isSending, setIsSending] = useState(false);

  /**
   * Send order status notification (email + SMS)
   */
  const notifyOrderStatus = useCallback(async (
    data: Omit<OrderEmailData, 'customerEmail' | 'customerName' | 'customerPhone'> & { customerId: string }
  ) => {
    setIsSending(true);
    try {
      const profile = await getCustomerProfile(data.customerId);
      if (!profile?.email) {
        console.warn('No customer email found for order notification');
        return { success: false };
      }

      const result = await sendOrderStatusEmail({
        ...data,
        customerEmail: profile.email,
        customerName: profile.name,
        customerPhone: profile.phone || undefined,
      });

      if (result.success) {
        console.log('Order notification sent successfully (email + SMS)');
      }
      return result;
    } catch (err) {
      console.error('Failed to send order notification:', err);
      return { success: false };
    } finally {
      setIsSending(false);
    }
  }, []);

  /**
   * Send contract notification (email + SMS)
   */
  const notifyContract = useCallback(async (
    data: Omit<ContractEmailData, 'customerEmail' | 'customerName' | 'customerPhone'> & { customerId: string }
  ) => {
    setIsSending(true);
    try {
      const profile = await getCustomerProfile(data.customerId);
      if (!profile?.email) {
        console.warn('No customer email found for contract notification');
        return { success: false };
      }

      const result = await sendContractEmail({
        ...data,
        customerEmail: profile.email,
        customerName: profile.name,
        customerPhone: profile.phone || undefined,
      });

      if (result.success) {
        console.log('Contract notification sent successfully (email + SMS)');
      }
      return result;
    } catch (err) {
      console.error('Failed to send contract notification:', err);
      return { success: false };
    } finally {
      setIsSending(false);
    }
  }, []);

  /**
   * Send invoice notification (email + SMS)
   */
  const notifyInvoice = useCallback(async (
    data: Omit<InvoiceEmailData, 'customerEmail' | 'customerName' | 'customerPhone'> & { customerId: string }
  ) => {
    setIsSending(true);
    try {
      const profile = await getCustomerProfile(data.customerId);
      if (!profile?.email) {
        console.warn('No customer email found for invoice notification');
        return { success: false };
      }

      const result = await sendInvoiceEmail({
        ...data,
        customerEmail: profile.email,
        customerName: profile.name,
        customerPhone: profile.phone || undefined,
      });

      if (result.success) {
        console.log('Invoice notification sent successfully (email + SMS)');
      }
      return result;
    } catch (err) {
      console.error('Failed to send invoice notification:', err);
      return { success: false };
    } finally {
      setIsSending(false);
    }
  }, []);

  /**
   * Send finance notification (email + SMS)
   */
  const notifyFinance = useCallback(async (
    data: Omit<FinanceEmailData, 'customerEmail' | 'customerName' | 'customerPhone'> & { customerId: string }
  ) => {
    setIsSending(true);
    try {
      const profile = await getCustomerProfile(data.customerId);
      if (!profile?.email) {
        console.warn('No customer email found for finance notification');
        return { success: false };
      }

      const result = await sendFinanceEmail({
        ...data,
        customerEmail: profile.email,
        customerName: profile.name,
        customerPhone: profile.phone || undefined,
      });

      if (result.success) {
        console.log('Finance notification sent successfully (email + SMS)');
      }
      return result;
    } catch (err) {
      console.error('Failed to send finance notification:', err);
      return { success: false };
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    isSending,
    notifyOrderStatus,
    notifyContract,
    notifyInvoice,
    notifyFinance,
  };
}

export type { OrderEmailData, ContractEmailData, InvoiceEmailData, FinanceEmailData };
