import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Target, 
  Users, 
  Award, 
  Rocket, 
  Star, 
  TrendingUp, 
  Shield, 
  Globe,
  Briefcase,
  Crown,
  Lightbulb,
  Heart,
  Handshake,
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react";

const AboutSection = () => {
  // معلومات الشركة المنظمة في كروت
  const companyInfo = [
    {
      title: "نبذة عن الشركة",
      titleEn: "About Company", 
      description: "بدأت ASH HOLDING العمل منذ عام 2016، وتم تحويلها رسمياً إلى شركة قابضة عام 2025. نحن متخصصون في الاستثمار بالمجالات التقنية والإعلامية والتعليمية، ونضم تحت مظلتنا مجموعة من الشركات الفرعية المتخصصة التي تقدم حلولاً شاملة لعملائنا.",
      icon: Building2,
      color: "from-blue-600 to-cyan-500",
      stats: { value: "2016", label: "سنة التأسيس" },
      features: ["شركة قابضة رائدة", "استثمارات متنوعة", "فريق متخصص"]
    },
    {
      title: "رؤيتنا",
      titleEn: "Our Vision",
      description: "أن نكون الشركة القابضة الرائدة في المنطقة في مجال الاستثمار التقني والإعلامي، ونساهم في بناء مستقبل رقمي مزدهر يخدم المجتمع ويحقق التنمية المستدامة.",
      icon: Target,
      color: "from-purple-600 to-pink-500", 
      stats: { value: "42", label: "دولة حول العالم" },
      features: ["ريادة تقنية", "رؤية مستقبلية", "تأثير عالمي"]
    },
    {
      title: "مهمتنا",
      titleEn: "Our Mission",
      description: "تقديم حلول تقنية وإعلامية مبتكرة تلبي احتياجات عملائنا وتساهم في تطوير الاقتصاد الرقمي، من خلال الاستثمار في أفضل المواهب والتقنيات الحديثة.",
      icon: Rocket,
      color: "from-emerald-600 to-teal-500",
      stats: { value: "14,883", label: "مشروع منجز" },
      features: ["حلول مبتكرة", "تقنيات حديثة", "خدمة متميزة"]
    }
  ];

  // القيم الأساسية
  const coreValues = [
    {
      title: "الابتكار والتميز",
      description: "نسعى دائماً للابتكار في جميع أعمالنا ونحرص على التميز في تقديم خدماتنا",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "الشراكة الاستراتيجية", 
      description: "نؤمن بأهمية بناء شراكات قوية ومستدامة مع عملائنا وشركائنا",
      icon: Handshake,
      color: "from-green-600 to-emerald-500"
    },
    {
      title: "المساهمة في التنمية",
      description: "نساهم بفعالية في التنمية الاقتصادية والاجتماعية للمملكة والمنطقة",
      icon: TrendingUp,
      color: "from-blue-600 to-purple-500"
    },
    {
      title: "دعم الشباب السعودي",
      description: "نحرص على دعم الشباب السعودي وتطوير مواهبهم وقدراتهم",
      icon: Users,
      color: "from-pink-600 to-red-500"
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-indigo-100/40"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-56 h-56 bg-blue-400/5 rounded-full blur-2xl animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">شركة قابضة • رؤية عالمية</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            من <span className="text-gradient-primary">نحن</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            ASH HOLDING - كيان استثماري رائد يضم مجموعة من الشركات المتخصصة في التقنية والإعلام والتعليم
          </p>
        </div>

        {/* Company Info Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {companyInfo.map((info, index) => {
            const IconComponent = info.icon;
            
            return (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-primary">{info.stats.value}</div>
                        <div className="text-xs text-muted-foreground">{info.stats.label}</div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-300">
                        {info.title}
                      </h3>
                      <p className="text-lg text-secondary font-medium mb-3">
                        {info.titleEn}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                      {info.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {info.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3 group/item">
                          <CheckCircle className="w-4 h-4 text-green-500 group-hover/item:scale-125 transition-transform duration-200" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Core Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Heart className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">قيمنا الأساسية</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              ما <span className="text-gradient-primary">نؤمن</span> به
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نؤسس أعمالنا على قيم راسخة تضمن تحقيق التميز والنجاح المستدام
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              
              return (
                <Card 
                  key={index} 
                  className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in text-center"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <CardContent className="p-6 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="text-lg font-bold text-primary mb-3 group-hover:text-gradient-primary transition-all duration-300">
                        {value.title}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '1s' }}>
          <Card className="shadow-elegant border-0 bg-gradient-primary text-center card-animated">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-3 sm:mb-4 animate-bounce-gentle">14,883</div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary-foreground">مشروع منجز</h3>
              <p className="text-primary-foreground/80 mt-2 text-sm sm:text-base">مشاريع متنوعة عبر جميع الشركات الفرعية</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0 bg-gradient-secondary text-center card-animated">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-secondary-foreground mb-3 sm:mb-4 animate-bounce-gentle">9,512</div>
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-foreground">عميل راضٍ</h3>
              <p className="text-secondary-foreground/80 mt-2 text-sm sm:text-base">عملاء يثقون في خدماتنا المتميزة</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-gradient-to-br from-green-600 to-emerald-500 text-center card-animated">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 animate-bounce-gentle">42</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">دولة</h3>
              <p className="text-white/80 mt-2 text-sm sm:text-base">انتشار عالمي في القارات المختلفة</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-gradient-to-br from-purple-600 to-pink-500 text-center card-animated">
            <CardContent className="p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 animate-bounce-gentle">8</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">شركات تابعة</h3>
              <p className="text-white/80 mt-2 text-sm sm:text-base">شركات متخصصة في مجالات مختلفة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;