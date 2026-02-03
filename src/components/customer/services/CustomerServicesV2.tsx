/**
 * Customer Services V2 - Next-Gen Premium Design
 * World-class animations and responsive layout
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, type Service } from "@/lib/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  Sparkles,
  Clock,
  Users,
  Award,
  Zap,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ServiceCategoryCardV2 } from "./ServiceCategoryCardV2";
import { ServicesHeroV2 } from "./ServicesHeroV2";

// Category configurations with enhanced styling
export const CATEGORIES_CONFIG: Record<string, {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  glowColor: string;
}> = {
  development: {
    nameAr: "التطوير البرمجي",
    nameEn: "Development",
    descAr: "مواقع وتطبيقات ويب احترافية",
    descEn: "Professional websites and web apps",
    icon: Code,
    color: "#3B82F6",
    gradient: "from-blue-500 to-cyan-400",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  design: {
    nameAr: "التصميم",
    nameEn: "Design",
    descAr: "هويات بصرية وواجهات مستخدم",
    descEn: "Visual identities and UI/UX",
    icon: Palette,
    color: "#A855F7",
    gradient: "from-purple-500 to-pink-400",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  marketing: {
    nameAr: "التسويق",
    nameEn: "Marketing",
    descAr: "تسويق رقمي وإدارة سوشيال ميديا",
    descEn: "Digital marketing and social media",
    icon: Megaphone,
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-400",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
  infrastructure: {
    nameAr: "البنية التحتية",
    nameEn: "Infrastructure",
    descAr: "استضافة وحلول سحابية",
    descEn: "Hosting and cloud solutions",
    icon: Server,
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16, 185, 129, 0.4)",
  },
  support: {
    nameAr: "الدعم الفني",
    nameEn: "Support",
    descAr: "دعم فني على مدار الساعة",
    descEn: "24/7 technical support",
    icon: Headphones,
    color: "#EF4444",
    gradient: "from-red-500 to-rose-400",
    glowColor: "rgba(239, 68, 68, 0.4)",
  },
  consulting: {
    nameAr: "الاستشارات",
    nameEn: "Consulting",
    descAr: "استشارات تقنية متخصصة",
    descEn: "Specialized tech consulting",
    icon: Briefcase,
    color: "#6366F1",
    gradient: "from-indigo-500 to-violet-400",
    glowColor: "rgba(99, 102, 241, 0.4)",
  },
  mobile: {
    nameAr: "تطبيقات الجوال",
    nameEn: "Mobile Apps",
    descAr: "تطبيقات iOS و Android",
    descEn: "iOS and Android apps",
    icon: Smartphone,
    color: "#0EA5E9",
    gradient: "from-sky-500 to-blue-400",
    glowColor: "rgba(14, 165, 233, 0.4)",
  },
  security: {
    nameAr: "الأمن السيبراني",
    nameEn: "Security",
    descAr: "حماية وأمان متقدم",
    descEn: "Advanced protection",
    icon: Shield,
    color: "#64748B",
    gradient: "from-slate-500 to-gray-400",
    glowColor: "rgba(100, 116, 139, 0.4)",
  },
  api: {
    nameAr: "الربط API",
    nameEn: "API Integration",
    descAr: "ربط وتكامل الأنظمة والخدمات",
    descEn: "System and service integration",
    icon: Globe,
    color: "#EC4899",
    gradient: "from-pink-500 to-fuchsia-400",
    glowColor: "rgba(236, 72, 153, 0.4)",
  },
};

const DEFAULT_CATEGORY = {
  nameAr: "خدمات أخرى",
  nameEn: "Other",
  descAr: "خدمات متنوعة",
  descEn: "Various services",
  icon: Globe,
  color: "#6B7280",
  gradient: "from-gray-500 to-slate-400",
  glowColor: "rgba(107, 114, 128, 0.4)",
};

interface CategoryData {
  key: string;
  config: typeof CATEGORIES_CONFIG[string];
  services: Service[];
}

// Feature badges data
const FEATURES = [
  { icon: Clock, labelAr: "دعم 24/7", labelEn: "24/7 Support", color: "emerald" },
  { icon: Award, labelAr: "جودة عالية", labelEn: "High Quality", color: "amber" },
  { icon: Users, labelAr: "فريق متخصص", labelEn: "Expert Team", color: "blue" },
];

export function CustomerServicesV2() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCustomerServices();
        setServices(data);

        // Group by category
        const grouped = data.reduce((acc, service) => {
          const cat = service.category || "other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(service);
          return acc;
        }, {} as Record<string, Service[]>);

        const categoriesArray = Object.entries(grouped).map(([key, services]) => ({
          key,
          config: CATEGORIES_CONFIG[key] || { ...DEFAULT_CATEGORY, nameEn: key },
          services,
        }));

        categoriesArray.sort((a, b) => b.services.length - a.services.length);
        setCategories(categoriesArray);
      } catch (error) {
        toast({
          title: isRTL ? "خطأ في تحميل الخدمات" : "Error loading services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isRTL]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-52 md:h-60 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Hero Section */}
      <ServicesHeroV2
        totalServices={services.length}
        totalCategories={categories.length}
        isRTL={isRTL}
      />

      {/* Features Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
      >
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              bg-gradient-to-r from-${feature.color}-500/10 to-${feature.color}-500/5
              border border-${feature.color}-500/20
              backdrop-blur-sm cursor-default
            `}
          >
            <feature.icon className={`h-4 w-4 text-${feature.color}-500`} />
            <span className="text-sm font-medium text-foreground/80">
              {isRTL ? feature.labelAr : feature.labelEn}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Categories Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
      >
        <AnimatePresence>
          {categories.map((item, index) => (
            <ServiceCategoryCardV2
              key={item.key}
              category={item}
              index={index}
              isRTL={isRTL}
              onClick={() => navigate(`/app/services/${item.key}`)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 md:py-20"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Package className="h-20 w-20 mx-auto mb-6 text-primary/30" />
          </motion.div>
          <h3 className="text-xl font-bold mb-3 text-foreground">
            {isRTL ? "لا توجد خدمات حالياً" : "No Services Available"}
          </h3>
          <p className="text-foreground/60 mb-6">
            {isRTL ? "سيتم إضافة الخدمات قريباً" : "Services will be added soon"}
          </p>
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 p-6 md:p-8"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm font-semibold text-primary">
                {isRTL ? "خدمة مخصصة" : "Custom Service"}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              {isRTL ? "لم تجد ما تبحث عنه؟" : "Didn't find what you're looking for?"}
            </h3>
            <p className="text-sm text-foreground/60 max-w-md">
              {isRTL
                ? "فريقنا جاهز لمساعدتك في تحقيق متطلباتك الخاصة"
                : "Our team is ready to help you achieve your specific requirements"}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/app/profile")}
              className="gap-2 px-6 py-3 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default CustomerServicesV2;
