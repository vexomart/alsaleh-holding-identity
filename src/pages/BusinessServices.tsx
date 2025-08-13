import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Award,
  Clock,
  DollarSign,
  Lightbulb,
  Settings,
  FileText,
  PieChart,
  BrainCircuit,
  Briefcase,
  Calendar,
  CreditCard,
  Crown
} from "lucide-react";
import BusinessServiceRequestForm from "@/components/BusinessServiceRequestForm";

const BusinessServices = () => {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [user, setUser] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionPlans();
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

  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setSubscriptionPlans(data || []);
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
      navigate('/auth');
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
    if (planName.includes('Enterprise') || planName.includes('الشركات')) return Building2;
    return Settings;
  };

  const handleRequestService = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowServiceForm(true);
  };

  const handleViewDetails = (serviceId: string) => {
    navigate(`/business-services/${serviceId}`);
  };

  const businessServices = [
    {
      id: "business-consulting",
      title: "الاستشارات التجارية",
      description: "استشارات متخصصة لتطوير استراتيجيات الأعمال وتحسين الأداء",
      icon: Briefcase,
      features: ["تحليل السوق", "دراسة الجدوى", "خطط التوسع", "إدارة المخاطر"],
      price: "يبدأ من 15,000 ريال",
      duration: "4-8 أسابيع",
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: "digital-transformation",
      title: "التحول الرقمي",
      description: "حلول شاملة لرقمنة العمليات وتحسين الكفاءة التشغيلية",
      icon: Zap,
      features: ["أتمتة العمليات", "أنظمة الإدارة", "التطبيقات المخصصة", "التدريب"],
      price: "يبدأ من 25,000 ريال",
      duration: "6-12 أسبوعاً",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "financial-planning",
      title: "التخطيط المالي",
      description: "خدمات التخطيط المالي وإدارة الميزانيات والتنبؤات المالية",
      icon: DollarSign,
      features: ["تحليل مالي", "إعداد الميزانيات", "التنبؤات المالية", "إدارة التدفق النقدي"],
      price: "يبدأ من 12,000 ريال",
      duration: "3-6 أسابيع",
      color: "from-green-600 to-emerald-600"
    },
    {
      id: "project-management",
      title: "إدارة المشاريع",
      description: "إدارة احترافية للمشاريع بأحدث المنهجيات والأدوات",
      icon: Target,
      features: ["تخطيط المشاريع", "إدارة الفرق", "متابعة التقدم", "ضمان الجودة"],
      price: "يبدأ من 18,000 ريال",
      duration: "حسب المشروع",
      color: "from-orange-600 to-red-600"
    },
    {
      id: "market-analysis",
      title: "تحليل السوق",
      description: "دراسات تفصيلية للسوق وتحليل المنافسين واستراتيجيات الدخول",
      icon: BarChart3,
      features: ["بحوث السوق", "تحليل المنافسين", "دراسة العملاء", "الفرص الاستثمارية"],
      price: "يبدأ من 10,000 ريال",
      duration: "3-5 أسابيع",
      color: "from-cyan-600 to-blue-600"
    },
    {
      id: "business-intelligence",
      title: "ذكاء الأعمال",
      description: "حلول تحليل البيانات والتقارير الذكية لدعم اتخاذ القرارات",
      icon: BrainCircuit,
      features: ["تحليل البيانات", "لوحات المراقبة", "التقارير التفاعلية", "التنبؤات الذكية"],
      price: "يبدأ من 20,000 ريال",
      duration: "6-10 أسابيع",
      color: "from-violet-600 to-purple-600"
    }
  ];

  const stats = [
    { number: "500+", label: "مشروع مكتمل", icon: Award },
    { number: "150+", label: "عميل راضي", icon: Users },
    { number: "98%", label: "معدل النجاح", icon: TrendingUp },
    { number: "24/7", label: "دعم فني", icon: Clock }
  ];

  const features = [
    { title: "فريق متخصص", description: "خبراء في مختلف مجالات الأعمال", icon: Users },
    { title: "حلول مخصصة", description: "نصمم الحلول حسب احتياجاتك", icon: Settings },
    { title: "ضمان الجودة", description: "نضمن جودة الخدمة والنتائج", icon: Shield },
    { title: "دعم مستمر", description: "متابعة ودعم بعد التسليم", icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Building2 className="w-4 h-4 ml-2" />
              خدمات الأعمال المتقدمة
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                حلول الأعمال الذكية
              </span>
              <br />
              لنمو شركتك
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التجارية المتطورة لمساعدة شركتك على النمو والازدهار في السوق التنافسي
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/book-consultation')}
              >
                <Calendar className="w-5 h-5 ml-2" />
                احجز استشارة مجانية
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                اكتشف خدماتنا
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Star className="w-4 h-4 ml-2" />
              خدماتنا المتخصصة
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              خدمات الأعمال الشاملة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نقدم حلولاً متكاملة ومبتكرة لجميع احتياجات أعمالك، من الاستشارات إلى التنفيذ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">السعر:</span>
                        <span className="font-bold text-blue-600">{service.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">المدة:</span>
                        <span className="font-medium text-gray-700">{service.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleViewDetails(service.id)}
                      >
                        <FileText className="w-5 h-5 ml-2" />
                        التفاصيل
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleRequestService(service.title)}
                      >
                        <MessageCircle className="w-5 h-5 ml-2" />
                        اطلب الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              نتميز بالخبرة والاحترافية في تقديم حلول الأعمال المبتكرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              <Crown className="w-4 h-4 ml-2" />
              باقات الاشتراك
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              اختر الباقة المناسبة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              باقات مرنة تناسب جميع أحجام الأعمال مع خدمات أتمتة متقدمة
            </p>
            
            {currentSubscription && (
              <Alert className="max-w-2xl mx-auto mt-8">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-right">
                  لديك اشتراك نشط في خطة "{currentSubscription.subscription_plans.name_ar}" 
                  صالح حتى {new Date(currentSubscription.current_period_end).toLocaleDateString('ar-SA')}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subscriptionPlans.map((plan, index) => {
                const IconComponent = getPlanIcon(plan.name);
                const isCurrentPlan = currentSubscription?.plan_id === plan.id;
                const isProfessional = plan.name.includes('Professional') || plan.name.includes('المتقدمة');
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative ${isProfessional ? 'md:-mt-4 md:mb-4' : ''}`}
                  >
                    <Card className={`h-full bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                      isProfessional ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                    } ${
                      isCurrentPlan ? 'ring-2 ring-green-500 shadow-green-500/20' : ''
                    }`}>
                      {isProfessional && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1">
                            الأكثر شعبية
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
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                          {plan.name_ar}
                        </CardTitle>
                        
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900">
                            {plan.price.toLocaleString('ar-SA')}
                          </span>
                          <span className="text-gray-600 mr-2">{plan.currency}/شهر</span>
                        </div>
                        
                        <CardDescription className="text-gray-600">
                          {plan.description_ar}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {plan.features && typeof plan.features === 'object' && Array.isArray(plan.features) && 
                            plan.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{feature}</span>
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
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
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
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            هل أنت مستعد لتطوير أعمالك؟
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            ابدأ رحلتك نحو النجاح مع فريقنا من الخبراء المتخصصين في حلول الأعمال
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/book-consultation')}
            >
              <Calendar className="w-5 h-5 ml-2" />
              احجز استشارة مجانية
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl"
              asChild
            >
              <a href="tel:+966555812567">
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <a href="mailto:info@alialshehriholding.com" className="hover:text-blue-600">
                info@alialshehriholding.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              <a href="tel:+966555812567" className="hover:text-green-600">
                +966 555 812 567
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <a href="https://wa.me/966555812567" className="hover:text-green-600">
                واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Form Modal */}
      {showServiceForm && (
        <BusinessServiceRequestForm
          isOpen={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          selectedService={selectedService}
        />
      )}
    </div>
  );
};

export default BusinessServices;