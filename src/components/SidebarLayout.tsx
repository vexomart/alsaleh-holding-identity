import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50 relative">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header with Sidebar Toggle */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 z-30 shadow-sm relative">
            <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group">
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </SidebarTrigger>
            
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
            </div>
            
            <div className="w-10"></div> {/* Spacer for centering */}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto min-h-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}