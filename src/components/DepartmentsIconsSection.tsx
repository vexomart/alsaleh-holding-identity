import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Car, 
  CreditCard, 
  Code2, 
  Palette, 
  Shirt,
  Hammer,
  Monitor,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

const departments = [
  {
    id: 1,
    title: "شركة آش للبرمجة",
    subtitle: "ASH Programming",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    link: "/development",
    description: "حلول برمجية متطورة"
  },
  {
    id: 2,
    title: "شركة آش للتصميم", 
    subtitle: "ASH Design",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    link: "/design-solutions",
    description: "تصاميم إبداعية احترافية"
  },
  {
    id: 3,
    title: "متجر كشخة للعبايات",
    subtitle: "Kashkha Abaya Store", 
    icon: Shirt,
    color: "from-rose-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-rose-50 to-orange-50",
    link: "/kashkha-abaya-store",
    description: "عبايات عصرية أنيقة"
  },
  {
    id: 4,
    title: "شركة آش للمقاولات",
    subtitle: "ASH Construction",
    icon: Hammer,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
    link: "/construction-website",
    description: "مقاولات وإنشاءات"
  },
  {
    id: 5,
    title: "شركة آش لتأجير السيارات",
    subtitle: "ASH Car Rental",
    icon: Car,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    link: "/car-rental-landing",
    description: "خدمات تأجير السيارات"
  },
  {
    id: 6,
    title: "متجر البطاقات الإلكترونية",
    subtitle: "Electronic Cards Store",
    icon: CreditCard,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
    link: "/electronic-cards-store",
    description: "بطاقات رقمية متنوعة"
  },
  {
    id: 7,
    title: "شركة آش للمواقع",
    subtitle: "ASH Websites",
    icon: Monitor,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
    link: "/websites",
    description: "تطوير المواقع الإلكترونية"
  },
  {
    id: 8,
    title: "الخدمات المؤسسية",
    subtitle: "Enterprise Services",
    icon: Briefcase,
    color: "from-slate-500 to-gray-500",
    bgColor: "bg-gradient-to-br from-slate-50 to-gray-50",
    link: "/business-services",
    description: "حلول الأعمال المؤسسية"
  },
  {
    id: 9,
    title: "عن الشركة",
    subtitle: "About Company",
    icon: Building2,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    link: "/about",
    description: "معلومات عن الشركة"
  }
];

const DepartmentsIconsSection = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            أقسام الشركة
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف خدماتنا المتنوعة وحلولنا المبتكرة
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {departments.map((department, index) => {
            const IconComponent = department.icon;
            
            return (
              <Link
                key={department.id}
                to={department.link}
                className="block group"
              >
                <Card className={`
                  relative overflow-hidden h-full transition-all duration-500 
                  hover:scale-105 hover:shadow-2xl cursor-pointer
                  ${department.bgColor} border border-border/50
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${department.color} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-500
                  `}></div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full"></div>

                  <CardContent className="p-6 sm:p-8 text-center relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className={`
                        relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${department.color} 
                        group-hover:scale-110 transition-transform duration-300 shadow-lg
                      `}>
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        
                        {/* Glow Effect */}
                        <div className={`
                          absolute inset-0 rounded-2xl bg-gradient-to-br ${department.color} 
                          opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md
                        `}></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {department.title}
                      </h3>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {department.subtitle}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {department.description}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`
                        inline-flex items-center text-sm font-medium 
                        bg-gradient-to-r ${department.color} bg-clip-text text-transparent
                      `}>
                        استكشف المزيد ←
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsIconsSection;