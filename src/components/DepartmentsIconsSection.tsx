import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe,
  Smartphone,
  Search,
  Monitor,
  Users,
  Target,
  Camera,
  Settings,
  FileEdit,
  Palette,
  Video,
  BarChart3,
  Activity,
  ArrowLeft,
  Sparkles,
  Zap,
  Code2,
  Rocket,
  Layers,
  CheckCircle2,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const mainServices = [
  {
    id: 1,
    title: "استضافة المواقع الإلكترونية",
    subtitle: "Web Hosting Services",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
    link: "/hosting-services",
    description: "خدمات استضافة احترافية وموثوقة بأعلى معايير الأمان",
    category: "تقنية"
  },
  {
    id: 2,
    title: "تطوير وبرمجة تطبيقات الموبايل", 
    subtitle: "Mobile App Development",
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    shadowColor: "shadow-green-500/20",
    link: "/mobile-apps",
    description: "تطبيقات ذكية لجميع المنصات iOS و Android",
    category: "تطوير"
  },
  {
    id: 3,
    title: "تهيئة المواقع لمحركات البحث",
    subtitle: "SEO Optimization",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20",
    link: "/seo-services",
    description: "تحسين ترتيب موقعك في محركات البحث العالمية",
    category: "تسويق"
  },
  {
    id: 4,
    title: "تصميم المواقع والمتاجر الإلكترونية",
    subtitle: "Web & E-commerce Design",
    icon: Monitor,
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    link: "/websites",
    description: "تصاميم عصرية ومتجاوبة تناسب جميع الأجهزة",
    category: "تصميم"
  },
  {
    id: 5,
    title: "إدارة مواقع التواصل الاجتماعي",
    subtitle: "Social Media Management",
    icon: Users,
    color: "from-rose-500 to-red-500",
    shadowColor: "shadow-rose-500/20",
    link: "/social-media",
    description: "إدارة احترافية شاملة لحساباتك على جميع المنصات",
    category: "تسويق"
  },
  {
    id: 6,
    title: "إعلانات فيسبوك",
    subtitle: "Facebook Advertising",
    icon: Target,
    color: "from-indigo-500 to-blue-500",
    shadowColor: "shadow-indigo-500/20",
    link: "/facebook-ads",
    description: "حملات إعلانية مستهدفة وفعالة بأعلى عائد استثمار",
    category: "تسويق"
  },
  {
    id: 7,
    title: "تصوير المنتجات",
    subtitle: "Product Photography",
    icon: Camera,
    color: "from-teal-500 to-cyan-500",
    shadowColor: "shadow-teal-500/20",
    link: "/product-photography",
    description: "تصوير احترافي يبرز منتجاتك بأفضل صورة",
    category: "إبداعي"
  },
  {
    id: 8,
    title: "نظام إدارة العملاء CRM",
    subtitle: "Customer Management System",
    icon: Settings,
    color: "from-violet-500 to-purple-500",
    shadowColor: "shadow-violet-500/20",
    link: "/crm-system",
    description: "نظام متطور لإدارة علاقات العملاء وتحسين المبيعات",
    category: "تقنية"
  },
  {
    id: 9,
    title: "كتابة المحتوى",
    subtitle: "Content Writing",
    icon: FileEdit,
    color: "from-emerald-500 to-green-500",
    shadowColor: "shadow-emerald-500/20",
    link: "/content-writing",
    description: "محتوى إبداعي يجذب جمهورك ويحقق أهدافك",
    category: "إبداعي"
  },
  {
    id: 10,
    title: "تصميم الهويات التجارية",
    subtitle: "Brand Identity Design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/20",
    link: "/brand-identity",
    description: "هوية بصرية مميزة تعكس قيم علامتك التجارية",
    category: "تصميم"
  },
  {
    id: 11,
    title: "إنتاج فيديوهات وموشن جرافيك",
    subtitle: "Video & Motion Graphics",
    icon: Video,
    color: "from-orange-500 to-red-500",
    shadowColor: "shadow-orange-500/20",
    link: "/video-production",
    description: "محتوى بصري متحرك وجذاب يروي قصة علامتك",
    category: "إبداعي"
  },
  {
    id: 12,
    title: "إعلانات جوجل ADS",
    subtitle: "Google Advertising",
    icon: BarChart3,
    color: "from-blue-600 to-indigo-600",
    shadowColor: "shadow-blue-600/20",
    link: "/google-ads",
    description: "حملات جوجل للوصول لعملاء أكثر حول العالم",
    category: "تسويق"
  },
  {
    id: 13,
    title: "تتبع المشاريع",
    subtitle: "Project Tracking",
    icon: Activity,
    color: "from-emerald-600 to-teal-600",
    shadowColor: "shadow-emerald-600/20",
    link: "/portal",
    description: "تابع تقدم مشاريعك في الوقت الفعلي مع تقارير مفصلة",
    category: "تقنية"
  }
];

const categories = [
  { name: "الكل", icon: Layers, color: "from-slate-600 to-gray-600", count: mainServices.length },
  { name: "تقنية", icon: Settings, color: "from-blue-500 to-cyan-500", count: mainServices.filter(s => s.category === "تقنية").length },
  { name: "تطوير", icon: Code2, color: "from-green-500 to-emerald-500", count: mainServices.filter(s => s.category === "تطوير").length },
  { name: "تسويق", icon: Target, color: "from-purple-500 to-pink-500", count: mainServices.filter(s => s.category === "تسويق").length },
  { name: "تصميم", icon: Palette, color: "from-amber-500 to-orange-500", count: mainServices.filter(s => s.category === "تصميم").length },
  { name: "إبداعي", icon: Sparkles, color: "from-rose-500 to-red-500", count: mainServices.filter(s => s.category === "إبداعي").length }
];

const stats = [
  { label: "خدمة متكاملة", value: "13+", icon: CheckCircle2 },
  { label: "فئة متخصصة", value: "5", icon: Layers },
  { label: "سنوات خبرة", value: "10+", icon: Star },
  { label: "مشروع ناجح", value: "500+", icon: Rocket }
];

const DepartmentsIconsSection = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  
  const filteredServices = activeCategory === "الكل" 
    ? mainServices 
    : mainServices.filter(s => s.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 14
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const renderServiceCard = (service: typeof mainServices[0], index: number) => {
    const IconComponent = service.icon;
    
    return (
      <motion.div
        key={service.id}
        layout
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ 
          y: -6,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        className="h-full"
      >
        <Link to={service.link} className="block group h-full">
          <Card className={cn(
            "relative overflow-hidden h-full transition-all duration-300",
            "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
            "border border-slate-200/60 dark:border-slate-700/60",
            "rounded-2xl hover:border-transparent",
            "hover:shadow-xl",
            service.shadowColor
          )}>
            {/* Gradient Border on Hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300 rounded-2xl p-[1.5px]",
              service.color
            )}>
              <div className="absolute inset-[1.5px] bg-white dark:bg-slate-900 rounded-[14px]" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 right-3 z-20">
              <Badge className={cn(
                "text-[10px] px-2 py-0.5 text-white font-medium rounded-full",
                "bg-gradient-to-l shadow-sm",
                service.color
              )}>
                {service.category}
              </Badge>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-slate-100/50 dark:from-slate-800/50 to-transparent rounded-br-full" />

            <CardContent className="relative z-10 p-5 sm:p-6 h-full flex flex-col min-h-[200px] sm:min-h-[220px]">
              {/* Icon */}
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className={cn(
                  "inline-flex p-3.5 sm:p-4 rounded-xl",
                  "bg-gradient-to-br shadow-lg",
                  "group-hover:shadow-xl transition-shadow duration-300",
                  service.color,
                  service.shadowColor
                )}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground/70 mb-1 font-medium">
                  {service.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 mt-auto">
                  {service.description}
                </p>
              </div>

              {/* Hover CTA */}
              <div className="mt-4 pt-3 border-t border-border/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className={cn(
                  "flex items-center gap-2 text-xs font-semibold",
                  "bg-gradient-to-l bg-clip-text text-transparent",
                  service.color
                )}>
                  <span>اكتشف المزيد</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-primary group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>

            {/* Bottom Accent Line */}
            <motion.div 
              className={cn("absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l", service.color)}
              initial={{ scaleX: 0, originX: 1 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </Card>
        </Link>
      </motion.div>
    );
  };

  return (
    <section dir="rtl" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"
        />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <Badge className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 text-white px-5 py-1.5 text-xs sm:text-sm font-bold shadow-lg rounded-full">
              ASH HOLDING SERVICES
            </Badge>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            <span className="bg-gradient-to-l from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              خدماتنا
            </span>{" "}
            <span className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              المتكاملة
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الرقمية والتقنية لتلبية جميع احتياجات عملك
          </p>

          {/* Decorative Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-1 w-20 sm:w-24 bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 mx-auto mt-5 rounded-full"
          />
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-200/50 dark:border-slate-700/50"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((cat, index) => {
              const isActive = activeCategory === cat.name;
              const CatIcon = cat.icon;
              
              return (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm",
                    "transition-all duration-300 border",
                    isActive 
                      ? "bg-gradient-to-l text-white border-transparent shadow-lg " + cat.color
                      : "bg-white/80 dark:bg-slate-800/80 text-muted-foreground border-slate-200 dark:border-slate-700 hover:border-primary/50"
                  )}
                >
                  <CatIcon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[10px] px-1.5 py-0 min-w-[20px] h-5",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700"
                    )}
                  >
                    {cat.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Services Grid - 4 columns max for better readability */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16"
          >
            {filteredServices.map((service, index) => renderServiceCard(service, index))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">لا توجد خدمات في هذه الفئة</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[size:60px_60px]" />

            {/* Floating Icons */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-6 right-6 hidden sm:block"
            >
              <Rocket className="w-8 h-8 text-blue-400/30" />
            </motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-6 left-6 hidden sm:block"
            >
              <Code2 className="w-8 h-8 text-purple-400/30" />
            </motion.div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-5"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-white/80 text-sm font-medium">ابدأ مشروعك الآن</span>
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                جاهز لبدء مشروعك؟
              </h3>
              <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm sm:text-base">
                تواصل معنا اليوم واحصل على استشارة مجانية لتحديد أفضل الحلول لأعمالك
              </p>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link to="/consultation">
                  <button className="bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 group">
                    <span className="flex items-center gap-2">
                      احصل على استشارة مجانية
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DepartmentsIconsSection;
