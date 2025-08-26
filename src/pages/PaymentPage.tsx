import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tap');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '1499'
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    // التحقق من صحة البيانات
    if (!formData.name || !formData.email || !formData.amount) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'stc_pay' && !formData.phone) {
      toast({
        title: "خطأ في البيانات", 
        description: "رقم الجوال مطلوب للدفع عبر STC Pay",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // عرض رسالة تحضير الدفع
      toast({
        title: "جاري تحضير رابط الدفع...",
        description: "سيتم توجيهك فوراً إلى صفحة الدفع الآمنة",
        duration: 2000,
      });

      const payload = {
        amount: parseFloat(formData.amount),
        currency: 'SAR',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || '966500000000',
        offer_title: 'العروض الحالية - المميزة والحصرية',
        description: `دفع خدمة ${formData.name} - ${formData.amount} ريال سعودي`,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        // إضافة معلومات إضافية للفاتورة
        metadata: {
          customer_name: formData.name,
          customer_email: formData.email,
          payment_type: paymentMethod,
          timestamp: new Date().toISOString()
        }
      };

      const functionName = 'tap-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        console.error("❌ خطأ في الاستدعاء:", error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      if (data?.success) {
        if (paymentMethod === 'stc_pay') {
          toast({
            title: "✅ تم إنشاء طلب الدفع",
            description: "تم إرسال تعليمات الدفع إلى بريدك الإلكتروني",
            duration: 5000,
          });
          
        } else if (data?.payment_url) {
          // رسالة نجاح مع معلومات إضافية
          toast({
            title: "✅ تم إنشاء رابط الدفع بنجاح",
            description: "سيتم توجيهك الآن إلى TAP لإتمام الدفع الآمن",
            duration: 3000,
          });

          // إرسال بريد إلكتروني فوري بمعلومات الدفع
          try {
            await supabase.functions.invoke('send-invoice-email', {
              body: {
                customer_name: formData.name,
                customer_email: formData.email,
                amount: parseFloat(formData.amount),
                currency: 'SAR',
                payment_url: data.payment_url,
                transaction_id: data.transaction_id || 'N/A',
                invoice_number: data.invoice_number || 'N/A',
                status: 'pending',
                payment_method: 'TAP'
              }
            });
          } catch (emailError) {
            console.warn("تحذير: فشل في إرسال البريد الإلكتروني:", emailError);
          }

          // التحويل الفوري إلى TAP
          setTimeout(() => {
            window.open(data.payment_url, '_blank');
          }, 1500);
        }
      } else {
        throw new Error(data?.message || 'فشل في إنشاء رابط الدفع');
      }
      
    } catch (error: any) {
      console.error("💥 خطأ:", error);
      toast({
        title: "❌ خطأ في عملية الدفع",
        description: error.message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20" dir="rtl">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-2xl font-bold text-primary">
            صفحة الدفع
          </CardTitle>
          <CardDescription>
            اختر طريقة الدفع المناسبة لك
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (ريال سعودي)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              className="text-lg font-bold text-center"
            />
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال (مطلوب لـ STC Pay)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="966500000000"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">طريقة الدفع</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                <RadioGroupItem value="tap" id="tap" />
                <Label htmlFor="tap" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">TAP - البطاقة الائتمانية</div>
                    <div className="text-sm text-muted-foreground">فيزا • ماستركارد • مدى</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                <RadioGroupItem value="stc_pay" id="stc_pay" />
                <Label htmlFor="stc_pay" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">STC Pay</div>
                    <div className="text-sm text-muted-foreground">دفع فوري وآمن</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                ادفع {formData.amount} ريال
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            🔒 جميع المعاملات محمية بأعلى معايير الأمان
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;