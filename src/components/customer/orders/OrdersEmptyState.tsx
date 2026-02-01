/**
 * OrdersEmptyState - Empty and error states for orders
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Search, 
  RefreshCw, 
  AlertCircle,
  Plus,
} from 'lucide-react';

interface OrdersEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function OrdersEmptyState({ hasFilters, onClearFilters }: OrdersEmptyStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center"
          >
            {hasFilters ? (
              <Search className="h-10 w-10 text-muted-foreground/50" />
            ) : (
              <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold mb-2">
            {hasFilters
              ? isRTL ? 'لا توجد نتائج' : 'No Results Found'
              : isRTL ? 'لا توجد طلبات' : 'No Orders Yet'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            {hasFilters
              ? isRTL 
                ? 'جرب تغيير معايير البحث أو إزالة بعض الفلاتر'
                : 'Try adjusting your search criteria or removing some filters'
              : isRTL
                ? 'لم تقم بإنشاء أي طلبات بعد. تصفح خدماتنا وابدأ الآن!'
                : "You haven't created any orders yet. Browse our services to get started!"}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {hasFilters ? (
              <Button onClick={onClearFilters} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/app/services')} className="gap-2">
                <Plus className="h-4 w-4" />
                {isRTL ? 'طلب خدمة جديدة' : 'Request a Service'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface OrdersErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function OrdersErrorState({ error, onRetry }: OrdersErrorStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <h3 className="text-lg font-semibold mb-2 text-destructive">
            {isRTL ? 'حدث خطأ' : 'Something went wrong'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {isRTL 
              ? 'تعذر تحميل الطلبات. يرجى المحاولة مرة أخرى.'
              : 'Failed to load orders. Please try again.'}
          </p>

          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
