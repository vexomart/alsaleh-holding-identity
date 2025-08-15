import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  Loader2,
  ShoppingBag,
  Palette,
  TrendingUp,
  Globe
} from "lucide-react";
import OfferRequestForm from "@/components/OfferRequestForm";

const currentOffers = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    description: "تصميم وتطوير موقع إلكتروني احترافي متكامل مع لوحة تحكم إدارية وتحسين محركات البحث",
    originalPrice: "15000",
    currentPrice: "69",
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
    icon: Globe,
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    accentColor: "text-blue-500",
    bgPattern: "bg-blue-50",
    category: "تطوير الويب"
  },
  {
    id: 2,
    title: "تصميم متجر إلكتروني متكامل",
    description: "متجر إلكتروني احترافي ومتكامل مع نظام إدارة المنتجات والمبيعات وبوابات الدفع المتعددة",
    originalPrice: "7699",
    currentPrice: "2999",
    discount: "61%",
    timeLeft: "40 يوم",
    features: [
      "تصميم عصري ومتجاوب للمتجر",
      "نظام إدارة المنتجات والمخزون",
      "بوابات دفع متعددة (فيزا، ماستركارد، مدى)",
      "نظام إدارة الطلبات والشحن",
      "لوحة تحكم شاملة للإدارة",
      "تقارير مبيعات تفصيلية",
      "نظام خصومات وكوبونات",
      "تكامل مع وسائل التواصل الاجتماعي",
      "دعم فني مجاني لـ 6 أشهر",
      "تدريب مجاني على النظام"
    ],
    badge: "عرض محدود",
    icon: ShoppingBag,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    accentColor: "text-orange-500",
    bgPattern: "bg-orange-50",
    category: "التجارة الإلكترونية"
  },
  {
    id: 3,
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
    icon: TrendingUp,
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    accentColor: "text-green-500",
    bgPattern: "bg-green-50",
    category: "التسويق الرقمي"
  },
  {
    id: 4,
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
    icon: Palette,
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    accentColor: "text-purple-500",
    bgPattern: "bg-purple-50",
    category: "التصميم والهوية"
  }
];

const PaymentDialog = ({ offer, trigger }: { offer: any; trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'paylink' | 'stc_pay'>('paylink');
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
      const paymentFunction = selectedPaymentGateway === 'paylink' ? 'paylink-payment' : 'stc-pay';
      
      const payload = {
        amount: amount,
        currency: 'SAR',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        offer_title: offer.title,
        description: `دفع عرض: ${offer.title}`,
        ...(selectedPaymentGateway === 'paylink' ? { success_url: window.location.origin } : {})
      };
      const { data, error } = await supabase.functions.invoke(paymentFunction, {
        body: payload,
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
          // Security: Use React components instead of innerHTML for better XSS protection
          const modalContent = document.createElement('div');
          modalContent.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4';
          modalContent.onclick = () => modal.remove();
          
          const innerModal = document.createElement('div');
          innerModal.className = 'bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in';
          innerModal.dir = 'rtl';
          innerModal.onclick = (e) => e.stopPropagation();
          
          // Create content safely without innerHTML
          const header = document.createElement('div');
          header.className = 'bg-gradient-to-l from-orange-500 to-orange-600 text-white p-4 sm:p-6 text-center';
          header.innerHTML = `
            <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onclick="this.remove()">
              <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in" dir="rtl" onclick="event.stopPropagation()">
                
                <!-- Header Section - Responsive -->
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 lg:p-8 text-white text-center relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16"></div>
                  <div class="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
                  <div class="relative z-10">
                    <div class="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
                      <svg class="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
                      </svg>
                    </div>
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">تعليمات الدفع</h3>
                    <p class="text-green-100 text-base sm:text-lg font-medium">STC Pay</p>
                    <div class="mt-2 sm:mt-4 bg-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-2 inline-block">
                      <span class="text-xs sm:text-sm">• معاملة آمنة ومحمية •</span>
                    </div>
                  </div>
                </div>
                
                <!-- Content Section - Responsive -->
                <div class="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                  
                  <!-- Step 1 - Responsive -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-100 relative overflow-hidden">
                    <div class="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">1</div>
                    <div class="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-200/30 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
                    <div class="relative z-10 mr-8 sm:mr-12">
                      <h4 class="font-bold text-lg sm:text-xl text-blue-800 mb-1 sm:mb-2">افتح تطبيق STC Pay</h4>
                      <p class="text-blue-600 text-xs sm:text-sm">تأكد من تحديث التطبيق لآخر إصدار</p>
                    </div>
                  </div>
                  
                  <!-- Step 2 - Responsive -->
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-100 relative overflow-hidden">
                    <div class="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">2</div>
                    <div class="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-green-200/30 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
                    <div class="relative z-10 mr-8 sm:mr-12">
                      <h4 class="font-bold text-lg sm:text-xl text-green-800 mb-1 sm:mb-2">اختر "إرسال أموال"</h4>
                      <p class="text-green-600 text-xs sm:text-sm">من القائمة الرئيسية للتطبيق</p>
                    </div>
                  </div>
                  
                  <!-- Step 3 - Amount - Responsive -->
                  <div class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-100 relative overflow-hidden">
                    <div class="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">3</div>
                    <div class="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-200/30 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
                    <div class="relative z-10 mr-8 sm:mr-12">
                      <h4 class="font-bold text-lg sm:text-xl text-purple-800 mb-3 sm:mb-4">أرسل المبلغ التالي:</h4>
                      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-purple-200 shadow-lg">
                        <div class="text-center">
                          <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">${data.amount}</div>
                          <div class="text-base sm:text-lg text-purple-500 font-medium">${data.currency}</div>
                          <div class="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">إلى الرقم</div>
                          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mt-2 font-mono bg-gray-50 rounded-lg py-2 px-2 sm:px-4 border break-all">${data.merchant_number}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Step 4 - Reference - Responsive -->
                  <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-100 relative overflow-hidden">
                    <div class="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">4</div>
                    <div class="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-orange-200/30 rounded-full translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
                    <div class="relative z-10 mr-8 sm:mr-12">
                      <h4 class="font-bold text-lg sm:text-xl text-orange-800 mb-3 sm:mb-4">استخدم المرجع:</h4>
                      <div class="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-orange-200 shadow-lg">
                        <div class="text-center">
                          <div class="text-sm sm:text-base lg:text-lg font-bold text-gray-800 font-mono bg-gray-50 rounded-lg py-2 sm:py-3 px-2 sm:px-4 border break-all">${data.reference}</div>
                          <button onclick="navigator.clipboard.writeText('${data.reference}'); this.innerHTML='<span class=&quot;text-green-600&quot;>✓ تم النسخ!</span>'; setTimeout(() => this.innerHTML='نسخ المرجع', 2000)" 
                                  class="mt-2 sm:mt-3 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors w-full sm:w-auto">
                            نسخ المرجع
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Confirmation - Responsive -->
                  <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200 text-center">
                    <div class="w-10 sm:w-12 h-10 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg class="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">⏱️ سيتم تأكيد الدفع خلال</div>
                    <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">دقائق قليلة</div>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                      <div class="text-xs sm:text-sm text-green-700">ستصلك رسالة تأكيد فور إتمام العملية</div>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions - Responsive -->
                <div class="p-4 sm:p-6 bg-gray-50 border-t">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 order-2 sm:order-1">
                      إغلاق
                    </button>
                    <button onclick="navigator.clipboard.writeText('${data.merchant_number}'); this.innerHTML='<span class=&quot;text-white&quot;>✓ تم النسخ!</span>'; setTimeout(() => this.innerHTML='نسخ الرقم', 2000)" 
                            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg order-1 sm:order-2">
                      نسخ الرقم
                    </button>
                  </div>
                  
                  <!-- Support Info - Responsive -->
                  <div class="mt-3 sm:mt-4 text-center">
                    <div class="text-xs text-gray-500">هل تحتاج مساعدة؟</div>
                    <div class="text-xs sm:text-sm text-gray-600 font-medium">اتصل بنا على: 920000000</div>
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
              selectedPaymentGateway === 'paylink' ? 'البطاقة الائتمانية' : 'STC Pay'
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
                  id: 'paylink', 
                  name: 'البطاقة الائتمانية', 
                  description: 'مدى، فيزا، ماستركارد، أبل باي',
                  features: ['✓ يدعم مدى', '✓ فيزا وماستركارد', '✓ Apple Pay'],
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
                      `ادفع عبر ${selectedPaymentGateway === 'paylink' ? 'البطاقة الائتمانية' : 'STC Pay'} - ${offer.currentPrice} ر.س`
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-40 w-[28rem] h-[28rem] bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-warning/15 to-destructive/15 rounded-full blur-3xl animate-float-delayed" style={{ animationDelay: '6s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/4 text-primary/20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-32 left-1/4 text-accent/20 animate-float-delayed" style={{ animationDelay: '3s' }}>
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-16 text-secondary/20 animate-float" style={{ animationDelay: '5s' }}>
          <Crown className="w-7 h-7" />
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-full px-8 py-4 mb-8 border border-orange-200/50 animate-fade-in backdrop-blur-sm">
            <Gift className="w-6 h-6 text-orange-600 animate-bounce" />
            <span className="text-orange-600 font-bold text-lg">عروض حصرية ومحدودة - وفر حتى 61%</span>
            <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-scale-in leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              العروض الحالية
            </span>
            <br />
            <span className="text-foreground">المميزة والحصرية</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            اكتشف مجموعة من أفضل عروضنا الحصرية بأسعار استثنائية ولفترة محدودة. خدمات احترافية بجودة عالية وأسعار لا تُقاوم
          </p>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 hover:shadow-lg transition-all duration-300 group">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-bold text-green-700 mb-1">خصومات تصل إلى 61%</div>
              <div className="text-sm text-green-600">على جميع الخدمات</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300 group">
              <Timer className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-bold text-blue-700 mb-1">عروض محدودة الوقت</div>
              <div className="text-sm text-blue-600">أسرع قبل انتهاء المدة</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 hover:shadow-lg transition-all duration-300 group">
              <Crown className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-bold text-purple-700 mb-1">جودة احترافية مضمونة</div>
              <div className="text-sm text-purple-600">معايير عالمية</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 hover:shadow-lg transition-all duration-300 group">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-bold text-orange-700 mb-1">دعم فني متواصل</div>
              <div className="text-sm text-orange-600">24/7 طوال الأسبوع</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-muted-foreground font-medium">عميل راضٍ</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">1000+</div>
                <div className="text-muted-foreground font-medium">مشروع مكتمل</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-muted-foreground font-medium">دعم فني</div>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="inline-flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-5 h-5 text-destructive animate-pulse" />
              <span>العروض محدودة الوقت</span>
            </div>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>ضمان الجودة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Offers Grid - Mobile Responsive */}
      <section className="relative px-3 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {currentOffers.map((offer, index) => (
              <Card 
                key={offer.id} 
                className={`group relative overflow-hidden border border-white/30 shadow-lg bg-gradient-to-br ${offer.bgPattern} backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in hover-scale rounded-xl`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradientFrom}/20 ${offer.gradientTo}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                
                {/* Service-specific floating elements */}
                <div className="absolute top-4 left-4 opacity-30 animate-float">
                  <offer.icon className={`w-6 h-6 ${offer.accentColor}`} />
                </div>
                <div className="absolute bottom-4 right-4 opacity-20 animate-float-delayed">
                  <Sparkles className={`w-4 h-4 ${offer.accentColor}`} />
                </div>

                <CardHeader className="relative z-10 pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="space-y-2">
                      <Badge 
                        className={`bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} text-white shadow-lg animate-bounce-gentle text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2`}
                      >
                        {offer.badge}
                      </Badge>
                      <div className="text-xs text-muted-foreground bg-white/50 rounded-full px-2 py-1 inline-block">
                        {offer.category}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground mb-1">
                        <Timer className="w-3 sm:w-4 h-3 sm:h-4 text-destructive animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium">باقي {offer.timeLeft}</span>
                      </div>
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        خصم {offer.discount}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${offer.gradientFrom}/20 ${offer.gradientTo}/20 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20`}>
                      <offer.icon className={`w-6 sm:w-8 h-6 sm:h-8 ${offer.accentColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                        {offer.title}
                      </CardTitle>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {offer.description}
                  </p>
                </CardHeader>

                <CardContent className="relative z-10 pt-0 p-4 sm:p-6">
                  {/* Enhanced Pricing Section - Mobile Optimized */}
                  <div className={`bg-gradient-to-r ${offer.gradientFrom}/10 ${offer.gradientTo}/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 shadow-inner backdrop-blur-sm`}>
                    <div className="flex items-end justify-between mb-3 sm:mb-4">
                      <div>
                        <div className="flex items-baseline gap-2 sm:gap-3">
                          <span className={`text-2xl sm:text-4xl font-bold ${offer.accentColor}`}>
                            {offer.currentPrice}
                          </span>
                          <span className="text-base sm:text-lg text-muted-foreground">ر.س</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base sm:text-lg text-muted-foreground line-through">
                            {offer.originalPrice} ر.س
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm text-muted-foreground">وفر</div>
                        <div className="text-base sm:text-xl font-bold text-success">
                          {(parseFloat(offer.originalPrice.replace(/,/g, '')) - parseFloat(offer.currentPrice.replace(/,/g, ''))).toLocaleString()} ر.س
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Features List - Mobile Optimized */}
                  <div className="space-y-3 mb-5 sm:mb-8">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 text-base sm:text-base mb-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      ما يشمله العرض:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {offer.features.slice(0, 5).map((feature, featureIndex) => (
                        <div 
                          key={featureIndex} 
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/20 transition-colors animate-fade-in bg-white/10 backdrop-blur-sm"
                          style={{ animationDelay: `${(index * 0.2) + (featureIndex * 0.1)}s` }}
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} rounded-full flex-shrink-0 mt-2`}></div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      {offer.features.length > 5 && (
                        <div className="text-sm text-muted-foreground text-center mt-2 opacity-70 bg-white/5 rounded-lg py-2">
                          +{offer.features.length - 5} مميزة إضافية
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Action Buttons - Mobile Optimized */}
                  <div className="grid grid-cols-1 gap-3">
                    <PaymentDialog 
                      offer={offer}
                      trigger={
                        <Button 
                          className={`w-full h-12 sm:h-14 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} hover:shadow-glow text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover-scale group border border-white/20`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <CreditCard className="w-5 h-5 group-hover:animate-bounce" />
                            <span>ادفع الآن</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Button>
                      }
                    />
                    
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = `/offer-details/${offer.id}`}
                      className="w-full h-12 sm:h-14 border-2 border-border hover:border-primary bg-background/50 hover:bg-primary/5 text-foreground font-medium text-base sm:text-lg rounded-xl transition-all duration-300 hover-scale group backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                        <span>عرض التفاصيل</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Offer Section */}
      <section className="relative px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-muted/50 to-background/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            
            <CardContent className="relative z-10 p-12 text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-3 mb-6 border border-primary/20">
                <Crown className="w-6 h-6 text-primary animate-bounce-gentle" />
                <span className="text-primary font-semibold">عرض مخصص</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                هل تحتاج عرض مخصص؟
              </h3>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                احصل على عرض مخصص يناسب احتياجاتك الخاصة مع أفضل الأسعار والخدمات المتميزة
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:shadow-glow text-white font-bold text-lg rounded-xl transition-all duration-300 hover-scale group"
                  onClick={() => window.open('https://wa.me/966502463367?text=أحتاج عرض مخصص', '_blank')}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                    <span>تواصل عبر الواتساب</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-14 px-8 border-2 border-primary hover:bg-primary/5 text-primary font-medium text-lg rounded-xl transition-all duration-300 hover-scale group"
                  onClick={() => window.open('tel:+966502463367', '_self')}
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 group-hover:animate-bounce" />
                    <span>اتصل الآن</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      
    </div>
  );
};

export default CurrentOffers;