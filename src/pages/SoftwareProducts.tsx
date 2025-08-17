import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  Sparkles,
  Award,
  ArrowRight,
  Play,
  Package,
  CreditCard,
  Wallet
} from "lucide-react";
import { ProductCard } from "@/components/software-products/ProductCard";
import { ProductFilters } from "@/components/software-products/ProductFilters";
import { ProductStats } from "@/components/software-products/ProductStats";
import { PaymentModal } from "@/components/software-products/PaymentModal";
import { products, categories } from "@/components/software-products/ProductsData";

const SoftwareProducts = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
  const [loadingProducts, setLoadingProducts] = useState<{[key: number]: boolean}>({});
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handlePaymentMethodSelect = async (methodId: string, product: any) => {
    setShowPaymentMethods(false);
    setSelectedProduct(null);
    
    toast({
      title: "🚀 جاري التحضير...",
      description: "يتم تحضير صفحة الدفع الآمنة",
    });

    setLoadingProducts(prev => ({ ...prev, [product.id]: true }));
    
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
      setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
    setShowPaymentMethods(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "جميع المنتجات" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer showNavigation showFooter>
      {/* Hero Section - World-Class Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
        </div>
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>
        
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          {/* Badge with Animation */}
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-8 py-4 rounded-full text-sm font-medium mb-12 border border-primary/20 animate-fade-in hover-scale cursor-pointer">
            <Sparkles className="w-5 h-5 animate-[spin_3s_ease-in-out_infinite]" />
            منتجاتنا الرقمية المتميزة
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          
          {/* Main Title with Staggered Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 animate-fade-in [animation-delay:200ms]">
            <span className="inline-block animate-[fade-in_0.6s_ease-out_0.2s_both]">مواقع</span>{" "}
            <span className="inline-block bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-[fade-in_0.6s_ease-out_0.4s_both]">
              ومتاجر
            </span>{" "}
            <span className="inline-block animate-[fade-in_0.6s_ease-out_0.6s_both]">احترافية</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in [animation-delay:800ms]">
            حلول رقمية متكاملة وجاهزة للاستخدام مع أحدث التقنيات والتصميمات العالمية
          </p>
          
          {/* Action Buttons with Advanced Animation */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in [animation-delay:1000ms]">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white shadow-2xl px-10 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:shadow-primary/25 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                استكشف المنتجات
                <ArrowRight className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-primary/30 hover:bg-primary/5 backdrop-blur-sm px-10 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 hover:border-primary/50"
            >
              <Play className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:scale-110" />
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-20 space-y-20">
        {/* Statistics with Advanced Animation */}
        <div className="animate-fade-in [animation-delay:1200ms]">
          <ProductStats products={products} />
        </div>

        {/* Filters & Search with Glass Effect */}
        <div className="relative animate-fade-in [animation-delay:1400ms]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-card/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <ProductFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Products Section Header */}
        <div className="text-center space-y-6 animate-fade-in [animation-delay:1600ms]">
          <div className="inline-flex items-center gap-2 text-primary/70 text-sm font-medium mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <span>منتجاتنا الرقمية</span>
            <div className="w-8 h-px bg-gradient-to-r from-primary via-transparent to-transparent"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              حلول رقمية عالمية المستوى
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            مجموعة متنوعة من الحلول الرقمية المتطورة المصممة بأحدث التقنيات العالمية
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary px-6 py-3 rounded-full font-bold text-lg border border-primary/20">
              {filteredProducts.length} منتج متاح
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">محدث باستمرار</span>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="space-y-8">
          {filteredProducts.length === 0 ? (
            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-dashed border-2 animate-fade-in [animation-delay:1800ms]">
              <CardContent className="p-20 text-center">
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="w-40 h-40 bg-gradient-to-r from-muted/30 to-muted/10 rounded-full flex items-center justify-center animate-pulse">
                      <Package className="w-20 h-20 text-muted-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-muted-foreground">
                      لا توجد منتجات متاحة
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-md">
                      جرب البحث بكلمات مفتاحية أخرى أو تصفح فئة مختلفة من منتجاتنا المتميزة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm hover:-translate-y-2 animate-fade-in`}
                  style={{ animationDelay: `${1800 + index * 100}ms` }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <CardContent className="p-10 relative z-10">
                    {/* Product Icon & Status with Enhanced Animation */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="relative group-hover:scale-110 transition-all duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-blue-500/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          {product.icon && <product.icon className="w-10 h-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-500" />}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/30 rounded-full animate-ping group-hover:animate-pulse"></div>
                      </div>
                      <Badge 
                        className={`${
                          product.status === 'متوفر' 
                            ? 'bg-green-500/15 text-green-600 border-green-500/30 shadow-green-500/20' 
                            : product.status === 'قريباً'
                            ? 'bg-orange-500/15 text-orange-600 border-orange-500/30 shadow-orange-500/20'
                            : 'bg-red-500/15 text-red-600 border-red-500/30 shadow-red-500/20'
                        } px-4 py-2 rounded-full border font-bold shadow-lg transition-all duration-300 group-hover:scale-105`}
                      >
                        {product.status}
                      </Badge>
                    </div>

                    {/* Product Title & Description with Animation */}
                    <div className="space-y-5 mb-8">
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-all duration-500 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground/80 transition-colors duration-500">
                        {product.description}
                      </p>
                    </div>

                    {/* Enhanced Features Section */}
                    <div className="space-y-4 mb-10">
                      <h4 className="text-sm font-bold text-foreground/90 flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        المميزات الحصرية:
                      </h4>
                      <div className="space-y-3">
                        {product.features?.slice(0, 4).map((feature: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-4 text-sm group-hover:translate-x-1 transition-transform duration-300"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-500 rounded-full flex-shrink-0 shadow-lg"></div>
                            <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Price Section */}
                    <div className="space-y-5 mb-10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through block">
                              {product.originalPrice}
                            </span>
                          )}
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                              {product.price}
                            </span>
                            <span className="text-lg text-muted-foreground font-medium">ريال</span>
                          </div>
                        </div>
                        {product.discount && (
                          <Badge className="bg-gradient-to-r from-red-500/15 to-red-600/15 text-red-600 border-red-500/30 px-4 py-2 rounded-xl font-bold shadow-lg">
                            خصم {product.discount}
                          </Badge>
                        )}
                      </div>
                      {product.estimatedDelivery && (
                        <div className="text-sm text-muted-foreground flex items-center gap-3 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">التسليم خلال {product.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="space-y-4 mb-8">
                      <Button 
                        onClick={() => handlePurchase(product)}
                        disabled={product.status !== 'متوفر' || loadingProducts[product.id]}
                        className={`group relative w-full overflow-hidden ${
                          product.status === 'متوفر'
                            ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white shadow-2xl shadow-green-500/25'
                            : product.status === 'قريباً'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-not-allowed opacity-75'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-50'
                        } font-bold py-4 px-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          {loadingProducts[product.id] ? (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              جاري التحضير...
                            </div>
                          ) : product.status === 'متوفر' ? (
                            <>
                              <CreditCard className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
                              اطلب الآن
                            </>
                          ) : product.status === 'قريباً' ? (
                            'قريباً...'
                          ) : (
                            'غير متوفر'
                          )}
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="group w-full border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-primary font-bold py-4 px-6 rounded-2xl transition-all duration-500 hover:scale-105 backdrop-blur-sm"
                      >
                        <span className="flex items-center justify-center">
                          معاينة مباشرة
                          <Play className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>

                    {/* Enhanced Tags */}
                    {product.tags && (
                      <div className="flex flex-wrap gap-3 pt-8 border-t border-border/30">
                        {product.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="bg-primary/10 text-primary/90 border-primary/20 text-xs px-3 py-2 rounded-xl font-medium hover:bg-primary/20 transition-colors duration-300 cursor-pointer"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Call to Action Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-16 text-center border border-primary/20 shadow-2xl animate-fade-in [animation-delay:2000ms]">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse [animation-delay:1s]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-foreground">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  هل تحتاج حلول مخصصة؟
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نقدم حلول رقمية مخصصة تماماً لاحتياجات عملك مع فريق من الخبراء المتخصصين في أحدث التقنيات العالمية
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-2xl px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-primary/25"
              >
                <span className="relative z-10 flex items-center">
                  طلب استشارة مجانية
                  <ArrowRight className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="group border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-500 hover:scale-105"
              >
                تواصل معنا
                <div className="w-2 h-2 bg-primary rounded-full ml-3 animate-pulse"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        selectedProduct={selectedProduct}
        paymentMethods={paymentMethods}
        onPaymentMethodSelect={handlePaymentMethodSelect}
      />
    </PageContainer>
  );
};

export default SoftwareProducts;