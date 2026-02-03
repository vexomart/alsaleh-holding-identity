/**
 * Wallet Adjustment Dialog Component
 * Dialog for adding/deducting balance from customer wallet
 */

import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Minus,
  Loader2,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerWallet } from "@/types/financial";

interface CustomerWithWallet {
  id: string;
  customer_uid: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  wallet?: CustomerWallet;
}

interface WalletAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerWithWallet | null;
  adjustmentType: "add" | "deduct";
  onSubmit: (amount: number, reason: string) => Promise<void>;
  language: string;
}

export const WalletAdjustmentDialog = memo(function WalletAdjustmentDialog({
  isOpen,
  onClose,
  customer,
  adjustmentType,
  onSubmit,
  language,
}: WalletAdjustmentDialogProps) {
  const isRTL = language === "ar";
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setReason("");
      setError("");
    }
  }, [isOpen]);

  const balance = Number(customer?.wallet?.balance || 0);
  const parsedAmount = parseFloat(amount) || 0;
  const newBalance = adjustmentType === "add" 
    ? balance + parsedAmount 
    : balance - parsedAmount;

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!parsedAmount || parsedAmount <= 0) {
      setError(isRTL ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount");
      return;
    }

    if (!reason.trim()) {
      setError(isRTL ? "يرجى إدخال سبب التعديل" : "Please enter a reason");
      return;
    }

    if (adjustmentType === "deduct" && parsedAmount > balance) {
      setError(isRTL ? "المبلغ أكبر من الرصيد المتاح" : "Amount exceeds available balance");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsedAmount, reason.trim());
      onClose();
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء التعديل" : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = customer?.full_name || customer?.email?.split("@")[0] || "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {adjustmentType === "add" ? (
              <Plus className="h-5 w-5 text-emerald-600" />
            ) : (
              <Minus className="h-5 w-5 text-red-600" />
            )}
            {adjustmentType === "add"
              ? (isRTL ? "إضافة رصيد" : "Add Balance")
              : (isRTL ? "خصم رصيد" : "Deduct Balance")}
          </DialogTitle>
          <DialogDescription>
            {adjustmentType === "add"
              ? (isRTL ? `إضافة رصيد لمحفظة ${displayName}` : `Add balance to ${displayName}'s wallet`)
              : (isRTL ? `خصم رصيد من محفظة ${displayName}` : `Deduct balance from ${displayName}'s wallet`)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Balance */}
          <div className="p-4 rounded-xl bg-muted/50 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                {isRTL ? "الرصيد الحالي" : "Current Balance"}
              </div>
              <span className="font-bold text-lg" dir="ltr">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label>{isRTL ? "المبلغ (ر.س)" : "Amount (SAR)"}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-mono"
              dir="ltr"
            />
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label>{isRTL ? "سبب التعديل *" : "Reason for adjustment *"}</Label>
            <Textarea
              placeholder={isRTL ? "أدخل سبب التعديل..." : "Enter reason for adjustment..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Preview */}
          {parsedAmount > 0 && (
            <div className={cn(
              "p-4 rounded-xl border",
              adjustmentType === "add" 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-red-500/10 border-red-500/30"
            )}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isRTL ? "الرصيد الجديد" : "New Balance"}
                </span>
                <span className={cn(
                  "font-bold text-lg",
                  adjustmentType === "add" ? "text-emerald-600" : "text-red-600"
                )} dir="ltr">
                  {formatCurrency(newBalance)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                {adjustmentType === "add" ? (
                  <Plus className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Minus className="h-3 w-3 text-red-600" />
                )}
                <span dir="ltr">{formatCurrency(parsedAmount)}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !parsedAmount || !reason.trim()}
            className={cn(
              adjustmentType === "add"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
            {adjustmentType === "add"
              ? (isRTL ? "إضافة الرصيد" : "Add Balance")
              : (isRTL ? "خصم الرصيد" : "Deduct Balance")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
