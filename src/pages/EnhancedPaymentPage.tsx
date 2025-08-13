import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Smartphone, Banknote, Shield, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedPaymentPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paylink');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '1499'
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

  const paymentMethods = [
    {
      id: 'paylink',
      name: 'Paylink',
      description: 'فيزا • ماستركارد • مدى',
      icon: CreditCard,
      color: 'from-blue-500 to-indigo-600',
      badge: 'الأسرع'
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      description: 'دفع فوري وآمن',
      icon: Smartphone,
      color: 'from-orange-500 to-red-500',
      badge: 'سهل'
    },
    {
      id: 'tamara',
      name: 'Tamara',
      description: 'اشتري الآن وادفع لاحقاً',
      icon: Banknote,
      color: 'from-green-500 to-emerald-600',
      badge: 'مرونة'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.amount && parseFloat(formData.amount) > 0;
      case 2:
        return formData.name && formData.email;
      case 3:
        return paymentMethod;
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من جميع البيانات",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'stc_pay' && !formData.phone) {
      toast({
        title: "خطأ في البيانات", 
        description: "رقم الجوال مطلوب للدفع عبر STC Pay",
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

      console.log("🚀 بدء عملية الدفع:", paymentMethod);
      console.log("📦 البيانات المرسلة:", payload);

      let functionName = '';
      switch (paymentMethod) {
        case 'paylink':
          functionName = 'paylink-payment';
          break;
        case 'stc_pay':
          functionName = 'stc-pay';
          break;
        case 'tamara':
          functionName = 'tamara-payment';
          break;
      }
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      console.log("📋 النتيجة:", { data, error });

      if (error) {
        console.error("❌ خطأ في الاستدعاء:", error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      if (data?.success) {
        if (paymentMethod === 'stc_pay') {
          showSTCPayInstructions(data);
        } else if (data?.payment_url || data?.url) {
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

  const showSTCPayInstructions = (data: any) => {
    toast({
      title: "تم إنشاء طلب الدفع",
      description: "يرجى اتباع التعليمات لإتمام الدفع عبر STC Pay",
      duration: 5000,
    });
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
                  { number: 1, title: "تحديد المبلغ", desc: "حدد المبلغ المطلوب دفعه" },
                  { number: 2, title: "البيانات الشخصية", desc: "أدخل بياناتك الأساسية" },
                  { number: 3, title: "طريقة الدفع", desc: "اختر الطريقة المناسبة" },
                  { number: 4, title: "تأكيد الدفع", desc: "راجع وأكد العملية" }
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
          </motion.div>

          {/* Payment Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 relative">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/50">
                    الخطوة {step} من 4
                  </Badge>
                </div>
                <CardTitle className="text-2xl">
                  {step === 1 && "تحديد المبلغ"}
                  {step === 2 && "البيانات الشخصية"}
                  {step === 3 && "طريقة الدفع"}
                  {step === 4 && "تأكيد الدفع"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "حدد المبلغ المطلوب دفعه"}
                  {step === 2 && "أدخل بياناتك الشخصية"}
                  {step === 3 && "اختر طريقة الدفع المناسبة"}
                  {step === 4 && "راجع البيانات وأكد الدفع"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Amount */}
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
                          <Banknote className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">المبلغ المطلوب</h3>
                        <p className="text-muted-foreground">حدد قيمة الخدمة التي تريد دفعها</p>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="amount" className="text-lg font-semibold">المبلغ (ريال سعودي)</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="text-2xl font-bold text-center h-16 text-primary"
                            min="1"
                            step="0.01"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            ريال
                          </div>
                        </div>
                        
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">خدمة التسويق الرقمي تشمل:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>تحليل السوق</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>خطة تسويقية</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>استراتيجية المحتوى</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>دعم مستمر</span>
                            </div>
                          </div>
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

                  {/* Step 3: Payment Method */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">طريقة الدفع</h3>
                        <p className="text-muted-foreground">اختر الطريقة التي تناسبك</p>
                      </div>

                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                        {paymentMethods.map((method) => (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: paymentMethods.indexOf(method) * 0.1 }}
                            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                              paymentMethod === method.id 
                                ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-5`} />
                            <div className="relative p-6">
                              <div className="flex items-center space-x-4 space-x-reverse">
                                <RadioGroupItem value={method.id} id={method.id} className="scale-125" />
                                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                                        <method.icon className="w-6 h-6 text-white" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-lg">{method.name}</div>
                                        <div className="text-sm text-muted-foreground">{method.description}</div>
                                      </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-white/80">
                                      {method.badge}
                                    </Badge>
                                  </div>
                                </Label>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  )}

                  {/* Step 4: Confirmation */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
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
                          <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
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

                  {step < 4 ? (
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