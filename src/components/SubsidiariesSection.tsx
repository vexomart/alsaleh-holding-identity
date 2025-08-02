import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, TrendingUp, Users, Award, Rocket, Zap, Star, ExternalLink, GraduationCap, Monitor, ShoppingCart, BarChart3, MapPin, Clock, Trophy, Target, Shield, Briefcase } from "lucide-react";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "فكرة هولدينق",
      nameEn: "Fekrah Holding",
      description: "متخصصة بخدمات التعليم المتطورة من أبحاث للطلاب والموظفين والترجمة الأكاديمية والتحليل الإحصائي المتقدم والنشر بالمجلات المعتمدة دولياً",
      category: "الخدمات التعليمية والأكاديمية",
      established: "2019",
      services: ["أبحاث الطلاب والموظفين", "خدمات الترجمة المتخصصة", "التحليل الإحصائي المتقدم", "النشر الأكاديمي الدولي", "استشارات تعليمية", "برامج التدريب المهني"],
      icon: GraduationCap,
      stats: { projects: "2,850+", clients: "1,420+", countries: "28" },
      color: "from-blue-600 to-cyan-500",
      website: "https://fekrah-holding.com/",
      websiteName: "fekrah-holding.com",
      growth: "+185%",
      rating: "4.9/5",
      specialties: ["AI في التعليم", "البحث العلمي", "التعليم الرقمي"]
    },
    {
      name: "فكرة تيك",
      nameEn: "Fekrah Tech",
      description: "شركة تقنية عالمية رائدة متخصصة في تطوير الحلول التقنية المبتكرة والذكية، وتطبيقات الذكاء الاصطناعي، والحلول السحابية المتقدمة",
      category: "التقنية والذكاء الاصطناعي",
      established: "2020",
      services: ["تطوير التطبيقات الذكية", "حلول الذكاء الاصطناعي", "الحوسبة السحابية", "أمن المعلومات", "تطوير المواقع المتقدمة", "استشارات تقنية متخصصة"],
      icon: Monitor,
      stats: { projects: "1,950+", clients: "890+", countries: "35" },
      color: "from-emerald-600 to-teal-500",
      website: "https://fekrahtech.com",
      websiteName: "fekrahtech.com",
      growth: "+220%",
      rating: "4.8/5",
      specialties: ["الذكاء الاصطناعي", "البلوك تشين", "الواقع المعزز"]
    },
    {
      name: "شركة علي صالح الشهري القابضة",
      nameEn: "Ali Saleh Al-Shahri Holding Company",
      description: "الشركة القابضة الرائدة في المنطقة، متخصصة في إدارة الاستثمارات المتنوعة وتقديم خدمات الدعم الإستراتيجي والمشاريع الضخمة والحلول الإدارية المتطورة",
      category: "الاستثمارات والإدارة الإستراتيجية",
      established: "2016",
      services: ["إدارة الاستثمارات", "الاستشارات الإستراتيجية", "تطوير المشاريع الكبرى", "خدمات الدعم المؤسسي", "إدارة الطلبات المتقدمة", "التخطيط الإستراتيجي"],
      icon: Building2,
      stats: { projects: "3,200+", clients: "1,650+", countries: "42" },
      color: "from-purple-600 to-pink-500",
      website: "http://ash.holdings/",
      websiteName: "ash.holdings",
      growth: "+156%",
      rating: "4.9/5",
      specialties: ["الاستثمار العقاري", "التطوير العمراني", "الشراكات الإستراتيجية"]
    },
    {
      name: "أدفيكسو ميديا",
      nameEn: "Advixo Media Agency",
      description: "وكالة تسويق رقمي عالمية متطورة متخصصة في الحملات الإعلانية المبتكرة، وإدارة وسائل التواصل الاجتماعي، والتسويق بالذكاء الاصطناعي",
      category: "التسويق الرقمي والإعلان",
      established: "2021",
      services: ["التسويق الرقمي المتقدم", "إدارة الحملات الإعلانية", "تحليل البيانات التسويقية", "التسويق بالمؤثرين", "تطوير العلامات التجارية", "التسويق بالذكاء الاصطناعي"],
      icon: TrendingUp,
      stats: { projects: "1,780+", clients: "920+", countries: "31" },
      color: "from-orange-600 to-red-500",
      website: "https://advixo.media/",
      websiteName: "advixo.media",
      growth: "+275%",
      rating: "4.7/5",
      specialties: ["التسويق التفاعلي", "الإعلانات الذكية", "تحليل السلوك"]
    },
    {
      name: "نوماكسيو",
      nameEn: "Numaxio Financial Solutions",
      description: "منصة محاسبية وإدارية متطورة تقدم حلول ERP شاملة مع أنظمة إدارة المخزون الذكية والتقارير المالية المتقدمة باستخدام الذكاء الاصطناعي",
      category: "الحلول المالية والمحاسبية",
      established: "2022",
      services: ["أنظمة ERP المتطورة", "إدارة الفواتير الذكية", "التقارير المالية التفاعلية", "إدارة المخزون بالـ AI", "التحليل المالي المتقدم", "الامتثال الضريبي"],
      icon: BarChart3,
      stats: { projects: "1,240+", clients: "685+", countries: "25" },
      color: "from-yellow-500 to-orange-500",
      website: "https://numaxio.com/",
      websiteName: "numaxio.com",
      growth: "+190%",
      rating: "4.8/5",
      specialties: ["التحليل المالي", "الذكاء التجاري", "الأتمتة المحاسبية"]
    },
    {
      name: "شركة الشهري للتجارة الإلكترونية",
      nameEn: "Al-Shahri E-Commerce Solutions",
      description: "شركة رائدة في مجال التجارة الإلكترونية وحلول الدفع الرقمي، متخصصة في تطوير المتاجر الإلكترونية المتقدمة وأنظمة الدفع الآمنة",
      category: "التجارة الإلكترونية والدفع الرقمي",
      established: "2021",
      services: ["تطوير المتاجر الإلكترونية", "حلول الدفع الرقمي", "إدارة المخزون الذكية", "التسويق الإلكتروني", "خدمات الشحن والتوصيل", "تحليل سلوك المستهلكين"],
      icon: ShoppingCart,
      stats: { projects: "980+", clients: "540+", countries: "22" },
      color: "from-green-600 to-emerald-500",
      website: "https://vexomart.com/",
      websiteName: "vexomart.com",
      growth: "+312%",
      rating: "4.6/5",
      specialties: ["التجارة الذكية", "الدفع الآمن", "تجربة المستخدم"]
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
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-sm font-medium mb-2 bg-white/10 border-white/20">
                            {company.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>تأسست {company.established}</span>
                          </div>
                        </div>
                      </div>
                      {/* Rating & Growth Badge */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-primary">{company.rating}</span>
                        </div>
                        <Badge className={`bg-gradient-to-r ${company.color} text-white border-0 font-bold`}>
                          {company.growth}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Company Info */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-300">
                        {company.name}
                      </h3>
                      <p className="text-lg text-secondary font-medium mb-3">
                        {company.nameEn}
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {company.description}
                      </p>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-primary">{company.stats.projects}</div>
                        <div className="text-xs text-muted-foreground">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-primary">{company.stats.clients}</div>
                        <div className="text-xs text-muted-foreground">عميل</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-primary">{company.stats.countries}</div>
                        <div className="text-xs text-muted-foreground">دولة</div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        التخصصات الرئيسية:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, specialtyIndex) => (
                          <Badge 
                            key={specialtyIndex} 
                            className={`text-xs bg-gradient-to-r ${company.color} text-white border-0 hover:scale-105 transition-transform duration-200`}
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        الخدمات المتخصصة:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {company.services.slice(0, 4).map((service, serviceIndex) => (
                          <div 
                            key={serviceIndex} 
                            className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-muted-foreground hover:bg-white/10 transition-colors duration-200"
                          >
                            {service}
                          </div>
                        ))}
                      </div>
                      {company.services.length > 4 && (
                        <div className="text-xs text-center mt-2 text-muted-foreground">
                          +{company.services.length - 4} خدمات أخرى
                        </div>
                      )}
                    </div>

                    {/* Website Link */}
                    <div className="mt-4">
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 group/link text-sm w-full justify-center"
                      >
                        <Globe className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
                        <div className="text-center">
                          <div className="font-medium">زيارة الموقع</div>
                          <div className="text-xs opacity-90">{company.websiteName}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Global Presence Summary */}
        <div className="text-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-12 animate-fade-in border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Globe className="w-8 h-8 text-primary animate-pulse" />
            <h3 className="text-4xl font-bold text-primary">حضورنا العالمي المتطور</h3>
            <Trophy className="w-8 h-8 text-secondary animate-bounce" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="absolute top-4 right-4">
                <Briefcase className="w-6 h-6 text-blue-400 opacity-50" />
              </div>
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">12,800+</div>
              <div className="text-xl font-semibold text-primary mb-1">مشروع منجز</div>
              <div className="text-sm text-muted-foreground">Total Completed Projects</div>
              <div className="text-xs text-green-500 font-medium mt-2">+95% هذا العام</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="absolute top-4 right-4">
                <Users className="w-6 h-6 text-green-400 opacity-50" />
              </div>
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">6,505+</div>
              <div className="text-xl font-semibold text-primary mb-1">عميل راضٍ</div>
              <div className="text-sm text-muted-foreground">Satisfied Global Clients</div>
              <div className="text-xs text-green-500 font-medium mt-2">+78% هذا العام</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="absolute top-4 right-4">
                <MapPin className="w-6 h-6 text-purple-400 opacity-50" />
              </div>
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">185+</div>
              <div className="text-xl font-semibold text-primary mb-1">دولة حول العالم</div>
              <div className="text-sm text-muted-foreground">Countries Worldwide</div>
              <div className="text-xs text-green-500 font-medium mt-2">+65 دولة جديدة</div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🏆 أفضل شركة تقنية 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🌟 99.8% معدل رضا العملاء
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🚀 نمو +250% في 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🌍 قائد السوق العالمي
            </Badge>
          </div>

          {/* Bottom Stats */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <p className="text-lg text-primary font-semibold mb-2">
              نواصل ريادتنا العالمية بفضل فريقنا المتميز المكون من +850 خبير متخصص
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>نعمل على مدار الساعة لخدمة عملائنا في جميع أنحاء العالم</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiariesSection;