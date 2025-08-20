import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Printer, 
  FileText, 
  Image, 
  BookOpen, 
  CreditCard, 
  Package,
  Palette,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Shirt,
  Award,
  Eye,
  Download,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import businessStationeryImg from "@/assets/printing/business-stationery.jpg";
import marketingMaterialsImg from "@/assets/printing/marketing-materials.jpg";
import largeFormatImg from "@/assets/printing/large-format.jpg";
import packagingBoxesImg from "@/assets/printing/packaging-boxes.jpg";
import promotionalGiftsImg from "@/assets/printing/promotional-gifts.jpg";
import apparelAccessoriesImg from "@/assets/printing/apparel-accessories.jpg";
import corporateBrandingImg from "@/assets/printing/corporate-branding.jpg";

const PrintingServices = () => {
  console.log('PrintingServices component is rendering...');
  
  const mainCategories = [
    {
      title: "مستلزمات مكتبية للأعمال",
      description: "كروت شخصية، أوراق مراسلات، فولدرات وجميع المستلزمات المكتبية",
      icon: CreditCard,
      image: businessStationeryImg,
      count: "50+ منتج",
      color: "from-blue-500 to-cyan-500",
      href: "/printing/business-stationery"
    },
    {
      title: "مطبوعات تسويقية",
      description: "بروشورات، فلايرز، كتالوجات وجميع المواد التسويقية",
      icon: FileText,
      image: marketingMaterialsImg,
      count: "40+ منتج",
      color: "from-green-500 to-emerald-500",
      href: "/printing/marketing-materials"
    },
    {
      title: "مطبوعات كبيرة الحجم",
      description: "لافتات، بنرات، استاندات وجميع المطبوعات كبيرة الحجم",
      icon: Image,
      image: largeFormatImg,
      count: "30+ منتج",
      color: "from-purple-500 to-pink-500",
      href: "/printing/large-format"
    },
    {
      title: "التغليف والصناديق",
      description: "صناديق مخصصة، أكياس هدايا وحلول التغليف الاحترافية",
      icon: Package,
      image: packagingBoxesImg,
      count: "35+ منتج",
      color: "from-orange-500 to-red-500",
      href: "/printing/packaging-boxes"
    },
    {
      title: "هدايا دعائية",
      description: "أقلام، دفاتر، أكواب وجميع الهدايا الدعائية المطبوعة",
      icon: Palette,
      image: promotionalGiftsImg,
      count: "60+ منتج",
      color: "from-indigo-500 to-blue-500",
      href: "/printing/promotional-gifts"
    },
    {
      title: "ملابس وإكسسوارات",
      description: "تيشيرتات، قبعات، حقائب وإكسسوارات مطبوعة",
      icon: Shirt,
      image: apparelAccessoriesImg,
      count: "25+ منتج",
      color: "from-teal-500 to-green-500",
      href: "/printing/apparel-accessories"
    },
    {
      title: "براند الشركات والفعاليات",
      description: "هوية بصرية متكاملة للشركات والفعاليات",
      icon: Award,
      image: corporateBrandingImg,
      count: "20+ منتج",
      color: "from-rose-500 to-pink-500",
      href: "/printing/corporate-branding"
    }
  ];

  const featuredProducts = [
    {
      title: "كروت شخصية الأكثر مبيعاً",
      description: "كروت شخصية بتصميمات عصرية وخامات فاخرة",
      price: "من 199 ريال",
      originalPrice: "299 ريال",
      image: businessStationeryImg,
      rating: 4.8,
      reviews: 150
    },
    {
      title: "فولدرات مواد فاخرة",
      description: "فولدرات احترافية لعرض أوراق الشركة بأناقة",
      price: "من 89 ريال",
      originalPrice: "120 ريال",
      image: packagingBoxesImg,
      rating: 4.9,
      reviews: 89
    },
    {
      title: "بروشورات ثلاثية الطي",
      description: "بروشورات عالية الجودة لعرض خدماتك ومنتجاتك",
      price: "من 159 ريال",
      originalPrice: "200 ريال",
      image: marketingMaterialsImg,
      rating: 4.7,
      reviews: 120
    },
    {
      title: "صناديق هدايا مخصصة",
      description: "صناديق أنيقة بتصميمك الخاص لمناسباتك المميزة",
      price: "من 79 ريال",
      originalPrice: "110 ريال",
      image: packagingBoxesImg,
      rating: 4.6,
      reviews: 95
    }
  ];

  const stats = [
    { value: "50,000+", label: "مطبوعة منجزة", icon: CheckCircle },
    { value: "2,500+", label: "عميل راضي", icon: Star },
    { value: "15+", label: "سنة خبرة", icon: Clock },
    { value: "24/7", label: "دعم فني", icon: Shield }
  ];

  const features = [
    {
      title: "جودة عالية",
      description: "طباعة بجودة احترافية عالية الدقة",
      icon: Star
    },
    {
      title: "تسليم سريع",
      description: "خدمة سريعة مع ضمان التسليم في الموعد",
      icon: Clock
    },
    {
      title: "تصميم مخصص",
      description: "تصميمات مخصصة حسب احتياجاتك",
      icon: Palette
    },
    {
      title: "ضمان الجودة",
      description: "ضمان شامل على جودة الطباعة والمواد",
      icon: Shield
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section with Background */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300/15 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          <Printer className="w-24 h-24 mx-auto mb-8 animate-scale-in" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            صناديق فاخرة
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
              للحصائلك المميزة
            </span>
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-blue-100 animate-fade-in delay-200">
            بمقاسات من اختيارك وبتصميمك الخاص
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-300">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-10 py-6 rounded-full shadow-2xl hover-scale"
            >
              <Eye className="w-6 h-6 mr-3" />
              استعرض المنتجات
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-10 py-6 rounded-full hover-scale"
            >
              <Download className="w-6 h-6 mr-3" />
              كتالوج PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Stats Section */}
        <section className="animate-fade-in delay-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-500 hover-scale">
                <CardContent className="p-8">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 w-fit mx-auto mb-6">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Categories */}
        <section className="animate-fade-in delay-300">
          <div className="text-center mb-16">
            <Badge className="mb-6 text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              كل التصنيفات
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              خدمات الطباعة المتخصصة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف مجموعتنا الشاملة من خدمات الطباعة عالية الجودة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mainCategories.map((category, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800 px-3 py-1">
                      {category.count}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                    asChild
                  >
                    <Link to={category.href}>
                      <Eye className="w-4 h-4 mr-2" />
                      استعرض المنتجات
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 animate-fade-in delay-400">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              مميزات خدماتنا
            </h2>
            <p className="text-xl text-gray-600">نتميز بالجودة والسرعة والاحترافية في جميع خدماتنا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto w-fit mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="animate-fade-in delay-500">
          <div className="text-center mb-16">
            <Badge className="mb-6 text-lg px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white">
              منتجات مميزة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              الأكثر مبيعاً
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف أشهر منتجاتنا التي يختارها عملاؤنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-500 text-white px-2 py-1">
                      وفر {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-green-600">{product.price}</span>
                      <span className="text-sm text-gray-400 line-through mr-2">{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    اطلب الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 p-12 text-white animate-fade-in delay-600">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <Printer className="w-20 h-20 mx-auto mb-8 animate-scale-in" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز لطباعة مشروعك؟
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-blue-100">
              تواصل معنا الآن للحصول على عرض سعر مخصص ومناقشة تفاصيل مشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-10 py-6 rounded-full shadow-2xl hover-scale"
                asChild
              >
                <Link to="/contact">
                  <Phone className="w-6 h-6 mr-3" />
                  تواصل معنا الآن
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-10 py-6 rounded-full hover-scale"
                asChild
              >
                <a href="mailto:info@alialshehriholding.com">
                  <Mail className="w-6 h-6 mr-3" />
                  أرسل استفسار
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white text-xl px-10 py-6 rounded-full hover-scale"
                asChild
              >
                <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  واتساب
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default PrintingServices;