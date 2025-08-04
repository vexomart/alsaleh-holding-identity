import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-screen flex bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {/* Mobile Trigger - Fixed at top-left */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <SidebarTrigger className="p-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all duration-200">
              <Menu className="w-6 h-6 text-gray-700" />
            </SidebarTrigger>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 h-full pt-16 lg:pt-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}