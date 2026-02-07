/**
 * Footer - Premium Enterprise Footer
 * Comprehensive RTL-native footer with all sections
 * Mobile: Accordion-based | Desktop: Multi-column grid
 */

import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Building2,
  Users,
  Eye,
  History,
  Globe,
  Heart,
  Code,
  Brain,
  Rocket,
  Cloud,
  Smartphone,
  Monitor,
  Package,
  Briefcase,
  Headphones,
  HelpCircle,
  FileText,
  BookOpen,
  Newspaper,
  Calendar,
  BarChart3,
  GraduationCap,
  UserPlus,
  Shield,
  Award,
  ChevronDown,
  ExternalLink,
  Zap,
  Palette,
  Megaphone,
  Settings,
  Lock,
  Cookie,
  Scale,
  Star,
  ArrowLeft,
  Sparkles,
  LayoutGrid
} from "lucide-react";

// Footer Section Component for Mobile Accordion
interface FooterSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FooterSection = ({ title, icon: Icon, children, defaultOpen = false }: FooterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 lg:border-0">
      {/* Mobile Accordion Header */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:hidden text-start"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </div>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Desktop Header */}
      <h4 className="hidden lg:flex items-center gap-2 font-bold text-sm mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {title}
      </h4>

      {/* Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 lg:overflow-visible",
        isOpen ? "max-h-[600px] pb-4" : "max-h-0 lg:max-h-none"
      )}>
        {children}
      </div>
    </div>
  );
};

// Link Item Component
interface FooterLinkProps {
  href: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
}

const FooterLink = ({ href, icon: Icon, children, external }: FooterLinkProps) => {
  const baseClassName = "flex items-center gap-2 text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300 py-1.5 group";
  
  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={baseClassName}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />}
        <span>{children}</span>
        <ExternalLink className="w-3 h-3 opacity-40" />
      </a>
    );
  }

  return (
    <Link to={href} className={baseClassName}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />}
      <span>{children}</span>
    </Link>
  );
};

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newsletterEmail }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم الاشتراك بنجاح!",
          description: result.message,
        });
        setNewsletterEmail("");
      } else {
        throw new Error(result.error || "حدث خطأ أثناء الاشتراك");
      }
    } catch (error) {
      toast({
        title: "خطأ في الاشتراك",
        description: error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { name: "فيسبوك", href: "https://facebook.com/ash.holdings", icon: Facebook },
    { name: "تويتر", href: "https://twitter.com/ash_holdings", icon: Twitter },
    { name: "إنستغرام", href: "https://instagram.com/ash.holdings", icon: Instagram },
    { name: "لينكدإن", href: "https://linkedin.com/company/ash-holdings", icon: Linkedin },
    { name: "يوتيوب", href: "https://youtube.com/@ash.holdings", icon: Youtube },
    { name: "واتساب", href: "https://wa.me/966555812567", icon: MessageSquare },
  ];

  return (
    <footer 
      className="relative bg-slate-900 text-white overflow-hidden w-full flex-shrink-0" 
      dir="rtl"
      style={{
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" 
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content */}
        <div className="py-12 lg:py-20">
          
          {/* Top Section - Company Info & Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-12 pb-12 border-b border-white/10">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-variant to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-white font-black text-base">ASH</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    ASH <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">HOLDING</span>
                  </h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-secondary fill-secondary" />
                    ))}
                    <span className="text-xs text-white/50 ms-1">منذ 2016</span>
                  </div>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل من خلال الابتكار والحلول التقنية المتطورة. نقدم خدمات شاملة في مجالات التطوير البرمجي، الذكاء الاصطناعي، التسويق الرقمي، والاستشارات الإدارية.
              </p>
              
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  href="mailto:info@ash-holding.sa" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">البريد الإلكتروني</p>
                    <p className="text-sm font-medium">info@ash-holding.sa</p>
                  </div>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  href="tel:0555812567" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">الهاتف</p>
                    <p className="text-sm ltr-token font-medium">0555812567</p>
                  </div>
                </motion.a>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">الموقع</p>
                    <p className="text-sm font-medium">جدة، السعودية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-5 lg:ps-8 lg:border-s border-white/10">
              <h4 className="font-bold text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary" />
                </div>
                النشرة الإخبارية
              </h4>
              <p className="text-sm text-white/60">
                اشترك للحصول على آخر الأخبار والعروض الحصرية
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20 h-12"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground hover:opacity-90 h-12 font-bold shadow-lg shadow-primary/20"
                >
                  {isSubscribing ? "جاري الاشتراك..." : "اشترك الآن"}
                </Button>
              </form>
              
              {/* Social Links */}
              <div className="pt-3">
                <p className="text-xs text-white/40 mb-3">تابعنا على</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid - 6 Columns on Desktop, Accordion on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 lg:gap-8">
            
            {/* Column 1: Company */}
            <FooterSection title="الشركة" icon={Building2} defaultOpen={true}>
              <ul className="space-y-1">
                <li><FooterLink href="/about" icon={Users}>من نحن</FooterLink></li>
                <li><FooterLink href="/story" icon={History}>قصتنا</FooterLink></li>
                <li><FooterLink href="/team" icon={Users}>فريق العمل</FooterLink></li>
                <li><FooterLink href="/vision" icon={Eye}>رؤيتنا</FooterLink></li>
                <li><FooterLink href="/subsidiaries" icon={Building2}>شركاتنا</FooterLink></li>
                <li><FooterLink href="/partnerships" icon={Users}>شركاؤنا</FooterLink></li>
                <li><FooterLink href="/global-presence" icon={Globe}>تواجدنا العالمي</FooterLink></li>
                <li><FooterLink href="/social-responsibility" icon={Heart}>المسؤولية الاجتماعية</FooterLink></li>
                <li><FooterLink href="/our-works" icon={Briefcase}>أعمالنا</FooterLink></li>
              </ul>
            </FooterSection>

            {/* Column 2: Services */}
            <FooterSection title="الخدمات" icon={Zap}>
              <ul className="space-y-1">
                <li><FooterLink href="/services-catalog" icon={LayoutGrid}>كتالوج الخدمات</FooterLink></li>
                <li><FooterLink href="/technical-services" icon={Code}>الخدمات التقنية</FooterLink></li>
                <li><FooterLink href="/ai-solutions" icon={Brain}>الذكاء الاصطناعي</FooterLink></li>
                <li><FooterLink href="/business-services/transformation" icon={Rocket}>التحول الرقمي</FooterLink></li>
                <li><FooterLink href="/cloud-solutions" icon={Cloud}>الحلول السحابية</FooterLink></li>
                <li><FooterLink href="/digital-marketing" icon={Megaphone}>التسويق الرقمي</FooterLink></li>
                <li><FooterLink href="/design-solutions" icon={Palette}>حلول التصميم</FooterLink></li>
                <li><FooterLink href="/business-services/consulting" icon={Briefcase}>الاستشارات</FooterLink></li>
                <li><FooterLink href="/hosting-services" icon={Cloud}>الاستضافة</FooterLink></li>
              </ul>
            </FooterSection>

            {/* Column 3: Products */}
            <FooterSection title="المنتجات" icon={Package}>
              <ul className="space-y-1">
                <li><FooterLink href="/software-products" icon={Monitor}>البرمجيات</FooterLink></li>
                <li><FooterLink href="/mobile-apps" icon={Smartphone}>تطبيقات الجوال</FooterLink></li>
                <li><FooterLink href="/websites" icon={Globe}>المواقع</FooterLink></li>
                <li><FooterLink href="/ready-projects" icon={Package}>مشاريع جاهزة</FooterLink></li>
                <li><FooterLink href="/tech-projects" icon={Code}>المشاريع التقنية</FooterLink></li>
                <li><FooterLink href="/tech-ecosystem" icon={Settings}>المنظومة التقنية</FooterLink></li>
                <li><FooterLink href="/crm-system" icon={Users}>نظام CRM</FooterLink></li>
                <li><FooterLink href="/automation" icon={Zap}>الأتمتة</FooterLink></li>
              </ul>
            </FooterSection>

            {/* Column 4: Support */}
            <FooterSection title="الدعم" icon={Headphones}>
              <ul className="space-y-1">
                <li><FooterLink href="/contact" icon={Mail}>تواصل معنا</FooterLink></li>
                <li><FooterLink href="/support" icon={Headphones}>مركز الدعم</FooterLink></li>
                <li><FooterLink href="/faq" icon={HelpCircle}>الأسئلة الشائعة</FooterLink></li>
                <li><FooterLink href="/user-guide" icon={BookOpen}>دليل المستخدم</FooterLink></li>
                <li><FooterLink href="/complaints" icon={FileText}>الشكاوى</FooterLink></li>
                <li><FooterLink href="/book-consultation" icon={Calendar}>حجز استشارة</FooterLink></li>
                <li><FooterLink href="/start-project" icon={Rocket}>ابدأ مشروعك</FooterLink></li>
                <li><FooterLink href="/free-trial" icon={Zap}>تجربة مجانية</FooterLink></li>
              </ul>
            </FooterSection>

            {/* Column 5: Resources */}
            <FooterSection title="الموارد" icon={BookOpen}>
              <ul className="space-y-1">
                <li><FooterLink href="/news" icon={Newspaper}>الأخبار</FooterLink></li>
                <li><FooterLink href="/press" icon={FileText}>البيانات الصحفية</FooterLink></li>
                <li><FooterLink href="/events" icon={Calendar}>الفعاليات</FooterLink></li>
                <li><FooterLink href="/reports" icon={BarChart3}>التقارير السنوية</FooterLink></li>
                <li><FooterLink href="/training" icon={GraduationCap}>التدريب</FooterLink></li>
                <li><FooterLink href="/careers" icon={Briefcase}>الوظائف</FooterLink></li>
                <li><FooterLink href="/volunteer" icon={Heart}>التطوع</FooterLink></li>
                <li><FooterLink href="/affiliate" icon={UserPlus}>التسويق بالعمولة</FooterLink></li>
              </ul>
            </FooterSection>

            {/* Column 6: Legal & Quick Access */}
            <FooterSection title="روابط قانونية" icon={Scale}>
              <ul className="space-y-1">
                <li><FooterLink href="/privacy" icon={Lock}>سياسة الخصوصية</FooterLink></li>
                <li><FooterLink href="/terms" icon={FileText}>الشروط والأحكام</FooterLink></li>
                <li><FooterLink href="/cookie-policy" icon={Cookie}>سياسة الكوكيز</FooterLink></li>
                <li><FooterLink href="/contracts" icon={FileText}>العقود</FooterLink></li>
                <li><FooterLink href="/pricing" icon={BarChart3}>الأسعار</FooterLink></li>
                <li><FooterLink href="/offers" icon={Zap}>العروض الحالية</FooterLink></li>
                <li><FooterLink href="/payment-methods" icon={Shield}>طرق الدفع</FooterLink></li>
                <li><FooterLink href="/portal" icon={LayoutGrid}>بوابة العملاء</FooterLink></li>
              </ul>
            </FooterSection>
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-3 mt-12 pt-12 border-t border-white/10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20"
            >
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">معتمدة من وزارة التجارة</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">ISO 27001</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20"
            >
              <Star className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">شريك Google</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20"
            >
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">تواجد عالمي</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-white/50 text-center lg:text-start">
              <p>
                © {new Date().getFullYear()} ASH HOLDING. جميع الحقوق محفوظة.
              </p>
              <p className="text-xs mt-1 text-white/30">
                سجل تجاري: <span className="ltr-token">1234567890</span> | رخصة: <span className="ltr-token">ABC-12345</span> | رأس المال: <span className="ltr-token">10,000,000</span> ر.س
              </p>
            </div>
            
            {/* Bottom Links */}
            <div className="flex items-center gap-4 text-xs">
              <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">الخصوصية</Link>
              <span className="text-white/20">|</span>
              <Link to="/terms" className="text-white/50 hover:text-white transition-colors">الشروط</Link>
              <span className="text-white/20">|</span>
              <Link to="/sitemap" className="text-white/50 hover:text-white transition-colors">خريطة الموقع</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
