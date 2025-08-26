import React, { useEffect, useRef, useState } from "react";
import { Code, Package, TrendingUp, ArrowRight, Globe, Sparkles, Zap, Star, CheckCircle, Shield, BarChart3, Users, Award, Target, Rocket, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "تطوير التطبيقات والمواقع",
    titleEn: "ENTERPRISE DEVELOPMENT",
    subtitle: "Next-Gen Digital Solutions",
    description: "نبني منصات رقمية متطورة للشركات العالمية باستخدام أحدث التقنيات وأفضل الممارسات العالمية لضمان الأداء الأمثل والقابلية للتوسع",
    icon: Code,
    primaryGradient: "from-blue-600 via-indigo-600 to-purple-700",
    secondaryGradient: "from-blue-50 to-indigo-100",
    glowColor: "blue-500/30",
    accentColor: "text-blue-600",
    bgPattern: "bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-purple-50/60",
    features: [
      "تطبيقات ويب متقدمة",
      "تطبيقات موبايل أصلية", 
      "أنظمة إدارة متكاملة",
      "واجهات برمجية آمنة"
    ],
    metrics: {
      projects: "500+",
      clients: "200+",
      satisfaction: "99%"
    },
    technologies: ["React", "Node.js", "Python", "AWS", "Docker"],
    route: "/development",
    badge: "TRENDING",
    badgeGradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "الحلول الجاهزة للشركات",
    titleEn: "READY SOLUTIONS", 
    subtitle: "Accelerate Your Growth",
    description: "مجموعة شاملة من الحلول البرمجية الجاهزة والمختبرة مسبقاً، مصممة خصيصاً لتسريع التحول الرقمي للشركات وتحقيق النتائج بسرعة قياسية",
    icon: Package,
    primaryGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    secondaryGradient: "from-emerald-50 to-teal-100",
    glowColor: "emerald-500/30",
    accentColor: "text-emerald-600",
    bgPattern: "bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-cyan-50/60",
    features: [
      "نشر فوري في 24 ساعة",
      "تخصيص كامل للعلامة التجارية",
      "دعم فني متواصل 24/7",
      "تحديثات أمنية تلقائية"
    ],
    metrics: {
      projects: "150+",
      clients: "80+", 
      satisfaction: "97%"
    },
    technologies: ["Cloud", "Kubernetes", "MongoDB", "Redis", "CI/CD"],
    route: "/ready-projects",
    badge: "POPULAR",
    badgeGradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "التسويق الرقمي المتقدم",
    titleEn: "AI-POWERED MARKETING",
    subtitle: "Data-Driven Success", 
    description: "استراتيجيات تسويقية ذكية مدعومة بالذكاء الاصطناعي وعلوم البيانات المتقدمة لتحقيق نمو استثنائي وعائد استثمار مضاعف مع تحليلات متقدمة",
    icon: TrendingUp,
    primaryGradient: "from-purple-600 via-pink-600 to-rose-700",
    secondaryGradient: "from-purple-50 to-pink-100",
    glowColor: "purple-500/30",
    accentColor: "text-purple-600",
    bgPattern: "bg-gradient-to-br from-purple-50/90 via-pink-50/70 to-rose-50/60",
    features: [
      "حملات ذكية بالذكاء الاصطناعي",
      "تحليلات متقدمة في الوقت الفعلي", 
      "استهداف دقيق متعدد المنصات",
      "تقارير أداء تفاعلية شاملة"
    ],
    metrics: {
      projects: "800+",
      clients: "300+",
      satisfaction: "98%"
    },
    technologies: ["AI/ML", "Analytics", "Automation", "CRM", "APIs"],
    route: "/digital-marketing",
    badge: "PREMIUM",
    badgeGradient: "from-purple-500 to-pink-600"
  }
];

const OurServicesSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/95 to-purple-900/90"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #1e40af 50%, #7c3aed 75%, #be185d 100%)
        `
      }}
    >
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse"></div>
        
        {/* Dynamic Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45 animate-spin" style={{ animationDuration: "20s" }}></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-white/10 rotate-12 animate-pulse"></div>
        
        {/* Particle Effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Strategic Header */}
        <div className="text-center mb-24 lg:mb-32">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-full mb-10 group hover:scale-105 transition-all duration-500">
            <Target className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="text-sm font-bold text-white/90 uppercase tracking-widest">
              STRATEGIC SERVICES
            </span>
            <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          {/* Hero Title */}
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              خدمات
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              عالمية المستوى
            </span>
          </h2>
          
          {/* Strategic Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 max-w-5xl mx-auto leading-relaxed font-light mb-12">
            نصنع المستقبل الرقمي للشركات العالمية من خلال حلول تقنية متطورة
            <br />
            <span className="text-blue-300 font-medium">مدعومة بالذكاء الاصطناعي والابتكار المستمر</span>
          </p>
          
          {/* Global Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            <div className="group cursor-pointer">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">1500+</div>
                  <div className="text-sm text-white/70">مشروع عالمي</div>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">75+</div>
                  <div className="text-sm text-white/70">دولة حول العالم</div>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">99%</div>
                  <div className="text-sm text-white/70">نسبة نجاح المشاريع</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden ${service.bgPattern} backdrop-blur-xl border border-white/20 rounded-3xl transition-all duration-700 hover:shadow-2xl hover:shadow-${service.glowColor} hover:-translate-y-6 hover:scale-[1.03] cursor-pointer animate-fade-in h-full`}
                style={{ 
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {/* Strategic Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                {/* Dynamic Border Animation */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.primaryGradient} p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-3xl"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Rocket className="w-5 h-5 text-white/50 animate-bounce" />
                </div>
                
                <CardContent className="relative z-10 p-10 lg:p-12 h-full flex flex-col">
                  {/* Strategic Header */}
                  <div className="flex justify-between items-start mb-10">
                    <Badge 
                      className={`bg-gradient-to-r ${service.badgeGradient} text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 border-0`}
                    >
                      {service.badge}
                    </Badge>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.primaryGradient} opacity-${70 - i * 20} group-hover:animate-pulse`}
                          style={{ animationDelay: `${i * 0.3}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Icon */}
                  <div className="mb-10">
                    <div className={`relative w-28 h-28 bg-gradient-to-br ${service.primaryGradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl group-hover:shadow-${service.glowColor}`}>
                      {/* Advanced Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 scale-150`}></div>
                      
                      <IconComponent className="w-14 h-14 text-white relative z-10 group-hover:animate-pulse" />
                      
                      {/* Dynamic Decorations */}
                      <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700" />
                      <Star className="absolute -bottom-3 -left-3 w-5 h-5 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700" style={{ animationDelay: "0.3s" }} />
                      <Layers className="absolute top-1/2 -right-8 w-4 h-4 text-white/30 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700" style={{ animationDelay: "0.6s" }} />
                    </div>
                  </div>

                  {/* Strategic Content */}
                  <div className="flex-1 space-y-8">
                    {/* Title Strategy */}
                    <div className="text-right space-y-4">
                      <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight group-hover:text-slate-800 transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex items-center justify-end gap-3">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                          {service.titleEn}
                        </p>
                        <Globe className="w-5 h-5 text-slate-400 group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      <p className="text-sm text-slate-400 italic font-medium bg-slate-50 px-4 py-2 rounded-lg">
                        {service.subtitle}
                      </p>
                    </div>
                    
                    {/* Strategic Description */}
                    <p className="text-slate-600 leading-relaxed text-right text-base lg:text-lg font-medium">
                      {service.description}
                    </p>
                    
                    {/* Strategic Metrics */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-white/80 to-white/60 rounded-2xl border border-white/50 backdrop-blur-sm">
                      <div className="text-center group/metric cursor-pointer">
                        <div className={`text-2xl font-black ${service.accentColor} group-hover/metric:scale-110 transition-transform duration-300`}>{service.metrics.projects}</div>
                        <div className="text-xs text-slate-500 font-medium">مشاريع</div>
                      </div>
                      <div className="text-center group/metric cursor-pointer">
                        <div className={`text-2xl font-black ${service.accentColor} group-hover/metric:scale-110 transition-transform duration-300`}>{service.metrics.clients}</div>
                        <div className="text-xs text-slate-500 font-medium">عملاء</div>
                      </div>
                      <div className="text-center group/metric cursor-pointer">
                        <div className={`text-2xl font-black ${service.accentColor} group-hover/metric:scale-110 transition-transform duration-300`}>{service.metrics.satisfaction}</div>
                        <div className="text-xs text-slate-500 font-medium">رضا</div>
                      </div>
                    </div>
                    
                    {/* Strategic Features */}
                    <div className="space-y-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-end gap-4 group/feature p-3 rounded-xl hover:bg-white/50 transition-colors duration-300">
                          <span className="text-sm text-slate-700 font-semibold">{feature}</span>
                          <CheckCircle className={`w-5 h-5 ${service.accentColor} group-hover/feature:scale-125 group-hover/feature:rotate-12 transition-all duration-300`} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Technology Stack */}
                    <div className="flex flex-wrap gap-3 justify-end">
                      {service.technologies.map((tech, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs px-3 py-1 border-slate-300 hover:border-slate-400 hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Strategic CTA */}
                  <div className="mt-10">
                    <Link to={service.route}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.primaryGradient} hover:shadow-2xl hover:shadow-${service.glowColor} text-white border-0 rounded-2xl py-6 font-bold transition-all duration-500 group-hover:scale-105 hover:scale-110 text-lg relative overflow-hidden`}
                      >
                        {/* Button Animation Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <Zap className="w-6 h-6 ml-2 animate-pulse relative z-10" />
                        <span className="mx-3 relative z-10">اكتشف الحلول المتقدمة</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Strategic Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-10 p-16 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-400 animate-pulse" />
                <h3 className="text-4xl font-black text-white">
                  مستعد لقيادة التحول الرقمي؟
                </h3>
                <Rocket className="w-8 h-8 text-purple-400 animate-bounce" />
              </div>
              <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
                انضم إلى أكثر من 1500 شركة عالمية واكتشف كيف تحول حلولنا التقنية المتطورة 
                <br />
                <span className="text-blue-300 font-semibold">رؤيتك الاستراتيجية إلى واقع رقمي مبهر يحقق نتائج استثنائية</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-6 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 text-xl font-bold group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Globe className="w-7 h-7 ml-2 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="mx-3 relative z-10">استكشف الحلول الاستراتيجية</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/50 px-16 py-6 rounded-2xl hover:shadow-xl transition-all duration-300 text-xl font-bold group"
                >
                  <Users className="w-7 h-7 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="mx-3">استشارة استراتيجية</span>
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="flex items-center gap-10 mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3 group cursor-pointer">
                <Award className="w-6 h-6 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-white/80 font-semibold">معتمد عالمياً</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <Shield className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/80 font-semibold">أمان مضمون</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <BarChart3 className="w-6 h-6 text-blue-400 group-hover:animate-pulse transition-all duration-300" />
                <span className="text-white/80 font-semibold">نتائج مثبتة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;