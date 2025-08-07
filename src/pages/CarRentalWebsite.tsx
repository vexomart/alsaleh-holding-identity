import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car,
  MapPin,
  Clock,
  Shield,
  Star,
  Users,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Calendar,
  CreditCard,
  Smartphone,
  Fuel,
  Settings
} from "lucide-react";

const CarRentalWebsite = () => {
  const features = [
    {
      icon: Car,
      title: "أسطول متنوع",
      description: "مجموعة واسعة من السيارات الحديثة لتناسب جميع الاحتياجات"
    },
    {
      icon: Shield,
      title: "تأمين شامل",
      description: "تأمين كامل على جميع السيارات لضمان راحة البال"
    },
    {
      icon: Clock,
      title: "خدمة 24/7",
      description: "دعم فني ومساعدة على مدار الساعة"
    },
    {
      icon: MapPin,
      title: "مواقع متعددة",
      description: "فروع في جميع أنحاء المملكة لسهولة الوصول"
    },
    {
      icon: CreditCard,
      title: "دفع آمن",
      description: "طرق دفع متعددة وآمنة لراحتك"
    },
    {
      icon: Smartphone,
      title: "تطبيق ذكي",
      description: "احجز وأدير حجزك من خلال التطبيق"
    }
  ];

  const carTypes = [
    {
      name: "السيارات الاقتصادية",
      description: "مثالية للاستخدام اليومي والرحلات القصيرة",
      price: "من 120 ريال/يوم",
      image: "🚗"
    },
    {
      name: "السيارات الفاخرة",
      description: "لتجربة قيادة استثنائية ومناسبات خاصة",
      price: "من 350 ريال/يوم",
      image: "🏎️"
    },
    {
      name: "السيارات العائلية",
      description: "واسعة ومريحة للعائلات والرحلات الطويلة",
      price: "من 200 ريال/يوم",
      image: "🚙"
    },
    {
      name: "السيارات الرياضية",
      description: "للمحبين السرعة والتميز",
      price: "من 500 ريال/يوم",
      image: "🏁"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      rating: 5,
      comment: "خدمة ممتازة وسيارات نظيفة. أنصح بشدة!",
      location: "الرياض"
    },
    {
      name: "فاطمة العلي",
      rating: 5,
      comment: "تجربة رائعة، الموظفون متعاونون والأسعار معقولة",
      location: "جدة"
    },
    {
      name: "محمد السعد",
      rating: 5,
      comment: "سهولة في الحجز وسرعة في التسليم",
      location: "الدمام"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">كار رنت</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-slate-700 hover:text-blue-600 transition-colors">الرئيسية</a>
              <a href="#cars" className="text-slate-700 hover:text-blue-600 transition-colors">السيارات</a>
              <a href="#services" className="text-slate-700 hover:text-blue-600 transition-colors">الخدمات</a>
              <a href="#contact" className="text-slate-700 hover:text-blue-600 transition-colors">تواصل معنا</a>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                احجز الآن
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              اكتشف المملكة مع 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> كار رنت</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              أفضل خدمات تأجير السيارات في المملكة العربية السعودية. سيارات حديثة، أسعار تنافسية، وخدمة استثنائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6">
                <Car className="w-5 h-5 ml-2" />
                احجز سيارتك الآن
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">لماذا تختار كار رنت؟</h2>
            <p className="text-xl text-slate-600">نقدم أفضل الخدمات لضمان تجربة لا تُنسى</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Car Types Section */}
      <section id="cars" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">أسطولنا من السيارات</h2>
            <p className="text-xl text-slate-600">اختر السيارة التي تناسب احتياجاتك</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carTypes.map((car, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="text-6xl text-center py-8 bg-gradient-to-br from-blue-50 to-purple-50">
                    {car.image}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{car.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{car.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{car.price}</span>
                      <Button size="sm">احجز الآن</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">ماذا يقول عملاؤنا</h2>
            <p className="text-xl text-blue-100">تجارب حقيقية من عملائنا الكرام</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">تواصل معنا</h2>
            <p className="text-xl text-slate-600">نحن هنا لخدمتك على مدار الساعة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-0 bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">هاتف</h3>
                <p className="text-slate-600">+966 11 123 4567</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">بريد إلكتروني</h3>
                <p className="text-slate-600">info@carrent.sa</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">العنوان</h3>
                <p className="text-slate-600">الرياض، المملكة العربية السعودية</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold">كار رنت</h3>
              </div>
              <p className="text-slate-300">شركة رائدة في تأجير السيارات بالمملكة العربية السعودية</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-slate-300">
                <li>تأجير السيارات اليومي</li>
                <li>تأجير السيارات الشهري</li>
                <li>سيارات الأعراس</li>
                <li>النقل التنفيذي</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط مهمة</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">الشروط والأحكام</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">أسئلة شائعة</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">دعم العملاء</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2024 كار رنت. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarRentalWebsite;