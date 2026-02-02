/**
 * ContractDetailsDrawer - Premium side panel for contract details
 * RTL-first with timeline, copy button, and guaranteed PDF download
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  Download, 
  FileSignature,
  Calendar,
  Building2,
  User,
  Clock,
  CheckCircle2,
  ThumbsUp,
  UserCheck,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { CustomerContract, CONTRACT_STATUS_CONFIG } from './types';
import { ContractStatusBadge } from './ContractStatusBadge';
import { type ContractData, downloadContractPdf } from '@/lib/pdf2';

interface ContractDetailsDrawerProps {
  contract: CustomerContract | null;
  open: boolean;
  onClose: () => void;
}

interface ContractSignature {
  id: string;
  signer_name: string;
  signer_national_id: string | null;
  signer_phone: string | null;
  created_at: string;
}

export function ContractDetailsDrawer({ 
  contract, 
  open, 
  onClose 
}: ContractDetailsDrawerProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  
  const [signature, setSignature] = useState<ContractSignature | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch signature details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!contract?.id || contract.status !== 'signed') {
        setSignature(null);
        return;
      }

      setIsLoadingDetails(true);
      try {
        const { data } = await supabase
          .from('contract_signatures')
          .select('id, signer_name, signer_national_id, signer_phone, created_at')
          .eq('contract_id', contract.id)
          .maybeSingle();

        if (data) {
          setSignature(data);
        }
      } catch (err) {
        console.error('Error fetching signature:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (open) {
      fetchDetails();
    }
  }, [contract?.id, contract?.status, open]);

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency || 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleCopyContractNumber = async () => {
    if (!contract?.contract_number) return;
    try {
      await navigator.clipboard.writeText(contract.contract_number);
      setCopied(true);
      toast.success(isRTL ? 'تم نسخ رقم العقد' : 'Contract number copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(isRTL ? 'فشل النسخ' : 'Copy failed');
    }
  };

  const handleDownloadPdf = async () => {
    if (!contract || contract.status !== 'signed') return;

    console.log('[PDF] CLICK', { kind: 'contract', id: contract.id });
    const toastId = toast.loading(isRTL ? 'جاري تجهيز الملف...' : 'Preparing file...');

    setIsGeneratingPdf(true);
    try {
      const contractData: ContractData = {
        contractNumber: contract.contract_number,
        date: contract.created_at,
        serviceName: contract.service?.name_ar || contract.service?.name || 'خدمة',
        provider: { name: 'شركة علي صالح الشهري القابضة', address: 'المملكة العربية السعودية - الرياض', role: 'provider' as const },
        customer: { name: signature?.signer_name || '', nationalId: signature?.signer_national_id || undefined, phone: signature?.signer_phone || undefined, role: 'customer' as const },
        amount: contract.pricing_json?.subtotal || 0,
        vatRate: (contract.pricing_json?.vat_rate || 15) / 100,
        vatAmount: contract.pricing_json?.vat_amount || 0,
        totalAmount: contract.pricing_json?.total || 0,
        currency: contract.pricing_json?.currency || 'SAR',
        clauses: [
          { title: 'نطاق العمل', content: contract.service ? `تقديم خدمة ${contract.service.name_ar || contract.service.name} وفقاً للمواصفات المتفق عليها.` : 'تقديم الخدمات المتفق عليها وفقاً للمواصفات.' },
          { title: 'المقابل المالي', content: `يلتزم الطرف الثاني بدفع مبلغ ${formatCurrency(contract.pricing_json?.total || 0, contract.pricing_json?.currency || 'SAR')} شاملاً ضريبة القيمة المضافة.` },
          { title: 'الالتزامات', content: 'يلتزم الطرف الأول بتقديم الخدمة وفق أعلى معايير الجودة.' },
          { title: 'السرية', content: 'يتعهد الطرفان بالحفاظ على سرية المعلومات المتبادلة.' },
        ],
      };

      const success = await downloadContractPdf(contractData);
      if (!success) throw new Error('Download failed');
      toast.success(isRTL ? 'تم تنزيل الملف' : 'Downloaded', { id: toastId });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error(isRTL ? 'فشل تنزيل الملف' : 'Download failed', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Build timeline events
  const buildTimeline = () => {
    if (!contract) return [];
    
    const events = [];
    
    // Created
    events.push({
      icon: Clock,
      labelAr: 'تم إنشاء العقد',
      labelEn: 'Contract Created',
      date: contract.created_at,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
    });
    
    // Pre-approval
    if (contract.pre_approval_timestamp) {
      events.push({
        icon: ThumbsUp,
        labelAr: 'موافقة مبدئية من العميل',
        labelEn: 'Customer Pre-approval',
        date: contract.pre_approval_timestamp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      });
    }
    
    // Admin approval
    if (contract.admin_approved_at) {
      events.push({
        icon: UserCheck,
        labelAr: 'موافقة الإدارة',
        labelEn: 'Admin Approval',
        date: contract.admin_approved_at,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
      });
    }
    
    // Signed
    if (contract.signed_at) {
      events.push({
        icon: CheckCircle2,
        labelAr: 'تم التوقيع',
        labelEn: 'Contract Signed',
        date: contract.signed_at,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      });
    }
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const timeline = buildTimeline();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side={isRTL ? 'left' : 'right'} 
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {contract && (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <SheetHeader className={cn("text-start", isRTL && "text-right")}>
                <div className="flex items-center gap-3 mb-2">
                  <ContractStatusBadge status={contract.status} size="md" />
                </div>
                <SheetTitle className="text-xl">
                  {contract.service
                    ? (isRTL 
                        ? (contract.service.name_ar || contract.service.name)
                        : contract.service.name)
                    : (isRTL ? 'عقد تقديم خدمات' : 'Service Contract')}
                </SheetTitle>
                
                {/* Contract Number with Copy */}
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <span 
                    dir="ltr" 
                    className="text-sm text-muted-foreground font-mono tabular-nums"
                  >
                    {contract.contract_number}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopyContractNumber}
                  >
                  {copied ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </SheetHeader>

              {/* Pricing Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'إجمالي العقد' : 'Contract Total'}
                </p>
                <p dir="ltr" className="text-2xl font-bold text-primary tabular-nums">
                  {formatCurrency(contract.pricing_json?.total || null, contract.pricing_json?.currency || 'SAR')}
                </p>
                <div className={cn("flex items-center gap-4 mt-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
                  <span>{isRTL ? 'شامل ضريبة القيمة المضافة' : 'Including VAT'}</span>
                  {contract.pricing_json?.vat_amount && (
                    <span dir="ltr" className="font-mono tabular-nums">
                      ({formatCurrency(contract.pricing_json.vat_amount, contract.pricing_json.currency)} VAT)
                    </span>
                  )}
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-3">
                {/* Order Reference */}
                {contract.order && (
                  <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                    <div className="p-2 rounded-lg bg-muted">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className={cn(isRTL ? "text-right" : "text-start")}>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'الطلب المرتبط' : 'Related Order'}
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/app/orders/${contract.order!.id}`);
                        }}
                        className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span dir="ltr" className="font-mono tabular-nums">
                          {contract.order.order_number}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* First Party */}
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-start")}>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'الطرف الأول' : 'First Party'}
                    </p>
                    <p className="font-medium">شركة علي صالح الشهري القابضة</p>
                  </div>
                </div>

                {/* Second Party */}
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="p-2 rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-start")}>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'الطرف الثاني' : 'Second Party'}
                    </p>
                    <p className="font-medium">
                      {signature?.signer_name || (isRTL ? 'أنت' : 'You')}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-start")}>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'تاريخ الإنشاء' : 'Created Date'}
                    </p>
                    <p className="font-medium">{formatDate(contract.created_at)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              {timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className={cn("font-semibold text-sm", isRTL && "text-right")}>
                    {isRTL ? 'سجل الأحداث' : 'Timeline'}
                  </h4>
                  <div className="space-y-3">
                    {timeline.slice(0, 5).map((event, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}
                      >
                        <div className={cn("p-1.5 rounded-full", event.bgColor, event.color)}>
                          <event.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className={cn("flex-1", isRTL ? "text-right" : "text-start")}>
                          <p className="text-sm font-medium">
                            {isRTL ? event.labelAr : event.labelEn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(event.date)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  className="w-full gap-2" 
                  onClick={() => {
                    onClose();
                    navigate(`/app/contracts/${contract.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  {isRTL ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                </Button>
                
                {contract.status === 'pending_signature' && (
                  <Button 
                    variant="default"
                    className="w-full gap-2" 
                    onClick={() => {
                      onClose();
                      navigate(`/app/contracts/${contract.id}`);
                    }}
                  >
                    <FileSignature className="h-4 w-4" />
                    {isRTL ? 'توقيع العقد الآن' : 'Sign Contract Now'}
                  </Button>
                )}
                
                {contract.status === 'signed' && (
                  <Button 
                    variant="outline"
                    className="w-full gap-2" 
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                  >
                    {isGeneratingPdf ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {isRTL ? 'تحميل العقد PDF' : 'Download PDF'}
                  </Button>
                )}

                {contract.order && (
                  <Button 
                    variant="ghost"
                    className="w-full gap-2" 
                    onClick={() => {
                      onClose();
                      navigate(`/app/orders/${contract.order!.id}`);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isRTL ? 'عرض الطلب المرتبط' : 'View Related Order'}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoadingDetails && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
