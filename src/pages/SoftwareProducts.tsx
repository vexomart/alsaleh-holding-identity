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
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-24">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="w-5 h-5" />
            منتجاتنا الرقمية المتميزة
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              مواقع ومتاجر
            </span>{" "}
            احترافية
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            احصل على حلول رقمية متكاملة وجاهزة للاستخدام مع ضمان الجودة والأمان
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
              استكشف المنتجات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="w-5 h-5 ml-2" />
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-16 space-y-16">
        {/* Statistics */}
        <ProductStats products={products} />

        {/* Filters & Search */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
          <ProductFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Products Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              منتجاتنا الرقمية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة متنوعة من الحلول الرقمية المتطورة لتلبية احتياجات عملك
            </p>
            <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 rounded-full">
              {filteredProducts.length} منتج متاح
            </Badge>
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-dashed border-2">
              <CardContent className="p-16 text-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                      لا توجد منتجات متاحة
                    </h3>
                    <p className="text-muted-foreground">
                      جرب البحث بكلمات مفتاحية أخرى أو تصفح فئة مختلفة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Product Icon & Status */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {product.icon && <product.icon className="w-8 h-8 text-primary" />}
                      </div>
                      <Badge 
                        className={`${
                          product.status === 'متوفر' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : product.status === 'قريباً'
                            ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                        } px-3 py-1 rounded-full border font-medium`}
                      >
                        {product.status}
                      </Badge>
                    </div>

                    {/* Product Title & Description */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      <h4 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        المميزات الحصرية:
                      </h4>
                      <div className="space-y-2">
                        {product.features?.slice(0, 4).map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between">
                        <div>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {product.price}
                            </span>
                            <span className="text-sm text-muted-foreground">ريال</span>
                          </div>
                        </div>
                        {product.discount && (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                            خصم {product.discount}
                          </Badge>
                        )}
                      </div>
                      {product.estimatedDelivery && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          التسليم خلال {product.estimatedDelivery}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handlePurchase(product)}
                        disabled={product.status !== 'متوفر' || loadingProducts[product.id]}
                        className={`w-full ${
                          product.status === 'متوفر'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                            : product.status === 'قريباً'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-not-allowed opacity-75'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-50'
                        } font-semibold py-3 rounded-xl transition-all duration-300 group-hover:scale-105`}
                      >
                        {loadingProducts[product.id] ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            جاري التحضير...
                          </div>
                        ) : product.status === 'متوفر' ? (
                          <>
                            <CreditCard className="w-4 h-4 ml-2" />
                            اطلب الآن
                          </>
                        ) : product.status === 'قريباً' ? (
                          'قريباً...'
                        ) : (
                          'غير متوفر'
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-primary/20 hover:bg-primary/5 text-primary font-medium py-3 rounded-xl"
                      >
                        معاينة مباشرة
                        <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    {/* Tags */}
                    {product.tags && (
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/50">
                        {product.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="bg-primary/5 text-primary/80 border-primary/10 text-xs px-2 py-1 rounded-md"
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

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-12 text-center border">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            هل تحتاج حلول مخصصة؟
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            نقدم حلول رقمية مخصصة تماماً لاحتياجات عملك مع فريق من الخبراء المتخصصين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
              طلب استشارة مجانية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline">
              تواصل معنا
            </Button>
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