import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

const CarRentalPrivacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600 text-white">
              <Shield className="w-4 h-4 mr-2" />
              سياسة الخصوصية
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              سياسة الخصوصية وحماية البيانات
            </h1>
            <p className="text-lg text-slate-600">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
            </p>
          </div>

          <div className="space-y-8">
            {/* جمع البيانات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-blue-600" />
                  البيانات التي نجمعها
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">1. البيانات الشخصية</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>الاسم الكامل ومعلومات الهوية</li>
                  <li>رقم الهاتف والبريد الإلكتروني</li>
                  <li>العنوان ومعلومات الإقامة</li>
                  <li>معلومات رخصة القيادة</li>
                  <li>بيانات البطاقة الائتمانية</li>
                </ul>

                <h3 className="font-semibold text-lg pt-4">2. بيانات الاستخدام</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>تفاصيل الحجوزات والرحلات</li>
                  <li>تفضيلات الخدمة</li>
                  <li>سجل التفاعل مع الموقع</li>
                </ul>
              </CardContent>
            </Card>

            {/* استخدام البيانات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                  كيف نستخدم بياناتك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>تنفيذ وإدارة عقود الإيجار</li>
                  <li>تقديم خدمة العملاء والدعم الفني</li>
                  <li>تحسين خدماتنا وتجربة المستخدم</li>
                  <li>إرسال إشعارات مهمة متعلقة بالحجز</li>
                  <li>الامتثال للمتطلبات القانونية</li>
                  <li>منع الاحتيال وضمان الأمان</li>
                </ul>
              </CardContent>
            </Card>

            {/* حماية البيانات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-red-600" />
                  حماية بياناتك
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">التشفير والأمان</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>تشفير SSL/TLS لجميع البيانات المنقولة</li>
                  <li>تشفير البيانات المخزنة في قواعد البيانات</li>
                  <li>أنظمة حماية متقدمة ضد الاختراق</li>
                  <li>مراقبة أمنية على مدار الساعة</li>
                  <li>تحديث دوري لأنظمة الأمان</li>
                </ul>

                <h3 className="font-semibold text-lg pt-4">الوصول المحدود</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>وصول محدود للموظفين المخولين فقط</li>
                  <li>تسجيل جميع عمليات الوصول للبيانات</li>
                  <li>التدريب المستمر للموظفين على أمن البيانات</li>
                </ul>
              </CardContent>
            </Card>

            {/* مشاركة البيانات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-orange-600" />
                  مشاركة البيانات مع الطرف الثالث
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    نحن لا نبيع بياناتك الشخصية أبداً
                  </h4>
                  <p className="text-orange-700">
                    بياناتك محمية ولن نشاركها إلا في الحالات المحددة أدناه
                  </p>
                </div>

                <h3 className="font-semibold text-lg">الحالات المسموحة للمشاركة:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>مع شركات التأمين لمعالجة المطالبات</li>
                  <li>مع السلطات الحكومية عند الطلب القانوني</li>
                  <li>مع مقدمي الخدمات التقنية (مع اتفاقيات سرية)</li>
                  <li>في حالة بيع أو نقل ملكية الشركة</li>
                </ul>
              </CardContent>
            </Card>

            {/* حقوق المستخدم */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                  حقوقك في البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">حقوقك تشمل:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>الحق في الوصول إلى بياناتك الشخصية</li>
                  <li>الحق في تصحيح البيانات غير الصحيحة</li>
                  <li>الحق في طلب حذف بياناتك</li>
                  <li>الحق في نقل بياناتك</li>
                  <li>الحق في الاعتراض على معالجة البيانات</li>
                  <li>الحق في سحب الموافقة</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-green-800 mb-2">
                    كيفية ممارسة حقوقك
                  </h4>
                  <p className="text-green-700 mb-3">
                    للممارسة أي من حقوقك، يرجى التواصل معنا عبر:
                  </p>
                  <div className="space-y-2">
                    <p className="text-green-700">📧 البريد الإلكتروني: privacy@carrentpro.sa</p>
                    <p className="text-green-700">📞 الهاتف: +966 11 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ملفات تعريف الارتباط */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-indigo-600" />
                  ملفات تعريف الارتباط (Cookies)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا:
                </p>
                
                <h3 className="font-semibold text-lg">أنواع ملفات تعريف الارتباط:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li><strong>الضرورية:</strong> مطلوبة لعمل الموقع الأساسي</li>
                  <li><strong>الوظيفية:</strong> لحفظ تفضيلاتك</li>
                  <li><strong>التحليلية:</strong> لفهم كيفية استخدام الموقع</li>
                  <li><strong>التسويقية:</strong> لعرض إعلانات مناسبة (بموافقتك)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* آخر تحديث */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">آخر تحديث</h3>
              <p className="text-slate-600 mb-4">
                تم تحديث سياسة الخصوصية في: 1 يناير 2024
              </p>
              <p className="text-sm text-slate-500">
                سنقوم بإشعارك بأي تغييرات جوهرية في سياسة الخصوصية
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarRentalPrivacy;