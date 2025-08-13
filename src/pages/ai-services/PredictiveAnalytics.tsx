import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Activity, 
  Target, 
  ArrowRight, 
  Check, 
  Star,
  Play,
  Clock,
  Users,
  Brain,
  Zap,
  Database,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const PredictiveAnalytics = () => {
  const capabilities = [
    {
      icon: TrendingUp,
      title: "التنبؤ بالمبيعات",
      description: "توقع أداء المبيعات والإيرادات المستقبلية بدقة عالية",
      features: ["تحليل الاتجاهات", "التنبؤ الموسمي", "تحليل العملاء", "توقع الطلب"]
    },
    {
      icon: PieChart,
      title: "تحليل المخاطر",
      description: "تقييم وتحليل المخاطر المحتملة واتخاذ قرارات استباقية",
      features: ["كشف الاحتيال", "تقييم المخاطر", "إنذار مبكر", "إدارة المحافظ"]
    },
    {
      icon: LineChart,
      title: "تحسين الأداء",
      description: "تحليل الأداء الحالي وتقديم توصيات للتحسين",
      features: ["تحليل الكفاءة", "تحسين العمليات", "مراقبة KPIs", "تحسين الموارد"]
    },
    {
      icon: Activity,
      title: "تحليل السلوك",
      description: "فهم سلوك العملاء والمستخدمين والتنبؤ بتصرفاتهم",
      features: ["تحليل رحلة العميل", "تجزئة العملاء", "التنبؤ بالسلوك", "تخصيص التجربة"]
    }
  ];

  const industries = [
    {
      title: "القطاع المصرفي",
      description: "تحليل المخاطر والكشف عن الاحتيال",
      icon: Target,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "التجارة الإلكترونية",
      description: "تحسين المبيعات وتجربة العملاء",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "التصنيع",
      description: "تحسين الإنتاج والصيانة التنبؤية",
      icon: Star,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "دقة في التنبؤ", value: "95%", icon: Target },
    { label: "تحسين في الأداء", value: "40%", icon: TrendingUp },
    { label: "مليار نقطة بيانات", value: "50+", icon: Database }
  ];

  return (
    <>
      <SEO 
        title="التحليلات التنبؤية - شركة علي صالح الشهري القابضة"
        description="حلول التحليلات التنبؤية المتطورة لتحليل البيانات والتنبؤ بالاتجاهات المستقبلية واتخاذ قرارات ذكية"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-red-900/20"></div>
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360] 
                }}
                transition={{ 
                  scale: { duration: 4, repeat: Infinity },
                  rotate: { duration: 20, repeat: Infinity }
                }}
                className="inline-block mb-6"
              >
                <BarChart3 className="w-20 h-20 mx-auto text-orange-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-none px-6 py-2 text-lg">
                📊 تحليلات متقدمة
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                التحليلات التنبؤية
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                تقنيات متطورة لتحليل البيانات والتنبؤ بالاتجاهات المستقبلية لاتخاذ قرارات ذكية ومدروسة
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  شاهد التحليلات المباشرة
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <BarChart3 className="w-6 h-6 mr-2" />
                  جرب أدوات التحليل
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                  <div className="text-3xl font-bold text-orange-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                قدرات التحليل والتنبؤ
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                حلول متطورة لتحويل البيانات إلى رؤى قابلة للتنفيذ وتوقعات دقيقة للمستقبل
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm h-full">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <capability.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">{capability.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-300 text-center">
                        {capability.description}
                      </CardDescription>
                      <div className="space-y-2">
                        {capability.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-400">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-orange-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                القطاعات المستفيدة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                حلول التحليلات التنبؤية المتخصصة لمختلف القطاعات والصناعات
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${industry.color} rounded-full flex items-center justify-center`}>
                    <industry.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">{industry.title}</h3>
                  <p className="text-gray-300 text-center">{industry.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-12"
            >
              <Brain className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                استشرف المستقبل بالبيانات
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                ابدأ في استخدام التحليلات التنبؤية لاتخاذ قرارات أكثر ذكاءً ودقة
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  ابدأ التحليل الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Star className="w-6 h-6 mr-2" />
                  احجز عرض تجريبي
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PredictiveAnalytics;