import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  Calendar, 
  MapPin, 
  Laptop, 
  Code, 
  Lightbulb,
  Briefcase,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const Training = () => {
  const trainingPrograms = [
    {
      title: "برنامج التطوير التقني المتقدم",
      description: "برنامج شامل لتطوير المهارات التقنية في البرمجة والذكاء الاصطناعي",
      duration: "6 أشهر",
      level: "متوسط إلى متقدم",
      participants: "25 متدرب",
      startDate: "1 سبتمبر 2024",
      location: "جدة - المقر الرئيسي",
      skills: ["React", "Node.js", "Python", "AI/ML", "DevOps"],
      icon: Code,
      status: "قريباً",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "برنامج القيادة الرقمية",
      description: "تطوير مهارات القيادة في العصر الرقمي وإدارة الفرق التقنية",
      duration: "3 أشهر",
      level: "للمدراء والقادة",
      participants: "15 متدرب",
      startDate: "15 أكتوبر 2024",
      location: "الرياض - فرع رئيسي",
      skills: ["القيادة الرقمية", "إدارة المشاريع", "التحول الرقمي"],
      icon: Users,
      status: "قريباً",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "برنامج ريادة الأعمال التقنية",
      description: "تطوير مهارات ريادة الأعمال وبناء الشركات الناشئة التقنية",
      duration: "4 أشهر",
      level: "للمبتدئين",
      participants: "30 متدرب",
      startDate: "1 نوفمبر 2024",
      location: "دبي - مكتب إقليمي",
      skills: ["ريادة الأعمال", "نموذج الأعمال", "التمويل", "التسويق الرقمي"],
      icon: Lightbulb,
      status: "قريباً",
      color: "from-orange-500 to-red-600"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "شهادات معتمدة",
      description: "احصل على شهادات معتمدة من جهات دولية مرموقة"
    },
    {
      icon: Briefcase,
      title: "فرص وظيفية",
      description: "أولوية في التوظيف بالشركات التابعة للمجموعة"
    },
    {
      icon: Users,
      title: "شبكة مهنية",
      description: "انضم لشبكة من المتخصصين والخبراء في المجال"
    },
    {
      icon: Laptop,
      title: "أدوات متطورة",
      description: "استخدم أحدث الأدوات والتقنيات في التدريب"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-800">فرص التدريب المتميزة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              استثمر في
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> مستقبلك المهني</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              انضم إلى برامج التدريب المتطورة التي تقدمها مجموعة علي صالح الشهري واحصل على أفضل الفرص لتطوير مهاراتك المهنية والتقنية
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 mr-2" />
                سجل الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Clock className="w-5 h-5 mr-2" />
                تحميل الدليل
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-slate-600">متدرب سنوياً</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
                <div className="text-sm text-slate-600">معدل التوظيف</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                <div className="text-sm text-slate-600">برنامج تدريبي</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                <div className="text-sm text-slate-600">عام خبرة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">برامج التدريب المتاحة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر البرنامج التدريبي الذي يناسب مستواك وطموحاتك المهنية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${program.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge 
                        variant={program.status === "قريباً" ? "outline" : "secondary"} 
                        className={`text-xs ${program.status === "قريباً" ? 'border-amber-400 text-amber-600 bg-amber-50' : ''}`}
                      >
                        {program.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {program.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{program.participants}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{program.startDate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{program.location}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">المهارات المكتسبة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${program.status === "قريباً" ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-gray-400 hover:bg-gray-500'}`}
                      disabled={program.status === "قريباً"}
                    >
                      {program.status === "قريباً" ? "قريباً - ترقبوا الإعلان" : "قريباً"}
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
            <h2 className="text-4xl font-bold text-white mb-6">مزايا برامج التدريب</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              احصل على مزايا حصرية تضمن لك أفضل تجربة تدريبية وفرص مهنية متميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              ابدأ رحلتك المهنية معنا اليوم
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              لا تفوت الفرصة للانضمام إلى أفضل برامج التدريب في المنطقة. سجل الآن واحصل على مستقبل مهني متميز
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <CheckCircle className="w-5 h-5 mr-2" />
                سجل في برنامج
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Training;