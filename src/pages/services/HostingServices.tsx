import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Globe, 
  Shield, 
  Zap, 
  Server, 
  Clock, 
  CheckCircle,
  Star,
  Users,
  Award,
  ArrowRight,
  Database,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HostingServices = () => {
  const [isYearly, setIsYearly] = useState(false);

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

  const features = [
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة ضد التهديدات السيبرانية والبرمجيات الخبيثة"
    },
    {
      icon: Zap,
      title: "أداء فائق",
      description: "خوادم SSD عالية السرعة مع تقنيات التسريع المتقدمة"
    },
    {
      icon: Clock,
      title: "وقت تشغيل 99.9%",
      description: "ضمان استمرارية الخدمة مع اتفاقية مستوى الخدمة"
    },
    {
      icon: Database,
      title: "قواعد بيانات متطورة",
      description: "دعم جميع أنواع قواعد البيانات مع إدارة محترفة"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 mb-6">
              <Globe className="w-4 h-4 mr-2" />
              استضافة المواقع الإلكترونية
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              استضافة احترافية وموثوقة
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              خدمات استضافة متطورة مع أعلى معايير الأمان والأداء لضمان تشغيل موقعك بسلاسة
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4">
                احصل على استشارة مجانية
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              لماذا تختار استضافتنا؟
            </h2>
            <p className="text-muted-foreground text-lg">
              نوفر لك أفضل تجربة استضافة مع ميزات متقدمة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
          
          {/* Compact Interactive Guarantees Section */}
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, number: "5000+", label: "عميل راض" },
              { icon: Server, number: "99.9%", label: "وقت تشغيل" },
              { icon: Award, number: "24/7", label: "دعم فني" },
              { icon: Lock, number: "100%", label: "حماية آمنة" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            جاهز لبدء موقعك؟
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            احصل على أفضل خدمات الاستضافة مع دعم فني متخصص
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                تواصل معنا الآن
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              عرض الباقات
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HostingServices;