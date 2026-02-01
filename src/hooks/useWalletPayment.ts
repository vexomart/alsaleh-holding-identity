/**
 * Wallet Payment Hook - PHASE WALLET-1
 * Handles paying invoices from wallet balance
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface WalletPaymentResult {
  success: boolean;
  transaction_id?: string;
  new_balance?: number;
  invoice_number?: string;
  amount_paid?: number;
  error?: string;
  error_ar?: string;
  required?: number;
  available?: number;
}

interface PayInvoiceParams {
  invoiceId: string;
}

export function useWalletPayment() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();

  const payInvoice = useMutation({
    mutationFn: async ({ invoiceId }: PayInvoiceParams): Promise<WalletPaymentResult> => {
      if (!user?.id) {
        throw new Error(isRTL ? "يجب تسجيل الدخول" : "Must be logged in");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.rpc as any)("pay_invoice_from_wallet", {
        p_invoice_id: invoiceId,
        p_customer_id: user.id,
      });

      if (error) {
        console.error("Wallet payment error:", error);
        throw new Error(error.message);
      }

      return data as WalletPaymentResult;
    },
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["invoice"] });
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["order"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        toast({
          title: isRTL ? "تم الدفع بنجاح" : "Payment Successful",
          description: isRTL
            ? `تم دفع ${result.amount_paid?.toLocaleString("ar-SA")} ر.س للفاتورة ${result.invoice_number}`
            : `Paid ${result.amount_paid?.toLocaleString("en-US")} SAR for invoice ${result.invoice_number}`,
        });
      } else {
        const errorMessage = isRTL ? result.error_ar : result.error;
        
        if (result.error === "Insufficient balance") {
          toast({
            title: isRTL ? "رصيد غير كافٍ" : "Insufficient Balance",
            description: isRTL
              ? `المطلوب: ${result.required?.toLocaleString("ar-SA")} ر.س | المتاح: ${result.available?.toLocaleString("ar-SA")} ر.س`
              : `Required: ${result.required?.toLocaleString("en-US")} SAR | Available: ${result.available?.toLocaleString("en-US")} SAR`,
            variant: "destructive",
          });
        } else {
          toast({
            title: isRTL ? "فشل الدفع" : "Payment Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    },
    onError: (error) => {
      console.error("Wallet payment mutation error:", error);
      toast({
        title: isRTL ? "حدث خطأ" : "Error Occurred",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    payFromWallet: payInvoice,
    isProcessing: payInvoice.isPending,
  };
}
