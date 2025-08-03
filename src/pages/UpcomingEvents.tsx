import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  ArrowLeft,
  Building,
  Award,
  Lightbulb,
  Target,
  Ticket
} from "lucide-react";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  const upcomingEvents = [
    {
      title: "منتدى الاستثمار التقني السعودي 2025",
      description: "منتدى متخصص يجمع رواد الأعمال والمستثمرين لمناقشة مستقبل الاستثمار التقني في المملكة",
      date: "15-17 مارس 2025",
      time: "09:00 صباحاً - 06:00 مساءً",
      location: "فندق ريتز كارلتون، الرياض",
      type: "منتدى",
      category: "استثمار",
      attendees: "500+ مشارك",
      speakers: ["د. أحمد الراشد", "م. فاطمة العتيبي", "أ. خالد الدوسري"],
      registration: "مفتوح",
      price: "مجاني",
      featured: true,
      agenda: [
        "الافتتاح والكلمة الرئيسية",
        "جلسة: مستقبل الذكاء الاصطناعي",
        "ورشة عمل: استراتيجيات الاستثمار",
        "معرض الشركات الناشئة"
      ]
    },
    {
      title: "ورشة عمل الذكاء الاصطناعي للمطورين",
      description: "ورشة تدريبية متخصصة لتطوير مهارات المطورين في مجال الذكاء الاصطناعي والتعلم الآلي",
      date: "25 فبراير 2025",
      time: "10:00 صباحاً - 04:00 مساءً",
      location: "مركز الابتكار، جدة",
      type: "ورشة",
      category: "تدريب",
      attendees: "50 مطور",
      speakers: ["د. سارة المطيري", "م. محمد الحربي"],
      registration: "مفتوح",
      price: "500 ريال",
      featured: false,
      agenda: [
        "مقدمة في الذكاء الاصطناعي",
        "تطبيق عملي: بناء نموذج ML",
        "أفضل الممارسات والأدوات",
        "مشاريع جماعية"
      ]
    },
    {
      title: "حفل توزيع جوائز الابتكار التقني",
      description: "حفل سنوي لتكريم أفضل المشاريع والمبدعين في مجال التقنية والابتكار",
      date: "10 أبريل 2025",
      time: "07:00 مساءً - 10:00 مساءً",
      location: "مركز الملك عبدالعزيز التاريخي، الرياض",
      type: "حفل",
      category: "جوائز",
      attendees: "300 مدعو",
      speakers: ["معالي الوزير", "رئيس المجموعة"],
      registration: "بدعوة فقط",
      price: "مجاني",
      featured: true,
      agenda: [
        "استقبال الضيوف",
        "كلمة رئيس المجموعة",
        "توزيع الجوائز",
        "عشاء الشبكة المهنية"
      ]
    },
    {
      title: "معرض الشركات الناشئة التقنية",
      description: "معرض متخصص لعرض أحدث المنتجات والخدمات من الشركات الناشئة في المجال التقني",
      date: "5-7 مايو 2025",
      time: "10:00 صباحاً - 08:00 مساءً",
      location: "مركز الرياض الدولي للمؤتمرات والمعارض",
      type: "معرض",
      category: "أعمال",
      attendees: "2000+ زائر",
      speakers: ["نخبة من رواد الأعمال"],
      registration: "مفتوح",
      price: "100 ريال",
      featured: false,
      agenda: [
        "جولات في المعرض",
        "عروض تقديمية للشركات",
        "جلسات الشبكة المهنية",
        "مسابقة أفضل ابتكار"
      ]
    },
    {
      title: "قمة المرأة في التقنية",
      description: "فعالية مخصصة لتمكين المرأة السعودية في مجال التقنية والابتكار",
      date: "20 يونيو 2025",
      time: "09:00 صباحاً - 05:00 مساءً",
      location: "فندق الفيصلية، الرياض",
      type: "قمة",
      category: "تمكين",
      attendees: "200 سيدة",
      speakers: ["د. نورا الفايز", "أ. ريم العنزي", "م. هدى القحطاني"],
      registration: "مفتوح",
      price: "مجاني",
      featured: true,
      agenda: [
        "قصص نجاح ملهمة",
        "ورش تطوير المهارات",
        "جلسات الإرشاد المهني",
        "شبكة التواصل المهني"
      ]
    },
    {
      title: "هاكاثون الأمن السيبراني",
      description: "مسابقة برمجية مكثفة لتطوير حلول مبتكرة في مجال الأمن السيبراني",
      date: "15-16 يوليو 2025",
      time: "48 ساعة متواصلة",
      location: "جامعة الملك سعود، الرياض",
      type: "هاكاثون",
      category: "مسابقة",
      attendees: "150 مطور",
      speakers: ["خبراء الأمن السيبراني"],
      registration: "مفتوح",
      price: "مجاني",
      featured: false,
      agenda: [
        "تشكيل الفرق",
        "ورش عمل تقنية",
        "العمل على المشاريع",
        "العروض النهائية والتقييم"
      ]
    }
  ];

  const eventTypes = ["جميع الفعاليات", "منتدى", "ورشة", "حفل", "معرض", "قمة", "هاكاثون"];

  const getIconForType = (type: string) => {
    switch (type) {
      case "منتدى":
        return <Users className="w-5 h-5" />;
      case "ورشة":
        return <Lightbulb className="w-5 h-5" />;
      case "حفل":
        return <Award className="w-5 h-5" />;
      case "معرض":
        return <Building className="w-5 h-5" />;
      case "قمة":
        return <Target className="w-5 h-5" />;
      case "هاكاثون":
        return <Ticket className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "منتدى":
        return "from-blue-500 to-indigo-600";
      case "ورشة":
        return "from-emerald-500 to-teal-600";
      case "حفل":
        return "from-purple-500 to-pink-600";
      case "معرض":
        return "from-orange-500 to-red-600";
      case "قمة":
        return "from-cyan-500 to-blue-600";
      case "هاكاثون":
        return "from-yellow-500 to-orange-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/20 mb-8">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-bold text-slate-800">فعاليات قادمة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              فعاليات
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> ومؤتمرات</span>
              <br />مميزة
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              اكتشف أحدث الفعاليات والمؤتمرات التي تنظمها مجموعة علي صالح الشهري في مجالات التقنية والابتكار
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                <Ticket className="w-5 h-5 mr-2" />
                سجل في فعالية
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Calendar className="w-5 h-5 mr-2" />
                التقويم الكامل
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">12+</div>
                <div className="text-sm text-slate-600">فعالية هذا العام</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3000+</div>
                <div className="text-sm text-slate-600">مشارك</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                <div className="text-sm text-slate-600">متحدث خبير</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">25</div>
                <div className="text-sm text-slate-600">شريك استراتيجي</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Filter */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {eventTypes.map((type, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={`rounded-full ${index === 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">الفعاليات المميزة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أهم الفعاليات والمؤتمرات القادمة التي لا يجب تفويتها
            </p>
          </div>

          {/* Featured Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.filter(event => event.featured).map((event, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${getTypeColor(event.type)}`} />
                
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(event.type)} rounded-xl flex items-center justify-center`}>
                      {getIconForType(event.type)}
                    </div>
                    <Badge className="bg-red-500 text-white">
                      مميز
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors leading-tight">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed text-base">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">جدول الأعمال:</h4>
                    <ul className="space-y-1">
                      {event.agenda.slice(0, 3).map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                      {event.agenda.length > 3 && (
                        <li className="text-sm text-slate-500">...والمزيد</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">التسجيل: </span>
                      <span className={`font-medium ${event.registration === 'مفتوح' ? 'text-green-600' : 'text-orange-600'}`}>
                        {event.registration}
                      </span>
                      {event.price && (
                        <div className="text-slate-600 mt-1">الرسوم: {event.price}</div>
                      )}
                    </div>
                    <Button className={`bg-gradient-to-r ${getTypeColor(event.type)} hover:shadow-lg`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      التفاصيل والتسجيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.filter(event => !event.featured).map((event, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${getTypeColor(event.type)}`} />
                
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(event.type)} rounded-lg flex items-center justify-center`}>
                      {getIconForType(event.type)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed text-sm">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm">
                      <span className="text-slate-500">التسجيل: </span>
                      <span className={`font-medium ${event.registration === 'مفتوح' ? 'text-green-600' : 'text-orange-600'}`}>
                        {event.registration}
                      </span>
                    </div>
                    {event.price && (
                      <div className="text-sm text-slate-600 mt-1">الرسوم: {event.price}</div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full group-hover:bg-purple-50 group-hover:border-purple-200">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              كن جزءاً من فعالياتنا القادمة
            </h2>
            <p className="text-xl text-purple-100 mb-10 leading-relaxed">
              انضم إلى شبكة من المهنيين والخبراء وشارك في أحدث الفعاليات التقنية في المملكة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Calendar className="w-5 h-5 mr-2" />
                تصفح جميع الفعاليات
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl">
                  تنظيم فعالية مخصصة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default UpcomingEvents;