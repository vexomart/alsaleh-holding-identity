import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";
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

  const handlePurchase = async (product: any) => {
    setLoadingProducts(prev => ({ ...prev, [product.id]: true }));
    
    toast({
      title: "جاري معالجة طلب الدفع...",
      description: "يرجى الانتظار قليلاً"
    });
    
    try {
      const priceAmount = parseInt(product.price.replace(/[^\d]/g, ''));
      console.log('معلومات المنتج:', { name: product.name, price: product.price, amount: priceAmount });
      
      const payload = {
        amount: priceAmount,
        currency: 'SAR',
        customer_name: 'عميل المنتجات البرمجية',
        customer_email: 'customer@softwareproducts.com',
        customer_phone: '966500000000',
        offer_title: product.name,
        description: `شراء منتج: ${product.name} - ${product.description}`,
        product_details: {
          product_id: product.id,
          product_name: product.name,
          product_version: product.version || "V 1.0",
          category: product.category,
          features: product.features ? product.features.join(', ') : 'منتج برمجي متقدم'
        }
      };

      console.log('إرسال بيانات الدفع:', payload);

      const { data, error } = await supabase.functions.invoke('tap-payment', {
        body: payload
      });

      console.log('استجابة الدفع:', { data, error });

      if (error) {
        console.error('خطأ في الطلب:', error);
        throw new Error(error.message || 'فشل في إنشاء رابط الدفع');
      }

      if (data?.success && data?.payment_url) {
        toast({
          title: "تم إنشاء رابط الدفع بنجاح",
          description: "سيتم توجيهك إلى صفحة الدفع"
        });
        
        // التوجه إلى صفحة الدفع في نفس النافذة
        window.location.href = data.payment_url;
      } else {
        throw new Error(data?.error || 'لم يتم إرجاع رابط الدفع');
      }
    } catch (error) {
      console.error('خطأ في الدفع:', error);
      
      let errorMessage = "حدث خطأ أثناء عملية الدفع";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في الدفع",
        description: errorMessage,
        variant: "destructive",
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