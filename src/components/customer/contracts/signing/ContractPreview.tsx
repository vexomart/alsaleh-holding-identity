/**
 * Contract Preview Step - Shows contract terms before signing
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  User, 
  Scroll, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface ContractPreviewProps {
  contract: {
    contract_number: string;
    service?: { name_ar?: string; name?: string } | null;
    scope_summary_ar?: string | null;
    scope_summary?: string | null;
    pricing_json?: {
      subtotal: number;
      vat_rate: number;
      vat_amount: number;
      total: number;
      currency: string;
    } | null;
    admin_approved_at?: string | null;
  };
  customerName: string;
  onContinue: () => void;
  onCancel: () => void;
}

// Contract Articles for display
const CONTRACT_ARTICLES = [
  {
    id: 1,
    titleAr: 'المادة الأولى: موضوع العقد',
    contentAr: 'يلتزم الطرف الأول بتقديم الخدمة المحددة أعلاه للطرف الثاني وفقاً للمواصفات والمعايير المتفق عليها، ويلتزم الطرف الثاني بسداد المقابل المالي المحدد في هذا العقد.',
  },
  {
    id: 2,
    titleAr: 'المادة الثانية: مدة العقد',
    contentAr: 'يسري هذا العقد من تاريخ التوقيع عليه من الطرفين ولمدة سنة ميلادية واحدة، ويجدد تلقائياً لمدد مماثلة ما لم يخطر أحد الطرفين الآخر برغبته في عدم التجديد قبل انتهاء العقد بثلاثين يوماً على الأقل.',
  },
  {
    id: 3,
    titleAr: 'المادة الثالثة: التزامات الطرف الأول',
    contentAr: 'يلتزم الطرف الأول بتنفيذ الخدمة بالجودة المطلوبة وفي المواعيد المحددة، والحفاظ على سرية المعلومات الخاصة بالطرف الثاني، وتقديم الدعم الفني اللازم خلال فترة سريان العقد.',
  },
  {
    id: 4,
    titleAr: 'المادة الرابعة: التزامات الطرف الثاني',
    contentAr: 'يلتزم الطرف الثاني بسداد المقابل المالي في المواعيد المحددة، وتوفير المعلومات والمستندات اللازمة لتنفيذ الخدمة، والتعاون مع الطرف الأول لإنجاز المهام المطلوبة.',
  },
  {
    id: 5,
    titleAr: 'المادة الخامسة: السرية',
    contentAr: 'يتعهد الطرفان بالحفاظ على سرية جميع المعلومات المتبادلة بينهما بموجب هذا العقد، وعدم الإفصاح عنها لأي طرف ثالث دون موافقة كتابية مسبقة.',
  },
  {
    id: 6,
    titleAr: 'المادة السادسة: إنهاء العقد',
    contentAr: 'يحق لأي من الطرفين إنهاء هذا العقد بإخطار كتابي للطرف الآخر قبل ثلاثين يوماً على الأقل، مع الالتزام بسداد أي مستحقات مالية قائمة.',
  },
  {
    id: 7,
    titleAr: 'المادة السابعة: حل النزاعات',
    contentAr: 'في حال نشوء أي نزاع يتعلق بتفسير أو تنفيذ هذا العقد، يتم حله ودياً بين الطرفين، وفي حال تعذر ذلك يُحال النزاع للجهات القضائية المختصة في المملكة العربية السعودية.',
  },
];

export function ContractPreview({
  contract,
  customerName,
  onContinue,
  onCancel,
}: ContractPreviewProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Parties Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* First Party */}
        <Card className="border-indigo-200 dark:border-indigo-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Building2 className="h-4 w-4" />
              {isRTL ? 'الطرف الأول (مقدم الخدمة)' : 'First Party (Provider)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-foreground">شركة علي صالح الشهري القابضة</p>
            <p className="text-sm text-muted-foreground">Ali Saleh Al-Shehri Holding Company</p>
            <p className="text-sm text-muted-foreground mt-1">المملكة العربية السعودية - الرياض</p>
          </CardContent>
        </Card>

        {/* Second Party */}
        <Card className="border-emerald-200 dark:border-emerald-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <User className="h-4 w-4" />
              {isRTL ? 'الطرف الثاني (العميل)' : 'Second Party (Customer)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-foreground">{customerName || '-'}</p>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'سيتم تأكيد البيانات في الخطوة التالية' : 'Details will be confirmed in next step'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service & Pricing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            {isRTL ? 'تفاصيل الخدمة والتكلفة' : 'Service & Pricing Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{isRTL ? 'الخدمة' : 'Service'}</p>
            <p className="font-semibold">{contract.service?.name_ar || contract.service?.name || '-'}</p>
          </div>
          
          {(contract.scope_summary_ar || contract.scope_summary) && (
            <div>
              <p className="text-sm text-muted-foreground">{isRTL ? 'نطاق العمل' : 'Scope'}</p>
              <p className="text-sm">{contract.scope_summary_ar || contract.scope_summary}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{isRTL ? 'المبلغ الأساسي' : 'Subtotal'}</span>
              <span dir="ltr">{formatCurrency(contract.pricing_json?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {isRTL ? `ضريبة القيمة المضافة (${contract.pricing_json?.vat_rate || 15}%)` : `VAT (${contract.pricing_json?.vat_rate || 15}%)`}
              </span>
              <span dir="ltr">{formatCurrency(contract.pricing_json?.vat_amount || 0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
              <span dir="ltr" className="text-primary">
                {formatCurrency(contract.pricing_json?.total || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Terms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scroll className="h-4 w-4 text-primary" />
            {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-4">
            <div className="space-y-4 text-sm leading-relaxed">
              {CONTRACT_ARTICLES.map((article) => (
                <div key={article.id} className="space-y-1">
                  <h4 className="font-bold text-primary">{article.titleAr}</h4>
                  <p className="text-muted-foreground">{article.contentAr}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agreement Checkbox */}
      <Card className={cn(
        "border-2 transition-colors",
        hasReadTerms ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "border-amber-500"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="read-terms"
              checked={hasReadTerms}
              onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor="read-terms" 
                className="text-sm font-medium cursor-pointer"
              >
                {isRTL 
                  ? 'أقر بأنني قرأت جميع الشروط والأحكام الواردة في هذا العقد وأفهمها تماماً'
                  : 'I confirm that I have read and fully understand all terms and conditions in this contract'}
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL
                  ? 'يرجى قراءة العقد بعناية قبل المتابعة'
                  : 'Please read the contract carefully before proceeding'}
              </p>
            </div>
            {hasReadTerms ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="sm:flex-1"
        >
          {isRTL ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button
          onClick={onContinue}
          disabled={!hasReadTerms}
          className="sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isRTL ? 'متابعة لإدخال البيانات' : 'Continue to Enter Details'}
        </Button>
      </div>
    </motion.div>
  );
}
