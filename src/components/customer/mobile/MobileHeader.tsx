/**
 * Mobile Header - Compact App-like Header
 * Sticky header with page title, back button, and actions
 */

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications";
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  Search,
} from "lucide-react";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

// Page title mappings
const pageTitles: Record<string, { ar: string; en: string }> = {
  "/app": { ar: "الرئيسية", en: "Home" },
  "/app/orders": { ar: "طلباتي", en: "My Orders" },
  "/app/services": { ar: "الخدمات", en: "Services" },
  "/app/wallet": { ar: "المحفظة", en: "Wallet" },
  "/app/profile": { ar: "الملف الشخصي", en: "Profile" },
  "/app/contracts": { ar: "عقودي", en: "Contracts" },
  "/app/invoices": { ar: "فواتيري", en: "Invoices" },
  "/app/notifications": { ar: "الإشعارات", en: "Notifications" },
  "/app/referrals": { ar: "الإحالات", en: "Referrals" },
  "/app/finance": { ar: "التمويل", en: "Finance" },
  "/app/transactions": { ar: "المعاملات", en: "Transactions" },
};

export function MobileHeader({
  title,
  showBackButton = true,
  showSearch = false,
  onMenuClick,
  onSearchClick,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();
  const { user, profile } = useAuth();

  // Get page title
  const currentPath = location.pathname;
  const pageInfo = pageTitles[currentPath];
  const displayTitle = title || (pageInfo ? (isRTL ? pageInfo.ar : pageInfo.en) : "");

  // Determine if we should show back button
  const canGoBack = currentPath !== "/app" && showBackButton;

  // RTL-aware back icon
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  const handleBack = () => {
    // Try to go back, fallback to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/app");
    }
  };

  const userInitial = (profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U";

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-40",
        "bg-background/95 backdrop-blur-xl",
        "border-b border-border/50",
        "px-4 h-14",
        "flex items-center gap-3",
        "md:hidden" // Only show on mobile
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      {/* Start: Back/Menu Button */}
      <div className="flex items-center">
        {canGoBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full -ms-2"
          >
            <BackIcon className="h-5 w-5" />
          </Button>
        ) : onMenuClick ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-full -ms-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      {/* Center: Title */}
      <div className="flex-1 min-w-0">
        <motion.h1
          key={displayTitle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-foreground truncate"
        >
          {displayTitle}
        </motion.h1>
      </div>

      {/* End: Actions */}
      <div className="flex items-center gap-1">
        {showSearch && onSearchClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="h-10 w-10 rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* Notifications */}
        <NotificationBell
          userId={user?.id}
          roleTarget="customer"
          isRTL={isRTL}
          notificationsPageUrl="/app/notifications"
          maxItems={5}
        />

        {/* User Avatar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/app/profile")}
          className="h-10 w-10 rounded-full p-0"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </motion.header>
  );
}

export default MobileHeader;
