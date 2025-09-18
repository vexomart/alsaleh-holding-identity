import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Building2, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Lightbulb,
  Globe,
  Shield,
  DollarSign,
  BarChart3,
  Rocket,
  Star,
  Clock,
  Mail,
  Phone,
  Brain,
  Database,
  Cloud,
  Cpu,
  Smartphone,
  Code,
  Layers,
  Activity,
  Settings,
  ChevronRight,
  Eye,
  Heart,
  Sparkles,
  Infinity,
  TreePine,
  Briefcase,
  FileCode,
  Workflow
} from "lucide-react";

const TechInvestment = () => {
  const investmentAreas = [
    {
      title: "الذكاء الاصطناعي وتعلم الآلة",
      titleEn: "Artificial Intelligence & Machine Learning",
      description: "نركز على تطوير وتطبيق تقنيات الذكاء الاصطناعي المتقدمة لحل التحديات المعقدة وتحسين الخدمات في مختلف القطاعات",
      icon: Brain,
      color: "from-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20",
      stats: { value: "تقنيات متطورة", label: "في الذكاء الاصطناعي" },
      projects: "مشاريع رائدة",
      technologies: ["التعلم العميق", "معالجة اللغات الطبيعية", "رؤية الحاسوب", "التحليل التنبؤي", "الأتمتة الذكية"],
      metrics: {
        focus: "الابتكار التقني",
        expertise: "خبرة متقدمة",
        timeline: "تطوير مستمر"
      }
    },
    {
      title: "الحوسبة السحابية والبنية التحتية",
      titleEn: "Cloud Computing & Infrastructure",
      description: "نقدم حلول الحوسبة السحابية المتطورة والبنية التحتية الرقمية التي تدعم النمو والتوسع للمؤسسات الحديثة",
      icon: Cloud,
      color: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      stats: { value: "حلول شاملة", label: "للحوسبة السحابية" },
      projects: "منصات متطورة",
      technologies: ["حلول AWS", "Microsoft Azure", "الحوسبة المختلطة", "الحاويات والتنسيق", "الأمان السيبراني"],
      metrics: {
        focus: "الموثوقية العالية",
        expertise: "خبرة تقنية عميقة",
        timeline: "تطوير سريع ومرن"
      }
    },
    {
      title: "إنترنت الأشياء والمدن الذكية",
      titleEn: "IoT & Smart Cities",
      description: "نصمم ونطور حلول إنترنت الأشياء التي تربط العالم الرقمي بالعالم الفيزيائي لمدن أكثر ذكاءً واستدامة",
      icon: Cpu,
      color: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      stats: { value: "تقنيات ذكية", label: "لإنترنت الأشياء" },
      projects: "حلول مبتكرة",
      technologies: ["أجهزة الاستشعار الذكية", "شبكات 5G", "تحليل البيانات الفورية", "الأتمتة الحضرية", "إدارة الطاقة"],
      metrics: {
        focus: "الاستدامة والكفاءة",
        expertise: "تقنيات متقدمة",
        timeline: "تطوير طويل الأمد"
      }
    },
    {
      title: "تطبيقات الأجهزة المحمولة",
      titleEn: "Mobile Applications",
      description: "نطور تطبيقات الهواتف الذكية المبتكرة التي توفر تجارب مستخدم استثنائية وتلبي احتياجات العصر الرقمي",
      icon: Smartphone,
      color: "from-orange-600 to-red-600",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      stats: { value: "تطبيقات متطورة", label: "للأجهزة المحمولة" },
      projects: "حلول جوال متقدمة",
      technologies: ["تطبيقات أصلية", "تطبيقات متقاطعة", "واقع معزز", "واقع افتراضي", "دفع رقمي"],
      metrics: {
        focus: "تجربة المستخدم",
        expertise: "تطوير متقدم",
        timeline: "دورة تطوير سريعة"
      }
    },
    {
      title: "البلوك تشين والأمان الرقمي",
      titleEn: "Blockchain & Digital Security",
      description: "نستثمر في تقنيات البلوك تشين المتقدمة والأمان الرقمي لضمان الحماية والشفافية في العمليات الرقمية",
      icon: Database,
      color: "from-violet-600 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
      stats: { value: "تقنيات آمنة", label: "للبلوك تشين" },
      projects: "حلول أمان متطورة",
      technologies: ["عقود ذكية", "أنظمة موزعة", "تشفير متقدم", "محافظ رقمية", "أمان البلوك تشين"],
      metrics: {
        focus: "الأمان والشفافية",
        expertise: "تقنيات متقدمة",
        timeline: "تطوير دقيق ومحكم"
      }
    },
    {
      title: "التجارة الإلكترونية والحلول المالية",
      titleEn: "E-commerce & Financial Solutions",
      description: "نقدم منصات التجارة الإلكترونية المتطورة والحلول المالية التقنية التي تدعم الأعمال الرقمية الحديثة",
      icon: Building2,
      color: "from-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      stats: { value: "منصات متطورة", label: "للتجارة الإلكترونية" },
      projects: "حلول تجارية شاملة",
      technologies: ["منصات تجارة", "حلول دفع", "تحليل المبيعات", "ذكاء الأعمال", "أنظمة CRM"],
      metrics: {
        focus: "النمو التجاري",
        expertise: "حلول متكاملة",
        timeline: "تطوير مرن وسريع"
      }
    }
  ];

  const successStories = [
    {
      name: "منصة الذكاء الاصطناعي المصرفية",
      nameEn: "AI Banking Platform",
      description: "نظام ذكي متطور لتحليل البيانات المصرفية باستخدام تقنيات التعلم العميق وتحسين الخدمات المصرفية",
      sector: "الخدمات المصرفية",
      status: "قيد التطوير",
      icon: Brain,
      color: "from-purple-600 to-indigo-600",
      timeline: "مشروع طويل الأمد",
      scope: "نطاق واسع",
      impact: "تأثير كبير"
    },
    {
      name: "منصة التجارة الإلكترونية المتكاملة",
      nameEn: "Integrated E-commerce Platform",
      description: "حل شامل للتجارة الإلكترونية مع الذكاء الاصطناعي وتحليل السلوك وتطبيق محمول متقدم",
      sector: "التجارة الإلكترونية",
      status: "مطور بنجاح",
      icon: Building2,
      color: "from-green-600 to-emerald-600",
      timeline: "مشروع متوسط الأمد",
      scope: "نطاق شامل",
      impact: "نمو مستمر"
    },
    {
      name: "نظام المدينة الذكية المتكامل",
      nameEn: "Smart City Ecosystem",
      description: "حلول شاملة لإدارة المدن الذكية مع إنترنت الأشياء والذكاء الاصطناعي لمستقبل حضري مستدام",
      sector: "التقنيات الحضرية",
      status: "في مرحلة التوسع",
      icon: Cpu,
      color: "from-emerald-600 to-teal-600",
      timeline: "مشروع استراتيجي",
      scope: "نطاق إقليمي",
      impact: "تحول رقمي شامل"
    },
    {
      name: "منصة الحوسبة السحابية المؤسسية",
      nameEn: "Enterprise Cloud Platform",
      description: "بنية تحتية سحابية متطورة للمؤسسات الكبرى مع أمان عالي وأداء متميز وتوافقية شاملة",
      sector: "الحوسبة السحابية",
      status: "رائد في السوق",
      icon: Cloud,
      color: "from-blue-600 to-cyan-600",
      timeline: "مشروع مستمر",
      scope: "نطاق مؤسسي",
      impact: "تحسين الكفاءة"
    },
    {
      name: "تطبيق الواقع المعزز التعليمي",
      nameEn: "AR Educational Application",
      description: "منصة تعليمية ثورية باستخدام الواقع المعزز والذكاء الاصطناعي للتعلم التفاعلي المتقدم",
      sector: "التعليم التقني",
      status: "انتشار واسع",
      icon: Smartphone,
      color: "from-orange-600 to-red-600",
      timeline: "مشروع تعليمي",
      scope: "نطاق تعليمي",
      impact: "تحسين التعلم"
    },
    {
      name: "منصة البلوك تشين الآمنة",
      nameEn: "Secure Blockchain Platform",
      description: "نظام آمن ومتطور باستخدام البلوك تشين والعقود الذكية لضمان الشفافية والأمان الرقمي",
      sector: "التقنيات المالية",
      status: "تقنية رائدة",
      icon: Database,
      color: "from-violet-600 to-purple-600",
      timeline: "مشروع تقني متقدم",
      scope: "نطاق أمني",
      impact: "أمان متطور"
    }
  ];

  const competitiveAdvantages = [
    {
      title: "رؤية استراتيجية طويلة المدى",
      titleEn: "Long-term Strategic Vision",
      description: "نستثمر في التقنيات الناشئة التي ستشكل مستقبل الاقتصاد الرقمي للعقود القادمة",
      icon: Eye,
      color: "from-blue-600 to-indigo-600",
      metrics: ["10+ سنوات تخطيط", "رؤية 2030 متوافقة", "استدامة مضمونة"]
    },
    {
      title: "فريق خبراء عالمي المستوى",
      titleEn: "World-Class Expert Team",
      description: "نخبة من أفضل الخبراء التقنيين والمستثمرين من أرقى الجامعات والشركات العالمية",
      icon: Users,
      color: "from-emerald-600 to-teal-600", 
      metrics: ["85+ خبير متخصص", "خبرة 15+ سنة متوسط", "شهادات عالمية"]
    },
    {
      title: "شراكات استراتيجية قوية",
      titleEn: "Strategic Global Partnerships",
      description: "تحالفات مع أكبر الشركات التقنية العالمية لضمان الوصول لأحدث التقنيات والمعرفة",
      icon: Building2,
      color: "from-purple-600 to-pink-600",
      metrics: ["50+ شراكة عالمية", "حصرية تقنية", "نقل معرفة متقدم"]
    },
    {
      title: "ابتكار تقني متطور",
      titleEn: "Advanced Tech Innovation",
      description: "نطور ونبتكر تقنيات جديدة تماماً بدلاً من مجرد تطبيق التقنيات الموجودة",
      icon: Lightbulb,
      color: "from-orange-600 to-red-600",
      metrics: ["125+ براءة اختراع", "40+ تقنية مبتكرة", "بحث وتطوير مستمر"]
    },
    {
      title: "عوائد استثمارية متميزة",
      titleEn: "Exceptional Investment Returns",
      description: "سجل حافل في تحقيق عوائد استثمارية تفوق السوق بمراحل مع إدارة مخاطر محترفة",
      icon: TrendingUp,
      color: "from-green-600 to-emerald-600",
      metrics: ["350%+ متوسط العوائد", "92% معدل نجاح", "مخاطر محسوبة"]
    },
    {
      title: "تأثير مجتمعي إيجابي",
      titleEn: "Positive Social Impact",
      description: "نركز على الاستثمارات التي تخدم المجتمع وتساهم في التنمية المستدامة ورؤية 2030",
      icon: Heart,
      color: "from-pink-600 to-rose-600",
      metrics: ["100K+ وظيفة مباشرة", "تطوير مجتمعي", "استدامة بيئية"]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-official">
      <Navigation />
      
      {/* Hero Section - Professional & Clean */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">الاستثمار التقني المتطور</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              نبني مستقبل 
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                التقنية الرقمية
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-4">
              شركة علي صالح الشهري القابضة تقود التطوير التقني بحلول مبتكرة وشراكات استراتيجية 
              تساهم في بناء الاقتصاد الرقمي السعودي وتحقيق رؤية 2030
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 w-full sm:w-auto">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                استكشف تقنياتنا
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl backdrop-blur-sm w-full sm:w-auto">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                مشاهدة أعمالنا
              </Button>
            </div>
            
            {/* Stats Row - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
              <div className="text-center group bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                  285+
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">مشروع تقني</div>
              </div>
              <div className="text-center group bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                  15+
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">سنة خبرة</div>
              </div>
              <div className="text-center group bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                  95%
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">معدل النجاح</div>
              </div>
              <div className="text-center group bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">شراكة عالمية</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Areas Section - Responsive */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-950/50 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">مجالات التخصص التقني</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 lg:mb-8 leading-tight px-4">
              نطور التقنيات 
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                المستقبلية
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
              نركز على تطوير أحدث التقنيات الناشئة التي ستشكل مستقبل الاقتصاد الرقمي
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {investmentAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card 
                  key={index} 
                  className={`group relative overflow-hidden border-0 bg-gradient-to-br ${area.bgGradient} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2`}
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
                  
                  <CardHeader className="relative z-10 p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${area.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${area.color} opacity-50 blur-xl rounded-xl sm:rounded-2xl group-hover:opacity-70 transition-opacity duration-500`} />
                      </div>
                      
                      <div className="text-right">
                        <Badge className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-xs sm:text-sm font-bold px-2 sm:px-3 py-1">
                          تقنية متطورة
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300 leading-tight">
                        {area.title}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {area.titleEn}
                      </p>
                    </div>
                    
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg mt-3 sm:mt-4">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white/60 dark:bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                        <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{area.stats.value}</div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{area.stats.label}</div>
                      </div>
                      <div className="bg-white/60 dark:bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                        <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{area.projects}</div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">في التطوير</div>
                      </div>
                    </div>
                    
                    {/* Technologies */}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Code className="w-4 h-4" />
                        التقنيات الأساسية
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {area.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white/60 dark:bg-white/20 text-slate-700 dark:text-slate-300 border-0 px-2 py-1">
                            {tech}
                          </Badge>
                        ))}
                        {area.technologies.length > 4 && (
                          <Badge variant="secondary" className="text-xs bg-white/60 dark:bg-white/20 text-slate-700 dark:text-slate-300 border-0 px-2 py-1">
                            +{area.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                      <div className="bg-white/40 dark:bg-white/10 rounded-lg p-2 sm:p-3">
                        <div className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">{area.metrics.focus}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">التركيز</div>
                      </div>
                      <div className="bg-white/40 dark:bg-white/10 rounded-lg p-2 sm:p-3">
                        <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">{area.metrics.expertise}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">الخبرة</div>
                      </div>
                      <div className="bg-white/40 dark:bg-white/10 rounded-lg p-2 sm:p-3">
                        <div className="text-sm sm:text-lg font-bold text-purple-600 dark:text-purple-400">{area.metrics.timeline}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">النهج</div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r ${area.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories Section - Mobile Optimized */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-medium text-sm sm:text-base">قصص نجاح تقنية</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-tight px-4">
              مشاريع تقنية
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                رائدة ومبتكرة
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
              مشاريع تقنية متطورة طورناها بنجاح وحققت تأثيراً إيجابياً في مختلف القطاعات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {successStories.map((story, index) => {
              const IconComponent = story.icon;
              return (
                <Card key={index} className="group bg-slate-800/50 border-slate-700/50 hover:border-slate-600 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${story.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-bold px-2 py-1">
                        {story.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg sm:text-xl text-white mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-300 leading-tight">
                      {story.name}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-400 mb-2 font-medium">{story.nameEn}</p>
                    <CardDescription className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-sm sm:text-lg font-bold text-blue-400">{story.timeline}</div>
                        <div className="text-xs text-slate-400">المدة الزمنية</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-sm sm:text-lg font-bold text-green-400">{story.scope}</div>
                        <div className="text-xs text-slate-400">نطاق المشروع</div>
                      </div>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                          <span className="text-xs sm:text-sm text-slate-300">القطاع</span>
                        </div>
                        <span className="font-bold text-purple-400 text-xs sm:text-sm">{story.sector}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                          <span className="text-xs sm:text-sm text-slate-300">التأثير</span>
                        </div>
                        <span className="font-bold text-green-400 text-xs sm:text-sm">{story.impact}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${story.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </Card>
              );
            })}
          </div>
          
          {/* Summary Stats - Responsive */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center max-w-5xl mx-auto">
            <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">285+</div>
              <div className="text-slate-400 text-sm sm:text-base">مشروع تقني</div>
            </div>
            <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-slate-400 text-sm sm:text-base">شراكة عالمية</div>
            </div>
            <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-slate-400 text-sm sm:text-base">معدل نجاح</div>
            </div>
            <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">15+</div>
              <div className="text-slate-400 text-sm sm:text-base">سنة خبرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">مزايا تنافسية فريدة</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              لماذا نتفوق على 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                المنافسين؟
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitiveAdvantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-0 bg-white/60 dark:bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${advantage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`} />
                  
                  <CardHeader className="relative z-10 text-center pb-4">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${advantage.color} opacity-50 blur-xl rounded-2xl group-hover:opacity-70 transition-opacity duration-500`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                      {advantage.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
                      {advantage.titleEn}
                    </p>
                    
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {advantage.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        المؤشرات الرئيسية
                      </h4>
                      <div className="space-y-2">
                        {advantage.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/50 dark:bg-white/10 rounded-lg p-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${advantage.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile First */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-80 h-32 sm:h-80 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">تواصل معنا للتعاون</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-tight px-4">
              ابدأ مشروعك
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                التقني معنا
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
              انضم إلى رحلة التطوير التقني واستفد من خبرتنا الواسعة في بناء الحلول المبتكرة والمتطورة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 w-full sm:w-auto">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                ابدأ مشروعك الآن
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-xl backdrop-blur-sm w-full sm:w-auto">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                استشارة تقنية مجانية
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="group text-center bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">دعم فني متواصل</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">دعم تقني شامل ومتابعة مستمرة لضمان نجاح مشروعك</p>
              </div>
              <div className="group text-center bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">خبرة تقنية متقدمة</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">أكثر من 15 سنة في التطوير التقني والحلول المبتكرة</p>
              </div>
              <div className="group text-center bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">جودة وأمان عالي</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">ضمانات شاملة للجودة والأمان في جميع مراحل التطوير</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechInvestment;