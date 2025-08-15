import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Check, 
  Star,
  Download,
  Play,
  Clock,
  Target,
  Users,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const SmartSecurity = () => {
  const capabilities = [
    {
      icon: Eye,
      title: "المراقبة الذكية",
      description: "مراقبة مستمرة للأنظمة واكتشاف التهديدات في الوقت الفعلي",
      features: ["مراقبة الشبكة", "تحليل السلوك", "رصد الأنشطة", "التنبيهات الفورية"]
    },
    {
      icon: AlertTriangle,
      title: "اكتشاف التهديدات",
      description: "اكتشاف وتحليل التهديدات السيبرانية المتقدمة",
      features: ["البرمجيات الخبيثة", "الهجمات السيبرانية", "التطفل الرقمي", "الثغرات الأمنية"]
    },
    {
      icon: Lock,
      title: "الحماية التنبؤية",
      description: "توقع التهديدات قبل حدوثها واتخاذ إجراءات وقائية",
      features: ["تحليل الأنماط", "التوقع المسبق", "الحماية الاستباقية", "تقييم المخاطر"]
    },
    {
      icon: Zap,
      title: "الاستجابة التلقائية",
      description: "استجابة فورية وتلقائية للتهديدات الأمنية",
      features: ["عزل التهديدات", "إيقاف الهجمات", "استعادة النظام", "التقارير الأمنية"]
    }
  ];

  const securityFeatures = [
    {
      title: "حماية البيانات",
      description: "تشفير متقدم وحماية شاملة للبيانات الحساسة",
      icon: Database,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "إدارة المستخدمين",
      description: "نظام متطور لإدارة الصلاحيات والوصول",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "التحليل الأمني",
      description: "تحليل شامل للأنشطة والتهديدات الأمنية",
      icon: Cpu,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "تهديد مكتشف", value: "50,000+", icon: Eye },
    { label: "دقة في الكشف", value: "99.8%", icon: Target },
    { label: "ثانية للاستجابة", value: "<5", icon: Clock }
  ];

  return (
    <>
      <SEO 
        title="الأمان الذكي - شركة علي صالح الشهري القابضة"
        description="حلول الأمان الذكي المتطورة للحماية من التهديدات السيبرانية باستخدام أحدث تقنيات الذكاء الاصطناعي"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-pink-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-pink-900/20"></div>
        
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
                transition={{ duration: 6, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Shield className="w-20 h-20 mx-auto text-red-400" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-none px-6 py-2 text-lg">
                🛡️ حماية متطورة
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                الأمان الذكي
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
                حماية شاملة ومتطورة للأنظمة والبيانات باستخدام أحدث تقنيات الذكاء الاصطناعي
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Play className="w-6 h-6 mr-2" />
                  فعّل الحماية الآن
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-8 py-4 text-lg rounded-full"
                  onClick={() => window.location.href = '/book-consultation'}
                >
                  <Download className="w-6 h-6 mr-2" />
                  دليل الأمان
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
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-400" />
                  <div className="text-3xl font-bold text-red-400 mb-2">{stat.value}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                قدرات الحماية
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                نظام حماية شامل يوفر أعلى مستويات الأمان للأنظمة والبيانات
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
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

        {/* Security Features Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-red-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                مميزات أمنية متقدمة
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                مجموعة شاملة من المميزات الأمنية المتطورة لحماية كاملة
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-lg">{feature.description}</p>
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
              className="bg-gradient-to-r from-red-900/30 to-pink-900/30 backdrop-blur-sm border border-red-500/30 rounded-3xl p-12"
            >
              <Lock className="w-16 h-16 mx-auto mb-8 text-yellow-400" />
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                احمِ أنظمتك الآن
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                لا تنتظر حتى يحدث الهجوم، ابدأ في حماية أنظمتك وبياناتك بأحدث تقنيات الأمان الذكي
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl"
                  onClick={() => window.location.href = '/contact'}
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  فعّل النظام الأمني
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white px-8 py-4 text-lg rounded-full"
                  onClick={() => window.location.href = '/book-consultation'}
                >
                  <Star className="w-6 h-6 mr-2" />
                  تقييم أمني مجاني
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartSecurity;