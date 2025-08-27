import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ArrowRight, Server, Award } from "lucide-react";

interface HostingPricingProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

const HostingPricing = ({ isYearly, setIsYearly }: HostingPricingProps) => {
  const plans = [
    {
      name: "الباقة الأساسية",
      monthlyPrice: "299",
      yearlyPrice: "2,990",
      originalYearlyPrice: "3,588",
      color: "from-blue-500 to-cyan-500",
      features: [
        "مساحة تخزين 10 جيجا",
        "نطاق ترددي 100 جيجا", 
        "قواعد بيانات MySQL غير محدودة",
        "شهادة SSL مجانية",
        "دعم فني 24/7",
        "نسخ احتياطية يومية"
      ]
    },
    {
      name: "الباقة المتقدمة",
      monthlyPrice: "599",
      yearlyPrice: "5,990",
      originalYearlyPrice: "7,188",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "مساحة تخزين 50 جيجا",
        "نطاق ترددي غير محدود",
        "قواعد بيانات متقدمة",
        "شهادة SSL متقدمة",
        "CDN مجاني",
        "حماية DDoS",
        "دعم أولوية عالية"
      ]
    },
    {
      name: "الباقة المؤسسية",
      monthlyPrice: "999",
      yearlyPrice: "9,990",
      originalYearlyPrice: "11,988",
      color: "from-green-500 to-emerald-500",
      features: [
        "مساحة تخزين غير محدودة",
        "موارد مخصصة",
        "خوادم افتراضية خاصة",
        "أمان متقدم",
        "مدير حساب مخصص",
        "SLA 99.9%",
        "نسخ احتياطية متعددة"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 mb-6">
            <Star className="w-4 h-4 mr-2" />
            اختر الباقة المناسبة لاحتياجاتك
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            باقات الاستضافة المتقدمة
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            حلول استضافة موثوقة مع أعلى معايير الأمان والأداء
          </p>
        </div>
        
        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg border border-slate-200">
            <div className="flex items-center">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isYearly 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isYearly 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                سنوي
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 mr-2 animate-pulse">
                  وفر 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative group hover:scale-105 transition-all duration-500 hover:shadow-xl cursor-pointer overflow-hidden ${
              plan.popular 
                ? 'ring-2 ring-purple-400 shadow-lg scale-105 bg-gradient-to-br from-white via-purple-50 to-white transform hover:scale-110' 
                : 'hover:shadow-md bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50'
            } animate-fade-in h-full`}
            style={{ animationDelay: `${index * 0.15}s` }}>
              
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Top Indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${plan.color} transition-all duration-300 group-hover:h-2`}></div>
              
              {plan.popular && (
                <>
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-2 shadow-lg animate-bounce text-sm font-bold rounded-full">
                      <Award className="w-4 h-4 mr-2" />
                      الأكثر شعبية
                    </Badge>
                  </div>
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
                      🔥
                    </div>
                  </div>
                </>
              )}
              
              <CardContent className="p-6 flex flex-col h-full relative z-10 min-h-[460px]">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-slate-900 transition-colors">{plan.name}</h3>
                </div>
                
                {/* Price */}
                <div className="text-center mb-6">
                  {isYearly && (
                    <div className="mb-1">
                      <span className="text-sm text-slate-400 line-through">{plan.originalYearlyPrice} ريال</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-500 mr-2 text-base">ريال</span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    {isYearly ? 'سنويًا' : 'شهريًا'}
                    {isYearly && (
                      <span className="block text-green-600 font-medium mt-1">
                        وفر {Math.round(((parseInt(plan.originalYearlyPrice.replace(',', '')) - parseInt(plan.yearlyPrice.replace(',', ''))) / parseInt(plan.originalYearlyPrice.replace(',', ''))) * 100)}% سنويًا
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Features */}
                <div className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} 
                         className="flex items-start group-hover:translate-x-1 transition-all duration-300 opacity-0 animate-fade-in"
                         style={{ 
                           animationDelay: `${(index * 0.15) + (featureIndex * 0.08)}s`,
                           animationFillMode: 'forwards'
                         }}>
                      <div className="bg-emerald-100 rounded-full p-1 ml-3 mt-1 group-hover:bg-emerald-200 transition-colors duration-200 flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 leading-relaxed text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <div className="mt-auto pt-4">
                  <Button className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${plan.color} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 group-hover:shadow-xl relative overflow-hidden`}>
                    <span className="relative z-10 flex items-center justify-center">
                      اشترك الآن
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                  
                  {plan.popular && (
                    <p className="text-center text-xs text-purple-600 mt-3 font-medium animate-pulse">
                      💎 الأكثر طلباً من عملائنا
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostingPricing;