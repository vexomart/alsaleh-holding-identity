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
  Calendar,
  Brain
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
    { name: "مركز الذكاء الاصطناعي", href: "/ai-intelligence", icon: Brain, badge: "جديد" },
    { name: "الاستثمار التقني", href: "/tech-investment", icon: TrendingUp },
    { name: "التطوير والابتكار", href: "/development", icon: Lightbulb },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Building2 },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Zap }
  ];

  const careersAndOpportunities = [
    { name: "طلب وظيفة", href: "/careers", icon: Users },
    { name: "فرص التدريب", href: "/training", icon: Award },
    { name: "العمل التطوعي", href: "/volunteer", icon: Users },
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
    { label: "البريد الإلكتروني", value: "info@alialshehriholding.com", icon: Mail },
    { label: "الهاتف", value: "0555812567", icon: Phone },
    { label: "الموقع", value: "ash.holdings", icon: Globe }
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="py-16">
          
          {/* Top Section - Company Info & Newsletter */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16 pb-16 border-b border-white/10">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  شركة علي صالح الشهري القابضة
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                  شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل 
                  من خلال دعم الابتكار والشركات الناشئة والحلول التقنية المتطورة.
                </p>
              </div>
              
              {/* Contact Information */}
              <div className="flex flex-wrap gap-8 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">البريد الإلكتروني</div>
                    <div className="text-white font-medium">info@alialshehriholding.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">الهاتف</div>
                    <div className="text-white font-medium">0555812567</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">الموقع الإلكتروني</div>
                    <div className="text-white font-medium">alialshehriholding.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Send className="w-5 h-5" />
                اشترك في النشرة الإخبارية
              </h3>
              <p className="text-gray-300 mb-6">
                احصل على آخر الأخبار والتحديثات حول خدماتنا ومشاريعنا الجديدة
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                >
                  {isSubscribing ? "جاري الاشتراك..." : "اشترك الآن"}
                </Button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-16">
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Home className="w-5 h-5" />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                خدماتنا
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={service.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{service.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Digital Solutions */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الحلول الرقمية
              </h4>
              <ul className="space-y-3">
                {digitalSolutions.map((solution, index) => {
                  const IconComponent = solution.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={solution.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{solution.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Careers and Opportunities */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                الوظائف والفرص
              </h4>
              <ul className="space-y-3">
                {careersAndOpportunities.map((career, index) => {
                  const IconComponent = career.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={career.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                        onClick={career.name === "طلب وظيفة" ? (e) => {
                          e.preventDefault();
                          setShowJobForm(true);
                        } : undefined}
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{career.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Ready Projects */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Code className="w-5 h-5" />
                المشاريع الجاهزة
              </h4>
              <ul className="space-y-3">
                {readyProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={project.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{project.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                الدعم والمساعدة
              </h4>
              <ul className="space-y-3">
                {supportLinks.slice(0, 5).map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{link.name}</span>
                        {link.badge && (
                          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                            {link.badge}
                          </Badge>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Additional Sections Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 pb-8 border-b border-white/10">
            
            {/* Current Projects */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                المشاريع الحالية
              </h4>
              <ul className="space-y-3">
                {currentProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={project.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{project.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contracts */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                التعاقد
              </h4>
              <ul className="space-y-3">
                {contracts.map((contract, index) => {
                  const IconComponent = contract.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={contract.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{contract.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Company Updates */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                أخبار الشركة
              </h4>
              <ul className="space-y-3">
                {companyUpdates.map((update, index) => {
                  const IconComponent = update.icon;
                  return (
                    <li key={index}>
                      <a 
                        href={update.href} 
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                        <span>{update.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-12 border-y border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100+</div>
              <div className="text-gray-400">مشروع ناجح</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-400">سنوات خبرة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">عميل راضي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">دعم مستمر</div>
            </div>
          </div>

          {/* Social Media & Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            
            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 text-center lg:text-right">تابعنا على</h4>
              <div className="flex justify-center lg:justify-start gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Working Hours */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Clock className="w-5 h-5" />
                ساعات العمل
              </h4>
              <div className="space-y-2 text-gray-300">
                <div>الأحد - الخميس: 8:00 ص - 6:00 م</div>
                <div>الجمعة - السبت: 9:00 ص - 2:00 م</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-right">
              © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/privacy" className="hover:text-white transition-colors duration-200">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-200">
                شروط الاستخدام
              </a>
              <a href="/cookie-policy" className="hover:text-white transition-colors duration-200">
                سياسة ملفات تعريف الارتباط
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours Notification */}
      <WorkingHoursNotification />

      {/* Job Application Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              طلب وظيفة
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJobSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={jobFormData.fullName}
                  onChange={(e) => handleJobInputChange('fullName', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={jobFormData.email}
                  onChange={(e) => handleJobInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={jobFormData.phone}
                  onChange={(e) => handleJobInputChange('phone', e.target.value)}
                  placeholder="05xxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">المنصب المرغوب *</Label>
                <Select 
                  value={jobFormData.position} 
                  onValueChange={(value) => handleJobInputChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">مطور برمجيات</SelectItem>
                    <SelectItem value="designer">مصمم جرافيك</SelectItem>
                    <SelectItem value="marketing">أخصائي تسويق</SelectItem>
                    <SelectItem value="sales">أخصائي مبيعات</SelectItem>
                    <SelectItem value="support">دعم فني</SelectItem>
                    <SelectItem value="manager">مدير مشروع</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">سنوات الخبرة</Label>
              <Select 
                value={jobFormData.experience} 
                onValueChange={(value) => handleJobInputChange('experience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر سنوات الخبرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">أقل من سنة</SelectItem>
                  <SelectItem value="1-3">1-3 سنوات</SelectItem>
                  <SelectItem value="3-5">3-5 سنوات</SelectItem>
                  <SelectItem value="5-10">5-10 سنوات</SelectItem>
                  <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">رسالة إضافية</Label>
              <Textarea
                id="message"
                value={jobFormData.message}
                onChange={(e) => handleJobInputChange('message', e.target.value)}
                placeholder="أخبرنا عن نفسك وسبب اهتمامك بالعمل معنا..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmittingJob}
              className="w-full"
            >
              {isSubmittingJob ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;