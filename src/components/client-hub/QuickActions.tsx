/**
 * Quick Actions
 * Primary CTA buttons for client actions
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Receipt, 
  FileSignature,
  MessageSquare,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-service',
      icon: Plus,
      label: isRTL ? 'طلب خدمة جديدة' : 'Request New Service',
      onClick: () => navigate('/dashboard/services'),
      primary: true,
    },
    {
      id: 'invoices',
      icon: Receipt,
      label: isRTL ? 'عرض الفواتير' : 'View Invoices',
      onClick: () => navigate('/dashboard/invoices'),
    },
    {
      id: 'contracts',
      icon: FileSignature,
      label: isRTL ? 'عرض العقود' : 'View Contracts',
      onClick: () => navigate('/dashboard/contracts'),
    },
    {
      id: 'support',
      icon: MessageSquare,
      label: isRTL ? 'الدعم الفني' : 'Contact Support',
      onClick: () => navigate('/dashboard/support'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className={cn('space-y-4', className)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-slate-900 dark:bg-slate-400 rounded-full" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}
        </h2>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 + index * 0.05 }}
            >
              <Button
                variant={action.primary ? 'default' : 'outline'}
                className={cn(
                  'w-full h-auto flex-col gap-2 py-4',
                  action.primary && 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
                )}
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
