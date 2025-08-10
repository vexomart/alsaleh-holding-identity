import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import WorkingHoursNotification from "@/components/WorkingHoursNotification";
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
  
  // Job Application Form State
  const [jobFormData, setJobFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: ""
  });
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  
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

  const handleJobInputChange = (field: string, value: string) => {
    setJobFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobFormData.fullName || !jobFormData.email || !jobFormData.phone || !jobFormData.position) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!jobFormData.email.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingJob(true);

    try {
      const response = await fetch(
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/job-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobFormData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "تم إرسال الطلب بنجاح!",
          description: "سنتواصل معك قريباً",
        });
        setJobFormData({
          fullName: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          message: ""
        });
        setShowJobForm(false);
      } else {
        throw new Error(result.error || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch (error) {
      console.error("Job application error:", error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const socialLinks = [
    { 
      name: "فيسبوك", 
      href: "https://facebook.com/ash.holdings", 
      icon: Facebook, 
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-500/20",
      borderColor: "hover:border-blue-400/50"
    },
    { 
      name: "تويتر", 
      href: "https://twitter.com/ash_holdings", 
      icon: Twitter, 
      color: "hover:text-sky-400",
      bgColor: "hover:bg-sky-500/20", 
      borderColor: "hover:border-sky-400/50"
    },
    { 
      name: "إنستغرام", 
      href: "https://instagram.com/ash.holdings", 
      icon: Instagram, 
      color: "hover:text-pink-400",
      bgColor: "hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-purple-500/20",
      borderColor: "hover:border-pink-400/50"
    },
    { 
      name: "لينكدإن", 
      href: "https://linkedin.com/company/ash-holdings", 
      icon: Linkedin, 
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-600/20",
      borderColor: "hover:border-blue-500/50"
    },
    { 
      name: "يوتيوب", 
      href: "https://youtube.com/@ash.holdings", 
      icon: Youtube, 
      color: "hover:text-red-500",
      bgColor: "hover:bg-red-500/20",
      borderColor: "hover:border-red-400/50"
    },
    { 
      name: "واتساب", 
      href: "https://wa.me/966555812567", 
      icon: MessageSquare, 
      color: "hover:text-green-400",
      bgColor: "hover:bg-green-500/20",
      borderColor: "hover:border-green-400/50"
    },
    { 
      name: "تيك توك", 
      href: "https://tiktok.com/@ash.holdings", 
      icon: Globe, 
      color: "hover:text-black",
      bgColor: "hover:bg-gray-900/20",
      borderColor: "hover:border-gray-400/50"
    },
    { 
      name: "سناب شات", 
      href: "https://snapchat.com/add/ash.holdings", 
      icon: Star, 
      color: "hover:text-yellow-400",
      bgColor: "hover:bg-yellow-500/20",
      borderColor: "hover:border-yellow-400/50"
    }
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
    { name: "دليل المستخدم", href: "/user-guide", icon: FileText },
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
    { name: "طلب وظيفة", href: "/careers", icon: Users },
    { name: "فرص التدريب", href: "/training", icon: Award },
    { name: "العمل التطوعي", href: "/volunteer", icon: Heart },
    { name: "برنامج التطوير", href: "/development-program", icon: Lightbulb }
  ];

  const readyProjects = [
    { name: "جميع مشاريعنا الجاهزة", href: "/ready-projects", icon: Code },
    { name: "نظام إدارة المحتوى", href: "/ready-projects", icon: FileText },
    { name: "تطبيق التجارة الإلكترونية", href: "/ready-projects", icon: Building2 },
    { name: "منصة التعلم الذكي", href: "/ready-projects", icon: GraduationCap }
  ];

  const companyUpdates = [
    { name: "بورتال الشركة", href: "http://ash.holdings", icon: Building2 },
    { name: "أخبار الشركة", href: "/company-news", icon: Globe },
    { name: "البيانات الصحفية", href: "/press-releases", icon: FileText },
    { name: "فعاليات قادمة", href: "/upcoming-events", icon: Calendar },
    { name: "التقارير السنوية", href: "/annual-reports", icon: TrendingUp }
  ];

  const currentProjects = [
    { name: "المشاريع التقنية", href: "/tech-projects", icon: Code },
    { name: "مشاريع التجارة الإلكترونية", href: "#", icon: Globe },
    { name: "مشاريع المحاسبة", href: "#", icon: FileText }
  ];

  const digitalSolutions = [
    { name: "العمل عن بُعد", href: "/remote-work", icon: Globe },
    { name: "الذكاء الاصطناعي", href: "/ai-solutions", icon: Zap },
    { name: "إنترنت الأشياء", href: "/iot-solutions", icon: Lightbulb },
    { name: "الحوسبة السحابية", href: "/cloud-solutions", icon: Globe },
    { name: "الأمن السيبراني", href: "/security-solutions", icon: Shield },
    { name: "التقنيات والأنظمة الأساسية", href: "/technologies", icon: Code }
  ];

  const contracts = [
    { name: "طريقة التعاقد", href: "/contracts", icon: FileText },
    { name: "شروط التعاقد", href: "/contracts#requirements", icon: Shield },
    { name: "أنواع العقود", href: "/contracts#types", icon: Building2 },
    { name: "خطوات التعاقد", href: "/contracts#process", icon: Clock },
    { name: "نظام التعاقد الإلكتروني", href: "/digital-contracts", icon: Zap }
  ];

  const contactInfo = [
    { label: "البريد الإلكتروني", value: "info@ash.holdings", icon: Mail },
    { label: "الهاتف", value: "0555812567", icon: Phone },
    { label: "الموقع", value: "ash.holdings", icon: Globe }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent/8 to-secondary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-24">
          
          {/* Modern Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            
            {/* Company Info Section - Takes more space on larger screens */}
            <div className="md:col-span-2 xl:col-span-2 space-y-6 animate-fade-in">
              <div className="glass-effect p-8 rounded-3xl border border-border/20 backdrop-blur-sm hover:shadow-glow transition-all duration-500">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold gradient-text mb-4 leading-tight">
                    شركة علي صالح الشهري القابضة
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
                    من خلال دعم الابتكار والشركات الناشئة.
                  </p>
                </div>

                {/* Contact Info Cards */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary animate-pulse" />
                    معلومات التواصل
                  </h4>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => {
                      const IconComponent = info.icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover-scale">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground">{info.label}</div>
                            <div className="text-lg font-semibold text-foreground">{info.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Achievement Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 text-center hover-scale">
                    <div className="text-2xl font-bold text-primary mb-1">100+</div>
                    <div className="text-sm text-muted-foreground">مشروع ناجح</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 text-center hover-scale">
                    <div className="text-2xl font-bold text-secondary mb-1">10+</div>
                    <div className="text-sm text-muted-foreground">سنوات خبرة</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 text-center hover-scale">
                    <div className="text-2xl font-bold text-accent mb-1">6</div>
                    <div className="text-sm text-muted-foreground">مكاتب عالمية</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-xl border border-primary/20 text-center hover-scale">
                    <div className="text-2xl font-bold gradient-text mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">دعم مستمر</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Services Column */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="glass-effect p-6 rounded-2xl border border-border/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-primary animate-pulse" />
                  خدماتنا الرئيسية
                </h4>
                <ul className="space-y-3">
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={service.href} 
                          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group hover:translate-x-2 p-2 rounded-lg hover:bg-primary/5"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <span className="group-hover:font-semibold transition-all duration-300">
                            {service.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="glass-effect p-6 rounded-2xl border border-border/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
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
                          className="flex items-center gap-3 text-muted-foreground hover:text-secondary transition-all duration-300 group hover:translate-x-2 p-2 rounded-lg hover:bg-secondary/5"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="group-hover:font-semibold transition-all duration-300">
                            {link.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Support & Help */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="glass-effect p-6 rounded-2xl border border-border/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <HeadphonesIcon className="w-5 h-5 text-accent animate-pulse" />
                  الدعم والمساعدة
                </h4>
                <ul className="space-y-3">
                  {supportLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-all duration-300 group hover:translate-x-2 p-2 rounded-lg hover:bg-accent/5"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="group-hover:font-semibold transition-all duration-300">
                              {link.name}
                            </span>
                            {link.badge && (
                              <Badge className="bg-gradient-to-r from-accent to-primary text-white text-xs px-2 py-1">
                                {link.badge}
                              </Badge>
                            )}
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="glass-effect p-6 rounded-2xl border border-border/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary animate-pulse" />
                  فرص العمل
                </h4>
                <ul className="space-y-3">
                  {careersAndOpportunities.map((opportunity, index) => {
                    const IconComponent = opportunity.icon;
                    return (
                      <li key={index}>
                        <button 
                          onClick={() => opportunity.name === "طلب وظيفة" ? setShowJobForm(true) : window.location.href = opportunity.href}
                          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group hover:translate-x-2 p-2 rounded-lg hover:bg-primary/5 w-full text-right"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <span className="group-hover:font-semibold transition-all duration-300">
                            {opportunity.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Digital Solutions - Only on larger screens */}
            <div className="hidden xl:block space-y-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="glass-effect p-6 rounded-2xl border border-border/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-secondary animate-pulse" />
                  الحلول الرقمية
                </h4>
                <ul className="space-y-3">
                  {digitalSolutions.slice(0, 5).map((solution, index) => {
                    const IconComponent = solution.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={solution.href} 
                          className="flex items-center gap-3 text-muted-foreground hover:text-secondary transition-all duration-300 group hover:translate-x-2 p-2 rounded-lg hover:bg-secondary/5"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="group-hover:font-semibold transition-all duration-300 text-sm">
                            {solution.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter & Social Section */}
          <div className="mt-16 pt-12 border-t border-border/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Newsletter Signup */}
              <div className="space-y-6 animate-fade-in">
                <div className="text-center lg:text-right">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/20 mb-6">
                    <Mail className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xl font-bold text-foreground">اشترك في نشرتنا الإخبارية</span>
                  </div>
                  <p className="text-muted-foreground text-lg mb-8">
                    كن أول من يعلم بأحدث العروض والمشاريع والتطورات
                  </p>
                </div>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="اسمك (اختياري)"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      className="flex-1 h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50 transition-all duration-300"
                    />
                    <Input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="flex-1 h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50 transition-all duration-300"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="w-full h-12 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-bold text-lg shadow-glow hover:shadow-xl transition-all duration-300 hover-scale"
                  >
                    <Send className="w-5 h-5 ml-2" />
                    {isSubscribing ? "جاري الاشتراك..." : "اشترك الآن"}
                  </Button>
                </form>
                
                <WorkingHoursNotification />
              </div>

              {/* Social Media Grid */}
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-center lg:text-right">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full border border-accent/20 mb-6">
                    <Heart className="w-5 h-5 text-accent animate-pulse" />
                    <span className="text-xl font-bold text-foreground">تابعنا على وسائل التواصل</span>
                  </div>
                  <p className="text-muted-foreground text-lg mb-8">
                    ابق على اطلاع بآخر الأخبار والتحديثات
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          group flex flex-col items-center gap-3 p-6 glass-effect rounded-2xl border border-border/20 
                          hover:shadow-glow transition-all duration-300 hover-scale
                          ${social.bgColor} ${social.borderColor}
                        `}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br from-background/50 to-background/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-6 h-6 ${social.color} transition-colors duration-300`} />
                        </div>
                        <span className={`text-sm font-medium text-muted-foreground ${social.color} transition-colors duration-300`}>
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Bottom Bar */}
        <div className="py-8 border-t border-border/20 bg-background/30 backdrop-blur-sm rounded-t-3xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-right">
                <p className="text-lg font-semibold text-foreground mb-1">
                  © 2024 شركة علي صالح الشهري القابضة
                </p>
                <p className="text-muted-foreground">
                  جميع الحقوق محفوظة | شركة رائدة منذ 2016
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/20">
                <Star className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-foreground">مستوى عالمي</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-primary fill-current" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                سياسة الخصوصية
              </a>
              <span className="text-border">|</span>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                شروط الاستخدام
              </a>
              <span className="text-border">|</span>
              <a href="/support" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                الدعم الفني
              </a>
              <span className="text-border">|</span>
              <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-2xl glass-effect border border-border/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text text-center mb-4">
              طلب وظيفة - انضم لفريقنا
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleJobSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={jobFormData.fullName}
                  onChange={(e) => handleJobInputChange('fullName', e.target.value)}
                  className="h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={jobFormData.email}
                  onChange={(e) => handleJobInputChange('email', e.target.value)}
                  className="h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={jobFormData.phone}
                  onChange={(e) => handleJobInputChange('phone', e.target.value)}
                  className="h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position" className="text-foreground font-medium">المنصب المطلوب *</Label>
                <Select onValueChange={(value) => handleJobInputChange('position', value)}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50">
                    <SelectValue placeholder="اختر المنصب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">مطور برمجيات</SelectItem>
                    <SelectItem value="designer">مصمم UI/UX</SelectItem>
                    <SelectItem value="marketing">تسويق رقمي</SelectItem>
                    <SelectItem value="sales">مبيعات</SelectItem>
                    <SelectItem value="support">دعم فني</SelectItem>
                    <SelectItem value="management">إدارة مشاريع</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-foreground font-medium">سنوات الخبرة</Label>
              <Select onValueChange={(value) => handleJobInputChange('experience', value)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/30 rounded-xl focus:border-primary/50">
                  <SelectValue placeholder="اختر سنوات الخبرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh">حديث التخرج</SelectItem>
                  <SelectItem value="1-2">1-2 سنة</SelectItem>
                  <SelectItem value="3-5">3-5 سنوات</SelectItem>
                  <SelectItem value="5-10">5-10 سنوات</SelectItem>
                  <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium">رسالة تعريفية</Label>
              <Textarea
                id="message"
                value={jobFormData.message}
                onChange={(e) => handleJobInputChange('message', e.target.value)}
                placeholder="أخبرنا عن نفسك وخبراتك..."
                className="min-h-32 bg-background/50 border-border/30 rounded-xl focus:border-primary/50 resize-none"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmittingJob}
                className="flex-1 h-12 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-bold shadow-glow hover:shadow-xl transition-all duration-300"
              >
                {isSubmittingJob ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowJobForm(false)}
                className="px-8 h-12 border-border/30 hover:bg-background/50 transition-all duration-300"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;