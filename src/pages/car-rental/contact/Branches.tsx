import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  MapPin,
  Phone,
  Clock,
  Mail,
  Navigation,
  Car,
  Users,
  Shield,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building,
  Headphones
} from "lucide-react";

const Branches = () => {
  const branches = [
    {
      id: 1,
      name: 'الفرع الرئيسي - الملز',
      address: 'شارع الأمير محمد بن عبدالعزيز، حي الملز، الرياض 12211',
      phone: '0555812567',
      email: 'malaz@alialshehriholding.com',
      manager: 'أحمد المحمد',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      workingHours: {
        weekdays: 'الأحد - الخميس: 8:00 ص - 10:00 م',
        friday: 'الجمعة: 2:00 م - 10:00 م',
        saturday: 'السبت: 8:00 ص - 10:00 م'
      },
      services: [
        'تأجير جميع أنواع السيارات',
        'خدمة التوصيل والاستلام',
        'صيانة سريعة',
        'تأمين شامل',
        'خدمة عملاء 24/7'
      ],
      features: [
        'موقف سيارات مجاني',
        'صالة انتظار مكيفة',
        'واي فاي مجاني',
        'مقهى',
        'منطقة لعب أطفال'
      ],
      fleetSize: 200,
      rating: 4.9,
      isMain: true
    },
    {
      id: 2,
      name: 'فرع العليا',
      address: 'طريق الملك فهد، حي العليا، الرياض 12213',
      phone: '0555812568',
      email: 'olaya@alialshehriholding.com',
      manager: 'سعد الأحمد',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      workingHours: {
        weekdays: 'الأحد - الخميس: 8:00 ص - 10:00 م',
        friday: 'الجمعة: 2:00 م - 10:00 م',
        saturday: 'السبت: 8:00 ص - 10:00 م'
      },
      services: [
        'تأجير السيارات التنفيذية',
        'خدمات الشركات',
        'سائق خاص',
        'تأمين VIP'
      ],
      features: [
        'خدمة فاليه',
        'صالة VIP',
        'خدمة كونسيرج',
        'مركز أعمال'
      ],
      fleetSize: 150,
      rating: 4.8,
      isMain: false
    },
    {
      id: 3,
      name: 'فرع مطار الملك خالد',
      address: 'مطار الملك خالد الدولي، صالة المغادرة 1',
      phone: '0555812569',
      email: 'airport@alialshehriholding.com',
      manager: 'فهد العتيبي',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      workingHours: {
        weekdays: 'يومياً: 5:00 ص - 1:00 ص',
        friday: 'يومياً: 5:00 ص - 1:00 ص',
        saturday: 'يومياً: 5:00 ص - 1:00 ص'
      },
      services: [
        'تأجير فوري للمسافرين',
        'استقبال من الطائرة',
        'تسليم السيارة في المطار',
        'خدمة 24/7'
      ],
      features: [
        'كاونتر مخصص بالمطار',
        'خدمة سريعة',
        'دعم متعدد اللغات',
        'استقبال الرحلات'
      ],
      fleetSize: 100,
      rating: 4.7,
      isMain: false
    },
    {
      id: 4,
      name: 'فرع جدة',
      address: 'شارع التحلية، حي الروضة، جدة 23431',
      phone: '0555812570',
      email: 'jeddah@alialshehriholding.com',
      manager: 'محمد الغامدي',
      image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      workingHours: {
        weekdays: 'الأحد - الخميس: 8:00 ص - 10:00 م',
        friday: 'الجمعة: 2:00 م - 10:00 م',
        saturday: 'السبت: 8:00 ص - 10:00 م'
      },
      services: [
        'تأجير السيارات السياحية',
        'رحلات العمرة والحج',
        'سائق متخصص',
        'خدمة ترجمة'
      ],
      features: [
        'قريب من المعالم السياحية',
        'فريق متعدد اللغات',
        'خدمة الحجاج والمعتمرين',
        'مركز معلومات سياحية'
      ],
      fleetSize: 120,
      rating: 4.8,
      isMain: false
    }
  ];

  const achievements = [
    { icon: Building, value: '4', label: 'فروع رئيسية' },
    { icon: Car, value: '570+', label: 'سيارة متاحة' },
    { icon: Users, value: '50+', label: 'موظف متخصص' },
    { icon: Star, value: '4.8/5', label: 'متوسط التقييم' }
  ];

  const allServices = [
    'تأجير يومي وشهري',
    'خدمات الشركات والمؤسسات',
    'السائق الخاص',
    'خدمة التوصيل والاستلام',
    'تأمين شامل ومرن',
    'صيانة طارئة',
    'دعم فني متواصل',
    'حجز أونلاين وهاتفي'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental/contact" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <MapPin className="w-4 h-4 mr-1" />
                فروعنا ومواقعنا
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              فروعنا في المملكة
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed animate-fade-in">
              نحن في خدمتك في أهم المدن والمواقع الاستراتيجية
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {achievements.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          {/* Branches */}
          <div className="space-y-8 mb-16">
            {branches.map((branch, index) => (
              <Card key={branch.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 overflow-hidden">
                {branch.isMain && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      الفرع الرئيسي
                    </Badge>
                  </div>
                )}

                <div className="lg:flex">
                  {/* Image */}
                  <div className="lg:w-1/3">
                    <img 
                      src={branch.image} 
                      alt={branch.name}
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{branch.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{branch.rating}</span>
                          <Badge variant="outline">{branch.fleetSize} سيارة</Badge>
                        </div>
                        <p className="text-muted-foreground flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 text-blue-500" />
                          {branch.address}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg">معلومات الاتصال</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{branch.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{branch.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">مدير الفرع: {branch.manager}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-lg">ساعات العمل</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{branch.workingHours.weekdays}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{branch.workingHours.friday}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{branch.workingHours.saturday}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3">الخدمات المتاحة</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {branch.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3">مزايا الفرع</h4>
                      <div className="flex flex-wrap gap-2">
                        {branch.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg">
                        <Phone className="w-4 h-4 mr-2" />
                        اتصل بالفرع
                      </Button>
                      <Button variant="outline">
                        <Navigation className="w-4 h-4 mr-2" />
                        اتجاهات الوصول
                      </Button>
                      <Button variant="outline">
                        <Car className="w-4 h-4 mr-2" />
                        احجز من هذا الفرع
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        المزيد
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* All Services Section */}
          <Card className="bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 mb-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">خدماتنا في جميع الفروع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <Headphones className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">تحتاج مساعدة في اختيار الفرع؟</h3>
              <p className="text-lg mb-6 opacity-90">
                فريق خدمة العملاء جاهز لمساعدتك في العثور على أقرب فرع وأنسب خدمة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="w-5 h-5 mr-2" />
                  اتصل بنا: 0555812567
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5 mr-2" />
                  راسلنا
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

export default Branches;