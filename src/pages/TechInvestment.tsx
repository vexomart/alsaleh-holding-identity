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
      titleEn: "AI & Machine Learning",
      description: "استثمارات استراتيجية في تطوير تقنيات الذكاء الاصطناعي والأنظمة الذكية لمستقبل تقني متطور",
      icon: Brain,
      color: "from-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20",
      stats: { value: "150M+", label: "ريال استثمار" },
      growth: "+285%",
      projects: "45+ مشروع",
      technologies: ["التعلم العميق", "معالجة اللغات الطبيعية", "رؤية الحاسوب", "التحليل التنبؤي", "الأتمتة الذكية"],
      metrics: {
        roi: "340%",
        success: "92%",
        timeline: "18 شهر متوسط"
      }
    },
    {
      title: "الحوسبة السحابية والبنية التحتية",
      titleEn: "Cloud Computing & Infrastructure",
      description: "بناء وتطوير الحلول السحابية المتقدمة والبنية التحتية الرقمية للمؤسسات العالمية",
      icon: Cloud,
      color: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      stats: { value: "200M+", label: "ريال استثمار" },
      growth: "+320%",
      projects: "68+ مشروع",
      technologies: ["حلول AWS", "Microsoft Azure", "الحوسبة المختلطة", "الحاويات والتنسيق", "الأمان السيبراني"],
      metrics: {
        roi: "420%",
        success: "96%",
        timeline: "12 شهر متوسط"
      }
    },
    {
      title: "إنترنت الأشياء والمدن الذكية",
      titleEn: "IoT & Smart Cities",
      description: "تطوير شبكات إنترنت الأشياء وحلول المدن الذكية لمستقبل متصل ومستدام",
      icon: Cpu,
      color: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      stats: { value: "120M+", label: "ريال استثمار" },
      growth: "+410%",
      projects: "32+ مشروع",
      technologies: ["أجهزة الاستشعار الذكية", "شبكات 5G", "تحليل البيانات الفورية", "الأتمتة الحضرية", "إدارة الطاقة"],
      metrics: {
        roi: "380%",
        success: "89%",
        timeline: "24 شهر متوسط"
      }
    },
    {
      title: "تطبيقات الأجهزة المحمولة",
      titleEn: "Mobile Applications",
      description: "تطوير تطبيقات الهواتف الذكية المبتكرة وحلول الأجهزة المحمولة للمستقبل الرقمي",
      icon: Smartphone,
      color: "from-orange-600 to-red-600",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      stats: { value: "95M+", label: "ريال استثمار" },
      growth: "+275%",
      projects: "89+ تطبيق",
      technologies: ["تطبيقات أصلية", "تطبيقات متقاطعة", "واقع معزز", "واقع افتراضي", "دفع رقمي"],
      metrics: {
        roi: "310%",
        success: "94%",
        timeline: "8 أشهر متوسط"
      }
    },
    {
      title: "البلوك تشين والعملات الرقمية",
      titleEn: "Blockchain & Digital Assets",
      description: "استثمارات رائدة في تقنيات البلوك تشين والأصول الرقمية للاقتصاد المستقبلي",
      icon: Database,
      color: "from-violet-600 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
      stats: { value: "180M+", label: "ريال استثمار" },
      growth: "+525%",
      projects: "28+ مشروع",
      technologies: ["عقود ذكية", "DeFi", "NFTs", "محافظ رقمية", "أمان البلوك تشين"],
      metrics: {
        roi: "580%",
        success: "87%",
        timeline: "20 شهر متوسط"
      }
    },
    {
      title: "التجارة الإلكترونية والفينتك",
      titleEn: "E-commerce & FinTech",
      description: "حلول التجارة الإلكترونية المتطورة والتقنيات المالية الثورية للأعمال الرقمية",
      icon: Building2,
      color: "from-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      stats: { value: "250M+", label: "ريال استثمار" },
      growth: "+390%",
      projects: "76+ منصة",
      technologies: ["منصات تجارة", "حلول دفع", "تحليل المبيعات", "ذكاء الأعمال", "أنظمة CRM"],
      metrics: {
        roi: "450%",
        success: "93%",
        timeline: "14 شهر متوسط"
      }
    }
  ];

  const successStories = [
    {
      name: "منصة الذكاء الاصطناعي المصرفية",
      nameEn: "AI Banking Platform",
      description: "نظام ذكي متطور لتحليل البيانات المصرفية والتنبؤ بالمخاطر باستخدام تقنيات التعلم العميق",
      investment: "45M ريال",
      returns: "165M ريال",
      roi: "+267%",
      timeline: "24 شهر",
      sector: "الخدمات المصرفية",
      status: "مطور بالكامل",
      icon: Brain,
      color: "from-purple-600 to-indigo-600"
    },
    {
      name: "منصة التجارة الإلكترونية المتكاملة",
      nameEn: "Integrated E-commerce Platform",
      description: "حل شامل للتجارة الإلكترونية مع الذكاء الاصطناعي وتحليل السلوك وتطبيق محمول",
      investment: "28M ريال", 
      returns: "125M ريال",
      roi: "+346%",
      timeline: "18 شهر",
      sector: "التجارة الإلكترونية",
      status: "نمو مستمر",
      icon: Building2,
      color: "from-green-600 to-emerald-600"
    },
    {
      name: "نظام المدينة الذكية المتكامل",
      nameEn: "Smart City Ecosystem",
      description: "حلول شاملة لإدارة المدن الذكية مع إنترنت الأشياء والذكاء الاصطناعي",
      investment: "65M ريال",
      returns: "280M ريال",
      roi: "+331%", 
      timeline: "36 شهر",
      sector: "التقنيات الحضرية",
      status: "توسع إقليمي",
      icon: Cpu,
      color: "from-emerald-600 to-teal-600"
    },
    {
      name: "منصة الحوسبة السحابية المؤسسية",
      nameEn: "Enterprise Cloud Platform",
      description: "بنية تحتية سحابية متطورة للمؤسسات الكبرى مع أمان عالي وأداء متميز",
      investment: "52M ريال",
      returns: "195M ريال", 
      roi: "+275%",
      timeline: "20 شهر",
      sector: "الحوسبة السحابية",
      status: "قيادة السوق",
      icon: Cloud,
      color: "from-blue-600 to-cyan-600"
    },
    {
      name: "تطبيق الواقع المعزز التعليمي",
      nameEn: "AR Educational App",
      description: "منصة تعليمية ثورية باستخدام الواقع المعزز والذكاء الاصطناعي للتعلم التفاعلي",
      investment: "18M ريال",
      returns: "78M ريال",
      roi: "+333%",
      timeline: "15 شهر", 
      sector: "التعليم التقني",
      status: "انتشار عالمي",
      icon: Smartphone,
      color: "from-orange-600 to-red-600"
    },
    {
      name: "منصة البلوك تشين المالية",
      nameEn: "DeFi Blockchain Platform", 
      description: "نظام مالي لامركزي متطور باستخدام البلوك تشين والعقود الذكية",
      investment: "38M ريال",
      returns: "210M ريال",
      roi: "+453%",
      timeline: "28 شهر",
      sector: "التقنيات المالية",
      status: "ريادة تقنية",
      icon: Database,
      color: "from-violet-600 to-purple-600"
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Modern Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float top-1/4 left-1/4" />
          <div className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float-delayed top-1/3 right-1/3" />
          <div className="absolute w-3 h-3 bg-indigo-400/20 rounded-full animate-pulse bottom-1/4 right-1/4" />
          <div className="absolute w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-float bottom-1/3 left-1/3" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-blue-100 font-medium">الاستثمار التقني المتطور • نحو المستقبل الرقمي</span>
              <Infinity className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight">
              استثمار تقني 
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                استثنائي
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              شركة علي صالح الشهري القابضة تقود مستقبل الاستثمار التقني بحلول مبتكرة وشراكات استراتيجية 
              تحقق عوائد استثنائية وتساهم في بناء الاقتصاد الرقمي السعودي
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                ابدأ الاستثمار معنا
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Eye className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                استكشف محفظتنا
              </Button>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  1.2B+
                </div>
                <div className="text-slate-400 font-medium">ريال استثمارات</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  350%+
                </div>
                <div className="text-slate-400 font-medium">متوسط العوائد</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  285+
                </div>
                <div className="text-slate-400 font-medium">مشروع ناجح</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  15+
                </div>
                <div className="text-slate-400 font-medium">سنة ريادة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Areas Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">مجالات الاستثمار التقني</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              نستثمر في 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مستقبل التقنية
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              نقود الاستثمار في أحدث التقنيات الناشئة التي ستشكل مستقبل الاقتصاد الرقمي العالمي
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {investmentAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card 
                  key={index} 
                  className={`group relative overflow-hidden border-0 bg-gradient-to-br ${area.bgGradient} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${area.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl`} />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`relative w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className="w-8 h-8 text-white" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${area.color} opacity-50 blur-xl rounded-2xl group-hover:opacity-70 transition-opacity duration-500`} />
                      </div>
                      
                      <div className="text-right">
                        <Badge className={`bg-gradient-to-r ${area.color} text-white border-0 text-sm font-bold px-3 py-1`}>
                          {area.growth}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                        {area.title}
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {area.titleEn}
                      </p>
                    </div>
                    
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mt-4">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-6">
                    {/* Investment Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{area.stats.value}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{area.stats.label}</div>
                      </div>
                      <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{area.projects}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">مشروع نشط</div>
                      </div>
                    </div>
                    
                    {/* Technologies */}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        التقنيات الأساسية
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {area.technologies.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white/60 dark:bg-white/20 text-slate-700 dark:text-slate-300 border-0">
                            {tech}
                          </Badge>
                        ))}
                        {area.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-white/60 dark:bg-white/20 text-slate-700 dark:text-slate-300 border-0">
                            +{area.technologies.length - 3} المزيد
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white/30 dark:bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{area.metrics.roi}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">عائد استثمار</div>
                      </div>
                      <div className="bg-white/30 dark:bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{area.metrics.success}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">معدل نجاح</div>
                      </div>
                      <div className="bg-white/30 dark:bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{area.metrics.timeline}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">متوسط</div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${area.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-medium">قصص نجاح استثنائية</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              استثمارات حققت
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                عوائد استثنائية
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              مشاريع تقنية رائدة استثمرنا فيها وحققت نمواً هائلاً وعوائد تفوق التوقعات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => {
              const IconComponent = story.icon;
              return (
                <Card key={index} className="group bg-slate-800/50 border-slate-700/50 hover:border-slate-600 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${story.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs font-bold">
                        {story.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                      {story.name}
                    </CardTitle>
                    <p className="text-sm text-slate-400 mb-2 font-medium">{story.nameEn}</p>
                    <CardDescription className="text-slate-300 leading-relaxed">
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Investment Performance */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">{story.investment}</div>
                        <div className="text-xs text-slate-400">استثمار أولي</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-400">{story.returns}</div>
                        <div className="text-xs text-slate-400">عوائد حالية</div>
                      </div>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="flex items-center justify-between py-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-300">عائد الاستثمار</span>
                      </div>
                      <span className="font-bold text-green-400">{story.roi}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">مدة الاستثمار</span>
                      </div>
                      <span className="font-bold text-blue-400">{story.timeline}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">القطاع</span>
                      </div>
                      <span className="font-bold text-purple-400 text-sm">{story.sector}</span>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${story.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </Card>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">1.1B+</div>
              <div className="text-slate-400">إجمالي الاستثمارات</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">4.2B+</div>
              <div className="text-slate-400">إجمالي العوائد</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">365%+</div>
              <div className="text-slate-400">متوسط عائد الاستثمار</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform">92%</div>
              <div className="text-slate-400">معدل نجاح المشاريع</div>
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

      {/* CTA Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Rocket className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-white font-medium">انضم لرحلة الاستثمار التقني</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              ابدأ استثمارك
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                في المستقبل
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              انضم إلى شركاء النجاح وابدأ رحلة استثمارية استثنائية في أحدث التقنيات مع عوائد مضمونة وشراكة طويلة الأمد
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <Mail className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                ابدأ الاستثمار الآن
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Phone className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                استشارة استثمارية مجانية
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">متابعة استثمارية متواصلة</h4>
                <p className="text-slate-300 leading-relaxed">تقارير دورية وشفافية كاملة في جميع مراحل الاستثمار</p>
              </div>
              <div className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">خبرة استثمارية عريقة</h4>
                <p className="text-slate-300 leading-relaxed">أكثر من 15 سنة في الاستثمار التقني وإدارة المحافظ</p>
              </div>
              <div className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">ضمانات استثمارية قوية</h4>
                <p className="text-slate-300 leading-relaxed">حماية المستثمرين وضمانات قانونية شاملة لجميع الاستثمارات</p>
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