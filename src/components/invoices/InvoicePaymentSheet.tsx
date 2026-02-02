/**
 * Invoice Payment Sheet
 * Mobile-friendly payment method selection
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Landmark, 
  Wallet,
  Loader2,
  Shield,
  ExternalLink
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
  invoiceNumber,
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
        className="rounded-t-2xl max-h-[85vh]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <SheetHeader className="text-center sm:text-start mb-6">
            <SheetTitle className="text-xl">
              {isRTL ? 'اختر طريقة الدفع' : 'Select Payment Method'}
            </SheetTitle>
            <SheetDescription>
              {isRTL 
                ? `المبلغ المطلوب: ${formatCurrency(total)} ${currency}`
                : `Amount Due: ${formatCurrency(total)} ${currency}`
              }
            </SheetDescription>
          </SheetHeader>

          {/* Payment Methods */}
          <RadioGroup
            value={selectedMethod?.type || ''}
            onValueChange={(value) => {
              const method = enabledMethods.find(m => m.type === value);
              if (method) setSelectedMethod(method);
            }}
            className="space-y-3 mb-6"
          >
            {enabledMethods.map((method) => {
              const Icon = methodIcons[method.type];
              const isSelected = selectedMethod?.type === method.type;
              
              return (
                <motion.div
                  key={method.type}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer',
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => setSelectedMethod(method)}
                >
                  <RadioGroupItem value={method.type} id={method.type} className="sr-only" />
                  
                  <div className={cn(
                    'p-3 rounded-xl',
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <Label 
                    htmlFor={method.type} 
                    className="flex-1 cursor-pointer text-base font-medium"
                  >
                    {isRTL ? method.labelAr : method.label}
                  </Label>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </RadioGroup>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 justify-center">
            <Shield className="h-4 w-4" />
            <span>
              {isRTL 
                ? 'جميع المعاملات مشفرة وآمنة'
                : 'All transactions are encrypted and secure'
              }
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedMethod || isProcessing}
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRTL ? 'جاري المعالجة...' : 'Processing...'}
                </>
              ) : (
                <>
                  {isRTL ? 'متابعة الدفع' : 'Continue to Payment'}
                  <ExternalLink className="h-4 w-4" />
                </>
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
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
