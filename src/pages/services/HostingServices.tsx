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
          
          {/* Enhanced Interactive Guarantees Section */}
          <div className="mt-20 text-center">
            <div className="mb-16">
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 mb-6 text-lg font-semibold shadow-lg animate-pulse">
                <CheckCircle className="w-5 h-5 mr-3 animate-bounce" />
                ضماناتنا المتميزة
              </Badge>
              <h3 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                التزامنا بخدمة استثنائية
              </h3>
              <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                نقدم لك ضمانات شاملة وخدمات متطورة لضمان تجربة مثالية بلا منازع
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "حماية أمنية متقدمة",
                  subtitle: "أمان شامل 24/7",
                  description: "نظام حماية متعدد الطبقات مع مراقبة مستمرة وتشفير متقدم",
                  gradient: "from-blue-500 via-blue-600 to-cyan-600",
                  bgGradient: "from-blue-50/70 via-cyan-50/50 to-blue-100/30",
                  glowColor: "blue-500/20",
                  features: [
                    { text: "SSL متقدم مجاني", icon: "🔒" },
                    { text: "جدار ناري ذكي", icon: "🛡️" },
                    { text: "مراقبة أمنية مستمرة", icon: "👁️" },
                    { text: "نسخ احتياطية آمنة", icon: "💾" }
                  ]
                },
                {
                  icon: Clock,
                  title: "دعم فني احترافي",
                  subtitle: "خبراء متاحون دائماً",
                  description: "فريق متخصص من الخبراء متاح على مدار الساعة لحل جميع استفساراتك",
                  gradient: "from-purple-500 via-purple-600 to-pink-600",
                  bgGradient: "from-purple-50/70 via-pink-50/50 to-purple-100/30",
                  glowColor: "purple-500/20",
                  features: [
                    { text: "استجابة فورية < 5 دقائق", icon: "⚡" },
                    { text: "خبراء معتمدون", icon: "🎓" },
                    { text: "دعم باللغة العربية", icon: "🇸🇦" },
                    { text: "مساعدة عن بُعد", icon: "🖥️" }
                  ]
                },
                {
                  icon: Zap,
                  title: "أداء فائق السرعة",
                  subtitle: "تقنيات متطورة",
                  description: "خوادم SSD عالية الأداء مع تقنيات تسريع متقدمة وشبكة توزيع عالمية",
                  gradient: "from-emerald-500 via-green-600 to-teal-600",
                  bgGradient: "from-emerald-50/70 via-green-50/50 to-emerald-100/30",
                  glowColor: "emerald-500/20",
                  features: [
                    { text: "خوادم SSD NVMe", icon: "💨" },
                    { text: "CDN عالمي مجاني", icon: "🌍" },
                    { text: "تحسين تلقائي", icon: "🚀" },
                    { text: "ضغط متقدم", icon: "📦" }
                  ]
                }
              ].map((guarantee, index) => (
                <div key={index} 
                     className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer overflow-hidden animate-fade-in"
                     style={{ 
                       animationDelay: `${index * 0.3}s`,
                       background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`
                     }}>
                  
                  {/* Animated Background with Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${guarantee.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
                  
                  {/* Floating Animated Elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${guarantee.gradient} rounded-full opacity-0 group-hover:opacity-10 transform rotate-45 group-hover:rotate-90 group-hover:scale-150 transition-all duration-1000`}></div>
                    <div className={`absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr ${guarantee.gradient} rounded-full opacity-0 group-hover:opacity-5 transform -rotate-45 group-hover:-rotate-90 group-hover:scale-125 transition-all duration-1000 delay-300`}></div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-${guarantee.glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-1000`}></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Enhanced Interactive Icon */}
                    <div className="relative mb-8">
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${guarantee.gradient} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl group-hover:shadow-3xl`}>
                        <guarantee.icon className="w-12 h-12 text-white group-hover:scale-125 transition-all duration-500 drop-shadow-lg" />
                        
                        {/* Rotating Border */}
                        <div className={`absolute inset-0 rounded-3xl border-4 border-transparent bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-100 animate-spin transition-opacity duration-500`} style={{ animationDuration: '3s' }}></div>
                        
                        {/* Pulse Effects */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-20 animate-pulse`}></div>
                        <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${guarantee.gradient} opacity-0 group-hover:opacity-10 animate-ping`}></div>
                      </div>
                      
                      {/* Floating Particles */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {[...Array(6)].map((_, i) => (
                          <div key={i}
                               className={`absolute w-2 h-2 bg-gradient-to-r ${guarantee.gradient} rounded-full animate-bounce`}
                               style={{
                                 left: `${20 + (i * 10)}%`,
                                 top: `${30 + (i % 2) * 40}%`,
                                 animationDelay: `${i * 0.2}s`,
                                 animationDuration: '2s'
                               }}></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="text-center mb-8">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-300">
                        {guarantee.title}
                      </h4>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${guarantee.gradient} bg-clip-text text-transparent mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                        {guarantee.subtitle}
                      </p>
                      <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                        {guarantee.description}
                      </p>
                    </div>
                    
                    {/* Interactive Features List */}
                    <div className="space-y-4 mb-8">
                      {guarantee.features.map((feature, featureIndex) => (
                        <div key={featureIndex} 
                             className="flex items-start p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 hover:bg-white/80 hover:scale-105"
                             style={{ 
                               transitionDelay: `${300 + (featureIndex * 100)}ms`,
                               animationFillMode: 'forwards'
                             }}>
                          <div className="text-xl mr-3 animate-bounce" style={{ animationDelay: `${featureIndex * 0.2}s` }}>
                            {feature.icon}
                          </div>
                          <span className="text-slate-700 font-medium text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Interactive Bottom Indicator */}
                    <div className="flex items-center justify-center">
                      <div className={`h-1 rounded-full bg-gradient-to-r ${guarantee.gradient} transition-all duration-700 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 w-20`}></div>
                    </div>
                    
                    {/* Hover Action Button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Button className={`w-full bg-gradient-to-r ${guarantee.gradient} hover:shadow-xl hover:scale-105 transition-all duration-300 text-white border-0 rounded-xl py-3`}>
                        <span className="flex items-center justify-center">
                          اكتشف المزيد
                          <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Corner Badge */}
                  <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${guarantee.gradient} rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 animate-pulse`}></div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Bottom CTA with Animation */}
            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 via-green-100/30 to-emerald-100/50 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-gradient-to-r from-white via-emerald-50/50 to-white p-8 rounded-3xl border border-emerald-200/50 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-3">ضمان استرداد الأموال</h4>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                  نثق في جودة خدمتنا لدرجة أننا نضمن لك استرداد أموالك كاملة خلال 30 يوم إذا لم تكن راضياً تماماً
                </p>
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 text-lg shadow-lg hover:scale-105 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ضمان 30 يوم
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 text-lg shadow-lg hover:scale-105 transition-transform duration-300">
                    <Clock className="w-5 h-5 mr-2" />
                    استرداد فوري
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-lg shadow-lg hover:scale-105 transition-transform duration-300">
                    <Shield className="w-5 h-5 mr-2" />
                    بدون شروط معقدة
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