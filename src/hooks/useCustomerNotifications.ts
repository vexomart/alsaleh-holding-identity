import { supabase } from "@/integrations/supabase/client";

export interface CustomerNotificationData {
  type: 'welcome' | 'order_confirmed' | 'order_updated' | 'payment_received' | 'contract_signed' | 'project_update' | 'invoice_sent';
  customerEmail: string;
  customerName: string;
  data: any;
}

export const useCustomerNotifications = () => {
  const sendNotification = async (notificationData: CustomerNotificationData) => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-notifications', {
        body: notificationData
      });

      if (error) {
        console.error('خطأ في إرسال الإشعار:', error);
        throw error;
      }

      console.log('تم إرسال الإشعار بنجاح:', data);
      return data;
    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error);
      throw error;
    }
  };

  // إشعار الترحيب للعملاء الجدد
  const sendWelcomeNotification = async (customerEmail: string, customerName: string) => {
    return sendNotification({
      type: 'welcome',
      customerEmail,
      customerName,
      data: {}
    });
  };

  // إشعار تأكيد الطلب
  const sendOrderConfirmation = async (customerEmail: string, customerName: string, orderData: any) => {
    return sendNotification({
      type: 'order_confirmed',
      customerEmail,
      customerName,
      data: orderData
    });
  };

  // إشعار تحديث الطلب
  const sendOrderUpdate = async (customerEmail: string, customerName: string, updateData: any) => {
    return sendNotification({
      type: 'order_updated',
      customerEmail,
      customerName,
      data: updateData
    });
  };

  // إشعار استلام الدفع
  const sendPaymentReceived = async (customerEmail: string, customerName: string, paymentData: any) => {
    return sendNotification({
      type: 'payment_received',
      customerEmail,
      customerName,
      data: paymentData
    });
  };

  // إشعار توقيع العقد
  const sendContractSigned = async (customerEmail: string, customerName: string, contractData: any) => {
    return sendNotification({
      type: 'contract_signed',
      customerEmail,
      customerName,
      data: contractData
    });
  };

  // إشعار تحديث المشروع
  const sendProjectUpdate = async (customerEmail: string, customerName: string, projectData: any) => {
    return sendNotification({
      type: 'project_update',
      customerEmail,
      customerName,
      data: projectData
    });
  };

  // إشعار إرسال الفاتورة
  const sendInvoiceNotification = async (customerEmail: string, customerName: string, invoiceData: any) => {
    return sendNotification({
      type: 'invoice_sent',
      customerEmail,
      customerName,
      data: invoiceData
    });
  };

  return {
    sendNotification,
    sendWelcomeNotification,
    sendOrderConfirmation,
    sendOrderUpdate,
    sendPaymentReceived,
    sendContractSigned,
    sendProjectUpdate,
    sendInvoiceNotification
  };
};