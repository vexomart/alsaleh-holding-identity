import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { 
  Briefcase, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  MessageCircle,
  Phone,
  BarChart3,
  Globe,
  Shield,
  Award,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
  Brain,
  PieChart
} from "lucide-react";
import BusinessServiceRequestForm from "@/components/BusinessServiceRequestForm";

const BusinessConsulting = () => {
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleRequestService = () => {
    setShowServiceForm(true);
  };

  const features = [
    {
      icon: Target,
      title: "تحليل استراتيجي شامل",
      description: "تحليل عميق للوضع الحالي وتحديد الفرص والتحديات",
      details: ["تقييم الأداء الحالي", "تحليل نقاط القوة والضعف", "دراسة البيئة التنافسية", "تحديد الفرص الاستثمارية"]
    },
    {
      icon: BarChart3,
      title: "دراسات الجدوى المتقدمة",
      description: "دراسات مالية وتقنية واقتصادية مفصلة",
      details: ["التحليل المالي المفصل", "دراسة السوق والعملاء", "تقييم المخاطر", "توقعات الربحية"]
    },
    {
      icon: Globe,
      title: "استراتيجيات التوسع",
      description: "خطط محكمة للنمو والتوسع المحلي والإقليمي",
      details: ["تطوير خطط النمو", "استراتيجيات دخول أسواق جديدة", "تحليل قنوات التوزيع", "شراكات استراتيجية"]
    },
    {
      icon: Shield,
      title: "إدارة المخاطر",
      description: "تحديد وتقييم وإدارة المخاطر بطريقة علمية",
      details: ["تحليل المخاطر المالية", "مخاطر السوق والمنافسة", "المخاطر التشغيلية", "خطط الطوارئ والبدائل"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "التقييم الأولي",
      description: "فهم عميق لأعمالك وأهدافك",
      duration: "3-5 أيام"
    },
    {
      step: "02", 
      title: "التحليل المفصل",
      description: "دراسة شاملة للوضع الحالي والسوق",
      duration: "1-2 أسبوع"
    },
    {
      step: "03",
      title: "وضع الاستراتيجية",
      description: "تطوير خطة عمل محكمة وقابلة للتنفيذ",
      duration: "1-2 أسبوع"
    },
    {
      step: "04",
      title: "التنفيذ والمتابعة",
      description: "مساعدة في التطبيق ومتابعة النتائج",
      duration: "مستمر"
    }
  ];

  const benefits = [
    "زيادة الربحية بنسبة تصل إلى 30%",
    "تحسين الكفاءة التشغيلية",
    "تقليل المخاطر المالية والتشغيلية",
    "تطوير استراتيجيات نمو مستدامة",
    "تحسين القدرة التنافسية",
    "اتخاذ قرارات مبنية على البيانات"
  ];

  const stats = [
    { number: "150+", label: "مشروع استشاري", icon: Award },
    { number: "95%", label: "معدل نجاح المشاريع", icon: TrendingUp },
    { number: "30%", label: "متوسط زيادة الأرباح", icon: DollarSign },
    { number: "15", label: "سنة خبرة", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <BackButton className="mb-8 text-white hover:text-blue-200" />
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Star className="w-4 h-4 ml-2" />
              خدمة متخصصة
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                الاستشارات التجارية
              </span>
              <br />
              المتخصصة
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in delay-200">
              نقدم استشارات تجارية احترافية لتطوير استراتيجيات الأعمال وتحسين الأداء من خلال خبراء متخصصين
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleRequestService}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                احجز استشارة مجانية
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                asChild
              >
                <a href="tel:+966555812567">
                  <Phone className="w-5 h-5 ml-2" />
                  اتصل بنا الآن
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Lightbulb className="w-4 h-4 ml-2" />
              خدماتنا المتخصصة
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ما نقدمه لك
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              حلول استشارية شاملة ومخصصة لتطوير أعمالك وتحقيق أهدافك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{detail}</span>
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

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              كيف نعمل معك
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              منهجية علمية مثبتة لضمان تحقيق النتائج المرجوة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-blue-100 leading-relaxed mb-2">{step.description}</p>
                <Badge className="bg-blue-600/20 text-blue-200 border-blue-400/30">
                  <Clock className="w-4 h-4 ml-1" />
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">
                <TrendingUp className="w-4 h-4 ml-2" />
                النتائج المتوقعة
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ما ستحققه معنا
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                نتائج ملموسة ومثبتة من تطبيق استراتيجياتنا الاستشارية
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    نتائج مثبتة
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    أرقام حقيقية من مشاريعنا السابقة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-green-600 mb-2">87%</h3>
                    <p className="text-green-700 font-medium">من عملائنا حققوا نتائج تفوق التوقعات</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">24 شهر</h3>
                    <p className="text-blue-700 font-medium">متوسط فترة تحقيق عائد على الاستثمار</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            ابدأ رحلة التطوير اليوم
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            احجز استشارة مجانية مع خبرائنا واكتشف كيف يمكننا مساعدتك في تطوير أعمالك
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-bold mb-2">تقييم مجاني</h3>
                <p className="text-blue-100">تقييم أولي لوضعك الحالي</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-bold mb-2">استراتيجية مخصصة</h3>
                <p className="text-blue-100">خطة عمل مصممة خصيصاً لك</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-bold mb-2">ضمان النتائج</h3>
                <p className="text-blue-100">نضمن تحقيق النتائج المتفق عليها</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleRequestService}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              احجز استشارة مجانية
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              asChild
            >
              <a href="https://wa.me/966555812567">
                <MessageCircle className="w-5 h-5 ml-2" />
                واتساب
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Request Form Modal */}
      {showServiceForm && (
        <BusinessServiceRequestForm
          isOpen={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          selectedService="الاستشارات التجارية"
        />
      )}
    </div>
  );
};

export default BusinessConsulting;