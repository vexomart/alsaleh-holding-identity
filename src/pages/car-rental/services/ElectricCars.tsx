import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Zap,
  Leaf,
  Battery,
  Shield,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Calendar,
  Settings,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Heart,
  Sparkles,
  Gauge,
  Wifi,
  Smartphone,
  Navigation,
  Plug,
  TreePine,
  Target,
  BarChart3
} from "lucide-react";

const ElectricCars = () => {
  const electricFeatures = [
    {
      title: 'صديقة للبيئة',
      description: 'انبعاثات صفر لهواء أنظف',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500',
      stats: '0% انبعاثات كربون'
    },
    {
      title: 'توفير في التكلفة',
      description: 'تكلفة تشغيل أقل بـ70%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      stats: '70% توفير'
    },
    {
      title: 'أداء متفوق',
      description: 'عزم دوران فوري وقوة',
      icon: Zap,
      color: 'from-purple-500 to-indigo-500',
      stats: '0-100 في 4 ثواني'
    },
    {
      title: 'تقنية متطورة',
      description: 'أحدث تقنيات الذكاء الاصطناعي',
      icon: Smartphone,
      color: 'from-orange-500 to-red-500',
      stats: 'AI مدمج'
    }
  ];

  const electricCars = [
    {
      name: 'تسلا Model 3',
      category: 'سيدان فاخرة كهربائية',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '300 ريال/يوم',
      range: '500 كم',
      chargingTime: '30 دقيقة (سريع)',
      features: ['قيادة ذاتية', 'شحن فائق السرعة', 'شاشة 15 بوصة', 'تحديثات هوائية'],
      specs: {
        passengers: 5,
        luggage: 3,
        topSpeed: '261 كم/س',
        acceleration: '5.3 ثانية'
      },
      rating: 4.9,
      available: true,
      isNew: true,
      batteryHealth: '100%',
      efficiency: '15 كوه/100كم'
    },
    {
      name: 'BMW iX',
      category: 'SUV كهربائية فاخرة',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '450 ريال/يوم',
      range: '425 كم',
      chargingTime: '40 دقيقة (سريع)',
      features: ['مساحة واسعة', 'مقاعد جلدية', 'نظام صوتي Harman Kardon', 'سقف بانوراما'],
      specs: {
        passengers: 7,
        luggage: 5,
        topSpeed: '200 كم/س',
        acceleration: '6.1 ثانية'
      },
      rating: 4.8,
      available: true,
      isNew: false,
      batteryHealth: '98%',
      efficiency: '19 كوه/100كم'
    },
    {
      name: 'نيسان ليف',
      category: 'هاتشباك اقتصادية',
      image: 'https://images.unsplash.com/photo-1574873215662-24e3432d8aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '200 ريال/يوم',
      range: '270 كم',
      chargingTime: '7 ساعات (عادي)',
      features: ['اقتصادية', 'سهلة القيادة', 'مناسبة للمدينة', 'صيانة قليلة'],
      specs: {
        passengers: 5,
        luggage: 2,
        topSpeed: '157 كم/س',
        acceleration: '7.9 ثانية'
      },
      rating: 4.6,
      available: false,
      isNew: false,
      batteryHealth: '95%',
      efficiency: '17 كوه/100كم'
    },
    {
      name: 'مرسيدس EQS',
      category: 'سيدان تنفيذية كهربائية',
      image: 'https://images.unsplash.com/photo-1617886322647-90d51eac4cac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: '600 ريال/يوم',
      range: '770 كم',
      chargingTime: '22 دقيقة (أسرع)',
      features: ['مدى أطول', 'فخامة استثنائية', 'شحن أسرع', 'تقنيات متقدمة'],
      specs: {
        passengers: 5,
        luggage: 4,
        topSpeed: '250 كم/س',
        acceleration: '4.3 ثانية'
      },
      rating: 4.9,
      available: true,
      isNew: true,
      batteryHealth: '100%',
      efficiency: '16 كوه/100كم'
    }
  ];

  const chargingStations = [
    {
      name: 'محطات الشحن السريع',
      count: '50+',
      type: 'DC سريع',
      power: '150 كيلوواط',
      time: '20-30 دقيقة',
      locations: ['الرياض', 'جدة', 'الدمام'],
      icon: Plug,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'محطات الشحن العادية',
      count: '200+',
      type: 'AC عادي',
      power: '22 كيلوواط',
      time: '4-6 ساعات',
      locations: ['جميع المدن الرئيسية'],
      icon: Battery,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'الشحن المنزلي',
      count: 'متاح',
      type: 'منزلي',
      power: '7 كيلوواط',
      time: '8-12 ساعة',
      locations: ['خدمة تركيب'],
      icon: MapPin,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const environmentalImpact = [
    { metric: 'توفير CO2 سنوياً', value: '2.5 طن', icon: Leaf, color: 'text-green-500' },
    { metric: 'توفير في الوقود', value: '12,000 ريال', icon: TrendingUp, color: 'text-blue-500' },
    { metric: 'كفاءة الطاقة', value: '90%', icon: Zap, color: 'text-purple-500' },
    { metric: 'تقليل التلوث', value: '100%', icon: Shield, color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50/30 to-cyan-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Animated Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 text-white overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          </div>
          
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <BackButton fallbackPath="/car-rental/services" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-fade-in">
                <Zap className="w-4 h-4 mr-1" />
                السيارات الكهربائية
              </Badge>
            </div>
            
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in bg-gradient-to-r from-white via-green-100 to-cyan-100 bg-clip-text text-transparent">
                المستقبل كهربائي
              </h1>
              
              <p className="text-2xl md:text-3xl text-green-100 mb-8 leading-relaxed animate-fade-in max-w-4xl mx-auto">
                اكتشف عالماً جديداً من القيادة النظيفة والذكية مع أسطولنا من السيارات الكهربائية المتطورة
              </p>

              <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <Plug className="w-6 h-6 mr-2" />
                  اكتشف الأسطول
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
                  <MapPin className="w-6 h-6 mr-2" />
                  محطات الشحن
                </Button>
              </div>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'مدى القيادة', value: '770 كم', icon: Gauge, desc: 'أقصى مسافة' },
                { label: 'محطات الشحن', value: '250+', icon: Plug, desc: 'في المملكة' },
                { label: 'وقت الشحن', value: '20 دقيقة', icon: Clock, desc: 'شحن سريع' },
                { label: 'توفير CO2', value: '100%', icon: Leaf, desc: 'انبعاثات صفر' }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in group" style={{animationDelay: `${index * 0.1}s`}}>
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-green-200 group-hover:text-white transition-colors" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-green-100 text-sm font-medium">{stat.label}</div>
                  <div className="text-green-200 text-xs">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          {/* Features Section with Advanced Animation */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">لماذا السيارات الكهربائية؟</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">اكتشف المزايا التي تجعل من السيارات الكهربائية الخيار الأذكى</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {electricFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 group-hover:to-white/10 transition-all duration-500"></div>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
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

          {/* Environmental Impact Dashboard */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-green-100 via-emerald-50 to-cyan-100 dark:from-slate-800 dark:via-emerald-900/20 dark:to-cyan-900/20 border-green-200 dark:border-emerald-700">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <TreePine className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-3xl font-bold mb-2 text-green-800 dark:text-green-300">الأثر البيئي الإيجابي</h3>
                  <p className="text-green-700 dark:text-green-400">ساهم في حماية البيئة مع كل كيلومتر تقطعه</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {environmentalImpact.map((impact, index) => (
                    <div key={index} className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <impact.icon className={`w-12 h-12 mx-auto mb-4 ${impact.color}`} />
                      <div className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">{impact.value}</div>
                      <div className="text-sm text-muted-foreground">{impact.metric}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Electric Cars Fleet */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">أسطولنا الكهربائي المتطور</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">سيارات كهربائية متنوعة تناسب جميع احتياجاتك</p>
            
            <div className="space-y-8">
              {electricCars.map((car, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 overflow-hidden">
                  {car.isNew && (
                    <div className="absolute top-6 left-6 z-20">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                        <Sparkles className="w-3 h-3 mr-1" />
                        جديد
                      </Badge>
                    </div>
                  )}

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
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">{car.name}</h3>
                          <Badge variant="outline" className="mb-3 border-green-500 text-green-600">{car.category}</Badge>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{car.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Battery className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{car.batteryHealth}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-1">{car.price}</div>
                          <Badge variant={car.available ? "default" : "secondary"} className={car.available ? "bg-green-500" : ""}>
                            {car.available ? 'متاح' : 'محجوز'}
                          </Badge>
                        </div>
                      </div>

                      {/* Electric Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 rounded-lg">
                          <Gauge className="w-5 h-5 mx-auto mb-1 text-green-600" />
                          <div className="text-sm font-bold">{car.range}</div>
                          <div className="text-xs text-muted-foreground">المدى</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-cyan-900/20 rounded-lg">
                          <Plug className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                          <div className="text-sm font-bold">{car.chargingTime}</div>
                          <div className="text-xs text-muted-foreground">الشحن</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-lg">
                          <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                          <div className="text-sm font-bold">{car.specs.passengers}</div>
                          <div className="text-xs text-muted-foreground">مقاعد</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-red-900/20 rounded-lg">
                          <Zap className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                          <div className="text-sm font-bold">{car.efficiency}</div>
                          <div className="text-xs text-muted-foreground">الكفاءة</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                        {car.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                          disabled={!car.available}
                        >
                          {car.available ? 'احجز الآن' : 'غير متاح'}
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                        <Button variant="outline" className="hover:scale-105 transition-transform duration-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          محطات الشحن
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

          {/* Charging Infrastructure */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4">شبكة الشحن المتطورة</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">شبكة واسعة من محطات الشحن لضمان راحتك في كل مكان</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {chargingStations.map((station, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${station.color}`}></div>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${station.color} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <station.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{station.name}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">العدد:</span>
                        <span className="font-bold text-blue-600">{station.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">القوة:</span>
                        <span className="font-bold">{station.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الوقت:</span>
                        <span className="font-bold text-green-600">{station.time}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {station.locations.join(' • ')}
                    </div>
                    <Button variant="outline" className="w-full group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                      العثور على محطة
                      <Navigation className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white overflow-hidden relative">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
            </div>
            <CardContent className="p-12 text-center relative z-10">
              <Leaf className="w-20 h-20 mx-auto mb-6 opacity-80 animate-pulse" />
              <h3 className="text-3xl font-bold mb-4">ابدأ رحلتك الكهربائية اليوم</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                انضم إلى ثورة النقل النظيف واستمتع بقيادة صامتة وقوية وصديقة للبيئة
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                  <Plug className="w-6 h-6 mr-2" />
                  احجز سيارة كهربائية
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

export default ElectricCars;