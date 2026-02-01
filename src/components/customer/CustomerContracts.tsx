/**
 * Customer Contracts List - My Contracts Module
 * RTL-first design with Arabic default
 * Full RTL enforcement using document flow
 */

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useContracts, ContractStatus } from '@/hooks/useContracts';
import { AnimatedContainer, AnimatedList } from '@/components/ui/animated-container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Eye, 
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSignature,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Status configuration
const statusConfig: Record<ContractStatus, {
  labelAr: string;
  labelEn: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    variant: 'secondary',
    icon: FileText,
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Pending Signature',
    variant: 'default',
    icon: Clock,
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    variant: 'outline',
    icon: CheckCircle2,
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    variant: 'destructive',
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    textColor: 'text-destructive',
  },
};

export function CustomerContracts() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { contracts, isLoading, error } = useContracts();

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl">
        <Card className="border-destructive/50">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <p className="font-bold text-lg text-destructive">
                  خطأ في تحميل العقود
                </p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-full">
      <AnimatedContainer direction="fade">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              <FileSignature className="h-7 w-7 text-primary" />
            </div>
            <div className="text-start">
              <h1 className="text-2xl font-bold tracking-tight">
                عقودي
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                عرض وإدارة العقود الخاصة بك
              </p>
            </div>
          </div>

          {/* Empty State */}
          {contracts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16">
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="p-5 rounded-full bg-muted">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl">
                      لا توجد عقود
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      ستظهر العقود هنا عند إنشائها من قبل الإدارة. يمكنك توقيع العقود وتحميلها بصيغة PDF بعد التوقيع.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Contracts List */
            <AnimatedList staggerDelay={0.05}>
              <div className="space-y-4">
                {contracts.map((contract) => {
                  const status = statusConfig[contract.status];
                  const StatusIcon = status.icon;

                  return (
                    <Card 
                      key={contract.id}
                      className="group transition-all duration-200 hover:shadow-lg hover:border-primary/30 overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Main Content */}
                          <div className="flex-1 p-5 lg:p-6">
                            {/* Status & Contract Number Row */}
                            <div className="flex items-center gap-3 mb-4">
                              <Badge 
                                variant={status.variant} 
                                className={cn(
                                  "gap-1.5 px-3 py-1 font-medium",
                                  status.bgColor,
                                  status.textColor
                                )}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.labelAr}
                              </Badge>
                              <span 
                                className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded"
                                dir="ltr"
                              >
                                {contract.contract_number}
                              </span>
                            </div>

                            {/* Service Title */}
                            <h3 className="font-bold text-lg mb-2 line-clamp-1">
                              {contract.service 
                                ? (contract.service.name_ar || contract.service.name)
                                : 'عقد تقديم خدمات'}
                            </h3>

                            {/* Scope Summary */}
                            {contract.scope_summary_ar && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {contract.scope_summary_ar}
                              </p>
                            )}

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>تاريخ الإنشاء: {formatDate(contract.created_at)}</span>
                              </div>
                              {contract.signed_at && (
                                <div className="flex items-center gap-1.5 text-primary">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>تم التوقيع: {formatDate(contract.signed_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price & Actions Panel */}
                          <div className="lg:w-64 bg-muted/30 p-5 lg:p-6 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-s">
                            {/* Price */}
                            <div className="text-start">
                              <p className="text-2xl lg:text-3xl font-bold text-primary" dir="ltr">
                                {formatCurrency(
                                  contract.pricing_json?.total || 0,
                                  contract.pricing_json?.currency || 'SAR'
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                شامل ضريبة القيمة المضافة
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/app/contracts/${contract.id}`)}
                                className="w-full justify-between group/btn"
                              >
                                <span className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  عرض التفاصيل
                                </span>
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1 rtl:rotate-180 rtl:group-hover/btn:translate-x-1" />
                              </Button>
                              
                              {contract.status === 'signed' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate(`/app/contracts/${contract.id}?download=true`)}
                                  className="w-full gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  تحميل PDF
                                </Button>
                              )}

                              {contract.status === 'pending_signature' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate(`/app/contracts/${contract.id}`)}
                                  className="w-full gap-2"
                                >
                                  <FileSignature className="h-4 w-4" />
                                  توقيع العقد
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </AnimatedList>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
