/**
 * Wallet Top-up Dialog Component
 * Allows customers to add funds to their wallet
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useWalletTopup } from "@/hooks/useWalletTopup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Wallet,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletTopupDialogProps {
  children?: React.ReactNode;
}

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export function WalletTopupDialog({ children }: WalletTopupDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { initiateTopup, isProcessing } = useWalletTopup();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const handlePresetClick = (preset: number) => {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
    setSelectedPreset(null);
  };

  const handleTopup = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 10) return;
    
    await initiateTopup(numAmount);
  };

  const numericAmount = parseInt(amount) || 0;
  const isValidAmount = numericAmount >= 10 && numericAmount <= 50000;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            {isRTL ? "شحن الرصيد" : "Top Up"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isRTL ? "شحن رصيد المحفظة" : "Top Up Wallet"}
          </DialogTitle>
          <DialogDescription>
            {isRTL 
              ? "اختر المبلغ أو أدخل مبلغ مخصص لشحن محفظتك"
              : "Select an amount or enter a custom amount to top up your wallet"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Amounts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {isRTL ? "مبالغ سريعة" : "Quick Amounts"}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <motion.button
                  key={preset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-200 font-semibold text-sm",
                    selectedPreset === preset
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {preset.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-3">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              {isRTL ? "أو أدخل مبلغ مخصص" : "Or enter custom amount"}
            </Label>
            <div className="relative">
              <Input
                id="custom-amount"
                type="text"
                inputMode="numeric"
                placeholder={isRTL ? "أدخل المبلغ..." : "Enter amount..."}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={cn(
                  "text-lg font-semibold h-12",
                  isRTL ? "pr-4 pl-16" : "pl-4 pr-16"
                )}
              />
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium",
                isRTL ? "left-4" : "right-4"
              )}>
                {isRTL ? "ر.س" : "SAR"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {isRTL 
                ? "الحد الأدنى: 10 ر.س | الحد الأقصى: 50,000 ر.س"
                : "Minimum: 10 SAR | Maximum: 50,000 SAR"
              }
            </p>
          </div>

          {/* Summary */}
          {isValidAmount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "المبلغ الإجمالي" : "Total Amount"}
                </span>
                <span className="text-xl font-bold text-primary">
                  {numericAmount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isRTL ? "بدون رسوم" : "No Fees"}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>
              {isRTL 
                ? "مدى، فيزا، ماستركارد، STC Pay"
                : "Mada, Visa, Mastercard, STC Pay"
              }
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleTopup}
            disabled={!isValidAmount || isProcessing}
            className="w-full h-12 text-base font-semibold gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {isRTL ? "جاري المعالجة..." : "Processing..."}
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                {isRTL ? "شحن المحفظة الآن" : "Top Up Now"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
