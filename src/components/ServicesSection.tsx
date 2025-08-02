import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Megaphone, 
  Palette, 
  Link, 
  ShoppingCart, 
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Zap
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "خدمات البرمجة",
    description: "تطوير تطبيقات ومواقع إلكترونية بأحدث التقنيات",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    services: [
      "تطوير مواقع الويب",
      "تطبيقات الجوال",
      "أنظمة إدارة المحتوى",
      "واجهات برمجة التطبيقات",
      "تطبيقات سطح المكتب"
    ],
    technologies: ["React", "Node.js", "Python", "Flutter", "Laravel"],
    startingPrice: "5,000",
    rating: 4.9,
    projectsCount: 150
  },
  {
    id: 2,
    title: "خدمات التسويق الالكتروني",
    description: "استراتيجيات تسويقية شاملة لزيادة المبيعات والوصول",
    icon: Megaphone,
    color: "from-pink-500 to-red-500",
    services: [
      "إدارة وسائل التواصل",
      "الإعلانات المدفوعة",
      "تحسين محركات البحث",
      "التسويق بالمحتوى",
      "التسويق عبر الإيميل"
    ],
    technologies: ["Google Ads", "Facebook Ads", "Instagram", "LinkedIn", "Analytics"],
    startingPrice: "3,000",
    rating: 4.8,
    projectsCount: 200
  },
  {
    id: 3,
    title: "خدمات التصميم",
    description: "تصاميم إبداعية تعكس هوية علامتك التجارية",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    services: [
      "تصميم الهوية البصرية",
      "تصميم واجهات المستخدم",
      "تصميم المطبوعات",
      "تصميم الإعلانات",
      "الرسوم المتحركة"
    ],
    technologies: ["Adobe Creative Suite", "Figma", "Sketch", "Blender", "After Effects"],
    startingPrice: "2,500",
    rating: 4.9,
    projectsCount: 300
  },
  {
    id: 4,
    title: "خدمات الربط والتطوير",
    description: "ربط الأنظمة وتطوير الحلول المتكاملة",
    icon: Link,
    color: "from-green-500 to-emerald-500",
    services: [
      "ربط أنظمة الدفع",
      "تكامل واجهات البرمجة",
      "أتمتة العمليات",
      "ربط قواعد البيانات",
      "الحلول السحابية"
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
    startingPrice: "4,000",
    rating: 4.7,
    projectsCount: 100
  },
  {
    id: 5,
    title: "أنظمة المتاجر الالكترونية",
    description: "متاجر إلكترونية احترافية لزيادة مبيعاتك",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    services: [
      "متاجر متكاملة",
      "أنظمة الدفع الآمنة",
      "إدارة المخزون",
      "تقارير المبيعات",
      "تطبيق جوال للمتجر"
    ],
    technologies: ["WooCommerce", "Shopify", "Magento", "Custom Solutions"],
    startingPrice: "8,000",
    rating: 4.8,
    projectsCount: 120
  },
  {
    id: 6,
    title: "خدمات العمال والتجار",
    description: "منصات ربط العمال بالعملاء وحلول تجارية",
    icon: Users,
    color: "from-teal-500 to-blue-500",
    services: [
      "منصات الخدمات",
      "تطبيقات العمال",
      "أنظمة الحجز",
      "إدارة العملاء",
      "نظام التقييمات"
    ],
    technologies: ["Real-time Chat", "GPS Integration", "Payment Systems", "Rating Systems"],
    startingPrice: "6,000",
    rating: 4.6,
    projectsCount: 80
  }
];

const ServicesSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="text-lg px-4 py-2">
              خدماتنا المتنوعة
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            خدماتنا الاحترافية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الخدمات التقنية والتسويقية لتحقيق أهدافك التجارية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{service.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{service.projectsCount} مشروع</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Services List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">الخدمات المتوفرة:</h4>
                    {service.services.slice(0, 4).map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                    {service.services.length > 4 && (
                      <span className="text-sm text-muted-foreground">+{service.services.length - 4} خدمات أخرى</span>
                    )}
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">التقنيات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {service.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">يبدأ من</span>
                      <div className="text-2xl font-bold text-primary">
                        {service.startingPrice} ر.س
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full group/btn" 
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      const message = "مرحباً، أريد الاستفسار عن خدماتكم والحصول على استشارة مجانية";
                      const phoneNumber = "966555812567";
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    اطلب الخدمة
                    <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            هل تحتاج خدمة مخصصة؟ تواصل معنا للحصول على استشارة مجانية
          </p>
          <Button 
            size="lg" 
            className="px-8"
            onClick={(e) => {
              e.preventDefault();
              const message = "مرحباً، أريد الحصول على استشارة مجانية حول خدماتكم";
              const phoneNumber = "966555812567";
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            احصل على استشارة مجانية
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;