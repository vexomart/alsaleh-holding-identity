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

const HostingServices = () => {
  const plans = [
    {
      name: "الباقة الأساسية",
      price: "299",
      period: "شهريًا",
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
      price: "599",
      period: "شهريًا",
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
      price: "999",
      period: "شهريًا", 
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              باقات الاستضافة
            </h2>
            <p className="text-muted-foreground text-lg">
              اختر الباقة المناسبة لاحتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''} hover:shadow-xl transition-all`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> ريال {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}>
                    اشترك الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
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