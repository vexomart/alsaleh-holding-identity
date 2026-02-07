import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, UserX, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  growthRate?: number;
}

interface UserStatsCardsProps {
  stats: UserStats;
  language: string;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100 }
  }
};

export function UserStatsCards({ stats, language, isLoading }: UserStatsCardsProps) {
  const cards = [
    {
      key: "total",
      titleAr: "إجمالي المستخدمين",
      titleEn: "Total Users",
      value: stats.total,
      icon: Users,
      gradient: "from-primary to-primary/80",
      bgGradient: "from-primary/10 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      trend: null
    },
    {
      key: "active",
      titleAr: "المستخدمين النشطين",
      titleEn: "Active Users",
      value: stats.active,
      icon: UserCheck,
      gradient: "from-accent to-accent/80",
      bgGradient: "from-accent/10 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
      trend: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
      trendLabel: language === "ar" ? "من الإجمالي" : "of total"
    },
    {
      key: "inactive",
      titleAr: "المستخدمين المعطلين",
      titleEn: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      gradient: "from-destructive to-destructive/80",
      bgGradient: "from-destructive/10 to-destructive/5",
      iconBg: "bg-destructive/20",
      iconColor: "text-destructive",
      trend: null
    },
    {
      key: "new",
      titleAr: "مستخدمين جدد",
      titleEn: "New This Month",
      value: stats.newThisMonth,
      icon: UserPlus,
      gradient: "from-secondary to-secondary/80",
      bgGradient: "from-secondary/10 to-secondary/5",
      iconBg: "bg-secondary/20",
      iconColor: "text-secondary",
      trend: stats.growthRate,
      trendLabel: language === "ar" ? "نمو" : "growth",
      showTrendIcon: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 border border-border/50",
              "bg-gradient-to-br backdrop-blur-sm",
              card.bgGradient,
              "shadow-sm hover:shadow-lg transition-shadow duration-300"
            )}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-current" />
              <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-current" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  card.iconBg
                )}>
                  <Icon className={cn("h-5 w-5", card.iconColor)} />
                </div>
                
                {card.trend !== null && card.trend !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    {card.showTrendIcon && (
                      card.trend >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                      )
                    )}
                    <span className={cn(
                      "font-medium",
                      card.showTrendIcon 
                        ? card.trend >= 0 ? "text-emerald-600" : "text-red-600"
                        : "text-muted-foreground"
                    )}>
                      {card.trend}%
                    </span>
                    {card.trendLabel && (
                      <span className="text-muted-foreground">{card.trendLabel}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mt-auto">
                <motion.span 
                  className="text-3xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {card.value.toLocaleString('en-US')}
                </motion.span>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "ar" ? card.titleAr : card.titleEn}
                </p>
              </div>
            </div>

            {/* Animated Activity Indicator for Active Card */}
            {card.key === "active" && stats.active > 0 && (
              <motion.div 
                className="absolute bottom-3 right-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Activity className="h-4 w-4 text-emerald-500/50" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
