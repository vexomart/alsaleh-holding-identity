import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft,
  CheckCircle, 
  Star,
  Quote,
  Calendar,
  Users,
  Award,
  Zap,
  Target,
  Sparkles,
  Crown,
  Globe,
  ShoppingBag,
  TrendingUp,
  Palette,
  Clock,
  Shield,
  Headphones,
  Rocket,
  Heart,
  ChevronRight,
  Play,
  Download,
  Share2,
  MessageCircle,
  Phone,
  Timer,
  Send,
  CreditCard,
  Loader2
} from "lucide-react";

// بيانات العروض (يجب أن تتطابق مع CurrentOffers.tsx)
const offersData = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    shortDescription: "تصميم وتطوير موقع إلكتروني احترافي متكامل مع لوحة تحكم إدارية وتحسين محركات البحث",
    fullDescription: "حلول ويب شاملة تجمع بين التصميم العصري والوظائف المتقدمة لإنشاء موقع إلكتروني يمثل علامتك التجارية بأفضل شكل ويحقق أهدافك التجارية بكفاءة عالية.",
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
    workSteps: [
      { title: "التخطيط والدراسة", duration: "3-5 أيام", description: "تحليل المتطلبات ووضع خطة العمل" },
      { title: "التصميم والمراجعة", duration: "7-10 أيام", description: "إنشاء التصاميم والحصول على موافقتك" },
      { title: "التطوير والبرمجة", duration: "10-14 يوم", description: "تطوير الموقع وفقاً للتصاميم المعتمدة" },
      { title: "الاختبار والتسليم", duration: "2-3 أيام", description: "اختبار شامل وتسليم المشروع" }
    ],
    badge: "الأكثر طلباً",
    icon: Globe,
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    accentColor: "text-blue-500",
    bgPattern: "bg-blue-50",
    category: "تطوير الويب",
    galleryImages: [
      "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png",
      "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png",
      "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png"
    ]
  },
  {
    id: 2,
    title: "تصميم متجر إلكتروني متكامل",
    shortDescription: "متجر إلكتروني احترافي ومتكامل مع نظام إدارة المنتجات والمبيعات وبوابات الدفع المتعددة",
    fullDescription: "منصة تجارة إلكترونية شاملة تمكنك من بيع منتجاتك وخدماتك عبر الإنترنت بكفاءة عالية مع نظام إدارة متقدم وأدوات تسويقية فعالة.",
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
    workSteps: [
      { title: "تحليل المتطلبات", duration: "2-3 أيام", description: "دراسة نوع المنتجات وآلية العمل" },
      { title: "تصميم واجهة المتجر", duration: "5-7 أيام", description: "تصميم صفحات المتجر والمنتجات" },
      { title: "تطوير النظام", duration: "12-15 يوم", description: "برمجة المتجر وربط بوابات الدفع" },
      { title: "التدريب والتسليم", duration: "2-3 أيام", description: "تدريب على النظام وتسليم المشروع" }
    ],
    badge: "عرض محدود",
    icon: ShoppingBag,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    accentColor: "text-orange-500",
    bgPattern: "bg-orange-50",
    category: "التجارة الإلكترونية",
    galleryImages: [
      "/lovable-uploads/2f45c50e-e8b3-44e1-97f1-5923f0084b17.png",
      "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png",
      "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png"
    ]
  },
  {
    id: 3,
    title: "باقة التسويق الرقمي المتكاملة",
    shortDescription: "خطة تسويق رقمي شاملة لزيادة المبيعات والوصول للعملاء المستهدفين مع حملات إعلانية فعالة",
    fullDescription: "استراتيجية تسويق رقمي متكاملة تضمن وصولك لجمهورك المستهدف وتحقيق أعلى معدلات التحويل والمبيعات من خلال خطة مدروسة ومحترفة.",
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
    workSteps: [
      { title: "دراسة السوق والمنافسين", duration: "3-5 أيام", description: "تحليل السوق ووضع الاستراتيجية" },
      { title: "إعداد الحملات", duration: "5-7 أيام", description: "تصميم المحتوى وإعداد الحملات" },
      { title: "تنفيذ ومتابعة", duration: "شهري", description: "تنفيذ الحملات والمتابعة المستمرة" },
      { title: "التقييم والتحسين", duration: "مستمر", description: "تحليل النتائج وتحسين الأداء" }
    ],
    badge: "عرض محدود",
    icon: TrendingUp,
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    accentColor: "text-green-500",
    bgPattern: "bg-green-50",
    category: "التسويق الرقمي",
    galleryImages: [
      "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png",
      "/lovable-uploads/2f45c50e-e8b3-44e1-97f1-5923f0084b17.png",
      "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png"
    ]
  },
  {
    id: 4,
    title: "حزمة الهوية البصرية الشاملة",
    shortDescription: "تصميم هوية بصرية متكاملة تعكس قيم وشخصية علامتك التجارية مع جميع المطبوعات",
    fullDescription: "هوية بصرية احترافية ومميزة تعكس شخصية علامتك التجارية وتميزها في السوق مع جميع التطبيقات والمطبوعات اللازمة.",
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
    workSteps: [
      { title: "البحث والاستكشاف", duration: "2-3 أيام", description: "دراسة العلامة التجارية والسوق" },
      { title: "تطوير المفاهيم", duration: "3-5 أيام", description: "تطوير أفكار وتصاميم أولية" },
      { title: "تصميم الهوية", duration: "5-7 أيام", description: "تصميم الشعار والهوية الكاملة" },
      { title: "التطبيق والتسليم", duration: "3-5 أيام", description: "تطبيق الهوية وتسليم الملفات" }
    ],
    badge: "توفير 40%",
    icon: Palette,
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    accentColor: "text-purple-500",
    bgPattern: "bg-purple-50",
    category: "التصميم والهوية",
    galleryImages: [
      "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png",
      "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png",
      "/lovable-uploads/2f45c50e-e8b3-44e1-97f1-5923f0084b17.png"
    ]
  }
];


const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offer, setOffer] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const foundOffer = offersData.find(o => o.id === parseInt(id || '1'));
    if (foundOffer) {
      setOffer(foundOffer);
    } else {
      navigate('/current-offers');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTapPayment = async () => {
    if (!paymentData.name || !paymentData.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentLoading(true);
    try {
      const amount = parseFloat(offer.currentPrice.replace(/,/g, ''));
      
      const { data, error } = await supabase.functions.invoke('tap-payment', {
        body: {
          amount: amount,
          currency: 'SAR',
          customer_name: paymentData.name,
          customer_email: paymentData.email,
          customer_phone: paymentData.phone,
          offer_title: offer.title,
          description: `دفع عرض: ${offer.title}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.payment_url) {
        window.open(data.payment_url, '_blank');
        setIsPaymentOpen(false);
        toast({
          title: "تم إنشاء عملية الدفع",
          description: "سيتم فتح صفحة الدفع في نافذة جديدة",
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في عملية الدفع",
        description: error.message || "حدث خطأ أثناء إنشاء عملية الدفع",
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('offer-request', {
        body: {
          offer_id: offer.id,
          offer_title: offer.title,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_company: formData.company,
          message: formData.message
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن"
      });

      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      <Navigation />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Back Button */}
      <div className="relative pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/current-offers')}
            className="mb-6 animate-fade-in hover-scale"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للعروض
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={`bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} text-white shadow-lg animate-bounce-gentle`}>
                  {offer.badge}
                </Badge>
                <Badge variant="destructive" className="animate-pulse">
                  خصم {offer.discount}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Timer className="w-4 h-4 text-destructive animate-pulse" />
                  <span className="text-sm">باقي {offer.timeLeft}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6">
                {offer.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {offer.fullDescription}
              </p>

              {/* Pricing */}
              <div className={`bg-gradient-to-r ${offer.gradientFrom}/10 ${offer.gradientTo}/10 rounded-2xl p-6 mb-8 border border-white/20 shadow-inner backdrop-blur-sm`}>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className={`text-5xl font-bold ${offer.accentColor}`}>
                        {offer.currentPrice}
                      </span>
                      <span className="text-xl text-muted-foreground">ر.س</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-muted-foreground line-through">
                        {offer.originalPrice} ر.س
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">وفر</div>
                    <div className="text-2xl font-bold text-success">
                      {(parseFloat(offer.originalPrice.replace(/,/g, '')) - parseFloat(offer.currentPrice.replace(/,/g, ''))).toLocaleString()} ر.س
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className={`flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-glow text-white font-bold text-lg rounded-xl transition-all duration-300 hover-scale group`}
                    >
                      <Crown className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                      ادفع الآن
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl">
                        الدفع عبر تاب 💳
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
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
                          <Label htmlFor="payment-name">الاسم الكامل *</Label>
                          <Input
                            id="payment-name"
                            name="name"
                            type="text"
                            value={paymentData.name}
                            onChange={handlePaymentInputChange}
                            placeholder="أدخل اسمك الكامل"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="payment-email">البريد الإلكتروني *</Label>
                          <Input
                            id="payment-email"
                            name="email"
                            type="email"
                            value={paymentData.email}
                            onChange={handlePaymentInputChange}
                            placeholder="example@email.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="payment-phone">رقم الجوال</Label>
                          <Input
                            id="payment-phone"
                            name="phone"
                            type="tel"
                            value={paymentData.phone}
                            onChange={handlePaymentInputChange}
                            placeholder="05xxxxxxxx"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* Payment Button */}
                      <Button
                        onClick={handleTapPayment}
                        disabled={isPaymentLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg font-bold"
                      >
                        {isPaymentLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                            جاري المعالجة...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 ml-2" />
                            ادفع {offer.currentPrice} ر.س
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
                
                <Button 
                  variant="outline"
                  className="flex-1 h-14 border-2 border-primary hover:bg-primary/5 text-primary font-medium text-lg rounded-xl transition-all duration-300 hover-scale group"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <MessageCircle className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                  لديك مشروع مختلف أو إضافات؟
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
              ما يشمله العرض
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              مميزات شاملة لضمان نجاح مشروعك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offer.features.map((feature: string, index: number) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in rounded-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${offer.gradientFrom}/20 ${offer.gradientTo}/20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <CheckCircle className={`w-6 h-6 ${offer.accentColor}`} />
                    </div>
                    <div>
                      <p className="text-muted-foreground leading-relaxed">{feature}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Work Steps */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-muted/20 to-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
              خطوات العمل
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              مراحل تنفيذ مشروعك بكل وضوح
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offer.workSteps.map((step: any, index: number) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in rounded-xl"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${offer.gradientFrom} ${offer.gradientTo} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {step.duration}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Form */}
      <section id="contact-form" className="relative px-6 py-20 bg-gradient-to-r from-muted/20 to-background/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
              اطلب عرضك الآن
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              املأ النموذج وسنتواصل معك خلال 24 ساعة
            </p>
          </div>

          <Card className="relative overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-background/95 to-muted/30 backdrop-blur-sm animate-fade-in rounded-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="أدخل اسمك الكامل"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      رقم الجوال *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      className="h-12 bg-background/50 border-2 border-muted focus:border-primary transition-all duration-300 rounded-xl"
                      dir="ltr"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      اسم الشركة (اختياري)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="اسم شركتك أو مؤسستك"
                      className="h-12 bg-background/50 border-2 border-muted focus:border-primary transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    تفاصيل إضافية (اختياري)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="أضف أي تفاصيل أو متطلبات خاصة..."
                    className="min-h-32 bg-background/50 border-2 border-muted focus:border-primary transition-all duration-300 rounded-xl"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-14 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} hover:shadow-2xl text-white text-lg font-bold rounded-xl transition-all duration-300 hover-scale relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Send className="w-6 h-6" />
                      <span>إرسال الطلب</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default OfferDetails;