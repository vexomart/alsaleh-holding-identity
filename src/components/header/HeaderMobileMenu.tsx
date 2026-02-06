/**
 * HeaderMobileMenu - Premium Mobile Navigation
 * Full-screen slide-in menu with RTL animations
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  Home, 
  Users, 
  Building2, 
  Phone,
  Headphones,
  Settings,
  Package,
  MoreHorizontal,
  User,
  ArrowLeft,
  Star,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './HeaderLogo';
import { headerConfig } from './config';
import { NavItem } from './types';

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderMobileMenu({ isOpen, onClose }: HeaderMobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    onClose();
    setOpenAccordion(null);
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const isAccordionActive = (items: NavItem[]) => {
    return items.some(item => isActiveRoute(item.href));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50" dir="rtl">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Slide-in Panel from RIGHT (RTL) */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-card shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-muted/30 shrink-0">
              <HeaderLogo variant="mobile" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-primary/10 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1">
              {/* Home */}
              <MobileNavItem 
                icon={Home}
                isActive={isActiveRoute('/')}
                onClick={() => handleNavigate('/')}
              >
                الرئيسية
              </MobileNavItem>

              {/* About */}
              <MobileNavItem 
                icon={Users}
                isActive={isActiveRoute('/about')}
                onClick={() => handleNavigate('/about')}
              >
                من نحن
              </MobileNavItem>

              {/* Services Accordion */}
              <MobileAccordion
                label="خدماتنا"
                icon={Settings}
                isOpen={openAccordion === 'services'}
                onToggle={() => setOpenAccordion(openAccordion === 'services' ? null : 'services')}
                isActive={isAccordionActive(headerConfig.services)}
              >
                {headerConfig.services.map((item, index) => (
                  <MobileSubItem 
                    key={index}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
                    index={index}
                  />
                ))}
              </MobileAccordion>

              {/* Products Accordion */}
              <MobileAccordion
                label="منتجاتنا"
                icon={Package}
                isOpen={openAccordion === 'products'}
                onToggle={() => setOpenAccordion(openAccordion === 'products' ? null : 'products')}
                isActive={isAccordionActive(headerConfig.products)}
              >
                {headerConfig.products.map((item, index) => (
                  <MobileSubItem 
                    key={index}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
                    index={index}
                  />
                ))}
              </MobileAccordion>

              {/* Others Accordion */}
              <MobileAccordion
                label="أخرى"
                icon={MoreHorizontal}
                isOpen={openAccordion === 'others'}
                onToggle={() => setOpenAccordion(openAccordion === 'others' ? null : 'others')}
                isActive={isAccordionActive(headerConfig.others)}
              >
                {headerConfig.others.map((item, index) => (
                  <MobileSubItem 
                    key={index}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
                    index={index}
                  />
                ))}
              </MobileAccordion>

              {/* Subsidiaries */}
              <MobileNavItem 
                icon={Building2}
                isActive={isActiveRoute('/subsidiaries')}
                onClick={() => handleNavigate('/subsidiaries')}
              >
                شركاتنا
              </MobileNavItem>

              {/* Contact */}
              <MobileNavItem 
                icon={Phone}
                isActive={isActiveRoute('/contact')}
                onClick={() => handleNavigate('/contact')}
              >
                تواصل معنا
              </MobileNavItem>

              {/* Divider */}
              <div className="my-4 border-t border-border" />

              {/* Customer Portal */}
              <MobileNavItem 
                icon={User}
                isActive={isActiveRoute('/app')}
                onClick={() => handleNavigate('/app')}
                variant="highlighted"
              >
                بوابة العملاء
              </MobileNavItem>
            </div>

            {/* Footer CTA */}
            <div className="p-4 border-t border-border bg-gradient-to-t from-muted/50 to-transparent shrink-0 pb-safe">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigate('/book-consultation')}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30"
              >
                <Headphones className="w-5 h-5" />
                <span>احجز استشارة مجانية</span>
              </motion.button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>متاح الآن للخدمة</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-success rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Mobile Nav Item
function MobileNavItem({ 
  icon: Icon, 
  isActive, 
  onClick, 
  children,
  variant = 'default'
}: { 
  icon: LucideIcon;
  isActive: boolean; 
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3.5 rounded-xl text-start transition-all duration-300',
        variant === 'highlighted' && !isActive && 'bg-primary/5 border border-primary/20 text-primary',
        variant === 'highlighted' && isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
        variant === 'default' && isActive && 'bg-primary/10 text-primary font-medium',
        variant === 'default' && !isActive && 'text-foreground hover:bg-muted'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 font-medium">{children}</span>
      <ArrowLeft className="w-4 h-4 opacity-50" />
    </motion.button>
  );
}

// Mobile Accordion
function MobileAccordion({ 
  label, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  isActive,
  children 
}: { 
  label: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300',
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-foreground hover:bg-muted'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 me-4 space-y-1 border-e-2 border-primary/20 pe-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Sub Item
function MobileSubItem({ 
  item, 
  isActive, 
  onClick,
  index
}: { 
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = item.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl text-sm text-start transition-all duration-300',
        isActive 
          ? 'text-primary bg-primary/5 font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'bg-muted'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="flex-1">{item.name}</span>
    </motion.button>
  );
}
