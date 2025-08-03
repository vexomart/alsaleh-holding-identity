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
  MessageSquare,
  Code,
  GraduationCap,
  Calendar
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

  const careersAndOpportunities = [
    { name: "طلب وظيفة", href: "/job-application", icon: Users },
    { name: "فرص التدريب", href: "/training", icon: Award },
    { name: "العمل التطوعي", href: "/volunteer", icon: Heart },
    { name: "برنامج التطوير", href: "/development-program", icon: Lightbulb }
  ];

  const readyProjects = [
    { name: "منصة إمكان التقنية", href: "#emkan-platform", icon: Code },
    { name: "نظام إدارة المحتوى", href: "#cms-system", icon: FileText },
    { name: "تطبيق التجارة الإلكترونية", href: "#ecommerce-app", icon: Building2 },
    { name: "منصة التعلم الذكي", href: "#learning-platform", icon: GraduationCap }
  ];

  const companyUpdates = [
    { name: "أخبار الشركة", href: "#company-news", icon: Globe },
    { name: "البيانات الصحفية", href: "#press-releases", icon: FileText },
    { name: "فعاليات قادمة", href: "#upcoming-events", icon: Calendar },
    { name: "التقارير السنوية", href: "#annual-reports", icon: TrendingUp }
  ];

  const digitalSolutions = [
    { name: "الذكاء الاصطناعي", href: "#ai-solutions", icon: Zap },
    { name: "إنترنت الأشياء", href: "#iot-solutions", icon: Lightbulb },
    { name: "الحوسبة السحابية", href: "#cloud-solutions", icon: Globe },
    { name: "الأمن السيبراني", href: "#security-solutions", icon: Shield }
  ];

  const contactInfo = [
    { label: "البريد الإلكتروني", value: "info@ash.holdings", icon: Mail },
    { label: "الهاتف", value: "0555812567", icon: Phone },
    { label: "الموقع", value: "ash.holdings", icon: Globe }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-20">
          {/* Global Presence Map */}
          <div className="mb-20 text-center animate-fade-in">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-6">
                <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-xl font-bold text-white">تواجدنا العالمي</span>
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto">
                نخدم عملائنا من خلال شبكة مكاتبنا المنتشرة عبر ثلاث قارات
              </p>
            </div>
            
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-10 border border-slate-700/50 backdrop-blur-sm max-w-6xl mx-auto">
              {/* World Map SVG */}
              <div className="relative w-full h-72 mb-8">
                <svg 
                  viewBox="0 0 800 400" 
                  className="w-full h-full opacity-30"
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simplified world map outline */}
                  <path
                    d="M150 200 Q200 180 250 200 Q300 220 350 200 Q400 180 450 200 Q500 220 550 200 Q600 180 650 200"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-400"
                    fill="none"
                  />
                  <circle cx="200" cy="220" r="3" fill="currentColor" className="text-slate-400" />
                  <circle cx="350" cy="190" r="3" fill="currentColor" className="text-slate-400" />
                  <circle cx="500" cy="210" r="3" fill="currentColor" className="text-slate-400" />
                  <circle cx="600" cy="180" r="3" fill="currentColor" className="text-slate-400" />
                  <circle cx="150" cy="160" r="3" fill="currentColor" className="text-slate-400" />
                </svg>
                
                {/* Location pins */}
                <div className="absolute inset-0">
                  {/* جدة */}
                  <div className="absolute" style={{ left: '15%', top: '65%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg ring-2 ring-red-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        جدة - المقر الرئيسي
                      </div>
                    </div>
                  </div>
                  
                  {/* الرياض */}
                  <div className="absolute" style={{ left: '20%', top: '60%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse shadow-lg ring-2 ring-green-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        الرياض - فرع رئيسي
                      </div>
                    </div>
                  </div>
                  
                  {/* دبي */}
                  <div className="absolute" style={{ left: '25%', top: '62%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse shadow-lg ring-2 ring-blue-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        دبي - مكتب إقليمي
                      </div>
                    </div>
                  </div>
                  
                  {/* عمان */}
                  <div className="absolute" style={{ left: '23%', top: '58%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg ring-2 ring-yellow-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        عمان - مكتب تمثيلي
                      </div>
                    </div>
                  </div>
                  
                  {/* الأردن */}
                  <div className="absolute" style={{ left: '21%', top: '55%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse shadow-lg ring-2 ring-orange-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        الأردن - مكتب تنسيق
                      </div>
                    </div>
                  </div>
                  
                  {/* ألمانيا */}
                  <div className="absolute" style={{ left: '50%', top: '35%' }}>
                    <div className="relative group">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse shadow-lg ring-2 ring-purple-400/50"></div>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600">
                        ألمانيا - مكتب أوروبي
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full ring-2 ring-red-400/30"></div>
                  <span className="text-white text-sm font-medium">جدة</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full ring-2 ring-green-400/30"></div>
                  <span className="text-white text-sm font-medium">الرياض</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full ring-2 ring-blue-400/30"></div>
                  <span className="text-white text-sm font-medium">دبي</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full ring-2 ring-yellow-400/30"></div>
                  <span className="text-white text-sm font-medium">عمان</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full ring-2 ring-orange-400/30"></div>
                  <span className="text-white text-sm font-medium">الأردن</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full ring-2 ring-purple-400/30"></div>
                  <span className="text-white text-sm font-medium">ألمانيا</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-1">6</div>
                    <div className="text-sm text-slate-300">مكاتب عالمية</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/20">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">3</div>
                    <div className="text-sm text-slate-300">قارات</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-400 mb-1">24/7</div>
                    <div className="text-sm text-slate-300">دعم مستمر</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
            
            {/* Column 1: Company Info & Contact */}
            <div className="space-y-8 animate-fade-in lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4 group hover:text-blue-400 transition-colors duration-300">
                  شركة علي صالح الشهري القابضة
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
                  من خلال دعم الابتكار والشركات الناشئة.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  معلومات التواصل
                </h4>
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 group hover:scale-[1.02] transition-transform duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 border border-slate-600">
                          <IconComponent className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">{contact.label}</p>
                          <p className="text-slate-200 font-medium text-sm">{contact.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-yellow-400 text-sm font-medium">تقييم ممتاز</span>
              </div>
            </div>

            {/* Column 2: Quick Links & Services */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-secondary animate-pulse" />
                  روابط سريعة
                </h4>
                <ul className="space-y-2">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {link.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-secondary animate-pulse" />
                  خدماتنا المتميزة
                </h4>
                <ul className="space-y-2">
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={service.href} 
                          className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {service.name}
                          </span>
                          <ExternalLink className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Column 3: Support & Careers */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {/* Help & Support */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-secondary animate-pulse" />
                  المساعدة والدعم
                </h4>
                <ul className="space-y-2">
                  {supportLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center justify-between text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
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

              {/* Careers & Opportunities */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary animate-pulse" />
                  الوظائف والفرص
                </h4>
                <ul className="space-y-2">
                  {careersAndOpportunities.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {link.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Column 4: Newsletter & Social Media */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              {/* Newsletter Subscription */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary animate-pulse" />
                  النشرة الإخبارية
                </h4>
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <p className="text-primary-foreground/80 text-xs mb-3 leading-relaxed">
                    اشترك في نشرتنا الإخبارية لتحصل على أحدث الأخبار والتطورات
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="الاسم (اختياري)"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 text-sm h-8"
                    />
                    <Input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 text-sm h-8"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      size="sm"
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium"
                    >
                      {isSubscribing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          جاري الاشتراك...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-3 h-3" />
                          اشترك الآن
                        </span>
                      )}
                    </Button>
                  </form>
                  
                  {/* Newsletter Stats */}
                  <div className="mt-3 text-center p-2 bg-white/5 rounded-lg">
                    <div className="text-sm font-bold text-secondary">15,000+</div>
                    <div className="text-xs text-primary-foreground/60">مشترك</div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h4 className="text-lg font-bold text-primary-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-secondary animate-pulse" />
                  تابعنا على
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-1 p-2 bg-secondary/10 rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-all duration-300 group hover:scale-105 ${social.color}`}
                      >
                        <IconComponent className="w-4 h-4 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs text-primary-foreground/80 group-hover:text-primary-foreground transition-colors duration-300">
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Social Stats */}
                <div className="mt-4 p-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-primary-foreground font-bold text-xs">إحصائيات التواصل</h5>
                    <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-secondary">125K+</div>
                      <div className="text-xs text-primary-foreground/60">متابع</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-secondary">89%</div>
                      <div className="text-xs text-primary-foreground/60">تفاعل</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 group hover:bg-secondary/15 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-secondary animate-pulse" />
                  <h5 className="text-primary-foreground font-bold text-sm">ابدأ مشروعك معنا</h5>
                </div>
                <p className="text-primary-foreground/70 text-xs mb-2">
                  انضم إلى رحلة النجاح والابتكار
                </p>
                <a 
                  href="https://wa.me/966555812567?text=مرحباً، أريد بدء مشروع جديد معكم" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors duration-300 font-medium text-xs group/cta"
                >
                  <span>تواصل معنا الآن</span>
                  <ChevronRight className="w-3 h-3 group-hover/cta:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright & Legal Info */}
            <div className="text-center md:text-right space-y-2">
              <p className="text-primary-foreground/60 text-base">
                © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
              </p>
              <div className="space-y-1 text-primary-foreground/50 text-xs leading-relaxed">
                <p className="max-w-4xl">
                  شركة علي صالح الشهري القابضة | نوع الكيان: شركة | رأس المال: 500,000 ريال سعودي | رقم السجل التجاري: 4030554749 | هاتف: 0555812567 | العنوان: 5081 شارع الأمير سلطان – حي البساتين، المملكة العربية السعودية | الموقع الإلكتروني: www.alialshehriholding.com | مرخصة من وزارة التجارة.
                </p>
                <p className="text-primary-foreground/50 text-sm flex items-center justify-center md:justify-start gap-2 mt-2">
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