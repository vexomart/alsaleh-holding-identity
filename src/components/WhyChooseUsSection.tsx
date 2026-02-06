/**
 * WhyChooseUsSection - Premium Value Proposition
 * Showcases company differentiators with modern design
 */

import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  Users, 
  Trophy, 
  Zap,
  HeartHandshake,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: Shield,
      title: "أمان وموثوقية",
      description: "نلتزم بأعلى معايير الأمان وحماية البيانات مع شهادات معتمدة دولياً",
      features: ["ISO 27001", "تشفير متقدم", "حماية 24/7"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Clock,
      title: "التزام بالمواعيد",
      description: "نحترم وقتك ونلتزم بتسليم المشاريع في الوقت المحدد دون تأخير",
      features: ["تسليم سريع", "متابعة مستمرة", "تحديثات فورية"],
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "نخبة من المطورين والمصممين بخبرة تتجاوز 10 سنوات في المجال",
      features: ["خبراء معتمدون", "تدريب مستمر", "شهادات دولية"],
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: HeartHandshake,
      title: "دعم فني متميز",
      description: "فريق دعم متاح على مدار الساعة لمساعدتك في أي وقت",
      features: ["دعم 24/7", "استجابة سريعة", "حلول فورية"],
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: Zap,
      title: "تقنيات حديثة",
      description: "نستخدم أحدث التقنيات والأدوات لضمان أفضل النتائج",
      features: ["AI & ML", "Cloud Native", "DevOps"],
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Trophy,
      title: "سجل حافل",
      description: "أكثر من 14,000 مشروع ناجح مع معدل رضا يصل إلى 100%",
      features: ["14K+ مشروع", "100% رضا", "9K+ عميل"],
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-500/10"
    }
  ];

  return (
    <section dir="rtl" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-64 h-64 border border-primary/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-80 h-80 border border-accent/10 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div className="flex items-center justify-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-bold rounded-full border border-secondary/20">
              لماذا نحن؟
            </span>
            <Sparkles className="w-5 h-5 text-secondary" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-foreground">لماذا تختار </span>
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              ASH HOLDING
            </span>
            <span className="text-foreground">؟</span>
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            نقدم لك مزيجاً فريداً من الخبرة والابتكار والالتزام لضمان نجاح مشروعك
          </p>

          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-1 w-24 bg-gradient-to-l from-primary via-accent to-secondary mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl h-full relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute inset-0 ${reason.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 bg-gradient-to-br ${reason.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <reason.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {reason.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {reason.features.map((feature, fIndex) => (
                      <span 
                        key={fIndex}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent */}
                <motion.div 
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l ${reason.color}`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/book-consultation">
              <Button 
                size="lg"
                className="bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground font-bold px-8 py-6 rounded-xl shadow-lg shadow-primary/20"
              >
                <span>ابدأ معنا الآن</span>
                <ArrowLeft className="w-5 h-5 ms-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
