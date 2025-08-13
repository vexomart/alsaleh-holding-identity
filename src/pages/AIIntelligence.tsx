import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Brain, 
  Bot as Robot, 
  Cpu, 
  Zap, 
  Eye, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Sparkles,
  Layers,
  Workflow,
  Database,
  Cloud,
  Code,
  Mic,
  Image as ImageIcon,
  FileText,
  Globe,
  ArrowRight,
  Check,
  Star,
  Building2,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const AIIntelligence = () => {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsVisible(true);
    controls.start("visible");
  }, [controls]);

  const aiServices = [
    {
      icon: Brain,
      title: "الذكاء الاصطناعي التوليدي",
      description: "حلول متقدمة لتوليد المحتوى والإبداع الرقمي",
      features: ["توليد النصوص", "إنشاء الصور", "تصميم المحتوى", "الترجمة الذكية"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "الرؤية الحاسوبية",
      description: "تحليل وفهم الصور والفيديوهات بذكاء اصطناعي متطور",
      features: ["تحليل الصور", "التعرف على الوجوه", "مراقبة الجودة", "التتبع الذكي"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "معالجة اللغات الطبيعية",
      description: "فهم وتحليل النصوص والمحادثات باللغة العربية والإنجليزية",
      features: ["الدردشة الذكية", "تحليل المشاعر", "الملخصات التلقائية", "الترجمة الفورية"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "التحليلات التنبؤية",
      description: "تحليل البيانات والتنبؤ بالاتجاهات المستقبلية",
      features: ["تحليل البيانات", "التنبؤ بالمبيعات", "تحسين الأداء", "إدارة المخاطر"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Robot,
      title: "الأتمتة الذكية",
      description: "أتمتة العمليات باستخدام أحدث تقنيات الذكاء الاصطناعي",
      features: ["أتمتة المهام", "الروبوتات الرقمية", "تحسين العمليات", "إدارة الوقت"],
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "الأمان الذكي",
      description: "حماية متقدمة باستخدام الذكاء الاصطناعي",
      features: ["اكتشاف التهديدات", "الحماية التنبؤية", "المراقبة الذكية", "الاستجابة التلقائية"],
      color: "from-red-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "تقنيات متطورة",
      description: "استخدام أحدث نماذج الذكاء الاصطناعي العالمية"
    },
    {
      icon: Globe,
      title: "دعم متعدد اللغات",
      description: "يدعم اللغة العربية والإنجليزية بشكل متقدم"
    },
    {
      icon: Cloud,
      title: "الحوسبة السحابية",
      description: "حلول قابلة للتوسع على أحدث المنصات السحابية"
    },
    {
      icon: Database,
      title: "معالجة البيانات الضخمة",
      description: "تحليل ومعالجة كميات ضخمة من البيانات بسرعة فائقة"
    }
  ];

  const stats = [
    { label: "مشاريع مطورة", value: "500+", icon: Code },
    { label: "شركة استفادت", value: "200+", icon: Building2 },
    { label: "ساعة توفير", value: "10,000+", icon: Clock },
    { label: "دقة النظام", value: "99.9%", icon: Target }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <>
      <SEO 
        title="الذكاء الاصطناعي - شركة علي صالح الشهري القابضة"
        description="حلول الذكاء الاصطناعي المتطورة من شركة علي صالح الشهري القابضة. أول شركة سعودية تقدم نظام ذكاء اصطناعي متكامل ومتطور"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <motion.section 
          className="relative min-h-screen flex items-center justify-center px-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <motion.div
                animate={floatingAnimation}
                className="inline-block mb-6"
              >
                <div className="relative">
                  <Brain className="w-24 h-24 mx-auto text-blue-400" />
                  <motion.div
                    className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none px-6 py-2 text-lg">
                🚀 أول نظام سعودي متكامل
              </Badge>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              مركز الذكاء الاصطناعي
            </motion.h1>

            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold mb-8 text-blue-200"
            >
              شركة علي صالح الشهري القابضة
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed"
            >
              نقدم أول نظام ذكاء اصطناعي متكامل في المملكة العربية السعودية، 
              يجمع بين أحدث التقنيات العالمية والخبرة المحلية لتقديم حلول ذكية ومبتكرة
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                اكتشف الحلول الذكية
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
              >
                <MessageSquare className="w-6 h-6 mr-2" />
                تحدث مع الذكاء الاصطناعي
              </Button>
            </motion.div>

            {/* Floating Stats */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section 
          className="py-20 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                خدماتنا المتطورة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                مجموعة شاملة من حلول الذكاء الاصطناعي المصممة خصيصاً لتلبية احتياجات الشركات والمؤسسات
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onHoverStart={() => setActiveService(index)}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm h-full">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 mx-auto`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-center text-white">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-300 text-center">
                        {service.description}
                      </CardDescription>
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm text-gray-400"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: featureIndex * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        size="sm"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        تعرف على المزيد
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-blue-900/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                مميزات فريدة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                نتميز بتقديم حلول ذكاء اصطناعي متطورة ومصممة خصيصاً للسوق السعودي
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12"
            >
              <motion.div
                animate={floatingAnimation}
                className="mb-8"
              >
                <Zap className="w-16 h-16 mx-auto text-yellow-400" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ابدأ رحلة التحول الرقمي
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                انضم إلى مئات الشركات التي حولت أعمالها باستخدام حلولنا المتطورة للذكاء الاصطناعي
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Star className="w-6 h-6 mr-2" />
                  احجز استشارة مجانية
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <FileText className="w-6 h-6 mr-2" />
                  تحميل النشرة التفصيلية
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default AIIntelligence;