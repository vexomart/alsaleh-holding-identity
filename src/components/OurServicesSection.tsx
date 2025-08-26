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
    <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              خدماتنا المتميزة
            </span>
            <Globe className="w-4 h-4 text-slate-500" />
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            حلول تقنية متطورة
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              لنجاح أعمالك
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            نقدم حلولاً تقنية مبتكرة ومتخصصة لتحقيق أهدافك الرقمية
            <br />
            <span className="text-slate-500">مع ضمان الجودة والكفاءة العالية</span>
          </p>
        </div>

        {/* Services Grid - Responsive and Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden ${service.bgPattern} backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer animate-fade-in h-full`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardContent className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <Badge 
                      className={`bg-gradient-to-r ${service.badgeGradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 border-0`}
                    >
                      {service.badge}
                    </Badge>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryGradient} opacity-${60 - i * 20} group-hover:animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Icon - Smaller Size */}
                  <div className="mb-6">
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${service.primaryGradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white relative z-10" />
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title Section */}
                    <div className="text-right">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                        {service.title}
                      </h3>
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {service.titleEn}
                        </p>
                        <Globe className="w-3 h-3 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        {service.subtitle}
                      </p>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed text-right text-sm">
                      {service.description}
                    </p>
                    
                    {/* Metrics - Compact */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="text-center">
                        <div className={`text-sm font-bold ${service.accentColor}`}>{service.metrics.projects}</div>
                        <div className="text-xs text-slate-500">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-bold ${service.accentColor}`}>{service.metrics.clients}</div>
                        <div className="text-xs text-slate-500">عميل</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-bold ${service.accentColor}`}>{service.metrics.satisfaction}</div>
                        <div className="text-xs text-slate-500">رضا</div>
                      </div>
                    </div>
                    
                    {/* Features - Compact */}
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-end gap-2 text-sm">
                          <span className="text-slate-700 font-medium">{feature}</span>
                          <CheckCircle className={`w-4 h-4 ${service.accentColor}`} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 justify-end">
                      {service.technologies.map((tech, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs px-2 py-1 border-slate-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="mt-6">
                    <Link to={service.route}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.primaryGradient} hover:shadow-lg text-white border-0 rounded-xl py-3 font-bold transition-all duration-300 group-hover:scale-105 text-sm`}
                      >
                        <Zap className="w-4 h-4 ml-2" />
                        <span className="mx-2">اكتشف الخدمة</span>
                        <ArrowRight className="w-4 h-4" />
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
          <div className="inline-flex flex-col items-center gap-6 p-8 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-white/50 backdrop-blur-sm max-w-4xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                مستعد لبدء مشروعك؟
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl">
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
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold group"
                >
                  <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="mx-2">تحدث معنا</span>
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-8 mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-slate-600 font-medium">معتمد عالمياً</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-slate-600 font-medium">أمان مضمون</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-slate-600 font-medium">نتائج مثبتة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;