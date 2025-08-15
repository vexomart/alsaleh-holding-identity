import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Camera, 
  Scan, 
  Shield, 
  Search, 
  Zap, 
  ArrowRight, 
  Check, 
  Star,
  Play,
  Clock,
  Target,
  Users,
  Image as ImageIcon,
  Video,
  MonitorSpeaker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const ComputerVision = () => {
  const capabilities = [
    {
      icon: Camera,
      title: "التعرف على الكائنات",
      description: "تحديد وتصنيف الكائنات في الصور والفيديوهات بدقة عالية",
      features: ["تحليل الصور الطبية", "فحص المنتجات", "مراقبة المخزون", "التصنيف التلقائي"]
    },
    {
      icon: Scan,
      title: "تحليل الوجوه والمشاعر",
      description: "التعرف على الوجوه وتحليل التعبيرات والمشاعر",
      features: ["التعرف على الهوية", "تحليل المشاعر", "الأمان والمراقبة", "تقييم ردود الفعل"]
    },
    {
      icon: Search,
      title: "البحث البصري",
      description: "البحث عن الصور والمحتوى البصري بتقنيات متطورة",
      features: ["البحث بالصورة", "اكتشاف التشابه", "فهرسة المحتوى", "التصنيف الذكي"]
    },
    {
      icon: Shield,
      title: "مراقبة الأمان",
      description: "أنظمة مراقبة ذكية للأمان والحماية",
      features: ["كشف التسلل", "مراقبة السلوك", "التنبيهات الفورية", "التحليل التلقائي"]
    }
  ];

  const industries = [
    {
      title: "الرعاية الصحية",
      description: "تشخيص طبي دقيق وسريع",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      applications: ["الأشعة السينية", "تحليل الأنسجة", "كشف الأورام"]
    },
    {
      title: "التصنيع",
      description: "فحص الجودة والتحكم في الإنتاج",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      applications: ["فحص العيوب", "مراقبة الجودة", "التحكم الآلي"]
    },
    {
      title: "التجارة الإلكترونية",
      description: "تحسين تجربة التسوق البصري",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      applications: ["البحث بالصورة", "توصيات المنتجات", "تحليل الاتجاهات"]
    }
  ];

  const stats = [
    { label: "دقة في التعرف", value: "99.5%", icon: Target },
    { label: "إطار في الثانية", value: "60+", icon: Clock },
    { label: "كائن قابل للتعرف", value: "10,000+", icon: Eye }
  ];

  const features = [
    {
      icon: ImageIcon,
      title: "معالجة الصور المتقدمة",
      description: "تحسين وتحليل الصور بتقنيات متطورة"
    },
    {
      icon: Video,
      title: "تحليل الفيديو المباشر",
      description: "معالجة البث المباشر في الوقت الفعلي"
    },
    {
      icon: MonitorSpeaker,
      title: "التكامل السحابي",
      description: "حلول قابلة للتوسع على السحابة"
    }
  ];

  return (
    <>
      <SEO 
        title="الرؤية الحاسوبية - شركة علي صالح الشهري القابضة"
        description="تقنيات الرؤية الحاسوبية المتطورة للتعرف على الصور والكائنات وتحليل المحتوى البصري بدقة عالية"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-cyan-900/20"></div>
        
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
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Eye className="w-20 h-20 mx-auto text-cyan-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none px-6 py-2 text-lg">
                👁️ رؤية متطورة
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                الرؤية الحاسوبية
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                تقنيات متقدمة للتعرف على الصور والكائنات وتحليل المحتوى البصري بدقة وسرعة فائقة
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  شاهد العرض التوضيحي
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  جرب تحليل الصور
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
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                قدرات الرؤية الحاسوبية
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تقنيات متطورة لتحليل ومعالجة المحتوى البصري بأعلى مستويات الدقة والسرعة
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
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

            {/* Features Row */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-blue-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                التطبيقات الصناعية
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                حلول الرؤية الحاسوبية المتخصصة لمختلف القطاعات والصناعات
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
                  <p className="text-gray-300 text-center mb-6">{industry.description}</p>
                  <div className="space-y-2">
                    {industry.applications.map((app, appIndex) => (
                      <div key={appIndex} className="flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                          {app}
                        </Badge>
                      </div>
                    ))}
                  </div>
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
              className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-12"
            >
              <Zap className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                احصل على رؤية ذكية
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                ابدأ في استخدام تقنيات الرؤية الحاسوبية المتطورة لتحليل وفهم المحتوى البصري
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  ابدأ الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-8 py-4 text-lg rounded-full"
                >
                  <Star className="w-6 h-6 mr-2" />
                  تحدث مع خبير
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ComputerVision;