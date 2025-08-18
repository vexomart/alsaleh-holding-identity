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

import { products, categories } from "@/components/software-products/ProductsData";

const SoftwareProducts = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
  const [loadingProducts, setLoadingProducts] = useState<{[key: number]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState("");

  const paymentMethods = [
    {
      id: 'paylink',
      name: '💳 البطاقة الائتمانية',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      description: 'مدى، فيزا، ماستركارد، أبل باي',
      emoji: '💳'
    }
  ];

  const handlePurchase = async (product: any) => {
    setLoadingProducts(prev => ({ ...prev, [product.id]: true }));
    
    const priceAmount = parseInt(product.price.replace(/[^\d]/g, ''));
    
    try {
      // Save order to database first (order_number will be auto-generated)
      const orderData = {
        customer_name: 'عميل شركة إمكان',
        customer_email: 'customer@emkan.sa',
        customer_phone: '966500000000',
        product_id: product.id,
        product_name: product.name,
        product_price: priceAmount,
        product_version: product.version || 'V 1.0',
        currency: 'SAR',
        status: 'pending',
        payment_method: 'paylink'
      };

      const { data: savedOrder, error: orderError } = await supabase
        .from('product_orders')
        .insert(orderData)
        .select('*')
        .single();

      if (orderError) {
        console.error('Error saving order:', orderError);
        toast({
          title: "❌ خطأ في حفظ الطلب",
          description: "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        return;
      }

      // Send notification emails
      const emailData = {
        orderId: savedOrder.id,
        orderNumber: savedOrder.order_number,
        customerName: savedOrder.customer_name,
        customerEmail: savedOrder.customer_email,
        customerPhone: savedOrder.customer_phone,
        productName: savedOrder.product_name,
        productPrice: savedOrder.product_price,
        productVersion: savedOrder.product_version,
        currency: savedOrder.currency,
        orderDate: savedOrder.created_at
      };

      // Send emails in background (don't wait for completion)
      supabase.functions.invoke('order-notifications', {
        body: { orderData: emailData }
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error('Error sending emails:', emailError);
        } else {
          console.log('Notification emails sent successfully');
        }
      });

      // Create payment session
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: priceAmount,
          currency: 'SAR',
          offer_title: product.name,
          description: `شراء منتج: ${product.name} - رقم الطلب: ${savedOrder.order_number}`,
          success_url: window.location.origin + '/payment-success?order=' + savedOrder.order_number
        }
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
        // Update order with payment reference
        await supabase
          .from('product_orders')
          .update({ 
            payment_reference: data?.transaction_id || data?.reference,
            status: 'payment_pending'
          })
          .eq('id', savedOrder.id);

        toast({
          title: "✅ تم إنشاء الطلب بنجاح",
          description: `رقم الطلب: ${savedOrder.order_number} - يتم توجيهكم لصفحة الدفع`,
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
      console.error('Purchase error:', error);
      toast({
        title: "❌ خطأ في العملية",
        description: "حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
    }
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

      <div className="container mx-auto px-4 lg:px-8 space-y-16">
        {/* Statistics Section */}
        <div className="mt-8">
          <ProductStats products={products} />
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
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
          {/* Section Header */}
          <div className="flex items-center justify-between py-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                🛍️ جميع المنتجات الحصرية
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                استكشف مجموعتنا المتنوعة من الحلول البرمجية المبتكرة
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold text-sm">
                {filteredProducts.length} منتج متاح
              </Badge>
            </div>
          </div>

          {/* Products Grid */}
          <div className="pt-8">
            {filteredProducts.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg">
                <CardContent className="p-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="w-36 h-36 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center animate-pulse shadow-inner">
                      <Package className="w-18 h-18 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-3">
                        😔 لا توجد منتجات متاحة
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500 text-lg">
                        🔍 جرب البحث بكلمات مفتاحية أخرى أو تصفح فئة مختلفة
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <ProductCard
                      product={product}
                      index={index}
                      isProductLoading={loadingProducts[product.id] || false}
                      onPurchase={handlePurchase}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="pb-16"></div>
      </div>

    </PageContainer>
  );
};

export default SoftwareProducts;