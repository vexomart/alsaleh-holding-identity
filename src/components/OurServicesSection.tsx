import { useState } from "react";
import { Code, Package, Megaphone, Building, PenTool, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "برمجة التطبيقات والمواقع",
    description: "تطوير تطبيقات الجوال والمواقع الإلكترونية بأحدث التقنيات والمعايير العالمية",
    icon: Code,
    color: "from-primary to-primary-glow",
    shadowColor: "shadow-glow",
    delay: "0s"
  },
  {
    id: 2,
    title: "المشاريع الجاهزة",
    description: "حلول برمجية جاهزة ومتكاملة لتسريع إطلاق مشروعك التجاري بأقل وقت وتكلفة",
    icon: Package,
    color: "from-secondary to-secondary-light",
    shadowColor: "shadow-secondary-glow",
    delay: "0.2s"
  },
  {
    id: 3,
    title: "التسويق الإلكتروني",
    description: "استراتيجيات تسويقية متقدمة لزيادة الوصول والمبيعات عبر القنوات الرقمية",
    icon: Megaphone,
    color: "from-accent to-accent-light",
    shadowColor: "shadow-accent-glow",
    delay: "0.4s"
  },
  {
    id: 4,
    title: "أنظمة الشركات",
    description: "أنظمة إدارة متطورة لتحسين العمليات التشغيلية وزيادة كفاءة الأداء",
    icon: Building,
    color: "from-primary-variant to-accent",
    shadowColor: "shadow-glow",
    delay: "0.6s"
  },
  {
    id: 5,
    title: "صناعة المحتوى",
    description: "إنتاج محتوى إبداعي ومؤثر يعكس هوية علامتك التجارية ويجذب جمهورك المستهدف",
    icon: PenTool,
    color: "from-secondary-dark to-primary",
    shadowColor: "shadow-secondary-glow",
    delay: "0.8s"
  }
];

const OurServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">خدماتنا المتميزة</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gradient-primary mb-6 leading-tight">
            خدماتنا
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات التقنية والإبداعية لتحقيق رؤيتك الرقمية
          </p>
          
          {/* Animated Divider */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === service.id;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-700 transform hover:scale-105",
                  isHovered ? service.shadowColor : "shadow-lg",
                  "hover:shadow-2xl cursor-pointer"
                )}
                style={{ animationDelay: service.delay }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Background Gradient Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                  service.color
                )}></div>
                
                {/* Animated Border */}
                <div className={cn(
                  "absolute inset-0 rounded-lg bg-gradient-to-br p-0.5 transition-all duration-500",
                  service.color,
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <div className="w-full h-full bg-white rounded-lg"></div>
                </div>
                
                <CardContent className="relative z-10 p-8 lg:p-10">
                  {/* Icon Container */}
                  <div className="mb-8">
                    <div className={cn(
                      "relative w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                      service.color,
                      "shadow-lg group-hover:shadow-xl"
                    )}>
                      <IconComponent 
                        className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" 
                      />
                      
                      {/* Glow Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500",
                        service.color
                      )}></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4 transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {service.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className={cn(
                    "flex items-center gap-2 mt-6 text-primary font-medium transition-all duration-300",
                    isHovered ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )}>
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>
                </CardContent>
                
                {/* Shine Effect */}
                <div className={cn(
                  "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full",
                  "skew-x-12"
                )}></div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
            <div className="text-center sm:text-right">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                هل تحتاج إلى استشارة مخصصة؟
              </h3>
              <p className="text-muted-foreground text-lg">
                تحدث معنا اليوم واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك
              </p>
            </div>
            <Button 
              size="lg"
              className={cn(
                "bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg rounded-xl",
                "hover:shadow-glow transition-all duration-300 transform hover:scale-105",
                "border border-white/20 backdrop-blur-sm"
              )}
            >
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default OurServicesSection;