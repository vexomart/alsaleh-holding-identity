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
  Send,
  Monitor,
  Smartphone,
  Tablet,
  Quote,
  Calendar,
  Briefcase,
  ThumbsUp,
  Eye,
  Database,
  CloudLightning,
  Lock,
  Settings,
  BookOpen,
  FileText,
  ChevronRight,
  Layers,
  Network,
  BarChart3,
  Headphones
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
    { number: "٥٠٠+", label: "عميل راضٍ", icon: Heart },
    { number: "١٠٠٠+", label: "مشروع مكتمل", icon: CheckCircle },
    { number: "٨+", label: "سنوات خبرة", icon: Star },
    { number: "٥٠+", label: "خبير متخصص", icon: Award }
  ];

  const timeline = [
    { year: "٢٠١٦", title: "تأسيس الشركة", description: "بداية الرحلة مع رؤية طموحة" },
    { year: "٢٠١٨", title: "أول ١٠٠ عميل", description: "تحقيق ثقة العملاء الأوائل" },
    { year: "٢٠٢٠", title: "التوسع الإقليمي", description: "فتح فروع في دول الخليج" },
    { year: "٢٠٢٢", title: "شراكات عالمية", description: "شراكة مع عمالقة التقنية" },
    { year: "٢٠٢٤", title: "الريادة المحلية", description: "الشركة الرائدة في المنطقة" }
  ];

  const technologies = [
    { name: "React & Next.js", icon: Code, category: "Frontend" },
    { name: "Node.js & Python", icon: Database, category: "Backend" },
    { name: "AWS & Azure", icon: CloudLightning, category: "Cloud" },
    { name: "MongoDB & PostgreSQL", icon: Database, category: "Database" },
    { name: "Docker & Kubernetes", icon: Layers, category: "DevOps" },
    { name: "AI & Machine Learning", icon: Lightbulb, category: "AI/ML" }
  ];

  const faqs = [
    {
      question: "كم يستغرق تطوير الموقع الإلكتروني؟",
      answer: "يختلف حسب تعقيد المشروع، لكن المواقع البسيطة تستغرق ٢-٤ أسابيع، والمعقدة ٦-١٢ أسبوع."
    },
    {
      question: "هل تقدمون دعم فني بعد التسليم؟",
      answer: "نعم، نقدم دعم فني مجاني لمدة ٦ أشهر، وخدمات صيانة مدفوعة بعد ذلك."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل جميع طرق الدفع: تحويل بنكي، بطاقات ائتمانية، محافظ رقمية، وأقساط ميسرة."
    },
    {
      question: "هل يمكن تطوير تطبيق للجوال؟",
      answer: "نعم، نطور تطبيقات iOS و Android بتقنيات حديثة مثل React Native و Flutter."
    }
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
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Crown className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                شركة سعودية ١٠٠%
              </Badge>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                معتمدة دولياً
              </Badge>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Award className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                رائدة في التقنية
              </Badge>
            </div>
          </div>
        </PageHeader>

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          {/* Quote Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="relative max-w-4xl mx-auto px-4">
              <div className="absolute -top-4 sm:-top-8 -left-4 sm:-left-8 text-4xl sm:text-6xl text-blue-200 font-serif">"</div>
              <div className="absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 text-4xl sm:text-6xl text-blue-200 font-serif rotate-180">"</div>
              <blockquote className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-4 sm:mb-6 relative px-8 sm:px-16">
                نحن لا نقدم خدمات فقط، بل نبني شراكات نجاح تدوم
                <br className="hidden sm:block" />
                <span className="text-blue-600 block mt-2 sm:inline sm:mt-0">أنتم لستم عملاء... أنتم شركاء النجاح</span>
              </blockquote>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 animate-pulse" />
                <span className="font-medium text-sm sm:text-base">فلسفتنا في العمل</span>
                <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 animate-fade-in">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" 
                     style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`}}></div>
                <div className="relative">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Technologies Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                التقنيات التي نستخدمها
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                نعمل بأحدث التقنيات والأدوات المتطورة لضمان جودة عالية
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {technologies.map((tech, index) => (
                <Card key={index} className="p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tech.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm mb-1">{tech.name}</h4>
                  <p className="text-gray-500 text-xs">{tech.category}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                خدماتنا المميزة
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                نقدم مجموعة شاملة من الحلول التقنية والاستشارية المتطورة
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <Card key={index} className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 sm:mb-6">
                      <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <service.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{service.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                رحلتنا عبر السنوات
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                من البداية المتواضعة إلى الريادة في السوق السعودي
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full hidden md:block"></div>
              
              <div className="space-y-8 sm:space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10"></div>
                    
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                      <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex md:hidden items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-lg sm:text-xl font-bold text-blue-600">{item.year}</span>
                        </div>
                        <div className="hidden md:block text-lg sm:text-xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                الأسئلة الشائعة
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                إجابات على أكثر الأسئلة التي يطرحها عملاؤنا
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Contact Info */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  ابدأ رحلتك معنا اليوم
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  تواصل معنا الآن ودعنا نحول أفكارك إلى واقع رقمي مبهر
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">اتصل بنا</div>
                    <div className="text-blue-600 font-bold text-sm sm:text-base">٠٥٥٥٨١٢٥٦٧</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">واتساب</div>
                    <div className="text-green-600 font-bold text-sm sm:text-base">٠٥٥٥٨١٢٥٦٧</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">البريد الإلكتروني</div>
                    <div className="text-purple-600 font-bold text-xs sm:text-sm break-all">info@alialshehriholding.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-lg">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">موقعنا</div>
                    <div className="text-orange-600 font-bold text-sm sm:text-base">جدة، المملكة العربية السعودية</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-indigo-50 rounded-lg">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">ساعات العمل</div>
                    <div className="text-indigo-600 font-bold text-xs sm:text-sm">الأحد - الخميس: ٨:٠٠ ص - ٦:٠٠ م</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-6 sm:p-8 shadow-xl">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  ابدأ مشروعك معنا
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  أخبرنا عن مشروعك وسنتواصل معك خلال ٢٤ ساعة
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-1 text-sm sm:text-base"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm sm:text-base">رقم الجوال *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="mt-1 text-sm sm:text-base"
                      placeholder="٠٥XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm sm:text-base">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-1 text-sm sm:text-base"
                      placeholder="example@domain.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-sm sm:text-base">اسم الشركة</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="mt-1 text-sm sm:text-base"
                      placeholder="شركة المثال المحدودة"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service" className="text-sm sm:text-base">الخدمة المطلوبة</Label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm sm:text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  <Label htmlFor="message" className="text-sm sm:text-base">تفاصيل المشروع *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="mt-1 text-sm sm:text-base resize-none"
                    placeholder="أخبرنا عن مشروعك وما تريد تحقيقه..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 sm:py-3 text-sm sm:text-lg font-medium"
                >
                  <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  ابدأ رحلة النجاح معنا
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Button>
              </form>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 sm:mt-16 p-8 sm:p-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                هل أنت مستعد لتحويل أفكارك إلى واقع؟
              </h2>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100">
                انضم إلى أكثر من ٥٠٠ شريك نجاح حول العالم
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  asChild
                >
                  <a href="#contact-form">
                    ابدأ الآن
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  asChild
                >
                  <a href="/ready-projects">
                    شاهد أعمالنا
                    <Globe className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
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