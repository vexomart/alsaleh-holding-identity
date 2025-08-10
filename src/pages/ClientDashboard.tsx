import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TicketsSection } from "@/components/ui/tickets-section";
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
        .maybeSingle();

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

      // إضافة أنشطة وهمية إذا لم توجد
      const mockActivities = activityLogs?.length ? activityLogs : [
        {
          id: '1',
          description: 'دفع ناجح لخدمة عرض الموقع الإحترافي الكامل',
          activity_type: 'payment',
          created_at: new Date().toISOString(),
          user_id: userId
        },
        {
          id: '2', 
          description: 'تم إنشاء تذكرة جديدة TK25000001',
          activity_type: 'ticket_created',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_id: userId
        }
      ];

      setData({
        profile: profile || {},
        serviceRequests: serviceRequests || [],
        invoices: invoices || [],
        paymentHistory: paymentHistory || [],
        tickets: tickets || [],
        activityLogs: mockActivities,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white animate-fade-in" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 min-h-screen animate-slide-in-right">
          {/* User Profile Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">مرحباً، {user?.email}</h2>
              <p className="text-slate-300 text-sm">لوحة التحكم الشخصية - شركة الصالح</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
          <div className="space-y-2">
              <div 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-100 ${
                  activeTab === "overview" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <LayoutDashboard className="h-5 w-5 transition-transform duration-200" />
                <span>نظرة عامة</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-150 ${
                  activeTab === "orders" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Package className="h-5 w-5 transition-transform duration-200" />
                <span>سجل الطلبات</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-200 ${
                  activeTab === "payments" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <CreditCard className="h-5 w-5 transition-transform duration-200" />
                <span>سجل المدفوعات</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-250 ${
                  activeTab === "tickets" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <MessageSquare className="h-5 w-5 transition-transform duration-200" />
                <span>تذاكر الدعم</span>
              </div>

              <div 
                onClick={() => setActiveTab("digital-services")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-300 ${
                  activeTab === "digital-services" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Monitor className="h-5 w-5 transition-transform duration-200" />
                <span>الخدمات الرقمية</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("design-services")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-350 ${
                  activeTab === "design-services" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Palette className="h-5 w-5 transition-transform duration-200" />
                <span>خدمات التصميم</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("business-services")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-400 ${
                  activeTab === "business-services" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Briefcase className="h-5 w-5 transition-transform duration-200" />
                <span>الخدمات التجارية</span>
              </div>
              
              <div 
                onClick={() => setActiveTab("content-services")}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover-scale animate-fade-in delay-450 ${
                  activeTab === "content-services" ? "bg-blue-600 text-white shadow-glow" : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <PenTool className="h-5 w-5 transition-transform duration-200" />
                <span>إنتاج المحتوى</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 mt-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => window.location.href = '/content-creation'}
                className="bg-purple-600 p-4 rounded-xl cursor-pointer hover:bg-purple-700 transition-all duration-300 hover-scale animate-fade-in delay-100 text-center"
              >
                <PenTool className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-medium">إنتاج المحتوى</p>
                <p className="text-xs opacity-80">محتوى إبداعي لعلامتك التجارية</p>
              </div>
              
              <div 
                onClick={() => window.location.href = '/business-services'}
                className="bg-orange-600 p-4 rounded-xl cursor-pointer hover:bg-orange-700 transition-all duration-300 hover-scale animate-fade-in delay-200 text-center"
              >
                <Briefcase className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-medium">خدمات الأعمال</p>
                <p className="text-xs opacity-80">استشارات وحلول تجارية</p>
              </div>
              
              <div 
                onClick={() => window.location.href = '/development'}
                className="bg-green-600 p-4 rounded-xl cursor-pointer hover:bg-green-700 transition-all duration-300 hover-scale animate-fade-in delay-300 text-center"
              >
                <Globe className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-medium">خدمات تطوير الويب</p>
                <p className="text-xs opacity-80">مواقع ويب متطورة وسريعة</p>
              </div>
              
              <div 
                onClick={() => window.location.href = '/design-solutions'}
                className="bg-blue-600 p-4 rounded-xl cursor-pointer hover:bg-blue-700 transition-all duration-300 hover-scale animate-fade-in delay-400 text-center"
              >
                <Palette className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-medium">طلب خدمة تصميم</p>
                <p className="text-xs opacity-80">احصل على تصميمات احترافية</p>
              </div>
            </div>
          </div>

          {/* Support Actions */}
          <div className="p-4 mt-4">
            <div className="space-y-2">
              <div 
                onClick={() => window.location.href = '/support'}
                className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <Headphones className="h-5 w-5" />
                <span>إنشاء تذكرة دعم</span>
              </div>
              
              <div 
                onClick={() => window.location.href = '/current-offers'}
                className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <TrendingUp className="h-5 w-5" />
                <span>عرض العروض الحالية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "overview" && <OverviewContent data={data} />}
          {activeTab === "orders" && <OrdersContent data={data} />}
          {activeTab === "payments" && <PaymentsContent data={data} />}
          {activeTab === "tickets" && <TicketsSection />}
          {activeTab === "digital-services" && <DigitalServicesContent data={data} />}
          {activeTab === "design-services" && <DesignServicesContent data={data} />}
          {activeTab === "business-services" && <BusinessServicesContent data={data} />}
          {activeTab === "content-services" && <ContentServicesContent data={data} />}
        </div>
      </div>
    </div>
  );
};

// مكون المحتوى الرئيسي
const OverviewContent = ({ data }: { data: DashboardData }) => (
  <div>
    {/* Top Stats Cards */}
    <div className="grid grid-cols-4 gap-6 mb-8">
      {/* تذاكر الدعم */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in hover-scale hover:shadow-glow transition-all duration-300 delay-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 animate-fade-in">
              <Headphones className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">تذاكر الدعم</h3>
            <p className="text-3xl font-bold text-white mt-2 animate-fade-in delay-200">{data.tickets.length}</p>
            <p className="text-orange-400 text-sm mt-1 animate-fade-in delay-300">3% ↗</p>
          </div>
        </div>
      </div>

      {/* المدفوعات */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in hover-scale hover:shadow-glow transition-all duration-300 delay-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 animate-fade-in">
              <CreditCard className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">المدفوعات</h3>
            <p className="text-3xl font-bold text-white mt-2 animate-fade-in delay-200">{data.paymentHistory.length}</p>
            <p className="text-purple-400 text-sm mt-1 animate-fade-in delay-300">15% ↗</p>
          </div>
        </div>
      </div>

      {/* الفواتير */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in hover-scale hover:shadow-glow transition-all duration-300 delay-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 animate-fade-in">
              <FileText className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">الفواتير</h3>
            <p className="text-3xl font-bold text-white mt-2 animate-fade-in delay-200">{data.invoices.length}</p>
            <p className="text-green-400 text-sm mt-1 animate-fade-in delay-300">8% ↗</p>
          </div>
        </div>
      </div>

      {/* طلبات الخدمات */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-scale-in hover-scale hover:shadow-glow transition-all duration-300 delay-400">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 animate-fade-in">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">طلبات الخدمات</h3>
            <p className="text-3xl font-bold text-white mt-2 animate-fade-in delay-200">{data.serviceRequests.length}</p>
            <p className="text-blue-400 text-sm mt-1 animate-fade-in delay-300">12% ↗</p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="grid grid-cols-2 gap-8">
      {/* سجل الأنشطة */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">سجل الأنشطة</h3>
        </div>
        
        <div className="space-y-4">
          {data.activityLogs.slice(0, 3).map((log, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <p className="text-white text-sm">{log.description}</p>
                <p className="text-slate-400 text-xs">
                  {new Date(log.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* آخر طلبات الخدمات */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-green-400" />
          <h3 className="text-xl font-semibold text-white">آخر طلبات الخدمات</h3>
        </div>
        
        <div className="space-y-4">
          {data.serviceRequests.length > 0 ? (
            data.serviceRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{request.title}</p>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {request.status === 'completed' ? 'مكتمل' : 
                     request.status === 'pending' ? 'معلق' : 'قيد التنفيذ'}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">{request.service_type}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">عرض الموقع الإحترافي الكامل</p>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">معلق</Badge>
              </div>
              <p className="text-slate-400 text-sm">payment_based</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// مكون سجل الطلبات
const OrdersContent = ({ data }: { data: DashboardData }) => {
  
  const getServiceIcon = (serviceType: string) => {
    const icons = {
      'design': <Package className="h-4 w-4" />,
      'business': <Building className="h-4 w-4" />,
      'digital': <BarChart3 className="h-4 w-4" />,
      'content': <FileText className="h-4 w-4" />
    };
    return icons[serviceType as keyof typeof icons] || <Package className="h-4 w-4" />;
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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">سجل الطلبات</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => window.location.href = '/design-solutions'} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            طلب خدمة جديدة
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">إجمالي الطلبات</h3>
            <p className="text-3xl font-bold text-white mt-2">{data.serviceRequests.length}</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">معلقة</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {data.serviceRequests.filter(req => req.status === 'pending').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">قيد التنفيذ</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {data.serviceRequests.filter(req => req.status === 'in_progress').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">مكتملة</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {data.serviceRequests.filter(req => req.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">جميع طلبات الخدمات</h3>
        
        {data.serviceRequests.length > 0 ? (
          <div className="space-y-4">
            {data.serviceRequests.map((request) => (
              <div key={request.id} className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      {getServiceIcon(request.service_type)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{request.title}</h4>
                      <p className="text-slate-300 text-sm">
                        {request.service_type === 'design' ? 'خدمات التصميم' :
                         request.service_type === 'business' ? 'الخدمات التجارية' :
                         request.service_type === 'digital' ? 'الخدمات الرقمية' :
                         request.service_type === 'content' ? 'إنتاج المحتوى' : request.service_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge 
                      variant={getStatusBadge(request.status).variant}
                      className={`${
                        request.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        request.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {getStatusBadge(request.status).label}
                    </Badge>
                    <p className="text-slate-400 text-xs mt-2">
                      {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                {request.description && (
                  <p className="text-slate-300 text-sm mb-4">{request.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {request.estimated_cost && (
                      <span>التكلفة المقدرة: {request.estimated_cost} ريال</span>
                    )}
                    {request.estimated_delivery_date && (
                      <span>تاريخ التسليم المقدر: {new Date(request.estimated_delivery_date).toLocaleDateString('ar-SA')}</span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    <Eye className="h-4 w-4 ml-2" />
                    تفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl text-white mb-4">لا توجد طلبات خدمات حالياً</h3>
            <p className="text-slate-400 mb-6">ابدأ بطلب خدمة جديدة لرؤية طلباتك هنا</p>
            <Button onClick={() => window.location.href = '/design-solutions'} className="bg-blue-600 hover:bg-blue-700">
              طلب خدمة جديدة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// مكون سجل المدفوعات
const PaymentsContent = ({ data }: { data: DashboardData }) => {
  const totalPaid = data.paymentHistory.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const successfulPayments = data.paymentHistory.filter(payment => payment.status === 'completed');
  const pendingPayments = data.paymentHistory.filter(payment => payment.status === 'pending');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">سجل المدفوعات</h2>
        <Button onClick={() => window.location.href = '/current-offers'} className="bg-green-600 hover:bg-green-700">
          عرض الفواتير
        </Button>
      </div>

      {/* إحصائيات المدفوعات */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">إجمالي المدفوعات</h3>
            <p className="text-3xl font-bold text-white mt-2">{totalPaid.toLocaleString()} ريال</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">عدد المعاملات</h3>
            <p className="text-3xl font-bold text-white mt-2">{data.paymentHistory.length}</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">مدفوعات ناجحة</h3>
            <p className="text-3xl font-bold text-white mt-2">{successfulPayments.length}</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">معلقة</h3>
            <p className="text-3xl font-bold text-white mt-2">{pendingPayments.length}</p>
          </div>
        </div>
      </div>

      {/* قائمة المدفوعات */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">تاريخ المدفوعات</h3>
        
        {data.paymentHistory.length > 0 ? (
          <div className="space-y-4">
            {data.paymentHistory.map((payment) => (
              <div key={payment.id} className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-green-400/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{payment.amount} {payment.currency || 'ريال'}</h4>
                      <p className="text-slate-300 text-sm">{payment.payment_method || 'طريقة دفع غير محددة'}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge 
                      className={`${
                        payment.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {payment.status === 'completed' ? 'مكتمل' : 
                       payment.status === 'pending' ? 'معلق' : 
                       payment.status === 'failed' ? 'فاشل' : payment.status}
                    </Badge>
                    <p className="text-slate-400 text-xs mt-2">
                      {new Date(payment.payment_date || payment.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                {payment.notes && (
                  <p className="text-slate-300 text-sm mb-4">{payment.notes}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {payment.reference_number && (
                      <span>المرجع: {payment.reference_number}</span>
                    )}
                    {payment.invoice_id && (
                      <span>الفاتورة: {payment.invoice_id}</span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    <Download className="h-4 w-4 ml-2" />
                    إيصال
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-24 w-24 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl text-white mb-4">لا توجد مدفوعات حالياً</h3>
            <p className="text-slate-400 mb-6">ستظهر مدفوعاتك هنا بعد إجراء أول عملية دفع</p>
          </div>
        )}
      </div>
    </div>
  );
};

// مكونات أقسام الخدمات
const DigitalServicesContent = ({ data }: { data: DashboardData }) => {
  const digitalServices = [
    { title: "تطوير المواقع", icon: <Globe className="h-8 w-8" />, color: "bg-blue-600", description: "مواقع ويب حديثة ومتجاوبة" },
    { title: "تطبيقات الهاتف", icon: <Smartphone className="h-8 w-8" />, color: "bg-green-600", description: "تطبيقات iOS و Android" },
    { title: "التسويق الرقمي", icon: <TrendingUp className="h-8 w-8" />, color: "bg-purple-600", description: "حملات تسويقية فعالة" },
    { title: "تحليل البيانات", icon: <BarChart3 className="h-8 w-8" />, color: "bg-orange-600", description: "رؤى وتحليلات متقدمة" }
  ];

  const digitalRequests = data.serviceRequests.filter(req => req.service_type === 'digital');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">الخدمات الرقمية</h2>
        <Button onClick={() => window.location.href = '/development'} className="bg-blue-600 hover:bg-blue-700">
          طلب خدمة رقمية
        </Button>
      </div>

      {/* خدمات متاحة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {digitalServices.map((service, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all cursor-pointer">
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-slate-300 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* طلبات الخدمات الرقمية */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">طلباتك للخدمات الرقمية</h3>
        {digitalRequests.length > 0 ? (
          <div className="space-y-4">
            {digitalRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{request.title}</h4>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {request.status === 'completed' ? 'مكتمل' : 
                     request.status === 'pending' ? 'معلق' : 'قيد التنفيذ'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-2">{request.description}</p>
                <div className="text-xs text-slate-400">
                  تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Monitor className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">لا توجد طلبات للخدمات الرقمية حالياً</p>
            <Button onClick={() => window.location.href = '/development'} className="mt-4 bg-blue-600 hover:bg-blue-700">
              اطلب خدمة رقمية الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const DesignServicesContent = ({ data }: { data: DashboardData }) => {
  const designServices = [
    { title: "الهوية البصرية", icon: <Star className="h-8 w-8" />, color: "bg-pink-600", description: "شعارات وهوية متكاملة" },
    { title: "تصميم المواقع", icon: <Monitor className="h-8 w-8" />, color: "bg-blue-600", description: "واجهات جذابة ومتجاوبة" },
    { title: "تصميم الطباعة", icon: <FileImage className="h-8 w-8" />, color: "bg-green-600", description: "بروشورات وكتيبات" },
    { title: "تصميم الإعلانات", icon: <Image className="h-8 w-8" />, color: "bg-orange-600", description: "إعلانات مميزة ومؤثرة" }
  ];

  const designRequests = data.serviceRequests.filter(req => req.service_type === 'design');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">خدمات التصميم</h2>
        <Button onClick={() => window.location.href = '/design-solutions'} className="bg-pink-600 hover:bg-pink-700">
          طلب خدمة تصميم
        </Button>
      </div>

      {/* خدمات متاحة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {designServices.map((service, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-pink-400/50 transition-all cursor-pointer">
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-slate-300 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* طلبات خدمات التصميم */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">طلباتك لخدمات التصميم</h3>
        {designRequests.length > 0 ? (
          <div className="space-y-4">
            {designRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{request.title}</h4>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {request.status === 'completed' ? 'مكتمل' : 
                     request.status === 'pending' ? 'معلق' : 'قيد التنفيذ'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-2">{request.description}</p>
                <div className="text-xs text-slate-400">
                  تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Palette className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">لا توجد طلبات لخدمات التصميم حالياً</p>
            <Button onClick={() => window.location.href = '/design-solutions'} className="mt-4 bg-pink-600 hover:bg-pink-700">
              اطلب خدمة تصميم الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const BusinessServicesContent = ({ data }: { data: DashboardData }) => {
  const businessServices = [
    { title: "الاستشارات", icon: <Users className="h-8 w-8" />, color: "bg-blue-600", description: "استشارات إدارية وتجارية" },
    { title: "دراسات الجدوى", icon: <Target className="h-8 w-8" />, color: "bg-green-600", description: "تحليل وتقييم المشاريع" },
    { title: "إدارة المشاريع", icon: <Settings className="h-8 w-8" />, color: "bg-purple-600", description: "إدارة احترافية للمشاريع" },
    { title: "التخطيط الاستراتيجي", icon: <Award className="h-8 w-8" />, color: "bg-orange-600", description: "خطط استراتيجية متقدمة" }
  ];

  const businessRequests = data.serviceRequests.filter(req => req.service_type === 'business');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">الخدمات التجارية</h2>
        <Button onClick={() => window.location.href = '/business-services'} className="bg-orange-600 hover:bg-orange-700">
          طلب خدمة تجارية
        </Button>
      </div>

      {/* خدمات متاحة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {businessServices.map((service, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all cursor-pointer">
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-slate-300 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* طلبات الخدمات التجارية */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">طلباتك للخدمات التجارية</h3>
        {businessRequests.length > 0 ? (
          <div className="space-y-4">
            {businessRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{request.title}</h4>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {request.status === 'completed' ? 'مكتمل' : 
                     request.status === 'pending' ? 'معلق' : 'قيد التنفيذ'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-2">{request.description}</p>
                <div className="text-xs text-slate-400">
                  تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">لا توجد طلبات للخدمات التجارية حالياً</p>
            <Button onClick={() => window.location.href = '/business-services'} className="mt-4 bg-orange-600 hover:bg-orange-700">
              اطلب خدمة تجارية الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentServicesContent = ({ data }: { data: DashboardData }) => {
  const contentServices = [
    { title: "كتابة المحتوى", icon: <PenTool className="h-8 w-8" />, color: "bg-purple-600", description: "محتوى إبداعي وجذاب" },
    { title: "إنتاج الفيديو", icon: <Video className="h-8 w-8" />, color: "bg-red-600", description: "فيديوهات احترافية" },
    { title: "التصوير الفوتوغرافي", icon: <Image className="h-8 w-8" />, color: "bg-blue-600", description: "تصوير منتجات وفعاليات" },
    { title: "إدارة وسائل التواصل", icon: <Users className="h-8 w-8" />, color: "bg-green-600", description: "إدارة حسابات التواصل" }
  ];

  const contentRequests = data.serviceRequests.filter(req => req.service_type === 'content');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">إنتاج المحتوى</h2>
        <Button onClick={() => window.location.href = '/content-creation'} className="bg-purple-600 hover:bg-purple-700">
          طلب خدمة محتوى
        </Button>
      </div>

      {/* خدمات متاحة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {contentServices.map((service, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all cursor-pointer">
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 text-white`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-slate-300 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* طلبات إنتاج المحتوى */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">طلباتك لإنتاج المحتوى</h3>
        {contentRequests.length > 0 ? (
          <div className="space-y-4">
            {contentRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{request.title}</h4>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {request.status === 'completed' ? 'مكتمل' : 
                     request.status === 'pending' ? 'معلق' : 'قيد التنفيذ'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-2">{request.description}</p>
                <div className="text-xs text-slate-400">
                  تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PenTool className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">لا توجد طلبات لإنتاج المحتوى حالياً</p>
            <Button onClick={() => window.location.href = '/content-creation'} className="mt-4 bg-purple-600 hover:bg-purple-700">
              اطلب خدمة محتوى الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;