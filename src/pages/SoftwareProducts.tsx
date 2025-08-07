import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  Rocket,
  Car,
  Eye,
  TrendingUp
} from "lucide-react";

const SoftwareProducts = () => {
  const { toast } = useToast();

  const handlePurchase = async (productName: string, price: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: 4999, // 4999 ريال
          currency: 'SAR',
          description: `شراء منتج: ${productName}`,
          clientName: 'عميل',
          clientMobile: '966500000000',
          note: `طلب شراء منتج ${productName}`,
          callBackUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "خطأ في الدفع",
          description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
        return;
      }

      if (data?.transactionUrl) {
        // فتح رابط الدفع في تبويب جديد
        window.open(data.transactionUrl, '_blank');
      } else {
        toast({
          title: "خطأ في الدفع",
          description: "لم يتم الحصول على رابط الدفع. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };
  const products = [
    {
      id: 1,
      name: "موقع تأجير السيارات",
      description: "موقع تعريفي متكامل لشركة تأجير سيارات مع نظام حجز ذكي وواجهة مستخدم احترافية",
      category: "المواقع التعريفية",
      icon: Car,
      features: ["تصميم احترافي متجاوب", "نظام حجز متطور", "عرض أسطول السيارات", "إدارة العملاء"],
      price: "4999 ريال",
      rating: 4.9,
      downloads: "0",
      status: "متاح الآن",
      color: "from-blue-500 to-cyan-500",
      demoUrl: "/car-rental-landing"
    }
  ];

  const categories = ["جميع المنتجات", "المواقع التعريفية"];

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
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">1</p>
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
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">1</p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">المبيعات</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">4999 ر.س</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">4.9</p>
                </div>
                <Star className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-800">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        لا توجد منتجات برمجية حالياً
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        نحن نعمل على تطوير منتجات برمجية مبتكرة. سيتم عرضها هنا قريباً
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            products.map((product) => {
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
                          <Eye className="w-4 h-4" />
                          <span>معاينة متاحة</span>
                        </div>
                      </div>
                    )}

                    {/* Price & Actions */}
                    <div className="space-y-3 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{product.price}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {product.demoUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(product.demoUrl, '_blank')}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة الموقع
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          onClick={() => handlePurchase(product.name, product.price)}
                          className={`w-full ${product.status === "متاح الآن" 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                            : "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={product.status !== "متاح الآن"}
                        >
                          <TrendingUp className="w-4 h-4 ml-2" />
                          {product.status === "متاح الآن" ? "ادفع الآن" : "قريباً"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
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