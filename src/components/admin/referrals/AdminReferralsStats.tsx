/**
 * Admin Referrals Stats Cards
 */

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  UserPlus, 
  Award, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface AdminReferralsStatsProps {
  stats: {
    total: number;
    new: number;
    qualified: number;
    pendingRewards: number;
    fraudFlags: number;
  };
}

export function AdminReferralsStats({ stats }: AdminReferralsStatsProps) {
  const cards = [
    {
      title: 'إجمالي الإحالات',
      value: stats.total,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'إحالات جديدة',
      value: stats.new,
      icon: UserPlus,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'مؤهلة للمكافأة',
      value: stats.qualified,
      icon: Award,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'مكافآت معلقة',
      value: stats.pendingRewards,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'علامات احتيال',
      value: stats.fraudFlags,
      icon: AlertTriangle,
      color: stats.fraudFlags > 0 ? 'text-red-500' : 'text-muted-foreground',
      bgColor: stats.fraudFlags > 0 ? 'bg-red-500/10' : 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
