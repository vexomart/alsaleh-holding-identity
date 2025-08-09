import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import BackButton from "@/components/ui/back-button";
import BusinessServiceRequestForm from "@/components/BusinessServiceRequestForm";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Calculator, 
  CheckCircle, 
  Star,
  MessageCircle,
  Phone,
  BarChart3,
  Target,
  Shield,
  Award,
  Clock,
  FileText,
  Lightbulb,
  CreditCard,
  Banknote,
  Coins,
  Calendar
} from "lucide-react";

const FinancialPlanning = () => {
  const navigate = useNavigate();
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleRequestService = () => {
    setShowServiceForm(true);
  };

  const services = [
    {
      icon: BarChart3,
      title: "التحليل المالي الشامل",
      description: "تحليل مفصل للوضع المالي الحالي وتحديد نقاط القوة والضعف",
      features: ["تحليل البيانات المالية", "مؤشرات الأداء المالي", "تقييم السيولة", "تحليل الربحية"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Target,
      title: "إعداد الميزانيات",
      description: "تخطيط وإعداد ميزانيات مفصلة للأنشطة والمشاريع",
      features: ["ميزانية تشغيلية", "ميزانية استثمارية", "ميزانية نقدية", "تحليل الانحرافات"],
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "التنبؤات المالية",
      description: "وضع توقعات مالية دقيقة للفترات القادمة",
      features: ["توقعات الإيرادات", "تقدير التكاليف", "تحليل التدفق النقدي", "السيناريوهات المختلفة"],
      color: "from-purple-600 to-indigo-600"
    },
    {
      icon: Shield,
      title: "إدارة التدفق النقدي",
      description: "تحسين إدارة السيولة النقدية وتحسين الاستثمارات",
      features: ["تخطيط التدفق النقدي", "إدارة المدفوعات", "تحسين المقبوضات", "استثمار الفوائض"],
      color: "from-orange-600 to-red-600"
    }
  ];

  const benefits = [
    "تحسين الربحية بنسبة تصل إلى 25%",
    "تقليل التكاليف غير الضرورية",
    "تحسين إدارة التدفق النقدي",
    "اتخاذ قرارات مالية مدروسة",
    "تحقيق الأهداف المالية المحددة",
    "زيادة كفاءة استخدام الموارد"
  ];

  const process = [
    {
      step: "01",
      title: "جمع البيانات المالية",
      description: "تجميع وتحليل البيانات المالية التاريخية",
      duration: "3-5 أيام"
    },
    {
      step: "02",
      title: "التحليل والتقييم",
      description: "تحليل شامل للوضع المالي الحالي",
      duration: "1-2 أسبوع"
    },
    {
      step: "03",
      title: "وضع الخطة المالية",
      description: "تطوير استراتيجية مالية شاملة",
      duration: "1-2 أسبوع"
    },
    {
      step: "04",
      title: "المتابعة والتحديث",
      description: "مراقبة الأداء وتحديث الخطط",
      duration: "مستمر"
    }
  ];

  const stats = [
    { number: "300+", label: "خطة مالية", icon: Award },
    { number: "25%", label: "متوسط تحسين الربحية", icon: TrendingUp },
    { number: "95%", label: "دقة التنبؤات", icon: Target },
    { number: "12", label: "سنة خبرة مالية", icon: Clock }
  ];

  const tools = [
    { name: "Excel المتقدم", icon: FileText, description: "نماذج مالية متطورة" },
    { name: "Power BI", icon: BarChart3, description: "تحليل البيانات والتقارير" },
    { name: "QuickBooks", icon: Calculator, description: "أنظمة المحاسبة المتقدمة" },
    { name: "SAP Finance", icon: CreditCard, description: "إدارة مالية متكاملة" },
    { name: "Oracle Financials", icon: Banknote, description: "حلول مالية للشركات الكبيرة" },
    { name: "Sage", icon: Coins, description: "أنظمة مالية للشركات المتوسطة" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50" dir="rtl">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <BackButton className="mb-8" />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Calculator className="w-4 h-4 ml-2" />
              خدمات مالية متخصصة
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                التخطيط المالي
              </span>
              <br />
              الاحترافي
            </h1>
            
            <p className="text-xl lg:text-2xl text-green-100 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in delay-200">
              نقدم خدمات التخطيط المالي المتقدمة لتحقيق الاستقرار المالي وتحسين الأداء
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
              <Button 
                size="lg" 
                className="bg-white text-green-900 hover:bg-green-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleRequestService}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                احجز استشارة مالية
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                asChild
              >
                <a href="tel:0555812567">
                  <Phone className="w-5 h-5 ml-2" />
                  تواصل مباشر
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">
              <PieChart className="w-4 h-4 ml-2" />
              خدماتنا المالية
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              حلول التخطيط المالي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              خدمات مالية شاملة لإدارة أموالك وتحقيق أهدافك المالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-green-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              الأدوات والأنظمة المتقدمة
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              نستخدم أحدث الأدوات المالية والتقنيات المتطورة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-green-200 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-bold mb-2">{tool.name}</h3>
                    <p className="text-green-100">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Lightbulb className="w-4 h-4 ml-2" />
              منهجية العمل
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              خطوات التخطيط المالي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منهجية علمية مدروسة لضمان تحقيق أفضل النتائج المالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-2">{step.description}</p>
                <Badge className="bg-green-100 text-green-800">
                  <Clock className="w-4 h-4 ml-1" />
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">
                <TrendingUp className="w-4 h-4 ml-2" />
                الفوائد المحققة
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ما ستحققه معنا
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نتائج مالية حقيقية وملموسة من تطبيق خطط التمويل المدروسة
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    إحصائيات الأداء
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    نتائج حقيقية من عملائنا
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-green-600 mb-2">89%</h3>
                    <p className="text-green-700 font-medium">من العملاء حققوا أهدافهم المالية</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">15 شهر</h3>
                    <p className="text-blue-700 font-medium">متوسط فترة تحقيق الاستقرار المالي</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            ابدأ تخطيطك المالي اليوم
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto">
            لا تترك أموالك للصدفة، ابدأ التخطيط المالي المناسب مع خبرائنا المعتمدين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/book-consultation')}
            >
              <Calendar className="w-5 h-5 ml-2" />
              احجز استشارة مجانية
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              onClick={handleRequestService}
            >
              <DollarSign className="w-5 h-5 ml-2" />
              ابدأ التخطيط المالي
            </Button>
          </div>
          
          <div className="text-center text-green-100">
            <p className="text-lg">تواصل معنا مباشرة للحصول على استشارة مجانية</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <a href="tel:0555812567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                0555812567
              </a>
              <a href="https://wa.me/966555812567" className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
                واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      
      {/* Service Request Form Modal */}
      {showServiceForm && (
        <BusinessServiceRequestForm
          isOpen={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          selectedService="التخطيط المالي"
        />
      )}
    </div>
  );
};

export default FinancialPlanning;