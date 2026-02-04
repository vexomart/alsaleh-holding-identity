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
  BarChart3,
  TrendingUp,
  Target,
  Search,
  Zap,
  CheckCircle,
  Star,
  ArrowLeft,
  LineChart,
  MousePointer,
  ShoppingCart,
  Monitor,
  Eye,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";

const GoogleAds = () => {

  useEffect(() => {
    document.title = "إعلانات جوجل ADS | ASH HOLDING";
    const desc = "خدمات إعلانات جوجل الاحترافية - حملات مستهدفة بأعلى عائد استثمار";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const adsFeatures = [
    "حملات البحث Search Campaigns",
    "إعلانات العرض Display Ads",
    "حملات التسوق Shopping",
    "إعلانات يوتيوب Video Ads",
    "حملات التطبيقات App Campaigns",
    "إعادة الاستهداف Remarketing",
    "تحسين معدل التحويل CRO",
    "تقارير وتحليلات شاملة",
    "إدارة الميزانية الذكية",
    "اختبار A/B متقدم"
  ];

  const campaignTypes = [
    { name: "حملات البحث", icon: Search, description: "ظهور في نتائج بحث جوجل", roi: "+320%" },
    { name: "إعلانات العرض", icon: Monitor, description: "بانرات على ملايين المواقع", roi: "+180%" },
    { name: "حملات التسوق", icon: ShoppingCart, description: "عرض منتجاتك مع الأسعار", roi: "+450%" },
    { name: "إعلانات يوتيوب", icon: Eye, description: "فيديوهات إعلانية جذابة", roi: "+250%" }
  ];

  const features = [
    {
      title: "استهداف دقيق",
      description: "الوصول للجمهور المناسب في الوقت المناسب",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "تحسين ROI",
      description: "أعلى عائد استثمار مع أقل تكلفة للنقرة",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "تقارير مفصلة",
      description: "لوحة تحكم متكاملة لمتابعة الأداء",
      icon: LineChart,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "تحويلات مضمونة",
      description: "زيادة المبيعات والعملاء المحتملين",
      icon: MousePointer,
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "500+", label: "حملة ناجحة", icon: BarChart3 },
    { value: "10M+", label: "نقرة محققة", icon: MousePointer },
    { value: "320%", label: "متوسط ROI", icon: TrendingUp },
    { value: "50+", label: "شريك معتمد", icon: Star }
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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-4 py-1.5 text-sm font-bold mb-6">
              <BarChart3 className="w-4 h-4 ml-2" />
              Google Partner
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-l from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                إعلانات جوجل
              </span>
              <br />
              <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Google ADS
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              حملات إعلانية ذكية ومستهدفة تصل بعلامتك التجارية لملايين العملاء المحتملين حول العالم
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-full px-8">
                  <Zap className="w-5 h-5 ml-2" />
                  ابدأ حملتك الآن
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  استشارة مجانية
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Campaign Types */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">أنواع الحملات الإعلانية</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نختار لك النوع الأنسب من الحملات بناءً على أهدافك التسويقية
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {campaignTypes.map((type, index) => (
              <motion.div key={type.name} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      ROI {type.roi}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">لماذا تختارنا؟</h2>
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
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-14 h-14 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center",
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

      {/* Request Form Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white mb-4">تواصل معنا</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">اطلب حملة إعلانية</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <ServiceRequestForm
              serviceName="إعلانات جوجل ADS"
              serviceType="google_ads"
              colorTheme="blue"
              title="اطلب حملة إعلانية"
              serviceOptions={[
                { value: "search", label: "حملات البحث" },
                { value: "display", label: "إعلانات العرض" },
                { value: "shopping", label: "حملات التسوق" },
                { value: "video", label: "إعلانات يوتيوب" },
                { value: "app", label: "حملات التطبيقات" }
              ]}
              features={adsFeatures}
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
                {adsFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Customer Portal CTA */}
              <Card className="mt-8 border-2 border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6 text-center">
                  <LogIn className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                  <h4 className="text-lg font-bold mb-2">هل لديك حساب؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    ادخل إلى بوابة العملاء لتتبع حملاتك الإعلانية
                  </p>
                  <Link to="/app">
                    <Button className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white">
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
      <section className="py-16 bg-gradient-to-l from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز لزيادة مبيعاتك؟
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              تواصل معنا الآن واحصل على تحليل مجاني لموقعك
            </p>
            <Link to="/consultation">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                احصل على تحليل مجاني
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

export default GoogleAds;
