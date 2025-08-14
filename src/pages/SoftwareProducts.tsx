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
  X,
  Building,
  ShoppingCart,
  Settings,
  BarChart,
  Palette,
  Megaphone,
  Crown,
  Shirt
} from "lucide-react";

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

  const products = [
    {
      id: 1,
      name: "🚗 موقع تأجير السيارات الذكي",
      description: "موقع تعريفي متكامل لشركة تأجير سيارات مع نظام حجز ذكي وواجهة مستخدم احترافية وتصميم حصري",
      category: "المواقع التعريفية",
      icon: Car,
      features: [
        "🎨 تصميم احترافي متجاوب ومتحرك",
        "📱 نظام حجز ذكي وتفاعلي",
        "🚙 عرض أسطول السيارات بتقنية ثلاثية الأبعاد",
        "👥 إدارة العملاء والحجوزات",
        "🔒 نظام دفع آمن متكامل",
        "📊 تقارير مالية تفصيلية"
      ],
      price: "4999 ريال",
      originalPrice: "7999 ريال",
      rating: 4.9,
      downloads: "145",
      status: "متاح الآن",
      color: "from-blue-500 to-cyan-500",
      demoUrl: "/car-rental-landing",
      tags: ["React", "TypeScript", "Responsive", "AI-Powered"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "🚗",
      discount: "37%",
      estimatedDelivery: "فوري"
    },
    {
      id: 2,
      name: "🏗️ موقع شركة المقاولات العالمية",
      description: "موقع تعريفي متكامل لشركة مقاولات عالمية مع عرض احترافي للمشاريع والخدمات وأنيميشن متطور حصري",
      category: "المواقع التعريفية",
      icon: Building,
      features: [
        "🌍 تصميم عالمي احترافي متعدد اللغات",
        "🎞️ عرض المشاريع التفاعلي والمتحرك",
        "✨ أنيميشن متطور وحصري",
        "🗣️ نظام متعدد اللغات (عربي/إنجليزي)",
        "📋 نظام إدارة المحتوى المتقدم",
        "🖼️ معرض أعمال ديناميكي ثلاثي الأبعاد"
      ],
      price: "7000 ريال",
      originalPrice: "9999 ريال",
      rating: 5.0,
      downloads: "89",
      status: "متاح الآن",
      color: "from-emerald-500 to-teal-500",
      demoUrl: "/construction-website",
      tags: ["Global", "Construction", "Animated", "3D", "AI-Enhanced"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "🏗️",
      discount: "30%",
      estimatedDelivery: "فوري"
    },
    {
      id: 3,
      name: "📈 منصة التسويق الإلكتروني الذكية",
      description: "موقع متخصص في التسويق الإلكتروني والتجارة الرقمية مع أدوات تحليل متقدمة وذكاء اصطناعي",
      category: "التسويق الرقمي",
      icon: Megaphone,
      features: [
        "🤖 أدوات تحليل بالذكاء الاصطناعي",
        "📊 إدارة الحملات الإعلانية الذكية",
        "📱 التسويق عبر وسائل التواصل",
        "🔍 تحليل المنافسين المتقدم",
        "📈 تقارير مفصلة وتفاعلية",
        "💬 دعم فني متخصص على مدار الساعة"
      ],
      price: "5999 ريال",
      originalPrice: "8999 ريال",
      rating: 4.9,
      downloads: "234",
      status: "متاح الآن",
      color: "from-purple-500 to-pink-500",
      demoUrl: "/digital-marketing-website",
      tags: ["AI-Powered", "Marketing", "Analytics", "Social Media"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "📈",
      discount: "33%",
      estimatedDelivery: "فوري"
    },
    {
      id: 4,
      name: "🛍️ متجر البطاقات الإلكترونية الذكي",
      description: "متجر إلكتروني متطور لبيع البطاقات الرقمية مع نظام تحويل للواتساب وتصميم متجاوب وأنيميشن احترافي",
      category: "التجارة الإلكترونية",
      icon: ShoppingCart,
      features: [
        "🎮 مجموعة متنوعة من البطاقات الرقمية",
        "💬 تحويل تلقائي لواتساب للطلبات",
        "📱 تصميم متجاوب 100% مع جميع الأجهزة",
        "✨ أنيميشن وحركات احترافية متطورة",
        "🔍 نظام بحث وفلترة ذكي",
        "📊 إحصائيات تفاعلية ولوحة معلومات"
      ],
      price: "3999 ريال",
      originalPrice: "5999 ريال",
      rating: 4.9,
      downloads: "89",
      status: "متاح الآن",
      color: "from-green-500 to-emerald-500",
      demoUrl: "/cards-store",
      tags: ["E-commerce", "Cards", "WhatsApp", "Responsive"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "🛍️",
      discount: "33%",
      estimatedDelivery: "فوري"
    },
    {
      id: 5,
      name: "🛒 متجر إلكتروني ذكي",
      description: "متجر إلكتروني متكامل مع نظام إدارة المخزون والطلبات وبوابات دفع متعددة وذكاء اصطناعي",
      category: "التجارة الإلكترونية",
      icon: ShoppingCart,
      features: [
        "🛒 نظام سلة تسوق ذكي",
        "💳 بوابات دفع متعددة وآمنة",
        "📦 إدارة المخزون والطلبات",
        "🔍 محرك بحث ذكي بالذكاء الاصطناعي",
        "📱 تطبيق موبايل مجاني",
        "📊 تحليلات مبيعات متقدمة"
      ],
      price: "8999 ريال",
      originalPrice: "12999 ريال",
      rating: 4.8,
      downloads: "67",
      status: "قريباً",
      color: "from-green-500 to-emerald-500",
      demoUrl: "#",
      tags: ["E-commerce", "AI", "Mobile", "Analytics"],
      isNew: true,
      isFeatured: false,
      isExclusive: true,
      emoji: "🛒",
      discount: "30%",
      estimatedDelivery: "خلال أسبوع"
    },
    {
      id: 6,
      name: "🎨 منصة التصميم الإبداعي",
      description: "منصة متكاملة للتصميم الجرافيكي والإبداعي مع أدوات ذكية وقوالب حصرية",
      category: "التصميم والإبداع",
      icon: Palette,
      features: [
        "🎭 أدوات تصميم احترافية",
        "🖼️ قوالب حصرية وفريدة",
        "🤝 العمل التعاوني المتقدم",
        "☁️ حفظ سحابي آمن",
        "📐 أدوات قياس وتحليل",
        "🎯 تصدير بجودة عالية"
      ],
      price: "6999 ريال",
      originalPrice: "9999 ريال",
      rating: 4.7,
      downloads: "123",
      status: "قريباً",
      color: "from-pink-500 to-rose-500",
      demoUrl: "#",
      tags: ["Design", "Creative", "Collaborative", "Cloud"],
      isNew: true,
      isFeatured: false,
      isExclusive: true,
      emoji: "🎨",
      discount: "30%",
      estimatedDelivery: "خلال أسبوعين"
    },
    {
      id: 7,
      name: "📊 نظام إدارة الأعمال الذكي",
      description: "نظام إدارة شامل للأعمال مع لوحة تحكم ذكية وتقارير تفاعلية وذكاء اصطناعي",
      category: "أنظمة الإدارة",
      icon: BarChart,
      features: [
        "📈 لوحة تحكم ذكية وتفاعلية",
        "👥 إدارة الموظفين والرواتب",
        "💰 النظام المالي والمحاسبي",
        "📋 إدارة المشاريع والمهام",
        "📱 تطبيق موبايل مخصص",
        "🔔 تنبيهات ذكية وتلقائية"
      ],
      price: "12999 ريال",
      originalPrice: "17999 ريال",
      rating: 4.9,
      downloads: "45",
      status: "تحت التطوير",
      color: "from-indigo-500 to-purple-500",
      demoUrl: "#",
      tags: ["Business", "Management", "AI", "Mobile"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "📊",
      discount: "27%",
      estimatedDelivery: "خلال شهر"
    },
    {
      id: 8,
      name: "👑 متجر عبايتي",
      description: "متجر إلكتروني فاخر ومتكامل للعبايات العصرية مع تصميم عالمي مميز وتكامل مع الواتساب وتجربة تسوق استثنائية",
      category: "التجارة الإلكترونية",
      icon: Crown,
      features: [
        "👑 تصميم فاخر وعالمي حصري",
        "👗 أقسام متنوعة للعبايات العصرية",
        "💬 تكامل مع الواتساب للطلبات",
        "📱 تجربة تسوق متجاوبة 100%",
        "✨ أنيميشن وتأثيرات بصرية متطورة",
        "🏪 إدارة متكاملة للمخزون والطلبات"
      ],
      price: "2000 ريال",
      originalPrice: "3000 ريال",
      rating: 5.0,
      downloads: "12",
      status: "متاح الآن",
      color: "from-rose-500 to-pink-600",
      demoUrl: "/kashkha-store",
      tags: ["Fashion", "E-commerce", "WhatsApp", "Luxury", "Abaya"],
      isNew: true,
      isFeatured: true,
      isExclusive: true,
      emoji: "👑",
      discount: "33%",
      estimatedDelivery: "25 يوم"
    }
  ];

  const categories = [
    { name: "جميع المنتجات", emoji: "🛍️", count: products.length },
    { name: "المواقع التعريفية", emoji: "🌐", count: 2 },
    { name: "التجارة الإلكترونية", emoji: "🛒", count: 3 },
    { name: "التسويق الرقمي", emoji: "📈", count: 1 },
    { name: "التصميم والإبداع", emoji: "🎨", count: 1 },
    { name: "أنظمة الإدارة", emoji: "⚙️", count: 1 }
  ];
  
  const stats = [
    {
      title: "إجمالي المنتجات",
      value: `${products.length}`,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-700 dark:text-blue-300",
      emoji: "📦"
    },
    {
      title: "المنتجات المتاحة",
      value: `${products.filter(p => p.status === "متاح الآن").length}`,
      icon: Zap,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-700 dark:text-green-300",
      emoji: "⚡"
    },
    {
      title: "القيمة الإجمالية",
      value: "49995 ر.س",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-700 dark:text-purple-300",
      emoji: "💎"
    },
    {
      title: "متوسط التقييم",
      value: "4.87",
      icon: Star,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-700 dark:text-orange-300",
      emoji: "⭐"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg";
      case "تحت التطوير":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg";
      case "قريباً":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "✅";
      case "تحت التطوير":
        return "🚧";
      case "قريباً":
        return "🔜";
      default:
        return "⏳";
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
            ✨ منتجاتنا البرمجية الحصرية والمتطورة
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-fade-in border-2 backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${stat.textColor} text-sm font-medium mb-2 flex items-center gap-1`}>
                        <span className="text-lg">{stat.emoji}</span>
                        {stat.title}
                      </p>
                      <p className={`${stat.valueColor} text-3xl font-bold animate-pulse`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl animate-bounce`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-2xl text-base px-6 py-3 font-bold transition-all duration-300 ${selectedCategory === category.name 
                  ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-2xl text-white transform scale-105" 
                  : "hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-500/10 hover:scale-105"
                }`}
              >
                <span className="text-lg mr-2">{category.emoji}</span>
                {category.name}
                <Badge variant="secondary" className="mr-2 bg-white/20 text-current">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 animate-pulse" />
            <input
              type="text"
              placeholder="🔍 البحث في المنتجات الحصرية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-6 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-base font-medium min-w-80 transition-all duration-300"
            />
          </div>
        </div>

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
              {filteredProducts.map((product, index) => {
                const IconComponent = product.icon;
                const isProductLoading = loadingProducts[product.id] || false;
                
                return (
                  <Card 
                    key={product.id} 
                    className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-xl animate-fade-in ${
                      product.isFeatured ? 'ring-4 ring-primary/20' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {product.isExclusive && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-pulse">
                          👑 حصري
                        </Badge>
                      </div>
                    )}
                    
                    {product.discount && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-bounce">
                          🔥 خصم {product.discount}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="relative pb-4">
                      <div className={`w-20 h-20 bg-gradient-to-r ${product.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl mx-auto animate-bounce`}>
                        <span className="text-3xl">{product.emoji}</span>
                        <IconComponent className="w-8 h-8 text-white absolute" />
                      </div>
                      <CardTitle className="text-xl font-bold text-center group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-6">
                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
                          ✨ المميزات الحصرية:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {product.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price & Delivery */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-primary">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-lg text-slate-400 line-through">{product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                            <span>🚚 التسليم خلال 25 يوم</span>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(product.status)} px-3 py-1 rounded-xl font-bold animate-pulse`}>
                          <span className="mr-1">{getStatusEmoji(product.status)}</span>
                          {product.status}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-1 rounded-lg bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors duration-300">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        {product.demoUrl !== "#" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(product.demoUrl, '_blank')}
                            className="w-full sm:flex-1 rounded-xl font-bold hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 py-3"
                          >
                            <Eye className="w-4 h-4 ml-1 animate-pulse" />
                            👁️ معاينة مباشرة
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(product)}
                          disabled={product.status === "تحت التطوير" || isProductLoading}
                          className={`w-full sm:flex-1 rounded-xl font-bold transition-all duration-300 hover:scale-105 py-3 ${
                            product.status === "متاح الآن" 
                              ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-2xl text-white" 
                              : product.status === "قريباً"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-2xl text-white"
                              : "opacity-50 cursor-not-allowed bg-gray-400"
                          }`}
                        >
                          {isProductLoading ? (
                            <>
                              <Clock className="w-4 h-4 ml-1 animate-spin" />
                              ⏳ جاري المعالجة...
                            </>
                          ) : (
                            <>
                              {product.status === "متاح الآن" && (
                                <>
                                  <Banknote className="w-4 h-4 ml-1 animate-bounce" />
                                  💰 ادفع الآن
                                </>
                              )}
                              {product.status === "قريباً" && (
                                <>
                                  <Clock className="w-4 h-4 ml-1 animate-pulse" />
                                  🔜 قريباً
                                </>
                              )}
                              {product.status === "تحت التطوير" && (
                                <>
                                  <Settings className="w-4 h-4 ml-1 animate-spin" />
                                  🚧 تحت التطوير
                                </>
                              )}
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Delivery Info */}
                      <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 mt-3">
                        <span className="flex items-center gap-1">
                          <Rocket className="w-3 h-3 animate-pulse" />
                          🚀 التسليم السريع
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-500" />
                          🔒 ضمان الجودة
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 text-center text-white shadow-2xl mx-2 md:mx-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 md:mb-4 animate-pulse leading-tight">
            🚀 هل تحتاج حلاً مخصصاً؟
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 lg:mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed px-2">
            💡 نقوم بتطوير حلول برمجية مخصصة تماماً لاحتياجات عملك الفريدة
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 shadow-2xl text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 w-full max-w-md mx-auto"
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              📞 تواصل معنا للحصول على عرض مخصص
              <ArrowRight className="w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 animate-pulse flex-shrink-0" />
            </span>
          </Button>
        </div>
      </div>

      {/* Payment Methods Dialog */}
      <Dialog open={showPaymentMethods} onOpenChange={setShowPaymentMethods}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              💳 اختر طريقة الدفع المفضلة
            </DialogTitle>
            {selectedProduct && (
              <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl border border-primary/10">
                <p className="font-semibold text-lg mb-1">{selectedProduct.name}</p>
                <p className="text-2xl font-bold text-primary">{selectedProduct.price}</p>
                {selectedProduct.originalPrice && (
                  <p className="text-lg text-slate-400 line-through">{selectedProduct.originalPrice}</p>
                )}
              </div>
            )}
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              const isMethodLoading = selectedProduct ? (loadingProducts[selectedProduct.id] || false) : false;
              
              return (
                <Button
                  key={method.id}
                  variant="outline"
                  onClick={() => handlePaymentMethodSelect(method.id, selectedProduct)}
                  disabled={isMethodLoading}
                  className="w-full p-6 h-auto flex items-center justify-between hover:bg-primary/5 hover:border-primary/30 rounded-2xl transition-all duration-300 hover:scale-105 border-2"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <span className="text-2xl">{method.emoji}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{method.name}</p>
                      <p className="text-sm text-slate-500">{method.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 animate-pulse" />
                </Button>
              );
            })}
          </div>
          
          <div className="flex justify-center pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowPaymentMethods(false)}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              ❌ إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default SoftwareProducts;