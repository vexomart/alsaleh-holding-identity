/**
 * Referral Stats Cards with Animated Counters
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  Wallet, 
  BadgeCheck,
  TrendingUp 
} from 'lucide-react';
import type { ReferralStats } from '@/types/referrals';
import { formatReferralCurrency } from '@/types/referrals';

interface ReferralStatsCardsProps {
  stats?: ReferralStats | null;
  isLoading?: boolean;
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
}

export function ReferralStatsCards({ stats, isLoading }: ReferralStatsCardsProps) {
  const totalReferrals = useAnimatedCounter(stats?.totalReferrals || 0);
  const activeReferrals = useAnimatedCounter(stats?.activeReferrals || 0);
  const pendingRewards = useAnimatedCounter(stats?.pendingRewards || 0);
  const paidRewards = useAnimatedCounter(stats?.paidRewards || 0);
  
  const cards = [
    {
      title: 'إجمالي الإحالات',
      value: totalReferrals,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'الإحالات النشطة',
      value: activeReferrals,
      icon: UserCheck,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'المكافآت المستحقة',
      value: formatReferralCurrency(pendingRewards),
      icon: Wallet,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      isCurrency: true,
    },
    {
      title: 'المكافآت المصروفة',
      value: formatReferralCurrency(paidRewards),
      icon: BadgeCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`} />
            
            <CardContent className="p-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {card.title}
                  </p>
                  <motion.p 
                    className="text-2xl font-bold text-foreground"
                    key={String(card.value)}
                  >
                    {card.isCurrency ? card.value : card.value}
                  </motion.p>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              
              {/* Progress indicator */}
              {!card.isCurrency && stats && stats.totalReferrals > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span>
                      معدل التحويل: {stats.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
