/**
 * Footer - Responsive Premium Footer
 * Fully responsive RTL-native footer for all devices
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Home,
  Users,
  Building2,
  Zap,
  Code,
  Shield,
  Award,
  Star,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [isSubscribing, setIsSubscribing] = React.useState(false);
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

  const quickLinks = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "من نحن", href: "/about", icon: Users },
    { name: "شركاتنا", href: "/subsidiaries", icon: Building2 },
    { name: "تواصل معنا", href: "/contact", icon: Mail }
  ];

  const servicesLinks = [
    { name: "الحلول التقنية", href: "/tech-ecosystem", icon: Zap },
    { name: "تطوير البرمجيات", href: "/technical-services", icon: Code },
    { name: "الذكاء الاصطناعي", href: "/ai-solutions", icon: Zap },
    { name: "التحول الرقمي", href: "/digital-transformation", icon: Globe }
  ];

  const legalLinks = [
    { name: "سياسة الخصوصية", href: "/privacy-policy" },
    { name: "الشروط والأحكام", href: "/terms" },
    { name: "سياسة الاسترداد", href: "/refund-policy" }
  ];

  return (
    <footer className="relative bg-foreground text-background overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content */}
        <div className="py-12 lg:py-16">
          
          {/* Top Section - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 pb-12 border-b border-background/10">
            
            {/* Company Info */}
            <div className="md:col-span-2 lg:col-span-1 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">ASH HOLDING</h2>
              <p className="text-background/70 text-sm leading-relaxed">
                شركة قابضة رائدة في الاستثمار التقني والإعلامي، نساهم في بناء مستقبل أفضل من خلال الابتكار والحلول التقنية المتطورة.
              </p>
              
              {/* Contact Info - Stacked on Mobile */}
              <div className="space-y-3 pt-2">
                <a href="mailto:info@ash-holding.sa" className="flex items-center gap-2 text-sm text-background/80 hover:text-background transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>info@ash-holding.sa</span>
                </a>
                <a href="tel:0555812567" className="flex items-center gap-2 text-sm text-background/80 hover:text-background transition-colors">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="ltr-token">0555812567</span>
                </a>
                <div className="flex items-center gap-2 text-sm text-background/70">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>جدة، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Home className="w-4 h-4" />
                روابط سريعة
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                خدماتنا
              </h4>
              <ul className="space-y-2.5">
                {servicesLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4" />
                النشرة الإخبارية
              </h4>
              <p className="text-sm text-background/70 mb-4">
                اشترك للحصول على آخر الأخبار والتحديثات
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-background/40 h-10"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full bg-background text-foreground hover:bg-background/90 h-10 font-medium"
                >
                  {isSubscribing ? "جاري الاشتراك..." : "اشترك الآن"}
                </Button>
              </form>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/10 border border-background/20 hover:bg-background/20 hover:border-background/40 transition-all duration-200"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 text-xs sm:text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span className="text-success">معتمدة من وزارة التجارة</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">مرخصة</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
              <Star className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary">مسجلة في هيئة الزكاة</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
            
            {/* Copyright */}
            <div className="text-sm text-background/70">
              <p>© 2025 ASH HOLDING. جميع الحقوق محفوظة.</p>
              <p className="text-xs mt-1">شركة علي صالح الشهري القابضة</p>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs text-background/60">
              {legalLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.href}
                  className="hover:text-background transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Legal Info - Mobile Stacked */}
          <div className="mt-6 pt-6 border-t border-background/5 text-center">
            <p className="text-xs text-background/50 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة، سجل تجاري: 4030554749، ترخيص: 7039030916، رأس المال: 500,000 ر.س
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
