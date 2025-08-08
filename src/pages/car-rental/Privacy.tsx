import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  UserCheck,
  FileText
} from "lucide-react";

const Privacy = () => {
  const privacySections = [
    {
      icon: Database,
      title: "جمع البيانات",
      description: "كيف نجمع معلوماتك الشخصية",
      color: "bg-blue-500"
    },
    {
      icon: Eye,
      title: "استخدام البيانات",
      description: "كيف نستخدم معلوماتك",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "حماية البيانات",
      description: "كيف نحمي معلوماتك الشخصية",
      color: "bg-purple-500"
    },
    {
      icon: UserCheck,
      title: "حقوق المستخدم",
      description: "حقوقك فيما يتعلق ببياناتك",
      color: "bg-orange-500"
    }
  ];

  const dataTypes = [
    {
      category: "البيانات الشخصية الأساسية",
      items: [
        "الاسم الكامل",
        "رقم الهوية/الإقامة",
        "تاريخ الميلاد",
        "الجنسية",
        "رقم الجوال",
        "البريد الإلكتروني",
        "العنوان الوطني"
      ]
    },
    {
      category: "بيانات القيادة والمركبات",
      items: [
        "رقم رخصة القيادة",
        "تاريخ انتهاء الرخصة",
        "تاريخ إصدار الرخصة",
        "فئة الرخصة",
        "تاريخ القيادة",
        "معلومات التأمين",
        "سجل المخالفات (إن وجد)"
      ]
    },
    {
      category: "البيانات المالية",
      items: [
        "تفاصيل بطاقة الائتمان (مشفرة)",
        "تاريخ المعاملات",
        "طرق الدفع المفضلة",
        "فواتير الإيجار",
        "سجل المدفوعات",
        "مبالغ الضمان",
        "رسوم إضافية"
      ]
    },
    {
      category: "بيانات الاستخدام التقنية",
      items: [
        "عنوان IP",
        "نوع المتصفح",
        "نظام التشغيل",
        "موقعك الجغرافي (بالموافقة)",
        "سجل الموقع الإلكتروني",
        "ملفات تعريف الارتباط",
        "بيانات التطبيق المحمول"
      ]
    }
  ];

  const protectionMeasures = [
    {
      title: "التشفير المتقدم",
      description: "جميع البيانات الحساسة مشفرة باستخدام أحدث تقنيات التشفير SSL 256-bit",
      icon: Lock
    },
    {
      title: "أمان الخوادم",
      description: "خوادمنا محمية بجدران حماية متعددة الطبقات ومراقبة 24/7",
      icon: Shield
    },
    {
      title: "التحكم في الوصول",
      description: "وصول محدود للبيانات للموظفين المختصين فقط وفقاً لمبدأ الحاجة للمعرفة",
      icon: UserCheck
    },
    {
      title: "النسخ الاحتياطي",
      description: "نسخ احتياطية منتظمة ومؤمنة لضمان عدم فقدان البيانات",
      icon: Database
    },
    {
      title: "المراجعة المستمرة",
      description: "مراجعة دورية لأنظمة الأمان وتحديثها لضمان أعلى مستويات الحماية",
      icon: Eye
    },
    {
      title: "الامتثال القانوني",
      description: "نلتزم بجميع قوانين حماية البيانات المحلية والدولية",
      icon: FileText
    }
  ];

  const userRights = [
    "الحق في معرفة البيانات المجمعة عنك",
    "الحق في تصحيح البيانات غير الصحيحة",
    "الحق في حذف بياناتك الشخصية",
    "الحق في تقييد معالجة بياناتك",
    "الحق في نقل بياناتك",
    "الحق في الاعتراض على معالجة البيانات",
    "الحق في سحب الموافقة في أي وقت",
    "الحق في تقديم شكوى لدى الجهات المختصة"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BackButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2 animate-fade-in">
              <Shield className="w-4 h-4 ml-1" />
              سياسة الخصوصية
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              حماية خصوصيتك أولويتنا
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              نحن ملتزمون بحماية بياناتك الشخصية وخصوصيتك وفقاً لأعلى المعايير الدولية
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="border-green-200 bg-green-50 mb-12 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">التزامنا بالخصوصية</h3>
                  <p className="text-green-700 leading-relaxed mb-4">
                    نحن في كار رنت برو نؤمن بحقك في الخصوصية. نجمع ونستخدم بياناتك الشخصية فقط لتقديم أفضل خدمة ممكنة.
                    لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة بدون موافقتك الصريحة.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className="bg-green-600">محدث: يناير 2024</Badge>
                    <Badge className="bg-blue-600">متوافق مع القوانين السعودية</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              كيف نحمي خصوصيتك
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in">
              تعرف على الطرق المختلفة التي نتبعها لحماية بياناتك الشخصية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {privacySections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${section.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center animate-fade-in">
              البيانات التي نجمعها
            </h2>
            
            <div className="space-y-8">
              {dataTypes.map((dataType, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      {dataType.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {dataType.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex} 
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protection Measures */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
              إجراءات الحماية المتقدمة
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
              نستخدم أحدث التقنيات لضمان أمان وسرية بياناتك الشخصية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {protectionMeasures.map((measure, index) => {
              const IconComponent = measure.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-md border-white/20 group hover:bg-white/20 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {measure.title}
                        </h3>
                        <p className="text-white/80 leading-relaxed">
                          {measure.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
                حقوقك كمستخدم
              </h2>
              <p className="text-lg text-slate-600 animate-fade-in">
                لديك الحق الكامل في التحكم ببياناتك الشخصية
              </p>
            </div>

            <Card className="animate-fade-in">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {userRights.map((right, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed">{right}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 flex items-center gap-3 text-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                تواصل معنا حول خصوصيتك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-center">
                إذا كان لديك أي استفسارات حول سياسة الخصوصية أو ترغب في ممارسة حقوقك المذكورة أعلاه، 
                يرجى التواصل معنا من خلال الوسائل التالية:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">البريد الإلكتروني</h4>
                    <p className="text-slate-600">info@alialshehriholding.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">الهاتف</h4>
                    <p className="text-slate-600">0555812567</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>وقت الاستجابة:</strong> نلتزم بالرد على استفساراتك المتعلقة بالخصوصية خلال 7 أيام عمل من تاريخ الاستلام.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            ثق في حماية بياناتك معنا
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            التزامنا بحماية خصوصيتك يجعلنا الخيار الأمثل لخدمات تأجير السيارات
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 shadow-2xl"
              asChild
            >
              <a href="/car-rental-landing">
                <Shield className="w-6 h-6 ml-2" />
                ابدأ بثقة
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all text-lg px-8 py-6 backdrop-blur-sm"
              asChild
            >
              <a href="/car-rental/contact">
                <Mail className="w-6 h-6 ml-2" />
                راسلنا
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;