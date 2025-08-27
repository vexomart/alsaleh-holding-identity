import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Clock, Zap, ArrowRight } from "lucide-react";

const HostingGuarantees = () => {
  return (
    <div className="mt-16 text-center">
      <div className="mb-12">
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 mb-4">
          <CheckCircle className="w-4 h-4 mr-2" />
          ضماناتنا المتميزة
        </Badge>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">التزامنا بخدمة استثنائية</h3>
        <p className="text-slate-600">نقدم لك ضمانات شاملة وخدمات متطورة</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[
          {
            icon: Shield,
            title: "حماية متقدمة",
            description: "أمان شامل مع مراقبة مستمرة",
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50/50 to-cyan-50/30",
            features: ["SSL مجاني", "جدار ناري", "مراقبة 24/7"]
          },
          {
            icon: Clock,
            title: "دعم فني مستمر",
            description: "فريق خبراء متاح دائماً",
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50/50 to-pink-50/30",
            features: ["استجابة سريعة", "خبراء معتمدون", "دعم عربي"]
          },
          {
            icon: Zap,
            title: "أداء فائق",
            description: "سرعة وموثوقية عالية",
            gradient: "from-emerald-500 to-green-500",
            bgGradient: "from-emerald-50/50 to-green-50/30",
            features: ["خوادم SSD", "CDN مجاني", "تحسين تلقائي"]
          }
        ].map((guarantee, index) => (
          <div key={index} 
               className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden animate-fade-in"
               style={{ animationDelay: `${index * 0.2}s` }}>
            
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${guarantee.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Floating Elements */}
            <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${guarantee.gradient} rounded-full opacity-0 group-hover:opacity-10 transform rotate-45 group-hover:rotate-90 group-hover:scale-125 transition-all duration-700`}></div>
            <div className={`absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr ${guarantee.gradient} rounded-full opacity-0 group-hover:opacity-5 transform -rotate-45 group-hover:-rotate-90 group-hover:scale-110 transition-all duration-700`}></div>
            
            <div className="relative z-10">
              {/* Compact Interactive Icon */}
              <div className="relative mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${guarantee.gradient} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <guarantee.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-30 animate-pulse`}></div>
                </div>
                
                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} 
                     style={{ 
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor'
                     }}></div>
              </div>
              
              {/* Compact Content */}
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                  {guarantee.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">
                  {guarantee.description}
                </p>
              </div>
              
              {/* Compact Features List */}
              <div className="space-y-2">
                {guarantee.features.map((feature, featureIndex) => (
                  <div key={featureIndex} 
                       className="flex items-center text-xs text-slate-600 group-hover:text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                       style={{ transitionDelay: `${featureIndex * 0.1}s` }}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${guarantee.gradient} mr-2 opacity-0 group-hover:opacity-100 animate-pulse`}></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* Compact Hover Indicator */}
              <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className={`w-6 h-0.5 rounded-full bg-gradient-to-r ${guarantee.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Compact Bottom CTA */}
      <div className="mt-12 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <h4 className="text-sm font-bold text-slate-800">ضمان استرداد الأموال</h4>
              <p className="text-xs text-slate-600">30 يوم بدون شروط معقدة</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs">
              ضمان شامل
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs">
              استرداد فوري
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostingGuarantees;