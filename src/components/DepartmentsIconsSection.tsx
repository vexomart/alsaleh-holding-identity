import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Car, 
  CreditCard, 
  Code2, 
  Palette, 
  Shirt,
  Hammer,
  Monitor,
  Briefcase,
  Globe,
  Smartphone,
  Search,
  Camera,
  Users,
  PenTool,
  Video,
  Target,
  Lightbulb,
  BarChart3,
  ShoppingCart,
  Megaphone,
  FileEdit,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const mainServices = [
  {
    id: 1,
    title: "استضافة المواقع الإلكترونية",
    subtitle: "Web Hosting Services",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    link: "/hosting-services",
    description: "خدمات استضافة احترافية وموثوقة",
    category: "تقنية"
  },
  {
    id: 2,
    title: "تطوير وبرمجة تطبيقات الموبايل", 
    subtitle: "Mobile App Development",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    link: "/mobile-apps",
    description: "تطبيقات ذكية لجميع المنصات",
    category: "تطوير"
  },
  {
    id: 3,
    title: "تهيئة المواقع لمحركات البحث",
    subtitle: "SEO Optimization",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    link: "/seo-services",
    description: "تحسين ترتيب موقعك في محركات البحث",
    category: "تسويق"
  },
  {
    id: 4,
    title: "تصميم المواقع والمتاجر الإلكترونية",
    subtitle: "Web & E-commerce Design",
    icon: Monitor,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    link: "/websites",
    description: "تصاميم عصرية ومتجاوبة",
    category: "تصميم"
  },
  {
    id: 5,
    title: "إدارة مواقع التواصل الاجتماعي",
    subtitle: "Social Media Management",
    icon: Users,
    color: "from-rose-500 to-red-500",
    bgColor: "bg-gradient-to-br from-rose-50 to-red-50",
    link: "/social-media",
    description: "إدارة احترافية لحساباتك",
    category: "تسويق"
  },
  {
    id: 6,
    title: "إعلانات فيسبوك",
    subtitle: "Facebook Advertising",
    icon: Target,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
    link: "/facebook-ads",
    description: "حملات إعلانية مستهدفة وفعالة",
    category: "تسويق"
  },
  {
    id: 7,
    title: "تصوير المنتجات",
    subtitle: "Product Photography",
    icon: Camera,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
    link: "/product-photography",
    description: "تصوير احترافي يبرز منتجاتك",
    category: "إبداعي"
  },
  {
    id: 8,
    title: "نظام إدارة العملاء CRM",
    subtitle: "Customer Management System",
    icon: Settings,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    link: "/crm-system",
    description: "نظام متطور لإدارة علاقات العملاء",
    category: "تقنية"
  },
  {
    id: 9,
    title: "كتابة المحتوى",
    subtitle: "Content Writing",
    icon: FileEdit,
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
    link: "/content-writing",
    description: "محتوى إبداعي يجذب جمهورك",
    category: "إبداعي"
  },
  {
    id: 10,
    title: "تصميم الهويات التجارية",
    subtitle: "Brand Identity Design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    link: "/brand-identity",
    description: "هوية بصرية مميزة لعلامتك التجارية",
    category: "تصميم"
  },
  {
    id: 11,
    title: "إنتاج فيديوهات وموشن جرافيك",
    subtitle: "Video & Motion Graphics",
    icon: Video,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    link: "/video-production",
    description: "محتوى بصري متحرك وجذاب",
    category: "إبداعي"
  },
  {
    id: 12,
    title: "إعلانات جوجل ADS",
    subtitle: "Google Advertising",
    icon: BarChart3,
    color: "from-blue-600 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    link: "/google-ads",
    description: "حملات جوجل للوصول لعملاء أكثر",
    category: "تسويق"
  }
];


const DepartmentsIconsSection = () => {
  const categories = [
    { name: "تقنية", color: "from-blue-500 to-cyan-500" },
    { name: "تطوير", color: "from-green-500 to-emerald-500" },
    { name: "تسويق", color: "from-purple-500 to-pink-500" },
    { name: "تصميم", color: "from-amber-500 to-orange-500" },
    { name: "إبداعي", color: "from-rose-500 to-red-500" },
    { name: "شركات", color: "from-slate-500 to-gray-500" }
  ];

  const renderServiceCard = (service: any, index: number) => {
    const IconComponent = service.icon;
    
    return (
      <Link
        key={service.id}
        to={service.link}
        className="block group"
      >
        <Card className={`
          relative overflow-hidden h-full transition-all duration-500 
          hover:scale-105 hover:shadow-2xl cursor-pointer border-0
          ${service.bgColor} backdrop-blur-sm
          animate-fade-in
        `}
        style={{ animationDelay: `${index * 0.05}s` }}
        >
          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-20">
            <Badge className={`
              text-xs px-2 py-1 text-white font-medium
              ${categories.find(cat => cat.name === service.category)?.color ? 
                `bg-gradient-to-r ${categories.find(cat => cat.name === service.category)?.color}` : 
                'bg-gradient-to-r from-gray-500 to-slate-500'
              }
            `}>
              {service.category}
            </Badge>
          </div>

          {/* Hover Overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 
            group-hover:opacity-10 transition-opacity duration-500
          `}></div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/30 to-transparent rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/20 to-transparent rounded-tl-full"></div>

          <CardContent className="p-6 text-center relative z-10 h-full flex flex-col justify-between">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className={`
                relative p-4 rounded-2xl bg-gradient-to-br ${service.color} 
                group-hover:scale-110 transition-transform duration-300 shadow-lg
              `}>
                <IconComponent className="w-8 h-8 text-white" />
                
                {/* Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} 
                  opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md
                `}></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {service.title}
              </h3>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 opacity-80">
                {service.subtitle}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {service.description}
              </p>
            </div>

            {/* Hover Indicator */}
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`
                inline-flex items-center text-xs font-medium 
                bg-gradient-to-r ${service.color} bg-clip-text text-transparent
              `}>
                اكتشف المزيد ←
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/2 to-secondary/3"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" />
            <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-semibold shadow-lg">
              ASH HOLDING SERVICES
            </Badge>
            <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            خدماتنا المتكاملة
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات الرقمية والتقنية لتلبية جميع احتياجات عملك
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {mainServices.map((service, index) => renderServiceCard(service, index))}
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-border/50">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              جاهز لبدء مشروعك؟
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              تواصل معنا اليوم واحصل على استشارة مجانية لتحديد أفضل الحلول لأعمالك
            </p>
            <Link to="/consultation">
              <button className="bg-gradient-to-r from-primary via-secondary to-accent text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                احصل على استشارة مجانية
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsIconsSection;