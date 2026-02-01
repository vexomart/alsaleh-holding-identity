/**
 * Hook for Bank Transfer operations
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import type { BankTransferRequest, CreateBankTransferRequest } from "@/types/wallet";

export function useBankTransfer() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();

  // Fetch user's bank transfer requests
  const { data: transfers, isLoading, refetch } = useQuery({
    queryKey: ["bank-transfers", "customer"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return [];

      const { data, error } = await supabase
        .from("bank_transfer_requests" as never)
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as BankTransferRequest[];
    },
  });

  // Create bank transfer request
  const createMutation = useMutation({
    mutationFn: async (request: CreateBankTransferRequest) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("bank_transfer_requests" as never)
        .insert({
          user_id: sessionData.session.user.id,
          amount: request.amount,
          bank_name: request.bank_name,
          iban: request.iban,
          account_holder_name: request.account_holder_name,
          receipt_media_url: request.receipt_media_url,
          status: "submitted",
        } as never)
        .select()
        .single();

      if (error) throw error;
      return data as BankTransferRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
      toast({
        title: isRTL ? "تم تقديم الطلب" : "Request Submitted",
        description: isRTL
          ? "تم تقديم طلب التحويل البنكي بنجاح. سيتم مراجعته قريباً."
          : "Bank transfer request submitted successfully. It will be reviewed shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ" : "Error",
        description: error.message,
      });
    },
  });

  return {
    transfers,
    isLoading,
    refetch,
    createTransfer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

// Admin hook for bank transfer management
export function useAdminBankTransfers() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch all bank transfer requests
  const { data: transfers, isLoading, refetch } = useQuery({
    queryKey: ["bank-transfers", "admin", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("bank_transfer_requests" as never)
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as BankTransferRequest[];
    },
  });

  // Approve bank transfer
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("process_bank_transfer_approval", {
        p_transfer_id: id,
        p_reviewer_id: sessionData.session.user.id,
        p_notes: notes,
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error || "Failed to approve transfer");
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast({
        title: isRTL ? "تم الاعتماد" : "Approved",
        description: isRTL
          ? "تم اعتماد التحويل البنكي وإضافة الرصيد للمحفظة"
          : "Bank transfer approved and balance added to wallet",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ" : "Error",
        description: error.message,
      });
    },
  });

  // Reject bank transfer
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bank_transfer_requests" as never)
        .update({
          status: "rejected",
          reviewer_user_id: sessionData.session.user.id,
          rejection_reason: reason,
          processed_at: new Date().toISOString(),
        } as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
      toast({
        title: isRTL ? "تم الرفض" : "Rejected",
        description: isRTL
          ? "تم رفض طلب التحويل البنكي"
          : "Bank transfer request rejected",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ" : "Error",
        description: error.message,
      });
    },
  });

  // Mark as under review
  const reviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("bank_transfer_requests" as never)
        .update({ status: "under_review" } as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
    },
  });

  return {
    transfers,
    isLoading,
    refetch,
    statusFilter,
    setStatusFilter,
    approve: approveMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
    markAsReview: reviewMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
