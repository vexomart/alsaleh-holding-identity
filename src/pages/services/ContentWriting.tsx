import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  FileEdit, 
  PenTool, 
  Search, 
  Target, 
  Users, 
  CheckCircle,
  Star,
  Globe,
  Award,
  ArrowRight,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const ContentWriting = () => {
  const services = [
    {
      icon: FileEdit,
      title: "كتابة المحتوى التسويقي",
      description: "محتوى إبداعي يجذب العملاء ويحفزهم على اتخاذ إجراء"
    },
    {
      icon: Search,
      title: "محتوى متوافق مع SEO",
      description: "كتابة محتوى محسن لمحركات البحث لزيادة الظهور"
    },
    {
      icon: Globe,
      title: "المحتوى المحلي والعربي",
      description: "محتوى يناسب الثقافة المحلية والجمهور العربي"
    },
    {
      icon: MessageCircle,
      title: "محتوى وسائل التواصل",
      description: "منشورات جذابة لجميع منصات التواصل الاجتماعي"
    },
    {
      icon: BookOpen,
      title: "المقالات المتخصصة",
      description: "مقالات تقنية ومهنية بأعلى معايير الجودة"
    },
    {
      icon: Target,
      title: "استراتيجية المحتوى",
      description: "خطط محتوى مدروسة لتحقيق أهدافك التسويقية"
    }
  ];

  const contentTypes = [
    { name: "مقالات المدونات", samples: "200+", color: "from-blue-500 to-cyan-500" },
    { name: "محتوى المواقع", samples: "150+", color: "from-green-500 to-emerald-500" },
    { name: "النشرات الإخبارية", samples: "100+", color: "from-purple-500 to-pink-500" },
    { name: "محتوى المنتجات", samples: "300+", color: "from-orange-500 to-red-500" },
    { name: "السيناريوهات", samples: "80+", color: "from-indigo-500 to-blue-500" },
    { name: "المحتوى التقني", samples: "120+", color: "from-teal-500 to-cyan-500" }
  ];

  const packages = [
    {
      name: "باقة المحتوى الأساسي",
      price: "1,200",
      words: "5,000",
      color: "from-blue-500 to-cyan-500",
      features: [
        "5000 كلمة شهريًا",
        "4 مقالات متوسطة",
        "بحث كلمات مفتاحية أساسي",
        "مراجعة واحدة لكل مقال",
        "تسليم خلال 5 أيام عمل",
        "دعم عبر البريد الإلكتروني"
      ]
    },
    {
      name: "باقة المحتوى المتقدم",
      price: "2,200",
      words: "10,000",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "10000 كلمة شهريًا",
        "8 مقالات متنوعة",
        "بحث متقدم للكلمات المفتاحية",
        "تحسين SEO شامل",
        "مراجعتان لكل مقال",
        "محتوى وسائل التواصل",
        "استشارة استراتيجية"
      ]
    },
    {
      name: "باقة المحتوى المؤسسي",
      price: "4,000",
      words: "25,000+",
      color: "from-green-500 to-emerald-500",
      features: [
        "محتوى غير محدود",
        "فريق كتابة مخصص",
        "استراتيجية محتوى شاملة",
        "تحليل أداء المحتوى",
        "مراجعات غير محدودة",
        "محتوى متعدد اللغات",
        "مدير محتوى مخصص"
      ]
    }
  ];

  const industries = [
    "التقنية والبرمجيات",
    "التجارة الإلكترونية", 
    "الصحة والطب",
    "التعليم والتدريب",
    "السياحة والسفر",
    "العقارات والاستثمار",
    "الأزياء والتجميل",
    "الطعام والمطاعم"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 mb-6">
              <FileEdit className="w-4 h-4 mr-2" />
              كتابة المحتوى الإبداعي
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              كلمات تصنع الفارق
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نكتب محتوى إبداعي ومؤثر يحكي قصة علامتك التجارية ويجذب جمهورك المستهدف
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4">
                اطلب محتوى مخصص
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
              خدمات كتابة المحتوى
            </h2>
            <p className="text-muted-foreground text-lg">
              نقدم محتوى متميز لجميع احتياجاتك التسويقية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Content Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              أنواع المحتوى التي نكتبها
            </h2>
            <p className="text-muted-foreground text-lg">
              خبرة واسعة في كتابة جميع أنواع المحتوى
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {contentTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-4">
                  <div className={`bg-gradient-to-r ${type.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <PenTool className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-sm font-bold mb-2">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">{type.samples} مشروع</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              القطاعات التي نخدمها
            </h2>
            <p className="text-muted-foreground text-lg">
              خبرة متخصصة في مختلف المجالات
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow text-center"
              >
                <div className="text-sm font-medium text-emerald-600">{industry}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              عملية كتابة المحتوى
            </h2>
            <p className="text-muted-foreground text-lg">
              منهجية مدروسة لضمان جودة المحتوى
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", title: "البحث", desc: "دراسة الجمهور والمنافسين" },
              { step: "02", title: "التخطيط", desc: "وضع استراتيجية المحتوى" },
              { step: "03", title: "الكتابة", desc: "إنتاج محتوى إبداعي" },
              { step: "04", title: "المراجعة", desc: "تدقيق وتحسين النص" },
              { step: "05", title: "التسليم", desc: "تسليم المحتوى النهائي" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {process.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              باقات كتابة المحتوى
            </h2>
            <p className="text-muted-foreground text-lg">
              اختر الباقة المناسبة لاحتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-emerald-500 transform scale-105' : ''} hover:shadow-xl transition-all`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-1">
                      الأكثر طلبًا
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground"> ريال شهريًا</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-lg font-semibold text-emerald-600">{pkg.words} كلمة</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-right">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90`}>
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-green-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: FileEdit, number: "1000+", label: "مقال منشور" },
              { icon: Users, number: "200+", label: "عميل راض" },
              { icon: Globe, number: "15", label: "مجال متخصص" },
              { icon: Award, number: "99%", label: "رضا العملاء" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز لإنشاء محتوى مؤثر؟
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            ابدأ اليوم واحصل على محتوى إبداعي يحكي قصة علامتك التجارية بطريقة مؤثرة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                احجز استشارة مجانية
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              شاهد عينات من أعمالنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentWriting;