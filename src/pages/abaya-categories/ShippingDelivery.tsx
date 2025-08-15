import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AbayaHeader from "@/components/abaya-store/AbayaHeader";
import AbayaFooter from "@/components/abaya-store/AbayaFooter";
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  CheckCircle,
  Phone,
  Crown,
  Sparkles
} from "lucide-react";

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-rose-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-pink-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-rose-300/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-ping"></div>
      </div>

      <AbayaHeader />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              الشحن والتوصيل
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            نقدم لك خدمة شحن موثوقة وسريعة لتصل عباءة أحلامك إليك في أسرع وقت ممكن
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-600">التوصيل العادي</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                3-5 أيام عمل
              </Badge>
              <p className="text-gray-600">توصيل مجاني للطلبات أكثر من 200 ريال</p>
              <p className="text-2xl font-bold text-blue-600">25 ريال</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• تغطية جميع مناطق المملكة</li>
                <li>• إمكانية تتبع الشحنة</li>
                <li>• ضمان وصول آمن</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600">التوصيل السريع</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                1-2 أيام عمل
              </Badge>
              <p className="text-gray-600">للطلبات العاجلة والمناسبات المهمة</p>
              <p className="text-2xl font-bold text-green-600">50 ريال</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• توصيل خلال 24-48 ساعة</li>
                <li>• أولوية في المعالجة</li>
                <li>• إشعارات فورية</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-600">التوصيل الملكي</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                نفس اليوم
              </Badge>
              <p className="text-gray-600">خدمة حصرية للمناطق المختارة</p>
              <p className="text-2xl font-bold text-purple-600">100 ريال</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• توصيل خلال ساعات</li>
                <li>• تعبئة فاخرة مجانية</li>
                <li>• رسالة شخصية</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Areas */}
        <Card className="mb-16 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-800 flex items-center justify-center gap-3">
              <MapPin className="w-8 h-8 text-rose-500" />
              مناطق التغطية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
                <h4 className="font-bold text-rose-600 mb-2">المنطقة الوسطى</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>الرياض</li>
                  <li>القصيم</li>
                  <li>حائل</li>
                </ul>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <h4 className="font-bold text-blue-600 mb-2">المنطقة الشرقية</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>الدمام</li>
                  <li>الخبر</li>
                  <li>الأحساء</li>
                </ul>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <h4 className="font-bold text-green-600 mb-2">المنطقة الغربية</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>جدة</li>
                  <li>مكة المكرمة</li>
                  <li>المدينة المنورة</li>
                </ul>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <h4 className="font-bold text-purple-600 mb-2">باقي المناطق</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>الجنوب</li>
                  <li>الشمال</li>
                  <li>أبها وجازان</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packaging & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 bg-gradient-to-br from-white to-rose-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-rose-600 flex items-center gap-3">
                <Package className="w-6 h-6" />
                التعبئة والتغليف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">تعبئة فاخرة</p>
                  <p className="text-sm text-gray-600">صندوق أنيق مع شريط ساتان</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">حماية كاملة</p>
                  <p className="text-sm text-gray-600">مواد تغليف عالية الجودة</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">بطاقة شكر</p>
                  <p className="text-sm text-gray-600">رسالة شخصية مع كل طلب</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                تتبع الشحنة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">رقم تتبع فوري</p>
                  <p className="text-sm text-gray-600">يرسل عبر الواتساب والإيميل</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">تحديثات مستمرة</p>
                  <p className="text-sm text-gray-600">إشعارات بكل مرحلة شحن</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium">خدمة عملاء</p>
                  <p className="text-sm text-gray-600">متابعة شخصية لكل شحنة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Phone className="w-8 h-8" />
              <h3 className="text-2xl font-bold">هل تحتاجين مساعدة؟</h3>
            </div>
            <p className="text-lg mb-6 opacity-90">
              فريق خدمة العملاء متواجد لمساعدتك في أي استفسار حول الشحن والتوصيل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a 
                href="https://wa.me/966500000000" 
                className="bg-white/20 hover:bg-white/30 transition-colors px-8 py-3 rounded-full font-medium flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                تواصل معنا عبر الواتساب
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

export default ShippingDelivery;