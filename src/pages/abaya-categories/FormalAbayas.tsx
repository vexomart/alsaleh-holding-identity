import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Briefcase, ArrowLeft, Heart, Share2, Eye, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import abaya images
import formalNavyAbaya from '@/assets/abaya-formal-navy.jpg';
import luxuryBlackAbaya from '@/assets/abaya-luxury-black.jpg';
import categoryFormalAbaya from '@/assets/category-formal-abaya.jpg';

const FormalAbayas = () => {
  const formalAbayas = [
    {
      id: 3,
      name: 'عباءة الأعمال الكحلية',
      image: formalNavyAbaya,
      price: '380',
      originalPrice: '450',
      description: 'عباءة رسمية أنيقة للاجتماعات والمؤتمرات المهنية',
      features: ['تصميم كلاسيكي', 'نسيج راقي', 'قصة مهنية'],
      rating: 4.8,
      reviews: 156,
      inStock: true,
      isBestSeller: true
    },
    {
      id: 11,
      name: 'عباءة المدير التنفيذي',
      image: luxuryBlackAbaya,
      price: '520',
      originalPrice: '620',
      description: 'عباءة فاخرة للقيادات النسائية والمناصب العليا',
      features: ['تطريز راقي', 'خامة فاخرة', 'تصميم قيادي'],
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isNew: true
    },
    {
      id: 12,
      name: 'عباءة الدبلوماسية',
      image: formalNavyAbaya,
      price: '450',
      originalPrice: '530',
      description: 'عباءة رسمية للمناسبات الدبلوماسية والاجتماعات الرفيعة',
      features: ['تصميم دبلوماسي', 'أناقة راقية', 'جودة عالمية'],
      rating: 4.8,
      reviews: 67,
      inStock: true,
      isBestSeller: false
    },
    {
      id: 13,
      name: 'عباءة المحاكم الشرعية',
      image: luxuryBlackAbaya,
      price: '420',
      originalPrice: '490',
      description: 'عباءة رسمية متخصصة للمحاميات والعاملات في القضاء',
      features: ['تصميم متحفظ', 'خامة محترمة', 'لون رسمي'],
      rating: 4.7,
      reviews: 123,
      inStock: true,
      isNew: false
    }
  ];

  const handleWhatsAppOrder = (abayaName: string, price: string) => {
    const message = `💼 السلام عليكم ورحمة الله وبركاته

🏢 أتشرف بطلب ${abayaName} من مجموعة العبايات الرسمية
💎 السعر: ${price} ريال
🎁 أرغب في معرفة تفاصيل أكثر عن المقاسات المتاحة والألوان

شكراً لكم 🌸`;
    const phoneNumber = '966500000000';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/abayati-store" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-200 to-slate-100 bg-clip-text text-transparent">
                العبايات الرسمية
              </h1>
              <p className="text-xl text-blue-100">
                مجموعة احترافية للاجتماعات المهنية والمناسبات الرسمية
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-slate-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                أناقة مهنية تعكس شخصيتك القيادية
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                مجموعة العبايات الرسمية مصممة خصيصاً للمرأة الناجحة في مجال الأعمال والمهن الحرة. 
                تصاميم أنيقة ومحترمة تمنحك الثقة والوقار في بيئة العمل الاحترافية.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white px-4 py-2">
                  <Briefcase className="w-4 h-4 ml-2" />
                  تصاميم مهنية احترافية
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  خامات عالية الجودة
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2">
                  قصات مناسبة للعمل
                </Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src={categoryFormalAbaya} 
                alt="العبايات الرسمية" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">مجموعة العبايات الرسمية</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عبايات أنيقة ومحترمة تناسب بيئة العمل المهنية وتعكس قوة شخصيتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {formalAbayas.map((abaya, index) => (
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
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 px-3 py-1 text-xs shadow-lg">
                    رسمي
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
                    <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="relative h-80 overflow-hidden rounded-t-3xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                    <Badge variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-600">
                      {abaya.rating}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
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
                        className="text-xs px-2 py-1 border-blue-200 text-blue-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-blue-600">
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
            <h3 className="text-3xl font-bold mb-4 text-gray-800">مميزات المجموعة الرسمية</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">تصاميم مهنية</h4>
              <p className="text-gray-600">
                قصات أنيقة ومحترمة تناسب بيئة العمل الاحترافية والاجتماعات المهمة
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">جودة عالية</h4>
              <p className="text-gray-600">
                خامات فاخرة مقاومة للتجاعيد تحافظ على مظهرك الأنيق طوال اليوم
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">راحة تامة</h4>
              <p className="text-gray-600">
                تصاميم مريحة تسمح بحرية الحركة دون التأثير على الأناقة المهنية
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormalAbayas;