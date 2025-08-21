import React from "react";
import { Code, Package, Megaphone, ArrowRight, Globe, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "برمجة التطبيقات والمواقع",
    titleEn: "APPLICATION & WEB DEVELOPMENT",
    description: "نقوم بتطوير تطبيقات الجوال والمواقع الإلكترونية باستخدام أحدث التقنيات العالمية والمعايير الدولية للجودة مع فريق من المطورين المحترفين",
    icon: Code,
    primaryColor: "from-blue-600 to-indigo-700",
    secondaryColor: "from-blue-50 to-indigo-100",
    accentColor: "text-blue-600",
    bgPattern: "bg-gradient-to-br from-blue-50/80 to-indigo-100/60",
    features: ["المواقع التفاعلية", "تطبيقات الموبايل", "أنظمة إدارة المحتوى", "واجهات برمجية متقدمة"],
    route: "/services/web-development",
    stats: "200+ مشروع"
  },
  {
    id: 2,
    title: "المشاريع الجاهزة", 
    titleEn: "READY-MADE SOLUTIONS",
    description: "حلول برمجية متكاملة وجاهزة للاستخدام الفوري، مصممة لتلبية احتياجات الشركات المختلفة بكفاءة عالية وبأعلى معايير الجودة العالمية",
    icon: Package,
    primaryColor: "from-emerald-600 to-teal-700",
    secondaryColor: "from-emerald-50 to-teal-100",
    accentColor: "text-emerald-600",
    bgPattern: "bg-gradient-to-br from-emerald-50/80 to-teal-100/60",
    features: ["حلول سريعة", "أنظمة جاهزة", "دعم فني شامل", "تكامل سهل"],
    route: "/ready-projects",
    stats: "50+ حل جاهز"
  },
  {
    id: 3,
    title: "التسويق الإلكتروني",
    titleEn: "DIGITAL MARKETING", 
    description: "استراتيجيات تسويقية رقمية متطورة ومدروسة لزيادة الوصول والتفاعل وتحقيق أعلى معدلات التحويل مع تحليلات متقدمة للأداء",
    icon: Megaphone,
    primaryColor: "from-purple-600 to-pink-700",
    secondaryColor: "from-purple-50 to-pink-100",
    accentColor: "text-purple-600",
    bgPattern: "bg-gradient-to-br from-purple-50/80 to-pink-100/60",
    features: ["الإعلانات الرقمية", "إدارة وسائل التواصل", "تحسين محركات البحث", "تحليلات الأداء"],
    route: "/digital-marketing",
    stats: "300+ حملة"
  }
];

const OurServicesSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* خلفية هندسية احترافية */}
      <div className="absolute inset-0 overflow-hidden">
        {/* شبكة هندسية */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* عناصر هندسية متحركة */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {/* خطوط هندسية */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="rgb(147 51 234)" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M0,400 Q300,200 600,300 T1200,250" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
          <path d="M0,500 Q400,350 800,400 T1200,350" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">خدماتنا المتميزة</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            حلول تقنية عالمية
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            نقدم حلولاً تقنية متطورة ومبتكرة مع معايير الجودة العالمية لتلبية احتياجات الشركات الحديثة وتحقيق التميز الرقمي
          </p>
        </div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden ${service.bgPattern} backdrop-blur-sm border-0 rounded-3xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] cursor-pointer`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* تأثير الإضاءة */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* حدود متدرجة */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.primaryColor} p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className="w-full h-full bg-white rounded-3xl"></div>
                </div>
                
                <CardContent className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                  {/* الإحصائية */}
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-xs font-bold ${service.accentColor} bg-white px-3 py-1 rounded-full shadow-sm`}>
                      {service.stats}
                    </span>
                    <div className="flex gap-1">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryColor} opacity-60`}></div>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryColor} opacity-40`}></div>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryColor} opacity-20`}></div>
                    </div>
                  </div>

                  {/* الأيقونة */}
                  <div className="mb-8">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${service.primaryColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      {/* تأثير الوهج */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.primaryColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                      
                      <IconComponent className="w-10 h-10 text-white relative z-10 group-hover:animate-pulse" />
                      
                      {/* نجوم متحركة */}
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-500" />
                    </div>
                  </div>

                  {/* المحتوى */}
                  <div className="flex-1 space-y-6">
                    {/* العنوان */}
                    <div className="text-right">
                      <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-800 transition-colors">
                        {service.title}
                      </h3>
                      <div className="flex items-center justify-end gap-2 mb-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {service.titleEn}
                        </p>
                        <Globe className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-slate-600 leading-relaxed text-right text-sm lg:text-base">
                      {service.description}
                    </p>
                    
                    {/* الميزات */}
                    <div className="grid grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-end gap-2 group/feature">
                          <span className="text-xs lg:text-sm text-slate-700 font-medium">{feature}</span>
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.primaryColor} group-hover/feature:scale-125 transition-transform duration-300`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* زر المزيد */}
                  <div className="mt-8">
                    <Link to={service.route}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.primaryColor} hover:shadow-lg text-white border-0 rounded-xl py-3 font-semibold transition-all duration-300 group-hover:scale-105`}
                      >
                        <span className="ml-2">اكتشف المزيد</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col items-center gap-6">
            <p className="text-lg text-slate-600 font-medium">
              هل تريد استكشاف المزيد من حلولنا التقنية؟
            </p>
            <Link to="/services">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 hover:from-slate-900 hover:via-blue-900 hover:to-purple-900 text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 text-lg font-bold group"
              >
                <Globe className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="mx-2">استكشف جميع خدماتنا العالمية</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;