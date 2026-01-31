/**
 * Customer Category Services Page
 * Display services within a specific category with premium design
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, type Service } from "@/lib/api/services";
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
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Tag,
  CheckCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Category configurations
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

const DEFAULT_CATEGORY_CONFIG = {
  nameAr: "خدمات أخرى",
  nameEn: "Other Services",
  descriptionAr: "خدمات متنوعة لتلبية احتياجاتك",
  descriptionEn: "Various services to meet your needs",
  icon: Globe,
  gradient: "from-gray-500 to-gray-600",
  bgColor: "bg-gray-500/10",
};

export function CustomerCategoryServices() {
  const { category } = useParams<{ category: string }>();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = category ? (CATEGORIES_CONFIG[category] || { ...DEFAULT_CATEGORY_CONFIG, nameEn: category }) : DEFAULT_CATEGORY_CONFIG;
  const Icon = config.icon;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

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

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return isRTL ? "اتصل للسعر" : "Contact for price";
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRequestService = (service: Service) => {
    toast({
      title: isRTL ? "طلب الخدمة" : "Request Service",
      description: isRTL
        ? `تم اختيار خدمة: ${service.name_ar || service.name}`
        : `Selected service: ${service.name}`,
    });
    navigate("/app/orders");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/app/services")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <BackIcon className="h-4 w-4" />
          {isRTL ? "العودة للأقسام" : "Back to Categories"}
        </Button>

        {/* Category Header */}
        <div className="flex items-center gap-4">
          <motion.div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              `bg-gradient-to-br ${config.gradient}`,
              "shadow-lg"
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {isRTL ? config.nameAr : config.nameEn}
            </h1>
            <p className="text-muted-foreground">
              {services.length} {isRTL ? "خدمة متاحة" : "services available"}
            </p>
          </div>
        </div>

        {/* Category Description */}
        <p className="text-muted-foreground max-w-2xl">
          {isRTL ? config.descriptionAr : config.descriptionEn}
        </p>
      </motion.div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="h-20 w-20 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">
            {isRTL ? "لا توجد خدمات في هذا القسم" : "No Services in This Category"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRTL ? "سيتم إضافة خدمات قريباً" : "Services will be added soon"}
          </p>
          <Button onClick={() => navigate("/app/services")}>
            {isRTL ? "استعراض الأقسام الأخرى" : "Browse Other Categories"}
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ y: -8 }}
                layout
              >
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  {/* Service Image/Gradient Header */}
                  <div className={cn(
                    "relative h-40 overflow-hidden",
                    `bg-gradient-to-br ${config.gradient}`
                  )}>
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 0.3 }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <Icon className="h-20 w-20 text-white" />
                        </motion.div>
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Featured Badge */}
                    {service.sort_order === 1 && (
                      <Badge className="absolute top-3 start-3 bg-amber-500 text-white gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {isRTL ? "مميز" : "Featured"}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="flex-1 p-5 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {isRTL ? service.name_ar || service.name : service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                      {isRTL
                        ? service.short_description_ar || service.description_ar || service.description
                        : service.short_description || service.description}
                    </p>

                    {/* Price Section */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <p className={cn(
                          "text-2xl font-bold",
                          `bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`
                        )}>
                          {formatCurrency(service.price, service.currency)}
                        </p>
                        {service.price && (
                          <div className="text-xs text-muted-foreground">
                            {service.include_vat ? (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="h-3 w-3" />
                                {isRTL ? "شامل الضريبة" : "VAT Inc."}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {isRTL ? "+ 15% ضريبة" : "+ 15% VAT"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleRequestService(service)}
                        className={cn(
                          "w-full gap-2",
                          `bg-gradient-to-r ${config.gradient} hover:opacity-90`
                        )}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {isRTL ? "اطلب الخدمة" : "Request Service"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
