import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Crown,
  Star,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Calendar,
  Settings,
  Zap,
  Award,
  Heart,
  Sparkles,
  Camera,
  Wifi,
  Navigation,
  Music
} from "lucide-react";

const LuxuryCars = () => {
  const luxuryFeatures = [
    {
      title: 'تصميم فاخر',
      description: 'مقاعد جلدية فاخرة وتشطيبات راقية',
      icon: Crown,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'أداء استثنائي',
      description: 'محركات قوية وتقنيات متطورة',
      icon: Zap,
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'تقنيات متقدمة',
      description: 'أحدث تقنيات الترفيه والأمان',
      icon: Settings,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'خدمة VIP',
      description: 'خدمة عملاء مميزة ودعم شخصي',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const luxuryCars = [
    {
      name: 'مرسيدس بنز C-Class',
      category: 'سيدان فاخرة',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '450 ريال/يوم',
      features: ['مقاعد جلدية', 'نظام صوتي Burmester', 'نظام ملاحة', 'كاميرا 360'],
      specs: {
        passengers: 5,
        luggage: 4,
        engine: '2.0L توربو',
        transmission: 'أوتوماتيك 9 سرعات'
      },
      rating: 4.9,
      available: true,
      vip: true
    },
    {
      name: 'BMW الفئة الخامسة',
      category: 'سيدان تنفيذية',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '480 ريال/يوم',
      features: ['مقاعد مدفأة', 'شاشة iDrive', 'مساعد ركن', 'إضاءة LED'],
      specs: {
        passengers: 5,
        luggage: 4,
        engine: '2.0L توربو',
        transmission: 'أوتوماتيك 8 سرعات'
      },
      rating: 4.8,
      available: true,
      vip: false
    },
    {
      name: 'أودي A6',
      category: 'سيدان رياضية',
      image: 'https://images.unsplash.com/photo-1544707845-4d0c7f04f78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '420 ريال/يوم',
      features: ['كابينة رقمية', 'نظام صوتي Bang & Olufsen', 'مقاعد رياضية', 'تحكم مناخي'],
      specs: {
        passengers: 5,
        luggage: 4,
        engine: '2.0L TFSI',
        transmission: 'أوتوماتيك 7 سرعات'
      },
      rating: 4.7,
      available: false,
      vip: false
    },
    {
      name: 'لكزس ES',
      category: 'سيدان هجينة',
      image: 'https://images.unsplash.com/photo-1549927681-0b673b922134?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '400 ريال/يوم',
      features: ['نظام هجين', 'مقاعد تدليك', 'شاشة 12.3 بوصة', 'نظام أمان LSS+'],
      specs: {
        passengers: 5,
        luggage: 4,
        engine: '2.5L هجين',
        transmission: 'CVT'
      },
      rating: 4.9,
      available: true,
      vip: true
    }
  ];

  const luxuryPackages = [
    {
      name: 'باقة الفخامة',
      price: 'من 400 ريال/يوم',
      description: 'تجربة قيادة فاخرة مع خدمات أساسية',
      features: [
        'تأمين شامل VIP',
        'خدمة التوصيل والاستلام',
        'دعم فني مخصص',
        'تنظيف داخلي وخارجي'
      ],
      color: 'from-purple-500 to-indigo-500',
      popular: false,
      icon: Crown
    },
    {
      name: 'باقة البلاتينيوم',
      price: 'من 550 ريال/يوم',
      description: 'خدمة متميزة مع مزايا إضافية',
      features: [
        'جميع مزايا باقة الفخامة',
        'سائق شخصي (4 ساعات)',
        'واي فاي مجاني',
        'مشروبات ترحيبية'
      ],
      color: 'from-amber-500 to-orange-500',
      popular: true,
      icon: Star
    },
    {
      name: 'باقة الماس',
      price: 'من 750 ريال/يوم',
      description: 'أعلى مستوى من الخدمة والفخامة',
      features: [
        'جميع مزايا باقة البلاتينيوم',
        'سائق شخصي طوال اليوم',
        'خدمة كونسيرج',
        'تنظيف يومي مجاني'
      ],
      color: 'from-cyan-500 to-blue-500',
      popular: false,
      icon: Sparkles
    }
  ];

  const luxuryTech = [
    {
      name: 'نظام الترفيه المتطور',
      description: 'شاشات عالية الدقة مع اتصال ذكي',
      icon: Music,
      features: ['شاشة تعمل باللمس', 'اتصال هاتف لاسلكي', 'نظام صوتي متقدم']
    },
    {
      name: 'أنظمة الأمان الذكية',
      description: 'تقنيات حديثة لحمايتك وراحتك',
      icon: Shield,
      features: ['مراقبة النقطة العمياء', 'فرامل طوارئ ذكية', 'مساعد البقاء في المسار']
    },
    {
      name: 'الملاحة الذكية',
      description: 'أنظمة توجيه متطورة مع معلومات مرورية',
      icon: Navigation,
      features: ['خرائط ثلاثية الأبعاد', 'تحديثات مرورية', 'نقاط اهتمام ذكية']
    },
    {
      name: 'الاتصال والراحة',
      description: 'تقنيات متصلة لتجربة أكثر راحة',
      icon: Wifi,
      features: ['واي فاي عالي السرعة', 'شحن لاسلكي', 'تحكم صوتي ذكي']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental/services" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Crown className="w-4 h-4 mr-1" />
                السيارات الفاخرة
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              السيارات الفاخرة
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed animate-fade-in">
              تجربة قيادة استثنائية مع أرقى السيارات وأعلى مستوى من الخدمة
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'أسطول فاخر', value: '50+ سيارة', icon: Crown },
                { label: 'خدمة VIP', value: '24/7', icon: Award },
                { label: 'تقييم العملاء', value: '4.9/5', icon: Star },
                { label: 'خدمة كونسيرج', value: 'متاحة', icon: Heart }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-purple-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">مميزات السيارات الفاخرة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {luxuryFeatures.map((feature, index) => (
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

          {/* Technology Section */}
          <h2 className="text-3xl font-bold text-center mb-12">التقنيات المتطورة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {luxuryTech.map((tech, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <tech.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                      <p className="text-muted-foreground mb-4">{tech.description}</p>
                      <div className="space-y-2">
                        {tech.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Car Models */}
          <h2 className="text-3xl font-bold text-center mb-12">أسطولنا من السيارات الفاخرة</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {luxuryCars.map((car, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 relative overflow-hidden">
                {car.vip && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  </div>
                )}
                
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                        <div className="text-2xl font-bold text-purple-600">{car.price}</div>
                        <Badge variant={car.available ? "default" : "secondary"} className="mt-1">
                          {car.available ? 'متاح' : 'محجوز'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-purple-50 dark:bg-slate-700 rounded">
                        <Users className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                        <span className="text-sm">{car.specs.passengers} أشخاص</span>
                      </div>
                      <div className="text-center p-2 bg-indigo-50 dark:bg-slate-700 rounded">
                        <Settings className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                        <span className="text-sm">{car.specs.luggage} حقائب</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {car.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg"
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

          {/* Luxury Packages */}
          <h2 className="text-3xl font-bold text-center mb-12">باقات الفخامة</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {luxuryPackages.map((pkg, index) => (
              <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 ${pkg.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">الأكثر اختياراً</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${pkg.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <pkg.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{pkg.price}</div>
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
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <Crown className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">استمتع بتجربة الفخامة</h3>
              <p className="text-lg mb-6 opacity-90">
                احجز سيارتك الفاخرة الآن واستمتع بقيادة استثنائية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  خدمة VIP: 0555812567
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

export default LuxuryCars;