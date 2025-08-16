import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Globe, 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  ShieldCheck,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Zap,
  Lightbulb,
  Heart,
  Handshake,
  Rocket,
  Crown,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Settings,
  Code,
  Palette,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default function CompanyProfile() {
  const services = [
    {
      title: "الحلول التقنية المتقدمة",
      items: ["تطوير البرمجيات", "تطبيقات الذكاء الاصطناعي", "الحلول السحابية", "أمن المعلومات"],
      icon: Code,
      color: "blue"
    },
    {
      title: "الخدمات التصميمية",
      items: ["تصميم الهوية البصرية", "التصميم الجرافيكي", "تصميم المواقع", "الطباعة والإعلان"],
      icon: Palette,
      color: "purple"
    },
    {
      title: "الاستشارات الإدارية",
      items: ["التخطيط الاستراتيجي", "التحول الرقمي", "إدارة المشاريع", "التطوير التنظيمي"],
      icon: Briefcase,
      color: "green"
    },
    {
      title: "التدريب والتطوير",
      items: ["البرامج التدريبية", "ورش العمل المتخصصة", "التطوير المهني", "الشهادات المعتمدة"],
      icon: GraduationCap,
      color: "orange"
    }
  ];

  const subsidiaries = [
    {
      name: "شركة إمكان للتطوير",
      field: "التطوير العقاري والإنشاءات",
      year: "2018",
      projects: "50+"
    },
    {
      name: "شركة تسهيل للخدمات المالية",
      field: "الخدمات المالية والاستثمار",
      year: "2019",
      projects: "200+"
    },
    {
      name: "شركة كشخة للعبايات",
      field: "الأزياء والموضة النسائية",
      year: "2020",
      projects: "1000+"
    },
    {
      name: "شركة مدفو للتجارة الإلكترونية",
      field: "البطاقات الرقمية والألعاب",
      year: "2021",
      projects: "5000+"
    }
  ];

  const achievements = [
    { number: "500+", label: "مشروع مكتمل", icon: CheckCircle },
    { number: "100%", label: "معدل رضا العملاء", icon: Star },
    { number: "4", label: "شركات تابعة", icon: Building2 },
    { number: "15", label: "دولة نعمل بها", icon: Globe }
  ];

  const values = [
    {
      title: "الابتكار",
      description: "نسعى دائماً لتقديم حلول مبتكرة ومتطورة",
      icon: Lightbulb,
      color: "yellow"
    },
    {
      title: "الشراكة",
      description: "نؤمن بقوة العمل التشاركي مع عملائنا",
      icon: Handshake,
      color: "blue"
    },
    {
      title: "التطوير",
      description: "التطوير المستمر للخدمات والحلول",
      icon: Rocket,
      color: "green"
    },
    {
      title: "دعم الشباب",
      description: "نهتم بتطوير وتأهيل الكوادر الشابة",
      icon: Heart,
      color: "red"
    }
  ];

  return (
    <PageContainer showNavigation showFooter>
      <PageHeader
        title="الملف التعريفي للشركة"
        description="شركة علي صالح الشهري القابضة - رؤية مستقبلية في عالم التقنية والإعلام"
        showBackButton
        backButtonFallback="/"
      />

      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* نبذة عن الشركة */}
        <section className="animate-fade-in">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-scale-in">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                شركة علي صالح الشهري القابضة
              </CardTitle>
              <Badge variant="outline" className="mx-auto mt-4 px-4 py-2 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                تأسست في عام 2016
              </Badge>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي 
                  مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">رؤية</Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">ابتكار</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">تميز</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* الإحصائيات */}
        <section className="animate-fade-in delay-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">إنجازاتنا بالأرقام</h2>
            <p className="text-muted-foreground text-lg">نفخر بما حققناه من إنجازات على مدار السنوات</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 hover:scale-105 transition-all duration-300 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                  <div className="text-muted-foreground font-medium">{achievement.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* خدماتنا الرئيسية */}
        <section className="animate-fade-in delay-300">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">خدماتنا الرئيسية</h2>
            <p className="text-muted-foreground text-lg">نقدم مجموعة شاملة من الخدمات المتخصصة</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const colorClasses = {
                blue: "from-blue-500 to-indigo-600",
                purple: "from-purple-500 to-violet-600",
                green: "from-green-500 to-emerald-600",
                orange: "from-orange-500 to-red-600"
              };
              
              return (
                <Card 
                  key={index}
                  className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[service.color]} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* قيمنا */}
        <section className="animate-fade-in delay-400">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">قيمنا الأساسية</h2>
            <p className="text-muted-foreground text-lg">المبادئ التي نؤمن بها ونعمل عليها</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              const colorClasses = {
                yellow: "from-yellow-400 to-orange-500",
                blue: "from-blue-500 to-indigo-600",
                green: "from-green-500 to-emerald-600",
                red: "from-red-500 to-pink-600"
              };
              
              return (
                <Card 
                  key={index}
                  className="text-center p-6 hover:scale-105 transition-all duration-300 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                >
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${colorClasses[value.color]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* الشركات التابعة */}
        <section className="animate-fade-in delay-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">شركاتنا التابعة</h2>
            <p className="text-muted-foreground text-lg">مجموعة متنوعة من الشركات المتخصصة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subsidiaries.map((subsidiary, index) => (
              <Card 
                key={index}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subsidiary.name}</CardTitle>
                    <Badge variant="outline" className="px-3 py-1">
                      {subsidiary.year}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">{subsidiary.field}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      <span className="text-muted-foreground">{subsidiary.projects} مشروع</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* معلومات التواصل */}
        <section className="animate-fade-in delay-600">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">تواصل معنا</CardTitle>
              <p className="text-muted-foreground text-lg">نحن هنا لخدمتكم على مدار الساعة</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">الهاتف</h3>
                  <p className="text-muted-foreground">0555812567</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">info@alsalehshehriholding.com</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">الموقع</h3>
                  <p className="text-muted-foreground">المملكة العربية السعودية</p>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  ساعات العمل: الأحد - الخميس من 8:00 ص حتى 6:00 م
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <a href="/contact" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      تواصل معنا
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      واتساب
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}