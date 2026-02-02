/**
 * Finance Contract View - عرض عقد التمويل
 * Premium contract display with legal terms and signing capability
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  PenTool,
  Shield,
  Scale,
  Building2,
  User,
  Landmark,
  Calendar,
  Receipt,
  Info,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FinanceContractStatus,
  CONTRACT_STATUS_CONFIG,
  formatCurrencySAR,
  EntityType,
} from "@/types/finance";
import { toast } from "sonner";

interface FinanceContractViewProps {
  contract: {
    id: string;
    contract_number: string;
    status: FinanceContractStatus;
    signed_at?: string | null;
    signed_by_user_id?: string | null;
    pdf_url?: string | null;
    admin_approved_at?: string | null;
  };
  offer: {
    id: string;
    apr_percent: number;
    fees_sar: number | null;
    monthly_payment_sar: number;
    total_payable_sar: number;
  };
  entity: {
    legal_name_ar: string;
    entity_type: EntityType;
    national_id?: string | null;
    cr_number?: string | null;
    phone?: string | null;
    email?: string | null;
    address_ar?: string | null;
  };
  application: {
    amount_sar: number;
    tenor_months: number;
  };
  canSign?: boolean;
  onSign?: () => Promise<void>;
  isLoading?: boolean;
}

export function FinanceContractView({
  contract,
  offer,
  entity,
  application,
  canSign = false,
  onSign,
  isLoading = false,
}: FinanceContractViewProps) {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const statusConfig = CONTRACT_STATUS_CONFIG[contract.status];
  const isSigned = ["signed_by_customer", "approved_by_admin", "active", "closed"].includes(
    contract.status
  );
  const isActive = ["approved_by_admin", "active"].includes(contract.status);

  const handleSign = async () => {
    if (!agreed || !onSign) return;
    setSigning(true);
    try {
      await onSign();
    } catch (error) {
      toast.error("فشل في توقيع العقد");
    } finally {
      setSigning(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      // Use new contract renderer module
      const contractModule = await import('@/lib/contracts/contract-renderer');
      
      // Calculate dates
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setMonth(expiryDate.getMonth() + application.tenor_months);
      
      // Generate installments array
      const installments = Array.from(
        { length: application.tenor_months },
        (_, i) => ({
          installmentNumber: i + 1,
          dueDate: new Date(
            new Date().setMonth(new Date().getMonth() + i + 1)
          ).toISOString(),
          amount: offer.monthly_payment_sar,
          status: 'scheduled' as const,
        })
      );

      // Map entity type to identity type
      const getIdentityType = (entityType: EntityType): 'national_id' | 'commercial_registration' | 'iqama' => {
        switch (entityType) {
          case 'company':
          case 'institution':
            return 'commercial_registration';
          default:
            return 'national_id';
        }
      };

      // Determine contract status
      const getContractStatus = (): 'draft' | 'pending_signature' | 'signed' | 'active' | 'completed' | 'cancelled' => {
        if (contract.status === 'active') return 'active';
        if (contract.status === 'signed_by_customer' || contract.status === 'approved_by_admin') return 'signed';
        if (contract.status === 'generated') return 'pending_signature';
        if (contract.status === 'closed') return 'completed';
        if (contract.status === 'canceled') return 'cancelled';
        return 'draft';
      };
      
      const contractData = {
        contractNumber: contract.contract_number,
        issueDate: now.toISOString(),
        effectiveDate: now.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: getContractStatus(),
        
        // First party (company)
        firstParty: {
          name: 'شركة علي صالح الشهري القابضة',
          identityType: 'commercial_registration' as const,
          identityNumber: '1010123456',
          address: 'الرياض، المملكة العربية السعودية',
          phone: '+966 11 123 4567',
          email: 'info@alshahri-holding.sa',
        },
        
        // Second party (customer)
        secondParty: {
          name: entity.legal_name_ar,
          identityType: getIdentityType(entity.entity_type),
          identityNumber: entity.national_id || entity.cr_number || '',
          address: entity.address_ar || 'المملكة العربية السعودية',
          phone: entity.phone || '',
          email: entity.email || '',
        },
        
        // Financial details
        financials: {
          principalAmount: application.amount_sar,
          aprPercent: offer.apr_percent,
          totalFees: offer.fees_sar || 0,
          tenorMonths: application.tenor_months,
          monthlyPayment: offer.monthly_payment_sar,
          totalPayable: offer.total_payable_sar,
          currency: 'SAR' as const,
        },
        
        fundingPurpose: 'تمويل داخلي لشراء خدمات الشركة',
        paymentSchedule: installments,
        
        // Signatures
        firstPartySignature: {
          signerName: 'شركة علي صالح الشهري القابضة',
          isSigned: !!contract.admin_approved_at,
          signedAt: contract.admin_approved_at || null,
        },
        secondPartySignature: {
          signerName: entity.legal_name_ar,
          isSigned: !!contract.signed_at,
          signedAt: contract.signed_at || null,
        },
      };
      
      // Open contract preview in new window (user can print from there)
      contractModule.previewContract(contractData);
      toast.success("تم فتح العقد في نافذة جديدة - يمكنك طباعته أو حفظه كـ PDF");
    } catch (error) {
      console.error("Contract preview error:", error);
      toast.error("حدث خطأ أثناء فتح العقد");
    } finally {
      setDownloading(false);
    }
  };

  const getEntityIcon = () => {
    switch (entity.entity_type) {
      case "individual":
        return User;
      case "company":
        return Building2;
      case "institution":
        return Landmark;
      default:
        return User;
    }
  };

  const EntityIcon = getEntityIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Contract Header */}
      <Card className="overflow-hidden border-2 border-primary/30">
        <CardHeader className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">عقد التمويل الداخلي</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  رقم العقد: <span className="font-mono">{contract.contract_number}</span>
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                "px-4 py-1.5 text-sm",
                statusConfig?.variant === "success" && "bg-green-500/10 text-green-600 border-green-200",
                statusConfig?.variant === "warning" && "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                statusConfig?.variant === "destructive" && "bg-red-500/10 text-red-600 border-red-200",
                statusConfig?.variant === "secondary" && "bg-muted text-muted-foreground"
              )}
            >
              {statusConfig?.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">الطرف الأول (الممول)</span>
                </div>
                <p className="text-lg font-bold">شركة علي صالح الشهري القابضة</p>
                <p className="text-sm text-muted-foreground mt-1">المملكة العربية السعودية</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <EntityIcon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">الطرف الثاني (العميل)</span>
                </div>
                <p className="text-lg font-bold">{entity.legal_name_ar}</p>
                {entity.national_id && (
                  <p className="text-sm text-muted-foreground mt-1">
                    الهوية: <span dir="ltr">{entity.national_id}</span>
                  </p>
                )}
                {entity.cr_number && (
                  <p className="text-sm text-muted-foreground mt-1">
                    السجل التجاري: <span dir="ltr">{entity.cr_number}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Financial Summary */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              ملخص التمويل
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-b from-primary/10 to-transparent border">
                <p className="text-sm text-muted-foreground mb-1">قيمة التمويل</p>
                <p className="text-lg font-bold">{formatCurrencySAR(application.amount_sar)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-b from-green-500/10 to-transparent border border-green-200">
                <p className="text-sm text-muted-foreground mb-1">القسط الشهري</p>
                <p className="text-lg font-bold text-green-600">{formatCurrencySAR(offer.monthly_payment_sar)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">عدد الأقساط</p>
                <p className="text-lg font-bold">{application.tenor_months} شهر</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">إجمالي السداد</p>
                <p className="text-lg font-bold">{formatCurrencySAR(offer.total_payable_sar)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contract Terms */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              الشروط والأحكام
            </h4>

            {/* Important Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">تنويه هام - طبيعة التمويل</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      هذا التمويل هو <span className="font-bold">تمويل داخلي قانوني</span> مخصص 
                      <span className="font-bold underline"> حصرياً لشراء الخدمات المتاحة عبر الموقع الإلكتروني</span>، 
                      ولا يشمل سحب المبالغ نقداً أو تحويلها لأي غرض آخر. يتم صرف قيمة التمويل مباشرة 
                      لتغطية تكاليف الخدمات المطلوبة من الطرف الثاني.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl border bg-card space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">١.</span>
                يلتزم الطرف الثاني (العميل) بسداد الأقساط الشهرية المحددة في مواعيد استحقاقها.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٢.</span>
                في حالة التأخر عن السداد، يحق للطرف الأول احتساب غرامة تأخير وفقاً للأنظمة المعمول بها.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٣.</span>
                يحق للعميل السداد المبكر للمبالغ المتبقية مع خصم الأرباح غير المستحقة.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٤.</span>
                <span className="font-medium text-foreground">
                  التمويل مخصص فقط لشراء الخدمات عبر الموقع ولا يجوز استخدامه لأي غرض آخر.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٥.</span>
                يقر الطرف الثاني بصحة جميع البيانات المقدمة ويتحمل المسؤولية الكاملة عن أي معلومات غير صحيحة.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٦.</span>
                يخضع هذا العقد لأنظمة وقوانين المملكة العربية السعودية، وتختص المحاكم السعودية بالنظر في أي نزاع ينشأ عنه.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">٧.</span>
                يعتبر هذا العقد سارياً من تاريخ التوقيع عليه من الطرفين.
              </p>
            </div>
          </div>

          <Separator />

          {/* Signature Section */}
          <AnimatePresence mode="wait">
            {isSigned ? (
              <motion.div
                key="signed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-gradient-to-l from-green-500/20 to-green-500/5 border-2 border-green-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">تم توقيع العقد بنجاح</p>
                    <p className="text-sm text-green-600">
                      {contract.signed_at
                        ? `بتاريخ ${new Date(contract.signed_at).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}`
                        : ""}
                    </p>
                    {isActive && (
                      <Badge className="mt-2 bg-green-600">العقد نشط - يمكنك استخدام التمويل الآن</Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : canSign ? (
              <motion.div
                key="sign-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-700">في انتظار توقيعك</p>
                    <p className="text-sm text-yellow-600">
                      يرجى قراءة الشروط والأحكام بعناية ثم الموافقة والتوقيع
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed">
                  <Checkbox
                    id="agree-contract"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="agree-contract" className="cursor-pointer leading-relaxed">
                    أقر بأنني قرأت وفهمت جميع الشروط والأحكام الواردة في هذا العقد، 
                    وأوافق على أن التمويل مخصص حصرياً لشراء الخدمات من الموقع الإلكتروني.
                  </Label>
                </div>

                <Button
                  onClick={handleSign}
                  disabled={!agreed || signing || isLoading}
                  className="w-full h-14 text-lg"
                  size="lg"
                >
                  {signing || isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin ml-2" />
                      جارٍ التوقيع...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-5 w-5 ml-2" />
                      توقيع العقد إلكترونياً
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-muted/50 border"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    في انتظار موافقة الإدارة على العقد
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Download Button - Show after signing */}
          {isSigned && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex-1 h-12"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جارٍ التحميل...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 ml-2" />
                    تحميل نسخة PDF من العقد
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
