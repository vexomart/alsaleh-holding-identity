/**
 * ModernAppShell - V3 Modern App Container
 * Stripe/Notion/Apple Inspired Design
 * Clean, Minimal, Professional
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernSidebar, SidebarNavGroup } from './ModernSidebar';
import { ModernHeader } from './ModernHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '@/styles/v3/modern-theme.css';

interface ModernAppShellProps {
  children: React.ReactNode;
  variant: 'admin' | 'customer';
  navGroups: SidebarNavGroup[];
  logo?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

export const ModernAppShell: React.FC<ModernAppShellProps> = ({
  children,
  variant,
  navGroups,
  logo,
  sidebarFooter,
}) => {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const [sidebarExpanded, setSidebarExpanded] = React.useState(!isMobile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Sync sidebar state with mobile
  React.useEffect(() => {
    setSidebarExpanded(!isMobile);
  }, [isMobile]);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(true);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  return (
    <div 
      dir="rtl"
      className="modern-app modern-shell modern-scrollbar"
    >
      {/* Sidebar - On RIGHT side for RTL */}
      <ModernSidebar
        groups={navGroups}
        logo={logo}
        footer={sidebarFooter}
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area - Takes remaining space */}
      <div className="modern-main">
        {/* Header */}
        <ModernHeader 
          onMenuClick={handleMenuClick}
          variant={variant}
        />

        {/* Content - RTL aligned with smooth page transitions */}
        <main className="modern-content modern-scrollbar" dir="rtl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ 
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

ModernAppShell.displayName = 'ModernAppShell';
