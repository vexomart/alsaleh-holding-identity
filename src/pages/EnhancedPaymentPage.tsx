import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Loader2,
  ArrowRight,
  Star,
  Sparkles
} from "lucide-react";

interface ServiceData {
  service: string;
  title: string;
  price: string;
  currency: string;
  duration: string;
  features: string[];
}

const EnhancedPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // استخراج البيانات من URL parameters
    const service = searchParams.get('service') || '';
    const title = searchParams.get('title') || '';
    const price = searchParams.get('price') || '';
    const currency = searchParams.get('currency') || 'ريال';
    const duration = searchParams.get('duration') || '';
    const featuresString = searchParams.get('features') || '';
    
    // تحويل الميزات من نص مفصول بـ | إلى مصفوفة
    const features = featuresString ? featuresString.split('|').map(f => decodeURIComponent(f)) : [];

    if (!title || !price) {
      toast({
        title: "خطأ في البيانات",
        description: "معلومات الخدمة غير مكتملة",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setServiceData({
      service,
      title: decodeURIComponent(title),
      price: decodeURIComponent(price),
      currency: decodeURIComponent(currency),
      duration: decodeURIComponent(duration),
      features
    });
    
    setIsLoading(false);
  }, [searchParams, navigate, toast]);

  const handlePaymentMethod = async (method: 'paylink' | 'stc-pay' | 'tamara') => {
    if (!serviceData) return;

    setLoadingMethod(method);
    
    toast({
      title: "جاري معالجة طلب الدفع...",
      description: "يرجى الانتظار قليلاً"
    });
    
    try {
      const amount = parseInt(serviceData.price.replace(/[^\d]/g, ''));
      let functionName = '';
      let payload: any = {
        amount: amount,
        currency: 'SAR',
        customer_name: 'عميل محتمل',
        customer_email: 'customer@example.com',
        customer_phone: '966500000000',
        offer_title: serviceData.title,
        description: `دفع خدمة: ${serviceData.title}`
      };

      switch (method) {
        case 'paylink':
          functionName = 'paylink-payment';
          payload.success_url = window.location.origin + '/payment-success';
          break;
        case 'stc-pay':
          functionName = 'stc-pay';
          break;
        case 'tamara':
          functionName = 'tamara-payment';
          break;
      }

      console.log(`استدعاء ${functionName} مع البيانات:`, payload);

      // تحسين استدعاء Edge Function مع retry logic
      let data, error;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`محاولة ${attempts} من ${maxAttempts}`);
        
        try {
          const result: any = await Promise.race([
            supabase.functions.invoke(functionName, {
              body: payload,
              headers: {
                'Content-Type': 'application/json'
              }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('انتهت مهلة الاتصال')), 30000)
            )
          ]);
          
          data = result.data;
          error = result.error;
          
          if (!error && data) {
            console.log(`نجحت المحاولة ${attempts}:`, data);
            break;
          }
          
          if (attempts < maxAttempts) {
            console.log(`فشلت المحاولة ${attempts}، سيتم إعادة المحاولة...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (attemptError) {
          console.error(`خطأ في المحاولة ${attempts}:`, attemptError);
          if (attempts === maxAttempts) {
            throw attemptError;
          }
        }
      }

      if (error) {
        console.error(`${method} error after ${attempts} attempts:`, error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة بعد عدة محاولات');
      }

      console.log(`${functionName} response:`, data);

      if (data?.success || data?.url || data?.payment_url) {
        toast({
          title: "تم إنشاء رابط الدفع بنجاح",
          description: "سيتم توجيهك إلى صفحة الدفع"
        });

        if (method === 'stc-pay') {
          showSTCPayInstructions(data);
        } else if (data.url || data.paymentUrl || data.payment_url) {
          const paymentUrl = data.url || data.paymentUrl || data.payment_url;
          
          setTimeout(() => {
            if (method === 'paylink') {
              window.location.href = paymentUrl;
            } else {
              window.open(paymentUrl, '_blank');
              toast({
                title: "تم توجيهك لصفحة الدفع",
                description: "يرجى إكمال عملية الدفع في التبويب الجديد",
              });
            }
          }, 500);
        }
      } else {
        throw new Error('لم يتم إرجاع رابط الدفع من الخدمة');
      }
    } catch (error) {
      console.error(`خطأ نهائي في ${method}:`, error);
      
      let errorMessage = "حدث خطأ أثناء عملية الدفع";
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('انتهت مهلة')) {
          errorMessage = "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى";
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMessage = "مشكلة في الاتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "خطأ في الدفع",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingMethod(null);
    }
  };

  const showSTCPayInstructions = (data: any) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="this.remove()">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in" dir="rtl" onclick="event.stopPropagation()">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-2">تعليمات الدفع - STC Pay</h3>
            <p class="text-orange-100">معاملة آمنة ومحمية</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-purple-50 rounded-xl p-4">
              <h4 class="font-bold text-purple-800 mb-2">المبلغ المطلوب:</h4>
              <div class="text-center bg-white rounded-lg p-4">
                <div class="text-3xl font-bold text-purple-600">${data.amount} ${data.currency}</div>
                <div class="text-xl font-bold text-gray-800 mt-2">${data.merchant_number || data.merchantNumber}</div>
              </div>
            </div>
          </div>
          <div class="p-6 bg-gray-50">
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl">إغلاق</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!serviceData) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">خطأ في تحميل بيانات الخدمة</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            العودة للرئيسية
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              إتمام عملية الدفع
            </h1>
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse ml-2" />
          </div>
          <p className="text-gray-600 text-lg">تأكيد طلب الخدمة والمتابعة للدفع الآمن</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    تفاصيل الخدمة
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1">
                    خدمة متميزة
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {serviceData.title}
                  </h3>
                  {serviceData.duration && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>مدة التنفيذ: {serviceData.duration}</span>
                    </div>
                  )}
                </div>

                {serviceData.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4">ما ستحصل عليه:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceData.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm sticky top-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">
                  اختر طريقة الدفع
                </CardTitle>
                <CardDescription>
                  دفع آمن ومحمي 100%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Display */}
                <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {serviceData.price} {serviceData.currency}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">سعر شامل الضريبة</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handlePaymentMethod('paylink')}
                    disabled={loadingMethod !== null}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-bold hover-scale shadow-xl transition-all duration-300"
                  >
                    {loadingMethod === 'paylink' ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5 mr-2" />
                    )}
                    الدفع بالبطاقة - Paylink
                  </Button>

                  <Button
                    onClick={() => handlePaymentMethod('stc-pay')}
                    disabled={loadingMethod !== null}
                    variant="outline"
                    className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 py-4 text-lg font-bold hover-scale transition-all duration-300"
                  >
                    {loadingMethod === 'stc-pay' ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Smartphone className="w-5 h-5 mr-2" />
                    )}
                    STC Pay
                  </Button>

                  <Button
                    onClick={() => handlePaymentMethod('tamara')}
                    disabled={loadingMethod !== null}
                    variant="outline"
                    className="w-full border-2 border-green-200 text-green-600 hover:bg-green-50 py-4 text-lg font-bold hover-scale transition-all duration-300"
                  >
                    {loadingMethod === 'tamara' ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Banknote className="w-5 h-5 mr-2" />
                    )}
                    تمارا - اشتر الآن وادفع لاحقاً
                  </Button>
                </div>

                {/* Security Note */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold">دفع آمن ومحمي</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    جميع المعاملات مشفرة ومحمية بأعلى معايير الأمان
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default EnhancedPaymentPage;