/**
 * Profile Tabs - Navigation for profile sections
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  User, 
  Shield, 
  Bell, 
  Wallet,
  Settings,
  FileText
} from "lucide-react";

export type ProfileTabId = "info" | "security" | "notifications" | "wallet" | "preferences";

interface ProfileTab {
  id: ProfileTabId;
  labelEn: string;
  labelAr: string;
  icon: React.ElementType;
}

const PROFILE_TABS: ProfileTab[] = [
  { id: "info", labelEn: "Personal Info", labelAr: "المعلومات الشخصية", icon: User },
  { id: "security", labelEn: "Security", labelAr: "الأمان", icon: Shield },
  { id: "wallet", labelEn: "Wallet", labelAr: "المحفظة", icon: Wallet },
  { id: "notifications", labelEn: "Notifications", labelAr: "الإشعارات", icon: Bell },
  { id: "preferences", labelEn: "Preferences", labelAr: "التفضيلات", icon: Settings },
];

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-2xl">
      {PROFILE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeProfileTab"
                className="absolute inset-0 bg-background rounded-xl shadow-sm border"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isRTL ? tab.labelAr : tab.labelEn}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
