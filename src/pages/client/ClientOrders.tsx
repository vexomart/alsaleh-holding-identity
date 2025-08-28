import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Eye,
  Download,
  FileText,
  DollarSign,
  Star,
  MessageSquare,
  Plus,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  order_number: string;
  service_type: string;
  status: string;
  priority: string;
  total_amount: number;
  progress: number;
  created_at: string;
  due_date: string;
  description: string;
  project_manager?: string;
}

const ClientOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // Fetch user's contracts as orders
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform contracts to orders format
      const ordersData: Order[] = contracts?.map(contract => ({
        id: contract.id,
        order_number: contract.contract_number,
        service_type: contract.service_type,
        status: contract.status === 'active' ? 'in_progress' : 
               contract.status === 'completed' ? 'completed' : 'pending',
        priority: 'medium', // Default priority
        total_amount: contract.service_price || 0,
        progress: contract.status === 'completed' ? 100 : 
                 contract.status === 'active' ? 65 : 0,
        created_at: contract.created_at,
        due_date: contract.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: contract.service_description || 'لا يوجد وصف',
        project_manager: 'فريق التطوير'
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

  const requestSupport = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Create a support ticket
      const { error } = await supabase
        .from('tickets')
        .insert([
          {
            user_id: user.user.id,
            title: `استفسار حول الطلب ${order.order_number}`,
            description: `استفسار حول طلب الخدمة: ${order.service_type}`,
            category: 'order_inquiry',
            priority: 'medium'
          }
        ]);

      if (error) throw error;

      toast({
        title: "تم إرسال طلب الدعم",
        description: "سيتم التواصل معك قريباً",
      });
    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "خطأ في إرسال طلب الدعم",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
            طلباتي
          </h1>
          <p className="text-muted-foreground mt-2">
            متابعة حالة جميع طلبات الخدمات والمشاريع
          </p>
        </div>
        
        <Link to="/client/new-service">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Plus className="w-4 h-4 ml-2" />
            طلب خدمة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">التقدم</span>
                  <span className="text-sm font-medium">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">{order.total_amount.toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>موعد التسليم: {new Date(order.due_date).toLocaleDateString('ar-SA')}</span>
                </div>
                {order.project_manager && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span>مدير المشروع: {order.project_manager}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {order.description}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to={`/client/projects/${order.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 ml-2" />
                    عرض التفاصيل
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => requestSupport(order.id)}
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  دعم فني
                </Button>
                {order.status === 'completed' && (
                  <Button size="sm" className="flex-1">
                    <Download className="w-4 h-4 ml-2" />
                    تحميل
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="border border-border/50">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات حتى الآن</h3>
            <p className="text-muted-foreground mb-6">
              ابدأ بطلب خدمة جديدة لتظهر هنا
            </p>
            <Link to="/client/new-service">
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                طلب خدمة جديدة
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientOrders;