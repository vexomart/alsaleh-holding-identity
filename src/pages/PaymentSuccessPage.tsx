import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Star,
  Settings,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { db, supabase } from '@/integrations/supabase/db';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const subscriptionId = searchParams.get('subscription_id');
  const transactionId = searchParams.get('transactionNo');

  useEffect(() => {
    if (subscriptionId || transactionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [subscriptionId, transactionId]);

  const verifyPayment = async () => {
    setVerifying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-subscription', {
        body: {
          subscription_id: subscriptionId,
          transaction_id: transactionId
        }
      });

      if (error) throw error;

      if (data.success && data.status === 'active') {
        toast({
          title: "تم تفعيل الاشتراك بنجاح!",
          description: data.message,
        });
        
        // Fetch subscription details
        await fetchSubscriptionDetails();
      } else {
        toast({
          title: "حالة الدفع",
          description: data.message,
          variant: data.status === 'failed' ? 'destructive' : 'default',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "خطأ في التحقق",
        description: "فشل في التحقق من حالة الدفع",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const fetchSubscriptionDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = db
        .from('subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id);

      if (subscriptionId) {
        query = query.eq('id', subscriptionId);
      } else if (transactionId) {
        query = query.eq('paylink_transaction_id', transactionId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">جاري التحقق من حالة الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="تم الدفع بنجاح - نظام الأتمتة الذكية"
        description="تم تفعيل اشتراكك بنجاح في نظام الأتمتة الذكية"
      />

      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50" dir="rtl">
        <div className="container mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
              >
                تم الدفع بنجاح! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xl text-slate-600 mb-8"
              >
                مرحباً بك في عالم الأتمتة الذكية
              </motion.p>

              {verifying && (
                <Alert className="max-w-md mx-auto mb-8">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    جاري التحقق من تفعيل الاشتراك...
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Subscription Details */}
            {subscription && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mb-16"
              >
                <Card className="bg-white/70 border-green-200/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <Badge className="mx-auto mb-4 bg-green-500 text-white">
                      {subscription.status === 'active' ? 'مفعل' : 'قيد المعالجة'}
                    </Badge>
                    <CardTitle className="text-2xl text-slate-900">
                      تفاصيل الاشتراك
                    </CardTitle>
                    <CardDescription>
                      معلومات اشتراكك في نظام الأتمتة الذكية
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">الخطة</h3>
                          <p className="text-slate-600">{subscription.subscription_plans?.name_ar}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">السعر</h3>
                          <p className="text-slate-600">
                            {subscription.subscription_plans?.price} {subscription.subscription_plans?.currency}/شهر
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">تاريخ البداية</h3>
                          <p className="text-slate-600">{formatDate(subscription.current_period_start)}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">تاريخ الانتهاء</h3>
                          <p className="text-slate-600">{formatDate(subscription.current_period_end)}</p>
                        </div>
                      </div>
                    </div>

                    {subscription.subscription_plans?.features && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">المميزات المتاحة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {subscription.subscription_plans.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-slate-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">ابدأ الأتمتة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">
                    ادخل إلى نظام الأتمتة وابدأ في إنشاء أول سير عمل لك
                  </p>
                  <Button 
                    className="w-full bg-indigo-500 hover:bg-indigo-600"
                    onClick={() => window.location.href = '/automation-system'}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">دليل المستخدم</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">
                    تحميل دليل شامل لاستخدام جميع مميزات النظام
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/user-guide'}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل الدليل
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">الدعم المتخصص</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">
                    فريق دعم متخصص متاح 24/7 لمساعدتك
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    تواصل معنا
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transaction Details */}
            {(subscriptionId || transactionId) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">تفاصيل العملية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {subscriptionId && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">رقم الاشتراك:</span>
                        <span className="font-mono text-slate-900">{subscriptionId}</span>
                      </div>
                    )}
                    {transactionId && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">رقم المعاملة:</span>
                        <span className="font-mono text-slate-900">{transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">تاريخ العملية:</span>
                      <span className="text-slate-900">{formatDate(new Date())}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccessPage;