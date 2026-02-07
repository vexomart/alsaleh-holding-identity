import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Camera, 
  Image, 
  Lightbulb, 
  Eye, 
  Settings, 
  CheckCircle,
  Star,
  Users,
  Award,
  ArrowRight,
  Palette,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductPhotography = () => {
  const services = [
    {
      icon: Camera,
      title: "تصوير المنتجات الاحترافي",
      description: "تصوير عالي الجودة يُبرز تفاصيل منتجاتك بأفضل شكل ممكن"
    },
    {
      icon: Lightbulb,
      title: "إضاءة احترافية",
      description: "استخدام أحدث تقنيات الإضاءة لإظهار المنتجات بشكل مثالي"
    },
    {
      icon: Palette,
      title: "تعديل وتحسين الصور",
      description: "معالجة احترافية للصور باستخدام أحدث برامج التحرير"
    },
    {
      icon: Eye,
      title: "تصوير 360 درجة",
      description: "تصوير تفاعلي يتيح للعملاء رؤية المنتج من جميع الزوايا"
    },
    {
      icon: Settings,
      title: "خلفيات متنوعة",
      description: "مجموعة واسعة من الخلفيات والإعدادات المناسبة لكل منتج"
    },
    {
      icon: Zap,
      title: "تسليم سريع",
      description: "تسليم الصور المعدلة خلال 24-48 ساعة من التصوير"
    }
  ];

  const portfolioTypes = [
    { name: "المنتجات الإلكترونية", color: "from-blue-500 to-cyan-500", samples: 50 },
    { name: "الأزياء والإكسسوارات", color: "from-pink-500 to-rose-500", samples: 80 },
    { name: "المجوهرات", color: "from-yellow-500 to-amber-500", samples: 40 },
    { name: "منتجات التجميل", color: "from-purple-500 to-pink-500", samples: 60 },
    { name: "الأثاث والديكور", color: "from-green-500 to-emerald-500", samples: 30 },
    { name: "الطعام والمشروبات", color: "from-orange-500 to-red-500", samples: 45 }
  ];

  const packages = [
    {
      name: "باقة أساسية",
      price: "800",
      photos: "10",
      color: "from-blue-500 to-cyan-500",
      features: [
        "تصوير 10 منتجات",
        "خلفية بيضاء كلاسيكية",
        "تعديل أساسي للصور",
        "دقة عالية 300 DPI",
        "تسليم خلال 48 ساعة",
        "صيغ متعددة للصور"
      ]
    },
    {
      name: "باقة احترافية",
      price: "1,500",
      photos: "20",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "تصوير 20 منتج",
        "3 خلفيات مختلفة",
        "تعديل احترافي متقدم",
        "تصوير تفصيلي للمنتج",
        "صور lifestyle إضافية",
        "تسليم خلال 24 ساعة",
        "جلسة استشارة مجانية"
      ]
    },
    {
      name: "باقة مؤسسية",
      price: "3,000",
      photos: "50+",
      color: "from-green-500 to-emerald-500",
      features: [
        "تصوير غير محدود",
        "خلفيات وإعدادات مخصصة",
        "تصوير 360 درجة",
        "فيديوهات قصيرة للمنتجات",
        "فريق تصوير مخصص",
        "خدمة تصوير بالموقع",
        "مدير مشروع مخصص"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 mb-6">
              <Camera className="w-4 h-4 mr-2" />
              تصوير المنتجات الاحترافي
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              صور تبيع منتجاتك
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نقدم خدمات تصوير احترافية للمنتجات تُبرز جمالها وتزيد من معدلات المبيعات
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4">
                احجز جلسة تصوير
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
              خدمات التصوير المتخصصة
            </h2>
            <p className="text-muted-foreground text-lg">
              نوفر حلول تصوير شاملة لجميع أنواع المنتجات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Portfolio Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              تخصصاتنا في التصوير
            </h2>
            <p className="text-muted-foreground text-lg">
              خبرة واسعة في تصوير جميع أنواع المنتجات
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {portfolioTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-4">
                  <div className={`bg-gradient-to-r ${type.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-sm font-bold mb-2">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">{type.samples}+ مشروع</p>
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
              عملية التصوير
            </h2>
            <p className="text-muted-foreground text-lg">
              خطوات منظمة لضمان أفضل النتائج
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "التخطيط", desc: "دراسة المنتجات وتحديد أسلوب التصوير" },
              { step: "02", title: "الإعداد", desc: "تجهيز الاستوديو والإضاءة والخلفيات" },
              { step: "03", title: "التصوير", desc: "تصوير احترافي من زوايا متعددة" },
              { step: "04", title: "التعديل", desc: "معالجة وتحسين الصور وتسليمها" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
              باقات التصوير
            </h2>
            <p className="text-muted-foreground text-lg">
              اختر الباقة المناسبة لاحتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-teal-500 transform scale-105' : ''} hover:shadow-xl transition-all`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-1">
                      الأكثر طلبًا
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground"> ريال</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-lg font-semibold text-teal-600">{pkg.photos} صورة</span>
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
                    احجز الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Camera, number: "2000+", label: "منتج تم تصويره" },
              { icon: Users, number: "150+", label: "عميل راض" },
              { icon: Award, number: "50+", label: "جائزة تصوير" },
              { icon: Star, number: "4.9/5", label: "تقييم العملاء" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز لتصوير منتجاتك؟
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            احجز جلسة تصوير احترافية اليوم وشاهد كيف تؤثر الصور عالية الجودة على مبيعاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                احجز استشارة مجانية
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              شاهد معرض أعمالنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPhotography;