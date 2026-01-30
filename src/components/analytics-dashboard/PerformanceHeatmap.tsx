import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

const heatmapData = [
  { day: 'Mon', hours: [45, 62, 78, 92, 85, 73, 58, 42, 35, 48, 65, 82] },
  { day: 'Tue', hours: [38, 55, 72, 88, 95, 82, 68, 52, 42, 55, 72, 88] },
  { day: 'Wed', hours: [52, 68, 85, 95, 88, 78, 62, 48, 38, 52, 68, 85] },
  { day: 'Thu', hours: [48, 65, 82, 92, 85, 75, 58, 45, 35, 48, 62, 78] },
  { day: 'Fri', hours: [42, 58, 75, 85, 78, 68, 52, 38, 28, 42, 55, 72] },
  { day: 'Sat', hours: [25, 35, 48, 58, 52, 42, 32, 22, 18, 25, 35, 45] },
  { day: 'Sun', hours: [18, 25, 35, 42, 38, 32, 25, 18, 15, 18, 25, 35] },
];

const getHeatColor = (value: number): string => {
  if (value >= 90) return 'bg-emerald-500';
  if (value >= 75) return 'bg-emerald-400';
  if (value >= 60) return 'bg-emerald-300';
  if (value >= 45) return 'bg-amber-400';
  if (value >= 30) return 'bg-amber-300';
  return 'bg-muted';
};

export const PerformanceHeatmap: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const dayLabels = isRTL 
    ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const timeLabels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            {isRTL ? 'خريطة النشاط الحرارية' : 'Activity Heatmap'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'نشاط المستخدم حسب الوقت واليوم' : 'User activity by time and day'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Time Labels */}
              <div className="flex mb-2 ps-16">
                {timeLabels.map((time, i) => (
                  <div key={i} className="flex-1 text-xs text-muted-foreground text-center">
                    {i % 2 === 0 ? time : ''}
                  </div>
                ))}
              </div>
              
              {/* Heatmap Grid */}
              <div className="space-y-1">
                {heatmapData.map((row, dayIndex) => (
                  <div key={dayIndex} className="flex items-center gap-1">
                    <div className="w-14 text-xs text-muted-foreground text-end pe-2">
                      {dayLabels[dayIndex]}
                    </div>
                    <div className="flex-1 flex gap-0.5">
                      {row.hours.map((value, hourIndex) => (
                        <motion.div
                          key={hourIndex}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (dayIndex * 12 + hourIndex) * 0.005 }}
                          className={cn(
                            "flex-1 h-7 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                            getHeatColor(value)
                          )}
                          title={`${dayLabels[dayIndex]} ${timeLabels[hourIndex]}: ${value}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'أقل' : 'Less'}
                </span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-sm bg-muted" />
                  <div className="w-4 h-4 rounded-sm bg-amber-300" />
                  <div className="w-4 h-4 rounded-sm bg-amber-400" />
                  <div className="w-4 h-4 rounded-sm bg-emerald-300" />
                  <div className="w-4 h-4 rounded-sm bg-emerald-400" />
                  <div className="w-4 h-4 rounded-sm bg-emerald-500" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'أكثر' : 'More'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
