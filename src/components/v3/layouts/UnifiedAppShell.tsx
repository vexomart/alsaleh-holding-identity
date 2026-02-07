/**
 * UnifiedAppShell - V3 App Container
 * Light Theme - Modern SaaS Style
 * RTL-First Arabic Native
 * 
 * Single shell for both Admin and Customer dashboards
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedSidebar, SidebarNavGroup } from './UnifiedSidebar';
import { UnifiedHeader } from './UnifiedHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '@/styles/v3/light-theme.css';

interface UnifiedAppShellProps {
  children: React.ReactNode;
  variant: 'admin' | 'customer';
  navGroups: SidebarNavGroup[];
  logo?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

export const UnifiedAppShell: React.FC<UnifiedAppShellProps> = ({
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
      dir={isRTL ? 'rtl' : 'ltr'}
      className="v3-app v3-shell"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Sidebar */}
      <UnifiedSidebar
        groups={navGroups}
        logo={logo}
        footer={sidebarFooter}
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="v3-main">
        {/* Header */}
        <UnifiedHeader 
          onMenuClick={handleMenuClick}
          variant={variant}
        />

        {/* Content */}
        <main className="v3-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

UnifiedAppShell.displayName = 'UnifiedAppShell';
