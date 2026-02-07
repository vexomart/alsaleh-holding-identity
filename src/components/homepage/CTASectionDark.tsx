/**
 * CTA Section Dark - MaxioCore Inspired
 * Call to action with clean design
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

export function CTASectionDark() {
  return (
    <section dir="rtl" className="hp-section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hp-primary)/0.15)] via-[hsl(var(--hp-bg-secondary))] to-[hsl(var(--hp-secondary)/0.1)]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-[hsl(var(--hp-primary)/0.15)] text-[hsl(var(--hp-primary))] text-sm font-bold rounded-full mb-6">
              تواصل معنا
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              <span className="text-[hsl(var(--hp-text))]">جاهز لبدء </span>
              <span className="hp-gradient-text">مشروعك؟</span>
            </h2>
            
            <p className="text-[hsl(var(--hp-text-muted))] text-base sm:text-lg max-w-2xl mx-auto mb-8">
              فريقنا مستعد لمساعدتك في تحقيق أهدافك الرقمية. احصل على استشارة مجانية الآن.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="service-card p-5 text-center">
              <div className="hp-icon-box hp-icon-green mx-auto mb-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-[hsl(var(--hp-text))] mb-1">اتصل بنا</div>
              <div className="text-sm text-[hsl(var(--hp-text-muted))] ltr-token">+966 55 123 4567</div>
            </div>
            
            <div className="service-card p-5 text-center">
              <div className="hp-icon-box hp-icon-blue mx-auto mb-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-[hsl(var(--hp-text))] mb-1">راسلنا</div>
              <div className="text-sm text-[hsl(var(--hp-text-muted))] ltr-token">info@ashholding.com</div>
            </div>
            
            <div className="service-card p-5 text-center">
              <div className="hp-icon-box hp-icon-orange mx-auto mb-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-[hsl(var(--hp-text))] mb-1">موقعنا</div>
              <div className="text-sm text-[hsl(var(--hp-text-muted))]">الرياض، المملكة العربية السعودية</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/book-consultation">
              <button className="hp-btn-primary text-base">
                <MessageCircle className="w-5 h-5" />
                <span>احجز استشارة مجانية</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            
            <Link to="/contact">
              <button className="hp-btn-secondary text-base">
                <span>تواصل معنا</span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTASectionDark;
