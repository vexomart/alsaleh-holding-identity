import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, TrendingUp, Users, Award, Rocket, Zap, Star } from "lucide-react";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "شركة الشهري للتقنية المتقدمة",
      nameEn: "Al-Shahri Advanced Technology",
      description: "رائدة في تطوير الحلول التقنية المتقدمة والذكاء الاصطناعي على المستوى العالمي",
      category: "التقنية المتقدمة",
      established: "2020",
      services: ["حلول الذكاء الاصطناعي", "البلوك تشين", "إنترنت الأشياء", "الحوسبة السحابية"],
      icon: Rocket,
      stats: { projects: "150+", clients: "85+", countries: "12" },
      color: "from-blue-600 to-cyan-500"
    },
    {
      name: "شركة الشهري للإعلام الرقمي",
      nameEn: "Al-Shahri Digital Media",
      description: "منصة إعلامية رقمية عالمية متخصصة في إنتاج المحتوى التقني والإبداعي",
      category: "الإعلام الرقمي",
      established: "2021",
      services: ["إنتاج المحتوى الرقمي", "البث المباشر", "المنصات الإعلامية", "التسويق الرقمي"],
      icon: Globe,
      stats: { projects: "200+", clients: "120+", countries: "18" },
      color: "from-emerald-600 to-teal-500"
    },
    {
      name: "شركة الشهري للاستشارات العالمية",
      nameEn: "Al-Shahri Global Consulting",
      description: "شركة استشارات عالمية متخصصة في التحول الرقمي والابتكار التقني",
      category: "الاستشارات العالمية",
      established: "2022",
      services: ["استشارات التحول الرقمي", "الإدارة الاستراتيجية", "تطوير الأعمال", "حلول المؤسسات"],
      icon: TrendingUp,
      stats: { projects: "100+", clients: "60+", countries: "15" },
      color: "from-purple-600 to-pink-500"
    },
    {
      name: "شركة الشهري للتجارة الإلكترونية العالمية",
      nameEn: "Al-Shahri Global E-Commerce",
      description: "منصة تجارة إلكترونية عالمية متطورة بتقنيات الذكاء الاصطناعي",
      category: "التجارة الإلكترونية",
      established: "2023",
      services: ["منصات التجارة الذكية", "حلول الدفع الرقمي", "اللوجستيات الذكية", "تحليل البيانات"],
      icon: Building2,
      stats: { projects: "80+", clients: "45+", countries: "10" },
      color: "from-orange-600 to-red-500"
    },
    {
      name: "شركة الشهري للابتكار والبحث",
      nameEn: "Al-Shahri Innovation & Research",
      description: "مختبرات أبحاث متقدمة تركز على تطوير التقنيات المستقبلية والابتكار",
      category: "البحث والتطوير",
      established: "2024",
      services: ["مختبرات الابتكار", "البحث والتطوير", "حاضنات التقنية", "براءات الاختراع"],
      icon: Zap,
      stats: { projects: "25+", clients: "15+", countries: "5" },
      color: "from-indigo-600 to-blue-600"
    },
    {
      name: "شركة الشهري للحلول المالية الرقمية",
      nameEn: "Al-Shahri Digital Financial Solutions",
      description: "حلول مالية رقمية متطورة تعتمد على البلوك تشين والذكاء الاصطناعي",
      category: "التقنية المالية",
      established: "2024",
      services: ["حلول البلوك تشين", "العملات الرقمية", "التمويل الذكي", "أنظمة الدفع المبتكرة"],
      icon: Award,
      stats: { projects: "40+", clients: "30+", countries: "8" },
      color: "from-yellow-500 to-orange-500"
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
                    
                    <div>
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