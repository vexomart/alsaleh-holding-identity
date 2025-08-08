import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Users,
  Baby,
  Shield,
  Heart,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Calendar,
  Settings,
  MapPin,
  Clock,
  Car,
  Award,
  Sparkles,
  Camera,
  Wifi,
  Navigation,
  Gamepad2,
  Volume2,
  AirVent,
  Snowflake,
  Sun,
  Coffee,
  Home,
  Target,
  TrendingUp
} from "lucide-react";

const FamilyCars = () => {
  const familyFeatures = [
    {
      title: 'مساحة واسعة للعائلة',
      description: 'مقاعد مريحة تتسع حتى 8 أشخاص',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      stats: 'حتى 8 مقاعد'
    },
    {
      title: 'أمان متقدم للأطفال',
      description: 'أنظمة حماية خاصة بالأطفال',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      stats: '5 نجوم أمان'
    },
    {
      title: 'ترفيه للجميع',
      description: 'شاشات ونظم ترفيه متطورة',
      icon: Gamepad2,
      color: 'from-purple-500 to-indigo-500',
      stats: 'شاشات متعددة'
    },
    {
      title: 'رحلات مريحة',
      description: 'تقنيات راحة متقدمة للرحلات الطويلة',
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      stats: 'راحة قصوى'
    }
  ];

  const familyCars = [
    {
      name: 'تويوتا هايلاندر',
      category: 'SUV عائلية متوسطة',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '280 ريال/يوم',
      features: ['8 مقاعد', 'نظام ترفيه خلفي', 'كاميرا 360', 'تحكم مناخي ثلاثي'],
      specs: {
        passengers: 8,
        luggage: 6,
        fuelType: 'بنزين/هجين',
        transmission: 'أوتوماتيك'
      },
      safety: {
        airbags: 10,
        childSeats: 3,
        blindSpot: true,
        emergencyBrake: true
      },
      comfort: {
        screens: 3,
        usbPorts: 8,
        cupHolders: 12,
        climate: 'ثلاثي المناطق'
      },
      rating: 4.8,
      available: true,
      familyFriendly: true,
      isPopular: true
    },
    {
      name: 'هوندا أوديسي',
      category: 'مينيفان فاخرة',
      image: 'https://images.unsplash.com/photo-1544707845-4d0c7f04f78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '320 ريال/يوم',
      features: ['أبواب منزلقة', 'مقاعد قابلة للطي', 'مكنسة كهربائية', 'ثلاجة صغيرة'],
      specs: {
        passengers: 8,
        luggage: 8,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك'
      },
      safety: {
        airbags: 12,
        childSeats: 3,
        blindSpot: true,
        emergencyBrake: true
      },
      comfort: {
        screens: 4,
        usbPorts: 10,
        cupHolders: 18,
        climate: 'رباعي المناطق'
      },
      rating: 4.9,
      available: true,
      familyFriendly: true,
      isPopular: false
    },
    {
      name: 'شيفروليه تاهو',
      category: 'SUV كبيرة فاخرة',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '400 ريال/يوم',
      features: ['قوة سحب عالية', 'مساحة تخزين ضخمة', 'نظام صوتي Bose', 'مقاعد جلدية'],
      specs: {
        passengers: 9,
        luggage: 10,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك 10 سرعات'
      },
      safety: {
        airbags: 10,
        childSeats: 4,
        blindSpot: true,
        emergencyBrake: true
      },
      comfort: {
        screens: 5,
        usbPorts: 12,
        cupHolders: 16,
        climate: 'رباعي المناطق'
      },
      rating: 4.7,
      available: false,
      familyFriendly: true,
      isPopular: false
    },
    {
      name: 'نيسان أرمادا',
      category: 'SUV عائلية كاملة الحجم',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '350 ريال/يوم',
      features: ['دفع رباعي', 'نظام ملاحة كبير', 'شاحن لاسلكي', 'إضاءة LED'],
      specs: {
        passengers: 8,
        luggage: 7,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك CVT'
      },
      safety: {
        airbags: 8,
        childSeats: 3,
        blindSpot: true,
        emergencyBrake: true
      },
      comfort: {
        screens: 3,
        usbPorts: 8,
        cupHolders: 14,
        climate: 'ثلاثي المناطق'
      },
      rating: 4.6,
      available: true,
      familyFriendly: true,
      isPopular: false
    }
  ];

  const familyPackages = [
    {
      name: 'باقة العطلة العائلية',
      price: 'من 280 ريال/يوم',
      duration: '3-7 أيام',
      description: 'مثالية للرحلات القصيرة والعطل العائلية',
      features: [
        'مقاعد أطفال مجانية (حسب العمر)',
        'GPS مع نقاط الأطفال المفضلة',
        'ألعاب وأنشطة للأطفال',
        'دليل الأماكن العائلية',
        'تأمين شامل للعائلة'
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: Heart,
      popular: false
    },
    {
      name: 'باقة الرحلات الطويلة',
      price: 'من 1800 ريال/أسبوع',
      duration: '1-4 أسابيع',
      description: 'مصممة للرحلات الطويلة والإجازات الممتدة',
      features: [
        'خصم 20% على الحجز الأسبوعي',
        'صيانة دورية مجانية',
        'خدمة طوارئ متقدمة',
        'استبدال السيارة عند الحاجة',
        'دليل سياحي شامل'
      ],
      color: 'from-green-500 to-emerald-500',
      icon: MapPin,
      popular: true
    },
    {
      name: 'باقة الأسرة الكبيرة',
      price: 'من 6000 ريال/شهر',
      duration: '1+ شهر',
      description: 'حلول طويلة المدى للأسر الكبيرة والإقامة الطويلة',
      features: [
        'خصم 30% على الإيجار الشهري',
        'مدير حساب عائلي مخصص',
        'خدمات إضافية مجانية',
        'صيانة وتنظيف شامل',
        'مرونة في تبديل السيارة'
      ],
      color: 'from-purple-500 to-indigo-500',
      icon: Users,
      popular: false
    }
  ];

  const safetyFeatures = [
    {
      name: 'مقاعد الأطفال المعتمدة',
      description: 'مقاعد أمان للأطفال من جميع الأعمار',
      icon: Baby,
      available: 'جميع الأعمار',
      certified: true
    },
    {
      name: 'أنظمة الأمان المتقدمة',
      description: 'تقنيات حديثة لحماية العائلة',
      icon: Shield,
      available: 'قياسي',
      certified: true
    },
    {
      name: 'مراقبة النقاط العمياء',
      description: 'تنبيهات ذكية أثناء القيادة',
      icon: Camera,
      available: 'متقدم',
      certified: true
    },
    {
      name: 'فرامل الطوارئ الذكية',
      description: 'نظام فرملة تلقائي في الحالات الطارئة',
      icon: Settings,
      available: 'قياسي',
      certified: true
    }
  ];

  const entertainmentFeatures = [
    {
      name: 'شاشات ترفيه خلفية',
      description: 'شاشات لمس للمقاعد الخلفية',
      icon: Gamepad2,
      specs: 'حتى 4 شاشات'
    },
    {
      name: 'صوت محيطي متطور',
      description: 'نظام صوتي عالي الجودة',
      icon: Volume2,
      specs: 'حتى 14 مكبر'
    },
    {
      name: 'اتصال لاسلكي',
      description: 'واي فاي وبلوتوث للجميع',
      icon: Wifi,
      specs: '8 اتصالات'
    },
    {
      name: 'ألعاب تفاعلية',
      description: 'ألعاب مدمجة للأطفال',
      icon: Target,
      specs: '20+ لعبة'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Animated Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden relative">
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-32 right-1/3 w-12 h-12 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-1/2 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <BackButton fallbackPath="/car-rental/services" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-fade-in">
                <Users className="w-4 h-4 mr-1" />
                السيارات العائلية
              </Badge>
            </div>
            
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                رحلات عائلية سعيدة
              </h1>
              
              <p className="text-2xl md:text-3xl text-blue-100 mb-8 leading-relaxed animate-fade-in max-w-4xl mx-auto">
                سيارات واسعة ومريحة وآمنة مصممة خصيصاً لراحة العائلة وسعادة الأطفال
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 hover:scale-105 transition-all duration-300">
                  <Users className="w-6 h-6 mr-2" />
                  اكتشف الأسطول
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 hover:scale-105 transition-all duration-300">
                  <Shield className="w-6 h-6 mr-2" />
                  مميزات الأمان
                </Button>
              </div>
            </div>

            {/* Animated Family Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'أقصى سعة', value: '9 أشخاص', icon: Users, desc: 'عائلة كاملة' },
                { label: 'مساحة أمتعة', value: '10 حقائب', icon: Car, desc: 'سعة كبيرة' },
                { label: 'مميزات أمان', value: '15+ ميزة', icon: Shield, desc: 'حماية شاملة' },
                { label: 'تقييم العائلات', value: '4.8/5', icon: Heart, desc: 'راضون جداً' }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in group" style={{animationDelay: `${index * 0.1}s`}}>
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-blue-200 group-hover:text-white transition-colors" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  <div className="text-blue-200 text-xs">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          {/* Family Features */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">لماذا نحن الخيار الأفضل للعائلات؟</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">مميزات مصممة خصيصاً لراحة وأمان العائلة</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {familyFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 group-hover:to-white/10 transition-all duration-500"></div>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Badge className={`bg-gradient-to-r ${feature.color} text-white px-4 py-1`}>
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Features Section */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-green-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-3xl font-bold mb-2 text-green-800 dark:text-green-300">أمان العائلة أولويتنا</h3>
                  <p className="text-green-700 dark:text-green-400">تقنيات متقدمة لحماية أغلى ما تملك</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {safetyFeatures.map((safety, index) => (
                    <div key={index} className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <safety.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <h4 className="font-bold mb-2 text-slate-800 dark:text-white">{safety.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{safety.description}</p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-green-500 text-white text-xs">{safety.available}</Badge>
                        {safety.certified && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            <Award className="w-3 h-3 mr-1" />
                            معتمد
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entertainment Features */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 dark:from-slate-800 dark:via-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-3xl font-bold mb-2 text-purple-800 dark:text-purple-300">ترفيه لا ينتهي</h3>
                  <p className="text-purple-700 dark:text-purple-400">تقنيات ترفيه متطورة تجعل كل رحلة ممتعة</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {entertainmentFeatures.map((entertainment, index) => (
                    <div key={index} className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <entertainment.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                      <h4 className="font-bold mb-2 text-slate-800 dark:text-white">{entertainment.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{entertainment.description}</p>
                      <Badge className="bg-purple-500 text-white text-xs">
                        {entertainment.specs}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Family Cars Fleet */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">أسطولنا من السيارات العائلية</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">سيارات واسعة ومريحة مصممة لتلبية احتياجات العائلة</p>
            
            <div className="space-y-8">
              {familyCars.map((car, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 overflow-hidden">
                  <div className="absolute top-6 right-6 z-20 flex gap-2">
                    {car.isPopular && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse">
                        <Star className="w-3 h-3 mr-1" />
                        الأكثر طلباً
                      </Badge>
                    )}
                    {car.familyFriendly && (
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <Heart className="w-3 h-3 mr-1" />
                        صديق العائلة
                      </Badge>
                    )}
                  </div>

                  <div className="lg:flex">
                    {/* Image */}
                    <div className="lg:w-2/5 relative overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-full h-80 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="lg:w-3/5 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{car.name}</h3>
                          <Badge variant="outline" className="mb-3 border-blue-500 text-blue-600">{car.category}</Badge>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{car.rating}</span>
                            </div>
                            <Badge className="bg-blue-500 text-white text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {car.specs.passengers} مقاعد
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600 mb-1">{car.price}</div>
                          <Badge variant={car.available ? "default" : "secondary"} className={car.available ? "bg-green-500" : ""}>
                            {car.available ? 'متاح' : 'محجوز'}
                          </Badge>
                        </div>
                      </div>

                      {/* Family Specs Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-lg">
                          <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                          <div className="text-sm font-bold">{car.specs.passengers}</div>
                          <div className="text-xs text-muted-foreground">مقاعد</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 rounded-lg">
                          <Car className="w-5 h-5 mx-auto mb-1 text-green-600" />
                          <div className="text-sm font-bold">{car.specs.luggage}</div>
                          <div className="text-xs text-muted-foreground">حقائب</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-lg">
                          <Shield className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                          <div className="text-sm font-bold">{car.safety.airbags}</div>
                          <div className="text-xs text-muted-foreground">وسائد هوائية</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-red-900/20 rounded-lg">
                          <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                          <div className="text-sm font-bold">{car.comfort.screens}</div>
                          <div className="text-xs text-muted-foreground">شاشات</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                        {car.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                          disabled={!car.available}
                        >
                          {car.available ? 'احجز للعائلة' : 'غير متاح'}
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                        <Button variant="outline" className="hover:scale-105 transition-transform duration-300">
                          <Baby className="w-4 h-4 mr-2" />
                          مقاعد الأطفال
                        </Button>
                        <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-300">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Family Packages */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">باقات العائلة المميزة</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">حلول شاملة مصممة لاحتياجات العائلة</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {familyPackages.map((pkg, index) => (
                <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 ${pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1 animate-pulse">الأكثر اختياراً</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${pkg.color} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <pkg.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{pkg.price}</div>
                    <Badge variant="outline" className="mb-3">{pkg.duration}</Badge>
                    <p className="text-muted-foreground">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className={`w-full bg-gradient-to-r ${pkg.color} text-white border-0 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                      اختيار باقة العائلة
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white overflow-hidden relative">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
            </div>
            <CardContent className="p-12 text-center relative z-10">
              <Heart className="w-20 h-20 mx-auto mb-6 opacity-80 animate-pulse" />
              <h3 className="text-3xl font-bold mb-4">اجعل رحلة عائلتك لا تُنسى</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                احجز سيارة عائلية اليوم واستمتع برحلة آمنة ومريحة مع أحبائك
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                  <Users className="w-6 h-6 mr-2" />
                  احجز للعائلة الآن
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                  <Phone className="w-6 h-6 mr-2" />
                  0555812567
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

export default FamilyCars;