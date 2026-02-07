/**
 * HeaderMobileMenu - Premium Enterprise Mobile Navigation
 * Full-screen RTL slide-in menu with accordion support
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

  // Lock body scroll when menu is open
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

  // Handle navigation
  const handleNavigate = React.useCallback((href: string) => {
    onClose();
    setOpenAccordion(null);
    navigate(href);
  }, [navigate, onClose]);

  // Check if route is active
  const isActiveRoute = React.useCallback((href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  // Check if accordion has active child
  const isAccordionActive = React.useCallback((items: NavItem[]) => {
    return items.some(item => isActiveRoute(item.href));
  }, [isActiveRoute]);

  // Toggle accordion
  const toggleAccordion = React.useCallback((key: string) => {
    setOpenAccordion(prev => prev === key ? null : key);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50" dir="rtl">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Slide-in Panel (Right side for RTL) */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <HeaderLogo variant="mobile" />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
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
                onToggle={() => toggleAccordion('services')}
                isActive={isAccordionActive(headerConfig.services)}
              >
                {headerConfig.services.map((item) => (
                  <MobileSubItem 
                    key={item.href}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
                  />
                ))}
              </MobileAccordion>

              {/* Products Accordion */}
              <MobileAccordion
                label="منتجاتنا"
                icon={Package}
                isOpen={openAccordion === 'products'}
                onToggle={() => toggleAccordion('products')}
                isActive={isAccordionActive(headerConfig.products)}
              >
                {headerConfig.products.map((item) => (
                  <MobileSubItem 
                    key={item.href}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
                  />
                ))}
              </MobileAccordion>

              {/* Others Accordion */}
              <MobileAccordion
                label="أخرى"
                icon={MoreHorizontal}
                isOpen={openAccordion === 'others'}
                onToggle={() => toggleAccordion('others')}
                isActive={isAccordionActive(headerConfig.others)}
              >
                {headerConfig.others.map((item) => (
                  <MobileSubItem 
                    key={item.href}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onClick={() => handleNavigate(item.href)}
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
              <div className="my-4 border-t border-gray-200" />

              {/* Customer Portal */}
              <MobileNavItem 
                icon={User}
                isActive={isActiveRoute('/dashboard')}
                onClick={() => handleNavigate('/dashboard')}
                variant="highlighted"
              >
                بوابة العملاء
              </MobileNavItem>
            </div>

            {/* Footer CTA */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white shrink-0 pb-safe">
              <button 
                onClick={() => handleNavigate('/book-consultation')}
                className={cn(
                  'flex items-center justify-center gap-2 w-full py-4',
                  'bg-gradient-to-l from-primary via-primary to-accent text-white',
                  'font-bold rounded-xl shadow-lg shadow-primary/30',
                  'hover:shadow-xl hover:shadow-primary/40 transition-all duration-200'
                )}
              >
                <Headphones className="w-5 h-5" />
                <span>احجز استشارة مجانية</span>
              </button>
              
              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-gray-500">متاح الآن للخدمة</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Mobile Nav Item Component
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
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3.5 rounded-xl text-start transition-all duration-200',
        variant === 'highlighted' && !isActive && 'bg-primary/5 border border-primary/20 text-primary',
        variant === 'highlighted' && isActive && 'bg-primary text-white shadow-lg shadow-primary/30',
        variant === 'default' && isActive && 'bg-primary/10 text-primary',
        variant === 'default' && !isActive && 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
        isActive || variant === 'highlighted' 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-600'
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 font-medium">{children}</span>
      <ArrowLeft className="w-4 h-4 opacity-50" />
    </button>
  );
}

// Mobile Accordion Component
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
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200',
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-gray-700 hover:bg-gray-100'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown 
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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

// Mobile Sub Item Component
function MobileSubItem({ 
  item, 
  isActive, 
  onClick
}: { 
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl text-sm text-start transition-all duration-200',
        isActive 
          ? 'text-primary bg-primary/5' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="flex-1">{item.name}</span>
    </button>
  );
}
