/**
 * NotificationStats Component
 * Statistics cards with animations
 */

import { motion } from 'framer-motion';
import { Bell, Mail, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NotificationStatsProps {
  total: number;
  unread: number;
  info: number;
  warning: number;
  critical: number;
  language: 'ar' | 'en';
}

export function NotificationStats({ total, unread, info, warning, critical, language }: NotificationStatsProps) {
  const stats = [
    { 
      label: language === 'ar' ? 'الإجمالي' : 'Total', 
      value: total, 
      icon: Bell, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    { 
      label: language === 'ar' ? 'غير مقروء' : 'Unread', 
      value: unread, 
      icon: Mail, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    { 
      label: language === 'ar' ? 'معلومات' : 'Info', 
      value: info, 
      icon: Info, 
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    { 
      label: language === 'ar' ? 'تحذيرات' : 'Warnings', 
      value: warning, 
      icon: AlertTriangle, 
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    },
    { 
      label: language === 'ar' ? 'حرج' : 'Critical', 
      value: critical, 
      icon: AlertCircle, 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={cn(
            "border shadow-sm hover:shadow-md transition-shadow",
            stat.borderColor
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <motion.span 
                  className="text-2xl font-bold"
                  key={stat.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
