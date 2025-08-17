import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Sparkles,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Zap,
  Users,
  Globe,
  Smartphone,
  Palette,
  Settings,
  CheckCircle,
  Star,
  Download,
  CreditCard,
  Wallet,
  Eye,
  ExternalLink,
  Code,
  Layers,
  Cpu,
  Database,
  Rocket,
  Award,
  HeartHandshake,
  TrendingUp,
  Target,
  MonitorSpeaker,
  ShieldCheck,
  Headphones
} from "lucide-react";
import { products } from "@/components/software-products/ProductsData";
import { PaymentModal } from "@/components/software-products/PaymentModal";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const paymentMethods = [
    {
      id: 'paylink',
      name: '💳 البطاقة الائتمانية',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      description: 'مدى، فيزا، ماستركارد، أبل باي',
      emoji: '💳'
    },
    {
      id: 'tamara',
      name: '💎 تمارا',
      icon: Wallet,
      color: 'from-purple-500 to-purple-600',
      description: 'اشتري الآن وادفع لاحقاً',
      emoji: '💎'
    },
    {
      id: 'stc-pay',
      name: '📱 STC Pay',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      description: 'دفع عبر STC Pay',
      emoji: '📱'
    }
  ];

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id || '0'));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/software-products');
    }
  }, [id, navigate]);

  const handlePaymentMethodSelect = async (methodId: string, product: any) => {
    setShowPaymentMethods(false);
    
    toast({
      title: "🚀 جاري التحضير...",
      description: "يتم تحضير صفحة الدفع الآمنة",
    });

    setLoading(true);
    
    const priceAmount = parseInt(product.price.replace(/[^\d]/g, ''));
    
    try {
      let functionName = '';
      let paymentData = {};

      switch (methodId) {
        case 'paylink':
          functionName = 'paylink-payment';
          paymentData = {
            amount: priceAmount,
            currency: 'SAR',
            customer_name: 'عميل إمكان',
            customer_email: 'customer@emkan.sa',
            customer_phone: '966500000000',
            offer_title: product.name,
            description: `🛍️ شراء منتج حصري: ${product.name}`,
            success_url: window.location.origin
          };
          break;
        case 'tamara':
          functionName = 'tamara-payment';
          paymentData = {
            order_reference_id: `EMKAN_${Date.now()}`,
            total_amount: {
              amount: priceAmount,
              currency: 'SAR'
            },
            description: `💎 شراء منتج حصري: ${product.name}`,
            country_code: 'SA',
            payment_type: 'PAY_BY_INSTALMENTS',
            instalments: 4,
            consumer: {
              first_name: 'عميل',
              last_name: 'إمكان',
              phone_number: '966500000000',
              email: 'customer@emkan.sa'
            },
            merchant_url: {
              success: `${window.location.origin}/payment-success`,
              failure: `${window.location.origin}/payment-cancel`,
              cancel: `${window.location.origin}/payment-cancel`,
              notification: `${window.location.origin}/api/tamara-webhook`
            },
            items: [{
              name: product.name,
              type: 'Digital',
              reference_id: `EMKAN_${Date.now()}`,
              sku: `EMKAN-${product.id}`,
              quantity: 1,
              total_amount: {
                amount: priceAmount,
                currency: 'SAR'
              }
            }]
          };
          break;
        case 'stc-pay':
          functionName = 'stc-pay';
          paymentData = {
            amount: priceAmount,
            currency: 'SAR',
            description: `📱 شراء منتج حصري: ${product.name}`,
            customer_name: 'عميل إمكان',
            customer_email: 'customer@emkan.sa',
            customer_phone: '966500000000'
          };
          break;
        default:
          throw new Error('طريقة دفع غير مدعومة');
      }
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: paymentData
      });

      if (error) {
        toast({
          title: "❌ خطأ في الدفع",
          description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        return;
      }

      let paymentUrl = data?.payment_url || data?.transactionUrl || data?.checkout_url || data?.url;

      if (paymentUrl) {
        toast({
          title: "✅ تم تحضير رابط الدفع بنجاح",
          description: "🔐 يتم فتح صفحة الدفع الآمنة الآن",
        });
        
        window.location.href = paymentUrl;
      } else {
        toast({
          title: "❌ خطأ في الدفع",
          description: "لم يتم الحصول على رابط الدفع. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    setShowPaymentMethods(true);
  };

  const handleDemo = () => {
    if (product?.demoUrl && product.demoUrl !== '#') {
      window.open(product.demoUrl, '_blank');
    } else {
      toast({
        title: "🚧 العرض التوضيحي",
        description: "العرض التوضيحي سيكون متاحاً قريباً",
      });
    }
  };

  if (!product) {
    return (
      <PageContainer showNavigation showFooter>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">جارٍ التحميل...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const IconComponent = product.icon;

  return (
    <PageContainer showNavigation showFooter>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-24">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Product Info */}
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                    {product.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-muted-foreground">تقييم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    <span className="font-bold">{product.downloads}</span>
                    <span className="text-muted-foreground">مبيعات</span>
                  </div>
                  <Badge 
                    className={`${
                      product.status === 'متوفر' || product.status === 'متاح الآن'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                    }`}
                  >
                    {product.status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handlePurchase}
                    disabled={product.status !== 'متوفر' && product.status !== 'متاح الآن' || loading}
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white shadow-2xl px-8 py-4 font-bold rounded-2xl transition-all duration-500 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-3"></div>
                          جاري التحضير...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 ml-3" />
                          اطلب الآن - {product.price}
                        </>
                      )}
                    </span>
                  </Button>
                  
                  <Button 
                    onClick={handleDemo}
                    size="lg"
                    variant="outline"
                    className="group border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 px-8 py-4 font-bold rounded-2xl transition-all duration-500 hover:scale-105"
                  >
                    <Eye className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
                    معاينة مباشرة
                  </Button>
                </div>
              </div>

              {/* Product Visual */}
              <div className="relative animate-fade-in [animation-delay:200ms]">
                <Card className="group relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-60"></div>
                  <CardContent className="p-16 relative z-10 text-center">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 via-primary/10 to-blue-500/20 rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="w-16 h-16 text-primary relative z-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{product.emoji} {product.name}</h3>
                    <p className="text-muted-foreground">متاح للتسليم {product.estimatedDelivery}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-20 space-y-20">
        {/* Features Section */}
        <div className="space-y-12 animate-fade-in [animation-delay:400ms]">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              <Sparkles className="inline w-8 h-8 text-primary ml-2" />
              المميزات الحصرية
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              اكتشف جميع المميزات المتطورة والتقنيات الحديثة المدمجة في هذا المنتج
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature: string, index: number) => {
              const icons = [Shield, Zap, Globe, Smartphone, Palette, Settings, Users, Code, Layers, Cpu, Database, Rocket];
              const FeatureIcon = icons[index % icons.length];
              
              return (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:-translate-y-2"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FeatureIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors duration-300">
                          {feature}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-12 animate-fade-in [animation-delay:800ms]">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              <Settings className="inline w-8 h-8 text-primary ml-2" />
              المواصفات التقنية
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تفاصيل شاملة حول التقنيات والأدوات المستخدمة في تطوير هذا المنتج
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card/95 to-card/90">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Code className="w-6 h-6 text-primary" />
                  التقنيات المستخدمة
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-lg font-medium hover:bg-primary/20 transition-colors duration-300"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-foreground">تصميم متجاوب 100%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-foreground">أمان عالي وحماية متقدمة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-foreground">أداء محسن وسرعة عالية</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-foreground">دعم فني متواصل</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card/95 to-card/90">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Rocket className="w-6 h-6 text-green-500" />
                  ما ستحصل عليه
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">ملفات المشروع كاملة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">دعم فني لمدة سنة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">تحديثات مجانية</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">تخصيص حسب الطلب</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MonitorSpeaker className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">تدريب على الاستخدام</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">ضمان الجودة</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">التسليم {product.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-16 text-center border border-primary/20 shadow-2xl animate-fade-in [animation-delay:1000ms]">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse [animation-delay:1s]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-foreground flex items-center justify-center gap-3">
                <Headphones className="w-10 h-10 text-primary" />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  دعم متميز ومتواصل
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نضمن لك دعماً فنياً متميزاً على مدار الساعة مع فريق من الخبراء المتخصصين لضمان نجاح مشروعك
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={handlePurchase}
                disabled={product.status !== 'متوفر' && product.status !== 'متاح الآن' || loading}
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-2xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-primary/25"
              >
                <span className="relative z-10 flex items-center">
                  {loading ? 'جاري التحضير...' : 'اطلب الآن'}
                  <ArrowRight className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
              
              <Button 
                onClick={() => navigate('/contact')}
                size="lg" 
                variant="outline" 
                className="group border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105"
              >
                تواصل معنا
                <ExternalLink className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        selectedProduct={product}
        paymentMethods={paymentMethods}
        onPaymentMethodSelect={handlePaymentMethodSelect}
      />
    </PageContainer>
  );
};

export default ProductDetails;