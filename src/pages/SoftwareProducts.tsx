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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-50/30 dark:from-primary/10 dark:via-slate-900 dark:to-slate-800 py-20 mb-12">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="relative container mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
            ✨ منتجاتنا الحصرية والمتطورة
            <Award className="w-5 h-5 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 animate-fade-in [animation-delay:200ms]">
            🚀 حلول برمجية{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              حصرية ومبتكرة
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms] mb-8">
            🎯 مجموعة من الحلول البرمجية المتطورة والجاهزة للاستخدام التي تلبي احتياجات الأعمال المختلفة بأحدث التقنيات والذكاء الاصطناعي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in [animation-delay:600ms]">
            <Button size="lg" className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-2xl text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300">
              🛍️ استكشف المنتجات الحصرية
              <ArrowRight className="w-5 h-5 mr-2 animate-pulse" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-500/5 text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              <Play className="w-5 h-5 ml-2 animate-bounce" />
              🎬 شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 space-y-12">
        {/* Statistics */}
        <ProductStats products={products} />

        {/* Filters & Search */}
        <ProductFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        {/* Products Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              🛍️ جميع المنتجات الحصرية
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              استكشف مجموعتنا المتنوعة من الحلول البرمجية المبتكرة
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold">
              {filteredProducts.length} منتج متاح
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          {filteredProducts.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl">
              <CardContent className="p-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-32 h-32 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center animate-pulse">
                    <Package className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                      😔 لا توجد منتجات متاحة
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500">
                      🔍 جرب البحث بكلمات مفتاحية أخرى أو تصفح فئة مختلفة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isProductLoading={loadingProducts[product.id] || false}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          )}
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