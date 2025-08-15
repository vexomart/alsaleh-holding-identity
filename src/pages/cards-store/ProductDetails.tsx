import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight,
  Star,
  Shield,
  Clock,
  Check,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  ShoppingCart,
  CreditCard,
  Zap,
  Gift,
  Crown
} from 'lucide-react';
import { CardsStoreHeader } from '@/components/cards-store/CardsStoreHeader';
import { CardsStoreFooter } from '@/components/cards-store/CardsStoreFooter';

const ProductDetails = () => {
  const { id } = useParams();

  // Sample card data - in real app, this would come from an API
  const cardData = {
    1: {
      id: 1,
      title: "بطاقة Netflix - 3 أشهر",
      price: "89 ريال",
      originalPrice: "120 ريال",
      discount: "26% خصم",
      category: "ترفيه",
      cardType: "Netflix",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=500&fit=crop",
      rating: 4.8,
      reviews: 3254,
      description: "استمتع بأفضل الأفلام والمسلسلات مع اشتراك Netflix لمدة 3 أشهر",
      longDescription: "احصل على اشتراك Netflix Premium لمدة 3 أشهر كاملة واستمتع بمكتبة ضخمة من الأفلام والمسلسلات الحصرية بجودة عالية تصل إلى 4K. يمكنك مشاهدة المحتوى على أي جهاز وفي أي وقت بدون إعلانات مزعجة.",
      features: [
        "أفلام ومسلسلات حصرية عالية الجودة",
        "جودة مشاهدة تصل إلى 4K Ultra HD",
        "إمكانية العرض على 4 أجهزة متزامنة",
        "بدون إعلانات نهائياً",
        "تحميل المحتوى للمشاهدة بدون إنترنت",
        "مكتبة ضخمة من المحتوى العربي والعالمي",
        "إضافة محتوى جديد أسبوعياً",
        "دعم جميع الأجهزة والمنصات"
      ],
      specifications: [
        { label: "نوع البطاقة", value: "رقمية فورية" },
        { label: "مدة الصلاحية", value: "سنة واحدة من تاريخ الشراء" },
        { label: "منطقة الاستخدام", value: "الشرق الأوسط وشمال أفريقيا" },
        { label: "طريقة التفعيل", value: "كود رقمي عبر الإيميل أو الرسائل" },
        { label: "المنصات المدعومة", value: "جميع الأجهزة (iOS, Android, Smart TV, PC)" }
      ],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري - خلال دقائق",
      warranty: "ضمان استرداد المال خلال 24 ساعة",
      support: "دعم فني 24/7"
    },
    2: {
      id: 2,
      title: "بطاقة Amazon - 100 ريال",
      price: "94 ريال",
      originalPrice: "100 ريال",
      discount: "6% خصم",
      category: "تسوق إلكتروني",
      cardType: "Amazon",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop",
      rating: 4.9,
      reviews: 8765,
      description: "تسوق من أكبر متجر إلكتروني في العالم مع بطاقة Amazon",
      longDescription: "احصل على بطاقة Amazon بقيمة 100 ريال سعودي واستمتع بتجربة التسوق من أكبر متجر إلكتروني في العالم. يمكنك شراء ملايين المنتجات مع شحن سريع وخدمة عملاء ممتازة.",
      features: [
        "شحن مجاني على معظم المنتجات",
        "ملايين المنتجات المتنوعة",
        "خدمة عملاء ممتازة 24/7",
        "إرجاع مجاني خلال 30 يوم",
        "عروض وخصومات حصرية",
        "تسليم سريع وآمن",
        "ضمان جودة المنتجات",
        "دعم اللغة العربية"
      ],
      specifications: [
        { label: "قيمة البطاقة", value: "100 ريال سعودي" },
        { label: "نوع البطاقة", value: "رقمية قابلة للاستخدام فوراً" },
        { label: "مدة الصلاحية", value: "10 سنوات من تاريخ الإصدار" },
        { label: "منطقة الاستخدام", value: "Amazon.sa والمتاجر المرتبطة" },
        { label: "طريقة الاستخدام", value: "إدخال الكود في حساب Amazon" }
      ],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري - خلال دقائق",
      warranty: "ضمان استرداد المال خلال 48 ساعة",
      support: "دعم فني متخصص"
    }
  };

  const card = cardData[Number(id) as keyof typeof cardData];

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">البطاقة غير موجودة</h1>
          <Link to="/cards-store">
            <Button>العودة للمتجر</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const message = `مرحباً! أريد طلب البطاقة التالية من متجر البطاقات الإلكترونية:

🎯 *${card.title}*
💰 السعر: ${card.price}
📦 النوع: ${card.cardType}
⭐ التقييم: ${card.rating}/5

📋 *المواصفات التفصيلية:*
${card.specifications.map(spec => `• ${spec.label}: ${spec.value}`).join('\n')}

🎁 *أهم المميزات:*
${card.features.slice(0, 5).map(feature => `• ${feature}`).join('\n')}

🚚 وقت التسليم: ${card.deliveryTime}
✅ حالة التوفر: ${card.stockStatus}
🛡️ الضمان: ${card.warranty}

أرجو التواصل معي لإتمام عملية الطلب والدفع.`;

    const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <CardsStoreHeader />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">الرئيسية</Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/cards-store" className="hover:text-purple-600 dark:hover:text-purple-400">متجر البطاقات</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white">{card.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
              />
              {card.isHot && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  🔥 الأكثر طلباً
                </Badge>
              )}
              {card.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  ✨ جديد
                </Badge>
              )}
              {card.discount && (
                <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {card.discount}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة
              </Button>
              <Button
                variant="outline"
                className="flex-1"
              >
                <Heart className="h-4 w-4 mr-2" />
                إضافة للمفضلة
              </Button>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {card.category}
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {card.stockStatus}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {card.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(card.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({card.reviews.toLocaleString()} تقييم)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-purple-600">
                  {card.price}
                </span>
                {card.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {card.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {card.longDescription}
              </p>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  المميزات الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {card.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-100">وقت التسليم</span>
                </div>
                <p className="text-blue-700 dark:text-blue-200">{card.deliveryTime}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900 dark:text-green-100">الضمان</span>
                </div>
                <p className="text-green-700 dark:text-green-200">{card.warranty}</p>
              </div>
            </div>

            {/* Order Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-xl"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                اطلب عبر الواتساب
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => window.open('tel:+9660555812567')}
                  variant="outline"
                  className="py-3"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  اتصل بنا
                </Button>
                <Button
                  variant="outline"
                  className="py-3"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  دفع فوري
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                المواصفات التفصيلية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {card.specifications.map((spec, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {spec.label}
                    </dt>
                    <dd className="text-base text-gray-900 dark:text-white">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                جميع المميزات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {card.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-xl"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            نحن هنا لخدمتك
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            فريق دعم متخصص متاح 24/7 لمساعدتك في أي استفسار
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleWhatsAppOrder}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              واتساب
            </Button>
            <Button
              onClick={() => window.open('tel:+966555812567')}
              variant="outline"
            >
              <Phone className="h-4 w-4 mr-2" />
              اتصال مباشر
            </Button>
          </div>
        </motion.div>
      </div>

      <CardsStoreFooter />
    </div>
  );
};

export default ProductDetails;