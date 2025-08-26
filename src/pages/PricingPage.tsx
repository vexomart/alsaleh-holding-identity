import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  ArrowRight, 
  CreditCard,
  Shield,
  Clock,
  Users,
  Settings,
  BarChart3,
  Headphones,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [user, setUser] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      await checkCurrentSubscription(user.id);
    }
  };

  const checkCurrentSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل خطط الاشتراك",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول أولاً للاشتراك",
        variant: "destructive",
      });
      return;
    }

    if (currentSubscription) {
      toast({
        title: "لديك اشتراك نشط",
        description: "لديك اشتراك نشط بالفعل",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(plan.id);

    try {
      const { data, error } = await supabase.functions.invoke('paylink-subscription', {
        body: {
          plan_id: plan.id,
          return_url: `${window.location.origin}/payment-success`
        }
      });

      if (error) throw error;

      if (data.success && data.payment_url) {
        // Open payment URL in new tab
        window.open(data.payment_url, '_blank');
        
        toast({
          title: "تم إنشاء رابط الدفع",
          description: "سيتم فتح صفحة الدفع في نافذة جديدة",
        });
      } else {
        throw new Error(data.error || 'فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ في الدفع",
        description: error.message || "فشل في معالجة الدفع",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const getPlanIcon = (planName) => {
    if (planName.includes('Basic') || planName.includes('الأساسية')) return Star;
    if (planName.includes('Professional') || planName.includes('المتقدمة')) return Zap;
    if (planName.includes('Enterprise') || planName.includes('الشركات')) return Crown;
    return Settings;
  };

  const getPlanBadge = (planName) => {
    if (planName.includes('Professional') || planName.includes('المتقدمة')) return 'الأكثر شعبية';
    if (planName.includes('Enterprise') || planName.includes('الشركات')) return 'للمؤسسات';
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <SEO 
        title="خطط الاشتراك - نظام الأتمتة الذكية"
        description="اختر الخطة المناسبة لك واستمتع بأتمتة ذكية لأعمالك مع خطط مرنة وأسعار تنافسية"
      />

      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" dir="rtl">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none px-6 py-2 text-lg">
                💰 خطط الاشتراك
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  اختر خطتك
                </span>
                <br />
                <span className="text-slate-800">ابدأ الأتمتة الآن</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                خطط مرنة تناسب جميع أحجام الأعمال - من الشركات الناشئة إلى المؤسسات الكبيرة
              </p>

              {currentSubscription && (
                <Alert className="max-w-2xl mx-auto mb-8">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-right">
                    لديك اشتراك نشط في خطة "{currentSubscription.subscription_plans.name_ar}" 
                    صالح حتى {new Date(currentSubscription.current_period_end).toLocaleDateString('ar-SA')}
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                {plans.map((plan, index) => {
                  const IconComponent = getPlanIcon(plan.name);
                  const badge = getPlanBadge(plan.name);
                  const isCurrentPlan = currentSubscription?.plan_id === plan.id;
                  const isProfessional = plan.name.includes('Professional') || plan.name.includes('المتقدمة');
                  
                  return (
                    <motion.div
                      key={plan.id}
                      variants={itemVariants}
                      className={`relative ${isProfessional ? 'md:-mt-4 md:mb-4' : ''}`}
                    >
                      <Card className={`h-full bg-white/70 border-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 ${
                        isProfessional ? 'border-indigo-500/50 shadow-lg' : ''
                      } ${
                        isCurrentPlan ? 'ring-2 ring-green-500 shadow-green-500/20' : ''
                      }`}>
                        {badge && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1">
                              {badge}
                            </Badge>
                          </div>
                        )}
                        
                        {isCurrentPlan && (
                          <div className="absolute -top-4 right-4">
                            <Badge className="bg-green-500 text-white px-3 py-1">
                              خطتك الحالية
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pt-8">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            isProfessional 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                              : 'bg-gradient-to-r from-slate-500 to-slate-600'
                          }`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          
                          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                            {plan.name_ar}
                          </CardTitle>
                          
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-slate-900">
                              {plan.price.toLocaleString('ar-SA')}
                            </span>
                            <span className="text-slate-600 mr-2">{plan.currency}/شهر</span>
                          </div>
                          
                          <CardDescription className="text-slate-600">
                            {plan.description_ar}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            {plan.features && typeof plan.features === 'object' && Array.isArray(plan.features) && 
                              plan.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-3">
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  <span className="text-slate-600 text-sm">{feature}</span>
                                </div>
                              ))
                            }
                          </div>

                          <div className="pt-4">
                            <Button
                              onClick={() => handleSubscribe(plan)}
                              disabled={processingPayment === plan.id || isCurrentPlan || !user}
                              className={`w-full ${
                                isProfessional 
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' 
                                  : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
                              } text-white`}
                              size="lg"
                            >
                              {processingPayment === plan.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  جاري المعالجة...
                                </div>
                              ) : isCurrentPlan ? (
                                'خطتك الحالية'
                              ) : !user ? (
                                'تسجيل الدخول مطلوب'
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-5 h-5" />
                                  اشترك الآن
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 bg-gradient-to-r from-slate-100/50 to-indigo-50/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                لماذا تختار أتمتتنا؟
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                مميزات متقدمة تجعل عملك أكثر كفاءة وإنتاجية
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "أمان متقدم",
                  description: "حماية عالية المستوى لبياناتك وعملياتك",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Clock,
                  title: "توفير الوقت",
                  description: "توفير حتى 80% من الوقت في المهام المتكررة",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Users,
                  title: "فريق دعم متخصص",
                  description: "دعم فني عربي متاح 24/7",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: BarChart3,
                  title: "تقارير تفصيلية",
                  description: "تحليلات متقدمة ومقاييس أداء شاملة",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: Globe,
                  title: "تكامل شامل",
                  description: "ربط مع جميع الأنظمة والخدمات المحلية",
                  color: "from-indigo-500 to-purple-500"
                },
                {
                  icon: Headphones,
                  title: "تدريب مجاني",
                  description: "برامج تدريبية شاملة لفريق العمل",
                  color: "from-pink-500 to-rose-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                جاهز لتحويل أعمالك؟
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                ابدأ رحلتك مع الأتمتة الذكية اليوم واكتشف الفرق
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-slate-100 border-0"
                  onClick={() => user ? document.getElementById('pricing')?.scrollIntoView() : (window.location.href = '/auth')}
                >
                  <Star className="w-5 h-5 mr-2" />
                  {user ? 'اختر خطتك' : 'ابدأ الآن'}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 border-2"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  تحدث مع الخبراء
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PricingPage;