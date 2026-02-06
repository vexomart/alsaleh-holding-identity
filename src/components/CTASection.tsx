/**
 * CTASection - Premium Call-to-Action
 * Enterprise CTA with compelling design
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  MessageCircle, 
  Phone, 
  ArrowLeft,
  Sparkles,
  Star,
  CheckCircle2
} from "lucide-react";

const CTASection = () => {
  const benefits = [
    "استشارة مجانية",
    "تحليل متطلباتك",
    "عرض سعر تنافسي",
    "بدء المشروع فوراً"
  ];

  return (
    <section dir="rtl" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-variant to-accent" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full border border-white/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-white/10 rounded-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
          >
            <Star className="w-4 h-4 text-white/30" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-white font-semibold text-sm">ابدأ مشروعك معنا اليوم</span>
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
          >
            هل أنت جاهز لتحويل
            <br />
            <span className="text-secondary">أفكارك إلى واقع؟</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            فريقنا المتخصص جاهز لمساعدتك في تحقيق أهدافك التقنية. احجز استشارة مجانية الآن وابدأ رحلة النجاح.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-success" />
                {benefit}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/book-consultation">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-7 text-lg rounded-2xl shadow-2xl w-full sm:w-auto"
                >
                  <Rocket className="w-5 h-5 me-2" />
                  <span>احجز استشارة مجانية</span>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-7 text-lg rounded-2xl w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 me-2" />
                  <span>تواصل معنا</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-white/70"
          >
            <a href="tel:0555812567" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span className="ltr-token">0555812567</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <span>متاح الآن للخدمة</span>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-success rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
