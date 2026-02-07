/**
 * MainHeaderV2 - Mobile Navigation
 * Full-screen RTL slide-in menu
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Headphones, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './HeaderLogo';
import { mobileMenuGroups, servicesMenu, productsMenu, othersMenu, NavLink } from './MainHeaderV2.data';
import { mobileStyles as s, buttonStyles } from './MainHeaderV2.styles';

interface HeaderMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderMobileNav({ isOpen, onClose }: HeaderMobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle navigation
  const handleNav = (href: string) => {
    onClose();
    setExpandedSection(null);
    navigate(href);
  };

  // Check active route
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  // Toggle section
  const toggleSection = (title: string) => {
    setExpandedSection(prev => prev === title ? null : title);
  };

  // Sections with expandable content
  const expandableSections = [
    { title: 'خدماتنا', items: servicesMenu },
    { title: 'منتجاتنا', items: productsMenu },
    { title: 'المزيد', items: othersMenu },
  ];

  // Static links
  const staticLinks: NavLink[] = [
    { label: 'الرئيسية', href: '/' },
    { label: 'من نحن', href: '/about' },
    { label: 'شركاتنا', href: '/subsidiaries' },
    { label: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={s.overlay}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={s.panel}
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
            dir="rtl"
          >
            {/* Header */}
            <div className={s.header}>
              <HeaderLogo compact />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className={s.nav}>
              {/* Static Links */}
              <div className={s.group}>
                <div className={s.groupTitle}>التنقل</div>
                {staticLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    className={cn(s.link, isActive(link.href) && s.linkActive)}
                  >
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>

              {/* Expandable Sections */}
              {expandableSections.map((section) => (
                <div key={section.title} className={s.group}>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown 
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        expandedSection === section.title && 'rotate-180'
                      )} 
                    />
                  </button>

                  <AnimatePresence>
                    {expandedSection === section.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1 ps-3 border-s-2 border-primary/20 ms-4 space-y-0.5">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.href}
                                onClick={() => handleNav(item.href)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all',
                                  isActive(item.href) && 'text-primary bg-primary/10'
                                )}
                              >
                                {Icon && (
                                  <div className={cn(
                                    'w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center',
                                    isActive(item.href) && 'bg-primary/20 text-primary'
                                  )}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                )}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Customer Portal */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleNav('/portal')}
                  className={cn(
                    s.link,
                    'bg-white/5 border border-white/10',
                    isActive('/portal') && s.linkActive
                  )}
                >
                  <User className="w-5 h-5" />
                  <span>بوابة العملاء</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className={s.footer}>
              <button
                onClick={() => handleNav('/book-consultation')}
                className={cn(buttonStyles.primary, 'w-full justify-center')}
              >
                <Headphones className="w-5 h-5" />
                <span>احجز استشارة مجانية</span>
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-slate-500">متاح الآن للخدمة</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
