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
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Validate phone for STC Pay
    if (selectedPaymentGateway === 'stc_pay' && !formData.phone) {
      toast({
        title: "خطأ في البيانات",
        description: "رقم الجوال مطلوب للدفع عبر STC Pay",
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
        // Handle STC Pay differently (show professional instructions modal)
        if (selectedPaymentGateway === 'stc_pay') {
          setIsOpen(false);
          
          // Show professional STC Pay instructions
          const modal = document.createElement('div');
          modal.innerHTML = `
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="this.remove()">
              <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in" dir="rtl" onclick="event.stopPropagation()">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
                  <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold mb-2">تعليمات الدفع</h3>
                  <p class="text-green-100">STC Pay</p>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="text-center">
                    <div class="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      معاملة آمنة ومحمية
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        افتح تطبيق STC Pay
                      </h4>
                    </div>
                    
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        اختر "إرسال أموال"
                      </h4>
                    </div>
                    
                    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        أرسل المبلغ التالي:
                      </h4>
                      <div class="bg-white rounded-lg p-4 border-2 border-purple-300">
                        <div class="text-center">
                          <div class="text-3xl font-bold text-purple-600">${data.amount} ${data.currency}</div>
                          <div class="text-sm text-gray-600 mt-1">إلى الرقم</div>
                          <div class="text-xl font-bold text-gray-800 mt-2 font-mono">${data.merchant_number}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                      <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        استخدم المرجع:
                      </h4>
                      <div class="bg-white rounded-lg p-3 border-2 border-orange-300">
                        <div class="text-center font-mono text-lg font-bold text-gray-800">${data.reference}</div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <div class="text-sm text-gray-600 mb-2">⏱️ سيتم تأكيد الدفع خلال</div>
                    <div class="text-lg font-bold text-gray-800">دقائق قليلة</div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors">
                      إغلاق
                    </button>
                    <button onclick="navigator.clipboard.writeText('${data.merchant_number}'); this.textContent='تم النسخ!'; setTimeout(() => this.textContent='نسخ الرقم', 2000)" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all">
                      نسخ الرقم
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(modal);
          
          toast({
            title: "تم إنشاء طلب الدفع بنجاح",
            description: "يرجى اتباع التعليمات المعروضة لإتمام الدفع",
            duration: 5000,
          });
          
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
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto animate-scale-in bg-gradient-to-br from-background/95 via-primary/5 to-accent/10 backdrop-blur-xl border-primary/20 shadow-2xl" dir="rtl">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-accent/10 to-warning/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <DialogHeader className="relative z-10 text-center pb-6 border-b border-primary/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full shadow-glow animate-pulse">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            الدفع الآمن والمحمي
          </DialogTitle>
          <p className="text-muted-foreground text-lg mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            اختر طريقة الدفع المناسبة واستمتع بتجربة آمنة ومضمونة
          </p>
        </DialogHeader>

        <div className="relative z-10 space-y-8 pt-6">
          {/* Premium Offer Summary Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/20 p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{offer.title}</h3>
                </div>
                <Badge className="bg-gradient-to-r from-destructive to-orange-500 text-white shadow-lg animate-bounce-gentle">
                  خصم {offer.discount}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
                      {offer.currentPrice} ر.س
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {offer.originalPrice} ر.س
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm">باقي {offer.timeLeft} على انتهاء العرض</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">وفر</div>
                  <div className="text-lg font-bold text-success">
                    {(parseFloat(offer.originalPrice.replace(/,/g, '')) - parseFloat(offer.currentPrice.replace(/,/g, ''))).toLocaleString()} ر.س
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway Selection - Enhanced Banking Style */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <h4 className="text-xl font-bold text-foreground mb-2">اختر بوابة الدفع المفضلة</h4>
              <p className="text-muted-foreground">جميع الطرق آمنة ومحمية بأعلى معايير الأمان</p>
            </div>
            
            {/* Active Payment Methods - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  id: 'tap', 
                  name: 'Tap Payments', 
                  description: 'دفع آمن ومضمون',
                  features: ['✓ حماية متقدمة', '✓ دفع فوري', '✓ دعم العملات المختلفة'],
                  gradient: 'from-blue-500/20 to-indigo-500/20',
                  borderGradient: 'from-blue-500 to-indigo-500'
                },
                { 
                  id: 'paylink', 
                  name: 'Paylink', 
                  description: 'الحل المحلي الأول',
                  features: ['✓ حل سعودي محلي', '✓ دعم فني ممتاز', '✓ تكامل مع البنوك المحلية'],
                  gradient: 'from-green-500/20 to-emerald-500/20',
                  borderGradient: 'from-green-500 to-emerald-500'
                },
                { 
                  id: 'stc_pay', 
                  name: 'STC Pay', 
                  description: 'المحفظة الرقمية الرائدة',
                  features: ['✓ دفع عبر الجوال', '✓ سرعة في التحويل', '✓ أمان عالي'],
                  gradient: 'from-purple-500/20 to-pink-500/20',
                  borderGradient: 'from-purple-500 to-pink-500'
                }
              ].map((gateway) => (
                <button
                  key={gateway.id}
                  type="button"
                  onClick={() => setSelectedPaymentGateway(gateway.id as any)}
                  className={`relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 hover-scale text-right group ${
                    selectedPaymentGateway === gateway.id
                      ? `bg-gradient-to-br ${gateway.gradient} border-primary shadow-glow scale-105`
                      : `bg-gradient-to-br from-background/50 to-muted/30 border-border hover:border-primary/50 hover:shadow-lg`
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${gateway.borderGradient} opacity-0 ${
                    selectedPaymentGateway === gateway.id ? 'opacity-10' : 'group-hover:opacity-5'
                  } transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-lg text-foreground">{gateway.name}</h5>
                      {selectedPaymentGateway === gateway.id && (
                        <div className="p-1 bg-primary rounded-full animate-bounce-gentle">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{gateway.description}</p>
                    <div className="space-y-1">
                      {gateway.features.map((feature, index) => (
                        <div key={index} className="text-xs text-muted-foreground">{feature}</div>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Coming Soon Section - Banking Style */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-center">
                <h5 className="text-lg font-bold text-muted-foreground mb-1">قريباً - حلول دفع إضافية</h5>
                <p className="text-sm text-muted-foreground">المزيد من الخيارات المبتكرة في الطريق</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'تمارا', logo: '/src/assets/tamara-logo.png', desc: 'أقساط مرنة' },
                  { name: 'تابي', logo: '/src/assets/tabby-logo.png', desc: 'ادفع لاحقاً' },
                  { name: 'الراجحي', logo: '/src/assets/alrajhi-bank-logo.png', desc: 'حلول بنكية' },
                  { name: 'تساهيل', logo: '/src/assets/tasaheel-logo.png', desc: 'تمويل مبتكر' }
                ].map((item, index) => (
                  <div key={index} className="relative p-4 bg-gradient-to-br from-muted/30 to-background/50 border border-muted rounded-xl text-center overflow-hidden group">
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs animate-bounce-gentle">قريباً</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <img src={item.logo} alt={item.name} className="w-10 h-10 mx-auto mb-2 opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="font-semibold text-sm text-muted-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Payment Form */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <h4 className="text-xl font-bold text-foreground mb-2">بياناتك الشخصية</h4>
              <p className="text-muted-foreground">معلومات آمنة ومحمية وفقاً لأعلى معايير الخصوصية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  الاسم الكامل *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك الكامل كما هو في الهوية"
                  className="h-12 bg-background/50 border-2 border-muted focus:border-primary transition-all duration-300 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  className="h-12 bg-background/50 border-2 border-muted focus:border-primary transition-all duration-300 rounded-xl"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className={`text-sm font-medium flex items-center gap-2 ${
                selectedPaymentGateway === 'stc_pay' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  selectedPaymentGateway === 'stc_pay' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                }`}></div>
                رقم الجوال {selectedPaymentGateway === 'stc_pay' ? '(مطلوب لـ STC Pay) *' : '(اختياري)'}
              </Label>
              {selectedPaymentGateway === 'stc_pay' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 text-purple-700 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">رقم الجوال مطلوب للدفع عبر STC Pay</span>
                  </div>
                </div>
              )}
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="05xxxxxxxx"
                className={`h-12 bg-background/50 border-2 transition-all duration-300 rounded-xl ${
                  selectedPaymentGateway === 'stc_pay' 
                    ? 'border-primary focus:border-primary shadow-md' 
                    : 'border-muted focus:border-primary'
                }`}
                dir="ltr"
                required={selectedPaymentGateway === 'stc_pay'}
              />
            </div>
          </div>

          {/* Enhanced Payment Button */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl text-white text-lg font-bold rounded-xl transition-all duration-300 hover-scale relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>جاري معالجة الطلب...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <span>
                    {selectedPaymentGateway === 'stc_pay' ? 
                      `ادفع عبر STC Pay - ${offer.currentPrice} ر.س` :
                      `ادفع عبر ${selectedPaymentGateway === 'tap' ? 'Tap Payments' : 'Paylink'} - ${offer.currentPrice} ر.س`
                    }
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            {/* Security and Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>SSL محمي</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>PCI معتمد</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>بيانات مشفرة</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-muted/30 to-background/50 rounded-xl border border-muted">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-medium text-foreground">ضمان الأمان الكامل</span>
              </div>
              <p className="text-sm text-muted-foreground">
                جميع المدفوعات محمية بتقنيات التشفير المتقدمة ومعايير الأمان العالمية. بياناتك في أمان تام.
              </p>
            </div>
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