import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { 
  Target, 
  BarChart3, 
  Users, 
  DollarSign, 
  Eye, 
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  MousePointer,
  Megaphone
} from "lucide-react";
import { Link } from "react-router-dom";

const FacebookAds = () => {
  const services = [
    {
      icon: Target,
      title: "استهداف دقيق",
      description: "استهداف الجمهور المناسب بناءً على الاهتمامات والسلوك والديموغرافيا"
    },
    {
      icon: MousePointer,
      title: "إعلانات تفاعلية",
      description: "تصميم إعلانات جذابة ومتنوعة تحقق أعلى معدلات النقر والتفاعل"
    },
    {
      icon: BarChart3,
      title: "تحليل الأداء",
      description: "مراقبة وتحليل أداء الحملات الإعلانية وتحسينها باستمرار"
    },
    {
      icon: DollarSign,
      title: "تحسين التكلفة",
      description: "إدارة الميزانية بذكاء لتحقيق أفضل عائد على الاستثمار"
    },
    {
      icon: Eye,
      title: "زيادة الوعي",
      description: "بناء الوعي بالعلامة التجارية والوصول لأكبر عدد من العملاء المحتملين"
    },
    {
      icon: Megaphone,
      title: "حملات متنوعة",
      description: "إدارة أنواع مختلفة من الحملات حسب أهدافك التسويقية"
    }
  ];

  const adTypes = [
    { name: "إعلانات الوعي", desc: "زيادة الوعي بالعلامة التجارية", color: "from-blue-500 to-cyan-500" },
    { name: "إعلانات التحويل", desc: "زيادة المبيعات والعملاء المحتملين", color: "from-green-500 to-emerald-500" },
    { name: "إعلانات التفاعل", desc: "زيادة التفاعل والمتابعين", color: "from-purple-500 to-pink-500" },
    { name: "إعلانات التطبيقات", desc: "زيادة تحميل التطبيقات", color: "from-orange-500 to-red-500" },
    { name: "إعلانات الفيديو", desc: "المحتوى المرئي الجذاب", color: "from-indigo-500 to-blue-500" },
    { name: "إعلانات إعادة الاستهداف", desc: "استهداف الزوار السابقين", color: "from-rose-500 to-pink-500" }
  ];

  const packages = [
    {
      name: "حملة أساسية",
      price: "2,500",
      budget: "5,000",
      color: "from-blue-500 to-cyan-500",
      features: [
        "إعداد حملة إعلانية واحدة",
        "استهداف أساسي للجمهور",
        "تصميم 3 إعلانات",
        "مراقبة يومية",
        "تقرير أسبوعي",
        "إدارة لمدة شهر"
      ]
    },
    {
      name: "حملة احترافية",
      price: "4,500",
      budget: "10,000",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "إعداد 3 حملات متنوعة",
        "استهداف متقدم ودقيق",
        "تصميم 8 إعلانات",
        "A/B testing",
        "إعادة استهداف",
        "تقارير تفصيلية",
        "تحسين مستمر"
      ]
    },
    {
      name: "حملة مؤسسية",
      price: "8,000",
      budget: "20,000+",
      color: "from-green-500 to-emerald-500",
      features: [
        "حملات غير محدودة",
        "استراتيجية إعلانية شاملة",
        "إعلانات مخصصة",
        "فريق مخصص",
        "تحليل منافسين",
        "إدارة الأزمات",
        "مدير حساب مخصص"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 mb-6">
              <Target className="w-4 h-4 mr-2" />
              إعلانات فيسبوك المتقدمة
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              اوصل لعملائك بدقة متناهية
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نصمم ونديم حملات فيسبوك إعلانية مستهدفة لزيادة مبيعاتك وتوسيع قاعدة عملائك
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4">
                ابدأ حملتك الإعلانية
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
              خدمات إعلانات فيسبوك
            </h2>
            <p className="text-muted-foreground text-lg">
              نقدم حلول إعلانية شاملة لتحقيق أهدافك التسويقية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Ad Types Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              أنواع الإعلانات
            </h2>
            <p className="text-muted-foreground text-lg">
              نوفر جميع أنواع الإعلانات لتحقيق أهدافك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${type.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              عملية إدارة الحملات
            </h2>
            <p className="text-muted-foreground text-lg">
              منهجية عمل احترافية لضمان نجاح حملاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "التخطيط", desc: "دراسة الهدف والجمهور المستهدف" },
              { step: "02", title: "التصميم", desc: "إنشاء إعلانات جذابة ومؤثرة" },
              { step: "03", title: "الإطلاق", desc: "تفعيل الحملات ومراقبة الأداء" },
              { step: "04", title: "التحسين", desc: "تحسين مستمر للنتائج الأفضل" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              باقات إعلانات فيسبوك
            </h2>
            <p className="text-muted-foreground text-lg">
              اختر الباقة المناسبة لحجم أعمالك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''} hover:shadow-xl transition-all`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      الأكثر طلبًا
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground"> ريال إدارة</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-lg font-semibold text-blue-600">+ {pkg.budget} ريال ميزانية إعلانية</span>
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
                    ابدأ الحملة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Target, number: "95%", label: "دقة في الاستهداف" },
              { icon: TrendingUp, number: "400%", label: "زيادة في المبيعات" },
              { icon: Users, number: "200+", label: "حملة ناجحة" },
              { icon: Award, number: "99%", label: "رضا العملاء" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز لإطلاق حملتك الإعلانية؟
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            ابدأ اليوم وشاهد نمو مبيعاتك مع حملات فيسبوك المتقدمة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                احجز استشارة مجانية
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              شاهد نتائج حملاتنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FacebookAds;