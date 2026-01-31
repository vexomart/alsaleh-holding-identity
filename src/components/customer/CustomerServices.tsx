/**
 * Customer Services Page
 * Premium category-based services display with animations
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, type Service } from "@/lib/api/services";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Package,
  Code,
  Palette,
  Megaphone,
  Server,
  Headphones,
  Briefcase,
  Smartphone,
  Globe,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Category definitions with Arabic names and icons
const CATEGORIES_CONFIG: Record<string, {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: React.ElementType;
  gradient: string;
  bgColor: string;
}> = {
  development: {
    nameAr: "التطوير البرمجي",
    nameEn: "Development",
    descriptionAr: "حلول برمجية متكاملة ومواقع وتطبيقات احترافية",
    descriptionEn: "Complete software solutions, websites and professional apps",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  design: {
    nameAr: "التصميم والهوية",
    nameEn: "Design & Branding",
    descriptionAr: "تصميم هويات بصرية وواجهات مستخدم مبتكرة",
    descriptionEn: "Visual identities and innovative UI/UX design",
    icon: Palette,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  marketing: {
    nameAr: "التسويق الرقمي",
    nameEn: "Digital Marketing",
    descriptionAr: "استراتيجيات تسويقية فعالة لنمو أعمالك",
    descriptionEn: "Effective marketing strategies for your business growth",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
  },
  infrastructure: {
    nameAr: "البنية التحتية",
    nameEn: "Infrastructure",
    descriptionAr: "خدمات استضافة وسيرفرات وحلول سحابية",
    descriptionEn: "Hosting, servers and cloud solutions",
    icon: Server,
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
  },
  support: {
    nameAr: "الدعم الفني",
    nameEn: "Technical Support",
    descriptionAr: "دعم فني متواصل وصيانة للأنظمة",
    descriptionEn: "Continuous technical support and system maintenance",
    icon: Headphones,
    gradient: "from-rose-500 to-red-500",
    bgColor: "bg-rose-500/10",
  },
  consulting: {
    nameAr: "الاستشارات",
    nameEn: "Consulting",
    descriptionAr: "استشارات تقنية وإدارية لمشاريعك",
    descriptionEn: "Technical and management consulting for your projects",
    icon: Briefcase,
    gradient: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/10",
  },
  mobile: {
    nameAr: "تطبيقات الجوال",
    nameEn: "Mobile Apps",
    descriptionAr: "تطوير تطبيقات iOS و Android احترافية",
    descriptionEn: "Professional iOS and Android app development",
    icon: Smartphone,
    gradient: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-500/10",
  },
  security: {
    nameAr: "الأمن السيبراني",
    nameEn: "Cyber Security",
    descriptionAr: "حماية بياناتك وأنظمتك من التهديدات",
    descriptionEn: "Protect your data and systems from threats",
    icon: Shield,
    gradient: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-500/10",
  },
};

// Default config for unknown categories
const DEFAULT_CATEGORY_CONFIG = {
  nameAr: "خدمات أخرى",
  nameEn: "Other Services",
  descriptionAr: "خدمات متنوعة لتلبية احتياجاتك",
  descriptionEn: "Various services to meet your needs",
  icon: Globe,
  gradient: "from-gray-500 to-gray-600",
  bgColor: "bg-gray-500/10",
};

interface CategoryWithServices {
  category: string;
  config: {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: React.ElementType;
    gradient: string;
    bgColor: string;
  };
  services: Service[];
  count: number;
}

export function CustomerServices() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState<CategoryWithServices[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allServices = await fetchCustomerServices();
        setServices(allServices);

        // Group services by category
        const grouped = allServices.reduce((acc, service) => {
          const cat = service.category || "other";
          if (!acc[cat]) {
            acc[cat] = [];
          }
          acc[cat].push(service);
          return acc;
        }, {} as Record<string, Service[]>);

        // Transform to array with configs
        const categoriesArray: CategoryWithServices[] = Object.entries(grouped).map(([category, services]) => ({
          category,
          config: CATEGORIES_CONFIG[category] || { ...DEFAULT_CATEGORY_CONFIG, nameEn: category },
          services,
          count: services.length,
        }));

        // Sort by service count descending
        categoriesArray.sort((a, b) => b.count - a.count);
        setCategoriesData(categoriesArray);

      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: isRTL ? "خطأ في جلب الخدمات" : "Error fetching services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isRTL]);

  const handleCategoryClick = (category: string) => {
    navigate(`/app/services/${category}`);
  };

  const NavIcon = isRTL ? ChevronLeft : ChevronRight;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-32 mx-auto" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isRTL ? "اكتشف خدماتنا" : "Discover Our Services"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {isRTL ? "أقسام الخدمات" : "Service Categories"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isRTL
            ? `استعرض ${categoriesData.length} قسم يضم ${services.length} خدمة متنوعة لتلبية جميع احتياجاتك`
            : `Browse ${categoriesData.length} categories with ${services.length} diverse services to meet all your needs`}
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {categoriesData.map((item, index) => {
            const Icon = item.config.icon;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => handleCategoryClick(item.category)}
                  className={cn(
                    "relative overflow-hidden cursor-pointer group",
                    "border-2 border-transparent hover:border-primary/30",
                    "transition-all duration-300 h-full"
                  )}
                >
                  {/* Background Gradient Effect */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    `bg-gradient-to-br ${item.config.gradient}`
                  )} style={{ opacity: 0.05 }} />

                  <CardContent className="p-6 relative">
                    {/* Icon & Badge Row */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center",
                          `bg-gradient-to-br ${item.config.gradient}`,
                          "shadow-lg"
                        )}
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <Badge 
                        variant="secondary" 
                        className="text-sm font-bold bg-background/80 backdrop-blur-sm"
                      >
                        {item.count} {isRTL ? "خدمة" : "services"}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {isRTL ? item.config.nameAr : item.config.nameEn}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {isRTL ? item.config.descriptionAr : item.config.descriptionEn}
                    </p>

                    {/* Services Preview */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.services.slice(0, 3).map((service) => (
                        <span
                          key={service.id}
                          className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground truncate max-w-[120px]"
                        >
                          {isRTL ? service.name_ar || service.name : service.name}
                        </span>
                      ))}
                      {item.count > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          +{item.count - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className={cn(
                      "flex items-center gap-2 text-primary font-medium",
                      "group-hover:gap-3 transition-all duration-300"
                    )}>
                      <span className="text-sm">
                        {isRTL ? "تصفح الخدمات" : "Browse Services"}
                      </span>
                      <NavIcon className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        "group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                      )} />
                    </div>
                  </CardContent>

                  {/* Corner Decoration */}
                  <div className={cn(
                    "absolute -bottom-8 -end-8 w-24 h-24 rounded-full opacity-10",
                    `bg-gradient-to-br ${item.config.gradient}`
                  )} />
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {categoriesData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="h-20 w-20 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">
            {isRTL ? "لا توجد خدمات متاحة" : "No Services Available"}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? "سيتم إضافة الخدمات قريباً" : "Services will be added soon"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
