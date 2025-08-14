import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AbayaHeader from "@/components/abaya-store/AbayaHeader";
import AbayaFooter from "@/components/abaya-store/AbayaFooter";
import { 
  RotateCcw, 
  Clock, 
  FileText, 
  CheckCircle,
  Package,
  Shield,
  Phone,
  AlertTriangle,
  Crown,
  ArrowRight
} from "lucide-react";

const ReturnProcedures = () => {
  const steps = [
    {
      number: "1",
      title: "تقديم طلب الإرجاع",
      description: "تواصلي معنا خلال 7 أيام من استلام الطلب",
      icon: FileText,
      color: "from-blue-500 to-cyan-600"
    },
    {
      number: "2", 
      title: "تأكيد الطلب",
      description: "سنراجع طلبك ونرسل لك تعليمات الإرجاع",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600"
    },
    {
      number: "3",
      title: "تحضير المنتج",
      description: "تأكدي من أن العباءة في حالتها الأصلية مع العلامات",
      icon: Package,
      color: "from-purple-500 to-pink-600"
    },
    {
      number: "4",
      title: "الشحن",
      description: "نرسل لك مندوب لاستلام المنتج مجاناً",
      icon: RotateCcw,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-orange-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-red-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-pink-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-orange-300/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-300/40 rounded-full animate-ping"></div>
      </div>

      <AbayaHeader />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              إجراءات الإرجاع
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            نجعل عملية الإرجاع سهلة وبسيطة لضمان راحتك ورضاك التام
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center border-0 bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">7 أيام</h3>
              <p className="text-gray-600">مدة الإرجاع المتاحة</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">مجاني</h3>
              <p className="text-gray-600">استلام من منزلك</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">ضمان</h3>
              <p className="text-gray-600">استرداد كامل للمبلغ</p>
            </CardContent>
          </Card>
        </div>

        {/* Step by Step Process */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-800 mb-8">
              خطوات الإرجاع البسيطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-8 w-16 h-1 bg-gradient-to-r from-gray-300 to-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Return Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 bg-gradient-to-br from-white to-green-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                شروط الإرجاع المقبول
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <p>العباءة في حالتها الأصلية غير مستعملة</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <p>وجود جميع العلامات والملصقات الأصلية</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <p>عدم وجود روائح عطور أو أضرار</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <p>الإرجاع خلال 7 أيام من تاريخ الاستلام</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <p>وجود فاتورة الشراء الأصلية</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-red-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                حالات عدم قبول الإرجاع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                <p>العبايات المخصصة أو المفصلة حسب الطلب</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                <p>المنتجات المستعملة أو التالفة</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                <p>إزالة العلامات أو الملصقات</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                <p>انتهاء مدة الـ 7 أيام</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                <p>عدم وجود إثبات الشراء</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refund Timeline */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
              <Crown className="w-8 h-8" />
              مدة الاسترداد
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <h4 className="text-xl font-bold mb-2">الفحص والموافقة</h4>
                <p className="text-lg font-semibold text-blue-200">1-2 يوم عمل</p>
                <p className="text-sm opacity-80 mt-2">بعد وصول المنتج إلينا</p>
              </div>
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <h4 className="text-xl font-bold mb-2">معالجة الاسترداد</h4>
                <p className="text-lg font-semibold text-green-200">3-5 أيام عمل</p>
                <p className="text-sm opacity-80 mt-2">حسب طريقة الدفع الأصلية</p>
              </div>
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <h4 className="text-xl font-bold mb-2">وصول المبلغ</h4>
                <p className="text-lg font-semibold text-purple-200">1-3 أيام عمل</p>
                <p className="text-sm opacity-80 mt-2">إلى حسابك البنكي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-0 bg-gradient-to-br from-rose-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Phone className="w-8 h-8" />
              <h3 className="text-2xl font-bold">تحتاجين مساعدة في الإرجاع؟</h3>
            </div>
            <p className="text-lg mb-6 opacity-90">
              فريق خدمة العملاء جاهز لمساعدتك في جميع إجراءات الإرجاع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button 
                asChild
                className="bg-white/20 hover:bg-white/30 transition-colors px-8 py-3 border-0"
              >
                <a 
                  href="https://wa.me/966500000000?text=أريد تقديم طلب إرجاع" 
                  className="flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  ابدئي طلب الإرجاع الآن
                </a>
              </Button>
              <p className="text-white/80">أو اتصل على: 966500000000+</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AbayaFooter />
    </div>
  );
};

export default ReturnProcedures;