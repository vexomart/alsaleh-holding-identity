import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, 
  Loader2, 
  Shield, 
  CheckCircle,
  Smartphone,
  Globe,
  ArrowRight
} from "lucide-react";

interface PaymentDialogProps {
  offer: {
    id: number;
    title: string;
    discountedPrice: string;
    originalPrice: string;
    discount: string;
    timeLeft: string;
  };
  trigger: React.ReactNode;
}

const PaymentDialog = ({ offer, trigger }: PaymentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'tap' | 'paylink' | 'stc_pay' | 'tamara'>('tap');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 'tap',
      name: 'Tap Payment',
      description: 'بطاقات الائتمان والخصم',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      features: ['فيزا', 'ماستركارد', 'مدى']
    },
    {
      id: 'paylink',
      name: 'PayLink',
      description: 'الدفع المصرفي الآمن',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      features: ['تحويل بنكي', 'آمن', 'سريع']
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      description: 'المحفظة الرقمية',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      features: ['محفظة رقمية', 'دفع فوري', 'آمن']
    },
    {
      id: 'tamara',
      name: 'Tamara',
      description: 'اشتري الآن وادفع لاحقاً',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      features: ['قسط على 4', 'بدون فوائد', 'سهل']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod === 'stc_pay' && !formData.phone) {
      toast({
        title: "خطأ في البيانات",
        description: "رقم الجوال مطلوب للدفع عبر STC Pay",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseFloat(offer.discountedPrice.replace(/,/g, ''));
      
      const paymentFunction = selectedPaymentMethod === 'tap' ? 'tap-payment' : 
                             selectedPaymentMethod === 'paylink' ? 'paylink-payment' : 
                             selectedPaymentMethod === 'tamara' ? 'tamara-payment' :
                             'stc-pay';
      
      const { data, error } = await supabase.functions.invoke(paymentFunction, {
        body: {
          amount: amount,
          currency: 'SAR',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          offer_title: offer.title,
          description: `دفع عرض: ${offer.title}`,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      if (data?.success) {
        if (selectedPaymentMethod === 'stc_pay') {
          toast({
            title: "تم إنشاء طلب الدفع",
            description: "سيتم توجيهك لتعليمات الدفع عبر STC Pay",
          });
        } else {
          window.open(data.url, '_blank');
          toast({
            title: "تم إنشاء رابط الدفع",
            description: "سيتم فتح صفحة الدفع في نافذة جديدة",
          });
        }
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في عملية الدفع",
        description: error.message || "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            إتمام عملية الدفع
          </DialogTitle>
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              عرض خاص - خصم {offer.discount}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{offer.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-green-600">
                        {offer.discountedPrice} ريال
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {offer.originalPrice} ريال
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      توفير {parseInt(offer.originalPrice.replace(/,/g, '')) - parseInt(offer.discountedPrice.replace(/,/g, ''))} ريال
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي:</span>
                      <span className="text-green-600">{offer.discountedPrice} ريال</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-100 rounded-lg p-3 text-center">
                    <span className="text-orange-700 font-medium">
                      ⏰ العرض ينتهي خلال {offer.timeLeft}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">بيانات العميل</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الجوال {selectedPaymentMethod === 'stc_pay' ? '*' : '(اختياري)'}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">طريقة الدفع</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod === method.id
                          ? 'ring-2 ring-orange-500 bg-orange-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                            <div className="flex gap-1 mt-1">
                              {method.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full payment-button bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  ادفع الآن - {offer.discountedPrice} ريال
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <Shield className="w-4 h-4 inline mr-1" />
              عملية دفع آمنة ومشفرة بالكامل
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;