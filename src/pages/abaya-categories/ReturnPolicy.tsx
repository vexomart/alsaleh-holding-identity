import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AbayaHeader from "@/components/abaya-store/AbayaHeader";
import AbayaFooter from "@/components/abaya-store/AbayaFooter";
import { 
  Shield, 
  Clock, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Package,
  Phone,
  Heart,
  Crown
} from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-pink-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-rose-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-300/40 rounded-full animate-ping"></div>
      </div>

      <AbayaHeader />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              سياسة الإرجاع
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            التزامنا برضاك التام - سياسة إرجاع عادلة وشفافة لحماية حقوقك
          </p>
        </div>

        {/* Policy Overview */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-600 flex items-center justify-center gap-3">
              <Heart className="w-8 h-8" />
              التزامنا معك
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              في متجر عبايتي، نؤمن بأن رضاك هو أولويتنا الأولى. لذلك وضعنا سياسة إرجاع مرنة وعادلة 
              تضمن حقوقك كعميلة مميزة. نهدف إلى جعل تجربة التسوق معنا آمنة ومريحة، 
              مع ضمان جودة المنتجات وسهولة الإرجاع عند الحاجة.
            </p>
          </CardContent>
        </Card>

        {/* Main Policy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* General Terms */}
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                الشروط العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-700 mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">مدة الإرجاع</h4>
                    <p className="text-gray-600 text-sm">يحق لك إرجاع أي منتج خلال 7 أيام من تاريخ الاستلام</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-700 mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">حالة المنتج</h4>
                    <p className="text-gray-600 text-sm">يجب أن يكون المنتج في حالته الأصلية مع جميع العلامات</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-700 mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">إثبات الشراء</h4>
                    <p className="text-gray-600 text-sm">وجود فاتورة الشراء أو رقم الطلب مطلوب</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-700 mt-1">4</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">تكلفة الإرجاع</h4>
                    <p className="text-gray-600 text-sm">نتحمل تكلفة استلام المنتج من منزلك مجاناً</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Returns */}
          <Card className="border-0 bg-gradient-to-br from-white to-green-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                الإرجاع المقبول
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">عدم المقاس المناسب</h4>
                  <p className="text-gray-600 text-sm">إذا لم يكن المقاس مناسباً لك</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">عيب في التصنيع</h4>
                  <p className="text-gray-600 text-sm">وجود عيوب أو مشاكل في جودة التصنيع</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">اختلاف الوصف</h4>
                  <p className="text-gray-600 text-sm">عدم مطابقة المنتج للوصف المعروض</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">تلف أثناء الشحن</h4>
                  <p className="text-gray-600 text-sm">تضرر المنتج أثناء عملية الشحن</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">عدم الرضا</h4>
                  <p className="text-gray-600 text-sm">عدم الرضا عن المنتج لأي سبب آخر</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Non-Returnable Items */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-red-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              المنتجات غير القابلة للإرجاع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">العبايات المخصصة</h4>
                    <p className="text-gray-600 text-sm">التي تم تفصيلها حسب مقاسات خاصة</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">المنتجات المستعملة</h4>
                    <p className="text-gray-600 text-sm">التي تظهر عليها علامات الاستخدام</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">إزالة العلامات</h4>
                    <p className="text-gray-600 text-sm">المنتجات التي تم إزالة علاماتها</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">انتهاء المدة</h4>
                    <p className="text-gray-600 text-sm">بعد مرور 7 أيام من الاستلام</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">وجود روائح</h4>
                    <p className="text-gray-600 text-sm">المنتجات التي تحتوي على روائح عطور</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">التلف المتعمد</h4>
                    <p className="text-gray-600 text-sm">الأضرار الناتجة عن سوء الاستخدام</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-yellow-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-600 flex items-center gap-3">
              <CreditCard className="w-6 h-6" />
              عملية الاسترداد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-yellow-600 mb-2">استلام المنتج</h3>
                <p className="text-gray-600 text-sm">نستلم المنتج ونقوم بفحصه خلال 1-2 يوم عمل</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-600 mb-2">الموافقة</h3>
                <p className="text-gray-600 text-sm">نخطرك بالموافقة ونبدأ عملية الاسترداد</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">الاسترداد</h3>
                <p className="text-gray-600 text-sm">يتم الاسترداد خلال 3-7 أيام عمل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Phone className="w-8 h-8" />
              <h3 className="text-2xl font-bold">أسئلة حول سياسة الإرجاع؟</h3>
            </div>
            <p className="text-lg mb-6 opacity-90">
              فريق خدمة العملاء متواجد للإجابة على جميع استفساراتك حول سياسة الإرجاع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a 
                href="https://wa.me/966500000000?text=عندي استفسار حول سياسة الإرجاع" 
                className="bg-white/20 hover:bg-white/30 transition-colors px-8 py-3 rounded-full font-medium flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                تواصل معنا الآن
              </a>
              <p className="text-white/80">أو اتصل على: 966500000000+</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AbayaFooter />
    </div>
  );
};

export default ReturnPolicy;