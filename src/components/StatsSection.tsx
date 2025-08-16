import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Building2, Calendar, Star, TrendingUp, Globe, Award, Sparkles, Zap, Target, CheckCircle } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { useEffect, useRef, useState } from "react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Users,
      number: 1760,
      suffix: "+",
      title: "عميل راضٍ",
      subtitle: "Satisfied Clients",
      description: "عملاء راضون ومتفاعلون مع خدماتنا المميزة",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bgGradient: "from-blue-500/10 via-blue-600/10 to-blue-700/10",
      glowColor: "shadow-blue-500/40",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      icon: Trophy,
      number: 2848,
      suffix: "+",
      title: "مشروع ناجح", 
      subtitle: "Successful Projects",
      description: "مشاريع منجزة بأعلى معايير الجودة العالمية",
      gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
      bgGradient: "from-emerald-500/10 via-emerald-600/10 to-emerald-700/10",
      glowColor: "shadow-emerald-500/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    {
      icon: Building2,
      number: 2024,
      title: "شركة قابضة",
      subtitle: "Holding Company", 
      description: "رؤية مستقبلية للنمو والتطوير المستدام",
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      bgGradient: "from-purple-500/10 via-purple-600/10 to-purple-700/10",
      glowColor: "shadow-purple-500/40",
      textColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      icon: Calendar,
      number: 2016,
      title: "سنة التأسيس",
      subtitle: "Foundation Year",
      description: "خبرة عريقة في تقديم الحلول المبتكرة",
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      bgGradient: "from-amber-500/10 via-amber-600/10 to-amber-700/10",
      glowColor: "shadow-amber-500/40",
      textColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      borderColor: "border-amber-200 dark:border-amber-800"
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      text: "قائد السوق العالمي",
      bgColor: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
      shadowColor: "shadow-blue-500/30"
    },
    {
      icon: CheckCircle,
      text: "معدل رضا العملاء 100%",
      bgColor: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700",
      shadowColor: "shadow-emerald-500/30"
    },
    {
      icon: Award,
      text: "أفضل شركة قابضة 2024",
      bgColor: "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700",
      shadowColor: "shadow-purple-500/30"
    },
    {
      icon: Target,
      text: "التميز في الابتكار",
      bgColor: "bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700",
      shadowColor: "shadow-rose-500/30"
    }
  ];

  const floatingElements = [
    { icon: Sparkles, position: "top-20 left-20", delay: "0s", color: "text-blue-400" },
    { icon: Zap, position: "top-32 right-32", delay: "1s", color: "text-emerald-400" },
    { icon: Star, position: "bottom-40 left-40", delay: "2s", color: "text-purple-400" },
    { icon: Globe, position: "bottom-32 right-20", delay: "3s", color: "text-amber-400" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/50 to-purple-50/60 dark:from-slate-900/80 dark:via-slate-800/50 dark:to-slate-900/60"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-tl from-emerald-400/15 via-blue-400/20 to-purple-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
        
        {/* Floating icons */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} w-8 h-8 ${element.color} opacity-30 animate-bounce`}
            style={{ animationDelay: element.delay, animationDuration: '3s' }}
          >
            <element.icon className="w-full h-full" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl mb-10 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'animate-bounce scale-100' : 'scale-0'}`}>
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Badge className="bg-gradient-to-r from-primary via-secondary to-accent text-white border-0 text-xl px-10 py-5 shadow-2xl mb-8 hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                إحصائياتنا المذهلة
              </Badge>
            </div>
            
            <h2 className={`text-6xl lg:text-8xl font-black mb-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              أرقام تتحدث عن نفسها
            </h2>
            
            <p className={`text-2xl lg:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              نفخر بإنجازاتنا وثقة عملائنا، هذه الأرقام تعكس التزامنا بالتميز والجودة في كل ما نقدمه من حلول مبتكرة
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className={`group relative overflow-hidden border-2 ${stat.borderColor} bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 transform ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ 
                  animationDelay: `${index * 0.2 + 1}s`,
                  borderRadius: '24px'
                }}
              >
                {/* Animated Background Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                {/* Enhanced Glow Effect */}
                <div className={`absolute -inset-2 ${stat.glowColor} shadow-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 blur-xl rounded-3xl`}></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-full opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tl from-white/10 to-white/5 rounded-full opacity-30"></div>
                
                <CardContent className="relative p-10 text-center">
                  {/* Enhanced Icon with Multiple Layers */}
                  <div className="relative mb-8">
                    <div className={`absolute inset-0 ${stat.iconBg} rounded-3xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                    <div className={`relative inline-flex items-center justify-center w-24 h-24 ${stat.iconBg} rounded-3xl shadow-xl group-hover:shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                      <stat.icon className="w-12 h-12 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-3xl"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Number Display */}
                  <div className={`text-7xl lg:text-8xl font-black mb-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ${stat.textColor}`}>
                    {isVisible && (
                      <AnimatedCounter 
                        end={stat.number} 
                        suffix={stat.suffix || ""} 
                        duration={3000}
                      />
                    )}
                  </div>
                  
                  {/* Enhanced Title */}
                  <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {stat.title}
                  </h3>
                  
                  {/* Enhanced Subtitle */}
                  <p className="text-base font-bold text-muted-foreground mb-4 uppercase tracking-widest">
                    {stat.subtitle}
                  </p>
                  
                  {/* Enhanced Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    {stat.description}
                  </p>
                  
                  {/* Enhanced Decorative Line */}
                  <div className={`w-20 h-1.5 bg-gradient-to-r ${stat.gradient} mx-auto mt-8 rounded-full group-hover:w-32 group-hover:h-2 transition-all duration-500 shadow-lg`}></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`group inline-flex items-center gap-4 ${achievement.bgColor} text-white px-10 py-6 rounded-full ${achievement.shadowColor} shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 font-bold text-xl border border-white/20 backdrop-blur-sm ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-0'}`}
                style={{ animationDelay: `${(index + 4) * 0.3 + 1.5}s` }}
              >
                <div className="relative">
                  <achievement.icon className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                </div>
                <span className="font-black tracking-wide">{achievement.text}</span>
                {index === 1 && <Star className="w-6 h-6 text-yellow-300 animate-pulse" />}
                {index === 2 && <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />}
                {index === 3 && <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />}
              </div>
            ))}
          </div>

          {/* Additional Visual Enhancement */}
          <div className="mt-16 text-center">
            <div className={`inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-4 rounded-full border border-primary/20 backdrop-blur-sm transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Globe className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-lg font-semibold text-primary">مُعتمدون عالمياً في أكثر من 50 دولة</span>
              <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;