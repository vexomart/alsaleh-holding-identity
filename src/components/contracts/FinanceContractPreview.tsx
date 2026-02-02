/**
 * Finance Contract Preview Component
 * مكون معاينة عقد التمويل
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Download, Eye, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import {
  FinanceContractData,
  ContractValidationResult,
  renderContractHTML,
  printContract,
  previewContract,
  downloadContractHTML,
  validateContract,
} from '@/lib/contracts/contract-renderer';

interface ContractPreviewProps {
  data: FinanceContractData;
  onValidationComplete?: (result: ContractValidationResult) => void;
}

export function FinanceContractPreview({ data, onValidationComplete }: ContractPreviewProps) {
  const [validation, setValidation] = useState<ContractValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Render preview in iframe
    if (iframeRef.current) {
      const html = renderContractHTML(data, { previewMode: true });
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [data]);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateContract(data);
      setValidation(result);
      onValidationComplete?.(result);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrint = () => {
    printContract(data);
  };

  const handlePreview = () => {
    previewContract(data);
  };

  const handleDownload = () => {
    downloadContractHTML(data);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Actions Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            معاينة عقد التمويل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePrint} variant="default" className="gap-2">
              <Printer className="w-4 h-4" />
              طباعة
            </Button>
            <Button onClick={handlePreview} variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              معاينة في نافذة جديدة
            </Button>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              تحميل HTML
            </Button>
            <Button
              onClick={handleValidate}
              variant="secondary"
              disabled={isValidating}
              className="gap-2"
            >
              {isValidating ? (
                <span className="animate-spin">⏳</span>
              ) : validation?.isValid ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : validation ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              تحقق من العقد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validation && (
        <Card className={validation.isValid ? 'border-emerald-500' : 'border-destructive'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {validation.isValid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">جميع الفحوصات ناجحة</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">يوجد مشاكل تحتاج للمعالجة</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">عدد الصفحات المتوقع:</p>
                <p className="text-muted-foreground">{validation.pageCount} صفحات</p>
              </div>
              <div>
                <p className="font-medium mb-1">تجاوز الحدود:</p>
                <p className={validation.hasOverflow ? 'text-destructive' : 'text-emerald-600'}>
                  {validation.hasOverflow ? 'يوجد تجاوز' : 'لا يوجد'}
                </p>
              </div>
            </div>
            {validation.errors.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-destructive mb-1">أخطاء:</p>
                <ul className="list-disc list-inside text-destructive text-xs">
                  {validation.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-amber-600 mb-1">تحذيرات:</p>
                <ul className="list-disc list-inside text-amber-600 text-xs">
                  {validation.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Iframe */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted p-4">
            <iframe
              ref={iframeRef}
              className="w-full bg-background shadow-lg mx-auto"
              style={{
                height: '800px',
                maxWidth: '210mm',
                border: 'none',
              }}
              title="معاينة العقد"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinanceContractPreview;
