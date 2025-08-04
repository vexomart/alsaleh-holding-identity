import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Search, 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  CreditCard, 
  Shield, 
  Phone, 
  Mail, 
  MessageCircle, 
  Video, 
  Download, 
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  ChevronRight,
  ExternalLink,
  Building2,
  Users,
  Target,
  Zap
} from "lucide-react";

const UserGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const guideCategories = [
    {
      id: "getting-started",
      title: "البدء",
      icon: PlayCircle,
      color: "from-green-500 to-emerald-600",
      description: "كيفية بدء استخدام خدماتنا",
      guides: [
        {
          title: "إنشاء حساب جديد",
          description: "خطوات تسجيل حساب جديد في منصتنا",
          duration: "5 دقائق",
          difficulty: "سهل"
        },
        {
          title: "إعداد الملف الشخصي",
          description: "كيفية إكمال بياناتك الشخصية",
          duration: "10 دقائق",
          difficulty: "سهل"
        },
        {
          title: "تفعيل الحساب",
          description: "خطوات تفعيل حسابك عبر البريد الإلكتروني",
          duration: "3 دقائق",
          difficulty: "سهل"
        }
      ]
    },
    {
      id: "services",
      title: "الخدمات",
      icon: Building2,
      color: "from-blue-500 to-indigo-600",
      description: "دليل شامل لجميع خدماتنا",
      guides: [
        {
          title: "طلب خدمة جديدة",
          description: "كيفية طلب أي من خدماتنا المتاحة",
          duration: "15 دقائق",
          difficulty: "متوسط"
        },
        {
          title: "متابعة طلباتك",
          description: "تتبع حالة طلباتك المرسلة",
          duration: "5 دقائق",
          difficulty: "سهل"
        },
        {
          title: "إدارة المشاريع",
          description: "كيفية إدارة مشاريعك الجارية",
          duration: "20 دقائق",
          difficulty: "متقدم"
        }
      ]
    },
    {
      id: "payments",
      title: "المدفوعات",
      icon: CreditCard,
      color: "from-purple-500 to-violet-600",
      description: "دليل أنظمة الدفع والفواتير",
      guides: [
        {
          title: "طرق الدفع المتاحة",
          description: "جميع وسائل الدفع المقبولة",
          duration: "8 دقائق",
          difficulty: "سهل"
        },
        {
          title: "إدارة الفواتير",
          description: "عرض وتحميل فواتيرك",
          duration: "10 دقائق",
          difficulty: "سهل"
        },
        {
          title: "الاشتراكات الشهرية",
          description: "إدارة اشتراكاتك وتجديدها",
          duration: "12 دقائق",
          difficulty: "متوسط"
        }
      ]
    },
    {
      id: "support",
      title: "الدعم الفني",
      icon: Headphones,
      color: "from-orange-500 to-red-600",
      description: "كيفية الحصول على المساعدة",
      guides: [
        {
          title: "التواصل مع الدعم",
          description: "طرق التواصل مع فريق الدعم الفني",
          duration: "5 دقائق",
          difficulty: "سهل"
        },
        {
          title: "الإبلاغ عن مشكلة",
          description: "كيفية الإبلاغ عن مشاكل تقنية",
          duration: "10 دقائق",
          difficulty: "سهل"
        },
        {
          title: "الصيانة المجدولة",
          description: "معرفة مواعيد الصيانة المجدولة",
          duration: "3 دقائق",
          difficulty: "سهل"
        }
      ]
    }
  ];

  const frequentlyAskedQuestions = [
    {
      question: "كيف يمكنني إعادة تعيين كلمة المرور؟",
      answer: "يمكنك إعادة تعيين كلمة المرور من خلال النقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، ثم إدخال بريدك الإلكتروني المسجل لدينا. ستصلك رسالة إعادة تعيين خلال دقائق.",
      category: "الحساب"
    },
    {
      question: "ما هي مدة تنفيذ المشاريع؟",
      answer: "تختلف مدة التنفيذ حسب نوع وحجم المشروع. المشاريع البسيطة تستغرق 1-2 أسبوع، المتوسطة 2-4 أسابيع، والمعقدة قد تستغرق شهر أو أكثر. نقدم لك جدولاً زمنياً مفصلاً عند بداية كل مشروع.",
      category: "المشاريع"
    },
    {
      question: "هل تقدمون ضمان على الخدمات؟",
      answer: "نعم، نقدم ضمان شامل على جميع خدماتنا لمدة 12 شهراً من تاريخ التسليم، بالإضافة إلى الدعم الفني المجاني لمدة 6 أشهر.",
      category: "الضمان"
    },
    {
      question: "كيف يمكنني تتبع تقدم مشروعي؟",
      answer: "يمكنك تتبع تقدم مشروعك من خلال لوحة التحكم الخاصة بك، حيث نقوم بتحديث الحالة بشكل يومي. كما نرسل تقارير أسبوعية مفصلة عبر البريد الإلكتروني.",
      category: "المتابعة"
    },
    {
      question: "ما هي طرق الدفع المقبولة؟",
      answer: "نقبل جميع طرق الدفع: البطاقات الائتمانية (فيزا، ماستركارد)، التحويل البنكي، الدفع عند الاستلام، وكذلك التقسيط من خلال تابي وتمارا.",
      category: "المدفوعات"
    },
    {
      question: "هل يمكنني طلب تعديلات بعد التسليم؟",
      answer: "نعم، نقدم خدمة التعديلات المجانية لمدة 30 يوم من تاريخ التسليم للتعديلات البسيطة. التعديلات الكبيرة تخضع لعرض سعر منفصل.",
      category: "التعديلات"
    }
  ];

  const supportChannels = [
    {
      name: "الدعم المباشر",
      description: "تحدث مع فريق الدعم فوراً",
      icon: MessageCircle,
      color: "bg-green-500",
      available: "24/7",
      response: "فوري"
    },
    {
      name: "البريد الإلكتروني",
      description: "أرسل استفسارك عبر البريد",
      icon: Mail,
      color: "bg-blue-500",
      available: "24/7",
      response: "خلال ساعتين"
    },
    {
      name: "الهاتف",
      description: "تواصل معنا هاتفياً",
      icon: Phone,
      color: "bg-orange-500",
      available: "9:00 ص - 9:00 م",
      response: "فوري"
    },
    {
      name: "فيديو كول",
      description: "مكالمة فيديو مع الخبراء",
      icon: Video,
      color: "bg-purple-500",
      available: "بموعد مسبق",
      response: "حسب الموعد"
    }
  ];

  const systemRequirements = [
    {
      platform: "الحاسوب",
      icon: Monitor,
      requirements: [
        "نظام Windows 10 أو أحدث / macOS 10.14 أو أحدث",
        "متصفح Chrome, Firefox, Safari, أو Edge (آخر إصدار)",
        "ذاكرة وصول عشوائي 4 جيجابايت على الأقل",
        "اتصال إنترنت مستقر"
      ]
    },
    {
      platform: "الهاتف الذكي",
      icon: Smartphone,
      requirements: [
        "iOS 12.0 أو أحدث / Android 8.0 أو أحدث",
        "مساحة تخزين 100 ميجابايت متاحة",
        "اتصال إنترنت مستقر",
        "تطبيق متصفح محدث"
      ]
    },
    {
      platform: "الجهاز اللوحي",
      icon: Tablet,
      requirements: [
        "iPad (الجيل السادس أو أحدث) / Android Tablet",
        "مساحة تخزين 150 ميجابايت متاحة",
        "دقة شاشة 1024x768 على الأقل",
        "اتصال إنترنت مستقر"
      ]
    }
  ];

  const filteredGuides = guideCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.guides.some(guide => 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">دليل المستخدم الشامل</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              دليل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">المستخدم</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              دليلك الشامل لاستخدام جميع خدماتنا ومنصاتنا بكفاءة وسهولة
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث في الدليل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">50+</h3>
            <p className="text-green-600 dark:text-green-300">دليل مفصل</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">30+</h3>
            <p className="text-blue-600 dark:text-blue-300">فيديو تعليمي</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">100+</h3>
            <p className="text-purple-600 dark:text-purple-300">سؤال شائع</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-2">24/7</h3>
            <p className="text-orange-600 dark:text-orange-300">دعم فني</p>
          </div>
        </div>

        {/* Guide Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">فئات الدليل</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGuides.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {category.guides.map((guide, index) => (
                      <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-sm mb-1">{guide.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{guide.duration}</Badge>
                            <Badge variant={guide.difficulty === "سهل" ? "default" : guide.difficulty === "متوسط" ? "secondary" : "destructive"} className="text-xs">
                              {guide.difficulty}
                            </Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {frequentlyAskedQuestions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 dark:border-slate-700 rounded-lg px-6">
                  <AccordionTrigger className="text-right hover:no-underline">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{faq.category}</Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">قنوات الدعم</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 text-center">
                  <CardHeader>
                    <div className={`w-16 h-16 ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{channel.name}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm font-medium">متاح:</span>
                      <span className="text-sm text-muted-foreground">{channel.available}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-sm font-medium">الرد:</span>
                      <span className="text-sm text-muted-foreground">{channel.response}</span>
                    </div>
                    <Button className="w-full">تواصل الآن</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">متطلبات النظام</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {systemRequirements.map((system, index) => {
              const IconComponent = system.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{system.platform}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {system.requirements.map((requirement, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Download Section */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-3xl p-12 border border-blue-200/50 dark:border-blue-800/50">
          <Download className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">تحميل الدليل الكامل</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            احصل على نسخة PDF من دليل المستخدم الكامل لتصفحه دون الحاجة للإنترنت
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Download className="w-5 h-5 ml-2" />
              تحميل PDF - العربية
            </Button>
            <Button size="lg" variant="outline">
              <Download className="w-5 h-5 ml-2" />
              تحميل PDF - English
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;