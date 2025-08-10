import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Package,
  MessageSquare,
  BarChart3,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardData {
  profile: any;
  serviceRequests: any[];
  invoices: any[];
  paymentHistory: any[];
  tickets: any[];
  activityLogs: any[];
  notifications: any[];
}

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<DashboardData>({
    profile: null,
    serviceRequests: [],
    invoices: [],
    paymentHistory: [],
    tickets: [],
    activityLogs: [],
    notifications: []
  });
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadDashboardData(session.user.id);
      
      // إرسال إشعار تسجيل الدخول
      await logLoginActivity(session.user.id, session.user.email);
      
    } catch (error: any) {
      console.error("خطأ في التحقق من المستخدم:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logLoginActivity = async (userId: string, email: string) => {
    try {
      await supabase.functions.invoke('service-notifications', {
        body: {
          type: 'login_notification',
          userId: userId,
          email: email
        }
      });
    } catch (error) {
      console.error('خطأ في إرسال إشعار تسجيل الدخول:', error);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // تحميل بيانات المستخدم
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // تحميل طلبات الخدمات
      const { data: serviceRequests } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // تحميل الفواتير
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // تحميل تاريخ المدفوعات
      const { data: paymentHistory } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // تحميل التذاكر
      const { data: tickets } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // تحميل سجل الأنشطة
      const { data: activityLogs } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setData({
        profile: profile || {},
        serviceRequests: serviceRequests || [],
        invoices: invoices || [],
        paymentHistory: paymentHistory || [],
        tickets: tickets || [],
        activityLogs: activityLogs || [],
        notifications: []
      });

    } catch (error: any) {
      console.error("خطأ في تحميل البيانات:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات لوحة التحكم",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "معلق", variant: "secondary" as const },
      completed: { label: "مكتمل", variant: "default" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
      in_progress: { label: "قيد التنفيذ", variant: "default" as const },
      paid: { label: "مدفوع", variant: "default" as const },
      unpaid: { label: "غير مدفوع", variant: "destructive" as const },
      open: { label: "مفتوح", variant: "default" as const },
      closed: { label: "مغلق", variant: "secondary" as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const };
  };

  const getServiceIcon = (serviceType: string) => {
    const icons = {
      'design': <Package className="h-4 w-4" />,
      'business': <Building className="h-4 w-4" />,
      'digital': <BarChart3 className="h-4 w-4" />,
      'content': <FileText className="h-4 w-4" />
    };
    return icons[serviceType as keyof typeof icons] || <Package className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar 
          user={user}
          profile={data.profile}
          onSignOut={handleSignOut}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 overflow-hidden">
          <header className="border-b bg-card shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    مرحباً، {data.profile?.full_name || user?.email}
                  </h1>
                  <p className="text-muted-foreground">
                    لوحة التحكم الشخصية
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  متصل
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveTab("notifications")}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {data.notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {data.notifications.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6 overflow-auto">
            {activeTab === "overview" && (
              <OverviewTab data={data} />
            )}
            
            {activeTab === "services" && (
              <ServicesTab data={data} onRefresh={() => loadDashboardData(user.id)} />
            )}
            
            {activeTab === "invoices" && (
              <InvoicesTab data={data} />
            )}
            
            {activeTab === "payments" && (
              <PaymentsTab data={data} />
            )}
            
            {activeTab === "tickets" && (
              <TicketsTab data={data} onRefresh={() => loadDashboardData(user.id)} />
            )}
            
            {activeTab === "profile" && (
              <ProfileTab data={data} user={user} onRefresh={() => loadDashboardData(user.id)} />
            )}
            
            {activeTab === "notifications" && (
              <NotificationsTab data={data} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

// مكونات التبويبات
const OverviewTab = ({ data }: { data: DashboardData }) => {
  const stats = [
    {
      title: "طلبات الخدمات",
      value: data.serviceRequests.length,
      icon: <Package className="h-8 w-8" />,
      color: "text-blue-600"
    },
    {
      title: "الفواتير",
      value: data.invoices.length,
      icon: <FileText className="h-8 w-8" />,
      color: "text-green-600"
    },
    {
      title: "المدفوعات",
      value: data.paymentHistory.length,
      icon: <CreditCard className="h-8 w-8" />,
      color: "text-purple-600"
    },
    {
      title: "التذاكر",
      value: data.tickets.length,
      icon: <MessageSquare className="h-8 w-8" />,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخر طلبات الخدمات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              آخر طلبات الخدمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.serviceRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.service_type}</p>
                  </div>
                  <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                    {request.status === 'completed' ? 'مكتمل' : 'معلق'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* آخر الأنشطة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              سجل الأنشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{log.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ServicesTab = ({ data, onRefresh }: { data: DashboardData, onRefresh: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">طلبات الخدمات</h2>
        <Button onClick={() => window.location.href = '/current-offers'}>
          طلب خدمة جديدة
        </Button>
      </div>

      <div className="grid gap-6">
        {data.serviceRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {request.title}
                  </CardTitle>
                  <CardDescription>{request.description}</CardDescription>
                </div>
                <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                  {request.status === 'completed' ? 'مكتمل' : 'معلق'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">نوع الخدمة</p>
                  <p className="font-medium">{request.service_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الأولوية</p>
                  <p className="font-medium">{request.priority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="font-medium">
                    {new Date(request.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">التكلفة المقدرة</p>
                  <p className="font-medium">
                    {request.estimated_cost ? `${request.estimated_cost} ريال` : 'غير محدد'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const InvoicesTab = ({ data }: { data: DashboardData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الفواتير</h2>
      
      <div className="grid gap-4">
        {data.invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">فاتورة رقم: {invoice.invoice_number}</span>
                  </div>
                  <p className="text-muted-foreground">{invoice.offer_title}</p>
                  <p className="text-2xl font-bold">{invoice.amount} {invoice.currency}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                    {invoice.status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    تاريخ الإصدار: {new Date(invoice.issue_date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PaymentsTab = ({ data }: { data: DashboardData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">تاريخ المدفوعات</h2>
      
      <div className="grid gap-4">
        {data.paymentHistory.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">دفعة {payment.reference_number}</span>
                  </div>
                  <p className="text-muted-foreground">طريقة الدفع: {payment.payment_method}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xl font-bold">{payment.amount} {payment.currency}</p>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status === 'completed' ? 'مكتمل' : payment.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.payment_date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TicketsTab = ({ data, onRefresh }: { data: DashboardData, onRefresh: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">تذاكر الدعم</h2>
        <Button onClick={() => window.location.href = '/support'}>
          إنشاء تذكرة جديدة
        </Button>
      </div>
      
      <div className="grid gap-4">
        {data.tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-medium">تذكرة رقم: {ticket.ticket_number}</span>
                  </div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-muted-foreground">{ticket.description}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={ticket.status === 'closed' ? 'secondary' : 'default'}>
                    {ticket.status === 'closed' ? 'مغلق' : 'مفتوح'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    الأولوية: {ticket.priority}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProfileTab = ({ data, user, onRefresh }: { data: DashboardData, user: any, onRefresh: () => void }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الملف الشخصي</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الاسم الكامل</p>
              <p className="font-medium">{data.profile?.full_name || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم الهاتف</p>
              <p className="font-medium">{data.profile?.phone || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الشركة</p>
              <p className="font-medium">{data.profile?.company || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم العميل</p>
              <p className="font-medium">{data.profile?.client_id || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
              <p className="font-medium">
                {new Date(data.profile?.created_at).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsTab = ({ data }: { data: DashboardData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الإشعارات</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <p>لا توجد إشعارات جديدة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;