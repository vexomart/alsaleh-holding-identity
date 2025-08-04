import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Heart,
  Gift,
  Upload,
  FileText,
  ArrowLeft,
  Send,
  RefreshCw,
  DollarSign,
  Users,
  TrendingUp,
  Crown,
  Gem
} from "lucide-react";

// Import company logos
import tamaraLogo from "@/assets/tamara-logo.png";
import tabbyLogo from "@/assets/tabby-logo.png";
import madfuLogo from "@/assets/madfu-logo.png";
import emkanLogo from "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png";
import tasaheelLogo from "@/assets/alrajhi-bank-logo.png";

const PaymentMethodsSection = () => {
  const [activeForm, setActiveForm] = useState<'payment' | 'receipt' | 'refund'>('payment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const traditionalMethods = [
    {
      name: "بطاقات الائتمان والخصم",
      icon: CreditCard,
      description: "فيزا، ماستركارد، أمريكان إكسبريس، مدى",
      features: ["حماية PCI DSS", "دفع فوري وآمن", "ضمان استرداد", "تشفير 3D Secure"],
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      bgGradient: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950"
    },
    {
      name: "التحويل البنكي المباشر", 
      icon: Building2,
      description: "جميع البنوك السعودية والخليجية المعتمدة",
      features: ["بدون رسوم إضافية", "تأكيد خلال ساعات", "IBAN معتمد", "مراقبة فورية"],
      gradient: "from-emerald-600 via-teal-700 to-cyan-800",
      bgGradient: "from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950"
    },
    {
      name: "المحافظ الرقمية الذكية",
      icon: Smartphone,
      description: "STC Pay، Apple Pay، Google Pay، Samsung Pay",
      features: ["مصادقة بيومترية", "دفع لاتصالي", "تشفير متقدم", "نقاط مكافآت"],
      gradient: "from-purple-600 via-violet-700 to-fuchsia-800",
      bgGradient: "from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950"
    }
  ];

  const installmentOptions = [
    {
      name: "تمارا",
      logo: tamaraLogo,
      description: "الرائد في خدمات اشتر الآن وادفع لاحقاً بدون فوائد",
      features: [
        "قسط على 4 دفعات متساوية",
        "بدون فوائد أو رسوم خفية", 
        "موافقة فورية خلال ثوانٍ",
        "حد أدنى 100 ريال - حد أقصى 20,000 ريال"
      ],
      benefits: ["أول قسط فقط 25%", "مرونة كاملة في السداد", "حماية المشتري"],
      color: "emerald",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      premium: true
    },
    {
      name: "تابي", 
      logo: tabbyLogo,
      description: "منصة التقسيط الذكية بتقنية AI متطورة",
      features: [
        "تقسيط مرن كل أسبوعين أو شهرياً",
        "تحليل ائتماني ذكي فوري",
        "بدون رسوم للسداد المبكر",
        "حد أدنى 50 ريال - حد أقصى 8,000 ريال"
      ],
      benefits: ["تقييم ائتماني ذكي", "إشعارات تلقائية", "تطبيق عصري"],
      color: "blue",
      gradient: "from-blue-500 via-indigo-600 to-purple-700",
      premium: true
    },
    {
      name: "مدفوع",
      logo: madfuLogo, 
      description: "حلول التمويل الشخصي الشامل والمبتكر",
      features: [
        "خطط تقسيط طويلة الأمد",
        "بدون ضمانات أو كفلاء",
        "حدود ائتمانية عالية",
        "خدمة عملاء 24/7"
      ],
      benefits: ["إجراءات رقمية بالكامل", "مرونة في الجدولة", "برامج ولاء حصرية"],
      color: "orange",
      gradient: "from-orange-500 via-red-600 to-pink-700",
      premium: false
    },
    {
      name: "امكان",
      logo: emkanLogo, 
      description: "منصة التمويل الرقمي الرائدة بحلول مالية ذكية",
      features: [
        "تقسيط طويل الأمد حتى 60 شهر",
        "خيارات مرنة للدفعة الأولى",
        "موافقة سريعة بتقنية AI",
        "متاح للمواطنين والمقيمين"
      ],
      benefits: ["معدلات تنافسية", "شفافية كاملة", "إدارة حساب ذكية"],
      color: "violet",
      gradient: "from-violet-500 via-purple-600 to-indigo-700",
      premium: true
    },
    {
      name: "تساهيل",
      logo: tasaheelLogo,
      description: "برنامج التمويل المصرفي الإسلامي المعتمد",
      features: [
        "أحكام شرعية معتمدة",
        "بدون كفيل للمبالغ الصغيرة",
        "مراجعة خلال 24-48 ساعة",
        "عضوية البنك الراجحي مطلوبة"
      ],
      benefits: ["أمان مصرفي كامل", "شروط شرعية", "خدمات مصرفية متكاملة"],
      color: "green",
      gradient: "from-green-500 via-emerald-600 to-teal-700",
      premium: false
    }
  ];

  const securityFeatures = [
    { icon: Shield, text: "تشفير SSL 256-bit", color: "text-blue-600" },
    { icon: CheckCircle, text: "معتمد SAMA", color: "text-green-600" },
    { icon: Zap, text: "مراقبة فورية للاحتيال", color: "text-yellow-600" },
    { icon: Star, text: "ضمان استرداد 100%", color: "text-purple-600" }
  ];

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const receiptData = {
        type: 'bank_receipt' as const,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        transferAmount: formData.get('transferAmount') as string,
        transferDate: formData.get('transferDate') as string,
        accountLastFour: formData.get('accountLastFour') as string,
        notes: formData.get('notes') as string,
      };

      const { data, error } = await supabase.functions.invoke('payment-forms', {
        body: receiptData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم استلام الإيصال بنجاح",
        description: "سيتم مراجعة إيصال التحويل والتأكيد خلال 2-4 ساعات عمل",
      });

      (e.target as HTMLFormElement).reset();
      setActiveForm('payment');
    } catch (error) {
      console.error('Error submitting receipt:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الإيصال. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const refundData = {
        type: 'refund' as const,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        originalAmount: formData.get('originalAmount') as string,
        refundReason: formData.get('refundReason') as string,
        refundAmount: formData.get('refundAmount') as string,
        orderNumber: formData.get('orderNumber') as string,
        bankAccount: formData.get('bankAccount') as string,
        notes: formData.get('notes') as string,
      };

      const { data, error } = await supabase.functions.invoke('payment-forms', {
        body: refundData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم استلام طلب الاسترداد",
        description: "سيتم مراجعة طلبك ومعالجته خلال 3-5 أيام عمل",
      });

      (e.target as HTMLFormElement).reset();
      setActiveForm('payment');
    } catch (error) {
      console.error('Error submitting refund request:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلب الاسترداد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950" id="payment-methods">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-cyan-200/30 dark:from-emerald-800/20 dark:to-cyan-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-violet-200/20 to-fuchsia-200/20 dark:from-violet-800/10 dark:to-fuchsia-800/10 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full mb-8 shadow-lg shadow-blue-500/25">
            <Crown className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">نظام دفع متطور وآمن</span>
            <Gem className="w-5 h-5 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            منصة <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">الدفع</span> الذكية
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            تجربة دفع استثنائية مع أحدث التقنيات المالية وخيارات تقسيط مرنة ومبتكرة
            <br />
            <span className="text-lg text-gray-500 dark:text-gray-400">مدعومة بأعلى معايير الأمان والحماية العالمية</span>
          </p>
        </div>

        {/* Form Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveForm('payment')}
                variant={activeForm === 'payment' ? 'default' : 'ghost'}
                className={`rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
                  activeForm === 'payment' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <DollarSign className="w-5 h-5 ml-2" />
                طرق الدفع
              </Button>
              <Button
                onClick={() => setActiveForm('receipt')}
                variant={activeForm === 'receipt' ? 'default' : 'ghost'}
                className={`rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
                  activeForm === 'receipt' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="w-5 h-5 ml-2" />
                إرسال إيصال
              </Button>
              <Button
                onClick={() => setActiveForm('refund')}
                variant={activeForm === 'refund' ? 'default' : 'ghost'}
                className={`rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
                  activeForm === 'refund' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                طلب استرداد
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        {activeForm === 'payment' && (
          <div className="space-y-20 animate-fade-in">
            {/* Traditional Payment Methods */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  طرق الدفع الفورية
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  خيارات دفع سريعة وآمنة للحصول على خدماتك فوراً
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {traditionalMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <Card key={index} className="group relative overflow-hidden border-0 shadow-2xl shadow-gray-900/10 dark:shadow-gray-100/5 hover:shadow-3xl transition-all duration-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${method.gradient}`}></div>
                      
                      <CardContent className="relative z-10 p-8 text-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-blue-500/30`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{method.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{method.description}</p>
                        
                        <div className="space-y-3">
                          {method.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button className={`w-full mt-6 bg-gradient-to-r ${method.gradient} hover:opacity-90 transition-all duration-300 text-white border-0 shadow-lg font-semibold py-3 rounded-xl`}>
                          اختر هذه الطريقة
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Installment Payment Options */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                  برامج التقسيط المتطورة
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  اشتر الآن وادفع لاحقاً مع أفضل منصات التمويل في المنطقة
                </p>
              </div>

              <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-8">
                {installmentOptions.map((option, index) => (
                  <Card key={index} className="group relative overflow-hidden border-0 shadow-2xl shadow-gray-900/10 dark:shadow-gray-100/5 hover:shadow-3xl transition-all duration-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                    {option.premium && (
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg font-semibold">
                          <Crown className="w-3 h-3 ml-1" />
                          مميز
                        </Badge>
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    <div className={`h-2 bg-gradient-to-r ${option.gradient}`} />
                    
                    <CardContent className="relative z-10 p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-gray-100">
                          <img 
                            src={option.logo} 
                            alt={`${option.name} logo`}
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{option.name}</h3>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 mt-1 font-semibold">
                            بدون فوائد
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed font-medium">{option.description}</p>
                      
                      <div className="space-y-4 mb-6">
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          الميزات الأساسية:
                        </h4>
                        {option.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="font-medium leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 mb-6 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-600" />
                          مزايا حصرية:
                        </h4>
                        {option.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <TrendingUp className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        asChild
                        className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 transition-all duration-300 text-white border-0 shadow-lg font-semibold py-3 rounded-xl`}
                      >
                        <a 
                          href={`https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن خدمة التقسيط عبر ${option.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Users className="w-4 h-4 ml-2" />
                          تواصل مع {option.name}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950 dark:via-purple-950 dark:to-cyan-950 rounded-3xl p-12 border border-blue-200/50 dark:border-blue-800/50 shadow-2xl shadow-blue-500/10 animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                  الأمان والحماية المتقدمة
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  نحمي معلوماتك المالية بأحدث تقنيات الأمان العالمية
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className={`w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-xl border border-gray-200 dark:border-gray-700`}>
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {feature.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Receipt Upload Form */}
        {activeForm === 'receipt' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="border-0 shadow-2xl shadow-emerald-500/10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  إرسال إيصال التحويل البنكي
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  يرجى إرسال إيصال التحويل للمراجعة والتأكيد
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleReceiptSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الاسم الكامل *
                      </Label>
                      <Input 
                        id="full-name"
                        required
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        رقم الجوال *
                      </Label>
                      <Input 
                        id="phone"
                        required
                        type="tel"
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      البريد الإلكتروني *
                    </Label>
                    <Input 
                      id="email"
                      required
                      type="email"
                      className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="transfer-amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        مبلغ التحويل *
                      </Label>
                      <Input 
                        id="transfer-amount"
                        required
                        type="number"
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transfer-date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        تاريخ التحويل *
                      </Label>
                      <Input 
                        id="transfer-date"
                        required
                        type="date"
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      اسم البنك المُحوِل منه *
                    </Label>
                    <Input 
                      id="bank-name"
                      required
                      className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                      placeholder="مثال: البنك الأهلي السعودي"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-upload" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      صورة الإيصال *
                    </Label>
                    <Input 
                      id="receipt-upload"
                      required
                      type="file"
                      accept="image/*,.pdf"
                      className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm file:bg-emerald-500 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      يقبل: JPG, PNG, PDF - الحد الأقصى 5MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ملاحظات إضافية
                    </Label>
                    <Textarea 
                      id="notes"
                      className="rounded-xl border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm min-h-[100px]"
                      placeholder="أي ملاحظات أو تفاصيل إضافية..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm('payment')}
                      className="flex-1 rounded-xl h-12 border-gray-300 dark:border-gray-600 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg shadow-emerald-500/25 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          إرسال الإيصال
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Refund Request Form */}
        {activeForm === 'refund' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="border-0 shadow-2xl shadow-red-500/10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30">
                  <RefreshCw className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  طلب استرداد الأموال
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  يرجى تعبئة النموذج لمعالجة طلب الاسترداد
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleRefundSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="refund-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        الاسم الكامل *
                      </Label>
                      <Input 
                        id="refund-name"
                        required
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refund-phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        رقم الجوال *
                      </Label>
                      <Input 
                        id="refund-phone"
                        required
                        type="tel"
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refund-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      البريد الإلكتروني *
                    </Label>
                    <Input 
                      id="refund-email"
                      required
                      type="email"
                      className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="order-number" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        رقم الطلب أو الفاتورة *
                      </Label>
                      <Input 
                        id="order-number"
                        required
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="مثال: ORD-2024-001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refund-amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        المبلغ المطلوب استرداده *
                      </Label>
                      <Input 
                        id="refund-amount"
                        required
                        type="number"
                        className="rounded-xl border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      طريقة الدفع المستخدمة *
                    </Label>
                    <select 
                      id="payment-method"
                      required
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-gray-900 dark:text-white"
                    >
                      <option value="">اختر طريقة الدفع</option>
                      <option value="credit-card">بطاقة ائتمان</option>
                      <option value="bank-transfer">تحويل بنكي</option>
                      <option value="digital-wallet">محفظة رقمية</option>
                      <option value="tamara">تمارا</option>
                      <option value="tabby">تابي</option>
                      <option value="madfu">مدفوع</option>
                      <option value="emkan">امكان</option>
                      <option value="tasaheel">تساهيل</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refund-reason" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      سبب طلب الاسترداد *
                    </Label>
                    <Textarea 
                      id="refund-reason"
                      required
                      className="rounded-xl border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm min-h-[120px]"
                      placeholder="يرجى شرح سبب طلب الاسترداد بالتفصيل..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-details" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      تفاصيل الحساب البنكي للاسترداد *
                    </Label>
                    <Textarea 
                      id="bank-details"
                      required
                      className="rounded-xl border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm min-h-[100px]"
                      placeholder="اسم البنك، رقم الحساب، رقم الآيبان، اسم صاحب الحساب..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveForm('payment')}
                      className="flex-1 rounded-xl h-12 border-gray-300 dark:border-gray-600 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg shadow-red-500/25 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          إرسال الطلب
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Premium CTA Section */}
        {activeForm === 'payment' && (
          <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: "1s" }}>
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-white shadow-2xl shadow-blue-500/25 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <Heart className="w-10 h-10 text-white animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  ابدأ رحلتك التقنية اليوم
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                  انضم إلى آلاف العملاء الذين يثقون بحلولنا التقنية المتطورة
                  <br />
                  <span className="text-lg">مع خيارات دفع مرنة تناسب جميع الاحتياجات</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90 rounded-2xl px-8 py-4 font-bold text-lg shadow-xl">
                    <a 
                      href="https://wa.me/966555812567?text=مرحباً، أريد التواصل مع فريق المبيعات لمناقشة مشروعي"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Users className="w-5 h-5 ml-2" />
                      تواصل مع فريق المبيعات
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-2xl px-8 py-4 font-bold text-lg backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5 ml-2" />
                    استكشف الأسعار
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentMethodsSection;