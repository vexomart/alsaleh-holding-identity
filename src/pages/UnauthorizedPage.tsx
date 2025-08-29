import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Home, ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isAuthenticated, secureLogout } = useAuth();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLogin = () => {
    navigate('/auth', { 
      state: { from: location.state?.from || '/' }
    });
  };

  const handleLogout = async () => {
    await secureLogout();
  };

  return (
    <div 
      dir="rtl" 
      className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl shadow-2xl border-red-200 dark:border-red-800">
        <CardContent className="p-8 text-center space-y-8">
          {/* أيقونة التحذير */}
          <div className="relative">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* العنوان الرئيسي */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-red-700 dark:text-red-400">
              وصول غير مصرح
            </h1>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <p className="text-xl text-red-600 dark:text-red-400 font-semibold">
                ليس لديك صلاحيات للوصول إلى هذه الصفحة
              </p>
            </div>
          </div>

          {/* معلومات الحالة المحدثة */}
          <Alert className="text-right border-red-200 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>حالة المصادقة:</strong> 
                    <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                      {isAuthenticated ? ' مسجل دخول' : ' غير مسجل دخول'}
                    </span>
                  </div>
                  {isAuthenticated && (
                    <div>
                      <strong>الدور الحالي:</strong> 
                      <span className="text-blue-600">{userRole || ' غير محدد'}</span>
                    </div>
                  )}
                </div>
                {location.state?.from && (
                  <div className="pt-2 border-t border-red-200 dark:border-red-700">
                    <strong>الصفحة المطلوبة:</strong> {location.state.from}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* الوصف والأسباب */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <div className="space-y-4 text-red-800 dark:text-red-300">
              <p className="text-lg leading-relaxed">
                هذه الصفحة مخصصة للمخولين فقط. إذا كنت تحتاج للوصول، 
                يرجى التواصل مع المدير للحصول على الصلاحيات المطلوبة.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 text-right">
                <h3 className="font-semibold mb-2 text-foreground">الأسباب المحتملة:</h3>
                <ul className="text-sm space-y-1">
                  {!isAuthenticated ? (
                    <li>• لم تقم بتسجيل الدخول</li>
                  ) : (
                    <>
                      <li>• لا تملك الصلاحية المطلوبة</li>
                      <li>• انتهت صلاحية جلستك</li>
                      <li>• تم تقييد حسابك</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-red-200 dark:border-red-700">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>ملاحظة:</strong> تم تسجيل محاولة الوصول هذه لأغراض الأمان.
                </p>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">للحصول على الصلاحيات:</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• تواصل مع إدارة النظام</li>
                <li>• احرص على تقديم هويتك</li>
                <li>• حدد الصلاحيات المطلوبة</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">الأدوار المتاحة:</h3>
              <ul className="text-blue-600 dark:text-blue-400 space-y-1">
                <li>• مدير (Admin)</li>
                <li>• مشرف (Moderator)</li>
                <li>• محرر (Editor)</li>
                <li>• مشاهد (Viewer)</li>
                <li>• مستخدم (User)</li>
              </ul>
            </div>
          </div>

          {/* الإجراءات المحدثة */}
          <div className="space-y-4">
            {!isAuthenticated ? (
              <Button 
                onClick={handleLogin} 
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                تسجيل الدخول
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={handleLogout} 
                  variant="outline"
                  size="lg"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  تسجيل خروج وإعادة تسجيل دخول
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGoHome}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Home className="w-5 h-5 ml-2" />
                العودة للصفحة الرئيسية
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline" 
                size="lg"
                className="border-gray-300 dark:border-gray-600"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                العودة للصفحة السابقة
              </Button>
            </div>
          </div>

          {/* تذييل */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              شركة علي صالح الشهري القابضة - نظام إدارة الهوية والوصول
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              في حالة وجود مشكلة تقنية، يرجى التواصل مع الدعم الفني
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;