import { useState } from "react";
import { Code, Package, Megaphone, Building, PenTool, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "برمجة التطبيقات والمواقع",
    description: "تطوير تطبيقات الجوال والمواقع الإلكترونية بأحدث التقنيات والمعايير العالمية",
    icon: Code,
    color: "from-primary to-primary-glow",
    shadowColor: "shadow-glow",
    delay: "0s"
  },
  {
    id: 2,
    title: "المشاريع الجاهزة",
    description: "حلول برمجية جاهزة ومتكاملة لتسريع إطلاق مشروعك التجاري بأقل وقت وتكلفة",
    icon: Package,
    color: "from-secondary to-secondary-light",
    shadowColor: "shadow-secondary-glow",
    delay: "0.2s"
  },
  {
    id: 3,
    title: "التسويق الإلكتروني",
    description: "استراتيجيات تسويقية متقدمة لزيادة الوصول والمبيعات عبر القنوات الرقمية",
    icon: Megaphone,
    color: "from-accent to-accent-light",
    shadowColor: "shadow-accent-glow",
    delay: "0.4s"
  },
  {
    id: 4,
    title: "أنظمة الشركات",
    description: "أنظمة إدارة متطورة لتحسين العمليات التشغيلية وزيادة كفاءة الأداء",
    icon: Building,
    color: "from-primary-variant to-accent",
    shadowColor: "shadow-glow",
    delay: "0.6s"
  },
  {
    id: 5,
    title: "صناعة المحتوى",
    description: "إنتاج محتوى إبداعي ومؤثر يعكس هوية علامتك التجارية ويجذب جمهورك المستهدف",
    icon: PenTool,
    color: "from-secondary-dark to-primary",
    shadowColor: "shadow-secondary-glow",
    delay: "0.8s"
  }
];

const OurServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50/20 to-transparent dark:from-blue-900/20 dark:via-slate-800/30 dark:to-transparent"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="corporate-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#corporate-grid)" className="text-primary/20"/>
        </svg>
      </div>
      
      {/* Corporate Floating Elements */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/5 to-blue-400/8 rounded-full blur-3xl animate-ping" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 lg:mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8 shadow-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide">خدماتنا المتميزة</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-8 leading-tight">
            خدماتنا
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
            نقدم حلول تقنية متطورة ومبتكرة تلبي احتياجات الشركات الحديثة وتحقق أهدافها الرقمية
          </p>
          
          {/* Enhanced Animated Divider */}
          <div className="flex justify-center mt-10">
            <div className="relative">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-8 h-1 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === service.id;
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50",
                  "transition-all duration-700 transform hover:scale-[1.02] hover:-translate-y-2",
                  "shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20",
                  "cursor-pointer rounded-2xl",
                  "animate-fade-in"
                )}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Enhanced Background Gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-all duration-700",
                  "from-blue-500 via-indigo-500 to-purple-600"
                )}></div>
                
                {/* Animated Corporate Border */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-all duration-500",
                  "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-px",
                  isHovered ? "opacity-100 animate-pulse" : "opacity-0"
                )}>
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl"></div>
                </div>
                
                <CardContent className="relative z-10 p-10 lg:p-12">
                  {/* Enhanced Icon Container */}
                  <div className="mb-10">
                    <div className={cn(
                      "relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-700",
                      "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500",
                      "shadow-xl shadow-blue-500/30 dark:shadow-blue-400/30",
                      "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:shadow-blue-500/40",
                      "transform-gpu"
                    )}>
                      <IconComponent 
                        className={cn(
                          "w-12 h-12 text-white transition-all duration-700",
                          "group-hover:scale-125 group-hover:rotate-12",
                          "filter drop-shadow-lg"
                        )}
                      />
                      
                      {/* Pulsing Glow Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-3xl transition-all duration-700",
                        "bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-60 blur-xl",
                        "animate-pulse"
                      )}></div>
                      
                      {/* Rotating Ring */}
                      <div className={cn(
                        "absolute inset-0 rounded-3xl border-2 border-white/30 transition-all duration-1000",
                        "group-hover:rotate-180 group-hover:scale-125"
                      )}></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <h3 className={cn(
                    "text-2xl lg:text-3xl font-bold mb-6 transition-all duration-500",
                    "text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400",
                    "leading-tight"
                  )}>
                    {service.title}
                  </h3>
                  <p className={cn(
                    "text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8",
                    "group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-500"
                  )}>
                    {service.description}
                  </p>
                  
                  {/* Enhanced Hover Action */}
                  <div className={cn(
                    "flex items-center gap-3 font-semibold transition-all duration-500",
                    "text-blue-600 dark:text-blue-400",
                    isHovered ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  )}>
                    <span className="text-lg">استكشف الخدمة</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <ArrowLeft className="w-4 h-4 text-white transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </div>
                  </div>
                </CardContent>
                
                {/* Enhanced Shine Effect */}
                <div className={cn(
                  "absolute inset-0 -translate-x-full transition-transform duration-1000 group-hover:translate-x-full",
                  "bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                )}></div>
                
                {/* Corner Decoration */}
                <div className={cn(
                  "absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-500",
                  "bg-blue-500 group-hover:bg-indigo-500 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-blue-500/50"
                )}></div>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-50/80 to-indigo-100/60 dark:from-slate-800/80 dark:to-slate-700/60 border border-blue-200/50 dark:border-slate-600/50 backdrop-blur-xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5">
              <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" className="text-blue-500"/>
              </svg>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-right flex-1">
                <h3 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-4 leading-tight">
                  هل تحتاج إلى استشارة مخصصة؟
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  تحدث معنا اليوم واكتشف كيف يمكننا مساعدتك في تحقيق رؤيتك الرقمية وتطوير أعمالك
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                    "text-white px-10 py-6 text-xl font-semibold rounded-2xl",
                    "shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40",
                    "transition-all duration-500 transform hover:scale-105",
                    "border border-blue-400/20 backdrop-blur-sm",
                    "group"
                  )}
                >
                  <span>تواصل معنا الآن</span>
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className={cn(
                    "border-2 border-blue-500/30 hover:border-blue-500/50 text-blue-600 dark:text-blue-400",
                    "px-10 py-6 text-xl font-semibold rounded-2xl",
                    "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                    "transition-all duration-300 transform hover:scale-105",
                    "backdrop-blur-sm"
                  )}
                >
                  مشاهدة أعمالنا
                </Button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default OurServicesSection;