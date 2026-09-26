import { useState } from "react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Clock, Shield, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DatabaseSupport = () => {
  const { isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    databaseType: "",
    problemType: "",
    urgency: "",
    issueDescription: "",
    errorMessage: "",
    backupStatus: "",
    affectedSystems: [] as string[],
    dataVolume: "",
    scheduledMaintenance: false,
    remoteAccess: false
  });

  const databaseTypes = [
    { value: "mysql", label: "MySQL" },
    { value: "postgresql", label: "PostgreSQL" },
    { value: "oracle", label: "Oracle Database" },
    { value: "sqlserver", label: "SQL Server" },
    { value: "mongodb", label: "MongoDB" },
    { value: "redis", label: "Redis" },
    { value: "other", label: "أخرى" }
  ];

  const problemTypes = [
    { value: "performance", label: "مشاكل الأداء" },
    { value: "connectivity", label: "مشاكل الاتصال" },
    { value: "corruption", label: "فساد البيانات" },
    { value: "backup", label: "مشاكل النسخ الاحتياطي" },
    { value: "recovery", label: "استعادة البيانات" },
    { value: "migration", label: "نقل قاعدة البيانات" },
    { value: "optimization", label: "تحسين الاستعلامات" },
    { value: "security", label: "مشاكل الأمان" },
    { value: "maintenance", label: "صيانة دورية" }
  ];

  const urgencyLevels = [
    { value: "critical", label: "حرج", description: "النظام متوقف تماماً", color: "text-red-600" },
    { value: "high", label: "عالي", description: "يؤثر على العمليات الرئيسية", color: "text-orange-600" },
    { value: "medium", label: "متوسط", description: "يمكن تأجيله لساعات قليلة", color: "text-blue-600" },
    { value: "low", label: "منخفض", description: "طلب تحسين أو استفسار", color: "text-green-600" }
  ];

  const systemsOptions = [
    "نظام إدارة المحتوى",
    "نظام إدارة العملاء",
    "نظام المحاسبة",
    "نظام المخزون",
    "نظام التقارير",
    "تطبيقات الويب",
    "تطبيقات الموبايل"
  ];

  const handleSystemChange = (system: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      affectedSystems: checked 
        ? [...prev.affectedSystems, system]
        : prev.affectedSystems.filter(s => s !== system)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('complaint-handler', {
        body: {
          ...formData,
          category: "database",
          title: `دعم قواعد البيانات - ${problemTypes.find(p => p.value === formData.problemType)?.label}`,
          description: `نوع قاعدة البيانات: ${databaseTypes.find(d => d.value === formData.databaseType)?.label}
نوع المشكلة: ${problemTypes.find(p => p.value === formData.problemType)?.label}
مستوى الطوارئ: ${urgencyLevels.find(u => u.value === formData.urgency)?.label}
وصف المشكلة: ${formData.issueDescription}
رسالة الخطأ: ${formData.errorMessage || 'لا توجد'}
حالة النسخ الاحتياطي: ${formData.backupStatus}
الأنظمة المتأثرة: ${formData.affectedSystems.join(', ') || 'غير محدد'}
حجم البيانات: ${formData.dataVolume}
صيانة مجدولة: ${formData.scheduledMaintenance ? 'نعم' : 'لا'}
وصول عن بُعد: ${formData.remoteAccess ? 'نعم' : 'لا'}`,
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
        databaseType: "",
        problemType: "",
        urgency: "",
        issueDescription: "",
        errorMessage: "",
        backupStatus: "",
        affectedSystems: [],
        dataVolume: "",
        scheduledMaintenance: false,
        remoteAccess: false
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Database className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-medium">دعم قواعد البيانات</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                دعم قواعد البيانات المتخصص
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                حلول متقدمة لجميع مشاكل قواعد البيانات مع فريق خبراء متخصص
              </p>
            </div>
          </div>
        </section>

        {/* Service Info */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">وقت الاستجابة</h3>
                  <p className="text-purple-600 font-bold text-2xl">1 ساعة</p>
                  <p className="text-sm text-gray-600 mt-2">للمشاكل العادية</p>
                </CardContent>
              </Card>

              <Card className="text-center border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">أمان البيانات</h3>
                  <p className="text-blue-600 font-bold text-2xl">100%</p>
                  <p className="text-sm text-gray-600 mt-2">حماية مضمونة</p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">معدل النجاح</h3>
                  <p className="text-green-600 font-bold text-2xl">99.9%</p>
                  <p className="text-sm text-gray-600 mt-2">حل المشاكل</p>
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
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center">
                    طلب دعم قواعد البيانات
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

                    {/* Database Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        معلومات قاعدة البيانات
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="databaseType">نوع قاعدة البيانات *</Label>
                          <Select value={formData.databaseType} onValueChange={(value) => setFormData({...formData, databaseType: value})}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="اختر نوع قاعدة البيانات" />
                            </SelectTrigger>
                            <SelectContent>
                              {databaseTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dataVolume">حجم البيانات</Label>
                          <Input
                            id="dataVolume"
                            placeholder="مثال: 100 GB"
                            value={formData.dataVolume}
                            onChange={(e) => setFormData({...formData, dataVolume: e.target.value})}
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
                          placeholder="اشرح المشكلة بالتفصيل، متى بدأت، ما الذي يحدث بالضبط..."
                          value={formData.issueDescription}
                          onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="errorMessage">رسالة الخطأ (إن وجدت)</Label>
                        <Textarea
                          id="errorMessage"
                          placeholder="انسخ رسالة الخطأ كما تظهر"
                          value={formData.errorMessage}
                          onChange={(e) => setFormData({...formData, errorMessage: e.target.value})}
                          rows={3}
                          className="mt-2 font-mono text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="backupStatus">حالة النسخ الاحتياطي</Label>
                        <Input
                          id="backupStatus"
                          placeholder="مثال: آخر نسخة احتياطية قبل 6 ساعات"
                          value={formData.backupStatus}
                          onChange={(e) => setFormData({...formData, backupStatus: e.target.value})}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Affected Systems */}
                    <div className="space-y-4">
                      <Label>الأنظمة المتأثرة</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {systemsOptions.map((system) => (
                          <div key={system} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                            <Checkbox
                              id={system}
                              checked={formData.affectedSystems.includes(system)}
                              onCheckedChange={(checked) => handleSystemChange(system, checked as boolean)}
                            />
                            <Label htmlFor={system} className="cursor-pointer mr-2">
                              {system}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                        خيارات إضافية
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="scheduledMaintenance"
                            checked={formData.scheduledMaintenance}
                            onCheckedChange={(checked) => setFormData({...formData, scheduledMaintenance: checked as boolean})}
                          />
                          <Label htmlFor="scheduledMaintenance" className="cursor-pointer mr-2">
                            أريد جدولة صيانة دورية
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="remoteAccess"
                            checked={formData.remoteAccess}
                            onCheckedChange={(checked) => setFormData({...formData, remoteAccess: checked as boolean})}
                          />
                          <Label htmlFor="remoteAccess" className="cursor-pointer mr-2">
                            السماح بالوصول عن بُعد لحل المشكلة
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-6"
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

export default DatabaseSupport;