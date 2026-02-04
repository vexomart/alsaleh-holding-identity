import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Globe,
  Smartphone,
  Search,
  Monitor,
  Users,
  Target,
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle2,
  Star,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const previewServices = [
  {
    id: 1,
    title: "استضافة المواقع",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
    link: "/hosting-services",
    category: "تقنية"
  },
  {
    id: 2,
    title: "تطوير التطبيقات", 
    icon: Smartphone,
    color: "from-green-500 to-emerald-500",
    shadowColor: "shadow-green-500/20",
    link: "/mobile-apps",
    category: "تطوير"
  },
  {
    id: 3,
    title: "تحسين محركات البحث",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20",
    link: "/seo-services",
    category: "تسويق"
  },
  {
    id: 4,
    title: "تصميم المواقع",
    icon: Monitor,
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    link: "/websites",
    category: "تصميم"
  },
  {
    id: 5,
    title: "إدارة التواصل الاجتماعي",
    icon: Users,
    color: "from-rose-500 to-red-500",
    shadowColor: "shadow-rose-500/20",
    link: "/social-media",
    category: "تسويق"
  },
  {
    id: 6,
    title: "الإعلانات الرقمية",
    icon: Target,
    color: "from-indigo-500 to-blue-500",
    shadowColor: "shadow-indigo-500/20",
    link: "/google-ads",
    category: "تسويق"
  }
];

const stats = [
  { label: "خدمة متكاملة", value: "13+", icon: CheckCircle2 },
  { label: "فئة متخصصة", value: "5", icon: Layers },
  { label: "سنوات خبرة", value: "10+", icon: Star },
  { label: "مشروع ناجح", value: "500+", icon: Rocket }
];

const ServicesPreviewSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    }
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

        {/* Preview Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {previewServices.map((service) => {
            const IconComponent = service.icon;
            
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
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

                    <CardContent className="relative z-10 p-4 sm:p-5 h-full flex flex-col items-center text-center min-h-[140px]">
                      {/* Icon */}
                      <motion.div 
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3"
                      >
                        <div className={cn(
                          "inline-flex p-3 rounded-xl",
                          "bg-gradient-to-br shadow-lg",
                          "group-hover:shadow-xl transition-shadow duration-300",
                          service.color,
                          service.shadowColor
                        )}>
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                      
                      <Badge className={cn(
                        "mt-2 text-[10px] px-2 py-0.5 text-white font-medium rounded-full",
                        "bg-gradient-to-l shadow-sm",
                        service.color
                      )}>
                        {service.category}
                      </Badge>
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
          })}
        </motion.div>

        {/* View All CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12"
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/integrated-services" className="flex items-center gap-3">
              <span>استكشف جميع الخدمات</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          
          <p className="text-xs sm:text-sm text-muted-foreground mt-4">
            <span className="font-semibold text-foreground">13+</span> خدمة متكاملة في <span className="font-semibold text-foreground">5</span> فئات متخصصة
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreviewSection;
