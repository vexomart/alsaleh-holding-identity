import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Crown, Sparkles, Star, ShoppingBag, Phone, 
  Heart, Award, Gift, Truck, Shield, Users, Flower
} from "lucide-react";
import AbayaHeader from '@/components/abaya-store/AbayaHeader';
import AbayaFooter from '@/components/abaya-store/AbayaFooter';

// Import abaya images
import luxuryBlackAbaya from '@/assets/abaya-luxury-black.jpg';
import formalNavyAbaya from '@/assets/abaya-formal-navy.jpg';
import casualBeigeAbaya from '@/assets/abaya-casual-beige.jpg';
import sportsGrayAbaya from '@/assets/abaya-sports-gray.jpg';
import traditionalBrownAbaya from '@/assets/abaya-traditional-brown.jpg';
import weddingWhiteAbaya from '@/assets/abaya-wedding-white.jpg';

// Import category images
import categoryLuxuryAbaya from '@/assets/category-luxury-abaya.jpg';
import categoryFormalAbaya from '@/assets/category-formal-abaya.jpg';
import categoryCasualAbaya from '@/assets/category-casual-abaya.jpg';
import categorySportsAbaya from '@/assets/category-sports-abaya.jpg';
import categoryTraditionalAbaya from '@/assets/category-traditional-abaya.jpg';
import categoryWeddingAbaya from '@/assets/category-wedding-abaya.jpg';

// Import hero background
import abayaHeroBg from '@/assets/abaya-hero-bg.jpg';
import abayaCollectionBg from '@/assets/abaya-collection-bg.jpg';

const KashkhaAbayaStore = () => {
  // Sample abayas data
  const abayas = [
    {
      id: 1,
      name: 'عباءة الأميرات السوداء',
      image: luxuryBlackAbaya,
      price: '450',
      originalPrice: '520',
      description: 'عباءة ملكية بتطريز ذهبي فاخر وخامات حريرية استثنائية',
      features: ['تطريز يدوي', 'حرير طبيعي', 'تصميم حصري'],
      rating: 4.9,
      reviews: 127,
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 2,
      name: 'عباءة الأناقة الرسمية',
      image: formalNavyAbaya,
      price: '320',
      originalPrice: '380',
      description: 'عباءة رسمية أنيقة للمناسبات المهمة والاجتماعات',
      features: ['تصميم رسمي', 'خامة راقية', 'مناسبة للعمل'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      isBestSeller: false,
      isNew: true
    },
    {
      id: 3,
      name: 'عباءة الراحة اليومية',
      image: casualBeigeAbaya,
      price: '180',
      originalPrice: '220',
      description: 'عباءة مريحة للاستخدام اليومي بتصميم عملي وأنيق',
      features: ['قطن ناعم', 'تصميم مريح', 'سهلة الغسيل'],
      rating: 4.8,
      reviews: 156,
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 4,
      name: 'عباءة الرياضة النشطة',
      image: sportsGrayAbaya,
      price: '210',
      originalPrice: '260',
      description: 'عباءة رياضية مرنة ومريحة للأنشطة اليومية',
      features: ['قماش مرن', 'تصميم رياضي', 'تهوية ممتازة'],
      rating: 4.6,
      reviews: 73,
      inStock: true,
      isBestSeller: false,
      isNew: true
    },
    {
      id: 5,
      name: 'عباءة التراث الأصيل',
      image: traditionalBrownAbaya,
      price: '280',
      originalPrice: '340',
      description: 'عباءة تراثية بتطريز عربي أصيل وتصميم كلاسيكي',
      features: ['تطريز تراثي', 'تصميم كلاسيكي', 'جودة عالية'],
      rating: 4.8,
      reviews: 94,
      inStock: true,
      isBestSeller: false,
      isNew: false
    },
    {
      id: 6,
      name: 'عباءة الأفراح البيضاء',
      image: weddingWhiteAbaya,
      price: '520',
      originalPrice: '620',
      description: 'عباءة بيضاء فاخرة للأفراح والمناسبات الخاصة',
      features: ['لون أبيض ناصع', 'تطريز فضي', 'تصميم احتفالي'],
      rating: 4.9,
      reviews: 67,
      inStock: true,
      isBestSeller: false,
      isNew: true
    }
  ];

  // Categories data
  const categories = [
    {
      name: 'العبايات الملكية',
      value: 'luxury',
      icon: Crown,
      image: categoryLuxuryAbaya,
      color: 'from-purple-600 to-purple-800',
      description: 'تصاميم فاخرة وراقية للمناسبات الخاصة'
    },
    {
      name: 'العبايات اليومية',
      value: 'casual',
      icon: Heart,
      image: categoryCasualAbaya,
      color: 'from-rose-500 to-pink-600',
      description: 'راحة وأناقة في الاستخدام اليومي'
    },
    {
      name: 'العبايات الرسمية',
      value: 'formal',
      icon: Sparkles,
      image: categoryFormalAbaya,
      color: 'from-blue-600 to-slate-700',
      description: 'أناقة مهنية للعمل والمناسبات الرسمية'
    },
    {
      name: 'العبايات الرياضية',
      value: 'sports',
      icon: Users,
      image: categorySportsAbaya,
      color: 'from-green-600 to-emerald-700',
      description: 'حرية حركة ومرونة للحياة النشطة'
    },
    {
      name: 'عبايات الأفراح',
      value: 'wedding',
      icon: Gift,
      image: categoryWeddingAbaya,
      color: 'from-pink-600 to-rose-700',
      description: 'إطلالات احتفالية للمناسبات السعيدة'
    },
    {
      name: 'العبايات التراثية',
      value: 'traditional',
      icon: Award,
      image: categoryTraditionalAbaya,
      color: 'from-amber-600 to-orange-700',
      description: 'أصالة عربية بتطريز تراثي مميز'
    }
  ];

  // WhatsApp order handler
  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `🌹 أتشرف بطلب ${abayaName} من مجموعة عبايتي الحصرية
💰 السعر: ${price} ريال
📏 أرغب في معرفة المقاسات المتاحة والألوان

شكراً لكم 💖`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Store contact handler
  const handleStoreOrder = () => {
    const message = `👗 أرغب في إنشاء متجر العبايات الإلكتروني المتكامل "عبايتي"
🎨 مع تصاميم حصرية وأنظمة دفع متقدمة
📱 تجربة تسوق استثنائية للعملاء

أرغب في معرفة التفاصيل والأسعار 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50" dir="rtl">
      <AbayaHeader />

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative py-20 md:py-32 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${abayaHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-rose-800/70 to-pink-900/80"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 md:top-20 right-10 md:right-20 w-16 h-16 md:w-32 md:h-32 border-2 border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-12 h-12 md:w-24 md:h-24 border-2 border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-40 md:h-40 border border-white/10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
              <Flower className="w-8 h-8 md:w-12 md:h-12 text-rose-300 animate-pulse" />
              <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-rose-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                أناقة لا تُضاهى
              </h2>
              <Flower className="w-8 h-8 md:w-12 md:h-12 text-purple-300 animate-pulse" />
            </div>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-purple-100 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              اكتشفي مجموعتنا الحصرية من العبايات المصممة خصيصاً لتعكس جمالك الطبيعي وأناقتك الفريدة
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-4">
              <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg">
                <Crown className="w-4 h-4 md:w-5 md:h-5 ml-2 animate-pulse" />
                <span className="hidden sm:inline">تصاميم ملكية حصرية</span>
                <span className="sm:hidden">تصاميم ملكية</span>
              </Badge>
              <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 ml-2 animate-pulse" />
                <span className="hidden sm:inline">جودة عالمية مضمونة</span>
                <span className="sm:hidden">جودة عالمية</span>
              </Badge>
              <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg">
                <Truck className="w-4 h-4 md:w-5 md:h-5 ml-2 animate-pulse" />
                <span className="hidden sm:inline">توصيل مجاني +200 ريال</span>
                <span className="sm:hidden">توصيل مجاني</span>
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 hover:from-rose-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl rounded-2xl"
                onClick={() => window.scrollTo({ top: document.getElementById('products')?.offsetTop || 0, behavior: 'smooth' })}
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                تسوقي الآن
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-semibold transition-all duration-300 hover:scale-105 rounded-2xl"
                onClick={() => handleStoreOrder()}
              >
                <Phone className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                تواصلي معنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section 
        id="categories" 
        className="py-12 md:py-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255, 240, 245, 0.8), rgba(250, 245, 255, 0.8)), url(${abayaCollectionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
              <Flower className="w-6 h-6 md:w-8 md:h-8 text-rose-500 animate-pulse" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">اختاري حسب المناسبة</h3>
              <Flower className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto px-4">
              لكل مناسبة عباءة تليق بك وتعكس شخصيتك المميزة وجمالك الطبيعي
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link key={category.value} to={`/abayati-store/${category.value}`}>
                <Card 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-700 group cursor-pointer border-0 relative animate-fade-in hover:-translate-y-3 hover:rotate-1"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 filter brightness-90 group-hover:brightness-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-60 transition-all duration-500`}></div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-2 border-white/40 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 right-8 w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
                    
                    <div className="absolute inset-0 p-3 md:p-4 lg:p-8 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                          <category.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      
                      <div className="transform group-hover:translate-y-1 transition-transform duration-500">
                        <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                          {category.name}
                        </h4>
                        <p className="text-xs sm:text-sm md:text-lg opacity-90 leading-relaxed group-hover:opacity-100 transition-opacity duration-300">
                          {category.description}
                        </p>
                        <div className="mt-1 md:mt-2 lg:mt-4 flex items-center gap-2 text-xs md:text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                          <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                          <span className="hidden sm:inline">تصاميم حصرية ومميزة</span>
                          <span className="sm:hidden">حصرية</span>
                          <Heart className="w-3 h-3 md:w-4 md:h-4 text-rose-300 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 lg:mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-pulse" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">مجموعتنا المميزة</h3>
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-rose-500 animate-pulse" />
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              تشكيلة رائعة من العبايات المصممة بعناية فائقة لتناسب جميع أذواقك واحتياجاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {abayas.map((abaya, index) => (
              <Card 
                key={abaya.id} 
                className="group relative overflow-hidden bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Status Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  {abaya.isNew && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-3 py-1 text-xs shadow-lg animate-pulse">
                      جديد
                    </Badge>
                  )}
                  {abaya.isBestSeller && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-3 py-1 text-xs shadow-lg">
                      الأكثر مبيعاً
                    </Badge>
                  )}
                </div>

                {/* Product Image */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden rounded-t-3xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4 md:p-6">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 transition-colors duration-300 ${
                            i < Math.floor(abaya.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-500 mr-2">({abaya.reviews})</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1 border-purple-200 text-purple-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {abaya.name}
                  </h4>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed line-clamp-2">
                    {abaya.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                    {abaya.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1 border-purple-200 text-purple-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">
                        {abaya.price} ريال
                      </span>
                      <span className="text-sm md:text-lg text-gray-400 line-through">
                        {abaya.originalPrice} ريال
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-2 py-1 text-xs">
                      -{Math.round(((parseFloat(abaya.originalPrice) - parseFloat(abaya.price)) / parseFloat(abaya.originalPrice)) * 100)}%
                    </Badge>
                  </div>

                  {/* Quick Add Button */}
                  <Button 
                    onClick={() => handleWhatsAppOrder(abaya.name, abaya.price)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 md:py-3 text-sm md:text-lg font-semibold transition-all duration-300 hover:shadow-lg rounded-xl"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    اطلبي عبر الواتساب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section 
        className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-50/80 to-rose-50/80"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 border border-rose-200/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-purple-200/50 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-pink-200/30 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
              <h3 className="text-5xl font-bold text-gray-800">لماذا تختارين عبايتي؟</h3>
              <Heart className="w-8 h-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن لسنا مجرد متجر عبايات، بل بيت للأناقة والجمال يحتضن أحلام كل امرأة عربية أصيلة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-purple-50/80 to-rose-50/80 backdrop-blur-sm rounded-3xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in border border-white/50" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">جودة لا تُضاهى</h4>
              <p className="text-gray-600 leading-relaxed">
                نستخدم أجود الخامات المستوردة من أوروبا وآسيا، مع عمليات فحص دقيقة لضمان الجودة الاستثنائية
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm rounded-3xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in border border-white/50" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">تصاميم حصرية</h4>
              <p className="text-gray-600 leading-relaxed">
                فريق من المصممين المتخصصين يبتكر تصاميم فريدة تجمع بين الأصالة العربية والعصرية الحديثة
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in border border-white/50" style={{ animationDelay: '0.5s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">خدمة عملاء مميزة</h4>
              <p className="text-gray-600 leading-relaxed">
                فريق نسائي متخصص يفهم احتياجاتك ويساعدك في اختيار العباءة المثالية التي تناسب شخصيتك
              </p>
            </div>
          </div>
        </div>
      </section>

      <AbayaFooter />
    </div>
  );
};

export default KashkhaAbayaStore;