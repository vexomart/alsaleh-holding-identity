import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, User, Mail, Phone, MessageSquare, Gift, Loader2, Sparkles, Clock, Star } from "lucide-react";

interface OfferRequestFormProps {
  offer: {
    id: number;
    title: string;
    currentPrice: string;
    originalPrice: string;
    discount: string;
    timeLeft: string;
    features: string[];
  };
  trigger: React.ReactNode;
}

const OfferRequestForm = ({ offer, trigger }: OfferRequestFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('offer-request', {
        body: {
          offer: {
            id: offer.id,
            title: offer.title,
            currentPrice: offer.currentPrice,
            originalPrice: offer.originalPrice,
            discount: offer.discount,
            timeLeft: offer.timeLeft,
            features: offer.features
          },
          customerInfo: formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح! ✅",
        description: "سيتم التواصل معك في أقرب وقت ممكن",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting offer request:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى أو التواصل مباشرة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
        <DialogHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg"></div>
          <div className="relative z-10 text-center py-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                اطلب عرضك المميز
              </DialogTitle>
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
            <p className="text-lg text-gray-600 font-medium">
              احصل على عرض سعر مخصص وابدأ مشروعك الآن
            </p>
          </div>
        </DialogHeader>

        {/* Enhanced Offer Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2)_0%,_transparent_50%)]"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Gift className="w-6 h-6" />
              </div>
              العرض المحدد
              <Badge className="bg-red-500 text-white px-3 py-1 animate-pulse">
                عرض محدود
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <h3 className="font-black text-2xl">{offer.title}</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-yellow-300">{offer.currentPrice} ر.س</span>
                  <Badge className="bg-red-500 text-white px-3 py-1 text-lg font-bold animate-bounce">
                    خصم {offer.discount}
                  </Badge>
                </div>
                <span className="text-xl text-blue-200 line-through font-medium">
                  {offer.originalPrice} ر.س
                </span>
                <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 font-bold">متبقي {offer.timeLeft}</span>
                </div>
              </div>
              <div className="text-xl font-bold text-yellow-300">
                💰 وفر {parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Contact Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              📋 بياناتك للتواصل
            </CardTitle>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                الاسم الكامل *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="ادخل اسمك الكامل"
                required
                className="text-right h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                البريد الإلكتروني *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@domain.com"
                required
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                رقم الجوال *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="05xxxxxxxx"
                required
                className="text-right h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="company" className="text-lg font-semibold">
                اسم الشركة (اختياري)
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="اسم الشركة"
                className="text-right h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="w-4 h-4 text-orange-600" />
              </div>
              تفاصيل إضافية أو متطلبات خاصة
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="اكتب هنا أي تفاصيل إضافية أو متطلبات خاصة لمشروعك..."
              rows={4}
              className="text-right resize-none border-2 border-gray-200 focus:border-orange-500 rounded-xl"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
              <p className="text-lg text-blue-800 text-center font-semibold">
                💡 سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل المشروع وتأكيد العرض
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الطلب الآن
                  <Sparkles className="w-5 h-5 mr-2" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-8 py-4 rounded-2xl border-2 hover:bg-gray-50"
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </div>
        </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OfferRequestForm;