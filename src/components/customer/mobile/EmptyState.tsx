/**
 * Empty State - Beautiful Empty States for Mobile
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  Bell, 
  Search,
  Inbox
} from "lucide-react";

type EmptyStateType = "orders" | "services" | "documents" | "notifications" | "search" | "default";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    labelAr?: string;
    onClick: () => void;
  };
  className?: string;
}

const defaultContent: Record<EmptyStateType, { 
  icon: typeof Package; 
  titleAr: string; 
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}> = {
  orders: {
    icon: ShoppingCart,
    titleAr: "لا توجد طلبات",
    titleEn: "No Orders",
    descriptionAr: "لم تقم بإنشاء أي طلبات بعد. ابدأ بتصفح الخدمات المتاحة.",
    descriptionEn: "You haven't created any orders yet. Start by browsing available services.",
  },
  services: {
    icon: Package,
    titleAr: "لا توجد خدمات",
    titleEn: "No Services",
    descriptionAr: "لا توجد خدمات متاحة حالياً.",
    descriptionEn: "No services available at the moment.",
  },
  documents: {
    icon: FileText,
    titleAr: "لا توجد مستندات",
    titleEn: "No Documents",
    descriptionAr: "لم يتم العثور على أي مستندات.",
    descriptionEn: "No documents found.",
  },
  notifications: {
    icon: Bell,
    titleAr: "لا توجد إشعارات",
    titleEn: "No Notifications",
    descriptionAr: "أنت محدث! لا توجد إشعارات جديدة.",
    descriptionEn: "You're all caught up! No new notifications.",
  },
  search: {
    icon: Search,
    titleAr: "لا توجد نتائج",
    titleEn: "No Results",
    descriptionAr: "لم نتمكن من العثور على أي نتائج. حاول تغيير كلمات البحث.",
    descriptionEn: "We couldn't find any results. Try different search terms.",
  },
  default: {
    icon: Inbox,
    titleAr: "لا توجد بيانات",
    titleEn: "No Data",
    descriptionAr: "لا توجد بيانات للعرض حالياً.",
    descriptionEn: "No data to display at the moment.",
  },
};

export function EmptyState({
  type = "default",
  title,
  titleAr,
  description,
  descriptionAr,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const { isRTL } = useLanguage();
  const content = defaultContent[type];
  const Icon = content.icon;

  const displayTitle = title || (isRTL ? (titleAr || content.titleAr) : content.titleEn);
  const displayDescription = description || (isRTL ? (descriptionAr || content.descriptionAr) : content.descriptionEn);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center",
        "py-12 px-6 text-center",
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150" />
        
        {/* Icon Container */}
        <div className="relative w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          {icon || <Icon className="h-10 w-10 text-muted-foreground" />}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground max-w-[280px] leading-relaxed"
      >
        {displayDescription}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button
            onClick={action.onClick}
            className="h-11 px-6 rounded-xl"
          >
            {isRTL ? (action.labelAr || action.label) : action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EmptyState;
