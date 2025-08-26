import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Package, 
  Star,
  Heart, 
  ShoppingCart, 
  Eye, 
  Zap, 
  Shield, 
  Gift,
  Loader2
} from "lucide-react";

const PackagingBoxes = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const products = [
    {
      id: 1,
      name: "صناديق هدايا فاخرة",
      description: "صناديق أنيقة للهدايا والمناسبات الخاصة",
      price: "25",
      image: "/src/assets/printing/packaging-boxes.jpg",
      category: "هدايا",
      bestseller: true,
      discount: 10
    },
    {
      id: 2,
      name: "صناديق شحن مخصصة",
      description: "صناديق قوية ومتينة للشحن والتوصيل",
      price: "35",
      image: "/src/assets/printing/packaging-boxes.jpg",
      category: "شحن",
      bestseller: false,
      discount: 0
    },
    {
      id: 3,
      name: "أكياس ورقية برندية",
      description: "أكياس أنيقة تحمل هوية العلامة التجارية",
      price: "15",
      image: "/src/assets/printing/packaging-boxes.jpg",
      category: "أكياس",
      bestseller: true,
      discount: 15
    },
    {
      id: 4,
      name: "صناديق منتجات",
      description: "عبوات احترافية لعرض المنتجات",
      price: "40",
      image: "/src/assets/printing/packaging-boxes.jpg",
      category: "منتجات",
      bestseller: false,
      discount: 5
    }
  ];

  const handlePayment = async (product) => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('يرجى تعبئة جميع البيانات المطلوبة');
      return;
    }

    setIsPaymentLoading(true);
    
    try {
      const finalPrice = product.discount > 0 
        ? parseFloat(product.price) * (1 - product.discount / 100)
        : parseFloat(product.price);

      const paymentData = {
        amount: finalPrice,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone.startsWith('966') ? customerInfo.phone : `966${customerInfo.phone.replace(/^0+/, '')}`,
        offer_title: product.name,
        description: `${product.description}${customerInfo.notes ? ` - ملاحظات: ${customerInfo.notes}` : ''}`,
        currency: 'SAR',
        product_details: {
          product_id: product.id,
          product_name: product.name,
          product_version: 'V 1.0'
        }
      };

      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: paymentData
      });

      if (error) {
        console.error('خطأ في الدفع:', error);
        toast.error('حدث خطأ أثناء إنشاء رابط الدفع');
        return;
      }

      if (data?.success && data?.payment_url) {
        toast.success('تم إنشاء رابط الدفع بنجاح');
        window.open(data.payment_url, '_blank');
      } else {
        toast.error(data?.error || 'فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('خطأ في عملية الدفع:', error);
      toast.error('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="التغليف والصناديق | حلول التغليف الاحترافية"
        description="اكتشف مجموعتنا الواسعة من حلول التغليف - صناديق هدايا، صناديق شحن، أكياس برندية وعبوات منتجات بجودة عالية"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Package className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  التغليف والصناديق
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                حلول التغليف الاحترافية والمبتكرة - صناديق، أكياس وعبوات مخصصة لجميع احتياجاتك
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
                          {product.discount > 0 
                            ? `${(parseFloat(product.price) * (1 - product.discount / 100)).toFixed(0)} ر.س`
                            : `${product.price} ر.س`
                          }
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price} ر.س
                          </span>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="gap-1" 
                            onClick={() => setSelectedProduct(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            اطلب الآن
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-right">
                              طلب {product.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{product.name}</span>
                                <Badge variant="secondary">{product.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">
                                  {product.discount > 0 
                                    ? `${(parseFloat(product.price) * (1 - product.discount / 100)).toFixed(0)} ر.س`
                                    : `${product.price} ر.س`
                                  }
                                </span>
                                {product.discount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm line-through text-muted-foreground">
                                      {product.price} ر.س
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      خصم {product.discount}%
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="name">الاسم الكامل *</Label>
                                <Input
                                  id="name"
                                  placeholder="اكتب اسمك الكامل"
                                  value={customerInfo.name}
                                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="email">البريد الإلكتروني *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="example@email.com"
                                  value={customerInfo.email}
                                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="phone">رقم الهاتف *</Label>
                                <Input
                                  id="phone"
                                  placeholder="05xxxxxxxx"
                                  value={customerInfo.phone}
                                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="notes">ملاحظات إضافية</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="أي متطلبات خاصة أو ملاحظات..."
                                  value={customerInfo.notes}
                                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                                  rows={3}
                                />
                              </div>
                            </div>

                            <Button 
                              onClick={() => handlePayment(product)}
                              disabled={isPaymentLoading}
                              className="w-full"
                            >
                              {isPaymentLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  جارٍ إنشاء رابط الدفع...
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  اشتري الآن - {product.discount > 0 
                                    ? `${(parseFloat(product.price) * (1 - product.discount / 100)).toFixed(0)} ر.س`
                                    : `${product.price} ر.س`
                                  }
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
              لماذا تختار حلول التغليف لدينا؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">حماية متقدمة</h3>
                <p className="text-muted-foreground">
                  مواد عالية الجودة تضمن حماية محتوياتك أثناء النقل والتخزين
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">تصميم مخصص</h3>
                <p className="text-muted-foreground">
                  إمكانية تخصيص التصميم والألوان لتناسب هوية علامتك التجارية
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">مناسب للهدايا</h3>
                <p className="text-muted-foreground">
                  تصاميم أنيقة وفاخرة تجعل منتجاتك تبدو احترافية ومميزة
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

export default PackagingBoxes;