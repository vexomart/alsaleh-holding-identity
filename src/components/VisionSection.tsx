import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Globe, 
  Brain, 
  Shield, 
  Rocket, 
  Star, 
  TrendingUp, 
  Users, 
  Network, 
  Award, 
  Eye, 
  Heart, 
  Zap, 
  Building2, 
  Lightbulb, 
  Compass,
  ChevronRight,
  CheckCircle,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const VisionSection = () => {
  const visionPillars = [
    {
      icon: Brain,
      title: "الذكاء الاصطناعي والابتكار",
      description: "نقود التطوير التقني بحلول ذكية متقدمة تخدم مستقبل الأعمال الرقمية",
      color: "from-blue-600 to-indigo-700",
      bgColor: "from-blue-50 to-indigo-50",
      stats: "AI-Powered",
      number: "250+",
      metric: "مشروع ذكي"
    },
    {
      icon: Globe,
      title: "التوسع العالمي الاستراتيجي",
      description: "شبكة عالمية من المكاتب والشراكات تمتد عبر القارات لخدمة عملائنا",
      color: "from-emerald-600 to-teal-700",
      bgColor: "from-emerald-50 to-teal-50",
      stats: "Global Reach",
      number: "68+",
      metric: "دولة"
    },
    {
      icon: Shield,
      title: "الأمن السيبراني المتقدم",
      description: "حماية شاملة للبيانات والأنظمة بأعلى معايير الأمن السيبراني العالمية",
      color: "from-orange-600 to-red-700",
      bgColor: "from-orange-50 to-red-50",
      stats: "Security First",
      number: "99.9%",
      metric: "موثوقية"
    },
    {
      icon: Network,
      title: "الاتصال والشبكات الذكية",
      description: "بنية تحتية متطورة تدعم التقنيات الحديثة وإنترنت الأشياء",
      color: "from-purple-600 to-pink-700",
      bgColor: "from-purple-50 to-pink-50",
      stats: "Connected",
      number: "5G+",
      metric: "تقنيات"
    }
  ];

  const strategicGoals = [
    {
      icon: Rocket,
      title: "قيادة التحول الرقمي",
      description: "تمكين المؤسسات من تحقيق التحول الرقمي بحلول مبتكرة ومتكاملة"
    },
    {
      icon: Star,
      title: "التميز في الخدمات",
      description: "تقديم خدمات بمعايير عالمية تحقق رضا العملاء وتفوق توقعاتهم"
    },
    {
      icon: Compass,
      title: "الاستدامة والمسؤولية",
      description: "الالتزام بالممارسات المستدامة والمسؤولية الاجتماعية"
    },
    {
      icon: Building2,
      title: "الشراكات الاستراتيجية",
      description: "بناء تحالفات قوية مع الشركات الرائدة عالمياً"
    }
  ];

  const globalImpact = [
    { 
      number: "68+", 
      label: "دولة", 
      sublabel: "Countries", 
      icon: Globe,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      number: "2.5M+", 
      label: "مستخدم", 
      sublabel: "Active Users", 
      icon: Users,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      number: "1,200+", 
      label: "شراكة", 
      sublabel: "Partnerships", 
      icon: Network,
      color: "from-orange-500 to-red-500"
    },
    { 
      number: "150+", 
      label: "جائزة", 
      sublabel: "Awards", 
      icon: Award,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-indigo-100/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-300/5 to-blue-300/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-500/20 mb-8">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Global Vision 2030+ • شركة عالمية</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-center">
            <span className="bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              رؤيتنا العالمية
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8 text-center">
            نقود مستقبل التقنية عالمياً من خلال الابتكار المستمر والشراكات الاستراتيجية، 
            نحو عالم رقمي متصل ومستدام يخدم التنمية الاقتصادية والاجتماعية
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["Innovation", "Global Excellence", "Digital Transformation", "Sustainability"].map((tag, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Vision Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-10 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">رؤيتنا</h3>
                  <Badge className="bg-blue-100 text-blue-700 border-0">Vision 2030+</Badge>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6 text-lg text-center">
                أن نكون الشركة القابضة الرائدة عالمياً في تقديم الحلول التقنية المبتكرة، 
                نقود التحول الرقمي ونساهم في بناء مستقبل تقني مستدام يخدم المجتمعات
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">2030+</div>
                  <div className="text-sm text-slate-600">رؤية مستقبلية</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">عالمياً</div>
                  <div className="text-sm text-slate-600">نطاق التأثير</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-10 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">رسالتنا</h3>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">Global Mission</Badge>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6 text-lg text-center">
                تطوير وتقديم حلول تقنية مبتكرة تحسن جودة الحياة وتدعم التنمية المستدامة، 
                من خلال الاستثمار الذكي وبناء شراكات عالمية تساهم في تقدم المجتمع
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600">الإنسان</div>
                  <div className="text-sm text-slate-600">محور اهتمامنا</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600">التقنية</div>
                  <div className="text-sm text-slate-600">أداة التطوير</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vision Pillars */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-6 text-center">
              أركان رؤيتنا <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">الاستراتيجية</span>
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-center">
              أربعة أركان أساسية تحدد مسارنا نحو المستقبل الرقمي والتميز العالمي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visionPillars.map((pillar, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <pillar.icon className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-white/80 border-slate-200">
                      {pillar.stats}
                    </Badge>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-slate-800 mb-1">{pillar.number}</div>
                    <div className="text-sm text-slate-500">{pillar.metric}</div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 text-center">
                    {pillar.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm leading-relaxed text-center">
                    {pillar.description}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-6 text-center">
              أهدافنا <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">الاستراتيجية</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategicGoals.map((goal, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <goal.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 text-center">
                    {goal.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm leading-relaxed text-center">
                    {goal.description}
                  </p>

                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Impact Stats */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 text-center">
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-white mb-4 text-center">تأثيرنا العالمي</h3>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto text-center">
              أرقام تتحدث عن مسيرتنا نحو التميز والريادة العالمية
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {globalImpact.map((stat, index) => (
              <div key={index} className="group">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                
                <div className="text-lg font-medium text-slate-300 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="flex flex-wrap justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Innovation Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Global Leadership</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Sustainable Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;