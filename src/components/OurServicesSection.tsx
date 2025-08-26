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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-60 animate-pulse"></div>
        
        {/* Enhanced Floating Elements with Smooth Animation */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-bounce" style={{ animationDuration: "6s" }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "4s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "4s", animationDuration: "8s" }}></div>
        
        {/* Moving Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "3s" }}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: "5s" }}></div>
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

        {/* Services Grid - Three Large Beautiful Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden bg-white/95 backdrop-blur-lg border-0 rounded-2xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fade-in h-full shadow-xl hover:rotate-1"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Enhanced Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryGradient} opacity-0 group-hover:opacity-10 transition-all duration-700`}></div>
                <div className={`absolute -inset-2 bg-gradient-to-r ${service.primaryGradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700`}></div>
                
                <CardContent className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                  {/* Badge with Animation */}
                  <div className="mb-6">
                    <Badge 
                      className={`bg-gradient-to-r ${service.badgeGradient} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border-0 animate-pulse hover:animate-bounce`}
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  {/* Icon with Enhanced Animation */}
                  <div className="mb-6">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${service.primaryGradient} rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-2xl mx-auto`}>
                      <IconComponent className="w-10 h-10 text-white relative z-10 group-hover:animate-pulse" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.primaryGradient} opacity-50 blur-md rounded-2xl group-hover:animate-ping`}></div>
                    </div>
                  </div>

                  {/* Content with Better Typography */}
                  <div className="flex-1 space-y-4 text-center">
                    {/* Title with Gradient */}
                    <h3 className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${service.primaryGradient} bg-clip-text text-transparent leading-tight group-hover:scale-105 transition-transform duration-500`}>
                      {service.title}
                    </h3>
                    
                    {/* English Title with Shadow */}
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                      {service.titleEn}
                    </p>
                    
                    {/* Full Description */}
                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                      {service.description}
                    </p>
                    
                    {/* Enhanced Metrics */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors duration-500">
                      <div className="text-center">
                        <div className={`text-lg font-bold bg-gradient-to-r ${service.primaryGradient} bg-clip-text text-transparent`}>{service.metrics.projects}</div>
                        <div className="text-sm text-gray-600">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold bg-gradient-to-r ${service.primaryGradient} bg-clip-text text-transparent`}>{service.metrics.clients}</div>
                        <div className="text-sm text-gray-600">عميل</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold bg-gradient-to-r ${service.primaryGradient} bg-clip-text text-transparent`}>{service.metrics.satisfaction}</div>
                        <div className="text-sm text-gray-600">رضا</div>
                      </div>
                    </div>
                    
                    {/* All Features */}
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 100}ms` }}>
                          <CheckCircle className={`w-5 h-5 bg-gradient-to-r ${service.primaryGradient} bg-clip-text text-transparent`} />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <div className="mt-6">
                    <Link to={service.route}>
                      <Button 
                        size="lg"
                        className={`w-full bg-gradient-to-r ${service.primaryGradient} hover:shadow-2xl text-white border-0 rounded-xl py-4 font-bold text-base transition-all duration-500 group-hover:scale-105 relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                        <span className="relative z-10">اكتشف المزيد</span>
                        <ArrowRight className="w-5 h-5 mr-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
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