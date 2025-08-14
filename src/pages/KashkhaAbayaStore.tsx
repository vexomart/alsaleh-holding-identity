import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Crown, Heart, Sparkles, Gift, Users, Clock, Award, ShoppingBag, Eye, ArrowLeft, Plus, Share2, Bookmark } from 'lucide-react';

// Import category images
import categoryLuxuryAbaya from '@/assets/category-luxury-abaya.jpg';
import categoryCasualAbaya from '@/assets/category-casual-abaya.jpg';
import categoryFormalAbaya from '@/assets/category-formal-abaya.jpg';
import categorySportsAbaya from '@/assets/category-sports-abaya.jpg';
import categoryWeddingAbaya from '@/assets/category-wedding-abaya.jpg';
import categoryTraditionalAbaya from '@/assets/category-traditional-abaya.jpg';

// Import abaya images
import luxuryBlackAbaya from '@/assets/abaya-luxury-black.jpg';
import casualBeigeAbaya from '@/assets/abaya-casual-beige.jpg';
import formalNavyAbaya from '@/assets/abaya-formal-navy.jpg';
import sportsGrayAbaya from '@/assets/abaya-sports-gray.jpg';
import weddingWhiteAbaya from '@/assets/abaya-wedding-white.jpg';
import traditionalBrownAbaya from '@/assets/abaya-traditional-brown.jpg';

const KashkhaAbayaStore = () => {
  const abayas = [
    {
      id: 1,
      name: 'عباءة الأميرات السوداء',
      image: luxuryBlackAbaya,
      category: 'luxury',
      price: '450',
      originalPrice: '520',
      description: 'عباءة ملكية بتطريز ذهبي فاخر وخامات حريرية استثنائية',
      features: ['تطريز يدوي', 'حرير طبيعي', 'تصميم حصري'],
      rating: 4.9,
      reviews: 127,
      inStock: true,
      isNew: false,
      isBestSeller: true
    },
    {
      id: 2,
      name: 'عباءة النهار البيج',
      image: casualBeigeAbaya,
      category: 'casual',
      price: '280',
      originalPrice: '320',
      description: 'عباءة يومية أنيقة بقصة عصرية مريحة وعملية',
      features: ['قطن ممتاز', 'قصة مريحة', 'ألوان هادئة'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      isNew: true,
      isBestSeller: false
    },
    {
      id: 3,
      name: 'عباءة المناسبات الكحلية',
      image: formalNavyAbaya,
      category: 'formal',
      price: '380',
      originalPrice: '450',
      description: 'عباءة رسمية راقية للمناسبات الخاصة والاجتماعات المهمة',
      features: ['تصميم كلاسيكي', 'خامة فاخرة', 'قصة أنيقة'],
      rating: 4.8,
      reviews: 156,
      inStock: true,
      isNew: false,
      isBestSeller: true
    },
    {
      id: 4,
      name: 'عباءة الرياضة الرمادية',
      image: sportsGrayAbaya,
      category: 'sports',
      price: '320',
      originalPrice: '380',
      description: 'عباءة رياضية عملية مصممة خصيصاً للحياة النشطة',
      features: ['قماش مرن', 'مقاوم للرطوبة', 'تصميم رياضي'],
      rating: 4.6,
      reviews: 203,
      inStock: true,
      isNew: false,
      isBestSeller: false
    },
    {
      id: 5,
      name: 'عباءة الأحلام البيضاء',
      image: weddingWhiteAbaya,
      category: 'wedding',
      price: '650',
      originalPrice: '750',
      description: 'عباءة زفاف حالمة بتفاصيل لؤلؤية وتطريز فضي رائع',
      features: ['تطريز لؤلؤي', 'تصميم زفاف', 'خامة حريرية'],
      rating: 5.0,
      reviews: 78,
      inStock: true,
      isNew: true,
      isBestSeller: true
    },
    {
      id: 6,
      name: 'عباءة التراث البنية',
      image: traditionalBrownAbaya,
      category: 'traditional',
      price: '420',
      originalPrice: '480',
      description: 'عباءة تراثية أصيلة تحتفي بالهوية العربية العريقة',
      features: ['نقوش تراثية', 'تصميم أصيل', 'خامة تقليدية'],
      rating: 4.8,
      reviews: 94,
      inStock: true,
      isNew: false,
      isBestSeller: false
    },
    {
      id: 7,
      name: 'عباءة الشتاء الدافئة',
      image: luxuryBlackAbaya,
      category: 'casual',
      price: '380',
      originalPrice: '440',
      description: 'عباءة شتوية فاخرة مبطنة للدفء والراحة',
      features: ['بطانة دافئة', 'مقاومة للرياح', 'تصميم أنيق'],
      rating: 4.7,
      reviews: 67,
      inStock: true,
      isNew: true,
      isBestSeller: false
    },
    {
      id: 8,
      name: 'عباءة السهرة المخملية',
      image: formalNavyAbaya,
      category: 'luxury',
      price: '580',
      originalPrice: '680',
      description: 'عباءة سهرة فاخرة من المخمل الراقي للمناسبات الخاصة',
      features: ['مخمل فاخر', 'تطريز فضي', 'قصة ملكية'],
      rating: 4.9,
      reviews: 143,
      inStock: false,
      isNew: false,
      isBestSeller: true
    },
    {
      id: 9,
      name: 'عباءة الصيف المنعشة',
      image: casualBeigeAbaya,
      category: 'casual',
      price: '250',
      originalPrice: '290',
      description: 'عباءة صيفية خفيفة ومنعشة للأيام الحارة',
      features: ['قماش مسامي', 'خفيفة الوزن', 'مقاومة للحرارة'],
      rating: 4.5,
      reviews: 112,
      inStock: true,
      isNew: true,
      isBestSeller: false
    }
  ];

  const categories = [
    { name: 'الملكية', value: 'luxury', icon: Crown, image: categoryLuxuryAbaya, color: 'from-purple-600 to-purple-800', description: 'للمناسبات الفاخرة' },
    { name: 'اليومية', value: 'casual', icon: Heart, image: categoryCasualAbaya, color: 'from-rose-500 to-rose-700', description: 'للحياة العملية' },
    { name: 'الرسمية', value: 'formal', icon: Sparkles, image: categoryFormalAbaya, color: 'from-blue-600 to-blue-800', description: 'للاجتماعات المهمة' },
    { name: 'الرياضية', value: 'sports', icon: ShoppingBag, image: categorySportsAbaya, color: 'from-green-600 to-green-800', description: 'للأنشطة الرياضية' },
    { name: 'الأفراح', value: 'wedding', icon: Gift, image: categoryWeddingAbaya, color: 'from-pink-600 to-pink-800', description: 'للمناسبات السعيدة' },
    { name: 'التراثية', value: 'traditional', icon: Eye, image: categoryTraditionalAbaya, color: 'from-amber-600 to-amber-800', description: 'للأصالة العربية' }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `✨ السلام عليكم ورحمة الله وبركاته

🌹 أتشرف بطلب ${abayaName} من مجموعة كشخة الحصرية
💎 السعر: ${price} ريال
🎁 أرغب في معرفة تفاصيل أكثر عن المقاسات المتاحة والألوان

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleStoreOrder = () => {
    const message = `🌟 السلام عليكم ورحمة الله وبركاته

👗 أرغب في إنشاء متجر العبايات الإلكتروني المتكامل "كشخة"

📋 تفاصيل الطلب:
• السعر: 2000 ريال سعودي
• مدة التنفيذ: 25 يوم عمل
• يتضمن: تصميم حصري للعبايات، إدارة المنتجات، تكامل الواتساب، لوحة تحكم

أرجو التواصل معي لبدء المشروع 🌸`;
    
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50" dir="rtl">
      {/* Custom Header for Abaya Store */}
      <header className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-rose-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-rose-200 to-purple-200 bg-clip-text text-transparent">
                  كشخة للعبايات
                </h1>
                <p className="text-sm md:text-lg text-purple-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  بيت الأناقة والجمال العربي الأصيل
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-sm md:text-lg px-3 py-2 md:px-6 md:py-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                <span className="hidden sm:inline">اطلبي عبر الواتساب</span>
                <span className="sm:hidden">الواتساب</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          {/* Decorative elements */}
          <div className="absolute top-10 md:top-20 right-10 md:right-20 w-16 h-16 md:w-32 md:h-32 border-2 border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-12 h-12 md:w-24 md:h-24 border-2 border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-40 md:h-40 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              مجموعة العبايات
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                الحصرية والمميزة
              </span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              اكتشفي عالماً من الأناقة والرقي مع مجموعتنا الفريدة من العبايات المصممة خصيصاً 
              للمرأة العربية العصرية التي تقدر الجمال والأصالة
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-base md:text-lg">
              <div className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                <span className="font-semibold text-sm md:text-base">جودة استثنائية</span>
                <span className="text-xs md:text-sm text-purple-100 text-center">خامات مستوردة فاخرة</span>
              </div>
              <div className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                <span className="font-semibold text-sm md:text-base">+1500 عميلة سعيدة</span>
                <span className="text-xs md:text-sm text-purple-100 text-center">ثقة وتقدير من عملائنا</span>
              </div>
              <div className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                <span className="font-semibold text-sm md:text-base">توصيل سريع</span>
                <span className="text-xs md:text-sm text-purple-100 text-center">لجميع مناطق المملكة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800">اختاري حسب المناسبة</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              لكل مناسبة عباءة تليق بك وتعكس شخصيتك المميزة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {categories.map((category) => (
              <Card key={category.value} className="overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer border-0 relative">
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
                  
                  <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <category.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-white/30 rounded-full"></div>
                    </div>
                    
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-300">{category.name}</h4>
                      <p className="text-sm md:text-lg opacity-90 leading-relaxed">{category.description}</p>
                      <div className="mt-2 md:mt-4 flex items-center gap-2 text-xs md:text-sm">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        <span>تصاميم حصرية</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 w-6 h-6 md:w-8 md:h-8 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute top-1/2 right-3 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 rounded-full"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-800">مجموعة العبايات المميزة</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              كل قطعة في مجموعتنا مصممة بعناية فائقة وحب كبير لتمنحك إطلالة ساحرة ومميزة
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
                  {!abaya.inStock && (
                    <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 px-3 py-1 text-xs shadow-lg">
                      نفد المخزون
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                  <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Share2 className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Eye className="w-4 h-4 text-gray-600 hover:text-purple-500 transition-colors" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="relative h-72 md:h-80 overflow-hidden rounded-t-3xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                  />
                  
                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <Button 
                      onClick={() => handleWhatsAppOrder(abaya.name, abaya.price)}
                      className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white px-6 py-2 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة سريعة
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-5 md:p-6 relative">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 md:w-4 md:h-4 transition-colors duration-300 ${
                            i < Math.floor(abaya.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-xs md:text-sm text-gray-500 mr-2">({abaya.reviews})</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1 border-purple-200 text-purple-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg md:text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                    {abaya.name}
                  </h4>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                    {abaya.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                    {abaya.features.slice(0, 2).map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1 border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {abaya.features.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-1 border-gray-200 text-gray-500">
                        +{abaya.features.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
                        {abaya.price} ريال
                      </span>
                      {abaya.originalPrice !== abaya.price && (
                        <span className="text-base md:text-lg text-gray-400 line-through">
                          {abaya.originalPrice} ريال
                        </span>
                      )}
                    </div>
                    {abaya.originalPrice !== abaya.price && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-2 py-1 text-xs animate-pulse">
                        -{Math.round(((parseFloat(abaya.originalPrice) - parseFloat(abaya.price)) / parseFloat(abaya.originalPrice)) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => handleWhatsAppOrder(abaya.name, abaya.price)}
                    disabled={!abaya.inStock}
                    className={`w-full py-3 text-base font-semibold transition-all duration-500 rounded-xl hover:shadow-lg group-hover:scale-105 ${
                      abaya.inStock 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    {abaya.inStock ? (
                      <>
                        <span className="hidden sm:inline">اطلبي عبر الواتساب</span>
                        <span className="sm:hidden">طلب</span>
                      </>
                    ) : (
                      'غير متوفر'
                    )}
                  </Button>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-6 text-gray-800">لماذا تختارين كشخة؟</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن لسنا مجرد متجر عبايات، بل بيت للأناقة والجمال يحتضن أحلام كل امرأة عربية أصيلة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">جودة لا تُضاهى</h4>
              <p className="text-gray-600 leading-relaxed">
                نستخدم أجود الخامات المستوردة من أوروبا وآسيا، مع عمليات فحص دقيقة لضمان الجودة الاستثنائية
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">تصاميم حصرية</h4>
              <p className="text-gray-600 leading-relaxed">
                فريق من المصممين المتخصصين يبتكر تصاميم فريدة تجمع بين الأصالة العربية والعصرية الحديثة
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center">
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

      {/* Store Info */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-rose-600">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-rose-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-2">أنشئي متجر العبايات الخاص بك</CardTitle>
              <p className="text-lg text-gray-600">احصلي على متجر إلكتروني متكامل مثل "كشخة" بتصميم حصري ومميز</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-lg font-semibold text-gray-800">السعر: 2000 ريال سعودي</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    <span className="text-lg font-semibold text-gray-800">مدة التنفيذ: 25 يوم عمل</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800 mb-3">يتضمن المتجر:</h5>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-purple-600" />
                      تصميم حصري مستوحى من ثقافة العبايات
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-purple-600" />
                      نظام إدارة المنتجات والطلبات
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-purple-600" />
                      تكامل مع الواتساب للطلبات
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-purple-600" />
                      لوحة تحكم إدارية متكاملة
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <Button 
                  onClick={handleStoreOrder}
                  className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white px-8 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="w-6 h-6 ml-3" />
                  ابدئي متجرك الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Custom Footer for Abaya Store */}
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent">
                  كشخة للعبايات
                </h4>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                بيت الأناقة والجمال العربي الأصيل، حيث نصنع لك عباءة أحلامك التي تعكس 
                شخصيتك المميزة وتبرز جمالك الطبيعي بأسلوب راقي وعصري.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gradient-to-r from-rose-600 to-purple-600 text-white border-0 px-4 py-2">
                  <Crown className="w-4 h-4 ml-2" />
                  تصاميم ملكية
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2">
                  <Award className="w-4 h-4 ml-2" />
                  جودة استثنائية
                </Badge>
                <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0 px-4 py-2">
                  <Heart className="w-4 h-4 ml-2" />
                  صنع بحب
                </Badge>
              </div>
            </div>
            
            <div>
              <h5 className="text-xl font-semibold mb-6 text-rose-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                مجموعاتنا المميزة
              </h5>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-rose-300 transition-colors cursor-pointer">👑 العبايات الملكية</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">🌹 العبايات اليومية</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">✨ العبايات الرسمية</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">🏃‍♀️ العبايات الرياضية</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">💒 عبايات الأفراح</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">🏛️ العبايات التراثية</li>
                <li className="hover:text-rose-300 transition-colors cursor-pointer">🎨 التصاميم حسب الطلب</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                تواصلي معنا
              </h5>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">الواتساب</p>
                    <p className="text-sm">966500000000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">@</span>
                  </div>
                  <div>
                    <p className="font-semibold">البريد الإلكتروني</p>
                    <p className="text-sm">info@kashkha.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold">العنوان</p>
                    <p className="text-sm">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-purple-200 mb-2">⏰ أوقات العمل</p>
                  <p className="text-sm">الأحد - الخميس: 9 صباحاً - 10 مساءً</p>
                  <p className="text-sm">الجمعة - السبت: 2 ظهراً - 11 مساءً</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2024 كشخة للعبايات. جميع الحقوق محفوظة.
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                تطوير بحب في 
                <span className="text-purple-300 font-semibold">شركة علي صالح الشهري القابضة</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KashkhaAbayaStore;