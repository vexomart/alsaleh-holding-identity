/**
 * Customer Contract Details Page
 * Full RTL support with signing capability
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useContract, ContractStatus } from '@/hooks/useContracts';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowRight,
  FileText, 
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  User,
  FileSignature,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { type ContractData, downloadContractPdf } from '@/lib/invoices';

import { ThumbsUp, Hourglass } from 'lucide-react';

// Status configuration - includes all pre-approval states
const statusConfig: Record<ContractStatus, {
  labelAr: string;
  labelEn: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ElementType;
  color: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    variant: 'secondary',
    icon: FileText,
    color: 'text-muted-foreground',
  },
  pre_approved_by_customer: {
    labelAr: 'موافقة مبدئية',
    labelEn: 'Pre-Approved',
    variant: 'secondary',
    icon: ThumbsUp,
    color: 'text-blue-600',
  },
  pending_admin_approval: {
    labelAr: 'بانتظار موافقة الإدارة',
    labelEn: 'Pending Admin Approval',
    variant: 'secondary',
    icon: Hourglass,
    color: 'text-amber-600',
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Pending Signature',
    variant: 'default',
    icon: Clock,
    color: 'text-primary',
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    variant: 'outline',
    icon: CheckCircle2,
    color: 'text-primary',
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    variant: 'destructive',
    icon: XCircle,
    color: 'text-destructive',
  },
};

export function CustomerContractDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { contract, signature, contractFile, isLoading, error, signContract } = useContract(id);

  // Signing dialog state
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // PDF generation state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isRTL = language === 'ar';

  // Handle download param
  useEffect(() => {
    if (searchParams.get('download') === 'true' && contract?.status === 'signed') {
      handleDownloadPdf();
    }
  }, [searchParams, contract?.status]);

  // Pre-fill signer name
  useEffect(() => {
    if (profile?.full_name) {
      setSignerName(profile.full_name);
    }
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  const handleSign = async () => {
    if (!hasAgreed) {
      toast.error('يرجى الموافقة على الشروط أولاً');
      return;
    }
    if (!signerName.trim()) {
      toast.error('يرجى إدخال اسم الموقع');
      return;
    }

    setIsSigning(true);
    const success = await signContract(signerName, nationalId, phone);
    setIsSigning(false);

    if (success) {
      setIsSignDialogOpen(false);
      // Generate PDF after signing
      setTimeout(() => handleDownloadPdf(), 1000);
    }
  };

  const handleDownloadPdf = async () => {
    if (!contract) {
      toast.error('لا يوجد عقد');
      return;
    }

    console.log('[PDF] CLICK', { kind: 'contract', id: contract.id });
    const toastId = toast.loading('جاري تجهيز الملف...');

    setIsGeneratingPdf(true);

    try {
      // Build contract data for PDF
      const contractData: ContractData = {
        contractNumber: contract.contract_number,
        date: contract.created_at,
        serviceName: contract.service?.name_ar || contract.service?.name || 'خدمة',
        serviceNameAr: contract.service?.name_ar || undefined,
        serviceDescription: contract.scope_summary_ar || contract.scope_summary || undefined,
        scopeSummary: contract.scope_summary || undefined,
        scopeSummaryAr: contract.scope_summary_ar || undefined,
        
        provider: {
          name: 'شركة علي صالح الشهري القابضة',
          address: 'المملكة العربية السعودية - الرياض',
          phone: '+966 11 123 4567',
          role: 'provider' as const,
        },
        
        customer: {
          name: signature?.signer_name || profile?.full_name || '',
          nationalId: signature?.signer_national_id || undefined,
          phone: signature?.signer_phone || profile?.phone || undefined,
          role: 'customer' as const,
        },
        
        // Pricing in the format expected by the template
        pricing: {
          subtotal: contract.pricing_json?.subtotal || 0,
          vatRate: (contract.pricing_json?.vat_rate || 15) / 100,
          vatAmount: contract.pricing_json?.vat_amount || 0,
          total: contract.pricing_json?.total || 0,
        },
        currency: contract.pricing_json?.currency || 'SAR',
        
        status: contract.status,
        signedAt: contract.signed_at || undefined,
        
        // Admin approval stamp
        adminApprovedAt: contract.admin_approved_at || null,
        
        // Customer signature stamp  
        customerSignedAt: contract.signed_at || null,
        customerSignatureName: signature?.signer_name || profile?.full_name || null,
      };

      const success = await downloadContractPdf(contractData);
      if (!success) throw new Error('Download failed');
      toast.success('تم تنزيل الملف', { id: toastId });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('فشل تنزيل الملف', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" dir="rtl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div dir="rtl">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  خطأ في تحميل العقد
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/portal/contracts')}>
                <ArrowRight className="h-4 w-4 ms-2" />
                العودة للعقود
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[contract.status];
  const StatusIcon = status.icon;

  return (
    <div dir="rtl" className="min-h-full">
      <AnimatedContainer direction="fade">
        <div className="space-y-6">
          {/* Back Button & Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/portal/contracts')}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة
            </Button>

            <div className="flex gap-2">
              {contract.status === 'pending_signature' && (
                <Button
                  onClick={() => navigate(`/portal/contracts/${contract.id}/sign`)}
                  className="gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                >
                  <FileSignature className="h-4 w-4" />
                  توقيع العقد
                </Button>
              )}
              {/* Download button for signed contracts */}
              {contract.status === 'signed' && (
                <Button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  تحميل عقد الخدمة PDF
                </Button>
              )}
              {/* Download button for approved/pending_admin_approval contracts */}
              {(contract.status === 'pending_admin_approval' || contract.status === 'pre_approved_by_customer') && (
                <Button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  variant="outline"
                  className="gap-2 border-teal-500 text-teal-600 hover:bg-teal-50"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  معاينة العقد PDF
                </Button>
              )}
            </div>
          </div>

          {/* Contract Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="text-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.labelAr}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    عقد تقديم خدمات
                  </CardTitle>
                  <CardDescription className="font-mono mt-1" dir="ltr">
                    {contract.contract_number}
                  </CardDescription>
                </div>

                <div className="text-start">
                  <p className="text-3xl font-bold text-primary" dir="ltr">
                    {formatCurrency(
                      contract.pricing_json?.total || 0,
                      contract.pricing_json?.currency || 'SAR'
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    شامل الضريبة
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Parties Information */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* First Party (Company) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  الطرف الأول
                </CardTitle>
              </CardHeader>
              <CardContent className="text-start">
                <p className="font-semibold">شركة علي صالح الشهري القابضة</p>
                <p className="text-sm text-muted-foreground">
                  Ali Saleh Al-Shehri Holding Company
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  المملكة العربية السعودية - الرياض
                </p>
              </CardContent>
            </Card>

            {/* Second Party (Customer) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  الطرف الثاني
                </CardTitle>
              </CardHeader>
              <CardContent className="text-start">
                <p className="font-semibold">
                  {signature?.signer_name || profile?.full_name || '-'}
                </p>
                {profile?.email && (
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {profile.email}
                  </p>
                )}
                {signature?.signer_national_id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    رقم الهوية: <span dir="ltr">{signature.signer_national_id}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Service & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-start">
                تفاصيل العقد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service */}
              {contract.service && (
                <div className="text-start">
                  <Label className="text-muted-foreground">الخدمة</Label>
                  <p className="font-semibold">
                    {contract.service.name_ar || contract.service.name}
                  </p>
                </div>
              )}

              {/* Scope */}
              {(contract.scope_summary_ar || contract.scope_summary) && (
                <div className="text-start">
                  <Label className="text-muted-foreground">نطاق العمل</Label>
                  <p className="text-sm">
                    {contract.scope_summary_ar || contract.scope_summary}
                  </p>
                </div>
              )}

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المبلغ الأساسي</span>
                  <span dir="ltr">
                    {formatCurrency(
                      contract.pricing_json?.subtotal || 0,
                      contract.pricing_json?.currency || 'SAR'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ضريبة القيمة المضافة ({contract.pricing_json?.vat_rate || 15}%)
                  </span>
                  <span dir="ltr">
                    {formatCurrency(
                      contract.pricing_json?.vat_amount || 0,
                      contract.pricing_json?.currency || 'SAR'
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>الإجمالي</span>
                  <span dir="ltr" className="text-primary">
                    {formatCurrency(
                      contract.pricing_json?.total || 0,
                      contract.pricing_json?.currency || 'SAR'
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-start">
                معلومات التوقيع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="text-start">
                    <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                    <p className="font-medium">{formatDate(contract.created_at)}</p>
                  </div>
                </div>

                {contract.signed_at && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div className="text-start">
                      <p className="text-sm text-muted-foreground">تاريخ التوقيع</p>
                      <p className="font-medium">{formatDate(contract.signed_at)}</p>
                    </div>
                  </div>
                )}
              </div>

              {signature && (
                <>
                  <Separator />
                  <div className="text-start">
                    <p className="text-sm text-muted-foreground mb-2">بيانات الموقّع</p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p><strong>الاسم:</strong> {signature.signer_name}</p>
                      {signature.signer_national_id && (
                        <p><strong>رقم الهوية:</strong> <span dir="ltr">{signature.signer_national_id}</span></p>
                      )}
                      {signature.signer_phone && (
                        <p><strong>الجوال:</strong> <span dir="ltr">{signature.signer_phone}</span></p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        طريقة التوقيع: {signature.signature_method === 'checkbox' ? 'موافقة إلكترونية' : signature.signature_method}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      {/* Signing Dialog */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-start">توقيع العقد</DialogTitle>
            <DialogDescription className="text-start">
              يرجى مراجعة تفاصيل العقد والموافقة على الشروط والأحكام
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signerName">الاسم الكامل *</Label>
              <Input
                id="signerName"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="text-start"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">رقم الهوية (اختياري)</Label>
              <Input
                id="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="أدخل رقم الهوية"
                dir="ltr"
                className="text-start"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5XX XXX XXXX"
                dir="ltr"
                className="text-start"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="agreement"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked === true)}
              />
              <label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                أقر أنني قرأت العقد وأوافق على جميع الشروط والأحكام الواردة فيه
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSign}
              disabled={isSigning || !hasAgreed || !signerName.trim()}
            >
              {isSigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ms-2" />
                  جاري التوقيع...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 ms-2" />
                  توقيع العقد
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
