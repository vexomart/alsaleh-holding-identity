import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  TrendingUp,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Settings,
  Activity,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveCard } from '@/components/ResponsiveCard';

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
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

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
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  const getRoleText = (role: string) => {
    switch (role) {
      case 'client': return 'عميل';
      case 'admin': return 'مدير';
      case 'superadmin': return 'مدير عام';
      case 'finance': return 'مالية';
      default: return role;
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

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'unverified': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
    <div className="space-y-8" dir="rtl">
      <ResponsiveContainer size="xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            إدارة العملاء
            {realtimeEnabled && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">مباشر</span>
              </div>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">إدارة ومتابعة قاعدة عملاء الشركة</p>
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

      {/* Filters */}
      <ResponsiveCard className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                قائمة العملاء
              </CardTitle>
              <CardDescription>إدارة ومتابعة بيانات العملاء مع التحكم الفوري</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              {filteredClients.length} عميل
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="blocked">محظور</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="client">عميل</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="superadmin">مدير عام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clients Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">معلومات الاتصال</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.company_name && (
                            <p className="text-sm text-muted-foreground">{client.company_name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.last_login_at && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            آخر دخول: {new Date(client.last_login_at).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getRoleText(client.role)}
                        </Badge>
                        {client.two_factor_enabled && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            2FA
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getStatusColor(client.status)}>
                          {getStatusText(client.status)}
                        </Badge>
                        <Badge variant="outline" className={getKycStatusColor(client.kyc_status) + " text-xs"}>
                          {getKycStatusText(client.kyc_status)}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(client.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => viewClientDetails(client)}>
                            <Eye className="mr-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(client.id, client.status === 'active' ? 'inactive' : 'active')}>
                            {client.status === 'active' ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4 text-yellow-600" />
                                إيقاف الحساب
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                تفعيل الحساب
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleKycStatusChange(client.id, client.kyc_status === 'verified' ? 'unverified' : 'verified')}>
                            <Shield className="mr-2 h-4 w-4 text-blue-600" />
                            {client.kyc_status === 'verified' ? 'إلغاء التوثيق' : 'توثيق الحساب'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTwoFactorToggle(client.id, !client.two_factor_enabled)}>
                            <Settings className="mr-2 h-4 w-4 text-purple-600" />
                            {client.two_factor_enabled ? 'إيقاف المصادقة الثنائية' : 'تفعيل المصادقة الثنائية'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleStatusChange(client.id, 'blocked')}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            حظر نهائي
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">لا يوجد مستخدمون</h3>
              <p className="text-sm text-muted-foreground mt-2">
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
                    <AvatarFallback className="text-lg">
                      {selectedClient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">{selectedClient.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(selectedClient.status)}>
                        {getStatusText(selectedClient.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getRoleText(selectedClient.role)}
                      </Badge>
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    معلومات الاتصال
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                      </div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">رقم الهاتف</p>
                          <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">العنوان</p>
                          <p className="text-sm text-muted-foreground">{selectedClient.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.company_name && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">الشركة</p>
                          <p className="text-sm text-muted-foreground">{selectedClient.company_name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    حالة الحساب
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">حالة الحساب</p>
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
                        <p className="text-sm font-medium">حالة التوثيق</p>
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
                        <p className="text-sm font-medium">المصادقة الثنائية</p>
                        <p className="text-xs text-muted-foreground">
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
                        <p className="text-sm font-medium">دور المستخدم</p>
                         <Badge variant="outline">
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
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    التواريخ المهمة
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">تاريخ التسجيل</p>
                        <p className="text-sm text-muted-foreground">
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
                          <p className="text-sm font-medium">آخر دخول</p>
                          <p className="text-sm text-muted-foreground">
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
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">تاريخ التحقق</p>
                          <p className="text-sm text-muted-foreground">
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

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    إجراءات سريعة
                  </h3>
                  <div className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2"
                      onClick={() => handleStatusChange(selectedClient.id, selectedClient.status === 'active' ? 'inactive' : 'active')}
                    >
                      {selectedClient.status === 'active' ? (
                        <>
                          <XCircle className="h-4 w-4 text-yellow-600" />
                          إيقاف الحساب
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          تفعيل الحساب
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2"
                      onClick={() => handleKycStatusChange(selectedClient.id, selectedClient.kyc_status === 'verified' ? 'unverified' : 'verified')}
                    >
                      <Shield className="h-4 w-4 text-blue-600" />
                      {selectedClient.kyc_status === 'verified' ? 'إلغاء التوثيق' : 'توثيق الحساب'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2 text-red-600 hover:text-red-700"
                      onClick={() => handleStatusChange(selectedClient.id, 'blocked')}
                    >
                      <UserX className="h-4 w-4" />
                      حظر الحساب نهائياً
                    </Button>
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