import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, User, Mail, Phone, MessageSquare, Palette, Loader2, Sparkles, Clock, Star, Target, FileText, Play, Camera, Video } from "lucide-react";

interface DesignServiceRequestFormProps {
  trigger: React.ReactNode;
}

const designServices = [
  {
    id: "brand-identity",
    title: "إنشاء الهوية التجارية",
    description: "تصميم هوية بصرية متكاملة تعكس قيم علامتك التجارية",
    price: "5,000",
    deliveryTime: "2-3 أسابيع",
    icon: Target,
    features: ["تصميم الشعار", "دليل الهوية البصرية", "الألوان والخطوط", "تطبيقات الهوية"]
  },
  {
    id: "company-profile",
    title: "إنشاء الملف التعريفي",
    description: "ملفات تعريفية احترافية تحكي قصة شركتك وتعرض خدماتها",
    price: "3,500",
    deliveryTime: "1-2 أسبوع",
    icon: FileText,
    features: ["تصميم احترافي", "محتوى جذاب", "صور عالية الجودة", "نسخ رقمية ومطبوعة"]
  },
  {
    id: "motion-graphics",
    title: "موشن جرافيك",
    description: "رسوم متحركة إبداعية تجذب الانتباه وتوصل رسالتك بطريقة مؤثرة",
    price: "4,000",
    deliveryTime: "2-4 أسابيع",
    icon: Play,
    features: ["رسوم متحركة 2D/3D", "انيميشن لوجو", "فيديوهات تعريفية", "مؤثرات بصرية"]
  },
  {
    id: "photography",
    title: "التصوير الفوتوغرافي",
    description: "جلسات تصوير احترافية للمنتجات والفعاليات والبروفايل",
    price: "2,500",
    deliveryTime: "3-7 أيام",
    icon: Camera,
    features: ["تصوير المنتجات", "تصوير الفعاليات", "البورتريه المهني", "التصوير التجاري"]
  },
  {
    id: "videography",
    title: "تصوير الفيديوهات",
    description: "إنتاج فيديوهات عالية الجودة للدعاية والإعلان والمحتوى التسويقي",
    price: "6,000",
    deliveryTime: "1-3 أسابيع",
    icon: Video,
    features: ["فيديوهات ترويجية", "مقاطع دعائية", "مقابلات", "تغطية الفعاليات"]
  }
];

const DesignServiceRequestForm = ({ trigger }: DesignServiceRequestFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    projectDetails: "",
    budget: "",
    timeline: "",
    additionalRequirements: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedService = designServices.find(s => s.id === formData.serviceType);
      
      const { error } = await supabase.functions.invoke('design-service-request', {
        body: {
          service: selectedService,
          customerInfo: formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك من فريق التصميم خلال 24 ساعة",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceType: "",
        projectDetails: "",
        budget: "",
        timeline: "",
        additionalRequirements: ""
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting design service request:', error);
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

  const selectedService = designServices.find(s => s.id === formData.serviceType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
        <DialogHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg"></div>
          <div className="relative z-10 text-center py-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                اطلب خدمة التصميم
              </DialogTitle>
              <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-lg text-gray-600 font-medium">
              احصل على تصميم إبداعي مميز يحقق أهدافك التجارية
            </p>
          </div>
        </DialogHeader>

        {/* Service Selection */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2)_0%,_transparent_50%)]"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Palette className="w-6 h-6" />
              </div>
              اختر نوع الخدمة المطلوبة
              <Badge className="bg-yellow-500 text-black px-3 py-1 animate-pulse">
                استشارة مجانية
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white h-12 text-right">
                <SelectValue placeholder="اختر الخدمة التي تحتاجها" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {designServices.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <SelectItem key={service.id} value={service.id} className="text-right">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-semibold">{service.title}</div>
                          <div className="text-sm text-gray-500">من {service.price} ر.س - {service.deliveryTime}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedService && (
              <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <h4 className="font-bold mb-2">{selectedService.title}</h4>
                <p className="text-sm mb-3 opacity-90">{selectedService.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">💰 من {selectedService.price} ر.س</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">⏰ {selectedService.deliveryTime}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-emerald-600 bg-clip-text text-transparent">
              📋 بيانات التواصل وتفاصيل المشروع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-lg font-semibold">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <User className="w-4 h-4 text-emerald-600" />
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
                    className="text-right h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 text-lg font-semibold">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
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
                    className="text-right h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
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
                    placeholder="اسم الشركة أو المؤسسة"
                    className="text-right h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="projectDetails" className="flex items-center gap-2 text-lg font-semibold">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-yellow-600" />
                    </div>
                    تفاصيل المشروع *
                  </Label>
                  <Textarea
                    id="projectDetails"
                    value={formData.projectDetails}
                    onChange={(e) => handleInputChange("projectDetails", e.target.value)}
                    placeholder="اشرح لنا تفاصيل مشروعك، أهدافك، الجمهور المستهدف، والرؤية المطلوبة..."
                    rows={4}
                    required
                    className="text-right resize-none border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="budget" className="text-lg font-semibold">
                      الميزانية المتوقعة
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl">
                        <SelectValue placeholder="اختر النطاق السعري المناسب" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="budget-1">أقل من 5,000 ريال</SelectItem>
                        <SelectItem value="budget-2">5,000 - 10,000 ريال</SelectItem>
                        <SelectItem value="budget-3">10,000 - 20,000 ريال</SelectItem>
                        <SelectItem value="budget-4">20,000 - 50,000 ريال</SelectItem>
                        <SelectItem value="budget-5">أكثر من 50,000 ريال</SelectItem>
                        <SelectItem value="budget-discuss">أفضل مناقشة الميزانية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timeline" className="text-lg font-semibold">
                      المدة الزمنية المطلوبة
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl">
                        <SelectValue placeholder="متى تحتاج المشروع" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="urgent">عاجل (أقل من أسبوع)</SelectItem>
                        <SelectItem value="week">خلال أسبوع</SelectItem>
                        <SelectItem value="two-weeks">خلال أسبوعين</SelectItem>
                        <SelectItem value="month">خلال شهر</SelectItem>
                        <SelectItem value="flexible">مرن في الوقت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="additionalRequirements" className="text-lg font-semibold">
                    متطلبات إضافية أو ملاحظات خاصة
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                    placeholder="أي متطلبات إضافية، ألوان مفضلة، أنماط معينة، أو ملاحظات خاصة..."
                    rows={3}
                    className="text-right resize-none border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  <p className="text-lg text-emerald-800 text-center font-semibold">
                    ⚡ سيتم التواصل معك من فريق التصميم خلال 24 ساعة مع خطة مفصلة لمشروعك
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.serviceType}
                  className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-700 text-white font-bold py-4 text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال طلب الخدمة
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

export default DesignServiceRequestForm;