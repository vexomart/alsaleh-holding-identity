import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Shield, Users, BarChart3, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق من وجود جلسة مصادقة موجودة
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // تحقق من صلاحيات الإدارة
        const { data: adminData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (adminData) {
          navigate('/admin-projects');
        }
      }
    } catch (error) {
      console.log('لا توجد جلسة مصادقة سابقة');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // محاولة تسجيل الدخول
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('بيانات الدخول غير صحيحة. يرجى التحقق من الإيميل وكلمة المرور.');
        setLoading(false);
        return;
      }

      if (data.user) {
        // تحقق من صلاحيات الإدارة
        const { data: adminData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !adminData) {
          setError('ليس لديك صلاحيات إدارية. يرجى التواصل مع المدير.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        // تسجيل نجح ولديه صلاحيات إدارية
        toast({
          title: "مرحباً بك في لوحة الإدارة",
          description: `تم تسجيل الدخول بنجاح - ${data.user.email}`,
        });

        navigate('/admin-projects');
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* الشعار والعنوان */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
            <p className="text-gray-600 mt-2">شركة علي صالح الشهري القابضة</p>
          </div>
        </div>

        {/* كارد تسجيل الدخول */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              دخول المدير
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              قم بإدخال بيانات الدخول الخاصة بالإدارة
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800 text-right">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="admin@alialshehriholding.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 text-right pr-10"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  'دخول لوحة الإدارة'
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* ميزات سريعة */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-blue-700">إدارة العملاء</span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <span className="text-xs text-green-700">التقارير</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="text-xs text-purple-700">الإعدادات</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* روابط سريعة */}
        <div className="text-center space-y-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            ← العودة للموقع الرئيسي
          </button>
          
          <div className="text-xs text-gray-500">
            <p>لوحة الإدارة محمية بنظام أمان متطور</p>
            <p className="mt-1">© 2025 شركة علي صالح الشهري القابضة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;