import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Database, 
  Smartphone, 
  Monitor, 
  Shield, 
  Cloud,
  Layers,
  Zap,
  Download,
  Star,
  Users,
  Globe,
  ChevronRight,
  Package,
  Rocket
} from "lucide-react";

const SoftwareProducts = () => {
  const products = [
    {
      id: 1,
      name: "نظام إدارة المحتوى الذكي",
      description: "نظام إدارة محتوى متطور يدعم النشر على منصات متعددة مع إمكانيات الذكاء الاصطناعي",
      category: "إدارة المحتوى",
      icon: Monitor,
      features: ["واجهة سهلة الاستخدام", "تحرير بالذكاء الاصطناعي", "نشر متعدد المنصات", "تحليلات متقدمة"],
      price: "من 299 ريال/شهر",
      rating: 4.8,
      downloads: "2.5K",
      status: "متاح الآن",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "منصة التجارة الإلكترونية المتكاملة",
      description: "حل شامل للتجارة الإلكترونية مع نظام دفع آمن وإدارة المخزون",
      category: "التجارة الإلكترونية",
      icon: Package,
      features: ["متجر متعدد البائعين", "نظام دفع آمن", "إدارة المخزون", "تطبيق موبايل"],
      price: "من 599 ريال/شهر",
      rating: 4.9,
      downloads: "1.8K",
      status: "متاح الآن",
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 3,
      name: "نظام إدارة علاقات العملاء CRM",
      description: "منصة شاملة لإدارة العملاء والمبيعات مع تقارير تفصيلية",
      category: "إدارة الأعمال",
      icon: Users,
      features: ["إدارة جهات الاتصال", "تتبع المبيعات", "التقارير والتحليلات", "أتمتة التسويق"],
      price: "من 199 ريال/شهر",
      rating: 4.7,
      downloads: "3.2K",
      status: "متاح الآن",
      color: "from-purple-500 to-violet-500"
    },
    {
      id: 4,
      name: "تطبيق إدارة المشاريع",
      description: "أداة قوية لإدارة المشاريع والفرق مع تتبع الوقت والمهام",
      category: "إدارة المشاريع",
      icon: Layers,
      features: ["إدارة المهام", "تتبع الوقت", "تعاون الفريق", "تقارير الأداء"],
      price: "من 149 ريال/شهر",
      rating: 4.6,
      downloads: "4.1K",
      status: "متاح الآن",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      name: "نظام الأمان والحماية الذكي",
      description: "حل أمني متطور لحماية البيانات والأنظمة من التهديدات",
      category: "الأمان والحماية",
      icon: Shield,
      features: ["حماية متقدمة", "مراقبة مستمرة", "تحليل التهديدات", "نسخ احتياطي آمن"],
      price: "من 399 ريال/شهر",
      rating: 4.9,
      downloads: "1.5K",
      status: "متاح الآن",
      color: "from-red-500 to-pink-500"
    },
    {
      id: 6,
      name: "منصة التعلم الإلكتروني",
      description: "نظام تعليمي تفاعلي مع إدارة الكورسات والاختبارات",
      category: "التعليم",
      icon: Rocket,
      features: ["إنشاء الكورسات", "اختبارات تفاعلية", "شهادات رقمية", "تتبع التقدم"],
      price: "قريباً",
      rating: 0,
      downloads: "0",
      status: "تحت التطوير",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const categories = [
    "جميع المنتجات",
    "إدارة المحتوى",
    "التجارة الإلكترونية", 
    "إدارة الأعمال",
    "إدارة المشاريع",
    "الأمان والحماية",
    "التعليم"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح الآن":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "تحت التطوير":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="منتجاتنا البرمجية"
        description="مجموعة من الحلول البرمجية المتطورة التي تلبي احتياجات الأعمال المختلفة"
      />

      <div className="container mx-auto px-4 lg:px-6 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">المنتجات المتاحة</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">8</p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">إجمالي التحميلات</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">15K+</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">4.8</p>
                </div>
                <Star className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id} 
                className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                  
                  <Badge variant="secondary" className="w-fit text-xs">
                    {product.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {product.description}
                  </CardDescription>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">المميزات الرئيسية:</h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  {product.status === "متاح الآن" && (
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{product.downloads}</span>
                      </div>
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="text-lg font-bold text-primary">{product.price}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className={`${product.status === "متاح الآن" 
                        ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                        : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={product.status !== "متاح الآن"}
                    >
                      {product.status === "متاح الآن" ? "عرض التفاصيل" : "قريباً"}
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              هل تحتاج حلول برمجية مخصصة؟
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              نحن نقدم خدمات تطوير برمجيات مخصصة لتلبية احتياجات عملك الفريدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                طلب استشارة مجانية
                <ChevronRight className="w-4 h-4 mr-2" />
              </Button>
              <Button size="lg" variant="outline">
                تواصل مع فريق التطوير
                <Code className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SoftwareProducts;