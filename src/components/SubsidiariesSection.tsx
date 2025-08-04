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
      name: "أمكان للتطوير العقاري",
      nameEn: "Emkan Real Estate Development", 
      description: "شركة رائدة في التطوير العقاري تركز على المشاريع السكنية والتجارية المبتكرة في المملكة العربية السعودية",
      category: "التطوير العقاري",
      established: "2018",
      icon: Building2,
      color: "from-blue-600 to-purple-600",
      website: "https://emkan.com.sa"
    },
    {
      name: "مدفوع للمدفوعات الرقمية",
      nameEn: "Madfu Digital Payments",
      description: "منصة مدفوعات رقمية متطورة تقدم حلول دفع آمنة ومبتكرة للشركات والأفراد",
      category: "التقنية المالية",
      established: "2020",
      icon: Monitor,
      color: "from-emerald-500 to-blue-500",
      website: "https://madfu.com"
    },
    {
      name: "تسهيل للخدمات المالية",
      nameEn: "Tasaheel Financial Services",
      description: "شركة خدمات مالية متخصصة في التمويل والاستثمار وإدارة الأصول",
      category: "الخدمات المالية",
      established: "2019",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      website: "https://tasaheel.com"
    },
    {
      name: "الراجحي كابيتال",
      nameEn: "AlRajhi Capital",
      description: "شركة استثمار رائدة تقدم خدمات الوساطة والاستثمار وإدارة الأصول",
      category: "الاستثمار",
      established: "2005",
      icon: BarChart3,
      color: "from-green-600 to-teal-600",
      website: "https://alrajhicapital.com"
    },
    {
      name: "تابي للتمويل",
      nameEn: "Tabby Financing",
      description: "منصة تمويل مبتكرة تقدم حلول الدفع الآجل والتقسيط للمستهلكين",
      category: "التقنية المالية",
      established: "2019",
      icon: Users,
      color: "from-purple-600 to-pink-600",
      website: "https://tabby.ai"
    },
    {
      name: "تمارا للمدفوعات",
      nameEn: "Tamara Payments",
      description: "شركة مدفوعات رقمية تركز على حلول الدفع الآجل والتقسيط في منطقة الشرق الأوسط",
      category: "المدفوعات الرقمية",
      established: "2020",
      icon: ShoppingCart,
      color: "from-indigo-600 to-purple-600",
      website: "https://tamara.co"
    }
  ];

  const renderCompanyCard = (company, index) => {
    const IconComponent = company.icon;
    
    return (
      <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 transform hover:scale-[1.02] animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${company.color}"></div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/20`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
              تأسست {company.established}
            </Badge>
          </div>
          
          <div className="space-y-3 mb-6">
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">{company.name}</h3>
            <p className="text-lg text-blue-600 font-medium">{company.nameEn}</p>
            <Badge variant="outline" className="text-xs text-slate-600 border-slate-300">
              {company.category}
            </Badge>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-8">{company.description}</p>
          
          <Button asChild className={`w-full bg-gradient-to-r ${company.color} text-white border-0 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300`}>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 ml-2" />
              زيارة الموقع الرسمي
            </a>
          </Button>
        </CardContent>
      </Card>
    );
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
                <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
                <div className="text-slate-600">شركات متخصصة</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-slate-600">مشروع منجز</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
                <div className="text-slate-600">عميل راضي</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">15</div>
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
