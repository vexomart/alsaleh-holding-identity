import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  Trophy,
  Lightbulb,
  Code,
  Building,
  Star,
  CheckCircle,
  ArrowLeft,
  Zap,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

const DevelopmentProgram = () => {
  const developmentTracks = [
    {
      title: "مسار القيادة التقنية",
      description: "برنامج متخصص لإعداد القادة التقنيين المستقبليين في مجال التكنولوجيا والابتكار",
      duration: "12 شهر",
      level: "متقدم",
      capacity: "20 مشارك",
      modules: [
        "إدارة الفرق التقنية",
        "استراتيجية التطوير",
        "الابتكار والبحث",
        "القيادة الرقمية"
      ],
      outcomes: "ترقية إلى منصب قيادي",
      icon: Rocket,
      color: "from-blue-500 to-indigo-600",
      featured: true,
      status: "قريباً"
    },
    {
      title: "مسار ريادة الأعمال التقنية",
      description: "تطوير مهارات بناء وقيادة الشركات التقنية الناشئة من الفكرة إلى التنفيذ",
      duration: "8 أشهر",
      level: "متوسط إلى متقدم",
      capacity: "25 مشارك",
      modules: [
        "تطوير نموذج الأعمال",
        "جذب الاستثمار",
        "بناء المنتج",
        "استراتيجية النمو"
      ],
      outcomes: "إطلاق شركة ناشئة",
      icon: Lightbulb,
      color: "from-emerald-500 to-teal-600",
      featured: false,
      status: "قريباً"
    },
    {
      title: "مسار التطوير المهني المتسارع",
      description: "برنامج مكثف لتطوير المهارات المهنية والتقنية للموظفين الجدد والمتوسطين",
      duration: "6 أشهر",
      level: "مبتدئ إلى متوسط",
      capacity: "50 مشارك",
      modules: [
        "المهارات التقنية الأساسية",
        "مهارات التواصل",
        "إدارة الوقت",
        "العمل الجماعي"
      ],
      outcomes: "ترقية وظيفية",
      icon: Target,
      color: "from-orange-500 to-red-600",
      featured: false,
      status: "قريباً"
    }
  ];

  const programBenefits = [
    {
      icon: Trophy,
      title: "تطوير مهني متقدم",
      description: "برامج تطوير شخصية مصممة خصيصاً لتعزيز مهاراتك المهنية والقيادية"
    },
    {
      icon: Users,
      title: "شبكة علاقات مهنية",
      description: "تواصل مع قادة الصناعة والخبراء المحليين والعالميين"
    },
    {
      icon: Briefcase,
      title: "فرص وظيفية حصرية",
      description: "أولوية في شغل المناصب القيادية داخل الشركات التابعة للمجموعة"
    },
    {
      icon: Star,
      title: "إرشاد ومتابعة مستمرة",
      description: "مرشدين متخصصين يقدمون الدعم والتوجيه طوال فترة البرنامج"
    }
  ];

  const programStats = [
    { number: "95%", label: "معدل الإنجاز", icon: CheckCircle },
    { number: "87%", label: "معدل الترقية", icon: Trophy },
    { number: "150+", label: "خريج البرنامج", icon: Users },
    { number: "24", label: "شهر متوسط المتابعة", icon: Calendar }
  ];

  const applicationProcess = [
    {
      step: "1",
      title: "تقديم الطلب",
      description: "املأ نموذج التقديم وأرفق سيرتك الذاتية وخطاب التحفيز",
      duration: "أسبوع واحد"
    },
    {
      step: "2", 
      title: "المقابلة الأولية",
      description: "مقابلة مع فريق البرنامج لتقييم الدافعية والأهداف",
      duration: "30 دقيقة"
    },
    {
      step: "3",
      title: "التقييم المتخصص",
      description: "اختبارات تقنية ونفسية لتحديد المسار المناسب",
      duration: "ساعتان"
    },
    {
      step: "4",
      title: "بداية البرنامج",
      description: "جلسة التوجيه وبداية رحلة التطوير المهني",
      duration: "يوم كامل"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-indigo-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/20 mb-8">
              <Rocket className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-bold text-slate-800">برنامج التطوير المهني</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              طور مهاراتك
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> واصنع مستقبلك</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              انضم إلى برنامج التطوير المهني الشامل في مجموعة علي صالح الشهري واحصل على التدريب والإرشاد اللازم لتحقيق أهدافك المهنية
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                <Zap className="w-5 h-5 mr-2" />
                تقدم للبرنامج
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Calendar className="w-5 h-5 mr-2" />
                احجز جلسة استشارية
              </Button>
            </div>

            {/* Program Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {programStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Development Tracks */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">مسارات التطوير المتاحة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر المسار الذي يتماشى مع أهدافك المهنية واحصل على تدريب متخصص ومتابعة مستمرة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {developmentTracks.map((track, index) => {
              const IconComponent = track.icon;
              return (
                <Card key={index} className={`group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 bg-white/80 backdrop-blur-lg overflow-hidden relative ${track.featured ? 'ring-2 ring-purple-500/30 transform scale-105 shadow-2xl' : ''}`}>
                  <div className={`h-2 bg-gradient-to-r ${track.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                  
                  {track.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ✨ الأكثر طلباً
                    </div>
                  )}

                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                    🚀 قريباً
                  </div>
                  
                  <CardHeader className="p-6 pb-4 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-300 bg-slate-50/80 backdrop-blur-sm">
                        {track.level}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors duration-300 relative">
                      {track.title}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {track.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{track.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{track.capacity}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm text-slate-600">
                        <Trophy className="w-4 h-4" />
                        <span>{track.outcomes}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">محاور البرنامج:</h4>
                      <div className="space-y-2">
                        {track.modules.map((module, moduleIndex) => (
                          <div key={moduleIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className={`w-full relative overflow-hidden group/btn ${
                      track.featured 
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 shadow-lg hover:shadow-xl' 
                        : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700'
                    } transform transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed`} disabled>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                      <span className="relative z-10 font-semibold">
                        {track.featured ? '✨ قريباً - الأكثر انتظاراً' : '🚀 قريباً - ترقبوا الإعلان'}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">خطوات التقديم</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              عملية تقديم مبسطة ومنظمة لضمان اختيار المرشحين المناسبين للبرنامج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {applicationProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed mb-3">{step.description}</p>
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">مزايا البرنامج</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              احصل على مزايا حصرية تضمن لك أفضل تجربة تطوير مهني وفرص نمو متقدمة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              ابدأ رحلة التطوير المهني اليوم
            </h2>
            <p className="text-xl text-purple-100 mb-10 leading-relaxed">
              لا تفوت الفرصة للانضمام إلى برنامج التطوير المهني الأكثر تميزاً في المنطقة. استثمر في مستقبلك المهني الآن
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Rocket className="w-5 h-5 mr-2" />
                تقدم للبرنامج
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl">
                  استشارة مجانية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default DevelopmentProgram;