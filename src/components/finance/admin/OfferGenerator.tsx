/**
 * Offer Generator - مولد العروض
 * Admin component to generate finance offers for approved applications
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  TrendingUp,
  Percent,
  Calculator,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { formatCurrencySAR } from "@/types/finance";

interface OfferGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    id: string;
    application_number: string;
    amount_sar: number;
    tenor_months: number;
    entity?: {
      legal_name_ar: string;
    };
  } | null;
}

export function OfferGenerator({ open, onOpenChange, application }: OfferGeneratorProps) {
  const queryClient = useQueryClient();
  const [aprPercent, setAprPercent] = useState(15);
  const [feesSar, setFeesSar] = useState(0);

  // Calculate offer values
  const totalInterest = application
    ? (application.amount_sar * aprPercent * application.tenor_months) / (12 * 100)
    : 0;
  const totalPayable = application ? application.amount_sar + totalInterest + feesSar : 0;
  const monthlyPayment = application ? totalPayable / application.tenor_months : 0;

  const createOfferMutation = useMutation({
    mutationFn: async () => {
      if (!application) throw new Error("No application selected");

      const { data, error } = await supabase
        .from("finance_offers")
        .insert({
          application_id: application.id,
          apr_percent: aprPercent,
          fees_sar: feesSar,
          monthly_payment_sar: Math.round(monthlyPayment * 100) / 100,
          total_payable_sar: Math.round(totalPayable * 100) / 100,
          offer_status: "active",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select()
        .single();

      if (error) throw error;

      // Update application status to approved
      await supabase
        .from("finance_applications")
        .update({
          status: "approved",
          decided_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      return data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء العرض بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-finance-applications"] });
      onOpenChange(false);
      // Reset form
      setAprPercent(15);
      setFeesSar(0);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إنشاء العرض");
    },
  });

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            إنشاء عرض تمويل
          </DialogTitle>
          <DialogDescription>
            إنشاء عرض للطلب {application.application_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Application Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">الكيان</p>
                  <p className="font-semibold">{application.entity?.legal_name_ar}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المبلغ المطلوب</p>
                  <p className="font-semibold" dir="ltr">
                    {formatCurrencySAR(application.amount_sar)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">مدة السداد</p>
                  <p className="font-semibold">{application.tenor_months} شهر</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* APR Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                نسبة الربح السنوية (APR)
              </Label>
              <span className="font-bold text-primary">{aprPercent}%</span>
            </div>
            <Slider
              value={[aprPercent]}
              onValueChange={(v) => setAprPercent(v[0])}
              min={5}
              max={30}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Fees Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              رسوم إدارية (ر.س)
            </Label>
            <Input
              type="number"
              value={feesSar}
              onChange={(e) => setFeesSar(Number(e.target.value))}
              min={0}
              step={100}
              className="text-left"
              dir="ltr"
            />
          </div>

          {/* Calculated Values */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Card className="bg-gradient-to-l from-green-500/10 to-transparent border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">تفاصيل العرض</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">إجمالي الربح</p>
                    <p className="font-semibold" dir="ltr">
                      {formatCurrencySAR(totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الرسوم</p>
                    <p className="font-semibold" dir="ltr">
                      {formatCurrencySAR(feesSar)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">إجمالي السداد</p>
                    <p className="font-bold text-lg" dir="ltr">
                      {formatCurrencySAR(totalPayable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">القسط الشهري</p>
                    <p className="font-bold text-lg text-green-600" dir="ltr">
                      {formatCurrencySAR(monthlyPayment)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter className="flex-row-reverse gap-2">
          <Button
            onClick={() => createOfferMutation.mutate()}
            disabled={createOfferMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {createOfferMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <CheckCircle className="h-4 w-4 ml-2" />
            )}
            إنشاء العرض
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
