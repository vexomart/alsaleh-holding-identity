import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400 animate-pulse" />
                  معلومات التواصل
                </h4>
                <div className="space-y-3">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300">
                        <IconComponent className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-xs text-slate-400">{info.label}</div>
                          <div className="text-sm text-white font-medium">{info.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">100+</div>
                  <div className="text-xs text-slate-300">مشروع ناجح</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/20 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">10+</div>
                  <div className="text-xs text-slate-300">سنوات خبرة</div>
                </div>
              </div>
            </div>
            
            {/* Column 2: Services */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {/* Main Services */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400 animate-pulse" />
                  خدماتنا الرئيسية
                </h4>
                <ul className="space-y-2">
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={service.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {service.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Digital Solutions */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                  الحلول الرقمية
                </h4>
                <ul className="space-y-2">
                  {digitalSolutions.map((solution, index) => {
                    const IconComponent = solution.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={solution.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-yellow-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {solution.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Column 3: Company Updates */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {/* Company Updates */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400 animate-pulse" />
                  أخبار الشركة
                </h4>
                <ul className="space-y-2">
                  {companyUpdates.map((update, index) => {
                    const IconComponent = update.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={update.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {update.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400 animate-pulse" />
                  روابط سريعة
                </h4>
                <ul className="space-y-2">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-all duration-300 group hover:translate-x-1 text-sm"
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

              {/* Ready Projects */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-400 animate-pulse" />
                  المشاريع الجاهزة
                </h4>
                <ul className="space-y-2">
                  {readyProjects.map((project, index) => {
                    const IconComponent = project.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={project.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {project.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Column 4: Contracts */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {/* Contracts */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400 animate-pulse" />
                  العقود
                </h4>
                <ul className="space-y-2">
                  {contracts.map((contract, index) => {
                    const IconComponent = contract.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={contract.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {contract.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Careers */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400 animate-pulse" />
                  الوظائف والفرص
                </h4>
                <ul className="space-y-2">
                  {careersAndOpportunities.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-all duration-300 group hover:translate-x-1 text-sm"
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

            {/* Column 5: Support & Help */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              {/* Help & Support */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-red-400 animate-pulse" />
                  المساعدة والدعم
                </h4>
                <ul className="space-y-2">
                  {supportLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center justify-between text-slate-300 hover:text-red-400 transition-all duration-300 group hover:translate-x-1 text-sm"
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
            </div>

            {/* Column 6: Company Updates */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              {/* Company Updates */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
                  تحديثات الشركة
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/company-updates" 
                      className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                    >
                      <ChevronRight className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:font-medium transition-all duration-300">
                        تحديثات الشركة الداخلية
                      </span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/company-news" 
                      className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                    >
                      <ChevronRight className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:font-medium transition-all duration-300">
                        أخبار الشركة
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Current Projects */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-400 animate-pulse" />
                  مشاريعنا الحالية
                </h4>
                <ul className="space-y-2">
                  {currentProjects.map((project, index) => {
                    const IconComponent = project.icon;
                    return (
                      <li key={index}>
                        <a 
                          href={project.href} 
                          className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-all duration-300 group hover:translate-x-1 text-sm"
                        >
                          <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {project.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Column 7: Newsletter & Social Media */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              {/* Newsletter Subscription */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400 animate-pulse" />
                  النشرة الإخبارية
                </h4>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <p className="text-slate-300 text-xs mb-3 leading-relaxed">
                    اشترك في نشرتنا الإخبارية لتحصل على أحدث الأخبار والتطورات
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="الاسم (اختياري)"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 text-sm"
                    />
                    <Input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 text-sm"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubscribing}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 text-sm"
                    >
                      {isSubscribing ? "جاري الاشتراك..." : "اشتراك"}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
                  تابعنا
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-1 p-2 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group hover:scale-105 ${social.color}`}
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors duration-300">{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Application Dialog */}
        <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold text-center">
                طلب توظيف
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={jobFormData.fullName}
                    onChange={(e) => handleJobInputChange("fullName", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={jobFormData.email}
                    onChange={(e) => handleJobInputChange("email", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={jobFormData.phone}
                    onChange={(e) => handleJobInputChange("phone", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-white">المنصب المطلوب *</Label>
                  <Select value={jobFormData.position} onValueChange={(value) => handleJobInputChange("position", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="اختر المنصب" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="مطور ويب">مطور ويب</SelectItem>
                      <SelectItem value="مطور تطبيقات">مطور تطبيقات</SelectItem>
                      <SelectItem value="مصمم جرافيك">مصمم جرافيك</SelectItem>
                      <SelectItem value="مسؤول تسويق">مسؤول تسويق</SelectItem>
                      <SelectItem value="محاسب">محاسب</SelectItem>
                      <SelectItem value="مدير مشروع">مدير مشروع</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-white">سنوات الخبرة</Label>
                <Select value={jobFormData.experience} onValueChange={(value) => handleJobInputChange("experience", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="اختر سنوات الخبرة" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="0-1">0-1 سنة</SelectItem>
                    <SelectItem value="2-3">2-3 سنوات</SelectItem>
                    <SelectItem value="4-5">4-5 سنوات</SelectItem>
                    <SelectItem value="6-10">6-10 سنوات</SelectItem>
                    <SelectItem value="أكثر من 10">أكثر من 10 سنوات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">رسالة تعريفية</Label>
                <Textarea
                  id="message"
                  value={jobFormData.message}
                  onChange={(e) => handleJobInputChange("message", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  placeholder="أخبرنا عن نفسك وسبب اهتمامك بالعمل معنا..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmittingJob ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowJobForm(false)}
                  className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-slate-700/50 pt-8 pb-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left side - Copyright */}
            <div className="flex flex-col lg:flex-row items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <span>© 2024 شركة علي صالح الشهري القابضة.</span>
                <span className="text-slate-500">جميع الحقوق محفوظة.</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/privacy" className="hover:text-white transition-colors duration-300">
                  سياسة الخصوصية
                </a>
                <span className="text-slate-600">|</span>
                <a href="/terms" className="hover:text-white transition-colors duration-300">
                  شروط الاستخدام
                </a>
              </div>
            </div>

            {/* Center - Achievements */}
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/20">
                <Award className="w-3 h-3 text-green-400" />
                <span className="text-green-300">ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/20">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-blue-300">SOC 2 معتمد</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20">
                <Star className="w-3 h-3 text-purple-400" />
                <span className="text-purple-300">عضو CITC</span>
              </div>
            </div>

            {/* Right side - Status indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-xs">الأنظمة تعمل بصورة طبيعية</span>
              </div>
              <div className="text-slate-500 text-xs">
                آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;