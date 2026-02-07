import { useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import {
  Video,
  Film,
  Clapperboard,
  Play,
  Sparkles,
  CheckCircle,
  Star,
  Clock,
  Monitor,
  Palette,
  Camera,
  ArrowLeft,
  Layers,
  Eye,
  Award,
  Target,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";

const VideoProduction = () => {

  useEffect(() => {
    document.title = "إنتاج الفيديو وموشن جرافيك | ASH HOLDING";
    const desc = "خدمات إنتاج فيديو احترافية وموشن جرافيك إبداعي يروي قصة علامتك التجارية";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const videoFeatures = [
    "فيديوهات ترويجية احترافية",
    "موشن جرافيك إبداعي",
    "فيديوهات شرح المنتجات",
    "إنتاج أفلام قصيرة",
    "فيديوهات تدريبية",
    "محتوى وسائل التواصل",
    "تصوير المناسبات",
    "مونتاج وتعديل الفيديو",
    "تأثيرات بصرية VFX",
    "تعليق صوتي احترافي"
  ];

  const videoTypes = [
    { name: "فيديو ترويجي", icon: Video, description: "فيديوهات تسويقية للعلامات التجارية" },
    { name: "موشن جرافيك", icon: Sparkles, description: "رسوم متحركة إبداعية" },
    { name: "فيديو تعليمي", icon: Monitor, description: "محتوى تدريبي وتعليمي" },
    { name: "فيلم قصير", icon: Film, description: "أفلام قصيرة سينمائية" }
  ];

  const features = [
    {
      title: "إنتاج سينمائي",
      description: "جودة عالية الدقة 4K/8K مع معدات احترافية",
      icon: Clapperboard,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "موشن جرافيك إبداعي",
      description: "رسوم متحركة ثنائية وثلاثية الأبعاد",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "مونتاج احترافي",
      description: "تعديل وقص ومزج بأحدث البرامج",
      icon: Layers,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "تأثيرات بصرية",
      description: "VFX متقدمة وتصحيح ألوان سينمائي",
      icon: Eye,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const stats = [
    { value: "500+", label: "مشروع منجز", icon: Film },
    { value: "150+", label: "عميل سعيد", icon: Star },
    { value: "10+", label: "سنوات خبرة", icon: Award },
    { value: "24/7", label: "دعم فني", icon: Clock }
  ];

  const process = [
    { step: "01", title: "الاستشارة", description: "نستمع لفكرتك ونفهم أهدافك ورؤيتك للمشروع" },
    { step: "02", title: "التخطيط", description: "نضع خطة إنتاج مفصلة وسيناريو احترافي" },
    { step: "03", title: "الإنتاج", description: "تصوير ومونتاج وتأثيرات بصرية احترافية" },
    { step: "04", title: "التسليم", description: "مراجعة نهائية وتسليم بجودة عالية" }
  ];

  const whyChooseUs = [
    { title: "فريق محترف", description: "مخرجين ومصورين ومصممين ذوي خبرة عالية", icon: Camera },
    { title: "معدات حديثة", description: "كاميرات 4K/8K وأحدث برامج المونتاج", icon: Monitor },
    { title: "إبداع لا محدود", description: "أفكار مبتكرة وتصاميم فريدة لكل مشروع", icon: Palette },
    { title: "التزام بالمواعيد", description: "نحترم جدولك الزمني ونسلم في الوقت المحدد", icon: Clock },
    { title: "دعم متواصل", description: "نقدم تعديلات ودعم حتى بعد التسليم", icon: Target },
    { title: "أسعار تنافسية", description: "جودة عالية بأسعار مناسبة لجميع الميزانيات", icon: Award }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-gradient-to-l from-orange-500 to-red-500 text-white px-4 py-1.5 text-sm font-bold mb-6">
              <Video className="w-4 h-4 ml-2" />
              إنتاج الفيديو
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-l from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                إنتاج فيديو
              </span>
              <br />
              <span className="bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent">
                وموشن جرافيك
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              نحول أفكارك إلى محتوى بصري مذهل يروي قصة علامتك التجارية ويجذب جمهورك بأسلوب إبداعي فريد
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-l from-orange-500 to-red-500 text-white rounded-full px-8">
                  <Play className="w-5 h-5 ml-2" />
                  شاهد أعمالنا
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  اطلب عرض سعر
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Types */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {videoTypes.map((type, index) => (
              <motion.div key={type.name} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">مميزات خدماتنا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نستخدم أحدث التقنيات والأدوات لإنتاج محتوى بصري عالي الجودة
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-14 h-14 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center",
                      "group-hover:scale-110 transition-transform duration-300",
                      feature.color
                    )}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-l from-orange-500 to-red-500 text-white mb-4">خطوات العمل</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">كيف نعمل؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نتبع منهجية احترافية مدروسة لضمان أفضل النتائج
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {process.map((item, index) => (
              <motion.div key={item.step} variants={itemVariants}>
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-500/30 group">
                  <CardContent className="p-6">
                    <div className="text-5xl font-black bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-l from-orange-500 to-red-500 text-white mb-4">لماذا نحن؟</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">لماذا تختار ASH HOLDING؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نتميز بخبرة واسعة وفريق محترف يضمن لك أفضل النتائج
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Request Form Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50/50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-l from-orange-500 to-red-500 text-white mb-4">تواصل معنا</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">اطلب خدمة إنتاج الفيديو</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <ServiceRequestForm
              serviceName="إنتاج الفيديو والموشن جرافيك"
              serviceType="video_production"
              colorTheme="orange"
              title="اطلب خدمة إنتاج الفيديو"
              serviceOptions={[
                { value: "promo", label: "فيديو ترويجي" },
                { value: "motion", label: "موشن جرافيك" },
                { value: "educational", label: "فيديو تعليمي" },
                { value: "documentary", label: "فيلم وثائقي" },
                { value: "social", label: "محتوى سوشيال ميديا" }
              ]}
              features={videoFeatures}
            />

            {/* Features List */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">ما نقدمه لك</h3>
              <div className="space-y-4">
                {videoFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-orange-100 dark:border-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Customer Portal CTA */}
              <Card className="mt-8 border-2 border-orange-200 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6 text-center">
                  <LogIn className="w-10 h-10 mx-auto mb-4 text-orange-500" />
                  <h4 className="text-lg font-bold mb-2">هل لديك حساب؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    ادخل إلى بوابة العملاء لتتبع طلباتك ومشاريعك
                  </p>
                  <Link to="/portal">
                    <Button className="w-full bg-gradient-to-l from-orange-500 to-red-500 text-white">
                      بوابة العملاء
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-l from-orange-500 to-red-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز لإنتاج فيديو مذهل؟
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              تواصل معنا الآن واحصل على استشارة مجانية لمشروعك
            </p>
            <Link to="/consultation">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                احصل على استشارة مجانية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VideoProduction;
