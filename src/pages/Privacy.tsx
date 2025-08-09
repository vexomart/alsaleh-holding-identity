import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  FileText, 
  Globe, 
  Cookie, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Download,
  Trash2,
  Edit,
  Database,
  Server,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  Scale,
  Building2
} from "lucide-react";

const Privacy = () => {
  const privacySections = [
    {
      icon: Database,
      title: "جمع البيانات",
      description: "نوضح أنواع البيانات التي نجمعها وطرق جمعها",
      items: [
        "البيانات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف)",
        "بيانات الاستخدام (تصفح الموقع، التفاعل مع الخدمات)",
        "البيانات التقنية (عنوان IP، نوع المتصفح، نظام التشغيل)",
        "ملفات تعريف الارتباط وتقنيات التتبع المشابهة"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Settings,
      title: "استخدام البيانات",
      description: "كيف نستخدم المعلومات التي نجمعها",
      items: [
        "تقديم وتحسين خدماتنا وموقعنا الإلكتروني",
        "التواصل معك بشأن حسابك أو استفساراتك",
        "إرسال تحديثات مهمة حول خدماتنا",
        "تحليل الاستخدام لتحسين تجربة المستخدم"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "حماية البيانات",
      description: "الإجراءات الأمنية التي نتبعها لحماية معلوماتك",
      items: [
        "تشفير البيانات أثناء النقل والتخزين",
        "أنظمة حماية متقدمة ضد الاختراقات",
        "وصول محدود للبيانات للموظفين المخولين فقط",
        "مراجعة أمنية دورية للأنظمة والعمليات"
      ],
      color: "from-red-500 to-pink-500"
    },
    {
      icon: UserCheck,
      title: "حقوقك",
      description: "حقوقك كمستخدم فيما يتعلق ببياناتك الشخصية",
      items: [
        "الحق في الوصول إلى بياناتك الشخصية",
        "الحق في تصحيح أو تحديث معلوماتك",
        "الحق في حذف بياناتك (الحق في النسيان)",
        "الحق في نقل بياناتك إلى خدمة أخرى"
      ],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Cookie,
      title: "ملفات تعريف الارتباط",
      description: "كيف نستخدم ملفات تعريف الارتباط وتقنيات مشابهة",
      items: [
        "ملفات ضرورية لتشغيل الموقع بشكل صحيح",
        "ملفات تحليلية لفهم كيفية استخدام الموقع",
        "ملفات التخصيص لحفظ تفضيلاتك",
        "يمكنك إدارة إعدادات ملفات تعريف الارتباط"
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "مشاركة البيانات",
      description: "متى وكيف قد نشارك معلوماتك مع الآخرين",
      items: [
        "لا نبيع بياناتك الشخصية لأطراف ثالثة",
        "قد نشارك البيانات مع مقدمي الخدمات الموثوقين",
        "الكشف عن البيانات عند الحاجة للامتثال القانوني",
        "في حالة اندماج أو استحواذ، قد تنتقل البيانات"
      ],
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "privacy@ash.holdings",
      description: "للاستفسارات حول الخصوصية"
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "0555812567",
      description: "للدعم المباشر"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "المملكة العربية السعودية",
      description: "مقر الشركة الرئيسي"
    }
  ];

  const userRights = [
    {
      icon: Eye,
      title: "الوصول",
      description: "طلب نسخة من بياناتك الشخصية",
      action: "طلب البيانات"
    },
    {
      icon: Edit,
      title: "التصحيح",
      description: "تصحيح أو تحديث معلوماتك",
      action: "تحديث البيانات"
    },
    {
      icon: Trash2,
      title: "الحذف",
      description: "طلب حذف بياناتك نهائياً",
      action: "حذف البيانات"
    },
    {
      icon: Download,
      title: "النقل",
      description: "تحميل بياناتك بصيغة قابلة للنقل",
      action: "تحميل البيانات"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white animate-pulse" />
                <span className="text-sm font-medium text-white/90">حماية شاملة • شفافية كاملة</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                سياسة <span className="text-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">الخصوصية</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية بأعلى معايير الأمان العالمية
              </p>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="text-center animate-fade-in">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                  <Lock className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">تشفير متقدم</h3>
                  <p className="text-sm text-white/70">جميع البيانات محمية بتشفير عسكري</p>
                </div>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                  <Scale className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">امتثال قانوني</h3>
                  <p className="text-sm text-white/70">متوافق مع GDPR وقوانين الخصوصية</p>
                </div>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                  <UserCheck className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">تحكم كامل</h3>
                  <p className="text-sm text-white/70">أنت تتحكم في بياناتك بالكامل</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <FileText className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">تفاصيل شاملة • شفافية كاملة</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                تفاصيل <span className="text-gradient-primary">السياسة</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                إليك التفاصيل الكاملة حول كيفية جمع واستخدام وحماية معلوماتك الشخصية
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {privacySections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <Card 
                    key={index}
                    className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8 relative h-full">
                      <div className="relative z-10 h-full">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-primary group-hover:text-gradient-primary transition-all duration-300">
                              {section.title}
                            </h3>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {section.description}
                        </p>

                        <ul className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <UserCheck className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">حقوقك محفوظة • تحكم كامل</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                حقوق <span className="text-gradient-primary">المستخدم</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                لديك الحق الكامل في التحكم بمعلوماتك الشخصية
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {userRights.map((right, index) => {
                const IconComponent = right.icon;
                return (
                  <Card key={index} className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center relative h-full">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-primary mb-2">{right.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{right.description}</p>
                      
                      <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300">
                        {right.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  معلومات <span className="text-gradient-primary">مهمة</span>
                </h2>
              </div>

              <div className="space-y-8">
                <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">تاريخ السريان والتحديثات</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          هذه السياسة سارية من تاريخ 1 يناير 2024. نحتفظ بالحق في تحديث هذه السياسة من وقت لآخر. 
                          سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على موقعنا.
                        </p>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          آخر تحديث: يناير 2024
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">الاحتفاظ بالبيانات</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          نحتفظ بمعلوماتك الشخصية للفترة اللازمة لتقديم خدماتنا أو حسب ما يتطلبه القانون. 
                          يمكنك طلب حذف بياناتك في أي وقت، وسنقوم بحذفها خلال 30 يوماً من طلبك.
                        </p>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          حذف خلال 30 يوم
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">القانون المطبق</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          تخضع هذه السياسة لقوانين المملكة العربية السعودية. أي نزاع ينشأ عن هذه السياسة 
                          سيكون من اختصاص المحاكم السعودية المختصة.
                        </p>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          القانون السعودي
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                تواصل <span className="text-gradient-primary">معنا</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <Card key={index} className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-primary mb-2">{contact.title}</h3>
                      <p className="text-lg font-mono text-secondary mb-2">{contact.value}</p>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in inline-block">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Info className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-primary">مسؤول حماية البيانات</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    يمكنك التواصل مع مسؤول حماية البيانات لدينا للاستفسارات المتخصصة حول الخصوصية
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    تواصل مع المسؤول
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
    </div>
  );
};

export default Privacy;