import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Settings, ShoppingCart, Upload } from 'lucide-react';

export const QuickSetupGuide = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">دليل إعداد Google Merchant Center</h1>
        <p className="text-muted-foreground">خطوات سريعة لربط متجرك مع Google</p>
      </div>

      <div className="grid gap-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              إنشاء حساب Google Merchant Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>قم بإنشاء حساب جديد في Google Merchant Center</p>
            <Button asChild>
              <a href="https://merchants.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                إنشاء حساب Merchant Center
              </a>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>• اختر نوع الحساب (فردي أو شركة)</p>
              <p>• أدخل معلومات النشاط التجاري</p>
              <p>• تحقق من ملكية الموقع</p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              إعداد Google Cloud Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>قم بتفعيل Content API في Google Cloud Console</p>
            <Button asChild>
              <a href="https://console.cloud.google.com/apis/library/content.googleapis.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                تفعيل Content API
              </a>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>• أنشئ مشروع جديد أو استخدم موجود</p>
              <p>• فعّل Google Content API for Shopping</p>
              <p>• أنشئ Service Account وحمّل ملف JSON</p>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              ربط النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>استخدم نظام الربط المتقدم في موقعك</p>
            <Button asChild>
              <a href="/google-merchant">
                <Settings className="w-4 h-4 mr-2" />
                فتح نظام Google Merchant
              </a>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>• أدخل Merchant ID من حسابك</p>
              <p>• تحقق من حالة الاتصال</p>
              <p>• اختبر رفع المنتجات</p>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              إدارة المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>رفع ومزامنة منتجاتك مع Google</p>
            <div className="flex gap-2">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                عرض المنتجات
              </Button>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                رفع المنتجات
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• راجع معلومات المنتجات</p>
              <p>• تأكد من صحة الأسعار والصور</p>
              <p>• تتبع حالة الموافقة من Google</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">متطلبات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <ul className="space-y-2">
              <li>• موقع إلكتروني يعمل بشكل صحيح</li>
              <li>• سياسة الإرجاع والاستبدال واضحة</li>
              <li>• معلومات الاتصال كاملة</li>
              <li>• أسعار وتوفر المنتجات محدثة</li>
              <li>• صور عالية الجودة للمنتجات</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};