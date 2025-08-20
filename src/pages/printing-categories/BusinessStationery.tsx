import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, CheckCircle } from "lucide-react";
import businessStationeryImg from "@/assets/printing/business-stationery.jpg";
import luxuryBusinessCardsImg from "@/assets/printing/luxury-business-cards.jpg";
import officialLetterheadsImg from "@/assets/printing/official-letterheads.jpg";
import customFoldersImg from "@/assets/printing/custom-folders.jpg";
import professionalEnvelopesImg from "@/assets/printing/professional-envelopes.jpg";
import invoiceBooksImg from "@/assets/printing/invoice-books.jpg";
import employeeIdCardsImg from "@/assets/printing/employee-id-cards.jpg";

const BusinessStationery = () => {
  const products = [
    {
      title: "كروت شخصية فاخرة",
      description: "كروت شخصية بخامات عالية الجودة وتصميمات احترافية",
      price: "من 199 ريال",
      originalPrice: "299 ريال",
      image: luxuryBusinessCardsImg,
      rating: 4.8,
      reviews: 150,
      features: ["طباعة ملونة", "ورق مقوى 350 جرام", "تشطيب لامع أو مطفي", "تصميم مجاني"]
    },
    {
      title: "أوراق مراسلات رسمية",
      description: "أوراق مراسلات بشعار الشركة وتصميم احترافي",
      price: "من 149 ريال",
      originalPrice: "199 ريال",
      image: officialLetterheadsImg,
      rating: 4.9,
      reviews: 89,
      features: ["ورق عالي الجودة", "طباعة الشعار", "ألوان مخصصة", "أحجام متنوعة"]
    },
    {
      title: "فولدرات مخصصة",
      description: "فولدرات لحفظ الأوراق بتصميم شركتك",
      price: "من 89 ريال",
      originalPrice: "120 ريال",
      image: customFoldersImg,
      rating: 4.7,
      reviews: 120,
      features: ["مواد فاخرة", "طباعة داخلية وخارجية", "جيوب متعددة", "تصميم مخصص"]
    },
    {
      title: "أظرف بتصميمات احترافية",
      description: "أظرف رسمية بشعار وألوان الشركة",
      price: "من 79 ريال",
      originalPrice: "110 ريال",
      image: professionalEnvelopesImg,
      rating: 4.6,
      reviews: 95,
      features: ["أحجام مختلفة", "طباعة الشعار", "ورق عالي الجودة", "ألوان مخصصة"]
    },
    {
      title: "دفاتر الفواتير",
      description: "دفاتر فواتير مخصصة بتصميم شركتك",
      price: "من 69 ريال",
      originalPrice: "99 ريال",
      image: invoiceBooksImg,
      rating: 4.8,
      reviews: 75,
      features: ["تصميم مخصص", "ترقيم تسلسلي", "كربون للنسخ", "أحجام متنوعة"]
    },
    {
      title: "بطاقات الهوية",
      description: "بطاقات هوية للموظفين بتقنية PVC",
      price: "من 25 ريال",
      originalPrice: "35 ريال",
      image: employeeIdCardsImg,
      rating: 4.9,
      reviews: 110,
      features: ["خامة PVC", "طباعة ملونة", "تصميم احترافي", "شريحة اختيارية"]
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="مستلزمات مكتبية للأعمال"
        description="كروت شخصية، أوراق مراسلات، فولدرات وجميع المستلزمات المكتبية الاحترافية"
        showBackButton
        backButtonFallback="/printing-services"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12">
          <img 
            src={businessStationeryImg} 
            alt="مستلزمات مكتبية للأعمال"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                مستلزمات مكتبية احترافية
              </h2>
              <p className="text-xl">أكثر من 50 منتج متخصص</p>
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
                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
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
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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

export default BusinessStationery;