import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  Gift,
  Crown,
  Flame,
  Sparkles,
  Users,
  MessageCircle,
  Phone,
  Download,
  CreditCard,
  Package,
  Truck,
  RefreshCw,
  AlertCircle,
  Info,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Copy,
  ExternalLink,
  Percent,
  Globe,
  Headphones,
  Award,
  TrendingUp
} from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sample product data - in real app, this would come from API
  const product = {
    id: 1,
    name: "بطاقة PlayStation Store Premium",
    description: "بطاقة شحن متجر بلايستيشن للألعاب والمحتوى الرقمي الحصري مع أحدث الألعاب والعروض الخاصة",
    fullDescription: "استمتع بأفضل تجربة ألعاب مع بطاقة PlayStation Store الرسمية. احصل على إمكانية الوصول الفوري إلى آلاف الألعاب والمحتوى الإضافي والاشتراكات الحصرية. تتميز البطاقة بالتفعيل السريع والأمان الكامل مع ضمان الجودة.",
    category: "الألعاب",
    icon: "🎮",
    price: "50 ريال",
    originalPrice: "65 ريال",
    rating: 4.9,
    reviews: 342,
    reviewsBreakdown: {
      5: 280,
      4: 45,
      3: 12,
      2: 3,
      1: 2
    },
    images: ["🎮", "🎯", "🏆", "⭐"],
    gradient: "from-blue-600 via-purple-600 to-indigo-800",
    isPopular: true,
    isFeatured: true,
    isNew: false,
    discount: "23%",
    availability: "متوفر فوراً",
    stock: 250,
    tags: ["ألعاب", "بلايستيشن", "ترفيه", "حصري", "رقمي"],
    deliveryTime: "فوري",
    savings: "15 ريال",
    validUntil: "31/12/2024",
    features: [
      "تفعيل فوري بعد الشراء",
      "متوافق مع جميع أجهزة PlayStation",
      "بطاقة رسمية 100% مضمونة",
      "لا تنتهي صلاحيتها",
      "إمكانية الهدية للآخرين",
      "دعم فني متاح على مدار الساعة"
    ],
    howToUse: [
      "قم بشراء البطاقة من متجرنا",
      "ستصلك رسالة فورية تحتوي على الكود",
      "ادخل إلى حسابك في PlayStation Store",
      "اذهب إلى قسم 'استرداد الأكواد'",
      "أدخل الكود المرسل إليك",
      "تمتع بالمحتوى فوراً!"
    ],
    relatedProducts: [
      { id: 2, name: "بطاقة Xbox Live", price: "45 ريال", image: "🎮" },
      { id: 3, name: "بطاقة Steam Wallet", price: "120 ريال", image: "💻" },
      { id: 4, name: "بطاقة Nintendo eShop", price: "80 ريال", image: "🎯" }
    ],
    faqs: [
      {
        question: "كم يستغرق وقت التسليم؟",
        answer: "يتم تسليم البطاقة فوراً عبر الواتساب أو البريد الإلكتروني خلال دقائق من إتمام عملية الشراء."
      },
      {
        question: "هل البطاقة أصلية؟",
        answer: "نعم، جميع بطاقاتنا أصلية 100% ومشتراة من الموزعين المعتمدين مع ضمان كامل."
      },
      {
        question: "هل يمكن استخدام البطاقة في أي دولة؟",
        answer: "تعتمد على منطقة حسابك في PlayStation Store. معظم بطاقاتنا صالحة للاستخدام في منطقة الشرق الأوسط."
      },
      {
        question: "ماذا لو لم تعمل البطاقة؟",
        answer: "في الحالات النادرة التي لا تعمل فيها البطاقة، نوفر استبدال فوري أو استرداد كامل للمبلغ."
      }
    ],
    reviews: [
      {
        id: 1,
        user: "أحمد محمد",
        rating: 5,
        comment: "خدمة ممتازة وتسليم سريع جداً. البطاقة تعمل بشكل مثالي!",
        date: "2024-01-15",
        verified: true
      },
      {
        id: 2,
        user: "سارة علي",
        rating: 5,
        comment: "أفضل متجر للبطاقات الإلكترونية. أسعار ممتازة وخدمة عملاء رائعة.",
        date: "2024-01-10",
        verified: true
      },
      {
        id: 3,
        user: "خالد السعود",
        rating: 4,
        comment: "جودة عالية وسعر مناسب. أنصح بالشراء من هنا.",
        date: "2024-01-08",
        verified: false
      }
    ]
  };

  const handlePurchase = () => {
    const whatsappMessage = `🛍️ طلب شراء بطاقة إلكترونية

🎫 اسم البطاقة: ${product.name}
💰 السعر: ${product.price}
🏷️ السعر الأصلي: ${product.originalPrice}
🎉 نسبة الخصم: ${product.discount}
📦 الكمية: ${selectedQuantity}
💵 المجموع: ${parseInt(product.price.replace(/[^\d]/g, '')) * selectedQuantity} ريال
📂 الفئة: ${product.category}
⭐ التقييم: ${product.rating}/5
🚀 وقت التوصيل: ${product.deliveryTime}

🛒 أرغب في شراء هذه البطاقة الآن!
📱 متجر البطاقات الإلكترونية الذكي`;
    
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تم اختيار البطاقة!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "💔 تم الإزالة من المفضلة" : "❤️ تم الإضافة للمفضلة",
      description: isFavorite ? "تم إزالة البطاقة من قائمة المفضلة" : "تم حفظ البطاقة في المفضلة",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `اكتشف ${product.name} بسعر خاص ${product.price}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "📋 تم نسخ الرابط!",
        description: "تم نسخ رابط المنتج إلى الحافظة",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Breadcrumb */}
      <motion.section 
        className="py-6 border-b border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
            <Link to="/cards-store" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link to="/cards-store" className="hover:text-primary transition-colors">
              المتجر
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
        </div>
      </motion.section>

      {/* Product Details */}
      <motion.section 
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Product Images */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Main Image */}
              <div className={`relative bg-gradient-to-r ${product.gradient} rounded-3xl p-12 text-center text-white overflow-hidden group`}>
                <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      جديد
                    </Badge>
                  )}
                  {product.isPopular && (
                    <Badge className="bg-red-500 text-white border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      شائع
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-yellow-500 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      مميز
                    </Badge>
                  )}
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg z-10">
                    -{product.discount}
                  </div>
                )}

                <div className="relative z-10">
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {product.images[activeImageIndex]}
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4 justify-center">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${
                      activeImageIndex === index 
                        ? 'border-primary bg-primary/10' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    {image}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {product.rating}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      ({product.reviews} تقييم)
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {product.availability}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="border-2 border-primary/20 rounded-2xl p-6 bg-primary/5">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-slate-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                      توفير {product.discount}
                    </Badge>
                  )}
                </div>
                
                {product.savings && (
                  <p className="text-lg text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    توفر {product.savings} من السعر الأصلي!
                  </p>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-6">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    الكمية:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl">
                      <button
                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-3 min-w-[60px] text-center font-semibold">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      متوفر {product.stock} قطعة
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    شراء الآن - {parseInt(product.price.replace(/[^\d]/g, '')) * selectedQuantity} ريال
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-400'}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <Share2 className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-blue-500" />
                  </motion.button>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Zap className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900 dark:text-green-100">توصيل فوري</div>
                    <div className="text-sm text-green-700 dark:text-green-300">{product.deliveryTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-100">ضمان أصلي</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">100% مضمون</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Headphones className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-purple-900 dark:text-purple-100">دعم 24/7</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">متاح دائماً</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900 dark:text-orange-100">صالح حتى</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">{product.validUntil}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="description">الوصف</TabsTrigger>
                <TabsTrigger value="features">المميزات</TabsTrigger>
                <TabsTrigger value="howto">طريقة الاستخدام</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      وصف المنتج
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                      {product.fullDescription}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        لماذا تختار بطاقاتنا؟
                      </h3>
                      <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          بطاقات أصلية مضمونة 100%
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          تسليم فوري خلال دقائق
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          أسعار تنافسية وعروض حصرية
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          دعم فني على مدار الساعة
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      المميزات الرئيسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="howto" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      خطوات الاستخدام
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.howToUse.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        ملاحظة مهمة
                      </h3>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        تأكد من أن حسابك في PlayStation Store يتطابق مع منطقة البطاقة. 
                        إذا واجهت أي مشكلة، تواصل معنا فوراً وسنقوم بحلها خلال دقائق.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      تقييمات العملاء ({product.reviews} تقييم)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Rating Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                          {product.rating}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          من أصل {product.reviews} تقييم
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm w-12">{stars} نجوم</span>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ 
                                  width: `${(product.reviewsBreakdown[stars as keyof typeof product.reviewsBreakdown] / product.reviews) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm w-8">
                              {product.reviewsBreakdown[stars as keyof typeof product.reviewsBreakdown]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Individual Reviews */}
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900 dark:text-white">
                                    {review.user}
                                  </span>
                                  {review.verified && (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      مُتحقق
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-slate-300 dark:text-slate-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {review.comment}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              مفيد
                            </button>
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              غير مفيد
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  الأسئلة الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        {faq.question}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Products */}
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              منتجات ذات صلة 🔗
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50 text-center group cursor-pointer"
                  onClick={() => navigate(`/cards-store/product/${relatedProduct.id}`)}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {relatedProduct.image}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-semibold text-primary">
                    {relatedProduct.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                هل تحتاج مساعدة؟ 🤝
              </h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                فريق الدعم الفني متاح على مدار الساعة لمساعدتك في أي استفسار
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  واتساب
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('tel:+966500000000')}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  اتصال مباشر
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProductDetails;