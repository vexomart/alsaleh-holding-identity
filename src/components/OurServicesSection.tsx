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

        {/* Premium Call to Action with Animated Borders */}
        <div className="text-center">
          <div className="relative group">
            {/* Animated Border Container */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 p-1 animate-pulse">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 animate-spin" style={{ animationDuration: '8s' }}></div>
            </div>
            
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-purple-400/50 blur-xl animate-pulse opacity-60"></div>
            
            {/* Main Content Container */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-1 shadow-2xl">
              <div className="relative p-16 rounded-3xl bg-gradient-to-br from-slate-50/90 via-blue-50/70 to-indigo-50/80 dark:from-slate-800/90 dark:via-slate-700/70 dark:to-slate-800/80 overflow-hidden">
                
                {/* Corporate Background Pattern */}
                <div className="absolute inset-0 opacity-20 dark:opacity-10">
                  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="premium-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
                        <circle cx="40" cy="40" r="1" fill="currentColor" opacity="0.2"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#premium-grid)" className="text-blue-600"/>
                  </svg>
                </div>
                
                {/* Floating Corporate Elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/30 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-8 left-8 w-20 h-20 bg-gradient-to-tr from-purple-400/20 to-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-indigo-300/15 to-purple-400/20 rounded-full blur-xl animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                
                {/* Premium Badge */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-400/20 to-amber-500/30 border border-gold-400/40 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300 tracking-wide">خدمة متميزة</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 pt-12">
                  <div className="text-center mb-12">
                    <h3 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
                      هل تحتاج إلى استشارة مخصصة؟
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-8 animate-pulse"></div>
                    <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl mx-auto font-medium">
                      فريقنا من الخبراء المتخصصين جاهز لمساعدتك في تحقيق رؤيتك الرقمية وتطوير أعمالك بأحدث الحلول التقنية المبتكرة
                    </p>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
                    <Button 
                      size="lg"
                      className={cn(
                        "relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
                        "hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700",
                        "text-white px-12 py-8 text-xl font-bold rounded-2xl",
                        "shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50",
                        "transition-all duration-700 transform hover:scale-110 hover:-translate-y-1",
                        "border border-white/20 backdrop-blur-sm overflow-hidden"
                      )}
                    >
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full skew-x-12"></div>
                      
                      <div className="relative flex items-center gap-3">
                        <span>تواصل معنا الآن</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="lg"
                      className={cn(
                        "relative group border-2 border-gradient-to-r from-blue-500 to-indigo-600",
                        "text-blue-600 dark:text-blue-400 hover:text-white",
                        "px-12 py-8 text-xl font-bold rounded-2xl",
                        "hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600",
                        "transition-all duration-500 transform hover:scale-105",
                        "backdrop-blur-sm shadow-lg hover:shadow-xl",
                        "border-blue-500/50 hover:border-transparent overflow-hidden"
                      )}
                    >
                      {/* Button Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative flex items-center gap-3">
                        <span>مشاهدة أعمالنا</span>
                        <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Corporate Trust Indicators */}
                  <div className="flex items-center justify-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>متاح على مدار الساعة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span>استشارة مجانية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span>رد سريع خلال دقائق</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corner Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default OurServicesSection;