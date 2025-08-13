import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedPaymentPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '1499' // سعر ثابت للخدمة
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return true; // السعر ثابت دائماً
      case 2:
        return formData.name && formData.email;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setCompletedSteps([...completedSteps, step]);
      setStep(step + 1);
    } else {
      toast({
        title: "يرجى إكمال البيانات المطلوبة",
        description: "تأكد من ملء جميع الحقول",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePayment = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من جميع البيانات",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        currency: 'SAR',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || '966500000000',
        offer_title: 'خدمة تسويقية متقدمة',
        description: 'دفع خدمة تسويقية احترافية'
      };

      console.log("🚀 بدء عملية الدفع: paylink");
      console.log("📦 البيانات المرسلة:", payload);

      // استخدام Paylink كطريقة الدفع الافتراضية
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: payload
      });

      console.log("📋 النتيجة:", { data, error });

      if (error) {
        console.error("❌ خطأ في الاستدعاء:", error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      if (data?.success) {
        if (data?.payment_url || data?.url) {
          toast({
            title: "✅ تم إنشاء رابط الدفع",
            description: "سيتم توجيهك لصفحة الدفع الآمنة",
          });
          
          setTimeout(() => {
            window.location.href = data.payment_url || data.url;
          }, 1000);
        }
      } else {
        throw new Error(data?.message || 'فشل في إنشاء رابط الدفع');
      }
      
    } catch (error: any) {
      console.error("💥 خطأ:", error);
      toast({
        title: "خطأ في عملية الدفع",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      return <CheckCircle className="w-6 h-6 text-white" />;
    }
    return <span className="text-white font-bold">{stepNumber}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 flex items-center justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-6xl"
      >
        {/* Header with Progress */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1], 
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-primary text-sm font-medium">نظام دفع آمن ومحمي</span>
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-4">
            إتمام عملية الدفع
          </h1>
          <p className="text-muted-foreground">
            اتبع الخطوات البسيطة لإكمال عملية الدفع الآمنة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-500" />
                  خطوات الدفع
                </CardTitle>
                <CardDescription>
                  تتبع تقدمك في عملية الدفع الآمنة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { number: 1, title: "تأكيد الخدمة", desc: "خدمة التسويق الرقمي - ١٤٩٩ ريال" },
                  { number: 2, title: "البيانات الشخصية", desc: "أدخل بياناتك الأساسية" },
                  { number: 3, title: "تأكيد الدفع", desc: "راجع وأكد العملية" }
                ].map((stepItem) => (
                  <div
                    key={stepItem.number}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                      step === stepItem.number
                        ? 'bg-primary/10 border-2 border-primary/30'
                        : completedSteps.includes(stepItem.number)
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step === stepItem.number
                          ? 'bg-primary text-white scale-110'
                          : completedSteps.includes(stepItem.number)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {getStepIcon(stepItem.number)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{stepItem.title}</div>
                      <div className="text-sm text-muted-foreground">{stepItem.desc}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security Features */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ضمانات الأمان
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">تشفير SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">حماية بيانات PCI DSS</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">مراقبة 24/7</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Payment Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 relative">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/50">
                    الخطوة {step} من 3
                  </Badge>
                </div>
                <CardTitle className="text-2xl">
                  {step === 1 && "تأكيد الخدمة"}
                  {step === 2 && "البيانات الشخصية"}
                  {step === 3 && "تأكيد الدفع"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "خدمة التسويق الرقمي الاحترافية"}
                  {step === 2 && "أدخل بياناتك الشخصية"}
                  {step === 3 && "راجع البيانات وأكد الدفع"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Service Confirmation */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">خدمة التسويق الرقمي</h3>
                        <p className="text-muted-foreground">خدمة شاملة لبناء استراتيجية تسويقية متكاملة</p>
                      </div>

                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border border-primary/20">
                        <div className="text-center mb-6">
                          <div className="text-4xl font-bold text-primary mb-2">
                            ١٤٩٩ ريال
                          </div>
                          <p className="text-sm text-muted-foreground">سعر ثابت شامل ضريبة القيمة المضافة</p>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            ما تحصل عليه:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              "تحليل السوق والمنافسين",
                              "تحديد الجمهور المستهدف", 
                              "وضع الأهداف والاستراتيجيات",
                              "خطة المحتوى والحملات",
                              "جدولة زمنية للتنفيذ",
                              "مؤشرات الأداء KPIs"
                            ].map((feature, index) => (
                              <div 
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/50"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 text-center">
                            ⏱️ مدة التسليم: ٢-٣ أسابيع + ضمان المراجعة والتعديل
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Shield className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">البيانات الشخصية</h3>
                        <p className="text-muted-foreground">معلوماتك محمية بأعلى معايير الأمان</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">الاسم الكامل *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="أدخل اسمك الكامل"
                            className="h-12"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">البريد الإلكتروني *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                            className="h-12"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="966500000000"
                            className="h-12"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">تأكيد الدفع</h3>
                        <p className="text-muted-foreground">راجع بياناتك قبل إتمام العملية</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium">المبلغ:</span>
                          <span className="text-xl font-bold text-primary">{formData.amount} ريال</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium">الاسم:</span>
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium">البريد الإلكتروني:</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium">طريقة الدفع:</span>
                          <span>Paylink (فيزا • ماستركارد • مدى)</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ✨ بالضغط على "إتمام الدفع" سيتم توجيهك لصفحة الدفع الآمنة
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      السابق
                    </Button>
                  )}

                  <div className="flex-1" />

                  {step < 3 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(step)}
                      className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold min-w-[200px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          جاري المعالجة...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          إتمام الدفع الآمن
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Security Notice */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-8 bg-white/50 backdrop-blur-sm rounded-lg p-4"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            جميع المعاملات محمية بتشفير SSL وتحت إشراف البنك المركزي السعودي
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedPaymentPage;