/**
 * Account Activity Log Component
 */

import { motion } from 'framer-motion';
import { useAccountActivity, getActivityLabel, getActivityIcon } from '@/hooks/useAccountActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Activity, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const riskColors: Record<string, string> = {
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-600 border-red-500/20'
};

const riskLabels: Record<string, string> = {
  low: 'منخفض',
  medium: 'متوسط',
  high: 'عالي'
};

export const AccountActivityLog = () => {
  const { activities, isLoading } = useAccountActivity(100);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy - HH:mm', { locale: ar });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          سجل النشاط
        </CardTitle>
        <CardDescription>
          جميع الأنشطة المتعلقة بحسابك
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا يوجد نشاط مسجل</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pl-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute right-5 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4"
                  >
                    {/* Timeline dot */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-lg",
                      activity.risk_level === 'high' 
                        ? "bg-red-500/20" 
                        : activity.risk_level === 'medium'
                        ? "bg-yellow-500/20"
                        : "bg-primary/10"
                    )}>
                      {getActivityIcon(activity.activity_type)}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "flex-1 p-4 rounded-xl border transition-colors",
                      "bg-card hover:bg-muted/50"
                    )}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {getActivityLabel(activity.activity_type)}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(activity.created_at)}</span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(riskColors[activity.risk_level])}
                        >
                          {activity.risk_level === 'high' && (
                            <AlertTriangle className="h-3 w-3 ml-1" />
                          )}
                          {riskLabels[activity.risk_level]}
                        </Badge>
                      </div>

                      {activity.metadata && typeof activity.metadata === 'object' && Object.keys(activity.metadata as object).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(activity.metadata as Record<string, unknown>).map(([key, value]) => (
                              <div key={key} className="text-muted-foreground">
                                <span className="font-medium">{key}: </span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activity.ip_address && (
                        <p className="text-xs text-muted-foreground mt-2">
                          IP: {String(activity.ip_address)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
