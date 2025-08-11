import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Code, 
  Database, 
  Smartphone, 
  Monitor, 
  Shield, 
  Cloud,
  Layers,
  Zap,
  Download,
  Star,
  Users,
  Globe,
  ChevronRight,
  Package,
  Rocket,
  Car,
  Eye,
  TrendingUp,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle,
  Clock,
  Heart,
  Share2,
  Play,
  CreditCard,
  Banknote,
  Wallet,
  X
} from "lucide-react";

const SoftwareProducts = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("جميع المنتجات");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const paymentMethods = [
    {
      id: 'paylink',
      name: 'مدى • فيزا • أبل باي',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      description: 'الدفع عبر Paylink (مدى/فيزا/أبل باي)'
    },
    {
      id: 'tamara',
      name: 'تمارا',
      icon: Wallet,
      color: 'from-purple-500 to-purple-600',
      description: 'اشتري الآن وادفع لاحقاً'
    },
    {
      id: 'stc-pay',
      name: 'STC Pay',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      description: 'دفع عبر STC Pay'
    }
  ];

  const handlePaymentMethodSelect = async (methodId: string, productName: string) => {
    // إغلاق النافذة فوراً
    setShowPaymentMethods(false);
    setSelectedProduct(null);
    
    // رسالة فورية
    toast({
      title: "جاري التحضير...",
      description: "يتم تحضير صفحة الدفع",
    });

    setIsLoading(true);
    
    console.log('بدء عملية الدفع:', methodId, productName);

    try {
      let functionName = '';
      let paymentData = {};

      switch (methodId) {
        case 'paylink':
          functionName = 'paylink-payment';
          paymentData = {
            amount: 4999,
            currency: 'SAR',
            customer_name: 'عميل',
            customer_email: 'customer@example.com',
            customer_phone: '966500000000',
            offer_title: productName,
            description: `شراء منتج: ${productName}`,
            success_url: window.location.origin
          };
          break;
        case 'tamara':
          functionName = 'tamara-payment';
          paymentData = {
            order_reference_id: `order_${Date.now()}`,
            total_amount: {
              amount: 4999,
              currency: 'SAR'
            },
            description: `شراء منتج: ${productName}`,
            country_code: 'SA',
            payment_type: 'PAY_BY_INSTALMENTS',
            instalments: 4,
            consumer: {
              first_name: 'عميل',
              last_name: 'تجريبي',
              phone_number: '966500000000',
              email: 'customer@example.com'
            },
            merchant_url: {
              success: `${window.location.origin}/payment-success`,
              failure: `${window.location.origin}/payment-cancel`,
              cancel: `${window.location.origin}/payment-cancel`,
              notification: `${window.location.origin}/api/tamara-webhook`
            },
            items: [{
              name: productName,
              type: 'Digital',
              reference_id: `item_${Date.now()}`,
              sku: 'DIGITAL-001',
              quantity: 1,
              total_amount: {
                amount: 4999,
                currency: 'SAR'
              }
            }]
          };
          break;
        case 'stc-pay':
          functionName = 'stc-pay';
          paymentData = {
            amount: 4999,
            currency: 'SAR',
            description: `شراء منتج: ${productName}`,
            customer_name: 'عميل',
            customer_email: 'customer@example.com',
            customer_phone: '966500000000'
          };
          break;
        default:
          throw new Error('طريقة دفع غير مدعومة');
      }

      console.log('إرسال البيانات:', paymentData);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: paymentData
      });
      
      console.log('استجابة الدفع:', data, error);

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "خطأ في الدفع",
          description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        return;
      }

      // Handle different response formats
      let paymentUrl = null;
      if (data?.payment_url) {
        paymentUrl = data.payment_url;
      } else if (data?.transactionUrl) {
        paymentUrl = data.transactionUrl;
      } else if (data?.checkout_url) {
        paymentUrl = data.checkout_url;
      } else if (data?.url) {
        paymentUrl = data.url;
      }

      if (paymentUrl) {
        // رسالة نجاح وفتح الصفحة في نفس النافذة
        toast({
          title: "تم تحضير رابط الدفع ✅",
          description: "يتم فتح صفحة الدفع الآن",
        });
        
        // فتح صفحة الدفع في نفس النافذة
        console.log('فتح صفحة الدفع:', paymentUrl);
        window.location.href = paymentUrl;
      } else {
        console.error('No payment URL in response:', data);
        toast({
          title: "خطأ في الدفع",
          description: "لم يتم الحصول على رابط الدفع. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
    setShowPaymentMethods(true);
  };

  const products = [
    {
      id: 1,
      name: "موقع تأجير السيارات",
      description: "موقع تعريفي متكامل لشركة تأجير سيارات مع نظام حجز ذكي وواجهة مستخدم احترافية",
      category: "المواقع التعريفية",
      icon: Car,
      features: ["تصميم احترافي متجاوب", "نظام حجز متطور", "عرض أسطول السيارات", "إدارة العملاء"],
      price: "4999 ريال",
      rating: 4.9,
      downloads: "0",
      status: "متاح الآن",
      color: "from-blue-500 to-cyan-500",
      demoUrl: "/car-rental-landing",
      tags: ["React", "TypeScript", "Responsive"],
      isNew: true,
      isFeatured: true
    }
  ];

  const categories = ["جميع المنتجات", "المواقع التعريفية", "تطبيقات الموبايل", "أنظمة الإدارة"];
  
  const stats = [
    {
      title: "إجمالي المنتجات",
      value: "1",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "المنتجات المتاحة",
      value: "1",
      icon: Zap,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-700 dark:text-green-300"
    },
    {
      title: "المبيعات",
      value: "4999 ر.س",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-700 dark:text-purple-300"
    },
    {
      title: "متوسط التقييم",
      value: "4.9",
      icon: Star,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-700 dark:text-orange-300"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "تحت التطوير":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  const filteredProducts = selectedCategory === "جميع المنتجات" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <PageContainer showNavigation showFooter>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-50/30 dark:from-primary/10 dark:via-slate-900 dark:to-slate-800 py-20 mb-12">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="relative container mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            منتجاتنا البرمجية المتطورة
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in [animation-delay:200ms]">
            حلول برمجية{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              مبتكرة
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms]">
            مجموعة من الحلول البرمجية المتطورة والجاهزة للاستخدام التي تلبي احتياجات الأعمال المختلفة بأحدث التقنيات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in [animation-delay:600ms]">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg">
              استكشف المنتجات
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Play className="w-4 h-4 ml-2" />
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 space-y-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${stat.textColor} text-sm font-medium mb-1`}>
                        {stat.title}
                      </p>
                      <p className={`${stat.valueColor} text-2xl font-bold`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${selectedCategory === category 
                  ? "bg-gradient-to-r from-primary to-blue-600 shadow-lg" 
                  : "hover:bg-primary/5"
                }`}
              >
                <Filter className="w-4 h-4 ml-2" />
                {category}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              className="pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-800">
                <CardContent className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        لا توجد منتجات في هذه الفئة
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                        نحن نعمل على تطوير منتجات برمجية مبتكرة. سيتم عرضها هنا قريباً
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-blue-600">
                      تصفح جميع المنتجات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProducts.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-slate-800 overflow-hidden hover:-translate-y-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-4 relative">
                    {product.isNew && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        جديد
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Award className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                    
                    <div className="flex items-start justify-between mb-6 mt-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${product.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(product.status)} px-3 py-1`}>
                        <CheckCircle className="w-3 h-3 ml-1" />
                        {product.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-2">
                      {product.name}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {product.category}
                      </Badge>
                      <div className="flex gap-1">
                        {product.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {product.description}
                    </CardDescription>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        المميزات الرئيسية:
                      </h4>
                      <ul className="space-y-2">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    {product.status === "متاح الآن" && (
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} />
                            ))}
                          </div>
                          <span className="font-medium">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>معاينة متاحة</span>
                        </div>
                      </div>
                    )}

                    {/* Price & Actions */}
                    <div className="space-y-4 pt-4">
                      <div className="text-center bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-slate-800 p-4 rounded-xl">
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                          {product.price}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">سعر لمرة واحدة</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {product.demoUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(product.demoUrl, '_blank')}
                            className="hover:bg-primary/5 hover:border-primary/20"
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            معاينة
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(product)}
                          disabled={product.status !== "متاح الآن" || isLoading}
                          className={`${product.status === "متاح الآن" 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" 
                            : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? (
                            <Clock className="w-4 h-4 ml-1 animate-spin" />
                          ) : (
                            <TrendingUp className="w-4 h-4 ml-1" />
                          )}
                          {product.status === "متاح الآن" ? (isLoading ? "جاري المعالجة..." : "ادفع الآن") : "قريباً"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 pt-2">
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-primary">
                          <Heart className="w-4 h-4 ml-1" />
                          إضافة للمفضلة
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-primary">
                          <Share2 className="w-4 h-4 ml-1" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-indigo-50/30 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 border-primary/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
          <CardContent className="p-12 text-center relative">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Rocket className="w-4 h-4" />
                خدمات مخصصة
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                هل تحتاج حلول برمجية{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  مخصصة؟
                </span>
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                نحن نقدم خدمات تطوير برمجيات مخصصة لتلبية احتياجات عملك الفريدة بأحدث التقنيات وأفضل الممارسات
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg">
                  طلب استشارة مجانية
                  <ChevronRight className="w-4 h-4 mr-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                  تواصل مع فريق التطوير
                  <Code className="w-4 h-4 mr-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">تطوير مخصص</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">حلول برمجية مصممة خصيصاً لعملك</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">تسليم سريع</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">تطوير وتسليم في أسرع وقت ممكن</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">جودة عالية</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">معايير جودة عالمية في التطوير</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Dialog */}
      <Dialog open={showPaymentMethods} onOpenChange={setShowPaymentMethods}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-slate-900 dark:text-white">
              اختر طريقة الدفع
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedProduct?.name}
              </h3>
              <p className="text-2xl font-bold text-primary mt-2">
                {selectedProduct?.price}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant="outline"
                    onClick={() => handlePaymentMethodSelect(method.id, selectedProduct?.name)}
                    disabled={isLoading}
                    className="w-full p-4 h-auto flex items-center justify-between hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {method.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </Button>
                );
              })}
            </div>
            
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPaymentMethods(false);
                  setSelectedProduct(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default SoftwareProducts;