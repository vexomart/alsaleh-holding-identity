/**
 * V3 Customer Layout - Banking Portal
 * Simplified for UnifiedLayout
 * Only provides content wrapper and dashboard nav
 */

import * as React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { DashboardNav } from '@/components/layouts/DashboardNav';
import { CustomerGuard } from '@/components/auth/RouteGuard';
import '@/styles/v3/tokens.css';

export interface V3CustomerLayoutProps {
  children: React.ReactNode;
}

const V3CustomerLayoutContent: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  const { isRTL } = useLanguage();

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-full bg-background"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Dashboard Navigation */}
      <DashboardNav variant="customer" />
      
      {/* Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export const V3CustomerLayout: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  return (
    <CustomerGuard>
      <V3CustomerLayoutContent>{children}</V3CustomerLayoutContent>
    </CustomerGuard>
  );
};

V3CustomerLayout.displayName = 'V3CustomerLayout';
