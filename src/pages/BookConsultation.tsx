import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import BackButton from "@/components/ui/back-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Building2, 
  Laptop, 
  Calculator, 
  Users, 
  TrendingUp, 
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const services = [
  {
    id: "business-consulting",
    title: "الاستشارات التجارية",
    description: "استشارات شاملة لتطوير أعمالك وتحسين الأداء",
    icon: Building2,
    features: ["تحليل السوق", "وضع الاستراتيجيات", "تطوير الأعمال", "إدارة المخاطر"]
  },
  {
    id: "digital-transformation",
    title: "التحول الرقمي",
    description: "حلول تقنية متطورة لرقمنة أعمالك",
    icon: Laptop,
    features: ["أتمتة العمليات", "التطبيقات الذكية", "الحلول السحابية", "التكامل الرقمي"]
  },
  {
    id: "financial-planning",
    title: "التخطيط المالي",
    description: "إدارة وتخطيط مالي احترافي لمؤسستك",
    icon: Calculator,
    features: ["التخطيط المالي", "تحليل الاستثمارات", "إدارة الميزانية", "التقارير المالية"]
  },
  {
    id: "strategic-consulting",
    title: "الاستشارات الاستراتيجية",
    description: "وضع استراتيجيات طويلة المدى للنمو المستدام",
    icon: TrendingUp,
    features: ["التخطيط الاستراتيجي", "تحليل المنافسين", "فرص النمو", "تطوير الأداء"]
  },
  {
    id: "risk-management",
    title: "إدارة المخاطر",
    description: "تحديد وإدارة المخاطر المؤسسية بفعالية",
    icon: Shield,
    features: ["تقييم المخاطر", "خطط الطوارئ", "إدارة الأزمات", "الامتثال التنظيمي"]
  },
  {
    id: "team-development",
    title: "تطوير الفرق",
    description: "برامج تدريب وتطوير للموارد البشرية",
    icon: Users,
    features: ["التدريب المتخصص", "بناء الفرق", "القيادة", "تطوير المهارات"]
  }
];

const consultationTypes = [
  { value: "initial", label: "استشارة أولية (مجانية - 30 دقيقة)" },
  { value: "detailed", label: "استشارة تفصيلية (90 دقيقة)" },
  { value: "strategic", label: "جلسة استراتيجية (3 ساعات)" },
  { value: "workshop", label: "ورشة عمل جماعية (يوم كامل)" }
];

const timeSlots = [
  "9:00 ص", "10:00 ص", "11:00 ص", "12:00 م",
  "1:00 م", "2:00 م", "3:00 م", "4:00 م", "5:00 م"
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  service: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

export default function BookConsultation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    service: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('consultation-booking', {
        body: formData
      });

      if (error) throw error;

      toast.success("تم إرسال طلب الاستشارة بنجاح! سنتواصل معك قريباً");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        service: "",
        consultationType: "",
        preferredDate: "",
        preferredTime: "",
        message: ""
      });

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast.error("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <PageHeader 
        title="احجز استشارة مجانية"
        description="احصل على استشارة مخصصة من خبرائنا لتطوير أعمالك"
      >
        <BackButton className="absolute top-4 right-4" />
      </PageHeader>

      <div className="container mx-auto px-6 py-12">
        {/* Services Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">خدماتنا الاستشارية</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الاستشارية المتخصصة لمساعدة مؤسستك على النمو والتطور
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Consultation Benefits */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">لماذا تختار استشاراتنا؟</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">خبراء متخصصون</h4>
                <p className="text-sm text-muted-foreground">فريق من الخبراء المعتمدين بخبرة تزيد عن 15 عاماً</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">نتائج مضمونة</h4>
                <p className="text-sm text-muted-foreground">حلول مبتكرة ومثبتة لتحقيق أهدافك التجارية</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="font-semibold mb-2">سرية تامة</h4>
                <p className="text-sm text-muted-foreground">حماية معلوماتك وبياناتك بأعلى مستويات الأمان</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">احجز استشارتك الآن</CardTitle>
              <CardDescription>
                املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة لتأكيد موعد الاستشارة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">اسم الشركة/المؤسسة</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="اسم شركتك أو مؤسستك"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="position">المنصب/الوظيفة</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="منصبك في الشركة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">نوع الخدمة المطلوبة *</Label>
                    <Select onValueChange={(value) => handleInputChange('service', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationType">نوع الاستشارة *</Label>
                  <Select onValueChange={(value) => handleInputChange('consultationType', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الاستشارة" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">التاريخ المفضل</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">الوقت المفضل</Label>
                    <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الوقت المناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">تفاصيل إضافية</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="أخبرنا عن التحديات التي تواجهها أو أهدافك المحددة..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "احجز الاستشارة الآن"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">أو تواصل معنا مباشرة</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <Phone className="w-5 h-5 text-primary" />
              <span>0555812567</span>
            </div>
            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <Mail className="w-5 h-5 text-primary" />
              <span>info@alialshehriholding.com</span>
            </div>
            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}