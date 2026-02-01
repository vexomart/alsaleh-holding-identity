/**
 * Contract Preview Step - Service Request Flow
 * Shows contract terms before service submission
 * Requires preliminary consent (NOT legal signature)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ContractTemplate, ContractPricing } from '@/hooks/useContracts';
import { cn } from '@/lib/utils';

interface ContractPreviewStepProps {
  template: ContractTemplate;
  serviceName: string;
  serviceNameAr?: string | null;
  price?: number | null;
  currency?: string;
  onAccept: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ContractPreviewStep({
  template,
  serviceName,
  serviceNameAr,
  price,
  currency = 'SAR',
  onAccept,
  onBack,
  isLoading = false,
}: ContractPreviewStepProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [hasAgreed, setHasAgreed] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Calculate pricing
  const subtotal = price || 0;
  const vatRate = 15;
  const vatAmount = Math.round(subtotal * (vatRate / 100) * 100) / 100;
  const total = subtotal + vatAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get template content based on language
  const templateTitle = isRTL ? template.title_ar : (template.title_en || template.title_ar);
  const templateBody = isRTL ? template.body_ar : (template.body_en || template.body_ar);
  const displayServiceName = isRTL ? (serviceNameAr || serviceName) : serviceName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <BackIcon className="h-4 w-4" />
          {isRTL ? 'العودة' : 'Back'}
        </Button>
      </div>

      {/* Main Card */}
      <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <FileSignature className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isRTL ? 'العقد المبدئي' : 'Preliminary Contract'}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRTL 
                    ? 'يرجى مراجعة بنود العقد قبل إتمام الطلب'
                    : 'Please review the contract terms before submitting'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 me-1.5" />
              {isRTL ? 'موافقة مبدئية فقط' : 'Preliminary Only'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Service & Pricing Summary */}
          <div className="p-6 bg-muted/30 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'الخدمة المطلوبة' : 'Requested Service'}
                </p>
                <h3 className="text-lg font-bold mt-1">{displayServiceName}</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-start">
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'المبلغ قبل الضريبة' : 'Subtotal'}
                  </p>
                  <p className="font-semibold" dir="ltr">{formatCurrency(subtotal)}</p>
                </div>
                <div className="text-start">
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? `ضريبة القيمة المضافة (${vatRate}%)` : `VAT (${vatRate}%)`}
                  </p>
                  <p className="font-semibold" dir="ltr">{formatCurrency(vatAmount)}</p>
                </div>
                <div className="text-start">
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الإجمالي' : 'Total'}
                  </p>
                  <p className="text-xl font-bold text-primary" dir="ltr">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-lg">{templateTitle}</h4>
            </div>
            
            <ScrollArea className="h-[300px] rounded-lg border bg-muted/20 p-4">
              <div 
                className="prose prose-sm max-w-none text-foreground"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <div dangerouslySetInnerHTML={{ __html: templateBody.replace(/\n/g, '<br/>') }} />
              </div>
            </ScrollArea>
          </div>

          {/* Key Points */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {isRTL ? 'حماية كاملة' : 'Full Protection'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {isRTL ? 'التوقيع لاحقاً' : 'Sign Later'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'بعد موافقة الإدارة' : 'After admin approval'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <DollarSign className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {isRTL ? 'تسعير شفاف' : 'Transparent Pricing'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'شامل ضريبة القيمة المضافة' : 'VAT included'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Agreement Checkbox */}
          <div className="p-6 bg-muted/20">
            <div className="flex items-start gap-3">
              <Checkbox
                id="contract-agreement"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked === true)}
                className="mt-1"
              />
              <label 
                htmlFor="contract-agreement" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                <span className="font-medium text-foreground">
                  {isRTL 
                    ? 'أقر بمراجعتي لبنود العقد وأوافق مبدئيًا عليها'
                    : 'I confirm that I have reviewed the contract terms and preliminarily agree to them'}
                </span>
                <span className="block text-muted-foreground mt-1">
                  {isRTL 
                    ? 'هذه موافقة مبدئية فقط وليست توقيعًا قانونيًا. سيتم إرسال العقد للتوقيع الرسمي بعد موافقة الإدارة.'
                    : 'This is preliminary consent only, not a legal signature. The contract will be sent for official signature after admin approval.'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                onClick={onAccept}
                disabled={!hasAgreed || isLoading}
                className="flex-1 h-12 text-base font-semibold gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {isRTL ? 'الموافقة وإرسال الطلب' : 'Accept & Submit Request'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="h-12 px-6"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">
            {isRTL ? 'ملاحظة مهمة' : 'Important Notice'}
          </p>
          <p className="mt-1 text-amber-700">
            {isRTL 
              ? 'هذه الموافقة المبدئية لا تعد توقيعًا قانونيًا ولن يتم إنشاء PDF للعقد في هذه المرحلة. سيتم إشعارك عند جاهزية العقد للتوقيع الرسمي بعد موافقة الإدارة.'
              : 'This preliminary approval is not a legal signature and no contract PDF will be generated at this stage. You will be notified when the contract is ready for official signature after admin approval.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
