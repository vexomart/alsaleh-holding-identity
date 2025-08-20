import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { 
  Building2, 
  Briefcase, 
  FileText, 
  Award, 
  Heart, 
  Eye, 
  Download,
  ShoppingCart,
  Zap,
  Star,
  Target
} from "lucide-react";

const CorporateBranding = () => {
  const products = [
    {
      id: 1,
      name: "حقائب مؤتمرات",
      description: "حقائب أنيقة للمؤتمرات والفعاليات التجارية",
      price: "75",
      image: "/src/assets/printing/corporate-branding.jpg",
      category: "مؤتمرات",
      bestseller: true,
      discount: 15
    },
    {
      id: 2,
      name: "ملفات تجارية",
      description: "ملفات جلدية فاخرة لعروض الشركات",
      price: "95",
      image: "/src/assets/printing/corporate-branding.jpg",
      category: "ملفات",
      bestseller: false,
      discount: 0
    },
    {
      id: 3,
      name: "دفاتر ومذكرات",
      description: "دفاتر مخصصة للاجتماعات والملاحظات",
      price: "45",
      image: "/src/assets/printing/corporate-branding.jpg",
      category: "قرطاسية",
      bestseller: true,
      discount: 20
    },
    {
      id: 4,
      name: "شهادات تقدير",
      description: "شهادات أنيقة للموظفين المتميزين",
      price: "25",
      image: "/src/assets/printing/corporate-branding.jpg",
      category: "شهادات",
      bestseller: false,
      discount: 10
    }
  ];

  return (
    <>
      <SEO 
        title="العلامة التجارية للشركات | حلول العلامة التجارية الاحترافية"
        description="اكتشف حلول العلامة التجارية للشركات - حقائب مؤتمرات، ملفات تجارية، دفاتر مخصصة وشهادات تقدير احترافية"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  العلامة التجارية للشركات
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                حلول شاملة لتعزيز هوية شركتك وبناء حضور قوي في السوق من خلال منتجات احترافية ومتميزة
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.bestseller && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        الأكثر مبيعاً
                      </Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        خصم {product.discount}%
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" className="mr-2">
                        <Eye className="h-4 w-4 mr-1" />
                        معاينة
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {product.price} ر.س
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {Math.round(parseFloat(product.price) * (1 + product.discount / 100))} ر.س
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="gap-1">
                        <ShoppingCart className="h-4 w-4" />
                        اطلب الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              لماذا تختار حلول العلامة التجارية لدينا؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">هوية متماسكة</h3>
                <p className="text-muted-foreground">
                  نساعدك في بناء هوية بصرية متماسكة عبر جميع منتجاتك التجارية
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">تأثير احترافي</h3>
                <p className="text-muted-foreground">
                  منتجات تترك انطباعاً احترافياً قوياً لدى عملائك وشركائك
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">جودة متميزة</h3>
                <p className="text-muted-foreground">
                  أعلى معايير الجودة في التصميم والتنفيذ لتعكس مكانة شركتك
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CorporateBranding;