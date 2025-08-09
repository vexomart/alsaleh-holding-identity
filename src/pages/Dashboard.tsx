import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package
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
    // إعداد مستمع حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserData(session.user.id);
      }
    });

    // التحقق من الجلسة الحالية
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

      // جلب بيانات الملف الشخصي
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfile(profileData);
      }

      // جلب طلبات الخدمات
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

      // جلب الفواتير
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
      case "pending":
        return "قيد الانتظار";
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      case "paid":
        return "مدفوع";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
          title={`مرحباً، ${profile?.full_name || user?.email}`}
          description="إدارة خدماتك وطلباتك"
        />
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            طلبات الخدمات
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            الفواتير
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            الملف الشخصي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  طلبات الخدمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{serviceRequests.length}</div>
                <p className="text-sm text-muted-foreground">
                  {serviceRequests.filter(r => r.status === "pending").length} قيد الانتظار
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  الفواتير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <p className="text-sm text-muted-foreground">
                  {invoices.filter(i => i.payment_status === "pending").length} غير مدفوعة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  مشاريع مكتملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {serviceRequests.filter(r => r.status === "completed").length}
                </div>
                <p className="text-sm text-muted-foreground">تم إنجازها بنجاح</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الخدمات المتاحة</CardTitle>
                <CardDescription>
                  اختر من بين خدماتنا المتنوعة لبدء مشروعك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate("/design-solutions")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">الحلول التصميمية</h3>
                      <p className="text-sm text-muted-foreground">
                        تصميم الهوية البصرية والمواد التسويقية
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate("/content-creation")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">إنتاج المحتوى</h3>
                      <p className="text-sm text-muted-foreground">
                        كتابة وإنتاج المحتوى الرقمي والتسويقي
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate("/business-services")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">الخدمات المؤسسية</h3>
                      <p className="text-sm text-muted-foreground">
                        استشارات وحلول الأعمال والتحول الرقمي
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">طلبات الخدمات</h3>
              <Button onClick={() => navigate("/current-offers")}>
                <Plus className="h-4 w-4 mr-2" />
                طلب خدمة جديدة
              </Button>
            </div>

            {serviceRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد طلبات خدمات حتى الآن</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/current-offers")}
                  >
                    طلب خدمة الآن
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {serviceRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{request.title}</CardTitle>
                          <CardDescription>{request.service_type}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="text-sm">{getStatusText(request.status)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {request.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                          أولوية {request.priority}
                        </span>
                        {request.estimated_cost && (
                          <span className="font-medium">
                            {request.estimated_cost} ريال
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الفواتير</h3>

            {invoices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد فواتير حتى الآن</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            فاتورة رقم {invoice.invoice_number}
                          </CardTitle>
                          <CardDescription>{invoice.offer_title}</CardDescription>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold">
                            {invoice.amount} {invoice.currency}
                          </div>
                          <div className={`text-sm ${
                            invoice.payment_status === 'paid' 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {getStatusText(invoice.payment_status)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          تاريخ الإنشاء: {new Date(invoice.created_at).toLocaleDateString('ar-SA')}
                        </span>
                        {invoice.due_date && (
                          <span>
                            تاريخ الاستحقاق: {new Date(invoice.due_date).toLocaleDateString('ar-SA')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>معلوماتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || "غير محدد"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <p className="text-sm text-muted-foreground">
                  {profile?.phone || "غير محدد"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم الشركة</label>
                <p className="text-sm text-muted-foreground">
                  {profile?.company || "غير محدد"}
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                تحديث المعلومات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Dashboard;