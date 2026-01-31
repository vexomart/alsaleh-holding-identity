import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { Shield, FileText, AlertTriangle, Clock, CreditCard } from "lucide-react";

const CarRentalTerms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              الشروط والأحكام
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              شروط وأحكام تأجير السيارات
            </h1>
            <p className="text-lg text-slate-600">
              يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا
            </p>
          </div>

          <div className="space-y-8">
            {/* الشروط العامة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  الشروط العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">1. الأهلية للاستئجار</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>يجب أن يكون المستأجر بعمر 21 سنة أو أكثر</li>
                  <li>رخصة قيادة سارية المفعول لمدة سنتين على الأقل</li>
                  <li>بطاقة هوية وطنية أو جواز سفر ساري المفعول</li>
                  <li>بطاقة ائتمانية باسم المستأجر</li>
                </ul>

                <h3 className="font-semibold text-lg pt-4">2. مدة الإيجار</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>الحد الأدنى للإيجار 24 ساعة</li>
                  <li>يتم احتساب اليوم الكامل للتأخير أكثر من ساعتين</li>
                  <li>إمكانية تمديد الإيجار حسب التوفر</li>
                </ul>
              </CardContent>
            </Card>

            {/* الدفع والتأمين */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  الدفع والتأمين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">1. طرق الدفع</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>قبول جميع البطاقات الائتمانية الرئيسية</li>
                  <li>دفع نقدي للعملاء المحليين فقط</li>
                  <li>تجميد مبلغ تأميني على البطاقة الائتمانية</li>
                </ul>

                <h3 className="font-semibold text-lg pt-4">2. التأمين</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>تأمين شامل على جميع السيارات</li>
                  <li>تغطية الأضرار الجسيمة والسرقة</li>
                  <li>خدمة الطوارئ 24/7</li>
                </ul>
              </CardContent>
            </Card>

            {/* المسؤوليات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  مسؤوليات المستأجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>قيادة السيارة بحذر وطبقاً لقوانين المرور</li>
                  <li>عدم السماح لأشخاص غير مؤهلين بالقيادة</li>
                  <li>الإبلاغ الفوري عن أي حوادث أو أعطال</li>
                  <li>إرجاع السيارة بنفس حالة الاستلام</li>
                  <li>دفع جميع المخالفات المرورية</li>
                  <li>عدم استخدام السيارة لأغراض غير قانونية</li>
                </ul>
              </CardContent>
            </Card>

            {/* سياسة الإلغاء */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  سياسة الإلغاء والاسترداد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">1. الإلغاء المجاني</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>إلغاء مجاني حتى 24 ساعة قبل موعد الاستلام</li>
                  <li>استرداد كامل للمبلغ المدفوع</li>
                </ul>

                <h3 className="font-semibold text-lg pt-4">2. الإلغاء المتأخر</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>رسوم إلغاء 50% للإلغاء خلال 24 ساعة</li>
                  <li>عدم استرداد في حالة عدم الحضور</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* معلومات الاتصال */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">هل لديك أسئلة؟</h3>
              <p className="text-slate-600 mb-4">
                فريق خدمة العملاء جاهز للمساعدة
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="tel:0555812567" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  اتصل بنا: 0555812567
                </a>
                <a 
                  href="mailto:info@ash-holding.sa" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  info@ash-holding.sa
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarRentalTerms;