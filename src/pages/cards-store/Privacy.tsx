import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  AlertTriangle,
  Building,
  Info,
  CheckCircle,
  Globe,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const privacySections = [
    {
      title: "المعلومات التي نجمعها",
      icon: Database,
      content: [
        "المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف",
        "معلومات الدفع: تتم معالجتها عبر بوابات دفع آمنة ولا نحتفظ بها",
        "معلومات الاستخدام: كيفية تفاعلك مع موقعنا لتحسين الخدمة",
        "ملفات تعريف الارتباط: لتحسين تجربة المستخدم"
      ]
    },
    {
      title: "كيف نستخدم معلوماتك",
      icon: UserCheck,
      content: [
        "معالجة طلبات الشراء وتسليم البطاقات الإلكترونية",
        "التواصل معك بخصوص طلباتك وتقديم الدعم الفني",
        "تحسين خدماتنا وتطوير منتجات جديدة",
        "إرسال التحديثات والعروض الخاصة (بموافقتك المسبقة)",
        "الامتثال للقوانين واللوائح المعمول بها"
      ]
    },
    {
      title: "حماية معلوماتك",
      icon: Shield,
      content: [
        "تشفير SSL 256-bit لجميع البيانات المرسلة",
        "خوادم آمنة محمية بأحدث تقنيات الأمان",
        "وصول محدود للموظفين المخولين فقط",
        "نسخ احتياطية منتظمة ومحمية",
        "مراقبة أمنية على مدار الساعة"
      ]
    },
    {
      title: "مشاركة المعلومات",
      icon: Eye,
      content: [
        "لا نبيع معلوماتك الشخصية لأطراف ثالثة",
        "قد نشارك معلومات محدودة مع مقدمي الخدمة الموثوقين",
        "الامتثال للطلبات القانونية من السلطات المختصة",
        "حماية حقوقنا وحقوق المستخدمين الآخرين"
      ]
    },
    {
      title: "حقوقك",
      icon: UserCheck,
      content: [
        "الوصول إلى معلوماتك الشخصية",
        "تصحيح أو تحديث المعلومات غير الصحيحة",
        "حذف معلوماتك (مع مراعاة المتطلبات القانونية)",
        "إلغاء الاشتراك في الرسائل التسويقية",
        "تقديم شكوى لدى الجهات المختصة"
      ]
    }
  ];

  const contactInfo = [
    {
      title: "مسؤول حماية البيانات",
      value: "privacy@cards-store.com",
      icon: Mail
    },
    {
      title: "هاتف الدعم",
      value: "+966 50 000 0000",
      icon: Phone
    },
    {
      title: "العنوان",
      value: "المملكة العربية السعودية",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs md:text-sm font-medium flex items-center justify-center gap-2">
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة <span className="text-blue-400 font-bold">شركة علي صالح الشهري القابضة</span>
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  🛍️ متجر البطاقات الإلكترونية
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">المتجر الأول والأكثر ثقة</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                💬 واتساب
              </Button>
              
              <Link to="/cards-store">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <Badge className="bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary mb-6 text-lg px-6 py-3 border border-primary/20">
            <Shield className="w-5 h-5 ml-2" />
            سياسة الخصوصية
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            نحمي خصوصيتك 
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              بأعلى معايير الأمان
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            نلتزم بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الدولية وقوانين المملكة العربية السعودية
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              آخر تحديث: ديسمبر 2024
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              متوافق مع قوانين حماية البيانات
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-8 h-8 text-primary" />
                مقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                تسري هذه السياسة على متجر البطاقات الإلكترونية المملوك والمُشغل من قبل شركة علي صالح الشهري القابضة. 
                نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية.
              </p>
              <p>
                باستخدام موقعنا وخدماتنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة. 
                إذا كان لديك أي أسئلة أو مخاوف، يرجى التواصل معنا.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">هام</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      نوصي بقراءة هذه السياسة بعناية وحفظ نسخة منها للرجوع إليها مستقبلاً.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="space-y-8">
            {privacySections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cookies Policy */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-8 h-8 text-primary" />
                سياسة ملفات تعريف الارتباط (Cookies)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">ملفات الارتباط الأساسية</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ضرورية لعمل الموقع الأساسي مثل تسجيل الدخول وإعدادات الأمان
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">ملفات الارتباط التحليلية</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    تساعدنا في فهم كيفية استخدام الموقع لتحسين الخدمة
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">ملفات الارتباط التسويقية</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    لعرض إعلانات مخصصة (بموافقتك المسبقة فقط)
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">إدارة الملفات</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    يمكنك إدارة تفضيلات الملفات من إعدادات متصفحك
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              💬 تواصل معنا
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              لأي استفسارات حول سياسة الخصوصية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {contact.title}
                    </h3>
                    <p className="text-primary font-medium">
                      {contact.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Notice */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              التزامنا بحماية خصوصيتك
            </h2>
            <p className="text-xl mb-8 opacity-90">
              نعمل باستمرار على تحسين وتطوير معايير الأمان وحماية البيانات
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.open("https://wa.me/966500000000?text=لدي استفسار حول سياسة الخصوصية", '_blank')}
                className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                استفسار عن الخصوصية
              </Button>
              
              <Link to="/cards-store/contact">
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm"
                >
                  <Mail className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;