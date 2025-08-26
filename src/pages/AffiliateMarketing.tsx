import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Globe,
  Star,
  CheckCircle,
  ArrowLeft,
  Target,
  Zap,
  BarChart3,
  Crown,
  Shield,
  Rocket,
  Heart,
  Gift,
  Phone,
  Mail
} from "lucide-react";

const AffiliateMarketing = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    socialMedia: "",
    experienceLevel: "",
    expectedRevenue: "",
    marketingChannels: "",
    targetAudience: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const commissionTiers = [
    {
      level: "البرونزي",
      minSales: "0 - 10,000 ريال",
      commission: "5%",
      color: "from-orange-400 to-orange-600",
      icon: Shield,
      benefits: ["دعم أساسي", "مواد تسويقية", "تقارير شهرية"]
    },
    {
      level: "الفضي", 
      minSales: "10,001 - 50,000 ريال",
      commission: "8%",
      color: "from-gray-400 to-gray-600",
      icon: Star,
      benefits: ["دعم متقدم", "مواد تسويقية حصرية", "تقارير أسبوعية", "مكافآت إضافية"]
    },
    {
      level: "الذهبي",
      minSales: "50,001 - 100,000 ريال", 
      commission: "12%",
      color: "from-yellow-400 to-yellow-600",
      icon: Crown,
      benefits: ["دعم VIP", "حملات مخصصة", "تقارير يومية", "مكافآت شهرية", "أولوية في الدفع"]
    },
    {
      level: "البلاتيني",
      minSales: "100,001+ ريال",
      commission: "15%",
      color: "from-purple-400 to-purple-600", 
      icon: Rocket,
      benefits: ["مدير حساب مخصص", "استراتيجيات مخصصة", "تحليلات متقدمة", "مكافآت أسبوعية", "برامج حصرية"]
    }
  ];

  const topCompanies = [
    { name: "أمازون", commission: "1-10%", category: "التجارة الإلكترونية" },
    { name: "علي إكسبرس", commission: "2-8%", category: "التجارة الإلكترونية" },
    { name: "نون", commission: "2-12%", category: "التجارة الإلكترونية السعودية" },
    { name: "شين", commission: "5-15%", category: "الأزياء والاكسسوارات" },
    { name: "بوكينغ", commission: "25-40%", category: "السفر والضيافة" },
    { name: "نتفليكس", commission: "مبلغ ثابت", category: "الترفيه والبث" },
    { name: "أوبر", commission: "5-20%", category: "النقل والتوصيل" },
    { name: "كورسيرا", commission: "20-45%", category: "التعليم الإلكتروني" },
    { name: "شوبيفاي", commission: "200% من الرسوم الشهرية", category: "منصات التجارة الإلكترونية" },
    { name: "هوست جيتور", commission: "50-125$", category: "الاستضافة والتقنية" }
  ];

  const marketingFeatures = [
    {
      title: "تتبع متقدم",
      description: "نظام تتبع احترافي لكل النقرات والتحويلات",
      icon: BarChart3
    },
    {
      title: "دفع سريع",
      description: "دفع العمولات خلال 30 يوم من إتمام الصفقة",
      icon: Zap
    },
    {
      title: "دعم مستمر",
      description: "فريق دعم متخصص متاح 24/7",
      icon: Heart
    },
    {
      title: "مواد تسويقية",
      description: "بنرات واعلانات جاهزة عالية الجودة",
      icon: Gift
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('affiliate-form', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: "سنتواصل معك قريباً لمناقشة برنامج التسويق بالعمولة.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        socialMedia: "",
        experienceLevel: "",
        expectedRevenue: "",
        marketingChannels: "",
        targetAudience: "",
        message: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              برنامج التسويق بالعمولة
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              انضم إلى شبكة المسوقين المحترفين واحصل على عمولات مجزية من خلال تسويق خدماتنا المتميزة
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <DollarSign className="w-5 h-5 mr-2" />
                عمولات تصل إلى 15%
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Users className="w-5 h-5 mr-2" />
                +500 مسوق شريك
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">مستويات العمولة</h2>
            <p className="text-xl text-gray-600">كلما زادت مبيعاتك، زادت عمولتك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier, index) => {
              const IconComponent = tier.icon;
              return (
                <Card key={index} className="relative overflow-hidden hover-scale animate-fade-in group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader className="text-center relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{tier.level}</CardTitle>
                    <CardDescription className="text-sm">{tier.minSales}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <div className="text-3xl font-bold text-green-600 mb-4">{tier.commission}</div>
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Companies Table */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">أمثلة من الشركات العالمية</h2>
            <p className="text-xl text-gray-600">تعرف على نماذج التسويق بالعمولة من أكبر الشركات العالمية</p>
          </div>

          <Card className="overflow-hidden animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="w-8 h-8 mr-3 text-blue-600" />
                برامج العمولة العالمية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-6 text-right font-semibold text-gray-900">الشركة</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-900">نسبة العمولة</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-900">التصنيف</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-900">التقييم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCompanies.map((company, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{company.name}</td>
                        <td className="py-4 px-6 text-green-600 font-semibold">{company.commission}</td>
                        <td className="py-4 px-6 text-gray-600">{company.category}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">مميزات برنامجنا</h2>
            <p className="text-xl text-gray-600">نوفر لك كل ما تحتاجه للنجاح في التسويق بالعمولة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover-scale animate-fade-in group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">طلب الانضمام لبرنامج التسويق بالعمولة</h2>
            <p className="text-xl text-gray-600">املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة</p>
          </div>

          <Card className="shadow-2xl animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-2">نموذج التقديم</CardTitle>
              <CardDescription className="text-lg">
                انضم إلى فريق المسوقين المحترفين واحصل على دخل إضافي مجزي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-right text-gray-700 font-medium">
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right text-gray-700 font-medium">
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                      placeholder="example@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right text-gray-700 font-medium">
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-right text-gray-700 font-medium">
                      اسم الشركة (اختياري)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="text-right"
                      placeholder="اسم شركتك أو مؤسستك"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-right text-gray-700 font-medium">
                      الموقع الإلكتروني
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="text-right"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialMedia" className="text-right text-gray-700 font-medium">
                      حسابات التواصل الاجتماعي
                    </Label>
                    <Input
                      id="socialMedia"
                      name="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleInputChange}
                      className="text-right"
                      placeholder="روابط حساباتك على وسائل التواصل"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel" className="text-right text-gray-700 font-medium">
                      مستوى الخبرة في التسويق
                    </Label>
                    <Input
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="text-right"
                      placeholder="مبتدئ / متوسط / متقدم / خبير"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedRevenue" className="text-right text-gray-700 font-medium">
                      الإيرادات المتوقعة شهرياً
                    </Label>
                    <Input
                      id="expectedRevenue"
                      name="expectedRevenue"
                      value={formData.expectedRevenue}
                      onChange={handleInputChange}
                      className="text-right"
                      placeholder="المبلغ المتوقع بالريال السعودي"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketingChannels" className="text-right text-gray-700 font-medium">
                    قنوات التسويق التي تستخدمها
                  </Label>
                  <Input
                    id="marketingChannels"
                    name="marketingChannels"
                    value={formData.marketingChannels}
                    onChange={handleInputChange}
                    className="text-right"
                    placeholder="وسائل التواصل، البريد الإلكتروني، SEO، إعلانات مدفوعة، إلخ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-right text-gray-700 font-medium">
                    الجمهور المستهدف
                  </Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="text-right"
                    placeholder="وصف موجز عن جمهورك المستهدف"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-right text-gray-700 font-medium">
                    رسالة إضافية
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="text-right resize-none"
                    placeholder="أخبرنا المزيد عن خبرتك وخططك التسويقية..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Target className="w-5 h-5 mr-2" />
                      إرسال طلب الانضمام
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-xl animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-4">تواصل مع فريق التسويق بالعمولة</CardTitle>
              <CardDescription className="text-lg">
                هل لديك أسئلة حول برنامج التسويق بالعمولة؟ تواصل معنا مباشرة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">اتصل بنا</h3>
                    <a href="tel:+966555812567" className="text-blue-600 hover:text-blue-700 transition-colors">
                      +966 555 812 567
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">راسلنا</h3>
                    <a href="mailto:affiliate@alialshehriholding.com" className="text-green-600 hover:text-green-700 transition-colors">
                      affiliate@alialshehriholding.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliateMarketing;