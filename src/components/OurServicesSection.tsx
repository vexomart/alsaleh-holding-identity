import React, { useEffect, useRef, useState } from "react";
import { Code, Package, TrendingUp, ArrowRight, Globe, Sparkles, Zap, Star, CheckCircle, Shield, BarChart3, Users, Award, Target, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "تطوير التطبيقات والمواقع",
    titleEn: "DEVELOPMENT",
    subtitle: "حلول تقنية متطورة",
    description: "نصمم ونطور تطبيقات ومواقع إلكترونية متقدمة باستخدام أحدث التقنيات العالمية",
    icon: Code,
    primaryGradient: "from-blue-500 to-indigo-600",
    glowColor: "blue-500/20",
    accentColor: "text-blue-600",
    bgPattern: "bg-gradient-to-br from-blue-50/80 to-indigo-50/60",
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
    technologies: ["React", "Node.js", "Python", "AWS"],
    route: "/development",
    badge: "الأكثر طلباً",
    badgeGradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "الحلول الجاهزة",
    titleEn: "READY SOLUTIONS", 
    subtitle: "نشر سريع وفعال",
    description: "حلول برمجية جاهزة ومختبرة لتسريع نمو أعمالك الرقمية",
    icon: Package,
    primaryGradient: "from-emerald-500 to-teal-600",
    glowColor: "emerald-500/20",
    accentColor: "text-emerald-600",
    bgPattern: "bg-gradient-to-br from-emerald-50/80 to-teal-50/60",
    features: [
      "نشر فوري في 24 ساعة",
      "تخصيص العلامة التجارية",
      "دعم فني 24/7",
      "تحديثات تلقائية"
    ],
    metrics: {
      projects: "150+",
      clients: "80+", 
      satisfaction: "97%"
    },
    technologies: ["Cloud", "Docker", "MongoDB", "APIs"],
    route: "/ready-projects",
    badge: "الأكثر شعبية",
    badgeGradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "التسويق الرقمي",
    titleEn: "DIGITAL MARKETING",
    subtitle: "نمو مدعوم بالذكاء الاصطناعي", 
    description: "استراتيجيات تسويقية ذكية لزيادة المبيعات وتحقيق أعلى عائد استثمار",
    icon: TrendingUp,
    primaryGradient: "from-purple-500 to-pink-600",
    glowColor: "purple-500/20",
    accentColor: "text-purple-600",
    bgPattern: "bg-gradient-to-br from-purple-50/80 to-pink-50/60",
    features: [
      "حملات ذكية بالذكاء الاصطناعي",
      "تحليلات متقدمة", 
      "استهداف دقيق",
      "تقارير شاملة"
    ],
    metrics: {
      projects: "800+",
      clients: "300+",
      satisfaction: "98%"
    },
    technologies: ["AI/ML", "Analytics", "Automation", "CRM"],
    route: "/digital-marketing",
    badge: "الأحدث",
    badgeGradient: "from-purple-500 to-pink-600"
  }
];

const OurServicesSection = () => {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section - Compact */}
        <div className="text-center mb-8 lg:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border border-cyan-300/30 rounded-full mb-6 hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              خدماتنا المتميزة
            </span>
          </div>
          
          {/* Main Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4 leading-tight">
            حلول تقنية متطورة
          </h2>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            نقدم حلولاً تقنية مبتكرة ومتخصصة لتحقيق أهدافك الرقمية
          </p>
        </div>

        {/* Services Grid - Small Cards Side by Side */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 hover:scale-105 cursor-pointer animate-fade-in h-full"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardContent className="relative z-10 p-3 lg:p-4 h-full flex flex-col text-center">
                  {/* Badge */}
                  <div className="mb-3">
                    <Badge 
                      className={`bg-gradient-to-r ${service.badgeGradient} text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm border-0`}
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  {/* Icon - Very Small */}
                  <div className="mb-3">
                    <div className={`relative w-12 h-12 bg-gradient-to-br ${service.primaryGradient} rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white relative z-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    {/* Title */}
                    <h3 className="text-sm lg:text-base font-bold text-white leading-tight">
                      {service.title}
                    </h3>
                    
                    {/* English Title */}
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {service.titleEn}
                    </p>
                    
                    {/* Description - Short */}
                    <p className="text-gray-200 text-xs leading-relaxed">
                      {service.description.substring(0, 50)}...
                    </p>
                    
                    {/* Metrics - Very Compact */}
                    <div className="grid grid-cols-1 gap-1 p-2 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-center">
                        <div className="text-xs font-bold text-cyan-300">{service.metrics.projects}</div>
                        <div className="text-xs text-gray-300">مشروع</div>
                      </div>
                    </div>
                    
                    {/* Features - Only 2 */}
                    <div className="space-y-1">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-1 text-xs">
                          <CheckCircle className="w-3 h-3 text-cyan-400" />
                          <span className="text-gray-200 font-medium truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button - Small */}
                  <div className="mt-3">
                    <Link to={service.route}>
                      <Button 
                        size="sm"
                        className={`w-full bg-gradient-to-r ${service.primaryGradient} hover:shadow-md text-white border-0 rounded-lg py-2 font-bold transition-all duration-300 text-xs`}
                      >
                        <span>اكتشف</span>
                        <ArrowRight className="w-3 h-3 mr-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section - Compact */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-6 p-8 bg-gradient-to-r from-white/10 to-cyan-500/10 rounded-2xl border border-white/20 backdrop-blur-md max-w-4xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                مستعد لبدء مشروعك؟
              </h3>
              <p className="text-lg text-gray-200 max-w-2xl">
                انضم إلى أكثر من 1000 عميل واكتشف كيف يمكن لحلولنا تحويل فكرتك إلى واقع رقمي ناجح
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold group"
                >
                  <Globe className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="mx-2">استكشف جميع الخدمات</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/30 hover:border-white/50 text-white hover:text-white bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold group"
                >
                  <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="mx-2">تحدث معنا</span>
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-8 mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-200 font-medium">معتمد عالمياً</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-200 font-medium">أمان مضمون</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-200 font-medium">نتائج مثبتة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;