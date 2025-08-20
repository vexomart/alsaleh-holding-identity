import { useState, useEffect } from "react";
import { Code, Package, Megaphone, Building, PenTool, ArrowLeft, Sparkles, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "برمجة التطبيقات والمواقع",
    titleEn: "Application & Web Development",
    description: "نقوم بتطوير تطبيقات الجوال والمواقع الإلكترونية باستخدام أحدث التقنيات العالمية والمعايير الدولية للجودة",
    icon: Code,
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    bgGradient: "from-blue-50/80 to-indigo-100/60",
    glowColor: "blue-500/30",
    features: ["تطبيقات الموبايل", "المواقع التفاعلية", "أنظمة إدارة المحتوى"]
  },
  {
    id: 2,
    title: "المشاريع الجاهزة",
    titleEn: "Ready-Made Solutions", 
    description: "حلول برمجية متكاملة وجاهزة للاستخدام الفوري، مصممة لتلبية احتياجات الشركات المختلفة بكفاءة عالية",
    icon: Package,
    gradient: "from-emerald-600 via-green-700 to-teal-800",
    bgGradient: "from-emerald-50/80 to-teal-100/60",
    glowColor: "emerald-500/30",
    features: ["أنظمة جاهزة", "حلول سريعة", "دعم فني شامل"]
  },
  {
    id: 3,
    title: "التسويق الإلكتروني",
    titleEn: "Digital Marketing",
    description: "استراتيجيات تسويقية رقمية متطورة ومدروسة لزيادة الوصول والتفاعل وتحقيق أعلى معدلات التحويل",
    icon: Megaphone,
    gradient: "from-purple-600 via-violet-700 to-purple-800",
    bgGradient: "from-purple-50/80 to-violet-100/60",
    glowColor: "purple-500/30",
    features: ["إدارة وسائل التواصل", "الإعلانات الرقمية", "تحسين محركات البحث"]
  },
  {
    id: 4,
    title: "أنظمة الشركات",
    titleEn: "Enterprise Systems",
    description: "أنظمة إدارة متطورة ومخصصة لتحسين العمليات التشغيلية وزيادة الإنتاجية وتعزيز الكفاءة المؤسسية",
    icon: Building,
    gradient: "from-orange-600 via-red-700 to-pink-800",
    bgGradient: "from-orange-50/80 to-pink-100/60",
    glowColor: "orange-500/30",
    features: ["إدارة الموارد البشرية", "أنظمة المحاسبة", "إدارة المشاريع"]
  },
  {
    id: 5,
    title: "صناعة المحتوى",
    titleEn: "Content Creation",
    description: "إنتاج محتوى إبداعي ومؤثر عالي الجودة يعكس هوية علامتك التجارية ويجذب جمهورك المستهدف بفعالية",
    icon: PenTool,
    gradient: "from-cyan-600 via-blue-700 to-indigo-800",
    bgGradient: "from-cyan-50/80 to-blue-100/60",
    glowColor: "cyan-500/30",
    features: ["المحتوى المرئي", "التصميم الجرافيكي", "إنتاج الفيديو"]
  }
];

const OurServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeAnimation, setActiveAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnimation((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-inter">
      {/* Premium Corporate Background */}
      <div className="absolute inset-0">
        {/* Geometric Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10 sm:opacity-20 dark:opacity-5 sm:dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="enterprise-grid" width="40" height="40" patternUnits="userSpaceOnUse" className="sm:w-[60px] sm:h-[60px] lg:w-[80px] lg:h-[80px]">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" className="sm:strokeWidth-[0.4] lg:strokeWidth-[0.5]"/>
              <circle cx="20" cy="20" r="0.8" fill="currentColor" opacity="0.3" className="sm:r-[1] lg:r-[1.2]"/>
              <path d="M 10 10 L 30 10 L 30 30 L 10 30 Z" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.15" className="sm:strokeWidth-[0.25] lg:strokeWidth-[0.3]"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#enterprise-grid)" className="text-blue-600 dark:text-blue-400"/>
        </svg>
        
        {/* Mobile-Optimized Floating Corporate Elements */}
        <div className="absolute top-8 right-8 w-32 h-32 sm:top-12 sm:right-12 sm:w-48 sm:h-48 md:top-15 md:right-15 md:w-64 md:h-64 lg:top-20 lg:right-20 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400/6 to-indigo-600/8 sm:from-blue-400/8 sm:to-indigo-600/12 rounded-full blur-xl sm:blur-2xl lg:blur-3xl animate-float"></div>
        <div className="absolute bottom-12 left-8 w-28 h-28 sm:bottom-16 sm:left-12 sm:w-40 sm:h-40 md:bottom-20 md:left-15 md:w-56 md:h-56 lg:bottom-32 lg:left-20 lg:w-80 lg:h-80 bg-gradient-to-tr from-purple-400/6 to-pink-500/8 sm:from-purple-400/8 sm:to-pink-500/10 rounded-full blur-xl sm:blur-2xl lg:blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-cyan-300/4 to-blue-400/6 sm:from-cyan-300/6 sm:to-blue-400/8 rounded-full blur-xl sm:blur-2xl lg:blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
        
        {/* Mobile-Responsive Corporate Lines */}
        <div className="hidden md:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200/20 sm:via-blue-200/30 to-transparent"></div>
        <div className="hidden md:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-200/20 sm:via-purple-200/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 max-w-7xl">
        {/* Mobile-First Enterprise Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-28 animate-fade-in">
          {/* Mobile-Optimized Premium Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-3 rounded-full bg-gradient-to-r from-blue-600/8 via-indigo-600/8 to-purple-600/8 sm:from-blue-600/10 sm:via-indigo-600/10 sm:to-purple-600/10 border border-blue-500/15 sm:border-blue-500/20 backdrop-blur-lg mb-4 sm:mb-6 lg:mb-8 shadow-md sm:shadow-lg">
            <div className="relative flex items-center gap-1 sm:gap-1.5 lg:gap-2">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 tracking-wide font-cairo">
                محفظة الخدمات المتميزة
              </span>
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-gold-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
          
          {/* Mobile-Optimized Multilingual Heading */}
          <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-black font-inter tracking-tight leading-tight px-2 sm:px-0">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                خدماتنا
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-slate-500 dark:text-slate-400 font-cairo tracking-wide">
              خدماتنا المتميزة
            </p>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-600 dark:text-slate-300 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-medium font-cairo px-2 sm:px-4 md:px-0">
            نقدم حلول تقنية متطورة ومبتكرة على مستوى عالمي، مصممة خصيصاً لتلبية احتياجات الشركات الحديثة وتحقيق أهدافها الرقمية الطموحة
          </p>
          
          {/* Mobile-Optimized Animated Corporate Divider */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-12">
            <div className="relative flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              <div className="w-6 sm:w-8 md:w-12 lg:w-16 h-0.5 sm:h-0.5 lg:h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600 animate-pulse" />
              <div className="w-6 sm:w-8 md:w-12 lg:w-16 h-0.5 sm:h-0.5 lg:h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Mobile-First Enterprise Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === service.id;
            const isActive = activeAnimation === index;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl",
                  "border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl",
                  "transition-all duration-700 transform hover:scale-[1.01] sm:hover:scale-[1.02] lg:hover:scale-[1.03] hover:-translate-y-0.5 sm:hover:-translate-y-1 lg:hover:-translate-y-2",
                  "shadow-md sm:shadow-lg lg:shadow-xl hover:shadow-lg sm:hover:shadow-xl lg:hover:shadow-2xl cursor-pointer",
                  "hover:border-blue-400/60 dark:hover:border-blue-500/60",
                  isHovered && `hover:shadow-${service.glowColor.split("/")[0]}-500/15 sm:hover:shadow-${service.glowColor.split("/")[0]}-500/20`,
                  isActive && "animate-pulse border-blue-400/80 dark:border-blue-500/80",
                  "animate-fade-in w-full",
                  "before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl lg:before:rounded-3xl",
                  "before:bg-gradient-to-r before:from-blue-500/0 before:via-blue-500/5 before:to-purple-500/0",
                  "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700"
                )}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Animated Gradient Border */}
                <div className={cn(
                  "absolute -inset-0.5 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000",
                  "bg-gradient-to-r animate-pulse",
                  service.gradient,
                  "blur-sm group-hover:blur-none"
                )}></div>
                
                {/* Premium Background Gradient with Animation */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-all duration-1000",
                  service.bgGradient,
                  "animate-shimmer"
                )}></div>
                
                {/* Enhanced Animated Corporate Border */}
                <div className={cn(
                  "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-700",
                  "bg-gradient-to-r p-px opacity-0 group-hover:opacity-100",
                  service.gradient,
                  "animate-rotate-slow"
                )}>
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                </div>
                
                {/* Enhanced Multiple Shimmer Effects */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1500 group-hover:translate-x-full skew-x-12 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-transparent via-blue-400/10 to-transparent transition-transform duration-2000 group-hover:translate-y-full skew-y-12 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100" style={{ animationDelay: "0.5s" }}></div>
                
                {/* Floating Border Animation */}
                <div className={cn(
                  "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 transition-all duration-1000",
                  "border-transparent group-hover:border-gradient-to-r",
                  `group-hover:border-${service.gradient.split(' ')[1]}`,
                  "animate-pulse opacity-0 group-hover:opacity-60"
                )}></div>
                
                <CardContent className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                  {/* Mobile-First Responsive Animated Icon Container with Enhanced Effects */}
                  <div className="mb-4 sm:mb-6 lg:mb-8 xl:mb-10 relative">
                    {/* Pulsing Background Ring */}
                    <div className={cn(
                      "absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl lg:rounded-3xl",
                      "bg-gradient-to-br opacity-20 animate-pulse blur-lg",
                      service.gradient
                    )}></div>
                    
                    <div className={cn(
                      "relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-700",
                      "bg-gradient-to-br shadow-md sm:shadow-lg lg:shadow-xl xl:shadow-2xl transform-gpu",
                      service.gradient,
                      isActive ? "animate-icon-float scale-110" : "group-hover:animate-icon-pulse",
                      "group-hover:scale-105 sm:group-hover:scale-110 group-hover:rotate-1 sm:group-hover:rotate-2 lg:group-hover:rotate-3",
                      `shadow-${service.glowColor}`,
                      "border-2 border-white/30 group-hover:border-white/50"
                    )}>
                      <IconComponent 
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white transition-all duration-700 filter drop-shadow-lg",
                          isActive ? "animate-bounce-slow scale-110" : "group-hover:scale-110 sm:group-hover:scale-125",
                          "group-hover:rotate-3 sm:group-hover:rotate-6 lg:group-hover:rotate-12"
                        )}
                      />
                      
                      {/* Enhanced Multi-layered Glow Rings */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-1000",
                        "bg-gradient-to-br opacity-0 group-hover:opacity-60 blur-md sm:blur-lg lg:blur-xl",
                        service.gradient,
                        isActive && "animate-pulse opacity-40 sm:opacity-50"
                      )}></div>
                      
                      <div className={cn(
                        "absolute -inset-1 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-1000",
                        "bg-gradient-to-br opacity-0 group-hover:opacity-30 blur-2xl",
                        service.gradient,
                        "animate-pulse"
                      )}></div>
                      
                      <div className={cn(
                        "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/20 sm:border-2 sm:border-white/30 transition-all duration-1000",
                        isActive ? "animate-rotate border-white/50" : "group-hover:rotate-180 group-hover:scale-110 sm:group-hover:scale-125 group-hover:border-white/50"
                      )}></div>
                      
                      {/* Floating Particles */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400/80 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: "0.3s" }}></div>
                      
                      {/* Enhanced Corner Sparkles */}
                      <Sparkles className={cn(
                        "absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 lg:-top-2 lg:-right-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white/80 transition-all duration-500",
                        isActive ? "animate-pulse scale-125" : "opacity-0 group-hover:opacity-100 group-hover:rotate-12 group-hover:scale-110"
                      )} />
                    </div>
                  </div>
                  
                  {/* Mobile-First Enhanced Content with Better Typography */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6">
                    {/* Enhanced Mobile-Optimized Title with Custom Typography */}
                    <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                      <h3 className={cn(
                        "text-lg sm:text-xl md:text-2xl lg:text-3xl font-black leading-tight transition-all duration-500",
                        "text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400",
                        "font-cairo tracking-wide",
                        "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r",
                        `after:${service.gradient} after:transition-all after:duration-500 group-hover:after:w-full`,
                        "group-hover:scale-105 transform transition-transform duration-300"
                      )}>
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-poppins tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {service.titleEn}
                      </p>
                    </div>
                    
                    <p className={cn(
                      "text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium",
                      "group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500",
                      "font-cairo line-clamp-3 sm:line-clamp-none",
                      "relative pl-3 border-l-2 border-transparent group-hover:border-blue-400/50 transition-all duration-500"
                    )}>
                      {service.description}
                    </p>
                    
                    {/* Enhanced Mobile-Optimized Feature Tags with Animations */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2">
                      {service.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className={cn(
                            "px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 text-xs font-bold rounded-full transition-all duration-300",
                            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
                            "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20",
                            "group-hover:text-blue-600 dark:group-hover:text-blue-400 font-cairo",
                            "border border-transparent group-hover:border-blue-300/50 dark:group-hover:border-blue-600/50",
                            "hover:scale-105 transform transition-transform duration-200",
                            "shadow-sm group-hover:shadow-md"
                          )}
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced Mobile-First Premium Action Button */}
                  <div className={cn(
                    "flex items-center gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 lg:mt-8 font-bold transition-all duration-500",
                    "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  )}>
                    <span className="text-sm sm:text-base lg:text-lg font-black font-cairo relative">
                      المزيد
                      <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                    </span>
                    <div className={cn(
                      "relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r flex items-center justify-center transition-all duration-500",
                      service.gradient,
                      "group-hover:scale-110 sm:group-hover:scale-125 shadow-sm sm:shadow-md lg:shadow-lg",
                      "border-2 border-white/30 group-hover:border-white/50",
                      "hover:shadow-xl transform-gpu"
                    )}>
                      {/* Button Glow Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-60 blur-md transition-all duration-500",
                        service.gradient
                      )}></div>
                      
                      <ArrowLeft className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300 group-hover:scale-110" />
                      
                      {/* Rotating Ring */}
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/40 group-hover:rotate-180 transition-transform duration-1000"></div>
                    </div>
                  </div>
                </CardContent>
                
                {/* Enhanced Mobile-Responsive Corner Indicators with Multiple Effects */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 flex items-center gap-1">
                  {/* Main Indicator */}
                  <div className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-500",
                    `bg-gradient-to-r ${service.gradient}`,
                    isActive ? "scale-150 sm:scale-175 animate-pulse" : "group-hover:scale-125 sm:group-hover:scale-150",
                    `shadow-sm sm:shadow-md lg:shadow-lg shadow-${service.glowColor}`,
                    "border border-white/50"
                  )}></div>
                  
                  {/* Orbital Ring */}
                  <div className={cn(
                    "absolute w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border border-blue-400/20 opacity-0 group-hover:opacity-100 transition-all duration-1000",
                    isActive ? "animate-rotate" : "group-hover:animate-rotate"
                  )}></div>
                  
                  {/* Pulsing Background */}
                  <div className={cn(
                    "absolute w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-sm",
                    `bg-gradient-to-r ${service.gradient}`
                  )}></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Responsive Executive Call to Action */}
        <div className="text-center px-2 sm:px-4">
          <div className="relative group max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto">
            {/* Premium Animated Border Frame */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-0.5 sm:p-1">
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-rotate opacity-75" style={{ animationDuration: '12s' }}></div>
            </div>
            
            {/* Executive Glow */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 blur-lg sm:blur-xl animate-pulse opacity-70"></div>
            
            {/* Main Content Container */}
            <div className="relative bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 shadow-xl sm:shadow-2xl">
              <div className="relative p-8 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-50/95 via-white/90 to-blue-50/80 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/80 overflow-hidden">
                
                {/* Executive Background Elements */}
                <div className="absolute inset-0 opacity-30 dark:opacity-20">
                  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="executive-pattern" width="80" height="80" patternUnits="userSpaceOnUse" className="sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]">
                        <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.3" className="sm:cx-[50] sm:cy-[50] sm:r-[1.8] lg:cx-[60] lg:cy-[60] lg:r-[2]"/>
                        <path d="M 20 20 L 60 20 L 60 60 L 20 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" className="sm:d-[M 25 25 L 75 25 L 75 75 L 25 75 Z] lg:d-[M 30 30 L 90 30 L 90 90 L 30 90 Z]"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#executive-pattern)" className="text-blue-600"/>
                  </svg>
                </div>
                
                {/* Executive Badge */}
                <div className="absolute top-6 sm:top-8 lg:top-10 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full bg-gradient-to-r from-gold-400/20 to-amber-500/30 border border-gold-400/40 backdrop-blur-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-600 animate-pulse" />
                    <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300 tracking-widest uppercase font-poppins">
                      الاستشارة التنفيذية
                    </span>
                    <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gold-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                {/* Executive Content */}
                <div className="relative z-10 pt-12 sm:pt-16 space-y-6 sm:space-y-8 lg:space-y-10">
                  <div className="text-center">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-2 sm:mb-4 leading-tight font-inter">
                      هل تحتاج إلى استشارة مخصصة؟
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 lg:mb-8 font-poppins">
                      هل تحتاج لاستشارة مخصصة؟
                    </p>
                    
                    <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mx-auto mb-6 sm:mb-8 lg:mb-10 animate-shimmer"></div>
                    
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto font-medium font-inter">
                      فريقنا من الخبراء والاستشاريين المتخصصين على مستوى عالمي جاهز لمساعدتك في تحقيق رؤيتك الرقمية وتطوير أعمالك باستخدام أحدث الحلول التقنية المبتكرة والمدروسة استراتيجياً
                    </p>
                  </div>
                  
                  {/* Responsive Executive Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                    <Button 
                      size="lg"
                      className={cn(
                        "relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
                        "hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700",
                        "text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl font-poppins",
                        "shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-700 transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2",
                        "border border-white/20 backdrop-blur-lg overflow-hidden w-full sm:w-auto"
                      )}
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full skew-x-12"></div>
                      
                      <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                        <span>تواصل معنا الآن</span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="lg"
                      className={cn(
                        "relative group border-2 px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl font-poppins",
                        "border-gradient-to-r from-blue-500 to-purple-600 text-blue-600 dark:text-blue-400",
                        "hover:text-white transition-all duration-700 transform hover:scale-105",
                        "backdrop-blur-lg shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl overflow-hidden",
                        "border-blue-500/50 hover:border-transparent w-full sm:w-auto"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                        <span>مشاهدة أعمالنا</span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current"></div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Responsive Executive Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold font-cairo">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span>متاح ٢٤/٧</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                      <span>استشارة مجانية</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
                      <span>رد فوري</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Responsive Executive Corner Elements */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-6 lg:-right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-blue-600 rounded-tr-lg sm:rounded-tr-2xl animate-pulse"></div>
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-6 lg:-left-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-purple-600 rounded-bl-lg sm:rounded-bl-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Executive Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-20 sm:h-32 lg:h-40 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
    </section>
  );
};

export default OurServicesSection;