import { useEffect, useState, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  LayoutGrid, 
  List,
  Users2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { UserStatsCards } from "./UserStatsCards";
import { UsersFilters } from "./UsersFilters";
import { UserCard } from "./UserCard";
import { UserDialogs } from "./UserDialogs";

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

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  growthRate?: number;
}

function UsersManagementComponent() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0, newThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Prevent duplicate fetches on mount (React 18 StrictMode)
  const hasFetched = useRef(false);
  
  // Selection state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Edit form state
  const [editingName, setEditingName] = useState("");
  const [editingPhone, setEditingPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Map roles to users
      const rolesMap = new Map<string, string[]>();
      userRoles?.forEach((ur) => {
        if (!rolesMap.has(ur.user_id)) {
          rolesMap.set(ur.user_id, []);
        }
        rolesMap.get(ur.user_id)?.push(ur.role);
      });

      const usersWithRoles: User[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email || "",
        full_name: profile.full_name,
        full_name_ar: profile.full_name_ar,
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        is_active: profile.is_active,
        last_login_at: profile.last_login_at,
        created_at: profile.created_at,
        preferred_language: profile.preferred_language,
        roles: rolesMap.get(profile.id) || ["customer"],
      }));

      setUsers(usersWithRoles);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const newThisMonth = usersWithRoles.filter(
        (u) => u.created_at && new Date(u.created_at) >= startOfMonth
      ).length;
      
      const newLastMonth = usersWithRoles.filter(
        (u) => u.created_at && new Date(u.created_at) >= lastMonth && new Date(u.created_at) <= endOfLastMonth
      ).length;

      const growthRate = newLastMonth > 0 
        ? Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100)
        : newThisMonth > 0 ? 100 : 0;

      setStats({
        total: usersWithRoles.length,
        active: usersWithRoles.filter((u) => u.is_active).length,
        inactive: usersWithRoles.filter((u) => !u.is_active).length,
        newThisMonth,
        growthRate,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(language === "ar" ? "خطأ في تحميل المستخدمين" : "Error loading users");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    // Prevent duplicate fetches on mount (React 18 StrictMode)
    if (hasFetched.current && !isRefreshing) return;
    hasFetched.current = true;
    fetchUsers();
  }, [fetchUsers, isRefreshing]);

  // Filter users
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.full_name_ar?.includes(query) ||
        user.phone?.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => 
        statusFilter === "active" ? user.is_active : !user.is_active
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter, roleFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !user.is_active })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(
        language === "ar" 
          ? `تم ${user.is_active ? 'تعطيل' : 'تفعيل'} المستخدم` 
          : `User ${user.is_active ? 'deactivated' : 'activated'}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(language === "ar" ? "خطأ في تحديث المستخدم" : "Error updating user");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: editingName,
          phone: editingPhone 
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast.success(language === "ar" ? "تم تحديث بيانات المستخدم" : "User updated successfully");
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(language === "ar" ? "خطأ في تحديث المستخدم" : "Error updating user");
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !selectedRole) return;
    try {
      // First remove existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id);

      // Then add the new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUser.id, role: selectedRole as any });

      if (error) throw error;

      toast.success(language === "ar" ? "تم تغيير دور المستخدم" : "User role changed successfully");
      setIsRoleDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(language === "ar" ? "خطأ في تغيير الدور" : "Error changing role");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast.success(language === "ar" ? "تم حذف المستخدم" : "User deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(language === "ar" ? "خطأ في حذف المستخدم" : "Error deleting user");
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditingName(user.full_name || "");
    setEditingPhone(user.phone || "");
    setIsEditDialogOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.roles[0] || "customer");
    setIsRoleDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === "ar" ? "غير متوفر" : "N/A";
    return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return language === "ar" ? "لم يسجل دخول" : "Never logged in";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return language === "ar" ? "متصل الآن" : "Online now";
    if (diffMins < 60) return language === "ar" ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return language === "ar" ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays < 30) return language === "ar" ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    const newSelection = new Set(selectedUsers);
    if (selected) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    setSelectedUsers(newSelection);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--cmd-accent-cyan) / 0.2), hsl(var(--cmd-accent-blue) / 0.1))',
                border: '1px solid hsl(var(--cmd-accent-cyan) / 0.3)',
              }}
            >
              <Users2 className="h-7 w-7" style={{ color: 'hsl(var(--cmd-accent-cyan))' }} />
            </div>
            <div>
              <h1 
                className="text-2xl font-bold flex items-center gap-2"
                style={{ color: 'hsl(var(--cmd-text-primary))' }}
              >
                {language === "ar" ? "إدارة المستخدمين" : "User Management"}
                <Sparkles className="h-5 w-5" style={{ color: 'hsl(var(--cmd-accent-amber))' }} />
              </h1>
              <p 
                className="text-sm flex items-center gap-2"
                style={{ color: 'hsl(var(--cmd-text-muted))' }}
              >
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: 'hsl(var(--cmd-accent-green))' }}
                />
                {language === "ar" 
                  ? "إدارة وتتبع جميع المستخدمين في النظام"
                  : "Manage and track all users in the system"}
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'hsl(var(--cmd-bg-elevated))' }}
          >
            <button
              className={cn(
                "h-9 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all",
              )}
              style={{
                background: viewMode === "grid" ? 'hsl(var(--cmd-accent-cyan))' : 'transparent',
                color: viewMode === "grid" ? 'hsl(var(--cmd-bg-deep))' : 'hsl(var(--cmd-text-secondary))',
              }}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              {language === "ar" ? "شبكة" : "Grid"}
            </button>
            <button
              className={cn(
                "h-9 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all",
              )}
              style={{
                background: viewMode === "list" ? 'hsl(var(--cmd-accent-cyan))' : 'transparent',
                color: viewMode === "list" ? 'hsl(var(--cmd-bg-deep))' : 'hsl(var(--cmd-text-secondary))',
              }}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              {language === "ar" ? "قائمة" : "List"}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <UserStatsCards 
          stats={stats} 
          language={language} 
          isLoading={isLoading} 
        />

        {/* Filters */}
        <div 
          className="rounded-xl p-4"
          style={{
            background: 'hsl(var(--cmd-bg-card))',
            border: '1px solid hsl(var(--cmd-border-subtle))',
          }}
        >
          <UsersFilters
            language={language}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            selectedCount={selectedUsers.size}
            onClearSelection={() => setSelectedUsers(new Set())}
          />
        </div>

        {/* Users List */}
        <div 
          className="rounded-xl overflow-hidden"
          style={{
            background: 'hsl(var(--cmd-bg-card))',
            border: '1px solid hsl(var(--cmd-border-subtle))',
          }}
        >
          <div 
            className="flex items-center gap-2 px-5 py-4"
            style={{ borderBottom: '1px solid hsl(var(--cmd-border-subtle))' }}
          >
            <Users className="h-5 w-5" style={{ color: 'hsl(var(--cmd-accent-cyan))' }} />
            <h2 
              className="text-base font-semibold"
              style={{ color: 'hsl(var(--cmd-text-primary))' }}
            >
              {language === "ar" ? "قائمة المستخدمين" : "Users List"}
            </h2>
            <span 
              className="ms-2 text-sm font-normal"
              style={{ color: 'hsl(var(--cmd-text-muted))' }}
            >
              ({filteredUsers.length})
            </span>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="h-40 rounded-xl animate-pulse"
                    style={{ background: 'hsl(var(--cmd-bg-elevated))' }}
                  />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div 
                  className="p-4 rounded-full mb-4"
                  style={{ background: 'hsl(var(--cmd-bg-elevated))' }}
                >
                  <Users className="h-8 w-8" style={{ color: 'hsl(var(--cmd-text-muted))' }} />
                </div>
                <h3 
                  className="font-semibold text-lg mb-1"
                  style={{ color: 'hsl(var(--cmd-text-primary))' }}
                >
                  {language === "ar" ? "لا يوجد مستخدمين" : "No users found"}
                </h3>
                <p 
                  className="text-sm max-w-sm"
                  style={{ color: 'hsl(var(--cmd-text-muted))' }}
                >
                  {language === "ar" 
                    ? "لم يتم العثور على مستخدمين مطابقين للبحث"
                    : "No users match your current filters"}
                </p>
              </motion.div>
            ) : (
              <div 
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    language={language}
                    isSelected={selectedUsers.has(user.id)}
                    onSelect={(selected) => handleSelectUser(user.id, selected)}
                    onView={() => {
                      setSelectedUser(user);
                      setIsViewDialogOpen(true);
                    }}
                    onEdit={() => openEditDialog(user)}
                    onChangeRole={() => openRoleDialog(user)}
                    onToggleStatus={() => handleToggleStatus(user)}
                    onDelete={() => {
                      setSelectedUser(user);
                      setIsDeleteDialogOpen(true);
                    }}
                    formatRelativeTime={formatRelativeTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <UserDialogs
          language={language}
          selectedUser={selectedUser}
          isViewDialogOpen={isViewDialogOpen}
          onViewDialogChange={setIsViewDialogOpen}
          onEditFromView={() => {
            setIsViewDialogOpen(false);
            if (selectedUser) openEditDialog(selectedUser);
          }}
          formatDate={formatDate}
          formatRelativeTime={formatRelativeTime}
          isEditDialogOpen={isEditDialogOpen}
          onEditDialogChange={setIsEditDialogOpen}
          editingName={editingName}
          onEditingNameChange={setEditingName}
          editingPhone={editingPhone}
          onEditingPhoneChange={setEditingPhone}
          onSaveEdit={handleEditUser}
          isRoleDialogOpen={isRoleDialogOpen}
          onRoleDialogChange={setIsRoleDialogOpen}
          selectedRole={selectedRole}
          onSelectedRoleChange={setSelectedRole}
          onSaveRole={handleChangeRole}
          isDeleteDialogOpen={isDeleteDialogOpen}
          onDeleteDialogChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteUser}
        />
      </div>
    </TooltipProvider>
  );
}

// Memoize to prevent re-renders from parent layout changes
export const UsersManagement = memo(UsersManagementComponent);
UsersManagement.displayName = 'UsersManagement';
