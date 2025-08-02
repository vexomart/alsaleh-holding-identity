import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, TrendingUp, Users, Award, Rocket, Zap, Star, ExternalLink, GraduationCap, Monitor, ShoppingCart, BarChart3 } from "lucide-react";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "فكرة هولدينق",
      nameEn: "Fekrah Holding",
      description: "متخصصة بخدمات التعليم من أبحاث للطلاب والموظفين والترجمة والتحليل الإحصائي والنشر بالمجلات المعتمدة",
      category: "الخدمات التعليمية",
      established: "2019",
      services: ["أبحاث الطلاب والموظفين", "خدمات الترجمة", "التحليل الإحصائي", "النشر الأكاديمي"],
      icon: GraduationCap,
      stats: { projects: "500+", clients: "250+", countries: "15" },
      color: "from-blue-600 to-cyan-500",
      website: "https://fekrah-holding.com/",
      websiteName: "fekrah-holding.com"
    },
    {
      name: "فكرة تيك",
      nameEn: "Fekrah Tech",
      description: "شركة تقنية رائدة متخصصة في تطوير الحلول التقنية المتقدمة والابتكارات الرقمية",
      category: "التقنية والبرمجة",
      established: "2020",
      services: ["تطوير التطبيقات", "الحلول التقنية", "الابتكار الرقمي", "الاستشارات التقنية"],
      icon: Monitor,
      stats: { projects: "300+", clients: "180+", countries: "12" },
      color: "from-emerald-600 to-teal-500",
      website: "https://fekrahtech.com",
      websiteName: "fekrahtech.com"
    },
    {
      name: "شركة علي صالح الشهري القابضة",
      nameEn: "Ali Saleh Al-Shahri Holding",
      description: "الموقع الرسمي للشركة القابضة، متخصصة في خدمات الدعم والطلبات والمشاريع المتنوعة",
      category: "الشركة القابضة",
      established: "2016",
      services: ["خدمات الدعم", "إدارة الطلبات", "تنفيذ المشاريع", "الاستشارات الإدارية"],
      icon: Building2,
      stats: { projects: "800+", clients: "400+", countries: "20" },
      color: "from-purple-600 to-pink-500",
      website: "http://ash.holdings/",
      websiteName: "ash.holdings"
    },
    {
      name: "أدفيكسو ميديا",
      nameEn: "Advixo Media",
      description: "وكالة تسويق رقمي متخصصة في تقديم حلول التسويق الإبداعية والاستراتيجيات الرقمية المتقدمة",
      category: "التسويق الرقمي",
      established: "2021",
      services: ["التسويق الرقمي", "إدارة المحتوى", "الإعلانات الممولة", "الاستراتيجيات التسويقية"],
      icon: TrendingUp,
      stats: { projects: "400+", clients: "200+", countries: "10" },
      color: "from-orange-600 to-red-500",
      website: "https://advixo.media/",
      websiteName: "advixo.media"
    },
    {
      name: "نوماكسيو",
      nameEn: "Numaxio",
      description: "منصة محاسبة وفواتير متطورة مع نظام إدارة المخزون الذكي للشركات والمؤسسات",
      category: "الحلول المحاسبية",
      established: "2022",
      services: ["نظام المحاسبة", "إدارة الفواتير", "إدارة المخزون", "التقارير المالية"],
      icon: BarChart3,
      stats: { projects: "200+", clients: "120+", countries: "8" },
      color: "from-yellow-500 to-orange-500",
      website: "https://numaxio.com/",
      websiteName: "numaxio.com"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">شركات تابعة • نمو عالمي</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            شركاتنا <span className="text-gradient-primary">التابعة</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            نضم مجموعة متنوعة من الشركات المتخصصة عالمياً التي تعمل في مجالات مختلفة لتقديم حلول شاملة ومتكاملة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {subsidiaries.map((company, index) => {
            const IconComponent = company.icon;
            
            return (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-10 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-sm font-medium mb-2 bg-white/10 border-white/20">
                            {company.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-4 h-4" />
                            <span>تأسست {company.established}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-gradient-primary transition-all duration-300">
                        {company.name}
                      </h3>
                      <p className="text-lg text-secondary font-medium mb-4">
                        {company.nameEn}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {company.description}
                      </p>
                    </div>

                    {/* Global Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gradient-primary">{company.stats.projects}</div>
                        <div className="text-xs text-muted-foreground">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gradient-primary">{company.stats.clients}</div>
                        <div className="text-xs text-muted-foreground">عميل</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gradient-primary">{company.stats.countries}</div>
                        <div className="text-xs text-muted-foreground">دولة</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        الخدمات المتخصصة:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.services.map((service, serviceIndex) => (
                          <Badge 
                            key={serviceIndex} 
                            variant="outline"
                            className="text-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground bg-white/10 border-white/20"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Website Link */}
                    <div className="mt-6">
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 group/link"
                      >
                        <Globe className="w-5 h-5 group-hover/link:rotate-12 transition-transform duration-300" />
                        <div className="text-right">
                          <div className="text-sm font-medium">اضغط هنا للدخول</div>
                          <div className="text-xs opacity-90">{company.websiteName}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Global Presence Summary */}
        <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-10 animate-fade-in">
          <h3 className="text-3xl font-bold text-primary mb-8">حضورنا العالمي</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">595+</div>
              <div className="text-lg font-semibold text-primary">مشروع منجز</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">355+</div>
              <div className="text-lg font-semibold text-primary">عميل راضٍ</div>
              <div className="text-sm text-muted-foreground">Satisfied Clients</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">68+</div>
              <div className="text-lg font-semibold text-primary">دولة حول العالم</div>
              <div className="text-sm text-muted-foreground">Countries Worldwide</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">99%</div>
              <div className="text-lg font-semibold text-primary">معدل النجاح</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiariesSection;