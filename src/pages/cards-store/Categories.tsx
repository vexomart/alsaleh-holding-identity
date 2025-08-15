import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Zap, 
  Shield, 
  Clock,
  Gamepad2,
  Smartphone,
  Music,
  ShoppingBag,
  Coffee,
  CreditCard,
  Play,
  Gift,
  Package,
  TrendingUp,
  Users,
  Crown,
  Flame,
  Sparkles,
  CheckCircle,
  Eye,
  Download
} from "lucide-react";

const Categories = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Sample cards data for each category
  const allCards = [
    // Gaming cards
    {
      id: 1,
      name: "بطاقة PlayStation Store",
      description: "بطاقة شحن متجر بلايستيشن للألعاب والمحتوى الرقمي الحصري",
      category: "gaming",
      categoryName: "الألعاب",
      icon: Gamepad2,
      price: "50 ريال",
      originalPrice: "65 ريال",
      rating: 4.9,
      reviews: 342,
      image: "🎮",
      gradient: "from-blue-600 via-purple-600 to-indigo-800",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "23%",
      availability: "متوفر فوراً",
      tags: ["ألعاب", "بلايستيشن", "ترفيه"],
      deliveryTime: "فوري",
      savings: "15 ريال"
    },
    {
      id: 9,
      name: "بطاقة Steam Wallet",
      description: "بطاقة ستيم للألعاب الرقمية والمحتوى الإضافي",
      category: "gaming",
      categoryName: "الألعاب",
      icon: Gamepad2,
      price: "120 ريال",
      originalPrice: "145 ريال",
      rating: 4.8,
      reviews: 425,
      image: "🎮",
      gradient: "from-blue-800 via-indigo-800 to-purple-900",
      isPopular: true,
      isFeatured: false,
      isNew: false,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["ستيم", "ألعاب", "PC"],
      deliveryTime: "فوري",
      savings: "25 ريال"
    },
    // Apps cards
    {
      id: 2,
      name: "بطاقة Apple Store & iTunes",
      description: "بطاقة هدايا متجر آبل للتطبيقات والموسيقى والأفلام",
      category: "apps",
      categoryName: "التطبيقات",
      icon: Smartphone,
      price: "100 ريال",
      originalPrice: "125 ريال",
      rating: 4.8,
      reviews: 289,
      image: "🍎",
      gradient: "from-gray-700 via-slate-800 to-black",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "20%",
      availability: "متوفر فوراً",
      tags: ["آبل", "تطبيقات", "موسيقى"],
      deliveryTime: "فوري",
      savings: "25 ريال"
    },
    {
      id: 8,
      name: "بطاقة Google Play",
      description: "بطاقة جوجل بلاي للتطبيقات والألعاب والاشتراكات",
      category: "apps",
      categoryName: "التطبيقات",
      icon: Smartphone,
      price: "85 ريال",
      originalPrice: "105 ريال",
      rating: 4.7,
      reviews: 312,
      image: "📱",
      gradient: "from-green-600 via-blue-600 to-purple-700",
      isPopular: false,
      isFeatured: true,
      isNew: true,
      discount: "19%",
      availability: "متوفر فوراً",
      tags: ["جوجل", "تطبيقات", "ألعاب"],
      deliveryTime: "فوري",
      savings: "20 ريال"
    },
    // Music cards
    {
      id: 3,
      name: "بطاقة Spotify Premium",
      description: "اشتراك سبوتيفاي بريميوم للاستماع للموسيقى بدون إعلانات",
      category: "music",
      categoryName: "الموسيقى",
      icon: Music,
      price: "35 ريال",
      originalPrice: "45 ريال",
      rating: 4.7,
      reviews: 234,
      image: "🎵",
      gradient: "from-green-600 via-emerald-600 to-teal-700",
      isPopular: false,
      isFeatured: true,
      isNew: true,
      discount: "22%",
      availability: "متوفر فوراً",
      tags: ["موسيقى", "بريميوم", "سبوتيفاي"],
      deliveryTime: "فوري",
      savings: "10 ريال"
    },
    // Shopping cards
    {
      id: 4,
      name: "بطاقة Amazon Gift Card",
      description: "بطاقة هدايا أمازون للتسوق الإلكتروني من جميع أنحاء العالم",
      category: "shopping",
      categoryName: "التسوق",
      icon: ShoppingBag,
      price: "200 ريال",
      originalPrice: "260 ريال",
      rating: 4.9,
      reviews: 456,
      image: "🛒",
      gradient: "from-orange-600 via-amber-600 to-yellow-700",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "23%",
      availability: "متوفر فوراً",
      tags: ["تسوق", "أمازون", "عالمي"],
      deliveryTime: "فوري",
      savings: "60 ريال"
    },
    // Cafes cards
    {
      id: 5,
      name: "بطاقة Starbucks Coffee",
      description: "بطاقة هدايا ستاربكس للقهوة والمشروبات اللذيذة",
      category: "cafes",
      categoryName: "المقاهي",
      icon: Coffee,
      price: "75 ريال",
      originalPrice: "95 ريال",
      rating: 4.6,
      reviews: 187,
      image: "☕",
      gradient: "from-green-800 via-emerald-900 to-teal-900",
      isPopular: false,
      isFeatured: false,
      isNew: false,
      discount: "21%",
      availability: "متوفر فوراً",
      tags: ["قهوة", "ستاربكس", "مشروبات"],
      deliveryTime: "فوري",
      savings: "20 ريال"
    },
    // Banking cards
    {
      id: 6,
      name: "بطاقة Visa مدفوعة مسبقاً",
      description: "بطاقة فيزا مدفوعة مسبقاً للتسوق الآمن عبر الإنترنت",
      category: "banking",
      categoryName: "البطاقات المصرفية",
      icon: CreditCard,
      price: "500 ريال",
      originalPrice: "530 ريال",
      rating: 4.8,
      reviews: 267,
      image: "💳",
      gradient: "from-purple-700 via-violet-800 to-indigo-900",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "6%",
      availability: "متوفر فوراً",
      tags: ["فيزا", "مصرفية", "آمنة"],
      deliveryTime: "خلال ساعة",
      savings: "30 ريال"
    },
    // Entertainment cards
    {
      id: 7,
      name: "بطاقة Netflix Premium",
      description: "اشتراك نتفليكس لمشاهدة الأفلام والمسلسلات عالية الجودة",
      category: "entertainment",
      categoryName: "الترفيه",
      icon: Play,
      price: "55 ريال",
      originalPrice: "70 ريال",
      rating: 4.9,
      reviews: 398,
      image: "🎬",
      gradient: "from-red-600 via-rose-700 to-pink-800",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "21%",
      availability: "متوفر فوراً",
      tags: ["نتفليكس", "أفلام", "مسلسلات"],
      deliveryTime: "فوري",
      savings: "15 ريال"
    },
    // Gifts cards
    {
      id: 10,
      name: "بطاقة هدايا عامة مميزة",
      description: "بطاقة هدايا متعددة الاستخدامات لجميع المناسبات",
      category: "gifts",
      categoryName: "الهدايا",
      icon: Gift,
      price: "150 ريال",
      originalPrice: "185 ريال",
      rating: 4.6,
      reviews: 198,
      image: "🎁",
      gradient: "from-pink-600 via-rose-700 to-red-800",
      isPopular: false,
      isFeatured: false,
      isNew: false,
      discount: "19%",
      availability: "متوفر فوراً",
      tags: ["هدايا", "مناسبات", "عامة"],
      deliveryTime: "فوري",
      savings: "35 ريال"
    }
  ];

  const categoryMap: { [key: string]: string } = {
    "gaming": "الألعاب",
    "apps": "التطبيقات", 
    "music": "الموسيقى",
    "shopping": "التسوق",
    "cafes": "المقاهي",
    "banking": "البطاقات المصرفية",
    "entertainment": "الترفيه",
    "gifts": "الهدايا"
  };

  const categoryGradients: { [key: string]: string } = {
    "gaming": "from-blue-600 via-indigo-600 to-purple-700",
    "apps": "from-purple-600 via-violet-600 to-fuchsia-700",
    "music": "from-green-600 via-emerald-600 to-teal-700",
    "shopping": "from-orange-600 via-amber-600 to-yellow-700",
    "cafes": "from-amber-700 via-orange-800 to-brown-900",
    "banking": "from-slate-700 via-gray-800 to-zinc-900",
    "entertainment": "from-red-600 via-rose-700 to-pink-800",
    "gifts": "from-pink-600 via-rose-700 to-red-800"
  };

  const categoryIcons: { [key: string]: any } = {
    "gaming": Gamepad2,
    "apps": Smartphone,
    "music": Music,
    "shopping": ShoppingBag,
    "cafes": Coffee,
    "banking": CreditCard,
    "entertainment": Play,
    "gifts": Gift
  };

  const currentCategoryName = categoryName ? categoryMap[categoryName] : "جميع البطاقات";
  const currentCategoryGradient = categoryName ? categoryGradients[categoryName] : "from-primary via-blue-600 to-indigo-700";
  const CurrentCategoryIcon = categoryName ? categoryIcons[categoryName] : Package;

  const filteredCards = allCards.filter(card => {
    const matchesCategory = !categoryName || card.category === categoryName;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.reviews - a.reviews;
      case "price-low":
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return a.isNew ? -1 : 1;
      default:
        return 0;
    }
  });

  const handlePurchase = (card: any) => {
    const whatsappMessage = `🛍️ طلب شراء بطاقة إلكترونية

🎫 اسم البطاقة: ${card.name}
💰 السعر: ${card.price}
🏷️ السعر الأصلي: ${card.originalPrice || 'غير محدد'}
🎉 نسبة الخصم: ${card.discount || '0%'}
📂 الفئة: ${card.categoryName}
⭐ التقييم: ${card.rating}/5
🚀 وقت التوصيل: ${card.deliveryTime}

🛒 أرغب في شراء هذه البطاقة الآن!`;
    
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تم اختيار البطاقة!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  const toggleFavorite = (cardId: number) => {
    setFavorites(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
    toast({
      title: favorites.includes(cardId) ? "💔 تم الإزالة من المفضلة" : "❤️ تم الإضافة للمفضلة",
      description: favorites.includes(cardId) ? "تم إزالة البطاقة من قائمة المفضلة" : "تم حفظ البطاقة في المفضلة",
    });
  };

  const handleShare = (card: any) => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `اكتشف ${card.name} بسعر خاص ${card.price}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${card.name} - ${card.price} - ${window.location.href}`);
      toast({
        title: "📋 تم نسخ الرابط!",
        description: "تم نسخ تفاصيل البطاقة إلى الحافظة",
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
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    },
    hover: {
      y: -10,
      scale: 1.02
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Header */}
      <motion.section 
        className={`relative py-20 overflow-hidden bg-gradient-to-r ${currentCategoryGradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/80 mb-8"
          >
            <Link to="/cards-store" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{currentCategoryName}</span>
          </motion.div>

          <div className="text-center text-white max-w-4xl mx-auto">
            {/* Category Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <CurrentCategoryIcon className="w-12 h-12" />
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {currentCategoryName}
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              {categoryName 
                ? `اكتشف أفضل بطاقات ${currentCategoryName} بأسعار مميزة وعروض حصرية`
                : "جميع البطاقات الإلكترونية المتاحة في مكان واحد"
              }
            </motion.p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold">{filteredCards.length}+</div>
                <div className="text-white/80">بطاقة متاحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {Math.round(filteredCards.reduce((acc, card) => acc + card.rating, 0) / filteredCards.length * 10) / 10}★
                </div>
                <div className="text-white/80">متوسط التقييم</div>
              </div>
              <div>
                <div className="text-3xl font-bold">20%</div>
                <div className="text-white/80">متوسط التوفير</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search and Filter Bar */}
      <motion.section 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 py-6"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => navigate("/cards-store")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للمتجر
            </Button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`ابحث في ${currentCategoryName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50"
            >
              <option value="popular">الأكثر شعبية</option>
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {/* Active Filters */}
          {searchTerm && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">البحث عن:</span>
              <Badge 
                variant="outline"
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setSearchTerm("")}
              >
                "{searchTerm}" ✕
              </Badge>
            </div>
          )}
        </div>
      </motion.section>

      {/* Cards Grid */}
      <motion.section 
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          
          {sortedCards.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
            >
              {sortedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group relative"
                >
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden h-full group-hover:shadow-2xl transition-all duration-500">
                    
                    {/* Card Header */}
                    <div className={`relative bg-gradient-to-r ${card.gradient} p-6 text-white overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {card.isNew && (
                          <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            جديد
                          </Badge>
                        )}
                        {card.isPopular && (
                          <Badge className="bg-red-500 text-white border-0 text-xs px-2 py-1">
                            <Flame className="w-3 h-3 mr-1" />
                            شائع
                          </Badge>
                        )}
                        {card.isFeatured && (
                          <Badge className="bg-yellow-500 text-white border-0 text-xs px-2 py-1">
                            <Crown className="w-3 h-3 mr-1" />
                            مميز
                          </Badge>
                        )}
                      </div>

                      {/* Favorite & Share */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(card.id)}
                          className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(card.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(card)}
                          className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>

                      {/* Card Icon & Title */}
                      <div className="relative z-10 text-center">
                        <div className="text-4xl mb-3">{card.image}</div>
                        <h3 className="font-bold text-xl mb-2 line-clamp-2">{card.name}</h3>
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {card.categoryName}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                        {card.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(card.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {card.rating} ({card.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {card.price}
                          </span>
                          {card.originalPrice && (
                            <span className="text-lg text-slate-400 line-through">
                              {card.originalPrice}
                            </span>
                          )}
                          {card.discount && (
                            <Badge className="bg-red-500 text-white">
                              -{card.discount}
                            </Badge>
                          )}
                        </div>
                        
                        {card.savings && (
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            💰 توفير {card.savings}
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Zap className="w-4 h-4 text-green-500" />
                          {card.deliveryTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Shield className="w-4 h-4 text-blue-500" />
                          {card.availability}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-6">
                        {card.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePurchase(card)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          شراء الآن
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                لم نجد أي بطاقات
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                جرب تغيير كلمات البحث أو تصفح فئة أخرى
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  مسح البحث
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/cards-store")}
                >
                  العودة للمتجر
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              لم تجد ما تبحث عنه؟ 🤔
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              تواصل معنا وسنساعدك في العثور على البطاقة المثالية لاحتياجاتك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                تواصل عبر الواتساب
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cards-store/contact")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                صفحة التواصل
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Categories;