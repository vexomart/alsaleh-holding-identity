import { useState } from "react";
import Navigation from "@/components/Navigation";
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
import { Monitor, Clock, Zap, Shield, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TechSystemsSupport = () => {
  const { isRTL, getTextAlign } = useRTL();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    systemType: "",
    environment: "",
    problemType: "",
    urgency: "",
    issueDescription: "",
    errorDetails: "",
    systemSpecs: "",
    softwareVersion: "",
    affectedComponents: [] as string[],
    systemUptime: "",
    lastChanges: "",
    criticalBusiness: false,
    remoteSupport: false
  });

  const systemTypes = [
    { value: "server", label: "خوادم (Servers)" },
    { value: "workstation", label: "محطات العمل" },
    { value: "network", label: "معدات الشبكة" },
    { value: "storage", label: "أنظمة التخزين" },
    { value: "virtualization", label: "الأنظمة الافتراضية" },
    { value: "cloud", label: "الحوسبة السحابية" },
    { value: "security", label: "أنظمة الأمان" },
    { value: "monitoring", label: "أنظمة المراقبة" },
    { value: "backup", label: "أنظمة النسخ الاحتياطي" },
    { value: "other", label: "أخرى" }
  ];

  const environments = [
    { value: "production", label: "بيئة الإنتاج" },
    { value: "staging", label: "بيئة الاختبار" },
    { value: "development", label: "بيئة التطوير" },
    { value: "testing", label: "بيئة الفحص" },
    { value: "disaster_recovery", label: "بيئة الاستعادة" }
  ];

  const problemTypes = [
    { value: "system_down", label: "توقف النظام" },
    { value: "performance", label: "مشاكل الأداء" },
    { value: "connectivity", label: "مشاكل الاتصال" },
    { value: "hardware", label: "مشاكل الأجهزة" },
    { value: "software", label: "مشاكل البرمجيات" },
    { value: "configuration", label: "مشاكل التكوين" },
    { value: "security", label: "مشاكل الأمان" },
    { value: "capacity", label: "مشاكل السعة" },
    { value: "integration", label: "مشاكل التكامل" },
    { value: "upgrade", label: "مشاكل التحديث" }
  ];

  const urgencyLevels = [
    { value: "critical", label: "حرج", description: "النظام متوقف - تأثير شامل", color: "text-red-600" },
    { value: "high", label: "عالي", description: "تأثير كبير على الإنتاجية", color: "text-orange-600" },
    { value: "medium", label: "متوسط", description: "تأثير محدود قابل للتأجيل", color: "text-blue-600" },
    { value: "low", label: "منخفض", description: "طلب تحسين أو صيانة", color: "text-green-600" }
  ];

  const componentsOptions = [
    "وحدة المعالجة المركزية",
    "الذاكرة العشوائية",
    "أقراص التخزين",
    "بطاقة الشبكة",
    "نظام التشغيل",
    "قواعد البيانات",
    "خدمات الويب",
    "جدار الحماية",
    "نظام النسخ الاحتياطي",
    "نظام المراقبة"
  ];

  const handleComponentChange = (component: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      affectedComponents: checked 
        ? [...prev.affectedComponents, component]
        : prev.affectedComponents.filter(c => c !== component)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('complaint-handler', {
        body: {
          ...formData,
          category: "technical_systems",
          title: `دعم الأنظمة التقنية - ${problemTypes.find(p => p.value === formData.problemType)?.label}`,
          description: `نوع النظام: ${systemTypes.find(s => s.value === formData.systemType)?.label}
البيئة: ${environments.find(e => e.value === formData.environment)?.label}
نوع المشكلة: ${problemTypes.find(p => p.value === formData.problemType)?.label}
مستوى الطوارئ: ${urgencyLevels.find(u => u.value === formData.urgency)?.label}
وصف المشكلة: ${formData.issueDescription}
تفاصيل الخطأ: ${formData.errorDetails || 'غير متوفر'}
مواصفات النظام: ${formData.systemSpecs}
إصدار البرنامج: ${formData.softwareVersion}
المكونات المتأثرة: ${formData.affectedComponents.join(', ') || 'غير محدد'}
وقت تشغيل النظام: ${formData.systemUptime}
آخر التغييرات: ${formData.lastChanges || 'لا توجد'}
نظام حرج للعمل: ${formData.criticalBusiness ? 'نعم' : 'لا'}
دعم عن بُعد: ${formData.remoteSupport ? 'نعم' : 'لا'}`,
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
        systemType: "",
        environment: "",
        problemType: "",
        urgency: "",
        issueDescription: "",
        errorDetails: "",
        systemSpecs: "",
        softwareVersion: "",
        affectedComponents: [],
        systemUptime: "",
        lastChanges: "",
        criticalBusiness: false,
        remoteSupport: false
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Monitor className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-medium">دعم الأنظمة التقنية</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                دعم الأنظمة التقنية المتقدم
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                خبراء تقنيون متخصصون في حل جميع مشاكل الأنظمة والبنية التحتية
              </p>
            </div>
          </div>
        </section>

        {/* Service Info */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">وقت الاستجابة</h3>
                  <p className="text-blue-600 font-bold text-2xl">15 دقيقة</p>
                  <p className="text-sm text-gray-600 mt-2">للمشاكل الحرجة</p>
                </CardContent>
              </Card>

              <Card className="text-center border-indigo-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">التوفر</h3>
                  <p className="text-indigo-600 font-bold text-2xl">24/7</p>
                  <p className="text-sm text-gray-600 mt-2">دعم مستمر</p>
                </CardContent>
              </Card>

              <Card className="text-center border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">الموثوقية</h3>
                  <p className="text-purple-600 font-bold text-2xl">99.8%</p>
                  <p className="text-sm text-gray-600 mt-2">وقت التشغيل</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Form */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center">
                    طلب دعم الأنظمة التقنية
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

                    {/* System Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        معلومات النظام
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="systemType">نوع النظام *</Label>
                          <Select value={formData.systemType} onValueChange={(value) => setFormData({...formData, systemType: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="اختر نوع النظام" />
                            </SelectTrigger>
                            <SelectContent>
                              {systemTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="environment">البيئة *</Label>
                          <Select value={formData.environment} onValueChange={(value) => setFormData({...formData, environment: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="اختر البيئة" />
                            </SelectTrigger>
                            <SelectContent>
                              {environments.map((env) => (
                                <SelectItem key={env.value} value={env.value}>
                                  {env.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="systemSpecs">مواصفات النظام</Label>
                          <Input
                            id="systemSpecs"
                            placeholder="مثال: Dell R740, 64GB RAM, Windows Server 2019"
                            value={formData.systemSpecs}
                            onChange={(e) => setFormData({...formData, systemSpecs: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="softwareVersion">إصدار البرنامج</Label>
                          <Input
                            id="softwareVersion"
                            placeholder="مثال: Windows Server 2019 Build 17763"
                            value={formData.softwareVersion}
                            onChange={(e) => setFormData({...formData, softwareVersion: e.target.value})}
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
                          placeholder="اشرح المشكلة، متى بدأت، ما الأعراض، التأثير على العمل..."
                          value={formData.issueDescription}
                          onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="errorDetails">تفاصيل الخطأ ورسائل السجل</Label>
                        <Textarea
                          id="errorDetails"
                          placeholder="انسخ رسائل الخطأ من ملفات السجل أو رسائل النظام"
                          value={formData.errorDetails}
                          onChange={(e) => setFormData({...formData, errorDetails: e.target.value})}
                          rows={3}
                          className="mt-2 font-mono text-sm"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="systemUptime">وقت تشغيل النظام</Label>
                          <Input
                            id="systemUptime"
                            placeholder="مثال: 45 يوم"
                            value={formData.systemUptime}
                            onChange={(e) => setFormData({...formData, systemUptime: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastChanges">آخر التغييرات على النظام</Label>
                          <Input
                            id="lastChanges"
                            placeholder="مثال: تحديث البرنامج أمس"
                            value={formData.lastChanges}
                            onChange={(e) => setFormData({...formData, lastChanges: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Affected Components */}
                    <div className="space-y-4">
                      <Label>المكونات المتأثرة</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {componentsOptions.map((component) => (
                          <div key={component} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                            <Checkbox
                              id={component}
                              checked={formData.affectedComponents.includes(component)}
                              onCheckedChange={(checked) => handleComponentChange(component, checked as boolean)}
                            />
                            <Label htmlFor={component} className="cursor-pointer mr-2">
                              {component}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Impact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        تأثير العمل والخيارات
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="criticalBusiness"
                            checked={formData.criticalBusiness}
                            onCheckedChange={(checked) => setFormData({...formData, criticalBusiness: checked as boolean})}
                          />
                          <Label htmlFor="criticalBusiness" className="cursor-pointer mr-2">
                            هذا النظام حرج لاستمرار العمل
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="remoteSupport"
                            checked={formData.remoteSupport}
                            onCheckedChange={(checked) => setFormData({...formData, remoteSupport: checked as boolean})}
                          />
                          <Label htmlFor="remoteSupport" className="cursor-pointer mr-2">
                            السماح بالوصول عن بُعد للدعم التقني
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-6"
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

export default TechSystemsSupport;