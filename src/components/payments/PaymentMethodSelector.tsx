/**
 * Payment Method Selector - PHASE WALLET-1
 * Unified UI for selecting payment method (card/mada/bank transfer)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { getAllPaymentMethods, type PaymentMethod, type PaymentMethodType } from "@/lib/payments";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Smartphone, 
  Check,
  Clock,
  AlertCircle 
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Apple: Smartphone, // Fallback for Apple icon
};

interface PaymentMethodSelectorProps {
  selectedMethod?: PaymentMethodType;
  onMethodSelect: (method: PaymentMethodType) => void;
  walletBalance?: number;
  amount?: number;
  disabledMethods?: PaymentMethodType[];
  showWalletOption?: boolean;
  className?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodSelect,
  walletBalance = 0,
  amount = 0,
  disabledMethods = [],
  showWalletOption = true,
  className,
}: PaymentMethodSelectorProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  let methods = getAllPaymentMethods();
  
  // Filter out wallet if not needed
  if (!showWalletOption) {
    methods = methods.filter(m => m.type !== 'wallet');
  }

  // Check if wallet has sufficient balance
  const canUseWallet = walletBalance >= amount && amount > 0;

  const getIcon = (iconName?: string) => {
    if (!iconName) return CreditCard;
    return iconMap[iconName] || CreditCard;
  };

  const isMethodDisabled = (method: PaymentMethod): boolean => {
    if (disabledMethods.includes(method.type)) return true;
    if (method.type === 'wallet' && !canUseWallet) return true;
    return !method.is_enabled;
  };

  const getMethodStatus = (method: PaymentMethod) => {
    if (method.type === 'wallet' && !canUseWallet && showWalletOption) {
      return {
        label: isRTL ? "رصيد غير كافٍ" : "Insufficient balance",
        variant: "destructive" as const,
      };
    }
    if (method.requires_review) {
      return {
        label: isRTL ? "يتطلب مراجعة" : "Requires review",
        variant: "secondary" as const,
      };
    }
    if (method.is_instant) {
      return {
        label: isRTL ? "فوري" : "Instant",
        variant: "default" as const,
      };
    }
    return null;
  };

  return (
    <div className={cn("space-y-3", className)} dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="text-sm font-medium text-muted-foreground">
        {isRTL ? "اختر طريقة الدفع" : "Select Payment Method"}
      </h3>
      
      <div className="grid gap-2">
        {methods.map((method) => {
          const Icon = getIcon(method.icon);
          const isSelected = selectedMethod === method.type;
          const isDisabled = isMethodDisabled(method);
          const status = getMethodStatus(method);

          return (
            <motion.button
              key={method.type}
              type="button"
              onClick={() => !isDisabled && onMethodSelect(method.type)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.01 } : undefined}
              whileTap={!isDisabled ? { scale: 0.99 } : undefined}
              className={cn(
                "relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-start w-full",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 end-2"
                >
                  <Check className="h-5 w-5 text-primary" />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {isRTL ? method.label_ar : method.label}
                  </span>
                  {status && (
                    <Badge variant={status.variant} className="text-xs">
                      {method.is_instant ? (
                        <Check className="h-3 w-3 me-1" />
                      ) : method.requires_review ? (
                        <Clock className="h-3 w-3 me-1" />
                      ) : null}
                      {status.label}
                    </Badge>
                  )}
                </div>
                
                {/* Wallet balance display */}
                {method.type === 'wallet' && showWalletOption && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {isRTL ? "الرصيد المتاح: " : "Available: "}
                    <span className="font-mono">
                      {walletBalance.toLocaleString('ar-SA')} {isRTL ? "ر.س" : "SAR"}
                    </span>
                  </p>
                )}
                
                {/* Bank transfer note */}
                {method.type === 'bank_transfer' && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isRTL 
                      ? "قم بالتحويل ثم ارفق الإيصال للمراجعة" 
                      : "Transfer and attach receipt for review"}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
