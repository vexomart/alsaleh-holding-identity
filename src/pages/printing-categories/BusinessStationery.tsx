import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, ArrowRight, Sparkles, Package, Award, FileText, Mail, CreditCard, Heart, Receipt, ShoppingCart, Loader2, X } from "lucide-react";
import businessStationeryImg from "@/assets/printing/business-stationery.jpg";
import businessCardsImg from "@/assets/printing/business-cards-category.jpg";
import letterheadsImg from "@/assets/printing/letterheads-category.jpg";
import foldersImg from "@/assets/printing/folders-category.jpg";
import envelopesImg from "@/assets/printing/envelopes-category.jpg";
import certificatesImg from "@/assets/printing/certificates-category.jpg";
import idCardsImg from "@/assets/printing/id-cards-category.jpg";
import invitationCardsImg from "@/assets/printing/invitation-cards-category.jpg";
import invoicesNcrImg from "@/assets/printing/invoices-ncr-category.jpg";

const BusinessStationery = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

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
      // تأكد من صحة رقم الهاتف
      let formattedPhone = customerInfo.phone;
      if (!formattedPhone.startsWith('966')) {
        formattedPhone = formattedPhone.startsWith('0') 
          ? `966${formattedPhone.substring(1)}` 
          : `966${formattedPhone}`;
      }

      const paymentData = {
        amount: parseFloat(product.price.replace(/[^0-9]/g, '')),
        customer_name: customerInfo.name.trim(),
        customer_email: customerInfo.email.trim(),
        customer_phone: formattedPhone,
        offer_title: product.title,
        description: `${product.description}${customerInfo.notes ? ` - ملاحظات: ${customerInfo.notes}` : ''}`,
        currency: 'SAR',
        product_details: {
          product_id: product.id || Math.random(),
          product_name: product.title,
          product_version: 'V 1.0'
        }
      };

      console.log('📤 Sending payment data:', JSON.stringify(paymentData, null, 2));

      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: paymentData
      });

      console.log('📥 Response data:', data);
      console.log('📥 Response error:', error);

      if (error) {
        console.error('❌ Request failed:', error);
        toast.error('حدث خطأ أثناء إنشاء رابط الدفع');
        return;
      }

      if (data?.success && data?.payment_url) {
        toast.success('تم إنشاء رابط الدفع بنجاح');
        console.log('🔗 Opening payment URL:', data.payment_url);
        setShowPaymentModal(false);
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

  const categories = [
    {
      title: "كروت شخصية",
      description: "كروت شخصية احترافية بتصميمات فاخرة وخامات عالية الجودة",
      image: businessCardsImg,
      icon: CreditCard,
      gradient: "from-blue-500 to-purple-600",
      products: 25,
      rating: 4.9,
      price: "من 199 ريال",
      features: ["تصميم مجاني", "طباعة فاخرة", "خامات متنوعة"]
    },
    {
      title: "ورق مراسلات",
      description: "أوراق مراسلات رسمية بشعار الشركة وتصميم احترافي",
      image: letterheadsImg,
      icon: FileText,
      gradient: "from-green-500 to-emerald-600",
      products: 18,
      rating: 4.8,
      price: "من 149 ريال",
      features: ["شعار الشركة", "ورق فاخر", "ألوان مخصصة"]
    },
    {
      title: "فولدرات",
      description: "فولدرات مخصصة لحفظ الأوراق والوثائق المهمة",
      image: foldersImg,
      icon: Package,
      gradient: "from-orange-500 to-red-600",
      products: 12,
      rating: 4.7,
      price: "من 89 ريال",
      features: ["تصميم مخصص", "جيوب متعددة", "خامات فاخرة"]
    },
    {
      title: "ظروف",
      description: "ظروف احترافية بتصميمات أنيقة لجميع المناسبات",
      image: envelopesImg,
      icon: Mail,
      gradient: "from-pink-500 to-rose-600",
      products: 20,
      rating: 4.6,
      price: "من 79 ريال",
      features: ["أحجام متنوعة", "طباعة الشعار", "ورق عالي الجودة"]
    },
    {
      title: "شهادات",
      description: "شهادات تقدير وجوائز بتصميمات فاخرة ومميزة",
      image: certificatesImg,
      icon: Award,
      gradient: "from-yellow-500 to-amber-600",
      products: 15,
      rating: 4.9,
      price: "من 159 ريال",
      features: ["تصميمات فاخرة", "ورق مقوى", "عناصر ذهبية"]
    },
    {
      title: "بطاقات تعريفية",
      description: "بطاقات هوية وتعريف للموظفين بتقنية PVC",
      image: idCardsImg,
      icon: Sparkles,
      gradient: "from-indigo-500 to-purple-600",
      products: 10,
      rating: 4.8,
      price: "من 25 ريال",
      features: ["تقنية PVC", "تصميم احترافي", "شريحة اختيارية"]
    },
    {
      title: "كروت دعوة",
      description: "كروت دعوة أنيقة للأفراح والمناسبات الخاصة",
      image: invitationCardsImg,
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
      products: 30,
      rating: 4.9,
      price: "من 199 ريال",
      features: ["تصميمات فاخرة", "ورق مقوى", "تشطيبات متنوعة"]
    },
    {
      title: "فواتير وسندات NCR",
      description: "دفاتر فواتير وسندات بتقنية الكربون للنسخ المتعددة",
      image: invoicesNcrImg,
      icon: Receipt,
      gradient: "from-cyan-500 to-blue-600",
      products: 8,
      rating: 4.7,
      price: "من 69 ريال",
      features: ["تقنية NCR", "ترقيم تسلسلي", "نسخ متعددة"]
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative h-80 rounded-3xl overflow-hidden mb-16 group">
          <img 
            src={businessStationeryImg} 
            alt="مستلزمات مكتبية للأعمال"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-600/70"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse mr-2" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  مستلزمات مكتبية فاخرة
                </h2>
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse ml-2" />
              </div>
              <p className="text-xl text-white/90 mb-6">أكثر من 150 منتج احترافي</p>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-lg">
                ✨ جودة عالمية - أسعار منافسة
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">منتج متخصص</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
            <div className="text-gray-600">تقييم العملاء</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
            <div className="text-gray-600">ساعة تسليم</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover-scale animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
            <div className="text-gray-600">عميل راضي</div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                      {category.products} منتج
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(category.rating) ? 'text-yellow-300 fill-current' : 'text-white/50'}`} 
                          />
                        ))}
                        <span className="text-sm text-white mr-2">({category.rating})</span>
                      </div>
                      <div className="text-white font-bold">{category.price}</div>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {category.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {category.features.map((feature, featureIndex) => (
                        <Badge 
                          key={featureIndex} 
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className={`flex-1 bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white group-hover:shadow-lg transition-all duration-300`}
                        onClick={() => {
                          if (category.title === "كروت شخصية") {
                            window.location.href = "/printing/business-cards";
                          }
                        }}
                      >
                        <span>استكشف المنتجات</span>
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('🎯 Product selected for payment:', category);
                          setSelectedProduct(category);
                          setShowPaymentModal(true);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              هل تحتاج تصميماً مخصصاً؟
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              فريقنا من المصممين المحترفين جاهز لإنشاء تصميمات فريدة تناسب هوية شركتك وتعكس رؤيتك بشكل احترافي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg hover-scale">
                احجز استشارة مجانية
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg hover-scale">
                تصفح الباقات
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">طلب {selectedProduct.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('❌ Modal closed');
                    setShowPaymentModal(false);
                    setSelectedProduct(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Product Info */}
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{selectedProduct.title}</span>
                  <Badge variant="secondary">{selectedProduct.products} منتج</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{selectedProduct.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {selectedProduct.price}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-2">({selectedProduct.rating})</span>
                  </div>
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3 mb-4">
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
                  console.log('📦 Current product:', selectedProduct);
                  console.log('👤 Customer info:', customerInfo);
                  handlePayment(selectedProduct);
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
                    اشتري الآن - {selectedProduct.price}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BusinessStationery;