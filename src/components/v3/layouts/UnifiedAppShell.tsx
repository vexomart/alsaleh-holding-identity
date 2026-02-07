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
      dir="rtl"
      className="v3-app v3-shell"
      style={{ 
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Sidebar - On RIGHT side for RTL */}
      <UnifiedSidebar
        groups={navGroups}
        logo={logo}
        footer={sidebarFooter}
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area - Takes remaining space */}
      <div className="v3-main" style={{ flex: 1 }}>
        {/* Header */}
        <UnifiedHeader 
          onMenuClick={handleMenuClick}
          variant={variant}
        />

        {/* Content - RTL aligned */}
        <main className="v3-content" dir="rtl" style={{ textAlign: 'right' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ direction: 'rtl' }}
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
