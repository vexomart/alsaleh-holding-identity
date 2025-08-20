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
  Image, 
  Megaphone, 
  Building2, 
  MapPin, 
  Eye, 
  Download,
  ShoppingCart,
  Zap,
  Star,
  Heart,
  Loader2
} from "lucide-react";

const LargeFormat = () => {
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
      name: "بنرات إعلانية خارجية",
      description: "بنرات عالية الجودة مقاومة للعوامل الجوية",
      price: "150",
      image: "/src/assets/printing/large-format.jpg",
      category: "بنرات",
      bestseller: true,
      discount: 15
    },
    {
      id: 2,
      name: "لافتات داخلية",
      description: "لافتات أنيقة للمعارض والمحلات التجارية",
      price: "120",
      image: "/src/assets/printing/large-format.jpg",
      category: "لافتات",
      bestseller: false,
      discount: 0
    },
    {
      id: 3,
      name: "استاندات قابلة للطي",
      description: "استاندات عملية سهلة النقل والتركيب",
      price: "200",
      image: "/src/assets/printing/large-format.jpg",
      category: "استاندات",
      bestseller: true,
      discount: 20
    },
    {
      id: 4,
      name: "خلفيات أحداث",
      description: "خلفيات احترافية للمؤتمرات والفعاليات",
      price: "300",
      image: "/src/assets/printing/large-format.jpg",
      category: "خلفيات",
      bestseller: false,
      discount: 10
    }
  ];

  const handlePayment = async (product) => {
    console.log('🚀 handlePayment started with product:', product);
    console.log('📋 customerInfo:', customerInfo);
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      console.error('❌ Missing required fields');
      toast.error('يرجى تعبئة جميع البيانات المطلوبة');
      return;
    }

    setIsPaymentLoading(true);
    console.log('💳 Payment loading started');
    
    try {
      const finalPrice = product.discount > 0 
        ? parseFloat(product.price) * (1 - product.discount / 100)
        : parseFloat(product.price);

      console.log('💰 Final price calculated:', finalPrice);

      // تأكد من صحة رقم الهاتف
      let formattedPhone = customerInfo.phone;
      if (!formattedPhone.startsWith('966')) {
        formattedPhone = formattedPhone.startsWith('0') 
          ? `966${formattedPhone.substring(1)}` 
          : `966${formattedPhone}`;
      }

      const paymentData = {
        amount: finalPrice,
        customer_name: customerInfo.name.trim(),
        customer_email: customerInfo.email.trim(),
        customer_phone: formattedPhone,
        offer_title: product.name,
        description: `${product.description}${customerInfo.notes ? ` - ملاحظات: ${customerInfo.notes}` : ''}`,
        currency: 'SAR',
        product_details: {
          product_id: product.id,
          product_name: product.name,
          product_version: 'V 1.0'
        }
      };

      console.log('📤 Sending payment data:', JSON.stringify(paymentData, null, 2));

      const response = await fetch(`https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/paylink-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI'
        },
        body: JSON.stringify(paymentData)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Request failed:', errorText);
        toast.error('حدث خطأ أثناء إنشاء رابط الدفع');
        return;
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      if (data?.success && data?.payment_url) {
        toast.success('تم إنشاء رابط الدفع بنجاح');
        console.log('🔗 Opening payment URL:', data.payment_url);
        window.open(data.payment_url, '_blank');
      } else {
        console.error('❌ Invalid response:', data);
        toast.error(data?.error || 'فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('💥 Payment error:', error);
      toast.error('حدث خطأ أثناء معالجة الطلب');
    } finally {
      console.log('🏁 Payment process finished');
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="مطبوعات كبيرة الحجم | خدمات الطباعة الاحترافية"
        description="اكتشف مجموعتنا الواسعة من المطبوعات كبيرة الحجم - بنرات، لافتات، استاندات وخلفيات أحداث بجودة عالية وأسعار تنافسية"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  مطبوعات كبيرة الحجم
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                حلول الطباعة كبيرة الحجم الاحترافية - بنرات، لافتات، استاندات وخلفيات أحداث بجودة استثنائية
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="gap-1" 
                              onClick={() => {
                                console.log('🎯 Product selected:', product);
                                setSelectedProduct(product);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              اطلب الآن
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-right">
                                طلب {selectedProduct?.name || product.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {/* Product Info */}
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold">{selectedProduct?.name || product.name}</span>
                                  <Badge variant="secondary">{selectedProduct?.category || product.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{selectedProduct?.description || product.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    {(selectedProduct || product).discount > 0 
                                      ? `${(parseFloat((selectedProduct || product).price) * (1 - (selectedProduct || product).discount / 100)).toFixed(0)} ر.س`
                                      : `${(selectedProduct || product).price} ر.س`
                                    }
                                  </span>
                                  {(selectedProduct || product).discount > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm line-through text-muted-foreground">
                                        {(selectedProduct || product).price} ر.س
                                      </span>
                                      <Badge variant="destructive" className="text-xs">
                                        خصم {(selectedProduct || product).discount}%
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Customer Info Form */}
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="name">الاسم الكامل *</Label>
                                  <Input
                                    id="name"
                                    placeholder="اكتب اسمك الكامل"
                                    value={customerInfo.name}
                                    onChange={(e) => {
                                      console.log('🔤 Name changed:', e.target.value);
                                      setCustomerInfo({...customerInfo, name: e.target.value});
                                    }}
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
                                    onChange={(e) => {
                                      console.log('📧 Email changed:', e.target.value);
                                      setCustomerInfo({...customerInfo, email: e.target.value});
                                    }}
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="phone">رقم الهاتف *</Label>
                                  <Input
                                    id="phone"
                                    placeholder="05xxxxxxxx"
                                    value={customerInfo.phone}
                                    onChange={(e) => {
                                      console.log('📱 Phone changed:', e.target.value);
                                      setCustomerInfo({...customerInfo, phone: e.target.value});
                                    }}
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="أي متطلبات خاصة أو ملاحظات..."
                                    value={customerInfo.notes}
                                    onChange={(e) => {
                                      console.log('📝 Notes changed:', e.target.value);
                                      setCustomerInfo({...customerInfo, notes: e.target.value});
                                    }}
                                    rows={3}
                                  />
                                </div>
                              </div>

                              <Button 
                                onClick={() => {
                                  console.log('💳 Payment button clicked!');
                                  console.log('📦 Current product:', selectedProduct || product);
                                  console.log('👤 Customer info:', customerInfo);
                                  handlePayment(selectedProduct || product);
                                }}
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
                                    اشتري الآن - {(selectedProduct || product).discount > 0 
                                      ? `${(parseFloat((selectedProduct || product).price) * (1 - (selectedProduct || product).discount / 100)).toFixed(0)} ر.س`
                                      : `${(selectedProduct || product).price} ر.س`
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
              لماذا تختار مطبوعاتنا كبيرة الحجم؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">جودة عالية</h3>
                <p className="text-muted-foreground">
                  طباعة بدقة عالية باستخدام أحدث التقنيات والمواد المتطورة
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">مقاوم للعوامل الجوية</h3>
                <p className="text-muted-foreground">
                  مواد مقاومة للشمس والمطر والرياح لضمان الديمومة
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">توصيل وتركيب</h3>
                <p className="text-muted-foreground">
                  خدمة توصيل مجانية مع إمكانية التركيب الاحترافي
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

export default LargeFormat;