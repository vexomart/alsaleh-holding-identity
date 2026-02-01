/**
 * Invoice Payment Dialog - PHASE WALLET-1
 * Dialog for paying an invoice with method selection
 * Supports: Card/Mada (Paylink), Wallet Balance, Bank Transfer
 * Includes wallet payment confirmation
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { usePaylinkPayment } from "@/hooks/usePaylinkPayment";
import { useWalletPayment } from "@/hooks/useWalletPayment";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { WalletPaymentConfirmDialog } from "./WalletPaymentConfirmDialog";
import { BankTransferDialog } from "@/components/customer/wallet/BankTransferDialog";
import type { PaymentMethodType } from "@/lib/payments";
import { 
  Loader2, 
  CreditCard, 
  Receipt, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Wallet
} from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  total: number;
  currency: string;
  status: string;
  order_id?: string;
}

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  walletBalance?: number;
  onPaymentSuccess?: () => void;
}

export function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoice,
  walletBalance = 0,
  onPaymentSuccess,
}: InvoicePaymentDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { createPayment, openPaymentUrl, isCreatingPayment } = usePaylinkPayment();
  const { payFromWallet, isProcessing: isWalletProcessing } = useWalletPayment();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | undefined>();
  const [bankTransferOpen, setBankTransferOpen] = useState(false);
  const [walletConfirmOpen, setWalletConfirmOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!invoice) return null;

  const isProcessing = isCreatingPayment || isWalletProcessing;

  // Handle wallet payment after confirmation
  const handleWalletPaymentConfirmed = async () => {
    try {
      const result = await payFromWallet.mutateAsync({ invoiceId: invoice.id });
      if (result.success) {
        setWalletConfirmOpen(false);
        onOpenChange(false);
        onPaymentSuccess?.();
      }
    } catch (error) {
      console.error('Wallet payment error:', error);
      setWalletConfirmOpen(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedMethod) return;

    setPaymentError(null);

    // Handle bank transfer separately
    if (selectedMethod === 'bank_transfer') {
      setBankTransferOpen(true);
      return;
    }

    // Handle wallet payment - show confirmation dialog first
    if (selectedMethod === 'wallet') {
      setWalletConfirmOpen(true);
      return;
    }

    // Handle card/mada payment via Paylink
    try {
      const result = await createPayment.mutateAsync(invoice.id);
      
      if (result.success && result.payment_url) {
        // Open payment URL in new tab
        openPaymentUrl(result.payment_url);
        onOpenChange(false);
        onPaymentSuccess?.();
      } else {
        setPaymentError(result.error || (isRTL ? "فشل إنشاء رابط الدفع" : "Failed to create payment"));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(isRTL ? "حدث خطأ أثناء الدفع" : "Payment error occurred");
    }
  };

  const isPaid = invoice.status === 'paid';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              {isRTL ? "دفع الفاتورة" : "Pay Invoice"}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? "اختر طريقة الدفع المناسبة لإتمام الفاتورة" 
                : "Select a payment method to complete the invoice"}
            </DialogDescription>
          </DialogHeader>

          {/* Invoice Summary */}
          <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isRTL ? "رقم الفاتورة" : "Invoice Number"}
              </span>
              <span className="font-mono text-sm">{invoice.invoice_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isRTL ? "الحالة" : "Status"}
              </span>
              <Badge variant={isPaid ? "default" : "secondary"}>
                {isPaid 
                  ? (isRTL ? "مدفوعة" : "Paid") 
                  : (isRTL ? "في انتظار الدفع" : "Pending")}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isRTL ? "المبلغ الإجمالي" : "Total Amount"}
              </span>
              <span className="text-xl font-bold text-primary">
                {invoice.total.toLocaleString('ar-SA')} {invoice.currency}
              </span>
            </div>
          </div>

          {/* Already Paid Message */}
          {isPaid ? (
            <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg border border-primary/20">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {isRTL ? "تم دفع هذه الفاتورة" : "This invoice has been paid"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selection */}
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodSelect={setSelectedMethod}
                walletBalance={walletBalance}
                amount={invoice.total}
                showWalletOption={true}
              />

              {/* Error Message */}
              {paymentError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={!selectedMethod || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin me-2" />
                      {isRTL ? "جاري المعالجة..." : "Processing..."}
                    </>
                  ) : selectedMethod === 'bank_transfer' ? (
                    <>
                      {isRTL ? "متابعة للتحويل" : "Continue to Transfer"}
                    </>
                  ) : selectedMethod === 'wallet' ? (
                    <>
                      <Wallet className="h-4 w-4 me-2" />
                      {isRTL ? "ادفع من المحفظة" : "Pay from Wallet"}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 me-2" />
                      {isRTL ? "ادفع الآن" : "Pay Now"}
                      <ExternalLink className="h-3 w-3 ms-1" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bank Transfer Dialog */}
      <BankTransferDialog 
        open={bankTransferOpen} 
        onOpenChange={setBankTransferOpen} 
      />

      {/* Wallet Payment Confirmation Dialog */}
      <WalletPaymentConfirmDialog
        open={walletConfirmOpen}
        onOpenChange={setWalletConfirmOpen}
        onConfirm={handleWalletPaymentConfirmed}
        invoiceNumber={invoice.invoice_number}
        amount={invoice.total}
        currency={invoice.currency}
        walletBalance={walletBalance}
        isProcessing={isWalletProcessing}
      />
    </>
  );
}
