import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Car,
  Clock,
  Shield,
  MapPin,
  CreditCard,
  Smartphone,
  Headphones,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Phone,
  Mail,
  Settings,
  Award,
  Zap,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  Navigation,
  Wifi,
  Battery,
  Bluetooth,
  Camera,
  Video,
  DollarSign,
  FileText,
  Search,
  Filter,
  Play,
  Download,
  ExternalLink,
  ChevronRight,
  Package,
  Truck,
  Home,
  Building
} from "lucide-react";

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const serviceCategories = [
    { id: 'all', label: 'جميع الخدمات', icon: Globe },
    { id: 'rental', label: 'تأجير السيارات', icon: Car },
    { id: 'digital', label: 'الخدمات الرقمية', icon: Smartphone },
    { id: 'support', label: 'الدعم والمساعدة', icon: Headphones },
    { id: 'premium', label: 'الخدمات المميزة', icon: Award },
    { id: 'business', label: 'خدمات الشركات', icon: Building }
  ];

  const mainServices = [
    {
      id: 'car-rental',
      title: 'تأجير السيارات',
      description: 'أسطول متنوع من السيارات الحديثة لجميع احتياجاتك',
      icon: Car,
      category: 'rental',
      color: 'from-blue-500 to-cyan-500',
      price: 'من 150 ريال/يوم',
      rating: 4.9,
      features: [
        'أسطول حديث ومتنوع',
        'تأمين شامل مجاني',
        'صيانة دورية مضمونة',
        'خدمة عملاء 24/7',
        'مرونة في الحجز والإلغاء'
      ],
      subServices: [
        {
          name: 'سيارات اقتصادية',
          description: 'مثالية للاستخدام اليومي والرحلات القصيرة',
          price: 'من 150 ريال/يوم',
          includes: ['تويوتا يارس', 'نيسان صنى', 'كيا ريو']
        },
        {
          name: 'سيارات متوسطة',
          description: 'راحة إضافية للرحلات الطويلة والعائلات',
          price: 'من 250 ريال/يوم',
          includes: ['كامري', 'التيما', 'أكورد']
        },
        {
          name: 'سيارات فاخرة',
          description: 'تجربة قيادة استثنائية للمناسبات الخاصة',
          price: 'من 500 ريال/يوم',
          includes: ['مرسيدس', 'BMW', 'أودي']
        },
        {
          name: 'سيارات رياضية',
          description: 'أداء عالي وتصميم جذاب لعشاق السرعة',
          price: 'من 800 ريال/يوم',
          includes: ['موستانج', 'تشارجر', 'كامارو']
        }
      ]
    },
    {
      id: 'mobile-app',
      title: 'التطبيق الذكي',
      description: 'احجز وأدر رحلاتك بسهولة عبر تطبيقنا المتطور',
      icon: Smartphone,
      category: 'digital',
      color: 'from-purple-500 to-indigo-500',
      price: 'مجاني',
      rating: 4.8,
      features: [
        'حجز سريع ومباشر',
        'تتبع السيارة المباشر',
        'دفع آمن ومتعدد الطرق',
        'إدارة الحجوزات',
        'دعم فني متكامل'
      ],
      subServices: [
        {
          name: 'الحجز السريع',
          description: 'احجز سيارتك في أقل من 3 دقائق',
          includes: ['بحث ذكي', 'مقارنة الأسعار', 'حجز فوري']
        },
        {
          name: 'التتبع المباشر',
          description: 'راقب موقع سيارتك ومعلومات الرحلة',
          includes: ['GPS مدمج', 'تحديثات فورية', 'تنبيهات ذكية']
        },
        {
          name: 'المحفظة الرقمية',
          description: 'ادفع بأمان واحفظ طرق الدفع المفضلة',
          includes: ['آبل باي', 'جوجل باي', 'مدى']
        }
      ]
    },
    {
      id: 'delivery-service',
      title: 'خدمة التوصيل',
      description: 'استلام وإرجاع السيارة في أي مكان تريده',
      icon: Truck,
      category: 'premium',
      color: 'from-green-500 to-emerald-500',
      price: 'من 50 ريال',
      rating: 4.7,
      features: [
        'توصيل للمنزل أو العمل',
        'خدمة متاحة 24/7',
        'فحص شامل للسيارة',
        'تسليم المفاتيح والوثائق',
        'تغطية جميع مناطق المدينة'
      ],
      subServices: [
        {
          name: 'التوصيل المنزلي',
          description: 'استلم سيارتك في راحة منزلك',
          price: '50 ريال',
          includes: ['تسليم وتسلم', 'فحص مجاني', 'توقيع العقد']
        },
        {
          name: 'التوصيل للمكاتب',
          description: 'خدمة مخصصة لقطاع الأعمال',
          price: '75 ريال',
          includes: ['مواعيد مرنة', 'خدمة سريعة', 'دعم مخصص']
        },
        {
          name: 'التوصيل للمطار',
          description: 'استلم سيارتك فور وصولك',
          price: '100 ريال',
          includes: ['متابعة الرحلات', 'استقبال شخصي', 'خدمة VIP']
        }
      ]
    },
    {
      id: 'insurance-service',
      title: 'خدمات التأمين',
      description: 'حماية شاملة لراحة بالك أثناء القيادة',
      icon: Shield,
      category: 'rental',
      color: 'from-orange-500 to-red-500',
      price: 'من 30 ريال/يوم',
      rating: 4.9,
      features: [
        'تأمين شامل ضد الحوادث',
        'تغطية السرقة والحريق',
        'مساعدة طريق 24/7',
        'سيارة بديلة فورية',
        'معالجة سريعة للمطالبات'
      ],
      subServices: [
        {
          name: 'التأمين الأساسي',
          description: 'تغطية أساسية مجانية مع كل حجز',
          price: 'مجاني',
          includes: ['المسؤولية المدنية', 'مساعدة الطريق', 'حماية أساسية']
        },
        {
          name: 'التأمين الشامل',
          description: 'حماية موسعة مع تحمل منخفض',
          price: '50 ريال/يوم',
          includes: ['تغطية كاملة', 'بدون تحمل', 'سيارة بديلة']
        },
        {
          name: 'التأمين المميز',
          description: 'أعلى مستوى من الحماية والخدمات',
          price: '100 ريال/يوم',
          includes: ['تغطية VIP', 'خدمة كونسيرج', 'تأمين شخصي']
        }
      ]
    },
    {
      id: 'business-solutions',
      title: 'حلول الشركات',
      description: 'خدمات مخصصة لاحتياجات الشركات والمؤسسات',
      icon: Building,
      category: 'business',
      color: 'from-indigo-500 to-purple-500',
      price: 'حسب الطلب',
      rating: 4.8,
      features: [
        'أسعار خاصة للشركات',
        'إدارة أسطول متكاملة',
        'تقارير مفصلة',
        'مدير حساب مخصص',
        'دعم فني متقدم'
      ],
      subServices: [
        {
          name: 'تأجير طويل الأمد',
          description: 'حلول مرنة للشركات الكبيرة',
          includes: ['خصومات حجم', 'صيانة شاملة', 'تأمين متقدم']
        },
        {
          name: 'إدارة الأسطول',
          description: 'نظام متكامل لإدارة سيارات الشركة',
          includes: ['تتبع GPS', 'تقارير استهلاك', 'إدارة السائقين']
        },
        {
          name: 'الخدمات اللوجستية',
          description: 'حلول النقل والتوصيل للشركات',
          includes: ['نقل البضائع', 'خدمات التوصيل', 'حلول مخصصة']
        }
      ]
    },
    {
      id: 'customer-support',
      title: 'دعم العملاء',
      description: 'فريق محترف متاح على مدار الساعة لخدمتك',
      icon: Headphones,
      category: 'support',
      color: 'from-pink-500 to-rose-500',
      price: 'مجاني',
      rating: 4.9,
      features: [
        'دعم متعدد القنوات',
        'استجابة سريعة',
        'خبراء متخصصون',
        'حلول مخصصة',
        'متابعة دورية'
      ],
      subServices: [
        {
          name: 'الدعم الهاتفي',
          description: 'اتصل بنا في أي وقت للحصول على المساعدة',
          includes: ['24/7 متاح', 'رد سريع', 'خبراء متخصصون']
        },
        {
          name: 'الدردشة المباشرة',
          description: 'تحدث معنا فورياً عبر الموقع أو التطبيق',
          includes: ['رد فوري', 'مساعدة تفاعلية', 'حلول سريعة']
        },
        {
          name: 'المساعدة الفنية',
          description: 'دعم متخصص للمشاكل التقنية',
          includes: ['خبراء تقنيون', 'حلول متقدمة', 'دعم متواصل']
        }
      ]
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? mainServices 
    : mainServices.filter(service => service.category === activeCategory);

  const expandService = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental-landing" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  خدماتنا المتميزة
                </h1>
                <p className="text-lg text-muted-foreground">
                  حلول شاملة ومتطورة لجميع احتياجات التنقل والنقل
                </p>
              </div>
            </div>

            {/* Service Categories */}
            <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in">
            {[
              { label: 'خدمات متنوعة', value: '50+', icon: Package, color: 'text-blue-500' },
              { label: 'عملاء راضون', value: '99%', icon: Heart, color: 'text-green-500' },
              { label: 'دعم متاح', value: '24/7', icon: Clock, color: 'text-orange-500' },
              { label: 'تقييم العملاء', value: '4.9/5', icon: Star, color: 'text-yellow-500' }
            ].map((stat, index) => (
              <Card key={index} className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Services */}
          <div className="space-y-8 animate-fade-in">
            {filteredServices.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Service Icon */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Service Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                          <p className="text-muted-foreground text-lg mb-3">{service.description}</p>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {service.rating}
                            </Badge>
                            <Badge className={`bg-gradient-to-r ${service.color} text-white`}>
                              {service.price}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => expandService(service.id)}
                          variant="outline"
                          className="flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                          {selectedService === service.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedService === service.id ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>

                      {/* Main Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                       {/* Quick Action Buttons */}
                      <div className="flex gap-3">
                        <Button className={`bg-gradient-to-r ${service.color} text-white border-0 hover:shadow-lg transition-all duration-300`} asChild>
                          <a href="/car-booking">
                            احجز الآن
                            <ArrowRight className="w-4 h-4 mr-2" />
                          </a>
                        </Button>
                        {service.id === 'car-rental' && (
                          <Button variant="outline" asChild>
                            <a href="/car-rental/sub-services">معرفة المزيد</a>
                          </Button>
                        )}
                        {service.id !== 'car-rental' && (
                          <Button variant="outline">
                            معرفة المزيد
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <a href="/car-rental/contact">
                            <Phone className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedService === service.id && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 animate-fade-in">
                      <h4 className="text-xl font-bold mb-6">تفاصيل الخدمة</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.subServices.map((subService, subIndex) => (
                          <Card key={subIndex} className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{subService.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{subService.description}</p>
                              {subService.price && (
                                <Badge variant="outline" className="w-fit">
                                  {subService.price}
                                </Badge>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                {subService.includes.map((include, includeIndex) => (
                                  <div key={includeIndex} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-sm">{include}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-fade-in">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">هل تحتاج خدمة مخصصة؟</h3>
              <p className="text-lg mb-6 opacity-90">
                تحدث مع فريقنا لتصميم حلول تناسب احتياجاتك الخاصة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  اتصل بنا: 0555812567
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5" />
                  info@ash-holding.sa
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

export default Services;