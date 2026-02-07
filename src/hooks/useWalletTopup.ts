/**
 * Hook for wallet top-up functionality
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface TopupResult {
  success: boolean;
  payment_url?: string;
  transaction_no?: string;
  order_number?: string;
  amount?: number;
  error?: string;
}

export function useWalletTopup() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [isProcessing, setIsProcessing] = useState(false);

  const topupMutation = useMutation({
    mutationFn: async (amount: number): Promise<TopupResult> => {
      setIsProcessing(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Not authenticated");
      }

      // Get callback URL
      const callbackUrl = `${window.location.origin}/portal/wallet?topup=success`;

      const { data, error } = await supabase.functions.invoke("paylink-topup", {
        body: {
          amount,
          callback_url: callbackUrl,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create top-up payment");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to create top-up payment");
      }

      return data as TopupResult;
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      
      if (data.payment_url) {
        toast({
          title: isRTL ? "جاري التوجيه للدفع" : "Redirecting to payment",
          description: isRTL 
            ? "سيتم توجيهك لصفحة الدفع الآمنة"
            : "You will be redirected to secure payment page",
        });

        // Redirect to payment URL
        window.location.href = data.payment_url;
      }
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ في الشحن" : "Top-up Error",
        description: error.message,
      });
    },
  });

  const initiateTopup = async (amount: number) => {
    if (amount < 10 || amount > 50000) {
      toast({
        variant: "destructive",
        title: isRTL ? "مبلغ غير صالح" : "Invalid Amount",
        description: isRTL 
          ? "المبلغ يجب أن يكون بين 10 و 50,000 ريال"
          : "Amount must be between 10 and 50,000 SAR",
      });
      return;
    }

    await topupMutation.mutateAsync(amount);
  };

  return {
    initiateTopup,
    isProcessing: isProcessing || topupMutation.isPending,
    error: topupMutation.error,
  };
}
