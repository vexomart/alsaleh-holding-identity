/**
 * Customer Contracts List - My Contracts Module
 * RTL-first design with Arabic default
 * Updated for pre-approval flow with new statuses
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
  ThumbsUp,
  UserCheck,
  Hourglass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Updated status configuration with new statuses
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
  pre_approved_by_customer: {
    labelAr: 'موافقة مبدئية',
    labelEn: 'Pre-Approved',
    variant: 'secondary',
    icon: ThumbsUp,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  pending_admin_approval: {
    labelAr: 'بانتظار موافقة الإدارة',
    labelEn: 'Pending Admin Approval',
    variant: 'secondary',
    icon: Hourglass,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
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
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
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

  // Get appropriate action button based on status
  const getActionButton = (contract: typeof contracts[0]) => {
    const status = contract.status;

    if (status === 'pending_signature') {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate(`/app/contracts/${contract.id}`)}
          className="w-full gap-2"
        >
          <FileSignature className="h-4 w-4" />
          توقيع العقد
        </Button>
      );
    }

    if (status === 'signed') {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate(`/app/contracts/${contract.id}?download=true`)}
          className="w-full gap-2"
        >
          <Download className="h-4 w-4" />
          تحميل PDF
        </Button>
      );
    }

    if (status === 'pre_approved_by_customer' || status === 'pending_admin_approval') {
      return (
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <Hourglass className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            بانتظار مراجعة الإدارة
          </p>
        </div>
      );
    }

    return null;
  };

  // Get status description
  const getStatusDescription = (status: ContractStatus): string => {
    switch (status) {
      case 'draft':
        return 'العقد في مرحلة الإعداد';
      case 'pre_approved_by_customer':
        return 'تم تقديم الموافقة المبدئية - بانتظار مراجعة الإدارة';
      case 'pending_admin_approval':
        return 'يتم مراجعة العقد من قبل الإدارة';
      case 'pending_signature':
        return 'العقد جاهز للتوقيع الرسمي';
      case 'signed':
        return 'تم التوقيع - العقد ساري المفعول';
      case 'cancelled':
        return 'تم إلغاء العقد';
      default:
        return '';
    }
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
                      ستظهر العقود هنا عند طلب خدمة تتطلب عقدًا. يمكنك توقيع العقود وتحميلها بصيغة PDF بعد التوقيع.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/app/services')} className="mt-4">
                    تصفح الخدمات
                  </Button>
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
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
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

                            {/* Status Description */}
                            <p className="text-sm text-muted-foreground mb-4">
                              {getStatusDescription(contract.status)}
                            </p>

                            {/* Rejection Reason if cancelled */}
                            {contract.status === 'cancelled' && contract.admin_rejection_reason && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                                <p className="text-sm text-destructive">
                                  <strong>سبب الرفض:</strong> {contract.admin_rejection_reason}
                                </p>
                              </div>
                            )}

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>تاريخ الإنشاء: {formatDate(contract.created_at)}</span>
                              </div>
                              {contract.pre_approval_timestamp && (
                                <div className="flex items-center gap-1.5 text-blue-600">
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                  <span>موافقة مبدئية: {formatDate(contract.pre_approval_timestamp)}</span>
                                </div>
                              )}
                              {contract.admin_approved_at && (
                                <div className="flex items-center gap-1.5 text-green-600">
                                  <UserCheck className="h-3.5 w-3.5" />
                                  <span>موافقة الإدارة: {formatDate(contract.admin_approved_at)}</span>
                                </div>
                              )}
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
                              
                              {getActionButton(contract)}
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
