import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  DollarSign, 
  Clock, 
  MessageCircle,
  Send,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
}

const BusinessServiceRequestForm = ({ isOpen, onClose, selectedService }: BusinessServiceRequestFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    serviceType: selectedService,
    projectDescription: "",
    budget: "",
    timeline: "",
    objectives: "",
    currentChallenges: "",
    additionalNotes: ""
  });

  const budgetOptions = [
    "أقل من 10,000 ريال",
    "10,000 - 25,000 ريال", 
    "25,000 - 50,000 ريال",
    "50,000 - 100,000 ريال",
    "أكثر من 100,000 ريال",
    "أفضل عدم التحديد"
  ];

  const timelineOptions = [
    "خلال أسبوع",
    "خلال شهر",
    "خلال 3 أشهر",
    "خلال 6 أشهر",
    "أكثر من 6 أشهر",
    "مرن حسب الجودة"
  ];

  const serviceTypes = [
    "الاستشارات التجارية",
    "التحول الرقمي",
    "التخطيط المالي",
    "إدارة المشاريع",
    "تحليل السوق",
    "ذكاء الأعمال",
    "استشارة شاملة",
    "خدمة مخصصة"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('business-service-request', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "✅ تم إرسال طلبك بنجاح!",
        description: "سيتواصل معك فريقنا خلال 24 ساعة لمناقشة تفاصيل مشروعك",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        serviceType: "",
        projectDescription: "",
        budget: "",
        timeline: "",
        objectives: "",
        currentChallenges: "",
        additionalNotes: ""
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting business service request:', error);
      toast({
        title: "❌ خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  طلب خدمة أعمال
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  املأ النموذج وسيتواصل معك فريقنا المتخصص
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedService && (
            <Badge className="w-fit bg-blue-100 text-blue-800">
              <Building2 className="w-4 h-4 ml-2" />
              {selectedService}
            </Badge>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* معلومات التواصل */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              معلومات التواصل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="اكتب اسمك الكامل"
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@company.com"
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+966 5X XXX XXXX"
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">المنصب الوظيفي</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="مدير عام، مدير التقنية، إلخ"
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company">اسم الشركة *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="اكتب اسم شركتك"
                  required
                  className="text-right"
                />
              </div>
            </div>
          </div>

          {/* تفاصيل المشروع */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              تفاصيل المشروع
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">نوع الخدمة المطلوبة *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange("serviceType", value)}
                  required
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription">وصف المشروع والاحتياجات *</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                  placeholder="اشرح لنا تفاصيل مشروعك والنتائج المطلوبة..."
                  required
                  rows={4}
                  className="text-right resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objectives">الأهداف المرجوة من المشروع</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange("objectives", e.target.value)}
                  placeholder="ما هي الأهداف التي تريد تحقيقها من هذا المشروع؟"
                  rows={3}
                  className="text-right resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentChallenges">التحديات الحالية</Label>
                <Textarea
                  id="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                  placeholder="ما هي التحديات الحالية التي تواجهها في أعمالك؟"
                  rows={3}
                  className="text-right resize-none"
                />
              </div>
            </div>
          </div>

          {/* الميزانية والوقت */}
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              الميزانية والإطار الزمني
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">الميزانية المتوقعة</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => handleInputChange("budget", value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الميزانية المناسبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((budget) => (
                      <SelectItem key={budget} value={budget}>
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">الإطار الزمني المطلوب</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => handleInputChange("timeline", value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="متى تريد بدء المشروع؟" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((timeline) => (
                      <SelectItem key={timeline} value={timeline}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ملاحظات إضافية */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="أي معلومات إضافية تريد مشاركتها معنا..."
              rows={3}
              className="text-right resize-none"
            />
          </div>

          {/* أزرار الإجراء */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 py-6 text-lg border-gray-300 hover:bg-gray-50 rounded-xl"
            >
              إلغاء
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <MessageCircle className="w-4 h-4 inline ml-1" />
            سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل مشروعك وتقديم عرض سعر مخصص
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessServiceRequestForm;