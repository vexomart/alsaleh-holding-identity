import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const mockOrders = [
  { id: 'ORD-20240101-0001', customer: 'أحمد محمد', service: 'تصميم موقع', status: 'pending', amount: '5,000', date: '2024-01-15' },
  { id: 'ORD-20240101-0002', customer: 'سارة علي', service: 'تطوير تطبيق', status: 'in_progress', amount: '15,000', date: '2024-01-14' },
  { id: 'ORD-20240101-0003', customer: 'محمد خالد', service: 'استشارة تقنية', status: 'completed', amount: '2,500', date: '2024-01-13' },
  { id: 'ORD-20240101-0004', customer: 'فاطمة أحمد', service: 'تصميم هوية', status: 'cancelled', amount: '3,000', date: '2024-01-12' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500',
  processing: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  processing: { ar: 'قيد المعالجة', en: 'Processing' },
  in_progress: { ar: 'قيد التنفيذ', en: 'In Progress' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const AdminOrders = () => {
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة الطلبات' : 'Orders Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة ومتابعة جميع الطلبات' : 'Manage and track all orders'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 me-2" />
          {isRTL ? 'طلب جديد' : 'New Order'}
        </Button>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'البحث في الطلبات...' : 'Search orders...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 me-2" />
              {isRTL ? 'تصفية' : 'Filter'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start p-4 font-medium">{isRTL ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="text-start p-4 font-medium">{isRTL ? 'العميل' : 'Customer'}</th>
                  <th className="text-start p-4 font-medium">{isRTL ? 'الخدمة' : 'Service'}</th>
                  <th className="text-start p-4 font-medium">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="text-start p-4 font-medium">{isRTL ? 'المبلغ' : 'Amount'}</th>
                  <th className="text-start p-4 font-medium">{isRTL ? 'التاريخ' : 'Date'}</th>
                  <th className="text-center p-4 font-medium">{isRTL ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border/50 hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.customer}</td>
                    <td className="p-4">{order.service}</td>
                    <td className="p-4">
                      <Badge className={statusColors[order.status]}>
                        {isRTL ? statusLabels[order.status].ar : statusLabels[order.status].en}
                      </Badge>
                    </td>
                    <td className="p-4">{order.amount} {isRTL ? 'ريال' : 'SAR'}</td>
                    <td className="p-4">{order.date}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
