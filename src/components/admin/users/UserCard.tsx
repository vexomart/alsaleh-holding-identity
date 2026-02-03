import { memo } from "react";
import { motion } from "framer-motion";
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Shield, 
  UserCheck, 
  UserX, 
  Trash2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Crown,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
  preferred_language: string | null;
  roles: string[];
}

interface UserCardProps {
  user: User;
  language: string;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onChangeRole: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  formatRelativeTime: (date: string | null) => string;
}

const roleConfig: Record<string, { labelAr: string; labelEn: string; color: string; icon: typeof Crown }> = {
  super_admin: { labelAr: "مدير النظام", labelEn: "Super Admin", color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white", icon: Crown },
  admin: { labelAr: "مدير", labelEn: "Admin", color: "bg-gradient-to-r from-purple-500 to-violet-500 text-white", icon: Star },
  manager: { labelAr: "مشرف", labelEn: "Manager", color: "bg-blue-500/20 text-blue-700 border-blue-500/30", icon: Shield },
  support: { labelAr: "دعم فني", labelEn: "Support", color: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30", icon: Shield },
  finance: { labelAr: "مالية", labelEn: "Finance", color: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30", icon: Shield },
  content_editor: { labelAr: "محرر", labelEn: "Editor", color: "bg-pink-500/20 text-pink-700 border-pink-500/30", icon: Shield },
  staff: { labelAr: "موظف", labelEn: "Staff", color: "bg-slate-500/20 text-slate-700 border-slate-500/30", icon: Shield },
  customer: { labelAr: "عميل", labelEn: "Customer", color: "bg-gray-500/20 text-gray-700 border-gray-500/30", icon: Shield },
};

export const UserCard = memo(function UserCard({
  user,
  language,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onDelete,
  formatRelativeTime,
}: UserCardProps) {
  const primaryRole = user.roles[0] || "customer";
  const roleInfo = roleConfig[primaryRole] || roleConfig.customer;
  const displayName = language === "ar" && user.full_name_ar 
    ? user.full_name_ar 
    : user.full_name || user.email.split("@")[0];
  const isOnline = user.last_login_at && 
    (new Date().getTime() - new Date(user.last_login_at).getTime()) < 5 * 60 * 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative p-4 rounded-2xl border transition-all duration-200",
        "bg-card/50 backdrop-blur-sm hover:bg-card",
        "hover:shadow-lg hover:shadow-primary/5",
        isSelected && "ring-2 ring-primary border-primary/50 bg-primary/5"
      )}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 start-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 ring-2 ring-background shadow-lg">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Indicator */}
          <div className={cn(
            "absolute -bottom-0.5 -end-0.5 h-4 w-4 rounded-full border-2 border-background",
            isOnline ? "bg-emerald-500" : user.is_active ? "bg-amber-500" : "bg-gray-400"
          )}>
            {isOnline && (
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          {/* Name & Role */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate text-base">
                {displayName}
              </h3>
              <Badge 
                variant="outline" 
                className={cn("text-xs mt-1 border", roleInfo.color)}
              >
                {language === "ar" ? roleInfo.labelAr : roleInfo.labelEn}
              </Badge>
            </div>

            {/* Status Badge */}
            <Badge 
              variant={user.is_active ? "default" : "secondary"}
              className={cn(
                "shrink-0 text-xs gap-1",
                user.is_active 
                  ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/30" 
                  : "bg-gray-500/20 text-gray-600 border-gray-500/30"
              )}
            >
              {user.is_active ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {user.is_active 
                ? (language === "ar" ? "نشط" : "Active")
                : (language === "ar" ? "معطل" : "Inactive")}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 truncate cursor-default">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{user.email}</TooltipContent>
            </Tooltip>

            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span dir="ltr">{user.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{formatRelativeTime(user.last_login_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              {language === "ar" ? "الإجراءات" : "Actions"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onView}>
              <Eye className="h-4 w-4 me-2" />
              {language === "ar" ? "عرض التفاصيل" : "View Details"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 me-2" />
              {language === "ar" ? "تعديل" : "Edit"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onChangeRole}>
              <Shield className="h-4 w-4 me-2" />
              {language === "ar" ? "تغيير الدور" : "Change Role"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleStatus}>
              {user.is_active ? (
                <>
                  <UserX className="h-4 w-4 me-2" />
                  {language === "ar" ? "تعطيل" : "Deactivate"}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 me-2" />
                  {language === "ar" ? "تفعيل" : "Activate"}
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 me-2" />
              {language === "ar" ? "حذف" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
});
