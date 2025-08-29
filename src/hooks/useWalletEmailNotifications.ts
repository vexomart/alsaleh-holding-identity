import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WalletEmailData {
  type: 'deposit' | 'withdrawal' | 'balance_alert' | 'transaction_summary';
  customerName: string;
  customerEmail: string;
  amount?: number;
  currency: string;
  newBalance: number;
  transactionId?: string;
  walletNumber: string;
  alertThreshold?: number;
  topUpUrl?: string;
}

export const useWalletEmailNotifications = () => {
  const { toast } = useToast();

  const sendWalletEmail = async (emailData: WalletEmailData) => {
    try {
      console.log('📧 Sending wallet email notification:', emailData);

      // Validate required fields
      if (!emailData.customerEmail) {
        console.warn('⚠️ No email address provided, skipping email notification');
        return { success: false, reason: 'no_email' };
      }

      if (!emailData.customerEmail.includes('@')) {
        console.warn('⚠️ Invalid email address format:', emailData.customerEmail);
        return { success: false, reason: 'invalid_email' };
      }

      const { data, error } = await supabase.functions.invoke(
        'wallet-email-notifications',
        {
          body: emailData,
        }
      );

      if (error) {
        console.error('❌ Error sending wallet email:', error);
        throw error;
      }

      console.log('✅ Wallet email sent successfully:', data);

      // Show success toast
      toast({
        title: "تم إرسال الإيميل",
        description: `تم إرسال إشعار ${getEmailTypeArabic(emailData.type)} إلى ${emailData.customerName}`,
        duration: 4000,
      });

      return { success: true, data };

    } catch (error: any) {
      console.error('❌ Failed to send wallet email:', error);
      
      // Show error toast
      toast({
        title: "خطأ في إرسال الإيميل",
        description: `فشل في إرسال إشعار المحفظة: ${error.message}`,
        variant: "destructive",
        duration: 6000,
      });

      return { success: false, error: error.message };
    }
  };

  const sendDepositEmail = async ({
    customerName,
    customerEmail,
    amount,
    currency = 'SAR',
    newBalance,
    transactionId,
    walletNumber,
  }: {
    customerName: string;
    customerEmail: string;
    amount: number;
    currency?: string;
    newBalance: number;
    transactionId: string;
    walletNumber: string;
  }) => {
    return await sendWalletEmail({
      type: 'deposit',
      customerName,
      customerEmail,
      amount,
      currency,
      newBalance,
      transactionId,
      walletNumber,
    });
  };

  const sendWithdrawalEmail = async ({
    customerName,
    customerEmail,
    amount,
    currency = 'SAR',
    newBalance,
    transactionId,
    walletNumber,
  }: {
    customerName: string;
    customerEmail: string;
    amount: number;
    currency?: string;
    newBalance: number;
    transactionId: string;
    walletNumber: string;
  }) => {
    return await sendWalletEmail({
      type: 'withdrawal',
      customerName,
      customerEmail,
      amount,
      currency,
      newBalance,
      transactionId,
      walletNumber,
    });
  };

  const sendBalanceAlertEmail = async ({
    customerName,
    customerEmail,
    currentBalance,
    currency = 'SAR',
    walletNumber,
    alertThreshold = 100,
    topUpUrl,
  }: {
    customerName: string;
    customerEmail: string;
    currentBalance: number;
    currency?: string;
    walletNumber: string;
    alertThreshold?: number;
    topUpUrl: string;
  }) => {
    return await sendWalletEmail({
      type: 'balance_alert',
      customerName,
      customerEmail,
      currency,
      newBalance: currentBalance,
      walletNumber,
      alertThreshold,
      topUpUrl,
    });
  };

  return {
    sendWalletEmail,
    sendDepositEmail,
    sendWithdrawalEmail,
    sendBalanceAlertEmail,
  };
};

// Helper function to get Arabic email type names
const getEmailTypeArabic = (type: string): string => {
  switch (type) {
    case 'deposit':
      return 'الإيداع';
    case 'withdrawal':
      return 'السحب';
    case 'balance_alert':
      return 'تنبيه الرصيد المنخفض';
    case 'transaction_summary':
      return 'ملخص المعاملات';
    default:
      return 'المحفظة الرقمية';
  }
};

export default useWalletEmailNotifications;