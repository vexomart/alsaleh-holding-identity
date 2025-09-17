import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MessageSquare, Send, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Complaints = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.title || !formData.description) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('complaint-handler', {
        body: {
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          category: formData.category,
          priority: formData.priority || 'medium',
          title: formData.title,
          description: formData.description,
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الشكوى بنجاح! ✅",
        description: `رقم الشكوى: ${data.ticketNumber}. سنتواصل معك قريباً.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        priority: "",
        title: "",
        description: "",
      });

    } catch (error) {
      console.error("Complaint submission error:", error);
      toast({
        title: "خطأ في إرسال الشكوى",
        description: "حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "technical", label: "مشكلة تقنية" },
    { value: "billing", label: "مسائل مالية" },
    { value: "project", label: "مشاريع" },
    { value: "general", label: "عام" }
  ];

  const priorities = [
    { value: "low", label: "منخفضة" },
    { value: "medium", label: "متوسطة" },
    { value: "high", label: "عالية" }
  ];

  return (
    <>
      <Helmet>
        <title>رفع طلب أو شكوى - ASH HOLDING</title>
        <meta name="description" content="قدم شكوى أو طلب للحصول على الدعم الفني من فريق ASH HOLDING المتخصص" />
        <meta name="keywords" content="شكوى, طلب دعم, خدمة العملاء, ASH HOLDING" />
      </Helmet>

      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-500/10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                رفع طلب أو شكوى
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                نحن هنا لمساعدتك. قدم شكواك أو طلبك وسنتواصل معك في أقرب وقت ممكن
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Form */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <Card className="shadow-xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl flex items-center justify-center gap-3">
                        <FileText className="w-6 h-6 text-red-600" />
                        نموذج الشكاوي والطلبات
                      </CardTitle>
                      <CardDescription>
                        يرجى ملء جميع البيانات المطلوبة بدقة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">الاسم الكامل *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="أدخل اسمك الكامل"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="example@domain.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="05xxxxxxxx"
                          />
                        </div>

                        {/* Category and Priority */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">فئة الشكوى *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر فئة الشكوى" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">الأولوية</Label>
                            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الأولوية" />
                              </SelectTrigger>
                              <SelectContent>
                                {priorities.map((priority) => (
                                  <SelectItem key={priority.value} value={priority.value}>
                                    {priority.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                          <Label htmlFor="title">عنوان الشكوى *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="اكتب عنوان مختصر للشكوى"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label htmlFor="description">تفاصيل الشكوى *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="اشرح شكواك بالتفصيل..."
                            rows={6}
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              إرسال الشكوى
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Info Sidebar */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-6"
                >
                  
                  {/* Support Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        ماذا يحدث بعد الإرسال؟
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium">تأكيد فوري</p>
                          <p className="text-sm text-gray-600">ستحصل على رقم تذكرة فوراً</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium">رد تلقائي</p>
                          <p className="text-sm text-gray-600">رسالة تأكيد على بريدك الإلكتروني</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-medium">متابعة من الفريق</p>
                          <p className="text-sm text-gray-600">سنتواصل معك خلال 24 ساعة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Time */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        أوقات الاستجابة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-red-600 font-medium">عالية الأولوية</span>
                        <span className="text-sm">خلال ساعة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-600 font-medium">متوسطة الأولوية</span>
                        <span className="text-sm">خلال 4 ساعات</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600 font-medium">منخفضة الأولوية</span>
                        <span className="text-sm">خلال 24 ساعة</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        حالات الطوارئ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-red-600 mb-3">
                        للحالات العاجلة، تواصل معنا مباشرة:
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">📞 0555812567</p>
                        <p className="text-sm font-medium">📧 info@alialshehriholding.com</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Complaints;