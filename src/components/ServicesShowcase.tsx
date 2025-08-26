import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Palette,
  Monitor,
  Smartphone,
  Cloud,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Building2,
  Settings,
  Brain,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "تطوير التطبيقات",
    description: "تطوير تطبيقات الهاتف والويب باستخدام أحدث التقنيات",
    icon: Code2,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
    features: ["React & Vue", "Flutter", "Laravel", "API Integration"],
    link: "/development"
  },
  {
    id: 2,
    title: "التصميم الجرافيكي",
    description: "تصميم الهويات البصرية والمواد التسويقية الإبداعية",
    icon: Palette,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-400",
    features: ["تصميم الشعار", "الهوية البصرية", "المطبوعات", "تصميم الإعلانات"],
    link: "/design-solutions"
  },
  {
    id: 3,
    title: "المواقع الإلكترونية",
    description: "تصميم وتطوير مواقع الويب سريعة الاستجابة والحديثة",
    icon: Monitor,
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    textColor: "text-green-400",
    features: ["تصميم متجاوب", "إدارة المحتوى", "تحسين SEO", "استضافة مجانية"],
    link: "/websites"
  },
  {
    id: 4,
    title: "التطبيقات الذكية",
    description: "تطبيقات iOS و Android للهواتف الذكية والأجهزة اللوحية",
    icon: Smartphone,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    textColor: "text-orange-400",
    features: ["iOS & Android", "واجهة مستخدم مبتكرة", "الإشعارات الفورية", "ربط قاعدة البيانات"],
    link: "/mobile-apps"
  },
  {
    id: 5,
    title: "الحلول السحابية",
    description: "خدمات الحوسبة السحابية والاستضافة المتطورة",
    icon: Cloud,
    color: "from-cyan-500 to-cyan-700",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    textColor: "text-cyan-400",
    features: ["AWS & Azure", "نسخ احتياطية", "مراقبة الأداء", "أمان متقدم"],
    link: "/cloud-solutions"
  },
  {
    id: 6,
    title: "الأمن السيبراني",
    description: "حماية البيانات وأمان الشبكات والأنظمة الرقمية",
    icon: Shield,
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    textColor: "text-red-400",
    features: ["اختبار الاختراق", "تشفير البيانات", "مراقبة الأمان", "تدريب الموظفين"],
    link: "/security-solutions"
  },
  {
    id: 7,
    title: "التسويق الرقمي",
    description: "استراتيجيات التسويق الرقمي وإدارة وسائل التواصل الاجتماعي",
    icon: TrendingUp,
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    textColor: "text-pink-400",
    features: ["إدارة حسابات", "إعلانات مدفوعة", "تحليل البيانات", "استراتيجية المحتوى"],
    link: "/digital-marketing"
  },
  {
    id: 8,
    title: "الذكاء الاصطناعي",
    description: "حلول الذكاء الاصطناعي وتعلم الآلة للأعمال",
    icon: Brain,
    color: "from-indigo-500 to-indigo-700",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    textColor: "text-indigo-400",
    features: ["تحليل البيانات", "الروبوتات الذكية", "التنبؤ", "أتمتة العمليات"],
    link: "/ai-solutions"
  }
];

const ServicesShowcase = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Beautiful Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-accent/5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/15 to-primary/8 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-secondary/8 to-accent/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-40 right-1/4 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-60 left-10 w-2 h-2 bg-secondary/50 animate-ping" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            خدماتنا المتميزة
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground via-primary/80 to-secondary/60 bg-clip-text text-transparent">
            حلول تقنية شاملة
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة متكاملة من الخدمات التقنية المبتكرة لتلبية احتياجات عملك الرقمي
            <br />
            مع ضمان الجودة والاحترافية في كل مشروع
          </p>
        </div>

        {/* Services Grid with Mixed Shapes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredCard === service.id;
            
            // تحديد الشكل والتخطيط بناءً على الفهرس
            const getCardStyle = (index: number) => {
              const patterns = [
                // نمط 1: مستطيل عادي
                "rounded-2xl",
                // نمط 2: دائري من الأعلى
                "rounded-t-3xl rounded-b-xl",
                // نمط 3: مائل
                "rounded-2xl transform hover:-rotate-1",
                // نمط 4: سداسي مقطوع
                "rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl",
                // نمط 5: موجة
                "rounded-3xl",
                // نمط 6: مربع بزوايا مختلفة
                "rounded-tl-2xl rounded-tr-3xl rounded-bl-3xl rounded-br-xl",
                // نمط 7: شكل معين
                "rounded-2xl transform hover:rotate-1",
                // نمط 8: دائري كامل
                "rounded-full p-8"
              ];
              return patterns[index % patterns.length];
            };

            const getSize = (index: number) => {
              // جعل بعض البطاقات أكبر من الأخرى
              const sizes = [
                "col-span-1 row-span-1", // عادي
                "col-span-1 row-span-1", // عادي  
                "lg:col-span-2 row-span-1", // عريض
                "col-span-1 row-span-1", // عادي
                "col-span-1 row-span-1", // عادي
                "lg:col-span-2 row-span-1", // عريض
                "col-span-1 row-span-1", // عادي
                "col-span-1 row-span-1"  // عادي
              ];
              return sizes[index % sizes.length];
            };
            
            return (
              <div
                key={service.id}
                className={`${getSize(index)} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  className={`
                    group relative overflow-hidden transition-all duration-500 ease-out h-full
                    hover:scale-105 hover:shadow-2xl hover:shadow-primary/25
                    ${service.bgColor} ${service.borderColor} ${getCardStyle(index)}
                    backdrop-blur-sm border
                  `}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated Corner Element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>

                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                  {/* Icon Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`
                      w-12 h-12 rounded-xl ${service.bgColor} ${service.borderColor} border-2
                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300
                      shadow-lg group-hover:shadow-xl
                    `}>
                      <IconComponent className={`w-6 h-6 ${service.textColor} group-hover:animate-pulse`} />
                    </div>
                    
                    <Badge variant="outline" className="text-xs opacity-80 group-hover:opacity-100 transition-opacity">
                      {String(index + 1).padStart(2, '0')}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-center text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Link to={service.link} className="block">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={`
                          w-full group-hover:bg-primary group-hover:text-primary-foreground
                          group-hover:border-primary transition-all duration-300 group-hover:shadow-lg
                        `}
                      >
                        <span className="flex items-center justify-center text-sm">
                          اعرف المزيد
                          <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              هل تحتاج خدمة مخصصة؟
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              تواصل معنا لمناقشة احتياجاتك الخاصة والحصول على عرض مخصص يناسب مشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="group px-8">
                  تواصل معنا الآن
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/consultation">
                <Button variant="outline" size="lg" className="px-8">
                  احجز استشارة مجانية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;