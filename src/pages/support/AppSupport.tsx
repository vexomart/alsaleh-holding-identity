import { useState } from "react";
import Footer from "@/components/Footer";
import { useRTL } from "@/components/RTLProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Smartphone, Clock, Users, TrendingUp, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AppSupport = () => {
  const { isRTL, getTextAlign } = useRTL();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    appType: "",
    platform: "",
    problemType: "",
    urgency: "",
    issueDescription: "",
    errorSteps: "",
    deviceInfo: "",
    appVersion: "",
    affectedFeatures: [] as string[],
    userCount: "",
    businessImpact: "",
    screenshotAvailable: false,
    logFilesAvailable: false
  });

  const appTypes = [
    { value: "mobile", label: "تطبيق موبايل" },
    { value: "web", label: "تطبيق ويب" },
    { value: "desktop", label: "تطبيق سطح المكتب" },
    { value: "hybrid", label: "تطبيق هجين" },
    { value: "api", label: "واجهة برمجية (API)" },
    { value: "other", label: "أخرى" }
  ];

  const platforms = [
    { value: "ios", label: "iOS" },
    { value: "android", label: "Android" },
    { value: "windows", label: "Windows" },
    { value: "macos", label: "macOS" },
    { value: "linux", label: "Linux" },
    { value: "browser", label: "متصفح ويب" },
    { value: "multiple", label: "منصات متعددة" }
  ];

  const problemTypes = [
    { value: "crash", label: "تعطل التطبيق" },
    { value: "performance", label: "بطء في الأداء" },
    { value: "login", label: "مشاكل تسجيل الدخول" },
    { value: "sync", label: "مشاكل التزامن" },
    { value: "feature", label: "ميزة لا تعمل" },
    { value: "ui", label: "مشاكل واجهة المستخدم" },
    { value: "notification", label: "مشاكل الإشعارات" },
    { value: "update", label: "مشاكل التحديث" },
    { value: "integration", label: "مشاكل التكامل" },
    { value: "security", label: "مشاكل أمنية" }
  ];

  const urgencyLevels = [
    { value: "critical", label: "حرج", description: "التطبيق متوقف تماماً", color: "text-red-600" },
    { value: "high", label: "عالي", description: "يؤثر على المستخدمين الرئيسيين", color: "text-orange-600" },
    { value: "medium", label: "متوسط", description: "مشكلة محدودة التأثير", color: "text-blue-600" },
    { value: "low", label: "منخفض", description: "طلب تحسين أو استفسار", color: "text-green-600" }
  ];

  const featuresOptions = [
    "تسجيل الدخول",
    "الملف الشخصي",
    "الإشعارات",
    "المراسلة",
    "المدفوعات",
    "التقارير",
    "التحميل",
    "المشاركة",
    "البحث",
    "الإعدادات"
  ];

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      affectedFeatures: checked 
        ? [...prev.affectedFeatures, feature]
        : prev.affectedFeatures.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('complaint-handler', {
        body: {
          ...formData,
          category: "application",
          title: `دعم التطبيقات - ${problemTypes.find(p => p.value === formData.problemType)?.label}`,
          description: `نوع التطبيق: ${appTypes.find(a => a.value === formData.appType)?.label}
المنصة: ${platforms.find(p => p.value === formData.platform)?.label}
نوع المشكلة: ${problemTypes.find(p => p.value === formData.problemType)?.label}
مستوى الطوارئ: ${urgencyLevels.find(u => u.value === formData.urgency)?.label}
وصف المشكلة: ${formData.issueDescription}
خطوات إعادة المشكلة: ${formData.errorSteps || 'غير محدد'}
معلومات الجهاز: ${formData.deviceInfo}
إصدار التطبيق: ${formData.appVersion}
الميزات المتأثرة: ${formData.affectedFeatures.join(', ') || 'غير محدد'}
عدد المستخدمين المتأثرين: ${formData.userCount}
التأثير على العمل: ${formData.businessImpact}
لقطات شاشة متوفرة: ${formData.screenshotAvailable ? 'نعم' : 'لا'}
ملفات السجل متوفرة: ${formData.logFilesAvailable ? 'نعم' : 'لا'}`,
          priority: formData.urgency === 'critical' ? 'high' : formData.urgency === 'high' ? 'high' : formData.urgency === 'medium' ? 'medium' : 'low'
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب الدعم بنجاح! سيتم التواصل معك قريباً.");
      
      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        company: "",
        appType: "",
        platform: "",
        problemType: "",
        urgency: "",
        issueDescription: "",
        errorSteps: "",
        deviceInfo: "",
        appVersion: "",
        affectedFeatures: [],
        userCount: "",
        businessImpact: "",
        screenshotAvailable: false,
        logFilesAvailable: false
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Smartphone className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-medium">دعم التطبيقات</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                دعم التطبيقات المتخصص
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                حلول سريعة لجميع مشاكل التطبيقات مع فريق دعم متخصص
              </p>
            </div>
          </div>
        </section>

        {/* Service Info */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">وقت الاستجابة</h3>
                  <p className="text-green-600 font-bold text-2xl">30 دقيقة</p>
                  <p className="text-sm text-gray-600 mt-2">للمشاكل العادية</p>
                </CardContent>
              </Card>

              <Card className="text-center border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">المستخدمون</h3>
                  <p className="text-emerald-600 font-bold text-2xl">24/5</p>
                  <p className="text-sm text-gray-600 mt-2">دعم متاح</p>
                </CardContent>
              </Card>

              <Card className="text-center border-teal-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">معدل الحل</h3>
                  <p className="text-teal-600 font-bold text-2xl">98.5%</p>
                  <p className="text-sm text-gray-600 mt-2">من المشاكل</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Form */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center">
                    طلب دعم التطبيقات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        معلومات العميل
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="customerName">الاسم الكامل *</Label>
                          <Input
                            id="customerName"
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">اسم الشركة</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerEmail">البريد الإلكتروني *</Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            required
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                          <Input
                            id="customerPhone"
                            required
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* App Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        معلومات التطبيق
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="appType">نوع التطبيق *</Label>
                          <Select value={formData.appType} onValueChange={(value) => setFormData({...formData, appType: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="اختر نوع التطبيق" />
                            </SelectTrigger>
                            <SelectContent>
                              {appTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="platform">المنصة *</Label>
                          <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="اختر المنصة" />
                            </SelectTrigger>
                            <SelectContent>
                              {platforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="appVersion">إصدار التطبيق</Label>
                          <Input
                            id="appVersion"
                            placeholder="مثال: 2.1.5"
                            value={formData.appVersion}
                            onChange={(e) => setFormData({...formData, appVersion: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="deviceInfo">معلومات الجهاز</Label>
                          <Input
                            id="deviceInfo"
                            placeholder="مثال: iPhone 14 Pro, iOS 17.1"
                            value={formData.deviceInfo}
                            onChange={(e) => setFormData({...formData, deviceInfo: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Problem Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        تفاصيل المشكلة
                      </h3>
                      
                      <div>
                        <Label htmlFor="problemType">نوع المشكلة *</Label>
                        <Select value={formData.problemType} onValueChange={(value) => setFormData({...formData, problemType: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="اختر نوع المشكلة" />
                          </SelectTrigger>
                          <SelectContent>
                            {problemTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>مستوى الطوارئ *</Label>
                        <RadioGroup 
                          value={formData.urgency} 
                          onValueChange={(value) => setFormData({...formData, urgency: value})}
                          className="mt-3 space-y-3"
                        >
                          {urgencyLevels.map((level) => (
                            <div key={level.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                              <RadioGroupItem value={level.value} id={level.value} />
                              <div className="flex-1 mr-3">
                                <Label htmlFor={level.value} className={`font-bold ${level.color} cursor-pointer`}>
                                  {level.label}
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                              </div>
                              {level.value === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                              {level.value === 'high' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                              {level.value === 'medium' && <Info className="w-5 h-5 text-blue-500" />}
                              {level.value === 'low' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="issueDescription">وصف المشكلة بالتفصيل *</Label>
                        <Textarea
                          id="issueDescription"
                          required
                          placeholder="اشرح المشكلة بالتفصيل، متى تحدث، ما الذي تحاول فعله..."
                          value={formData.issueDescription}
                          onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="errorSteps">خطوات إعادة المشكلة</Label>
                        <Textarea
                          id="errorSteps"
                          placeholder="1. افتح التطبيق&#10;2. اضغط على...&#10;3. النتيجة المتوقعة مقابل ما يحدث فعلاً"
                          value={formData.errorSteps}
                          onChange={(e) => setFormData({...formData, errorSteps: e.target.value})}
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Affected Features */}
                    <div className="space-y-4">
                      <Label>الميزات المتأثرة</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {featuresOptions.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                            <Checkbox
                              id={feature}
                              checked={formData.affectedFeatures.includes(feature)}
                              onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                            />
                            <Label htmlFor={feature} className="cursor-pointer mr-2">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        تقييم التأثير
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="userCount">عدد المستخدمين المتأثرين</Label>
                          <Input
                            id="userCount"
                            placeholder="مثال: 100 مستخدم أو جميع المستخدمين"
                            value={formData.userCount}
                            onChange={(e) => setFormData({...formData, userCount: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessImpact">التأثير على العمل</Label>
                          <Input
                            id="businessImpact"
                            placeholder="مثال: لا يمكن معالجة الطلبات"
                            value={formData.businessImpact}
                            onChange={(e) => setFormData({...formData, businessImpact: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        موارد إضافية
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="screenshotAvailable"
                            checked={formData.screenshotAvailable}
                            onCheckedChange={(checked) => setFormData({...formData, screenshotAvailable: checked as boolean})}
                          />
                          <Label htmlFor="screenshotAvailable" className="cursor-pointer mr-2">
                            لديّ لقطات شاشة للمشكلة
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="logFilesAvailable"
                            checked={formData.logFilesAvailable}
                            onCheckedChange={(checked) => setFormData({...formData, logFilesAvailable: checked as boolean})}
                          />
                          <Label htmlFor="logFilesAvailable" className="cursor-pointer mr-2">
                            لديّ ملفات سجل الأخطاء
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "جاري الإرسال..." : "إرسال طلب الدعم"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AppSupport;