import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Scale, 
  UserCheck, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Lock,
  Gavel,
  Building2,
  Mail,
  Phone,
  Calendar,
  Globe,
  Users,
  Settings,
  Database,
  Copyright,
  Ban,
  Trash2,
  Edit3,
  Info,
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
  Star,
  Award
} from "lucide-react";

const Terms = () => {
  const termssections = [
    {
      icon: UserCheck,
      title: "قبول الشروط",
      description: "بدء استخدام خدماتنا يعني موافقتك على هذه الشروط",
      items: [
        "استخدام الموقع يعني قبولك الكامل لهذه الشروط والأحكام",
        "يجب أن تكون بالغاً أو تحت إشراف ولي الأمر لاستخدام خدماتنا",
        "إذا كنت تمثل شركة، فأنت تؤكد سلطتك في قبول هذه الشروط",
        "عدم موافقتك على أي جزء يعني عدم جواز استخدام الخدمة"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Settings,
      title: "استخدام الخدمة",
      description: "القواعد والإرشادات لاستخدام خدماتنا بشكل صحيح",
      items: [
        "استخدام الخدمة للأغراض المشروعة والقانونية فقط",
        "عدم التدخل في أمان أو سلامة النظام أو الخوادم",
        "احترام حقوق المستخدمين الآخرين وعدم إزعاجهم",
        "عدم استخدام الخدمة لأي أنشطة ضارة أو غير قانونية"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "حسابات المستخدمين",
      description: "إدارة حسابك ومسؤولياتك كمستخدم",
      items: [
        "أنت مسؤول عن الحفاظ على سرية معلومات حسابك",
        "يجب تقديم معلومات صحيحة ومحدثة عند التسجيل",
        "إشعارنا فوراً بأي استخدام غير مصرح به لحسابك",
        "لا يجوز مشاركة حسابك مع آخرين أو بيعه"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Copyright,
      title: "الملكية الفكرية",
      description: "حماية حقوق الملكية الفكرية والمحتوى",
      items: [
        "جميع المحتويات والتصاميم محمية بحقوق الطبع والنشر",
        "لا يجوز نسخ أو توزيع المحتوى دون إذن مكتوب",
        "العلامات التجارية والشعارات ملك خاص بالشركة",
        "احترام حقوق الملكية الفكرية للآخرين عند استخدام الخدمة"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Ban,
      title: "السلوك المحظور",
      description: "الأنشطة والسلوكيات غير المسموحة على منصتنا",
      items: [
        "نشر محتوى مخالف للقانون أو الآداب العامة",
        "محاولة اختراق أو تعطيل النظام أو الخوادم",
        "انتحال شخصية أو تقديم معلومات كاذبة",
        "التحرش أو الإساءة للمستخدمين الآخرين"
      ],
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Trash2,
      title: "إنهاء الخدمة",
      description: "شروط وإجراءات إنهاء أو تعليق الحساب",
      items: [
        "يحق لنا تعليق أو إنهاء حسابك عند مخالفة الشروط",
        "يمكنك إنهاء حسابك في أي وقت من خلال إعدادات الحساب",
        "عند الإنهاء، قد نحتفظ ببعض البيانات حسب القانون",
        "لا نتحمل مسؤولية أي خسائر ناتجة عن إنهاء الخدمة"
      ],
      color: "from-gray-500 to-slate-500"
    }
  ];

  const legalPoints = [
    {
      icon: Shield,
      title: "إخلاء المسؤولية",
      content: "نقدم خدماتنا 'كما هي' دون ضمانات صريحة أو ضمنية. لا نضمن أن الخدمة ستكون متاحة دائماً أو خالية من الأخطاء.",
      type: "warning"
    },
    {
      icon: Scale,
      title: "تحديد المسؤولية",
      content: "مسؤوليتنا تجاهك محدودة بقيمة الخدمات المدفوعة خلال الـ12 شهراً السابقة للحادث المسبب للضرر.",
      type: "info"
    },
    {
      icon: Gavel,
      title: "القانون المطبق",
      content: "تخضع هذه الشروط لقوانين المملكة العربية السعودية. أي نزاع سيكون من اختصاص المحاكم السعودية.",
      type: "legal"
    },
    {
      icon: Edit3,
      title: "تعديل الشروط",
      content: "نحتفظ بالحق في تعديل هذه الشروط. سيتم إشعارك بالتغييرات الجوهرية قبل 30 يوماً من سريانها.",
      type: "update"
    }
  ];

  const acceptanceSteps = [
    {
      step: "1",
      title: "قراءة الشروط",
      description: "اقرأ جميع الشروط والأحكام بعناية",
      icon: BookOpen
    },
    {
      step: "2", 
      title: "فهم الالتزامات",
      description: "تأكد من فهم حقوقك والتزاماتك",
      icon: Eye
    },
    {
      step: "3",
      title: "الموافقة",
      description: "وافق على الشروط لبدء استخدام الخدمة",
      icon: CheckCircle
    }
  ];

  const keyFeatures = [
    { title: "حماية قانونية", description: "شروط واضحة تحمي حقوق الطرفين", icon: Shield },
    { title: "شفافية كاملة", description: "لا توجد شروط مخفية أو غامضة", icon: Eye },
    { title: "تحديثات منتظمة", description: "مراجعة وتحديث مستمر للشروط", icon: Clock },
    { title: "دعم قانوني", description: "فريق قانوني متخصص لأي استفسارات", icon: Gavel }
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
                <FileText className="w-6 h-6 text-white animate-pulse" />
                <span className="text-sm font-medium text-white/90">قواعد واضحة • حقوق محفوظة</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                شروط <span className="text-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">الاستخدام</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                الشروط والأحكام التي تحكم استخدام خدماتنا ومنصاتنا الإلكترونية
              </p>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {keyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                      <IconComponent className="w-12 h-12 text-white mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/70">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Acceptance Steps */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {acceptanceSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{step.title}</h3>
                        <p className="text-sm text-white/70">{step.description}</p>
                      </div>
                      <IconComponent className="w-8 h-8 text-white/60" />
                    </div>
                    {index < acceptanceSteps.length - 1 && (
                      <div className="hidden md:block w-8 h-0.5 bg-white/30" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Scale className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">تفاصيل شاملة • أحكام واضحة</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                الشروط <span className="text-gradient-primary">التفصيلية</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                تفاصيل كاملة وواضحة حول استخدام خدماتنا وحقوقك والتزاماتك
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {termssections.map((section, index) => {
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

        {/* Legal Information */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Gavel className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">أحكام قانونية • التزامات مهمة</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                الأحكام <span className="text-gradient-primary">القانونية</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {legalPoints.map((point, index) => {
                const IconComponent = point.icon;
                const bgColor = point.type === 'warning' ? 'from-red-500/10 to-orange-500/10' :
                               point.type === 'info' ? 'from-blue-500/10 to-cyan-500/10' :
                               point.type === 'legal' ? 'from-purple-500/10 to-indigo-500/10' :
                               'from-green-500/10 to-emerald-500/10';
                
                const iconColor = point.type === 'warning' ? 'from-red-500 to-orange-500' :
                                 point.type === 'info' ? 'from-blue-500 to-cyan-500' :
                                 point.type === 'legal' ? 'from-purple-500 to-indigo-500' :
                                 'from-green-500 to-emerald-500';

                return (
                  <Card key={index} className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-8 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-50 rounded-xl`} />
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${iconColor} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-primary mb-4">{point.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{point.content}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Effective Date & Updates */}
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
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">تاريخ السريان</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          هذه الشروط والأحكام سارية المفعول من تاريخ 1 يناير 2024. أي تحديثات على هذه الشروط 
                          ستدخل حيز التنفيذ بعد 30 يوماً من تاريخ النشر.
                        </p>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          ساري منذ يناير 2024
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">الموافقة المستمرة</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          استمرارك في استخدام خدماتنا بعد تحديث الشروط يعتبر موافقة منك على الشروط الجديدة. 
                          إذا لم توافق على التحديثات، يجب التوقف عن استخدام الخدمة.
                        </p>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          موافقة مطلوبة
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
                        <h3 className="text-2xl font-bold text-primary mb-3">معلومات الشركة</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          شركة علي صالح الشهري القابضة، مسجلة في المملكة العربية السعودية. 
                          جميع الحقوق محفوظة. الشركة مرخصة من الجهات المختصة لممارسة أنشطتها.
                        </p>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          مرخصة رسمياً
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                تواصل <span className="text-gradient-primary">معنا</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                لأي استفسارات حول شروط الاستخدام أو الحاجة لتوضيحات قانونية
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">البريد الإلكتروني</h3>
                  <p className="text-lg font-mono text-secondary mb-2">legal@ash.holdings</p>
                  <p className="text-sm text-muted-foreground">للاستفسارات القانونية</p>
                </CardContent>
              </Card>

              <Card className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">الهاتف</h3>
                  <p className="text-lg font-mono text-secondary mb-2">0555812567</p>
                  <p className="text-sm text-muted-foreground">للدعم المباشر</p>
                </CardContent>
              </Card>

              <Card className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">العنوان</h3>
                  <p className="text-lg font-mono text-secondary mb-2">المملكة العربية السعودية</p>
                  <p className="text-sm text-muted-foreground">مقر الشركة</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in inline-block">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Info className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-primary">المستشار القانوني</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    للاستفسارات القانونية المعقدة أو تفسير بنود معينة، يمكنك التواصل مع فريقنا القانوني المختص
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    استشارة قانونية
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;