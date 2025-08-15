import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardsStoreHeader } from "@/components/cards-store/CardsStoreHeader";
import { CardsStoreFooter } from "@/components/cards-store/CardsStoreFooter";
import { motion } from "framer-motion";
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Globe, 
  Zap, 
  Shield,
  TrendingUp,
  Star,
  Building,
  MessageCircle,
  Phone
} from "lucide-react";

const About = () => {
  const milestones = [
    {
      year: "2020",
      title: "تأسيس الشركة",
      description: "بداية رحلتنا في عالم البطاقات الإلكترونية",
      icon: Building
    },
    {
      year: "2021", 
      title: "أول 1000 عميل",
      description: "وصلنا إلى ألف عميل راضي عن خدماتنا",
      icon: Users
    },
    {
      year: "2022",
      title: "التوسع الإقليمي",
      description: "بدأنا في خدمة عملاء من جميع أنحاء المنطقة",
      icon: Globe
    },
    {
      year: "2023",
      title: "أكبر متجر",
      description: "أصبحنا أكبر متجر للبطاقات الإلكترونية في المملكة",
      icon: Award
    },
    {
      year: "2024",
      title: "15,000+ عميل",
      description: "تجاوزنا 15 ألف عميل راضي عن خدماتنا",
      icon: TrendingUp
    }
  ];

  const values = [
    {
      title: "الثقة والأمان",
      description: "نضمن لك بطاقات أصلية 100% من المصادر الرسمية",
      icon: Shield,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "السرعة والكفاءة", 
      description: "خدمة فورية وتوصيل البطاقات في ثوانٍ معدودة",
      icon: Zap,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "خدمة العملاء",
      description: "دعم متاح 24/7 لضمان أفضل تجربة لعملائنا",
      icon: Heart,
      color: "from-red-500 to-rose-600"
    },
    {
      title: "الابتكار المستمر",
      description: "نطور خدماتنا باستمرار لنواكب احتياجات العصر",
      icon: Target,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const team = [
    {
      name: "علي صالح الشهري",
      position: "المؤسس والرئيس التنفيذي",
      description: "رائد أعمال مع أكثر من 15 سنة خبرة في التجارة الإلكترونية",
      image: "👨‍💼"
    },
    {
      name: "فريق التطوير",
      position: "مطورو النظام",
      description: "فريق متخصص في تطوير حلول تقنية متقدمة",
      image: "👥"
    },
    {
      name: "فريق خدمة العملاء",
      position: "دعم العملاء",
      description: "فريق متفان لخدمة العملاء على مدار الساعة",
      image: "🎧"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <CardsStoreHeader 
        showBackButton={true}
        title="🛍️ متجر البطاقات الإلكترونية - عن المتجر"
        subtitle="تعرف على قصة نجاحنا ورؤيتنا"
      />

      {/* Hero Section */}
      <motion.section 
        className="py-16 md:py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary mb-6 text-lg px-6 py-3 border border-primary/20 backdrop-blur-sm">
              <Building className="w-5 h-5 ml-2" />
              عن متجر البطاقات الإلكترونية المتطور
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            قصة نجاح متميزة في عالم 
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              البطاقات الإلكترونية
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            منذ تأسيسنا في عام 2020، نسعى لتقديم أفضل الخدمات في مجال البطاقات الإلكترونية والرقمية 
            بأعلى معايير الجودة والأمان والابتكار في المملكة العربية السعودية ومنطقة الشرق الأوسط
          </motion.p>
        </div>
      </motion.section>

      {/* Our Story */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📖 قصتنا
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              رحلة من الرؤية إلى التحقيق لنصبح الخيار الأول للبطاقات الإلكترونية
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-8">
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">الرؤية</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      نسعى لأن نكون الخيار الأول والأكثر ثقة في المملكة العربية السعودية لجميع احتياجات 
                      البطاقات الإلكترونية والرقمية، مع تقديم تجربة عملاء استثنائية تتميز بالأمان والسرعة والجودة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">الرسالة</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      نلتزم بتوفير بطاقات إلكترونية أصلية بأفضل الأسعار، مع ضمان الجودة والأمان وخدمة 
                      عملاء متميزة على مدار الساعة. نهدف إلى تسهيل الوصول للمحتوى الرقمي لجميع عملائنا.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              🚀 رحلة النجاح
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              أهم المحطات في مسيرتنا المهنية
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-blue-600"></div>

              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div key={index} className="relative flex items-center mb-12">
                    {/* Timeline Dot */}
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg z-10">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <Card className="ml-8 flex-1 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary text-white text-lg px-3 py-1">
                            {milestone.year}
                          </Badge>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 dark:text-slate-400">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              💎 قيمنا الأساسية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              المبادئ التي نؤمن بها ونعمل وفقاً لها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              👥 فريق العمل
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              الأشخاص المبدعون وراء نجاح متجرنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">{member.image}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📊 إنجازاتنا بالأرقام
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: "15,000+", label: "عميل راضي", icon: "👥" },
              { number: "100+", label: "نوع بطاقة", icon: "🎫" },
              { number: "24/7", label: "دعم فني", icon: "🛟" },
              { number: "100%", label: "بطاقات أصلية", icon: "✅" }
            ].map((stat, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 text-center p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل لديك أسئلة؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            فريقنا مستعد للإجابة على جميع استفساراتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => {
                const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن المتجر";
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              تواصل عبر واتساب
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.open('tel:+966500000000', '_blank')}
            >
              <Phone className="w-5 h-5 ml-2" />
              اتصل بنا
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;