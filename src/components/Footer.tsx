import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Target, 
  Award, 
  Clock, 
  Shield, 
  HeadphonesIcon, 
  MessageCircle, 
  FileText, 
  Globe, 
  Heart, 
  Star, 
  ChevronRight,
  ExternalLink,
  Building2,
  Lightbulb,
  TrendingUp,
  Zap,
  Eye,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare
} from "lucide-react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch(
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/newsletter-subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI`,
          },
          body: JSON.stringify({
            email: newsletterEmail,
            name: newsletterName || undefined,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم الاشتراك بنجاح!",
          description: result.message,
        });
        setNewsletterEmail("");
        setNewsletterName("");
      } else {
        throw new Error(result.error || result.message || "حدث خطأ أثناء الاشتراك");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "خطأ في الاشتراك",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { name: "فيسبوك", href: "https://facebook.com/AliAlshehriHolding", icon: Facebook, color: "hover:text-blue-400" },
    { name: "تويتر", href: "https://twitter.com/AliAlshehriHold", icon: Twitter, color: "hover:text-sky-400" },
    { name: "إنستغرام", href: "https://instagram.com/alialshehriholds", icon: Instagram, color: "hover:text-pink-400" },
    { name: "لينكدإن", href: "https://linkedin.com/company/ali-alshehri-holding", icon: Linkedin, color: "hover:text-blue-600" },
    { name: "يوتيوب", href: "https://youtube.com/@AliAlshehriHolding", icon: Youtube, color: "hover:text-red-500" },
    { name: "واتساب", href: "https://wa.me/966555812567", icon: MessageSquare, color: "hover:text-green-400" }
  ];

  const quickLinks = [
    { name: "الرئيسية", href: "#hero", icon: Home },
    { name: "من نحن", href: "/about", icon: Users },
    { name: "رؤيتنا", href: "/vision", icon: Target },
    { name: "فريق العمل", href: "/team", icon: Award },
    { name: "تواصل معنا", href: "/contact", icon: Mail }
  ];

  const supportLinks = [
    { name: "الدعم الفني", href: "/support", icon: HeadphonesIcon, badge: "24/7" },
    { name: "الأسئلة الشائعة", href: "/faq", icon: MessageCircle },
    { name: "دليل المستخدم", href: "#guide", icon: FileText },
    { name: "سياسة الخصوصية", href: "/privacy", icon: Shield },
    { name: "شروط الاستخدام", href: "/terms", icon: FileText }
  ];

  const services = [
    { name: "الاستثمار التقني", href: "/tech-investment", icon: TrendingUp },
    { name: "التطوير والابتكار", href: "/development", icon: Lightbulb },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Building2 },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Zap }
  ];

  const contactInfo = [
    { label: "البريد الإلكتروني", value: "info@ash.holdings", icon: Mail },
    { label: "الهاتف", value: "0555812567", icon: Phone },
    { label: "الموقع", value: "ash.holdings", icon: Globe }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-12">
            
            {/* Company Info Section */}
            <div className="lg:col-span-1 space-y-6 animate-fade-in">
              <div>
                <h3 className="text-3xl font-bold text-primary-foreground mb-4 group hover:text-secondary transition-colors duration-300">
                  شركة علي صالح الشهري القابضة
                </h3>
                <p className="text-primary-foreground/80 leading-relaxed text-lg">
                  شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
                  من خلال دعم الابتكار والشركات الناشئة.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 animate-pulse" />
                  معلومات التواصل
                </h4>
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center group-hover:bg-secondary/30 transition-colors duration-300">
                        <IconComponent className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-foreground/60">{contact.label}</p>
                        <p className="text-primary-foreground/90 font-medium">{contact.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 mt-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  تقييم ممتاز
                </Badge>
              </div>
            </div>

            {/* Vision Section */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary animate-pulse" />
                رؤيتنا العالمية
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20 group hover:bg-secondary/15 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="text-primary-foreground font-bold text-sm">رؤية 2030+</h5>
                  </div>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    نقود مستقبل التقنية عالمياً من خلال الابتكار المستمر والشراكات الاستراتيجية
                  </p>
                </div>
                
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20 group hover:bg-secondary/15 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="text-primary-foreground font-bold text-sm">رسالتنا</h5>
                  </div>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    تطوير حلول تقنية مبتكرة تحسن جودة الحياة وتدعم التنمية المستدامة
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="text-lg font-bold text-secondary">68+</div>
                    <div className="text-xs text-primary-foreground/60">دولة</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="text-lg font-bold text-secondary">2.5M+</div>
                    <div className="text-xs text-primary-foreground/60">مستخدم</div>
                  </div>
                </div>

                <a 
                  href="/vision" 
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium text-sm group/vision mt-3"
                >
                  <span>اكتشف رؤيتنا الكاملة</span>
                  <ChevronRight className="w-4 h-4 group-hover/vision:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-secondary animate-pulse" />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:font-medium transition-all duration-300">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help & Support */}
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-secondary animate-pulse" />
                المساعدة والدعم
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center justify-between text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {link.name}
                          </span>
                        </div>
                        {link.badge && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {link.badge}
                          </Badge>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary animate-pulse" />
                خدماتنا المتميزة
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={service.href} 
                        className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-2"
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:font-medium transition-all duration-300">
                          {service.name}
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* CTA Section */}
              <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20 group hover:bg-secondary/15 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-secondary animate-pulse" />
                  <h5 className="text-primary-foreground font-bold">ابدأ مشروعك معنا</h5>
                </div>
                <p className="text-primary-foreground/70 text-sm mb-3">
                  انضم إلى رحلة النجاح والابتكار
                </p>
                <a 
                  href="https://wa.me/966555812567?text=مرحباً، أريد بدء مشروع جديد معكم" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-300 font-medium text-sm group/cta"
                >
                  <span>تواصل معنا الآن</span>
                  <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform duration-300" />
                </a>
            </div>

            {/* Newsletter & Social Media */}
            <div className="animate-fade-in" style={{ animationDelay: "1.0s" }}>
              {/* Newsletter Subscription */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-secondary animate-pulse" />
                  النشرة الإخبارية
                </h4>
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <p className="text-primary-foreground/80 text-sm mb-4 leading-relaxed">
                    اشترك في نشرتنا الإخبارية لتحصل على أحدث الأخبار والتطورات
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="الاسم (اختياري)"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
                    />
                    <Input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium"
                    >
                      {isSubscribing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          جاري الاشتراك...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          اشترك الآن
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h4 className="text-xl font-bold text-primary-foreground mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-secondary animate-pulse" />
                  تابعنا على
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-all duration-300 group hover:scale-105 ${social.color}`}
                      >
                        <IconComponent className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs text-primary-foreground/80 group-hover:text-primary-foreground transition-colors duration-300">
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Social Stats */}
                <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-primary-foreground font-bold text-sm">إحصائيات التواصل</h5>
                    <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">125K+</div>
                      <div className="text-xs text-primary-foreground/60">متابع</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">89%</div>
                      <div className="text-xs text-primary-foreground/60">تفاعل</div>
                    </div>
                  </div>
                </div>

                {/* Newsletter Count */}
                <div className="mt-4 text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-lg font-bold text-secondary">15,000+</div>
                  <div className="text-xs text-primary-foreground/60">مشترك في النشرة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright & Legal Info */}
            <div className="text-center md:text-right space-y-2">
              <p className="text-primary-foreground/60 text-lg">
                © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
              </p>
              <div className="space-y-1">
                <p className="text-primary-foreground/50 text-sm flex items-center justify-center md:justify-start gap-2">
                  <Building2 className="w-4 h-4" />
                  السجل التجاري: 4030554749
                </p>
                <p className="text-primary-foreground/50 text-sm flex items-center justify-center md:justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  الرقم الضريبي: 312206352700003
                </p>
              </div>
              <p className="text-primary-foreground/40 text-sm mt-1">
                تم التطوير بأحدث التقنيات العالمية
              </p>
            </div>

            {/* Achievements */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:scale-105 transition-transform duration-200">
                🏆 أفضل شركة قابضة 2024
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:scale-105 transition-transform duration-200">
                🌟 ISO معتمد
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:scale-105 transition-transform duration-200">
                🚀 رائد التقنية
              </Badge>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">جميع الأنظمة تعمل بكفاءة</span>
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;