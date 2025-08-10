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
  Building,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Zap,
  Globe,
  PenTool,
  Briefcase,
  Palette,
  Monitor,
  Smartphone,
  Image,
  Video,
  FileImage,
  PieChart,
  Users,
  Star,
  Award,
  Headphones,
  Shield,
  RefreshCw
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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
        
        <AppSidebar 
          user={user}
          profile={data.profile}
          onSignOut={handleSignOut}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 overflow-hidden relative z-10">
          <header className="border-b bg-card/80 backdrop-blur-lg shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-bold text-gradient-primary">
                    مرحباً، {data.profile?.full_name || user?.email}
                  </h1>
                  <p className="text-muted-foreground">
                    لوحة التحكم الشخصية - شركة الصالح
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-2 animate-glow">
                  <CheckCircle className="h-3 w-3 text-success" />
                  متصل
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveTab("notifications")}
                  className="relative hover:scale-105 transition-transform"
                >
                  <Bell className="h-5 w-5" />
                  {data.notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
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
            
            {(activeTab === "services" || activeTab === "digital-services" || activeTab === "design-services" || activeTab === "business-services" || activeTab === "content-services") && (
              <ServicesTab 
                data={data} 
                onRefresh={() => loadDashboardData(user.id)} 
                activeSubTab={activeTab}
                getServiceIcon={getServiceIcon}
                getStatusBadge={getStatusBadge}
              />
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
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      changeColor: "text-green-600"
    },
    {
      title: "الفواتير",
      value: data.invoices.length,
      icon: <FileText className="h-8 w-8" />,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      change: "+8%",
      changeColor: "text-green-600"
    },
    {
      title: "المدفوعات",
      value: data.paymentHistory.length,
      icon: <CreditCard className="h-8 w-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      change: "+15%",
      changeColor: "text-green-600"
    },
    {
      title: "تذاكر الدعم",
      value: data.tickets.length,
      icon: <Headphones className="h-8 w-8" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      change: "-3%",
      changeColor: "text-red-600"
    }
  ];

  const quickActions = [
    {
      title: "طلب خدمة تصميم",
      description: "احصل على تصميمات احترافية",
      icon: <Palette className="h-6 w-6" />,
      href: "/design-solutions",
      color: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      title: "خدمات تطوير الويب",
      description: "مواقع ويب متطورة وسريعة",
      icon: <Globe className="h-6 w-6" />,
      href: "/development",
      color: "bg-gradient-to-r from-green-500 to-teal-600"
    },
    {
      title: "خدمات الأعمال",
      description: "استشارات وحلول تجارية",
      icon: <Briefcase className="h-6 w-6" />,
      href: "/business-services",
      color: "bg-gradient-to-r from-orange-500 to-red-600"
    },
    {
      title: "إنتاج المحتوى",
      description: "محتوى مميز لعلامتك التجارية",
      icon: <PenTool className="h-6 w-6" />,
      href: "/content-creation",
      color: "bg-gradient-to-r from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden shadow-corporate hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in border-none" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className={`text-xs ${stat.changeColor}`}>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* إجراءات سريعة */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-none" onClick={() => window.location.href = action.href}>
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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

const ServicesTab = ({ data, onRefresh, activeSubTab, getServiceIcon, getStatusBadge }: { 
  data: DashboardData, 
  onRefresh: () => void, 
  activeSubTab: string,
  getServiceIcon: (serviceType: string) => JSX.Element,
  getStatusBadge: (status: string) => { label: string, variant: any }
}) => {
  const serviceCategories = [
    {
      key: "digital-services",
      title: "الخدمات الرقمية",
      icon: <Monitor className="h-5 w-5" />,
      services: ["تطوير المواقع", "تطبيقات الهاتف", "التسويق الرقمي", "تحليل البيانات"]
    },
    {
      key: "design-services", 
      title: "خدمات التصميم",
      icon: <Palette className="h-5 w-5" />,
      services: ["تصميم الهوية البصرية", "تصميم المواقع", "تصميم الطباعة", "تصميم الإعلانات"]
    },
    {
      key: "business-services",
      title: "الخدمات التجارية", 
      icon: <Briefcase className="h-5 w-5" />,
      services: ["الاستشارات", "دراسات الجدوى", "إدارة المشاريع", "التخطيط الاستراتيجي"]
    },
    {
      key: "content-services",
      title: "إنتاج المحتوى",
      icon: <PenTool className="h-5 w-5" />,
      services: ["كتابة المحتوى", "إنتاج الفيديو", "التصوير الفوتوغرافي", "إدارة وسائل التواصل"]
    }
  ];

  const filteredRequests = activeSubTab === "services" 
    ? data.serviceRequests 
    : data.serviceRequests.filter(req => {
        switch(activeSubTab) {
          case "digital-services": return req.service_type === "digital";
          case "design-services": return req.service_type === "design";
          case "business-services": return req.service_type === "business";
          case "content-services": return req.service_type === "content";
          default: return true;
        }
      });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gradient-primary">
          {activeSubTab === "services" ? "جميع الخدمات" : serviceCategories.find(cat => cat.key === activeSubTab)?.title || "الخدمات"}
        </h2>
        <div className="flex gap-3">
          <Button onClick={() => window.location.href = '/current-offers'} className="animate-pulse">
            <Package className="h-4 w-4 ml-2" />
            طلب خدمة جديدة
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* عرض فئات الخدمات إذا كان في التبويب الرئيسي */}
      {activeSubTab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category, index) => (
            <Card key={category.key} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-none shadow-corporate" 
                  style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-foreground">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6">
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">لا توجد طلبات حالياً</h3>
              <p className="text-muted-foreground">ابدأ بطلب خدمة جديدة لرؤيتها هنا</p>
              <Button onClick={() => window.location.href = '/current-offers'}>
                طلب خدمة الآن
              </Button>
            </div>
          </Card>
        ) : (
          filteredRequests.map((request, index) => (
            <Card key={request.id} className="hover:shadow-lg transition-all duration-300 border-none shadow-corporate animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      {getServiceIcon(request.service_type)}
                      {request.title}
                    </CardTitle>
                    <CardDescription>{request.description}</CardDescription>
                  </div>
                  <div className="space-y-2">
                    <Badge variant={request.status === 'completed' ? 'default' : 'secondary'} className="animate-pulse">
                      {getStatusBadge(request.status).label}
                    </Badge>
                    {request.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        عاجل
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">نوع الخدمة</p>
                    <p className="font-medium text-foreground">{request.service_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">الأولوية</p>
                    <p className="font-medium text-foreground">{request.priority}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">تاريخ الإنشاء</p>
                    <p className="font-medium text-foreground">
                      {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">التكلفة المقدرة</p>
                    <p className="font-medium text-primary">
                      {request.estimated_cost ? `${request.estimated_cost} ريال` : 'غير محدد'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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