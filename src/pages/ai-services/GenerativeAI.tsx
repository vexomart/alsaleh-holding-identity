import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Mic, 
  Video, 
  ArrowRight, 
  Check, 
  Star,
  Download,
  Play,
  Clock,
  Target,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const GenerativeAI = () => {
  const capabilities = [
    {
      icon: FileText,
      title: "توليد النصوص الذكية",
      description: "إنشاء محتوى عالي الجودة باللغة العربية والإنجليزية",
      features: ["مقالات احترافية", "تقارير تفصيلية", "محتوى تسويقي", "ترجمة متقدمة"]
    },
    {
      icon: ImageIcon,
      title: "إنشاء الصور بالذكاء الاصطناعي",
      description: "توليد صور فريدة ومبتكرة حسب المتطلبات",
      features: ["تصاميم إبداعية", "صور منتجات", "رسوم توضيحية", "شعارات مخصصة"]
    },
    {
      icon: Video,
      title: "إنتاج الفيديوهات",
      description: "إنشاء مقاطع فيديو احترافية بالذكاء الاصطناعي",
      features: ["فيديوهات تسويقية", "عروض تقديمية", "محتوى تعليمي", "إعلانات رقمية"]
    },
    {
      icon: Mic,
      title: "التوليد الصوتي",
      description: "إنتاج محتوى صوتي طبيعي ومعبر",
      features: ["تعليق صوتي", "كتب صوتية", "إعلانات راديو", "مساعد صوتي"]
    }
  ];

  const useCases = [
    {
      title: "المحتوى التسويقي",
      description: "إنشاء حملات تسويقية مؤثرة",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "التعليم والتدريب",
      description: "مواد تعليمية تفاعلية ومخصصة",
      icon: Star,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "الأعمال والشركات",
      description: "تقارير وعروض تقديمية احترافية",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "كلمة في الثانية", value: "1000+", icon: Clock },
    { label: "دقة في النتائج", value: "98%", icon: Target },
    { label: "لغة مدعومة", value: "50+", icon: FileText }
  ];

  return (
    <>
      <SEO 
        title="الذكاء الاصطناعي التوليدي - شركة علي صالح الشهري القابضة"
        description="خدمات الذكاء الاصطناعي التوليدي المتطورة لإنشاء المحتوى النصي والبصري والصوتي بجودة عالية وبسرعة فائقة"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20"></div>
        
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
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Brain className="w-20 h-20 mx-auto text-blue-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none px-6 py-2 text-lg">
                🚀 تقنية متطورة
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                الذكاء الاصطناعي التوليدي
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                أحدث تقنيات الذكاء الاصطناعي لإنشاء محتوى إبداعي وفريد يلبي احتياجاتك التجارية والإبداعية
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  جرب الآن مجاناً
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Download className="w-6 h-6 mr-2" />
                  تحميل الدليل
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
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                قدرات متطورة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تقنيات ذكاء اصطناعي متقدمة لإنتاج محتوى عالي الجودة في ثوانٍ معدودة
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-blue-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                حالات الاستخدام
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تطبيقات متنوعة للذكاء الاصطناعي التوليدي في مختلف المجالات
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
                  className="text-center"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${useCase.color} rounded-full flex items-center justify-center`}>
                    <useCase.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{useCase.title}</h3>
                  <p className="text-gray-300 text-lg">{useCase.description}</p>
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
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ابدأ إنتاج المحتوى الآن
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                اكتشف قوة الذكاء الاصطناعي التوليدي وابدأ في إنتاج محتوى استثنائي لمشروعك
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  ابدأ التجربة المجانية
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Star className="w-6 h-6 mr-2" />
                  احجز عرض توضيحي
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GenerativeAI;