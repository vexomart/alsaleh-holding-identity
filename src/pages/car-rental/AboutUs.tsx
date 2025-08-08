import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarRentalFooter from "@/components/CarRentalFooter";
import BackButton from "@/components/ui/back-button";
import { 
  Award, 
  Users, 
  Car, 
  Shield, 
  Star, 
  Target,
  Heart,
  Globe,
  CheckCircle,
  TrendingUp
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { number: "25,000+", label: "عميل راضٍ", icon: Users, color: "from-blue-500 to-blue-600" },
    { number: "1,200+", label: "سيارة متاحة", icon: Car, color: "from-green-500 to-green-600" },
    { number: "50+", label: "مدينة نخدمها", icon: Globe, color: "from-purple-500 to-purple-600" },
    { number: "12", label: "سنوات خبرة", icon: Award, color: "from-orange-500 to-orange-600" }
  ];

  const values = [
    {
      icon: Shield,
      title: "الأمان أولاً",
      description: "نضع سلامة عملائنا في المقدمة مع أعلى معايير الأمان والتأمين الشامل"
    },
    {
      icon: Star,
      title: "الجودة المتميزة",
      description: "نحرص على تقديم أفضل مستوى جودة في السيارات والخدمات"
    },
    {
      icon: Heart,
      title: "الاهتمام بالعميل",
      description: "نؤمن بأن رضا العميل هو أساس نجاحنا ونسعى لتحقيقه دائماً"
    },
    {
      icon: TrendingUp,
      title: "التطوير المستمر",
      description: "نستثمر في التكنولوجيا والابتكار لتحسين خدماتنا باستمرار"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BackButton />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2 animate-fade-in">
              <Target className="w-4 h-4 ml-1" />
              من نحن
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              كار رنت برو
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
              رواد تأجير السيارات في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-4xl font-bold text-slate-900">قصتنا</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  بدأت كار رنت برو عام 2012 برؤية واضحة: تقديم خدمة تأجير سيارات متميزة ومبتكرة في المملكة العربية السعودية. 
                  منذ ذلك الحين، نمونا لنصبح من أكبر شركات تأجير السيارات في المنطقة.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  نفخر بخدمة أكثر من 25,000 عميل وتوفير أسطول يضم أكثر من 1,200 سيارة حديثة ومتنوعة. 
                  التزامنا بالجودة والأمان جعلنا الخيار الأول للعديد من العملاء في جميع أنحاء المملكة.
                </p>
              </div>
              
              <div className="relative animate-scale-in">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                  alt="مقر الشركة"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in">
              أرقام تعكس التزامنا بالتميز والجودة في خدمة عملائنا
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center group hover:scale-110 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 animate-fade-in">
              قيمنا ومبادئنا
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-fade-in">
              القيم التي توجه عملنا وتحدد طريقة تعاملنا مع عملائنا وشركائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {value.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="group hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  رؤيتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-600 leading-relaxed">
                  أن نكون الشركة الرائدة في مجال تأجير السيارات في الشرق الأوسط، 
                  ونقدم تجربة استثنائية لعملائنا من خلال الابتكار والتميز في الخدمة.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  مهمتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-600 leading-relaxed">
                  تقديم خدمات تأجير سيارات موثوقة وآمنة ومبتكرة، 
                  مع الحرص على تحقيق أعلى مستويات رضا العملاء والمساهمة في تنمية المجتمع.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            انضم إلى عائلة كار رنت برو
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            اكتشف الفرق معنا واستمتع بتجربة تأجير سيارات لا تُنسى
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 shadow-2xl"
              asChild
            >
              <a href="/car-rental-landing">
                <Car className="w-6 h-6 ml-2" />
                استكشف خدماتنا
              </a>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all text-lg px-8 py-6 backdrop-blur-sm"
              asChild
            >
              <a href="/car-rental/contact">
                <Users className="w-6 h-6 ml-2" />
                تواصل معنا
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <CarRentalFooter />
    </div>
  );
};

export default AboutUs;