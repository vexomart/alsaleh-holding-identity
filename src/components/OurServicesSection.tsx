import { useState, useEffect } from "react";
import { Code, Package, Megaphone, Building, PenTool, ArrowLeft, Sparkles, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "التسويق الإلكتروني",
    titleEn: "DIGITAL MARKETING",
    description: "استراتيجيات تسويقية رقمية متطورة ومدروسة لزيادة الوصول والتفاعل وتحقيق أعلى معدلات التحويل",
    icon: Megaphone,
    gradient: "from-purple-600 via-violet-700 to-purple-800",
    bgGradient: "from-purple-100/50 via-violet-50/30 to-purple-50/20",
    glowColor: "purple-500/20",
    features: ["الإعلانات الرقمية", "إدارة وسائل التواصل", "تحسين محركات البحث"]
  },
  {
    id: 2,
    title: "المشاريع الجاهزة",
    titleEn: "READY-MADE SOLUTIONS", 
    description: "حلول برمجية متكاملة وجاهزة للاستخدام الفوري، مصممة لتلبية احتياجات الشركات المختلفة بكفاءة عالية",
    icon: Package,
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    bgGradient: "from-emerald-100/50 via-green-50/30 to-teal-50/20",
    glowColor: "emerald-500/20",
    features: ["حلول سريعة", "أنظمة جاهزة", "دعم فني شامل"]
  },
  {
    id: 3,
    title: "برمجة التطبيقات والمواقع",
    titleEn: "APPLICATION & WEB DEVELOPMENT",
    description: "نقوم بتطوير تطبيقات الجوال والمواقع الإلكترونية باستخدام أحدث التقنيات العالمية والمعايير الدولية للجودة",
    icon: Code,
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    bgGradient: "from-blue-100/50 via-blue-50/30 to-indigo-50/20",
    glowColor: "blue-500/20",
    features: ["المواقع التفاعلية", "تطبيقات الموبايل", "أنظمة إدارة المحتوى"]
  }
];

const OurServicesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-emerald-400/8 to-teal-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/6 to-indigo-400/6 rounded-full blur-3xl animate-float"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-lg mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              خدماتنا المتميزة
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              خدماتنا
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            نقدم حلول تقنية متطورة ومبتكرة مصممة خصيصاً لتلبية احتياجات الشركات الحديثة
          </p>
        </div>

        {/* Mobile-First Enterprise Services Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 w-full">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isActive = hoveredCard === index;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl",
                  "border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl",
                  "transition-all duration-700 shadow-md sm:shadow-lg lg:shadow-xl",
                  isActive && "animate-pulse border-blue-400/80 dark:border-blue-500/80",
                  "animate-fade-in w-full max-w-full"
                )}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                
                <CardContent className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 w-full">
                  {/* Mobile-First Responsive Animated Icon Container with Enhanced Effects */}
                  <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 relative flex justify-center sm:justify-start">
                    {/* Pulsing Background Ring */}
                    <div className={cn(
                      "absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-xl sm:rounded-2xl lg:rounded-3xl",
                      "bg-gradient-to-br opacity-20 animate-pulse blur-lg",
                      service.gradient
                    )}></div>
                    
                     <div className={cn(
                       "relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-700",
                       "bg-gradient-to-br shadow-md sm:shadow-lg lg:shadow-xl xl:shadow-2xl transform-gpu",
                       service.gradient,
                       isActive ? "animate-icon-float scale-110" : "",
                       `shadow-${service.glowColor}`,
                       "border-2 border-white/30"
                     )}>
                       <IconComponent 
                         className={cn(
                           "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-white transition-all duration-700 filter drop-shadow-lg",
                           isActive ? "animate-bounce-slow scale-110" : ""
                         )}
                       />
                       
                       {/* Enhanced Multi-layered Glow Rings */}
                       <div className={cn(
                         "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-1000",
                         "bg-gradient-to-br blur-md sm:blur-lg lg:blur-xl",
                         service.gradient,
                         isActive && "animate-pulse opacity-40 sm:opacity-50"
                       )}></div>
                       
                       <div className={cn(
                         "absolute -inset-1 rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-1000",
                         "bg-gradient-to-br blur-2xl",
                         service.gradient,
                         "animate-pulse"
                       )}></div>
                       
                       <div className={cn(
                         "absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/20 sm:border-2 sm:border-white/30 transition-all duration-1000",
                         isActive ? "animate-rotate border-white/50" : ""
                       )}></div>
                       
                       {/* Enhanced Corner Sparkles */}
                       <Sparkles className={cn(
                         "absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 lg:-top-2 lg:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white/80 transition-all duration-500",
                         isActive ? "animate-pulse scale-125" : "opacity-0"
                       )} />
                     </div>
                  </div>

                  {/* Mobile-First Enhanced Content with Better Typography - Fully Responsive */}
                  <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 w-full">
                    {/* Enhanced Mobile-Optimized Title with Custom Typography */}
                    <div className="space-y-1 sm:space-y-1.5 lg:space-y-2 text-center sm:text-right">
                     <h3 className={cn(
                         "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black leading-tight transition-all duration-500",
                         "text-slate-800 dark:text-white",
                         "font-cairo tracking-wide break-words",
                         "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r",
                         `after:${service.gradient} after:transition-all after:duration-500`,
                         "transform transition-transform duration-300"
                       )}>
                         {service.title}
                       </h3>
                       <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-poppins tracking-wider uppercase opacity-80 transition-opacity duration-300">
                         {service.titleEn}
                       </p>
                    </div>
                    
                     <p className={cn(
                       "text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-center sm:text-right",
                       "transition-colors duration-500",
                       "font-cairo line-clamp-3 sm:line-clamp-4 lg:line-clamp-none break-words",
                       "relative pl-2 sm:pl-3 border-l-2 border-transparent transition-all duration-500"
                     )}>
                       {service.description}
                     </p>
                     
                     {/* Enhanced Mobile-Optimized Feature Tags */}
                     <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-1.5 lg:gap-2">
                       {service.features.map((feature, idx) => (
                         <span 
                           key={idx}
                           className={cn(
                             "px-1.5 sm:px-2 lg:px-2.5 xl:px-3 py-0.5 sm:py-1 text-xs font-bold rounded-full transition-all duration-300",
                             "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
                             "font-cairo",
                             "border border-transparent",
                             "shadow-sm whitespace-nowrap"
                           )}
                           style={{ animationDelay: `${idx * 0.1}s` }}
                         >
                           {feature}
                         </span>
                       ))}
                     </div>
                     
                     {/* Enhanced Mobile-First Premium Action Button - Always Visible & Fully Responsive */}
                     <div className={cn(
                       "flex items-center justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4 mt-3 sm:mt-4 md:mt-6 lg:mt-8 font-bold transition-all duration-500",
                       "text-blue-600 dark:text-blue-400",
                       "opacity-100 translate-x-0 w-full" // Always visible and positioned
                     )}>
                       <Link 
                         to={service.id === 4 ? "/enterprise-systems" : "#"} 
                         className="flex items-center gap-2 sm:gap-3 lg:gap-4"
                       >
                         <span className="text-sm sm:text-base lg:text-lg font-black font-cairo relative whitespace-nowrap">
                           المزيد
                         </span>
                         <div className={cn(
                           "relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r flex items-center justify-center transition-all duration-500 flex-shrink-0",
                           service.gradient,
                           "shadow-sm sm:shadow-md lg:shadow-lg",
                           "border-2 border-white/30",
                           "transform-gpu"
                         )}>
                           <ArrowLeft className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white transition-transform duration-300" />
                           
                           {/* Rotating Ring */}
                           <div className="absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/40 transition-transform duration-1000"></div>
                         </div>
                       </Link>
                     </div>
                  </div>
                </CardContent>
                
                {/* Enhanced Mobile-Responsive Corner Indicators with Multiple Effects */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 flex items-center gap-1">
                  {/* Main Indicator */}
                   <div className={cn(
                     "w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-500",
                     `bg-gradient-to-r ${service.gradient}`,
                     isActive ? "scale-150 sm:scale-175 animate-pulse" : "",
                     `shadow-sm sm:shadow-md lg:shadow-lg shadow-${service.glowColor}`,
                     "border border-white/50"
                   )}></div>
                   
                   {/* Orbital Ring */}
                   <div className={cn(
                     "absolute w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border border-blue-400/20 transition-all duration-1000",
                     isActive ? "animate-rotate opacity-100" : "opacity-0"
                   )}></div>
                   
                   {/* Pulsing Background */}
                   <div className={cn(
                     "absolute w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full transition-all duration-500 blur-sm opacity-0",
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