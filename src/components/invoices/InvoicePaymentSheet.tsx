/**
 * Invoice Payment Sheet
 * Clean payment method selection
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { 
  CreditCard, 
  Landmark, 
  Wallet,
  Loader2,
} from 'lucide-react';
import { PaymentMethod, DEFAULT_PAYMENT_METHODS } from './types';

interface InvoicePaymentSheetProps {
  open: boolean;
  onClose: () => void;
  total: number;
  currency: string;
  invoiceNumber: string;
  paymentMethods?: PaymentMethod[];
  onPaymentSelect: (method: PaymentMethod) => void;
  isProcessing?: boolean;
}

const methodIcons: Record<PaymentMethod['type'], React.ElementType> = {
  card: CreditCard,
  bank_transfer: Landmark,
  wallet: Wallet,
  apple_pay: CreditCard,
};

export function InvoicePaymentSheet({
  open,
  onClose,
  total,
  currency,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  onPaymentSelect,
  isProcessing,
}: InvoicePaymentSheetProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const enabledMethods = paymentMethods.filter(m => m.enabled);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onPaymentSelect(selectedMethod);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-xl"
      >
        <SheetHeader className="text-start mb-6">
          <SheetTitle>
            {isRTL ? 'اختر طريقة الدفع' : 'Payment Method'}
          </SheetTitle>
          <SheetDescription className="text-base">
            <span dir="ltr" className="font-semibold text-foreground ltr-token">
              {formatCurrency(total)} {currency}
            </span>
          </SheetDescription>
        </SheetHeader>

        {/* Payment Methods */}
        <div className="space-y-2 mb-6">
          {enabledMethods.map((method, index) => {
            const Icon = methodIcons[method.type];
            const isSelected = selectedMethod?.type === method.type;
            
            return (
              <motion.button
                key={method.type}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.04 }}
                onClick={() => setSelectedMethod(method)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border text-start transition-colors',
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg',
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <span className="font-medium text-foreground">
                  {isRTL ? method.labelAr : method.label}
                </span>
                
                {isSelected && (
                  <div className="ms-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!selectedMethod || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                {isRTL ? 'جاري المعالجة...' : 'Processing...'}
              </>
            ) : (
              isRTL ? 'متابعة الدفع' : 'Continue'
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
