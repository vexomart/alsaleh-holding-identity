/**
 * ContractsEmptyState - Empty and error states
 * RTL-first with clean design
 */

import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, AlertCircle, RefreshCw, X, ShoppingBag } from 'lucide-react';

interface ContractsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function ContractsEmptyState({ hasFilters, onClearFilters }: ContractsEmptyStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 rounded-full bg-muted">
              <FileSignature className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-lg">
                {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
                {isRTL 
                  ? 'لا توجد عقود مطابقة للفلاتر المحددة. حاول تغيير معايير البحث.'
                  : 'No contracts match your selected filters. Try adjusting your search criteria.'}
              </p>
            </div>
            <Button variant="outline" onClick={onClearFilters} className="gap-2 mt-2">
              <X className="h-4 w-4" />
              {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="py-16">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="p-5 rounded-full bg-primary/10">
            <FileSignature className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="font-bold text-xl">
              {isRTL ? 'لا توجد عقود' : 'No Contracts'}
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isRTL 
                ? 'ستظهر العقود هنا عند طلب خدمة تتطلب عقدًا. يمكنك توقيع العقود وتحميلها بصيغة PDF بعد التوقيع.'
                : 'Contracts will appear here when you request a service that requires one. You can sign and download PDF after signing.'}
            </p>
          </div>
          <Button onClick={() => navigate('/app/services')} className="mt-4 gap-2">
            <ShoppingBag className="h-4 w-4" />
            {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ContractsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ContractsErrorState({ error, onRetry }: ContractsErrorStateProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Card className="border-destructive/50">
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg text-destructive">
              {isRTL ? 'خطأ في تحميل العقود' : 'Error Loading Contracts'}
            </p>
            <p className="text-sm text-muted-foreground">
              {error.message || (isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}
            </p>
          </div>
          <Button variant="outline" onClick={onRetry} className="gap-2 mt-2">
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'إعادة المحاولة' : 'Retry'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
