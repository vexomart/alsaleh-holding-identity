import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50 flex-shrink-0">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </SidebarTrigger>
          
          <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
          
          <div className="w-10" />
        </header>

        {/* Desktop: Sidebar + Content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Desktop: Normal, Mobile: Overlay */}
          <div className="lg:block">
            <AppSidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
            {/* Desktop Header */}
            <header className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="w-5 h-5 text-gray-600" />
                </SidebarTrigger>
                <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-4 lg:p-6 h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}