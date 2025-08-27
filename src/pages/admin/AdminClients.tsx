import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  legal_name: string;
  display_name?: string;
  billing_email: string;
  phone?: string;
  website?: string;
  status: 'prospect' | 'active' | 'inactive' | 'blocked';
  sector: 'private' | 'government' | 'nonprofit' | 'semi_government';
  city?: string;
  country?: string;
  created_at: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState({
    legal_name: '',
    display_name: '',
    billing_email: '',
    phone: '',
    website: '',
    status: 'prospect' as const,
    sector: 'private' as const,
    city: '',
    country: 'SA',
    tax_number: '',
    commercial_register: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
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
    const matchesSearch = client.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.billing_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.display_name && client.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'prospect': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'prospect': return 'محتمل';
      case 'blocked': return 'محظور';
      default: return status;
    }
  };

  const getSectorText = (sector: string) => {
    switch (sector) {
      case 'private': return 'خاص';
      case 'government': return 'حكومي';
      case 'nonprofit': return 'غير ربحي';
      case 'semi_government': return 'شبه حكومي';
      default: return sector;
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== clientId));
      toast({
        title: "تم حذف العميل بنجاح",
        description: "تم حذف العميل من النظام",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف العميل",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.legal_name || !newClient.billing_email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء الحقول المطلوبة (الاسم القانوني والبريد الإلكتروني)",
        variant: "destructive",
      });
      return;
    }

    if (!newClient.billing_email.includes('@') || !newClient.billing_email.includes('.')) {
      toast({
        title: "بريد إلكتروني غير صالح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          legal_name: newClient.legal_name,
          display_name: newClient.display_name || null,
          billing_email: newClient.billing_email.toLowerCase().trim(),
          phone: newClient.phone || null,
          website: newClient.website || null,
          status: newClient.status,
          sector: newClient.sector,
          city: newClient.city || null,
          country: newClient.country,
          tax_number: newClient.tax_number || null,
          commercial_register: newClient.commercial_register || null,
          address: newClient.address || null,
          notes: newClient.notes || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setShowAddDialog(false);
      setNewClient({
        legal_name: '',
        display_name: '',
        billing_email: '',
        phone: '',
        website: '',
        status: 'prospect',
        sector: 'private',
        city: '',
        country: 'SA',
        tax_number: '',
        commercial_register: '',
        address: '',
        notes: ''
      });

      toast({
        title: "تم إنشاء العميل بنجاح",
        description: `تم إضافة ${newClient.legal_name} إلى قاعدة العملاء`,
      });
    } catch (error: any) {
      console.error('Error creating client:', error);
      
      let errorMessage = "حدث خطأ أثناء إنشاء العميل";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في إنشاء العميل",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    private: clients.filter(c => c.sector === 'private').length,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            إدارة العملاء
          </h1>
          <p className="text-muted-foreground mt-2">إدارة ومتابعة قاعدة عملاء الشركة</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات العميل الجديد لإضافته إلى قاعدة البيانات
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legal_name">الاسم القانوني *</Label>
                <Input
                  id="legal_name"
                  value={newClient.legal_name}
                  onChange={(e) => setNewClient({...newClient, legal_name: e.target.value})}
                  placeholder="أدخل الاسم القانوني للعميل"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">الاسم التجاري</Label>
                <Input
                  id="display_name"
                  value={newClient.display_name}
                  onChange={(e) => setNewClient({...newClient, display_name: e.target.value})}
                  placeholder="الاسم التجاري (اختياري)"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_email">البريد الإلكتروني *</Label>
                <Input
                  id="billing_email"
                  type="email"
                  value={newClient.billing_email}
                  onChange={(e) => setNewClient({...newClient, billing_email: e.target.value.toLowerCase().trim()})}
                  placeholder="example@company.com"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="+966501234567"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={newClient.status} onValueChange={(value: any) => setNewClient({...newClient, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">محتمل</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="blocked">محظور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">القطاع</Label>
                <Select value={newClient.sector} onValueChange={(value: any) => setNewClient({...newClient, sector: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القطاع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">خاص</SelectItem>
                    <SelectItem value="government">حكومي</SelectItem>
                    <SelectItem value="nonprofit">غير ربحي</SelectItem>
                    <SelectItem value="semi_government">شبه حكومي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={newClient.city}
                  onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                  placeholder="الرياض"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <Input
                  id="website"
                  value={newClient.website}
                  onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_number">الرقم الضريبي</Label>
                <Input
                  id="tax_number"
                  value={newClient.tax_number}
                  onChange={(e) => setNewClient({...newClient, tax_number: e.target.value})}
                  placeholder="123456789012345"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commercial_register">السجل التجاري</Label>
                <Input
                  id="commercial_register"
                  value={newClient.commercial_register}
                  onChange={(e) => setNewClient({...newClient, commercial_register: e.target.value})}
                  placeholder="1234567890"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  placeholder="العنوان الكامل"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                  placeholder="ملاحظات إضافية عن العميل"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateClient} disabled={creating}>
                {creating ? 'جارٍ الإنشاء...' : 'إنشاء العميل'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">عملاء نشطون</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.prospects}</p>
                <p className="text-sm text-muted-foreground">عملاء محتملون</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.private}</p>
                <p className="text-sm text-muted-foreground">قطاع خاص</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء</CardTitle>
          <CardDescription>إدارة ومتابعة بيانات العملاء</CardDescription>
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
                <SelectItem value="prospect">محتمل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="القطاع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع القطاعات</SelectItem>
                <SelectItem value="private">خاص</SelectItem>
                <SelectItem value="government">حكومي</SelectItem>
                <SelectItem value="nonprofit">غير ربحي</SelectItem>
                <SelectItem value="semi_government">شبه حكومي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clients Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">معلومات الاتصال</TableHead>
                  <TableHead className="text-right">القطاع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الإضافة</TableHead>
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
                            {client.legal_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.legal_name}</p>
                          {client.display_name && (
                            <p className="text-sm text-muted-foreground">{client.display_name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {client.billing_email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.city && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {client.city}, {client.country}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">
                        {getSectorText(client.sector)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusText(client.status)}
                      </Badge>
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
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
              <h3 className="text-lg font-medium text-muted-foreground">لا توجد عملاء</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || statusFilter !== 'all' || sectorFilter !== 'all' 
                  ? 'لا توجد نتائج تطابق البحث' 
                  : 'لم يتم إضافة أي عملاء بعد'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClients;