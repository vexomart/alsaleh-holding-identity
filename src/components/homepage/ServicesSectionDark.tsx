/**
 * Services Section Dark - MaxioCore Inspired
 * Clean category cards with colored icons
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Palette,
  Code2,
  TrendingUp,
  Globe,
  ArrowLeft,
  CheckCircle,
  Layers,
  Rocket,
  Users
} from "lucide-react";

const serviceCategories = [
  {
    id: "design",
    icon: Palette,
    title: "التصميم الإبداعي",
    titleEn: "Creative Design",
    description: "تصاميم احترافية تعكس هويتك وتميز علامتك التجارية",
    features: ["شعارات وهويات", "سوشيال ميديا", "موشن جرافيك"],
    color: "hp-icon-pink",
    gradient: "from-pink-500 to-rose-600",
    link: "/design-services"
  },
  {
    id: "development",
    icon: Code2,
    title: "البرمجة والتطوير",
    titleEn: "Development",
    description: "حلول برمجية متكاملة بأحدث التقنيات العالمية",
    features: ["مواقع ويب", "تطبيقات جوال", "أنظمة إدارية"],
    color: "hp-icon-green",
    gradient: "from-emerald-500 to-teal-600",
    link: "/development"
  },
  {
    id: "marketing",
    icon: TrendingUp,
    title: "التسويق الرقمي",
    titleEn: "Digital Marketing",
    description: "استراتيجيات تسويقية ذكية لنمو أعمالك",
    features: ["إدارة إعلانات", "SEO", "إدارة محتوى"],
    color: "hp-icon-blue",
    gradient: "from-blue-500 to-indigo-600",
    link: "/digital-marketing"
  },
  {
    id: "digital",
    icon: Globe,
    title: "خدمات رقمية",
    titleEn: "Digital Services",
    description: "خدمات متنوعة تلبي جميع احتياجاتك الرقمية",
    features: ["استضافة", "دومينات", "أمان سيبراني"],
    color: "hp-icon-orange",
    gradient: "from-amber-500 to-orange-600",
    link: "/digital-services"
  }
];

const stats = [
  { value: "13+", label: "طلب منفذ", icon: CheckCircle },
  { value: "9+", label: "عميل سعيد", icon: Users },
  { value: "127+", label: "خدمة متاحة", icon: Layers },
  { value: "100%", label: "نسبة الرضا", icon: Rocket },
];

export function ServicesSectionDark() {
  return (
    <section dir="rtl" className="hp-section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(var(--hp-bg-secondary))]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-[hsl(var(--hp-primary)/0.15)] text-[hsl(var(--hp-primary))] text-sm font-bold rounded-full mb-4">
            لماذا تختارنا؟
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-[hsl(var(--hp-text))]">منصة موثوقة </span>
            <span className="hp-gradient-text">لنجاحك الرقمي</span>
          </h2>
          <p className="text-[hsl(var(--hp-text-muted))] text-base sm:text-lg max-w-2xl mx-auto">
            نوفر لك خدمات التصميم والبرمجة بجودة عالية وأسعار منافسة
          </p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="hp-stat-card"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--hp-primary))]" />
              <div className="text-2xl sm:text-3xl font-black text-[hsl(var(--hp-text))]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[hsl(var(--hp-text-muted))]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={category.link} className="block group">
                <div className="service-card p-6 h-full">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`hp-icon-box ${category.color} shrink-0`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-[hsl(var(--hp-text-subtle))] uppercase tracking-wide">
                        {category.titleEn}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--hp-text))] group-hover:text-[hsl(var(--hp-primary))] transition-colors">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-[hsl(var(--hp-text-muted))] mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-[hsl(var(--hp-bg))] text-xs text-[hsl(var(--hp-text-muted))] rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--hp-primary))] group-hover:gap-3 transition-all">
                    <span>استكشف الخدمات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSectionDark;
