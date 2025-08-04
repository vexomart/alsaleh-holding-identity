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
import { Send, User, Mail, Phone, MessageSquare, Gift, Loader2 } from "lucide-react";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            طلب العرض الخاص
          </DialogTitle>
        </DialogHeader>

        {/* Offer Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5 text-blue-600" />
              تفاصيل العرض المحدد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-blue-900">{offer.title}</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">{offer.currentPrice} ر.س</span>
                  <Badge variant="destructive" className="text-sm">
                    خصم {offer.discount}
                  </Badge>
                </div>
                <span className="text-lg text-muted-foreground line-through">
                  {offer.originalPrice} ر.س
                </span>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  متبقي {offer.timeLeft}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم الكامل *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="ادخل اسمك الكامل"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@domain.com"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الجوال *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="05xxxxxxxx"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                اسم الشركة (اختياري)
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="اسم الشركة"
                className="text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              تفاصيل إضافية أو متطلبات خاصة
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="اكتب هنا أي تفاصيل إضافية أو متطلبات خاصة لمشروعك..."
              rows={4}
              className="text-right resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              💡 سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل المشروع وتأكيد العرض
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-6"
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferRequestForm;