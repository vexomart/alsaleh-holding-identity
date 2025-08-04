import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  Award, 
  Rocket, 
  Zap, 
  Star, 
  ExternalLink, 
  GraduationCap, 
  Monitor, 
  ShoppingCart, 
  BarChart3, 
  MapPin, 
  Clock, 
  Trophy, 
  Target, 
  Shield, 
  Briefcase,
  Brain,
  Database,
  Code,
  Palette,
  HeartHandshake,
  BookOpen,
  Lightbulb,
  Sparkles
} from "lucide-react";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "فكرة هولدينق",
      nameEn: "Fekrah Holding",
      description: "متخصصة بخدمات التعليم المتطورة من أبحاث للطلاب والموظفين والترجمة الأكاديمية والتحليل الإحصائي المتقدم والنشر بالمجلات المعتمدة دولياً",
      category: "الخدمات التعليمية والأكاديمية",
      established: "2019",
      icon: GraduationCap,
      stats: { projects: "2,850+", clients: "1,420+", countries: "28" },
      color: "from-blue-500 to-indigo-600",
      website: "https://fekrah-holding.com/",
      growth: "+185%",
      rating: "4.9/5",
      template: "premium"
    },
    {
      name: "فكرة تيك",
      nameEn: "Fekrah Tech",
      description: "شركة تقنية عالمية رائدة متخصصة في تطوير الحلول التقنية المبتكرة والذكية، وتطبيقات الذكاء الاصطناعي، والحلول السحابية المتقدمة",
      category: "التقنية والذكاء الاصطناعي",
      established: "2020",
      icon: Brain,
      stats: { projects: "1,950+", clients: "890+", countries: "35" },
      color: "from-emerald-500 to-teal-600",
      website: "https://fekrahtech.com",
      growth: "+220%",
      rating: "4.8/5",
      template: "tech"
    },
    {
      name: "شركة علي صالح الشهري القابضة",
      nameEn: "Ali Saleh Al-Shahri Holding Company",
      description: "الشركة القابضة الرائدة في المنطقة، متخصصة في إدارة الاستثمارات المتنوعة وتقديم خدمات الدعم الإستراتيجي والمشاريع الضخمة والحلول الإدارية المتطورة",
      category: "الاستثمارات والإدارة الإستراتيجية",
      established: "2016",
      icon: Building2,
      stats: { projects: "3,200+", clients: "1,650+", countries: "42" },
      color: "from-purple-500 to-violet-600",
      website: "http://ash.holdings/",
      growth: "+156%",
      rating: "4.9/5",
      template: "corporate"
    },
    {
      name: "فكرة للتسويق الرقمي",
      nameEn: "Fekrah Digital Marketing",
      description: "شركة رائدة في مجال التسويق الرقمي والإعلان الإلكتروني، متخصصة في إدارة الحملات الإعلانية وتحسين محركات البحث والتسويق عبر وسائل التواصل الاجتماعي",
      category: "التسويق الرقمي والإعلان",
      established: "2018",
      icon: TrendingUp,
      stats: { projects: "1,200+", clients: "650+", countries: "22" },
      color: "from-orange-500 to-red-600",
      website: "https://fekrah-digital.com",
      growth: "+195%",
      rating: "4.7/5",
      template: "premium"
    },
    {
      name: "فكرة للاستشارات الإدارية",
      nameEn: "Fekrah Management Consulting",
      description: "شركة استشارات إدارية متخصصة في تطوير الأعمال والتخطيط الاستراتيجي وإدارة المشاريع وتحسين العمليات التشغيلية للشركات والمؤسسات",
      category: "الاستشارات الإدارية",
      established: "2017",
      icon: Briefcase,
      stats: { projects: "890+", clients: "420+", countries: "18" },
      color: "from-cyan-500 to-blue-600",
      website: "https://fekrah-consulting.com",
      growth: "+165%",
      rating: "4.8/5",
      template: "corporate"
    },
    {
      name: "فكرة للتصميم والإبداع",
      nameEn: "Fekrah Design & Creativity",
      description: "استوديو تصميم إبداعي متخصص في تصميم الهوية البصرية والتصميم الجرافيكي وتصميم المواقع الإلكترونية والتطبيقات مع التركيز على الابتكار والجودة",
      category: "التصميم والإبداع",
      established: "2019",
      icon: Palette,
      stats: { projects: "1,500+", clients: "780+", countries: "25" },
      color: "from-pink-500 to-rose-600",
      website: "https://fekrah-design.com",
      growth: "+210%",
      rating: "4.9/5",
      template: "tech"
    },
    {
      name: "فكرة للتدريب والتطوير",
      nameEn: "Fekrah Training & Development",
      description: "مركز تدريب متخصص في تطوير المهارات المهنية والشخصية، يقدم برامج تدريبية متنوعة في مجالات الإدارة والقيادة والتقنية والتطوير الذاتي",
      category: "التدريب والتطوير",
      established: "2020",
      icon: BookOpen,
      stats: { projects: "950+", clients: "1,200+", countries: "15" },
      color: "from-green-500 to-emerald-600",
      website: "https://fekrah-training.com",
      growth: "+175%",
      rating: "4.8/5",
      template: "premium"
    },
    {
      name: "فكرة للحلول المالية",
      nameEn: "Fekrah Financial Solutions",
      description: "شركة متخصصة في تقديم الحلول المالية والاستشارات المحاسبية وإدارة الاستثمارات والتخطيط المالي للشركات والأفراد بأحدث الأساليب والتقنيات",
      category: "الحلول المالية",
      established: "2018",
      icon: BarChart3,
      stats: { projects: "1,100+", clients: "560+", countries: "20" },
      color: "from-yellow-500 to-orange-600",
      website: "https://fekrah-finance.com",
      growth: "+145%",
      rating: "4.7/5",
      template: "corporate"
    },
    {
      name: "فكرة للخدمات اللوجستية",
      nameEn: "Fekrah Logistics Services",
      description: "شركة خدمات لوجستية متكاملة متخصصة في إدارة سلاسل التوريد والشحن والتخزين والتوزيع مع شبكة عالمية واسعة وحلول تقنية متطورة",
      category: "الخدمات اللوجستية",
      established: "2019",
      icon: Globe,
      stats: { projects: "2,200+", clients: "980+", countries: "35" },
      color: "from-indigo-500 to-purple-600",
      website: "https://fekrah-logistics.com",
      growth: "+190%",
      rating: "4.8/5",
      template: "tech"
    }
  ];

  const renderCompanyCard = (company, index) => {
    const IconComponent = company.icon;
    
    const templates = {
      premium: () => (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white border-2 border-transparent hover:border-blue-200 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <Badge className={`bg-gradient-to-r ${company.color} text-white border-0 shadow-md`}>
                {company.growth}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{company.name}</h3>
            <p className="text-lg text-slate-600 font-medium mb-4">{company.nameEn}</p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{company.description}</p>
            <Button asChild className={`w-full bg-gradient-to-r ${company.color} text-white border-0`}>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 ml-2" />
                زيارة الموقع
              </a>
            </Button>
          </CardContent>
        </Card>
      ),

      tech: () => (
        <Card className="group relative overflow-hidden bg-slate-900 border-2 border-emerald-500/20 hover:border-emerald-400 transition-all duration-700">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:rotate-180 transition-all duration-700`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{company.name}</h3>
                <p className="text-emerald-400 font-mono text-sm">{company.nameEn}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{company.description}</p>
            <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 ml-2" />
                زيارة الموقع
              </a>
            </Button>
          </CardContent>
        </Card>
      ),

      corporate: () => (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-200 hover:border-purple-400 transition-all duration-700">
          <CardContent className="p-8 relative z-10">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${company.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">{company.name}</h3>
              <p className="text-purple-600 font-semibold">{company.nameEn}</p>
            </div>
            <p className="text-purple-700 text-sm leading-relaxed mb-6 text-center">{company.description}</p>
            <Button asChild className={`w-full bg-gradient-to-r ${company.color} text-white border-0`}>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Building2 className="w-4 h-4 ml-2" />
                موقع الشركة
              </a>
            </Button>
          </CardContent>
        </Card>
      )
    };

    return templates[company.template] ? templates[company.template]() : templates.premium();
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
            <Building2 className="w-6 h-6 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">شركات تابعة • نمو عالمي</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-tight">
            شركاتنا <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">التابعة</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            مجموعة متنوعة من الشركات المتخصصة عالمياً التي تعمل في مجالات مختلفة لتقديم حلول شاملة ومتكاملة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {subsidiaries.map((company, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.15}s` }}>
              {renderCompanyCard(company, index)}
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-white/10 to-slate-100/10 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
            <h3 className="text-3xl font-bold text-slate-800 mb-8">إنجازاتنا الجماعية</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">9</div>
                <div className="text-slate-600">شركات متخصصة</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">15K+</div>
                <div className="text-slate-600">مشروع منجز</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">8K+</div>
                <div className="text-slate-600">عميل راضي</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">42</div>
                <div className="text-slate-600">دولة حول العالم</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiariesSection;
