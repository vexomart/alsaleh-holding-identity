import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Heart, ArrowLeft, Share2, Eye, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import abaya images
import casualBeigeAbaya from '@/assets/abaya-casual-beige.jpg';
import traditionalBrownAbaya from '@/assets/abaya-traditional-brown.jpg';
import categoryCasualAbaya from '@/assets/category-casual-abaya.jpg';

const CasualAbayas = () => {
  const casualAbayas = [
    {
      id: 2,
      name: 'عباءة النهار البيج',
      image: casualBeigeAbaya,
      price: '280',
      originalPrice: '320',
      description: 'عباءة يومية أنيقة بقصة عصرية مريحة وعملية',
      features: ['قطن ممتاز', 'قصة مريحة', 'ألوان هادئة'],
      rating: 4.7,
      reviews: 89,
      inStock: true,
      isNew: true
    },
    {
      id: 6,
      name: 'عباءة التراث البنية',
      image: traditionalBrownAbaya,
      price: '420',
      originalPrice: '480',
      description: 'عباءة تراثية أصيلة تحتفي بالهوية العربية العريقة',
      features: ['نقوش تراثية', 'تصميم أصيل', 'خامة تقليدية'],
      rating: 4.8,
      reviews: 94,
      inStock: true,
      isBestSeller: false
    },
    {
      id: 7,
      name: 'عباءة الشتاء الدافئة',
      image: casualBeigeAbaya,
      price: '380',
      originalPrice: '440',
      description: 'عباءة شتوية فاخرة مبطنة للدفء والراحة',
      features: ['بطانة دافئة', 'مقاومة للرياح', 'تصميم أنيق'],
      rating: 4.7,
      reviews: 67,
      inStock: true,
      isNew: true
    },
    {
      id: 9,
      name: 'عباءة الصيف المنعشة',
      image: casualBeigeAbaya,
      price: '250',
      originalPrice: '290',
      description: 'عباءة صيفية خفيفة ومنعشة للأيام الحارة',
      features: ['قماش مسامي', 'خفيفة الوزن', 'مقاومة للحرارة'],
      rating: 4.5,
      reviews: 112,
      inStock: true,
      isBestSeller: true
    }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `🌹 السلام عليكم ورحمة الله وبركاته

☀️ أتشرف بطلب ${abayaName} من مجموعة العبايات اليومية
💎 السعر: ${price} ريال
🎁 أرغب في معرفة تفاصيل أكثر عن المقاسات المتاحة والألوان

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-rose-600 via-orange-600 to-yellow-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/kashkha-store" className="inline-flex items-center gap-2 text-orange-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-200 to-orange-100 bg-clip-text text-transparent">
                العبايات اليومية
              </h1>
              <p className="text-xl text-orange-100">
                مجموعة مريحة وعملية للحياة اليومية والأنشطة العادية
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                الراحة والأناقة في كل يوم
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                مجموعة العبايات اليومية مصممة خصيصاً للمرأة العصرية التي تبحث عن الراحة والأناقة في آن واحد. 
                قطع عملية ومريحة تناسب جميع الأوقات والمناسبات اليومية.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white px-4 py-2">
                  <Coffee className="w-4 h-4 ml-2" />
                  مريحة للاستخدام اليومي
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  خامات عالية الجودة
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  تصاميم عملية وأنيقة
                </Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src={categoryCasualAbaya} 
                alt="العبايات اليومية" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">مجموعة العبايات اليومية</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عبايات مريحة وعملية تناسب نمط حياتك النشط مع الحفاظ على الأناقة والجمال
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
                  <Badge className="bg-gradient-to-r from-rose-600 to-orange-600 text-white border-0 px-3 py-1 text-xs shadow-lg">
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
                    <Eye className="w-4 h-4 text-gray-600 hover:text-orange-500 transition-colors" />
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
    </div>
  );
};

export default CasualAbayas;