import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Zap, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Gift,
  Sparkles,
  Target,
  Send,
  MessageCircle,
  Phone,
  Timer,
  Rocket,
  Crown,
  Award,
  CreditCard,
  Loader2
} from "lucide-react";
import OfferRequestForm from "@/components/OfferRequestForm";

const currentOffers = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    description: "تصميم وتطوير موقع إلكتروني احترافي متكامل مع لوحة تحكم إدارية وتحسين محركات البحث",
    originalPrice: "15000",
    currentPrice: "9750",
    discount: "35%",
    timeLeft: "14 يوم",
    features: [
      "تصميم مخصص وفريد احترافي",
      "استضافة مجانية لسنة كاملة",
      "شهادة SSL مجانية للحماية",
      "دعم فني 24/7 متواصل",
      "تحسين محركات البحث SEO",
      "نظام إدارة المحتوى المتقدم",
      "تصميم متجاوب للجوال والتابلت",
      "ربط وسائل التواصل الاجتماعي"
    ],
    badge: "الأكثر طلباً",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-100",
    glowColor: "blue-500/30"
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي المتكاملة",
    description: "خطة تسويق رقمي شاملة لزيادة المبيعات والوصول للعملاء المستهدفين مع حملات إعلانية فعالة",
    originalPrice: "12000",
    currentPrice: "7200",
    discount: "40%",
    timeLeft: "21 يوم",
    features: [
      "استراتيجية تسويق مخصصة لعملك",
      "إدارة حسابات التواصل الاجتماعي",
      "حملات إعلانية مدفوعة احترافية",
      "تحليل وتقارير مفصلة شهرية",
      "تصميم محتوى إبداعي جذاب",
      "استهداف دقيق للجمهور المهتم",
      "تحسين معدل التحويل ROI",
      "دعم واستشارة تسويقية مستمرة"
    ],
    badge: "عرض محدود",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-100",
    glowColor: "green-500/30"
  },
  {
    id: 3,
    title: "حزمة الهوية البصرية الشاملة",
    description: "تصميم هوية بصرية متكاملة تعكس قيم وشخصية علامتك التجارية مع جميع المطبوعات",
    originalPrice: "8000",
    currentPrice: "4800",
    discount: "40%",
    timeLeft: "10 أيام",
    features: [
      "تصميم الشعار الاحترافي المميز",
      "دليل الهوية البصرية الكامل",
      "تصميم البطاقات التجارية الأنيقة",
      "تصميم الخطابات الرسمية",
      "قوالب وسائل التواصل الاجتماعي",
      "تصميم اللافتات والإعلانات",
      "ملفات بجودة عالية للطباعة",
      "حقوق الملكية الكاملة لك"
    ],
    badge: "توفير 40%",
    icon: Sparkles,
    color: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50 to-violet-100",
    glowColor: "purple-500/30"
  }
];

const PaymentDialog = ({ offer, trigger }: { offer: any; trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'tap' | 'paylink'>('tap');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseFloat(offer.currentPrice.replace(/,/g, ''));
      
      // Choose payment function based on selected gateway
      const paymentFunction = selectedPaymentGateway === 'tap' ? 'tap-payment' : 'paylink-payment';
      
      const { data, error } = await supabase.functions.invoke(paymentFunction, {
        body: {
          amount: amount,
          currency: 'SAR',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          offer_title: offer.title,
          description: `دفع عرض: ${offer.title}`,
        },
      });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      console.log('Payment response:', data);

      if (data?.success && data?.payment_url) {
        console.log('Opening payment URL:', data.payment_url);
        
        toast({
          title: "تم إنشاء رابط الدفع بنجاح",
          description: `سيتم فتح صفحة الدفع الآن عبر ${selectedPaymentGateway === 'tap' ? 'Tap' : 'Paylink'}`,
        });
        
        // Close dialog first
        setIsOpen(false);
        
        // Redirect to payment page in same window to avoid popup blockers
        window.location.href = data.payment_url;
        
      } else {
        console.error('Invalid response:', data);
        throw new Error('لم يتم إنشاء رابط الدفع بشكل صحيح');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في عملية الدفع",
        description: error.message || "حدث خطأ أثناء إنشاء عملية الدفع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            الدفع الآمن 💳
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Payment Gateway Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              اختر بوابة الدفع
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPaymentGateway('tap')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedPaymentGateway === 'tap'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">Tap</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    دفع آمن وسريع
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentGateway('paylink')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedPaymentGateway === 'paylink'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">Paylink</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    دفع محلي سعودي
                  </div>
                </div>
              </button>
            </div>
            {/* Tamara Coming Soon */}
            <div className="text-xs text-muted-foreground text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center gap-2">
                <span>🔮</span>
                <span className="font-medium">تمارا - الدفع بالأقساط</span>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-semibold">
                  قريباً
                </span>
              </div>
            </div>
          </div>

          {/* Offer Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                {offer.currentPrice} ر.س
              </span>
              <Badge variant="destructive">خصم {offer.discount}</Badge>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك الكامل"
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
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الجوال</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="05xxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 ml-2" />
                ادفع عبر {selectedPaymentGateway === 'tap' ? 'Tap' : 'Paylink'} - {offer.currentPrice} ر.س
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-sm text-muted-foreground">
            🔒 جميع المدفوعات آمنة ومحمية بتقنية التشفير
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CurrentOffers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <Navigation />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Hero Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full shadow-xl">
                <div className="flex items-center gap-3">
                  <Timer className="w-6 h-6 animate-spin" />
                  <span className="text-xl font-bold">عروض محدودة الوقت</span>
                  <Crown className="w-6 h-6 animate-bounce" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
              العروض الحالية المميزة
            </h1>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              استفد من عروضنا الحصرية واحصل على أفضل الخدمات التقنية بأسعار استثنائية مع ضمان الجودة العالمية
            </p>

            {/* Stats Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="text-3xl font-black text-blue-600 mb-2">+500</div>
                <div className="text-gray-600 font-medium">عميل سعيد</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="text-3xl font-black text-green-600 mb-2">+1000</div>
                <div className="text-gray-600 font-medium">مشروع مكتمل</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="text-3xl font-black text-purple-600 mb-2">%99</div>
                <div className="text-gray-600 font-medium">نسبة الرضا</div>
              </div>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {currentOffers.map((offer, index) => {
              const IconComponent = offer.icon;
              return (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden group hover:scale-105 transition-all duration-700 border-0 shadow-2xl hover:shadow-3xl bg-white/90 backdrop-blur-lg animate-fade-in hover-scale`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${offer.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-8 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                  </div>

                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  
                  {/* Premium Badge */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <Badge className={`bg-gradient-to-r ${offer.color} text-white px-6 py-3 text-sm font-bold shadow-2xl transform rotate-12 group-hover:rotate-6 transition-transform duration-300 animate-bounce`}>
                        <Award className="w-4 h-4 mr-2" />
                        {offer.badge}
                      </Badge>
                    </div>
                  </div>

                  {/* Time Countdown */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>متبقي {offer.timeLeft}</span>
                    </div>
                  </div>

                  <CardHeader className="pt-20 pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${offer.color} shadow-xl hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl relative`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${offer.color} rounded-2xl blur-md opacity-50 animate-pulse`}></div>
                        <IconComponent className="w-8 h-8 text-white relative z-10" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 text-right group-hover:text-blue-600 transition-colors duration-300">
                          {offer.title}
                        </CardTitle>
                        <p className="text-base leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 relative z-10">
                    {/* Enhanced Pricing */}
                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-3xl p-8 relative overflow-hidden border-2 border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                      <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <span className={`text-4xl font-black bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                            {offer.currentPrice} ر.س
                          </span>
                          <Badge className="bg-red-500 text-white px-4 py-2 text-lg font-bold animate-bounce shadow-xl">
                            خصم {offer.discount}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <span className="text-2xl text-gray-400 line-through font-medium">
                            {offer.originalPrice} ر.س
                          </span>
                          <div className="text-green-600 font-bold text-lg bg-green-50 px-3 py-1 rounded-full">
                            وفر {parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl text-center mb-6 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                        <span className="bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent">مميزات العرض</span>
                        <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
                      </h4>
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {offer.features.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group/feature hover:scale-105"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 group-hover/feature:animate-bounce" />
                            <span className="text-sm leading-relaxed group-hover/feature:text-blue-700 transition-colors duration-200">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced CTA */}
                    <div className="pt-6 space-y-4">
                      {/* Payment Button */}
                      <PaymentDialog
                        offer={offer}
                        trigger={
                          <Button 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 font-bold text-white"
                            size="lg"
                          >
                            <CreditCard className="w-5 h-5 ml-2" />
                            ادفع الآن - {offer.currentPrice} ر.س
                            <ArrowRight className="w-5 h-5 mr-2" />
                          </Button>
                        }
                      />
                      
                      {/* Request Form Button */}
                      <OfferRequestForm
                        offer={offer}
                        trigger={
                          <Button 
                            variant="outline"
                            className={`w-full group/btn hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 font-bold border-2`}
                            size="lg"
                          >
                            <Send className="w-5 h-5 ml-2" />
                            طلب معلومات أكثر
                            <ArrowRight className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Premium CTA */}
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-center text-white overflow-hidden shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute top-16 right-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-16 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-16 right-8 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
                <span className="text-2xl font-bold text-yellow-400">عرض مخصص لك</span>
                <Star className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                هل تحتاج عرض مخصص لمشروعك؟
              </h2>
              
              <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر مخصص يناسب احتياجاتك مع خصومات حصرية تصل إلى 50%
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-blue-500/25 relative overflow-hidden group"
                  onClick={() => window.open('https://wa.me/966555812567?text=' + encodeURIComponent('مرحباً، أريد الحصول على عرض مخصص لمشروعي 🚀'), '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 animate-bounce" />
                    احصل على عرض مخصص
                    <Rocket className="w-6 h-6 animate-pulse" />
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold px-10 py-6 text-xl rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <Phone className="w-6 h-6 animate-pulse" />
                      اتصل بنا الآن
                      <Award className="w-6 h-6 animate-bounce" />
                    </div>
                  </a>
                </Button>
              </div>
              
              <div className="mt-8 text-blue-200 text-lg">
                📞 <span className="font-bold">0555812567</span> | 📧 <span className="font-bold">info@alialshehriholding.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CurrentOffers;