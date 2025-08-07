import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  HeadphonesIcon, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  Monitor,
  Smartphone,
  Wifi,
  Database,
  Lock,
  Zap,
  Star,
  Users,
  ChevronRight,
  Download,
  FileText,
  Video,
  Lightbulb,
  Search,
  Send,
  Globe,
  Calendar,
  MapPin
} from "lucide-react";

const Support = () => {
  const supportCategories = [
    {
      icon: Monitor,
      title: "دعم الأنظمة التقنية",
      description: "مساعدة في إعداد وإدارة الأنظمة والبرمجيات",
      responseTime: "15 دقيقة",
      availability: "24/7",
      color: "from-blue-500 to-cyan-500",
      bgEffect: "from-blue-500/10 to-cyan-500/10",
      urgency: "عالي"
    },
    {
      icon: Smartphone,
      title: "دعم التطبيقات",
      description: "حل مشاكل التطبيقات المحمولة والويب",
      responseTime: "30 دقيقة",
      availability: "24/5",
      color: "from-green-500 to-emerald-500",
      bgEffect: "from-green-500/10 to-emerald-500/10",
      urgency: "متوسط"
    },
    {
      icon: Database,
      title: "دعم قواعد البيانات",
      description: "إدارة وصيانة قواعد البيانات والنسخ الاحتياطية",
      responseTime: "1 ساعة",
      availability: "8/5",
      color: "from-purple-500 to-pink-500",
      bgEffect: "from-purple-500/10 to-pink-500/10",
      urgency: "متوسط"
    },
    {
      icon: Lock,
      title: "الأمن السيبراني",
      description: "حماية البيانات والأنظمة من التهديدات السيبرانية",
      responseTime: "فوري",
      availability: "24/7",
      color: "from-red-500 to-orange-500",
      bgEffect: "from-red-500/10 to-orange-500/10",
      urgency: "طارئ"
    },
    {
      icon: Wifi,
      title: "دعم الشبكات",
      description: "تكوين وإصلاح مشاكل الشبكات والاتصالات",
      responseTime: "45 دقيقة",
      availability: "12/7",
      color: "from-indigo-500 to-blue-500",
      bgEffect: "from-indigo-500/10 to-blue-500/10",
      urgency: "عالي"
    },
    {
      icon: Settings,
      title: "الصيانة العامة",
      description: "صيانة دورية وتحديثات النظام",
      responseTime: "2 ساعة",
      availability: "8/5",
      color: "from-yellow-500 to-orange-500",
      bgEffect: "from-yellow-500/10 to-orange-500/10",
      urgency: "منخفض"
    }
  ];

  const faqs = [
    {
      question: "كيف يمكنني الحصول على دعم فني سريع؟",
      answer: "يمكنك التواصل معنا عبر الهاتف المباشر أو الواتساب للحصول على استجابة فورية، أو إرسال بريد إلكتروني لطلبات الدعم غير العاجلة."
    },
    {
      question: "ما هي ساعات عمل الدعم الفني؟",
      answer: "نقدم دعماً فنياً على مدار 24 ساعة طوال أيام الأسبوع للمشاكل الطارئة، ودعماً في ساعات العمل الرسمية للاستفسارات العادية."
    },
    {
      question: "هل الدعم الفني مجاني؟",
      answer: "نعم، نقدم دعماً فنياً مجانياً لجميع عملائنا. للخدمات المتقدمة أو التدريب المخصص، قد تنطبق رسوم إضافية."
    },
    {
      question: "كم يستغرق حل المشاكل التقنية؟",
      answer: "يعتمد وقت الحل على طبيعة المشكلة. المشاكل البسيطة تُحل خلال دقائق، بينما المشاكل المعقدة قد تستغرق عدة ساعات."
    }
  ];

  const contactChannels = [
    {
      icon: Phone,
      title: "الهاتف المباشر",
      details: "0555812567",
      description: "للمشاكل الطارئة فقط",
      availability: "24/7",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      details: "0555812567",
      description: "دعم سريع ومباشر",
      availability: "24/7",
      color: "from-green-600 to-green-500"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: "support@ash.holdings",
      description: "للاستفسارات التفصيلية",
      availability: "رد خلال ساعة",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "بوابة الدعم",
      details: "support.ash.holdings",
      description: "نظام إدارة التذاكر",
      availability: "24/7",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const serviceLevel = [
    { priority: "طارئ", time: "فوري", description: "مشاكل تؤثر على العمل", color: "from-red-500 to-red-400" },
    { priority: "عالي", time: "15 دقيقة", description: "مشاكل مهمة تحتاج حل سريع", color: "from-orange-500 to-yellow-500" },
    { priority: "متوسط", time: "1 ساعة", description: "مشاكل عادية يمكن تأجيلها", color: "from-blue-500 to-cyan-500" },
    { priority: "منخفض", time: "4 ساعات", description: "استفسارات عامة وتحسينات", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <HeadphonesIcon className="w-6 h-6 text-white animate-pulse" />
                <span className="text-sm font-medium text-white/90">دعم متاح • مساعدة فورية</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                الدعم <span className="text-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">الفني</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك في حل جميع المشاكل التقنية
              </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                واتساب فوري
              </Button>
              
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                اتصال مباشر
              </Button>
            </div>

            {/* Service Level Agreement */}
            <div className="grid md:grid-cols-4 gap-4">
              {serviceLevel.map((level, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                    <div className={`text-2xl font-bold text-white mb-2 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                      {level.time}
                    </div>
                    <div className="text-sm font-medium text-white/90 mb-1">{level.priority}</div>
                    <div className="text-xs text-white/70">{level.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Settings className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">خدمات متخصصة • حلول شاملة</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                أقسام <span className="text-gradient-primary">الدعم</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                نقدم دعماً متخصصاً في جميع المجالات التقنية مع فرق خبراء مدربة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {supportCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={index}
                    className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-8 relative h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <Badge className={`bg-${category.urgency === 'طارئ' ? 'red' : category.urgency === 'عالي' ? 'orange' : category.urgency === 'متوسط' ? 'blue' : 'green'}-500/20 text-${category.urgency === 'طارئ' ? 'red' : category.urgency === 'عالي' ? 'orange' : category.urgency === 'متوسط' ? 'blue' : 'green'}-400 border-${category.urgency === 'طارئ' ? 'red' : category.urgency === 'عالي' ? 'orange' : category.urgency === 'متوسط' ? 'blue' : 'green'}-500/30 text-xs`}>
                            {category.urgency}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-gradient-primary transition-all duration-300">
                          {category.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                          {category.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">وقت الاستجابة:</span>
                            <span className="font-bold text-primary">{category.responseTime}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">التوفر:</span>
                            <span className="font-bold text-green-600">{category.availability}</span>
                          </div>
                        </div>

                        <Button className={`mt-6 w-full bg-gradient-to-r ${category.color} text-white border-0 hover:scale-105 transition-transform duration-200`}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          طلب دعم
                        </Button>

                        <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Channels */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">قنوات متعددة • تواصل سهل</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                طرق <span className="text-gradient-primary">التواصل</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactChannels.map((channel, index) => {
                const IconComponent = channel.icon;
                return (
                  <Card key={index} className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center relative h-full">
                      <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-primary mb-2">{channel.title}</h3>
                      <p className="text-lg font-mono text-secondary mb-2">{channel.details}</p>
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      <Badge variant="outline" className="bg-white/10 border-primary/30 text-primary text-xs">
                        {channel.availability}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <HelpCircle className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">أسئلة شائعة • إجابات سريعة</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                الأسئلة <span className="text-gradient-primary">الشائعة</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="premium-card hover:shadow-glow transition-all duration-500 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-3">{faq.question}</h3>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Request Form */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  طلب <span className="text-gradient-primary">دعم فني</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  أرسل طلب دعم مفصل وسنتواصل معك في أقرب وقت
                </p>
              </div>

              <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl animate-fade-in">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">الاسم الكامل</label>
                        <Input placeholder="أدخل اسمك الكامل" className="bg-white/50 border-white/30 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">البريد الإلكتروني</label>
                        <Input type="email" placeholder="your@email.com" className="bg-white/50 border-white/30 focus:border-primary" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">رقم الهاتف</label>
                        <Input placeholder="05xxxxxxxx" className="bg-white/50 border-white/30 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">أولوية المشكلة</label>
                        <select className="w-full px-3 py-2 bg-white/50 border border-white/30 rounded-md focus:border-primary focus:outline-none">
                          <option>طارئ</option>
                          <option>عالي</option>
                          <option>متوسط</option>
                          <option>منخفض</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">موضوع المشكلة</label>
                      <Input placeholder="وصف مختصر للمشكلة" className="bg-white/50 border-white/30 focus:border-primary" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">تفاصيل المشكلة</label>
                      <Textarea 
                        placeholder="اشرح المشكلة بالتفصيل، متى حدثت، وما الخطوات التي قمت بها..."
                        rows={5}
                        className="bg-white/50 border-white/30 focus:border-primary"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      إرسال طلب الدعم
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Support;