import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const AdminReports = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'التقارير' : 'Reports'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'التقارير والإحصائيات' : 'Reports and statistics'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 me-2" />
            {isRTL ? 'تحديد الفترة' : 'Select Period'}
          </Button>
          <Button>
            <Download className="w-4 h-4 me-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: isRTL ? 'إجمالي المبيعات' : 'Total Sales', value: '245,000', icon: TrendingUp },
          { label: isRTL ? 'عدد الطلبات' : 'Total Orders', value: '456', icon: BarChart3 },
          { label: isRTL ? 'متوسط الطلب' : 'Avg. Order', value: '537', icon: TrendingUp },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value} {isRTL ? 'ريال' : 'SAR'}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{isRTL ? 'الرسم البياني سيظهر هنا' : 'Chart will appear here'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
