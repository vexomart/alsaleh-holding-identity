/**
 * Typography QA Component
 * Visual verification of enterprise typography system
 */

import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function TypographyQA() {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>فحص الخطوط والتنسيق</h1>
          <p className="text-muted-foreground">Typography QA Panel</p>
        </div>
        <Button onClick={toggleLanguage} variant="outline">
          {isRTL ? 'EN' : 'عربي'}
        </Button>
      </div>

      <Separator />

      {/* Headings */}
      <Card>
        <CardHeader>
          <CardTitle>العناوين - Headings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1>عنوان رئيسي H1 - Main Heading</h1>
          <h2>عنوان فرعي H2 - Secondary Heading</h2>
          <h3>عنوان ثالث H3 - Tertiary Heading</h3>
          <h4>عنوان رابع H4 - Fourth Level</h4>
          <p className="text-muted-foreground text-sm">
            ✓ يجب أن تظهر الخطوط بوضوح بدون مربعات
          </p>
        </CardContent>
      </Card>

      {/* Body Text */}
      <Card>
        <CardHeader>
          <CardTitle>النص الأساسي - Body Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            هذا نص عربي للاختبار. شركة علي صالح الشهري القابضة هي شركة رائدة في مجال الاستثمار التقني والإعلامي في المملكة العربية السعودية.
          </p>
          <p className="text-body-lg">
            نص كبير - This is larger body text for emphasis and important information.
          </p>
          <p className="text-body-sm text-muted-foreground">
            نص صغير - Smaller text for captions and secondary information.
          </p>
        </CardContent>
      </Card>

      {/* Mixed Content - LTR Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>المحتوى المختلط - Mixed Content (LTR Tokens)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>
              رقم الفاتورة: <span className="ltr-token font-mono">INV-2024-00123</span>
            </p>
            <p>
              رقم الطلب: <span className="ltr-token font-mono">ORD-2024-00456</span>
            </p>
            <p>
              البريد الإلكتروني: <span className="ltr-token">info@ash-holding.sa</span>
            </p>
            <p>
              رقم الهاتف: <span className="ltr-token">+966 11 123 4567</span>
            </p>
            <p>
              المبلغ: <span className="ltr-token font-mono">1,250.00 SAR</span>
            </p>
            <p>
              ضريبة القيمة المضافة: <span className="ltr-token">15%</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            ✓ يجب أن تظهر الأرقام والمعرفات بالاتجاه الصحيح (LTR)
          </p>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>الأزرار - Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>زر رئيسي</Button>
            <Button variant="secondary">زر ثانوي</Button>
            <Button variant="outline">زر محدد</Button>
            <Button variant="ghost">زر شفاف</Button>
            <Button variant="destructive">زر حذف</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">صغير</Button>
            <Button size="default">عادي</Button>
            <Button size="lg">كبير</Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>عناصر النماذج - Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" placeholder="أدخل اسمك الكامل" />
            <p className="text-xs text-muted-foreground">نص مساعد يوضح المطلوب</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="example@domain.com" dir="ltr" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>الشارات - Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>افتراضي</Badge>
            <Badge variant="secondary">ثانوي</Badge>
            <Badge variant="outline">محدد</Badge>
            <Badge variant="destructive">تحذير</Badge>
            <Badge className="bg-success text-success-foreground">نجاح</Badge>
            <Badge className="bg-warning text-warning-foreground">انتظار</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Table Preview */}
      <Card>
        <CardHeader>
          <CardTitle>الجداول - Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">رقم الطلب</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">الخدمة</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">المبلغ</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30">
                  <td className="p-3 text-sm"><span className="ltr-token font-mono">ORD-001</span></td>
                  <td className="p-3 text-sm">تطوير تطبيقات</td>
                  <td className="p-3 text-sm"><span className="ltr-token">5,000 SAR</span></td>
                  <td className="p-3"><Badge className="bg-success/10 text-success">مكتمل</Badge></td>
                </tr>
                <tr className="border-t hover:bg-muted/30">
                  <td className="p-3 text-sm"><span className="ltr-token font-mono">ORD-002</span></td>
                  <td className="p-3 text-sm">استشارات تقنية</td>
                  <td className="p-3 text-sm"><span className="ltr-token">2,500 SAR</span></td>
                  <td className="p-3"><Badge className="bg-warning/10 text-warning">قيد التنفيذ</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* QA Checklist */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>قائمة الفحص - QA Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              الخطوط تظهر بدون مربعات (No font fallback squares)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              الأوزان متسقة (Consistent weights: 400, 500, 600, 700)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              RTL صحيح للنص العربي (RTL correct for Arabic)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              LTR للأرقام والمعرفات (LTR for numbers/IDs)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              التجاوب مع الشاشات (Responsive on mobile)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default TypographyQA;
