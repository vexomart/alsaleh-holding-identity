import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Users, 
  BarChart3, 
  Target, 
  Calendar, 
  MessageCircle, 
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Camera,
  Megaphone
} from "lucide-react";
import { Link } from "react-router-dom";

const SocialMediaManagement = () => {
  const services = [
    {
      icon: Calendar,
      title: "إدارة المحتوى",
      description: "تخطيط ونشر المحتوى بشكل احترافي ومنتظم عبر جميع المنصات"
    },
    {
      icon: Camera,
      title: "إنتاج المحتوى المرئي",
      description: "تصميم وإنتاج محتوى مرئي جذاب يناسب هوية علامتك التجارية"
    },
    {
      icon: MessageCircle,
      title: "إدارة التفاعل",
      description: "الرد على التعليقات والرسائل والتفاعل مع المتابعين بشكل احترافي"
    },
    {
      icon: BarChart3,
      title: "تحليل الأداء",
      description: "تقارير مفصلة عن أداء المحتوى ومعدلات التفاعل والوصول"
    },
    {
      icon: Target,
      title: "استراتيجية المحتوى",
      description: "وضع استراتيجيات محتوى مخصصة لتحقيق أهدافك التسويقية"
    },
    {
      icon: Megaphone,
      title: "إدارة الحملات",
      description: "تصميم وإدارة حملات إعلانية مدفوعة على منصات التواصل"
    }
  ];

  const platforms = [
    { name: "إنستاجرام", color: "from-pink-500 to-purple-500", followers: "2M+" },
    { name: "تويتر", color: "from-blue-400 to-blue-600", followers: "1.5M+" },
    { name: "فيسبوك", color: "from-blue-600 to-blue-800", followers: "3M+" },
    { name: "لينكد إن", color: "from-blue-700 to-blue-900", followers: "500K+" },
    { name: "تيك توك", color: "from-black to-gray-800", followers: "800K+" },
    { name: "سناب شات", color: "from-yellow-400 to-yellow-600", followers: "1M+" }
  ];

  const packages = [
    {
      name: "الباقة الأساسية",
      price: "1,500",
      color: "from-blue-500 to-cyan-500",
      features: [
        "إدارة منصتين اجتماعيتين",
        "20 منشور شهريًا",
        "تصميم 10 منشورات مرئية",
        "رد على التعليقات",
        "تقرير شهري مبسط"
      ]
    },
    {
      name: "الباقة المتقدمة",
      price: "2,800",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "إدارة 4 منصات اجتماعية",
        "40 منشور شهريًا",
        "تصميم 25 منشور مرئي",
        "إدارة تفاعل كامل",
        "استراتيجية محتوى",
        "تقارير تفصيلية أسبوعية",
        "حملة إعلانية مجانية"
      ]
    },
    {
      name: "الباقة المؤسسية",
      price: "4,500",
      color: "from-green-500 to-emerald-500",
      features: [
        "إدارة جميع المنصات",
        "محتوى غير محدود",
        "فريق مخصص",
        "استراتيجية متقدمة",
        "إنتاج فيديو شهري",
        "إدارة الأزمات",
        "مدير حساب مخصص",
        "تقارير يومية"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 mb-6">
              <Users className="w-4 h-4 mr-2" />
              إدارة مواقع التواصل الاجتماعي
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              أطلق قوة التواصل الاجتماعي
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نساعدك في بناء حضور قوي على منصات التواصل الاجتماعي وزيادة التفاعل مع جمهورك
            </p>
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4">
                ابدأ رحلتك الرقمية
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
              خدماتنا في إدارة التواصل الاجتماعي
            </h2>
            <p className="text-muted-foreground text-lg">
              نقدم حلول شاملة لإدارة حضورك الرقمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Platforms Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              المنصات التي نديرها
            </h2>
            <p className="text-muted-foreground text-lg">
              نغطي جميع منصات التواصل الاجتماعي الرئيسية
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${platform.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.followers}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              باقات إدارة التواصل الاجتماعي
            </h2>
            <p className="text-muted-foreground text-lg">
              اختر الباقة المناسبة لنمو أعمالك
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
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground"> ريال شهريًا</span>
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
                    اشترك الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Users, number: "500+", label: "عميل نشط" },
              { icon: TrendingUp, number: "300%", label: "نمو متوسط" },
              { icon: MessageCircle, number: "1M+", label: "تفاعل شهري" },
              { icon: Award, number: "50+", label: "جائزة وتقدير" }
            ].map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز لتطوير حضورك الرقمي؟
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            ابدأ اليوم واجعل علامتك التجارية تتصدر منصات التواصل الاجتماعي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                احجز استشارة مجانية
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              شاهد أعمالنا
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialMediaManagement;