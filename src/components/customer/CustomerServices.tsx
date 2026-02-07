/**
 * Customer Services Page
 * Modern, responsive design with premium content
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchCustomerServices, type Service } from "@/lib/api/services";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Category configurations
const CATEGORIES: Record<string, {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: React.ElementType;
  color: string;
  bgClass: string;
}> = {
  development: {
    nameAr: "التطوير البرمجي",
    nameEn: "Development",
    descAr: "مواقع وتطبيقات ويب احترافية",
    descEn: "Professional websites and web apps",
    icon: Code,
    color: "#3B82F6",
    bgClass: "from-blue-500/20 to-blue-600/5",
  },
  design: {
    nameAr: "التصميم",
    nameEn: "Design",
    descAr: "هويات بصرية وواجهات مستخدم",
    descEn: "Visual identities and UI/UX",
    icon: Palette,
    color: "#A855F7",
    bgClass: "from-purple-500/20 to-purple-600/5",
  },
  marketing: {
    nameAr: "التسويق",
    nameEn: "Marketing",
    descAr: "تسويق رقمي وإدارة سوشيال ميديا",
    descEn: "Digital marketing and social media",
    icon: Megaphone,
    color: "#F59E0B",
    bgClass: "from-amber-500/20 to-amber-600/5",
  },
  infrastructure: {
    nameAr: "البنية التحتية",
    nameEn: "Infrastructure",
    descAr: "استضافة وحلول سحابية",
    descEn: "Hosting and cloud solutions",
    icon: Server,
    color: "#10B981",
    bgClass: "from-emerald-500/20 to-emerald-600/5",
  },
  support: {
    nameAr: "الدعم الفني",
    nameEn: "Support",
    descAr: "دعم فني على مدار الساعة",
    descEn: "24/7 technical support",
    icon: Headphones,
    color: "#EF4444",
    bgClass: "from-red-500/20 to-red-600/5",
  },
  consulting: {
    nameAr: "الاستشارات",
    nameEn: "Consulting",
    descAr: "استشارات تقنية متخصصة",
    descEn: "Specialized tech consulting",
    icon: Briefcase,
    color: "#6366F1",
    bgClass: "from-indigo-500/20 to-indigo-600/5",
  },
  mobile: {
    nameAr: "تطبيقات الجوال",
    nameEn: "Mobile Apps",
    descAr: "تطبيقات iOS و Android",
    descEn: "iOS and Android apps",
    icon: Smartphone,
    color: "#0EA5E9",
    bgClass: "from-sky-500/20 to-sky-600/5",
  },
  security: {
    nameAr: "الأمن السيبراني",
    nameEn: "Security",
    descAr: "حماية وأمان متقدم",
    descEn: "Advanced protection",
    icon: Shield,
    color: "#64748B",
    bgClass: "from-slate-500/20 to-slate-600/5",
  },
  api: {
    nameAr: "الربط API",
    nameEn: "API Integration",
    descAr: "ربط وتكامل الأنظمة والخدمات",
    descEn: "System and service integration",
    icon: Globe,
    color: "#EC4899",
    bgClass: "from-pink-500/20 to-pink-600/5",
  },
};

const DEFAULT_CATEGORY = {
  nameAr: "خدمات أخرى",
  nameEn: "Other",
  descAr: "خدمات متنوعة",
  descEn: "Various services",
  icon: Globe,
  color: "#6B7280",
  bgClass: "from-gray-500/20 to-gray-600/5",
};

interface CategoryData {
  key: string;
  config: {
    nameAr: string;
    nameEn: string;
    descAr: string;
    descEn: string;
    icon: React.ElementType;
    color: string;
    bgClass: string;
  };
  services: Service[];
}

export function CustomerServices() {
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
          config: CATEGORIES[key] || { ...DEFAULT_CATEGORY, nameEn: key },
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

  const NavIcon = isRTL ? ArrowLeft : ArrowRight;

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative p-5 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {isRTL ? "خدمات متكاملة" : "Complete Services"}
                </span>
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                {isRTL ? "اكتشف خدماتنا" : "Discover Our Services"}
              </h1>
              
              <p className="text-sm md:text-base text-foreground/70 max-w-lg leading-relaxed">
                {isRTL
                  ? "نقدم لك مجموعة شاملة من الخدمات التقنية والرقمية لتحقيق أهداف أعمالك"
                  : "We offer a comprehensive range of technical and digital services to achieve your business goals"}
              </p>
            </div>

            {/* Stats - Hidden on mobile, shown on larger screens */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">{categories.length}</div>
                <div className="text-xs font-medium text-foreground/60">{isRTL ? "قسم" : "Sections"}</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">{services.length}</div>
                <div className="text-xs font-medium text-foreground/60">{isRTL ? "خدمة" : "Services"}</div>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="flex md:hidden items-center justify-around mt-4 pt-4 border-t border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{categories.length}</div>
                <div className="text-xs font-medium text-foreground/60">{isRTL ? "قسم" : "Sections"}</div>
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{services.length}</div>
                <div className="text-xs font-medium text-foreground/60">{isRTL ? "خدمة" : "Services"}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm"
      >
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-emerald-500" />
          <span className="font-medium text-foreground/70">{isRTL ? "دعم 24/7" : "24/7 Support"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-foreground/70">{isRTL ? "جودة عالية" : "High Quality"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-foreground/70">{isRTL ? "فريق متخصص" : "Expert Team"}</span>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
        {categories.map((item, index) => {
          const Icon = item.config.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => navigate(`/portal/services/${item.key}`)}
                className={cn(
                  "cursor-pointer h-full overflow-hidden",
                  "border border-border/50 hover:border-primary/30",
                  "transition-all duration-300 hover:shadow-lg",
                  "bg-gradient-to-br",
                  item.config.bgClass
                )}
              >
                <CardContent className="p-4 md:p-5 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4"
                    style={{ backgroundColor: `${item.config.color}20` }}
                  >
                    <Icon
                      className="h-5 w-5 md:h-6 md:w-6"
                      style={{ color: item.config.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">
                      {isRTL ? item.config.nameAr : item.config.nameEn}
                    </h3>
                    <p className="text-xs text-foreground/75 line-clamp-2 leading-relaxed">
                      {isRTL ? item.config.descAr : item.config.descEn}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-border/50">
                    <Badge
                      variant="secondary"
                      className="text-[10px] md:text-xs px-2 py-0.5 bg-background/70 text-foreground/80 border border-border/60"
                    >
                      {item.services.length} {isRTL ? "خدمة" : "services"}
                    </Badge>
                    <NavIcon
                      className="h-4 w-4 text-foreground/70"
                      style={{ color: item.config.color }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 md:py-16"
        >
          <Package className="h-16 w-16 mx-auto mb-4 text-foreground/20" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {isRTL ? "لا توجد خدمات حالياً" : "No Services Available"}
          </h3>
          <p className="text-sm text-foreground/60">
            {isRTL ? "سيتم إضافة الخدمات قريباً" : "Services will be added soon"}
          </p>
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-4 md:pt-6"
      >
        <p className="text-sm font-medium text-foreground/60 mb-3">
          {isRTL
            ? "لم تجد ما تبحث عنه؟"
            : "Didn't find what you're looking for?"}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/portal/profile")}
          className="gap-2"
        >
          <Headphones className="h-4 w-4" />
          {isRTL ? "تواصل معنا" : "Contact Us"}
        </Button>
      </motion.div>
    </div>
  );
}
