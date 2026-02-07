/**
 * User Card - Command Center Dark Theme
 * Premium Bloomberg-style design with Real-time updates
 */

import React, { memo, useState } from "react";
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
  isHighlighted?: boolean;
  onSelect?: (selected: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onChangeRole: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  formatRelativeTime: (date: string | null) => string;
}

const roleConfig: Record<string, { labelAr: string; labelEn: string; color: string }> = {
  super_admin: { labelAr: "مدير النظام", labelEn: "Super Admin", color: "var(--cmd-accent-amber)" },
  admin: { labelAr: "مدير", labelEn: "Admin", color: "var(--cmd-accent-purple)" },
  manager: { labelAr: "مشرف", labelEn: "Manager", color: "var(--cmd-accent-blue)" },
  support: { labelAr: "دعم فني", labelEn: "Support", color: "var(--cmd-accent-cyan)" },
  finance: { labelAr: "مالية", labelEn: "Finance", color: "var(--cmd-accent-green)" },
  content_editor: { labelAr: "محرر", labelEn: "Editor", color: "265 70% 60%" },
  staff: { labelAr: "موظف", labelEn: "Staff", color: "220 15% 50%" },
  customer: { labelAr: "عميل", labelEn: "Customer", color: "220 12% 45%" },
};

export const UserCard = memo(function UserCard({
  user,
  language,
  isSelected,
  isHighlighted,
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

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHighlighted ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-200",
        isSelected && "ring-2 ring-[hsl(var(--cmd-accent-cyan))]",
        isHighlighted && "ring-2 ring-[hsl(var(--cmd-accent-green))]"
      )}
      style={{
        background: isHighlighted
          ? 'hsl(var(--cmd-accent-green) / 0.1)'
          : isSelected 
            ? 'hsl(var(--cmd-accent-cyan) / 0.1)' 
            : 'hsl(var(--cmd-bg-card))',
        border: isHighlighted 
          ? '1px solid hsl(var(--cmd-accent-green) / 0.5)'
          : '1px solid hsl(var(--cmd-border-subtle))',
      }}
    >
      {/* Highlight indicator */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 end-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
          style={{
            background: 'hsl(var(--cmd-accent-green))',
            color: 'white',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            •
          </motion.span>
          {language === 'ar' ? 'تم التحديث' : 'Updated'}
        </motion.div>
      )}
      
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 start-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 rounded border-2 cursor-pointer"
            style={{
              borderColor: 'hsl(var(--cmd-border-default))',
              background: isSelected ? 'hsl(var(--cmd-accent-cyan))' : 'transparent',
              accentColor: 'hsl(var(--cmd-accent-cyan))',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div 
            className="h-14 w-14 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: `linear-gradient(135deg, hsl(${roleInfo.color} / 0.3), hsl(${roleInfo.color} / 0.1))`,
              color: `hsl(${roleInfo.color})`,
              border: `1px solid hsl(${roleInfo.color} / 0.3)`,
            }}
          >
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={displayName}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* Online Indicator */}
          <div 
            className="absolute -bottom-0.5 -end-0.5 h-4 w-4 rounded-full border-2"
            style={{
              borderColor: 'hsl(var(--cmd-bg-card))',
              background: isOnline 
                ? 'hsl(var(--cmd-accent-green))' 
                : user.is_active 
                  ? 'hsl(var(--cmd-accent-amber))' 
                  : 'hsl(var(--cmd-text-dim))',
            }}
          >
            {isOnline && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'hsl(var(--cmd-accent-green))' }}
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
              <h3 
                className="font-semibold truncate text-base"
                style={{ color: 'hsl(var(--cmd-text-primary))' }}
              >
                {displayName}
              </h3>
              <span 
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md mt-1"
                style={{
                  background: `hsl(${roleInfo.color} / 0.15)`,
                  color: `hsl(${roleInfo.color})`,
                  border: `1px solid hsl(${roleInfo.color} / 0.3)`,
                }}
              >
                {primaryRole === 'super_admin' && <Crown className="h-3 w-3" />}
                {primaryRole === 'admin' && <Star className="h-3 w-3" />}
                {language === "ar" ? roleInfo.labelAr : roleInfo.labelEn}
              </span>
            </div>

            {/* Status Badge */}
            <span 
              className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{
                background: user.is_active 
                  ? 'hsl(var(--cmd-accent-green) / 0.15)' 
                  : 'hsl(var(--cmd-text-dim) / 0.15)',
                color: user.is_active 
                  ? 'hsl(var(--cmd-accent-green))' 
                  : 'hsl(var(--cmd-text-dim))',
              }}
            >
              {user.is_active ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {user.is_active 
                ? (language === "ar" ? "نشط" : "Active")
                : (language === "ar" ? "معطل" : "Inactive")}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 text-sm" style={{ color: 'hsl(var(--cmd-text-muted))' }}>
            <div className="flex items-center gap-2 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

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
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            style={{
              background: menuOpen ? 'hsl(var(--cmd-bg-hover))' : 'transparent',
              color: 'hsl(var(--cmd-text-secondary))',
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setMenuOpen(false)} 
              />
              <div 
                className="absolute end-0 top-10 z-50 w-48 rounded-xl p-1 shadow-xl"
                style={{
                  background: 'hsl(var(--cmd-bg-elevated))',
                  border: '1px solid hsl(var(--cmd-border-subtle))',
                }}
              >
                <p 
                  className="px-3 py-2 text-xs font-medium"
                  style={{ color: 'hsl(var(--cmd-text-dim))' }}
                >
                  {language === "ar" ? "الإجراءات" : "Actions"}
                </p>
                <div 
                  className="h-px my-1" 
                  style={{ background: 'hsl(var(--cmd-border-subtle))' }} 
                />
                
                <MenuItem icon={Eye} label={language === "ar" ? "عرض التفاصيل" : "View Details"} onClick={() => { onView(); setMenuOpen(false); }} />
                <MenuItem icon={Edit} label={language === "ar" ? "تعديل" : "Edit"} onClick={() => { onEdit(); setMenuOpen(false); }} />
                <MenuItem icon={Shield} label={language === "ar" ? "تغيير الدور" : "Change Role"} onClick={() => { onChangeRole(); setMenuOpen(false); }} />
                
                <div 
                  className="h-px my-1" 
                  style={{ background: 'hsl(var(--cmd-border-subtle))' }} 
                />
                
                <MenuItem 
                  icon={user.is_active ? UserX : UserCheck} 
                  label={user.is_active 
                    ? (language === "ar" ? "تعطيل" : "Deactivate")
                    : (language === "ar" ? "تفعيل" : "Activate")
                  } 
                  onClick={() => { onToggleStatus(); setMenuOpen(false); }} 
                />
                <MenuItem 
                  icon={Trash2} 
                  label={language === "ar" ? "حذف" : "Delete"} 
                  onClick={() => { onDelete(); setMenuOpen(false); }} 
                  danger 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Menu Item Component
const MenuItem: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon: Icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
    style={{
      color: danger ? 'hsl(var(--cmd-accent-red))' : 'hsl(var(--cmd-text-secondary))',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'hsl(var(--cmd-bg-hover))';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
    }}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);
