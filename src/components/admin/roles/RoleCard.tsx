/**
 * RoleCard Component - Modern Role Display (Dark Theme)
 * Shows role information with permission stats
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Crown, 
  Shield, 
  Briefcase, 
  UserCog, 
  User, 
  Headphones, 
  DollarSign, 
  PenTool,
  ChevronLeft,
  ChevronRight,
  Users,
  Sparkles
} from "lucide-react";

interface RoleCardProps {
  role: string;
  language: string;
  permissionsCount: number;
  totalPermissions: number;
  usersCount?: number;
  onClick: () => void;
  index: number;
}

const roleConfigs: Record<string, {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  borderColor: string;
}> = {
  super_admin: {
    name: "Super Admin",
    nameAr: "مدير عام",
    description: "Full system access with all permissions",
    descriptionAr: "صلاحيات كاملة للنظام",
    icon: Crown,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    iconBg: "bg-amber-500/20",
    borderColor: "border-amber-500/30"
  },
  admin: {
    name: "Admin",
    nameAr: "مدير",
    description: "Administrative access to manage the system",
    descriptionAr: "صلاحيات إدارية لإدارة النظام",
    icon: Shield,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    iconBg: "bg-blue-500/20",
    borderColor: "border-blue-500/30"
  },
  manager: {
    name: "Manager",
    nameAr: "مشرف",
    description: "Manage orders, services and staff",
    descriptionAr: "إدارة الطلبات والخدمات والموظفين",
    icon: Briefcase,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    iconBg: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30"
  },
  staff: {
    name: "Staff",
    nameAr: "موظف",
    description: "Handle day-to-day operations",
    descriptionAr: "التعامل مع العمليات اليومية",
    icon: UserCog,
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    iconBg: "bg-slate-500/20",
    borderColor: "border-slate-500/30"
  },
  customer: {
    name: "Customer",
    nameAr: "عميل",
    description: "Basic access for customers",
    descriptionAr: "صلاحيات أساسية للعملاء",
    icon: User,
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    iconBg: "bg-gray-500/20",
    borderColor: "border-gray-500/30"
  },
  support: {
    name: "Support",
    nameAr: "دعم فني",
    description: "Handle customer support tickets",
    descriptionAr: "التعامل مع تذاكر الدعم الفني",
    icon: Headphones,
    gradient: "from-pink-500 via-rose-500 to-red-400",
    iconBg: "bg-pink-500/20",
    borderColor: "border-pink-500/30"
  },
  finance: {
    name: "Finance",
    nameAr: "مالية",
    description: "Access to financial reports and transactions",
    descriptionAr: "الوصول للتقارير المالية والمعاملات",
    icon: DollarSign,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    iconBg: "bg-green-500/20",
    borderColor: "border-green-500/30"
  },
  content_editor: {
    name: "Content Editor",
    nameAr: "محرر محتوى",
    description: "Manage website content and pages",
    descriptionAr: "إدارة محتوى الموقع والصفحات",
    icon: PenTool,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    iconBg: "bg-violet-500/20",
    borderColor: "border-violet-500/30"
  }
};

export function RoleCard({ 
  role, 
  language, 
  permissionsCount, 
  totalPermissions, 
  usersCount = 0,
  onClick,
  index 
}: RoleCardProps) {
  const config = roleConfigs[role] || roleConfigs.customer;
  const Icon = config.icon;
  const percentage = totalPermissions > 0 ? Math.round((permissionsCount / totalPermissions) * 100) : 0;
  const isRTL = language === "ar";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl",
        "bg-[#0f1629] border",
        config.borderColor,
        "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
      )}
    >
      {/* Gradient Top Bar */}
      <div className={cn(
        "absolute top-0 inset-x-0 h-1 bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity",
        config.gradient
      )} />

      {/* Decorative Background */}
      <div className="absolute -top-24 -end-24 w-48 h-48 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity text-white/10">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className={cn(
                "relative p-3 rounded-xl bg-gradient-to-br",
                config.gradient
              )}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 text-white" />
              {role === 'super_admin' && (
                <Sparkles className="absolute -top-1 -end-1 h-3 w-3 text-amber-300 animate-pulse" />
              )}
            </motion.div>
            <div>
              <h3 className="font-bold text-white">
                {isRTL ? config.nameAr : config.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {isRTL ? config.descriptionAr : config.description}
              </p>
            </div>
          </div>
          <ChevronIcon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Permissions Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {isRTL ? "الصلاحيات" : "Permissions"}
              </span>
              <span className="font-semibold tabular-nums text-white">
                {permissionsCount}/{totalPermissions}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={cn("absolute inset-y-0 start-0 rounded-full bg-gradient-to-r", config.gradient)}
              />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span>{usersCount} {isRTL ? "مستخدم" : "users"}</span>
            </div>
            <Badge 
              variant="outline"
              className={cn(
                "text-xs font-medium border-slate-600 text-slate-300",
                percentage === 100 && "bg-gradient-to-r border-0 text-white " + config.gradient
              )}
            >
              {percentage}%
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { roleConfigs };
