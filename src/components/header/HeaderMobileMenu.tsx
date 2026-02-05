/**
 * HeaderMobileMenu - Premium Mobile Navigation
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Slide-in Panel from RIGHT (RTL) */}
      <div 
        className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-card shadow-2xl animate-slide-in-rtl"
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التنقل"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-muted/30">
          <HeaderLogo variant="mobile" />
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1 max-h-[calc(100vh-180px)]">
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
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border bg-muted/30 safe-bottom">
          <button 
            onClick={() => handleNavigate('/book-consultation')}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-l from-primary to-primary-variant text-primary-foreground font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-transform"
          >
            <Headphones className="w-5 h-5" />
            <span>احجز استشارة مجانية</span>
          </button>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
            <span>متاح الآن للخدمة</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in-rtl {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-rtl {
          animation: slide-in-rtl 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .safe-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}

// Mobile Nav Item
function MobileNavItem({ 
  icon: Icon, 
  isActive, 
  onClick, 
  children 
}: { 
  icon: LucideIcon;
  isActive: boolean; 
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl text-start transition-all duration-200',
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-foreground hover:bg-muted'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1">{children}</span>
    </button>
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
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200',
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-foreground hover:bg-muted'
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 shrink-0" />
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <div className="mt-2 me-4 space-y-1 border-e-2 border-border pe-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Mobile Sub Item
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
        'w-full flex items-center gap-3 p-3 rounded-lg text-sm text-start transition-all duration-200',
        isActive 
          ? 'text-primary bg-primary/5 font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{item.name}</span>
    </button>
  );
}
