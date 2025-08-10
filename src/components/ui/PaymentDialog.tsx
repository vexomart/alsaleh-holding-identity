import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Loader2, Lock, Sparkles, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    name: string;
    price: number;
    category?: string;
  };
  onSuccess?: () => void;
}

export const PaymentDialog = ({ open, onOpenChange, service, onSuccess }: PaymentDialogProps) => {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startPayment = async () => {
    if (!customer.name || !customer.email) {
      toast({ 
        title: "البيانات مطلوبة", 
        description: "يرجى إدخال الاسم والبريد الإلكتروني.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("paylink-payment", {
        body: {
          amount: service.price,
          currency: "SAR",
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          offer_title: service.name,
          description: service.category ? `${service.category} - ${service.name}` : service.name,
          success_url: window.location.origin + "/payment-success",
        },
      });

      if (error) throw error;
      if (!resp?.payment_url) throw new Error("تعذر إنشاء رابط الدفع");

      toast({ 
        title: "🚀 إعادة التوجيه للدفع", 
        description: "سيتم فتح صفحة Paylink لإتمام العملية." 
      });
      
      // فتح في نفس النافذة للسرعة
      window.location.href = resp.payment_url;
      
      onOpenChange(false);
      onSuccess?.();
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "فشل الدفع", 
        description: e.message || "حدث خطأ غير متوقع", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customer.name && customer.email) {
      startPayment();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-success/5" dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-success to-success/80 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
              الدفع الآمن
            </DialogTitle>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-success/80 to-success flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-2xl font-bold text-success">{service.price.toLocaleString()}</span>
              <span className="text-muted-foreground">ريال سعودي</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2 justify-center text-sm text-success">
              <Sparkles className="w-4 h-4" />
              <span>دفع آمن ومشفر عبر Paylink</span>
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">الاسم الكامل *</Label>
              <Input 
                id="name" 
                placeholder="أدخل اسمك الكامل" 
                value={customer.name} 
                onChange={(e) => setCustomer(s => ({ ...s, name: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="text-right"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@mail.com" 
                value={customer.email} 
                onChange={(e) => setCustomer(s => ({ ...s, email: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right">رقم الجوال (اختياري)</Label>
              <Input 
                id="phone" 
                placeholder="05XXXXXXXX" 
                value={customer.phone} 
                onChange={(e) => setCustomer(s => ({ ...s, phone: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="text-right"
              />
            </div>
          </div>

          <Button 
            onClick={startPayment} 
            disabled={loading || !customer.name || !customer.email} 
            className="w-full h-12 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success text-white font-bold text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" /> 
                جاري إنشاء رابط الدفع...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 ml-2" /> 
                إتمام الدفع الآن ({service.price.toLocaleString()} ر.س)
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              الدفع آمن ومشفر. سيتم توجيهك لصفحة Paylink.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};