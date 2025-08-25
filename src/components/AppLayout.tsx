import React from 'react';
import ScrollToTop from "@/components/ScrollToTop";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      {/* Main content */}
      <div className="relative z-10">
        <ScrollToTop />
        {children}
      </div>
    </div>
  );
};