import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
}

export function UsersManagement() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0, newThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

      // Combine profiles with roles
      const usersWithRoles: User[] = (profiles || []).map(profile => ({
        ...profile,
        roles: userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        total: usersWithRoles.length,
        active: usersWithRoles.filter(u => u.is_active).length,
        inactive: usersWithRoles.filter(u => !u.is_active).length,
        newThisMonth: usersWithRoles.filter(u => 
          u.created_at && new Date(u.created_at) >= startOfMonth
        ).length
      });

    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(language === "ar" ? "خطأ في جلب المستخدمين" : "Error fetching users");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchUsers();
          toast.info(language === "ar" ? "تم تحديث البيانات" : "Data updated", {
            duration: 2000
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers, language]);

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
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(language === "ar" ? "خطأ في تحديث المستخدم" : "Error updating user");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === "ar" ? "غير متوفر" : "N/A";
    return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; labelAr: string; color: string }> = {
      super_admin: { label: "Super Admin", labelAr: "مدير عام", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      admin: { label: "Admin", labelAr: "مدير", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
      manager: { label: "Manager", labelAr: "مشرف", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      staff: { label: "Staff", labelAr: "موظف", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      customer: { label: "Customer", labelAr: "عميل", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
      support: { label: "Support", labelAr: "دعم فني", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      finance: { label: "Finance", labelAr: "مالية", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
      content_editor: { label: "Content Editor", labelAr: "محرر محتوى", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" }
    };
    const config = roleConfig[role] || { label: role, labelAr: role, color: "bg-gray-100 text-gray-700" };
    return (
      <Badge className={cn("text-xs font-normal", config.color)}>
        {language === "ar" ? config.labelAr : config.label}
      </Badge>
    );
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const statCards = [
    {
      titleAr: "إجمالي المستخدمين",
      titleEn: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      titleAr: "المستخدمين النشطين",
      titleEn: "Active Users",
      value: stats.active,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      titleAr: "المستخدمين المعطلين",
      titleEn: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
      gradient: "from-red-500 to-red-600"
    },
    {
      titleAr: "مستخدمين جدد هذا الشهر",
      titleEn: "New This Month",
      value: stats.newThisMonth,
      icon: UserPlus,
      color: "text-violet-600",
      bg: "bg-violet-100 dark:bg-violet-900/30",
      gradient: "from-violet-500 to-violet-600"
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            {language === "ar" ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {language === "ar" 
              ? "إدارة وتتبع جميع المستخدمين في النظام"
              : "Manage and track all users in the system"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">{language === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "ar" ? "إضافة مستخدم" : "Add User"}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r", stat.gradient)} />
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {language === "ar" ? stat.titleAr : stat.titleEn}
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-2 md:p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: "400ms" }}>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "ar" ? "بحث بالاسم أو البريد أو الهاتف..." : "Search by name, email, or phone..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={language === "ar" ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
                <SelectItem value="active">{language === "ar" ? "نشط" : "Active"}</SelectItem>
                <SelectItem value="inactive">{language === "ar" ? "معطل" : "Inactive"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={language === "ar" ? "الدور" : "Role"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع الأدوار" : "All Roles"}</SelectItem>
                <SelectItem value="super_admin">{language === "ar" ? "مدير عام" : "Super Admin"}</SelectItem>
                <SelectItem value="admin">{language === "ar" ? "مدير" : "Admin"}</SelectItem>
                <SelectItem value="manager">{language === "ar" ? "مشرف" : "Manager"}</SelectItem>
                <SelectItem value="staff">{language === "ar" ? "موظف" : "Staff"}</SelectItem>
                <SelectItem value="customer">{language === "ar" ? "عميل" : "Customer"}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: "500ms" }}>
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === "ar" ? "قائمة المستخدمين" : "Users List"}
              <Badge variant="secondary" className="ms-2">
                {filteredUsers.length}
              </Badge>
            </CardTitle>
            {filteredUsers.length > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === "ar" ? "تحديث مباشر" : "Live updates"}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-2">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">
                {language === "ar" ? "لا يوجد مستخدمين" : "No users found"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "ar" 
                  ? "جرب تغيير معايير البحث"
                  : "Try changing your search criteria"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-3 md:gap-4 p-3 md:p-4 transition-all hover:bg-muted/50 group",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${550 + index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-background shadow-md">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {getInitials(user.full_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <span className={cn(
                      "absolute bottom-0 end-0 w-3 h-3 rounded-full border-2 border-background",
                      user.is_active ? "bg-emerald-500" : "bg-gray-400"
                    )} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-base truncate">
                        {language === "ar" 
                          ? user.full_name_ar || user.full_name || user.email.split('@')[0]
                          : user.full_name || user.email.split('@')[0]}
                      </p>
                      {user.roles.length > 0 && (
                        <div className="hidden sm:flex gap-1">
                          {user.roles.slice(0, 2).map(role => getRoleBadge(role))}
                          {user.roles.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{user.roles.length - 2}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </span>
                      {user.phone && (
                        <span className="hidden md:flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Last Login */}
                  <div className="hidden lg:block text-end">
                    <Badge className={cn(
                      "mb-1",
                      user.is_active 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    )}>
                      {user.is_active 
                        ? (language === "ar" ? "نشط" : "Active")
                        : (language === "ar" ? "معطل" : "Inactive")}
                    </Badge>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(user.last_login_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 me-2" />
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 me-2" />
                        {language === "ar" ? "تعديل" : "Edit"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 me-2" />
                        {language === "ar" ? "تغيير الدور" : "Change Role"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
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
                        className="text-red-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 me-2" />
                        {language === "ar" ? "حذف" : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {language === "ar" ? "تفاصيل المستخدم" : "User Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xl font-semibold">
                    {getInitials(selectedUser.full_name, selectedUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === "ar" 
                      ? selectedUser.full_name_ar || selectedUser.full_name
                      : selectedUser.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {language === "ar" ? "الهاتف" : "Phone"}
                  </span>
                  <span className="font-medium">{selectedUser.phone || (language === "ar" ? "غير متوفر" : "N/A")}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    {selectedUser.is_active ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    {language === "ar" ? "الحالة" : "Status"}
                  </span>
                  <Badge className={cn(
                    selectedUser.is_active 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {selectedUser.is_active ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "معطل" : "Inactive")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {language === "ar" ? "الأدوار" : "Roles"}
                  </span>
                  <div className="flex gap-1">
                    {selectedUser.roles.length > 0 
                      ? selectedUser.roles.map(role => getRoleBadge(role))
                      : <span className="text-sm text-muted-foreground">{language === "ar" ? "لا يوجد" : "None"}</span>
                    }
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {language === "ar" ? "تاريخ التسجيل" : "Joined"}
                  </span>
                  <span className="font-medium text-sm">{formatDate(selectedUser.created_at)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {language === "ar" ? "آخر دخول" : "Last Login"}
                  </span>
                  <span className="font-medium text-sm">{formatRelativeTime(selectedUser.last_login_at)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              {language === "ar" ? "إغلاق" : "Close"}
            </Button>
            <Button>
              <Edit className="h-4 w-4 me-2" />
              {language === "ar" ? "تعديل" : "Edit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {language === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" 
                ? `هل أنت متأكد من حذف المستخدم "${selectedUser?.full_name || selectedUser?.email}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${selectedUser?.full_name || selectedUser?.email}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 me-2" />
              {language === "ar" ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
