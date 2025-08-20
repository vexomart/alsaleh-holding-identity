import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, CheckCircle, Ruler, CreditCard, Smartphone, QrCode, Palette, Sparkles } from "lucide-react";
import businessCardsHeroImg from "@/assets/printing/business-cards-hero-bg.jpg";
import businessCardsProductImg from "@/assets/printing/business-cards-category.jpg";
import ledBusinessCardsImg from "@/assets/printing/led-business-cards.jpg";
import spotUvBusinessCardsImg from "@/assets/printing/spot-uv-business-cards.jpg";
import goldFoilBusinessCardsImg from "@/assets/printing/gold-foil-business-cards.jpg";

const BusinessCards = () => {
  const products = [
    {
      title: "كروت شخصية أساسية ورقمية",
      description: "كروت شخصية عصرية تجمع بين الأناقة الكلاسيكية والتقنيات الذكية الحديثة",
      price: "من 199 ريال",
      originalPrice: "349 ريال",
      image: businessCardsProductImg,
      rating: 4.9,
      reviews: 430,
      features: [
        "تصميم كلاسيكي أنيق مع لمسة عصرية",
        "ورق مقوى فاخر 350 جرام",
        "طباعة عالية الدقة بألوان زاهية",
        "تشطيب لامع، مطفي، أو معدني",
        "دعم تقنية NFC الذكية (اختياري)",
        "كود QR مخصص للمشاركة السريعة"
      ],
      category: "متميز",
      icon: CreditCard,
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      title: "كروت شخصية ليد",
      description: "كروت شخصية مضيئة بتقنية LED المتقدمة لانطباع لا يُنسى",
      price: "من 399 ريال",
      originalPrice: "599 ريال",
      image: ledBusinessCardsImg,
      rating: 4.8,
      reviews: 185,
      features: [
        "إضاءة LED متقدمة",
        "بطارية قابلة للشحن",
        "تحكم في الألوان والأنماط",
        "مقاومة للماء والغبار",
        "عمر بطارية طويل",
        "تصميم أنيق ومبتكر"
      ],
      category: "مبتكر",
      icon: Smartphone,
      gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
      title: "كروت شخصية سبوت يوفي",
      description: "كروت شخصية بطلاء سبوت UV اللامع للحصول على ملمس فاخر",
      price: "من 299 ريال",
      originalPrice: "449 ريال",
      image: spotUvBusinessCardsImg,
      rating: 4.7,
      reviews: 298,
      features: [
        "طلاء سبوت UV عالي اللمعان",
        "ملمس ناعم وفاخر",
        "مقاومة للخدوش والتآكل",
        "إبراز التفاصيل المهمة",
        "تأثير بصري متميز",
        "جودة طباعة عالية"
      ],
      category: "فاخر",
      icon: Sparkles,
      gradient: "from-purple-500 via-indigo-500 to-blue-500"
    },
    {
      title: "كروت شخصية مع ختم ذهبي",
      description: "كروت شخصية بختم ذهبي فاخر يضفي لمسة من الأناقة والرقي",
      price: "من 349 ريال",
      originalPrice: "499 ريال",
      image: goldFoilBusinessCardsImg,
      rating: 4.9,
      reviews: 342,
      features: [
        "ختم ذهبي حقيقي 24 قيراط",
        "تصميم مخصص للختم",
        "ورق فاخر عالي الجودة",
        "لمسة نهائية أنيقة",
        "مظهر راقي ومميز",
        "تفاصيل دقيقة ومتقنة"
      ],
      category: "ملكي",
      icon: Star,
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600"
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

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Hero Section */}
        <div className="relative h-96 rounded-3xl overflow-hidden mb-16 group shadow-2xl">
          <img 
            src={businessCardsHeroImg} 
            alt="كروت شخصية احترافية"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-purple-600/90 to-pink-600/85"></div>
          <div className="absolute inset-0 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="animate-fade-in max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse mr-4">
                  <CreditCard className="w-10 h-10 text-yellow-300" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  كروت شخصية
                  <span className="block text-3xl md:text-4xl text-yellow-300 mt-2">أساسية ورقمية</span>
                </h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse ml-4">
                  <Smartphone className="w-10 h-10 text-yellow-300" />
                </div>
              </div>
              <p className="text-2xl text-white/95 mb-8 leading-relaxed">اجمع بين الأناقة التقليدية والتقنيات الذكية</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 px-6 py-3 text-lg font-bold hover-scale">
                  ✨ تصميم مجاني
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-3 text-lg hover-scale">
                  🚀 تسليم سريع
                </Badge>
                <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-0 px-6 py-3 text-lg font-bold hover-scale">
                  💎 جودة عالمية
                </Badge>
              </div>
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
        <div className="space-y-12 mb-16">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              منتجاتنا المتميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              اختر من مجموعة متنوعة من الكروت الشخصية المتطورة التي تناسب جميع الأذواق والمتطلبات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <Card 
                  key={index} 
                  className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-85`}></div>
                    <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 text-sm font-bold shadow-lg">
                        وفر {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-gradient-to-r ${product.gradient} text-white px-3 py-1 text-sm font-bold shadow-lg`}>
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-white font-bold bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                          ({product.reviews})
                        </span>
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
                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">المميزات المتضمنة:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {product.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 4 && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{product.features.length - 4} مميزات إضافية
                          </div>
                        )}
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