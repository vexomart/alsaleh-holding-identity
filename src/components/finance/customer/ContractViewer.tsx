/**
 * Contract Viewer - عرض وتوقيع العقد
 * RTL Arabic-first with Framer Motion animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  PenTool,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinanceContract, FinanceOffer, CONTRACT_STATUS_CONFIG } from "@/types/finance";
import { CurrencyDisplay } from "../shared/CurrencyDisplay";
import { toast } from "sonner";

interface ContractViewerProps {
  contract: FinanceContract;
  offer: FinanceOffer;
  canSign?: boolean;
  onSign?: () => Promise<void>;
  isLoading?: boolean;
}

export function ContractViewer({
  contract,
  offer,
  canSign = false,
  onSign,
  isLoading = false,
}: ContractViewerProps) {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const statusConfig = CONTRACT_STATUS_CONFIG[contract.status];
  const isSigned = ["signed_by_customer", "approved_by_admin", "active", "closed"].includes(
    contract.status
  );

  const handleSign = async () => {
    if (!agreed || !onSign) return;
    setSigning(true);
    try {
      await onSign();
      toast.success("تم توقيع العقد بنجاح");
    } catch (error) {
      toast.error("فشل في توقيع العقد");
    } finally {
      setSigning(false);
    }
  };

  const handleDownloadPdf = () => {
    // TODO: Implement PDF download via edge function
    toast.info("جارٍ تحضير ملف PDF...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Contract Header */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">عقد التمويل</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  رقم العقد: {contract.contract_number}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                "px-3 py-1",
                statusConfig.variant === "success" && "bg-green-500/10 text-green-600 border-green-200",
                statusConfig.variant === "warning" && "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                statusConfig.variant === "destructive" && "bg-red-500/10 text-red-600 border-red-200",
                statusConfig.variant === "secondary" && "bg-muted text-muted-foreground"
              )}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contract Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">مبلغ التمويل</p>
              <CurrencyDisplay
                amount={offer.total_payable_sar}
                className="text-lg font-bold text-foreground mt-1"
              />
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">القسط الشهري</p>
              <CurrencyDisplay
                amount={offer.monthly_payment_sar}
                className="text-lg font-bold text-foreground mt-1"
              />
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">معدل الربح</p>
              <p className="text-lg font-bold text-foreground mt-1">
                {offer.apr_percent}%
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">الرسوم</p>
              <CurrencyDisplay
                amount={offer.fees_sar || 0}
                className="text-lg font-bold text-foreground mt-1"
              />
            </div>
          </div>

          {/* Contract Terms (Simplified) */}
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              الشروط والأحكام
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>• يلتزم العميل بسداد الأقساط في مواعيدها المحددة.</p>
              <p>• في حال التأخر عن السداد، يتم احتساب غرامة تأخير حسب النظام.</p>
              <p>• يحق للعميل السداد المبكر مع خصم الأرباح غير المستحقة.</p>
              <p>• يخضع هذا العقد لأنظمة المملكة العربية السعودية.</p>
              <p>• الطرف الأول: شركة علي صالح الشهري القابضة.</p>
            </div>
          </div>

          {/* Signature Status */}
          <AnimatePresence mode="wait">
            {isSigned ? (
              <motion.div
                key="signed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">تم التوقيع</p>
                    <p className="text-sm text-green-600">
                      {contract.signed_at
                        ? `بتاريخ ${new Date(contract.signed_at).toLocaleDateString("ar-SA")}`
                        : ""}
                    </p>
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
                <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-700">في انتظار توقيعك</p>
                    <p className="text-sm text-yellow-600">
                      يرجى قراءة الشروط والموافقة عليها ثم التوقيع
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <Label htmlFor="agree" className="cursor-pointer">
                    أقر بأنني قرأت وفهمت جميع الشروط والأحكام وأوافق عليها
                  </Label>
                </div>

                <Button
                  onClick={handleSign}
                  disabled={!agreed || signing || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {signing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جارٍ التوقيع...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4 ml-2" />
                      توقيع العقد
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-muted/50 border"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    في انتظار صلاحية التوقيع أو موافقة الإدارة
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleDownloadPdf} className="flex-1">
              <Download className="h-4 w-4 ml-2" />
              تحميل PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
