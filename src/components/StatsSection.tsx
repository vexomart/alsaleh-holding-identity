import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Building2, Calendar, Star, TrendingUp, Globe, Award } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: 1760,
      suffix: "+",
      title: "عميل راضٍ",
      subtitle: "Satisfied Clients",
      description: "عملاء راضون ومتفاعلون مع خدماتنا",
      gradient: "from-blue-600 to-blue-800",
      bgGradient: "from-blue-600/15 to-blue-800/15",
      glowColor: "shadow-blue-600/30",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      icon: Trophy,
      number: 2848,
      suffix: "+",
      title: "مشروع ناجح", 
      subtitle: "Successful Projects",
      description: "مشاريع منجزة بأعلى معايير الجودة",
      gradient: "from-emerald-600 to-emerald-800",
      bgGradient: "from-emerald-600/15 to-emerald-800/15",
      glowColor: "shadow-emerald-600/30",
      textColor: "text-emerald-700 dark:text-emerald-300"
    },
    {
      icon: Building2,
      number: 2024,
      title: "شركة قابضة",
      subtitle: "Holding Company", 
      description: "التطوير والنمو المستمر",
      gradient: "from-purple-600 to-purple-800",
      bgGradient: "from-purple-600/15 to-purple-800/15",
      glowColor: "shadow-purple-600/30",
      textColor: "text-purple-700 dark:text-purple-300"
    },
    {
      icon: Calendar,
      number: 2016,
      title: "سنة التأسيس",
      subtitle: "Foundation Year",
      description: "خبرة طويلة في السوق",
      gradient: "from-amber-600 to-amber-800", 
      bgGradient: "from-amber-600/15 to-amber-800/15",
      glowColor: "shadow-amber-600/30",
      textColor: "text-amber-700 dark:text-amber-300"
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      text: "قائد السوق العالمي",
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
      icon: Star,
      text: "معدل رضا العملاء 99.8%",
      bgColor: "bg-gradient-to-r from-emerald-600 to-emerald-800"
    },
    {
      icon: Award,
      text: "أفضل شركة قابضة 2024",
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-800"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-8 shadow-2xl animate-pulse">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 text-lg px-8 py-4 shadow-xl mb-6">
            إحصائياتنا المذهلة
          </Badge>
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 gradient-text leading-tight">
            أرقام تتحدث عن نفسها
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            نفخر بإنجازاتنا وثقة عملائنا، هذه الأرقام تعكس التزامنا بالتميز والجودة في كل ما نقدمه
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 ${stat.glowColor} shadow-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl`}></div>
              
              <CardContent className="relative p-8 text-center">
                {/* Icon with Animation */}
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transform group-hover:rotate-12 transition-all duration-500`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Animated Number with Better Contrast */}
                <div className={`text-6xl lg:text-8xl font-black mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 ${stat.textColor || 'text-foreground'}`}>
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix || ""} 
                    duration={2500}
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {stat.title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  {stat.subtitle}
                </p>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
                
                {/* Decorative Line */}
                <div className={`w-16 h-1 bg-gradient-to-r ${stat.gradient} mx-auto mt-6 rounded-full group-hover:w-24 transition-all duration-500`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap justify-center gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`inline-flex items-center gap-3 ${achievement.bgColor} text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg`}
              style={{ animationDelay: `${(index + 4) * 0.2}s` }}
            >
              <achievement.icon className="w-6 h-6" />
              {achievement.text}
              {index === 1 && <Star className="w-5 h-5 text-yellow-300" />}
              {index === 2 && <Trophy className="w-5 h-5 text-yellow-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;