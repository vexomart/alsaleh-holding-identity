import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SignLanguageSupport from "@/components/SignLanguageSupport";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Phone, MapPin, Globe, Clock, MessageCircle, Users, ArrowRight, Send, 
  Star, Sparkles, Zap, Heart, ChevronRight, Calendar, Headphones, Shield,
  Building, MessageSquare, User, FileText, Check
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/contact-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "تم إرسال الرسالة بنجاح",
          description: "سنتواصل معك خلال 24 ساعة",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          category: ""
        });
      } else {
        throw new Error(result.error || "حدث خطأ أثناء إرسال الرسالة");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      value: "+966 55 581 2567",
      description: "للتواصل الفوري والاستشارات العاجلة",
      color: "from-green-600 to-emerald-600",
      bgEffect: "from-green-500/10 to-emerald-500/10",
      responseTime: "فوري",
      isAvailable: true
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      titleEn: "WhatsApp",
      value: "+966 55 581 2567",
      description: "للتواصل السريع عبر واتساب",
      color: "from-green-600 to-green-700",
      bgEffect: "from-green-500/10 to-green-600/10",
      responseTime: "خلال دقائق",
      isAvailable: true
    },
    {
      icon: MapPin,
      title: "العنوان",
      titleEn: "Office Address",
      value: "الرياض، المملكة العربية السعودية",
      description: "مكتبنا الرئيسي للقاءات الشخصية",
      color: "from-purple-600 to-pink-600",
      bgEffect: "from-purple-500/10 to-pink-500/10",
      responseTime: "بحسب الموعد",
      isAvailable: true
    }
  ];

  const contactCategories = [
    "استفسار عام",
    "فرصة استثمارية",
    "طلب شراكة",
    "الحصول على خدمة",
    "شكوى أو اقتراح",
    "طلب توظيف",
    "استفسار تقني",
    "أخرى"
  ];

  const workingHours = [
    { day: "الأحد - الخميس", hours: "9:00 ص - 6:00 م", status: "ساعات العمل الرسمية" },
    { day: "الجمعة", hours: "2:00 م - 6:00 م", status: "دوام مختصر" },
    { day: "السبت", hours: "مغلق", status: "يوم الراحة الأسبوعية" },
    { day: "خدمة العملاء", hours: "24/7", status: "متاحة على مدار الساعة" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-teal-200/20" />
        <div className="absolute top-1/4 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <MessageCircle className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">تواصل معنا • نحن في خدمتكم</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
              تواصل <span className="text-gradient-primary">معنا</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              فريقنا المتخصص جاهز للإجابة على استفساراتكم ومناقشة الفرص الاستثمارية والتقنية المبتكرة
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
                  <Send className="w-8 h-8 animate-pulse" />
                  أرسل رسالتك
                </h2>
                <p className="text-muted-foreground text-lg">
                  املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                </p>
              </div>

              <Card className="premium-card border-0 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الاسم الكامل *
                        </label>
                        <Input
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-white/10 border-white/20 text-primary placeholder:text-primary/60"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-white/10 border-white/20 text-primary placeholder:text-primary/60"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </label>
                        <Input
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-white/10 border-white/20 text-primary placeholder:text-primary/60"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          نوع الاستفسار
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">اختر نوع الاستفسار</option>
                          {contactCategories.map((category, index) => (
                            <option key={index} value={category} className="bg-background text-foreground">
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        موضوع الرسالة
                      </label>
                      <Input
                        type="text"
                        placeholder="ما هو موضوع رسالتك؟"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="bg-white/10 border-white/20 text-primary placeholder:text-primary/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        رسالتك *
                      </label>
                      <Textarea
                        placeholder="اكتب رسالتك هنا..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="bg-white/10 border-white/20 text-primary placeholder:text-primary/60 min-h-[120px]"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-6 text-lg font-bold shadow-glow transition-all duration-300 hover:scale-105 group"
                    >
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Methods */}
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
                      <div className={`absolute inset-0 bg-gradient-to-br ${method.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`relative w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                          <IconComponent className="w-8 h-8 text-white group-hover:animate-pulse" />
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`} />
                        </div>
                        
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

              {/* Working Hours */}
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

          {/* Stats Section */}
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

      <Footer />
      <WhatsAppButton />
      <SignLanguageSupport />
    </div>
  );
};

export default Contact;