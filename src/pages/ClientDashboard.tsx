import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell, 
  Plus, 
  Eye, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Download,
  BarChart3
} from 'lucide-react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
}

export default function ClientDashboard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth', { replace: true });
        } else {
          fetchProfile(session.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth', { replace: true });
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profileData) {
        setProfile({
          id: profileData.id,
          first_name: profileData.full_name?.split(' ')[0] || null,
          last_name: profileData.full_name?.split(' ').slice(1).join(' ') || null,
          avatar_url: null,
          phone: profileData.phone,
          company: profileData.company,
          created_at: profileData.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 animate-fade-in">
        {/* Welcome Header with Floating Elements */}
        <div className="relative mb-8 animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-3xl blur-sm"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-primary/20 animate-pulse">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-bold">
                    {profile?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    أهلاً وسهلاً، {profile?.first_name || user?.email?.split('@')[0]}
                  </h1>
                  <p className="text-muted-foreground text-lg mt-1">إدارة حسابك ومشاريعك بكل سهولة</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="animate-fade-in delay-200">
                      <Star className="w-3 h-3 mr-1" />
                      عميل مميز
                    </Badge>
                    <Badge variant="outline" className="animate-fade-in delay-300">
                      <Clock className="w-3 h-3 mr-1" />
                      نشط منذ {new Date(profile?.created_at || '').toLocaleDateString('ar-SA')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="relative overflow-hidden hover-scale group">
                  <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </Button>
                <Button onClick={handleSignOut} className="hover-scale group">
                  <Settings className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "الطلبات النشطة", 
              value: "0", 
              change: "لا توجد بيانات", 
              icon: FileText, 
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              delay: "delay-100"
            },
            { 
              title: "المشاريع المكتملة", 
              value: "0", 
              change: "لا توجد بيانات", 
              icon: CheckCircle, 
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-50",
              delay: "delay-200"
            },
            { 
              title: "إجمالي الإنفاق", 
              value: "0 ر.س", 
              change: "لا توجد بيانات", 
              icon: TrendingUp, 
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
              delay: "delay-300"
            },
            { 
              title: "النقاط المكتسبة", 
              value: "0", 
              change: "لا توجد بيانات", 
              icon: Star, 
              color: "from-amber-500 to-amber-600",
              bgColor: "bg-amber-50",
              delay: "delay-400"
            }
          ].map((stat, index) => (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale ${stat.delay} animate-fade-in`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-3 rounded-full ${stat.bgColor} relative`}>
                  <stat.icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-6 animate-fade-in delay-500">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-2 shadow-lg">
            <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover-scale"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover-scale"
              >
                <FileText className="w-4 h-4 mr-2" />
                طلباتي
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover-scale"
              >
                <Settings className="w-4 h-4 mr-2" />
                مشاريعي
              </TabsTrigger>
              <TabsTrigger 
                value="billing"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover-scale"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                الفواتير
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover-scale"
              >
                <User className="w-4 h-4 mr-2" />
                الملف الشخصي
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Plus className="w-6 h-6 text-primary" />
                    إجراءات سريعة
                  </CardTitle>
                  <CardDescription>ابدأ مشروعك الجديد بنقرة واحدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "طلب تصميم موقع", icon: FileText, color: "text-blue-600" },
                    { name: "مشروع تطبيق جوال", icon: Settings, color: "text-green-600" },
                    { name: "خدمات التسويق", icon: TrendingUp, color: "text-purple-600" },
                  ].map((action, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className="w-full justify-start h-12 hover:bg-primary/10 group transition-all duration-300"
                    >
                      <action.icon className={`mr-3 h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                      {action.name}
                      <ArrowRight className="mr-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="w-6 h-6 text-green-600" />
                    الأنشطة الأخيرة
                  </CardTitle>
                  <CardDescription>تتبع آخر التحديثات على مشاريعك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد أنشطة حتى الآن</p>
                    <p className="text-sm text-gray-400 mt-2">ستظهر أنشطتك هنا عند بدء استخدام المنصة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                طلباتي
              </h2>
              <Button className="hover-scale group bg-gradient-to-r from-primary to-blue-600">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                طلب جديد
              </Button>
            </div>
            
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد طلبات حتى الآن</h3>
              <p className="text-gray-500 mb-6">ابدأ رحلتك معنا بإنشاء طلبك الأول</p>
              <Button className="hover-scale group bg-gradient-to-r from-primary to-blue-600">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                إنشاء طلب جديد
              </Button>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                مشاريعي
              </h2>
              <Button className="hover-scale group bg-gradient-to-r from-primary to-blue-600">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                مشروع جديد
              </Button>
            </div>
            
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع حتى الآن</h3>
              <p className="text-gray-500 mb-6">ابدأ مشروعك الأول معنا اليوم</p>
              <Button className="hover-scale group bg-gradient-to-r from-primary to-blue-600">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                إنشاء مشروع جديد
              </Button>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              الفواتير والمدفوعات
            </h2>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  الفواتير الأخيرة
                </CardTitle>
                <CardDescription>آخر 6 أشهر من الفواتير والمدفوعات</CardDescription>
              </CardHeader>
               <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد فواتير حتى الآن</h3>
                  <p className="text-gray-500">ستظهر فواتيرك هنا عند إتمام أول عملية شراء</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              الملف الشخصي
            </h2>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-6 h-6 text-primary" />
                  معلومات الحساب
                </CardTitle>
                <CardDescription>إدارة وتحديث معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-xl">
                  <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl font-bold">
                      {profile?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      تغيير الصورة
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "الاسم الأول", value: profile?.first_name || 'غير محدد', icon: User },
                    { label: "الاسم الأخير", value: profile?.last_name || 'غير محدد', icon: User },
                    { label: "البريد الإلكتروني", value: user?.email || 'غير محدد', icon: User },
                    { label: "رقم الهاتف", value: profile?.phone || 'غير محدد', icon: User },
                    { label: "الشركة", value: profile?.company || 'غير محدد', icon: User },
                    { label: "تاريخ الانضمام", value: new Date(profile?.created_at || '').toLocaleDateString('ar-SA'), icon: Calendar },
                  ].map((field, index) => (
                    <div key={index} className="space-y-2 p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors">
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <field.icon className="w-4 h-4" />
                        {field.label}
                      </label>
                      <p className="text-lg font-medium text-gray-900">{field.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="hover-scale bg-gradient-to-r from-primary to-blue-600">
                    <Settings className="mr-2 h-4 w-4" />
                    تحديث المعلومات
                  </Button>
                  <Button variant="outline" className="hover-scale">
                    <Eye className="mr-2 h-4 w-4" />
                    عرض الملف الكامل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}