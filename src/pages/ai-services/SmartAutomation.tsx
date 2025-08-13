import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot as Robot,
  Settings, 
  Workflow, 
  Zap, 
  Clock, 
  Target, 
  ArrowRight, 
  Check, 
  Star,
  Download,
  Play,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const SmartAutomation = () => {
  const capabilities = [
    {
      icon: Workflow,
      title: "أتمتة العمليات",
      description: "أتمتة المهام المتكررة وتحسين كفاءة العمل",
      features: ["تصميم سير العمل", "معالجة المستندات", "إدارة المهام", "التقارير التلقائية"]
    },
    {
      icon: Robot,
      title: "الروبوتات الرقمية",
      description: "بوتات ذكية لأتمتة المهام المعقدة",
      features: ["خدمة العملاء", "معالجة الطلبات", "إدارة المخزون", "المتابعة التلقائية"]
    },
    {
      icon: Database,
      title: "إدارة البيانات",
      description: "معالجة وتنظيم البيانات بشكل تلقائي",
      features: ["تنظيف البيانات", "التحليل الآلي", "التصنيف الذكي", "النسخ الاحتياطي"]
    },
    {
      icon: Cloud,
      title: "التكامل السحابي",
      description: "ربط الأنظمة والتطبيقات بسلاسة",
      features: ["API متقدم", "مزامنة البيانات", "إدارة الخدمات", "المراقبة المستمرة"]
    }
  ];

  const benefits = [
    {
      title: "توفير الوقت",
      description: "تقليل الوقت المطلوب للمهام بنسبة تصل إلى 80%",
      icon: Clock,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "تحسين الدقة",
      description: "تقليل الأخطاء البشرية وزيادة جودة النتائج",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "زيادة الإنتاجية",
      description: "رفع مستوى الإنتاجية وتحسين الأداء العام",
      icon: Zap,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "مهمة مؤتمتة", value: "10,000+", icon: Settings },
    { label: "ساعة توفير شهرياً", value: "5,000+", icon: Clock },
    { label: "تحسن في الكفاءة", value: "85%", icon: Target }
  ];

  return (
    <>
      <SEO 
        title="الأتمتة الذكية - شركة علي صالح الشهري القابضة"
        description="حلول الأتمتة الذكية المتطورة لتحسين كفاءة العمل وأتمتة العمليات باستخدام أحدث تقنيات الذكاء الاصطناعي"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-purple-900/20"></div>
        
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
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Robot className="w-20 h-20 mx-auto text-purple-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-6 py-2 text-lg">
                ⚡ أتمتة متطورة
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                الأتمتة الذكية
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                حلول أتمتة متطورة تستخدم الذكاء الاصطناعي لتحسين كفاءة العمل وأتمتة المهام المعقدة
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  ابدأ الأتمتة الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Download className="w-6 h-6 mr-2" />
                  دليل الأتمتة
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
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                قدرات الأتمتة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                مجموعة شاملة من حلول الأتمتة الذكية لتحسين العمليات وزيادة الكفاءة
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
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

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-purple-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                فوائد الأتمتة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                الفوائد الحقيقية التي ستحصل عليها من تطبيق حلول الأتمتة الذكية
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center`}>
                    <benefit.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 text-lg">{benefit.description}</p>
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
              className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12"
            >
              <Cpu className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ابدأ الأتمتة اليوم
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                حول عملياتك إلى أتمتة ذكية وحقق نتائج استثنائية في وقت قياسي
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  ابدأ مشروع الأتمتة
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Star className="w-6 h-6 mr-2" />
                  استشارة مجانية
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartAutomation;