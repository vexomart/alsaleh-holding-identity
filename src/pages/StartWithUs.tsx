import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Crown,
  Rocket,
  Heart,
  Shield,
  Star,
  Zap,
  Globe,
  Award,
  Users,
  Code,
  Palette,
  Lightbulb,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Building2,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from "lucide-react";

const StartWithUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    service: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "تم الإرسال بنجاح",
          description: "سنتواصل معكم قريباً لبدء رحلة النجاح سوياً",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          service: ""
        });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة",
        variant: "destructive",
      });
    }
  };

  const services = [
    {
      title: "تطوير المواقع والتطبيقات",
      description: "حلول تقنية متطورة تواكب أحدث التقنيات العالمية",
      icon: Code,
      features: ["تطبيقات الموبايل", "المواقع الإلكترونية", "الأنظمة المتكاملة"]
    },
    {
      title: "التصميم والهوية البصرية",
      description: "تصاميم إبداعية تعكس رؤية علامتكم التجارية",
      icon: Palette,
      features: ["الهوية البصرية", "تصميم الواجهات", "المواد التسويقية"]
    },
    {
      title: "الاستشارات الإستراتيجية",
      description: "خطط استراتيجية مدروسة لتحقيق أهدافكم",
      icon: Target,
      features: ["التخطيط الاستراتيجي", "تطوير الأعمال", "الاستشارات التقنية"]
    },
    {
      title: "الذكاء الاصطناعي",
      description: "حلول ذكية تعزز من كفاءة أعمالكم",
      icon: Lightbulb,
      features: ["التحليل الذكي", "الأتمتة", "المساعدات الذكية"]
    }
  ];

  const features = [
    {
      title: "شركة سعودية 100%",
      description: "نفتخر بكوننا شركة سعودية تساهم في تحقيق رؤية 2030",
      icon: Crown,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "فريق خبراء متخصص",
      description: "فريق من المحترفين ذوي الخبرة العالمية والمعرفة المحلية",
      icon: Users,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "تقنيات حديثة ومتطورة",
      description: "نستخدم أحدث التقنيات والأدوات لضمان جودة عالية",
      icon: Rocket,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "دعم متواصل 24/7",
      description: "فريق الدعم متاح على مدار الساعة لخدمتكم",
      icon: Shield,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "500+", label: "عميل راضٍ", icon: Heart },
    { number: "1000+", label: "مشروع مكتمل", icon: CheckCircle },
    { number: "8+", label: "سنوات خبرة", icon: Star },
    { number: "50+", label: "خبير متخصص", icon: Award }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <PageHeader
          title="ابدأ معنا رحلة النجاح"
          description="لستم مجرد عملاء... أنتم شركاء النجاح"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="relative">
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-2" />
                شركة سعودية 100%
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                معتمدة دولياً
              </Badge>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                رائدة في التقنية
              </Badge>
            </div>
          </div>
        </PageHeader>

        <div className="container mx-auto px-6 py-16">
          {/* Quote Section */}
          <div className="text-center mb-16">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -top-8 -left-8 text-6xl text-blue-200 font-serif">"</div>
              <div className="absolute -bottom-8 -right-8 text-6xl text-blue-200 font-serif rotate-180">"</div>
              <blockquote className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-6 relative">
                نحن لا نقدم خدمات فقط، بل نبني شراكات نجاح تدوم
                <br />
                <span className="text-blue-600">أنتم لستم عملاء... أنتم شركاء النجاح</span>
              </blockquote>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="font-medium">فلسفتنا في العمل</span>
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" 
                     style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`}}></div>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                خدماتنا المميزة
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                نقدم مجموعة شاملة من الحلول التقنية والاستشارية المتطورة
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  ابدأ رحلتك معنا اليوم
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  تواصل معنا الآن ودعنا نحول أفكارك إلى واقع رقمي مبهر
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">اتصل بنا</div>
                    <div className="text-blue-600 font-bold">+966 555 812 567</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">واتساب</div>
                    <div className="text-green-600 font-bold">+966 555 812 567</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">البريد الإلكتروني</div>
                    <div className="text-purple-600 font-bold">info@alialshehriholding.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">موقعنا</div>
                    <div className="text-orange-600 font-bold">جدة، المملكة العربية السعودية</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">ساعات العمل</div>
                    <div className="text-indigo-600 font-bold">الأحد - الخميس: 8:00 ص - 6:00 م</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  ابدأ مشروعك معنا
                </h3>
                <p className="text-gray-600">
                  أخبرنا عن مشروعك وسنتواصل معك خلال 24 ساعة
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الجوال *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="+966 5XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="example@domain.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">اسم الشركة</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="mt-1"
                      placeholder="شركة المثال المحدودة"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">الخدمة المطلوبة</Label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">اختر الخدمة المطلوبة</option>
                    <option value="web-development">تطوير المواقع</option>
                    <option value="mobile-apps">تطبيقات الموبايل</option>
                    <option value="design">التصميم والهوية البصرية</option>
                    <option value="consulting">الاستشارات</option>
                    <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                    <option value="other">خدمة أخرى</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">تفاصيل المشروع *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="mt-1"
                    placeholder="أخبرنا عن مشروعك وما تريد تحقيقه..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium"
                >
                  <Send className="w-5 h-5 mr-2" />
                  ابدأ رحلة النجاح معنا
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                هل أنت مستعد لتحويل أفكارك إلى واقع؟
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                انضم إلى أكثر من 500 شريك نجاح حول العالم
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                  asChild
                >
                  <a href="#contact-form">
                    ابدأ الآن
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                  asChild
                >
                  <a href="/portfolio">
                    شاهد أعمالنا
                    <Globe className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StartWithUs;