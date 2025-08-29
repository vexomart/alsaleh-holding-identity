import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ClientSidebar } from './ClientSidebar';
import { ClientHeader } from './ClientHeader';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { PrayerTimesBar } from '@/components/PrayerTimesBar';

export const ClientLayout = () => {
  return (
    <div dir="rtl" className="min-h-screen w-full bg-background" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <PrayerTimesBar />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <ClientSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <ClientHeader />
            <main className="flex-1 overflow-auto">
              <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientLayout;