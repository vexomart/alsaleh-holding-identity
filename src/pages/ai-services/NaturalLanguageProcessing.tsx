import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Languages, 
  Bot, 
  BookOpen, 
  Mic, 
  FileText, 
  ArrowRight, 
  Check, 
  Star,
  Play,
  Clock,
  Target,
  Users,
  Globe,
  Zap,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const NaturalLanguageProcessing = () => {
  const capabilities = [
    {
      icon: MessageSquare,
      title: "الدردشة الذكية",
      description: "روبوتات محادثة متطورة تفهم وترد باللغة الطبيعية",
      features: ["دعم عملاء 24/7", "إجابات ذكية", "فهم السياق", "تعلم مستمر"]
    },
    {
      icon: Languages,
      title: "الترجمة الفورية",
      description: "ترجمة دقيقة وسريعة بين أكثر من 100 لغة",
      features: ["ترجمة فورية", "حفظ السياق", "مصطلحات متخصصة", "تحسين مستمر"]
    },
    {
      icon: BookOpen,
      title: "تحليل المشاعر",
      description: "فهم وتحليل المشاعر في النصوص والمحادثات",
      features: ["تحليل الآراء", "قياس الرضا", "مراقبة السمعة", "تقارير مفصلة"]
    },
    {
      icon: FileText,
      title: "تلخيص النصوص",
      description: "استخراج النقاط الرئيسية وتلخيص المحتوى الطويل",
      features: ["تلخيص ذكي", "استخراج المفاهيم", "ملخصات متدرجة", "حفظ المعنى"]
    }
  ];

  const languages = [
    { name: "العربية", flag: "🇸🇦", level: "متقدم" },
    { name: "الإنجليزية", flag: "🇺🇸", level: "متقدم" },
    { name: "الفرنسية", flag: "🇫🇷", level: "متقدم" },
    { name: "الألمانية", flag: "🇩🇪", level: "متقدم" },
    { name: "الصينية", flag: "🇨🇳", level: "متقدم" },
    { name: "اليابانية", flag: "🇯🇵", level: "متقدم" }
  ];

  const useCases = [
    {
      title: "خدمة العملاء",
      description: "دعم عملاء ذكي ومتاح على مدار الساعة",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "إدارة المحتوى",
      description: "تحليل وتصنيف المحتوى تلقائياً",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "التسويق الذكي",
      description: "تحليل تفاعل العملاء وتحسين الحملات",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "لغة مدعومة", value: "100+", icon: Globe },
    { label: "دقة في الفهم", value: "98%", icon: Brain },
    { label: "استجابة في الثانية", value: "<1", icon: Clock }
  ];

  return (
    <>
      <SEO 
        title="معالجة اللغات الطبيعية - شركة علي صالح الشهري القابضة"
        description="تقنيات معالجة اللغات الطبيعية المتطورة للدردشة الذكية والترجمة وتحليل المشاعر باللغة العربية والإنجليزية"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-emerald-900/20"></div>
        
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
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <MessageSquare className="w-20 h-20 mx-auto text-green-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-6 py-2 text-lg">
                💬 ذكاء لغوي متطور
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                معالجة اللغات الطبيعية
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                تقنيات متقدمة لفهم وتحليل ومعالجة اللغة البشرية بطريقة طبيعية وذكية
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  جرب الدردشة الذكية
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Languages className="w-6 h-6 mr-2" />
                  اختبر الترجمة
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
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <div className="text-3xl font-bold text-green-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Languages Section */}
        <section className="py-12 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-white">اللغات المدعومة</h2>
              <p className="text-gray-300">نحن ندعم أكثر من 100 لغة عالمية بدقة عالية</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {languages.map((language, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-3xl mb-2">{language.flag}</div>
                  <div className="text-white font-semibold mb-1">{language.name}</div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/20 text-xs">
                    {language.level}
                  </Badge>
                </motion.div>
              ))}
            </div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                قدرات معالجة اللغة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تقنيات متطورة لفهم ومعالجة اللغة البشرية بجميع تعقيداتها وتفاصيلها
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
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

        {/* Use Cases Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-green-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                حالات الاستخدام
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تطبيقات عملية لتقنيات معالجة اللغات الطبيعية في مختلف المجالات
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${useCase.color} rounded-full flex items-center justify-center`}>
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">{useCase.title}</h3>
                  <p className="text-gray-300 text-center">{useCase.description}</p>
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
              className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12"
            >
              <Bot className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                تواصل بذكاء
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                ابدأ في استخدام تقنيات معالجة اللغات الطبيعية لتحسين تفاعلك مع العملاء
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  ابدأ الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Star className="w-6 h-6 mr-2" />
                  احجز استشارة
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NaturalLanguageProcessing;