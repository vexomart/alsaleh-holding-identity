import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Megaphone, 
  Palette, 
  ShoppingCart, 
  Smartphone,
  Server,
  Video,
  TrendingUp,
  Search,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";

const modernServices = [
  {
    id: 1,
    title: "تصميم تطبيقات الجوال",
    shortDesc: "تطبيقات احترافية لنظامي iOS و Android",
    icon: Smartphone,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "from-blue-500 to-cyan-500",
    delay: "0ms"
  },
  {
    id: 2,
    title: "تصميم متجر الكتروني",
    shortDesc: "متاجر إلكترونية متكاملة ومحسنة",
    icon: ShoppingCart,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconBg: "from-green-500 to-emerald-500",
    delay: "100ms"
  },
  {
    id: 3,
    title: "تطوير وتصميم مواقع الانترنت",
    shortDesc: "مواقع ويب متجاوبة وسريعة التحميل",
    icon: Code,
    gradient: "from-purple-500/20 to-violet-500/20",
    iconBg: "from-purple-500 to-violet-500",
    delay: "200ms"
  },
  {
    id: 4,
    title: "استضافة مواقع و حجز دومينات",
    shortDesc: "خدمات استضافة آمنة وموثوقة",
    icon: Server,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconBg: "from-orange-500 to-amber-500",
    delay: "300ms"
  },
  {
    id: 5,
    title: "التسويق الإلكتروني",
    shortDesc: "حملات تسويقية مبتكرة ومستهدفة",
    icon: Megaphone,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconBg: "from-pink-500 to-rose-500",
    delay: "400ms"
  },
  {
    id: 6,
    title: "موشن جرافيك",
    shortDesc: "فيديوهات تفاعلية ومؤثرات بصرية",
    icon: Video,
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconBg: "from-indigo-500 to-blue-500",
    delay: "500ms"
  },
  {
    id: 7,
    title: "تصميم الهوية التجارية",
    shortDesc: "هويات بصرية احترافية ومميزة",
    icon: Palette,
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconBg: "from-teal-500 to-cyan-500",
    delay: "600ms"
  },
  {
    id: 8,
    title: "تطوير الأعمال",
    shortDesc: "استشارات وحلول تطوير الأعمال",
    icon: TrendingUp,
    gradient: "from-red-500/20 to-orange-500/20",
    iconBg: "from-red-500 to-orange-500",
    delay: "700ms"
  },
  {
    id: 9,
    title: "أرشفة مواقع (SEO)",
    shortDesc: "تحسين محركات البحث والظهور",
    icon: Search,
    gradient: "from-slate-600/20 to-gray-600/20",
    iconBg: "from-slate-600 to-gray-600",
    delay: "800ms"
  }
];

const ModernServicesSection = () => {
  const whatsappNumber = "966555812567";
  
  const openWhatsApp = (serviceTitle: string) => {
    const message = `🚀 مرحبا بك في ASH HOLDING

💼 استفسار عن الخدمة
═══════════════════

📌 الخدمة المطلوبة: ${serviceTitle}

🎯 أريد معرفة المزيد حول هذه الخدمة والحصول على عرض مخصص!

شكراً لكم 🙏`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/8"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 to-accent/6 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tr from-secondary/6 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <Badge variant="secondary" className="text-lg px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 rounded-full">
              خدماتنا المتميزة ✨
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6">
            حلول تقنية متكاملة
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتحقيق أهدافك الرقمية بأعلى معايير الجودة
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {modernServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className="relative group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 animate-fade-in"
                style={{ animationDelay: service.delay }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className={`p-4 rounded-xl bg-gradient-to-br ${service.iconBg} shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 group-hover:animate-pulse`}
                      onClick={() => openWhatsApp(service.title)}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {service.shortDesc}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  <Button 
                    onClick={() => openWhatsApp(service.title)}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 group-hover:scale-105"
                    size="lg"
                  >
                    <span>تواصل معنا</span>
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            <h3 className="text-2xl font-bold text-foreground">هل تحتاج خدمة مخصصة؟</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            تواصل معنا للحصول على عرض مخصص يناسب احتياجاتك
          </p>
          <Button 
            onClick={() => openWhatsApp("استشارة شاملة")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 px-8"
          >
            <span>تواصل معنا الآن</span>
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModernServicesSection;