import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Minus, Loader2, User, CreditCard, Mail, AlertTriangle } from "lucide-react";

interface WalletTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  customerName: string;
  transactionType: 'deposit' | 'withdraw';
  onSuccess: () => void;
}

export const WalletTransactionForm = ({
  isOpen,
  onClose,
  userId,
  customerName,
  transactionType,
  onSuccess
}: WalletTransactionFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    if (!description.trim()) {
      toast.error("يرجى إدخال وصف للمعاملة");
      return;
    }

    setIsLoading(true);

    try {
      const functionName = transactionType === 'deposit' 
        ? 'admin-wallet-deposit' 
        : 'admin-wallet-withdraw';

      const requestData = {
        user_id: userId,
        amount: parseFloat(amount),
        description: description.trim(),
        admin_notes: adminNotes.trim() || undefined,
        ...(transactionType === 'withdraw' && paymentMethod && {
          withdrawal_method: paymentMethod
        })
      };

      console.log('Sending request to:', functionName, requestData);

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestData
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      toast.success(
        transactionType === 'deposit' 
          ? `تم إيداع ${amount} ريال بنجاح في محفظة ${customerName}`
          : `تم سحب ${amount} ريال بنجاح من محفظة ${customerName}`
      );

      // Reset form
      setAmount("");
      setDescription("");
      setAdminNotes("");
      setPaymentMethod("");
      
      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('Transaction error:', error);
      const errorMessage = error.message || error.error || 'حدث خطأ أثناء المعاملة';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setDescription("");
      setAdminNotes("");
      setPaymentMethod("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {transactionType === 'deposit' ? (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                إيداع رصيد
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-red-600" />
                سحب رصيد
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* معلومات العميل */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{customerName}</p>
                <p className="text-sm text-muted-foreground">معرف المستخدم: {userId}</p>
              </div>
            </div>
            
            {/* تحذير الإيميل */}
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">تنبيه الإشعارات</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    سيتم إرسال إشعار بالإيميل للعميل إذا كان الإيميل مسجل في النظام. 
                    تأكد من وجود إيميل صحيح لضمان وصول الإشعارات.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المبلغ */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">
              المبلغ (ريال سعودي) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ..."
              className="text-lg"
              disabled={isLoading}
              required
            />
          </div>

          {/* طريقة الدفع للسحب */}
          {transactionType === 'withdraw' && (
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-base font-medium">
                طريقة السحب
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة السحب..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="cash">نقداً</SelectItem>
                  <SelectItem value="check">شيك</SelectItem>
                  <SelectItem value="admin_withdrawal">سحب إداري</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* الوصف */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              وصف المعاملة *
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                transactionType === 'deposit' 
                  ? "مثال: إيداع رصيد إضافي"
                  : "مثال: سحب رصيد بناءً على طلب العميل"
              }
              disabled={isLoading}
              required
            />
          </div>

          {/* ملاحظات إدارية */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes" className="text-base font-medium">
              ملاحظات إدارية (اختيارية)
            </Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="أضف أي ملاحظات إضافية..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* أزرار العمل */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${
                transactionType === 'deposit' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  {transactionType === 'deposit' ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      تأكيد الإيداع
                    </>
                  ) : (
                    <>
                      <Minus className="mr-2 h-4 w-4" />
                      تأكيد السحب
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};