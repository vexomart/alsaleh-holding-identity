import React from "react";
import { Code, Package, Megaphone, ArrowLeft, Globe, PenTool } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "برمجة التطبيقات والمواقع",
    titleEn: "APPLICATION & WEB DEVELOPMENT",
    description: "نقوم بتطوير تطبيقات الجوال والمواقع الإلكترونية باستخدام أحدث التقنيات العالمية والمعايير الدولية للجودة",
    icon: Code,
    iconBg: "bg-gradient-to-br from-red-100 to-pink-100",
    cardBg: "bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50",
    iconColor: "text-red-600",
    features: ["المواقع التفاعلية", "تطبيقات الموبايل", "أنظمة إدارة المحتوى"],
    route: "/services/web-development"
  },
  {
    id: 2,
    title: "المشاريع الجاهزة", 
    titleEn: "READY-MADE SOLUTIONS",
    description: "حلول برمجية متكاملة وجاهزة للاستخدام الفوري، مصممة لتلبية احتياجات الشركات المختلفة بكفاءة عالية",
    icon: Package,
    iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
    cardBg: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50",
    iconColor: "text-green-600",
    features: ["حلول سريعة", "أنظمة جاهزة", "دعم فني شامل"],
    route: "/ready-projects"
  },
  {
    id: 3,
    title: "التسويق الإلكتروني",
    titleEn: "DIGITAL MARKETING", 
    description: "استراتيجيات تسويقية رقمية متطورة ومدروسة لزيادة الوصول والتفاعل وتحقيق أعلى معدلات التحويل",
    icon: Megaphone,
    iconBg: "bg-gradient-to-br from-purple-100 to-violet-100",
    cardBg: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50",
    iconColor: "text-purple-600",
    features: ["الإعلانات الرقمية", "إدارة وسائل التواصل", "تحسين محركات البحث"],
    route: "/digital-marketing"
  }
];

const OurServicesSection = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* خلفية بسيطة وأنيقة */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>
      
      {/* المحتوى */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            خدماتنا
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم حلولاً تقنية متطورة ومبتكرة لتلبية احتياجات الشركات الحديثة وتحقيق أهدافها الرقمية
          </p>
        </div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden ${service.cardBg} border-2 rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:scale-105`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* دائرة ملونة في الزاوية اليمنى العلوية */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br from-current to-transparent"></div>
                
                <CardContent className="relative z-10 p-8 h-full flex flex-col">
                  {/* الأيقونة */}
                  <div className="mb-8">
                    <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                  </div>

                  {/* المحتوى */}
                  <div className="flex-1 space-y-4">
                    {/* العنوان */}
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {service.titleEn}
                      </p>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-gray-600 leading-relaxed text-right line-clamp-4">
                      {service.description}
                    </p>
                    
                    {/* الميزات */}
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-end gap-2">
                          <span className="text-sm text-gray-700">{feature}</span>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* زر المزيد */}
                  <div className="mt-8">
                    <Link to={service.route}>
                      <Button 
                        variant="outline"
                        className="w-full group/btn bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all duration-300"
                      >
                        <span className="mr-2">المزيد</span>
                        <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link to="/services">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="mr-2">استكشف جميع خدماتنا</span>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;