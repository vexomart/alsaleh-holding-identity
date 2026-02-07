/**
 * Users Filters - Command Center Dark Theme
 * Premium Bloomberg-style design
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  SlidersHorizontal,
  CheckCircle2,
  Download,
  RefreshCw,
  UserPlus,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersFiltersProps {
  language: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  onRefresh: () => void;
  onExport?: () => void;
  onAddUser?: () => void;
  isRefreshing?: boolean;
  selectedCount?: number;
  onClearSelection?: () => void;
}

const roles = [
  { value: "all", labelAr: "جميع الأدوار", labelEn: "All Roles" },
  { value: "super_admin", labelAr: "مدير النظام", labelEn: "Super Admin" },
  { value: "admin", labelAr: "مدير", labelEn: "Admin" },
  { value: "manager", labelAr: "مشرف", labelEn: "Manager" },
  { value: "support", labelAr: "دعم فني", labelEn: "Support" },
  { value: "finance", labelAr: "مالية", labelEn: "Finance" },
  { value: "content_editor", labelAr: "محرر محتوى", labelEn: "Content Editor" },
  { value: "staff", labelAr: "موظف", labelEn: "Staff" },
  { value: "customer", labelAr: "عميل", labelEn: "Customer" },
];

const statuses = [
  { value: "all", labelAr: "جميع الحالات", labelEn: "All Status" },
  { value: "active", labelAr: "نشط", labelEn: "Active" },
  { value: "inactive", labelAr: "معطل", labelEn: "Inactive" },
];

// Custom Select Component for dark theme
const DarkSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; labelAr: string; labelEn: string }[];
  language: string;
  placeholder?: string;
}> = ({ value, onChange, options, language, placeholder }) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 h-11 px-4 min-w-[140px] rounded-xl text-sm transition-all"
        style={{
          background: 'hsl(var(--cmd-bg-elevated))',
          border: '1px solid hsl(var(--cmd-border-subtle))',
          color: 'hsl(var(--cmd-text-secondary))',
        }}
      >
        <span>{selectedOption ? (language === 'ar' ? selectedOption.labelAr : selectedOption.labelEn) : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div 
            className="absolute top-full mt-1 start-0 z-50 min-w-full rounded-xl p-1 shadow-xl"
            style={{
              background: 'hsl(var(--cmd-bg-elevated))',
              border: '1px solid hsl(var(--cmd-border-subtle))',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={cn(
                  "w-full px-3 py-2 text-sm text-start rounded-lg transition-colors",
                  value === option.value && "font-medium"
                )}
                style={{
                  color: value === option.value 
                    ? 'hsl(var(--cmd-accent-cyan))' 
                    : 'hsl(var(--cmd-text-secondary))',
                  background: value === option.value 
                    ? 'hsl(var(--cmd-accent-cyan) / 0.1)' 
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = 'hsl(var(--cmd-bg-hover))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {language === 'ar' ? option.labelAr : option.labelEn}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function UsersFilters({
  language,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  onRefresh,
  onExport,
  onAddUser,
  isRefreshing,
  selectedCount = 0,
  onClearSelection,
}: UsersFiltersProps) {
  const activeFiltersCount = [
    statusFilter !== "all",
    roleFilter !== "all",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onRoleChange("all");
  };

  return (
    <div className="space-y-4">
      {/* Main Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search 
            className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4" 
            style={{ color: 'hsl(var(--cmd-text-muted))' }}
          />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === "ar" ? "بحث بالاسم أو البريد أو الهاتف..." : "Search by name, email or phone..."}
            className="w-full h-11 ps-10 pe-10 rounded-xl text-sm transition-all outline-none"
            style={{
              background: 'hsl(var(--cmd-bg-elevated))',
              border: '1px solid hsl(var(--cmd-border-subtle))',
              color: 'hsl(var(--cmd-text-primary))',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--cmd-accent-cyan))';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--cmd-border-subtle))';
            }}
          />
          {searchQuery && (
            <button
              className="absolute end-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg transition-colors"
              onClick={() => onSearchChange("")}
              style={{ color: 'hsl(var(--cmd-text-muted))' }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <DarkSelect
            value={statusFilter}
            onChange={onStatusChange}
            options={statuses}
            language={language}
          />

          {/* Role Filter */}
          <DarkSelect
            value={roleFilter}
            onChange={onRoleChange}
            options={roles}
            language={language}
          />

          {/* Filter indicator */}
          {activeFiltersCount > 0 && (
            <span 
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                background: 'hsl(var(--cmd-accent-cyan) / 0.15)',
                color: 'hsl(var(--cmd-accent-cyan))',
              }}
            >
              {activeFiltersCount} {language === 'ar' ? 'فلتر' : 'filter'}
            </span>
          )}

          {/* Divider */}
          <div 
            className="h-8 w-px hidden sm:block" 
            style={{ background: 'hsl(var(--cmd-border-subtle))' }}
          />

          {/* Action Buttons */}
          <button
            className="h-11 w-11 flex items-center justify-center rounded-xl transition-all"
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              background: 'hsl(var(--cmd-bg-elevated))',
              border: '1px solid hsl(var(--cmd-border-subtle))',
              color: 'hsl(var(--cmd-text-secondary))',
            }}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>

          {onExport && (
            <button
              className="h-11 w-11 flex items-center justify-center rounded-xl transition-all"
              onClick={onExport}
              style={{
                background: 'hsl(var(--cmd-bg-elevated))',
                border: '1px solid hsl(var(--cmd-border-subtle))',
                color: 'hsl(var(--cmd-text-secondary))',
              }}
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {onAddUser && (
            <button
              className="h-11 px-4 flex items-center gap-2 rounded-xl text-sm font-medium transition-all"
              onClick={onAddUser}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--cmd-accent-cyan)), hsl(var(--cmd-accent-blue)))',
                color: 'white',
              }}
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === "ar" ? "إضافة مستخدم" : "Add User"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters & Selection */}
      <AnimatePresence>
        {(activeFiltersCount > 0 || selectedCount > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'hsl(var(--cmd-accent-cyan) / 0.15)',
                  border: '1px solid hsl(var(--cmd-accent-cyan) / 0.3)',
                }}
              >
                <CheckCircle2 
                  className="h-4 w-4" 
                  style={{ color: 'hsl(var(--cmd-accent-cyan))' }} 
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--cmd-accent-cyan))' }}
                >
                  {language === "ar" 
                    ? `${selectedCount} محدد`
                    : `${selectedCount} selected`}
                </span>
                <button
                  className="text-xs px-2 py-0.5 rounded transition-colors"
                  onClick={onClearSelection}
                  style={{ color: 'hsl(var(--cmd-text-muted))' }}
                >
                  {language === "ar" ? "إلغاء التحديد" : "Clear"}
                </button>
              </motion.div>
            )}

            {statusFilter !== "all" && (
              <span 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                onClick={() => onStatusChange("all")}
                style={{
                  background: 'hsl(var(--cmd-bg-elevated))',
                  color: 'hsl(var(--cmd-text-secondary))',
                }}
              >
                {language === "ar" ? "الحالة:" : "Status:"}{" "}
                {statuses.find(s => s.value === statusFilter)?.[language === "ar" ? "labelAr" : "labelEn"]}
                <X className="h-3 w-3" />
              </span>
            )}

            {roleFilter !== "all" && (
              <span 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                onClick={() => onRoleChange("all")}
                style={{
                  background: 'hsl(var(--cmd-bg-elevated))',
                  color: 'hsl(var(--cmd-text-secondary))',
                }}
              >
                {language === "ar" ? "الدور:" : "Role:"}{" "}
                {roles.find(r => r.value === roleFilter)?.[language === "ar" ? "labelAr" : "labelEn"]}
                <X className="h-3 w-3" />
              </span>
            )}

            {activeFiltersCount > 0 && (
              <button
                className="text-sm transition-colors"
                onClick={clearAllFilters}
                style={{ color: 'hsl(var(--cmd-text-muted))' }}
              >
                {language === "ar" ? "مسح الكل" : "Clear all"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
