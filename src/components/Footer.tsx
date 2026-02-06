/**
 * Footer - Enterprise Premium Footer
 * Comprehensive RTL-native footer with all sections
 * Mobile: Accordion-based | Desktop: Multi-column grid
 */

import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Star,
  ChevronDown,
  ExternalLink,
  Zap,
  Palette,
  Megaphone,
  Search,
  Camera,
  PlayCircle,
  Target,
  LayoutGrid,
  Settings,
  Lock,
  Cookie,
  Scale
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
    <div className="border-b border-background/10 lg:border-0">
      {/* Mobile Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:hidden text-start"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <Icon className="w-4 h-4" />
          {title}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Desktop Header */}
      <h4 className="hidden lg:flex items-center gap-2 font-semibold text-sm mb-4">
        <Icon className="w-4 h-4" />
        {title}
      </h4>

      {/* Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 lg:overflow-visible",
        isOpen ? "max-h-[500px] pb-4" : "max-h-0 lg:max-h-none"
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
  const className = "flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors py-1.5";
  
  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={className}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span>{children}</span>
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
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
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/newsletter-subscribe",
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
    <footer className="relative bg-foreground text-background overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content */}
        <div className="py-10 lg:py-16">
          
          {/* Top Section - Company Info & Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-10 pb-10 border-b border-background/10">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">ASH HOLDING</h2>
              <p className="text-background/70 text-sm leading-relaxed max-w-xl">
                شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل من خلال الابتكار والحلول التقنية المتطورة. نقدم خدمات شاملة في مجالات التطوير البرمجي، الذكاء الاصطناعي، التسويق الرقمي، والاستشارات الإدارية.
              </p>
              
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <a href="mailto:info@ash-holding.sa" className="flex items-center gap-3 p-3 rounded-lg bg-background/5 hover:bg-background/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-background/50">البريد الإلكتروني</p>
                    <p className="text-sm">info@ash-holding.sa</p>
                  </div>
                </a>
                <a href="tel:0555812567" className="flex items-center gap-3 p-3 rounded-lg bg-background/5 hover:bg-background/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-background/50">الهاتف</p>
                    <p className="text-sm ltr-token">0555812567</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/5">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-background/50">الموقع</p>
                    <p className="text-sm">جدة، السعودية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <Send className="w-4 h-4" />
                النشرة الإخبارية
              </h4>
              <p className="text-sm text-background/70">
                اشترك للحصول على آخر الأخبار والعروض الحصرية
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-background/40 h-11"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium"
                >
                  {isSubscribing ? "جاري الاشتراك..." : "اشترك الآن"}
                </Button>
              </form>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-background/10 border border-background/10 hover:bg-background/20 hover:border-background/30 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
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
                <li><FooterLink href="/app" icon={LayoutGrid}>بوابة العملاء</FooterLink></li>
              </ul>
            </FooterSection>
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 pt-10 border-t border-background/10">
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-success">معتمدة من وزارة التجارة</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">مرخصة رسمياً</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
              <Star className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary">مسجلة في هيئة الزكاة</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full border border-background/20">
              <Globe className="w-4 h-4" />
              <span className="text-sm">ISO 27001</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-start">
              <p className="text-sm text-background/70">
                © 2025 ASH HOLDING. جميع الحقوق محفوظة.
              </p>
              <p className="text-xs text-background/50 mt-1">
                شركة علي صالح الشهري القابضة
              </p>
            </div>
            
            {/* Quick Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-background/60">
              <Link to="/privacy" className="hover:text-background transition-colors">الخصوصية</Link>
              <span className="text-background/30">|</span>
              <Link to="/terms" className="hover:text-background transition-colors">الشروط</Link>
              <span className="text-background/30">|</span>
              <Link to="/cookie-policy" className="hover:text-background transition-colors">الكوكيز</Link>
              <span className="text-background/30">|</span>
              <Link to="/contact" className="hover:text-background transition-colors">تواصل معنا</Link>
            </div>
          </div>
          
          {/* Legal Registration Info */}
          <div className="mt-6 pt-6 border-t border-background/5 text-center">
            <p className="text-xs text-background/40 leading-relaxed max-w-4xl mx-auto">
              شركة علي صالح الشهري القابضة | سجل تجاري: 4030554749 | ترخيص: 7039030916 | رأس المال: 500,000 ر.س | المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
