import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell, 
  Plus, 
  Eye, 
  Search,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
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
          checkUserRole(session.user.id);
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
        checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserRole = async (userId: string) => {
    try {
      // For now, we'll allow admin access for demo purposes
      // In production, this should check the user_roles table
      setUserRole('admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/dashboard', { replace: true });
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

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">لوحة تحكم الإدارة</h1>
            <p className="text-muted-foreground">إدارة النظام والمستخدمين والطلبات</p>
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

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات النشطة</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +4 طلبات اليوم
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450,000 ر.س</div>
              <p className="text-xs text-muted-foreground">
                +20% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل النمو</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% من الربع الماضي
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                إضافة مستخدم
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="البحث عن المستخدمين..." className="max-w-sm" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
                <CardDescription>إدارة حسابات المستخدمين وصلاحياتهم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((userId) => (
                    <div key={userId} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">أحمد محمد السعد</p>
                          <p className="text-sm text-muted-foreground">ahmed@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={userId % 2 === 0 ? 'default' : 'secondary'}>
                          {userId % 2 === 0 ? 'عميل' : 'مدير'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          عرض
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
              <div className="flex gap-2">
                <Button variant="outline">تصدير</Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  طلب جديد
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <Card key={order}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">طلب تصميم موقع إلكتروني</CardTitle>
                        <CardDescription>
                          العميل: أحمد محمد | {new Date().toLocaleDateString('ar-SA')}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        order % 3 === 0 ? 'default' : 
                        order % 3 === 1 ? 'secondary' : 'outline'
                      }>
                        {order % 3 === 0 ? 'قيد التنفيذ' : 
                         order % 3 === 1 ? 'مكتمل' : 'في الانتظار'}
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
                          المبلغ: {(order * 7500).toLocaleString()} ر.س
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          عرض
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المشاريع</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                مشروع جديد
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((project) => (
                <Card key={project}>
                  <CardHeader>
                    <CardTitle className="text-lg">مشروع تطبيق الجوال</CardTitle>
                    <CardDescription>
                      العميل: شركة التقنية المتقدمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>التقدم</span>
                        <span>{project * 15}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project * 15}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">نشط</Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            تعديل
                          </Button>
                          <Button variant="outline" size="sm">
                            عرض
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-2xl font-bold">التحليلات والتقارير</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>نمو المستخدمين</CardTitle>
                  <CardDescription>إحصائيات المستخدمين الجدد</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">+24%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    زيادة في التسجيلات هذا الشهر
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات</CardTitle>
                  <CardDescription>إجمالي الإيرادات الشهرية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">850,000 ر.س</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    +18% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-bold">إعدادات النظام</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات العامة</CardTitle>
                  <CardDescription>إدارة إعدادات النظام الأساسية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button>تحديث إعدادات الموقع</Button>
                    <Button variant="outline">إدارة الإشعارات</Button>
                    <Button variant="outline">إعدادات الأمان</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المحتوى</CardTitle>
                  <CardDescription>تحديث وإدارة محتوى الموقع</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button>إدارة الصفحات</Button>
                    <Button variant="outline">إدارة الخدمات</Button>
                    <Button variant="outline">إدارة العروض</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}