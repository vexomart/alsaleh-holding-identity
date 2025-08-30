import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Users,
  Plus,
  TrendingUp,
  Clock,
  Shield,
  Wifi,
  Mail,
  Phone,
  Building,
  Calendar,
  MapPin,
  Settings,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { ClientsTable } from '@/components/admin/ClientsTable';
import { ClientsCards } from '@/components/admin/ClientsCards';
import { ClientsFilters } from '@/components/admin/ClientsFilters';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
  address?: string;
  status: 'pending' | 'active' | 'inactive' | 'blocked';
  role: string;
  kyc_status: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  verified_at?: string;
  is_online?: boolean;
  last_seen?: string;
}

// Online status simulation hook
const useClientOnlineStatus = (clients: Client[]) => {
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, { is_online: boolean; last_seen: string }>>({});

  useEffect(() => {
    // Simulate real-time online status updates
    const interval = setInterval(() => {
      const updates: Record<string, { is_online: boolean; last_seen: string }> = {};
      
      clients.forEach(client => {
        // Simulate random online status changes
        const wasOnline = onlineStatuses[client.id]?.is_online || false;
        const isNowOnline = Math.random() > 0.7; // 30% chance to be online
        
        updates[client.id] = {
          is_online: isNowOnline,
          last_seen: isNowOnline ? new Date().toISOString() : 
                    (onlineStatuses[client.id]?.last_seen || new Date().toISOString())
        };
      });
      
      setOnlineStatuses(updates);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [clients, onlineStatuses]);

  return onlineStatuses;
};

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  
  // Hook for online status simulation
  const onlineStatuses = useClientOnlineStatus(clients);

  // Setup real-time subscription
  useEffect(() => {
    if (!realtimeEnabled) return;

    const channel = supabase
      .channel('ash_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ash_users'
        },
        (payload) => {
          console.log('🔄 Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newClient = mapUserToClient(payload.new);
            setClients(prev => [newClient, ...prev]);
            toast({
              title: "عميل جديد",
              description: `تم تسجيل عميل جديد: ${payload.new.name}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedClient = mapUserToClient(payload.new);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
            if (selectedClient?.id === updatedClient.id) {
              setSelectedClient(updatedClient);
            }
          } else if (payload.eventType === 'DELETE') {
            setClients(prev => prev.filter(c => c.id !== payload.old.id));
            if (selectedClient?.id === payload.old.id) {
              setSelectedClient(null);
              setIsDetailSheetOpen(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtimeEnabled, selectedClient?.id]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      console.log('🔐 جاري التحقق من صلاحيات الأدمين...');
      
      // التحقق من المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 المستخدم الحالي:', user?.id, user?.email);
      
      // التحقق من دور المستخدم
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      console.log('🎭 دور المستخدم:', { userRole, roleError });
      
      fetchClients();
    };
    
    checkAuthAndFetch();
  }, []);

  const mapUserToClient = useCallback((user: any): Client => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    company_name: user.company_name,
    avatar_url: user.avatar_url,
    address: user.address,
    status: user.status as 'pending' | 'active' | 'inactive' | 'blocked',
    role: user.role,
    kyc_status: user.kyc_status,
    two_factor_enabled: user.two_factor_enabled,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login_at: user.last_login_at,
    verified_at: user.verified_at
  }), []);

  const fetchClients = async () => {
    try {
      console.log('🔍 جاري جلب بيانات المستخدمين المسجلين...');
      
      const { data, error } = await supabase
        .from('ash_users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 نتيجة استعلام المستخدمين:', { data, error, count: data?.length });

      if (error) {
        console.error('❌ خطأ في استعلام المستخدمين:', error);
        throw error;
      }
      
      console.log('✅ تم جلب البيانات بنجاح:', data?.length || 0, 'مستخدم');
      const mappedData = (data || []).map(mapUserToClient);
      setClients(mappedData);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast({
        title: "خطأ في تحميل العملاء",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesRole = sectorFilter === 'all' || client.role === sectorFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'inactive': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
      case 'blocked': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      case 'blocked': return 'محظور';
      default: return status;
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      case 'unverified': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  const getKycStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'موثق';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      case 'unverified': return 'غير موثق';
      default: return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'client': return 'عميل';
      case 'admin': return 'مدير';
      case 'superadmin': return 'مدير عام';
      case 'finance': return 'مالية';
      default: return role;
    }
  };

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ash_users')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      // Real-time update will handle UI update
      toast({
        title: "تم تحديث حالة المستخدم",
        description: `تم تغيير الحالة إلى ${getStatusText(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الحالة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (clientId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('ash_users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "تم تحديث دور المستخدم",
        description: `تم تغيير الدور إلى ${getRoleText(newRole)}`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الدور",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleKycStatusChange = async (clientId: string, newKycStatus: string) => {
    try {
      const { error } = await supabase
        .from('ash_users')
        .update({ 
          kyc_status: newKycStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "تم تحديث حالة التحقق",
        description: `تم تغيير حالة التحقق إلى ${getKycStatusText(newKycStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث حالة التحقق",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTwoFactorToggle = async (clientId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('ash_users')
        .update({ 
          two_factor_enabled: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: enabled ? "تم تفعيل المصادقة الثنائية" : "تم إيقاف المصادقة الثنائية",
        description: `تم ${enabled ? 'تفعيل' : 'إيقاف'} المصادقة الثنائية للمستخدم`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المصادقة الثنائية",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailSheetOpen(true);
  };


  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    clientsRole: clients.filter(c => c.role === 'client').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-tajawal" dir="rtl">
      <ResponsiveContainer size="xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-4xl font-bold flex items-center gap-4 font-tajawal">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-variant text-white shadow-lg">
              <Users className="h-8 w-8" />
            </div>
            إدارة العملاء
            {realtimeEnabled && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 dark:bg-green-900/30">
                <Wifi className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-sm text-green-700 font-medium font-tajawal">التحديث المباشر</span>
              </div>
            )}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-tajawal">إدارة ومتابعة قاعدة عملاء الشركة بالتحديث اللحظي</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="realtime-toggle">التحديث المباشر</Label>
            <Switch
              id="realtime-toggle"
              checked={realtimeEnabled}
              onCheckedChange={setRealtimeEnabled}
            />
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة عميل
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResponsiveCard className="gradient-border-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stats.total}</p>
                <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
              </div>
            </div>
          </CardContent>
        </ResponsiveCard>

        <ResponsiveCard className="gradient-border-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{stats.active}</p>
                <p className="text-sm text-muted-foreground">عملاء نشطون</p>
              </div>
            </div>
          </CardContent>
        </ResponsiveCard>

        <ResponsiveCard className="gradient-border-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">في الانتظار</p>
              </div>
            </div>
          </CardContent>
        </ResponsiveCard>

        <ResponsiveCard className="gradient-border-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{clients.filter(c => c.kyc_status === 'verified').length}</p>
                <p className="text-sm text-muted-foreground">موثقون</p>
              </div>
            </div>
          </CardContent>
        </ResponsiveCard>
      </div>

      {/* Filters and Clients List */}
      <ResponsiveCard className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <ClientsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sectorFilter={sectorFilter}
            onSectorFilterChange={setSectorFilter}
            filteredCount={filteredClients.length}
          />
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ClientsTable
              clients={filteredClients}
              onlineStatuses={onlineStatuses}
              onViewDetails={viewClientDetails}
              onStatusChange={handleStatusChange}
              onKycStatusChange={handleKycStatusChange}
              onTwoFactorToggle={handleTwoFactorToggle}
              realtimeEnabled={realtimeEnabled}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden">
            <ClientsCards
              clients={filteredClients}
              onlineStatuses={onlineStatuses}
              onViewDetails={viewClientDetails}
              onStatusChange={handleStatusChange}
              onKycStatusChange={handleKycStatusChange}
              onTwoFactorToggle={handleTwoFactorToggle}
              realtimeEnabled={realtimeEnabled}
            />
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground font-tajawal">لا يوجد مستخدمون</h3>
              <p className="text-sm text-muted-foreground mt-2 font-tajawal">
                {searchTerm || statusFilter !== 'all' || sectorFilter !== 'all' 
                  ? 'لا توجد نتائج تطابق البحث' 
                  : 'لم يتم تسجيل أي مستخدمين بعد'}
              </p>
            </div>
          )}
        </CardContent>
      </ResponsiveCard>

      {/* Client Details Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent side="left" className="w-full md:w-[600px] overflow-y-auto" dir="rtl">
          {selectedClient && (
            <>
              <SheetHeader className="space-y-4 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedClient.avatar_url} />
                    <AvatarFallback className="text-lg font-tajawal">
                      {selectedClient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-2xl font-tajawal">{selectedClient.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(selectedClient.status)}>
                        {getStatusText(selectedClient.status)}
                      </Badge>
                      <Badge variant="outline" className="font-tajawal">
                        {getRoleText(selectedClient.role)}
                      </Badge>
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 font-tajawal">
                    <Mail className="h-5 w-5 text-primary" />
                    معلومات الاتصال
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium font-tajawal">البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground font-tajawal">{selectedClient.email}</p>
                      </div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium font-tajawal">رقم الهاتف</p>
                          <p className="text-sm text-muted-foreground font-tajawal">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium font-tajawal">العنوان</p>
                          <p className="text-sm text-muted-foreground font-tajawal">{selectedClient.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.company_name && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium font-tajawal">الشركة</p>
                          <p className="text-sm text-muted-foreground font-tajawal">{selectedClient.company_name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 font-tajawal">
                    <Shield className="h-5 w-5 text-primary" />
                    حالة الحساب
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium font-tajawal">حالة الحساب</p>
                         <Badge className={getStatusColor(selectedClient.status)}>
                          {getStatusText(selectedClient.status)}
                        </Badge>
                      </div>
                      <Select 
                        value={selectedClient.status} 
                        onValueChange={(value) => handleStatusChange(selectedClient.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">غير نشط</SelectItem>
                          <SelectItem value="pending">في الانتظار</SelectItem>
                          <SelectItem value="blocked">محظور</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium font-tajawal">حالة التوثيق</p>
                         <Badge className={getKycStatusColor(selectedClient.kyc_status)}>
                          {getKycStatusText(selectedClient.kyc_status)}
                        </Badge>
                      </div>
                      <Select 
                        value={selectedClient.kyc_status} 
                        onValueChange={(value) => handleKycStatusChange(selectedClient.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">موثق</SelectItem>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                          <SelectItem value="rejected">مرفوض</SelectItem>
                          <SelectItem value="unverified">غير موثق</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium font-tajawal">المصادقة الثنائية</p>
                        <p className="text-xs text-muted-foreground font-tajawal">
                          {selectedClient.two_factor_enabled ? 'مفعلة' : 'غير مفعلة'}
                        </p>
                      </div>
                      <Switch
                        checked={selectedClient.two_factor_enabled}
                        onCheckedChange={(checked) => handleTwoFactorToggle(selectedClient.id, checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium font-tajawal">دور المستخدم</p>
                         <Badge variant="outline" className="font-tajawal">
                          {getRoleText(selectedClient.role)}
                        </Badge>
                      </div>
                      <Select 
                        value={selectedClient.role} 
                        onValueChange={(value) => handleRoleChange(selectedClient.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">عميل</SelectItem>
                          <SelectItem value="admin">مدير</SelectItem>
                          <SelectItem value="superadmin">مدير عام</SelectItem>
                          <SelectItem value="finance">مالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Account Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 font-tajawal">
                    <Calendar className="h-5 w-5 text-primary" />
                    التواريخ المهمة
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium font-tajawal">تاريخ التسجيل</p>
                        <p className="text-sm text-muted-foreground font-tajawal">
                          {new Date(selectedClient.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedClient.last_login_at && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium font-tajawal">آخر دخول</p>
                          <p className="text-sm text-muted-foreground font-tajawal">
                            {new Date(selectedClient.last_login_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedClient.verified_at && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium font-tajawal">تاريخ التحقق</p>
                          <p className="text-sm text-muted-foreground font-tajawal">
                            {new Date(selectedClient.verified_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminClients;