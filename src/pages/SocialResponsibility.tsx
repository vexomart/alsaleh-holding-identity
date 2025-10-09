import { useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  HandshakeIcon, 
  GraduationCap, 
  Hospital, 
  Users,
  FileText,
  ChevronDown,
  ArrowRight
} from "lucide-react";

const SocialResponsibility = () => {
  useEffect(() => {
    document.title = "المسؤولية المجتمعية | شركة علي صالح الشهري القابضة";
    const desc = "نلتزم بدعم المجتمع من خلال تخصيص 2% من قيمة كل طلب لصالح جمعية جدة الخيرية";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } },
    viewport: { once: true }
  };

  const goals = [
    {
      icon: Heart,
      title: "دعم المجتمع",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: GraduationCap,
      title: "التعليم",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Hospital,
      title: "الصحة",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Users,
      title: "المساعدة الإنسانية",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(5, 150, 105, 0.3) 0%, transparent 50%)`
            }} />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Floating Hearts Animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: `${Math.random() * 100}%`,
                      y: "100%",
                      opacity: 0
                    }}
                    animate={{
                      y: "-100%",
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 1.5,
                      ease: "linear"
                    }}
                  >
                    <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500/30" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-2xl">
                  <Heart className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                معًا نحو مستقبلٍ أكثر عطاءً
              </motion.h1>

              <motion.p 
                className="text-xl lg:text-2xl text-gray-700 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                تلتزم شركة علي صالح الشهري القابضة بدعم المجتمع من خلال تخصيص 
                <span className="font-bold text-emerald-600 mx-2">٢٪</span> 
                من قيمة كل طلب لصالح جمعية جدة الخيرية
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-lg px-10 py-6 rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 group"
                >
                  اعرف المزيد عن المبادرة
                  <ArrowRight className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <motion.div
                className="mt-12"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-8 h-8 text-emerald-600 mx-auto" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              className="max-w-5xl mx-auto text-center"
              {...fadeInUp}
            >
              <motion.div
                className="flex items-center justify-center gap-8 mb-12"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white font-bold text-2xl">ASH</span>
                </motion.div>

                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HandshakeIcon className="w-16 h-16 text-emerald-600" />
                </motion.div>

                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white font-bold text-lg text-center">جمعية<br/>جدة</span>
                </motion.div>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                شراكتنا مع جمعية جدة
              </h2>
              
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                في إطار مسؤوليتنا الاجتماعية، نفخر بشراكتنا مع جمعية جدة لدعم المشاريع الخيرية 
                والتنموية داخل المملكة. نؤمن بأن النجاح الحقيقي يُقاس بما نقدمه لمجتمعنا.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-50">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900"
              {...fadeInUp}
            >
              أهدافنا المجتمعية
            </motion.h2>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {goals.map((goal, index) => {
                const IconComponent = goal.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-center text-gray-900">
                        {goal.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              {...fadeInUp}
            >
              <motion.div
                className="inline-block mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
                الشفافية والمصداقية
              </h2>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                يتم تحويل المبالغ بشكل سنوي إلى جمعية جدة وفق اتفاقية تعاون رسمية، 
                مع التزامنا الكامل بالشفافية والإفصاح التام عن أثر المبادرة في خدمة المجتمع.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="relative py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
          {/* Floating Hearts Background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${100 + Math.random() * 20}%`,
                  opacity: 0
                }}
                animate={{
                  y: `${-20 - Math.random() * 20}%`,
                  opacity: [0, 0.3, 0.6, 0.3, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "linear"
                }}
              >
                <Heart className="w-8 h-8 text-emerald-400 fill-emerald-400/20" />
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              {...fadeInUp}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-8"
              >
                <Heart className="w-24 h-24 text-emerald-600 fill-emerald-600/30 mx-auto" />
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
                شكراً لكم
              </h2>
              
              <p className="text-2xl text-gray-700 leading-relaxed mb-12">
                شكراً لكل عميل ساهم في دعم المبادرة، فكل عملية شراء تترك أثراً جميلاً في حياة الآخرين. 
                أنتم شركاء في صنع الفرق وبناء مجتمع أفضل.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-lg px-10 py-6 rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                >
                  تواصل معنا للمزيد من المبادرات
                  <ArrowRight className="mr-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer Logos Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">ASH</span>
                </div>
                <p className="text-gray-300">شركة علي صالح الشهري القابضة</p>
              </motion.div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-12 h-12 text-emerald-500 fill-emerald-500/30" />
              </motion.div>

              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">جمعية جدة</span>
                </div>
                <p className="text-gray-300">جمعية جدة الخيرية</p>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-center text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              يُحول المبلغ الإجمالي المتجمع سنويًا لدعم برامج الجمعية الخيرية وفق الاتفاقية الموقعة بين الطرفين.
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SocialResponsibility;
