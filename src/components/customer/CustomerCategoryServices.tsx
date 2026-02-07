/**
 * Customer Category Services Page
 * Display services within a specific category with premium design and animations
 */

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, type Service } from "@/lib/api/services";
import { ComingSoonInfrastructure } from "./ComingSoonInfrastructure";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Zap,
  TrendingUp,
  Eye,
  LucideIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Pagination config
const ITEMS_PER_PAGE = 10;

// Category config type
interface CategoryConfig {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  gradient: string;
  bgColor: string;
  glowColor: string;
  accentColor: string;
}

// Category configurations with enhanced styling
const CATEGORIES_CONFIG: Record<string, CategoryConfig> = {
  development: {
    nameAr: "التطوير البرمجي",
    nameEn: "Development",
    descriptionAr: "حلول برمجية متكاملة ومواقع وتطبيقات احترافية",
    descriptionEn: "Complete software solutions, websites and professional apps",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    glowColor: "shadow-blue-500/20",
    accentColor: "blue",
  },
  design: {
    nameAr: "التصميم والهوية",
    nameEn: "Design & Branding",
    descriptionAr: "تصميم هويات بصرية وواجهات مستخدم مبتكرة",
    descriptionEn: "Visual identities and innovative UI/UX design",
    icon: Palette,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    glowColor: "shadow-purple-500/20",
    accentColor: "purple",
  },
  marketing: {
    nameAr: "التسويق الرقمي",
    nameEn: "Digital Marketing",
    descriptionAr: "استراتيجيات تسويقية فعالة لنمو أعمالك",
    descriptionEn: "Effective marketing strategies for your business growth",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    glowColor: "shadow-amber-500/20",
    accentColor: "amber",
  },
  infrastructure: {
    nameAr: "البنية التحتية",
    nameEn: "Infrastructure",
    descriptionAr: "خدمات استضافة وسيرفرات وحلول سحابية",
    descriptionEn: "Hosting, servers and cloud solutions",
    icon: Server,
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    glowColor: "shadow-emerald-500/20",
    accentColor: "emerald",
  },
  support: {
    nameAr: "الدعم الفني",
    nameEn: "Technical Support",
    descriptionAr: "دعم فني متواصل وصيانة للأنظمة",
    descriptionEn: "Continuous technical support and system maintenance",
    icon: Headphones,
    gradient: "from-rose-500 to-red-500",
    bgColor: "bg-rose-500/10",
    glowColor: "shadow-rose-500/20",
    accentColor: "rose",
  },
  consulting: {
    nameAr: "الاستشارات",
    nameEn: "Consulting",
    descriptionAr: "استشارات تقنية وإدارية لمشاريعك",
    descriptionEn: "Technical and management consulting for your projects",
    icon: Briefcase,
    gradient: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/10",
    glowColor: "shadow-indigo-500/20",
    accentColor: "indigo",
  },
  mobile: {
    nameAr: "تطبيقات الجوال",
    nameEn: "Mobile Apps",
    descriptionAr: "تطوير تطبيقات iOS و Android احترافية",
    descriptionEn: "Professional iOS and Android app development",
    icon: Smartphone,
    gradient: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-500/10",
    glowColor: "shadow-sky-500/20",
    accentColor: "sky",
  },
  security: {
    nameAr: "الأمن السيبراني",
    nameEn: "Cyber Security",
    descriptionAr: "حماية بياناتك وأنظمتك من التهديدات",
    descriptionEn: "Protect your data and systems from threats",
    icon: Shield,
    gradient: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-500/10",
    glowColor: "shadow-slate-500/20",
    accentColor: "slate",
  },
  api: {
    nameAr: "الربط API",
    nameEn: "API Integration",
    descriptionAr: "ربط وتكامل الأنظمة والخدمات الخارجية مع منصتك",
    descriptionEn: "Integrate external systems and services with your platform",
    icon: Globe,
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    glowColor: "shadow-pink-500/20",
    accentColor: "pink",
  },
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  nameAr: "خدمات أخرى",
  nameEn: "Other Services",
  descriptionAr: "خدمات متنوعة لتلبية احتياجاتك",
  descriptionEn: "Various services to meet your needs",
  icon: Globe,
  gradient: "from-gray-500 to-gray-600",
  bgColor: "bg-gray-500/10",
  glowColor: "shadow-gray-500/20",
  accentColor: "gray",
};

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants = {
  initial: { scale: 1.2, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
  hover: { scale: 1.1, transition: { duration: 0.4 } },
};

// Service Card with 3D tilt effect
function ServiceCard({ 
  service, 
  config, 
  index, 
  isRTL, 
  onRequest 
}: { 
  service: Service;
  config: CategoryConfig;
  index: number;
  isRTL: boolean;
  onRequest: () => void;
}) {
  const Icon = config.icon;
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: index * 0.06,
        }
      }}
      exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      layout
    >
      <Card className={cn(
        "h-full flex flex-col overflow-hidden group cursor-pointer",
        "border-2 border-transparent hover:border-primary/30",
        "bg-gradient-to-br from-card to-card/80",
        "shadow-lg hover:shadow-2xl",
        config.glowColor,
        "transition-all duration-500"
      )}>
        {/* Service Image/Gradient Header */}
        <div className={cn(
          "relative h-48 overflow-hidden",
          `bg-gradient-to-br ${config.gradient}`
        )}>
          {service.image_url ? (
            <motion.img
              src={service.image_url}
              alt={service.name}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Icon className="h-24 w-24 text-white/40" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,255,255,0.2)",
                      "0 0 40px rgba(255,255,255,0.4)",
                      "0 0 20px rgba(255,255,255,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          )}

          {/* Animated Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Featured Badge with animation */}
          {service.sort_order === 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Badge className="absolute top-3 start-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white gap-1 shadow-lg">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                  <Star className="h-3 w-3 fill-current" />
                </motion.div>
                {isRTL ? "مميز" : "Featured"}
              </Badge>
            </motion.div>
          )}

          {/* View count indicator */}
          <motion.div
            className="absolute top-3 end-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Eye className="h-3 w-3" />
            <span>{Math.floor(Math.random() * 500) + 100}</span>
          </motion.div>
        </div>

        <CardContent className="flex-1 p-5 flex flex-col relative">
          {/* Decorative corner */}
          <div className={cn(
            "absolute top-0 end-0 w-20 h-20 rounded-bl-full opacity-10",
            `bg-gradient-to-bl ${config.gradient}`
          )} />

          {/* Title with gradient on hover */}
          <motion.h3 
            className="text-lg font-bold mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
          >
            {isRTL ? service.name_ar || service.name : service.name}
          </motion.h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
            {isRTL
              ? service.short_description_ar || service.description_ar || service.description
              : service.short_description || service.description}
          </p>

          {/* CTA Button with animation */}
          <div className="border-t pt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onRequest}
                className={cn(
                  "w-full gap-2 group/btn relative overflow-hidden",
                  `bg-gradient-to-r ${config.gradient} hover:opacity-90`
                )}
              >
                {/* Button shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                  {isRTL ? "عرض التفاصيل" : "View Details"}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CustomerCategoryServices() {
  const { category } = useParams<{ category: string }>();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const config: CategoryConfig = category 
    ? (CATEGORIES_CONFIG[category] || DEFAULT_CATEGORY_CONFIG) 
    : DEFAULT_CATEGORY_CONFIG;
  const Icon = config.icon;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Calculate pagination
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return services.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [services, currentPage]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allServices = await fetchCustomerServices(category);
        setServices(allServices);
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
  }, [category, isRTL]);

  const handleRequestService = (service: Service) => {
    navigate(`/portal/service/${service.id}`);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-80 rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Show Coming Soon page for Infrastructure category
  if (category === "infrastructure") {
    return <ComingSoonInfrastructure />;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Back Button */}
      <motion.div
        variants={headerVariants}
        className="space-y-4"
      >
        {/* Back Button */}
        <motion.div
          whileHover={{ x: isRTL ? 5 : -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/portal/services")}
            className="gap-2 text-muted-foreground hover:text-foreground group"
          >
            <BackIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            {isRTL ? "العودة للأقسام" : "Back to Categories"}
          </Button>
        </motion.div>

        {/* Category Header with enhanced animation */}
        <div className="flex items-center gap-4">
          <motion.div
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center relative",
              `bg-gradient-to-br ${config.gradient}`,
              "shadow-2xl",
              config.glowColor
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Glow ring */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-3xl",
                `bg-gradient-to-br ${config.gradient}`
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-10 w-10 text-white relative z-10" />
            </motion.div>
          </motion.div>
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isRTL ? config.nameAr : config.nameEn}
            </motion.h1>
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {services.length} {isRTL ? "خدمة" : "services"}
              </Badge>
              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-600/30">
                <Zap className="h-3 w-3" />
                {isRTL ? "متاحة الآن" : "Available Now"}
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Category Description */}
        <motion.p 
          className="text-muted-foreground max-w-2xl text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isRTL ? config.descriptionAr : config.descriptionEn}
        </motion.p>

        {/* Stats bar */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: TrendingUp, labelAr: "معدل رضا العملاء", labelEn: "Satisfaction Rate", value: "98%" },
            { icon: Star, labelAr: "التقييم", labelEn: "Rating", value: "4.9/5" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50"
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {isRTL ? stat.labelAr : stat.labelEn}:
              </span>
              <span className="text-sm font-bold text-foreground">{stat.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="h-24 w-24 mx-auto mb-4 text-muted-foreground/30" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">
            {isRTL ? "لا توجد خدمات في هذا القسم" : "No Services in This Category"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRTL ? "سيتم إضافة خدمات قريباً" : "Services will be added soon"}
          </p>
          <Button onClick={() => navigate("/portal/services")}>
            {isRTL ? "استعراض الأقسام الأخرى" : "Browse Other Categories"}
          </Button>
        </motion.div>
      ) : (
        <>
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {paginatedServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  config={config}
                  index={index}
                  isRTL={isRTL}
                  onRequest={() => handleRequestService(service)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4 pt-8"
            >
              {/* Page Info */}
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? `عرض ${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, services.length)} من ${services.length} خدمة`
                  : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, services.length)} of ${services.length} services`
                }
              </p>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9"
                  >
                    {isRTL ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                  </Button>
                </motion.div>

                {/* Previous Page */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9"
                  >
                    {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </motion.div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <motion.div 
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => goToPage(page as number)}
                          className={cn(
                            "h-9 w-9 font-medium",
                            currentPage === page && `bg-gradient-to-r ${config.gradient} text-white border-0`
                          )}
                        >
                          {page}
                        </Button>
                      </motion.div>
                    )
                  ))}
                </div>

                {/* Next Page */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                  >
                    {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </motion.div>

                {/* Last Page */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                  >
                    {isRTL ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default CustomerCategoryServices;
