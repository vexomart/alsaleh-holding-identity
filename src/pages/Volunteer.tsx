import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  GraduationCap,
  Lightbulb,
  Code,
  Globe,
  Building,
  CheckCircle,
  ArrowLeft,
  HandHeart
} from "lucide-react";
import { Link } from "react-router-dom";

const Volunteer = () => {
  const volunteerOpportunities = [
    {
      title: "مطور متطوع للمشاريع التقنية",
      description: "ساهم في تطوير تطبيقات ومواقع إلكترونية لخدمة المجتمع والمؤسسات الخيرية",
      category: "تقني",
      timeCommitment: "10 ساعات أسبوعياً",
      duration: "6 أشهر",
      location: "عن بُعد",
      skills: ["React", "Node.js", "JavaScript", "UI/UX"],
      impact: "خدمة +1000 مستفيد",
      icon: Code,
      color: "from-blue-500 to-indigo-600",
      urgent: false,
      comingSoon: true
    },
    {
      title: "مدرب في برامج التمكين الرقمي",
      description: "ساعد في تدريب الشباب على المهارات التقنية الأساسية وريادة الأعمال",
      category: "تعليمي",
      timeCommitment: "6 ساعات أسبوعياً",
      duration: "3 أشهر",
      location: "جدة - الرياض",
      skills: ["التدريب", "التواصل", "المهارات التقنية"],
      impact: "تدريب +200 متدرب",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
      urgent: false,
      comingSoon: true
    },
    {
      title: "استشاري تطوير الأعمال للشركات الناشئة",
      description: "قدم الاستشارات المجانية للشركات الناشئة في مجال التقنية والابتكار",
      category: "استشاري",
      timeCommitment: "4 ساعات أسبوعياً",
      duration: "مرن",
      location: "دبي - عمان",
      skills: ["استراتيجية الأعمال", "التخطيط", "الإدارة"],
      impact: "دعم +50 شركة ناشئة",
      icon: Lightbulb,
      color: "from-orange-500 to-red-600",
      urgent: false,
      comingSoon: true
    },
    {
      title: "منسق مشاريع المسؤولية المجتمعية",
      description: "ساعد في تنظيم وتنسيق فعاليات ومبادرات المسؤولية المجتمعية للشركة",
      category: "إداري",
      timeCommitment: "8 ساعات أسبوعياً",
      duration: "12 شهر",
      location: "جميع المكاتب",
      skills: ["إدارة المشاريع", "التنظيم", "التواصل"],
      impact: "تنظيم +20 فعالية",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      urgent: false,
      comingSoon: true
    }
  ];

  const volunteerBenefits = [
    {
      icon: Building,
      title: "خبرة مهنية حقيقية",
      description: "اكتسب خبرة عملية في بيئة عمل احترافية مع فرق متخصصة"
    },
    {
      icon: Globe,
      title: "شبكة علاقات واسعة",
      description: "تواصل مع محترفين وخبراء من مختلف أنحاء العالم"
    },
    {
      icon: CheckCircle,
      title: "شهادات تقدير",
      description: "احصل على شهادات معتمدة تؤكد مساهمتك التطوعية"
    },
    {
      icon: HandHeart,
      title: "أثر إيجابي حقيقي",
      description: "كن جزءاً من مشاريع تحدث فرقاً حقيقياً في المجتمع"
    }
  ];

  const impactStats = [
    { number: "2,500+", label: "متطوع نشط", icon: Users },
    { number: "150+", label: "مشروع مكتمل", icon: CheckCircle },
    { number: "50,000+", label: "مستفيد من خدماتنا", icon: Heart },
    { number: "25", label: "دولة نخدمها", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-purple-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-500/20 mb-8">
              <Heart className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">العمل التطوعي المؤثر</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              كن جزءاً من
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> التغيير الإيجابي</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              انضم إلى مجتمع المتطوعين في مجموعة علي صالح الشهري وساهم في بناء مستقبل أفضل من خلال مشاريع تقنية واجتماعية مؤثرة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                <Heart className="w-5 h-5 mr-2" />
                ابدأ التطوع الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Users className="w-5 h-5 mr-2" />
                تعرف على قصص المتطوعين
              </Button>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">فرص التطوع المتاحة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر المجال الذي يناسب مهاراتك واهتماماتك وابدأ رحلة التطوع المؤثر
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => {
              const IconComponent = opportunity.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${opportunity.color}`} />
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${opportunity.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {opportunity.category}
                        </Badge>
                        {opportunity.comingSoon ? (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            قريباً
                          </Badge>
                        ) : opportunity.urgent ? (
                          <Badge className="bg-red-500 text-white text-xs">
                            عاجل
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{opportunity.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Heart className="w-4 h-4" />
                        <span>{opportunity.impact}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">المهارات المطلوبة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gray-400 hover:bg-gray-500 cursor-not-allowed" disabled>
                      قريباً - تحت التطوير
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">مزايا التطوع معنا</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              احصل على فوائد قيمة من خلال مشاركتك التطوعية التي تساهم في تطوير مهاراتك وبناء مستقبلك المهني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">كيف تبدأ التطوع؟</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              خطوات بسيطة للانضمام إلى فريق المتطوعين وبدء رحلة التأثير الإيجابي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">اختر مجال التطوع</h3>
              <p className="text-slate-600">تصفح الفرص المتاحة واختر المجال الذي يناسب مهاراتك واهتماماتك</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">تقدم بطلب التطوع</h3>
              <p className="text-slate-600">املأ النموذج وأرسل طلبك مع تحديد الوقت المتاح لديك للتطوع</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">ابدأ التطوع</h3>
              <p className="text-slate-600">بعد القبول، احضر جلسة التوجيه وابدأ رحلة التطوع المؤثر</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              ابدأ رحلة التطوع اليوم
            </h2>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              كن جزءاً من مجتمع يؤمن بقوة العطاء والتأثير الإيجابي. انضم إلينا الآن وساهم في بناء مستقبل أفضل للجميع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Heart className="w-5 h-5 mr-2" />
                تقدم للتطوع
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold rounded-xl">
                  لديك سؤال؟
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Volunteer;