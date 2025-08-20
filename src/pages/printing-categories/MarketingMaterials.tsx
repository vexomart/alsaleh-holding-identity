import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, CheckCircle } from "lucide-react";
import marketingMaterialsImg from "@/assets/printing/marketing-materials.jpg";

const MarketingMaterials = () => {
  const products = [
    {
      title: "بروشورات ثلاثية الطي",
      description: "بروشورات عالية الجودة لعرض خدماتك ومنتجاتك",
      price: "من 159 ريال",
      originalPrice: "200 ريال",
      image: marketingMaterialsImg,
      rating: 4.7,
      reviews: 120,
      features: ["طباعة ملونة", "ورق عالي الجودة", "تصميم احترافي", "تشطيب فاخر"]
    },
    {
      title: "فلايرز دعائية",
      description: "فلايرز جذابة للحملات الإعلانية والتسويقية",
      price: "من 89 ريال",
      originalPrice: "120 ريال",
      image: marketingMaterialsImg,
      rating: 4.8,
      reviews: 95,
      features: ["أحجام متنوعة", "ألوان زاهية", "تصميم جذاب", "كميات مرنة"]
    },
    {
      title: "كتالوجات المنتجات",
      description: "كتالوجات شاملة لعرض منتجاتك بطريقة احترافية",
      price: "من 299 ريال",
      originalPrice: "399 ريال",
      image: marketingMaterialsImg,
      rating: 4.9,
      reviews: 85,
      features: ["صفحات متعددة", "تجليد فاخر", "صور عالية الدقة", "تخطيط احترافي"]
    },
    {
      title: "ملصقات تسويقية",
      description: "ملصقات لاصقة بأشكال وأحجام مختلفة",
      price: "من 45 ريال",
      originalPrice: "65 ريال",
      image: marketingMaterialsImg,
      rating: 4.6,
      reviews: 110,
      features: ["مقاوم للماء", "ألوان ثابتة", "أشكال مخصصة", "لاصق قوي"]
    },
    {
      title: "منيو المطاعم",
      description: "منيو احترافي للمطاعم والمقاهي",
      price: "من 129 ريال",
      originalPrice: "179 ريال",
      image: marketingMaterialsImg,
      rating: 4.8,
      reviews: 75,
      features: ["تصميم جذاب", "مقاوم للبقع", "سهل التنظيف", "تحديث مجاني"]
    },
    {
      title: "بوسترات إعلانية",
      description: "بوسترات كبيرة الحجم للإعلانات الخارجية",
      price: "من 79 ريال",
      originalPrice: "110 ريال",
      image: marketingMaterialsImg,
      rating: 4.7,
      reviews: 90,
      features: ["أحجام كبيرة", "مقاوم للطقس", "ألوان زاهية", "سهل التركيب"]
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="مطبوعات تسويقية"
        description="بروشورات، فلايرز، كتالوجات وجميع المواد التسويقية الاحترافية"
        showBackButton
        backButtonFallback="/printing-services"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12">
          <img 
            src={marketingMaterialsImg} 
            alt="مطبوعات تسويقية"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-600/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                مطبوعات تسويقية احترافية
              </h2>
              <p className="text-xl">أكثر من 40 منتج متخصص</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white px-2 py-1">
                    وفر {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
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
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-600">{product.price}</span>
                    <span className="text-sm text-gray-400 line-through mr-2">{product.originalPrice}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    اطلب الآن
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default MarketingMaterials;