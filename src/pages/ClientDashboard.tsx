import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, CreditCard, Settings, Bell, Plus, Eye } from 'lucide-react';
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
      // For now, we'll create a mock profile since the table doesn't exist yet
      const mockProfile: UserProfile = {
        id: userId,
        first_name: 'أحمد',
        last_name: 'محمد',
        avatar_url: null,
        phone: '+966501234567',
        company: 'شركة التقنية',
        created_at: new Date().toISOString()
      };
      setProfile(mockProfile);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              مرحباً، {profile?.first_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">إدارة حسابك وطلباتك</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات النشطة</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +2 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات المكتملة</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +4 من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإنفاق</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,200 ر.س</div>
              <p className="text-xs text-muted-foreground">
                +15% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النقاط المكتسبة</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">
                +50 نقطة جديدة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
            <TabsTrigger value="projects">مشاريعي</TabsTrigger>
            <TabsTrigger value="billing">الفواتير</TabsTrigger>
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">طلباتي</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                طلب جديد
              </Button>
            </div>
            
            <div className="grid gap-4">
              {[1, 2, 3].map((order) => (
                <Card key={order}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">طلب تصميم موقع إلكتروني</CardTitle>
                        <CardDescription>
                          تم الإنشاء في {new Date().toLocaleDateString('ar-SA')}
                        </CardDescription>
                      </div>
                      <Badge variant={order === 1 ? 'default' : order === 2 ? 'secondary' : 'outline'}>
                        {order === 1 ? 'قيد التنفيذ' : order === 2 ? 'مكتمل' : 'في الانتظار'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          رقم الطلب: #ORD-{2024}0{order}
                        </p>
                        <p className="text-sm font-medium">
                          المبلغ: {(order * 5000).toLocaleString()} ر.س
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">مشاريعي</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                مشروع جديد
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((project) => (
                <Card key={project}>
                  <CardHeader>
                    <CardTitle>مشروع تطوير تطبيق الجوال</CardTitle>
                    <CardDescription>
                      بدء المشروع: {new Date().toLocaleDateString('ar-SA')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>التقدم</span>
                        <span>{project * 30}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project * 30}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="secondary">نشط</Badge>
                        <Button variant="outline" size="sm">
                          عرض المشروع
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <h2 className="text-2xl font-bold">الفواتير والمدفوعات</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>الفواتير الأخيرة</CardTitle>
                <CardDescription>آخر 6 أشهر من الفواتير</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((invoice) => (
                    <div key={invoice} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">فاتورة #{`INV-${2024}0${invoice}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(invoice * 2500).toLocaleString()} ر.س</p>
                        <Badge variant={invoice === 1 ? 'default' : 'secondary'}>
                          {invoice === 1 ? 'مدفوعة' : 'معلقة'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-2xl font-bold">الملف الشخصي</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>إدارة معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">الاسم الأول</label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.first_name || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">الاسم الأخير</label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.last_name || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">رقم الهاتف</label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone || 'غير محدد'}
                    </p>
                  </div>
                </div>
                <Button>تحديث المعلومات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}