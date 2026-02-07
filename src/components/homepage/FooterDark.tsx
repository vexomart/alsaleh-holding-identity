/**
 * Footer Dark - MaxioCore Inspired
 * Clean professional footer
 */

import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from "lucide-react";

const quickLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "خدماتنا", href: "/integrated-services" },
  { label: "من نحن", href: "/about" },
  { label: "المشاريع", href: "/our-works" },
  { label: "تواصل معنا", href: "/contact" },
];

const services = [
  { label: "تطوير المواقع", href: "/websites" },
  { label: "تطبيقات الجوال", href: "/mobile-apps" },
  { label: "التسويق الرقمي", href: "/digital-marketing" },
  { label: "التصميم الجرافيكي", href: "/design-services" },
  { label: "الاستضافة", href: "/hosting-services" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/ash_holdings", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/ash.holdings", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/ash-holdings", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@ash.holdings", label: "YouTube" },
  { icon: Facebook, href: "https://facebook.com/ash.holdings", label: "Facebook" },
];

export function FooterDark() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer dir="rtl" className="relative bg-[hsl(222_50%_4%)] text-[hsl(var(--hp-text))]">
      {/* Top Border Gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--hp-primary)/0.5)] to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black hp-gradient-text">ASH HOLDING</span>
            </Link>
            <p className="text-sm text-[hsl(var(--hp-text-muted))] leading-relaxed mb-4">
              شركة قابضة سعودية رائدة في مجال التقنية والإعلام الرقمي منذ عام 2016
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[hsl(var(--hp-bg-card))] border border-[hsl(var(--hp-border))] text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-primary))] hover:border-[hsl(var(--hp-primary)/0.5)] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[hsl(var(--hp-text))] mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-primary))] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-[hsl(var(--hp-text))] mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.href}
                    className="text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-primary))] transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[hsl(var(--hp-text))] mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[hsl(var(--hp-text-muted))]">
                <MapPin className="w-4 h-4 text-[hsl(var(--hp-primary))] shrink-0" />
                <span>جدة، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[hsl(var(--hp-text-muted))]">
                <Phone className="w-4 h-4 text-[hsl(var(--hp-primary))] shrink-0" />
                <span className="ltr-token">0555812567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[hsl(var(--hp-text-muted))]">
                <Mail className="w-4 h-4 text-[hsl(var(--hp-primary))] shrink-0" />
                <span className="ltr-token">info@ash-holding.sa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[hsl(var(--hp-border))]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[hsl(var(--hp-text-subtle))]">
              © {new Date().getFullYear()} ASH HOLDING. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-xs text-[hsl(var(--hp-text-subtle))] hover:text-[hsl(var(--hp-primary))] transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="text-xs text-[hsl(var(--hp-text-subtle))] hover:text-[hsl(var(--hp-primary))] transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 w-10 h-10 flex items-center justify-center rounded-lg bg-[hsl(var(--hp-primary))] text-[hsl(222_50%_5%)] shadow-lg hover:shadow-xl transition-all z-50"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}

export default FooterDark;
