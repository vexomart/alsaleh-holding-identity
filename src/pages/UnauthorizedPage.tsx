import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4" 
      dir="rtl"
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

          {/* الوصف */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <div className="space-y-3 text-red-800 dark:text-red-300">
              <p className="text-lg leading-relaxed">
                هذه الصفحة مخصصة للإداريين فقط. إذا كنت تحتاج للوصول إلى لوحة الإدارة، 
                يرجى التواصل مع المدير للحصول على الصلاحيات المطلوبة.
              </p>
              
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
                <li>• مدير عام (SuperAdmin)</li>
                <li>• مدير (Admin)</li>
                <li>• محرر (Editor)</li>
                <li>• مشاهد (Viewer)</li>
              </ul>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة للصفحة السابقة
            </Button>
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