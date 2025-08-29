import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { PrayerTimesBar } from '@/components/PrayerTimesBar';

export const AdminLayout = () => {
  return (
    <div dir="rtl" className="min-h-screen w-full bg-gradient-to-bl from-background via-muted/30 to-muted/50">
      <PrayerTimesBar />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 overflow-auto">
              <ResponsiveContainer className="h-full p-4 sm:p-6 lg:p-8" size="full">
                <Outlet />
              </ResponsiveContainer>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;