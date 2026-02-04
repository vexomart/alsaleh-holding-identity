import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Zap,
  Code2,
  Shield,
  TrendingUp,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

const mainServices = [
  {
    id: 1,
    title: "استضافة المواقع الإلكترونية",
    subtitle: "Web Hosting Services",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
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
    shadowColor: "shadow-green-500/20",
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
    shadowColor: "shadow-purple-500/20",
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
    shadowColor: "shadow-amber-500/20",
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
    shadowColor: "shadow-rose-500/20",
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
    shadowColor: "shadow-indigo-500/20",
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
    shadowColor: "shadow-teal-500/20",
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
    shadowColor: "shadow-violet-500/20",
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
    shadowColor: "shadow-emerald-500/20",
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
    shadowColor: "shadow-pink-500/20",
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
    shadowColor: "shadow-orange-500/20",
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
    shadowColor: "shadow-blue-600/20",
    link: "/google-ads",
    description: "حملات جوجل للوصول لعملاء أكثر",
    category: "تسويق"
  },
  {
    id: 13,
    title: "تتبع المشاريع",
    subtitle: "Project Tracking",
    icon: Activity,
    color: "from-emerald-600 to-teal-600",
    shadowColor: "shadow-emerald-600/20",
    link: "/login",
    description: "تابع تقدم مشاريعك في الوقت الفعلي",
    category: "تقنية"
  }
];

const categories = [
  { name: "الكل", color: "from-slate-500 to-gray-500" },
  { name: "تقنية", color: "from-blue-500 to-cyan-500" },
  { name: "تطوير", color: "from-green-500 to-emerald-500" },
  { name: "تسويق", color: "from-purple-500 to-pink-500" },
  { name: "تصميم", color: "from-amber-500 to-orange-500" },
  { name: "إبداعي", color: "from-rose-500 to-red-500" }
];

const DepartmentsIconsSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  const renderServiceCard = (service: typeof mainServices[0], index: number) => {
    const IconComponent = service.icon;
    const categoryColor = categories.find(cat => cat.name === service.category)?.color || "from-gray-500 to-slate-500";
    
    return (
      <motion.div
        key={service.id}
        variants={itemVariants}
        whileHover={{ 
          y: -8,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
      >
        <Link to={service.link} className="block group h-full">
          <Card className={`
            relative overflow-hidden h-full transition-all duration-500 
            bg-white dark:bg-slate-900 border-0 rounded-2xl
            hover:shadow-2xl ${service.shadowColor}
            group-hover:border-transparent
          `}>
            {/* Gradient Border on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ padding: '2px' }}>
              <div className="absolute inset-[2px] bg-white dark:bg-slate-900 rounded-[14px]" />
            </div>

            {/* Category Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="absolute top-3 right-3 z-20"
            >
              <Badge className={`
                text-[10px] sm:text-xs px-2 py-0.5 text-white font-medium rounded-full
                bg-gradient-to-l ${categoryColor}
              `}>
                {service.category}
              </Badge>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-100 dark:from-slate-800 to-transparent rounded-br-full opacity-50" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr ${service.color} rounded-full opacity-5`}
            />

            <CardContent className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col">
              {/* Icon Container */}
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="mb-3 sm:mb-4 flex justify-center"
              >
                <div className={`
                  relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} 
                  shadow-lg ${service.shadowColor} group-hover:shadow-xl
                  transition-all duration-300
                `}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  
                  {/* Icon Glow */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center text-center">
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                  {service.title}
                </h3>
                <h4 className="hidden sm:block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-2 opacity-70">
                  {service.subtitle}
                </h4>
                <p className="hidden md:block text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Hover CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="mt-3 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className={`
                  flex items-center justify-center gap-2 text-xs font-semibold
                  bg-gradient-to-l ${service.color} bg-clip-text text-transparent
                `}>
                  <span>اكتشف المزيد</span>
                  <ArrowLeft className="w-3 h-3 text-primary group-hover:-translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </CardContent>

            {/* Bottom Accent */}
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l ${service.color}`}
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
    <section dir="rtl" className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-500" />
            </motion.div>
            <Badge className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-bold shadow-lg rounded-full">
              ASH HOLDING SERVICES
            </Badge>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-500" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-l from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              خدماتنا
            </span>
            {" "}
            <span className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              المتكاملة
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            نقدم مجموعة شاملة من الخدمات الرقمية والتقنية لتلبية جميع احتياجات عملك
          </motion.p>

          {/* Decorative Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 w-24 sm:w-32 bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-16"
        >
          {mainServices.map((service, index) => renderServiceCard(service, index))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[size:60px_60px]" />

            {/* Floating Icons */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-8 right-8 hidden md:block"
            >
              <Rocket className="w-8 h-8 text-blue-400/30" />
            </motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-8 left-8 hidden md:block"
            >
              <Code2 className="w-8 h-8 text-purple-400/30" />
            </motion.div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-white/80 text-sm font-medium">ابدأ مشروعك الآن</span>
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                جاهز لبدء مشروعك؟
              </h3>
              <p className="text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                تواصل معنا اليوم واحصل على استشارة مجانية لتحديد أفضل الحلول لأعمالك
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/consultation">
                  <button className="bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 group">
                    <span className="flex items-center gap-2">
                      احصل على استشارة مجانية
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
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
