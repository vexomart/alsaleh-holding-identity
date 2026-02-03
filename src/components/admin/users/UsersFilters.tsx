import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  CheckCircle2,
  Download,
  RefreshCw,
  UserPlus,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === "ar" ? "بحث بالاسم أو البريد أو الهاتف..." : "Search by name, email or phone..."}
            className="ps-10 pe-10 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl border-border/50 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {language === "ar" ? status.labelAr : status.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={onRoleChange}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl border-border/50 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {language === "ar" ? role.labelAr : role.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Toggle */}
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "h-11 rounded-xl border-border/50 gap-2",
                  activeFiltersCount > 0 && "border-primary/50 bg-primary/5"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "ar" ? "فلترة متقدمة" : "Advanced"}
                </span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {language === "ar" ? "فلترة متقدمة" : "Advanced Filters"}
                  </h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      {language === "ar" ? "مسح الكل" : "Clear all"}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      {language === "ar" ? "الحالة" : "Status"}
                    </label>
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {language === "ar" ? status.labelAr : status.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      {language === "ar" ? "الدور" : "Role"}
                    </label>
                    <Select value={roleFilter} onValueChange={onRoleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {language === "ar" ? role.labelAr : role.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-8 w-px bg-border/50 hidden sm:block" />

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-border/50"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>

          {onExport && (
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl border-border/50"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          {onAddUser && (
            <Button
              className="h-11 rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
              onClick={onAddUser}
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === "ar" ? "إضافة مستخدم" : "Add User"}
              </span>
            </Button>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {language === "ar" 
                    ? `${selectedCount} محدد`
                    : `${selectedCount} selected`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onClearSelection}
                >
                  {language === "ar" ? "إلغاء التحديد" : "Clear"}
                </Button>
              </motion.div>
            )}

            {statusFilter !== "all" && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => onStatusChange("all")}
              >
                {language === "ar" ? "الحالة:" : "Status:"}{" "}
                {statuses.find(s => s.value === statusFilter)?.[language === "ar" ? "labelAr" : "labelEn"]}
                <X className="h-3 w-3" />
              </Badge>
            )}

            {roleFilter !== "all" && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => onRoleChange("all")}
              >
                {language === "ar" ? "الدور:" : "Role:"}{" "}
                {roles.find(r => r.value === roleFilter)?.[language === "ar" ? "labelAr" : "labelEn"]}
                <X className="h-3 w-3" />
              </Badge>
            )}

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={clearAllFilters}
              >
                {language === "ar" ? "مسح الكل" : "Clear all"}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
