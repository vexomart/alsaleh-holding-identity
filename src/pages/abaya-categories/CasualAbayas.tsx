import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Heart, Coffee, Sun, ArrowLeft, Eye, Share2 } from 'lucide-react';
import AbayaHeader from '@/components/abaya-store/AbayaHeader';
import AbayaFooter from '@/components/abaya-store/AbayaFooter';

// Import abaya images
import casualBeigeAbaya from '@/assets/abaya-casual-beige.jpg';
import categoryCasualAbaya from '@/assets/category-casual-abaya.jpg';

const CasualAbayas = () => {
  const casualAbayas = [
    {
      id: 1,
      name: 'عباءة الراحة اليومية',
      image: casualBeigeAbaya,
      price: '180',
      originalPrice: '220',
      description: 'عباءة مريحة للاستخدام اليومي بتصميم عملي وأنيق',
      features: ['قطن ناعم', 'تصميم مريح', 'سهلة الغسيل'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      isBestSeller: true
    },
    {
      id: 2,
      name: 'عباءة الكاجوال الأنيقة',
      image: casualBeigeAbaya,
      price: '220',
      originalPrice: '270',
      description: 'عباءة كاجوال بلمسة عصرية مناسبة للخروجات اليومية',
      features: ['تصميم عصري', 'خامة مميزة', 'ألوان متنوعة'],
      rating: 4.6,
      reviews: 134,
      inStock: true,
      isNew: false
    },
    {
      id: 3,
      name: 'عباءة النزهة المريحة',
      image: casualBeigeAbaya,
      price: '160',
      originalPrice: '200',
      description: 'عباءة خفيفة ومريحة مثالية للنزهات والمشاوير',
      features: ['خفيفة الوزن', 'مقاومة التجعد', 'تهوية ممتازة'],
      rating: 4.8,
      reviews: 76,
      inStock: true,
      isNew: true
    }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `🌸 السلام عليكم ورحمة الله وبركاته

🌹 أتشرف بطلب ${abayaName} من مجموعة العبايات اليومية
💰 السعر: ${price} ريال
📏 أرغب في معرفة المقاسات المتاحة والألوان

شكراً لكم 💖`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50" dir="rtl">
      <AbayaHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-12 h-12 text-yellow-300 animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                  العبايات اليومية
                </h1>
              </div>
              <p className="text-xl leading-relaxed mb-8">
                مجموعة مثالية للمرأة العملية التي تبحث عن الأناقة والراحة في آن واحد. 
                تصاميم عملية مع خامات مريحة تناسب الحياة اليومية النشطة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white px-4 py-2">
                  <Coffee className="w-4 h-4 ml-2" />
                  راحة طوال اليوم
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  خامات طبيعية مريحة
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  تصاميم عملية وأنيقة
                </Badge>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img 
                src={categoryCasualAbaya} 
                alt="العبايات اليومية" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sun className="w-8 h-8 text-orange-500 animate-pulse" />
              <h3 className="text-4xl font-bold text-gray-800">مجموعة العبايات اليومية</h3>
              <Sun className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختاري عباءتك المثالية للحياة اليومية بتصاميم مريحة وعملية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {casualAbayas.map((abaya, index) => (
              <Card 
                key={abaya.id} 
                className="group relative overflow-hidden bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
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
                  <Badge className="bg-gradient-to-r from-rose-600 to-pink-700 text-white border-0 px-3 py-1 text-xs shadow-lg">
                    يومي
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
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
                <div className="relative h-80 overflow-hidden rounded-t-3xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Product Info */}
                <CardContent className="p-6">
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
                    <Badge variant="outline" className="text-xs px-2 py-1 border-orange-200 text-orange-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {abaya.name}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {abaya.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {abaya.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1 border-orange-200 text-orange-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-orange-600">
                        {abaya.price} ريال
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {abaya.originalPrice} ريال
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-2 py-1 text-xs">
                      -{Math.round(((parseFloat(abaya.originalPrice) - parseFloat(abaya.price)) / parseFloat(abaya.originalPrice)) * 100)}%
                    </Badge>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => handleWhatsAppOrder(abaya.name, abaya.price)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg rounded-xl"
                  >
                    <Phone className="w-5 h-5 ml-2" />
                    اطلبي عبر الواتساب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50/80 to-rose-50/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">مميزات المجموعة اليومية</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">راحة طوال اليوم</h4>
              <p className="text-gray-600">
                تصاميم مدروسة تضمن لك الراحة والحرية في الحركة طوال اليوم
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">خامات طبيعية</h4>
              <p className="text-gray-600">
                أقمشة قطنية وطبيعية تتنفس مع البشرة وتوفر راحة استثنائية
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">سهولة العناية</h4>
              <p className="text-gray-600">
                أقمشة مقاومة للتجعد وسهلة الغسيل والعناية لحياة عملية أكثر
              </p>
            </div>
          </div>
        </div>
      </section>

      <AbayaFooter />
    </div>
  );
};

export default CasualAbayas;