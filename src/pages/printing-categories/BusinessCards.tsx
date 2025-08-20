import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, CheckCircle, Ruler, CreditCard, Smartphone, QrCode, Palette, Sparkles } from "lucide-react";
import businessCardsHeroImg from "@/assets/printing/business-cards-category.jpg";
import basicBusinessCardsImg from "@/assets/printing/basic-business-cards.jpg";
import digitalBusinessCardsImg from "@/assets/printing/digital-business-cards.jpg";

const BusinessCards = () => {
  const products = [
    {
      title: "كروت شخصية أساسية",
      description: "كروت شخصية بتصميم كلاسيكي أنيق ومناسب لجميع المهن",
      price: "من 199 ريال",
      originalPrice: "299 ريال",
      image: basicBusinessCardsImg,
      rating: 4.8,
      reviews: 250,
      sizes: ["9 × 5 سم", "8.5 × 5.4 سم", "10 × 6 سم"],
      features: [
        "تصميم كلاسيكي أنيق",
        "ورق مقوى 350 جرام",
        "طباعة ملونة عالية الجودة",
        "تشطيب لامع أو مطفي",
        "تصميم مجاني",
        "مراجعات غير محدودة"
      ],
      category: "أساسي",
      icon: CreditCard,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "كروت شخصية رقمية",
      description: "كروت شخصية ذكية مع تقنية NFC وQR Code للمشاركة الفورية",
      price: "من 299 ريال",
      originalPrice: "399 ريال",
      image: digitalBusinessCardsImg,
      rating: 4.9,
      reviews: 180,
      sizes: ["8.6 × 5.4 سم (ISO)", "9 × 5.5 سم", "مقاس مخصص"],
      features: [
        "تقنية NFC متقدمة",
        "كود QR مخصص",
        "ربط مع الملف الشخصي",
        "مشاركة فورية للمعلومات",
        "تحديث المعلومات أونلاين",
        "تتبع المشاهدات والتفاعل"
      ],
      category: "متقدم",
      icon: Smartphone,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const benefits = [
    {
      icon: Palette,
      title: "تصميمات متنوعة",
      description: "أكثر من 100 تصميم جاهز أو تصميم مخصص حسب طلبك"
    },
    {
      icon: CheckCircle,
      title: "جودة عالية",
      description: "خامات فاخرة وطباعة عالية الدقة تضمن النتيجة المثالية"
    },
    {
      icon: QrCode,
      title: "تقنيات حديثة",
      description: "دعم للتقنيات الذكية مثل NFC وQR Code"
    },
    {
      icon: Sparkles,
      title: "خدمة شاملة",
      description: "من التصميم إلى الطباعة والتسليم في 24 ساعة"
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="كروت شخصية"
        description="كروت شخصية احترافية بتصميمات فاخرة وخامات عالية الجودة"
        showBackButton
        backButtonFallback="/printing/business-stationery"
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative h-80 rounded-3xl overflow-hidden mb-16 group">
          <img 
            src={businessCardsHeroImg} 
            alt="كروت شخصية احترافية"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-600/70"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-yellow-300 animate-pulse mr-2" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  كروت شخصية احترافية
                </h2>
                <CreditCard className="w-8 h-8 text-yellow-300 animate-pulse ml-2" />
              </div>
              <p className="text-xl text-white/90 mb-6">اترك انطباعاً أولاً لا يُنسى</p>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-lg">
                ✨ تصميم مجاني - جودة عالمية
              </Badge>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover-scale animate-fade-in border border-gray-200 hover:border-blue-300 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">منتجاتنا المتميزة</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر من مجموعة متنوعة من الكروت الشخصية التي تناسب احتياجاتك ومتطلباتك المهنية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <Card 
                  key={index} 
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-80`}></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white px-2 py-1">
                        وفر {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-gradient-to-r ${product.gradient} text-white px-3 py-1`}>
                        {product.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-white">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Available Sizes */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">المقاسات المتاحة:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, sizeIndex) => (
                          <Badge key={sizeIndex} variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-700">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">المميزات المتضمنة:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{product.price}</span>
                        <span className="text-sm text-gray-400 line-through mr-2">{product.originalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className={`flex-1 bg-gradient-to-r ${product.gradient} hover:opacity-90 text-white`}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        اطلب الآن
                      </Button>
                      <Button variant="outline" size="icon" className="hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100 text-center">
          <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-6 animate-pulse" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            احصل على استشارة مجانية
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            فريقنا من خبراء التصميم جاهز لمساعدتك في اختيار التصميم المثالي وتقديم النصائح المهنية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg hover-scale">
              احجز استشارة الآن
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg hover-scale">
              عرض التصميمات
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessCards;