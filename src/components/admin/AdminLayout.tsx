import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { useLanguage } from "@/hooks/useLanguage";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { canAccessAdmin, isLoading: rbacLoading } = useRBAC();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const isLoading = authLoading || rbacLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
      } else if (!canAccessAdmin) {
        // If user doesn't have admin access, redirect to customer app
        navigate(ROUTES.APP.ROOT, { replace: true });
      }
    }
  }, [user, canAccessAdmin, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!user || !canAccessAdmin) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("min-h-screen flex w-full", isRTL && "flex-row-reverse")}>
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
