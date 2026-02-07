/**
 * Navigation Dark - ASH HOLDING
 * Clean sticky header inspired by MaxioCore
 * With all original header sections
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown,
  Phone,
  Mail,
  LogIn,
  Sparkles,
  MessageCircle,
  Code2,
  Cpu,
  Brain,
  Rocket,
  Wrench,
  Cloud,
  Smartphone,
  Monitor,
  Layout,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Users,
  Briefcase,
  Newspaper,
  LucideIcon
} from "lucide-react";

// Navigation Data - Same as MainHeaderV2
interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
  desc?: string;
}

interface NavItem {
  label: string;
  href: string;
  submenu?: NavLink[];
}

// Services Menu
const servicesMenu: NavLink[] = [
  { label: 'تطوير البرمجيات', href: '/technical-services', icon: Code2, desc: 'حلول برمجية متكاملة' },
  { label: 'الحلول التقنية', href: '/tech-ecosystem', icon: Cpu, desc: 'بنية تقنية متطورة' },
  { label: 'الذكاء الاصطناعي', href: '/ai-solutions', icon: Brain, desc: 'تقنيات AI متقدمة' },
  { label: 'التحول الرقمي', href: '/digital-transformation', icon: Rocket, desc: 'رقمنة الأعمال' },
  { label: 'خدمات مخصصة أخرى', href: '/services-catalog', icon: Wrench, desc: 'حلول مخصصة' },
];

// Products Menu
const productsMenu: NavLink[] = [
  { label: 'الحلول السحابية', href: '/cloud-solutions', icon: Cloud, desc: 'منصات سحابية' },
  { label: 'تطبيقات ويب', href: '/ready-projects', icon: Monitor, desc: 'تطبيقات متقدمة' },
  { label: 'تطبيقات جوال', href: '/mobile-apps', icon: Smartphone, desc: 'iOS & Android' },
  { label: 'منصات إدارية', href: '/software-products', icon: Layout, desc: 'أنظمة إدارة' },
  { label: 'المشاريع التقنية', href: '/tech-projects', icon: Lightbulb, desc: 'مشاريع متكاملة' },
];

// Others Menu
const othersMenu: NavLink[] = [
  { label: 'الأخبار والتحديثات', href: '/news', icon: Newspaper },
  { label: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
  { label: 'الشركاء', href: '/partnerships', icon: Users },
  { label: 'الوظائف', href: '/careers', icon: Briefcase },
  { label: 'دليل المستخدم', href: '/user-guide', icon: BookOpen },
];

// Main Navigation Links
const navLinks: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { 
    label: "خدماتنا", 
    href: "/services-catalog",
    submenu: servicesMenu
  },
  { 
    label: "منتجاتنا", 
    href: "/software-products",
    submenu: productsMenu
  },
  { 
    label: "أخرى", 
    href: "#",
    submenu: othersMenu
  },
  { label: "شركاتنا", href: "/subsidiaries" },
  { label: "تواصل معنا", href: "/contact" },
];

// Dropdown Portal Component for Grid Layout
function DropdownPortal({ 
  isOpen, 
  triggerRef, 
  children,
  variant = 'list'
}: { 
  isOpen: boolean; 
  triggerRef: React.RefObject<HTMLDivElement>; 
  children: React.ReactNode;
  variant?: 'list' | 'grid';
}) {
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        top: position.top,
        right: position.right,
        zIndex: 10000,
      }}
      className={`${variant === 'grid' ? 'w-[420px]' : 'w-56'} bg-[hsl(222_50%_8%)] border border-[hsl(var(--hp-border))] rounded-xl shadow-2xl overflow-hidden`}
    >
      {children}
    </motion.div>,
    document.body
  );
}

export function NavigationDark() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const submenuRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  // Initialize refs for submenu items
  navLinks.forEach(link => {
    if (link.submenu && !submenuRefs.current[link.label]) {
      submenuRefs.current[link.label] = { current: null } as React.RefObject<HTMLDivElement>;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveSubmenu(null);
    if (activeSubmenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeSubmenu]);

  const openWhatsApp = () => {
    window.open('https://wa.me/966555812567?text=' + encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم'), '_blank');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-[hsl(222_50%_4%)] border-b border-[hsl(var(--hp-border)/0.5)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs" dir="rtl">
            <div className="flex items-center gap-6 text-[hsl(var(--hp-text-muted))]">
              <a href="tel:0555812567" className="flex items-center gap-1.5 hover:text-[hsl(var(--hp-primary))] transition-colors">
                <Phone className="w-3 h-3" />
                <span className="ltr-token">0555812567</span>
              </a>
              <a href="mailto:info@ash-holding.sa" className="flex items-center gap-1.5 hover:text-[hsl(var(--hp-primary))] transition-colors">
                <Mail className="w-3 h-3" />
                <span className="ltr-token">info@ash-holding.sa</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-[hsl(var(--hp-text-muted))]">
              <Sparkles className="w-3 h-3 text-[hsl(var(--hp-secondary))]" />
              <span>شركة قابضة سعودية منذ 2016</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        dir="rtl"
        className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[hsl(222_50%_5%/0.98)] backdrop-blur-xl shadow-lg shadow-black/20' 
            : 'bg-[hsl(222_50%_5%)]'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--hp-primary))] to-[hsl(var(--hp-secondary))] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(var(--hp-primary)/0.3)] group-hover:scale-105 transition-transform">
                <span className="text-[hsl(222_50%_5%)] font-black text-sm">ASH</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black leading-tight">
                  <span className="text-[hsl(var(--hp-text))]">ASH</span>
                  <span className="hp-gradient-text"> HOLDING</span>
                </span>
                <span className="text-[10px] text-[hsl(var(--hp-text-subtle))] hidden sm:block">شركة قابضة</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isGridVariant = link.label === 'خدماتنا' || link.label === 'منتجاتنا';
                
                return (
                  <div 
                    key={link.label}
                    ref={link.submenu ? (submenuRefs.current[link.label] as React.RefObject<HTMLDivElement>) : undefined}
                    className="relative"
                    onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {link.submenu ? (
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeSubmenu === link.label
                            ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                            : 'text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSubmenu === link.label ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          location.pathname === link.href
                            ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                            : 'text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Submenu Portal */}
                    <AnimatePresence>
                      {link.submenu && (
                        <DropdownPortal 
                          isOpen={activeSubmenu === link.label} 
                          triggerRef={submenuRefs.current[link.label]}
                          variant={isGridVariant ? 'grid' : 'list'}
                        >
                          <div 
                            onMouseEnter={() => setActiveSubmenu(link.label)}
                            onMouseLeave={() => setActiveSubmenu(null)}
                            className={isGridVariant ? 'grid grid-cols-2 gap-1 p-2' : ''}
                          >
                            {link.submenu.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] transition-colors ${
                                  isGridVariant ? 'px-3 py-2.5 rounded-lg' : 'px-4 py-3'
                                }`}
                              >
                                {item.icon && (
                                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--hp-primary)/0.15)] flex items-center justify-center shrink-0">
                                    <item.icon className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium">{item.label}</span>
                                  {item.desc && (
                                    <span className="text-xs text-[hsl(var(--hp-text-subtle))]">{item.desc}</span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </DropdownPortal>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={openWhatsApp}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[hsl(var(--hp-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </button>
              
              <Link to="/auth?mode=login">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span>دخول</span>
                </button>
              </Link>
              
              <Link to="/book-consultation">
                <button className="hp-btn-primary text-sm py-2.5 px-5">
                  <span>استشارة مجانية</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Border Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--hp-border))] to-transparent" />
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-[hsl(222_50%_5%)] border-b border-[hsl(var(--hp-border))] overflow-hidden"
            dir="rtl"
          >
            <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Contact Info */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[hsl(var(--hp-border)/0.5)]">
                <a href="tel:0555812567" className="flex items-center gap-2 text-sm text-[hsl(var(--hp-text-muted))]">
                  <Phone className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
                  <span className="ltr-token">0555812567</span>
                </a>
                <button 
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 bg-emerald-500/10 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.submenu ? (
                      <>
                        <button
                          onClick={() => setMobileExpandedMenu(mobileExpandedMenu === link.label ? null : link.label)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                            mobileExpandedMenu === link.label
                              ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                              : 'text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                          }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedMenu === link.label ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpandedMenu === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mr-4 mt-1 space-y-1 pb-2">
                                {link.submenu.map((item) => (
                                  <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors"
                                  >
                                    {item.icon && <item.icon className="w-4 h-4 text-[hsl(var(--hp-primary))]" />}
                                    <div className="flex flex-col">
                                      <span>{item.label}</span>
                                      {item.desc && <span className="text-xs text-[hsl(var(--hp-text-subtle))]">{item.desc}</span>}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                          location.pathname === link.href
                            ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                            : 'text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-6 pt-4 border-t border-[hsl(var(--hp-border)/0.5)] space-y-3">
                <Link to="/auth?mode=login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full hp-btn-secondary text-base py-3">
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </button>
                </Link>
                <Link to="/book-consultation" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full hp-btn-primary text-base py-3">
                    <span>احجز استشارة مجانية</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavigationDark;
