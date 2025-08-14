import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Building,
  Info,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  const termsSections = [
    {
      title: "شروط الاستخدام",
      icon: FileText,
      content: [
        "يجب أن تكون بعمر 18 سنة أو أكثر لاستخدام خدماتنا",
        "توفير معلومات دقيقة وصحيحة عند التسجيل",
        "المحافظة على سرية بيانات حسابك",
        "عدم استخدام الموقع لأغراض غير قانونية",
        "احترام حقوق الملكية الفكرية"
      ]
    },
    {
      title: "شروط الشراء",
      icon: CreditCard,
      content: [
        "جميع الأسعار بالريال السعودي وشاملة للضريبة",
        "الدفع مطلوب قبل تسليم البطاقة الإلكترونية",
        "البطاقات المباعة لا يمكن إعادتها إلا في حالات خاصة",
        "نحتفظ بالحق في رفض أي طلب شراء",
        "العروض والتخفيضات محدودة زمنياً"
      ]
    },
    {
      title: "التسليم والاستلام",
      icon: Truck,
      content: [
        "البطاقات الإلكترونية تُسلم فوراً عبر الواتساب أو الإيميل",
        "نضمن التسليم خلال ساعة واحدة كحد أقصى",
        "العميل مسؤول عن التأكد من صحة معلومات التواصل",
        "في حالة عدم التسليم، تواصل معنا فوراً",
        "احتفظ برقم الطلب لأي مراجعات مستقبلية"
      ]
    },
    {
      title: "الضمان والاسترداد",
      icon: RotateCcw,
      content: [
        "ضمان 100% على أصالة جميع البطاقات",
        "إمكانية الاسترداد خلال 7 أيام من تاريخ الشراء",
        "شروط الاسترداد: عدم عمل البطاقة أو خطأ في النوع",
        "الاسترداد يتم خلال 3-5 أيام عمل",
        "لا يمكن استرداد البطاقات المستخدمة جزئياً"
      ]
    },
    {
      title: "المسؤوليات والقيود",
      icon: Scale,
      content: [
        "نحن غير مسؤولين عن سوء استخدام البطاقات",
        "العميل مسؤول عن الحفاظ على بيانات البطاقة",
        "لا نضمن توفر جميع البطاقات في جميع الأوقات",
        "قد تنطبق قيود جغرافية على بعض البطاقات",
        "مسؤوليتنا محدودة بقيمة البطاقة المشتراة"
      ]
    }
  ];

  const prohibitedActivities = [
    "استخدام معلومات مزيفة أو مضللة",
    "إعادة بيع البطاقات المشتراة لأطراف ثالثة",
    "محاولة اختراق أو إلحاق الضرر بالموقع",
    "استخدام البرامج الآلية أو الروبوتات",
    "انتهاك حقوق الملكية الفكرية",
    "نشر محتوى غير قانوني أو مسيء",
    "التلاعب في النظام أو محاولة الخداع"
  ];

  const userRights = [
    "الحصول على بطاقات أصلية وفعالة",
    "خدمة عملاء سريعة ومتجاوبة",
    "حماية المعلومات الشخصية",
    "الوصول إلى شروط واضحة ومفهومة",
    "المطالبة بالحقوق وفقاً للقانون السعودي"
  ];

  const contactMethods = [
    {
      title: "قسم الشؤون القانونية",
      value: "legal@cards-store.com",
      icon: Mail
    },
    {
      title: "خدمة العملاء",
      value: "+966 50 000 0000",
      icon: Phone
    },
    {
      title: "النظام القانوني",
      value: "قوانين المملكة العربية السعودية",
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
            <FileText className="w-5 h-5 ml-2" />
            الشروط والأحكام
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            شروط وأحكام 
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              الاستخدام والخدمة
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            تحدد هذه الشروط والأحكام قواعد استخدام متجر البطاقات الإلكترونية والحقوق والواجبات لجميع الأطراف
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              آخر تحديث: ديسمبر 2024
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              وفقاً لقوانين المملكة العربية السعودية
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
                مقدمة مهمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                مرحباً بك في متجر البطاقات الإلكترونية، المملوك والمُشغل من قبل شركة علي صالح الشهري القابضة. 
                هذه الشروط والأحكام تحكم استخدامك لموقعنا وخدماتنا.
              </p>
              <p>
                باستخدام موقعنا، فإنك توافق على جميع الشروط والأحكام المذكورة أدناه. 
                إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">تنبيه قانوني</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      هذه الشروط قابلة للتغيير. سنعلمك بأي تحديثات عبر الموقع أو البريد الإلكتروني.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="space-y-8">
            {termsSections.map((section, index) => {
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

      {/* Prohibited Activities */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-4xl mx-auto border-red-200 dark:border-red-800">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border-b border-red-200 dark:border-red-800">
              <CardTitle className="flex items-center gap-3 text-2xl text-red-800 dark:text-red-200">
                <XCircle className="w-8 h-8" />
                الأنشطة المحظورة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                يُمنع منعاً باتاً القيام بأي من الأنشطة التالية:
              </p>
              <ul className="space-y-3">
                {prohibitedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>تحذير:</strong> انتهاك هذه القواعد قد يؤدي إلى إيقاف الحساب ومنع الوصول للخدمات نهائياً.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-4xl mx-auto border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-200 dark:border-green-800">
              <CardTitle className="flex items-center gap-3 text-2xl text-green-800 dark:text-green-200">
                <Shield className="w-8 h-8" />
                حقوق المستخدم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                كعميل في متجرنا، لك الحقوق التالية:
              </p>
              <ul className="space-y-3">
                {userRights.map((right, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {right}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Legal Information */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📞 معلومات قانونية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              للاستفسارات القانونية والشكاوى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((contact, index) => {
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
                    <p className="text-primary font-medium text-sm">
                      {contact.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Agreement */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              الموافقة على الشروط والأحكام
            </h2>
            <p className="text-xl mb-8 opacity-90">
              باستخدام موقعنا وخدماتنا، فإنك تؤكد موافقتك على جميع الشروط والأحكام المذكورة أعلاه
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.open("https://wa.me/966500000000?text=لدي استفسار قانوني حول الشروط والأحكام", '_blank')}
                className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                استفسار قانوني
              </Button>
              
              <Link to="/cards-store">
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm"
                >
                  <CheckCircle className="w-5 h-5 ml-2" />
                  موافق، العودة للمتجر
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;