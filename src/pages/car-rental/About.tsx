import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import CarRentalFooter from "@/components/CarRentalFooter";
import { 
  Car,
  Award,
  Users,
  MapPin,
  Clock,
  Shield,
  Star,
  CheckCircle,
  TrendingUp,
  Target,
  Eye,
  Heart,
  Zap,
  Calendar,
  Phone,
  Mail,
  Globe,
  Building,
  Trophy,
  Sparkles,
  ArrowRight,
  Play,
  Download
} from "lucide-react";

const About = () => {
  const [activeTab, setActiveTab] = useState('story');

  const companyStats = [
    { 
      icon: Award, 
      number: "15+", 
      label: "جائزة دولية", 
      color: "text-yellow-500",
      description: "جوائز التميز والجودة"
    },
    { 
      icon: Users, 
      number: "25,000+", 
      label: "عميل سعيد", 
      color: "text-blue-500",
      description: "عملاء راضون عن خدماتنا"
    },
    { 
      icon: Car, 
      number: "1,200+", 
      label: "سيارة", 
      color: "text-green-500",
      description: "أسطول متنوع وحديث"
    },
    { 
      icon: MapPin, 
      number: "50+", 
      label: "مدينة", 
      color: "text-purple-500",
      description: "مواقع في جميع أنحاء المملكة"
    },
    { 
      icon: Clock, 
      number: "12", 
      label: "سنة خبرة", 
      color: "text-orange-500",
      description: "من الخبرة والتميز"
    },
    { 
      icon: Star, 
      number: "4.9/5", 
      label: "تقييم", 
      color: "text-red-500",
      description: "متوسط تقييم العملاء"
    }
  ];

  const milestones = [
    {
      year: "2012",
      title: "بداية الرحلة",
      description: "تأسيس الشركة بأسطول صغير من 20 سيارة",
      icon: Building,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2015",
      title: "التوسع الإقليمي",
      description: "افتتاح فروع في 10 مدن سعودية",
      icon: MapPin,
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2018",
      title: "التطوير التقني",
      description: "إطلاق التطبيق الذكي وخدمات الحجز الإلكتروني",
      icon: Zap,
      color: "from-purple-500 to-indigo-500"
    },
    {
      year: "2020",
      title: "جوائز التميز",
      description: "حصولنا على جائزة أفضل شركة تأجير سيارات",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500"
    },
    {
      year: "2022",
      title: "الاستدامة البيئية",
      description: "إضافة السيارات الكهربائية والهجينة للأسطول",
      icon: Sparkles,
      color: "from-green-500 to-teal-500"
    },
    {
      year: "2024",
      title: "القيادة الذكية",
      description: "تطوير خدمات الذكاء الاصطناعي وخدمة العملاء المتقدمة",
      icon: Target,
      color: "from-red-500 to-pink-500"
    }
  ];

  const teamMembers = [
    {
      name: "أحمد الشهري",
      position: "المدير التنفيذي",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      experience: "15 سنة خبرة"
    },
    {
      name: "فاطمة النور",
      position: "مديرة العمليات",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face",
      experience: "12 سنة خبرة"
    },
    {
      name: "محمد العلي",
      position: "مدير خدمة العملاء",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      experience: "10 سنوات خبرة"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "الأمان والثقة",
      description: "نضع أمان عملائنا في المقدمة مع أعلى معايير السلامة",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "خدمة العملاء",
      description: "نهتم بكل عميل ونسعى لتقديم تجربة استثنائية",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "التطوير المستمر",
      description: "نطور خدماتنا باستمرار لمواكبة أحدث التقنيات",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Eye,
      title: "الشفافية",
      description: "وضوح في الأسعار والشروط بدون رسوم خفية",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const tabs = [
    { id: 'story', label: 'قصتنا', icon: Building },
    { id: 'team', label: 'فريقنا', icon: Users },
    { id: 'values', label: 'قيمنا', icon: Heart },
    { id: 'timeline', label: 'مسيرتنا', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-8">
              <BackButton fallbackPath="/car-rental-landing" />
              <div className="flex-1">
                <Badge className="mb-4 bg-blue-500 text-white">من نحن</Badge>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                  رحلة التميز في عالم تأجير السيارات
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  منذ أكثر من عقد من الزمان، نقود قطاع تأجير السيارات في المملكة العربية السعودية بخدمات متميزة وأسطول حديث يضمن راحة وأمان عملائنا في كل رحلة.
                </p>
              </div>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-fade-in">
              {companyStats.map((stat, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 mb-12 animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'story' && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">قصة نجاح ملهمة</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      بدأت رحلتنا في عام 2012 برؤية واضحة: تقديم خدمات تأجير سيارات متميزة تلبي احتياجات العملاء المتنوعة في المملكة العربية السعودية. ما بدأ كشركة صغيرة بأسطول من 20 سيارة، نما ليصبح واحداً من أكبر مزودي خدمات تأجير السيارات في المنطقة.
                    </p>
                    <p>
                      نؤمن بأن كل رحلة تحكي قصة، ونحن هنا لنجعل كل قصة مميزة. من خلال الاستثمار في أحدث التقنيات وأفضل الخدمات، نجحنا في بناء ثقة أكثر من 25,000 عميل راضٍ عن خدماتنا.
                    </p>
                    <p>
                      اليوم، نفتخر بأسطولنا المتنوع من أكثر من 1,200 سيارة تغطي جميع الفئات، من السيارات الاقتصادية إلى السيارات الفاخرة والكهربائية، مع وجود في أكثر من 50 مدينة عبر المملكة.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300" asChild>
                      <a href="/car-rental/services">
                        <ArrowRight className="w-5 h-5 mr-2" />
                        اكتشف خدماتنا
                      </a>
                    </Button>
                    <Button variant="outline">
                      <Play className="w-5 h-5 mr-2" />
                      شاهد الفيديو
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="مقر الشركة"
                    className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">فريق العمل المتميز</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  يقود شركتنا فريق من الخبراء المتخصصين في مجال تأجير السيارات والخدمات اللوجستية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <img 
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                      <Badge variant="outline" className="text-xs">
                        {member.experience}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">قيمنا ومبادئنا</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  نلتزم بمجموعة من القيم الأساسية التي تحدد هويتنا وتوجه كل قراراتنا وأعمالنا
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-12 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">مسيرة النجاح</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  رحلة مليئة بالإنجازات والتطوير المستمر منذ التأسيس وحتى اليوم
                </p>
              </div>

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                        <milestone.icon className="w-8 h-8 text-white" />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent mt-4"></div>
                      )}
                    </div>
                    <Card className="flex-1 group-hover:shadow-xl transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge className={`bg-gradient-to-r ${milestone.color} text-white`}>
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-bold">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12 text-white text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">انضم إلى رحلتنا</h2>
            <p className="text-xl mb-8 opacity-90">
              كن جزءاً من قصة نجاحنا واستمتع بخدمات تأجير السيارات الأفضل في المملكة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all" asChild>
                <a href="/car-booking">
                  <Car className="w-5 h-5 mr-2" />
                  احجز سيارتك الآن
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-all" asChild>
                <a href="/car-rental/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  تواصل معنا
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <CarRentalFooter />
      </div>
    </div>
  );
};

export default About;