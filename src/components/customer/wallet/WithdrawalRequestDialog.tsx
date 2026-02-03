/**
 * Withdrawal Request Dialog - Request withdrawal to bank account
 * طلب سحب - طلب سحب الرصيد للحساب البنكي
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  Building2,
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SAUDI_BANKS } from "@/types/wallet";

const withdrawalSchema = z.object({
  amount: z.number().min(100, "Minimum amount is 100 SAR").max(50000, "Maximum amount is 50,000 SAR"),
  bank_name: z.string().min(1, "Bank is required"),
  iban: z.string().regex(/^SA\d{22}$/, "Invalid Saudi IBAN format (SA + 22 digits)"),
  account_holder_name: z.string().min(2, "Account holder name is required"),
  reason: z.string().optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
}

export function WithdrawalRequestDialog({
  open,
  onOpenChange,
  currentBalance,
}: WithdrawalRequestDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      bank_name: "",
      iban: "",
      account_holder_name: profile?.full_name || "",
      reason: "",
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: WithdrawalFormData) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Create withdrawal request (will be processed by admin)
      const { data: request, error } = await supabase
        .from("financial_transactions" as never)
        .insert({
          customer_user_id: user.id,
          tenant_id: profile?.tenant_id || null,
          transaction_type: 'withdrawal',
          amount: data.amount,
          currency: 'SAR',
          status: 'pending',
          description: isRTL ? 'طلب سحب للحساب البنكي' : 'Bank withdrawal request',
          description_ar: 'طلب سحب للحساب البنكي',
          metadata: {
            bank_name: data.bank_name,
            iban: data.iban,
            account_holder_name: data.account_holder_name,
            reason: data.reason,
            requested_at: new Date().toISOString(),
          },
        } as never)
        .select()
        .single();

      if (error) throw error;
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setStep('success');
      toast({
        title: isRTL ? "تم تقديم الطلب" : "Request Submitted",
        description: isRTL 
          ? "تم تقديم طلب السحب بنجاح. سيتم مراجعته من قبل الإدارة."
          : "Withdrawal request submitted. It will be reviewed by admin.",
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

  const watchAmount = form.watch("amount");
  const remainingBalance = currentBalance - (watchAmount || 0);
  const isValidAmount = watchAmount >= 100 && watchAmount <= Math.min(currentBalance, 50000);

  const handleConfirm = () => {
    if (!isValidAmount) return;
    setStep('confirm');
  };

  const handleSubmit = async () => {
    const data = form.getValues();
    await withdrawMutation.mutateAsync(data);
  };

  const handleClose = () => {
    setStep('form');
    form.reset();
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getBankName = (code: string) => {
    const bank = SAUDI_BANKS.find((b) => b.code === code);
    return bank ? (isRTL ? bank.name_ar : bank.name_en) : code;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" dir={isRTL ? "rtl" : "ltr"}>
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-primary" />
                {isRTL ? "طلب سحب رصيد" : "Withdrawal Request"}
              </DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "قم بتعبئة البيانات لسحب رصيدك إلى حسابك البنكي"
                  : "Fill in the details to withdraw to your bank account"}
              </DialogDescription>
            </DialogHeader>

            {/* Current Balance */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "الرصيد المتاح" : "Available Balance"}
                  </span>
                </div>
                <span className="text-xl font-bold text-primary" dir="ltr">
                  {formatCurrency(currentBalance)}
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "مبلغ السحب (ر.س)" : "Withdrawal Amount (SAR)"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={isRTL ? "أدخل المبلغ" : "Enter amount"}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                      {isValidAmount && (
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? "الرصيد المتبقي بعد السحب:" : "Remaining balance:"}{" "}
                          <span className={cn(remainingBalance < 0 ? "text-red-500" : "text-green-600")} dir="ltr">
                            {formatCurrency(remainingBalance)}
                          </span>
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "البنك المستلم" : "Receiving Bank"}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر البنك" : "Select bank"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SAUDI_BANKS.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                              {isRTL ? bank.name_ar : bank.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "رقم الآيبان" : "IBAN Number"}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SA0000000000000000000000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          dir="ltr"
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account_holder_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "اسم صاحب الحساب" : "Account Holder Name"}</FormLabel>
                      <FormControl>
                        <Input placeholder={isRTL ? "أدخل الاسم" : "Enter name"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Warning */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-600">
                      {isRTL ? "ملاحظة مهمة" : "Important Note"}
                    </p>
                    <p className="text-amber-600/80 text-xs mt-1">
                      {isRTL
                        ? "قد يستغرق تحويل المبلغ 1-3 أيام عمل بعد الموافقة على الطلب"
                        : "Transfer may take 1-3 business days after request approval"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!isValidAmount}
                    className="flex-1"
                  >
                    {isRTL ? "متابعة" : "Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                {isRTL ? "تأكيد طلب السحب" : "Confirm Withdrawal"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "مبلغ السحب" : "Withdrawal Amount"}
                  </span>
                  <span className="font-bold text-lg" dir="ltr">
                    {formatCurrency(form.getValues("amount"))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "البنك" : "Bank"}
                  </span>
                  <span className="font-medium">
                    {getBankName(form.getValues("bank_name"))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "الآيبان" : "IBAN"}
                  </span>
                  <span className="font-mono text-sm" dir="ltr">
                    {form.getValues("iban")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "صاحب الحساب" : "Account Holder"}
                  </span>
                  <span className="font-medium">
                    {form.getValues("account_holder_name")}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1"
                >
                  {isRTL ? "رجوع" : "Back"}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={withdrawMutation.isPending}
                  className="flex-1"
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin me-2" />
                      {isRTL ? "جاري الإرسال..." : "Submitting..."}
                    </>
                  ) : (
                    <>{isRTL ? "تأكيد وإرسال" : "Confirm & Submit"}</>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600">
                {isRTL ? "تم تقديم الطلب بنجاح!" : "Request Submitted Successfully!"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {isRTL 
                  ? "سيتم مراجعة طلبك وإخطارك بالنتيجة خلال 1-2 يوم عمل"
                  : "Your request will be reviewed and you'll be notified within 1-2 business days"}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              {isRTL ? "إغلاق" : "Close"}
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
