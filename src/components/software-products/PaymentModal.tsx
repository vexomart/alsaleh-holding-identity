import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Wallet } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  emoji: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: any;
  paymentMethods: PaymentMethod[];
  onPaymentMethodSelect: (methodId: string, product: any) => void;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  selectedProduct, 
  paymentMethods, 
  onPaymentMethodSelect 
}: PaymentModalProps) => {
  if (!selectedProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              💳 اختر طريقة الدفع
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl border border-primary/20">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
              {selectedProduct.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-primary">{selectedProduct.price}</span>
              {selectedProduct.originalPrice && (
                <span className="text-lg text-slate-400 line-through">{selectedProduct.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Button
                  key={method.id}
                  onClick={() => onPaymentMethodSelect(method.id, selectedProduct)}
                  className={`w-full p-6 bg-gradient-to-r ${method.color} hover:scale-105 transform transition-all duration-300 rounded-2xl text-white shadow-2xl`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{method.emoji}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{method.name}</div>
                        <div className="text-sm opacity-90">{method.description}</div>
                      </div>
                    </div>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="text-center text-sm text-slate-500 pt-4">
            🔒 جميع المعاملات آمنة ومشفرة
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};