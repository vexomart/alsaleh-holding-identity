/**
 * User Stats Cards - Command Center Dark Theme
 * Premium Bloomberg-style design
 */

import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  TrendingDown, 
  Activity 
} from "lucide-react";
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
      color: "var(--cmd-accent-cyan)",
      trend: null
    },
    {
      key: "active",
      titleAr: "المستخدمين النشطين",
      titleEn: "Active Users",
      value: stats.active,
      icon: UserCheck,
      color: "var(--cmd-accent-green)",
      trend: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
      trendLabel: language === "ar" ? "من الإجمالي" : "of total"
    },
    {
      key: "inactive",
      titleAr: "المستخدمين المعطلين",
      titleEn: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      color: "var(--cmd-accent-red)",
      trend: null
    },
    {
      key: "new",
      titleAr: "مستخدمين جدد",
      titleEn: "New This Month",
      value: stats.newThisMonth,
      icon: UserPlus,
      color: "var(--cmd-accent-amber)",
      trend: stats.growthRate,
      trendLabel: language === "ar" ? "نمو" : "growth",
      showTrendIcon: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-32 rounded-xl animate-pulse"
            style={{ background: 'hsl(var(--cmd-bg-card))' }}
          />
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
            className="relative overflow-hidden rounded-xl p-5 transition-all duration-300"
            style={{
              background: 'hsl(var(--cmd-bg-card))',
              border: '1px solid hsl(var(--cmd-border-subtle))',
            }}
          >
            {/* Glow Effect */}
            <div 
              className="absolute inset-0 opacity-10 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at 30% 30%, hsl(${card.color}) 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ 
                    background: `hsl(${card.color} / 0.15)`,
                  }}
                >
                  <Icon 
                    className="h-5 w-5" 
                    style={{ color: `hsl(${card.color})` }} 
                  />
                </div>
                
                {card.trend !== null && card.trend !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    {card.showTrendIcon && (
                      card.trend >= 0 ? (
                        <TrendingUp 
                          className="h-3.5 w-3.5" 
                          style={{ color: 'hsl(var(--cmd-accent-green))' }} 
                        />
                      ) : (
                        <TrendingDown 
                          className="h-3.5 w-3.5" 
                          style={{ color: 'hsl(var(--cmd-accent-red))' }} 
                        />
                      )
                    )}
                    <span 
                      className="font-medium"
                      style={{ 
                        color: card.showTrendIcon 
                          ? card.trend >= 0 
                            ? 'hsl(var(--cmd-accent-green))' 
                            : 'hsl(var(--cmd-accent-red))'
                          : 'hsl(var(--cmd-text-muted))'
                      }}
                    >
                      {card.trend}%
                    </span>
                    {card.trendLabel && (
                      <span style={{ color: 'hsl(var(--cmd-text-dim))' }}>
                        {card.trendLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mt-auto">
                <motion.span 
                  className="text-3xl font-bold font-mono"
                  style={{ color: 'hsl(var(--cmd-text-primary))' }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {card.value.toLocaleString('en-US')}
                </motion.span>
                <p 
                  className="text-sm mt-1"
                  style={{ color: 'hsl(var(--cmd-text-muted))' }}
                >
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
                <Activity 
                  className="h-4 w-4" 
                  style={{ color: 'hsl(var(--cmd-accent-green) / 0.5)' }} 
                />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
