import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimePayments } from '@/hooks/useRealtimePayments';
import { 
  CreditCard, 
  Calendar, 
  Building2, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap,
  ArrowRight,
  Lock,
  Smartphone,
  Globe,
  Wallet,
  Activity
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  name_ar: string;
  provider: string;
  icon_name: string;
  is_active: boolean;
  configuration: any;
}

interface PaymentRequest {
  amount: number;
  description: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  selected_method: string;
}

export default function ClientPaymentInterface() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    amount: 0,
    description: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    selected_method: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        setPaymentRequest(prev => ({
          ...prev,
          customer_email: user.email || '',
          customer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
        }));
      }
    };
    getCurrentUser();
  }, []);

  // Setup realtime updates
  useRealtimePayments({
    onUpdate: () => {
      toast({
        title: "🔄 تحديث المعاملة",
        description: "تم تحديث حالة المعاملة",
      });
    },
    userId: currentUser?.id,
    showNotifications: true
  });

  useEffect(() => {
    fetchActivePaymentMethods();
  }, []);

  const fetchActivePaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .in('provider', ['tap_now', 'tamara', 'bank_transfer'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب طرق الدفع المتاحة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod || !currentUser) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار طريقة دفع صحيحة",
        variant: "destructive"
      });
      return;
    }

    if (paymentRequest.amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Generate transaction ID
      const transactionId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment transaction record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_transactions')
        .insert({
          transaction_id: transactionId,
          user_id: currentUser.id,
          customer_name: paymentRequest.customer_name,
          customer_email: paymentRequest.customer_email,
          customer_phone: paymentRequest.customer_phone,
          amount: paymentRequest.amount,
          currency: 'SAR',
          status: 'PENDING',
          payment_method: selectedMethod.provider,
          offer_title: paymentRequest.description,
          description: `دفع عبر ${selectedMethod.name_ar}`,
          metadata: {
            provider: selectedMethod.provider,
            provider_config: selectedMethod.configuration,
            initiated_at: new Date().toISOString(),
            client_ip: 'Unknown'
          }
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Simulate payment processing based on provider
      if (selectedMethod.provider === 'bank_transfer') {
        // For bank transfer, set to pending with bank details
        await supabase
          .from('payment_transactions')
          .update({
            status: 'PENDING',
            metadata: Object.assign(
              paymentData.metadata || {},
              {
                bank_details: selectedMethod.configuration,
                awaiting_transfer: true
              }
            )
          })
          .eq('id', paymentData.id);

        toast({
          title: "✅ تم إنشاء طلب التحويل",
          description: `يرجى التحويل إلى الحساب المصرفي المحدد. رقم المعاملة: ${transactionId}`,
        });
      } else {
        // For electronic payments, simulate success after delay
        setTimeout(async () => {
          await supabase
            .from('payment_transactions')
            .update({
              status: 'COMPLETED',
              payment_date: new Date().toISOString(),
              metadata: Object.assign(
                paymentData.metadata || {},
                {
                  completed_at: new Date().toISOString(),
                  simulated: true
                }
              )
            })
            .eq('id', paymentData.id);

          toast({
            title: "🎉 تمت المعاملة بنجاح!",
            description: `تم دفع ${paymentRequest.amount} ر.س بنجاح. رقم المعاملة: ${transactionId}`,
          });
        }, 3000);

        // Show processing message
        toast({
          title: "⏳ جاري معالجة الدفع...",
          description: `جاري معالجة دفع ${paymentRequest.amount} ر.س عبر ${selectedMethod.name_ar}`,
        });
      }

      // Reset form
      setPaymentRequest(prev => ({
        ...prev,
        amount: 0,
        description: '',
        selected_method: ''
      }));
      setSelectedMethod(null);

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getMethodIcon = (iconName: string) => {
    const icons = {
      CreditCard,
      Calendar,
      Building2,
      Shield
    };
    return icons[iconName as keyof typeof icons] || CreditCard;
  };

  const getMethodColor = (provider: string) => {
    switch (provider) {
      case 'tap_now':
        return 'from-violet-600 via-purple-600 to-indigo-600';
      case 'tamara':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'bank_transfer':
        return 'from-blue-600 via-indigo-600 to-purple-600';
      default:
        return 'from-slate-600 via-gray-600 to-zinc-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-muted-foreground font-medium">جاري تحضير بوابة الدفع الآمنة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-tajawal" dir="rtl">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-variant/20 blur-3xl rounded-full"></div>
            <div className="relative p-6 bg-gradient-to-br from-white via-white/95 to-primary/5 rounded-full shadow-2xl border border-white/20">
              <Wallet className="h-16 w-16 text-primary drop-shadow-lg" />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-primary to-primary-variant bg-clip-text text-transparent leading-tight">
              بوابة الدفع الآمنة
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              ادفع بسهولة وأمان باستخدام طرق الدفع المتعددة مع تحديثات لحظية لحالة المعاملة
            </p>
            
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Badge className="px-6 py-3 bg-emerald-500/10 text-emerald-600 border-emerald-200">
                <Shield className="w-4 h-4 ml-2" />
                آمن ومشفر
              </Badge>
              <Badge className="px-6 py-3 bg-blue-500/10 text-blue-600 border-blue-200">
                <Zap className="w-4 h-4 ml-2" />
                معالجة فورية
              </Badge>
              <Badge className="px-6 py-3 bg-purple-500/10 text-purple-600 border-purple-200">
                <Activity className="w-4 h-4 ml-2" />
                متابعة لحظية
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <Card className="lg:col-span-2 shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-white/80">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-primary" />
                تفاصيل الدفع
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                أدخل تفاصيل المعاملة واختر طريقة الدفع المناسبة
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Amount Input */}
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-lg font-semibold text-foreground">
                  المبلغ (ريال سعودي)
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentRequest.amount || ''}
                    onChange={(e) => setPaymentRequest(prev => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0
                    }))}
                    className="text-2xl font-bold h-16 text-center text-primary border-2 focus:border-primary/50"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary font-semibold">ر.س</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-semibold text-foreground">
                  وصف المعاملة
                </Label>
                <Input
                  id="description"
                  placeholder="وصف مختصر للمعاملة"
                  value={paymentRequest.description}
                  onChange={(e) => setPaymentRequest(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className="h-12 text-lg"
                />
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="customer_name" className="text-lg font-semibold text-foreground">
                    اسم العميل
                  </Label>
                  <Input
                    id="customer_name"
                    value={paymentRequest.customer_name}
                    onChange={(e) => setPaymentRequest(prev => ({
                      ...prev,
                      customer_name: e.target.value
                    }))}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="customer_phone" className="text-lg font-semibold text-foreground">
                    رقم الهاتف (اختياري)
                  </Label>
                  <Input
                    id="customer_phone"
                    placeholder="+966"
                    value={paymentRequest.customer_phone}
                    onChange={(e) => setPaymentRequest(prev => ({
                      ...prev,
                      customer_phone: e.target.value
                    }))}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                <Label className="text-lg font-semibold text-foreground">
                  اختر طريقة الدفع
                </Label>
                
                <div className="grid grid-cols-1 gap-4">
                  {paymentMethods.map((method) => {
                    const IconComponent = getMethodIcon(method.icon_name);
                    const isSelected = selectedMethod?.id === method.id;
                    
                    return (
                      <Card 
                        key={method.id}
                        className={`
                          cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                          ${isSelected 
                            ? 'border-primary/50 bg-gradient-to-r ' + getMethodColor(method.provider) + ' text-white shadow-xl scale-[1.02]' 
                            : 'border-border hover:border-primary/30 bg-white/60'
                          }
                        `}
                        onClick={() => setSelectedMethod(method)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${
                              isSelected 
                                ? 'bg-white/20 backdrop-blur-sm' 
                                : 'bg-gradient-to-br ' + getMethodColor(method.provider)
                            }`}>
                              <IconComponent className={`h-8 w-8 ${
                                isSelected ? 'text-white' : 'text-white'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className={`text-xl font-bold mb-2 ${
                                isSelected ? 'text-white' : 'text-foreground'
                              }`}>
                                {method.name_ar}
                              </h3>
                              
                              {method.provider === 'bank_transfer' && method.configuration && (
                                <div className={`text-sm space-y-1 ${
                                  isSelected ? 'text-white/80' : 'text-muted-foreground'
                                }`}>
                                  <p>البنك: {method.configuration.bank_name}</p>
                                  <p>IBAN: {method.configuration.iban}</p>
                                </div>
                              )}
                            </div>
                            
                            {isSelected && (
                              <CheckCircle className="h-6 w-6 text-white" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Process Payment Button */}
              <Button
                onClick={processPayment}
                disabled={!selectedMethod || processing || paymentRequest.amount <= 0}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary shadow-xl"
              >
                {processing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري معالجة الدفع...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6" />
                    ادفع {paymentRequest.amount.toLocaleString()} ر.س بأمان
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Security & Trust Info */}
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  الأمان والحماية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700">تشفير SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700">مطابق لمعايير PCI DSS</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700">تحديثات لحظية للحالة</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700">دعم فني 24/7</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  المتابعة اللحظية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-blue-700">
                <p className="text-sm leading-relaxed">
                  ستتلقى تحديثات فورية لحالة معاملتك عبر النظام مع إشعارات تلقائية لكل مرحلة من مراحل المعالجة.
                </p>
                <div className="bg-blue-100/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-semibold">زمن المعالجة المتوقع:</span>
                  </div>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• الدفع الإلكتروني: فوري - 30 ثانية</li>
                    <li>• تمارا: فوري - دقيقتان</li>
                    <li>• حوالة بنكية: 1-24 ساعة</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  دعم متعدد الأجهزة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-purple-100/50 rounded-xl">
                    <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-xs text-purple-700 font-medium">الهواتف الذكية</span>
                  </div>
                  <div className="text-center p-3 bg-purple-100/50 rounded-xl">
                    <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-xs text-purple-700 font-medium">المتصفحات</span>
                  </div>
                  <div className="text-center p-3 bg-purple-100/50 rounded-xl">
                    <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-xs text-purple-700 font-medium">التطبيقات</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}