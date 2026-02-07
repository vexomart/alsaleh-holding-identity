import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Globe, 
  Handshake, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Mail,
  Phone,
  User,
  Building,
  DollarSign,
  Calendar,
  MessageSquare,
  ChevronRight,
  Zap,
  Award,
  Lightbulb,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { supabase } from "@/integrations/supabase/client";

const Partnerships = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    businessDescription: "",
    expectedBudget: "",
    timeline: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const partnershipTypes = [
    { value: "strategic", label: "شراكة استراتيجية", icon: Target },
    { value: "technology", label: "شراكة تقنية", icon: Zap },
    { value: "commercial", label: "شراكة تجارية", icon: DollarSign },
    { value: "investment", label: "شراكة استثمارية", icon: TrendingUp },
    { value: "distribution", label: "شراكة توزيع", icon: Globe },
    { value: "innovation", label: "شراكة ابتكار", icon: Lightbulb }
  ];

  const benefits = [
    {
      icon: Building2,
      title: "نمو الأعمال",
      description: "توسيع نطاق أعمالك من خلال شراكة استراتيجية مدروسة"
    },
    {
      icon: Users,
      title: "خبرات متكاملة",
      description: "الاستفادة من خبراتنا المتنوعة في مختلف المجالات"
    },
    {
      icon: Shield,
      title: "أمان وثقة",
      description: "شراكات آمنة ومضمونة مع ضمانات قانونية كاملة"
    },
    {
      icon: Award,
      title: "جودة عالية",
      description: "معايير جودة عالمية في جميع مشاريعنا وخدماتنا"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('partnership-form', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلب الشراكة بنجاح",
        description: "سنتواصل معكم خلال 24 ساعة لمناقشة تفاصيل الشراكة",
      });

      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        partnershipType: "",
        businessDescription: "",
        expectedBudget: "",
        timeline: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلب الشراكة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2">
              <Handshake className="w-4 h-4 mr-2" />
              شراكات استراتيجية
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              ابدأ شراكة
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ناجحة </span>
              معنا
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              انضم إلى شبكة شركائنا الناجحين واستفد من خبراتنا الواسعة في بناء أعمال مستدامة ومربحة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4">
                ابدأ الآن
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4">
                تعرف على شركائنا
                <ChevronRight className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار الشراكة معنا؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نقدم لك مزايا فريدة تضمن نجاح شراكتنا وتحقيق أهدافك التجارية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Form Info */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ابدأ رحلة الشراكة معنا
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                املأ النموذج التالي وسنتواصل معك خلال 24 ساعة لمناقشة فرص الشراكة المتاحة
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">أنواع الشراكات المتاحة:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partnershipTypes.map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mt-8">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  ما يمكنك توقعه:
                </h4>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    رد سريع خلال 24 ساعة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    استشارة مجانية لتقييم الفرص
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    خطة شراكة مخصصة لاحتياجاتك
                  </li>
                </ul>
              </div>
            </div>

            {/* Partnership Form */}
            <div className="animate-fade-in">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Handshake className="w-6 h-6" />
                    طلب شراكة جديد
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    املأ البيانات التالية وسنتواصل معك قريباً
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          اسم الشركة *
                        </label>
                        <Input
                          placeholder="اسم شركتك"
                          value={formData.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الشخص المسؤول *
                        </label>
                        <Input
                          placeholder="اسم الشخص المسؤول"
                          value={formData.contactPerson}
                          onChange={(e) => handleChange('contactPerson', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف *
                        </label>
                        <Input
                          placeholder="+966 5XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        نوع الشراكة المطلوب *
                      </label>
                      <select
                        value={formData.partnershipType}
                        onChange={(e) => handleChange('partnershipType', e.target.value)}
                        required
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر نوع الشراكة</option>
                        {partnershipTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        وصف الأعمال *
                      </label>
                      <Textarea
                        placeholder="اكتب وصفاً مختصراً عن أعمال شركتك ومجال عملها"
                        value={formData.businessDescription}
                        onChange={(e) => handleChange('businessDescription', e.target.value)}
                        required
                        className="min-h-24"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          الميزانية المتوقعة
                        </label>
                        <select
                          value={formData.expectedBudget}
                          onChange={(e) => handleChange('expectedBudget', e.target.value)}
                          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">اختر نطاق الميزانية</option>
                          <option value="under-100k">أقل من 100,000 ريال</option>
                          <option value="100k-500k">100,000 - 500,000 ريال</option>
                          <option value="500k-1m">500,000 - 1,000,000 ريال</option>
                          <option value="1m-5m">1,000,000 - 5,000,000 ريال</option>
                          <option value="over-5m">أكثر من 5,000,000 ريال</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          الإطار الزمني
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => handleChange('timeline', e.target.value)}
                          className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">اختر الإطار الزمني</option>
                          <option value="immediate">فوري (خلال شهر)</option>
                          <option value="3-months">خلال 3 أشهر</option>
                          <option value="6-months">خلال 6 أشهر</option>
                          <option value="1-year">خلال سنة</option>
                          <option value="flexible">مرن</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        ملاحظات إضافية
                      </label>
                      <Textarea
                        placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        className="min-h-24"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                    >
                      {isSubmitting ? "جاري الإرسال..." : "إرسال طلب الشراكة"}
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
    </div>
  );
};

export default Partnerships;