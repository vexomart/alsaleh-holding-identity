/**
 * About Section Dark - MaxioCore Inspired
 * Company info with clean design
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Target, 
  Shield, 
  Rocket, 
  Globe, 
  ArrowLeft,
  Award,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "رؤية طموحة",
    description: "نسعى لأن نكون الخيار الأول في حلول التقنية والإعلام",
    color: "hp-icon-blue"
  },
  {
    icon: Shield,
    title: "موثوقية عالية",
    description: "نلتزم بأعلى معايير الجودة والأمان في جميع مشاريعنا",
    color: "hp-icon-green"
  },
  {
    icon: Rocket,
    title: "ابتكار مستمر",
    description: "نواكب أحدث التقنيات ونبتكر حلولاً متقدمة لعملائنا",
    color: "hp-icon-purple"
  },
  {
    icon: Globe,
    title: "تواجد عالمي",
    description: "نمتد بخدماتنا لتشمل عملاء من مختلف أنحاء العالم",
    color: "hp-icon-orange"
  }
];

const achievements = [
  { icon: Building2, value: "2016", label: "سنة التأسيس" },
  { icon: Award, value: "14,883", label: "مشروع منجز" },
  { icon: TrendingUp, value: "9,512", label: "عميل راضٍ" },
];

export function AboutSectionDark() {
  return (
    <section dir="rtl" className="hp-section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(var(--hp-bg))]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[hsl(var(--hp-primary)/0.05)] rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-[hsl(var(--hp-secondary)/0.05)] rounded-full blur-[100px]" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-[hsl(var(--hp-primary)/0.15)] text-[hsl(var(--hp-primary))] text-sm font-bold rounded-full mb-4">
            من نحن
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-[hsl(var(--hp-text))]">شركة </span>
            <span className="hp-gradient-text">ASH HOLDING</span>
          </h2>
          <p className="text-[hsl(var(--hp-text-muted))] text-base sm:text-lg max-w-2xl mx-auto">
            منذ 2016 ونحن نقدم حلولاً تقنية متكاملة للشركات والمؤسسات
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="hp-icon-box hp-icon-blue">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[hsl(var(--hp-text))]">شركة قابضة رائدة</h3>
                <p className="text-sm text-[hsl(var(--hp-text-muted))]">في الاستثمار التقني والإعلامي</p>
              </div>
            </div>

            <p className="text-[hsl(var(--hp-text-muted))] leading-relaxed mb-4">
              ASH HOLDING هي شركة قابضة سعودية رائدة تأسست عام 2016، متخصصة في الاستثمار والتطوير في قطاعات التقنية والإعلام الرقمي.
            </p>

            <p className="text-[hsl(var(--hp-text-muted))] leading-relaxed mb-6">
              من خلال فريق عمل متميز وشراكات استراتيجية عالمية، نقدم مجموعة شاملة من الخدمات تشمل تطوير البرمجيات، الذكاء الاصطناعي، والتسويق الرقمي.
            </p>

            {/* Achievements */}
            <div className="flex flex-wrap gap-4 mb-6">
              {achievements.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 bg-[hsl(var(--hp-bg-card))] border border-[hsl(var(--hp-border))] rounded-xl"
                >
                  <item.icon className="w-5 h-5 text-[hsl(var(--hp-primary))]" />
                  <div>
                    <div className="font-bold text-[hsl(var(--hp-text))]">{item.value}</div>
                    <div className="text-xs text-[hsl(var(--hp-text-muted))]">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Link to="/about">
                <button className="hp-btn-primary text-sm">
                  <span>اعرف المزيد</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/subsidiaries">
                <button className="hp-btn-secondary text-sm">
                  <span>شركاتنا التابعة</span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="service-card p-5 group"
                >
                  <div className={`hp-icon-box ${feature.color} mb-4`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-[hsl(var(--hp-text))] mb-2 group-hover:text-[hsl(var(--hp-primary))] transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-[hsl(var(--hp-text-muted))] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSectionDark;
