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
      name: "علي صالح الشهري القابضة",
      nameEn: "Ali Saleh AlShahri Holdings", 
      description: "بورتال شركة علي صالح الشهري القابضة - مجموعة متنوعة من الاستثمارات والمشاريع الرائدة",
      category: "الشركة القابضة",
      established: "2016",
      icon: Building2,
      color: "from-amber-600 to-orange-600",
      website: "https://ash.holdings",
      isPortal: true
    },
    {
      name: "فكرة هولدينغ",
      nameEn: "Feklah Holding", 
      description: "شركة متخصصة في تقديم الخدمات التعليمية المبتكرة والحلول التقنية للتعليم",
      category: "الخدمات التعليمية",
      established: "2018",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-600",
      website: "https://feklah-holding.com"
    }
  ];  // سيتم إضافة المزيد من الشركات

  const renderPortalCard = (company) => {
    const IconComponent = company.icon;
    
    return (
      <div className="relative col-span-full lg:col-span-2 xl:col-span-3">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-700 group">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
          
          {/* Glowing Border Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>
          
          <CardContent className="relative z-10 p-12 text-center">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-pulse"></div>
                <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <IconComponent className="w-16 h-16 text-amber-600" />
                </div>
                {/* Floating Particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-6 mb-10">
              <div>
                <h2 className="text-4xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors duration-300">
                  {company.name}
                </h2>
                <h3 className="text-2xl font-medium text-amber-400 mb-4">
                  {company.nameEn}
                </h3>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 px-4 py-2">
                  {company.category}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                  تأسست {company.established}
                </Badge>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                {company.description}
              </p>
            </div>

            {/* Portal Features */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-medium">الشركات التابعة</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-medium">التقارير المالية</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-medium">فريق الإدارة</p>
              </div>
            </div>

            {/* CTA Button */}
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl border-0 shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 group/btn">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 ml-3 group-hover/btn:rotate-45 transition-transform duration-300" />
                دخول البورتال الرئيسي
              </a>
            </Button>
          </CardContent>
        </div>
      </div>
    );
  };

  const renderCompanyCard = (company, index) => {
    const IconComponent = company.icon;
    
    return (
      <Card className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 transform hover:scale-[1.02] animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${company.color}`}></div>
        
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
              {company.isPortal ? renderPortalCard(company) : renderCompanyCard(company, index)}
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
