import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ClientSidebar } from './ClientSidebar';
import { ClientHeader } from './ClientHeader';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export const ClientLayout = () => {
  return (
    <div dir="rtl" className="min-h-screen w-full font-tajawal bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative">
          {/* خلفية متحركة */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
          
          <ClientSidebar />
          <div className="flex-1 flex flex-col min-w-0 relative z-10">
            <ClientHeader />
            <main className="flex-1 overflow-auto">
              <div className="relative">
                <ResponsiveContainer className="h-full p-6 lg:p-8 animate-fade-in" size="full">
                  <Outlet />
                </ResponsiveContainer>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientLayout;