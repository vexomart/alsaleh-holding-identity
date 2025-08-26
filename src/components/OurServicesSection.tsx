import React from "react";
import { Code, Package, TrendingUp, ArrowRight, Globe, Sparkles, Zap, Star, CheckCircle, Shield, BarChart3, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "تطوير التطبيقات والمواقع",
    titleEn: "ENTERPRISE SOFTWARE DEVELOPMENT",
    subtitle: "Solutions Built for Global Scale",
    description: "نبني حلول برمجية متطورة للشركات العالمية باستخدام أحدث التقنيات الحديثة مع ضمان الأداء والأمان والقابلية للتوسع",
    icon: Code,
    primaryColor: "from-blue-600 via-indigo-600 to-purple-700",
    accentColor: "text-blue-600",
    bgGradient: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50",
    features: [
      "تطبيقات ويب متقدمة",
      "تطبيقات موبايل أصلية", 
      "أنظمة إدارة متكاملة",
      "واجهات برمجية موثوقة"
    ],
    metrics: {
      projects: "500+",
      satisfaction: "99%",
      countries: "25+"
    },
    technologies: ["React", "Node.js", "Python", "AWS"],
    route: "/development",
    badge: "TRENDING",
    badgeColor: "bg-blue-500"
  },
  {
    id: 2,
    title: "الحلول الجاهزة للشركات",
    titleEn: "ENTERPRISE READY SOLUTIONS", 
    subtitle: "Accelerate Your Digital Journey",
    description: "مجموعة شاملة من الحلول البرمجية الجاهزة المصممة خصيصاً للشركات الطموحة التي تسعى للتحول الرقمي السريع",
    icon: Package,
    primaryColor: "from-emerald-600 via-teal-600 to-cyan-700",
    accentColor: "text-emerald-600",
    bgGradient: "bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50",
    features: [
      "نشر فوري في 24 ساعة",
      "تخصيص كامل للعلامة التجارية",
      "دعم فني متواصل",
      "تحديثات أمنية دورية"
    ],
    metrics: {
      projects: "150+",
      satisfaction: "97%", 
      countries: "20+"
    },
    technologies: ["Cloud", "Docker", "Kubernetes", "MongoDB"],
    route: "/ready-projects",
    badge: "POPULAR",
    badgeColor: "bg-emerald-500"
  },
  {
    id: 3,
    title: "التسويق الرقمي المتقدم",
    titleEn: "ADVANCED DIGITAL MARKETING",
    subtitle: "Data-Driven Growth Strategies", 
    description: "استراتيجيات تسويقية ذكية مدعومة بالذكاء الاصطناعي وتحليل البيانات لتحقيق نمو استثنائي وعائد استثمار مضمون",
    icon: TrendingUp,
    primaryColor: "from-purple-600 via-pink-600 to-rose-700",
    accentColor: "text-purple-600",
    bgGradient: "bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50",
    features: [
      "حملات ذكية مدعومة بالذكاء الاصطناعي",
      "تحليلات متقدمة في الوقت الفعلي", 
      "استهداف دقيق للجمهور",
      "تقارير أداء شاملة"
    ],
    metrics: {
      projects: "800+",
      satisfaction: "98%",
      countries: "30+"
    },
    technologies: ["Analytics", "AI/ML", "Automation", "CRM"],
    route: "/digital-marketing",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500"
  }
];

const OurServicesSection = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: "4s" }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 lg:mb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 rounded-full mb-8 group hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              PROFESSIONAL SERVICES
            </span>
            <Globe className="w-4 h-4 text-slate-500 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          {/* Main Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
            خدمات تقنية
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              عالمية المستوى
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            نقدم حلولاً تقنية متطورة ومبتكرة مع معايير الجودة العالمية
            <br />
            <span className="text-slate-500">لتحقيق التميز الرقمي والنمو المستدام</span>
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-slate-600">1000+ مشروع منجز</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              <span className="text-sm font-bold text-slate-600">50+ دولة حول العالم</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
              <span className="text-sm font-bold text-slate-600">98% نسبة الرضا</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden ${service.bgGradient} backdrop-blur-sm border border-white/20 rounded-3xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-4 hover:scale-[1.02] cursor-pointer animate-fade-in`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.primaryColor} p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-3xl"></div>
                </div>
                
                <CardContent className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <Badge 
                      className={`${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:scale-105 transition-transform duration-300`}
                    >
                      {service.badge}
                    </Badge>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryColor} opacity-${60 - i * 20} group-hover:animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-8">
                    <div className={`relative w-24 h-24 bg-gradient-to-br ${service.primaryColor} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150`}></div>
                      
                      <IconComponent className="w-12 h-12 text-white relative z-10 group-hover:animate-pulse" />
                      
                      {/* Floating Sparkles */}
                      <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-500" />
                      <Star className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    {/* Title Section */}
                    <div className="text-right">
                      <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-800 transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {service.titleEn}
                        </p>
                        <Globe className="w-4 h-4 text-slate-400 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <p className="text-sm text-slate-400 italic font-medium">
                        {service.subtitle}
                      </p>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed text-right text-sm lg:text-base">
                      {service.description}
                    </p>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-white/50 rounded-2xl border border-white/50">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${service.accentColor}`}>{service.metrics.projects}</div>
                        <div className="text-xs text-slate-500">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${service.accentColor}`}>{service.metrics.satisfaction}</div>
                        <div className="text-xs text-slate-500">رضا العملاء</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${service.accentColor}`}>{service.metrics.countries}</div>
                        <div className="text-xs text-slate-500">دولة</div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-end gap-3 group/feature">
                          <span className="text-sm text-slate-700 font-medium">{feature}</span>
                          <CheckCircle className={`w-4 h-4 ${service.accentColor} group-hover/feature:scale-125 transition-transform duration-300`} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      {service.technologies.map((tech, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs px-2 py-1 border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="mt-8">
                    <Link to={service.route}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.primaryColor} hover:shadow-xl text-white border-0 rounded-2xl py-4 font-bold transition-all duration-300 group-hover:scale-105 hover:scale-110 text-lg`}
                      >
                        <Zap className="w-5 h-5 ml-2 animate-pulse" />
                        <span className="mx-2">استكشف الخدمة</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-8 p-12 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-3xl border border-white/50 backdrop-blur-sm">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-900">
                مستعد للارتقاء بمشروعك؟
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl">
                انضم إلى أكثر من 1000 شركة حول العالم واكتشف كيف يمكن لحلولنا التقنية المتطورة أن تحول رؤيتك إلى واقع رقمي مبهر
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 hover:from-slate-900 hover:via-blue-900 hover:to-purple-900 text-white px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 text-lg font-bold group"
                >
                  <Globe className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="mx-2">استكشف جميع الخدمات</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-12 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 text-lg font-bold group"
                >
                  <Users className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="mx-2">تحدث مع خبير</span>
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-slate-600 font-medium">معتمد دولياً</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-600 font-medium">أمان مضمون</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-600 font-medium">نتائج مثبتة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;