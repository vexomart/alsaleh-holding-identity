import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Search, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Globe, 
  CheckCircle,
  Star,
  Users,
  Award,
  ArrowRight,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { Link } from "react-router-dom";

const SEOServices = () => {
  const services = [
    {
      icon: Search,
      title: "تحليل الكلمات المفتاحية",
      description: "بحث وتحليل أفضل الكلمات المفتاحية لمجال عملك لتحقيق أعلى نتائج"
    },
    {
      icon: FileText,
      title: "تحسين المحتوى",
      description: "كتابة وتحسين المحتوى ليكون متوافق مع محركات البحث ومفيد للزوار"
    },
    {
      icon: LinkIcon,
      title: "بناء الروابط",
      description: "استراتيجيات احترافية لبناء روابط خلفية قوية وموثوقة"
    },
    {
      icon: BarChart3,
      title: "تحليل المنافسين",
      description: "دراسة شاملة للمنافسين واستراتيجياتهم لتحقيق تفوق تنافسي"
    },
    {
      icon: Globe,
      title: "تحسين تقني",
      description: "تحسين الجوانب التقنية للموقع لضمان سرعة التحميل وسهولة الفهرسة"
    },
    {
      icon: Target,
      title: "SEO محلي",
      description: "تحسين ظهور موقعك في نتائج البحث المحلية لجذب عملاء المنطقة"
    }
  ];

  const benefits = [
    "زيادة الزيارات العضوية بنسبة 300%",
    "تحسين ترتيب الموقع في محركات البحث",
    "زيادة معدل التحويل والمبيعات",
    "تعزيز الوعي بالعلامة التجارية",
    "عائد استثمار طويل المدى",
    "تقارير مفصلة وشفافة"
  ];

  const packages = [
    {
      name: "SEO أساسي",
      price: "2,000",
      color: "from-blue-500 to-cyan-500",
      features: [
        "تحليل SEO شامل للموقع",
        "بحث الكلمات المفتاحية",
        "تحسين 10 صفحات",
        "تحسين تقني أساسي",
        "تقرير شهري",
        "دعم فني"
      ]
    },
    {
      name: "SEO متقدم",
      price: "3,500",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "جميع ميزات الباقة الأساسية",
        "تحسين 25 صفحة",
        "بناء الروابط الخلفية",
        "تحسين محتوى شامل",
        "SEO محلي",
        "تقارير أسبوعية",
        "استشارة SEO مخصصة"
      ]
    },
    {
      name: "SEO مؤسسي",
      price: "6,000",
      color: "from-green-500 to-emerald-500",
      features: [
        "جميع الميزات السابقة",
        "تحسين غير محدود",
        "استراتيجية SEO متقدمة",
        "فريق مخصص",
        "تحليل منافسين متقدم",
        "إدارة سمعة أونلاين",
        "مدير حساب مخصص"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 mb-6">
              <Search className="w-4 h-4 mr-2" />
              تهيئة المواقع لمحركات البحث
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              تصدر نتائج البحث الأولى
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نساعدك في تحسين ترتيب موقعك في محركات البحث وزيادة الزيارات العضوية بطرق احترافية
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4">
                احصل على تحليل مجاني
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              خدمات SEO الشاملة
            </h2>
            <p className="text-muted-foreground text-lg">
              نقدم حلول متكاملة لتحسين ترتيب موقعك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              فوائد تحسين محركات البحث
            </h2>
            <p className="text-muted-foreground text-lg">
              النتائج التي ستحققها مع خدماتنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 ml-3 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              عملية العمل
            </h2>
            <p className="text-muted-foreground text-lg">
              خطوات منهجية لضمان النجاح
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "التحليل", desc: "تحليل شامل للموقع والمنافسين" },
              { step: "02", title: "الاستراتيجية", desc: "وضع خطة SEO مخصصة" },
              { step: "03", title: "التنفيذ", desc: "تطبيق التحسينات المطلوبة" },
              { step: "04", title: "المتابعة", desc: "مراقبة النتائج والتحسين المستمر" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                <p className="text-muted-foreground">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 mb-6">
              <Star className="w-4 h-4 mr-2" />
              اختر الباقة المناسبة لأهدافك
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              باقات SEO المتقدمة
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              حلول متكاملة لتحسين ترتيب موقعك في محركات البحث مع ضمان النتائج
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto items-stretch justify-center">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative group hover:scale-105 transition-all duration-500 hover:shadow-xl cursor-pointer overflow-hidden ${
                pkg.popular 
                  ? 'ring-2 ring-emerald-400 shadow-lg scale-105 bg-gradient-to-br from-white via-emerald-50 to-white transform hover:scale-110' 
                  : 'hover:shadow-md bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50'
              } animate-fade-in flex-1 lg:w-72 max-w-sm mx-auto lg:mx-0`}
              style={{ animationDelay: `${index * 0.15}s` }}>
                
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Top Indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pkg.color} transition-all duration-300 group-hover:h-2`}></div>
                
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-1 shadow-md animate-pulse text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      الأشهر
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 flex flex-col h-full relative z-10">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-slate-800 group-hover:text-slate-900 transition-colors">{pkg.name}</h3>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">{pkg.price}</span>
                      <span className="text-slate-500 mr-1 text-sm">ريال</span>
                    </div>
                    <p className="text-slate-600 text-sm">شهريًا</p>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2.5 mb-6 flex-grow">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} 
                           className="flex items-start group-hover:translate-x-1 transition-all duration-300 opacity-0 animate-fade-in"
                           style={{ 
                             animationDelay: `${(index * 0.15) + (featureIndex * 0.08)}s`,
                             animationFillMode: 'forwards'
                           }}>
                        <div className="bg-emerald-100 rounded-full p-1 ml-2 mt-0.5 group-hover:bg-emerald-200 transition-colors duration-200 flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-slate-700 leading-relaxed text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <Button className={`w-full h-10 text-sm font-semibold bg-gradient-to-r ${pkg.color} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 group-hover:shadow-xl relative overflow-hidden`}>
                      <span className="relative z-10 flex items-center justify-center">
                        ابدأ الآن
                        <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </Button>
                    
                    {pkg.popular && (
                      <p className="text-center text-xs text-emerald-600 mt-2 font-medium animate-pulse">
                        💎 الأكثر طلباً
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">ضمان النتائج</h4>
                <p className="text-slate-600 text-sm">نضمن تحسين ترتيبك أو استرداد أموالك</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">دعم مخصص</h4>
                <p className="text-slate-600 text-sm">فريق خبراء متاح لك على مدار الساعة</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">تقارير شفافة</h4>
                <p className="text-slate-600 text-sm">تقارير مفصلة ومراقبة مستمرة للنتائج</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Users, number: "400+", label: "موقع محسن" },
              { icon: TrendingUp, number: "300%", label: "زيادة متوسطة في الزيارات" },
              { icon: Target, number: "85%", label: "كلمات في الصفحة الأولى" },
              { icon: Award, number: "98%", label: "رضا العملاء" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز لتصدر نتائج البحث؟
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            احصل على تحليل مجاني لموقعك واكتشف الفرص المتاحة للتحسين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                احصل على تحليل مجاني
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              شاهد نتائجنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SEOServices;