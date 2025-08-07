import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { 
  Zap, 
  Cpu, 
  Cloud, 
  Shield, 
  CheckCircle, 
  Star,
  MessageCircle,
  Phone,
  Smartphone,
  Database,
  Globe,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Settings,
  Users,
  BarChart3,
  Workflow,
  Bot,
  Calendar
} from "lucide-react";
import BusinessServiceRequestForm from "@/components/BusinessServiceRequestForm";

const DigitalTransformation = () => {
  const navigate = useNavigate();
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleRequestService = () => {
    setShowServiceForm(true);
  };

  const services = [
    {
      icon: Workflow,
      title: "أتمتة العمليات",
      description: "تحويل العمليات اليدوية إلى نظم آلية ذكية",
      features: ["أتمتة سير العمل", "تقليل الأخطاء البشرية", "تسريع العمليات", "توفير التكاليف"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Database,
      title: "أنظمة الإدارة المتكاملة",
      description: "حلول ERP مخصصة لإدارة جميع موارد الشركة",
      features: ["إدارة المخزون", "المحاسبة والمالية", "إدارة العملاء", "الموارد البشرية"],
      color: "from-purple-600 to-indigo-600"
    },
    {
      icon: Smartphone,
      title: "التطبيقات المخصصة",
      description: "تطوير تطبيقات الويب والجوال حسب احتياجاتك",
      features: ["تطبيقات الجوال", "مواقع الويب", "واجهات المستخدم", "تطبيقات الأعمال"],
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Bot,
      title: "الذكاء الاصطناعي",
      description: "تطبيق حلول الذكاء الاصطناعي لتحسين الأداء",
      features: ["التحليل التنبؤي", "معالجة البيانات", "الدردشة الذكية", "التشخيص الآلي"],
      color: "from-orange-600 to-red-600"
    }
  ];

  const technologies = [
    { name: "React & Node.js", icon: Globe, description: "تطوير تطبيقات الويب الحديثة" },
    { name: "Flutter & React Native", icon: Smartphone, description: "تطبيقات الجوال متعددة المنصات" },
    { name: "AWS & Azure", icon: Cloud, description: "الحوسبة السحابية والبنية التحتية" },
    { name: "AI & Machine Learning", icon: Cpu, description: "حلول الذكاء الاصطناعي المتقدمة" },
    { name: "Blockchain", icon: Shield, description: "تقنيات البلوك تشين والأمان" },
    { name: "IoT Solutions", icon: Settings, description: "إنترنت الأشياء والأجهزة الذكية" }
  ];

  const benefits = [
    "تحسين الكفاءة التشغيلية بنسبة 60%",
    "تقليل التكاليف التشغيلية بنسبة 40%",
    "تسريع عمليات الأعمال بنسبة 70%",
    "تحسين تجربة العملاء",
    "زيادة الإنتاجية والأرباح",
    "أمان وحماية البيانات"
  ];

  const process = [
    {
      step: "01",
      title: "تحليل الوضع الحالي",
      description: "دراسة شاملة للأنظمة والعمليات الموجودة",
      duration: "1-2 أسبوع"
    },
    {
      step: "02",
      title: "وضع خطة التحول",
      description: "تصميم استراتيجية التحول الرقمي المناسبة",
      duration: "2-3 أسابيع"
    },
    {
      step: "03",
      title: "التطوير والتنفيذ",
      description: "بناء وتطوير الحلول التقنية المطلوبة",
      duration: "4-8 أسابيع"
    },
    {
      step: "04",
      title: "التدريب والتشغيل",
      description: "تدريب الفرق وضمان التشغيل السلس",
      duration: "2-4 أسابيع"
    }
  ];

  const stats = [
    { number: "200+", label: "مشروع تحول رقمي", icon: Award },
    { number: "60%", label: "تحسين الكفاءة", icon: TrendingUp },
    { number: "40%", label: "توفير في التكاليف", icon: DollarSign },
    { number: "99%", label: "معدل الرضا", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <BackButton className="mb-8" />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <Zap className="w-10 h-10 text-white" />
            </div>
            
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Cpu className="w-4 h-4 ml-2" />
              تحول رقمي متقدم
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                التحول الرقمي
              </span>
              <br />
              الشامل
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in delay-200">
              حول أعمالك إلى منظومة رقمية متطورة بأحدث التقنيات والحلول المبتكرة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
              <Button 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleRequestService}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                ابدأ التحول الرقمي
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                asChild
              >
                <a href="tel:+966555812567">
                  <Phone className="w-5 h-5 ml-2" />
                  استشارة فورية
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              <Settings className="w-4 h-4 ml-2" />
              حلولنا الرقمية
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              خدمات التحول الرقمي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              حلول تقنية شاملة لرقمنة جميع عمليات أعمالك
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
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
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

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-purple-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              التقنيات المتقدمة
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              نستخدم أحدث التقنيات العالمية في مشاريع التحول الرقمي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white group hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-purple-200 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-bold mb-2">{tech.name}</h3>
                    <p className="text-purple-100">{tech.description}</p>
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
              <Workflow className="w-4 h-4 ml-2" />
              منهجية العمل
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              خطوات التحول الرقمي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منهجية مدروسة لضمان نجاح مشروع التحول الرقمي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-2">{step.description}</p>
                <Badge className="bg-purple-100 text-purple-800">
                  <Clock className="w-4 h-4 ml-1" />
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">
                <TrendingUp className="w-4 h-4 ml-2" />
                النتائج المضمونة
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                فوائد التحول الرقمي
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نتائج حقيقية وملموسة من تطبيق حلول التحول الرقمي
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    إحصائيات النجاح
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    نتائج مشاريع التحول الرقمي
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-purple-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-purple-600 mb-2">92%</h3>
                    <p className="text-purple-700 font-medium">نجاح المشاريع في الموعد المحدد</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">18 شهر</h3>
                    <p className="text-blue-700 font-medium">متوسط فترة استرداد الاستثمار</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            ابدأ تحولك الرقمي اليوم
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto">
            لا تتأخر في مواكبة التطور التقني، ابدأ رحلة التحول الرقمي مع فريق الخبراء
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/book-consultation')}
            >
              <Calendar className="w-5 h-5 ml-2" />
              احجز استشارة مجانية
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              onClick={handleRequestService}
            >
              <Zap className="w-5 h-5 ml-2" />
              ابدأ مشروعك الآن
            </Button>
          </div>
          
          <div className="text-center text-purple-100">
            <p className="text-lg">تواصل معنا مباشرة</p>
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

      {/* Service Request Form Modal */}
      {showServiceForm && (
        <BusinessServiceRequestForm
          isOpen={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          selectedService="التحول الرقمي"
        />
      )}
    </div>
  );
};

export default DigitalTransformation;