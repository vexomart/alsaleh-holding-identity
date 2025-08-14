import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Activity, ArrowLeft, Heart, Share2, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import abaya images
import sportsGrayAbaya from '@/assets/abaya-sports-gray.jpg';
import casualBeigeAbaya from '@/assets/abaya-casual-beige.jpg';
import categorySportsAbaya from '@/assets/category-sports-abaya.jpg';

const SportsAbayas = () => {
  const sportsAbayas = [
    {
      id: 14,
      name: 'عباءة الرياضة الرمادية',
      image: sportsGrayAbaya,
      price: '320',
      originalPrice: '380',
      description: 'عباءة رياضية مريحة مصممة للأنشطة البدنية والرياضية',
      features: ['قماش رياضي', 'قصة مريحة', 'مقاومة للعرق'],
      rating: 4.6,
      reviews: 98,
      inStock: true,
      isBestSeller: true
    },
    {
      id: 15,
      name: 'عباءة اليوغا المرنة',
      image: casualBeigeAbaya,
      price: '280',
      originalPrice: '340',
      description: 'عباءة مرنة خاصة لممارسة اليوغا والتأمل والتمارين الخفيفة',
      features: ['قماش مرن', 'خفيفة الوزن', 'مسامية عالية'],
      rating: 4.7,
      reviews: 76,
      inStock: true,
      isNew: true
    },
    {
      id: 16,
      name: 'عباءة المشي النشط',
      image: sportsGrayAbaya,
      price: '350',
      originalPrice: '420',
      description: 'عباءة مثالية للمشي والجري الخفيف والأنشطة الخارجية',
      features: ['مقاومة الرياح', 'جيوب عملية', 'تصميم ديناميكي'],
      rating: 4.8,
      reviews: 124,
      inStock: true,
      isBestSeller: false
    },
    {
      id: 17,
      name: 'عباءة الجيم المتقدمة',
      image: casualBeigeAbaya,
      price: '380',
      originalPrice: '450',
      description: 'عباءة متطورة للتمارين المكثفة وصالات الألعاب الرياضية',
      features: ['تقنية التبريد', 'مقاومة البكتيريا', 'تصميم احترافي'],
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isNew: true
    }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `🏃‍♀️ السلام عليكم ورحمة الله وبركاته

⚡ أتشرف بطلب ${abayaName} من مجموعة العبايات الرياضية
💎 السعر: ${price} ريال
🎁 أرغب في معرفة تفاصيل أكثر عن المقاسات المتاحة والألوان

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/abayati-store" className="inline-flex items-center gap-2 text-green-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
                العبايات الرياضية
              </h1>
              <p className="text-xl text-green-100">
                مجموعة نشطة للمرأة الرياضية التي تحب الحركة والنشاط
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                حرية الحركة مع الأناقة العصرية
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                مجموعة العبايات الرياضية مصممة خصيصاً للمرأة النشطة التي تمارس الرياضة وتحب الحركة. 
                خامات تقنية متطورة تضمن الراحة والجفاف أثناء الأنشطة البدنية المختلفة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white px-4 py-2">
                  <Activity className="w-4 h-4 ml-2" />
                  مصممة للحركة والنشاط
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  خامات تقنية متقدمة
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  مقاومة للعرق والرطوبة
                </Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src={categorySportsAbaya} 
                alt="العبايات الرياضية" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">مجموعة العبايات الرياضية</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عبايات عملية ومريحة تدعم نمط حياتك النشط دون التنازل عن الأناقة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {sportsAbayas.map((abaya, index) => (
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
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 px-3 py-1 text-xs shadow-lg">
                    رياضي
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
                    <Eye className="w-4 h-4 text-gray-600 hover:text-green-500 transition-colors" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="relative h-80 overflow-hidden rounded-t-3xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                    <Badge variant="outline" className="text-xs px-2 py-1 border-green-200 text-green-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
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
                        className="text-xs px-2 py-1 border-green-200 text-green-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-green-600">
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
            <h3 className="text-3xl font-bold mb-4 text-gray-800">مميزات المجموعة الرياضية</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">حرية الحركة</h4>
              <p className="text-gray-600">
                تصاميم مرنة ومريحة تسمح بحرية كاملة في الحركة أثناء التمارين
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">تقنية متقدمة</h4>
              <p className="text-gray-600">
                خامات تقنية تمتص العرق وتحافظ على الجفاف والراحة
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">تهوية ممتازة</h4>
              <p className="text-gray-600">
                نسيج مسامي يضمن التهوية المثالية والراحة طوال فترة التمرين
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SportsAbayas;