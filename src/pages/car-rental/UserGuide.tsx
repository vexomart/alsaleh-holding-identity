import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { 
  BookOpen,
  Play,
  CheckCircle,
  ArrowRight,
  Download,
  Search,
  Smartphone,
  Car,
  Shield,
  CreditCard,
  Clock,
  Phone,
  Mail,
  Users,
  Star,
  Navigation,
  Settings,
  FileText,
  Video,
  HelpCircle,
  ChevronRight,
  Target,
  Zap,
  Award
} from "lucide-react";

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const guideCategories = [
    {
      id: 'getting-started',
      title: 'البدء',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      sections: [
        {
          title: 'إنشاء حساب جديد',
          content: 'تعلم كيفية إنشاء حساب على منصتنا والبدء في رحلة التأجير',
          steps: [
            'زيارة الموقع الإلكتروني أو تحميل التطبيق',
            'النقر على "تسجيل جديد"',
            'إدخال المعلومات الشخصية المطلوبة',
            'التحقق من البريد الإلكتروني أو رقم الهاتف',
            'إكمال ملف التعريف الشخصي'
          ]
        },
        {
          title: 'التحقق من الهوية',
          content: 'خطوات التحقق من الهوية وتفعيل الحساب بالكامل',
          steps: [
            'رفع صورة من الهوية الوطنية (وجه وظهر)',
            'رفع صورة من رخصة القيادة سارية المفعول',
            'التقاط صورة شخصية للتحقق من الهوية',
            'انتظار المراجعة (24-48 ساعة)',
            'استلام إشعار التفعيل'
          ]
        }
      ]
    },
    {
      id: 'booking',
      title: 'الحجز',
      icon: Car,
      color: 'from-green-500 to-emerald-500',
      sections: [
        {
          title: 'البحث والاختيار',
          content: 'كيفية البحث عن السيارة المناسبة وحجزها',
          steps: [
            'تحديد المدينة أو المنطقة',
            'اختيار تاريخ الاستلام والإرجاع',
            'تصفح السيارات المتاحة',
            'استخدام الفلاتر لتضييق النتائج',
            'مقارنة الأسعار والمواصفات'
          ]
        },
        {
          title: 'عملية الحجز',
          content: 'الخطوات التفصيلية لإتمام حجز السيارة',
          steps: [
            'اختيار السيارة والنقر على "احجز الآن"',
            'مراجعة تفاصيل الحجز والأسعار',
            'إضافة الخدمات الإضافية (اختياري)',
            'إدخال معلومات السائق الإضافي (إن وجد)',
            'اختيار طريقة الدفع المناسبة',
            'مراجعة الشروط والأحكام',
            'تأكيد الحجز ودفع المبلغ'
          ]
        }
      ]
    },
    {
      id: 'payment',
      title: 'الدفع',
      icon: CreditCard,
      color: 'from-purple-500 to-indigo-500',
      sections: [
        {
          title: 'طرق الدفع المتاحة',
          content: 'جميع وسائل الدفع المقبولة في خدماتنا',
          steps: [
            'بطاقات الائتمان (فيزا، ماستركارد)',
            'بطاقات مدى السعودية',
            'محافظ رقمية (آبل باي، جوجل باي)',
            'تحويل بنكي',
            'الدفع نقداً عند الاستلام (حسب التوفر)'
          ]
        },
        {
          title: 'سياسة الاسترداد',
          content: 'شروط وأحكام استرداد المبالغ المدفوعة',
          steps: [
            'إلغاء مجاني حتى 24 ساعة قبل الحجز',
            'استرداد 50% للإلغاء خلال 12-24 ساعة',
            'عدم استرداد للإلغاء خلال أقل من 12 ساعة',
            'استرداد كامل في حالة عدم توفر السيارة',
            'معالجة طلبات الاسترداد خلال 5-7 أيام عمل'
          ]
        }
      ]
    },
    {
      id: 'usage',
      title: 'الاستخدام',
      icon: Settings,
      color: 'from-orange-500 to-red-500',
      sections: [
        {
          title: 'استلام السيارة',
          content: 'إجراءات استلام السيارة من نقطة التأجير',
          steps: [
            'الوصول لنقطة الاستلام في الموعد المحدد',
            'إبراز الهوية ورخصة القيادة',
            'فحص السيارة مع المندوب',
            'توقيع عقد التأجير',
            'تسلم مفاتيح السيارة وبطاقة الوقود'
          ]
        },
        {
          title: 'أثناء الاستخدام',
          content: 'نصائح وإرشادات هامة أثناء استخدام السيارة',
          steps: [
            'الالتزام بقوانين المرور المحلية',
            'عدم التدخين داخل السيارة',
            'الحفاظ على نظافة السيارة',
            'تجنب الاستخدام في المناطق المحظورة',
            'التواصل معنا في حالة الطوارئ'
          ]
        },
        {
          title: 'إرجاع السيارة',
          content: 'خطوات إرجاع السيارة في نهاية فترة التأجير',
          steps: [
            'الوصول لنقطة الإرجاع في الموعد المحدد',
            'فحص السيارة مع المندوب',
            'تسوية أي مبالغ إضافية (إن وجدت)',
            'تسليم المفاتيح وإنهاء العقد',
            'الحصول على فاتورة نهائية'
          ]
        }
      ]
    },
    {
      id: 'support',
      title: 'الدعم',
      icon: HelpCircle,
      color: 'from-pink-500 to-rose-500',
      sections: [
        {
          title: 'خدمة العملاء',
          content: 'كيفية الوصول لفريق دعم العملاء',
          steps: [
            'الاتصال على الرقم المجاني: 0555812567',
            'إرسال بريد إلكتروني: info@alialshehriholding.com',
            'استخدام الدردشة المباشرة في الموقع',
            'زيارة أحد فروعنا المتاحة',
            'استخدام نظام التذاكر في التطبيق'
          ]
        },
        {
          title: 'الطوارئ والمساعدة',
          content: 'إجراءات التعامل مع حالات الطوارئ',
          steps: [
            'الاتصال بخدمة الطوارئ: 911',
            'التواصل معنا فوراً: 0555812567',
            'عدم ترك موقع الحادث قبل الإبلاغ',
            'توثيق الحادث بالصور والمعلومات',
            'اتباع تعليمات شرطة المرور'
          ]
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'دليل سريع',
      description: 'الخطوات الأساسية للحجز',
      icon: Zap,
      action: 'عرض الدليل',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'فيديو تعليمي',
      description: 'شاهد كيفية استخدام المنصة',
      icon: Video,
      action: 'مشاهدة الفيديو',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'الأسئلة الشائعة',
      description: 'إجابات للاستفسارات الشائعة',
      icon: HelpCircle,
      action: 'عرض الأسئلة',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'تحميل التطبيق',
      description: 'احصل على التطبيق المحمول',
      icon: Smartphone,
      action: 'تحميل الآن',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const currentCategory = guideCategories.find(cat => cat.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton fallbackPath="/car-rental-landing" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    دليل العميل
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    الدليل الشامل لاستخدام خدمات تأجير السيارات
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ابحث في الدليل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  تحميل PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Quick Actions */}
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8">إجراءات سريعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.gradient} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {action.action}
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    محتويات الدليل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {guideCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveSection(category.id)}
                      className={`w-full text-right p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                        activeSection === category.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-muted-foreground'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.title}</span>
                      {activeSection === category.id && (
                        <ChevronRight className="w-4 h-4 mr-auto" />
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in">
              {currentCategory && (
                <>
                  {/* Category Header */}
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentCategory.color} mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                      <currentCategory.icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{currentCategory.title}</h2>
                    <Badge variant="secondary" className="text-sm">
                      {currentCategory.sections.length} قسم
                    </Badge>
                  </div>

                  {/* Sections */}
                  <div className="space-y-8">
                    {currentCategory.sections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="group hover:shadow-xl transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                                {sectionIndex + 1}
                              </div>
                              {section.title}
                            </CardTitle>
                            <Badge variant="outline">
                              {section.steps.length} خطوة
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mr-11">
                            {section.content}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {section.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 hover:shadow-md transition-all duration-300">
                                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                  {stepIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {step}
                                  </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <Card className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-fade-in">
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">هل تحتاج مساعدة إضافية؟</h3>
              <p className="text-lg mb-6 opacity-90">
                فريق دعم العملاء جاهز لمساعدتك على مدار الساعة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  اتصل بنا: 0555812567
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5" />
                  info@alialshehriholding.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <a href="/car-rental-landing" className="hover:text-blue-400 transition-colors">
                  العودة للرئيسية
                </a>
                <a href="/car-rental/contact" className="hover:text-blue-400 transition-colors">
                  اتصل بنا
                </a>
                <a href="/car-rental/faq" className="hover:text-blue-400 transition-colors">
                  الأسئلة الشائعة
                </a>
              </div>
              <p className="text-sm text-gray-400">
                © 2024 علي الشهري القابضة. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;