import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Toggle */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center px-4 md:px-6 sticky top-0 z-50 shadow-lg">
            <SidebarTrigger className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group shadow-sm">
              <Menu className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" />
            </SidebarTrigger>
            
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                شركة علي صالح الشهري القابضة
              </h1>
            </div>
            
            <div className="w-12"></div> {/* Spacer for centering */}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}