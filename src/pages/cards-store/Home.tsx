import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardsStoreHeader } from "@/components/cards-store/CardsStoreHeader";
import { CardsStoreFooter } from "@/components/cards-store/CardsStoreFooter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Store, 
  Zap, 
  Shield, 
  Award, 
  Star,
  TrendingUp,
  Gift,
  Crown,
  Flame,
  Gamepad2,
  Play,
  Smartphone,
  ShoppingBag,
  Music,
  Layers,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Heart,
  Users,
  Clock,
  Globe
} from "lucide-react";

const Home = () => {
  const handleCategorySelect = (category: string) => {
    // Navigate to category page or filter
    console.log('Selected category:', category);
  };

  const featuredCards = [
    {
      id: 1,
      title: "بطاقة نتفلكس بريميوم - شهر واحد",
      price: "58 ريال",
      originalPrice: "75 ريال",
      discount: "23% خصم",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop",
      rating: 4.9,
      isHot: true,
      category: "ترفيه"
    },
    {
      id: 2,
      title: "بطاقة Steam Wallet - 50 دولار",
      price: "188 ريال",
      originalPrice: "200 ريال",
      discount: "6% خصم",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
      rating: 4.9,
      isHot: true,
      category: "ألعاب"
    },
    {
      id: 3,
      title: "بطاقة Netflix + Disney Bundle",
      price: "125 ريال",
      originalPrice: "140 ريال",
      discount: "11% خصم",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop",
      rating: 4.9,
      isNew: true,
      category: "ترفيه"
    }
  ];

  const categories = [
    { name: "ألعاب", icon: Gamepad2, count: 73, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { name: "ترفيه", icon: Play, count: 48, color: "bg-gradient-to-r from-red-500 to-pink-500" },
    { name: "تطبيقات", icon: Smartphone, count: 41, color: "bg-gradient-to-r from-orange-500 to-yellow-500" },
    { name: "تسوق", icon: ShoppingBag, count: 28, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { name: "موسيقى", icon: Music, count: 15, color: "bg-gradient-to-r from-purple-500 to-indigo-500" },
    { name: "إبداعي", icon: Layers, count: 12, color: "bg-gradient-to-r from-teal-500 to-blue-500" }
  ];

  const stats = [
    { icon: Users, value: "+50K", label: "عميل راضي", color: "from-blue-500 to-indigo-500" },
    { icon: Star, value: "4.9", label: "تقييم العملاء", color: "from-yellow-500 to-orange-500" },
    { icon: Zap, value: "30s", label: "تسليم فوري", color: "from-green-500 to-emerald-500" },
    { icon: Shield, value: "99.9%", label: "معدل الأمان", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <CardsStoreHeader 
        showBackButton={true}
        title="متجر البطاقات الذكي"
        subtitle="الصفحة الرئيسية"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm font-medium">
              ✨ أفضل أسعار البطاقات الرقمية في المملكة
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              مرحباً بك في
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                متجر البطاقات الذكي
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              وجهتك الأولى للحصول على أفضل البطاقات الرقمية بأسعار منافسة وجودة عالية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/electronic-cards-store">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  تسوق الآن
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                تواصل معنا
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-blue-100 text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-4">
              فئات متنوعة
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              اكتشف فئات البطاقات
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              نوفر مجموعة واسعة من البطاقات الرقمية لتلبية جميع احتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} بطاقة
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 mb-4">
              عروض مميزة
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              البطاقات الأكثر طلباً
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              اكتشف أشهر البطاقات الرقمية والأكثر مبيعاً بعروض حصرية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 border-0">
                  {/* Card Badges */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {card.isHot && (
                      <Badge className="bg-red-500 text-white border-0 shadow-lg">
                        <Flame className="h-3 w-3 mr-1" />
                        مطلوب
                      </Badge>
                    )}
                    {card.isNew && (
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        <Star className="h-3 w-3 mr-1" />
                        جديد
                      </Badge>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                      {card.discount}
                    </Badge>
                  </div>

                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800">
                        {card.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{card.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {card.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {card.price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {card.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">شامل الضريبة</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                        >
                          شراء الآن
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/electronic-cards-store">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                عرض جميع البطاقات
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
              لماذا نحن؟
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              ما يميزنا عن الآخرين
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "تفعيل فوري",
                description: "احصل على بطاقتك خلال 30 ثانية من إتمام الدفع",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "أمان مضمون",
                description: "جميع المعاملات محمية بتشفير SSL المتقدم",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Award,
                title: "ضمان الجودة",
                description: "استرداد كامل في حالة عدم عمل البطاقة",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "دعم 24/7",
                description: "فريق دعم متاح على مدار الساعة لمساعدتك",
                color: "from-blue-500 to-indigo-500"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              هل تحتاج مساعدة في اختيار البطاقة المناسبة؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              تواصل مع فريق الدعم المتخصص لدينا للحصول على استشارة مجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                تواصل عبر الواتساب
              </Button>
              <Link to="/cards-store/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  صفحة التواصل
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CardsStoreFooter onCategorySelect={handleCategorySelect} />
    </div>
  );
};

export default Home;