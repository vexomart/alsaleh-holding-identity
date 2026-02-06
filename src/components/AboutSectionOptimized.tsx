/**
 * Optimized About Section
 * Lightweight version with deferred animations
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Target, 
  Shield,
  Globe,
  Rocket,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useDeferredAnimation, useShouldReduceAnimations } from "@/hooks/useDeferredAnimation";

const features = [
  {
    icon: Target,
    title: "رؤية طموحة",
    description: "نسعى لأن نكون الخيار الأول في حلول التقنية والإعلام في المنطقة",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Shield,
    title: "موثوقية عالية",
    description: "نلتزم بأعلى معايير الجودة والأمان في جميع مشاريعنا",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: Rocket,
    title: "ابتكار مستمر",
    description: "نواكب أحدث التقنيات ونبتكر حلولاً متقدمة لعملائنا",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Globe,
    title: "تواجد عالمي",
    description: "نمتد بخدماتنا لتشمل عملاء من مختلف أنحاء العالم",
    color: "from-amber-500 to-orange-600"
  }
];

const AboutSectionOptimized = () => {
  const animationsReady = useDeferredAnimation({ minDelay: 100 });
  const shouldReduceAnimations = useShouldReduceAnimations();
  const enableAnimations = animationsReady && !shouldReduceAnimations;

  const MotionWrapper = enableAnimations ? motion.div : "div";

  return (
    <section dir="rtl" className="py-20 lg:py-28 relative overflow-hidden bg-background">
      {/* Static Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
              من نحن
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-foreground">شركة </span>
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              ASH HOLDING
            </span>
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            منذ 2016 ونحن نقدم حلولاً تقنية متكاملة للشركات والمؤسسات في جميع أنحاء العالم
          </p>

          <div className="h-1 w-24 bg-gradient-to-l from-primary via-accent to-secondary mx-auto mt-6 rounded-full" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-variant to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">شركة قابضة رائدة</h3>
                <p className="text-sm text-muted-foreground">في الاستثمار التقني والإعلامي</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base">
              ASH HOLDING هي شركة قابضة سعودية رائدة تأسست عام 2016، متخصصة في الاستثمار والتطوير في قطاعات التقنية والإعلام الرقمي. نسعى لتقديم حلول مبتكرة تساهم في التحول الرقمي للمؤسسات.
            </p>

            <p className="text-muted-foreground leading-relaxed text-base">
              من خلال فريق عمل متميز وشراكات استراتيجية عالمية، نقدم مجموعة شاملة من الخدمات تشمل تطوير البرمجيات، الذكاء الاصطناعي، التسويق الرقمي، والاستشارات الإدارية.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/about">
                <Button className="bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20">
                  <span>اعرف المزيد</span>
                  <ArrowLeft className="w-4 h-4 ms-2" />
                </Button>
              </Link>
              <Link to="/subsidiaries">
                <Button variant="outline" className="font-semibold px-6 py-3 rounded-xl border-2">
                  <span>شركاتنا التابعة</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <MotionWrapper
                key={index}
                {...(enableAnimations ? {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: index * 0.1 },
                  whileHover: { y: -5, scale: 1.02 }
                } : {})}
                className="group"
              >
                <div className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSectionOptimized);
