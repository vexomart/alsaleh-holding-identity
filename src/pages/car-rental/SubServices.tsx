import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import Footer from "@/components/Footer";
import { 
  Car,
  Zap,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Smartphone,
  Headphones,
  Award,
  Target,
  Heart,
  Settings,
  Battery,
  Wifi,
  Navigation,
  Camera,
  DollarSign
} from "lucide-react";

const SubServices = () => {
  const [selectedCategory, setSelectedCategory] = useState('economy');

  const serviceCategories = [
    { id: 'economy', label: 'السيارات الاقتصادية', icon: Car, color: 'from-blue-500 to-cyan-500' },
    { id: 'luxury', label: 'السيارات الفاخرة', icon: Award, color: 'from-purple-500 to-indigo-500' },
    { id: 'electric', label: 'السيارات الكهربائية', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { id: 'family', label: 'السيارات العائلية', icon: Users, color: 'from-orange-500 to-red-500' },
    { id: 'business', label: 'سيارات الأعمال', icon: Settings, color: 'from-indigo-500 to-purple-500' }
  ];

  const services = {
    economy: [
      {
        id: 'compact',
        name: 'السيارات المدمجة',
        description: 'مثالية للاستخدام اليومي والرحلات القصيرة داخل المدينة',
        price: 'من 120 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'استهلاك وقود اقتصادي',
          'سهولة في الركن والمناورة',
          'تأمين شامل مجاني',
          'كيلومترات مفتوحة',
          'خدمة طوارئ 24/7'
        ],
        includes: ['تويوتا يارس', 'نيسان صني', 'كيا ريو', 'هيونداي أكسنت'],
        specs: {
          passengers: '4-5 أشخاص',
          luggage: '2-3 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      },
      {
        id: 'sedan',
        name: 'السيارات المتوسطة',
        description: 'راحة إضافية للرحلات الطويلة والعائلات الصغيرة',
        price: 'من 180 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'مساحة أكبر للركاب',
          'صندوق أمتعة واسع',
          'نظام ملاحة GPS',
          'كاميرا خلفية',
          'تحكم مناخي ثنائي'
        ],
        includes: ['تويوتا كامري', 'نيسان التيما', 'هوندا أكورد', 'هيونداي سوناتا'],
        specs: {
          passengers: '5 أشخاص',
          luggage: '3-4 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      }
    ],
    luxury: [
      {
        id: 'premium',
        name: 'السيارات الفاخرة',
        description: 'تجربة قيادة استثنائية مع أعلى مستويات الراحة والأناقة',
        price: 'من 400 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'مقاعد جلدية فاخرة',
          'نظام صوتي متطور',
          'تحكم مناخي متعدد المناطق',
          'شاشة لمس كبيرة',
          'ميزات أمان متقدمة'
        ],
        includes: ['مرسيدس C-Class', 'BMW 3 Series', 'أودي A4', 'لكزس ES'],
        specs: {
          passengers: '5 أشخاص',
          luggage: '3-4 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      },
      {
        id: 'super-luxury',
        name: 'السيارات الفائقة الفخامة',
        description: 'القمة في الفخامة والأداء للمناسبات الخاصة',
        price: 'من 800 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'تصميم داخلي فائق الفخامة',
          'محرك عالي الأداء',
          'تقنيات قيادة متطورة',
          'خدمة كونسيرج مخصصة',
          'تأمين VIP شامل'
        ],
        includes: ['مرسيدس S-Class', 'BMW 7 Series', 'أودي A8', 'لكزس LS'],
        specs: {
          passengers: '4-5 أشخاص',
          luggage: '4-5 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      }
    ],
    electric: [
      {
        id: 'eco-electric',
        name: 'السيارات الكهربائية الاقتصادية',
        description: 'صديقة للبيئة ومقتصدة في التشغيل',
        price: 'من 200 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'انبعاثات صفر',
          'تكلفة تشغيل منخفضة',
          'شحن سريع',
          'تقنيات ذكية متطورة',
          'صيانة أقل'
        ],
        includes: ['تسلا Model 3', 'BMW i3', 'نيسان ليف', 'كيا نيرو'],
        specs: {
          passengers: '4-5 أشخاص',
          luggage: '2-3 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'كهرباء'
        }
      },
      {
        id: 'premium-electric',
        name: 'السيارات الكهربائية الفاخرة',
        description: 'الفخامة تلتقي مع التكنولوجيا المتقدمة',
        price: 'من 600 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'أداء عالي وسريع',
          'مدى قيادة طويل',
          'شحن فائق السرعة',
          'مقصورة فاخرة',
          'تقنيات قيادة ذاتية'
        ],
        includes: ['تسلا Model S', 'BMW iX', 'مرسيدس EQS', 'أودي e-tron'],
        specs: {
          passengers: '5 أشخاص',
          luggage: '4-5 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'كهرباء'
        }
      }
    ],
    family: [
      {
        id: 'suv',
        name: 'السيارات الرياضية متعددة الاستخدامات',
        description: 'مساحة واسعة وراحة للعائلات الكبيرة',
        price: 'من 250 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'مقاعد 7-8 أشخاص',
          'مساحة تخزين كبيرة',
          'دفع رباعي (اختياري)',
          'ميزات أمان عائلية',
          'نظام ترفيه خلفي'
        ],
        includes: ['تويوتا هايلاندر', 'نيسان باثفايندر', 'هوندا بايلوت', 'شيفروليه تراڤرس'],
        specs: {
          passengers: '7-8 أشخاص',
          luggage: '5-6 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      },
      {
        id: 'minivan',
        name: 'الحافلات الصغيرة',
        description: 'الحل الأمثل للمجموعات الكبيرة والرحلات الطويلة',
        price: 'من 300 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1544707845-4d0c7f04f78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'مقاعد حتى 12 شخص',
          'أبواب جانبية منزلقة',
          'مساحة أمتعة هائلة',
          'تكييف متعدد المناطق',
          'مدخل USB متعدد'
        ],
        includes: ['تويوتا هايس', 'نيسان أورفان', 'هيونداي H1', 'فورد ترانزيت'],
        specs: {
          passengers: '10-12 شخص',
          luggage: '8-10 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      }
    ],
    business: [
      {
        id: 'executive',
        name: 'السيارات التنفيذية',
        description: 'أناقة ومهنية لرجال الأعمال',
        price: 'من 350 ريال/يوم',
        image: 'https://images.unsplash.com/photo-1544079951-d9e5fad4ca05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'تصميم أنيق ومهني',
          'مقاعد جلدية مريحة',
          'تقنيات اتصال متطورة',
          'شاحن لاسلكي',
          'خدمة سائق (اختيارية)'
        ],
        includes: ['مرسيدس E-Class', 'BMW 5 Series', 'أودي A6', 'لكزس GS'],
        specs: {
          passengers: '5 أشخاص',
          luggage: '3-4 حقائب',
          transmission: 'أوتوماتيك',
          fuel: 'بنزين'
        }
      },
      {
        id: 'fleet',
        name: 'إدارة الأساطيل',
        description: 'حلول متكاملة لإدارة أساطيل الشركات',
        price: 'حسب الطلب',
        image: 'https://images.unsplash.com/photo-1562950840-9d6a84cc2cf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: [
          'تتبع GPS مباشر',
          'تقارير استهلاك مفصلة',
          'صيانة دورية مجدولة',
          'دعم فني متخصص',
          'أسعار تفضيلية'
        ],
        includes: ['حلول مخصصة', 'سيارات متنوعة', 'خدمات شاملة', 'دعم متواصل'],
        specs: {
          passengers: 'حسب النوع',
          luggage: 'حسب النوع',
          transmission: 'متنوع',
          fuel: 'متنوع'
        }
      }
    ]
  };

  const currentServices = services[selectedCategory as keyof typeof services] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental/services" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  خدماتنا التفصيلية
                </h1>
                <p className="text-lg text-muted-foreground">
                  اكتشف مجموعتنا الواسعة من السيارات والخدمات المتخصصة
                </p>
              </div>
            </div>

            {/* Service Categories */}
            <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
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
          {/* Services Grid */}
          <div className="space-y-8 animate-fade-in">
            {currentServices.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                <div className="lg:flex">
                  {/* Image */}
                  <div className="lg:w-1/3">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-64 lg:h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                        <p className="text-muted-foreground text-lg mb-3">{service.description}</p>
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg px-4 py-1">
                          {service.price}
                        </Badge>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm font-medium">{service.specs.passengers}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="text-sm font-medium">{service.specs.luggage}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <Settings className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <p className="text-sm font-medium">{service.specs.transmission}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700">
                        <Zap className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                        <p className="text-sm font-medium">{service.specs.fuel}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Included Models */}
                    <div className="mb-6">
                      <h4 className="font-bold mb-3">السيارات المتاحة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.includes.map((model, modelIndex) => (
                          <Badge key={modelIndex} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:shadow-lg transition-all duration-300">
                        احجز الآن
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                      <Button variant="outline">
                        تفاصيل أكثر
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Services */}
          <Card className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white animate-fade-in">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">خدمات إضافية</h3>
              <p className="text-lg mb-6 opacity-90">
                نوفر خدمات إضافية لتحسين تجربتك
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                  { title: 'سائق خاص', description: 'سائق محترف ومدرب', icon: Users },
                  { title: 'التوصيل والاستلام', description: 'خدمة التوصيل للمنزل أو المكتب', icon: Truck },
                  { title: 'دعم فني 24/7', description: 'مساعدة تقنية على مدار الساعة', icon: Headphones }
                ].map((service, index) => (
                  <div key={index} className="text-center">
                    <service.icon className="w-12 h-12 mx-auto mb-3 opacity-80" />
                    <h4 className="font-bold mb-2">{service.title}</h4>
                    <p className="text-sm opacity-80">{service.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  اتصل للاستفسار
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5 mr-2" />
                  طلب عرض سعر
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <a href="/car-rental-landing" className="hover:text-blue-400 transition-colors">
                  العودة للرئيسية
                </a>
                <a href="/car-rental/services" className="hover:text-blue-400 transition-colors">
                  الخدمات العامة
                </a>
                <a href="/car-rental/contact" className="hover:text-blue-400 transition-colors">
                  اتصل بنا
                </a>
              </div>
              <p className="text-sm text-gray-400">
                © 2024 علي الشهري القابضة. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default SubServices;