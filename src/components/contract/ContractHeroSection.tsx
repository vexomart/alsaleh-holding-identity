import React from "react";
import { motion } from "framer-motion";
import { 
  FileSignature, 
  Shield, 
  Zap, 
  Award, 
  CheckCircle2, 
  Star,
  Sparkles,
  Globe,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ContractHeroSectionProps {
  onStartClick?: () => void;
  onLearnMoreClick?: () => void;
}

const ContractHeroSection: React.FC<ContractHeroSectionProps> = ({ 
  onStartClick,
  onLearnMoreClick 
}) => {
  const stats = [
    { value: "500+", label: "عقد منجز", icon: FileSignature },
    { value: "99%", label: "نسبة الرضا", icon: Star },
    { value: "24/7", label: "دعم متواصل", icon: Zap },
  ];

  const features = [
    { icon: Shield, text: "حماية قانونية كاملة" },
    { icon: Lock, text: "تشفير متقدم" },
    { icon: Globe, text: "صالح دولياً" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-blue-700 to-indigo-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-16 md:py-24" dir="rtl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm mb-6 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                نظام التعاقد الإلكتروني المتقدم
              </Badge>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              عقود إلكترونية بمعايير{" "}
              <span className="bg-gradient-to-l from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                عالمية
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-blue-100/90 mb-8 leading-relaxed">
              تجربة تعاقد احترافية متكاملة تشمل جميع خدماتنا، مع ختم وتوقيع رقمي معتمد، 
              وتنبيهات دفع واضحة لضمان حقوق جميع الأطراف.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <feature.icon className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartClick}
                size="lg"
                className="bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold px-8 py-6 text-lg rounded-xl shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105"
              >
                <FileSignature className="w-5 h-5 ml-2" />
                ابدأ التعاقد الآن
              </Button>
              <Button 
                onClick={onLearnMoreClick}
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
              >
                كيف يعمل النظام؟
              </Button>
            </div>
          </motion.div>

          {/* Stats Card Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-xl"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex -space-x-1 space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-white/90 text-sm">موثوق من +500 عميل</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200/80 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Features Checklist */}
              <div className="space-y-3">
                {[
                  "توقيع رقمي معتمد قانونياً",
                  "ختم إلكتروني رسمي",
                  "حماية وتشفير متقدم",
                  "إشعارات فورية بالبريد والرسائل"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 text-white/90"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-2xl blur-xl" />
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContractHeroSection;
