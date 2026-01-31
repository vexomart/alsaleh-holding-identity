/**
 * Customer Services Page
 * Premium category-based services display with modern design and animations
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
  Layers,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Category definitions with Arabic names and icons
const CATEGORIES_CONFIG: Record<string, {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  glowColor: string;
}> = {
  development: {
    nameAr: "التطوير البرمجي",
    nameEn: "Development",
    descriptionAr: "نقدم حلول برمجية متكاملة تشمل تطوير المواقع والتطبيقات باستخدام أحدث التقنيات",
    descriptionEn: "We provide complete software solutions including website and app development using latest technologies",
    featuresAr: ["مواقع احترافية", "تطبيقات ويب", "أنظمة إدارة"],
    featuresEn: ["Professional websites", "Web apps", "Management systems"],
    icon: Code,
    gradient: "from-blue-500 via-blue-600 to-cyan-500",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20",
  },
  design: {
    nameAr: "التصميم والهوية",
    nameEn: "Design & Branding",
    descriptionAr: "نصمم هويات بصرية فريدة وواجهات مستخدم مبتكرة تعكس رؤية علامتك التجارية",
    descriptionEn: "We design unique visual identities and innovative UI/UX that reflects your brand vision",
    featuresAr: ["هوية بصرية", "تصميم UI/UX", "موشن جرافيك"],
    featuresEn: ["Visual identity", "UI/UX design", "Motion graphics"],
    icon: Palette,
    gradient: "from-purple-500 via-purple-600 to-pink-500",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20",
  },
  marketing: {
    nameAr: "التسويق الرقمي",
    nameEn: "Digital Marketing",
    descriptionAr: "استراتيجيات تسويقية متكاملة لزيادة وصولك وتحقيق أهداف نمو أعمالك",
    descriptionEn: "Complete marketing strategies to increase your reach and achieve business growth goals",
    featuresAr: ["إدارة السوشيال", "إعلانات مدفوعة", "تحسين SEO"],
    featuresEn: ["Social media", "Paid ads", "SEO optimization"],
    icon: Megaphone,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/20",
  },
  infrastructure: {
    nameAr: "البنية التحتية",
    nameEn: "Infrastructure",
    descriptionAr: "خدمات استضافة موثوقة وحلول سحابية متقدمة لضمان أداء تطبيقاتك",
    descriptionEn: "Reliable hosting services and advanced cloud solutions for your applications performance",
    featuresAr: ["استضافة سحابية", "سيرفرات خاصة", "نسخ احتياطي"],
    featuresEn: ["Cloud hosting", "Dedicated servers", "Backup solutions"],
    icon: Server,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/20",
  },
  support: {
    nameAr: "الدعم الفني",
    nameEn: "Technical Support",
    descriptionAr: "فريق دعم فني متخصص متاح على مدار الساعة لحل جميع المشكلات التقنية",
    descriptionEn: "Specialized technical support team available 24/7 to solve all technical issues",
    featuresAr: ["دعم 24/7", "صيانة دورية", "تحديثات مستمرة"],
    featuresEn: ["24/7 support", "Regular maintenance", "Continuous updates"],
    icon: Headphones,
    gradient: "from-rose-500 via-red-500 to-pink-500",
    borderColor: "border-rose-500/30",
    glowColor: "shadow-rose-500/20",
  },
  consulting: {
    nameAr: "الاستشارات التقنية",
    nameEn: "Tech Consulting",
    descriptionAr: "استشارات متخصصة لتحويل أفكارك إلى مشاريع ناجحة مع خارطة طريق واضحة",
    descriptionEn: "Specialized consulting to transform your ideas into successful projects with a clear roadmap",
    featuresAr: ["تحليل المتطلبات", "خارطة طريق", "دراسة جدوى"],
    featuresEn: ["Requirements analysis", "Roadmap", "Feasibility study"],
    icon: Briefcase,
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    borderColor: "border-indigo-500/30",
    glowColor: "shadow-indigo-500/20",
  },
  mobile: {
    nameAr: "تطبيقات الجوال",
    nameEn: "Mobile Apps",
    descriptionAr: "تطوير تطبيقات iOS و Android بتجربة مستخدم سلسة وأداء عالي",
    descriptionEn: "iOS and Android app development with smooth UX and high performance",
    featuresAr: ["تطبيقات iOS", "تطبيقات Android", "تطبيقات هجينة"],
    featuresEn: ["iOS apps", "Android apps", "Hybrid apps"],
    icon: Smartphone,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    borderColor: "border-sky-500/30",
    glowColor: "shadow-sky-500/20",
  },
  security: {
    nameAr: "الأمن السيبراني",
    nameEn: "Cyber Security",
    descriptionAr: "حماية شاملة لبياناتك وأنظمتك من جميع أنواع التهديدات الإلكترونية",
    descriptionEn: "Comprehensive protection for your data and systems from all types of cyber threats",
    featuresAr: ["تقييم أمني", "حماية البيانات", "اختبار اختراق"],
    featuresEn: ["Security assessment", "Data protection", "Penetration testing"],
    icon: Shield,
    gradient: "from-slate-600 via-slate-700 to-slate-800",
    borderColor: "border-slate-500/30",
    glowColor: "shadow-slate-500/20",
  },
};

const DEFAULT_CATEGORY_CONFIG = {
  nameAr: "خدمات أخرى",
  nameEn: "Other Services",
  descriptionAr: "خدمات متنوعة لتلبية جميع احتياجاتك التقنية والرقمية",
  descriptionEn: "Various services to meet all your technical and digital needs",
  featuresAr: ["خدمات متنوعة", "حلول مخصصة", "دعم كامل"],
  featuresEn: ["Various services", "Custom solutions", "Full support"],
  icon: Globe,
  gradient: "from-gray-500 via-gray-600 to-gray-700",
  borderColor: "border-gray-500/30",
  glowColor: "shadow-gray-500/20",
};

interface CategoryWithServices {
  category: string;
  config: {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    featuresAr: string[];
    featuresEn: string[];
    icon: React.ElementType;
    gradient: string;
    borderColor: string;
    glowColor: string;
  };
  services: Service[];
  count: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 },
  }),
};

export function CustomerServices() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState<CategoryWithServices[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center relative"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 mb-6"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {isRTL ? "خدمات ASH المتكاملة" : "ASH Complete Services"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text"
        >
          {isRTL ? "اختر القسم المناسب لاحتياجاتك" : "Choose the Right Section for Your Needs"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {isRTL
            ? `استعرض ${categoriesData.length} قسم متخصص يضم ${services.length} خدمة احترافية مصممة لتلبية جميع متطلباتك`
            : `Browse ${categoriesData.length} specialized sections with ${services.length} professional services designed to meet all your requirements`}
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-8 mt-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{categoriesData.length}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? "قسم" : "Sections"}</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{services.length}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? "خدمة" : "Services"}</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">{isRTL ? "دعم" : "Support"}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {categoriesData.map((item, index) => {
            const Icon = item.config.icon;
            const isHovered = hoveredCategory === item.category;

            return (
              <motion.div
                key={item.category}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredCategory(item.category)}
                onHoverEnd={() => setHoveredCategory(null)}
                layout
              >
                <Card
                  onClick={() => handleCategoryClick(item.category)}
                  className={cn(
                    "relative overflow-hidden cursor-pointer h-full",
                    "rounded-3xl border-2 transition-all duration-500",
                    "bg-gradient-to-br from-background via-background to-muted/30",
                    item.config.borderColor,
                    isHovered && `shadow-2xl ${item.config.glowColor}`,
                    isHovered && "border-primary/50"
                  )}
                >
                  {/* Animated Background */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-500",
                      `bg-gradient-to-br ${item.config.gradient}`
                    )}
                    animate={{ opacity: isHovered ? 0.05 : 0 }}
                  />

                  {/* Top Glow Effect */}
                  <motion.div
                    className={cn(
                      "absolute -top-20 -end-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500",
                      `bg-gradient-to-br ${item.config.gradient}`
                    )}
                    animate={{ opacity: isHovered ? 0.3 : 0.1 }}
                  />

                  <CardContent className="p-6 relative z-10">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-5">
                      {/* Icon with Glow */}
                      <motion.div
                        className="relative"
                        animate={{
                          rotate: isHovered ? [0, -5, 5, 0] : 0,
                          scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={cn(
                          "absolute inset-0 rounded-2xl blur-xl opacity-50",
                          `bg-gradient-to-br ${item.config.gradient}`
                        )} />
                        <div className={cn(
                          "relative w-16 h-16 rounded-2xl flex items-center justify-center",
                          `bg-gradient-to-br ${item.config.gradient}`,
                          "shadow-lg"
                        )}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>

                      {/* Service Count Badge */}
                      <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                      >
                        <Badge
                          className={cn(
                            "text-sm font-bold px-3 py-1",
                            "bg-background/80 backdrop-blur-sm border",
                            item.config.borderColor
                          )}
                        >
                          <Layers className="h-3 w-3 me-1" />
                          {item.count}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                      className="text-xl font-bold mb-3"
                      animate={{ x: isHovered ? (isRTL ? -5 : 5) : 0 }}
                    >
                      {isRTL ? item.config.nameAr : item.config.nameEn}
                    </motion.h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                      {isRTL ? item.config.descriptionAr : item.config.descriptionEn}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-5">
                      {(isRTL ? item.config.featuresAr : item.config.featuresEn).map((feature, i) => (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={featureVariants}
                          initial="hidden"
                          animate={isHovered ? "visible" : "hidden"}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Zap className={cn(
                            "h-3.5 w-3.5",
                            `text-${item.config.gradient.split('-')[1]}-500`
                          )} />
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Services Preview Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {item.services.slice(0, 2).map((service) => (
                        <span
                          key={service.id}
                          className="text-xs px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground truncate max-w-[140px]"
                        >
                          {isRTL ? service.name_ar || service.name : service.name}
                        </span>
                      ))}
                      {item.count > 2 && (
                        <span className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          "bg-primary/10 text-primary"
                        )}>
                          +{item.count - 2} {isRTL ? "خدمة" : "more"}
                        </span>
                      )}
                    </div>

                    {/* CTA Row */}
                    <motion.div
                      className={cn(
                        "flex items-center justify-between pt-4 border-t",
                        item.config.borderColor
                      )}
                      animate={{ opacity: isHovered ? 1 : 0.7 }}
                    >
                      <span className={cn(
                        "font-semibold text-sm",
                        isHovered ? "text-primary" : "text-foreground"
                      )}>
                        {isRTL ? "استكشف الخدمات" : "Explore Services"}
                      </span>
                      <motion.div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          `bg-gradient-to-br ${item.config.gradient}`,
                          "text-white"
                        )}
                        animate={{
                          x: isHovered ? (isRTL ? -5 : 5) : 0,
                          scale: isHovered ? 1.1 : 1,
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.div>
                    </motion.div>
                  </CardContent>

                  {/* Corner Decoration */}
                  <div className={cn(
                    "absolute -bottom-10 -start-10 w-32 h-32 rounded-full opacity-10",
                    `bg-gradient-to-br ${item.config.gradient}`
                  )} />
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {categoriesData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-muted/20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground/30" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-3">
            {isRTL ? "لا توجد خدمات متاحة حالياً" : "No Services Available"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isRTL ? "نعمل على إضافة خدمات جديدة قريباً، تابعنا للمزيد" : "We're working on adding new services soon, stay tuned"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
