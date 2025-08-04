import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Toggle */}
          <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6 sticky top-0 z-40 shadow-lg">
            <SidebarTrigger className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group">
              <Menu className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </SidebarTrigger>
            
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
            </div>
            
            <div className="w-10"></div> {/* Spacer for centering */}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}