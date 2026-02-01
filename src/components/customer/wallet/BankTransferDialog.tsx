/**
 * Bank Transfer Request Dialog
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useLanguage } from "@/hooks/useLanguage";
import { useBankTransfer } from "@/hooks/useBankTransfer";
import { SAUDI_BANKS } from "@/types/wallet";
import { Building2, CreditCard, Upload, Loader2 } from "lucide-react";

const bankTransferSchema = z.object({
  amount: z.number().min(10, "Minimum amount is 10 SAR").max(100000, "Maximum amount is 100,000 SAR"),
  bank_name: z.string().min(1, "Bank is required"),
  iban: z.string().regex(/^SA\d{22}$/, "Invalid Saudi IBAN format (SA + 22 digits)"),
  account_holder_name: z.string().optional(),
});

type BankTransferFormData = z.infer<typeof bankTransferSchema>;

interface BankTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankTransferDialog({ open, onOpenChange }: BankTransferDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { createTransfer, isCreating } = useBankTransfer();
  
  const form = useForm<BankTransferFormData>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      amount: 0,
      bank_name: "",
      iban: "",
      account_holder_name: "",
    },
  });

  const onSubmit = async (data: BankTransferFormData) => {
    await createTransfer({
      amount: data.amount,
      bank_name: data.bank_name,
      iban: data.iban.toUpperCase(),
      account_holder_name: data.account_holder_name,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isRTL ? "طلب تحويل بنكي" : "Bank Transfer Request"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "قم بتحويل المبلغ إلى حسابنا البنكي ثم أدخل التفاصيل أدناه"
              : "Transfer the amount to our bank account and enter the details below"}
          </DialogDescription>
        </DialogHeader>

        {/* Company Bank Info */}
        <div className="bg-muted/50 p-4 rounded-lg border space-y-2">
          <h4 className="font-semibold text-sm">
            {isRTL ? "معلومات حسابنا البنكي:" : "Our Bank Account:"}
          </h4>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">{isRTL ? "البنك:" : "Bank:"}</span> {isRTL ? "مصرف الراجحي" : "Al Rajhi Bank"}</p>
            <p><span className="text-muted-foreground">{isRTL ? "الآيبان:" : "IBAN:"}</span> <code className="bg-background px-2 py-0.5 rounded">SA0000000000000000000000</code></p>
            <p><span className="text-muted-foreground">{isRTL ? "اسم الحساب:" : "Account Name:"}</span> {isRTL ? "شركة الصالح القابضة" : "Alsaleh Holding Co."}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "المبلغ (ر.س)" : "Amount (SAR)"}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={isRTL ? "أدخل المبلغ" : "Enter amount"}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isRTL ? "البنك المحول منه" : "Transfer From Bank"}</FormLabel>
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
                  <FormLabel>{isRTL ? "اسم صاحب الحساب (اختياري)" : "Account Holder Name (optional)"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isRTL ? "أدخل الاسم" : "Enter name"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isCreating} className="flex-1">
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin me-2" />
                    {isRTL ? "جاري الإرسال..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 me-2" />
                    {isRTL ? "تقديم الطلب" : "Submit Request"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
