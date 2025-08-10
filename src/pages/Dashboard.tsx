import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  TrendingUp,
  Sparkles,
  Star,
  Award,
  Palette,
  Code,
  Target,
  Lightbulb,
  Calendar,
  DollarSign,
  Eye,
  ArrowRight,
  BarChart3,
  Users,
  Briefcase,
  Mail,
  Phone,
  Building,
  AlertTriangle,
  Download,
  Activity,
  Zap,
  Heart,
  Globe
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
}

interface ServiceRequest {
  id: string;
  service_type: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  estimated_cost: number | null;
  estimated_delivery_date: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  offer_title: string;
  amount: number;
  currency: string;
  payment_status: string;
  status: string;
  due_date: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        setTimeout(() => {
          fetchUserData(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfile(profileData);
      }

      const { data: requestsData, error: requestsError } = await supabase
        .from("service_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (requestsError) {
        console.error("Error fetching service requests:", requestsError);
      } else {
        setServiceRequests(requestsData || []);
      }

      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (invoicesError) {
        console.error("Error fetching invoices:", invoicesError);
      } else {
        setInvoices(invoicesData || []);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تسجيل الخروج",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "in_progress": return "قيد التنفيذ";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغي";
      case "paid": return "مدفوع";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate stats
  const completedProjects = serviceRequests.filter(r => r.status === "completed").length;
  const pendingRequests = serviceRequests.filter(r => r.status === "pending").length;
  const unpaidInvoices = invoices.filter(i => i.payment_status === "pending").length;
  const totalRevenue = invoices.filter(i => i.payment_status === "paid").reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">جاري تحميل لوحة التحكم</h3>
            <p className="text-gray-500">يرجى الانتظار...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  مرحباً، {profile?.full_name || user?.email?.split('@')[0]}
                  <span className="inline-block ml-2">
                    <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                  </span>
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Activity className="w-3 h-3 mr-1" />
                    نشط الآن
                  </Badge>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/current-offers")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 ml-2" />
                خدمة جديدة
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">طلبات الخدمات</p>
                  <p className="text-3xl font-bold">{serviceRequests.length}</p>
                  <p className="text-blue-100 text-xs">{pendingRequests} قيد الانتظار</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">الفواتير</p>
                  <p className="text-3xl font-bold">{invoices.length}</p>
                  <p className="text-green-100 text-xs">{unpaidInvoices} غير مدفوعة</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">مشاريع مكتملة</p>
                  <p className="text-3xl font-bold">{completedProjects}</p>
                  <p className="text-purple-100 text-xs">تم إنجازها بنجاح</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">إجمالي المدفوعات</p>
                  <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}</p>
                  <p className="text-orange-100 text-xs">ريال سعودي</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-6 h-6 text-yellow-500" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>ابدأ مشروعك الجديد أو أدر خدماتك الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border-2 border-transparent hover:border-blue-200"
                onClick={() => navigate("/design-solutions")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">الحلول التصميمية</h3>
                  <p className="text-sm text-gray-600 mb-4">تصميم الهوية البصرية والمواد التسويقية</p>
                  <Button size="sm" variant="outline" className="group-hover:bg-blue-50">
                    ابدأ الآن <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border-2 border-transparent hover:border-green-200"
                onClick={() => navigate("/content-creation")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">إنتاج المحتوى</h3>
                  <p className="text-sm text-gray-600 mb-4">كتابة وإنتاج المحتوى الرقمي والتسويقي</p>
                  <Button size="sm" variant="outline" className="group-hover:bg-green-50">
                    ابدأ الآن <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border-2 border-transparent hover:border-purple-200"
                onClick={() => navigate("/business-services")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">الخدمات المؤسسية</h3>
                  <p className="text-sm text-gray-600 mb-4">استشارات وحلول الأعمال والتحول الرقمي</p>
                  <Button size="sm" variant="outline" className="group-hover:bg-purple-50">
                    ابدأ الآن <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              طلبات الخدمات
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4" />
              الفواتير
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              الملف الشخصي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    النشاط الأخير
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(request.status)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{request.title}</p>
                          <p className="text-xs text-gray-500">{request.service_type}</p>
                        </div>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                    ))}
                    {serviceRequests.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>لا يوجد نشاط حتى الآن</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    الإحصائيات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">إجمالي الطلبات</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{serviceRequests.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">مشاريع مكتملة</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{completedProjects}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">إجمالي الإيرادات</span>
                      </div>
                      <span className="text-xl font-bold text-orange-600">{totalRevenue.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    طلبات الخدمات
                  </CardTitle>
                  <Button onClick={() => navigate("/current-offers")} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    طلب خدمة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد طلبات خدمات</h3>
                    <p className="text-gray-600 mb-6">ابدأ رحلتك معنا بطلب خدمة جديدة</p>
                    <Button 
                      onClick={() => navigate("/current-offers")}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      طلب خدمة الآن
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {serviceRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{request.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{request.service_type}</p>
                              {request.description && (
                                <p className="text-gray-500 text-sm">{request.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <span className="text-sm font-medium">{getStatusText(request.status)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <Badge className={getPriorityColor(request.priority)}>
                              أولوية {request.priority}
                            </Badge>
                            
                            {request.estimated_cost && (
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium">{request.estimated_cost} ريال</span>
                              </div>
                            )}
                            
                            {request.estimated_delivery_date && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(request.estimated_delivery_date).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(request.created_at).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  الفواتير
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد فواتير</h3>
                    <p className="text-gray-600">ستظهر فواتيرك هنا عند إتمام طلباتك</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {invoices.map((invoice) => (
                      <Card key={invoice.id} className="hover:shadow-md transition-shadow border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">
                                فاتورة رقم {invoice.invoice_number}
                              </h3>
                              <p className="text-gray-600 mb-2">{invoice.offer_title}</p>
                            </div>
                            <div className="text-left">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {invoice.amount.toLocaleString()} {invoice.currency}
                              </div>
                              <Badge className={`${
                                invoice.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {getStatusText(invoice.payment_status)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>الإنشاء: {new Date(invoice.created_at).toLocaleDateString('ar-SA')}</span>
                            </div>
                            {invoice.due_date && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span>الاستحقاق: {new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              تحميل PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-500" />
                  الملف الشخصي
                </CardTitle>
                <CardDescription>معلوماتك الشخصية وإعدادات الحساب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        الاسم الكامل
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {profile?.full_name || "غير محدد"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </label>
                      <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {profile?.phone || "غير محدد"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        الشركة
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {profile?.company || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Settings className="w-4 h-4 mr-2" />
                    تحديث الملف الشخصي
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;