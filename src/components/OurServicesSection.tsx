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
    <section className="relative py-24 lg:py-36 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-inter">
      {/* Premium Corporate Background */}
      <div className="absolute inset-0">
        {/* Geometric Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="enterprise-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="50" cy="50" r="1.5" fill="currentColor" opacity="0.4"/>
              <path d="M 25 25 L 75 25 L 75 75 L 25 75 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#enterprise-grid)" className="text-blue-600 dark:text-blue-400"/>
        </svg>
        
        {/* Floating Corporate Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-indigo-600/12 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/8 to-pink-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-300/6 to-blue-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Corporate Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-200/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Enterprise-Level Header */}
        <div className="text-center mb-20 lg:mb-28 animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-lg mb-10 shadow-lg">
            <div className="relative flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300 tracking-wider uppercase font-poppins">
                Elite Services Portfolio
              </span>
              <Star className="w-4 h-4 text-gold-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Multilingual Heading */}
          <div className="space-y-4 mb-8">
            <h2 className="text-6xl lg:text-8xl font-black font-inter tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                خدماتنا
              </span>
            </h2>
            <p className="text-2xl lg:text-3xl font-bold text-slate-500 dark:text-slate-400 font-poppins tracking-wide">
              Our Premium Services
            </p>
          </div>
          
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed font-medium font-inter">
            نقدم حلول تقنية متطورة ومبتكرة على مستوى عالمي، مصممة خصيصاً لتلبية احتياجات الشركات الحديثة وتحقيق أهدافها الرقمية الطموحة
          </p>
          
          {/* Animated Corporate Divider */}
          <div className="flex justify-center mt-12">
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enterprise Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === service.id;
            const isActive = activeAnimation === index;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl",
                  "border border-slate-200/60 dark:border-slate-700/60 rounded-3xl",
                  "transition-all duration-700 transform hover:scale-[1.03] hover:-translate-y-3",
                  "shadow-xl hover:shadow-2xl cursor-pointer",
                  isHovered && `hover:shadow-${service.glowColor.split('/')[0]}-500/20`,
                  isActive && "animate-pulse",
                  "animate-fade-in"
                )}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Premium Background Gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-all duration-1000",
                  service.bgGradient
                )}></div>
                
                {/* Animated Corporate Border */}
                <div className={cn(
                  "absolute inset-0 rounded-3xl transition-all duration-700",
                  "bg-gradient-to-r p-px opacity-0 group-hover:opacity-100",
                  service.gradient
                )}>
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-3xl"></div>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full skew-x-12 rounded-3xl"></div>
                
                <CardContent className="relative z-10 p-10 lg:p-12">
                  {/* Animated Icon Container */}
                  <div className="mb-10">
                    <div className={cn(
                      "relative w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-700",
                      "bg-gradient-to-br shadow-2xl transform-gpu",
                      service.gradient,
                      isActive ? "animate-icon-float" : "group-hover:animate-icon-pulse",
                      "group-hover:scale-110 group-hover:rotate-3",
                      `shadow-${service.glowColor}`
                    )}>
                      <IconComponent 
                        className={cn(
                          "w-14 h-14 text-white transition-all duration-700 filter drop-shadow-lg",
                          isActive ? "animate-bounce-slow" : "group-hover:scale-125",
                          "group-hover:rotate-12"
                        )}
                      />
                      
                      {/* Auto-rotating glow rings */}
                      <div className={cn(
                        "absolute inset-0 rounded-3xl transition-all duration-1000",
                        "bg-gradient-to-br opacity-0 group-hover:opacity-60 blur-xl",
                        service.gradient,
                        isActive && "animate-pulse opacity-40"
                      )}></div>
                      
                      <div className={cn(
                        "absolute inset-0 rounded-3xl border-2 border-white/30 transition-all duration-1000",
                        isActive ? "animate-rotate" : "group-hover:rotate-180 group-hover:scale-125"
                      )}></div>
                      
                      {/* Corner sparkles */}
                      <Sparkles className={cn(
                        "absolute -top-2 -right-2 w-5 h-5 text-white/80 transition-all duration-500",
                        isActive ? "animate-pulse" : "opacity-0 group-hover:opacity-100"
                      )} />
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="space-y-6">
                    {/* Bilingual Title */}
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-2xl lg:text-3xl font-black leading-tight transition-all duration-500 font-inter",
                        "text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      )}>
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-poppins tracking-wide uppercase">
                        {service.titleEn}
                      </p>
                    </div>
                    
                    <p className={cn(
                      "text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium",
                      "group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500 font-inter"
                    )}>
                      {service.description}
                    </p>
                    
                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className={cn(
                            "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300",
                            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
                            "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20",
                            "group-hover:text-blue-600 dark:group-hover:text-blue-400 font-poppins"
                          )}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Premium Action Button */}
                  <div className={cn(
                    "flex items-center gap-4 mt-8 font-bold transition-all duration-500",
                    "text-blue-600 dark:text-blue-400",
                    isHovered ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  )}>
                    <span className="text-lg font-poppins">Explore Service</span>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-r flex items-center justify-center transition-all duration-300",
                      service.gradient,
                      "group-hover:scale-110 shadow-lg"
                    )}>
                      <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
                
                {/* Corner Indicators */}
                <div className={cn(
                  "absolute top-6 right-6 w-3 h-3 rounded-full transition-all duration-500",
                  `bg-gradient-to-r ${service.gradient}`,
                  isActive ? "scale-150 animate-pulse" : "group-hover:scale-125",
                  `shadow-lg shadow-${service.glowColor}`
                )}></div>
              </Card>
            );
          })}
        </div>

        {/* Executive Call to Action */}
        <div className="text-center">
          <div className="relative group max-w-6xl mx-auto">
            {/* Premium Animated Border Frame */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-rotate opacity-75" style={{ animationDuration: '12s' }}></div>
            </div>
            
            {/* Executive Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 blur-xl animate-pulse opacity-70"></div>
            
            {/* Main Content Container */}
            <div className="relative bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-3xl p-1 shadow-2xl">
              <div className="relative p-16 lg:p-20 rounded-3xl bg-gradient-to-br from-slate-50/95 via-white/90 to-blue-50/80 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/80 overflow-hidden">
                
                {/* Executive Background Elements */}
                <div className="absolute inset-0 opacity-30 dark:opacity-20">
                  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="executive-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                        <circle cx="60" cy="60" r="2" fill="currentColor" opacity="0.3"/>
                        <path d="M 30 30 L 90 30 L 90 90 L 30 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#executive-pattern)" className="text-blue-600"/>
                  </svg>
                </div>
                
                {/* Executive Badge */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400/20 to-amber-500/30 border border-gold-400/40 backdrop-blur-lg">
                    <Star className="w-5 h-5 text-amber-600 animate-pulse" />
                    <span className="text-sm font-black text-amber-700 dark:text-amber-300 tracking-widest uppercase font-poppins">
                      Executive Consultation
                    </span>
                    <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                {/* Executive Content */}
                <div className="relative z-10 pt-16 space-y-10">
                  <div className="text-center">
                    <h3 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 leading-tight font-inter">
                      هل تحتاج إلى استشارة مخصصة؟
                    </h3>
                    <p className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-8 font-poppins">
                      Need a Custom Consultation?
                    </p>
                    
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mx-auto mb-10 animate-shimmer"></div>
                    
                    <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-5xl mx-auto font-medium font-inter">
                      فريقنا من الخبراء والاستشاريين المتخصصين على مستوى عالمي جاهز لمساعدتك في تحقيق رؤيتك الرقمية وتطوير أعمالك باستخدام أحدث الحلول التقنية المبتكرة والمدروسة استراتيجياً
                    </p>
                  </div>
                  
                  {/* Executive Action Buttons */}
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    <Button 
                      size="lg"
                      className={cn(
                        "relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
                        "hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700",
                        "text-white px-16 py-8 text-xl font-black rounded-3xl font-poppins",
                        "shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-2",
                        "border border-white/20 backdrop-blur-lg overflow-hidden"
                      )}
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full skew-x-12"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <span>Contact Us Now</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="lg"
                      className={cn(
                        "relative group border-2 px-16 py-8 text-xl font-black rounded-3xl font-poppins",
                        "border-gradient-to-r from-blue-500 to-purple-600 text-blue-600 dark:text-blue-400",
                        "hover:text-white transition-all duration-700 transform hover:scale-105",
                        "backdrop-blur-lg shadow-xl hover:shadow-2xl overflow-hidden",
                        "border-blue-500/50 hover:border-transparent"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <span>View Portfolio</span>
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180">
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Executive Trust Indicators */}
                  <div className="flex items-center justify-center gap-12 text-slate-500 dark:text-slate-400 text-sm font-bold font-poppins">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span>24/7 Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span>Free Consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span>Instant Response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Executive Corner Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-purple-600 rounded-bl-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Executive Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
    </section>
  );
};

export default OurServicesSection;