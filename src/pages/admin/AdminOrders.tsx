import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  FileText,
  TrendingUp,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  client_name: string;
  client_email: string;
  service_type: string;
  status: string;
  priority: string;
  total_amount: number;
  created_at: string;
  due_date: string;
  description: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    client_name: '',
    client_email: '',
    service_type: '',
    priority: 'medium',
    total_amount: '',
    due_date: '',
    description: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch from contracts table since it's the closest to orders
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform contracts data to orders format
      const ordersData: Order[] = contracts?.map(contract => ({
        id: contract.id,
        order_number: contract.contract_number,
        client_name: contract.client_name,
        client_email: contract.client_email,
        service_type: contract.service_type,
        status: contract.status === 'active' ? 'in_progress' : 
               contract.status === 'completed' ? 'completed' : 'pending',
        priority: 'medium', // Default priority
        total_amount: contract.service_price || 0,
        created_at: contract.created_at,
        due_date: contract.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: contract.service_description || 'لا يوجد وصف'
      })) || [];
      
      setOrders(ordersData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ في تحميل الطلبات",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    setFilteredOrders(filtered);
  };

  const createOrder = async () => {
    try {
      if (!newOrder.client_name || !newOrder.client_email || !newOrder.service_type) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى تعبئة جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // Create contract as order
      const { data, error } = await supabase
        .from('contracts')
        .insert([
          {
            user_id: user.user.id,
            client_type: 'company',
            client_name: newOrder.client_name,
            client_email: newOrder.client_email,
            client_phone: '966500000000', // Default phone
            service_type: newOrder.service_type,
            service_description: newOrder.description,
            service_price: parseFloat(newOrder.total_amount) || 0,
            currency: 'SAR',
            status: 'pending',
            end_date: newOrder.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
        .select();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('customer-notifications', {
          body: {
            customerEmail: newOrder.client_email,
            customerName: newOrder.client_name,
            type: 'order_created',
            data: {
              orderNumber: data?.[0]?.contract_number,
              serviceType: newOrder.service_type,
              amount: newOrder.total_amount
            }
          }
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "تم إرسال إشعار للعميل عبر البريد الإلكتروني",
      });

      setIsCreateDialogOpen(false);
      setNewOrder({
        client_name: '',
        client_email: '',
        service_type: '',
        priority: 'medium',
        total_amount: '',
        due_date: '',
        description: ''
      });
      fetchOrders();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "خطأ في إنشاء الطلب",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const contractStatus = newStatus === 'in_progress' ? 'active' : 
                           newStatus === 'completed' ? 'completed' : 'pending';

      const { error } = await supabase
        .from('contracts')
        .update({ status: contractStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Get order details for email
      const order = orders.find(o => o.id === orderId);
      if (order) {
        // Send status update email
        try {
          await supabase.functions.invoke('customer-notifications', {
            body: {
              customerEmail: order.client_email,
              customerName: order.client_name,
              type: 'order_status_update',
              data: {
                orderNumber: order.order_number,
                newStatus: getStatusText(newStatus),
                serviceType: order.service_type
              }
            }
          });
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
        }
      }

      toast({
        title: "تم تحديث حالة الطلب",
        description: "تم إرسال إشعار للعميل عبر البريد الإلكتروني",
      });

      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "خطأ في تحديث الحالة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'في الانتظار',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      in_progress: <AlertCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            إدارة الطلبات
          </h1>
          <p className="text-muted-foreground mt-2">
            متابعة وإدارة جميع طلبات العملاء والخدمات
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء طلب جديد</DialogTitle>
              <DialogDescription>
                إضافة طلب خدمة جديد للعميل
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">اسم العميل *</Label>
                  <Input
                    id="client_name"
                    value={newOrder.client_name}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="اسم العميل"
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">البريد الإلكتروني *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={newOrder.client_email}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="service_type">نوع الخدمة *</Label>
                <Input
                  id="service_type"
                  value={newOrder.service_type}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, service_type: e.target.value }))}
                  placeholder="تطوير موقع إلكتروني"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_amount">المبلغ الإجمالي</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    value={newOrder.total_amount}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, total_amount: e.target.value }))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newOrder.due_date}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف الطلب</Label>
                <Textarea
                  id="description"
                  value={newOrder.description}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="تفاصيل إضافية عن الطلب..."
                  rows={3}
                />
              </div>
              
              <Button onClick={createOrder} className="w-full">
                إنشاء الطلب
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'إجمالي الطلبات', value: orders.length, icon: Package, color: 'text-blue-600' },
          { title: 'قيد التنفيذ', value: orders.filter(o => o.status === 'in_progress').length, icon: AlertCircle, color: 'text-orange-600' },
          { title: 'مكتملة', value: orders.filter(o => o.status === 'completed').length, icon: CheckCircle, color: 'text-green-600' },
          { title: 'في الانتظار', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-600' }
        ].map((stat, index) => (
          <Card key={index} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="low">منخفضة</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs">
                  {order.order_number}
                </Badge>
                <div className="flex gap-2">
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="mr-1">{getStatusText(order.status)}</span>
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(order.priority)}`}>
                    {getPriorityText(order.priority)}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {order.service_type}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{order.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{order.client_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">{order.total_amount.toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>موعد التسليم: {new Date(order.due_date).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {order.description}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsViewDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 ml-2" />
                  عرض
                </Button>
                
                <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="تحديث الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="border border-border/50">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على طلبات تطابق معايير البحث
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة طلب جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>
              عرض تفاصيل الطلب رقم {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">رقم الطلب</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ الإنشاء</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">العميل</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.client_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.client_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع الخدمة</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.service_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">المبلغ الإجمالي</Label>
                  <p className="text-sm font-bold text-green-600">
                    {selectedOrder.total_amount.toLocaleString()} ريال
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">وصف الطلب</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedOrder.description}</p>
              </div>
              
              <div className="flex gap-3">
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="mr-1">{getStatusText(selectedOrder.status)}</span>
                </Badge>
                <Badge className={getPriorityColor(selectedOrder.priority)}>
                  {getPriorityText(selectedOrder.priority)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;