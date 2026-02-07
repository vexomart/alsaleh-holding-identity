/**
 * Customer Contracts Hub - Premium Contracts Management
 * Full RTL/LTR support with bilingual UI
 * Updated for pre-approval flow with new statuses
 */

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useContracts, ContractStatus } from '@/hooks/useContracts';
import { AnimatedContainer, AnimatedList } from '@/components/ui/animated-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ChevronRight,
  ThumbsUp,
  UserCheck,
  Hourglass,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { type ContractData, downloadContractPdf } from '@/lib/invoices';

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
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  pending_admin_approval: {
    labelAr: 'بانتظار موافقة الإدارة',
    labelEn: 'Pending Admin Approval',
    variant: 'secondary',
    icon: Hourglass,
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
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
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-400',
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
  const isRTL = language === 'ar';
  const { contracts, isLoading, error, refetch } = useContracts();

  // RTL helpers
  const rtlRow = isRTL ? 'flex-row-reverse' : 'flex-row';
  const rtlText = isRTL ? 'text-right' : 'text-left';
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { locale: isRTL ? ar : enUS });
  };

  const handleDownloadContract = async (contract: typeof contracts[0]) => {
    console.log('[PDF] CLICK', { kind: 'contract', id: contract.id });
    const toastId = toast.loading('جاري تجهيز الملف...');
    try {
      const { data: sig } = await supabase
        .from('contract_signatures')
        .select('signer_name, signer_national_id, signer_phone')
        .eq('contract_id', contract.id)
        .maybeSingle();

      const pricing: any = (contract as any).pricing_json || {};
      const contractData: ContractData = {
        contractNumber: contract.contract_number,
        date: contract.created_at,
        serviceName: contract.service?.name_ar || contract.service?.name || 'خدمة',
        provider: {
          name: 'شركة علي صالح الشهري القابضة',
          address: 'المملكة العربية السعودية - الرياض',
          role: 'provider' as const,
        },
        customer: {
          name: sig?.signer_name || '',
          nationalId: sig?.signer_national_id || undefined,
          phone: sig?.signer_phone || undefined,
          role: 'customer' as const,
        },
        amount: pricing.subtotal || 0,
        vatRate: (pricing.vat_rate || 15) / 100,
        vatAmount: pricing.vat_amount || 0,
        totalAmount: pricing.total || 0,
        currency: pricing.currency || 'SAR',
        clauses: [
          {
            title: 'نطاق العمل',
            content: contract.service
              ? `تقديم خدمة ${contract.service.name_ar || contract.service.name} وفقاً للمواصفات المتفق عليها.`
              : 'تقديم الخدمات المتفق عليها وفقاً للمواصفات.',
          },
        ],
      };

      const success = await downloadContractPdf(contractData);
      if (!success) throw new Error('Download failed');
      toast.success(isRTL ? 'تم تنزيل الملف' : 'Downloaded', { id: toastId });
    } catch (err) {
      console.error('[Contract Download] ❌ Error:', err);
      toast.error(isRTL ? 'فشل تنزيل الملف' : 'Download failed', { id: toastId });
    }
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
          className={cn("w-full gap-2", rtlRow)}
        >
          <FileSignature className="h-4 w-4" />
          {isRTL ? 'توقيع العقد' : 'Sign Contract'}
        </Button>
      );
    }

    if (status === 'signed') {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleDownloadContract(contract)}
          className={cn("w-full gap-2", rtlRow)}
        >
          <Download className="h-4 w-4" />
          {isRTL ? 'تحميل PDF' : 'Download PDF'}
        </Button>
      );
    }

    if (status === 'pre_approved_by_customer' || status === 'pending_admin_approval') {
      return (
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <Hourglass className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {isRTL ? 'بانتظار مراجعة الإدارة' : 'Awaiting Admin Review'}
          </p>
        </div>
      );
    }

    return null;
  };

  // Get status description
  const getStatusDescription = (status: ContractStatus): string => {
    const descriptions: Record<ContractStatus, { ar: string; en: string }> = {
      draft: { ar: 'العقد في مرحلة الإعداد', en: 'Contract is being prepared' },
      pre_approved_by_customer: { ar: 'تم تقديم الموافقة المبدئية - بانتظار مراجعة الإدارة', en: 'Pre-approval submitted - awaiting admin review' },
      pending_admin_approval: { ar: 'يتم مراجعة العقد من قبل الإدارة', en: 'Contract under admin review' },
      pending_signature: { ar: 'العقد جاهز للتوقيع الرسمي', en: 'Contract ready for official signature' },
      signed: { ar: 'تم التوقيع - العقد ساري المفعول', en: 'Signed - Contract in effect' },
      cancelled: { ar: 'تم إلغاء العقد', en: 'Contract cancelled' },
    };
    return isRTL ? descriptions[status]?.ar || '' : descriptions[status]?.en || '';
  };

  if (isLoading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={cn("flex items-center gap-4", rtlRow)}>
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
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="border-destructive/50">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <p className="font-bold text-lg text-destructive">
                  {isRTL ? 'خطأ في تحميل العقود' : 'Error Loading Contracts'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => refetch?.()}
                className="mt-2 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isRTL ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={cn("min-h-full", rtlText)}>
      <AnimatedContainer direction="fade">
        <div className="space-y-8">
          {/* Page Header */}
          <div className={cn("flex items-center gap-4", rtlRow)}>
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              <FileSignature className="h-7 w-7 text-primary" />
            </div>
            <div className={rtlText}>
              <h1 className="text-2xl font-bold tracking-tight">
                {isRTL ? 'عقودي' : 'My Contracts'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRTL ? 'عرض وإدارة العقود الخاصة بك' : 'View and manage your contracts'}
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
                      {isRTL ? 'لا توجد عقود' : 'No Contracts'}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {isRTL 
                        ? 'ستظهر العقود هنا عند طلب خدمة تتطلب عقدًا. يمكنك توقيع العقود وتحميلها بصيغة PDF بعد التوقيع.'
                        : 'Contracts will appear here when you request a service that requires one. You can sign and download PDF after signing.'
                      }
                    </p>
                  </div>
                  <Button onClick={() => navigate('/dashboard/services')} className="mt-4">
                    {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
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
                            <div className={cn("flex items-center gap-3 mb-4 flex-wrap", rtlRow)}>
                              <Badge 
                                variant={status.variant} 
                                className={cn(
                                  "gap-1.5 px-3 py-1 font-medium",
                                  status.bgColor,
                                  status.textColor,
                                  rtlRow
                                )}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {isRTL ? status.labelAr : status.labelEn}
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
                                ? (isRTL ? contract.service.name_ar || contract.service.name : contract.service.name)
                                : (isRTL ? 'عقد تقديم خدمات' : 'Service Contract')}
                            </h3>

                            {/* Status Description */}
                            <p className="text-sm text-muted-foreground mb-4">
                              {getStatusDescription(contract.status)}
                            </p>

                            {/* Rejection Reason if cancelled */}
                            {contract.status === 'cancelled' && contract.admin_rejection_reason && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                                <p className="text-sm text-destructive">
                                  <strong>{isRTL ? 'سبب الرفض:' : 'Rejection Reason:'}</strong> {contract.admin_rejection_reason}
                                </p>
                              </div>
                            )}

                            {/* Meta Info Row */}
                            <div className={cn("flex flex-wrap items-center gap-4 text-xs text-muted-foreground", rtlRow)}>
                              <div className={cn("flex items-center gap-1.5", rtlRow)}>
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{isRTL ? 'تاريخ الإنشاء:' : 'Created:'} {formatDate(contract.created_at)}</span>
                              </div>
                              {contract.pre_approval_timestamp && (
                                <div className={cn("flex items-center gap-1.5 text-blue-600", rtlRow)}>
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                  <span>{isRTL ? 'موافقة مبدئية:' : 'Pre-approved:'} {formatDate(contract.pre_approval_timestamp)}</span>
                                </div>
                              )}
                              {contract.admin_approved_at && (
                                <div className={cn("flex items-center gap-1.5 text-emerald-600", rtlRow)}>
                                  <UserCheck className="h-3.5 w-3.5" />
                                  <span>{isRTL ? 'موافقة الإدارة:' : 'Admin approved:'} {formatDate(contract.admin_approved_at)}</span>
                                </div>
                              )}
                              {contract.signed_at && (
                                <div className={cn("flex items-center gap-1.5 text-primary", rtlRow)}>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{isRTL ? 'تم التوقيع:' : 'Signed:'} {formatDate(contract.signed_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price & Actions Panel */}
                          <div className={cn(
                            "lg:w-64 bg-muted/30 p-5 lg:p-6 flex flex-col justify-between gap-4 border-t lg:border-t-0",
                            isRTL ? "lg:border-e" : "lg:border-s"
                          )}>
                            {/* Price */}
                            <div className={rtlText}>
                              <p className="text-2xl lg:text-3xl font-bold text-primary font-mono" dir="ltr">
                                {formatCurrency(
                                  contract.pricing_json?.total || 0,
                                  contract.pricing_json?.currency || 'SAR'
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {isRTL ? 'شامل ضريبة القيمة المضافة' : 'Including VAT'}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/app/contracts/${contract.id}`)}
                                className={cn("w-full justify-between group/btn", rtlRow)}
                              >
                                <span className={cn("flex items-center gap-2", rtlRow)}>
                                  <Eye className="h-4 w-4" />
                                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                                </span>
                                <ArrowIcon className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-1" />
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
