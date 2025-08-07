import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Clock, MessageCircle, Users, ArrowRight, Send, Star, Sparkles, Zap, Heart, ChevronRight, Calendar, Headphones, Shield } from "lucide-react";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      titleEn: "Email Support",
      value: "info@ash.holdings",
      description: "للاستفسارات العامة والمراسلات الرسمية",
      color: "from-blue-600 to-cyan-600",
      bgEffect: "from-blue-500/10 to-cyan-500/10",
      responseTime: "خلال 2-4 ساعات",
      isAvailable: true
    },
    {
      icon: Phone,
      title: "الهاتف المباشر",
      titleEn: "Direct Phone",
      value: "0555812567",
      description: "للتواصل الفوري والاستشارات العاجلة",
      color: "from-green-600 to-emerald-600",
      bgEffect: "from-green-500/10 to-emerald-500/10",
      responseTime: "فوري",
      isAvailable: true
    },
    {
      icon: MessageCircle,
      title: "الدردشة المباشرة",
      titleEn: "Live Chat",
      value: "متاح الآن",
      description: "للحصول على إجابات سريعة ومساعدة فورية",
      color: "from-purple-600 to-pink-600",
      bgEffect: "from-purple-500/10 to-pink-500/10",
      responseTime: "خلال ثوانٍ",
      isAvailable: true
    },
    {
      icon: Calendar,
      title: "موعد شخصي",
      titleEn: "Personal Meeting",
      value: "احجز موعدك",
      description: "لقاءات شخصية ومناقشات تفصيلية للمشاريع",
      color: "from-orange-600 to-red-600",
      bgEffect: "from-orange-500/10 to-red-500/10",
      responseTime: "بحسب الجدولة",
      isAvailable: true
    }
  ];

  const workingHours = [
    { day: "الأحد - الخميس", hours: "9:00 ص - 6:00 م", status: "ساعات العمل الرسمية" },
    { day: "الجمعة", hours: "2:00 م - 6:00 م", status: "دوام مختصر" },
    { day: "السبت", hours: "مغلق", status: "يوم الراحة الأسبوعية" },
    { day: "خدمة العملاء", hours: "24/7", status: "متاحة على مدار الساعة" }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-red-900 dark:via-orange-900 dark:to-pink-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-100/40 via-transparent to-orange-100/40"></div>
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-red-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-red-300/5 to-orange-300/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">تواصل معنا • نحن في خدمتكم</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            تواصل <span className="text-gradient-primary">معنا</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            فريقنا المتخصص جاهز للإجابة على استفساراتكم ومناقشة الفرص الاستثمارية والتقنية المبتكرة
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Enhanced Contact Methods */}
          <div className="space-y-8">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-primary mb-4 flex items-center gap-3">
                <Headphones className="w-8 h-8 animate-pulse" />
                طرق التواصل المتقدمة
              </h3>
              <p className="text-muted-foreground text-lg">
                اختر الطريقة الأنسب لك للتواصل معنا والحصول على الدعم المطلوب
              </p>
            </div>

            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              
              return (
                <Card 
                  key={index} 
                  className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in hover:transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-6 relative">
                    {/* Background overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                    
                    <div className="relative z-10 flex items-start gap-4">
                      {/* Enhanced Icon */}
                      <div className={`relative w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        <IconComponent className="w-8 h-8 text-white group-hover:animate-pulse" />
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold text-primary group-hover:text-gradient-primary transition-all duration-300">
                            {method.title}
                          </h4>
                          {method.isAvailable && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              متاح الآن
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-secondary/80 font-medium mb-2">
                          {method.titleEn}
                        </p>
                        
                        <p className="text-lg font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
                          {method.value}
                        </p>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {method.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-400 font-medium">
                              الرد: {method.responseTime}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Enhanced Right Side Content */}
          <div className="space-y-8">
            {/* Partnership Section */}
            <Card className="premium-card border-0 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary">
                      شراكة نحو المستقبل
                    </h3>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                    نؤمن بقوة الشراكات الاستراتيجية في بناء مستقبل أفضل. إذا كنت تملك فكرة مبتكرة 
                    أو مشروع تقني واعد، فنحن نرحب بالتواصل معك لاستكشاف فرص التعاون والاستثمار.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      "استثمارات تقنية مبتكرة ومتطورة",
                      "دعم الشركات الناشئة والمشاريع الواعدة",
                      "شراكات استراتيجية طويلة المدى",
                      "برامج التطوير والتمويل المتخصصة"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 group/item">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                        <span className="text-muted-foreground group-hover/item:text-primary transition-colors duration-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-6 text-lg font-bold shadow-glow transition-all duration-300 hover:scale-105 group/btn"
                    >
                      <a 
                        href="https://wa.me/966555812567?text=مرحباً، أريد بدء محادثة حول خدماتكم"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Send className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        ابدأ المحادثة الآن
                      </a>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 group/btn"
                      onClick={() => window.open('/jobs', '_blank')}
                    >
                      <Users className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                      طلب توظيف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Working Hours */}
            <Card className="premium-card border-0 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">مواعيد العمل</h3>
                </div>
                
                <div className="space-y-4">
                  {workingHours.map((schedule, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div>
                        <p className="font-bold text-primary group-hover:text-gradient-primary transition-all duration-300">
                          {schedule.day}
                        </p>
                        <p className="text-sm text-muted-foreground">{schedule.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-secondary direction-ltr">{schedule.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-3xl p-12 animate-fade-in border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
            <h3 className="text-4xl font-bold text-primary">تواصل آمن وموثوق</h3>
            <Sparkles className="w-8 h-8 text-secondary animate-bounce" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">&lt;2h</div>
              <div className="text-xl font-semibold text-primary mb-1">متوسط الرد</div>
              <div className="text-sm text-muted-foreground">Average Response</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-xl font-semibold text-primary mb-1">خدمة العملاء</div>
              <div className="text-sm text-muted-foreground">Customer Service</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">99%</div>
              <div className="text-xl font-semibold text-primary mb-1">معدل الرضا</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>

          {/* Location & Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🏢 المملكة العربية السعودية
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🌐 ash.holdings
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🔒 تواصل آمن 100%
            </Badge>
          </div>

          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <p className="text-lg text-primary font-semibold mb-2">
              نحن ملتزمون بالرد السريع والمساعدة الفعالة لتحقيق أهدافكم وطموحاتكم
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>فريق الدعم متاح الآن للإجابة على جميع استفساراتكم</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;