import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Mobile Header - visible only on mobile */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-50 shadow-sm">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Menu className="w-5 h-5 text-gray-600" />
          </SidebarTrigger>
          
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
          </div>
        </header>

        <div className="flex h-screen lg:h-auto">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Desktop Header - visible only on desktop */}
            <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center px-6 shadow-sm">
              <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5 text-gray-600" />
              </SidebarTrigger>
              
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}