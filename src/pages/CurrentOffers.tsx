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
    gradientFrom: "from-primary",
    gradientTo: "to-primary-glow"
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
    gradientFrom: "from-success",
    gradientTo: "to-accent"
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
    gradientFrom: "from-secondary",
    gradientTo: "to-warning"
  }
];

const PaymentDialog = ({ offer, trigger }: { offer: any; trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'tap' | 'paylink' | 'stc_pay'>('tap');
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
      const paymentFunction = selectedPaymentGateway === 'tap' ? 'tap-payment' : 
                             selectedPaymentGateway === 'paylink' ? 'paylink-payment' : 
                             'stc-pay';
      
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

      if (data?.success) {
        // Handle STC Pay differently (show instructions)
        if (selectedPaymentGateway === 'stc_pay') {
          toast({
            title: "تعليمات الدفع عبر STC Pay",
            description: data.instructions?.ar || `ارسل ${data.amount} ${data.currency} للرقم ${data.merchant_number}`,
            duration: 10000,
          });
          
          // Show STC Pay instructions modal
          alert(`📱 لإتمام الدفع:\n\n1. افتح تطبيق STC Pay\n2. اختر إرسال أموال\n3. أرسل ${data.amount} ريال للرقم: ${data.merchant_number}\n4. استخدم المرجع: ${data.reference}\n\nسيتم تأكيد الدفع خلال دقائق قليلة.`);
          
          setIsOpen(false);
        } else if (data?.payment_url) {
          console.log('Opening payment URL:', data.payment_url);
          
          toast({
            title: "تم إنشاء رابط الدفع بنجاح",
            description: `سيتم فتح صفحة الدفع الآن عبر ${
              selectedPaymentGateway === 'tap' ? 'Tap' : 'Paylink'
            }`,
          });
          
          // Close dialog first
          setIsOpen(false);
          
          // Redirect to payment page in same window to avoid popup blockers
          window.location.href = data.payment_url;
        } else {
          throw new Error('لم يتم إنشاء رابط الدفع بشكل صحيح');
        }
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
          <DialogTitle className="text-center text-2xl text-gradient-primary">
            الدفع الآمن 💳
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Payment Gateway Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              اختر بوابة الدفع
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentGateway('tap')}
                className={`p-3 border-2 rounded-lg transition-all hover-scale ${
                  selectedPaymentGateway === 'tap'
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-xs">Tap</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    دفع آمن
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentGateway('paylink')}
                className={`p-3 border-2 rounded-lg transition-all hover-scale ${
                  selectedPaymentGateway === 'paylink'
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-xs">Paylink</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    دفع محلي
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentGateway('stc_pay')}
                className={`p-3 border-2 rounded-lg transition-all hover-scale ${
                  selectedPaymentGateway === 'stc_pay'
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-xs">STC Pay</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    محفظة رقمية
                  </div>
                </div>
              </button>
            </div>
            {/* Tamara Coming Soon */}
            <div className="text-xs text-muted-foreground text-center p-3 glass-effect rounded-lg border">
              <div className="flex items-center justify-center gap-2">
                <span>🔮</span>
                <span className="font-medium">تمارا - الدفع بالأقساط</span>
                <Badge variant="secondary" className="text-xs">
                  قريباً
                </Badge>
              </div>
            </div>
          </div>

          {/* Offer Summary */}
          <div className="glass-effect p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-success">
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
            className="w-full bg-gradient-to-r from-success to-accent hover:shadow-glow text-white py-3 text-lg font-bold hover-scale"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 ml-2" />
                {selectedPaymentGateway === 'stc_pay' ? 
                  `ادفع عبر STC Pay - ${offer.currentPrice} ر.س` :
                  `ادفع عبر ${selectedPaymentGateway === 'tap' ? 'Tap' : 'Paylink'} - ${offer.currentPrice} ر.س`
                }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-r from-secondary/15 to-accent/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-40 w-[28rem] h-[28rem] bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-warning/20 to-destructive/20 rounded-full blur-3xl animate-float-delayed" style={{ animationDelay: '6s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Enhanced Hero Header */}
          <div className="text-center mb-20 space-y-8">
            {/* Limited Time Badge */}
            <div className="relative inline-block animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive to-warning rounded-full blur-xl opacity-40 animate-glow"></div>
              <div className="relative glass-effect bg-gradient-to-r from-destructive to-warning text-white px-10 py-5 rounded-full shadow-corporate">
                <div className="flex items-center gap-4 text-lg font-bold">
                  <Timer className="w-7 h-7 animate-bounce-gentle" />
                  <span className="text-xl">عروض محدودة الوقت</span>
                  <Crown className="w-7 h-7 animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="animate-fade-in delay-100">
              <h1 className="text-6xl md:text-8xl font-black mb-6 text-gradient-primary leading-tight">
                العروض الحالية المميزة
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-glow"></div>
            </div>
            
            {/* Description */}
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed animate-fade-in delay-200 font-medium">
              استفد من عروضنا الحصرية واحصل على أفضل الخدمات التقنية بأسعار استثنائية مع ضمان الجودة العالمية
            </p>

            {/* Enhanced Stats Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in delay-300">
              <div className="glass-effect bg-card/80 backdrop-blur-lg rounded-3xl p-8 shadow-corporate border hover:shadow-glow transition-all duration-500 hover-scale group">
                <div className="text-4xl font-black text-primary mb-3 group-hover:scale-110 transition-transform duration-300">+500</div>
                <div className="text-muted-foreground font-semibold text-lg">عميل سعيد</div>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mt-3 rounded-full"></div>
              </div>
              <div className="glass-effect bg-card/80 backdrop-blur-lg rounded-3xl p-8 shadow-corporate border hover:shadow-glow transition-all duration-500 hover-scale group">
                <div className="text-4xl font-black text-success mb-3 group-hover:scale-110 transition-transform duration-300">+1000</div>
                <div className="text-muted-foreground font-semibold text-lg">مشروع مكتمل</div>
                <div className="w-16 h-1 bg-gradient-to-r from-success to-accent mt-3 rounded-full"></div>
              </div>
              <div className="glass-effect bg-card/80 backdrop-blur-lg rounded-3xl p-8 shadow-corporate border hover:shadow-glow transition-all duration-500 hover-scale group">
                <div className="text-4xl font-black text-secondary mb-3 group-hover:scale-110 transition-transform duration-300">%99</div>
                <div className="text-muted-foreground font-semibold text-lg">معدل الرضا</div>
                <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mt-3 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Offers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {currentOffers.map((offer, index) => {
              const IconComponent = offer.icon;
              return (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden group hover-scale transition-all duration-700 border-0 shadow-corporate hover:shadow-glow glass-effect bg-card/90 backdrop-blur-xl animate-fade-in delay-${index * 100}`}
                >
                  {/* Enhanced Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-bounce-gentle"></div>
                    <div className="absolute top-8 left-6 w-1 h-1 bg-accent rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-success rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
                  </div>

                  {/* Premium Badge */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <Badge className={`bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} text-white px-6 py-3 text-sm font-bold shadow-corporate transform rotate-12 group-hover:rotate-6 transition-transform duration-300 animate-bounce-gentle`}>
                        <Award className="w-4 h-4 mr-2" />
                        {offer.badge}
                      </Badge>
                    </div>
                  </div>

                  {/* Time Countdown */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-destructive text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-glow flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>متبقي {offer.timeLeft}</span>
                    </div>
                  </div>

                  <CardHeader className="pt-20 pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${offer.gradientFrom} ${offer.gradientTo} shadow-xl hover-scale transition-all duration-300 group-hover:shadow-glow relative`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} rounded-2xl blur-md opacity-50 animate-glow`}></div>
                        <IconComponent className="w-8 h-8 text-white relative z-10" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 text-right group-hover:text-primary transition-colors duration-300">
                          {offer.title}
                        </CardTitle>
                        <p className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 relative z-10">
                    {/* Enhanced Pricing */}
                    <div className="glass-effect bg-card/50 rounded-3xl p-8 relative overflow-hidden border hover:border-primary/30 transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-glow"></div>
                      <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <span className={`text-4xl font-black bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} bg-clip-text text-transparent`}>
                            {offer.currentPrice} ر.س
                          </span>
                          <Badge className="bg-destructive text-white px-4 py-2 text-lg font-bold animate-bounce-gentle shadow-xl">
                            خصم {offer.discount}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <span className="text-2xl text-muted-foreground line-through font-medium">
                            {offer.originalPrice} ر.س
                          </span>
                          <div className="text-success font-bold text-lg bg-success/10 px-3 py-1 rounded-full border border-success/20">
                            وفر {parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl text-center mb-6 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-secondary animate-float" />
                        <span className="text-gradient-primary">مميزات العرض</span>
                        <Star className="w-6 h-6 text-secondary animate-float" style={{ animationDelay: '1s' }} />
                      </h4>
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {offer.features.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group/feature hover-scale"
                          >
                            <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0 group-hover/feature:animate-bounce-gentle" />
                            <span className="text-sm leading-relaxed group-hover/feature:text-primary transition-colors duration-200">
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
                            className="w-full bg-gradient-to-r from-success to-accent hover:shadow-glow hover-scale transition-all duration-300 text-lg py-6 font-bold text-white"
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
                            className={`w-full group/btn hover:shadow-glow hover-scale transition-all duration-300 text-lg py-6 font-bold border-2`}
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
          <div className="relative corporate-gradient rounded-3xl p-12 text-center text-white overflow-hidden shadow-corporate">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 animate-glow"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-4 h-4 bg-secondary rounded-full animate-bounce-gentle"></div>
            <div className="absolute top-16 right-16 w-3 h-3 bg-accent rounded-full animate-float"></div>
            <div className="absolute bottom-8 left-16 w-2 h-2 bg-success rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-16 right-8 w-3 h-3 bg-warning rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-secondary animate-bounce-gentle" />
                <span className="text-2xl font-bold text-secondary">عرض مخصص لك</span>
                <Star className="w-8 h-8 text-secondary animate-float" />
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-gradient-secondary">
                هل تحتاج عرض مخصص لمشروعك؟
              </h2>
              
              <p className="text-xl mb-10 text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر مخصص يناسب احتياجاتك مع خصومات حصرية تصل إلى 50%
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow text-white font-bold px-10 py-6 text-xl rounded-2xl shadow-corporate hover-scale transition-all duration-300 relative overflow-hidden group"
                  onClick={() => window.open('https://wa.me/966555812567?text=' + encodeURIComponent('مرحباً، أريد الحصول على عرض مخصص لمشروعي 🚀'), '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 animate-bounce-gentle" />
                    احصل على عرض مخصص
                    <Rocket className="w-6 h-6 animate-float" />
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="glass-effect border-2 border-white/30 text-white hover:bg-white hover:text-primary font-bold px-10 py-6 text-xl rounded-2xl shadow-xl hover-scale transition-all duration-300 relative overflow-hidden group"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <Phone className="w-6 h-6 animate-float" />
                      اتصل بنا الآن
                      <Award className="w-6 h-6 animate-bounce-gentle" />
                    </div>
                  </a>
                </Button>
              </div>
              
              <div className="mt-8 text-primary-foreground/70 text-lg">
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