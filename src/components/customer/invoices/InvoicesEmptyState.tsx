/**
 * Invoices Empty/Error States
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, ShoppingBag, AlertCircle, RefreshCw, X } from 'lucide-react';

interface InvoicesEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function InvoicesEmptyState({ hasFilters, onClearFilters }: InvoicesEmptyStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const AnimationWrapper = reducedMotion ? 'div' : motion.div;
  const animation = reducedMotion ? {} : {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  };

  return (
    <AnimationWrapper {...animation}>
      <Card className="border-dashed">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">
                {hasFilters 
                  ? (isRTL ? 'لا توجد نتائج' : 'No results found')
                  : (isRTL ? 'لا توجد فواتير' : 'No invoices yet')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {hasFilters 
                  ? (isRTL 
                      ? 'جرب تغيير معايير البحث أو إزالة الفلاتر'
                      : 'Try adjusting your search criteria or clear filters')
                  : (isRTL 
                      ? 'ستظهر الفواتير هنا بعد إتمام طلباتك'
                      : 'Invoices will appear here after completing orders')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {hasFilters ? (
                <Button variant="outline" onClick={onClearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                </Button>
              ) : (
                <Button onClick={() => navigate('/app/services')} className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
}

interface InvoicesErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function InvoicesErrorState({ error, onRetry }: InvoicesErrorStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-destructive">
              {isRTL ? 'حدث خطأ' : 'Something went wrong'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>

          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
