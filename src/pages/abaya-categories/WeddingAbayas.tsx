import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Gift, ArrowLeft, Heart, Share2, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import abaya images
import weddingWhiteAbaya from '@/assets/abaya-wedding-white.jpg';
import luxuryBlackAbaya from '@/assets/abaya-luxury-black.jpg';
import categoryWeddingAbaya from '@/assets/category-wedding-abaya.jpg';

const WeddingAbayas = () => {
  const weddingAbayas = [
    {
      id: 18,
      name: 'عباءة العروس البيضاء',
      image: weddingWhiteAbaya,
      price: '680',
      originalPrice: '780',
      description: 'عباءة فاخرة للعروس بتطريز لؤلؤي وتفاصيل ذهبية مذهلة',
      features: ['تطريز لؤلؤي', 'تفاصيل ذهبية', 'تصميم حصري'],
      rating: 5.0,
      reviews: 67,
      inStock: true,
      isBestSeller: true
    },
    {
      id: 19,
      name: 'عباءة والدة العروس',
      image: luxuryBlackAbaya,
      price: '520',
      originalPrice: '620',
      description: 'عباءة أنيقة لوالدة العروس بتطريز فضي راقي ولمسات كريستالية',
      features: ['تطريز فضي', 'كريستال راقي', 'قصة كلاسيكية'],
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isNew: true
    },
    {
      id: 20,
      name: 'عباءة حفل الحناء',
      image: weddingWhiteAbaya,
      price: '450',
      originalPrice: '530',
      description: 'عباءة مميزة لحفلات الحناء والمناسبات التراثية بألوان زاهية',
      features: ['ألوان زاهية', 'تطريز تراثي', 'قماش حريري'],
      rating: 4.8,
      reviews: 76,
      inStock: true,
      isBestSeller: false
    },
    {
      id: 21,
      name: 'عباءة ضيفة الفرح',
      image: luxuryBlackAbaya,
      price: '380',
      originalPrice: '450',
      description: 'عباءة أنيقة للضيفات في حفلات الزفاف والمناسبات السعيدة',
      features: ['تصميم احتفالي', 'خامة فاخرة', 'تفاصيل أنيقة'],
      rating: 4.7,
      reviews: 134,
      inStock: true,
      isNew: false
    }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `💐 السلام عليكم ورحمة الله وبركاته

🎉 أتشرف بطلب ${abayaName} من مجموعة عبايات الأفراح
💎 السعر: ${price} ريال
🎁 أرغب في معرفة تفاصيل أكثر عن المقاسات المتاحة والألوان

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-pink-900 via-rose-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/kashkha-store" className="inline-flex items-center gap-2 text-pink-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-200 to-rose-100 bg-clip-text text-transparent">
                عبايات الأفراح
              </h1>
              <p className="text-xl text-pink-100">
                مجموعة احتفالية للمناسبات السعيدة والأفراح المميزة
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                إطلالة احتفالية تليق بفرحتك
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                مجموعة عبايات الأفراح مصممة خصيصاً للمناسبات السعيدة وحفلات الزفاف. 
                تصاميم فاخرة بتطريز راقي وتفاصيل مميزة تجعلك تتألقين في كل مناسبة سعيدة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white px-4 py-2">
                  <Gift className="w-4 h-4 ml-2" />
                  تصاميم احتفالية مميزة
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  تطريز لؤلؤي وذهبي
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  خامات حريرية فاخرة
                </Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src={categoryWeddingAbaya} 
                alt="عبايات الأفراح" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">مجموعة عبايات الأفراح</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عبايات فاخرة مصممة خصيصاً للمناسبات السعيدة لتكوني محط الأنظار
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {weddingAbayas.map((abaya, index) => (
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
                  <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0 px-3 py-1 text-xs shadow-lg">
                    احتفالي
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
                    <Eye className="w-4 h-4 text-gray-600 hover:text-pink-500 transition-colors" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="relative h-80 overflow-hidden rounded-t-3xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                    <Badge variant="outline" className="text-xs px-2 py-1 border-pink-200 text-pink-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
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
                        className="text-xs px-2 py-1 border-pink-200 text-pink-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-pink-600">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">مميزات مجموعة الأفراح</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">تصاميم احتفالية</h4>
              <p className="text-gray-600">
                تصاميم مميزة وفاخرة مصممة خصيصاً للمناسبات السعيدة والأفراح
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">تطريز فاخر</h4>
              <p className="text-gray-600">
                تطريز لؤلؤي وذهبي راقي يضفي لمسة من الفخامة والتميز
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">خامات حريرية</h4>
              <p className="text-gray-600">
                أجود أنواع الحرير والأقمشة الفاخرة للحصول على إطلالة مثالية
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeddingAbayas;