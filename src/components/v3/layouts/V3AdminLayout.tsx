/**
 * V3 Admin Layout - Command Center
 * Simplified for UnifiedLayout
 * Only provides content wrapper and dashboard nav
 */

import * as React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { DashboardNav } from '@/components/layouts/DashboardNav';
import { AdminGuard } from '@/components/auth/RouteGuard';
import '@/styles/v3/tokens.css';

export interface V3AdminLayoutProps {
  children: React.ReactNode;
}

const V3AdminLayoutContent: React.FC<V3AdminLayoutProps> = ({ children }) => {
  const { isRTL } = useLanguage();

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-full bg-background"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Dashboard Navigation */}
      <DashboardNav variant="admin" />
      
      {/* Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export const V3AdminLayout: React.FC<V3AdminLayoutProps> = ({ children }) => {
  return (
    <AdminGuard>
      <V3AdminLayoutContent>{children}</V3AdminLayoutContent>
    </AdminGuard>
  );
};

V3AdminLayout.displayName = 'V3AdminLayout';
