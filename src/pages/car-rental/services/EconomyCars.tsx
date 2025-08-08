import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Car,
  DollarSign,
  Fuel,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Calendar,
  Shield,
  MapPin,
  Clock,
  CreditCard,
  Settings,
  Zap,
  Heart,
  Target,
  Award
} from "lucide-react";

const EconomyCars = () => {
  const economyFeatures = [
    {
      title: 'توفير في التكلفة',
      description: 'أسعار منافسة تناسب جميع الميزانيات',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'استهلاك وقود مثالي',
      description: 'سيارات موفرة للوقود لتوفير أكبر',
      icon: Fuel,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'سهولة القيادة',
      description: 'مناسبة للقيادة داخل المدينة',
      icon: Car,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'راحة عملية',
      description: 'مقاعد مريحة لرحلاتك اليومية',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const carModels = [
    {
      name: 'تويوتا يارس',
      category: 'هاتشباك',
      image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '120 ريال/يوم',
      features: ['4-5 مقاعد', 'أوتوماتيك', '1.5L محرك', 'مكيف هواء'],
      specs: {
        passengers: 5,
        luggage: 2,
        transmission: 'أوتوماتيك',
        fuel: '6.5 ل/100كم'
      },
      rating: 4.8,
      available: true
    },
    {
      name: 'نيسان صني',
      category: 'سيدان',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '130 ريال/يوم',
      features: ['4-5 مقاعد', 'أوتوماتيك', '1.6L محرك', 'بلوتوث'],
      specs: {
        passengers: 5,
        luggage: 3,
        transmission: 'أوتوماتيك',
        fuel: '6.8 ل/100كم'
      },
      rating: 4.7,
      available: true
    },
    {
      name: 'كيا ريو',
      category: 'هاتشباك',
      image: 'https://images.unsplash.com/photo-1502161254066-6c74c6166261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '125 ريال/يوم',
      features: ['4-5 مقاعد', 'أوتوماتيك', '1.4L محرك', 'شاشة لمس'],
      specs: {
        passengers: 5,
        luggage: 2,
        transmission: 'أوتوماتيك',
        fuel: '6.2 ل/100كم'
      },
      rating: 4.9,
      available: false
    },
    {
      name: 'هيونداي أكسنت',
      category: 'سيدان',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '135 ريال/يوم',
      features: ['4-5 مقاعد', 'أوتوماتيك', '1.6L محرك', 'كاميرا خلفية'],
      specs: {
        passengers: 5,
        luggage: 3,
        transmission: 'أوتوماتيك',
        fuel: '6.9 ل/100كم'
      },
      rating: 4.6,
      available: true
    }
  ];

  const packages = [
    {
      name: 'باقة اليوم الواحد',
      price: 'من 120 ريال',
      description: 'مثالية للرحلات القصيرة والمهام اليومية',
      features: [
        'تأمين شامل مجاني',
        'كيلومترات مفتوحة داخل المدينة',
        'دعم فني 24/7',
        'استلام وإرجاع مجاني'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      name: 'باقة الأسبوع',
      price: 'من 700 ريال',
      description: 'خصم خاص للإيجار الأسبوعي',
      features: [
        'خصم 15% على السعر اليومي',
        'تنظيف مجاني وسط الأسبوع',
        'تأمين شامل متقدم',
        'خدمة استبدال السيارة'
      ],
      color: 'from-green-500 to-emerald-500',
      popular: true
    },
    {
      name: 'باقة الشهر',
      price: 'من 2800 ريال',
      description: 'الحل الأمثل للإقامة الطويلة',
      features: [
        'خصم 25% على السعر اليومي',
        'صيانة دورية مجانية',
        'استبدال إطارات عند الحاجة',
        'مدير حساب شخصي'
      ],
      color: 'from-purple-500 to-indigo-500',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental/services" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Car className="w-4 h-4 mr-1" />
                السيارات الاقتصادية
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              السيارات الاقتصادية
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed animate-fade-in">
              الخيار الأمثل للتنقل اليومي بأسعار منافسة وجودة عالية
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'أسعار تنافسية', value: 'من 120 ريال', icon: DollarSign },
                { label: 'توفير وقود', value: 'حتى 30%', icon: Fuel },
                { label: 'سيارات متاحة', value: '150+ سيارة', icon: Car },
                { label: 'تقييم العملاء', value: '4.8/5', icon: Star }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا تختار السيارات الاقتصادية؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {economyFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Car Models */}
          <h2 className="text-3xl font-bold text-center mb-12">أسطولنا من السيارات الاقتصادية</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {carModels.map((car, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                        <Badge variant="outline" className="mb-2">{car.category}</Badge>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{car.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{car.price}</div>
                        <Badge variant={car.available ? "default" : "secondary"} className="mt-1">
                          {car.available ? 'متاح' : 'محجوز'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 dark:bg-slate-700 rounded">
                        <Users className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                        <span className="text-sm">{car.specs.passengers} أشخاص</span>
                      </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-slate-700 rounded">
                        <Settings className="w-4 h-4 mx-auto mb-1 text-green-500" />
                        <span className="text-sm">{car.specs.luggage} حقائب</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {car.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                        disabled={!car.available}
                      >
                        {car.available ? 'احجز الآن' : 'غير متاح'}
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing Packages */}
          <h2 className="text-3xl font-bold text-center mb-12">باقات الأسعار</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 ${pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">الأكثر شعبية</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${pkg.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className={`w-full bg-gradient-to-r ${pkg.color} text-white border-0 hover:shadow-lg transition-all duration-300`}>
                    اختيار هذه الباقة
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">جاهز لبدء رحلتك؟</h3>
              <p className="text-lg mb-6 opacity-90">
                احجز سيارتك الاقتصادية الآن واستمتع بأفضل الأسعار
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  احجز بالهاتف: 0555812567
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="w-5 h-5 mr-2" />
                  احجز أونلاين
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <CarRentalFooter />
      </div>
    </div>
  );
};

export default EconomyCars;