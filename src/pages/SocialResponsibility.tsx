import { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Sparkles, 
  Clock,
  Mail,
  Users,
  Target,
  Lightbulb,
  Handshake,
  TreePine,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

const SocialResponsibility = () => {
  useEffect(() => {
    document.title = "المسؤولية المجتمعية | شركة علي صالح الشهري القابضة";
    const desc = "قريباً.. مبادرات المسؤولية المجتمعية من شركة علي صالح الشهري القابضة";
    
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

  return (
    <div className="min-h-screen bg-background font-corporate" dir="rtl">
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center py-16 sm:py-20">
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950">
            {/* Animated Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-3xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:40px_40px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Sparkles Animation - Hidden on mobile for performance */}
              <div className="absolute inset-0 pointer-events-none hidden sm:block">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500" />
                  </motion.div>
                ))}
              </div>

              {/* Main Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2 
                }}
                className="mb-6 sm:mb-8"
              >
                <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36">
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-30 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Main icon container */}
                  <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-full p-6 sm:p-7 lg:p-8 shadow-2xl">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    <Heart className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 text-white relative z-10" fill="currentColor" />
                  </div>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 px-4 mb-3 sm:mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600 flex-shrink-0" />
                  </motion.div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
                    قريباً
                  </h1>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent px-4">
                  المسؤولية المجتمعية
                </h2>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                نعمل على إطلاق مبادرات مجتمعية مبتكرة تعكس التزامنا بخدمة المجتمع وتحقيق التنمية المستدامة
              </motion.p>

              {/* Loading Animation */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-8 sm:mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="flex justify-center items-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base sm:text-lg px-6 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 group"
                  >
                    <Mail className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    تواصل معنا للمزيد من المبادرات
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Vision Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20 lg:mb-24"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
                رؤيتنا للمسؤولية المجتمعية
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[
                  { icon: Users, title: "دعم المجتمع", desc: "المساهمة في بناء مجتمع أقوى وأكثر تماسكاً" },
                  { icon: GraduationCap, title: "التعليم", desc: "دعم البرامج التعليمية والمنح الدراسية" },
                  { icon: TreePine, title: "الاستدامة البيئية", desc: "المحافظة على البيئة للأجيال القادمة" },
                  { icon: Handshake, title: "الشراكات", desc: "التعاون مع المؤسسات الخيرية والتنموية" },
                  { icon: Target, title: "التأثير الإيجابي", desc: "إحداث فرق حقيقي في حياة الناس" },
                  { icon: Lightbulb, title: "الابتكار", desc: "حلول مبتكرة للتحديات المجتمعية" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4">
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-8 sm:p-12 lg:p-16 rounded-3xl shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" fill="currentColor" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
                معاً نصنع الفرق
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                نؤمن بأن النجاح الحقيقي يقاس بالأثر الإيجابي الذي نتركه في مجتمعنا. ملتزمون بإطلاق مبادرات مجتمعية مبتكرة تساهم في تحقيق التنمية المستدامة ورفع مستوى المعيشة
              </p>
              <motion.p
                className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-semibold"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ترقبوا الإعلان عن مبادراتنا قريباً
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SocialResponsibility;
