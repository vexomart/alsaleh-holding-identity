/**
 * ServicesStats - Modern Unified Design
 * Premium statistics display for services
 */

import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  price: number | null;
  is_active: boolean | null;
  is_visible_to_customers: boolean | null;
  category: string | null;
}

interface ServicesStatsProps {
  services: Service[];
}

export function ServicesStats({ services }: ServicesStatsProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    inactive: services.filter(s => !s.is_active).length,
    visible: services.filter(s => s.is_visible_to_customers).length,
    hidden: services.filter(s => !s.is_visible_to_customers).length,
    categories: [...new Set(services.map(s => s.category).filter(Boolean))].length,
  };

  const statCards = [
    {
      label: isRTL ? 'إجمالي الخدمات' : 'Total Services',
      value: stats.total,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: isRTL ? 'خدمات نشطة' : 'Active',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: isRTL ? 'خدمات متوقفة' : 'Inactive',
      value: stats.inactive,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: isRTL ? 'التصنيفات' : 'Categories',
      value: stats.categories,
      icon: Layers,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: isRTL ? 'مرئية للعملاء' : 'Visible',
      value: stats.visible,
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: isRTL ? 'مخفية' : 'Hidden',
      value: stats.hidden,
      icon: EyeOff,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <motion.p 
                    className="text-2xl font-bold text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
