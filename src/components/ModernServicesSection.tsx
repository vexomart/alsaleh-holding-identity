import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Megaphone, 
  Palette, 
  ShoppingCart, 
  Users,
  Shield,
  ArrowRight,
  Star,
  Sparkles,
  Zap
} from "lucide-react";

const modernServices = [
  {
    id: 1,
    title: "البرمجة والتطوير",
    shortDesc: "مواقع وتطبيقات متطورة بأحدث التقنيات",
    icon: Code,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "from-blue-500 to-cyan-500",
    price: "5,000",
    delay: "0ms"
  },
  {
    id: 2,
    title: "التسويق الرقمي",
    shortDesc: "استراتيجيات تسويقية ذكية لنمو أعمالك",
    icon: Megaphone,
    gradient: "from-pink-500/20 to-red-500/20",
    iconBg: "from-pink-500 to-red-500",
    price: "3,000", 
    delay: "150ms"
  },
  {
    id: 3,
    title: "التصميم الإبداعي",
    shortDesc: "هوية بصرية مميزة تعكس احترافية علامتك",
    icon: Palette,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconBg: "from-purple-500 to-pink-500",
    price: "2,500",
    delay: "300ms"
  },
  {
    id: 4,
    title: "المتاجر الإلكترونية",
    shortDesc: "متاجر احترافية متكاملة لزيادة المبيعات",
    icon: ShoppingCart,
    gradient: "from-orange-500/20 to-red-500/20", 
    iconBg: "from-orange-500 to-red-500",
    price: "8,000",
    delay: "450ms"
  },
  {
    id: 5,
    title: "منصات الأعمال",
    shortDesc: "حلول ذكية لربط العمال بالعملاء",
    icon: Users,
    gradient: "from-teal-500/20 to-blue-500/20",
    iconBg: "from-teal-500 to-blue-500",
    price: "6,000",
    delay: "600ms"
  },
  {
    id: 6,
    title: "الأمن السيبراني",
    shortDesc: "حماية متقدمة لبياناتك ومعلوماتك",
    icon: Shield,
    gradient: "from-red-500/20 to-orange-500/20",
    iconBg: "from-red-500 to-orange-500", 
    price: "5,500",
    delay: "750ms"
  }
];

const ModernServicesSection = () => {
  const whatsappNumber = "966555812567";
  
  const openWhatsApp = (serviceTitle: string, price: string) => {
    const message = `🚀 مرحبا بك في ASH HOLDING

💼 طلب استشارة مجانية
═══════════════════

📌 الخدمة المطلوبة: ${serviceTitle}
💰 يبدأ من: ${price} ريال

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
                      onClick={() => openWhatsApp(service.title, service.price)}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>يبدأ من {service.price} ريال</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {service.shortDesc}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  <Button 
                    onClick={() => openWhatsApp(service.title, service.price)}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 group-hover:scale-105"
                    size="lg"
                  >
                    <span>استشارة مجانية</span>
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
            تواصل معنا للحصول على استشارة مجانية وعرض مخصص يناسب احتياجاتك
          </p>
          <Button 
            onClick={() => openWhatsApp("استشارة شاملة", "مجاني")}
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