import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  Building,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Star,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `
🆔 رسالة جديدة من موقع البطاقات الإلكترونية

👤 الاسم: ${formData.name}
📧 البريد: ${formData.email}
📱 الهاتف: ${formData.phone}
📋 الموضوع: ${formData.subject}

💬 الرسالة:
${formData.message}
    `;
    
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم إرسال رسالتك بنجاح! 🎉",
      description: "سيتم تحويلك لواتساب لإكمال المحادثة",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const contactMethods = [
    {
      title: "واتساب",
      description: "تواصل معنا عبر واتساب",
      icon: MessageCircle,
      value: "+966 50 000 0000",
      action: () => window.open("https://wa.me/966500000000?text=مرحباً! أريد الاستفسار", '_blank'),
      color: "from-green-500 to-emerald-600",
      available: true
    },
    {
      title: "مكالمة هاتفية",
      description: "اتصل بنا مباشرة",
      icon: Phone,
      value: "+966 50 000 0000",
      action: () => window.open('tel:+966500000000', '_blank'),
      color: "from-blue-500 to-indigo-600",
      available: true
    },
    {
      title: "البريد الإلكتروني",
      description: "راسلنا عبر الإيميل",
      icon: Mail,
      value: "info@cards-store.com",
      action: () => window.open('mailto:info@cards-store.com', '_blank'),
      color: "from-red-500 to-rose-600",
      available: true
    },
    {
      title: "الدعم الفني",
      description: "للمساعدة التقنية",
      icon: Headphones,
      value: "دعم فوري",
      action: () => window.open("https://wa.me/966500000000?text=مرحباً! أحتاج دعم فني", '_blank'),
      color: "from-purple-500 to-violet-600",
      available: true
    }
  ];

  const workingHours = [
    { day: "السبت - الخميس", hours: "9:00 ص - 11:00 م", available: true },
    { day: "الجمعة", hours: "2:00 م - 11:00 م", available: true },
    { day: "الدعم الفني", hours: "24/7 متاح", available: true }
  ];

  const socialMedia = [
    { name: "فيسبوك", icon: Facebook, url: "#", color: "bg-blue-600" },
    { name: "تويتر", icon: Twitter, url: "#", color: "bg-sky-500" },
    { name: "انستغرام", icon: Instagram, url: "#", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { name: "لينكدإن", icon: Linkedin, url: "#", color: "bg-blue-700" },
    { name: "يوتيوب", icon: Youtube, url: "#", color: "bg-red-600" }
  ];

  const features = [
    {
      icon: Shield,
      title: "أمان مضمون",
      description: "جميع المعلومات محمية بأعلى معايير الأمان"
    },
    {
      icon: Zap,
      title: "استجابة سريعة",
      description: "نرد على جميع الاستفسارات خلال ساعة واحدة"
    },
    {
      icon: Star,
      title: "خدمة مميزة",
      description: "فريق مختص ومدرب لتقديم أفضل خدمة"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs md:text-sm font-medium flex items-center justify-center gap-2">
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة <span className="text-blue-400 font-bold">شركة علي صالح الشهري القابضة</span>
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  🛍️ متجر البطاقات الإلكترونية
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">المتجر الأول والأكثر ثقة</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                💬 واتساب
              </Button>
              
              <Link to="/cards-store">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <Badge className="bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary mb-6 text-lg px-6 py-3 border border-primary/20">
            <MessageCircle className="w-5 h-5 ml-2" />
            تواصل معنا
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            نحن هنا 
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              لمساعدتك
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            فريق خدمة العملاء متاح على مدار الساعة للإجابة على جميع استفساراتك ومساعدتك في الحصول على أفضل تجربة تسوق
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{feature.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📞 طرق التواصل
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              اختر الطريقة الأنسب للتواصل معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                  onClick={method.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {method.description}
                    </p>
                    <p className="text-primary font-semibold">{method.value}</p>
                    {method.available && (
                      <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        متاح الآن
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Send className="w-6 h-6 text-primary" />
                    أرسل لنا رسالة
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400">
                    املأ النموذج أدناه وسنتواصل معك في أقرب وقت
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                          الاسم الكامل *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                          رقم الهاتف *
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="05XXXXXXXX"
                          required
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        البريد الإلكتروني *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        موضوع الرسالة *
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="ما موضوع استفسارك؟"
                        required
                        className="text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        الرسالة *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="اكتب رسالتك هنا..."
                        rows={5}
                        required
                        className="text-right"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg py-6"
                    >
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الرسالة عبر واتساب
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Working Hours & Info */}
              <div className="space-y-6">
                {/* Working Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-primary" />
                      أوقات العمل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {workingHours.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white">{schedule.day}</span>
                          {schedule.available && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              متاح
                            </Badge>
                          )}
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">{schedule.hours}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      موقعنا
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">المملكة العربية السعودية</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">نخدم جميع مناطق المملكة</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">شركة علي صالح الشهري القابضة</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">الشركة الأم للمتجر</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>تابعنا على وسائل التواصل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {socialMedia.map((social, index) => {
                        const IconComponent = social.icon;
                        return (
                          <a
                            key={index}
                            href={social.url}
                            className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center hover:scale-110 transition-transform text-white`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تحتاج مساعدة فورية؟
            </h2>
            <p className="text-xl opacity-90">
              اختر الطريقة الأسرع للحصول على المساعدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Button 
              size="lg"
              onClick={() => window.open("https://wa.me/966500000000?text=مرحباً! أحتاج مساعدة في الشراء", '_blank')}
              className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm h-auto p-6 flex-col space-y-2"
            >
              <ShoppingCart className="w-8 h-8" />
              <span className="text-lg font-bold">مساعدة في الشراء</span>
              <span className="text-sm opacity-80">نساعدك في اختيار البطاقة المناسبة</span>
            </Button>

            <Button 
              size="lg"
              onClick={() => window.open("https://wa.me/966500000000?text=مرحباً! أحتاج دعم فني", '_blank')}
              className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm h-auto p-6 flex-col space-y-2"
            >
              <Headphones className="w-8 h-8" />
              <span className="text-lg font-bold">دعم فني</span>
              <span className="text-sm opacity-80">حل المشاكل التقنية</span>
            </Button>

            <Button 
              size="lg"
              onClick={() => window.open("https://wa.me/966500000000?text=مرحباً! لدي استفسار عام", '_blank')}
              className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm h-auto p-6 flex-col space-y-2"
            >
              <MessageCircle className="w-8 h-8" />
              <span className="text-lg font-bold">استفسار عام</span>
              <span className="text-sm opacity-80">أي سؤال آخر تريد الاستفسار عنه</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;